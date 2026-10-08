# Scenes

There are 24 scenes, in scroll order. Index = position in `SCENES`, and the scroll position for screenshots is `index + fraction`. Several keys are historical: `petals`, `bloom`, `field` and `minusone` no longer contain what their names say. They are kept because `CAPTIONS` and the tools refer to them; rename them freely, but rename them everywhere.

Light/dark is the `dark(t)` value. It drives caption colour and the strength of grain and vignette.

| # | key | L/D | Caption | What happens | Camera |
|---|---|---|---|---|---|
| 0 | `title` | D→L | (none; `#bigTitle` shows TOWARD, then THE LIGHT + 獻給每個獨自打拼的人) | Letter-spaced title on black flips to white halfway | — |
| 1 | `arrive` | L | One suitcase, carrying all my courage | White avenue between towers in falling snow; he walks in place with a suitcase while the street slides toward the camera, footprints appearing in the snow | Behind him, slowly rising |
| 2 | `crack` | L | Even the everyday road hides small wonders | Low shot on the pavement; his legs walk in place while the pavement and a small daisy in its crack slide by | Ground level, static-ish |
| 3 | `office` | D | Light after light, guiding the late ones home | Endless dark office corridor with pools of light every 5 m; he walks in place with his suitcase while the corridor slides past | Down the corridor axis |
| 4 | `desk` | D | Deep in the night, the screen's glow helps me write my dream | Seated at a desk, screen glow, paper stacks, a cup with a tiny daisy | Orbits from wide to a close shot near the cup |
| 5 | `skyline` | L | The city is vast, and I am writing my name into it, line by line | At an overpass railing, over-the-shoulder view of a hazy skyline | Pushes past his shoulder |
| 6 | `grid` | D | Among ten thousand lights, one will shine for me | Top-down night city whose windows light up block by block, with glowing street grid | High, tilting |
| 7 | `subway` | D | Trains come and go; every stop leads somewhere new | Platform edge; a train loops past (`train.position.x` wraps) with a few petals in the draft | Low, side-on |
| 8 | `store` | D | A window glowing at dawn, like a gentle goodnight | Hopper-like: a bright open-front shop on a dark rainy street, him seated at the window counter as a silhouette | Dolly in from across the street |
| 9 | `towers` | L | However thick the fog, it is only a view not yet seen | Camera-only: gliding up between giant grey towers in white haze (no hero) | Upward |
| 10 | `umbrellas` | L | In a sea of people, my umbrella holds up a sky of my own | Top-down rain: 160 identical black umbrellas (instanced cones) flowing; his is the one in the centre | High → oblique |
| 11 | `flip` | L→D | 有些日子，連天空都踩在腳下 | A sky sphere split light (top) / starry dark (bottom). Above the horizon he stands by a desk with an open laptop; below it, a dark upside-down copy of him and the desk | Orbits at horizon height while rolling 180° |
| 12 | `drift` | D | On nights I set the weight down, I am light as a cloud | Weightless among stars, papers drifting (`float(t)` pose) | Slow orbit |
| 13 | `eclipse` | D | The light is only resting, waiting for its return | Black disc with a glowing ring over a skyline silhouette; crows fly across. Draw order is forced with `renderOrder` + `depthTest:false` (see comment). | Static, slight push |
| 14 | `petals` | D | Page by page, every day counts | 26 torn-off calendar pages ("DAY n", canvas textures) fall around him and settle; a faint dawn glow grows | Low orbit |
| 15 | `shards` | D | Gather the pieces and shape them into something new | 320 instanced shards explode outward; he is curled up (knees to chest, arms around them, head down) in the middle, slowly turning. No trembling: the owner asked for that to be removed. | Orbit pulling back |
| 16 | `flood` | D | When the rain becomes a sea, row for the other shore | Rowing a small boat through a flooded night city in rain | Side, tracking |
| 17 | `rooftop` | L | Morning on the rooftop, planting hope in the wind | Dawn rooftop; he reaches toward a potted daisy, the sun glow rising | Three-quarter |
| 18 | `room` | L | A small room, big enough for a whole day's warmth | White rented room, lying on the bed, desk with laptop, window onto a night city (canvas texture) | High → closer |
| 19 | `call` | D | The voice on the line is the closest home | Bus shelter in rain; seated, phone to ear (glowing phone follows the head), lit ad panel, passing headlight glows | Push in from across the road |
| 20 | `bloom` | L | The sun rises, and today is a brand-new page | Standing behind a rooftop parapet (roof at y=2, ground plane below); the sun rises behind the skyline | Behind him, looking up as the sun rises |
| 21 | `field` | D | Step by step, toward the light | Pure darkness, no grass or flowers; he walks toward one small light high on the horizon that grows brighter and rim-lights him | Behind him, following |
| 22 | `minusone` | D | A space kept open for the light still on its way | 60 small lights spiral in from the dark and settle into a ring around him with one gap (no inner ground ring; William removed it) | Rises to top-down |
| 23 | `end` | L | (none; `#ending` overlay: TOWARD THE LIGHT, 再走一次, note, About) | He walks on white with a soft reflection, the walk slowing to a stop | Pulls far back |

## Known weak spots (verified by screenshots)

- **`subway`:** the train is hard to read; the scene is very dark.
- **`store`:** the bloom pass washes the interior shelves into white blobs. They read as "bright shop", but there is no detail.
- **`shards`:**
  - The coat's skirt panels follow the raised thighs and form a slab in the curled pose.
  - The figure is small and often hidden behind shards early in the scene.
- **`towers`, `skyline`:** the hero is small or absent; they could use stronger composition.
- **`petals`:** pages that have landed render pure white because of the glow pass. Fine, but busy near the caption.
- **`end`:** the reflection is a second, mirrored character (`scale.y=-1`) with a gradient veil. A true planar reflection would be nicer.
- **Visual daisies in scenes 2, 4 and 17:** they remain. Daisies are allowed to appear, but text must never mention flowers (owner's rule).
