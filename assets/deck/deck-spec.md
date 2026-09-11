# Deck spec — shared slide-deck layout system

Source of truth for the deck system implemented in `deck.css` + `deck.js` (this folder).
Used by BOTH sections of the site, which differ only in the chrome above the deck:

| Section | Pages | Chrome stylesheet | Built by |
|---|---|---|---|
| Course lectures | `teaching/<course>/lectures/` | `teaching/<course>/assets/css/main.css` (+ `workflow-shared.css`) | `../course-prep` |
| Research talks | `talks/<topic>/` | `assets/css/site.css` | `../lecture-factory` |

Both `<link>` `deck.css` and `<script>` `deck.js` from `/assets/deck/`. Never copy either into a
factory or a page — extend here, and the whole site follows.

## Deck layout system
CSS lives in shared `/assets/deck/deck.css` (one file, all decks) — `<link>` it,
never copy. Markup is uniform: `.slide` + a system class + plain `<figure><img></figure>` cells
(no wrapper divs, no inline styles). Stage is a 16:9 box, except on phones (≤560px) where a
typeset slide gets a taller one so the clamp px floors still fit — deck.css keys that off whether
the showing slide has an `<img>`; captions/credit in data-cap/data-credit.
Choosing: one image → `single`. Multiple → `auto` family when boxes should follow the images (whole,
uncropped); `frame` family (`sq`/bleed grids) to impose a uniform frame and crop into it. Default
`auto` unless images are uniform and a clean crop is wanted. (Spacing, borders, background, gutter
are all in `deck.css`.)

### Single — `single`
One `<img>` directly in the slide, shown whole and centered (contained to stage). Use for any solo
image; always tag `single` (supplies the grid track — a bare `.slide > img` clips a tall image).
Video / drawn SVG go bare in `.slide` (no class): `<iframe>`/`<svg>`, centered & contained.
```html
<div class="slide single" data-cap="…" data-credit="…"><img src="…" alt="…"></div>
```

### Auto — `auto` · `hero-l`/`hero-r` · `auto-rows`
JS (`layoutAuto()` in the page) sizes each `<figure>` to its image's aspect and fits the group to the
stage — every box matches its image, so images read whole. Use for landscapes, maps, drawings, collages, mixed sizes.

| Say | Class | Shape |
|---|---|---|
| images in a row | `auto` | one justified row: shared height, widths by aspect |
| hero + a stack | `hero-l`/`hero-r` | hero (first `<figure>`, left/right) **fills its frame** (cover, cropped) + N (≥2) equal-height cover-cells stacked beside it, composite full-width (a narrower stack image trims slightly) |
| …hero read whole | add `fit` | `hero-l fit`/`hero-r fit` — hero sized to its own aspect (contained, **uncropped**), full height, stack beside it. Use for portrait/vertical heroes where cover would chop top/bottom. Stack cells unchanged. |
| rows of images | `auto-rows` | N justified rows; wrap each row's figures in `<div class="row">` |

```html
<div class="slide auto" data-cap="…" data-credit="…">
  <figure><img …></figure> <figure><img …></figure>
</div>
<div class="slide hero-l" data-cap="…">
  <figure><img …></figure> <figure><img …></figure> <figure><img …></figure>  <!-- hero first -->
</div>
<div class="slide auto-rows" data-cap="…">
  <div class="row"><figure><img …></figure><figure><img …></figure></div>
  <div class="row"><figure><img …></figure><figure><img …></figure></div>
</div>
```

### Frame — `sq` (+12-col spans) · `two-3-3`/`grid-4`
CSS imposes a fixed frame; image fills it (`cover`), cropping to fit — boxes lead, images follow.
- `sq` + 12-col placement — square frames. Page spine is a 12-col grid; place each figure with a
  `c{start}-{end}` span (1-indexed inclusive), e.g. `c2-5`/`c8-11`. For portraits, headshots, logos.
  Add new `c-` classes in deck.css as needed.
- Bleed grids `two-3-3` (two equal) / `grid-4` (2×2) — cells fill the stage edge-to-edge. Use ONLY
  when images are uniform (≈16:9 sets) so the crop reads clean. SVG/drawn slides also use `two-3-3`
  (the JS sizes only `<img>` content).
