# PATCHSPEC 01 — Monorepo Restructure
**Apply on top of existing laar61400 build.**
**Do not rebuild anything from scratch. Execute steps in order.**

---

## Context

Current state — existing site at repo root:
```
laar61400/
├── index.html
├── workflows/
├── shortcuts/
├── thumbnails/
└── assets/
    ├── css/
    │   ├── main.css
    │   ├── workflow-shared.css
    │   └── shortcuts-shared.css
    ├── js/
    │   └── nav.js
    └── snippets/
```

Target state — personal site + teaching section:
```
zihao-site/
├── index.html                  ← Personal site: About (placeholder)
├── projects/
│   └── index.html              ← Projects index (placeholder)
├── publications/
│   └── index.html              ← Publications list (placeholder)
├── teaching/
│   ├── index.html              ← Course index / card grid
│   └── laar61400/              ← Existing course site (moved here)
│       ├── index.html
│       ├── workflows/
│       ├── shortcuts/
│       ├── thumbnails/
│       └── assets/             ← Course-local assets (stay here)
│           ├── css/
│           │   ├── main.css
│           │   ├── workflow-shared.css
│           │   └── shortcuts-shared.css
│           ├── js/
│           │   └── nav.js
│           └── snippets/
├── assets/                     ← Personal site shared assets
│   ├── css/
│   │   └── site.css            ← Personal site styles (new)
│   └── js/
│       └── site.js             ← Personal site nav logic (new)
└── README.md
```

**Two separate design systems:**
- Personal site: `assets/css/site.css` — horizontal top nav, clean editorial
- Course sites: `teaching/laar61400/assets/` — existing shell, self-contained, unchanged

---

## Step 1 — Rename repo folder

In terminal, from the directory containing the current repo:

```bash
mv laar61400 zihao-site
cd zihao-site
```

---

## Step 2 — Create new folder structure

```bash
mkdir -p teaching/laar61400
mkdir -p projects
mkdir -p publications
mkdir -p assets/css
mkdir -p assets/js
```

---

## Step 3 — Move existing course files into teaching/laar61400/

```bash
mv index.html teaching/laar61400/
mv workflows teaching/laar61400/
mv shortcuts teaching/laar61400/
mv thumbnails teaching/laar61400/
mv assets teaching/laar61400/
```

Verify the result:
```bash
ls teaching/laar61400/
# Expected: index.html  workflows/  shortcuts/  thumbnails/  assets/
```

---

## Step 4 — Update asset paths in all course HTML files

All course pages currently reference `/assets/` (root-relative).
After the move, course assets live at `/teaching/laar61400/assets/`.

Run this find-and-replace across all HTML files in the course folder:

```bash
find teaching/laar61400 -name "*.html" -exec sed -i \
  -e 's|href="/assets/css/main.css"|href="/teaching/laar61400/assets/css/main.css"|g' \
  -e 's|href="/assets/css/workflow-shared.css"|href="/teaching/laar61400/assets/css/workflow-shared.css"|g' \
  -e 's|href="/assets/css/shortcuts-shared.css"|href="/teaching/laar61400/assets/css/shortcuts-shared.css"|g' \
  -e 's|src="/assets/js/nav.js"|src="/teaching/laar61400/assets/js/nav.js"|g' \
  {} +
```

---

## Step 5 — Update nav panel hrefs in all course HTML files

```bash
find teaching/laar61400 -name "*.html" -exec sed -i \
  -e 's|href="/index.html"|href="/teaching/laar61400/index.html"|g' \
  -e 's|href="/workflows/|href="/teaching/laar61400/workflows/|g' \
  -e 's|href="/shortcuts/|href="/teaching/laar61400/shortcuts/|g' \
  {} +
```

---

## Step 6 — Verify nav.js active link logic

Open `teaching/laar61400/assets/js/nav.js`.
The active link matcher uses `window.location.pathname` with `endsWith`.
This still works correctly after the path update — no change needed.

---

## Step 7 — Write assets/css/site.css

Personal site stylesheet. Clean, minimal, editorial. Uses system fonts — no external imports.

```css
/* ============================================
   zihao-site — Personal Site Stylesheet
   Namespace: site-
   ============================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #1a1a1a;
  background: #fff;
}

/* ── Top nav ── */
#site-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 32px;
  z-index: 100;
}

.site-nav-name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  color: #1a1a1a;
  margin-right: auto;
}

.site-nav-link {
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  color: #888;
  transition: color 0.15s;
}
.site-nav-link:hover { color: #1a1a1a; }
.site-nav-link.active { color: #1a1a1a; }

/* ── Page shell ── */
#site-main {
  padding-top: 48px;
  min-height: 100vh;
}

.site-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 32px;
}

.site-inner.wide {
  max-width: 1040px;
}

/* ── Section label ── */
.site-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #aaa;
  margin-bottom: 20px;
  display: block;
}

/* ── Page title ── */
.site-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin-bottom: 8px;
  line-height: 1.1;
}

.site-subtitle {
  font-size: 13px;
  color: #888;
  margin-bottom: 40px;
}

/* ── Rule ── */
.site-rule {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 32px 0;
}

/* ── Course card grid (teaching/index.html) ── */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.course-card {
  display: block;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 20px;
  text-decoration: none;
  color: #1a1a1a;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.course-card:hover {
  border-color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.course-card-code {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: #1a1a1a;
  color: #fff;
  padding: 2px 7px;
  border-radius: 3px;
  display: inline-block;
  margin-bottom: 10px;
}

.course-card-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.3;
}

.course-card-meta {
  font-size: 11px;
  color: #888;
}

.course-card.placeholder {
  opacity: 0.4;
  pointer-events: none;
}

/* ── Placeholder page content ── */
.site-placeholder {
  padding: 80px 0;
  color: #bbb;
}
.site-placeholder .site-title { color: #bbb; }

/* ── Footer ── */
#site-footer {
  border-top: 1px solid #e0e0e0;
  padding: 24px 32px;
  font-size: 11px;
  color: #aaa;
  display: flex;
  justify-content: space-between;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  #site-nav { padding: 0 16px; gap: 20px; }
  .site-inner { padding: 40px 16px; }
  .course-grid { grid-template-columns: 1fr; }
  #site-footer { flex-direction: column; gap: 4px; }
}
```

