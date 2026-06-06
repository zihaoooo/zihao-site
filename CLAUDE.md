# zihao-site — Claude Code Context

## Who I am
Zihao Zhang — Associate Professor, Landscape Architecture, CCNY Spitzer School of Architecture.
- Website: https://zihaozhang.cc (GitHub Pages, published from repo root)
- Email: 2012zhangzihao@gmail.com

## Repo layout
```
zihao-site/
├── _local/              ← gitignored; never pushed
│   ├── cv/              ← master.md, external_cv.md, ccny_cv.md (live docs), .docx (reference only)
│   ├── build-docs/      ← BUILDSPEC.md, workflow docs
│   └── .claude/skills/  ← user skills (cv-pdf, etc.)
├── assets/
├── projects/            ← 6 placeholder entries — next priority
├── publications/
├── teaching/
│   └── laar61400/       ← LAAR 61400 Fall 2026 lecture module
├── index.html           ← About page
└── CNAME
```

## Current status
- About page: complete
- Publications: complete (verify 2025 book chapter forthcoming status)
- Teaching: LAAR 61400 built; other courses not added yet
- Projects: 6 of 6 built; 2 remaining placeholders in index
  - ELUA: complete
  - Cyborg Bloom: complete
  - Flushing: complete
  - Seed Bomb: complete
  - Hydroponics: complete (`projects/hydroponics/`) — masonry gallery, lightbox
  - Harlem Schist: complete (`projects/harlemschist/`) — OSE, maps, care images

## Project page conventions
- Year + type inline: `<p class="project-year">2024–Ongoing · Land-Based Practice<span class="ose-tag">OSE</span></p>`
- OSE tag: light outlined pill (border: 1px solid #ccc; color: #aaa) — defined globally in site.css
- OSE projects: Flushing, Seed Bomb, Harlem Schist (and future OSE work)
- Collaborators: single-column grid, people only (not orgs), org links in role description
- `#site-main { max-width: 100%; }` on all project pages (full-width media) — keep per-page, not global (would break about/publications)
- Hero image: `width: 100%; aspect-ratio: 16/9; object-fit: cover;` — defined in site.css globally
- OSE tag also appears on project cards in `projects/index.html`
- Projects index grid: 3 columns desktop, 1 column mobile (`@media max-width: 700px`); `#site-main { max-width: 100%; }` also on index
- Justified gallery rows: `.gallery-row` flex + `style="flex: <aspect-ratio>"` per img
- Masonry gallery: `columns: 2; gap: 8px` on `.gallery`, `width: 100%; margin-bottom: 8px` on imgs — no cropping, natural proportions
- Lightbox: add `<script src="/assets/js/lightbox.js"></script>` before `</body>` — auto-applies to all `img` in `#site-main`; CSS already in `site.css`. See `projects/seedbomb/` or `projects/flushing/` as templates.
- Global link style: `a { color: #b94030; text-decoration: none; }` — brick red, no underline
- Collaborator list links (`project-meta-list a`): inherit color (no red), turn red on hover — defined globally in site.css
- Teaching workflow pages use `.wf-wrap` which overrides link color to inherit
- Shurui Zhang: always link to https://www.design.upenn.edu/people/shurui-zhang, role = "OSE and McHarg Fellow"
- All shared project page CSS (hero, meta grid, media grids, gallery-row, back link) lives in site.css — individual pages only need `#site-main { max-width: 100%; }` plus truly page-specific styles

## Image optimization
- Target max dimension: **2000px** (not 1600px — too aggressive)
- Resize JPGs only; **never convert PNG → JPG** (Zihao handles that himself)
- Resize in-place at JPEG quality 85

## Seed Bomb page — special design notes
- `projects/seedbomb/index.html`
- Full-bleed wildflower PNG (`assets/img/projects/Seed Bomb/flowercolalge_bottom.png`) placed **outside `#site-wrap`** as last element before `</body>`, with `margin-top: -25vh; position: relative; z-index: 10` — intentionally crosses the nav sidebar (subversive design)
- JS parallax: flowers slide up as user approaches page bottom; trigger anchored to distance from page bottom (`scrollHeight - scrollY - vh`), not video position. `base = -vh * 0.5`, `maxReveal = vh * 0.35`, trigger window `vh * 0.7`. Keep `base + maxReveal` negative to avoid circular scrollHeight dependency.

## CV system (`_local/cv/`)
Three live Markdown files:
- `master.md` — single source of truth
- `external_cv.md` — streamlined external version
- `ccny_cv.md` — rigid CCNY promotion/tenure format

Update all three simultaneously when adding new entries. PDFs generated via `_local/.claude/skills/cv-pdf/SKILL.md`.

### Key CV facts (don't get these wrong)
- Director, MLA Program: **2024–2026** (not "present")
- Interim Director, MLA Program: **2023–2024**
- ASLA-NY Climate Action Committee co-chair: **2023–2025**
- DOE Climate Lighthouse grant (~$1M, 2024–2027): Zihao is **Co-PI**
- PSC-CUNY grants go under **"Awards"**, not "Grants"
- Rejected applications have a **dedicated subsection**

## Workflow
- All web edits pushed to GitHub via Claude Code
- `_local/` is gitignored — never commit or push anything from there
- Site HTML is hand-authored (no static site generator)
