# Model audit — "Toward the Light" (scenes 1–22 + hero)

Judged from `assets/storyboard.jpg`, 24 fresh shots (`out/shots/s_*.png`, positions 1.4 2.4 3.4 4.4 4.7 5.4 6.4 7.4 8.4 8.7 11.4 12.4 13.4 14.4 15.5 16.4 16.7 17.4 17.65 18.4 18.7 19.4 19.7 20.4), PIL close-ups in `jobs/audit/c*.png`, a hero turnaround (`jobs/audit/hero_poses.png`, rendered with `out/pose_audit.html`) and the reference film frames (`ref/frames`, father at f115–f119 = 342–354 s, bed at f106–f110 = 315–327 s, boat at f097/f101 = 288/300 s, platform at f054 = 159 s). Nothing was committed.

Rules every fix must respect (BRIEF.md): flat shading, ≤ 8-sided cylinders, lofts 4–8 sides, instancing for repeats, no files, no faces, nothing floating or clipping, ground visible under buildings, keep camera/staging, `rng(seed)` only, walk-in-place props added before `worldGroup()`.

Global findings that repeat in many scenes (fix once in the helper, the scene then inherits it):

- **`building()` / `facadeTex()`**: every building is a plain box with one identical tiled window texture (same seed), no parapet, no ground floor, no setback. Close up (scene 1, `c1_facade.png`) the texture reads as wallpaper; far away (5, 9, 20) as noise. Low-poly fix: a parapet lip, a dark lobby band with a door opening, 2–3 facade seeds, vertical pier strips so facets catch light, and L-plans by pairing two boxes in `street()`.
- **`suitcase()`**: a `.13 × .44 × .32` slab with a 3 cm handle — reads as a portfolio, not a suitcase (`c1_suitcase.png`, `c3_hero.png`). Owned by *void-objects*.
- **Hero coat skirt**: the two rigid panels + seat piece form a box the size of a side table in every seated/lying pose (desk `c4_chair.png`, store, flood `c16_boat.png`, call, room `c18_bed.png`) and show a split line down the back when standing. Owned by *hero*.
- **Thin "stick" furniture**: legs/posts of `.04–.06` (room desk, flip desk, call shelter, bed posts) read as wire, not low-poly volume. Low-poly furniture needs `.08–.12` members with a visible chamfer.

---

## 1 — arrive (`city`) — priority HIGH

**Models:** `ground(0xf2f2f2)`; `street(seed 2)` → ~30 `building()` boxes with day facade; hero (`makePerson`) + `suitcase()` (box .13×.44×.32 + two handle boxes); 80 instanced footprints; 1600 snow points.

**Problems**
- The suitcase is a thin tall slab; handle is 3 cm and barely visible; no wheels/caps; it hangs like a folder (`c1_suitcase.png`).
- Buildings are flat boxes with one identical window tile (`c1_facade.png`); no parapet, no base, no roof detail, every tower ends in a knife edge. The avenue is an empty 8.4-unit-wide white plane with no kerb or pavement, so there is no scale cue beside the hero.
- From behind the coat shows a vertical split between the two skirt panels, and the neck is a pale stick (hero item).
- Tone: the white facades + white ground + fog give almost no separation; only the window grid saves it.

**Suggestions (prioritised)**
1. Suitcase helper (void-objects): cabin case ≈ `.34 w × .46 h × .2 d` as a chamfered 8-side loft, a top handle (bar .14×.02×.02 on two posts) at the hand, two 6-sided wheels at the bottom, a horizontal rib line; keep `grip(1)` and verify the hand closes on the bar. Bottom must stay ≥ .08 above the ground at full swing.
2. `building()`: parapet lip (box `w+.2, .3, d+.2` at the top), dark lobby band (3 units, 0x9a9a9a) with a door cut (lighter box), 3 facade seeds, optional vertical piers (instanced .15-wide boxes every 2.4) on the nearest 6 buildings.
3. `street()`: a pavement step (`box(2.2,.15,len)` 0xe0e0e0) in front of each row and 3–4 instanced bollards/benches for scale; they must be added before `worldGroup()`.
4. Give the nearest 4 towers a setback (second narrower box on top) so the skyline is not all the same height profile.
5. Keep the snow points and footprints as they are.

**Do not touch:** the `stroll()` call, `carry:true`, footprint timing, camera.

---

## 2 — crack (`water-ground`) — priority MEDIUM

**Models:** `ground(0xdedede)`; crack = chain of ~20 thin dark boxes (`len × .004 × .03`); 40 white "snow patches" (thin boxes); `makeDaisy({r:.09, stem:.16})`; hero (legs only in frame).

