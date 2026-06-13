# LAAR 61400 — Lecture Plan
**Representation and Computation I · Fall 2026**
40-minute lectures, structured as: short lecture → hands-on workshop → open lab.

---

## Course Thesis (the spine running through every lecture)

**Representation and computation are tools designers think *with*, not tools for producing output.**

Every tool in this course (pencil, Photoshop, Illustrator, Rhino, Grasshopper, Claude) can have its *output* automated. That is exactly why we don't learn them as output-producers — we learn them as thinking instruments. The arrival of agentic AI is the sharpest test of this thesis: when "One Prompt, Job Done" (OPJD) can fake the output of any tool, the only reason left to learn a tool is that you think *with* it.

**Two registers of lecture.** Not every lecture carries the thesis philosophically. Some are thesis-bearing (Weeks 1, 2, 11); others are bread-and-butter craft (Weeks 4, 5, 8). Both are legitimate. The thesis-bearing lectures are anchored at **Weeks 1 (seed), 2 (the open question), and 11 (the payoff)**, escalating across the term.

**Theoretical apparatus (name these directly in the AI lectures):** OPJD as syndrome; co-productive intelligence (Zhang); thinking-with / distributed cognition (Clark & Chalmers, Haraway, Hayles); technodiversity / cosmotechnics (Yuk Hui). Source: the OPJD essay.

---

## Full Schedule Map

| Week | Lecture | Register |
|------|---------|----------|
| 1 | Drawing as Thinking Tool (thesis + AI seed) | Thesis |
| 2 | History of Computer Graphics → agentic AI open question | Thesis |
| 3 | **Buffer** | — |
| 4 | Graphic Design 101 | Craft |
| 5 | Intro to GIS / Spatial Data | Craft/Technical |
| 6 | Pin-up (no lecture) | — |
| 7 | Digital Workflow + Rhino intro | Thesis-in-practical-clothes |
| 8 | File Types reference | Craft (bread-and-butter) |
| 9 | Computational Thinking | Thesis (computation half) |
| 10 | **Buffer** | — |
| 11 | AI anchor: Co-productive Intelligence | Thesis (payoff) |
| 12 | Web Coding Literacy (HTML/CSS/JS) | Craft/Literacy |
| 13 | **Open** | — |
| 14 | Desk crits (no lecture) | — |
| 15 | Final presentations (no lecture) | — |

Three buffers (Weeks 3, 10, + open Week 13) protect the structure from workshop overflow.

---

## Week 1 — Drawing as Thinking Tool

**Role:** States the course thesis. The single most important lecture — everything after is an instance of it.

**Narrative arc:**
Survey the kinds of drawing in landscape practice → reveal that drawing is not transcription but a mode of *thinking* → plant the stakes: if a machine can produce the output, what is the drawing *for*?

**Content:**
- Survey of drawing types in landscape practice: plan, section, parti, collage, axonometric, perspective (and what each one is *for* — what kind of thinking each enables).
- The thesis stated plainly: representation and computation are tools designers think with.
- **AI seed:** introduce the stakes without the full theory yet. Why learn a "slow" tool when a camera/AI exists? Because the value was never the output. This seeds Week 2's question and Week 11's payoff.

**Key concepts:** drawing as thinking (not transcription); each drawing type as a distinct cognitive instrument; the thesis; the seed of the OPJD question.

---

## Week 2 — History of Computer Graphics → The Agentic AI Question

**Role:** Thesis in historical form. Shows that tools don't just *represent* design — they *shape what design becomes*. Sets up the entire computation half.

**Narrative arc:**
Walk the history of tool shifts → each shift produced a *new representational paradigm*, not just faster old work → run the arc forward to today → land on the open question: is agentic AI another such shift, and if so, what does it represent?

