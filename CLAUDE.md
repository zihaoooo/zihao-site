# zihao-site

Repo layout:
- _local/ — committed backup; unlinked, never on the live site.
- assets/css/site.css — shared styles. assets/js/site.js — nav active-state by URL.
- projects/, publications/, index.html (About) — complete.
- teaching/laar61400/ — factory output of ../course-prep.
- talks/ — factory output of ../lecture-factory; slide-viewer modules + gallery.
- CNAME.

Factory output (teaching/<course>/, talks/<topic>/, incl. their assets/img/ & slides/): written one-way into this repo by sibling factories under ../ (../course-prep, ../lecture-factory). This repo is the source of truth — no mirror exists. Author new content in the factory; fix existing output here directly (a rebuild reads from here). Only touch the factory for a general convention future builds should follow.

talks/ modules: each a fullscreen slide app in its own subfolder, index.html + slides/ WebP. Exempt from site chrome; talks/index.html (gallery) is not. Don't hand-edit modules — regenerate from the factory.

Architecture: hand-authored static HTML, served as-is from main/root via .nojekyll — keep it. Shared chrome (head, nav, wrappers) is duplicated per page by design; propagate nav edits across pages with sed.

Workflow:
- Find-and-replace across HTML: sed via Bash, not PowerShell (it double-encodes UTF-8).
- ffmpeg available for image work.
