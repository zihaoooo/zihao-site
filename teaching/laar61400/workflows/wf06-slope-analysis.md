# WF06 — Slope Analysis with Python + Claude
<!-- wf-header -->
<!-- badge: Rhino 3D (#801010) -->
<!-- badge: Grasshopper (#4a7c3f) -->
<!-- badge: Claude Chat (#f3ece4 / #9a6a3c) -->
<!-- weeks: 11 -->

---

## Overview
<!-- wf-intro block -->

A surface is not just a shape — it is a function. Every point on it has a position, a normal vector, and a slope. In this workflow, you will write a Python script for Grasshopper that queries your WF04 Patch surface mathematically and colors it by slope. You will not write the script from scratch. Instead, you will learn to specify what you want precisely enough that Claude can write it for you — and understand what it produced well enough to debug it.

The central skill is **converting intention into specification**: knowing what you want at a geometric level before you ask for it. The students who get bad scripts back aren't unlucky — they under-specified the geometry.

---

## What you are building

A slope analysis mesh overlaid on your WF04 terrain surface.
- Flat areas read green
- Steep areas read red
- Scale capped at 60° — a meaningful landscape threshold (above this, a slope is generally unbuildable)
- Analysis stays within the site boundary; Patch overhang is excluded

---

## The workflow

### Stage 1 — Understand the geometry (in class, no computers)

Before writing any prompt, you need a mental model of what "slope" means mathematically on a surface.

Work through these questions:

- **How do you locate a point on a surface?** UV parameters — two numbers that address any point in the surface domain.
- **How do you ask a surface which way it faces at a point?** The normal vector — perpendicular to the surface at that UV location.
- **How do you measure slope from a normal?** The angle between the normal vector and world Z. Flat = 0°, vertical = 90°.
- **What counts as steep in landscape terms?** A slope a person can walk. A slope a wheelchair can navigate. A slope that sheds water. These are design thresholds, not arbitrary numbers.

You need to be able to answer these in plain English before Stage 2.

---

### Stage 2 — Interview Claude to build your spec

Open a new Claude chat. Paste this starter prompt exactly:

> I'm a landscape architecture student working in Rhino 8 Grasshopper. I want to write a Python script that analyzes my surface. Before writing any code or spec, interview me one question at a time to understand exactly what I need. Do not write code yet. Do not move to the next question until I answer.

Claude will ask you questions. Answer each one. If you answer in visual terms ("I want it to look like..."), push yourself to convert to geometric terms ("the script needs to measure...").

When the interview feels complete, ask:

> Based on our conversation, write a buildspec — not code. List: the Grasshopper Python component inputs with type hints, outputs, what gets computed, the color scale and its landscape meaning, and any known edge cases.

Review the spec. Can you verify every line against what you actually want? If not, go back to the interview.

---

### Stage 3 — Set up the Python component

Add a Python 3 Script component to your canvas. Add these inputs and one output:

| Name | Type hint |
|---|---|
| `surface` | Surface |
| `boundary` | Curve |
| `u_count` | int |
| `v_count` | int |
| **`colored_mesh`** (output) | — |

Right-click each input to set the type hint. This step is required — without it, Grasshopper passes GUIDs instead of geometry and the script will error immediately.

Connect: `surface` from Patch, `boundary` from your site boundary curve, `u_count` and `v_count` from number sliders (set to integers, try 30).

---

### Stage 4 — Execute and debug

Ask Claude to write the script from your buildspec. Paste it into the Python component and hit Run.

If it errors: copy the full error message and paste it back to Claude.
If the output looks wrong: take a screenshot and describe what you see.

Repeat until it works. This loop — run, error, fix — is normal. It is not a sign the script is bad; it is how scripting works.

**Common issues:**
- Script errors immediately → type hints not set on all inputs
- Colors look flipped → describe this to Claude; it will fix the normal direction
- Mesh doesn't appear → make sure viewport is in Shaded mode and `colored_mesh` is wired to a Mesh parameter

---

## Deliverable

A slope analysis mesh rendered in Rhino viewport, plus:
- The buildspec you produced in Stage 2
- The final working script
- Two viewport screenshots: perspective view and top/plan view

The buildspec is as important as the script. It is evidence that you understood the geometry before you asked for the code.

---

## Tips

- The interview only works if you slow down. Students who rush to the prompt skip the thinking.
- "AI is dumb" is usually a diagnosis of the brief, not the model. A vague prompt gets a generic script.
- The buildspec should describe *what must be true when it works*, not *how the code should do it*. Specifying the algorithm caps Claude at your level of knowledge — which for a first script is the wrong cap.
- Patch always extends slightly beyond your boundary curve. Your spec should tell Claude to exclude faces outside the boundary — you don't need to know how to fix it, only that the problem exists.
