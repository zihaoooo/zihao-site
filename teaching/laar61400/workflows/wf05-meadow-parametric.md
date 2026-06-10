# WF05 — Grasshopper Parametric: Meadow
<!-- wf-header -->
<!-- badge: Rhino 3D (#801010) -->
<!-- badge: Grasshopper (#4a7c3f) -->
<!-- weeks: 9–10 -->

<!-- pipeline strip -->
Populate 2D → Rule → Ellipsoid Field

<!-- wf-output -->
Output: Grasshopper definition, Rhino viewport screenshots (Week 9 in-progress + Week 10 final)

---

<!-- wf-brief -->
A flat meadow. Two parametric rules encode two landscape conditions: a mown path, and water-collecting bowls. The same field, two rules, two spatial readings.

This workflow introduces the core logic of parametric design: **write the rule first, then build it in nodes.**

---

## Week 9 — Mowing Path

### Pseudocode first

Before opening Grasshopper, write this rule on paper:

```
FOR EACH plant in meadow:
  IF distance to path < mowing width
    THEN height = mowed (short)
  ELSE height = unmowed (tall, random)
```

Identify: what is the input, what is the condition, what are the two outputs.

### Build it

**Step 1 — Set up the meadow**
- In Rhino: draw a rectangle (site boundary), e.g. 100 x 150 ft
- In GH: `Populate 2D` with the rectangle as region
  - Add a `Count` slider (start with 200)
  - Add a `Seed` slider (controls random distribution)

**Step 2 — Random heights (unmowed state)**
- `Random` component: set domain 2.0 to 6.0 (unmowed grass height range)
- Connect to `Line SDL`: start = populated points, direction = unit Z vector, length = Random output
- You now have a meadow

**Step 3 — Draw the path**
- In Rhino: draw a curve across the site (polyline or arc)
- Reference it into GH with a `Curve` parameter

**Step 4 — Measure distance to path**
- `Curve Closest Point`: input = Populate 2D points, curve = path curve
- `Distance`: between original points and closest points on curve

**Step 5 — Apply the rule (Dispatch)**
- `Larger Than`: input A = distance, input B = mowing width slider (start at 8.0)
- `Dispatch`: data = Line SDL lengths, pattern = Larger Than output
  - List A (beyond threshold) = unmowed random heights — keep as is
  - List B (within threshold) = replace with a short fixed height slider (0.5)
- Reconstruct the two Line SDL components for each branch

**Step 6 — Preview**
- Toggle between mowing width values. Watch the mown strip widen and narrow.
- Move the path curve in Rhino. The mown zone follows live.

---

## Week 10 — Water Bowls

### Pseudocode first

```
FOR EACH plant in meadow:
  height = remap(distance to nearest bowl, 0 → max, tall → short)
```

Close to bowl = tall (wet, lush). Far from bowl = short (dry).

### Build it

**Step 1 — Place bowl attractor points**
- In Rhino: place 2–4 point objects on the site (these are the bowl locations)
- Reference into GH with a `Point` parameter

**Step 2 — Pull Point**
- `Pull Point`: input points = Populate 2D points, geometry = bowl attractor points
- Returns: the nearest bowl point for each plant
- `Distance`: between original plant point and its pulled bowl point

**Step 3 — Remap to height**
- `Bounds`: on the distance list — gets the actual min/max range
- `Remap Numbers`: input = distances, source domain = Bounds output, target domain = set manually
  - Target domain: 1.0 (close to bowl, tall) to 0.2 (far, short)
  - Note: flip the range to invert the relationship (close = tall)

**Step 4 — Construct the ellipsoid**
- `Sphere`: center = Populate 2D points, radius = remapped height value
- `Scale NU`: geometry = sphere, X = 1.0, Y = 1.0, Z = remapped height value
  - This stretches the sphere vertically — taller near bowls, flatter further away
  - Add a `Z Scale` slider to tune the vertical exaggeration

**Step 5 — Preview and adjust**
- Move a bowl point in Rhino. The tall cluster shifts live.
- Add or remove bowl points. Each one creates a new zone of lush growth.
- Adjust the Remap target domain to change the height contrast.

---

## Key Concepts

**Populate 2D vs. grid** — `Populate 2D` distributes points organically within a boundary. The `Seed` slider changes the distribution without changing the count. This reads as a natural meadow, not a tile pattern.

**Dispatch vs. Remap** — Dispatch encodes a binary rule (mow / no mow). Remap encodes a continuous gradient (tall near water, short away from it). Most landscape conditions are gradients; the binary is the readable edge.

**Pull Point** — works like Closest Point: for each input point, finds the nearest geometry in a set and returns that geometry's location. Used here to measure proximity to the nearest bowl across multiple attractor points.

**Ellipsoid from Scale NU** — a sphere scaled non-uniformly in Z. The same remap value that drives height also drives the Z scale, so plants near bowls are taller and rounder; plants far away are short and disc-like. One value, two readings.

---

## Deliverable

Submit as a single PDF or image set:

1. **Week 9 screenshot** — viewport showing the mown path condition; include a panel showing the mowing width slider value
2. **Week 10 screenshot** — viewport showing the bowl condition; include at least 2 bowl attractor points
3. **One slider study** — two screenshots of the same definition with different slider values, showing how the spatial outcome changes
4. **Short label** — one sentence per screenshot: what does the parameter control, what does the spatial change mean in landscape terms

---

## Pseudocode → Node reference

| Pseudocode | GH component |
|---|---|
| for each plant in meadow | `Populate 2D` |
| distance to path | `Curve Closest Point` + `Distance` |
| if / else | `Larger Than` + `Dispatch` |
| distance to nearest bowl | `Pull Point` + `Distance` |
| remap to height | `Remap Numbers` |
| draw plant | `Sphere` + `Scale NU` |
