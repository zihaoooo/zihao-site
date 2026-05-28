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
