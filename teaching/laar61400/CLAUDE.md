# LAAR 61400 — teaching context

## Factory output — don't author here
This whole folder is **output of the `../../../course-prep` factory** (lectures, slides, and
their `assets/img/`), but **the live site is the source of truth** — the factory writes HTML +
images one-way into here and keeps no copy. **Default: author new course content in the
factory, not here.** **But fixing existing output here is fine and is the canonical fix:** when
the user asks you to check this output and fix a layout/markup issue, edit it here directly —
there's no mirror in the factory to sync, and a rebuild reads from here. Only update the
factory's style/convention reference if the fix is a general rule future builds should follow.
The notes below document the conventions the factory follows so the output stays consistent.


## Announcements (`announcements.html`)
Hand-authored, not factory output. Weekly housekeeping — newest week first, `.ann-week current`
at top; demote past weeks to a collapsed `<details class="ann-week past">` with a
`<summary class="ann-week-head">`, stacked below newest first. Linked from a
highlighted `.panel-announce` block sitting directly under the brand block in every page's nav
(propagate nav edits with sed, as elsewhere). Styles live at the end of `assets/css/main.css`.

## Workflows (`workflows/`)
- WF01 `wf01-autocad.html` — AutoCAD Site Drafting
- WF02 `wf02-sketch-portfolio.html` — Hybrid Drawing + Layout (Part 1 Photoshop joiner + trace, Part 2 InDesign deck)
- WF03 `wf03-urban-context.html` — Urban Context Mapping
- WF04 `wf04-landform-design.html` — Rhino Landform Modeling
- WF05 `wf05-meadow-parametric.html` — Attractor Fields (Grasshopper meadow)
- WF06 `wf06-slope-analysis.html` — MCP — Claude Inside Rhino (slope analysis exercise)
- WF07 `wf07-claude-code-site.html` — Context Engineering — A Website with Claude Code

WF pages are hand-authored HTML only — the old per-workflow `.md` sources were deleted
(2026-06). Edit the `.html` directly; don't recreate or look for markdown sources.

## WF page conventions
- Layout: `<div class="wf-wrap wf-doc">` (single-column steps, number in the margin, ~64ch text;
  styles at the end of `workflow-shared.css`) and `<script src="…/assets/js/wf-progress.js">` after
  nav.js (done checks that fold a step; state in the student's localStorage). Every step needs a
  `.wf-step-head` to get a check; a `.wf-step` without one is treated as a session divider.
- Weeks and dates live only in the syllabus Weekly Schedule (`index.html`). WF pages carry no week
  numbers: the first spec chip is Length ("2 sessions"), parts are labeled Session 1, Session 2,
  and the Due chip is the one date a WF page repeats. The lecture nav carries no week labels.
- Learning objectives box (`.wf-objectives`): between the spec strip and the assignment; one to three
  short `<li>` phrases, only as many as the workflow really teaches. Each names the idea that transfers
  beyond the software ("How drafting standards encode meaning", "Design as a rule"). The steps
  say what to do; the assignment says what they make.
- Assignment box (`.wf-outcome`): single `<strong>Assignment</strong>` label, one sentence, product-framed, format folded in. No separate Deliverable section.
- Ongoing box (`.wf-ongoing`): optional, directly under the assignment — a semester-long deliverable
  this workflow feeds (e.g. WF02 starts the Final Integrated Drawing Set in InDesign).
- `.wf-outcome > strong` is `display:block` in `workflow-shared.css` — scope to `>` to avoid breaking `<strong>` inside `.wf-tips` list items
- Copy style: match WF07 tone — short, imperative, no AI-sounding parallel structures
- Example images (see WF05): collapsible `<details class="wf-examples">` "Hint" card + a
  click-to-enlarge lightbox (markup + inline script at end of page; styles in `workflow-shared.css`).
  Images live in `assets/img/WF05/`. Use PNG for flat UI/viewport screenshots (compresses smaller
  than JPG); only convert to JPG when it actually wins (e.g. the wide GH-canvas shot). ffmpeg only.
