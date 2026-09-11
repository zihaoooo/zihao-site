#!/usr/bin/env python
"""Encode source images as web-optimized AVIF for the live site.

One encoder for the whole site. Both factories call it rather than keeping
their own -- course-prep encoded lecture images to AVIF q65 while
lecture-factory encoded talk slides to WebP q90, so the site served two
formats at two settings depending on which factory built the page.

AVIF is the site standard. Two presets, because the two jobs differ:

    page   q65, long edge <=1920   article and lecture images
    slide  q80, width    <=1920    deck slides -- projected full screen,
                                   text-heavy, so they carry more quality

Preserves alpha (RGBA); flattens CMYK/other modes to RGB; never upscales.

Three ways to use it:

1. Directory mode -- encode every image in <src>. With an <out> dir given,
   copies land there and sources are untouched (the Desktop-drop flow). With
   no <out>, converts in place and deletes the originals:
       py encode_images.py dir <src> [<out>] [--max 1920] [--q 65]

2. Slides mode -- walk <talks_dir>/<topic>/slides/, encode each slide, and
   repoint that module's index.html at the new filenames:
       py encode_images.py slides ../zihao-site/talks
   Run it on the build output before publishing, so raw PNGs never enter the
   site's git history.

3. Import mode -- for curated output names or a fixed-height panorama:
       from encode_images import encode_one
       encode_one(src, dst)                 # long-edge cap
       encode_one(src, dst, panorama_h=440) # fixed height (scrolls)
"""
import argparse, glob, os, pathlib, re
from PIL import Image

MAX_EDGE = 1920
QUALITY = 65          # page preset
SLIDE_QUALITY = 80    # slide preset
SLIDE_MAX_W = 1920

# Sources we read but never re-encode: already-final, or not raster.
SKIP_EXT = ("avif", "svg")


def encode_one(src, dst, max_edge=MAX_EDGE, q=QUALITY, panorama_h=None, fit_width=False):
    """Encode one image to AVIF. Returns (w, h) of the written file.

    panorama_h: cap height instead of the long edge (scrolls).
    fit_width:  cap width instead of the long edge (slides -- a 16:9 stage is
                width-bound, and a tall slide must not be shrunk to fit).
    """
    im = Image.open(src)
    if im.mode in ("P", "LA"):
        im = im.convert("RGBA")
    elif im.mode not in ("RGB", "RGBA"):
        # AVIF has no CMYK/grayscale path; flatten to RGB. CMYK (Adobe-exported
        # JPEGs) would otherwise produce an undecodable AVIF that breaks on site.
        print(f"  note: {os.path.basename(src)} is {im.mode}; converting to RGB")
        im = im.convert("RGB")
    w, h = im.size
    if panorama_h is not None:                 # scrolls: cap height
        th = panorama_h; tw = round(w * th / h)
    elif fit_width:                            # slides: cap width
        tw = min(max_edge, w); th = round(h * tw / w)
    elif w >= h:
        tw = min(max_edge, w); th = round(h * tw / w)
    else:
        th = min(max_edge, h); tw = round(w * th / h)
    if (tw, th) != (w, h):
        im = im.resize((tw, th), Image.LANCZOS)
    os.makedirs(os.path.dirname(os.path.abspath(dst)), exist_ok=True)
    im.save(dst, quality=q)
    return tw, th


def convert_dir(d, max_edge=MAX_EDGE, q=QUALITY, out=None):
    """Encode every non-AVIF/SVG image in d to .avif.

    out=None: write beside the source and remove the original (in-place).
    out set:  write into out/, leave the source untouched (Desktop-drop flow).
    """
    mp = {}
    for fn in sorted(glob.glob(os.path.join(d, "*"))):
        ext = fn.rsplit(".", 1)[-1].lower()
        if ext in SKIP_EXT or not os.path.isfile(fn):
            continue
        base = os.path.basename(fn).rsplit(".", 1)[0] + ".avif"
        new = os.path.join(out, base) if out else fn.rsplit(".", 1)[0] + ".avif"
        tw, th = encode_one(fn, new, max_edge, q)
        if not out:
            os.remove(fn)
        mp[os.path.basename(fn)] = base
        print(f"{base:28} {tw}x{th}  {os.path.getsize(new)//1024}KB")
    return mp


def convert_slides(talks_dir, max_w=SLIDE_MAX_W, q=SLIDE_QUALITY):
    """Encode each module's slides/ to AVIF and repoint its index.html.

    References are rewritten per filename, not by a blanket extension swap, so
    a non-slide .png elsewhere in the page is left alone.
    """
    talks = pathlib.Path(talks_dir)
    total_before = total_after = 0
    for module in sorted(p for p in talks.iterdir() if p.is_dir()):
        sdir = module / "slides"
        if not sdir.is_dir():
            continue
        renames = {}
        for src in sorted(sdir.iterdir()):
            ext = src.suffix.lstrip(".").lower()
            if ext in SKIP_EXT or not src.is_file():
                continue
            before = src.stat().st_size
            dst = src.with_suffix(".avif")
            tw, th = encode_one(src, dst, max_w, q, fit_width=True)
            after = dst.stat().st_size
            total_before += before; total_after += after
            src.unlink()
            renames[src.name] = dst.name
            print(f"  {src.name:18} {before//1024:5}KB -> {after//1024:5}KB  {tw}x{th}")
        idx = module / "index.html"
        if idx.exists() and renames:
            txt = idx.read_text(encoding="utf-8")
            new = txt
            for old_name, new_name in renames.items():
                new = new.replace(old_name, new_name)
            if new != txt:
                idx.write_text(new, encoding="utf-8")
                print(f"  [rewrote {len(renames)} refs] {idx}")
    if total_before:
        print(f"\nTOTAL {total_before/1048576:.1f} MB -> {total_after/1048576:.1f} MB "
              f"({100*total_after//total_before}% of original)")
    else:
        print("no slides found to encode")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Encode source images as AVIF (site standard).")
    sub = ap.add_subparsers(dest="mode", required=True)

    d = sub.add_parser("dir", help="encode a folder of images (page preset)")
    d.add_argument("dir", help="source folder to read images from")
    d.add_argument("out", nargs="?", help="dest folder (omit = convert in place, delete originals)")
    d.add_argument("--max", type=int, default=MAX_EDGE, help="max long edge px")
    d.add_argument("--q", type=int, default=QUALITY, help="AVIF quality")

    s = sub.add_parser("slides", help="encode deck slides and repoint index.html (slide preset)")
    s.add_argument("talks_dir", help="folder holding <topic>/slides/")
    s.add_argument("--max", type=int, default=SLIDE_MAX_W, help="max width px")
    s.add_argument("--q", type=int, default=SLIDE_QUALITY, help="AVIF quality")

    a = ap.parse_args()
    if a.mode == "dir":
        convert_dir(a.dir, a.max, a.q, a.out)
    else:
        convert_slides(a.talks_dir, a.max, a.q)
