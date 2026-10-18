"""Build the site's seal images, in 朱砂, from the desktop wallpaper's small-seal glyphs.

Glyphs and the 張子豪 seal layout come from ../workflows/wallpaper-maker (seal/ +
themes/yuanshan.py), so the site and the wallpaper share one source. Writes:
  favicon.ico                         16/32/48: 子 (篆书) on a plain 朱砂 block
  assets/icons/apple-touch-icon.png   180, the same 子 block, full bleed
  assets/icons/seal.png               張子豪 白文 seal for the nav, under 张子豪 (site.css)

Usage: py _local/tools/build_favicon.py
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter

SITE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WM = os.path.normpath(os.path.join(SITE, "..", "workflows", "wallpaper-maker"))
sys.path[:0] = [WM, os.path.join(WM, "themes")]
import yuanshan as Y                                      # noqa: E402
RED = tuple(int(c) for c in Y.CINNABAR)

def zi_block(px, radius=.18, size=.74, weight=15):
    """子 in white on a 朱砂 block. size = glyph box / tile, square like the seal's cell;
    weight = stroke growth per 241-px glyph (the seal itself uses 11)."""
    S = px * 8
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, S - 1, S - 1], radius=S * radius, fill=RED)
    g = Y.glyph("zi", S * size, S * size, max(1, int(weight * size * S / 241)) | 1)
    mask = Image.new("L", (S, S), 0)
    mask.paste(g, ((S - g.width) // 2, (S - g.height) // 2))
    im.paste((255, 255, 255, 255), (0, 0), mask)
    return im.resize((px, px), Image.LANCZOS)

def name_seal(px, grain, seed=3):
    """張子豪 白文, worn: speckle + ragged rim cut at `grain` px, then resampled to px."""
    rng = np.random.default_rng(seed)
    red = np.asarray(Image.fromarray((Y.name_seal() * 255).astype(np.uint8))
                     .resize((grain, grain), Image.LANCZOS), float) / 255
    noise = gaussian_filter(rng.uniform(0, 1, (grain, grain)), .8)
    wear = noise < np.quantile(noise, .03)
    cx, cy = np.arange(grain)[None, :], np.arange(grain)[:, None]
    edge = np.minimum(np.minimum(cx + 1, grain - cx), np.minimum(cy + 1, grain - cy))
    wear |= (edge <= max(1, grain // 60)) & (rng.uniform(0, 1, (grain, grain)) < .35)
    rgba = np.zeros((grain, grain, 4))
    rgba[..., :3] = RED
    rgba[..., 3] = red * ~wear * 255
    return Image.fromarray(rgba.astype(np.uint8), "RGBA").resize((px, px), Image.LANCZOS)

if __name__ == "__main__":
    icons = os.path.join(SITE, "assets", "icons")
    os.makedirs(icons, exist_ok=True)
    ico = [zi_block(n) for n in (48, 32, 16)]
    ico[0].save(os.path.join(SITE, "favicon.ico"), append_images=ico[1:],
                sizes=[(48, 48), (32, 32), (16, 16)])
    zi_block(180, radius=0).convert("RGB").save(os.path.join(icons, "apple-touch-icon.png"))
    name_seal(102, 150).save(os.path.join(icons, "seal.png"), optimize=True)   # 3× the 34-px nav size
    print("wrote favicon.ico, assets/icons/apple-touch-icon.png, assets/icons/seal.png")
