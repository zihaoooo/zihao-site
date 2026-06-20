# BUILDSPEC — LAAR 61400 Course Website
**Static site. No build step. Plain HTML/CSS/JS.**

---

## 1. Project Overview

Student-facing reference website for LAAR 61400 Representation and Computation (CCNY, Fall 2026). Hosts the course syllabus, 7 software workflow guides, and shortcut/reference cheat sheets. Designed to feel like a clean, minimal design publication — not a course portal.

**Deployment:** Static files pushed to GitHub → Hostinger pulls from repo directly.

---

## 2. File & Folder Structure

```
laar61400/
├── index.html                      ← Syllabus (home page)
├── workflows/
│   ├── wf01-autocad.html           ← BUILT — AutoCAD Site Drafting
│   ├── wf02-sketch-portfolio.html  ← BUILT — Hand Sketch → Photoshop → InDesign
│   ├── wf03-urban-context.html     ← BUILT — Urban Context Mapping
│   ├── wf04.html                   ← PLACEHOLDER
│   ├── wf05.html                   ← PLACEHOLDER
│   ├── wf06.html                   ← PLACEHOLDER
│   └── wf07.html                   ← PLACEHOLDER
├── shortcuts/
│   ├── adobe.html                  ← embed adobe_shortcuts_cargo.html snippet
│   ├── autocad.html                ← embed autocad_shortcuts_cargo.html snippet
│   ├── rhino-pipeline.html         ← embed rhino3d_pipeline_cargo.html snippet
│   └── rhino-ui.html               ← embed rhino3d_ui_cargo.html snippet
├── assets/
│   ├── css/
│   │   ├── main.css                ← global layout, topbar, side panel
│   │   ├── workflow-shared.css     ← existing shared workflow CSS (copy verbatim)
│   │   └── shortcuts-shared.css    ← shared shortcut page wrapper CSS (copy verbatim)
│   ├── js/
│   │   └── nav.js                  ← side panel toggle logic
│   └── snippets/                   ← existing Cargo HTML files (copy verbatim)
│       ├── adobe_shortcuts_cargo.html
│       ├── autocad_shortcuts_cargo.html
│       ├── rhino3d_pipeline_cargo.html
│       └── rhino3d_ui_cargo.html
├── thumbnails/                     ← SVG thumbnail cards
│   ├── wf01.svg
│   ├── wf02.svg
│   ├── wf03.svg
│   ├── wf04.svg                    ← placeholder style
│   ├── wf05.svg                    ← placeholder style
│   ├── wf06.svg                    ← placeholder style
│   └── wf07.svg                    ← placeholder style
└── README.md
```

---

## 3. Design System

Carry forward all tokens from `workflow-shared.css`. Do not redefine — extend in main.css only.

| Token | Value |
|---|---|
| Font — body | DM Sans (400, 500, 700) |
| Font — mono | DM Mono (400, 500) |
| Color — ink | `#1a1a1a` |
| Color — muted | `#888` |
| Color — rule | `#e0e0e0` |
| Color — bg | `#ffffff` |
| Color — panel bg | `#f5f3f0` |
| Color — hover bg | `#ede9e4` |
| Border radius | `4px` cards, `6px` panels |
| Side panel width | `260px` |
| Topbar height | `44px` |
| Content max-width | `900px` (720px for syllabus) |

Tool accent colors (for thumbnails and badges):
| Tool | Color |
|---|---|
| AutoCAD | `#E51937` |
| Rhino 3D | `#801010` |
| Photoshop | `#31A8FF` on `#001E36` |
| Illustrator | `#FF9A00` |
| InDesign | `#FF3366` on `#49021F` |
| Grasshopper | `#2a6a2a` |

---

## 4. Layout Architecture

### Shell (all pages share this)

```
┌─────────────────────────────────────────────┐
│  #topbar  (fixed, 44px, black bg)           │
│  [☰]   LAAR 61400                           │
└─────────────────────────────────────────────┘
     ┌──────────────┐ ┌──────────────────────┐
     │  #sidepanel  │ │  #main-content       │
     │  (overlay,   │ │  (scrollable,        │
     │   260px,     │ │   padding-top 44px)  │
     │   left edge) │ │                      │
     └──────────────┘ └──────────────────────┘
```

- `#sidepanel` is a **left overlay** (position: fixed, z-index above content). Closed by default. Opens on hamburger click. Closes on outside-click or Esc.
- Content does NOT shift when panel opens — overlay model, not push model.
- `.panel-overlay` is a full-screen dim layer (`rgba(0,0,0,0.2)`) shown behind the open panel.

### Side Panel — Three Sections

