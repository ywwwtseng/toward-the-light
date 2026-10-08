# Art direction and the owner's taste

The bar is **"product-level and artistic, not a demo."** The owner judges by eye and answers in a few words. Treat every rejection below as a standing rule.

## The look

- **Black-and-white low-poly film.**
  - Scenes alternate between almost-white (fog, snow, haze) and almost-black (night, void).
  - The dip between scenes uses the next scene's `bg`.
  - Colour is rare and muted by the film pass. Current colour: the yellow daisy centres and green stems in scenes 2, 4 and 17, the warm sun, and the cool/warm grade.
- **Light is the protagonist of the second half.** Visually the arc goes from a big city, through hard nights (flip, drift, eclipse, shards, flood), to small comforts (rooftop, room, call), then sunrise, a walk toward one light, and lights gathering around him. **The text never dwells on the hardship**: every caption frames its scene as a turning point (see Text below).
- **Typography:**
  - Jost for letter-spaced display ("T O W A R D", buttons, labels).
  - Cormorant Garamond italic 400 for captions.
  - Noto TC fonts are still loaded only as a fallback; the site has no Chinese text.
  - No scene counter (the owner removed the "03 — 24" numbers). Captions show text only.
- **Motion:**
  - Slow, eased and scroll-driven.
  - **The hero walks in place; the world moves** (see ARCHITECTURE, "Walking in place"). He never translates through a scene.
  - Subtle handheld camera drift.
  - Idle motion (rain, flicker, breathing) is fine.
  - **Jitter and trembling are not** (owner: "不要抖動").
- **Composition:** a small figure against a big world. He is often seen from behind or in silhouette.

## Text

- **English only**, everywhere on the site: captions, intro, scroll hint, loader, ending, About, aria labels (「文字最後都用英文」).
- **Hopeful and poetic, never negative** (「文字 藝術一點 不要負面」). No words of loss, collapse or loneliness. Hard scenes become turning points: the fog is a view not yet seen, the shards are shaped into something new, the gap in the ring is room for the next light.
- **No flower wording** anywhere, even though small daisies appear in three scenes.
- Captions are one short line, first person or a gentle second person, quiet, never exclamatory.
- The credit line stays: "Inspired by PEACEMINUSONE." No logo.

## Feedback history (chronological, 2026-10-08)

| Owner said | Context | What it taught |
|---|---|---|
| 不像 / 快一樣，細節再幫我注意 | early 2D/3D replica of the reference film | match the reference closely before inventing |
| 很怪 | a scene with odd staging | fix the staging, not the colours |
| 鳥改成烏鴉，人看起來太呆了 | eclipse scene | crows, not gulls; posture matters |
| 希望有藝術感一點，現在不像是產品等級的東西 | whole site | led to the film pass, grain, serif captions and soft shadows |
| 韓系風格角色 → 太醜了…. | several hand-built realistic and anime faces | **no faces.** Hand-modelled faces in code look bad; they are a dead end |
| 人物角色可以在低面數，更藝術感 | character | the current faceted, faceless hero |
| 肩膀跟腳的銜接都不太好, 抬腳會破圖 | joints | gussets and skirt panels following the legs; always check raised-leg poses |
| 頭埋進枕頭了 | room scene | check contact points (head/pillow, feet/floor, hands/objects) in screenshots |
| 加入 PEACEMINUSONE 的慨念跟小雛菊，加到23個場景 | story | daisy-missing-a-petal motif, 23 scenes |
| (reference image) 小雛菊 refer it | daisy model | smooth slender petals, domed centre, curved stem, lobed leaves (see `assets/daisy.png`) |
| 葉子重疊了 | daisy leaves | leaves on opposite sides of the stem, at different heights |
| 這一幕不需要花 / 不要花瓣 / 不要花 (several) | umbrellas, giant daisy, falling petals, sunrise, ending | **the flower motif was pulled back.** Daisies stay only as small props in 2, 4 and 17 |
| 文字不要有花的描述 | all copy | **no flower wording anywhere in text** |
| 這頁不需要，和平減一扣掉 | giant-daisy scene | scene removed; "和平減一" wording removed. The credit line "靈感來自 PEACEMINUSONE" stays |
| 建築物好像騰空身起 不行 | sunrise | **every scene with buildings needs visible ground**; check horizons |
| 身體窩成一團，痛苦的感覺 → 手太僵硬，不要抖動 | shards | curled pose with arms around the knees, no trembling |
| 地板改草地 → 改成草地跟五彩花朵，但不要太複雜 → 改成往光源的地方走去 → 花海改成在黑暗前行 → 不要有草，光源上面一點 | scene 21 | iterated to: pure darkness, one light high ahead |
| 幫我新增到 25 格場景 | — | added store and call (later 24 after one removal) |
| 文字都幫我改一下 | — | the current first-person caption set |
| through-the-dark 名字幫我改掉 | — | renamed "Toward the Light 向光而行" |
| 幫我做個影片 | — | `tools/record.js` + `encode.sh`; 1:52 walkthrough |
| 角色不要走路，場景動 → 這幾幕加入走路，要藝術 | arrive, crack, office, field | **the hero walks in place and the world slides past**, with the `stroll()` gait; footprints in the snow |
| 手根桿子分離了 | flood | oars are aimed from the hands every frame |
| 要五隻手指 → 沒有銜接很好 | hands | five-finger hands; palm starts inside the cuff and covers finger bases |
| 不需要小圈圈 | minusone | the thin ground ring under the lights was removed |
| 手埋進桌子了 → 加上鍵盤 | desk | forearms rest above the desktop; a keyboard under the hands |
| 支架太長 螢幕不該有支架 → 螢幕要有高度 → 需要支架 | desk | monitor at eye height on a stand hidden **behind** the panel, nothing in front of the screen |
| 文字 藝術一點 不要負面 | all copy | hopeful, poetic captions and About text |
| 每一幕 不用顯示 03 -24 數字 | captions | scene counter removed |
| 走路 身體跟腳怪怪的 | walk | ankles (flat feet), smaller stride, coat panels at 50 %, tiny torso twist |
| 文字最後都用英文 | all copy | **English only** |

## Practical rules distilled

1. Never hand-model a human face. Silhouette, facets and posture carry the emotion.
2. White objects on white backgrounds disappear. Give them a darker sky or ground, or a rim light.
3. Light sources on the horizon get clipped by the ground. Use `depthTest:false` on the halo, or raise the source.
4. Big, busy foreground geometry fights the caption. Keep the lower-middle of the frame calm while the caption is showing (t ∈ .12–.75).
5. Check every pose in side, front and three-quarter views before shipping. Look for limbs through the coat, feet through the floor and heads in pillows.
6. When the owner says "簡單一點" or "不要太複雜", remove things rather than restyling them.
7. Objects people use must be believable: a monitor stands at eye height on a stand behind it, hands grip what they hold, forearms rest on a desk rather than in it.
8. Feedback often comes as a screenshot plus a few words, and sometimes the next message corrects the first (e.g. "no stand" then "needs a stand, at height"). Read the latest pair together and fix the underlying problem the screenshot shows.
