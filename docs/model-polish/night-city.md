# night-city — scenes 6 grid, 7 subway, 13 eclipse

Branch `model/night-city`, worktree `scratchpad/wt/night-city`, only `src/app.js` changed (scene blocks 6, 7, 13; no helper, no caption, no camera, no key/bg/dark). `building()` is used as is.

Images in this folder: `before_<key>_<pos>.png` / `after_<key>_<pos>.png` at 6.35 6.65 7.35 7.65 13.35 13.65, plus `after_subway_closeup.png` (six crops: door and framed windows, bench, cab front, side view, far wall, pillar/trough), `after_subway_train_side.png` and `after_subway_train_front.png` (diagnostic views with the train frozen in a known phase), `before_subway_closeup.png`, `grid_closeup_before_after.png`, `eclipse_closeup_before_after.png`, `cmp_crows.png` (before left, after right).

Per-frame triangles (renderer.info at the snapped scroll position, before → after): grid 1891 → 3523 at 6.35, 2128 → 3775 at 6.65 (≈1.8×); subway 2969 → 6387 at 7.35 (≈2.15×, the train is 1.7k of that); eclipse 2596 → 2995. Draw calls: grid 113 → 128, subway 139 → 177, eclipse 106 → 148. No PAGE ERROR in any shots run.

Tooling note: `tools/shots.js` with WAIT=9000 lagged behind the scroll target on this shared machine (the first shot of each scene showed the previous scene mid-fade). The after images were taken with a copy of the same page/camera that snaps the page's eased `cur` to the exact position (`scratchpad/snap.js`); the positions and cameras are identical to shots.js.

## 7 subway (priority)

Why: the train was six plain boxes with square holes and vanished into the fog; the platform was a slab with a line; no ceiling, no track, no far wall, nothing that said "station".

Platform: slab top lifted to 0x34 so the dark hero reads on it; the white edge line is exactly as before; a raised 0x4a tactile strip (.03 proud, .3 wide) behind it; instanced floor seams every 2.5. Pillars (same 12 positions) rebuilt as shaft + 0x34 plinth + capital, instanced. A ceiling slab at 3.6 with instanced dark troughs and white lenses hanging .04 below them (replaces the floating light bars at 3.95; the near one now shows above the foreground pillar and the far ones recede at the top of the frame). Track bed at −.9 with instanced sleepers and two 0x6a rails; the rails are only visible from the cab-front diagnostic view because the platform edge hides the bed from the scene camera, as it did before. Far tunnel wall at −5.1 with a dado band, a strip light along its top and four blank lit name boards (no text): this is what fills the frame when no train is present (7.65). A bevelled bench (loft seat and back, two end frames on the floor) behind him at the lower left, out of the caption area. Small lit sign boxes on the two pillars nearest him (above the frame at .65, visible at the top at .35).

Train: one 10-point profile extruded along x (bevelled roof shoulders and skirt, 40 triangles, per-face tone jitter, 0x5a body) shared by six cars; five windows per car as instanced hollow frames (24 triangles) standing .06 proud with the white pane recessed behind the frame front; two door pairs per car as a dark pocket, two leaves and a centre gap, each leaf with a small pane; roof units, gangways between cars, bogies sitting on the rails; cab with a dark windscreen, a lit blank destination display, two headlights and a glow sprite at the near body edge; tail lights on the last car. A point light at (−1,1.6,−.9) ramps up while a car overlaps him so the passing windows rim-light him. Hemi raised .45 → .6 and key .35 → .5 so the body sits at about #30 after the film pass (the known "scene is very dark, train hard to read" issue). Hero stance, camera, petals untouched.

Found and fixed while iterating: the film pass renders into a depth-only render target which three.js r128 allocates as 16-bit, so panels .01–.02 in front of a face z-fight at 5–10 units (dotted door panes in the first pass). Every proud panel now sits ≥ .03 in front of what is behind it; the grid roof decks are .1 thick for the same reason at 20 units. Two point lights on the far wall were tried and removed (no visible effect, halved the headless frame rate).

Concern: the petals are still in the scene (owner decision pending, left as instructed). The name board at x=2 sits behind the foreground pillar at some camera positions; harmless.

## 6 grid

Why: a perfect lattice of 2.6 × h × 2.6 boxes with identical roofs.

About 16 % of cells merge with their +z neighbour into a 2.6 × 6.6 block, 12 % become an L-plan (two wings sharing a corner, lit together), 8 % a slender 1.5-wide tower at 1.5× height, the rest get jittered 2.2–2.8 footprints. Inner 9 × 9 cells carry an instanced lighter roof deck inset .15 (the dark roof around it reads as a parapet lip), lift heads on blocks over 3.6, 6-sided tanks on blocks over 5, masts on the tallest. `building()` output is traversed for emissive materials (so the block-by-block light-up keeps working even if the helper later returns a group). Street grid reveal, glow, camera unchanged. The outer ring is left plain because instanced parts are not frustum-culled and the ring is in fog; podiums were tried and removed, they were invisible from both camera positions and cost 1.9k triangles. The audit's finer-window suggestion was not done because it would mean rewriting the UVs that `building()` sets.

## 13 eclipse

Why: the skyline was flat-topped rectangles; the crows had a scaled-octahedron body and zero-thickness wing quads.