**Problems**
- The crack is a 3 cm dark line that reads as a hair at camera height (`s_2.4.png` shows only faint streaks); the snow patches are random white planks lying on the plane, not snow.
- The pavement has no slabs/joints, so nothing says "pavement" — the daisy is sitting on a blank plane.
- At this magnification the shins are `.06` sticks and the shoes `.08`-wide wedges; at mid-stride the two shoes interpenetrate (`s_2.4.png`, feet crossing).
- The daisy is smooth (TubeGeometry 28×7, SphereGeometry 22) and reads as a different art style from the faceted hero; the owner approved it, so leave the flower but keep it the only smooth object.

**Suggestions**
1. Paving: an `InstancedMesh` of slabs (`1 × .02 × 1`, 0xe4e4e4, .03 gaps, 12×6) so the crack runs between/through slabs; put the crack as a slightly wider (.05) and darker (0x707070) chain with 2 branch segments.
2. Snow patches: fewer (12), lower contrast (0xf0f0f0), irregular 5-sided lofts with .01 thickness, not planks.
3. Feet/legs (hero item): heel + toe sections and a .015 sole so the shoe has a profile at ground level; spread `legs[].rotation.z` enough that the shoes clear each other.
4. Optional: a kerb edge at the far side of the frame to break the horizon.

**Do not touch:** the daisy (owner-approved), the slide direction, the camera.

---

## 3 — office (`interiors`) — priority MEDIUM

**Models:** floor + ceiling slabs, two wall slabs (len 90); every 5 m: ceiling lamp (`box 1.3×.03×.8`, MeshBasic white), 4-sided beam cone, floor pool plane, two door slabs (`.05 × 2.3 × 1.4`, 0x2a2a2a) flush with the walls; point light; hero + suitcase.

**Problems**
- Doors are flush slabs only slightly lighter than the wall: no frame, no recess, no glass, no handle, so the corridor reads as a tunnel with faint rectangles (`s_3.4.png`).
- Ceiling lamps are flat white rectangles glued to the ceiling (cut-out look); nothing recessed.
- Bare walls and floor: no skirting, no floor seams, so the movement of the corridor is only visible through the lamps.
- Suitcase slab and hero coat split as in scene 1.

**Suggestions**
1. Doors: recess (`.08` into the wall), a lighter frame (3 boxes, 0x3a3a3a), a dark glass panel (`B(0x050505)`) in the upper half, a 2-box handle; alternate door / blank wall / door so not every 5 m looks the same.
2. Lamps: a dark trough box (`1.4 × .06 × .9`, 0x111111) with the white lens inset .02 below the ceiling; keep the beam cone.
3. Skirting (box `.05 × .12`, 0x262626) along both walls and a floor seam (thin 0x161616 box) every 5 m.
4. One small sign/exit box on the wall at every other bay (unlit dark box + small lit plane), no text.
5. Suitcase: as scene 1 (helper).

**Do not touch:** `stroll(t*30, {amp:.27, carry:true, gaze:.2})`, the point light, the camera axis.

---

## 4 — desk (`interiors`) — priority HIGH

**Models:** desk top (`1.8×.05×.8`) + two side panels; monitor panel (`.7×.42×.03`), foot and neck behind; screen plane; 5 paper stacks; cup (7-sided cylinder); `makeDaisy r .06`; chair seat (`.5×.05×.45`) + back (`.5×.55×.05`); keyboard slab + 80 instanced keys + space bar; hero in `sit()`.

**Problems**
- The chair is two slabs with no legs, column or base: from the orbit it is a floating plank behind him (`s_4.4.png`, `c4_chair.png`).
- The coat skirt panels in the sit pose form a block as big as the chair, sticking forward over the knees (`c4_chair.png`).
- The desk is a trestle: a thin top on two thin side panels, no drawer unit, no edge thickness — it reads as a plank.
- The monitor panel is a flat box with no bezel step; it reads as a dark rectangle until the screen flickers.
- Tone: everything is 0x1a–0x2a on a 0x05 background; only the screen and papers separate.

**Suggestions**
1. Chair: seat cushion (chamfered 8-side loft, `.48 × .08`), tilted back (`rotation.x ≈ -.1`) with a lumbar gap, a 6-sided column and a 5-arm star base (5 thin boxes + a small cylinder); place it so no part enters the coat panels (check at 4.4 and 4.7).
2. Hero item: hide or hinge the skirt panels when `legs.rotation.x < -1.4` (see hero section) — this scene is where it shows most.
3. Desk: top `.07` thick with a chamfer loft, a drawer pedestal on the far side (`.42 × .62 × .72`, 0x242424, two drawer lines as thin lighter boxes), a small mouse box beside the keyboard.
4. Monitor: a `.02` bezel step (panel 0x111111, a 0x1c1c1c frame box .01 proud, screen inset) — keep the neck behind the panel and the foot flat.
5. Lift desk/chair tones one step (0x303030 / 0x262626) so they separate from the 0x0c floor in B&W.

