# zihao-site — Claude Code Context

## Who
Zihao Zhang — Associate Professor, Landscape Architecture, CCNY Spitzer School of Architecture. Website: https://zihaozhang.cc (GitHub Pages, repo root). Email: 2012zhangzihao@gmail.com

## Repo layout
```
zihao-site/
├── _local/              ← gitignored; never pushed (cv/, build-docs/, .claude/skills/)
├── assets/css/site.css  ← all shared styles; classes prefixed site- / project-
├── projects/            ← 7 of 8 built; 1 placeholder remaining
├── publications/
├── teaching/laar61400/
├── index.html           ← About page
└── CNAME
```

## Current status
- About, Publications: complete
- Teaching: LAAR 61400 built; other courses not added yet
- Projects: ELUA, Cyborg Bloom, Flushing, Seed Bomb, Hydroponics, Harlem Schist, East Harlem Polder, Other Natures (`projects/othernatures/`), Shroom Drone (`projects/shroomdrone/`), GH Agent (`projects/ghagent/`) — all 10 complete.

## LAAR 61400 workflows
- WF01 (`wf01-autocad.html`): AutoCAD Site Drafting — complete
- WF02 (`wf02-sketch-portfolio.html`): Hand Sketch → Hybrid Drawing — complete
- WF03 (`wf03-urban-context.html`): Urban Context Mapping — complete
- WF04 (`wf04-landform-design.html`): Rhino Landform Modeling — complete (Weeks 7–8; Rhino + Grasshopper; Patch/Loft; contour plan at 1"=20')
- WF05, WF06: placeholder stubs only (`wf05.html`, `wf06.html`)
- WF07 (`wf07-claude-code-site.html`): Website with Claude Code — complete
- Old `wf04.html` is a dead placeholder stub — can be deleted when convenient

## Project page structure (follow exactly)
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

## CSS gotchas
- Never put `*/` inside a CSS comment — closes comment early, silently drops all rules after

## Seed Bomb special
Full-bleed wildflower PNG outside `#site-wrap`, `margin-top: -25vh; position: relative; z-index: 10`. Parallax: distance-from-bottom trigger; `base = -vh*0.5`, `maxReveal = vh*0.35`, trigger window `vh*0.7`; keep `base + maxReveal` negative.

## CV (`_local/cv/`)
Three files: `master.md` (source of truth), `external_cv.md`, `ccny_cv.md`. Update all three simultaneously. PDFs via `_local/.claude/skills/cv-pdf/SKILL.md`.
- Director MLA: 2024–2026 (not "present"); Interim Director: 2023–2024
- ASLA-NY Climate Action co-chair: 2023–2025
- DOE Climate Lighthouse (~$1M, 2024–2027): Co-PI
- PSC-CUNY grants → "Awards", not "Grants"
- Rejected applications have a dedicated subsection

## Workflow
- HTML is hand-authored; no static site generator
- `_local/` is gitignored — never commit anything from there
- Find-and-replace across HTML: use `sed` via Bash, not PowerShell (`Get-Content`/`Set-Content` double-encodes UTF-8)
