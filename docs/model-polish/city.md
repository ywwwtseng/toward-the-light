# City group (scenes 1 arrive, 5 skyline, 9 towers, 20 bloom) — modelling summary

Branch `model/city`, worktree `scratchpad/wt/city`. Only `src/app.js` is committed. Shared helpers touched: `facadeTex`,
`FACADE`/`facades()`, `cityTones`, `finGeo` (new), `building`, `street`. `building()` is also called by scenes 6 grid,
16 flood and 17 rooftop (night/day users outside this group); its signature, `b.material` (the facade) and `b.geometry`
(the box) are unchanged so grid's `material.clone()` and flood's reflection still work.

## Round 0 (commit 2723c3d) — what changed and why

- **Facades at hero scale.** Day tile is 4 windows x 4 floors over 2.8 x 4.4 units (one floor = 1.1), night keeps the old
  dense 2.4 x 1.2 grid of lights. Three variants (punched / ribbon / narrow piers) seeded by building size; night tiles light
  a seeded share of windows. Tiles are built once (`facades()`), trim materials cached per (night, tint).
- **building() options:** `col`, `variant`, `front` (door face), `setback` (narrower block on top), `roof` ('mast' | 'tank'
  | 'box'), `piers` (instanced fins), `lobby` (podium + door). Parapet lip on every building; by day a darker podium with a
  cap strip and a door.
- **1 arrive:** `street()` gained a pavement step + kerb, instanced lamp posts (4.3 high, head over the road) and bollards,
  podiums, setbacks and roof masts/tanks; all added before `worldGroup()` so they slide with the ground.
- **5 skyline:** the solid grey bar became a railing (concrete base, 25 instanced posts, top rail) with the hero's left hand
  on it; six slender masted towers; setbacks/tanks; a low-rise band and a darker ground strip under the towers.
- **9 towers:** instanced vertical fins on the near towers, parapets, setbacks, masts, hero-scale windows.
- **20 bloom:** parapet with coping, water tank on legs, stair head with door and vent (out of the caption area), a low-rise
  band, skyline with setbacks and masts.
- Deliverable gaps noted by the reviewers: no summary.md, `after_bloom_20.35.png` was a frame of scene 19 (shot lag), and
  `after_grid_6.5.png` was taken at t ~.3. Both are re-shot below with lead-ins.

## Round 1 — reviewer fixes

### Blockers
1. **Podium / door z-fighting (building(), all day scenes).** Root cause confirmed by the technical reviewer: the 3D pass
   renders into a 16-bit depth render target (`WebGLMultisampleRenderTarget`, r128 default = DEPTH_COMPONENT16), so depth
   resolution is ~3e-4 * z^2 (3 cm at 10 m, 27 cm at 30 m) and anything less than that proud of the wall ties with the
   facade. Fix inside `building()`: every trim child draws after the facade and wins the tie (`renderOrder = 1` for lip,
   podium, cap strip, fins; `2` for door, canopy and roof furniture) **and** the offsets are now honest: podium `w+.2`
   (10 cm proud), cap strip `w+.3`, door `.12` deep with its back face 1 cm in front of the podium face, door material
   `FrontSide` so the back face never renders. `after1_towers_9.35/9.65` and the bottom crops
   (`after1_towers_closeup_podiums*.png`, `after1_towers_closeup_door.png`) show solid grey podiums; `d8`-style tests by the
   reviewer already showed renderOrder alone is clean. *Note for the render-loop owner:* a 24-bit depth target
   (`depthTexture` / stencil) would remove the need for draw-order tricks site-wide.
2. **Skyline slender towers buried.** `b.position.set(x,0,z)` reset the y that `building()` sets; now only x and z are set
   (r2 draw order unchanged). The same mistake was caught in my own new low-rise blocks by the bbox dump and fixed. Bbox
   dump (`r1/measure_after.json`, `low5`): no building mesh in scene 5 (or 1, 9, 20) has min.y < 0; the only entries are
   the hero's shoes at -0.02/-0.03 (pre-existing rig).
3. **Hand on the rail.** Measured at the vertex level (`r1/measure1.js --pose`): the previous pose had the palm 7 cm
   above/inside the new rail and 30 cm of finger/thumb penetration. A grid search over shoulder/elbow/wrist angles with a
   "nothing below the rail top while over the rail" test found that a flat palm with a bent elbow is the only clean family
   (a straight arm puts the cuff over the rail, and the cuff is thicker than the palm). Final pose:
   `arms[1] (-.845, 0, .32)`, `elbows[1].x -.78`, `hands[1].x +.454`, `grip(.06)`, thumb laid flat
   (`hands[1].children[5]`: thumb group, its child[1] the distal joint; this is posing, not a rig edit). Result: palm
   contact 0.000 (lowest palm vertex over the rail exactly at the rail top), clip 0, fingertips at z -.575 (4.5 cm past the
   far face, hanging in air). Rail is now `30 x .07 x .1` at y 1.12 (hip-high on the 1.75 hero), posts .7 tall.
   See `after1_skyline_closeup_hand.png`, `_hand_front.png`, `_hand_scenecam.png` (crop of 5.35) and `after1_skyline_5.15`.