**Do not touch:** monitor height and stand placement, the keyboard, the hands/forearm pose and `grip(.35)`, the cup + daisy, the camera.

---

## 5 — skyline (`city`) — priority MEDIUM

**Models:** `ground(0xeeeeee)`; 40 day `building()` boxes; railing = one box `30 × .9 × .4` (0xcfcfcf); hero (over-the-shoulder).

**Problems**
- The "railing" is a solid wall; no posts, no rail; from the opening frame it is a grey bar across the picture.
- Over the shoulder the hero's shoulder plateau is a wide flat tent and the neck a pale dowel (`c5_hero.png`) — hero item, but this is the scene that exposes it.
- The skyline is uniform boxes with one tile; no roof silhouettes; the haze does the work.
- The hero's hands do not touch the railing; the left arm just hangs out.

**Suggestions**
1. Railing: concrete base (`30 × .45 × .3`) + instanced posts every 1.2 (`.05 × .5 × .05`) + a top rail (`30 × .05 × .08`) at 1.05; the hero's left hand can rest on the rail (set `arms[1]`/`elbows[1]` so the palm meets the rail — verify in a close shot).
2. Buildings: use the helper's parapet/setback/variant seeds; add 4–6 slender towers (w 2–3, h 45–60) and rooftop masts/water tanks on the nearest 6.
3. A darker low band (0xd8d8d8) under the towers so they do not float in the haze.
4. Hero item: narrower, sloped shoulders; collar hides the neck (see hero).

**Do not touch:** camera path, the slow turn `me.rotation.y`.

---

## 6 — grid (`night-city`) — priority LOW

**Models:** `ground(0x1c1c1c)`; ~145 night `building()` boxes all `2.6 × h × 2.6`; street grid `LineSegments`; glow sprite; hero at (2,0,2) (invisible).

**Problems**
- Every block has the same footprint, so the city is a perfect lattice; no podiums or roof boxes; the windows are large for 1–10-unit buildings (floor 1.2 units).
- The lit windows read well in B&W; the scene mostly works.

**Suggestions**
1. Vary ~20 % of footprints by merging two cells (`2.6 × h × 6.6`) and 10 % as L-plans (two boxes).
2. Instanced roof boxes (lift heads / tanks, `.6 × .4 × .6`, 0x202020) on the tallest 25 %.
3. A finer window repeat for this scene (`h/1.2`, `w/1.3`) or a second small-window facade texture.
4. A `.1`-tall darker podium under each block so they sit on the ground.

**Do not touch:** the block-by-block lighting order, the line reveal, the glow, the camera.

---

## 7 — subway (`night-city`) — priority HIGH

**Models:** platform slab (`60 × .4 × 4`), edge line, track bed slab; 12 pillars + 12 ceiling light bars; train = 6 car boxes (`9.4 × 2.6 × 2.6`, 0x3a3a3a) + lit window planes; hero; 24 drifting petals.

**Problems**
- The train is six plain boxes with square windows: no doors, no roof line, no gap between cars, no bogies, no headlight, so it reads as a wall with holes (`c7_train.png`); in the storyboard it is just a bright stripe.
- Body tone 0x3a on a 0x0c background with fog → the train disappears except for the windows.
- The platform is a slab with a white strip; no bench, no sign, no tactile edge depth; the track bed has no rails.
- The petals contradict the owner's "no flowers" rule (not a model fault, but the item should remove them if the owner objects).

**Suggestions**
1. Carriage model (one group, 6 instances or clones): chamfered body (8-side loft section or a box with four .06 corner strips), a darker roof box (`9.4 × .18 × 2.2`), a window band with dark frames (frame box 0x151515 behind each pane), two door pairs per car (dark `.05`-proud slabs with a centre line), a `.3` gap and gangway box between cars, bogies (two dark boxes `1.6 × .5 × 2.2` under each car), a headlight glow on the lead car; body tone 0x5a5a5a.
2. Track: two rails (thin 0x8a8a8a boxes) on instanced sleepers in the track bed.
3. Platform: a bench (two slabs + 2 legs) behind him, a hanging sign box between two pillars (dark box + small white plane, no text), a yellow-free tactile strip as a .02 raised lighter box.
4. Light: a point light moving with `train.position.x` so the hero is lit by the passing windows.
5. Remove or keep the petals per owner — flag only.

