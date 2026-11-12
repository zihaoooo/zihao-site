---
name: cv
description: Work on Zihao's CV — the master, external, and CCNY markdown in _local/cv/ and the public PDF download. Use for /cv, or any request to add, edit, or rebuild the CV.
argument-hint: "[what to change]"
---

# /cv — CV workspace

Work in `zihao-site/_local/cv/`. Output: `assets/cv/Zihao_Zhang_CV.pdf`.

1. Read `_local/cv/CLAUDE.md` — file rules, build command, and fixed facts.
2. Task: $ARGUMENTS — ask what to change if this is empty.
3. Apply each change to all three markdown files, then rebuild the PDF per that CLAUDE.md.
