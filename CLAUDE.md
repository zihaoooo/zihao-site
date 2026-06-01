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
- Projects: all 6 entries are placeholders — main open task

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
