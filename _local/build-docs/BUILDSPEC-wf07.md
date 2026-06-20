# BUILDSPEC — WF07: Build a Personal Website with Claude Code

## Goal
Build a new course workflow page (WF07) for the LAAR 61400 site from the content
source `wf-claude-code-site.md`, matching the existing `wf-` design system, and
publish it as a live page.

## Inputs
- **Content source:** `wf-claude-code-site.md` (provided alongside this spec)
- **Design system:** existing `workflow-shared.css` (namespace `wf-`), already in the repo
- **Reference pages:** existing WF01–WF03 HTML page sections — match their structure exactly

## Output
- A new workflow page section: `wf07_claude_code_site.html` (or the repo's existing
  workflow-file naming convention — match WF01–WF03)
- Placed in the course site shell at `/teaching/laar61400/`, consistent with WF01–WF03
- Added to the side panel nav under **Workflows** as item **07**

## Build instructions

### 1. Translate the content MD into `wf-` HTML
Map each section of `wf-claude-code-site.md` onto the existing components. The MD has
inline HTML comments marking the intended component for every block. Follow them.

- Page header → `wf-header` with `wf-index` = `WF07`, `wf-title`, `wf-subtitle`
- Outcome block → `wf-outcome` bar
- Pipeline → `wf-pipeline` strip; nodes in order with `wf-pipe-arrow` between them
- Steps → `wf-steps` grid of `wf-step` cards; Step 0 is full-width (`wf-step wf-full`)
- Each step → `wf-step-num`, `wf-step-label`, optional `wf-badge`, `wf-step-body`
  containing `wf-step-desc` paragraphs, `wf-tips` lists, and `wf-note` lines
- Two explainers (What is Git / Chat vs. Code) → styled note boxes, visually distinct
  from the step cards
- Footer → `wf-footer`: left `LAAR 61400 · Representation + Computation I`, right `WF07`

Do **not** invent new layout patterns. Reuse what WF01–WF03 already do.

### 2. Add two new badge classes to `workflow-shared.css`
Append to the existing tool-badge block (do not modify existing badges). These are a
shared warm-clay hue family signaling the Chat/Code pair — deliberately distinct from
the tool accents:

```css
.wf-badge-chat { background: #f3ece4; color: #9a6a3c; }
.wf-badge-code { background: #ebdcc9; color: #7a4a1e; }
```

Apply them as follows:
- Step 2 (Write the Spec in Claude Chat) → `wf-badge-chat`, label `CHAT`
- Step 3 (Build in Claude Code) → `wf-badge-code`, label `CODE`
- Steps 4 and 5 badges → existing `wf-badge-neutral`, labels `localhost` and `GitHub`
- Steps 0, 1, 6 → no badge

In the pipeline strip, render the `Claude Chat` and `Claude Code` nodes using the same
two clay colors (chat lighter, code deeper) so the pair reads consistently between the
strip and the step cards. The `localhost` and `GitHub` pipeline nodes stay as
`wf-pipe-tool` (white) nodes.

### 3. Verify against the design system
- All `strong`, `b`, `em` inside step bodies must inherit font-size (already handled by
  `workflow-shared.css` — just don't override it).
- `wf-wrap` stays `max-width: 900px; margin: 0 auto; padding: 28px` — do not add a
  per-page padding override.
- Check the responsive behavior matches WF01–WF03 (tablet 1-col steps, phone padding).

### 4. Preview
Start a local server and confirm the page renders correctly before pushing:
`py -m http.server 8000` (use the `py` launcher on this machine, not `python`), then
open `localhost:8000` at the WF07 page path.

### 5. Publish
- Commit the new page, the nav update, and the `workflow-shared.css` badge additions.
- Push to the GitHub repo.
- Confirm the live page appears at its `/teaching/laar61400/` path once Pages/Hostinger
  redeploys.

## Notes
- This page replaces the former AI image-generation (Nano Banana sketch-to-render)
  content as the AI/agent workflow for the course.
- Keep all student-facing copy exactly as written in the content MD. The MD's reasoning
  about Pattern B, design control, etc. is in author comments only — none of it is
  student-facing and none should appear on the page.
