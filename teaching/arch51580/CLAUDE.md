# Arch 51580 / 61580 — Agentic Design Workflows — teaching context

Elective, Spring 2027. Dual-listed Arch 51580 / 61580, Topics in Computational Studies; the folder
takes the lower number. Factory output of `../../../course-prep/arch51580/`; same authoring rules as
laar61400 (see `../laar61400/CLAUDE.md`, "Factory output") — **the live page is the source of truth**,
and fixing output here is the canonical fix.

**Unlisted.** No card in `teaching/index.html` yet — the pages are live at their URLs and shareable
by link while the syllabus is tentative. Add the card when the course is confirmed in the catalog.

Styles, nav script and the whole `assets/` tree are borrowed from laar61400 by absolute path, the way
laar64150 does it. This folder has no `assets/` of its own and needs none.

## Dates are deliberately absent
Meeting day, time and room are "to be set against the Spring 2027 calendar" in `index.html`, and the
Weekly Schedule carries week numbers with no dates. The calendar is not published yet; fill these in
once it is, in `index.html` only.

## Lectures (`lectures/`)
Topic-named, no week prefixes, same as laar61400 and laar64150.

- `coding-101.html` (21 slides, deck `a51-02`) — **this course's own lecture**, authored here.
  How a machine reads instructions · what a script is · the five moves (name · repeat · choose ·
  bundle · read and write) · reading a traceback · reading what the agent wrote. Python examples,
  designer-shaped (the running example is this site's own image-encode pipeline).
  - The five moves are the deck's spine and recur in the workshop and in `index.html`'s Week 2 row —
    change the set in one place and all three need updating.
  - Slide 10 is a **hand-written loop tracer** (`.c1-trace`, inline script at the end of the page):
    a `STEPS` array of `{line, set, print, say}` deltas, not an interpreter. Editing the traced code
    means editing both the `<span class="c1-trace__line" data-line="N">` markup and `STEPS`.
  - Page-local classes are `c1-` prefixed: `.c1-code` (line-numbered code block), `.c1-moves`,
    `.c1-flow`, `.c1-trace`, `.c1-next`. Promote to `/assets/deck/deck.css` if a second deck needs them.
  - Brief by design — ~90 words a slide; elaboration lives in `data-notes`.

- Four decks are **copies of laar61400's**, written by
  `../../../course-prep/scripts/arch51580_reuse_lectures.py`:
  `computational-thinking.html` · `web-coding-literacy.html` · `cybernetics-and-design.html` ·
  `graphic-design-101.html`.
  - Copied rather than linked so each page carries **this** course's side panel. A link would have
    dropped students into LAAR 61400's nav.
  - **Images are not copied.** Every `<img>` points at `/teaching/laar61400/assets/img/<slug>/`, so
    both courses share one asset pool. Keep it that way: an image edit in laar61400 is meant to show
    up here.
  - **The copies may diverge**, and are expected to: the elective goes further on agents and context
    than the required course compresses into one deck. Re-running the script **overwrites** them, so
    once a copy has elective-specific edits, either stop re-running it for that slug or re-apply the
    edits after. The script rewrites nav, `<title>`, the title-slide stamp, relative image paths and
    the deck id; it changes no slide content.
  - Deck ids are `a51-NN`, not laar61400's `wNN` — deck.js keys the speaker-notes passphrase in
    localStorage (`deck-notes-pass-<id>`) and the Presenter View BroadcastChannel off the id, so a
    shared id would make the two courses' decks talk over each other.

## Workshops (`workshops/`)
`.wf-doc` layout + `wf-progress.js`, same conventions as laar61400's `workflows/` (see its CLAUDE.md,
"WF page conventions"). Named `workshops/` here because that is what the syllabus calls them.

- `coding-101.html` (WS01, "Reading a Script") — the lab half of the Coding 101 session. Predict →
  run → break on purpose → write a spec → hand it to the agent → the four questions → dry run.
  Header chip is `WS01`. Carries no dates; the one deliverable is named in the `.wf-outcome` box.
  - The **four questions** in Step 07 are the same four as slide 18 of the lecture. One set, two places.

## Nav
Four sections — Lectures, Workshops, Reference — identical in all six pages and inline in each, as
everywhere on this site. `ARCH_NAV` in `arch51580_reuse_lectures.py` is the copy the script injects;
after a nav edit, re-run the script for the four copies and sed the three hand-authored pages
(`index.html`, `lectures/coding-101.html`, `workshops/coding-101.html`).

## Syllabus (`index.html`)
Same `syllabus-section` / `schedule-table` / `grade-breakdown` classes as laar61400's, so
`course-prep/scripts/syllabus_to_docx.py` can be pointed at it when a school-submission PDF is
needed (it is not wired up for this course yet — `COURSE` in that script is laar61400).

- The **Weekly Schedule is two tables**, Part I (Weeks 1–7) and Part II (Weeks 8–14), with a
  `.syllabus-body` label between them.
- `_course/proposal.md` in the factory is the **frozen record of what was submitted** (Sep 2026).
  This page is the source of truth for the schedule going forward; the two have diverged on purpose
  and are not to be hand-synced. The divergence: Coding 101 was added as Week 2, pushing web coding
  to Week 3 (where Graphic Design 101 joins it) and context to Week 4. Every milestone D1–D6 and all
  four guest-lecture weeks kept their proposed weeks.
- **All policy prose is laar61400's, verbatim** — attendance, academic integrity, incompletes,
  civility, electronic devices, grading criteria, the grade scale and its footnote, support
  resources, Support of Program Mission, and the Agentic AI — Course Stance block. Do not write new
  policy language for this course: copy it from `../laar61400/index.html`, which is the source.
  Two factual substitutions only, both marked in the git history:
  - Attendance's first sentence, because the Spring 2027 meeting day, time and room are not set.
  - Support of Program Mission's first sentence, because this is an elective in Topics in
    Computational Studies open across the school's programs, not part of the LA course sequence.
    Every mission sentence after it is laar61400's, word for word.
- The grade scale is laar61400's graduate scale and carries no D grades, while this course is open
  to 4th/5th-year BArch students. Flagged, deliberately left as laar61400 has it.
- **Coding-agent subscription is a department requirement**, stated flatly in Course Logistics: an
  active paid plan for the semester, no hardship carve-out.