---

## Step 8 — Write assets/js/site.js

```javascript
// Personal site nav — mark active link by current path
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.site-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.startsWith(href) && href !== '/') {
      link.classList.add('active');
    }
    if (href === '/' && (path === '/' || path === '/index.html')) {
      link.classList.add('active');
    }
  });
});
```

---

## Step 9 — HTML shell template for personal site pages

All personal site pages (root index, projects, publications, teaching) share this shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAGE TITLE — Zihao Zhang</title>
  <link rel="stylesheet" href="/assets/css/site.css">
</head>
<body>

  <nav id="site-nav">
    <a class="site-nav-name" href="/">Zihao Zhang</a>
    <a class="site-nav-link" href="/projects/">Projects</a>
    <a class="site-nav-link" href="/publications/">Publications</a>
    <a class="site-nav-link" href="/teaching/">Teaching</a>
  </nav>

  <main id="site-main">
    <div class="site-inner">
      <!-- PAGE CONTENT HERE -->
    </div>
  </main>

  <footer id="site-footer">
    <span>Zihao Zhang</span>
    <span>City College of New York — Spitzer School of Architecture</span>
  </footer>

  <script src="/assets/js/site.js"></script>
</body>
</html>
```

---

## Step 10 — Build index.html (About — root)

Use personal site shell. Content:

```html
<span class="site-label">Associate Professor — Landscape Architecture</span>
<h1 class="site-title">Zihao Zhang</h1>
<p class="site-subtitle">City College of New York<br>Spitzer School of Architecture</p>
<hr class="site-rule">
<p style="color:#aaa; font-size:13px; font-family:'Courier New',monospace;">
  About page — coming soon
</p>
```

---

## Step 11 — Build teaching/index.html (Course Index)

Use personal site shell. `site-inner wide` class on `.site-inner`.

```html
<span class="site-label">Teaching</span>
<h1 class="site-title">Courses</h1>
<p class="site-subtitle">Graduate Program in Landscape Architecture</p>
<hr class="site-rule">

<div class="course-grid">

  <a class="course-card" href="/teaching/laar61400/index.html">
    <span class="course-card-code">LAAR 61400</span>
    <div class="course-card-title">Representation and Computation I</div>
    <div class="course-card-meta">Fall 2026 — Required</div>
  </a>

  <!-- Add new course cards here as they are built -->

</div>
```

---

## Step 12 — Build projects/index.html (Placeholder)

Use personal site shell.

```html
<div class="site-placeholder">
  <span class="site-label">Projects</span>
  <h1 class="site-title">Projects</h1>
  <p style="font-size:13px; margin-top:16px;">Coming soon.</p>
</div>
```

---

## Step 13 — Build publications/index.html (Placeholder)

Use personal site shell.

```html
<div class="site-placeholder">
  <span class="site-label">Publications</span>
  <h1 class="site-title">Publications</h1>
  <p style="font-size:13px; margin-top:16px;">Coming soon.</p>
</div>
```

---

## Step 14 — Update README.md

```markdown
# zihao-site

Personal website — Zihao Zhang
Associate Professor, Landscape Architecture
City College of New York, Spitzer School of Architecture

## Structure
- `/` — About (personal site)
- `/projects/` — Projects index
- `/publications/` — Publications list
- `/teaching/` — Course index
- `/teaching/laar61400/` — LAAR 61400 Representation and Computation I, Fall 2026

## Adding a new course
1. Create `/teaching/laarXXXXX/` following the laar61400 BUILDSPEC
2. Add a course card to `teaching/index.html`

## Design systems
- Personal site: `/assets/css/site.css` — horizontal nav, editorial
- Course sites: `/teaching/laarXXXXX/assets/` — self-contained, topbar + side panel

## Deployment
Static site. Hostinger pulls from `main` branch on GitHub repo `zihao-site`.
No build step — edit and push directly.
```

---

## Step 15 — Update GitHub remote and push

```bash
# Rename GitHub repo to zihao-site via GitHub web UI first, then:
git remote set-url origin https://github.com/[USERNAME]/zihao-site.git

git add .
git commit -m "Restructure: monorepo, laar61400 → teaching/laar61400, personal site scaffold"
git push origin main
```

Update Hostinger deployment to pull from `zihao-site` repo if repo name changed.

---

## Step 16 — Verify checklist

- [ ] `/` → About placeholder with top nav
- [ ] `/projects/` → placeholder
- [ ] `/publications/` → placeholder
- [ ] `/teaching/` → course card grid, LAAR 61400 card visible
- [ ] `/teaching/laar61400/index.html` → syllabus with side panel
- [ ] `/teaching/laar61400/workflows/wf01-autocad.html` → WF01 loads correctly
- [ ] `/teaching/laar61400/shortcuts/adobe.html` → Adobe shortcuts loads correctly
- [ ] Side panel active link highlights on each course page
- [ ] Top nav active link highlights on each personal site page
