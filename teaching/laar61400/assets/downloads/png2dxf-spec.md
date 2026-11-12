# PNG → CAD block — build spec

LAAR 61400. Give this file to Claude Code together with your PNGs.

## Task

Write and run a Python script that converts a silhouette PNG of a tree
into a DXF containing one scaled, named CAD block.

Install whatever the script needs yourself, and run it for me. I do not
use the terminal — tell me the result in plain language.

## Tools

Python 3 with OpenCV (`cv2`), NumPy, and `ezdxf`. Nothing else.

## Behaviour

- Read the PNG with `cv2.imread(..., IMREAD_UNCHANGED)`. Build the mask
  from the alpha channel when there is one, otherwise threshold the
  greyscale with Otsu, dark shape on light background.
- Trace with `cv2.findContours` using `RETR_CCOMP`, so holes in the
  canopy survive as loops of their own, and `CHAIN_APPROX_SIMPLE`.
- Drop contours below a minimum pixel area. Simplify the rest with
  `cv2.approxPolyDP` at a tolerance in pixels.
- Scale so the bounding-box width equals the real canopy width I give
  you, flip the Y axis, and move the origin to the bottom centre of the
  bounding box so the base point lands at the trunk.
- Write an `ezdxf` R2010 document. Set `$INSUNITS` for my units
  (m, mm, ft, in). Define a block whose name I give you, with every
  contour as a closed LWPOLYLINE **on layer 0**, and insert that block
  once at the origin on layer `L-PLNT-TREE`.
- Print the output path, the block name, the polyline and vertex counts,
  and the final width.

Expose canopy width, units, block name, simplify tolerance and minimum
area as options, so I can ask for a different size or a smoother outline
without you rewriting the script. Handle a folder of PNGs in one run.

## What I will check

The tree measures the width I asked for, canopy holes are open rather
than filled, the base point sits at the trunk, and the block geometry is
on layer 0. Tell me if any of those went wrong.
