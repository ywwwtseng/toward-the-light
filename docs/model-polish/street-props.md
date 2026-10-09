# street-props — scenes 8 store, 10 umbrellas, 19 call

Branch `model/street-props`, worktree `wt/street-props`.
Only the three scene blocks in `src/app.js` changed (diff hunks checked against the `/* N — */` banners); no helper, caption,
camera, hero rig or `key/bg/dark` change. `dist/` was rebuilt locally but not committed (brief: commit `src/app.js` only), so the
integrator should run `./build.sh` after merging. Before/after shots are `before_<key>_<pos>.png` / `after_<key>_<pos>.png` plus
`after_<key>_closeup*.png` in this folder. shots.js printed no PAGE ERROR.

## 8 — store

Audit problems: interior melts into white blobs, feet dangle, the counter slab cuts through the hands, the sign band is empty,
no door, kerb or outside props.

- **Interior tone ladder instead of near-white everywhere.** Ceiling `#b0` < side walls `#c8` < back wall `#dc`, a `#8a` ceiling
  grid between the white tubes. Gondolas are a `#a0` back panel, two sides, a `#50` kick and four `#c8` boards each with a `#3a`
  front-edge strip; the ~180 products are one `InstancedMesh` (`setColorAt`, four greys `#3a–#84`, three heights) instead of 190
  meshes. The glow still blooms the window but the shelves and products stay legible (`after_store_8.65.png`).
- **Shop front with a frame.** Two `.3` pilasters, three full-height mullions, head rail, upper glazing bar and a sill rail across
  the window bays; a door bay at the left (jambs flush with the pilaster, header, stiles, mid rail, kick plate, a lighter push bar)
  with a sloped awning and valance above it; a bevelled sign box (`loft` chamfer, lighter top plate) whose lit face carries one
  dark mark, no text. The `sign` mesh and its flicker are unchanged.
- **Counter and stool.** The window counter is a bevelled `.06` slab with a dark front lip on three brackets, placed so his
  forearms lie on it (forearm underside 1.085 vs counter top 1.08; fingertips end inside the glass line). The stool is a
  hexagonal seat and base, a 6-sided post and a footrest ring; knees/ankles re-posed so his heels rest on the ring (sole .474 vs
  ring top .48). He stays a pure silhouette: no light was added in front of him.
- **Ground contact and outside.** A `.12` pavement under the whole shop with a lighter kerb stone, a second light spill on the
  pavement, the lamp post on a plinth with a head, a dark bin against the right pilaster, a tilted screen on the register.
- The caption area (lower middle) is still only pavement.

## 10 — umbrellas

Audit problems: cones float at y 1.75 with nothing under them in the oblique end frame; no tip, ribs or tone variation; his is
identical to the others.

- **A real umbrella as the instanced mesh.** An 8-gore canopy in two tiers with a ridge along every rib and a scalloped hem
  (`canopyGeo`, 32 triangles), a 4-sided ferrule, a square shaft and a J handle (`tubeGeo`, 4-sided). Each part carries its grey as
  a vertex colour, so umbrella + a 6-sided body with a head is one merged geometry in one `InstancedMesh` (`castShadow` on), and
  nothing floats in the end frame any more (`after_umbrellas_10.65.png`, `after_umbrellas_closeup_crowd.png`).
- Per-instance variety from `rng(66)`: random heading, ±3° lean, scale .9–1.06, 15 % of the crowd a lighter grey via
  `setColorAt`. Flow logic, stripes and camera are untouched; the centre-avoidance radius grew from .95 to 1.25 (jump 1.9 → 2.5)
  because his canopy is larger — otherwise crowd canopies cut into his in the top view.
- **His is different:** biggest (R .58 vs .5), blackest (`#13` vs `#1c`), a pale ferrule, and held in his right hand (makeHero,
  arm raised, `grip(1)`); only the canopy twirls, the shaft and hook stay in the fist (`after_umbrellas_closeup.png`).

## 19 — call

Audit problems: `.06` posts and a `.08` roof read as wire; a slab bench on two sticks; invisible rear glass; nothing for the rain
to reflect in.

- **Shelter with volume.** Four `.1` posts on base plates, a bevelled `.16` roof slab (chamfered plan corners) with a `#10` fascia
  on three edges and a lighter `#3a` gutter under the front edge; rear and left glazing panes with sill, mid and head rails, the
  mid rail at 1.9 so no bar crosses behind his head.
- **Ad panel as an inset frame.** A `.1` frame with a back box; the lit plane sits .04 behind the front face; the bottom bar
  reaches the pavement so the panel is grounded. The point light is unchanged. A gradient plane on the pavement in front of it
  reads as the panel's smear on the wet ground.
- **Bench with slats.** Four `.085` slats on two inverted-U end frames with stretchers; seat height unchanged, his feet still reach
  the kerb top (`after_call_closeup.png`).
- **Bus-stop flag** on a 6-sided pole outside the shelter (light square, a dark band and square, no text); a lighter kerb stone
  along the pavement edge; the street lamp got a bracket arm and a head under its glow.
- Pose, phone-follows-head, car glow, rain and camera untouched.

## Triangle counts (Mesh triangles × instance count, measured in the built page)

| scene | before | after | ratio | meshes before → after |
|---|---|---|---|---|
| store | 3 459 | 5 141 | 1.5× | 241 → 203 (products instanced) |
| umbrellas | 3 950 | 28 787 | 7.3× | 10 → 54 (crowd is one InstancedMesh; the rest is the hero) |
| call | 1 253 | 1 715 | 1.4× | 58 → 92 |

