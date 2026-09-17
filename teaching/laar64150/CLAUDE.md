# LAAR 64150 — Design Research — teaching context

Listed: a course card in `teaching/index.html` points here, and the pages are indexable.
The page serves as the lecture home for the course while the seminar is redeveloped.

Factory output of `../../../course-prep/laar64150/`; same authoring rules as laar61400
(see `../laar61400/CLAUDE.md`, "Factory output").

- `index.html` carries a course header, an Overview written from the two lectures, and the
  lecture table — no weekly schedule, by choice. The Fall 2025 syllabus was combined with the
  studio (studio–research seminar pair); this course is being redeveloped as a standalone seminar.
- Styles and nav script borrow laar61400's `assets/css/` and `assets/js/nav.js`.
- `lectures/` holds reusable research lectures, named by topic (no week prefix) so other courses
  can link them: `what-is-research.html` (42 slides), `grant-writing-101.html` (15 slides). Both
  were rebuilt from the Dropbox sources in `/Zihao Zhang/03_Lectures/` (What is Research.pdf,
  Grant Writing 101.pptx) — text became typeset cards, images were extracted and encoded to AVIF.
- Text-only slides use two page-local cards in each lecture's `<style>`: `.txt-card`
  (heading + bullets, nested sub-bullets) and `.stmt` (one sentence, carried large), both built
  from week07's `m7-cols` tokens. Presenter View mirrors only shared deck.css classes, so these
  cards show unstyled there — same as week07's cards. Promote them to deck.css (plus a
  `.pv-deck` mirror) when a third lecture needs them.
- Speaker notes are written for this material, not carried over: the .pptx notes were one
  repeated line.
