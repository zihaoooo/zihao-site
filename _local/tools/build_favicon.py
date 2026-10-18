"""Build the site's tab icon: a 張 small-seal chop (白文) in 朱砂, after the desktop wallpaper's seal.

Glyphs and placement helpers come from ../workflows/wallpaper-maker (seal/ + themes/yuanshan.py),
so the icon and the wallpaper share one source. Writes:
  favicon.ico                         16/32/48, linked from every page and fetched by default
  assets/icons/apple-touch-icon.png   180, opaque white ground

Usage: py _local/tools/build_favicon.py
"""
import os, sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

SITE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WM = os.path.normpath(os.path.join(SITE, "..", "workflows", "wallpaper-maker"))
sys.path[:0] = [WM, os.path.join(WM, "themes")]
import yuanshan as Y                                      # noqa: E402

def zhang(S=600, m=70):
    """張 = 弓 + 長, side by side, full height. Returns red coverage 0–1 (1 = red ground)."""
    ink = Image.new("L", (S, S), 0)
    full = S - 2 * m
    Y.put(ink, Y.glyph("gong", full * .30, full, 19), m, m)
    Y.put(ink, Y.glyph("chang", full * .62, full, 15), m + full * .38, m)
    return 1 - np.asarray(ink, float) / 255

def tile(px, grain, seed=7):
    """RGBA seal at px. Wear (speckle + ragged rim) is cut at `grain` px, then resampled."""
    rng = np.random.default_rng(seed)
    red = np.asarray(Image.fromarray((zhang() * 255).astype(np.uint8))
                     .resize((grain, grain), Image.LANCZOS), float) / 255
    noise = gaussian_filter(rng.uniform(0, 1, (grain, grain)), .8)
    wear = noise < np.quantile(noise, .04)
    cx, cy = np.arange(grain)[None, :], np.arange(grain)[:, None]
    edge = np.minimum(np.minimum(cx + 1, grain - cx), np.minimum(cy + 1, grain - cy))
    wear |= (edge <= max(1, grain // 50)) & (rng.uniform(0, 1, (grain, grain)) < .35)
    rgba = np.zeros((grain, grain, 4))
    rgba[..., :3] = Y.CINNABAR
    rgba[..., 3] = red * ~wear * 255
    return Image.fromarray(rgba.astype(np.uint8), "RGBA").resize((px, px), Image.LANCZOS)

if __name__ == "__main__":
    tile(48, 144).save(os.path.join(SITE, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
    touch = Image.new("RGB", (180, 180), (255, 255, 255))
    seal = tile(150, 120)
    touch.paste(seal, (15, 15), seal)
    os.makedirs(os.path.join(SITE, "assets", "icons"), exist_ok=True)
    touch.save(os.path.join(SITE, "assets", "icons", "apple-touch-icon.png"))
    print("wrote favicon.ico, assets/icons/apple-touch-icon.png")
