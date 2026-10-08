# Reference style guide: modelling props the way the reference film does

Written from a frame-by-frame study of the owner's reference film ("Through the Dark", screen recording, one frame
every 3 s). Frame `fNNN` = `(NNN-1)*3` s, files in `scratchpad/ref/frames/fNNN.jpg`; contact sheets `ref/sheet2-4.jpg`.
This is the bar the owner means by 「可參考原本影片」. Everything below is meant to be applied with the helpers that
already exist in `src/app.js` (`box`, `loftGeo`/`loft`, `M`, `B`, `canvasTex`, `InstancedMesh`, `rng`). Hard rules in
`jobs/BRIEF.md` still apply: flat shading, cylinders ≤ 8 sides, spheres ≤ 8×6, lofts 4–8 sides, no model files.
Nothing in this guide asks for a face on the hero, for new flowers, or for any text change.

## 1. Why the reference's low-poly look works

**Facet density is proportional to size and importance, never uniform.** Big set pieces (icebergs f099–f102, snow
terrain f046–f047, the room f052) are 10–40 large planes each. Furniture is almost pure extrusion: a bed is ~25 boxes
and tubes (f106). Only the two characters and the animals (bear f048–f050, dog f085) get a few hundred facets. A prop
that has more facets than the hero standing next to it is wrong.

**Edges are softened only where light will catch them.** The boat's gunwale is a lighter strip along the sheer line
(f096, f101); the bed's rails and mattress have rounded corners (f106, f110); the platform in f054 has a lighter top
face and a dark edge. Posts, poles, spindles and the IV stand are plain tubes with no bevel at all (f057, f059).
Rule of thumb: bevel width = 2–4 % of the object's largest dimension, only on the top/outer edges, never on legs.

**Silhouette first.** Every object reads from its outline alone, because the film is nearly two-tone: the boat has a
long rising sheer, a raked pointed bow and a flat transom (f096, f103); the hospital bed has a headboard of vertical
spindles between two rounded rails (f105–f107); trees are pure black branching silhouettes with no shading at all
(f042); the wolf/dog is a wedge muzzle, pricked triangular ears and a tucked tail (f085). If the outline needs a label,
add a secondary form (a thwart, a folded blanket, a side rail), not more facets.

**Tone separation is 3–4 greys per object, and the object is never the same grey as its background.** Light scenes:
background `#f0–#f4`, ground `#f2` with real shadows, object bodies `#c8–#dc`, vertical sides fall to `#b0–#c0` from
lighting, one dark accent (`#101010–#2a2a2a`) per object (the figure on the bed, the bag on the IV stand). Dark scenes:
background `#000–#1c`, floors a visibly lighter gradient band (`#3a–#7a`, f076, f092), object bodies `#18–#30`, a lit
top plane or rim strip `#55–#80`, light sources pure white. Keep at least 10 % (`0x18`) between an object and whatever
is behind it; after the film pass (25 % desaturation, lifted blacks, S-curve) that difference is what survives.