**Do not touch:** the hero's stance/position, the camera, the edge line.

---

## 8 — store (`street-props`) — priority HIGH

**Models:** shop box (back wall, two side walls, ceiling, floor — all `MeshBasic` near-white), 5 ceiling tubes, 2 rows × 4 shelf units + ~190 product boxes (MeshBasic 0x8a–0xbb), counter + register, window counter slab (`5.6 × .05 × .45`), sign band + white sign plane, 5 mullions + transom, stool (seat `.3 × .05` + post), hero in `sit()`, cup, spill plane, glow, lamp post + glow, rain.

**Problems**
- The interior is all unlit near-white, so the film glow turns shelves and products into blobs (`c8_shelves.png`); there is no shape behind the glass.
- The stool is a post with a square seat; his feet dangle in mid-air (`c8_hero.png`) — no footrest, no ground contact.
- The window counter is a 5 cm slab that cuts straight through his hands; nothing supports it (no brackets, no lip).
- The sign band is an empty white plane; the shop front has no door, no awning, no kerb, no outside props — scale is only the hero.
- Register is a dark box; counter a bright block.

**Suggestions**
1. Interior tone steps: shelves 0xb0b0ac with dark shelf-edge boxes (0x3a3a3a `.02` strips), products in 0x50–0x98 with 3 heights, a dark ceiling grid (thin 0x4a boxes between tubes); the glass stays bright, the shapes become legible.
2. Stool: 6-sided seat, a footrest ring (4 boxes or an 8-side torus) at `.3`, and put his shoes on it (adjust `knees` so the soles rest on the ring).
3. Counter: `.07` thick with a front lip and two wall brackets, raised so his forearms rest on it and the hands do not pass through (check at 8.7).
4. Shop front: a door bay (narrower mullion spacing + two handle bars) at the left, a `.25` awning box above the sign, a kerb step along the pavement, an outside bin / ice-box (dark boxes) by the glass.
5. Sign band: dark band with one lighter block shape (no text).

**Do not touch:** the Hopper staging (dolly from across the street), the silhouette idea, rain and spill.

---

## 9 — towers (`city`) — priority MEDIUM

**Models:** MeshBasic white ground; ~70 `building()` boxes (col 0x6a6a6a, 1.5–4.5 wide, 15–55 tall); no hero.

**Problems**
- Towers are flat slabs with the same window tile; none has a corner chamfer, fin, parapet or setback, so the "forest" is a set of grey planks (`sb_9.png`).
- The gap in the centre is empty white; fine for haze, but nothing crosses it.

**Suggestions**
1. Nearest 12 towers: vertical fins (instanced `.12 × h × .3` boxes every 1.2 along the facade) so the facets catch light while rising past them.
2. Parapet lips and a setback block on the tallest third; 2–3 antenna masts.
3. Vary plans: 20 % L-plans (two boxes), 20 % slender (w 1.5) + a stub.
4. Optional: one or two sky-bridges (thin boxes) between close towers, well above the camera path.

**Do not touch:** the camera glide, the white haze, the absence of the hero.

---

## 10 — umbrellas (`street-props`) — priority HIGH

**Models:** `ground(0xb8b8b8)`; 7 crossing stripes; 160 instanced `ConeGeometry(.5,.22,8)`; hero umbrella (same cone); rain.

**Problems**
- From above the cones are flat black octagons (`sb_10.png`) — acceptable; but the camera ends oblique (`t→1`: 6 high, 7 back) and the umbrellas are then cones floating at y 1.75 with nothing under them: no people, no shafts, no shadows. "Floating" is a standing owner rejection.
- No ferrule tip, no rib hint, no tone variation; his umbrella is identical to the others, so the "mine" of the caption has no model cue.

**Suggestions**
1. Add a second `InstancedMesh` of bodies under the cones: a 6-side loft (shoulders `.42` wide at 1.5, waist `.3` at .9, legs merged `.26` at 0; 0x1a1a1a) + the shaft as a thin box inside; same matrices as the umbrellas, offset −1.75. This fixes the oblique end frame.
2. Umbrella: height `.3`, a `.02` rim lip (second ring) and a ferrule (6-side cylinder `.015 × .1`) on top; 8 sides stay.
3. Tone: 15 % of instances 0x303030 via `setColorAt`; the hero's umbrella 0x0a0a0a with the ferrule lighter (or a slightly larger scale) so it is identifiable.
4. Faint contact shadows: a small dark ellipse plane (instanced) on the ground under each person at the oblique end (optional; the dir light already casts if bodies cast).

