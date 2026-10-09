# Scenes

There are 24 scenes, in scroll order. Index = position in `SCENES`, and the scroll position for screenshots is `index + fraction`. Several keys are historical: `petals` (calendar pages), `bloom` (sunrise), `field` (a dark walk toward one light) and `minusone` (a ring of lights) no longer contain what their names say. They are kept because `CAPTIONS` and the tools refer to them; rename them freely, but rename them everywhere.

Light/dark is the `dark(t)` value. It drives caption colour and the strength of grain and vignette. Captions are English (see `CAPTIONS` in `src/app.js`, the source of truth). A contact sheet of every scene is at `assets/storyboard.jpg`.

## How to use these docs

- **Before editing a scene, open its page in [scenes/](scenes/).** Each page has a v41 screenshot, the caption, an at-a-glance table (setting, tone, hero pose, motion, camera, measured budget), a table of **every model in the scene** (what builds it, geometry, tone, placement and contact), lights, the `update(t,time)` animation, what changed in v40 → v41, editing pitfalls specific to that scene, and the exact screenshot command to check it.
- **To reuse or change a model builder** (`building()`, `suitcase()`, `makeHero()`, the local `bevelBox` copies …) read [MODELS.md](MODELS.md): every shared and local helper, the hero's parts and rig API, the triangle budget of every scene, the tone ladder and the legacy code.
- **Numbers come from measurement**: `node tools/inventory.js` builds every scene headless and counts triangles, meshes, instances and lights; snapshots are in [data/](data/) (`inventory-v40.json` before the model polish, `inventory-v41.json` now). Re-run it after a model change and update the scene page.
- **Why things look the way they do**: [model-polish/](model-polish/README.md) has the v41 notes per group (with before/after sheets in `assets/model-polish/`), and [ART-DIRECTION.md](ART-DIRECTION.md) has every rejection by the owner.

## Story order

| # | Scene | L/D | Caption | What happens |
|---|---|---|---|---|
| 0 | [`title`](scenes/00-title.md) | D→L | (none) | Letter-spaced TOWARD on black flips to THE LIGHT on white, with "For everyone making it alone in the city" |
| 1 | [`arrive`](scenes/01-arrive.md) | L | One suitcase, carrying all my courage | He walks in place with his suitcase while the snowy avenue slides toward the camera; footprints appear behind him |
| 2 | [`crack`](scenes/02-crack.md) | L | Even the everyday road hides small wonders | Low shot of his legs walking past a crack in the paving slabs, a small daisy growing in it |
| 3 | [`office`](scenes/03-office.md) | D | Light after light, guiding the late ones home | He walks in place down an endless dark corridor of recessed doors and pools of light |
| 4 | [`desk`](scenes/04-desk.md) | D | Deep in the night, the screen's glow helps me write my dream | Seated at a desk at night, typing; monitor at eye height on a stand hidden behind the panel |
| 5 | [`skyline`](scenes/05-skyline.md) | L | The city is vast, and I am writing my name into it, line by line | He rests a hand on an overpass railing; over-the-shoulder view of a hazy skyline |
| 6 | [`grid`](scenes/06-grid.md) | D | Among ten thousand lights, one will shine for me | Top-down night city whose windows light up block by block along a glowing street grid |
| 7 | [`subway`](scenes/07-subway.md) | D | Trains come and go; every stop leads somewhere new | He waits on a platform while a train loops past |
| 8 | [`store`](scenes/08-store.md) | D | A window glowing at dawn, like a gentle goodnight | Hopper-like bright shop window on a dark rainy street; he sits at the window counter as a silhouette |
| 9 | [`towers`](scenes/09-towers.md) | L | However thick the fog, it is only a view not yet seen | Camera-only glide up an avenue of giant grey towers in white haze (no hero) |
| 10 | [`umbrellas`](scenes/10-umbrellas.md) | L | In a sea of people, my umbrella holds up a sky of my own | Top-down rain: a flowing crowd of 160 black umbrellas; his is the one in the centre |
| 11 | [`flip`](scenes/11-flip.md) | L→D | Turn the world around, and the sky lies at your feet | He stands by a desk on a split sky sphere while the camera rolls the world upside down; a mirrored copy hangs below |
| 12 | [`drift`](scenes/12-drift.md) | D | On nights I set the weight down, I am light as a cloud | Weightless among stars with drifting papers, pens, a mug, a phone and a notebook |
| 13 | [`eclipse`](scenes/13-eclipse.md) | D | The light is only resting, waiting for its return | Black disc with a glowing ring over a skyline silhouette; crows fly across (unlit scene) |
| 14 | [`petals`](scenes/14-petals.md) | D | Page by page, every day counts | 26 torn-off "DAY n" calendar pages fall around him and settle; a faint dawn glow grows |
| 15 | [`shards`](scenes/15-shards.md) | D | Gather the pieces and shape them into something new | Shards explode outward around him, curled up in the middle |
| 16 | [`flood`](scenes/16-flood.md) | D | When the rain becomes a sea, row for the other shore | He rows a small boat through a flooded night city in the rain; the oars are aimed from his hands every frame |
| 17 | [`rooftop`](scenes/17-rooftop.md) | L | Morning on the rooftop, planting hope in the wind | Dawn on a rooftop; he reaches toward a potted daisy as the sun rises |
| 18 | [`room`](scenes/18-room.md) | L | A small room, big enough for a whole day's warmth | He lies on a tube-frame bed in a small white room, a desk with a laptop and a window onto the night city |
| 19 | [`call`](scenes/19-call.md) | D | The voice on the line is the closest home | Seated at a bus shelter in the rain, phone to his ear, a lit ad panel beside him |
| 20 | [`bloom`](scenes/20-bloom.md) | L | The sun rises, and today is a brand-new page | He stands behind a rooftop parapet as the sun rises behind the skyline |
| 21 | [`field`](scenes/21-field.md) | D | Step by step, toward the light | He walks in place through darkness over faint stones toward one small light high ahead |
| 22 | [`minusone`](scenes/22-minusone.md) | D | A space kept open for the light still on its way | 60 small lanterns spiral in and settle into a ring around him with one gap |
| 23 | [`end`](scenes/23-end.md) | L | (none) | He stands still on white with a soft reflection; the ending overlay appears |

