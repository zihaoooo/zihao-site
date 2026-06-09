# WF04 — Rhino + Grasshopper: Landform Site Design
<!-- wf-header -->
<!-- badge: Rhino 3D (#801010) -->
<!-- badge: Grasshopper (#4a7c3f) -->
<!-- weeks: 7–8 -->

<!-- pipeline strip -->
Rhino → Grasshopper → Contour Plan

<!-- wf-output -->
Output: Contour plan at 1" = 20', Rhino file, Grasshopper definition

---

<!-- wf-brief -->
**The Site** — 180 × 300 ft, 10 ft slope across the long axis.

**Brief** — Design a landform composition that manages stormwater on this site. Direct, collect, or redirect flow using graded landforms.

**Required:**
- At least two smooth landforms (mound, bowl, swale) — built with `Patch`
- At least one hard edge condition (retaining wall, terrace) — built with `Loft`

---

## Week 7 — Site Setup + First Landform

### 00 File Setup

- `DocumentProperties` → Units → **Feet**
- Save: `wf04-landform.3dm`

---

### 01 Build the Base Slope

- `Rectangle` → `0,0` to `300,180`
- `PlanarSrf` from the rectangle
- `F10` → control points visible
- `Ctrl+Shift+click` one short edge — sub-object selects the edge only
- **Gumball Z** → type `10` → Enter
- `F11` to hide points

> **Sub-object selection** (`Ctrl+Shift+click`) selects faces, edges, or vertices without exploding the object. Use it whenever you need to move part of a surface.

---

### 02 GH — Reference Surface + Contour Preview

Open Grasshopper (`Grasshopper` command).

- **Surface** param → Set One Surface → click base slope
- **Contour** component → wire surface → S
- **Number Slider** (0.5–5) → wire → N (contour interval)

Parallel evenly-spaced contours confirm the slope is reading correctly. This is your base terrain.

---

### 03 Draw a Plan Footprint (Rhino — Top Viewport)

- Draw a closed curve — `InterpCrv`, `Ellipse`, or freehand
- Draw flat at Z = 0
- This curve is the **breakline**: where the landform begins and the base field ends

---

### 04 GH — Project, Trim, Patch, Join

**Project** the footprint onto the base slope:
- **Curve** param → Set One Curve → footprint curve
- **Project** component → Curve, Surface, Direction (Unit Z vector)

**Trim** the base surface:
- **Trim** (or **Brep | Curve**) → base surface + projected curve → surface with hole

**Patch** the landform surface:
- **Patch** component → projected curve as boundary
- Add a **Point** param → set inside the footprint → control peak or valley location
- **Number Slider** (−10 to +10) → move point Z → controls landform height
- Positive = mound / Negative = bowl or swale
- Patch **Flexibility** input: try 3–5 for organic forms

**Join:**
- **Join Breps** → trimmed base + Patch surface
- Edges are coincident — Join succeeds cleanly
- Wire joined surface to **Contour** → contours read across the full site

*End of Week 7.* Before next session: sketch two more landform operations on paper. Think about where water flows and where a hard edge is needed.

---

## Week 8 — Full Site + Deliverable

### 05 Add More Smooth Landforms

Repeat the Step 03–04 loop for each additional Patch landform. Each is a separate GH branch.

- Group each branch in GH (right-click canvas → Group) and label it
- Collect all joined surfaces into a final **Join Breps**

---

### 06 Build a Hard Edge Condition

In Rhino Top viewport, draw two curves: the **top edge** and **bottom edge** of the retaining wall.

In Grasshopper:
- Reference both curves
- **Move** each to its correct elevation (top grade / bottom grade)
- **Loft** → top curve + bottom curve → wall face surface
- Trim grade surfaces to meet the wall edges → Join all

> In the contour plan, contours **overlap** at the wall face — the same elevation appears on both the upper and lower grade. That overlap is how a retaining wall reads in a contour drawing.

---

### 07 Read the Contours

Before baking, read the contour output as a design drawing:

- Contours that **V upstream** → valley or drainage path
- Contours that **V downstream** → ridge
- Are landform transitions reading as continuous field or unintended hard edges?
- Is the retaining wall placed where the grade change is legible and intentional?

Adjust footprint curves and height sliders until the plan reads as a coherent designed landscape.

---

### 08 Bake + Produce the Contour Plan

- Right-click Contour output → **Bake** → layer `CONTOURS-DESIGN`
- `Make2D` → Top viewport → flat linework
- `Layout` → 1" = 20' (1:240) on 11 × 17
- Add: north arrow, scale bar, contour interval note, title block
- Plot to PDF

---

## Deliverable
<!-- wf-outcome -->

Contour plan PDF at 1" = 20' + Rhino `.3dm` + Grasshopper `.gh`

---

## Two Kinds of Surfaces
<!-- wf-concept — analogous to "Chat vs. Code" block in WF07 -->

Every graded landscape is built from two surface types:

- **Smooth field** — continuous transition across the ground. Footprint curve → `Patch`. Reads in plan as flowing, spaced contours.
- **Hard edge** — abrupt grade change. Two edge curves → `Loft`. Reads in plan as overlapping contours at the wall face.

**The plan curve is always the breakline.** Drawing a footprint in Top view is a design decision — the shape, size, and placement of that curve determines how the landform reads in section and how water moves across the site.
