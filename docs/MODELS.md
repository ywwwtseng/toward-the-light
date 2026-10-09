# Models catalogue

This is a catalogue of every model builder in `src/app.js`, for someone about to reuse or change a model. Per-scene detail (placement, contact, camera) is in [docs/scenes/](scenes/), the rig maths is in [CHARACTER.md](CHARACTER.md), and the rules are in [ART-DIRECTION.md](ART-DIRECTION.md) and [ARCHITECTURE.md](ARCHITECTURE.md).

**Where the numbers come from:**
- Scene triangle counts are from the committed inventory snapshots [`docs/data/inventory-v40.json`](data/inventory-v40.json) and [`docs/data/inventory-v41.json`](data/inventory-v41.json) (`tools/inventory.js`; instanced meshes × count, hero excluded, hidden meshes included).
- Per-helper counts (hero parts, suitcase, daisy, `building()` variants, `street()`) were measured for this document by building the helpers from `src/app.js` with three r128 in the repo's headless Chromium. Values marked "approx." are estimates.
- Code is cited by banner, function and variable names. Line numbers change with every edit.

**Conventions that hold everywhere:**
- **Axes and units:** +y is up, y = 0 is the ground, 1 unit ≈ 1 m.
  - The hero stands about 1.92 to the top of his hair (measured bounding box in the default stance: y −.035 … 1.916). (CHARACTER.md now says the same; older notes used 1.75.)
  - A day facade floor is 1.1.
- **Facing:** every figure faces +z in its own space.
- **No sharing between scenes.** Each scene builds its own copies of everything in `build()`, once, in the loader. `M()` and `B()` create a new material per call; only `cityTones()` materials, the facade textures and the `GLOW` texture are shared.
- **Shadows are automatic** (`buildAll()`):
  - every opaque `MeshStandardMaterial` mesh receives shadows
  - meshes with a world bounding radius < 1.2 cast them
  - instanced meshes, `B()` meshes and transparent materials are skipped
  - To opt a mesh out, clear the flags inside `update()` (scenes 12 and 14 do), because `buildAll()` runs after `build()`.

## 1. Shared helpers

Scene numbers are `SCENES` indices. "Called by" comes from a grep of the scene blocks.