```
#sidepanel
│
├── [COURSE]
│   └── Syllabus → index.html
│
├── [WORKFLOWS]
│   ├── 01  AutoCAD Site Drafting         → workflows/wf01-autocad.html
│   ├── 02  Hand Sketch → Portfolio       → workflows/wf02-sketch-portfolio.html
│   ├── 03  Urban Context Mapping         → workflows/wf03-urban-context.html
│   ├── 04  —                             → workflows/wf04.html  (placeholder)
│   ├── 05  —                             → workflows/wf05.html  (placeholder)
│   ├── 06  —                             → workflows/wf06.html  (placeholder)
│   └── 07  —                             → workflows/wf07.html  (placeholder)
│
└── [SHORTCUTS & REFERENCE]
    ├── Adobe Ps / Ai / Id      → shortcuts/adobe.html
    ├── AutoCAD                 → shortcuts/autocad.html
    ├── Rhino — Pipeline        → shortcuts/rhino-pipeline.html
    └── Rhino — Navigation & UI → shortcuts/rhino-ui.html
```

**Panel typography:**
- Section label: 9px, uppercase, `#aaa`, letter-spacing 0.12em, padding 16px 20px 6px
- Nav link: 13px, `#555`, padding 7px 20px, no underline
- Active link: `#1a1a1a`, border-left `2px solid #1a1a1a`, padding-left 18px
- Workflow number: inline mono 10px `#aaa`, margin-right 8px
- Hover: bg `#ede9e4`
- Placeholder links: color `#aaa`, cursor default, no hover effect

---

## 5. Pages

### 5a. index.html — Syllabus (Home)

Content source: `LAAR_61400_Syllabus_Fall2026_REVISED.docx`

Render as structured HTML. Sections in order:
1. Course header block — number, title, instructor, email, meeting time, location, semester
2. Overview
3. Methodology
4. Course Logistics / Technology — render software list as a clean definition-style grid
5. Educational Goals — simple list
6. Learning Objectives
7. Assignments
8. Course Bibliography — reading list style
9. Weekly Schedule — clean table: Week / Topic / Tools / Deliverable
10. Grading Criteria and grade breakdown
11. Classroom Expectations — wrap each sub-section in `<details>` (policy boilerplate)
12. Support Resources — wrap in `<details>`

Layout: full-width reading column, max-width 720px, centered, padding 40px 32px.
Typography: body 14px, line-height 1.7. Section headers: 11px uppercase `#aaa`, letter-spacing 0.12em, border-top `1px solid #e0e0e0`, padding-top 20px.

---

### 5b. Workflow Pages — Built (3)

Each workflow page embeds one HTML file built with `workflow-shared.css`. The workflow HTML files are standalone — they already include their own `<style>` block using `wf-` classes. Wrap in the site shell and paste content verbatim inside `#main-content > .page-inner`.

**Do not alter the workflow HTML content.**

| File | Workflow HTML source | Title | Badge |
|---|---|---|---|
| `workflows/wf01-autocad.html` | `wf01_cargo.html` | AutoCAD Site Drafting | WF 01 |
| `workflows/wf02-sketch-portfolio.html` | `wf02_cargo.html` | Hand Sketch → Portfolio | WF 02 |
| `workflows/wf03-urban-context.html` | `wf03_cargo.html` | Urban Context Mapping | WF 03 |

The three workflow source files (`wf01_cargo.html`, `wf02_cargo.html`, `wf03_cargo.html`) will be provided separately. Place them in `assets/snippets/` and embed via server-side include or direct paste.

Since this is a static site with no server-side includes, **paste the workflow HTML content directly** into the page body. Do not use `<iframe>` or `fetch()`.

---

### 5c. Workflow Pages — Placeholders (4)

Files: `wf04.html`, `wf05.html`, `wf06.html`, `wf07.html`

Each uses the same placeholder layout inside the site shell:

```html
<div class="wf-placeholder">
  <div class="wf-placeholder-badge">WF 0X</div>
  <h1 class="wf-placeholder-title">Coming Soon</h1>
  <p class="wf-placeholder-sub">This workflow is under development.</p>
</div>
```

Style in main.css:
- `.wf-placeholder`: centered, padding 80px 32px
- `.wf-placeholder-badge`: DM Mono, 11px, `#fff` on `#1a1a1a`, pill shape, display inline-block, margin-bottom 16px
- `.wf-placeholder-title`: 28px, 700, `#1a1a1a`, margin-bottom 8px
- `.wf-placeholder-sub`: 13px, `#888`, DM Mono, uppercase, letter-spacing 0.08em

Badges: WF 04 through WF 07.

---

### 5d. Shortcut Pages (shortcuts/)

Each page wraps one Cargo snippet inside the site shell + `sc-wrap` header layer.
Structure per page: shell → `sc-wrap` (header + course tag) → snippet content → `sc-footer`.