## Concerns

- Umbrellas: the ratio exceeds the "roughly 2×" guideline because the old scene was 160 bare 16-triangle cones; the absolute
  total (~29 k, 156 per person) is well below one forest scene and renders as a single instanced draw call. If it must come down:
  one-tier canopy (32 → 16), hook with 2 segments (32 → 16), ferrule without caps (16 → 8) saves 40 per person (−6.4 k).
- Store: from the dolly's viewpoint the footrest ring sits just behind the sill rail, so the heel contact is correct in the model
  but mostly hidden on screen; the forearms on the counter read as part of the silhouette rather than as separate arms.
- Umbrellas: at the frame edges of the top view, perspective shows bodies poking out from under their canopies (camera 16 units
  up, 45° FOV). It is correct, but a reviewer comparing with the old flat octagons will notice it.

## Round 1 (fixes after the art-director / technical review)

Images: `after1_<key>_<pos>.png` for 8.35 8.65 10.35 10.65 19.35 19.65, plus `after1_store_closeup{,_bin,_lamp,_sign}.png`,
`after1_umbrellas_closeup{,_crowd}.png`, `after1_call_closeup{,_flag,_shelter,_gap}.png`. Numbers below were re-measured with
the reviewers' Box3 script (`r1/measure_r1b.json`). Diff hunks stay inside the three scene blocks (699–745, 766–796, 1017–1037).

### Blockers
- **19 call — flag "barcode" + pole through the face (both reviewers).** The plate is now `.06` deep and sits on top of the
  pole (pole height 2.28, top at world 2.43, plate 2.42–2.88), so nothing pierces the face; the band and square are `.05`-deep
  boxes centred at z `.045`, i.e. `.04` proud of the plate face and with their backs inside it. At 19.15/19.35/19.5 the flag is a
  plain light square with two solid dark shapes (`after1_call_closeup_flag.png`), no stripes, no vertical line.
- **8 store — floating lamp plinth.** Lamp group moved from x −4.4 to −4.1: plinth x −4.23..−3.97 on the ±4.3 pavement, still
  outside the left pilaster (−3.3); glow follows at lamp x+.2 (−3.9). `after1_store_closeup_lamp.png`.

### Minors fixed
- 8 store: feet really rest on the footrest now — ring radius `.265`, ring y `.30`, stool raised `.02` onto the floor-slab top
  (base .14–.17) and the hero with it; soles .458 vs tube top .455, tube z −.43..−.40 under the heels (shoes −.429..−.236).
  Counter raised `.02` with it (top 1.10, forearm undersides 1.096/1.102, cup on the top). `after1_store_closeup.png`.
- 8 store: bin moved to x 2.3, z .9 (in front of the right window bay, near the kerb) and its lid is the same `#12` as the
  body, so it is silhouetted against the lit glass for the whole dolly and no longer reads as the counter running out through
  the pilaster (`after1_store_closeup_bin.png`, 8.85).
- 8 store: sign plane at z .18 and the mark `.02` deep at z .20 (`.03` proud) — no banding (`after1_store_closeup_sign.png`);
  the dead top plate on the sign box is deleted; the ceiling grid bars hang at H−.115 (just under the tubes) instead of
  inside the slab; gondola edge strips `.03` deep and `.03` proud; the counter kick is now exposed (body .1–.9); the door's
  kick plate stands `.03` proud of the stiles. Store triangles 5 141 → 5 129.
- 8 store + 19 call: kerb stones `.01` taller and `.01` proud of the pavement front, so no face is coplanar with the pavement.
- 10 umbrellas: 172 → 140 triangles per person (28 787 → 23 651 for the scene, 6.0× the old 3 950): hook as two segments,
  ferrule without caps, head without caps, and the body is now two 4-sided legs (`.06` gap) under a torso with a real shoulder
  step (.46 wide at 1.48 → .18 neck at 1.56, depth .26 → .14). The two-tier rib canopy is kept as the art director asked. In the
  oblique end frame the crowd reads as people with legs rather than pegs (`after1_umbrellas_closeup_crowd.png`). The umbrella
  offset per person is (.17, 2.0, .1) so the shaft clears the shoulder hull by .022 (was .013).
- 19 call: ad panel and frame moved `.15` left (x .9) and the rear pane/rails shortened to end inside the frame's left post, so
  the gap between the frame and the front-right post is a clear dark gap at 19.5 (`after1_call_closeup_gap.png`); the point
  light is untouched; the wet smear follows the panel.
- 19 call: hero raised to y −.295 (soles .148 on the .15 pavement instead of .037 into it) and the slats lowered to .565
  (bench legs .4, stretchers .515): thighs now sit .015 into the slat tops instead of .085 (`after1_call_closeup.png`). The
  coat skirt still hangs through the bench — hero-group item.

### Not changed (deliberate, for the integrator)
- Umbrellas triangle ratio is still 6.0× (23.7k absolute, one instanced draw call, 140 per person — far below the hero);
  the brief's 2× cannot be met with bodies under 160 umbrellas. Waiver requested in the commit message.
- Umbrellas: the centre-avoidance radius/jump (.95/1.9 → 1.25/2.5) stays as in the first commit because his canopy is larger;
  recorded in the commit message.
- 19 call: the flag plate is lit `M(0xc4c4c4)`, so its tone follows the scene light (mid grey at 19.35); fine against the black sky.
