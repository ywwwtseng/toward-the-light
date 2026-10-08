# Instructions for coding agents

This repo is a single-page, scroll-driven three.js story. The owner (William, GitHub `ywwwtseng`) writes in Traditional Chinese and gives short visual feedback ("不像", "太呆", "很怪", "太醜了", "不要花"). Reply to him in Chinese. Code comments and docs stay in English.

## Ground rules

1. **Edit `src/`, never `dist/`.** Run `./build.sh` after every change. `dist/index.html` is the deliverable.
2. **Keep it one file with no build tooling.** three.js r128 comes from cdnjs, and fonts come from Google Fonts. Everything else is generated in code: no image, model or audio files. If you need something new (a GLTF model, a newer three.js), raise it with the owner first. The page is also published as a claude.ai Artifact, which only allows scripts from cdnjs/jsdelivr/unpkg and stylesheets from Google Fonts.
3. **Verify visually before saying something is done.** Use `tools/shots.js` and look at the PNGs. Most bugs here are visual: floating buildings, clipping limbs, invisible white-on-white objects, a caption over a busy area. See [docs/WORKFLOW.md](docs/WORKFLOW.md).
4. **Respect the art direction** in [docs/ART-DIRECTION.md](docs/ART-DIRECTION.md). It records things the owner explicitly rejected, so don't reintroduce them:
   - realistic faces
   - the flower motif in text
   - grass in the dark-walk scene
   - a walking hero (he stands still; the scene moves past him)
   - jittery motion
5. **The scene contract is small. Keep it.** A scene is `{key, bg, dark(t), build() -> {scene, update(t, time)}}`, and its caption is `CAPTIONS[key]`. Adding a scene means adding one object to `SCENES` plus one caption. The scroll track length follows `SCENES.length` automatically.
6. **Performance budget:**
   - The page must stay smooth on a mid-range laptop.
   - Every scene is built up-front by the loader and kept in memory.
   - Keep instanced counts sane: the largest today are the 320 shards and 160 umbrellas.
   - Only meshes with a bounding radius < 1.2 cast shadows.

## Where things are in `src/app.js`

Search for these banner comments:

| Banner | Contents |
|---|---|
| `可編輯區` | `CAPTIONS`, plus `TITLE_A`, `TITLE_B` and `PRESENTS` |
| `utilities` | `clamp`, `lerp`, `ease`, `smooth`, `rng(seed)` and `V3` |
| `renderer` | WebGL renderer, render target and the film-pass shader |
| `materials & helpers` | `M`, `B`, `box`, `lights`, `canvasTex`, `gradTex`, `glow`, `stars` and `ground` |
| `characters` | `loftGeo`, `makePerson` and `makeHero` (the protagonist), plus legacy face/father/child code |
| `city helpers` | `facadeTex`, `building`, `street`, `suitcase` and `rain` |
| `daisies` | `petalGeo`, `centerGeo`, `leafGeo`, `makeDaisy` and `daisyGeo` |
| `SCENES` | the 24 scene builders, numbered comments `/* N — ... */` |
| `main render loop` | `progress()`, `buildAll()` and `frame()`: scroll easing, scene dips, captions, ending |
| `loader`, `ambient sound`, `flow`, `About illustrations` | everything around the 3D |