| Helper | Signature | Builds / returns | Geometry · typical tris | Tones | Called by | Pitfalls |
|---|---|---|---|---|---|---|
| `M` | `M(color, opts={})` | `MeshStandardMaterial`: `flatShading:true`, `roughness:1`, `metalness:0`, `side:DoubleSide`, merged with `opts` | — | any | 2–8, 10–12, 15–22, and every helper below | Double-sided by default: pass `{side:THREE.FrontSide}` for floor and slab planes (`ground()`, crack slabs, rooftop panels, rugs). Pass `{flatShading:false}` for smooth things (daisy). Pass `{vertexColors:true}` to show `loftGeo` jitter or per-vertex greys (hero, train, umbrellas, boat). A new material per call |
| `B` | `B(color, opts={})` | `MeshBasicMaterial` (unlit) | — | any | 1–4, 7–12, 16, 18–21 | Never in the shadow pass. Pure white prints as about `#f4` after the film pass, and anything above .8 brightness feeds the glow (strong when `dark`). Scene 8's whole lit shop interior is `B()` |
| `box` | `box(w,h,d,mat,x=0,y=0,z=0)` | `Mesh(BoxGeometry)` at (x, y, z) | 12 tris | — | 2–5, 7, 8, 10–12, 16–20; `building`, `street`, `suitcase` | **Centred:** y is the box centre, not its base (unlike `building()` and the local `bevelBox`) |
| `lights` | `lights(scene,{hemi=[0xffffff,0x777777,.9], dir=[0xffffff,.7,[3,6,4]]})` | hemisphere + shadow-casting key (direction `dir[2]` normalised × 20; ortho shadow camera ±14, near 1, far 60, 1536² map, bias −.0004, normalBias .03, radius 3) + an automatic rim (white, `dir[1]`×.45, at (−x, y·.6, −\|z\|−4)) | 3 lights (1 with `dir:null`) | — | 1, 2, 5, 6 (`dir:null`), 7, 9, 10, 12, 14, 15, 17–20, 22, 23; also `aboutShots()`. Hand-lit instead: 3, 4, 8, 11, 13 (no lights), 16, 21 | The shadow camera covers only ±14 around the light's aim at the origin, so far props get no shadow. The rim is always added: the inventory shows three lights |
| `canvasTex` | `canvasTex(w,h,draw)` | `CanvasTexture` of a 2D canvas you draw on | — | — | 13 (halo rings), 14 (26 page textures 128×160), 16 (`SH` smear), 18 (`SHADOW`, night-city window), 23 (`fadeTex`); `gradTex`, `GLOW`, `facadeTex` | Canvas top = top of a plane (the texture flips Y). One canvas per call: build shared textures once outside loops |
| `gradTex` | `gradTex(top, bot)` | 4×256 vertical gradient texture | — | CSS colours | as `scene.background`: 5, 13, 14, 16, 17, 19, 20, 21, 23; also the wet smear map in 19 | As a background it is screen-space, so it does not move with the camera. Match `scene.fog`'s colour to the horizon tone |
| `GLOW` / `glow` | `glow(scale, opacity=1)` | additive `Sprite`, radial white gradient (128², shared `GLOW` texture), `depthWrite:false` | 1 sprite | white | 6, 7, 8, 12, 14, 17, 19, 20, 21, 22 | Sprites are fogged by default (checked: `SpriteMaterial().fog === true`); set `material.fog=false` for a far sun (20, 21). If the ground clips it, also set `depthTest=false` + `renderOrder=10` (21). Additive, so it does nothing on white |
| `stars` | `stars(n, radius, {seed=1, minY=-1e9, size=1.6, opacity=.9})` | `Points` in a shell `radius·(.6…1)`; `sizeAttenuation:false`, `fog:false` | n points | white | 11 (700, then y forced negative), 12 (1500), 16 (600, `minY:20`), 22 (400) | Rejection loop: `minY` near or above `radius·.6…1` makes it slow, and at ≥ radius it never ends |
| `worldGroup` | `worldGroup(scene, keep=[])` | moves every non-light child of `scene` (except `keep`) into one new `Group`, adds it, returns it | — | — | 1 (`keep:[me]`), 2 (called before the hero is added), 3 (`keep:[pl]`, hero added after). Scene 21 builds its own `world` group by hand | **Only what exists at call time moves.** Props that must slide with the ground must be added before the call. Things that must stay (falling snow in 1, the hero) are added after or kept. Lights never move |
| `ground` | `ground(color, size=400)` | horizontal plane at y 0, `M(color,{side:FrontSide})` | 2 tris | per scene | 1, 2, 4, 5, 6, 8, 9, 10, 14, 16, 18, 19, 20, 21 | Variants in scenes: 2 lowers it to −.004 as the joint tone under the slabs; 21 lowers it to −.4 as a backstop; 9 swaps in `B(0xf5f5f5)`; 16 swaps in `M(0x202020,{roughness:.45,metalness:.1})` (water); 20 uses size 600. Invisible from below. Owner rule: every scene with buildings needs visible ground |
| `loftGeo` / `loft` | `loftGeo(secs,{caps=true, uvTop, uvH, sides=8, rot=0, jitter=0, seed=1})`; `loft(secs, mat, opts)` → Mesh | stacked rings `[y, w, d, chamfer=.35, zOff=0, xOff=0]` joined into a flat-shaded, non-indexed prism. `sides:8` = chamfered rectangle (chamfer × min half-size); any other `sides` = a polygon on the w×d ellipse, rotated by `rot`. `jitter` = per-triangle grey 1 ± jitter in a `color` attribute (seeded) | tris = 2·sides·(rings−1) + 2·sides with caps (e.g. 4 rings × 8 = 64) | via the material | `loftGeo` directly: 3 (lamp trough), 10 (umbrella parts), 13 (crow), 16 (oar blade), 21 (two stone shapes), 22 (lantern); `loft`: 4, 7, 8, 11, 12, 17, 18, 19 (mostly through the local `bevelBox`), `suitcase`, `makeHero` (via its `L()`) | The chamfer field is used only when `sides === 8`. `sides:4, rot:π/4` gives an axis-aligned rectangle at .707 scale (scene 12's book). `caps` defaults to true: pass `caps:false` for open tubes (hidden ends, half the triangles). Jitter needs a `vertexColors:true` material to show |
| `facadeTex` / `FACADE` / `facades()` | `facadeTex(night, seed, variant=0)` → 256×384 canvas texture | 4 windows × 4 floors per tile. Variant 0 punched windows, 1 ribbon/curtain wall, 2 piers with tall windows. `facades()` builds 3 day + 3 night tiles once (seeds 3/5/7 and 4/6/8, `RepeatWrapping`) | — | day wall `#d9d9d9`, glass `#b8b8b8` (15 % `#a4a4a4`), lintel `#9c9c9c`; night wall `#151515`, dark glass `#0a0a0a`, lit windows white α .55–.95 (share .28 / .22 / .3 by variant) | through `building()`; scene 16 reads `FACADE.night` directly for its reflections | The pixel at (0, 383) is the wall colour on purpose: roof faces sample it |
| `cityTones` | `cityTones(night, col)` | cached trim materials: `lip`, `bands[]`, `door` (FrontSide), `dark` | — | day: `col` × .92 / ×.55, .6, .65 / ×.78 / ×.5 (untinted: `0xeaeaea` / `0x8c8c8c`, `0x999999`, `0xa5a5a5` / `0xc6c6c6` / `0x7f7f7f`; tint `0x6a6a6a`: lip `0x616161`, bands `0x3a`–`0x44`). Night: lip `0x1e1e1e`, band `0x0d0d0d`, door `0x262626`, dark `0x1a1a1a` | through `building()` | Cached per `(night, col)` key: editing one material changes every building with that tint |
| `finGeo` | `finGeo(h, wd=.14, dp=.14)` | a vertical fin standing on a wall: front, two sides and a top, open back | 8 tris | `lip` | `building({piers:true})` (instanced) | The open back must lie on the wall |
| `building` | `building(w,h,d,night,{col=null, variant=null, front=[0,1], setback=0, roof=null, piers=false, lobby=true, lip=true})` | facade box (`Mesh`, base at y 0, centre at h/2) with trim children. Option details below the table | plain 24 (box + lip); with podium, door and canopy 72; a 30-tall tower with setback, tank and piers 176 (measured) | facade texture × `col`; trims from `cityTones` | 1 (via `street`), 5, 6 (night, through `place()`), 9, 16 (night), 17, 20 | **Set x and z only.** `position.set(x,0,z)` buried skyline towers before v41; scene 17 sets y −26 explicitly to sink its skyline below the roof. Scene 6 clones `b.material` to animate its emissive; scene 16 reuses `b.geometry` for the reflection, so keep those two properties |
| `street` | `street(scene,{night=false, z0=12, z1=-90, gap=4.2, seed=1, minH=8, maxH=34, detail=-50})` | two rows of `building()`s along −z (front faces toward the road), pavement (2.8 wide, .14 high), kerb, instanced lamp posts (open 6-sided tube + box head, every 11) and bollards (every 8) | 2452 tris for `seed:2` (scene 1's 2454 = this + ground) | pavement `0xdadada`/`0x222222`, kerb `0xbdbdbd`/`0x303030`, posts `0x4e4e4e`/`0x2a2a2a`, bollards `0x8e8e8e`/`0x333333` | 1 only (`seed:2`, day; the night branch is unused) | Adds to `scene` directly; call it before `worldGroup()`. Podium, door and fins only for buildings with z > `detail`; roof furniture only for z > −65. The `r2` stream keeps the original `r()` sequence: inserting a draw into `r` changes every building |
| `suitcase` | `suitcase(person)` → Group | cabin case on `elbows[1]` (his left forearm): 8-sided chamfered shell `.2 × .46 × .34` (64), rib ring (16), carry bar on two posts (36), two trolley caps (24), two 6-sided wheels (48) | **188 tris**, 9 meshes (v40: one box + handle, 36) | shell `0x454545`, trim `0x5a5a5a`, wheels `0x2a2a2a` | 1, 3 | Also sets `arms[1].rotation.z = .2` and `hands[1].grip(1)`. Use it with `stroll(…,{carry:true})`, which keeps that arm's swing small (`hl·.12`, elbow −.05) and never touches `rotation.z`. Wheels stay ≈ .18 above the ground at full swing. Owned by the void-objects group in v41 |
| `rain` | `rain(n, area, seed)` | `LineSegments`: n streaks .45 long in an area × 14 × area box | n lines | white, opacity .25 | 8 (700, 18), 10 (900, 24), 16 (1400, 40), 19 (1100, 20) | Animate `position.y` with a modulo (`-(time*9%14)` style; 16 uses `%7`). Lines are always 1 px wide (WebGL ignores `linewidth`) |
| `petalGeo` | `petalGeo(len, w, {lift=.12, droop=.1, cup=.45, seg=10, cross=4, seed=0})` | smooth, slender, cupped petal along +z, indexed grid; `userData.outline` | seg × cross × 2: **80** by default, 16 at `seg:4, cross:2` | via material | `makeDaisy`, `daisyGeo`; directly in 7 (24 drifting petals, `seg:4, cross:2`) | Smooth shading; the subway petals are an open owner decision (ROADMAP) |
| `centerGeo` / `calyxGeo` | `centerGeo(rc,{seg=22, seed=3})`, `calyxGeo(rc)` | domed, finely bumped hemisphere; green calyx cup under it | 462 (seg 22) / 126 | `0xe79a14` centre, `STEM_C` `0x1d7a2c` | `makeDaisy` (centre also in `daisyGeo`) | The centre alone is 462 tris |
| `leafGeo` | `leafGeo(len)` | pinnately lobed, serrated `ShapeGeometry` leaf along +y, bent | 95 | `STEM_C` | `makeDaisy` | Owner: leaves on opposite sides of the stem, at different heights |
| `makeDaisy` | `makeDaisy({petals=22, missing=1, r=1, stem=0, emissive=0})` → Group | 21 separate petal meshes on pivots (they can open, fall or fly) + centre + calyx; with `stem`: a `TubeGeometry(curve, 28, r·.065, 7)` stem and two leaves | **2850 tris, 26 meshes** with a stem (petals 1680, centre 462, calyx 126, stem 392, leaves 190); 2268 without | petals `M(0xf1f1ec)` smooth, roughness .75; centre `M(0xe79a14, emissive 0x7a4a00)`; stem/leaves `0x1d7a2c` | 2 (`r:.09, stem:.16`), 4 (`r:.06, stem:.13`), 17 (`r:.11, stem:.22`) | **The heaviest single prop, heavier than the hero (1561).** It is 81 % of scene 2's triangles. The look follows the owner-approved reference (`assets/daisy.png`): reducing `seg`/`cross` or the centre's `seg` is the obvious saving, but needs a screenshot check. `userData = {head, petals[{piv,m,a}], rc, petalLen, petalW}`. Daisies stay props in 2, 4 and 17 only, with no flower words anywhere |
| `petalLayout` | `petalLayout(petals, missing)` | two loose rows of petal slots; the first `missing` slots stay empty (the motif) | — | — | `makeDaisy`, `daisyGeo` | — |
| `daisyGeo` | `daisyGeo(petals=18, missing=1, r=1)` | whole head as one vertex-coloured geometry, for instancing | 362 | `DAISY_C`, `PETAL_C` | **none** (see §6) | Dead code since at least v40 |
| `makePerson` | `makePerson({child, father, body, jacket, mat})` | routes to `makeHero({body, jacket, mat})` unless `child` or `father` is set | see §2 | `body` = trousers, `jacket` = coat | every scene with a hero (§2 table) + `aboutShots()` | The `child`/`father` branch is legacy and unreachable (§6) |

**`building()` options in detail:**
- **Seeds:** `s = floor((w·7.3 + h·3.1 + d·5.7)·10)`, plus two fractions `s2` and `s3` derived from it. **Two buildings with the same size and options are identical** (same variant, podium height and tone).
- **`variant`:** facade tile 0–2. Default `s % 3`.
- **Tile mapping:**
  - Day: tile width 2.8, floor pitch 1.1.
  - Night: tile width 2.4, floor pitch .3.
  - Rows are anchored at the roof, so the bottom row meets the podium.
- **`lip`** (default on):
  - parapet `box(w+2o, min(.35, h·.08), d+2o)` with `o = min(.12, w·.03, d·.03)`, `renderOrder 1`
  - pass `lip:false` for tops no camera sees (scene 9 does for h ≥ 32)
- **`lobby`:** day only, and only when `s2 > .25` (one building in four has none).
  - Podium band: `box(w+.2, band, d+.2)`, 10 cm proud, height `min(h·.3, 1.6 + s3·1.4)`, one of three `bands` tones. Cap strip `w+.3 × .1`. Both `renderOrder 1`.
  - Door, on the `front` face: needs h ≥ 5, min(w, d) ≥ 2.2 and door height ≥ 1.4. It is `box(dw, min(2, band−.25), .12)` at `half + .17`, with `dw` 1.8 when the front is wider than 5 (else 1), `renderOrder 2`, FrontSide.
  - Wide fronts also get a canopy `box(dw+.6, .08, .5)`, `renderOrder 2`.
  - Pass `lobby:false` for far buildings: it saves up to 48 tris each.
- **`front`:** `[nx, nz]`, the face that gets the door and fins. `street()` passes `[−sd, 0]` (toward the road); scene 9 passes the face toward the avenue.
- **`piers`:** instanced `finGeo` fins on the front face, `c − 1` of them, where `c = 4·max(1, round(frontWidth/tileWidth))` (tile width 2.8 by day, 2.4 at night). Only when 1 < c ≤ 16. Day or night (no scene passes it at night).
- **`setback`:** a recursive `building(w·.62, setback, d·.62, night, {col, variant, lobby:false})` on the roof, offset `(w·.08, …, −d·.06)`. Roof furniture then goes on that block.
- **`roof`**, all `renderOrder 2`, in the `dark`/`bands`/`lip` tones:
  - `'mast'`: `box(.3)` + open 4-sided tube, height `clamp(h·.12, 1.5, 5)`
  - `'tank'`: plinth `box(1.1, .25, 1.1)` + open 6-sided drum (r .42/.46, h .7); only if the top is wider than 2.4
  - `'box'`: `box(1.3, .8, 1.5)`; only if the top is wider than 2.4
- **Night:** lip only; no podium, door or canopy. The facade uses `emissiveMap` = the tile, intensity .85.

## 2. The hero: `makeHero()`

`makeHero({body, jacket, mat})` builds the faceless, faceted protagonist, reached through `makePerson()`. Gait and pose maths: [CHARACTER.md](CHARACTER.md). v41 changes and their reasons: [model-polish/hero.md](model-polish/hero.md).

**Totals (measured):**
- **1561 tris, 51 meshes, 7 materials.**
- With `suitcase()` it is **1749** tris and 60 meshes.
- 148 of the 1561 tris are the seated pieces (`seatB`, two laps, two knee flaps), hidden while standing.
- v40: 1093 tris, 43 meshes, 6 materials.

**Tones:**

| Tone | Value |
|---|---|
| coat | `jacket ?? 0x3a3a3a` |
| trousers | `body ?? 0x2a2a2a` |
| collar and cuffs | coat × .55 via `Color.getHex()` (truncates): `0x1f1f1f` for the default coat |
| shoes | trousers × .5, capped at `0x101010`, so trousers always read one step lighter than shoes |
| skin | `0xa9a9a9` |
| hair | `0x161616` |
| inner (turtleneck, neck, coat front) | `0x0e0e0e` |

- Every part uses `M(c,{vertexColors:true})`, with ±9 % per-facet jitter (`L()` passes `jitter:.09`, seeds `sd0++`; both skirt panels share seed 77).
- With `mat`, every part shares that one material and the vertex colours are ignored (flip's pale copy, end's reflection).

**Parts** (rings × sides; tris per piece):

| Part | Parent / pivot | Loft | Tris | Tone | Notes |
|---|---|---|---|---|---|
| Pelvis | root | 2 × 6 | 24 | trousers | y .92–1.0, inside the coat's seat piece; ends above the thighs' underside |
| Thigh ×2 | `legs[i]`, hip pivot (±.08, .98) | 3 × 5 | 30 | trousers | The ring above the pivot is a gusset that stays inside the pelvis when the leg swings |
| Shin ×2 | `knees[i]`, .5 below the hip | 5 × 5 | 50 | trousers | knee-cap ring, straight leg, turned-up cuff at the hem |
| Shoe ×2 | `ankles[i]`, .44 below the knee | 5 × 6 | 60 | shoe | Flat heel and toe, 25 cm long. Sole lip (widest ring) at −.02; **sole bottom at −.06 below the ankle** (≈ y −.02 when standing). `stroll()` and the scene-16 boat depend on it |
| Seat piece A / B | root | 3 × 6 each | 36 + 36 | coat | A (to y .72) shows standing; B (short, ends at .92) shows when **either** thigh is past −.6 rad |
| Skirt panel ×2 | pivot at (±.08, .98), follows its leg | 3 × 4 | 24 | coat | Shared seed 77; overlap 2–3 cm at the centre line. The left panel is 1.4 mm deeper and 1 mm lower so they are never coplanar |
| Lap piece ×2 | same pivot | 4 × 4 | 32 | coat | Shown past −.6 rad; follows the thigh 100 % |
| Knee flap ×2 | `knees[i]` | 3 × 4 | 24 | coat | Shown past −.6 rad; hangs down the shin. Its top cap hides inside the lap's end ring |
| Torso | `up` group at y .88 (not exposed: no spine) | 7 × 6 | 84 | coat | Widest at the chest (1.30, .52 wide), then one slope to the collar base: no shoulder plateau |
| Collar | `up` | 3 × 6 | 36 | collar | `.29 → .215` wide, leaning back, so the chin overhangs it |
| Turtleneck | `up` | 4 × 6 | 48 | inner | Rises into the jaw; its top cap is inside the head loft |
| Neck | `up` | 2 × 4 | 16 | inner | (v40: skin tone) |
| Coat front strip | `up` | raw `BufferGeometry` | 3 | inner | A bent V strip 4–6 mm proud of the chest, tucked under the collar |
| Sleeve ×2 | `arms[i]`, shoulder pivot (±.23, 1.36), `rotation.z ±.07` | 4 × 5 | 40 | coat | Its small cap ring sits 6 cm inside the torso (no bump for swings of ±.25) |
| Forearm ×2 | `elbows[i]`, .3 below the shoulder, default `rotation.x −.24` | 2 × 5 | 20 | coat | Single axis: forearms cannot cross the body |
| Cuff ×2 | `elbows[i]` | 2 × 5 | 20 | collar | The palm starts inside it, so there is no wrist gap |
| Hand ×2 (`mkHand`) | `hands[i]`, .255 below the elbow, `rotation.y = side·π/2` | palm 5 × 4 (40) + 4 fingers × 2 segments × (3 × 4) (192) + thumb 3 × 4 (24) + thumb tip 2 × 4 (16) | **272** each, 11 meshes | skin | Children order: `[palm, finger×4, thumb]`. Scene 5 reaches the thumb as `hands[1].children[5]` and its tip as `.children[1]` |
| Skull | `head`, pivot at y 1.59, default `rotation (.05, −.12, 0)` | 5 × 6 | 60 | skin | Faceless gem cut. A post-pass darkens facets: ×.85 at y .13–.2 (under the fringe), ×.7 above .2 (crown), ×.82 below .06 (chin) |
| Hair shell | `head` | 6 × 6 | 72 | hair | Flat top 6 cm above the crown (≈ y 1.91 in world) |
| Fringe | `head` | raw `BufferGeometry` | 2 | hair × .8 (vertex colour) | One bent plate lying on the forehead down to y ≈ .16; never rises above the hair |

Sum: legs 280 + pelvis 24 + seat 72 + skirt/lap/flap 160 + torso group 187 + arms 704 + head 134 = **1561**.

**Default stance** (set at the end of `makeHero`):
- `arms[1].x .04`, `elbows[1].x −.38`, `arms[0].x −.05`, `elbows[0].x −.3`
- `legs[0].z −.035`, `legs[1].z .03`, `knees[1].x .08`
- `head.y −.12`, `up.z .015`
- hands `grip(.18)`

**Coat logic** (each skirt pivot overrides `updateMatrix`; `a` = its leg's `rotation.x`):
- `a < −.6`: the panel hides and the lap and flap show.
- Either thigh `< −.6`: `seatB` replaces `seatA`.
- Follow factor `f = .5` while `userData.walking` (set by `stroll()`, never reset), else .8. From −.45 to −.6 it blends to 1: `rotation.x = a·(f + (1−f)·k)` with `k = clamp((−a−.45)/.15)`. `rotation.z` copies the leg.
- The `walk()` amplitude .45 never reaches the switch.
- The switch is a hard shape swap: a pose animated across −.6 rad on screen would pop.

**Rig API** (`person.userData`; index 0 = his right, local −x). What each scene uses, from the code:

| Key | What | Used by (scene: values) |
|---|---|---|
| `stroll(dist,{amp=.34, carry=false, gaze=.05})` | the walk in place, driven by ground distance | 1: `t·22, amp .3, carry, gaze .1`; 2: `t·9, amp .3, gaze .18`; 3: `t·30, amp .27, carry, gaze .2`; 21: `t·14, amp .3, gaze lerp(.02,−.12,t)` |
| `sit()` | thighs −1.5, knees 1.45, arms −.5, elbows −.7 (crosses the −.6 coat switch) | 4, 8, 16, 19 |
| `float(time)` | drifting limbs | 12 (every frame, inside a rotating `pivot`) |
| `walk(ph, amp=.45)` | old mechanical gait, **rejected by the owner** | none |
| `legs[0..1]` | hip pivots (`x` < 0 forward, `z` spread) | 15: −1.75 (curl); via `sit`/`stroll` elsewhere |
| `knees[0..1]` | `x` > 0 bends | 8: 2.0; 15: 2.25 |
| `ankles[0..1]` | shoe pivots | 8: −.5 (heels on the stool ring); set by `stroll` |
| `arms[0..1]` | shoulder pivots | 4: `(−1.42, 0, ±.2)`; 5: `arms[1] (−.845, 0, .32)`; 8: x −.97; 10: `arms[0].x −.3`; 15: `(−.85, 0, ±.45)`; 16: x `lerp(−1.25,−.6,pull)`, z 0; 17: `arms[1].x −.7`; 18: `arms[0].z −.5`; 19: `arms[1] (−.35, 0, .15)`, `arms[0].x −.7`; `suitcase`: `arms[1].z .2` |
| `elbows[0..1]` | `x` < 0 bends the forearm up | 4: −.15; 5: `elbows[1]` −.78; 8: −.6; 10: `elbows[0]` −2.25; 15: −1.0; 16: `lerp(−.15,−1.2,pull)`, and the oar grip point is elbow-local `(0, −.33, 0)`; 17: `elbows[1]` −.3; 19: `elbows[1]` −2.45, `elbows[0]` −.6; `suitcase` parents the case here |
| `hands[0..1]` + `hand.userData.grip(k)` | 0 open, .18 default, .35 on keys, 1 closed | 4: `rotation.y 0` (palms down), `grip(.35)`; 5: `hands[1].rotation (.454,0,0)`, `grip(.06)`, thumb flat; 10: `hands[0].grip(1)` + `localToWorld` to place the umbrella; 16: both `grip(1)`; `suitcase`: `hands[1].grip(1)` |
| `head` | `x` > 0 looks down | 4: .35; 8: .15; 14: −.55; 15: .9; 17: .45; 18: `(.55,0,0)`; 19: `(.25,0,−.12)` + `getWorldPosition` for the phone; 22: −.3; `stroll` sets it every frame from `gaze` |
| whole group | `position`, `rotation` | 15: `rotation (.25, .4+t·.3, 0)`, y −.55; 18: `rotation.x −π/2` inside `bed`; 12: child of `pivot` at y −.95; 16: child of `boat`; 11/23: mirrored copies (`scale.y −1`) |

**Every hero, by scene:**

| Scene | `makePerson(...)` | Pose | Placement |
|---|---|---|---|
| 1 arrive | default | `stroll` + `suitcase` | origin, `rotation.y π`, outside `worldGroup` |
| 2 crack | default | `stroll` | (0, 0, −1.1), `rotation.y π/2`, added after `worldGroup` |
| 3 office | `{body:0x3a3a3a, jacket:0x2c2c2c}` | `stroll` + `suitcase` | (0, 0, 5.5), `rotation.y π` |
| 4 desk | default | `sit` + typing (above) | (0, −.48, .62), `rotation.y π`; seat top .495 |
| 5 skyline | default | left hand on the rail (above); `rotation.y π + sin(time·.5)·.03` | (−.1, 0, 0) |
| 6 grid | `{body:0x555555, jacket:0x444444}` | default stance | (2, 0, 2), `rotation.y −2.4` |
| 7 subway | default | default stance | (0, 0, .2), `rotation.y π+.25` |
| 8 store | default | `sit` + forearms on the counter (above) | (.4, `PV−.16`, −.68) on the stool |
| 10 umbrellas | default | right arm raised, fist closed | (.1, 0, .2), `rotation.y .3` |
| 11 flip | default + `{mat:M(0x555555)}` copy | default stance | (.4, 0, .2), `rotation.y −.4`; the copy is in the `dark` group with `scale.y −1` |
| 12 drift | `{body:0x4a4a4a, jacket:0x3a3a3a}` | `float(time)` | (0, −.95, 0) inside `pivot` |
| 14 petals | default | head −.55 (looking up) | origin, `rotation.y .3` |
| 15 shards | `{body:0x0e0e0e, jacket:0x232323}` | curl (above) | origin, y −.55 |
| 16 flood | `{body:0x2a2a2a, jacket:0x303030}` | `sit` + rowing stroke | (.1, −.425, 0) in `boat`, `rotation.y π/2` |
| 17 rooftop | default | head .45, left arm reaching | origin, `rotation.y .9` |
| 18 room | default | lying (above) | (0, .76, 1.08) in `bed` |
| 19 call | default | `sit` + phone to ear | (−.35, −.295, −.62), `rotation.y .25` |
| 20 bloom | default | default stance | (2.2, 2, 8) on the roof (y 2), `rotation.y π+.15` |
| 21 field | default | `stroll` | (0, 0, 2), `rotation.y π`, outside the hand-made `world` |
| 22 minusone | `{body:0x5a5a5a, jacket:0x6a6a6a}` | head −.3 | origin |
| 23 end | default + `{mat: MeshBasic 0x2a2a2a, opacity .55}` copy | default stance | origin; the copy has `scale.y −1` |
| About (`aboutShots`) | default | default stance | origin, camera (1.2, 1.1, 5.2) |

No hero in 0, 9 and 13.

## 3. Local helpers inside scene blocks

Defined inside a scene's `build()`, so they are invisible to other scenes. Signatures are as written.

| Scene | Helper | Purpose |
|---|---|---|
| 0 | `mk(w)` | wraps each character in a `<span>` for `#bigTitle` (DOM, not 3D) |
| 2 | `wAt(x)`, `zl(x)` | crack width at x (widest near the daisy); far-edge z limit that keeps the crack out of the caption band |
| 2 | `branch(x,z,a,n,w)` | side-branch polyline, z clamped so it stays out of the camera's foreground |
| 2 | `ribbon(pts, y, k=1)` (+ `P2`) | flat mitred ribbon along a polyline (one quad per segment, no side faces) |
| 2 | `merge(gs)` | concatenates position-only geometries into one |
| 3 | `inst(geo, mat, places)` | `InstancedMesh` from a list of translations, added to the scene |
| 3 | `PX(w,h)`, `PY(w,d)` | planes facing ±x or down |
| 3 | `put(list, f)` | maps the door/blank bay lists to positions |
| 4 | `bevelBox(w,h,d,b,mat,x,y,z,c=.12)` | chamfered box, `loft` 4 rings × 8 sides (64 tris), **base at y**, chamfer `c` on every ring |
| 6 | `roofDraws(h, inner)` | draws the rng values for a block's roof furniture in a fixed order (keeps the layout) |
| 6 | `place(w,h,d,x,z,dist,inner,R)` | `building(…, true)` with cloned emissive materials (animated per block) and roof-part lists |
| 6 | `put(...)` | `place()` with fresh `roofDraws` |
| 6 | `mk(list, mat, geo=unit)` | `InstancedMesh` from `[x,y,z,sx,sy,sz]` lists |
| 7 | `inst(geo, mat, list, parent=scene)` | `InstancedMesh` with a parent (the train) |
| 7 | `bevelBox(w,h,d,b,mat,x,y,z)` | fixed profile: end rings chamfer .1, middle rings .3 |
| 7 | `prism(pts, L, seed)` (+ `face`) | extrudes a closed `[y,z]` profile along x, per-face tone jitter (train car, 9.4 long) |
| 7 | `frameGeo(w,h,t,d)` (+ `quad`) | hollow rectangular frame standing `d` proud (24 tris), so a pane reads as inset |
| 7 | `range(a,b,s)` | number range |
| 8 | `bevelBox(...)` | fixed .1/.3 profile (as 7) |
| 10 | `merge(parts)` | merges `[geo, grey or null, matrix]` into one non-indexed geometry with vertex greys (for one-mesh instancing) |
| 10 | `canopyGeo(R,h)` (+ `pt`) | 8-gore umbrella canopy with rib ridges and a scalloped hem (32 tris) |
| 10 | `tubeGeo(pts, r)` | 4-sided tube along points (the J handle) |
| 10 | `umbrellaGeo(R,h,tone)` | canopy + ferrule + shaft + hook, merged |
| 10 | constants `bodyGeo`, `crowdGeo` | a person under an umbrella, 140 tris, the crowd's instance geometry |
| 11 | `bevelBox(...,c=.12)` | as 4 |
| 11 | `desk(mt, ms, ml, mk, msc)` | desk + laptop + chair group, materials as parameters, so the mirrored copy uses the same models in dark tones |
| 12 | `sheet(w,h,curl,k=2)` (+ `pt`) | curled paper sheet, 4 bands, 8 tris |
| 12 | `clear(p, e)` | rejects orbit origins that would cross his silhouette or the caption strip from the scene camera |
| 12 | `drift(o, X, Y, e=.2)` | places an object at a deterministic orbit origin that passes `clear()` |
| 12 | `pen()`, `mug()`, `phone()`, `book()` | small drifting props (each under ~90 tris; scaled ×2) |
| 13 | `flat(c, o, ord)`, `put(mesh, ord)` | `MeshBasic`, transparent, no depth test, with an explicit draw order |
| 13 | `P(w,h,cx,cy)`, `clear(hh)` | skyline cut-out plane at z 4; roof-furniture clearance against the halo/caption column |
| 13 | `makeCrow()` (+ `add`, `tri`, `along`) | lofted crow with flapping two-part wings (`userData.flap(ph)`) |
| 14 | `leaf(seed, curl)` (+ `pos`, `tri`, `quad`, `F`, `K`) | torn calendar page with UVs, front + back (24 tris) |
| 14 | `bad(a, R, seed, o)` | rejects page fall paths that cross him or the caption strip |
| 14 | `near(x, b)` | re-winds an angle to the nearest turn for the landing blend |
| 15 | `mk(geo, n)` | shard `InstancedMesh` with an emissive floor `0x262626`, `frustumCulled=false` |
| 16 | `pts`, `shell(k, dt, db, jit)` (+ `tri`, `f`) | plank boat hull from seven stations `ST` (51 tris per shell); inner planking = a scaled shell |
| 16 | `railGeo` (IIFE, + `q`, `R`) | gunwale ribbon along the sheer line |
| 16 | `at(x)` | hull section `[halfBeam, sheerY, chineY, keelY]` at x |
| 16 | `bar(p, q, w, m)` | box spanning two points (ribs) |
| 17 | `bevelBox(...)` | fixed .1/.3 profile (as 7) |
| 18 | `bevelBox(...,c=.12)` | as 4 |
| 18 | `contactShadow(w, d, o=.6)` | radial-gradient shadow plane (`SHADOW` texture), `renderOrder 1` |
| 18 | `wallGeo` (IIFE, + `Q`) | back wall with the window cut out and reveal faces (16 tris) |
| 18 | `tube(r,h,x,y,z,rx=0,rz=0)`, `ball(r,x,y,z,mat=frame)` | open 6-sided tube and joint sphere added to the bed group |
| 19 | `bevelBox(...)` | fixed .1/.3 profile (as 7) |
| 21 | `hz`, `vn`, `H(x,z)` | value noise; terrain height, flat for \|x\| < 2 (his path) |
| 21 | `hy(x,z)` | raycast height of the triangulated terrain, so stones sit on the facets |

**Duplicates worth consolidating** (into the `materials & helpers` banner):
1. **`bevelBox`: 7 copies** (4, 7, 8, 11, 17, 18, 19) in two variants.
   - with a `c` parameter, every ring at `c`: 4, 11, 18
   - fixed .1/.3 profile: 7, 8, 17, 19 (the same profile as the suitcase shell)
   - One shared `bevelBox(w,h,d,b,mat,x,y,z,c)`, using the fixed profile when `c` is omitted, can replace all seven without changing a pixel, **provided** the calls in 4, 11 and 18 that rely on their local default `c=.12` (e.g. the desk top in 4) pass `.12` explicitly.
2. **The laptop:** built twice with identical numbers, inside 11's `desk()` and in 18 (`bevelBox(.42,.022,.29,.006,…)`, hinge, lid at −.32). Make it `laptop(mBody, mKeys, mScreen)`.
3. **Instanced-list builders:** `inst` (3, 7) and `mk` (6, 15), plus inline loops in `street`, 2, 4, 5, 8, 10, 17, 20 and 21. One `instanced(geo, mat, list, {scale, colors, parent})` would cover them.
4. **Raw-geometry builders:** `merge` (2, 10) and the many local `tri`/`quad`/`Q`/`q` helpers (7 `frameGeo`, 13, 14, 16, 18, `finGeo`). Make them one `polyGeo(points)` + `mergeGeo(parts)`.
5. **Radial-gradient blob textures:** `GLOW` (white), 16's `SH` (black α .6) and 18's `SHADOW` (black α .5) are the same canvas code. Make it `blobTex(rgba)` + `contactShadow()`.
6. **Caption and silhouette clearance tests:** 12 `clear()` and 14 `bad()` share the projection maths and hard-code the same caption strip (`ny` −.82…−.68, \|`nx`\| < .45–.47). A shared `captionClear()` would keep the caption band in one place (it must match `#caption` in `style.css`).
7. **Pavement plus a lighter kerb stone** ".01 taller and .01 proud": 8 and 19, same pattern.
8. **Three different water tanks:** 17 (8-sided drum, hoops, cap, down-pipe), 20 (6-sided drum and cone on instanced legs), and `building({roof:'tank'})`. Unify only if the owner wants one design.
9. **Seated placement:** `me.position.y = seatTop − .95` (CHARACTER.md) is hand-tuned in 4 (−.48 for a seat top at .495: the known thighs-in-seat issue), 8 (`PV−.16`), 16 (−.425) and 19 (−.295). A `sitOn(person, seatTopY)` helper would document the offset once.

## 4. Triangle budget, v40 → v41

From the two inventory snapshots. **Scene tris exclude the hero.** Meshes include hero meshes; the instanced column is v41 (instances in brackets).

| # | key | scene v40 | scene v41 | ratio | hero v40 | hero v41 | meshes | instanced | main contributor (v41) |
|---|---|---|---|---|---|---|---|---|---|
| 0 | `title` | 0 | 0 | — | 0 | 0 | 0 → 0 | 0 (0) | nothing (DOM title) |
| 1 | `arrive` | 314 | 2,454 | 7.82× | 1,129 | 1,749 | 74 → 193 | 8 (92) | `street()` 2,452: buildings, 24 bollards (288), lamp posts and heads (2 × 216) |
| 2 | `crack` | 3,656 | 3,514 | 0.96× | 1,093 | 1,561 | 137 → 84 | 1 (200) | daisy 2,850; 200 slabs (400) |
| 3 | `office` | 830 | 1,922 | 2.32× | 1,129 | 1,749 | 135 → 107 | 15 (209) | instanced corridor bays (lamp troughs 240; wall boxes 180 each) |
| 4 | `desk` | 3,902 | 4,530 | 1.16× | 1,093 | 1,561 | 87 → 118 | 1 (71) | daisy 2,850; 71 keys (852) |
| 5 | `skyline` | 494 | 3,232 | 6.54× | 1,093 | 1,561 | 85 → 305 | 1 (25) | 62 `building()`s; 25 rail posts (300) |
| 6 | `grid` | 1,754 | 5,078 | 2.90× | 1,093 | 1,561 | 190 → 358 | 4 (116) | night blocks; roof plates 70 (840), lift heads 33 (396) |
| 7 | `subway` | 1,284 | 3,548 | 2.76× | 1,093 | 1,561 | 142 → 137 | 13 (217) | 30 window frames (720), 24 door leaves (288) |
| 8 | `store` | 2,366 | 4,036 | 1.71× | 1,093 | 1,561 | 241 → 210 | 1 (163) | 163 products (1,956) |
| 9 | `towers` | 614 | 1,742 | 2.84× | 0 | 0 | 52 → 135 | 11 (33) | tinted towers with fins and podiums |
| 10 | `umbrellas` | 3,950 | **22,558** | 5.71× | 0 | 1,561 | 10 → 62 | 1 (160) | crowd: 160 × 140 = 22,400 in one `InstancedMesh`. The hero was new in v41 (v40 had a lone cone) |
| 11 | `flip` | 4,730 | 5,386 | 1.14× | 2,186 | 3,122 | 106 → 140 | 0 (0) | sky sphere `SphereGeometry(120,48,48)` 4,512 |
| 12 | `drift` | 80 | 608 | 7.60× | 1,093 | 1,561 | 83 → 108 | 0 (0) | 40 sheets × 8 (320) + small props |
| 13 | `eclipse` | 2,908 | 3,276 | 1.13× | 0 | 0 | 262 → 289 | 0 (0) | ring torus (1,920), disc (128), skyline planes, crows |
| 14 | `petals` | 54 | 626 | 11.59× | 1,093 | 1,561 | 70 → 78 | 0 (0) | 26 pages × 24 |
| 15 | `shards` | 1,280 | 3,440 | 2.69× | 1,093 | 1,561 | 44 → 54 | 3 (320) | plates 160 (1,920), sticks 110 (1,320), wedges 50 (200) |
| 16 | `flood` | 690 | 1,438 | 2.08× | 1,093 | 1,561 | 98 → 159 | 0 (0) | 22 night buildings (24 each) + 22 reflection boxes (12 each); boat |
| 17 | `rooftop` | 3,294 | 5,088 | 1.54× | 1,093 | 1,561 | 105 → 247 | 1 (15) | daisy 2,850; roof furniture, 30 buildings |
| 18 | `room` | 300 | 1,526 | 5.09× | 1,093 | 1,561 | 64 → 128 | 0 (0) | `bevelBox`es (64 each), bed tubes |
| 19 | `call` | 160 | 622 | 3.89× | 1,093 | 1,561 | 58 → 100 | 0 (0) | shelter boxes, roof `bevelBox` |
| 20 | `bloom` | 642 | 2,652 | 4.13× | 1,093 | 1,561 | 93 → 207 | 3 (64) | 46 buildings; low-rise blocks and lips (2 × 360) |
| 21 | `field` | 9,410 | 7,710 | 0.82× | 1,093 | 1,561 | 46 → 58 | 4 (270) | stones 2,700 + 2,160 + 1,200 + 280; terrain 1,320 |
| 22 | `minusone` | 4,800 | 3,600 | 0.75× | 1,093 | 1,561 | 103 → 111 | 0 (0) | 60 lanterns × 60 |
| 23 | `end` | 2 | 2 | 1.00× | 2,186 | 3,122 | 87 → 103 | 0 (0) | veil plane; two heroes |

**Totals:**

| | v40 | v41 | change |
|---|---|---|---|
| Scene tris | 47,514 | 88,588 | ×1.86 |
| Hero tris | 24,118 | 36,279 | 23 figures × 1561, + 2 suitcases |
| All | 71,632 | 124,867 | |
| Meshes | 2,372 | 3,491 | |

**Reading it:**
- **Heaviest scenes:**
  - `umbrellas` (22.6k, one draw call for the crowd, but 160 instance matrices are rewritten every frame)
  - `field` (7.7k)
  - `flip` (5.4k, almost all of it the 48 × 48 sky sphere)
  - `rooftop` (5.1k) and `grid` (5.1k)
  - `desk` (4.5k)
  - `store` (4.0k)
- **The daisy is 2,850 tris on its own** in each of 2, 4 and 17.
- **AGENTS.md asks for "roughly ≤ 2× triangles per scene".** 14 scenes exceed 2× (arrive, office, skyline, grid, subway, towers, umbrellas, drift, petals, shards, flood, room, call, bloom), almost all from very small v40 bases (54–830 tris). Only `umbrellas` is large in absolute terms.
- **Cheaper in v41:** crack, field and minusone.
- **Cheap wins if a budget is ever needed:**
  - the sky sphere in 11 (48 × 48 segments for a vertex-colour gradient; far fewer would do, approx.)
  - the daisy's petal grid and centre
  - the 270 instanced stones in 21 (6,340 of its 7,710 tris)

## 5. Tone ladder

Greys as written in the code (hex). "Hero" is coat / trousers.

| # | Scene | L/D | Background | Ground / floor | Walls / big surfaces | Props | Hero |
|---|---|---|---|---|---|---|---|
| 1 | arrive | L | `0xeeeeee` (fog) | `0xf2f2f2`; pavement `0xdadada`, kerb `0xbdbdbd` | day facades: wall `#d9d9d9`, glass `#b8b8b8`; lip `0xeaeaea`; podiums `0x8c`–`0xa5`; doors `0xc6c6c6` | posts `0x4e4e4e`, bollards `0x8e8e8e`, footprints `B(0xc9c9c9)`, case `0x454545` | `0x3a` / `0x2a` |
| 2 | crack | L | `0xe9e9e9` | slabs `0xe2e2e2` (×.94–1.02) over base `0x7a7a7a`; road `0xbcbcbc` | kerb `0xc8c8c8`, top `0xdadada` | crack `B(0x484848)`, core `B(0x363636)`; daisy | default |
| 5 | skyline | L | `#f3f3f3`→`#d8d8d8` | `0xeeeeee`, strip `0xd8d8d8` | day facades | railing `0xc4c4c4` / `0xb8b8b8`, posts `0xa8a8a8` | default |
| 9 | towers | L | `0xf5f5f5` | `B(0xf5f5f5)` | facades tinted `0x6a6a6a` (lip `0x616161`, bands `0x3a`–`0x44`) | — | — |
| 10 | umbrellas | L | `0xc9c9c9` | `0xb8b8b8`, stripes `B(0xe6e6e6)` | — | crowd vertex greys: canopy .11 (×1.8 for 15 %), body .12/.13, shaft .26; his canopy .075, ferrule .85 | default |
| 11 | flip (t ≤ .5) | L→D | sphere: .95−y·.12 above, .02 below | — | horizon `B(0x999999)` | desk `0xc8c8c8` / `0xaaaaaa` / `0x777777`; mirror desk `0x3a`/`0x2c`/`0x20`/`0x15` | default; copy `0x555555` |
| 17 | rooftop | L | `#f6f1e8`→`#d9d6d0` | panels `0xc6c6c6` over slab `0x9c9c9c` | parapet `0xbdbdbd`, coping `0xdcdcdc`, bulkhead `0xb6b6b6`, door `0x4e4e4e` | tank `0xc2c2c2`, AC `0xc0c0c0`, pot `0x8e8e8e`, soil `0x3c3c3c` | default |
| 18 | room | L | `0xf2f2f2` | `0xf4f4f4`; rug `0x747474` / `0x8c8c8c` | walls `0xe6e6e6` / `0xdedede`, skirting `0xd2d2d2` | bed `0xc4c4c4`–`0xfafafa`, desk `0xbdbdbd`, laptop `0x4a4a4a`, lamp `0x3a3a3a` | default |
| 20 | bloom | L | `#4a4a4c`→`#cfcbc4` | `0x8c8b88` (2 below the roof); roof `0xd4d4d4` | parapet `0xbdbdbd`, coping `0xdcdcdc`; towers tinted `0x6a6a6a`; low-rise `0x5e5d5a` | tank `0xb8b8b8`, stair-head door `0x5c5c5c` | default |
| 23 | end | L | `#efefef`→`#fbfbfb` | none | — | veil `#fbfbfb` | default + copy `0x2a2a2a` @ .55 |
| 3 | office | D | `0x000000` | `0x101010`, ceiling `0x080808` | walls `0x1a1a1a`, skirting `0x262626`, frames `0x3a3a3a`, doors `0x2a2a2a` | handles `0x6e6e6e`, lamp lens `B(0xffffff)`, signs `B(0x777777)` | `0x2c` / `0x3a` |
| 4 | desk | D | `0x050505` | `0x0c0c0c` | desk `0x303030` / `0x262626` | monitor `0x111111`, screen `B(0xe8e8e8)`, papers `0xd0d0d0`, cup `0xdddddd`, chair `0x2a2a2a` / `0x1c1c1c` | default |
| 6 | grid | D | `0x151515` | `0x1c1c1c` | night facades (wall `#151515`, lit windows), lip `0x1e1e1e` | roof decks `0x2c2c2c`, lifts `0x202020`; street lines white .75 | `0x44` / `0x55` |
| 7 | subway | D | `0x0c0c0c` | platform `0x343434`, edge `B(0xdddddd)` | tunnel `0x242424`, ceiling `0x161616`, pillars `0x262626` | train `0x5a5a5a`, windows `B(0xf0f0f0)`, bench `0x3c3c3c`, petals `0xf4f4f2` | default |
| 8 | store | D | `0x060606` | `0x101010`, pavement `0x1a1a1a`, kerb `0x2e2e2e` | lit interior (`B`): ceiling `0xb0b0ac` < sides `0xc8c8c4` < back `0xdcdcd8`; frame `B(0x121212)` | products `0x3a`–`0x84`, counter `0xa8a8a4`, stool and bin `0x12`–`0x16` | default (silhouette) |
| 12 | drift | D | `0x000000` | none | — | papers `0x606060`, mug `0x9a9a9a`, phone `0x303030`, book `0x343434` / `0xb0b0b0` | `0x3a` / `0x4a` |
| 13 | eclipse | D | `#0a0a0a`→`#303030` | none | skyline `0x060606`, windows `0x8a8a8a` | crows `0x050505`, ring white | — |
| 14 | petals | D | `#050505`→`#1d1d1d` | `0x161616` | — | pages (`#f2f2ef` texture × `0xbcbcbc`) | default |
| 15 | shards | D | `0x1c1c1c` | none | — | shards: .05–.2 dark, .22–.4 mid, .9 white (8 %), emissive floor `0x262626` | `0x23` / `0x0e` |
| 16 | flood | D | `#000`→`#1e1e1e` | water `0x202020` | night facades + reflections (α .18) | hull `0x1a1a1a`, planking `0x3a3a3a`, rail `0x5a5a5a`, oars `0x4a4a4a`, wake `B(0x8a8a8a)` | `0x30` / `0x2a` |
| 19 | call | D | `#050505`→`#1a1a1a` | `0x0e0e0e`, pavement `0x1c1c1c`, kerb `0x323232` | shelter `0x202020`, roof `0x262626`, glass `0x777777` @ .18, ad `B(0xf2f2f2)` | bench `0x3c3c3c`, flag plate `0xc4c4c4` | default |
| 21 | field | D | `#000000`→`#0b0b0b` | terrain `0x0e0e0e` over `0x0a0a0a` | — | stones `0x262626` × .8–1.25, sun `B(0xfffbef)` | default |
| 22 | minusone | D | `0x000000` | none | — | lanterns `0x8c8c8c` + emissive white .75 | `0x6a` / `0x5a` |

**The pattern:**
- **Day:**
  - backgrounds `0xc9`–`0xfb` (23's gradient ends at `#fbfbfb`), grounds `0xb8`–`0xf5`, big surfaces about `0xb6`–`0xe6`
  - the exception is `bloom`: a darker sky (`#4a4a4c` at the top) and a `0x8c8b88` ground two units below the roof `0xd4d4d4`
  - props mid-grey `0x70`–`0xc6` (the bed linen in 18 goes up to `0xfa`), with dark accents (doors, laptop, lamp posts, the crack) at `0x36`–`0x5c`
  - the default hero (`0x3a` coat) is the darkest mass in the frame, except in 10, where the umbrella crowd (vertex grey .11) is darker
- **Night:**
  - backgrounds `0x00`–`0x1c` (`0x1c` is shards; the rest are ≤ `0x15`; gradients reach `0x30` at the horizon), grounds `0x0c`–`0x20` (the subway platform is `0x34`)
  - walls and big surfaces `0x16`–`0x34`, props mostly `0x26`–`0x5a` (a few silhouette props go down to `0x11`–`0x1a`; 13's flat skyline and crows are `0x05`–`0x06`)
  - light sources are `B()` at `0xc4`–`0xff`, so they bloom
  - the hero is either default and separated by a key, rim or point light, lifted (grid `0x44`/`0x55`, drift `0x3a`/`0x4a`, minusone `0x6a`/`0x5a`), or darkened with a fill light (shards `0x23`/`0x0e` on `0x1c`)

**Limits learned in v41** (from code comments; the film pass desaturates 25 %, lifts blacks, and glows above .8):
- **crack:** under its key light the slabs saturate to white, so joint tones must sit well below `#ac` to read (hence the `0x7a` base).
- **room:** an upward face lighter than about `0x90` clips to the floor's white (`0xa4` measured 252), so the rug is `0x8c`/`0x74`.
- **drift:** paper at `0x60` stays grey (about `#d8` after the pass); the mug is `0x9a` so its lit side stays grey.
- **shards:** an emissive floor of `0x26` keeps unlit faces from dropping below the `0x1c` backdrop (black holes otherwise).
- **store:** the interior ladder (ceiling < side walls < back wall, shelf backs `0xa0` with `0x3a` edges) keeps shapes legible once the glow blooms.
- **Pure white `B()`** prints as about `#f4`. White on white disappears (ART-DIRECTION): give pale objects a darker ground or a rim.

**The 16-bit depth rule:**
- The 3D pass renders into a `WebGLMultisampleRenderTarget` with a 16-bit depth buffer (r128 default). Depth resolution is about **3e-4 · z²**: ~3 cm at 10 units, ~27–30 cm at 30.
- A face less than that in front of another ties with it and z-fights into stripes.
- **The rule (v41):** trim draws after its parent (`renderOrder` 1–2) **and** stands at least that far proud.
- How the code applies it:

| Where | Clearance used |
|---|---|
| `building()` | lip, podium (+.1 each side), cap strip and fins `renderOrder 1`; door (`.12` deep, 1 cm in front of the podium, FrontSide), canopy and roof furniture `renderOrder 2` |
| 7 subway | every proud panel ≥ .03 in front of the face behind it |
| 8 store | sign-box layers ≥ .03 apart |
| 19 call | flag marks .04 proud |
| 8, 19 kerb stones | .01 taller and .01 proud (seen at a few units) |
| 2 crack, 17 rooftop | flat quads at y 0 over a base whose top is .004 lower (cameras within a few units; at 3 units the resolution is ≈ .003, approx.) |
| 12 drift | props scaled ×2 at a 6–8 unit orbit: faces closer than ~.012 world z-fight, hence open tubes, a page ring instead of a spine, and a screen *block* on the phone |
| 5 skyline | ground strip as a plane at y .05 with `renderOrder 1` |
| 20 bloom | low-rise lips `renderOrder 1` |
| Hero skirt panels | 1.4 mm apart. Only safe because both panels share material and jitter seed 77, so a tie at distance shows the same tone |
| Overlays that must win regardless | `depthTest:false` + `renderOrder`: all of 13 eclipse, 21's horizon halo (`renderOrder 10`), 23's veil (`renderOrder 2`) |

A 24-bit depth texture on `RT` would remove most of these constraints (ARCHITECTURE.md).

## 6. Legacy and unused model code

Verified with `grep` over `src/app.js` (v41). "No caller" means the name appears only in its own definition (or in comments).

| Symbol | Where | Status | Notes |
|---|---|---|---|
| `faceTexture(child, skin, hair, hero)` | `characters` | **unreachable** | Called only inside `makePerson`'s legacy branch, after `if(!child&&!father)return makeHero(…)`. No call site passes `child` or `father` |
| `FATHER`, `SON` | `characters` | **unreachable** | Rig data for that branch |
| `HERO` (the data object) | `characters` | read but unused | `makePerson` evaluates `P = …HERO` and copies `P.col` before the early return; nothing uses it for the hero |
| `makePerson` legacy branch | `characters` | **unreachable** | Everything after the early return, including the `P.hero` blocks (V-front, buttons, curtain-fringe strands, nape) and the old `walk`/`sit`/`float` copies |
| `silMat()` / `SIL` | `characters` | **no caller** | `SIL` stays `null`. `frame()` still runs `if(SIL)SIL.uniforms.rim.value+=…`, and `buildAll()` still checks `o.material.userData.sil`: both are dead conditions |
| `forest(positions, mat, opts)` | `low-poly trees` | **no caller** | "forest" appears elsewhere only in scene 9's banner comment ("a forest of towers") |
| `rock(radius, seed, detail)` | `jittered low-poly rock` | **no caller** | — |
| `daisyGeo(petals, missing, r)` | `daisies` | **no caller** (also unused in v40) | `DAISY_C` and `PETAL_C` are used only by it. `petalLayout`, `centerGeo` and `petalGeo` stay in use through `makeDaisy` (and 7) |
| hero `userData.walk(ph, amp)` | `makeHero` | **no caller** | The owner rejected this gait. Kept so the rig API matches the old one; the coat switch threshold (−.6) is set above its amplitude (.45) |
| scene 23 `veil.position.z=.6; veil.scale.setScalar(lerp(1,1,k))` | `/* 23 — … */` | no-op every frame | Leftovers; safe to delete |
| scene 0 `order` arrays | `/* 0 — … */` | stale | Sized for 7 + 8 letters; "THE LIGHT" has 9 spans, so its last letter never animates (see [scenes/00-title.md](scenes/00-title.md)) |

ROADMAP's cleanup item lists `faceTexture`, `silMat`, the father/child branches, `forest` and `rock`. Add `daisyGeo`, `DAISY_C`, `PETAL_C`, `FATHER`, `SON`, the `HERO` data object, and the `SIL` checks in `frame()`/`buildAll()`. Removing them changes no pixel; re-run `tools/inventory.js` and one screenshot pass after.