## How the scenes differ

Measured budget: scene triangles excluding the hero (instanced meshes multiplied by their count) and the hero's own triangles, v40 → v41, from `docs/data/`. The hero is 1561 triangles (1749 with the suitcase); `flip` and `end` draw him twice.

| # | Scene | Setting | L/D | Hero | What moves | Camera | Signature models | Shared helpers | Tris v40 → v41 (hero) | Lights | Group |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | [`title`](scenes/00-title.md) | DOM title over black | D→L | — | scroll fades the letters | unchanged | `#bigTitle` letters, PRESENTS line (no 3D) | — | 0 | 0 | — |
| 1 | [`arrive`](scenes/01-arrive.md) | snowy avenue, day | L | walk in place, suitcase | `worldGroup` z = t·22 | behind, pulls back | 26 towers, pavement + kerb, lamp posts, bollards, footprints, snow | `street` `building` `finGeo` `suitcase` `worldGroup` | 314 → 2,454 (1,749) | 3 | city |
| 2 | [`crack`](scenes/02-crack.md) | pavement close-up, day | L | walk in place (legs) | `worldGroup` x 4.5 → −4.5 | ground level, side | instanced slabs, ribbon crack, kerb, road, daisy | `worldGroup` `makeDaisy` | 3,656 → 3,514 (1,561) | 3 | water-ground |
| 3 | [`office`](scenes/03-office.md) | night corridor | D | walk in place, suitcase | `worldGroup` z = t·30 | fixed, down the axis | instanced wall bays, recessed doors, lamp troughs, beam cones | `suitcase` `worldGroup` `loftGeo` | 830 → 1,922 (1,749) | 2 | interiors |
| 4 | [`desk`](scenes/04-desk.md) | desk at night | D | sit, typing | camera only | orbit + push-in | desk + pedestal, monitor on hidden stand, keyboard, office chair, cup + daisy | `makeDaisy` | 3,902 → 4,530 (1,561) | 2 | interiors |
| 5 | [`skyline`](scenes/05-skyline.md) | overpass railing, day haze | L | stand, palm on rail | camera only (idle sway) | over the shoulder, left → right | railing (base, posts, rail), 40 towers, 6 slender towers, 16 low-rise | `building` `gradTex` | 494 → 3,232 (1,561) | 3 | city |
| 6 | [`grid`](scenes/06-grid.md) | night city from above | D | stand (tiny) | blocks light up by radius | orbit + rise | 151 blocks (doubles, L-plans, towers), roof decks, lift heads, tanks, street lines | `building` `glow` | 1,754 → 5,078 (1,561) | 1 | night-city |
| 7 | [`subway`](scenes/07-subway.md) | station platform | D | stand | train loops on time | low three-quarter | platform + tactile strip, pillars, ceiling troughs, 6-car train, bench, petals | `glow` `loftGeo` local `bevelBox` | 1,284 → 3,548 (1,561) | 4 | night-city |
| 8 | [`store`](scenes/08-store.md) | 3 a.m. shop front, rain | D | sit at the counter | camera dolly | across the street → in | shop front frame, sign box, gondolas, 163 products, counter, stool | `rain` `glow` local `bevelBox` | 2,366 → 4,036 (1,561) | 1 | street-props |
| 9 | [`towers`](scenes/09-towers.md) | tower canyon in haze | L | absent | camera only | glides up the avenue | 51 towers with podiums, doors, fins | `building` `finGeo` | 614 → 1,742 (0) | 3 | city |
| 10 | [`umbrellas`](scenes/10-umbrellas.md) | crowd from above, rain | L | stand under umbrella | crowd flows on time | top-down → oblique | 160 instanced umbrella + figure (merged), hero umbrella | `rain` local `canopyGeo` `tubeGeo` | 3,950 → 22,558 (1,561) | 3 | street-props |
| 11 | [`flip`](scenes/11-flip.md) | split sky sphere, void | L→D | stand (+ mirrored copy) | camera roll 180° | orbit at horizon | sky sphere, desk + laptop + chair (and mirrored copy), stars | `stars` local `desk()` | 4,730 → 5,386 (3,122) | 2 | interiors |
| 12 | [`drift`](scenes/12-drift.md) | night void, stars | D | float | props drift on time | slow orbit | 40 curled paper sheets, pens, mug, phone, notebook | `stars` `glow` `float()` | 80 → 608 (1,561) | 4 | void-objects |
| 13 | [`eclipse`](scenes/13-eclipse.md) | skyline under an eclipse | D | absent | crows cross on scroll | static, slight push | disc + torus ring + halo, flat skyline cut-outs, roof furniture, crows | `canvasTex` `gradTex` | 2,908 → 3,276 (0) | 0 | night-city |
| 14 | [`petals`](scenes/14-petals.md) | dark ground, dawn glow | D | stand, head up | 26 pages fall on scroll | low orbit | 26 torn calendar pages with thickness, dawn glow | `canvasTex` `glow` | 54 → 626 (1,561) | 3 | void-objects |
| 15 | [`shards`](scenes/15-shards.md) | void | D | curl | explosion on scroll | orbit pulling back | 320 instanced shards (plates, sticks, wedges) | `lights` | 1,280 → 3,440 (1,561) | 4 | void-objects |
| 16 | [`flood`](scenes/16-flood.md) | flooded night city, rain | D | row | boat moves on scroll, stroke on time | tracks the boat | plank-and-rib boat, oars aimed from the hands, towers, water, smear, wake | `building` `rain` `stars` `canvasTex` | 690 → 1,438 (1,561) | 2 | water-ground |
| 17 | [`rooftop`](scenes/17-rooftop.md) | rooftop at dawn | L | stand, reaching to the pot | sun rises on scroll | 74° orbit | roof panels, parapet + coping, bulkhead, water tank, AC, planter + daisy | `makeDaisy` `glow` local `bevelBox` | 3,294 → 5,088 (1,561) | 3 | water-ground |
| 18 | [`room`](scenes/18-room.md) | white rented room | L | lie on the bed | camera only | high → closer | tube-frame bed, mattress, desk + laptop + lamp, window reveal, door, rug | `canvasTex` local `bevelBox` | 300 → 1,526 (1,561) | 4 | interiors |
| 19 | [`call`](scenes/19-call.md) | bus stop at night, rain | D | sit, phone to ear | phone follows head, car glow on time | push in across the road | shelter with glazing, lit ad panel, slatted bench, flag pole, kerb | `rain` `glow` local `bevelBox` | 160 → 622 (1,561) | 4 | street-props |
| 20 | [`bloom`](scenes/20-bloom.md) | rooftop, sunrise | L | stand, from behind | sun rises on scroll | behind, looking up | roof with parapet, water tank, stair head, 46 blocks, low-rise band | `building` `glow` | 642 → 2,652 (1,561) | 3 | city |
| 21 | [`field`](scenes/21-field.md) | dark ground toward a light | D | walk in place | manual world group z = t·14 | behind, following | faceted terrain, 270 instanced stones (4 shapes), light disc + halos | `glow` (own group, not `worldGroup`) | 9,410 → 7,710 (1,561) | 2 | water-ground |
| 22 | [`minusone`](scenes/22-minusone.md) | void, stars | D | stand | 60 lights gather into a ring | rises to top-down | 60 faceted lanterns + halos (one gap) | `glow` `stars` | 4,800 → 3,600 (1,561) | 3 | void-objects |
| 23 | [`end`](scenes/23-end.md) | white, reflection | L | stand (+ reflection) | camera dolly back | pulls far back | hero + mirrored reflection, fade veil, `#ending` overlay | `gradTex` | 2 → 2 (3,122) | 3 | hero |