**Do not touch:** the flow logic and the avoidance of the centre, the crossing stripes, the camera.

---

## 11 — flip (`interiors`) — priority MEDIUM

**Models:** sky sphere (vertex colours), horizon plane, stars; `desk()` = top `1.4 × .05 × .7` on 4 legs `.05`, laptop base + lid, chair seat + back; hero; dark mirrored copy (`scale.y = -1`) of both.

**Problems**
- The desk's `.05` legs read as a wire cage (`c11_desk.png`); the laptop lid is a `.02` plane; the chair is two slabs with no legs and is nearly invisible.
- No tone separation between desk top, legs and laptop in the light half (all 0xbbbbbb).

**Suggestions**
1. Desk as a volume: top `.07` chamfered, two side panels `.05 × .72 × .62` (or one pedestal box) instead of 4 sticks; a back modesty panel.
2. Laptop: base `.45 × .03 × .32` with a darker key area plane, lid `.03` thick with a dark screen inset; the dark copy gets a lit screen (0x999999) so the mirrored world also reads.
3. Chair: 4 legs `.04` + seat `.06` + back with two uprights; or a stool.
4. Tones: top 0xc8c8c8, panels 0xaaaaaa, laptop 0x777777.

**Do not touch:** the sphere, the horizon line, the camera roll, the mirrored copy mechanism.

---

## 12 — drift (`void-objects`) — priority LOW

**Models:** stars; glow; hero in `float()`; 40 paper planes (`.21 × .3`, MeshBasic 0xdddddd).

**Problems**
- The papers are flat unlit quads of one tone — they read as confetti/shards, not paper (`s_12.4.png`).
- The coat skirt panels hang as a stiff block in the float pose (`c12_hero.png`); hero item.

**Suggestions**
1. Papers: a 2-quad bent sheet (fold ~15°) with `M(0xdddddd)` so the key/rim lights shade the two halves; 30 % slightly smaller; vertex tone jitter.
2. Optional: 4–6 sheets carry a printed block (canvas: a few grey lines, no words).
3. Hero: see hero section (panels).

**Do not touch:** `float()`, the pivot rotation, the orbit.

---

## 13 — eclipse (`night-city`) — priority LOW

**Models:** halo sprite (canvas), ring torus, black disc, skyline planes + antenna strips + window quads, 4 crows (octahedron body, 8×6 sphere head, 4-side cone beak, triangle wings with 5 primaries, wedge tail).