**Content:**
- Invention of CAD; the Sketchpad / Ivan Sutherland lineage.
- Rhino and NURBS; the smooth continuous surface as a new representational possibility.
- Parametricism — Zaha Hadid, the differentiated field, the scripted form — as a design style *made thinkable by software*.
- The historical pattern: each new tool produced a new kind of representation AND a new design imagination (not merely speed).
- **The live question (lecture's climax):** We are at another tool shift — agentic AI. *If* it is a genuine new paradigm (pose as open question, do not assume), what is its native representation? OPJD says there is none — AI just reproduces the last paradigm's outputs faster. The course's wager: there could be something new. (This is the technodiversity / "new workflows → new representation" thread, planted as a question, paid off Weeks 11–13.)

**Key concepts:** tools shape design, not just depict it; CAD → NURBS → parametricism as successive paradigms; parametricism as software-enabled imagination; the agentic-AI paradigm as an open question; OPJD previewed.

---

## Week 3 — Buffer

Flex time: workshop overflow or lecture catch-up. No fixed lecture.

---

## Week 4 — Graphic Design 101

**Role:** Bread-and-butter craft. Students need to know how to make something that doesn't look bad. Lands where they first produce composed graphic output (Photoshop/InDesign, WF02).

**Content:**
- Color theory
- Composition
- Typography
- Layout rules / hierarchy

**Key concepts:** the practical visual-design fundamentals for producing legible, professional graphics. (No theory required — pure craft.)

> **Note:** Week 4 was originally penciled as the OPJD/Photoshop anchor. Because Graphic Design 101 now owns this slot, the OPJD confrontation consolidated into the Week 11 anchor (with its seed at Weeks 1–2). The Photoshop OPJD experiment (Nano Banana) can still be referenced briefly here or held for Week 11.

---

## Week 5 — Intro to GIS / Spatial Data

**Role:** Technical grounding under WF03 (OSM + Google Earth context mapping). Explains where base data comes from and why it behaves as it does.

**Content:**
- Projection systems
- Datum
- Coordinate reference systems (CRS)
- Spatial data types: vector vs. raster
- Spatial data sources

**Key concepts:** how geographic data is structured, projected, and sourced; the conceptual basis for the WF03 mapping workflow.

---

## Week 6 — Part I Pin-Up

No lecture. WF01–WF03 review + informal sketchbook review.

---

## Week 7 — Digital Workflow + Rhino Intro

**Role:** Thesis wearing practical clothes. Introduces Rhino while framing the entire digital toolchain around *representational intent*. Inoculates against Rhino's built-in trap (chasing realism) in the same session it hands students Rhino.

**Narrative arc:**
Start AND end with the critical question — *what are you actually trying to represent?* → in between, give the practical workflow vocabulary (data sources, pipeline, tool ecology) → return to intent: choose the tool that says what you mean, don't let the data/tool decide.

**Content:**
- **Where data comes from:** in practice the engineer's site survey hands you a CAD file; in school you source it yourself (GIS for maps/terrain, OSM, Google Earth, public datasets). Real acquisition skills.
- **How data moves — the pipeline:** CAD → Rhino → Illustrator / GIS → InDesign, and what is lost or gained at each handoff.
- **Tool ecology — who owns which job:** scaled/measured tools (CAD, Rhino: real-world units, 30 ft = 360 units) vs. scaleless/graphic tools (Illustrator, Photoshop: pixels/picas, no ground truth). The Illustrator-drawing-measured-plans error as the anchor example — a category mistake, using a presentation tool to do a drafting job.
- **The data-trap (the framing question):** students reach for the most data-heavy output (e.g., a 3D terrain model of a huge site) and get something flat and dead, because they started from "what can I build" instead of "what do I want to say." Answer to the recurring terrain question: don't — it'll look flat; decide what you want to represent, then choose the tool that says it.
- **Rhino intro + warning:** don't get obsessed with making a realistic model. Realism-for-its-own-sake in Rhino = OPJD render-for-its-own-sake in Photoshop = the model that looks real but says nothing. Same error, different tool.

**Key concepts:** representational intent first; data sourcing; the CAD→Rhino→Illustrator→InDesign pipeline and its handoffs; scaled vs. scaleless tools; the data-trap; don't chase realism.

---

## Week 8 — File Types Reference

**Role:** Pure bread-and-butter reference — the dense practical catalog. Splits the *technical* half out of Week 7's conceptual framing. Also the lecture where building it doubles as firming up the instructor's own knowledge; aim for accuracy and the kind of organization students screenshot and keep.

**Framing:** computer *fluency* ≠ computational *literacy*. Everyone clicks since childhood, but few have a model of what a file actually is. Using is not understanding. (This is the small-scale version of the Week 11 lesson: the desktop hides "what a file is" the way the chatbot hides "what directing an intelligence takes.")

**Content — catalog grouped by purpose:**
- **Raster images:** JPG (lossy, photos), PNG (lossless, transparency, diagrams), TIFF (print, large), GIF, WebP; what DPI/resolution actually means.
- **Vector:** SVG, AI, EPS, PDF (dual nature); why vector scales and raster doesn't.
- **CAD / drafting:** DWG, DXF (interchange).
- **3D models:** 3DM (Rhino), OBJ, FBX, STL, SKP; mesh vs. NURBS.
- **GIS / spatial:** SHP (shapefile — actually a bundle), GeoTIFF, GeoJSON, KML/KMZ, DEM.
- **Layout / docs:** INDD, IDML, PDF (as final output).
- **Cross-cutting concepts:** lossy vs. lossless; raster vs. vector; compression; what "exporting" actually does; why a handoff loses data.

**Key concepts:** the format catalog by purpose; the cross-cutting distinctions (lossy/lossless, raster/vector, compression); fluency ≠ literacy.

> **To decide when building:** scope (full reference vs. course-only formats vs. course-in-depth + others as quick table) and output format (deck vs. cheat-sheet vs. both).

---

## Week 9 — Computational Thinking

**Role:** The computation half's equivalent of Week 1. Says: *computation is a way of thinking.* Coding 101 as a **cognitive** literacy, not a syntax lesson. Pre-loads Weeks 11–12 (directing an agent and reading HTML/CSS/JS are both instances of the same mental model).

**Path (most abstract option chosen):** design-reasoning first → Grasshopper as the engine → one code-peek as the distant echo. Computational thinking lives in the design reasoning *before* any software.

**Through-framing — the landform catalog:**
A catalog of landforms (mounds, berms, swales, terraces) with the question "what changes as I move across the catalog?" = parametric thinking with zero software. The variable is height/slope/spacing; the catalog *is* the parameter space. Grasshopper is just the machine that generates the catalog automatically. Use **multiple mini-examples (one per concept)** rather than a single through-example, with Grasshopper as the live demo — especially for how lists behave in GH.

**Concept tiers:**
- **Tier 1 — core four:**
  - *Variable / parameter* — the thing that changes across the catalog; the slider. Most important concept.
  - *Parameter space / range* — the full set of possible values; the catalog samples it. Min, max, step.
  - *Function (as a machine/recipe)* — input → process → output. A landform generator takes height + width, returns a mound. "Recipe" framing is correct and intuitive.
  - *Data* — the material that flows: a point, number, curve. What moves through the wires.
- **Tier 2 — structure of data:**
  - *List / collection* — many things at once (a row of mounds). **This is where Grasshopper IS the lesson** — GH operates on whole lists implicitly. Demonstrate how lists behave in GH.
  - *Data type* — a number isn't a point isn't a curve; why you can't plug one into another. The colored wires.
- **Tier 3 — logic and control (light):**
  - *Conditional (if/then)* — "if slope > 15%, color it red." Feeds WF06 slope analysis.
  - *Boolean* — true/false underneath every conditional. (Dispatch in GH.)
- **Tier 4 — the code-peek (handle with care):**
  - *Loop / iteration* — **the single deliberate Python/JS peek.** Grasshopper does iteration *implicitly* (auto-maps over lists, no visible `for`); Python/JS make it *explicit* (`for x in list`). Show GH quietly handling 100 mounds with one component, then the three-line Python `for` loop doing the same by hand. The contrast reveals what Grasshopper hides. **Do not call GH's behavior a "loop" without this contrast** — it plants a misconception that bites in Week 12.

**Instructor note:** instructor is a self-taught coder (some Python, C#/Arduino, JS) — has the mental model, wants help teaching it rigorously without being a CS professor. Priority when building: keep the mental models *correct* as well as accessible; watch the loop/iteration precision especially.

**Key concepts:** computational thinking as transferable reasoning; catalog = parameter space; variable, parameter space, function-as-recipe, data (Tier 1); list, data type (Tier 2); conditional, boolean (Tier 3, light); implicit vs. explicit iteration (Tier 4 code-peek).

---

## Week 10 — Buffer

Flex time, placed in the Grasshopper stretch where the tool is hardest and most likely to need extra time. No fixed lecture.

---

## Week 11 — Co-productive Intelligence (AI Anchor)

**Role:** The thesis payoff. Names the theoretical framework directly, at the first required Claude use (WF06). Both strands — critique AND practical literacy — escalating together.

**Narrative arc:**
Confront OPJD as the dominant (wrong) story → dismantle the "AI as faster pencil / just a tool" framing → offer co-productive intelligence as the alternative → reveal that there is *skill* in directing this intelligence → set up the constructive wager (Weeks 12–13).

**Content:**
- **OPJD as syndrome:** "One Prompt, Job Done." The Genspark subway ad (convoluted human path vs. straight AI line). The illusion that the "boring" middle is waste to automate — when the middle is where design thinking lives. The Nano Banana illustrative-plan experiment (four escalating prompts; the lifeless-but-fast result; "do we pay the entry-level designer or the AI tokens?").
- **Why "AI is not a faster pencil":** using AI to reproduce Photoshop-enabled thinking is dull and misses the point. The category error of treating a genuinely *other* intelligence as an extension of human agency.
- **Co-productive intelligence (the framework, name it):**
  - Thinking-with / distributed cognition: Clark & Chalmers (mind beyond skin and skull), Haraway (cyborg condition), Hayles (the human built in the machine's image). We never think alone — always think *with*.
  - Co-productive intelligence (Zhang): human and machine intelligences are not stable categories that meet in the middle; they are *produced through entanglement*. Intelligence as effect, not cause. "The designer who thinks with AI is not the same designer who thinks with tracing paper."
  - Resisting AI-as-tool not to humanize the machine, but because the tool-framing instrumentalizes *us*.
- **Skill in chatting (the literacy):** the chatbot interface creates the illusion that expressing an idea to a machine is effortless. It isn't — it's a literacy. (Large-scale version of Week 8's "you don't actually know what a PNG is.") The "person locked in a room" framing; MCP as the doors that give the agent tools.
- **The labor stakes:** OPJD packages the entry-level designer into a bundle of functions, then hands the bundle to an agent — classic alienation. What's threatened isn't just jobs but the *range of futures* (→ technodiversity).

**Key concepts:** OPJD; AI ≠ faster pencil; co-productive intelligence; thinking-with / distributed cognition; skill in chatting as literacy; alienation and labor stakes; locked-room/MCP framing.

---

## Week 12 — Web Coding Literacy

**Role:** Tests Week 11's framework immediately. Gives students the scaffolding to *direct* the WF07 Claude Code build rather than blindly accept its output. "Everyone should know this now" — computational literacy as a civic baseline, not a specialist skill.

**Narrative arc:**
What is the web made of? → three layers, each with a job → with this model, "make me a website" (OPJD) becomes actual *direction*.

**Content:**
- **HTML** — structure
- **CSS** — style
- **JS** — behavior
- How a page actually works; structure vs. style vs. behavior as separable concerns.
- The minimum literacy that turns OPJD ("make me a website") into meaningful direction of an agent. (Same pattern as Weeks 7→8 and Week 11: you need a model of what's underneath to direct the tool instead of being at its mercy.)

**Key concepts:** HTML/CSS/JS as structure/style/behavior; what the web is made of; literacy as the precondition for directing an AI build agent; computational literacy as civic baseline.

---

## Week 13 — Open

Kept open (effectively a third buffer / flex slot). No lecture assigned.

---

## Weeks 14–15 — Crit / Final

No lectures. Final assembly + desk critiques (14); final presentations (15).

---

## Theme Library (cross-reference)

The lectures are instances of the course thesis, in two registers:

- **Thesis-bearing:** Week 1 (states it), Week 2 (poses the AI question), Week 7 (data-trap = thesis in practical clothes), Week 9 (computation as thinking), Week 11 (co-productive intelligence payoff).
- **Bread-and-butter craft:** Week 4 (Graphic Design 101), Week 5 (GIS), Week 8 (File Types).
- **Literacy bridge:** Week 12 (Web Coding) — craft that also tests the thesis.

**The recurring lesson, one sentence:** *you need a model of what's underneath to direct a tool instead of being at its mercy* — applied to files (Wk 8), to computation (Wk 9), to AI (Wk 11), to the web (Wk 12).
