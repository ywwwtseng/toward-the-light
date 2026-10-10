# Workflow

## Build

```bash
./build.sh
```

It produces three files:
- `dist/index.html` is the deliverable: standalone, with three.js from cdnjs.
- `dist/artifact.html` is the same content without the `<!doctype>/<html>/<head>/<body>` wrapper, for publishing as a claude.ai Artifact (the Artifact host adds its own skeleton).
- `dist/test.html` loads `dist/three.min.js` locally, so headless tools work offline. `build.sh` copies the file from `tools/vendor/`.

There is no transpiler and no minifier. The JS is ES2020 that runs as-is in evergreen browsers.

## Verify by looking

Software WebGL (SwiftShader) in headless Chromium runs at about 3–9 fps. The page eases toward the scroll target, so the visible scene **lags** behind the scroll position. The tools account for that, but keep it in mind when a screenshot shows the previous scene.

```bash
npm install                        # once; Playwright. In Claude cloud sessions Chromium is at /opt/pw-browsers/chromium (auto-detected)
node tools/shots.js 8.5 21.85      # specific positions: scene index + fraction
WAIT=10000 node tools/shots.js 15.3
node tools/shots.js --all && python3 tools/contact.py   # every scene at t=.5 -> out/contact.jpg
```

Tips:
- Shots are taken in order. Visiting nearby positions in sequence lags less than jumping around; for a shot far from the previous one, add a lead-in position first (`15.9 16.35`) and keep `WAIT` ≥ 9000.
- To check a scene's start, middle and end, shoot `i+.2`, `i+.5` and `i+.85`. Captions are only visible for t ∈ .12–.75.
- For a character pose, use `tools/pose.html` (side/front/three-quarter) instead of the full page. It fetches `dist/test.html`, so serve the repo root first (`python3 -m http.server 8000`, then open http://localhost:8000/tools/pose.html?v=2); it does not work from file://.
- For the walk cycle, use `tools/gait.html` (same server): eight phases of `stroll()` from the side and from behind. Check that feet are flat when planted and that the coat stays one piece from behind.
- Look at the actual PNGs every time. The owner will notice floating buildings, clipping, invisible white objects and stiff limbs immediately.

## Measure the model budget

```bash
node tools/inventory.js                         # -> out/inventory.json + out/inventory.md
```

It builds every scene headless and records, per scene: scene triangles (instanced meshes multiplied by their count, hero excluded), hero triangles, meshes, instanced meshes and instances, line objects, point counts, lights, and the 12 heaviest non-hero meshes (geometry, tris per piece, instance count, tone, lit/unlit, world position). The committed snapshots are `docs/data/inventory-v40.json` (before the model polish) and `docs/data/inventory-v41.json`; the per-scene docs in `docs/scenes/` quote them. Re-run it after any model change and update the Budget row of the scene doc. To measure another version, check it out in a worktree, `./build.sh` there, and run the same script from that checkout (`OUT=out/inv_old node tools/inventory.js`).

## Large model changes (how v41 was done)

For a change that touches many scenes, the v41 model polish is the pattern to copy (details in [model-polish/README.md](model-polish/README.md) and its [brief](model-polish/brief.md)):

1. **Study first.** Pull frames from the reference film, write the standard ([REFERENCE-STYLE.md](REFERENCE-STYLE.md)) and a per-scene audit before touching code.
2. **Split by ownership.** Each group owns specific scene blocks and helpers (one owner per shared helper: `building()`/`street()` = city, `suitcase()` = void-objects, `makeHero()` = hero), on its own branch and git worktree, so groups never edit the same lines.
3. **Before/after shots for every change** at `i+.35` and `i+.65` plus close-ups, kept next to a `summary.md` of what changed and why.
4. **Two independent reviews per group**: an art director (does it look better and closer to the film; would the owner say 很怪?) and a technical reviewer (diff scope, triangle growth, PAGE ERROR, clipping, z-fighting, contact, caption band). Fix every blocker and re-review; stop after three rounds.
5. **Merge in dependency order** (helpers first: city, then scenes, hero last), rebuild, shoot all 24 scenes, look at every one, then publish.

## Record the video

```bash
node tools/record.js && ./tools/encode.sh      # -> out/toward-the-light.mp4 (~1:52, 1280x720, 24 fps)
LIMIT=30 node tools/record.js                  # quick test
PER=6 FPS=30 W=1920 H=1080 node tools/record.js   # slower, larger
```

`record.js` replaces `requestAnimationFrame` with a manual stepper. Each frame it sets the scroll position, advances the page with a fake clock and takes a screenshot, so the result is smooth no matter how slow WebGL is. A full run takes about 15 minutes in a cloud container.

`encode.sh` adds a generated ambient drone (the site's old WebAudio pad). The site now plays a generated piano instead; to match it, record the page's audio rather than the drone.

Known quirk: CSS transitions (caption fade, `#fade`) still run on real time. Because each captured frame takes about 0.3 s of real time, caption fades look slightly faster in the video than on the site.

## Publish

- **Static hosting:** upload `dist/index.html` anywhere (GitHub Pages, Netlify, S3). No other files are needed.
- **claude.ai Artifact:** publish `dist/artifact.html` to the existing artifact URL so the link stays the same. Artifacts allow scripts only from cdnjs/jsdelivr/unpkg and stylesheets only from Google Fonts, which this page already respects.

## Editing captions and titles

Captions:
- They are at the top of `src/app.js` in the `CAPTIONS` object, one entry per scene key.
- An empty string hides the caption for that scene.
- Text rules: English only, one short line, hopeful and poetic, no negative wording, no flower wording. See [ART-DIRECTION.md](ART-DIRECTION.md#text).

Titles:
- `TITLE_A` / `TITLE_B` are the two halves of the big title in scene 0.
- `PRESENTS` is the small line under it.
- The same name appears in `src/head.html` (`<title>`) and in `src/body.html` (intro words, ending title, About footer). Change all of them together.
- Other on-page copy (scroll hint, ending note, About paragraphs, aria labels) lives in `src/body.html`; the loader line is in `runLoader` in `src/app.js`.

## Refresh the storyboard

```bash
node tools/shots.js --all && python3 tools/contact.py && cp out/contact.jpg assets/storyboard.jpg
```
