---
name: projects
description: Work on portfolio project pages — projects/<slug>/ pages, the projects gallery, and their images built from ../project-originals/. Use for /projects, or any request about a project page, gallery card, or project image.
argument-hint: "[project slug and what to change]"
---

# /projects — portfolio workspace

Work in `projects/<slug>/`, `assets/img/projects/<image folder>/`, and `../project-originals/<slug>/`.

1. Read `projects/CLAUDE.md` for page structure, and `../project-originals/README.md` for the folder rules and the slug → image-folder table.
2. Task: $ARGUMENTS — ask which project and what to change if this is empty.
3. Encode images from the originals with the tools listed in the root `CLAUDE.md`; run `build_thumbs.py` after changing a card image.
4. Preview with `py _local/dev-server.py` before reporting done.