Patterns worth knowing before you add or change a scene:

- **Walk-in-place scenes** (`arrive`, `crack`, `office`, `field`): the hero never translates; the environment moves and `stroll(distance)` uses the same distance so planted feet do not slide. `arrive`, `crack` and `office` use `worldGroup()` (props must exist before it is called); `field` builds its own group.
- **Seated scenes** (`desk`, `store`, `flood`, `call`) hand-tune `me.position.y` against the seat top; `desk` still has the thighs inside the 5 cm seat slab (raise the hero about .07).
- **Heaviest scenes**: `umbrellas` (22.6k: 160 instances of a 141-tri umbrella + figure), `field` (7.7k, mostly invisible terrain facets), `flip`, `rooftop`, `grid`, `desk`. Everything else is under 4k plus the hero.
- **Unlit or nearly unlit**: `eclipse` has no lights (flat cut-outs, `depthTest:false` + `renderOrder` for the ring); `title` has no 3D at all.
- **Shared city look**: every day/night city is `building()` (facade variants, podium/door, lip, setback, roof furniture, fins) on a `ground()`; night scenes pass `night=true`. Trim must stand ≥ 3 cm proud and draw after its parent (16-bit depth target, see ARCHITECTURE.md).
- **Daisies** appear only as props in `crack`, `desk` and `rooftop` (plus drifting petals in `subway`, pending the owner). No text may mention flowers.

