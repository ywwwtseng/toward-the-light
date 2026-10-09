# Instructions for coding agents

This repo is a single-page, scroll-driven three.js story. The owner (William, GitHub `ywwwtseng`) writes in Traditional Chinese and gives short visual feedback, often with a screenshot ("不像", "太呆", "很怪", "太醜了", "不要花", "沒有銜接很好"). Reply to him in Chinese. Code comments and docs stay in English, and **all text on the site is English**.

## Ground rules

1. **Edit `src/`, never `dist/`.** Run `./build.sh` after every change. `dist/index.html` is the deliverable.
2. **Keep it one file with no build tooling.** three.js r128 comes from cdnjs, and fonts come from Google Fonts. Everything else is generated in code: no image, model or audio files. If you need something new (a GLTF model, a newer three.js), raise it with the owner first. The page is also published as a claude.ai Artifact, which only allows scripts from cdnjs/jsdelivr/unpkg and stylesheets from Google Fonts.
3. **Verify visually before saying something is done.** Use `tools/shots.js` and look at the PNGs. Most bugs here are visual: floating buildings, clipping limbs, hands sinking into a desk, fingers detached from the palm, a hand not touching the object it holds, invisible white-on-white objects, a caption over a busy area. For poses and the walk, use `tools/pose.html` and `tools/gait.html`. See [docs/WORKFLOW.md](docs/WORKFLOW.md).
4. **Respect the art direction** in [docs/ART-DIRECTION.md](docs/ART-DIRECTION.md). It records things the owner explicitly rejected, so don't reintroduce them:
   - realistic faces
   - flower wording in text, and negative wording (loss, collapse, loneliness)
   - Chinese text on the site (it is English only)
   - the "03 — 24" scene counter
   - grass in the dark-walk scene
   - the hero translating through the world (he walks in place with `stroll`; the scene moves past him)
   - jittery motion
   - the old mechanical `walk()` gait
   - a monitor stand that shows in front of the screen
   - placeholder boxes for props: every object is a designed low-poly sculpture (see [docs/REFERENCE-STYLE.md](docs/REFERENCE-STYLE.md) and [docs/model-polish/README.md](docs/model-polish/README.md)); keep it low-poly (≤ 8 sides, flat shading, instancing for repeats, roughly ≤ 2× triangles per scene)
   - thin trim panels less than ~3 cm proud of a face: the 16-bit depth target makes them z-fight into stripes (draw order **and** offset, see ARCHITECTURE.md)
5. **The scene contract is small. Keep it.** A scene is `{key, bg, dark(t), build() -> {scene, update(t, time)}}`, and its caption is `CAPTIONS[key]`. Adding a scene means adding one object to `SCENES` plus one caption. The scroll track length follows `SCENES.length` automatically.
6. **Performance budget:**
   - The page must stay smooth on a mid-range laptop.
   - Every scene is built up-front by the loader and kept in memory.
   - Keep instanced counts sane: the largest today are the 320 shards and 160 umbrellas.
   - Only meshes with a bounding radius < 1.2 cast shadows.

## Before you touch a scene or a model

Read the docs for exactly the thing you are changing. They were written so you do not have to re-derive the scene from 1,700 lines of `app.js`:

1. **[docs/SCENES.md](docs/SCENES.md)**: story order and a matrix of how the 24 scenes differ (setting, light or dark, hero pose, what moves, camera, signature models, shared helpers, triangle budget, lights, owning model group).
2. **`docs/scenes/NN-key.md`** (e.g. [docs/scenes/16-flood.md](docs/scenes/16-flood.md)): one page per scene with a v41 screenshot, every model in it (helper, position, tone, triangles), lights, the `update()` animation, what changed in v41, editing pitfalls and how to check your change.
3. **[docs/MODELS.md](docs/MODELS.md)**: catalogue of every model builder (shared helpers, the hero rig, local helpers inside scene blocks), which scenes use each one, the tone ladder, the triangle budget per scene and legacy code you should not revive.
4. **[docs/CHARACTER.md](docs/CHARACTER.md)** for anything the hero does; he is about 1.92 units tall to the top of the hair (eyes about 1.7), not 1.75.

Then measure. `node tools/inventory.js` builds every scene headless and writes `out/inventory.json` and `.md` (triangles with and without the hero, meshes, instances, lights, heaviest meshes). Compare with [docs/data/inventory-v41.json](docs/data/inventory-v41.json). If a scene grows past about 2× its v41 count, justify it in the scene doc. **When you change a scene, update its `docs/scenes/NN-key.md`, the matrix row in SCENES.md and, if a helper changed, MODELS.md**, and replace its image in `assets/scenes/` from a fresh `tools/shots.js` run.

## Where things are in `src/app.js`

Search for these banner comments:

| Banner | Contents |
|---|---|
| `Editable` (top of file) | `CAPTIONS`, plus `TITLE_A`, `TITLE_B` and `PRESENTS` |
| `utilities` | `clamp`, `lerp`, `ease`, `smooth`, `rng(seed)` and `V3` |
| `renderer` | WebGL renderer, render target and the film-pass shader |
| `materials & helpers` | `M`, `B`, `box`, `lights`, `canvasTex`, `gradTex`, `glow`, `stars`, `worldGroup` and `ground` |
| `characters` | `loftGeo`, `makePerson` and `makeHero` (the protagonist: hands, ankles, `stroll()` gait), plus legacy face/father/child code |
| `city helpers` | `facadeTex`, `building`, `street`, `suitcase` and `rain` |
| `daisies` | `petalGeo`, `centerGeo`, `leafGeo`, `makeDaisy` and `daisyGeo` |
| `SCENES` | the 24 scene builders, numbered comments `/* N — ... */` |
| `main render loop` | `progress()`, `buildAll()` and `frame()`: scroll easing, scene dips, captions, ending |
| `loader`, `ambient sound`, `flow`, `About illustrations` | everything around the 3D |
