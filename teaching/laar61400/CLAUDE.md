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

## Workflows (`workflows/`)
- WF01 `wf01-autocad.html` — AutoCAD Site Drafting (Weeks 2–3)
- WF02 `wf02-sketch-portfolio.html` — Hand Sketch → Hybrid Drawing (Week 4)
- WF03 `wf03-urban-context.html` — Urban Context Mapping (Week 5)
- WF04 `wf04-landform-design.html` — Rhino Landform Modeling (Weeks 7–8)
- WF05 `wf05-meadow-parametric.html` — Attractor Fields (Grasshopper meadow; Weeks 9–10)
- WF06 `wf06-slope-analysis.html` — Slope Analysis with Python + Claude (Week 11)
- WF07 `wf07-claude-code-site.html` — Website with Claude Code (Weeks 12–13)

WF pages are hand-authored HTML only — the old per-workflow `.md` sources were deleted
(2026-06). Edit the `.html` directly; don't recreate or look for markdown sources.

## WF page conventions
- Spec strip (`.wf-spec`): first chip is always Week/Weeks, derived from syllabus schedule in `index.html`
- Assignment box (`.wf-outcome`): single `<strong>Assignment</strong>` label, one sentence, product-framed, format folded in. No separate Deliverable section.
- `.wf-outcome > strong` is `display:block` in `workflow-shared.css` — scope to `>` to avoid breaking `<strong>` inside `.wf-tips` list items
- Copy style: match WF07 tone — short, imperative, no AI-sounding parallel structures
- Example images (see WF05): collapsible `<details class="wf-examples">` "Hint" card + a
  click-to-enlarge lightbox (markup + inline script at end of page; styles in `workflow-shared.css`).
  Images live in `assets/img/WF05/`. Use PNG for flat UI/viewport screenshots (compresses smaller
  than JPG); only convert to JPG when it actually wins (e.g. the wide GH-canvas shot). ffmpeg only.
