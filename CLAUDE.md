# zihao-site

Zihao Zhang's portfolio at zihaozhang.cc, for academic peers and committees, students,
practice and public clients, and conference audiences. A visitor should see one research line —
landscape as a product of technology and labor — across a wide range of work: design, art,
computation, writing, teaching. Course materials live in their course repos, drafts and admin in
sibling folders under `../`, and one-time talk demos in the `zihao-demo` org.

## Way of working
General rules are in `~/.claude/CLAUDE.md`. Here:
- Act on your own: fix markup and layout, encode and repoint images, edit page copy, keep `tasks/`.
- Ask first: a new site section or nav change, deleting files, a factory convention change,
  a change to `tokens.css`.
- Ask through multiple-choice options when a choice is mine.
- Preview with `py _local/dev-server.py` and show a screenshot before reporting done.
- Commit each finished change and push it — pushing deploys to the live site.

## Repo layout
- _local/ — committed backup, unlinked from the site but public: GitHub shows it and the live site serves it by URL. Keep it to files fine to share.
- assets/css/tokens.css — every font and UI color as a variable; imported by site.css and the
  course main.css. Pages write var(--…) for every font and UI color (deck-spec.md § Fonts and colors).
- assets/icons/ + root favicon.ico — 朱砂 seal images, built by `_local/tools/build_favicon.py`
  from the wallpaper-maker seal glyphs: tab icon = 篆书 子 on a plain block; seal.png = the
  張子豪 seal closing the nav, after the links (site.css). Every page's head links both icons.
- assets/css/site.css — shared styles. assets/js/site.js — nav active-state by URL.
- assets/deck/ — deck.{css,js} = slide-deck layout system + carousel controller; deck-spec.md = the
  spec for both (source of truth, edit it here). Shared by talks/<topic>/ and the laar61400
  lectures. Mirror path changes into ../course-prep.
- projects/, publications/, index.html (About) — hand-authored.
- assets/cv/Zihao_Zhang_CV.pdf — public CV download (`/cv` skill).
- teaching/index.html — course cards linking to each course's repo in the `landscape-courses`
  GitHub org (Pages at landscape-courses.github.io/<course>/). teaching/laar61400/ is the last
  course hosted here, until Fall 2026 ends; its rules are in its own CLAUDE.md.
- talks/ — factory output of ../lecture-factory; deck modules + gallery.
- tasks/ — one markdown ticket per piece of open work, any size, with Status and Done when.
  Move a finished ticket to tasks/done/.
- .claude/skills/ — workspace shortcuts: `/cv`, `/teach`, `/projects`. Each points to its folder's docs.
- A new kind of page gets its own top-level `/<section>/index.html` with site chrome and a nav
  link on every page.

Factory output (teaching/laar61400/, talks/<topic>/, incl. their assets/img/ & slides/): written one-way into this repo by sibling factories under ../ (../course-prep, ../lecture-factory). This repo is the source of truth. Author new content in the factory; fix existing output here directly (a rebuild reads from here). Touch the factory only for a general convention future builds should follow.

talks/ modules: each a deck page in its own subfolder, index.html + slides/ (bedac is the
outlier — it uses img/ with descriptive names, so the encoder's slides mode skips it; normalize
it to slides/slide_NN on its next rebuild). Modules use the shared deck system and carry site
chrome — spec in assets/deck/deck-spec.md. Regenerate modules from the factory.

Architecture: hand-authored static HTML, served as-is from main/root via .nojekyll — keep it. Shared chrome (head, nav, wrappers) is duplicated per page by design; propagate nav edits across pages with sed.

Tooling (all in `_local/` — committed and public; check here before writing a new script):
- `tools/encode_images.py` — the one encoder, shared by both factories (they call it across
  `../`). `dir` mode = page images, AVIF q65, long edge ≤1920. `slides` mode = talks slides
  only (a module's `slides/` folder), AVIF q80, width ≤1920, and repoints each slide ref in the
  module's index.html. Lecture images are page images and use `dir` mode. `encode_one()` is
  importable for curated names/panoramas.
- `tools/build_favicon.py` — rebuild the seal images (see assets/icons above).
- `tools/build_thumbs.py` — rebuild the projects-gallery thumbnails into `assets/img/thumbs/`
  and repoint `projects/index.html`. Run after changing a card image. Dry-runs by default;
  `--apply` writes.
- `dev-server.py` — local preview with `Cache-Control: no-store`; use it for every preview
  (`py -m http.server` caches CSS and makes a correct page look broken).
- `tools/notes-crypto.py` — encrypt/decrypt the `data-notes-full` presenter notes in decks.
- `cv/build_external_pdf.py` — build the public CV PDF.

Image standard: AVIF everywhere, UI screenshots included — q65 for page images, q80 for talks
slides — long edge ≤1920, encoded by `_local/tools/encode_images.py`. Talks slides published
before the merge are still WebP; they convert on their next factory rebuild. Web copies live in
this repo; keep the high-quality originals outside it, the way the factories hold lecture and
slide sources. Project images are built from the originals in `..\project-originals\`, one folder
per project; its README holds the folder rules. Encode from the originals (the web copies are
already lossy). Declare `width`/`height` on every `<img>` (the `img{height:auto}` guard in
site.css keeps the attributes from fighting a CSS width) and `loading="lazy"` on anything below
the fold.

Workflow:
- Find-and-replace across HTML: sed via Bash (PowerShell double-encodes UTF-8).
- ffmpeg available for image work.
