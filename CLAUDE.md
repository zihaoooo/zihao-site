# zihao-site — Claude Code Context

## Who
Zihao Zhang — Associate Professor, Landscape Architecture, CCNY Spitzer School of Architecture. Website: https://zihaozhang.cc (GitHub Pages, repo root). Email: 2012zhangzihao@gmail.com

## Repo layout & status
```
zihao-site/
├── _local/              ← committed as backup; unlinked, never surfaces on the live site (cv/ — see _local/cv/CLAUDE.md)
├── assets/css/site.css  ← all shared styles (see assets/css/CLAUDE.md)
├── assets/js/site.js    ← main-nav active-state by URL (already auto for top-level links)
├── projects/            ← all 10 pages complete (conventions: projects/CLAUDE.md)
├── publications/        ← complete
├── teaching/laar61400/  ← FACTORY OUTPUT (../course-prep); don't hand-edit (see teaching/laar61400/CLAUDE.md)
├── talks/               ← FACTORY OUTPUT (../lecture-factory); slide-viewer modules + gallery (see below)
├── index.html           ← About page, complete
└── CNAME
```

## Scope of this repo — site shell vs. factory output
This repo is the **published output**, not where most content is authored. Split the work:
- **This project handles site-specific things only**: shared chrome/layout, `assets/css` &
  `assets/js`, the About page, `projects/`, `publications/`, nav, and standing up new sections.
- **`teaching/<course>/` and `talks/<topic>/` are factory output** — both the HTML *and* their
  `assets/img/` & `slides/`. They are written **one-way** into this repo by separate factories
  (siblings under `../`): course materials by **`../course-prep`**, research talks by
  **`../lecture-factory`**. **The live site is the source of truth** — the factory generates
  HTML straight into these folders and keeps no copy; it pulls *from* here for reuse and house
  style. **Default: author content in the factory, not here** — that's where new lectures/talks
  come from. **But fixing existing output here is fine and is the canonical fix**: when the user
  asks you to inspect factory output and fix a layout/markup issue, edit the files here directly.
  There is **no mirror in the factory to update** — the fix lives here and a rebuild reads from
  here. Only touch the factory if the fix is a *general convention* future builds should follow,
  in which case update the factory's style/convention reference (not a copy of the output).

## talks/ — research lectures
`talks/` holds research-lecture **slide-viewer modules** (fullscreen slide apps), each in its
own subfolder (`talks/elua/`, `talks/cybernetics/` …) with `index.html` + a `slides/` folder of
WebP images, plus `talks/index.html` (the gallery — standard site nav + `site.css`). These are
**built and published by the separate lecture factory** (`../lecture-factory`),
which writes into this repo **one-way**: the factory reads this site's pages/CSS for house style,
but nothing here depends on the factory. Published modules are pre-built static files (WebP +
HTML), so no build/Python is needed to serve them — `.nojekyll` serves them as-is. The module
viewer is intentionally exempt from site nav/chrome (it's a fullscreen app); only `talks/index.html`
follows site chrome. **Don't hand-edit modules here — regenerate from the factory.**

## Architecture
- **Plain hand-authored static HTML on GitHub Pages. No build step, no SSG.** `.nojekyll`
  is present at root — keep it.
- Shared chrome (head, nav, wrappers) is **duplicated** in each page by design. To change the
  nav across pages, use `sed` (fast, reliable) — do NOT reach for a templating system.
- Decision (2026-06): a full **Jekyll** conversion (`_layouts`/`_includes` single-source nav)
  was built, tested locally, and **deliberately rejected** for this site. Reasons: nav changes
  are rare and a one-shot `sed` already handles them; Jekyll added a Ruby toolchain, a remote
  build that can fail silently, and a new bug class (the github-pages gem renders front-matter-
  less `.md` notes as pages → minima-theme collision). Not worth it for a ~24-page site that
  updates a few times a year. **Don't re-propose an SSG unless the site grows a lot** (several
  courses, weekly updates, or another editor). Ruby 3.3 was left installed at `C:\Ruby33-x64`
  (harmless) in case it's ever revisited.

## Workflow
- Never commit/push without confirming first — preview the change, then ask "ready to commit?"
- After changes, auto-launch localhost preview and say "Preview reloaded." only — no screenshots, no "check this URL" (screenshot only if explicitly asked)
- GitHub: zihaoooo — zihao-site (this repo) and gh-agent
- Find-and-replace across HTML: use `sed` via Bash, not PowerShell (`Get-Content`/`Set-Content` double-encodes UTF-8)
- Image work: ffmpeg available