See `shortcuts-page-sample.html` for the exact pattern.

**Do not alter the snippet content or their internal scoped CSS.**

| File | Snippet | sc-icons | sc-title | sc-subtitle |
|---|---|---|---|---|
| `shortcuts/adobe.html` | `adobe_shortcuts_cargo.html` | Ps + Ai + Id | Adobe Creative Cloud | Keyboard Shortcuts — Windows |
| `shortcuts/autocad.html` | `autocad_shortcuts_cargo.html` | CAD | AutoCAD | Command Aliases & Shortcuts |
| `shortcuts/rhino-pipeline.html` | `rhino3d_pipeline_cargo.html` | Rh | Rhino 3D | Modeling Pipeline |
| `shortcuts/rhino-ui.html` | `rhino3d_ui_cargo.html` | Rh | Rhino 3D | Navigation & UI |

Link `shortcuts-shared.css` in `<head>` on all four shortcut pages.

---

## 6. Thumbnail SVGs

One SVG per workflow for future index/grid use. Each: `320×200px` viewBox, dark bg.

**Built workflows — use tool accent colors:**
- WF 01 AutoCAD: accent `#E51937`. Show "AUTOCAD" in large type + red accent bar.
- WF 02 Sketch → Portfolio: accent split — Photoshop blue `#31A8FF` + InDesign pink `#FF3366`. Show pipeline: SCAN → PS → ID.
- WF 03 Urban Context: accent Illustrator `#FF9A00`. Show "URBAN CONTEXT" + OSM → Ai pipeline.

**Placeholder thumbnails (WF 04–07):** `#2a2a2a` bg, `#444` title, diagonal hatching pattern `rgba(255,255,255,0.03)`, "COMING SOON" label in `#555`.

All SVGs in `/thumbnails/`.

---

## 7. CSS — main.css

Write from scratch. Imports DM Sans + DM Mono from Google Fonts (same URL as workflow-shared.css). Must cover:

```css
/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #fff; color: #1a1a1a; }

/* Topbar */
#topbar { position: fixed; top: 0; left: 0; right: 0; height: 44px; background: #1a1a1a;
  display: flex; align-items: center; padding: 0 20px; gap: 14px; z-index: 200; }
#nav-toggle { width: 32px; height: 32px; background: none; border: none; cursor: pointer;
  display: flex; flex-direction: column; justify-content: center; gap: 5px; }
#nav-toggle span { display: block; width: 20px; height: 2px; background: #fff; }
.topbar-title { font-family: 'DM Mono', monospace; font-size: 11px; color: #fff;
  letter-spacing: 0.1em; text-transform: uppercase; }

/* Side panel */
#sidepanel { position: fixed; top: 0; left: 0; bottom: 0; width: 260px;
  background: #f5f3f0; border-right: 1px solid #e0e0e0; z-index: 300;
  transform: translateX(-260px); transition: transform 0.2s ease;
  overflow-y: auto; padding-top: 44px; }
#sidepanel.open { transform: translateX(0); }
.panel-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.2);
  z-index: 250; }
.panel-overlay.visible { display: block; }

/* Panel sections */
.panel-section { padding: 16px 0 8px; border-top: 1px solid #e0e0e0; }
.panel-section:first-child { border-top: none; }
.panel-section-label { font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.12em; color: #aaa; padding: 0 20px 8px; display: block; }
.panel-link { display: block; padding: 7px 20px; font-size: 13px; color: #555;
  text-decoration: none; }
.panel-link:hover { background: #ede9e4; }
.panel-link.active { color: #1a1a1a; border-left: 2px solid #1a1a1a; padding-left: 18px; }
.panel-link.placeholder { color: #bbb; cursor: default; pointer-events: none; }
.panel-link-num { font-family: 'DM Mono', monospace; font-size: 10px; color: #aaa; margin-right: 8px; }

/* Main content */
#main-content { padding-top: 44px; min-height: 100vh; }
.page-inner { max-width: 900px; margin: 0 auto; padding: 40px 32px; }
.page-inner.narrow { max-width: 720px; }

/* Responsive */
@media (max-width: 480px) {
  .page-inner { padding: 24px 16px; }
}
```

---

## 8. JS — nav.js

```javascript
// Single responsibility: panel open/close + active link marking
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('sidepanel');
  const overlay = document.querySelector('.panel-overlay');

  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('visible');
  }
  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('visible');
  }

  toggle.addEventListener('click', () =>
    panel.classList.contains('open') ? closePanel() : openPanel()
  );
  overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  // Mark active link
  const current = window.location.pathname;
  document.querySelectorAll('.panel-link').forEach(link => {
    if (link.getAttribute('href') && current.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
});
```