```html
<div class="slide sq" data-cap="…">
  <figure class="c2-5"><img …></figure> <figure class="c8-11"><img …></figure>
</div>
```

### Points + one image — `points-l`/`points-r`
Split slide: a short key-points panel (heading + ≤4 bullets) beside one image. Use when a single
image underexplains and a few parallel/procedural points crystallize the argument (not for
title/takeaway cards or evocative full-bleed — those stay `single`). `points-l` = text left/image
right; `points-r` = reverse. Image is contained (whole, never cropped) so diagrams survive. Put
`.pts` first in the DOM; image side follows from the class.
```html
<div class="slide points-l" data-cap="…">
  <div class="pts"><h3>optional heading</h3><ul><li>…</li><li>…</li></ul></div>
  <figure><img …></figure>
</div>
```

### Part TOC / agenda divider — `toc`
Recurring section divider that lists the lecture's parts and highlights the one being entered. Drop one
instance at each part transition; give the row for the part being entered `.active` (full opacity +
accent), the rest dim. Each row is a mono `.toc-n` "Part N" label + a `.toc-h` heading. Scales to any
part count. Sits inside the page's typeset `.embed` wrapper (the fit script scales it to the stage); the
`.toc` styles live in shared deck.css — never re-declare per page.
```html
<div class="slide" data-cap="…"><div class="embed"><div class="toc">
  <div class="toc-row active"><span class="toc-n">Part I</span><h2 class="toc-h">…</h2></div>
  <div class="toc-row"><span class="toc-n">Part II</span><h2 class="toc-h">…</h2></div>
</div></div></div>
```

### Multi-column text card — `m7-cols` (page-local, week07)
A typeset card of 2–3 parallel text columns (no images) — e.g. "three types of models",
"plan+section can't / operations are logics". Lives inside the page's `.embed` wrapper (the fit
script scales it). Each `.col` = `<h3>` + optional `.lead` (accent sub-line) + `<ul>` of `<li>`
(mono `+` bullet). Add `m7-cols--split` to center each column's block within its own half/third
while keeping the text left-justified (use for the 2-col "own half" look).
```html
<div class="slide" data-cap="…"><div class="embed">
  <div class="m7-cols m7-cols--split">           <!-- omit --split for snug-centered columns -->
    <div class="col"><h3>…</h3><span class="lead">…</span><ul><li>…</li></ul></div>
    <div class="col">…</div>
  </div>
</div></div>
```
Gotcha — **the fit script never upscales** (`s = Math.min(1, …)`): a card authored at e.g. 980px
stays 980px on a large/fullscreen stage, leaving wide side margins and forcing wraps. Author the
card's natural width wide (`width:min(1280px,96%)`) so it fills big screens; the script only ever
scales *down* on small ones.

### Points + two stacked images, equal width — `points-l` + `.pts-imgs` (page-local, week07)
`points-l` normally takes one `<figure>`; two bare figures land in the same grid column and stack at
*unequal* widths. Wrap them in `.pts-imgs` and put the width on the **wrapper** (not each figure) so
both share it. Stage is `container-type:inline-size`, so size with `cqw` (no `cqh`); pick a width
whose stacked heights still fit the panel — for ~1.1 + ~1.8 aspect images, `38cqw` fits.
```html
<div class="slide points-l" data-cap="…">
  <div class="pts">…</div>
  <div class="pts-imgs">                          <!-- column flex; width:min(100%,38cqw); margin:0 auto -->
    <figure><img …></figure>                     <!-- figure width:100% → both equal -->
    <figure><img …></figure>
  </div>
</div>
```
(All three `m7-*` recipes are page-local inline `<style>` in week07, not yet in shared deck.css —
copy the snippet, or promote to deck.css + a `.pv-deck.*` mirror when a second lecture reuses them.)

Presenter View mirrors these under `.pv-deck.*` in the page's PRESENTER_DOC `<style>` (static, no JS).
When you add/change a class in deck.css, update the matching `.pv-deck.<name>` rule too.
