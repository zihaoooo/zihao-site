"""Build the projects-gallery thumbnails.

The gallery renders every card in a 275x206 box, but shipped the full project
image -- ~30x more pixel data than the page can show. This writes one AVIF per
card into assets/img/thumbs/ and repoints projects/index.html at it.

Sizing: the card box is capped at 277px by #site-wrap's 1200px max-width, so
550px covers a 2x display. Two cards magnify their image with a CSS transform
(scale(2), scale(1.3)), so the cap is per-card: 550 * scale, rounded up.

Downscale only -- the crop/framing stays in CSS (object-fit, object-position,
transform), so thumbnails keep the source aspect and never pre-crop. SVG cards
are left alone.

Run from the repo root:  py _local/tools/build_thumbs.py [--apply]
Without --apply it reports what it would write and changes nothing.
"""
import io, os, re, sys, urllib.parse
from PIL import Image

BOX_W   = 275          # rendered card width, px
DPR     = 2            # target pixel density
QUALITY = 65           # site standard, matches encode_avif.py
OUT     = 'assets/img/thumbs'
PAGE    = 'projects/index.html'

apply_ = '--apply' in sys.argv
# The card's image is usually the anchor's first child, but a few cards wrap it
# in a cropping <div> -- so take the first <img> that follows the anchor.
card_re = re.compile(r'<a class="project-card" href="/projects/([^/"]+)/">.*?(<img\b[^>]*>)', re.S)

src_html = io.open(PAGE, encoding='utf-8', newline='').read()
if apply_:
    os.makedirs(OUT, exist_ok=True)

before = after = 0
edits = []
for slug, tag in card_re.findall(src_html):
    src = urllib.parse.unquote(re.search(r'src="([^"]+)"', tag).group(1))
    if src.lower().endswith('.svg'):
        print('%-14s skip (svg)' % slug); continue
    path = src.lstrip('/')
    if not os.path.isfile(path):
        print('%-14s MISSING %s' % (slug, path)); continue

    scale = 1.0
    sm = re.search(r'transform:\s*scale\(([\d.]+)\)', tag)
    if sm:
        scale = float(sm.group(1))
    target = int(BOX_W * DPR * scale + 0.5)

    with Image.open(path) as im:
        im = im.convert('RGB')
        w, h = im.size
        if w > target:
            im = im.resize((target, round(h * target / w)), Image.LANCZOS)
        dst = os.path.join(OUT, slug + '.avif')
        buf = io.BytesIO()
        im.save(buf, 'AVIF', quality=QUALITY)
        nw, nh = im.size
        if apply_:
            io.open(dst, 'wb').write(buf.getvalue())

    b, a = os.path.getsize(path), buf.tell()
    before += b; after += a
    print('%-14s %5dKB -> %4dKB   %dx%d -> %dx%d%s'
          % (slug, b // 1024, a // 1024, w, h, nw, nh,
             '   scale %.1f' % scale if scale != 1 else ''))

    new_tag = tag.replace(re.search(r'src="([^"]+)"', tag).group(1), '/' + dst.replace(os.sep, '/'))
    new_tag = re.sub(r'\bwidth="\d+"', 'width="%d"' % nw, new_tag)
    new_tag = re.sub(r'\bheight="\d+"', 'height="%d"' % nh, new_tag)
    edits.append((tag, new_tag))

print('\ngallery images: %.2f MB -> %.2f MB  (%d%% smaller)'
      % (before / 1048576, after / 1048576, 100 - 100 * after // before))
if apply_:
    out = src_html
    for old, new in edits:
        out = out.replace(old, new, 1)
    io.open(PAGE, 'w', encoding='utf-8', newline='').write(out)
    print('rewrote %s (%d cards)' % (PAGE, len(edits)))
else:
    print('dry run -- pass --apply to write')
