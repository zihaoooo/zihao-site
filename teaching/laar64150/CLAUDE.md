# LAAR 64150 — Design Research — teaching context

Listed: a course card in `teaching/index.html` points here, and the pages are indexable.
The page serves as the lecture home for the course while the seminar is redeveloped.

Factory output of `../../../course-prep/laar64150/`; same authoring rules as laar61400
(see `../laar61400/CLAUDE.md`, "Factory output").

- `index.html` carries a course header, an Overview written from the three lectures, and the
  lecture table — no weekly schedule, by choice. The Fall 2025 syllabus was combined with the
  studio (studio–research seminar pair); this course is being redeveloped as a standalone seminar.
- Styles and nav script borrow laar61400's `assets/css/` and `assets/js/nav.js`.
- `lectures/` holds reusable research lectures, named by topic (no week prefix) so other courses
  can link them:
  - `what-is-research.html` (68 slides, nine parts) — the **general** version, for students from
    any discipline. Parts: what is research · asking the question · methods and evidence · why
    theory matters · paradigms and incommensurability · how disciplines differ · research is
    never neutral · where to find information · writing about your research. Parts I/VII/VIII
    rework the designer lecture, Part IX borrows Grant Writing 101, and Parts II and IV–VI were
    authored here (2026-09) with no factory source.
    - Part II's argument is **ask a *how* question**: a why needs a cause isolated from its
      rivals, a what stops at description, a how names a process with parts you can go look at.
    - Part V reads Kuhn for what he actually claimed — the 1969 postscript's disciplinary matrix
      vs exemplar, the taxonomic incommensurability he kept, Kuhn-loss, the 1977 five values as
      values rather than rules — and hands off to Galison's trading zones in Part VI.
    - It is long by design: nine parts meant to be taught across several sessions, not one.
  - `what-is-research-for-designers.html` (42 slides) — the original lecture, renamed 2026-09.
    Making and theorizing as methods, with graphic references.
  - `grant-writing-101.html` (15 slides). Rebuilt, with the designer lecture, from the Dropbox
    sources in `/Zihao Zhang/03_Lectures/` (What is Research.pdf, Grant Writing 101.pptx) —
    text became typeset cards, images were extracted and encoded to AVIF.
- `assets/img/what-is-research/` is a **shared pool for both** What is Research lectures — the
  folder keeps the old name after the rename so no paths broke. The general lecture reuses six
  of its plates (05-a, 10-a/b, 12-a, 13-a, 17-a); the rest are designer-only.
- Nav: all four pages carry the same three-link `.panel-section`, generic lecture first.
  Propagate nav edits across them together (sed, or a regex replace of the whole
  `.panel-section-label` block).
- Text cards are now **shared, in `/assets/deck/deck.css`**: `.txt-card` (heading + bullets),
  `.stmt` (one sentence carried large) and `.cmp` (comparison table, added 2026-09 for the
  question-stem, paradigm and discipline slides in Parts II, IV and VI). Promoted out of these pages once the third lecture needed
  them, with `.pv-deck` mirrors in deck.js — so Presenter View renders them properly now, which
  it did not before. Spec: `/assets/deck/deck-spec.md`. Each page keeps only the 3-line
  `.slide .embed` rule inline, same as the laar61400 lectures.
- Speaker notes are written for this material, not carried over: the .pptx notes were one
  repeated line.
