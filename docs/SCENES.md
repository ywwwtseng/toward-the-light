# Scenes

There are 24 scenes, in scroll order. Index = position in `SCENES`, and the scroll position for screenshots is `index + fraction`. Several keys are historical: `petals`, `bloom`, `field` and `minusone` no longer contain what their names say. They are kept because `CAPTIONS` and the tools refer to them; rename them freely, but rename them everywhere.

Light/dark is the `dark(t)` value. It drives caption colour and the strength of grain and vignette.

| # | key | L/D | Caption | What happens | Camera |
|---|---|---|---|---|---|
| 0 | `title` | D→L | (none; `#bigTitle` shows TOWARD, then THE LIGHT + 獻給每個獨自打拼的人) | Letter-spaced title on black flips to white halfway | — |
| 1 | `arrive` | L | 一只行李箱，裝著我全部的勇氣 | White avenue between towers in falling snow; he walks in place with a suitcase while the street slides toward the camera, footprints appearing in the snow | Behind him, slowly rising |
| 2 | `crack` | L | 每天走過的路，也藏著小小的風景 | Low shot on the pavement; his legs walk in place while the pavement and a small daisy in its crack slide by | Ground level, static-ish |
| 3 | `office` | D | 一盞一盞的燈，替晚歸的人照路 | Endless dark office corridor with pools of light every 5 m; he walks in place with his suitcase while the corridor slides past | Down the corridor axis |
| 4 | `desk` | D | 夜深了，螢幕的光陪我把夢寫完 | Seated at a desk, screen glow, paper stacks, a cup with a tiny daisy | Orbits from wide to a close shot near the cup |
| 5 | `skyline` | L | 城市很大，我正一筆一筆寫下自己的名字 | At an overpass railing, over-the-shoulder view of a hazy skyline | Pushes past his shoulder |
| 6 | `grid` | D | 萬家燈火裡，總有一盞會為我亮起 | Top-down night city whose windows light up block by block, with glowing street grid | High, tilting |
| 7 | `subway` | D | 列車來來去去，每一站都通往遠方 | Platform edge; a train loops past (`train.position.x` wraps) with a few petals in the draft | Low, side-on |
| 8 | `store` | D | 凌晨的窗還亮著，像一句溫柔的晚安 | Hopper-like: a bright open-front shop on a dark rainy street, him seated at the window counter as a silhouette | Dolly in from across the street |
| 9 | `towers` | L | 霧再濃，也只是還沒看見的風景 | Camera-only: gliding up between giant grey towers in white haze (no hero) | Upward |
| 10 | `umbrellas` | L | 人海裡撐一把傘，也撐起自己的天空 | Top-down rain: 160 identical black umbrellas (instanced cones) flowing; his is the one in the centre | High → oblique |
| 11 | `flip` | L→D | 有些日子，連天空都踩在腳下 | A sky sphere split light (top) / starry dark (bottom). Above the horizon he stands by a desk with an open laptop; below it, a dark upside-down copy of him and the desk | Orbits at horizon height while rolling 180° |
| 12 | `drift` | D | 放下重量的夜，身體輕得像雲 | Weightless among stars, papers drifting (`float(t)` pose) | Slow orbit |
| 13 | `eclipse` | D | 光只是暫時休息，等著再一次登場 | Black disc with a glowing ring over a skyline silhouette; crows fly across. Draw order is forced with `renderOrder` + `depthTest:false` (see comment). | Static, slight push |
| 14 | `petals` | D | 一頁一頁翻過，每一天都算數 | 26 torn-off calendar pages ("DAY n", canvas textures) fall around him and settle; a faint dawn glow grows | Low orbit |
| 15 | `shards` | D | 把碎片拾起來，拼成新的形狀 | 320 instanced shards explode outward; he is curled up (knees to chest, arms around them, head down) in the middle, slowly turning. No trembling: the owner asked for that to be removed. | Orbit pulling back |
| 16 | `flood` | D | 雨下成了海，就划向對岸 | Rowing a small boat through a flooded night city in rain | Side, tracking |
| 17 | `rooftop` | L | 清晨的頂樓，把盼望種進風裡 | Dawn rooftop; he reaches toward a potted daisy, the sun glow rising | Three-quarter |
| 18 | `room` | L | 小小的房間，裝得下一整天的溫暖 | White rented room, lying on the bed, desk with laptop, window onto a night city (canvas texture) | High → closer |
| 19 | `call` | D | 電話那頭的聲音，是離我最近的家 | Bus shelter in rain; seated, phone to ear (glowing phone follows the head), lit ad panel, passing headlight glows | Push in from across the road |
| 20 | `bloom` | L | 太陽升起，今天又是嶄新的一頁 | Standing behind a rooftop parapet (roof at y=2, ground plane below); the sun rises behind the skyline | Behind him, looking up as the sun rises |
| 21 | `field` | D | 一步一步，往光的方向走 | Pure darkness, no grass or flowers; he walks toward one small light high on the horizon that grows brighter and rim-lights him | Behind him, following |
| 22 | `minusone` | D | 留一個位置，給還在路上的光 | 60 small lights spiral in from the dark and settle into a ring around him with one gap (no inner ground ring; William removed it) | Rises to top-down |
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
