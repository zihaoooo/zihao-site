---
name: deck-edit
description: Launch the local visual editor for a teaching deck, and apply the change-log JSON it produces back into the source HTML. Use when the user says "edit deck", "/deck-edit", wants to visually adjust a lecture's slides (captions, notes, text, positioned boxes, layout, images), or pastes a deck-editor change log to apply.
---

# Deck edit — visual adjustment round-trip

Two jobs, chosen by what the user gives you:

- **A bare invocation / a page reference** (e.g. `/deck-edit week04`) → **launch** the editor.
- **A pasted JSON change log** (`{ "page": "...", "changes": [...] }`) → **apply** it to the source HTML.

The editor itself is `_local/deck-editor.js`. It never writes
files — it records edits as a JSON log the user copies. This skill is the launch + apply wrapper.
Layout system: `assets/deck/deck-spec.md`.

## Resolve the target page
Lecture pages live in `teaching/laar61400/lectures/`. Accept a week number (`week04`,
`4`, `04`), a slug, or a full path. Glob `week<NN>-*.html` to get the exact file. If ambiguous or
missing, list the lecture files and ask which one.

## Job A — launch
The user edits in their OWN browser, so launch a real local server (not the preview browser) and
open the page there. Use the no-cache dev server — it serves `Cache-Control: no-store` so a fresh
`deck.js` is always loaded and the `?edit` auto-loader fires reliably (plain `npx serve` / cached
`deck.js` silently skips the loader).

1. Start the server from the repo root: `py _local/dev-server.py 8137` (background it). Port 8137 by default — pass another if taken.
2. Build the URL: `http://localhost:8137/teaching/laar61400/lectures/<file>?edit`
3. Open it in the user's browser: `Start-Process "<url>"` via PowerShell.
4. Tell the user: the toolbar loads automatically (`?edit` + localhost trigger the loader in
   `deck.js`). Edit visually, then click **Copy changes** and paste the JSON back here to apply.

## Job B — apply a change log
Read the `page` field to find the source `.html`. Read it. Slides are the `<div class="slide …">`
elements inside `#deck-stage`, in document order; `change.slide` is the 0-based index, and
`change.slideCap` (a snippet of the caption) is there to confirm you've got the right one. For each
change, apply by `op`:

- **`text`** — set the attribute on slide N: `field` `cap`→`data-cap`, `credit`→`data-credit`,
  `notes`→`data-notes`. Replace the attribute value with `value` (HTML-escape `"` as needed).
- **`html`** — the element at `selector` (a CSS path within the slide); replace its inner HTML with
  `value`. Locate it structurally; don't trust the selector blindly if the markup is hand-formatted.
- **`class`** — swap the slide's layout class from `from` to `to` (keep the leading `slide` and any
  `on`). Per `assets/deck/deck-spec.md`, some layouts need wrapper markup (`auto-rows` → `.row` divs); if `to`
  needs structure the slide lacks, fix the markup too, don't just rename.
- **`box`** — update the CSS rule that positions this element. `selector` ends in the element's
  classes (e.g. `…gd-mock__el.e1` inside `.al-bad`); find the matching rule in the page `<style>`
  (e.g. `.al-bad .e1{…}`) and set `top`/`left`/`width`/`height` from `style`. If no rule keys it
  cleanly, add an inline `style` to that element instead.
- **`addImg`** — insert `<figure><img src="…" alt="…"></figure>` into slide N (end of slide, or end
  of its last `.row`). The `src` the user gave is provisional: encode the real image per the image standard in
  `CLAUDE.md` (`_local/tools/encode_images.py dir`), place it under the lecture's assets, and use that
  final path.
- **`delImg`** — remove the `<figure>` whose `<img src>` matches `src` on slide N.

After applying: summarize what changed per slide. Commit and push per `CLAUDE.md` § Way of working. Offer to re-launch so they can eyeball the result.

## Notes
- The `auto`/`hero`/`auto-rows` image slides are positioned by `layoutAuto()` — there are no `box`
  ops for them; never hand-position their figures.
- If a change log's `page` doesn't match an existing file, stop and ask — don't guess a different deck.