---

## 9. HTML Shell Template

Every page uses this shell. Swap `<title>`, active link, and `#main-content` body.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAGE TITLE — LAAR 61400</title>
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/workflow-shared.css">
</head>
<body>

  <!-- Topbar -->
  <header id="topbar">
    <button id="nav-toggle" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <span class="topbar-title">LAAR 61400</span>
  </header>

  <!-- Panel overlay -->
  <div class="panel-overlay"></div>

  <!-- Side panel -->
  <nav id="sidepanel">
    <div class="panel-section">
      <span class="panel-section-label">Course</span>
      <a class="panel-link" href="/index.html">Syllabus</a>
    </div>
    <div class="panel-section">
      <span class="panel-section-label">Workflows</span>
      <a class="panel-link" href="/workflows/wf01-autocad.html">
        <span class="panel-link-num">01</span>AutoCAD Site Drafting
      </a>
      <a class="panel-link" href="/workflows/wf02-sketch-portfolio.html">
        <span class="panel-link-num">02</span>Hand Sketch → Portfolio
      </a>
      <a class="panel-link" href="/workflows/wf03-urban-context.html">
        <span class="panel-link-num">03</span>Urban Context Mapping
      </a>
      <a class="panel-link placeholder">
        <span class="panel-link-num">04</span>—
      </a>
      <a class="panel-link placeholder">
        <span class="panel-link-num">05</span>—
      </a>
      <a class="panel-link placeholder">
        <span class="panel-link-num">06</span>—
      </a>
      <a class="panel-link placeholder">
        <span class="panel-link-num">07</span>—
      </a>
    </div>
    <div class="panel-section">
      <span class="panel-section-label">Shortcuts & Reference</span>
      <a class="panel-link" href="/shortcuts/adobe.html">Adobe Ps / Ai / Id</a>
      <a class="panel-link" href="/shortcuts/autocad.html">AutoCAD</a>
      <a class="panel-link" href="/shortcuts/rhino-pipeline.html">Rhino — Pipeline</a>
      <a class="panel-link" href="/shortcuts/rhino-ui.html">Rhino — Navigation & UI</a>
    </div>
  </nav>

  <!-- Main content -->
  <main id="main-content">
    <div class="page-inner">
      <!-- PAGE CONTENT HERE -->
    </div>
  </main>

  <script src="/assets/js/nav.js"></script>
</body>
</html>
```

For the syllabus page, add class `narrow` to `.page-inner`.

---

## 10. Workflow Source Files

The three built workflow HTML files are provided separately and must be placed in `assets/snippets/`:

| Snippet filename | Page it feeds |
|---|---|
| `wf01_cargo.html` | `workflows/wf01-autocad.html` |
| `wf02_cargo.html` | `workflows/wf02-sketch-portfolio.html` |
| `wf03_cargo.html` | `workflows/wf03-urban-context.html` |

Paste each file's full HTML content directly inside `<div class="page-inner">` of the corresponding workflow page. These files use `wf-` classes from `workflow-shared.css` — no modification needed.

---

## 11. Git Setup

```bash
git init
git remote add origin https://github.com/[USERNAME]/laar61400.git
git add .
git commit -m "Initial build — syllabus, 3 workflows, 4 placeholders, shortcuts"
git push -u origin main
```

`.gitignore`:
```
.DS_Store
Thumbs.db
*.swp
```

---

## 12. Build Order for Claude Code

Execute in this sequence:

1. Create full folder structure
2. Copy `workflow-shared.css` verbatim → `assets/css/`
3. Copy 4 shortcut snippet files verbatim → `assets/snippets/`
4. Copy 3 workflow snippet files verbatim → `assets/snippets/` (provided separately)
5. Write `assets/css/main.css`
6. Write `assets/js/nav.js`
7. Build `index.html` (syllabus) using shell template + narrow page-inner
8. Build `workflows/wf01-autocad.html`, `wf02-sketch-portfolio.html`, `wf03-urban-context.html`
9. Build 4 placeholder workflow pages (`wf04` through `wf07`)
10. Build 4 shortcut pages
11. Build 7 thumbnail SVGs
12. Write `README.md`
13. Git init and initial commit

---

## 13. README.md

```markdown
# LAAR 61400 — Representation and Computation
Course website — Fall 2026
City College of New York, Spitzer School of Architecture
Instructor: Zihao Zhang

## Structure
- `/` — Syllabus
- `/workflows/` — 7 workflow guides (3 built, 4 placeholders)
- `/shortcuts/` — Software quick-reference sheets

## Deployment
Static site. Hostinger pulls from `main` branch.
No build step — edit and push directly.
```