Rooflines: per block a setback storey (28 %), a stair head plus a water tank on two legs (22 %), a billboard frame on two posts (12 %), a low gable only on blocks narrower than 1.1 (10 %), plus the existing masts and window dots; widths now .5–2.3. All flat cut-outs in the same unlit material and render order as before. Crows: a five-sided lofted body (tail root → belly → neck) and a six-sided head, both rotated so the loft axis is the flight axis, the same beak, tail and five-primary hands, and the inner wing as two quads with a .04 spanwise crease so a wing never thins to a line edge-on; two small far crows (scale .4/.34) added to the flock. Flap logic, render-order trick, ring/disc sizes, halo untouched.

Concern: the crows are unlit silhouettes, so the facets show only in the outline; `cmp_crows.png` shows a plumper body and the extra far crows, not a dramatic change. The concentric bands inside the disc rim come from the film-pass bloom kernel, not from this scene, and were left alone.

## Round 1 (fix round, commit 4deafcf on `model/night-city`)

Reviewed against `issues-round1.md`: both blockers fixed, 9 of 10 minors fixed, 1 minor left as instructed (petals, owner decision pending). Only the three scene blocks in `src/app.js` changed. Images: `after1_<key>_<pos>.png` at the six positions, `after1_subway_7.35_notrain.png` / `after1_subway_7.65_notrain.png` (the plain timed shots, where the train happened to be out of frame), and `after1_grid_closeup.png`, `after1_subway_closeup.png`, `after1_eclipse_closeup.png`. The subway after1 frames were taken with the train frozen at x = −3 (page time 3.5 s, the same phase as the round-0 diagnostics) so the doors and the sign-box fix are visible; the camera and position are the scene's own.

### 13 eclipse
- BLOCKER (tank under the disc) and both caption minors: roof furniture (setback, stair head + tank, billboard, gable, mast) is now emitted only when the block is beside the eclipse/caption column (`|cx| > 3.5`, billboards `> 4.5`) or when the piece's top stays below −2.6. Projected onto the skyline plane (z = 4) the halo band and the caption both sit above y ≈ −2.3 and inside |x| < 2.5 at both camera positions, so nothing crosses the ring, the halo or the caption now (`after1_eclipse_closeup.png`, round 0 vs round 1 at 13.35/13.65; `d_ecl_13.5` checked too). The rng draws are unchanged, so the block widths and heights are the same as round 0.

### 7 subway
- Sign boxes raised to y = 2.4 and dimmed to 0xb4 (`.3×.16` box, `.26×.1` pane): out of frame at .35, no white slab near the lens.
- Door pocket now spans .02–1.9 (a plane, not a box) and leaves .04–1.86, both below the roof shoulder at 1.95; checked from a high camera (`after1_subway_closeup.png`, top-left).
- Bench end panels replaced by two `.06×.42×.06` posts plus a `.06×.04×.38` stretcher per end, bench slid from x −1.3 to −1.6; reads as a bench from the front, from behind and at .65.
- Budget: sleepers dropped (never visible from the scene camera; rails lowered to sit on the ballast at −.85 and bogies made .48 tall at −.56 so they sit on the rails and still meet the car floor), floor seams every 5 units, door pockets as planes. Static scene count 5157 → 4643 (main 2377, so 1.95×). Per-frame at 7.35 with a car in frame 4757 → 4145 (reviewer's method; main 1593): still ~2.6× because instanced meshes are never frustum-culled, which the reviewer marked as not required. The 24-tri window frames were kept: their outer side walls are the lit slivers that give the frames depth.
- Petals: untouched (owner decision pending).

### 6 grid
- BLOCKER (L-plan z-fight): the two wings are now butt-joined instead of overlapping. The taller wing is the full 2.6-long box that owns the corner; the shorter wing stops at the taller wing's wall (1.4 long). The footprint and silhouette are the same as the overlapping version, but there is no hidden coplanar face anywhere, so there is nothing to z-fight at any distance (the first attempt, a .02/.04 inset, was discarded: the 16-bit depth target has a step of .1–.4 units at the scene camera's 20–36 units, so a face that close behind another can still stipple). Checked obliquely at (−3,3) and (−2,4) and at the scene camera 6.85 (`after1_grid_closeup.png`).
- Roof furniture: the roof's random draws are taken in the same order and count as before (`roofDraws`) and applied by `place()`, so the 151-block layout is byte-for-byte the same (verified by reproducing both versions offline: identical kinds, positions and heights), but the lift head now takes one corner quadrant, the tank the opposite corner, the mast one of the two free corners. Lift/tank interpenetrations 6 → 0; tanks only on footprints ≥ 2.2 so the .32 radius stays on the deck (7 → 5 tanks). Roof (0,0) shown in the close-up.
- Double blocks: the street segment between the two merged cells is dropped (420 → 398 segments; the reveal still sorts by distance). Verified in the page's line geometry (the (−6..−2, z = 2) segment under the double at (−1,0) is gone, its neighbours remain) and from a street-level camera.
- Per-frame triangles (scene render only): 3461 at 6.35, 3725 at 6.65 (main 1891 / 2128); static 4361 (main 2847, 1.53×).

### Concerns
- The eclipse centre column (|x| ≤ 3.5) now only carries flat-topped blocks plus whatever furniture fits on blocks lower than 1.2; this is intentional calm under the disc, but if the owner wants more silhouette variety there, a setback whose top stays below −2.6 is the only safe piece.
- Subway per-frame count stays above 2× for the frustum-culling reason above; static count is under 2×.