**Problems**
- The crows read well (`c13_crows.png`) — the primaries and wedge tail do the job.
- The inside of the disc shows concentric bands near the rim (film-pass glow bleeding from the ring, plus the halo texture's three strokes); cosmetic.
- The skyline is flat silhouettes — appropriate for this shot.

**Suggestions**
1. Leave the crows; at most add two tiny far crows (scale .4) for depth.
2. Halo canvas: one stroke with a wider blur instead of three, so the rim bands are smoother.
3. Skyline: a few roof water-tank silhouettes (small planes) on the taller blocks.

**Do not touch:** the render-order trick, the crow flap, the disc/ring sizes.

---

## 14 — petals = calendar pages (`void-objects`) — priority MEDIUM

**Models:** `ground(0x161616)`; hero (head back −.55); 26 page planes with "DAY n" canvas textures; dawn glow.

**Problems**
- Pages are rigid planes; landed pages render as pure white blobs under the glow (`s_14.4.png`, known).
- With the head tilted back the hair fringe plane reads as a bright horn/crown on top of the head (`c14_hero.png`) — hero item, but this scene exposes it most.
- The ground is a bare plane; fine.

**Suggestions**
1. Pages: a 2-quad fold (8–12°) and a darker landed tone (swap to 0xd0d0d0 or lower emissive when `k ≥ 1`) so the ground pages read as paper, not light.
2. A torn top edge: a thin dark strip on the canvas top plus a 1-px jagged line (texture only, no geometry).
3. Hero: fringe plane shading/position (see hero).
4. Optional: 3–4 pages leaning against each other on the ground (rotated 60°) so the pile has volume.

**Do not touch:** the DAY textures, fall timing, the dawn glow.

---

## 15 — shards (`void-objects`) — priority LOW

**Models:** hero curled (`rotation.x .25`); 320 instanced tetrahedra (flattened scales, per-instance grey).

**Problems**
- Until ~t .5 the hero is hidden behind the nearest flat shards (`s_15.5.png`); the shards themselves read as broken glass — acceptable.
- The curled coat forms a slab (known; hero item).

**Suggestions**
1. Push the inner radius (`d: .6+r()*1.2` → `1.3+r()*1.2`) and scale the nearest 20 % smaller so he is visible from t ≈ .25.
2. 5 % of shards brighter (0.75–0.9) for sparkle; a few long needles (scale `.1,.05,1.6`).
3. A low fill light from the camera side so the figure is not only rim-lit.

**Do not touch:** the curled pose, no trembling, the explosion easing.

---

## 16 — flood (`water-ground`) — priority HIGH

**Models:** stars; water plane (roughness .35); 22 night `building()` + mirrored reflection copies; rain; boat hull (deformed 6-segment box), thwart (`.12 × .04 × .9`), 2 oars (shaft box + blade box + grip box) aimed from the hands, 2 oarlock boxes; hero in `sit()`.

**Problems**
- The hull is a good faceted shape but has no gunwale, no stem, no keel, no ribs; it reads as a hollow wedge (`c16_boat.png`). Reference boat (f097 at 288 s, f101 at 300 s) shows a raised bow stem, a gunwale strip and a thwart board.
- The near oar passes through the hull side: the oarlock sits at `z ±.5` (inside the hull wall), so the shaft cuts the gunwale.
- Only one thwart; his shoes hover inside the hull; the coat panels form a block in front of the shins.
- The oar blade is a flat box; the far oar is hidden behind him from the side (fine).

**Suggestions**
1. Gunwale: two thin lighter rails (0x4a4a4a, `.05 × .05`) along the top edges + a bow cap wedge; a stem piece (`.08 × .35 × .12`) at the bow; a keel strip under the hull.
2. Oarlocks at the gunwale (`z ±.56, y .5`) with a visible U (two small boxes) so each shaft rests on it and leaves the hull cleanly; re-check the aim (the code already re-aims every frame).
3. Two thwarts (`1.0 × .04 × .16`) — one under him, one forward; a floorboard plane inside so his feet rest on something (`y .14`).
4. Blades: 4-side loft, wider (`.16`) and slightly cupped; shaft slightly thicker (`.045`).
5. Hero item: coat panels in sit pose.

**Do not touch:** the oar aiming from the hands, the stroke animation, the building reflections, the rain.

---

## 17 — rooftop (`water-ground`) — priority MEDIUM

**Models:** roof slab (`10 × .3 × 8`), two parapet slabs (`.15` thick), stairhead box + antenna pole, 30 buildings below, pot (6-side cylinder), `makeDaisy r .11 stem .22`, hero reaching, sun glow.

**Problems**
- The parapet is a `.15` wall with no coping; the roof edge is a knife; from 17.4–17.65 the stairhead and antenna are out of frame, so nothing but the parapet says "roof" (`s_17.4.png`, `s_17.65.png`).
- The pot has no rim, no soil, no saucer; the stem rises from a flat top.
- Shadows and the reach pose are good; the daisy is approved.

**Suggestions**
1. Parapet: `.3` thick with a lighter coping cap (`.4 × .06`, 0xd8d8d8); a fascia strip on the roof slab edge.
2. Pot: rim ring (6 sides, `.17 → .18`, `.03` tall), a dark soil disc `.01` under the stem, optional saucer.
3. Bring a rooftop prop into frame on the left: a water tank on 4 legs (6-side cylinder `.5 × .7`) or a vent pipe with an elbow — small, behind the hero's line.
4. Roof surface: 3–4 faint seam lines (thin 0xc4c4c4 boxes) to break the blank slab.

**Do not touch:** the daisy, the reaching arm, the sun rise, the camera arc.

---

## 18 — room (`interiors`) — priority HIGH

**Models:** `ground(0xf4f4f4)`; back wall + side wall; window plane (canvas city) + sill + head + mullion; bed = frame slab, mattress, pillow, 4 bare posts; hero lying (`rotation.x -π/2`); desk top + 2 legs (back only); laptop base + lid; lamp pole + sphere bulb + point light.

**Problems**
- The bed has no headboard or footboard — four bare posts and a white slab (`c18_bed.png`); no blanket; the reference bed (f106–f110, 315–327 s) has a tubular head/footboard with vertical bars and a rolled rail, which is what makes it read.
- The hero's coat panels make a box under his thighs; the body lies on top of the mattress, not in it (fine), but the box is visible.
- The desk has only two legs at the back, so it floats at the front (`c18_desk.png`); the lamp is a `.03` stick with the bulb behind it.
- The window is a flat texture with a `.05` frame and no reveal; the walls have no skirting, no door.

**Suggestions**
1. Bed: headboard and footboard = two posts (`.05`, 6-side cylinders ok) + top rail + 5 instanced vertical bars (`.025`), mattress `.2` thick with a chamfer, a folded blanket slab (`.9 × .08 × .9`, 0xe0e0e0, with a `.06` rolled edge box) over the lower half, a pillow with a dent (two boxes) — keep the head resting on it.
2. Desk: add the two front legs (or make it a wall shelf with two brackets); top `.06`; lamp with a base disc, an angled arm and a 6-side cone shade enclosing the bulb.
3. Window: a reveal (`.12` deep side boxes) and a thicker sill; a blind box above (optional).
4. Room: skirting line (box `.05 × .1`) on both walls, a door slab recessed in the side wall with a handle, a rug plane under the bed (0xe8e8e8).
5. Hero item: skirt panels when lying.

**Do not touch:** head/pillow contact (`head.rotation.x = .55`), the camera, the city texture.

---

## 19 — call (`street-props`) — priority HIGH

**Models:** `ground(0x0e0e0e)`; kerb slab (`30 × .15 × 2.2`); shelter roof slab (`3.4 × .08 × 1.4`) + 4 posts `.06`; ad panel + frame; glass pane (transparent box); bench slab (`2 × .06 × .42`) + 2 legs; hero in `sit()` with phone; phone box + glow; street lamp pole + glow; rain; passing car glow.

**Problems**
- The shelter is drawn with `.06` posts and a `.08` roof: it reads as wire, not as a bus shelter (`s_19.4.png`, `s_19.7.png`); no fascia, no sign, no bus-stop flag, no base plates.
- The bench is a single slab on two sticks; no slats, no back, no end frames.
- The rear glass is almost invisible; the kerb is a slab; no puddle, so the rain has nothing to reflect in.
- The phone works (glued to the head); his feet reach the kerb top — fine.

**Suggestions**
1. Shelter: posts `.1` with base plates, a roof profile `.16` thick with a darker fascia strip and a `.2` overhang, a route-sign box on the left post (dark box + small white plane, no text), a bus-stop flag pole at the end.
2. Bench: 3 slats (instanced `.06 × .05`) on two end frames (`.06` boxes) with a back rail; his seat height stays at .62.
3. Glass: a thin frame grid (2 horizontal + 1 vertical boxes) so the pane reads.
4. Puddle: a MeshBasic 0x1c1c1c plane under the shelter with a mirrored lit plane of the ad panel (scale.y −1, opacity .25) — the rain scene gains a reflection cheaply.
5. Kerb step: a lighter `.12` box edge along the pavement.

**Do not touch:** the phone-follows-head logic, the sit pose, the ad light, the camera push.

---

## 20 — bloom = sunrise (`city`) — priority MEDIUM

**Models:** `ground(0x8c8b88, 600)`; 46 day `building()` (col 0x6a6a6a); sun disc + halo; roof slab (`40 × .4 × 14`) + parapet (`.15`); hero.

**Problems**
- The roof is a flat slab with a thin parapet; the white ground at y 0 shows as a bright sea between the roof and the city (`s_20.4.png`) — the ground must stay (owner rule) but it reads as water.
- The buildings are uniform boxes with the same tile; the skyline has no silhouette — no parapets, setbacks, masts.
- The hero stands fine; the shadow grounds him.

**Suggestions**
1. Parapet with coping (`.3` thick, lighter cap) and a fascia on the roof slab; two rooftop boxes (vent, water tank) at the sides, out of the caption area.
2. Buildings via the helper: parapets, setbacks on the tallest 30 %, 3–4 antenna masts, L-plans; use the sparse-window facade variant at this distance.
3. Ground tone: 0x9a9a98 with a subtle darker band (a long low box row of far blocks at y 0–1) so the plane reads as streets, not sea.
4. Keep the sun disc + halo.

**Do not touch:** the sun rise, the visible ground under the buildings, the camera.

---

## 21 — field (`water-ground`) — priority LOW

**Models:** `ground(0x0a0a0a)`; sun disc + 2 halos; 260 instanced dodecahedron stones; hero (`stroll`).

**Problems**
- Nothing wrong with the models; the hero is backlit and nearly black (known, lighting).

**Suggestions**
1. Leave the stones; at most a faint ground haze band (a MeshBasic 0x101010 plane far ahead) so the horizon is readable.
2. A tiny fill (hemi .35) from behind the camera — lighting, not a model change.

**Do not touch:** everything the owner iterated (darkness, one light, no grass), the stroll, the camera.

---

## 22 — minusone (`void-objects`) — priority LOW

**Models:** stars; hero (lighter coat 0x6a6a6a); 60 light spheres (8×6, `.05`) + glow sprites.

**Problems**
- None of substance; the lights are dots, the ring and gap read.

**Suggestions**
1. Optional: lights as 6-side faceted gems (`OctahedronGeometry(.05,0)`) so they fit the style up close in the top-down end frame.
2. Keep the hero lighter than in other scenes (he must read against black).

**Do not touch:** the ring gather, the gap, the camera rise; no ground ring (owner removed it).

---

## 99 — hero (`hero`) — priority HIGH

**Models (`makeHero`):** 5–6-side lofts: hips, thighs, shins, 4-side shoes on ankle pivots; coat seat + two rigid skirt panels (`updateMatrix` override); torso wedge (6 sides); inner collar + V-notch triangle; shoulders/forearms (5 sides); hands (palm + 4 fingers + thumb, rebuilt); neck stub (4 sides); gem head (6 sides); hair shell (6 sides) + fringe triangle.

**Judged against the father (f115–f119, 342–354 s):** the father is a tall, slightly stooped block — steep sloped shoulders, a bulky high collar/scarf that hides the neck, a boxy hip-length parka, long legs in *mid-grey* trousers, dark boots from mid-shin, small head with flat-top hair swept to one side, hands small and in the skin tone. Our hero keeps the faceless gem head and long coat (owner-approved); the weaknesses are in the shoulders, neck, legs/shoes, the coat skirt and the fringe.

**Problems** (`hero_poses.png`, `c5_hero.png`, `c3_hero.png`, `c14_hero.png`, `c4_chair.png`, `c18_bed.png`)
1. Shoulders: the torso loft jumps from `.54` wide at 1.3 to `.56` at 1.4 and collapses to `.18` at 1.52 — a flat plateau that reads as a coat hanger/tent from behind and above (scene 5, scene 3). The reference has rounded, steeply sloping shoulders.
2. Neck: a `.075` pale stick between the collar and the head (every scene with a back/side view); the reference hides it in the collar.
3. Coat skirt: two rigid panels + seat → a block in `sit()` (desk, store, flood, call), a slab when lying (room) and curled (shards); a split line down the back when standing.
4. Legs: shins `.06` wide and trousers 0x1a1a1a on 0x12 shoes — sticks that vanish in dark scenes; the reference legs are long and a tone lighter than the jacket.
5. Shoes: `.1 × .27 × .06` wedges with no heel or sole lip; they clip each other at mid-stride in the low shot (scene 2).
6. Hair fringe: the single triangle reads as a bright horn/crown when the head tilts back (scene 14) and as a blade from 3/4.
7. Hands: pale (0xa9a9a9) and large relative to the reference, but just rebuilt — leave.

**Suggestions (prioritised; rig API unchanged, no face)**
1. Shoulders: taper the torso loft (`[1.3-base, .50, .28] → [1.4-base, .46, .25] → [1.47-base, .34, .2]`) and move the shoulder pivots down/in slightly (`y 1.33`, `x ±.22`) so the sleeves hang from a sloped yoke; add a small shoulder cap ring on the upper arm loft so there is no step. Check the back view in scene 5 and the walk in scene 3.
2. Collar/neck: raise and widen the inner collar loft (`1.46 → 1.63`, `.13 → .17` at the top, 4 sides) and give the neck the inner tone (0x0e0e0e) so it disappears into the collar as in the reference.
3. Coat skirt: when `legs[i].rotation.x < -1.4` hide the panel and show a short lap wedge (one 4-side loft from hip to knee, following the thigh at 100 %); or add a knee hinge section following the knee at 50 %. Keep the 50 %/80 %/92 % walking factors for standing/walking.
4. Legs + tone: shins `.11/.12 → .085/.09`, trousers one step lighter than the shoes (0x222222 with jitter .12), a cuff ring at the hem; this restores the leg silhouette in dark scenes without changing the rig.
5. Shoes: 3-section loft (heel block, instep, toe cap) `.3` long with a `.015` sole lip and a slight heel; check `stroll()` foot clearance and the crossing in scene 2 (`legs[].rotation.z` spread).
6. Fringe: thicken the hair shell at the front with one more ring and tuck the fringe plane `.02` inward / darken it with the hair vertex tone, so it never reads as a horn.

**Do not touch:** hands and `grip()`, `stroll()` and the ankle logic, the faceless gem head, the rig fields in `userData`, the per-facet jitter.
