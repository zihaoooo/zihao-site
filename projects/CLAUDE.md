# Project pages — conventions

## Page structure (follow exactly)
1. `<a class="project-back" href="/projects/">← Projects</a>` — top of `<main>`, before hero
2. Hero: `<img class="project-hero" ...>` — 16:9, defined in site.css
3. `.project-header`: title, subtitle, `.project-year` (includes OSE pill if applicable)
4. `.project-meta-grid` with `style="grid-template-columns: 1fr;"` — collaborators + any extra sections (Presentation etc.) as separate `<div style="margin-top:20px">` blocks inside
5. `<div class="project-description">` — **text paragraphs only**; has max-width: 580px so never put images inside
6. Images, gallery rows, video — directly in `<main>`, outside `.project-description`
7. Local `<style>#site-main { max-width: 100%; }</style>` on every project page

All shared CSS (hero, meta grid, gallery-row, back link, etc.) is in site.css — no need to redeclare.

## OSE projects
Flushing, Seed Bomb, Harlem Schist, East Harlem Polder. Add `<span class="ose-tag">OSE</span>` to `.project-year` on the page and `.project-meta` on the index card.

## Collaborators
- Single-column meta grid; people only (not orgs); `<span class="role">` for role text
- Shurui Zhang: always link to https://www.design.upenn.edu/people/shurui-zhang, role = "OSE and McHarg Fellow"

## Media
- Gallery rows: `.gallery-row` flex + `style="flex: <aspect-ratio>"` per img
- Masonry: `columns: 2; gap: 8px` on `.gallery`; `width: 100%; margin-bottom: 8px` on imgs
- Lightbox: `<script src="/assets/js/lightbox.js"></script>` before `</body>` — auto-applies to all imgs in `#site-main`
- Video: `<video autoplay loop muted playsinline style="width:100%;display:block;">` — convert GIFs to MP4 rather than embedding GIF
- Image optimization: max 2000px, JPEG q85; never convert PNG→JPG (Zihao does that); use ffmpeg (Python unavailable)
- Zoom crop on thumbnails/heroes: wrap img in `<div style="overflow:hidden;aspect-ratio:...">` and apply `transform:scale()` + `transform-origin` + `object-position` on the img inside. Use when default crop shows wrong part of a portrait image.