**Objects meet the ground visibly.** The film uses four devices: a wide soft drop shadow (the bed's ellipse, f106);
legs or feet that reach the floor line with a tiny dark contact shadow (f113, f116); mirror reflections on glossy floors
(f054, f057, f075, f118–f121); on water, a darker inverted smear plus a few lighter wake dashes at the hull (f096, f098).
Nothing floats; nothing is cut by the floor plane.

**Scale against the characters is strict.** Father ≈1.92, son ≈1.38 in the film; our hero is 1.75. In the frames the
bed's headboard reaches the father's hip (~0.95), the mattress top is just under knee height (0.5–0.55); the boat's
gunwale reaches the seated son's chest (~0.55 above the waterline); the dog's shoulder is at the father's knee (0.6);
the trees are 2–3 figures tall; a doorway is 2.1 × 0.9. Use the table in §3 and check with a shot that includes the hero.

**Black-on-black is solved with light, not with brighter objects.** A dark boat on a dark floor (f076, f092–f094) reads
because (1) the floor is a lighter grey gradient behind it, (2) its top strip and the plane facing the lamp are lifted
by ~0x30, (3) a single light source (ceiling lamp f093, shaft f052/f057) carves one edge, (4) one or two tiny white specks
anchor it (the wolf's eye f085, oar tips). Fog colour is slightly lighter than the background so far silhouettes sit
on a gradient (f096: sky `#000`, horizon `#2a`).

**White-on-white is solved with shadow and a darker body.** Objects on snow or in the white room are 10–15 % darker
than the ground (`#d8` on `#f2`), every one casts a shadow, sheets and pillows may be white only because they sit on a
`#d0` mattress and a `#c4` frame (f107, f110), and far objects dissolve into fog within 6–10 m (f105, f113).

## 2. Per-object study (frame numbers)

- **Rowing boat** — f076/f077 (underside, 225–228 s), f092–f094 (in the room, 273–279 s), f096–f102 (icebergs,
  285–303 s), f103 (top view, 306 s). Hull is a hard-chined shell: a keel line, one chine, topside strake; seven
  stations from a flat transom to a pointed raked bow; sheer rises ~0.15 toward the bow. Gunwale = thin lighter rail.
  From above (f103): three thwarts, a keel plank, inside a tone lighter than the outside. Tones: outside `#1e`, inside
  `#2e`, gunwale `#5a`, the plane facing the lamp `#44`. Length ≈ 2 figures (3.6–4.0), beam 1.2, freeboard 0.5.
- **Hospital bed** — f105 (far, 312 s), f106 (side, 315 s), f107/f110 (three-quarter, 318/327 s), f111–f112 (close,
  330–333 s), f057 (dark ward, 168 s), f060–f062 (overhead, 177–183 s). Tube frame `#c4`: two posts per end, a rounded
  top rail, 5–6 spindles, a side rail (U of tube) on one side, four legs on small castors. Mattress is a rounded slab
  `#d4` with a white sheet `#f6` on top; a folded blanket edge as 2–3 big planes; pillow a rounded slab. A wide soft
  shadow ellipse on the floor. Frame height 0.95 at the headboard, 0.8 at the foot, mattress top 0.55. The IV stand
  (f059–f060) is a 1.7 pole, an octagonal bag and a hook; the bedside cabinet is a chamfered white box.
- **Bare trees** — f041 (fog, 120 s), f042 (white, 123 s), f043 (inverted, 126 s). Trunk tapers from ~0.12 radius,
  2–3 main limbs at 25–40°, four to five generations of thinner twigs, no leaves, unlit black (`B`, not `M`); fog turns
  distant trees light grey (f041) or, in the dark scene, the trees are white on black. 3.5–6 units tall.
- **Snow terrain** — f046 (135 s), f047 (138 s). Irregular triangles 1–4 units across, ridge lines, long sloping
  planes in four tones (`#f6 #ec #e0 #d4`); the facet grid is never regular; the horizon is a white gradient band.
- **Furniture** — f074 (white lump pile, 219 s), f075 (white silhouette + reflection, 222 s), f079 (chair/table pile,
  234 s), f080–f083 (exploding, 237–246 s). Chairs are four thin legs, a seat plank and a back of two uprights; tables a
  slab on four legs. Shards are thin plates and sticks (plank 1 × 0.05 × 0.3, stick 0.06 × 0.06 × 1), a few triangular
  wedges; 8 % of them are white-lit (`#e0`), the rest `#18–#3a`. Not tetrahedra.
- **Room, doorway, light shafts** — f052 (upside-down white room, 153 s), f054 (platform with pole, 159 s),
  f055 (ceiling slab, 162 s), f057 (dark ward with a wedge of light, 168 s), f093 (ceiling lamp disc, 276 s). Walls white,
  ceiling `#8a`, floor glossy with reflections. Shafts are flat translucent quads with hard edges (not sprites), one or
  two overlapping, from a source top-right; a doorway is a white slab in the wall plus a trapezoid floor pool.
- **Animals** — bear f048–f050 (141–147 s), wolf/dog f084–f085 (249–252 s), crows/fish f076 (225 s). Three tones per
  body, limbs are 5-sided lofts, ears are triangles, nose a small wedge, one lighter facet for the eye. Crows are a short
  5-sided body loft and two bent wing quads.
- **Footprints** — f035–f037 (102–108 s), f116 (345 s). Flat kites/parallelograms, ~0.12 × 0.26, 12 % darker than
  the snow with a lighter near half, toe-out ±7°, left/right offset ±0.09, converging in perspective and fading with fog.
- **Reflection** — f054, f057, f075, f118 (351 s), f120–f121 (357–360 s). A mirrored copy, full strength at the
  contact point, fading to nothing over ~1.5× the figure height; on water the reflection is darker and slightly
  compressed (f096, f098) with 2–3 lighter wake dashes beside the hull.
- **Character clothing** — f038–f040 (111–117 s), f111–f116 (330–345 s). A boxy parka in 2–3 tones with a darker
  collar ring and cuffs, trousers in a different grey from the coat, boots from mid-shin, pale trainers on the son.
  Panels are flat and split vertically into a lit and a shaded side. The hero rig already follows this; it is out of
  scope here except as a scale and tone reference.

## 3. Recipes for this codebase

`loftGeo(secs,{sides,rot,jitter,seed,caps})`, section = `[y, width, depth, chamfer 0..1, zOff, xOff]`. Facts to use:
`sides:8` gives a chamfered rectangle (`chamfer*min(w,d)/2` cut per corner); `sides:6` a hexagonal tube; `sides:4,
rot:Math.PI/4` an axis-aligned rectangle at 0.707 scale (what the hero's hands use). Triangles = `2*sides*(secs-1)` plus
`2*sides` for caps. `jitter:.05–.09` with `M(c,{vertexColors:true})` gives the per-facet tone jitter of the hero.

**Bevelled box (the default prop block).** 64 triangles, bevel on every edge:
```js
const bevelBox=(w,h,d,b,mat,x=0,y=0,z=0)=>{const m=loft([[0,w-2*b,d-2*b,.1],[b,w,d,.3],[h-b,w,d,.3],[h,w-2*b,d-2*b,.1]],mat,{sides:8});m.position.set(x,y,z);return m};
// mattress: bevelBox(.9,.18,1.95,.04,M(0xd4d4d4)); sheet on top: bevelBox(.92,.03,1.9,.015,M(0xf6f6f6),0,.17,0)
```
Use `b` = 2–4 % of the largest dimension. Legs, posts, spindles and poles stay plain (`CylinderGeometry(r,r,h,6,1)`).

**Faked bevel with an inset plate (12 extra triangles).** Lay a lighter top plate inset by the bevel width on a darker
box: `box(w,h,d,M(0x2a2a2a))` + `box(w-2*b,.01,d-2*b,M(0x4a4a4a),0,h/2+.005,0)`. The exposed dark ring reads as a
chamfer. Use it on table tops, the boat's thwarts, the platform in `flip`, and the bus-shelter bench.

**Tubes and rails (bed, shelter, IV stand).** Straight runs: 6-sided cylinders. Rounded corners: a quarter
`TorusGeometry(r,tube,4,6,Math.PI/2)` (48 triangles) or, cheaper, overlap the two cylinders and drop a
`SphereGeometry(tube,6,4)` on the joint. Spindles: one `InstancedMesh` for all of them (headboard + footboard = 12).

**Plank-and-rib boat hull.** Build the shell from stations, not from a box. For each station `[z, halfBeam, sheerY,
chineY, keelY]` emit the three points per side (gunwale, chine, keel); join consecutive stations with two quads per side
(topside strake, bilge strake) and close the transom with one quad. Seven stations = 48 triangles for the whole hull,
non-indexed so it flat-shades; compute normals after. Add: a gunwale rail (`loft` with `sides:6`, 0.04 thick, `#5a`)
following the sheer points; a keel plank inside; three thwarts (`bevelBox(1.0,.04,.22,.01)`); five ribs
(`box(.03,.03,beam)`) on the floor; an inner floor plane `#2e`. Total ≈ 300 triangles. Keep the oar/oarlock code.

**Trees.** Keep `forest()` (instanced 5-sided cylinders) but feed it the film's proportions: `height 4–6`, `depth 5`,
`radius .1`, children 2–3, length ratio .62–.8, branch spread ±0.65 rad, and an **unlit** material (`B(0x111111)`, or
`B(0xffffff)` in a dark scene). Unlit is what makes them read as the film's silhouettes; fog does the depth.

**Faceted terrain.** `PlaneGeometry(W,D,24,16)`, displace heights with two octaves of `rng` value noise (cells 6 and 2
units, amplitude .6), **offset every vertex in x/z by ±30 % of the cell** so the grid disappears, then
`geo.toNonIndexed(); geo.computeVertexNormals()` so each triangle gets its own normal. Light it with a low key
(`dir:[−4,2,3]`) and the four greys appear by themselves. ≈ 1.5 k triangles.

**Shards and debris.** Three instanced meshes instead of one tetrahedron: plate `BoxGeometry(1,.04,1)`, stick
`BoxGeometry(.06,.06,1)`, wedge (`TetrahedronGeometry(.5,0)` scaled `y*.15`). Tone with `setColorAt` (`#18–#3a`, 8 %
at `#e0`), seeded by `rng`.

**Light shafts and doorways.** `PlaneGeometry` quads with `B(0xffffff,{transparent:true,opacity:.12,
depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide})`, two overlapping at different widths; a floor
pool as one trapezoid quad at opacity .25. Hard edges, no `glow()` sprite for the shaft itself; a sprite only at the
source (with `depthTest:false` if it sits on the horizon).

**Contact shadow (2 triangles, cheap, use it everywhere).** A dark radial gradient plane at y=.005:
```js
const SHADOW=canvasTex(128,128,c=>{const g=c.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(0,0,0,.5)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,128,128)});
const contactShadow=(w,d,o=.6)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({map:SHADOW,transparent:true,opacity:o,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.005;m.renderOrder=1;return m};
```
Place one under the bed (2.6 × 1.6), the bench, the chair, the pot, the suitcase, and a stretched one at the boat's
waterline (4.4 × 1.4, opacity .5). This is the single biggest step toward f106.

**Reflections.** Keep the `scale.y=-1` copy with a `MeshBasicMaterial` at opacity .35–.55 and the gradient veil from
scene 23; for the boat, add the hull copy at opacity .3 plus three `box(.3,.004,.02,B(0x8a8a8a))` wake dashes.

**Footprints.** Replace the box with a 4-vertex kite (`BufferGeometry`, 2 triangles, vertex colours `#d4` near half,
`#c8` far half, `B(c,{vertexColors:true})`), alternate x ±.09 and `rotation.y` ±.12. Keep the `InstancedMesh` + `count`
reveal in scene 1.

**Vertex-colour jitter.** Use `loftGeo(...,{jitter:.06})` + `vertexColors:true` on props larger than 0.5 units (hull,
mattress, cabinet, icebergs) so neighbouring facets differ by a few percent; skip it on tiny props and on anything
`B`-lit, and never animate it (the owner rejected trembling).

**Scale table (hero = 1.75, feet at y=0).** Bed 2.0 × 0.95, mattress top .55, headboard .95, footboard .8 · chair seat
.45, back .9 · desk/table top .74 · bench .45 · boat 3.8 × 1.2, freeboard .5, draft .15, thwarts at .35 · doorway 2.1 ×
.9 · shelter roof 2.5 · tree 3.5–6 · IV stand 1.7 · dog shoulder .6 · pot .24 · cup .12 · phone .13 · suitcase .44 tall.

**Triangle budget per object.** Tiny prop (cup, phone, castor) ≤ 60 · furniture piece ≤ 400 · boat ≤ 500 · bed with
rails and IV stand ≤ 900 · terrain ≤ 2 k · a tree ≤ 3 k instanced · scene growth ≤ 2× (BRIEF rule 1). Reuse one
`BoxGeometry`/`CylinderGeometry` per size, use `InstancedMesh` for ≥ 6 repeats, and remember only meshes with a world
bounding radius < 1.2 cast shadows (`buildAll`), so big hulls and floors never need shadow-casting detail.

**Lighting that makes facets separate.** Light scenes: a low key (`dir:[−4,3,5]`) so vertical faces fall to `#c0` and
shadows stretch (f106); hemisphere ground colour a step darker than the sky colour. Dark scenes: one hand-placed point
or spot that lifts the top plane of the main prop, fog a shade lighter than the background, floor a gradient band.

## 4. Reviewer checklist (apply to any prop, with a screenshot that includes the hero)

1. Outline test: cover the shading mentally — is the object still recognisable from its silhouette?
2. Facet count is below the hero's; big planes on big things, no high-segment curves (≤ 8 sides, ≤ 8×6 spheres).
3. Bevels only on top/outer edges that face the light; legs, posts and poles are plain tubes.
4. At least three greys on the object, and ≥ 10 % tone difference from whatever is directly behind it.
5. Light scene: body darker than the ground, a shadow or contact shadow under it. Dark scene: lifted top plane or
   rim strip, floor lighter than the object, fog lighter than the background.
6. Every leg/foot/hull touches y=0 (or the water) and nothing pokes through the floor, a wall, or the hero.
7. Secondary forms that name the object are present (headboard + blanket fold; keel, ribs, thwarts, gunwale;
   shelter frame + bench + sign; chair back + four legs).
8. Scale matches the table in §3 when the hero stands beside it.
9. Materials: `M` (flat, roughness 1) for solids, `B` only for light sources, screens, tree silhouettes and shadows;
   no normal maps, no image files, no `Math.random()`.
10. Repeats are instanced; shared geometries are reused; the scene's triangle count grew by less than 2×.
11. No motion added that trembles or jitters; idle motion only where the scene already had it.
12. The caption area (lower-middle, t ∈ .12–.75) stays calm; busy new geometry sits above or beside it.
13. Walk-in-place scenes: the prop was added before `worldGroup()` so it moves with the ground.
14. No face, no new flower, no text or caption change, `key`/`bg`/`dark` untouched.
15. Before/after shots at `i+.35` and `i+.65` plus a close-up exist in `jobs/<item>/`, and the after is clearly closer
    to the frames listed in §2.
