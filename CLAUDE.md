# zihao-site

Repo layout:
- _local/ — committed backup; unlinked, never on the live site.
- assets/css/site.css — shared styles. assets/js/site.js — nav active-state by URL.
- assets/deck/ — deck.{css,js} = slide-deck layout system + carousel controller; deck-spec.md = the
  spec for both (source of truth, edit it here). Shared by
  teaching/<course>/lectures/ and talks/<topic>/. (Was teaching/_shared/ until talks/ started
  using it too.) Mirror path changes into ../course-prep.
- projects/, publications/, index.html (About) — complete.
- assets/cv/Zihao_Zhang_CV.pdf — public CV download, built from _local/cv/external_cv.md
  by _local/cv/build_external_pdf.py. Linked from index.html.
- teaching/laar61400/ — factory output of ../course-prep.
- talks/ — factory output of ../lecture-factory; deck modules + gallery.
- CNAME.

Factory output (teaching/<course>/, talks/<topic>/, incl. their assets/img/ & slides/): written one-way into this repo by sibling factories under ../ (../course-prep, ../lecture-factory). This repo is the source of truth — no mirror exists. Author new content in the factory; fix existing output here directly (a rebuild reads from here). Only touch the factory for a general convention future builds should follow.

talks/ modules: each a deck page in its own subfolder, index.html + slides/ WebP. Modules use the
shared deck system and carry site chrome, same as lecture pages — spec in assets/deck/deck-spec.md.
Don't hand-edit modules — regenerate from the factory.

Architecture: hand-authored static HTML, served as-is from main/root via .nojekyll — keep it. Shared chrome (head, nav, wrappers) is duplicated per page by design; propagate nav edits across pages with sed.

Tooling (all in `_local/` — committed, never served; check here before writing a new script):
- `tools/build_thumbs.py` — rebuild the projects-gallery thumbnails into `assets/img/thumbs/`
  and repoint `projects/index.html`. Run after changing a card image. Dry-runs by default;
  `--apply` writes.
- `dev-server.py` — local preview with `Cache-Control: no-store`. Use this over
  `py -m http.server`, which caches CSS hard enough to make a correct page look broken.
- `tools/notes-crypto.py` — encrypt/decrypt the `data-notes-full` presenter notes in decks.
- `cv/build_external_pdf.py` — build the public CV PDF (see the assets/cv line above).

Image standard: AVIF, long edge ≤1920, q65. Web copies live in this repo; keep the
high-quality originals outside it, the way the factories hold lecture and slide sources.
Project images predate this and are still JPEG at ≤1600px — convert from masters, not from
the web copies, which are already lossy. Declare `width`/`height` on every `<img>` (the
`img{height:auto}` guard in site.css keeps the attributes from fighting a CSS width) and
`loading="lazy"` on anything below the fold.

Workflow:
- Find-and-replace across HTML: sed via Bash, not PowerShell (it double-encodes UTF-8).
- ffmpeg available for image work.
