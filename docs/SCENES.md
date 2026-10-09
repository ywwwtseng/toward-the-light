# Scenes

There are 24 scenes, in scroll order. Index = position in `SCENES`, and the scroll position for screenshots is `index + fraction`. Several keys are historical: `petals`, `bloom`, `field` and `minusone` no longer contain what their names say. They are kept because `CAPTIONS` and the tools refer to them; rename them freely, but rename them everywhere.

Light/dark is the `dark(t)` value. It drives caption colour and the strength of grain and vignette. Captions are English (see `CAPTIONS` in `src/app.js`, the source of truth). A contact sheet of every scene is at `assets/storyboard.jpg`.

| # | key | L/D | Caption | What happens | Camera |
|---|---|---|---|---|---|
| 0 | `title` | D→L | (none; `#bigTitle` shows TOWARD, then THE LIGHT + "For everyone making it alone in the city") | Letter-spaced title on black flips to white halfway | — |
| 1 | `arrive` | L | One suitcase, carrying all my courage | White avenue between towers in falling snow; he walks in place with a suitcase while the street slides toward the camera, footprints appearing in the snow | Behind him, slowly rising |
| 2 | `crack` | L | Even the everyday road hides small wonders | Low shot on the pavement; his legs walk in place while the pavement and a small daisy in its crack slide by | Ground level, static-ish |
| 3 | `office` | D | Light after light, guiding the late ones home | Endless dark office corridor with pools of light every 5 m; he walks in place with his suitcase while the corridor slides past | Down the corridor axis |
| 4 | `desk` | D | Deep in the night, the screen's glow helps me write my dream | Seated at a desk, forearms resting on a keyboard (palms down, fingers lightly curled). The monitor is at eye height on a slim stand hidden behind the panel; paper stacks and a cup with a tiny daisy | Orbits from wide to a close shot near the cup |
| 5 | `skyline` | L | The city is vast, and I am writing my name into it, line by line | At an overpass railing, over-the-shoulder view of a hazy skyline | Pushes past his shoulder |
| 6 | `grid` | D | Among ten thousand lights, one will shine for me | Top-down night city whose windows light up block by block, with glowing street grid | High, tilting |
| 7 | `subway` | D | Trains come and go; every stop leads somewhere new | Platform edge; a train loops past (`train.position.x` wraps). A few daisy petals still drift in the draft (visual only; consider removing if the owner objects to flowers here) | Low, side-on |
| 8 | `store` | D | A window glowing at dawn, like a gentle goodnight | Hopper-like: a bright open-front shop on a dark rainy street, him seated at the window counter as a silhouette | Dolly in from across the street |
| 9 | `towers` | L | However thick the fog, it is only a view not yet seen | Camera-only: gliding up between giant grey towers in white haze (no hero) | Upward |
| 10 | `umbrellas` | L | In a sea of people, my umbrella holds up a sky of my own | Top-down rain: 160 identical black umbrellas (instanced cones) flowing; his is the one in the centre | High → oblique |
| 11 | `flip` | L→D | Turn the world around, and the sky lies at your feet | A sky sphere split light (top) / starry dark (bottom). Above the horizon he stands by a desk with an open laptop; below it, a dark upside-down copy of him and the desk | Orbits at horizon height while rolling 180° |
| 12 | `drift` | D | On nights I set the weight down, I am light as a cloud | Weightless among stars, papers drifting (`float(t)` pose) | Slow orbit |
| 13 | `eclipse` | D | The light is only resting, waiting for its return | Black disc with a glowing ring over a skyline silhouette; crows fly across. Draw order is forced with `renderOrder` + `depthTest:false` (see comment). | Static, slight push |
| 14 | `petals` | D | Page by page, every day counts | 26 torn-off calendar pages ("DAY n", canvas textures) fall around him and settle; a faint dawn glow grows | Low orbit |
| 15 | `shards` | D | Gather the pieces and shape them into something new | 320 instanced shards explode outward; he is curled up (knees to chest, arms around them, head down) in the middle, slowly turning. No trembling: the owner asked for that to be removed. | Orbit pulling back |
| 16 | `flood` | D | When the rain becomes a sea, row for the other shore | Rowing a small boat through a flooded night city in rain. Two oars are re-aimed every frame from the gripping hand through an oarlock, so hands and oars never separate | Side, tracking |
| 17 | `rooftop` | L | Morning on the rooftop, planting hope in the wind | Dawn rooftop; he reaches toward a potted daisy, the sun glow rising | Three-quarter |
| 18 | `room` | L | A small room, big enough for a whole day's warmth | White rented room, lying on the bed, desk with laptop, window onto a night city (canvas texture) | High → closer |
| 19 | `call` | D | The voice on the line is the closest home | Bus shelter in rain; seated, phone to ear (glowing phone follows the head), lit ad panel, passing headlight glows | Push in from across the road |
| 20 | `bloom` | L | The sun rises, and today is a brand-new page | Standing behind a rooftop parapet (roof at y=2, ground plane below); the sun rises behind the skyline | Behind him, looking up as the sun rises |
| 21 | `field` | D | Step by step, toward the light | Pure darkness, no grass or flowers; he walks toward one small light high on the horizon that grows brighter and rim-lights him | Behind him, following |
| 22 | `minusone` | D | A space kept open for the light still on its way | 60 small lights spiral in from the dark and settle into a ring around him with one gap (no inner ground ring; William removed it) | Rises to top-down |
| 23 | `end` | L | (none; `#ending` overlay: TOWARD THE LIGHT, "Walk again", note, About) | He stands still on white with a soft reflection (no walking) | Pulls far back |

Every set piece was rebuilt in v41 (model polish); what changed per scene, with before/after sheets, is in [model-polish/README.md](model-polish/README.md).

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