## Known weak spots (verified by screenshots)

- **`subway`:** the daisy petals still drift there (owner decision pending). The train and platform were rebuilt in v41.
- **`crack`:** the crack reads as a dark line laid on the slabs rather than a fracture (reviewers' note, v41).
- **`flood`:** the water tone was lifted from `#0c` to `#20` in v41 so the hull and wake read; the dark smear under the hull is still faint.
- **`desk`:** the thighs pass through the 5 cm chair seat slab (raise the hero ~.07 in the scene).
- **`room`:** the lying hero is a straight slab; the coat has no spine to bend.
- **`shards`:** the figure is small early in the scene (v41 keeps the first 1.2 units clear and scales near pieces down).
- **`towers`, `skyline`:** the hero is small or absent; they could use stronger composition.
- **`end`:** the reflection is a second, mirrored character (`scale.y=-1`) with a gradient veil. A true planar reflection would be nicer.
- **`field`:** the hero is backlit by the light ahead and reads almost black; a faint fill from behind the camera would help.
- **Walk scenes (`arrive`, `crack`, `office`, `field`):** the gait was rebuilt twice on owner feedback. Check `tools/gait.html` and a back view in `office` after any rig change.
- **Visual daisies in scenes 2, 4 and 17:** they remain. Daisies are allowed to appear, but text must never mention flowers (owner's rule).