4. **Skyline low-rise crates.** The 30 blank instanced boxes are gone; 16 `building(w,h,d,false,{lobby:false,variant:i%3})`
   blocks (2.2-4.5 tall, window rows at 1.1 pitch, parapet lip) stand on y=0 at z -24..-33 (`after1_skyline_closeup_city.png`).
   The ground strip is now a `PlaneGeometry` at y .05 with renderOrder 1 (2 triangles, no coplanar box).
5. **Triangle budget.** Static counts (sum over meshes, instanced x count; `tri_before.log` / `tri_after.log` /
   `tri_after1.log`):

   | scene | original | round 0 | round 1 | growth |
   |---|---|---|---|---|
   | 1 arrive | 1443 | 6747 | 3583 | 2.5x |
   | 5 skyline | 1587 | 5811 | 4325 | 2.7x |
   | 9 towers | 614 | 5570 | 1742 | 2.8x |
   | 20 bloom | 1735 | 5221 | 3745 | 2.2x |
   | 6 grid (night user) | 2847 | 4599 | 4599 | 1.6x |
   | 16 flood (night user) | 1783 | 2047 | 2047 | 1.15x |
   | 17 rooftop (day user) | 4387 | 5815 | 5623 | 1.3x |

   How: podium + door only on buildings the camera passes (`street({detail:-50})`, skyline z > -52, towers |x| < 9,
   bloom none); fins only on the front face and as an 8-triangle open-backed `finGeo` instead of a 12-triangle box; mast =
   open 4-sided tube, tank = open 6-sided drum (tops never seen from below); towers drop lips on towers taller than 32 and
   the setbacks/masts that sat above the frame; lamp posts are open tubes, bollards 12-triangle boxes every 8 m; bloom
   buildings stand on y=0 at half the old nominal height (same silhouette, nothing buried, no underground podiums). The
   rule says "roughly 2x"; towers started from almost nothing (614 = plain slabs), so 2.8x there is 1.1k triangles.
6. **summary.md** — this file.

### Minors addressed
- 1 arrive: podium height seeded per building (1.6-3.0, none on ~1 in 4), three podium tones (+-8 %), double door
  (1.8 wide) with a thin canopy slab on fronts wider than 5; pavement 0xdadada (>= 10 % darker than the 0xf2 road), kerb
  0xbdbdbd. Door height is clamped to the podium (`min(2, band-.25)`, no door under 1.4).
- 5 skyline: rail raised to 1.12 so the bar stays above the caption for the whole .12-.75 window (at .95 it would cross
  the caption at t .12-.35 instead); verified in `after1_skyline_5.35/5.65`.
- 20 bloom: low-rise blocks limited to h <= 2.5 (roofs only), per-instance tones via `setColorAt` (20 % a step lighter),
  plus an instanced lighter parapet lip on each; buildings on the ground (see blocker 5); `after1_bloom_closeup.png`.
- Deliverable images: every position re-shot with a lead-in position and WAIT=12000 (`1.1 1.35 1.65 5.1 5.15 5.35 5.65
  6.3 6.5 9.1 9.35 9.65 16.3 16.5 20.1 20.35 20.65`); `after1_bloom_20.35.png` is scene 20 and `after1_grid_6.5.png` is at
  t=.5. All after1_* files were looked at.

### Not in this group's region (for the orchestrator)
- 16 flood builds its water reflections with `map:FACADE.night` (variant 0) while the tower above may be variant 1 or 2;
  invisible at opacity .18 (`after1_flood_16.5.png` unchanged), but the water-ground owner should use `b.material.map`.
- 17 rooftop still buries its skyline at y=-26 by design (`building()` is day there); visually unchanged.

### Night users checked
`after1_grid_6.5.png` and `after1_flood_16.5.png` match the round-0 look (night = lip only, renderOrder 1 on a 0x1e lip is
invisible, lights at the old pitch).

### Scripts
`r1/measure1.js` (triangles, buried-mesh dump, hand/rail vertex test and pose search), `r1/diag_pose.js`, `closeup.js`,
`tri.js`; shots log `r1/after1_shots.log`.
