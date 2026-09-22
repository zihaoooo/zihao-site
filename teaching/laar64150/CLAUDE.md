# LAAR 64150 — Design Research — teaching context

Listed: a course card in `teaching/index.html` points here, and the pages are indexable.
The page serves as the lecture home for the course while the seminar is redeveloped.

Factory output of `../../../course-prep/laar64150/`; same authoring rules as laar61400
(see `../laar61400/CLAUDE.md`, "Factory output").

- `index.html` carries a course header, an Overview written from the seven lectures, and the
  lecture table — no weekly schedule, by choice. The Fall 2025 syllabus was combined with the
  studio (studio–research seminar pair); this course is being redeveloped as a standalone seminar.
- Styles and nav script borrow laar61400's `assets/css/` and `assets/js/nav.js`.
- `lectures/` holds reusable research lectures, named by topic (no week prefix) so other courses
  can link them. Teaching order = nav order:
  - `what-is-research.html` (41 slides) — the **general** version, for students from any
    discipline. Parts I/III/IV rework the designer lecture; Part V borrows Grant Writing 101.
    Its Part III, "Research is never neutral," is the critical spine.
  - `what-is-research-for-designers.html` (42 slides) — the original lecture, renamed 2026-09.
    Making and theorizing as methods, with graphic references.
  - `asking-research-questions.html` (19 slides) — modelled on Grant Writing 101's compact,
    text-only shape. Its argument is **ask a *how* question**: a why needs a cause isolated, a
    what stops at description, a how names a process with parts you can go look at. Carries
    FINER and the PICO/PEO/SPIDER slot-check.
  - `why-theory-matters.html` (19 slides) — theory as equipment with a range and a blind spot.
    The ontology → epistemology → methodology → method stack; positivism / interpretivism /
    critical realism / critical theory; apply–test–extend–contest.
  - `paradigms-and-incommensurability.html` (25 slides) — Kuhn, read for what he actually
    claimed. Normal science, anomaly, crisis; the 1969 postscript's disciplinary matrix vs
    exemplar; the three kinds of incommensurability and the taxonomic one he kept; Kuhn-loss
    and the 1977 five values; then Galison's trading zones as the bridge to working across.
  - `how-disciplines-do-research.html` (20 slides) — what each field counts as evidence, then
    working across: multi/inter/transdisciplinary, epistemological conflict and disciplinary
    capture, boundary objects, Mode 2 (Gibbons et al. 1994), wicked problems (Rittel and
    Webber 1973).
  - `grant-writing-101.html` (15 slides).
  The last four were authored in this repo, not in a factory — there is no `../course-prep`
  source for them. The designer lecture and Grant Writing were rebuilt from the Dropbox sources
  in `/Zihao Zhang/03_Lectures/` (What is Research.pdf, Grant Writing 101.pptx).
  The four new lectures are text-only by choice and reuse no images.
- `assets/img/what-is-research/` is a **shared pool for both** What is Research lectures — the
  folder keeps the old name after the rename so no paths broke. The general lecture reuses six
  of its plates (05-a, 10-a/b, 12-a, 13-a, 17-a); the rest are designer-only.
- Nav: all eight pages carry the same seven-link `.panel-section`, in teaching order.
  Propagate nav edits across them together — a regex replace of the whole
  `.panel-section-label` block is safer here than sed, since the link list is long.
- Text cards are now **shared, in `/assets/deck/deck.css`**: `.txt-card` (heading + bullets),
  `.stmt` (one sentence carried large) and `.cmp` (comparison table, added 2026-09 for the
  disciplines and paradigm lectures). Promoted out of these pages once the third lecture needed
  them, with `.pv-deck` mirrors in deck.js — so Presenter View renders them properly now, which
  it did not before. Spec: `/assets/deck/deck-spec.md`. Each page keeps only the 3-line
  `.slide .embed` rule inline, same as the laar61400 lectures.
- Speaker notes are written for this material, not carried over: the .pptx notes were one
  repeated line.
