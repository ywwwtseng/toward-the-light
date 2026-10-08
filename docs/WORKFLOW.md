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
- Shots are taken in order. Visiting nearby positions in sequence lags less than jumping around.
- To check a scene's start, middle and end, shoot `i+.2`, `i+.5` and `i+.85`. Captions are only visible for t ∈ .12–.75.
- For a character pose, use `tools/pose.html` (side/front/three-quarter) instead of the full page. It fetches `dist/test.html`, so serve the repo root first (`python3 -m http.server 8000`, then open http://localhost:8000/tools/pose.html?v=2); it does not work from file://.
- Look at the actual PNGs every time. The owner will notice floating buildings, clipping, invisible white objects and stiff limbs immediately.

## Record the video

```bash
node tools/record.js && ./tools/encode.sh      # -> out/toward-the-light.mp4 (~1:52, 1280x720, 24 fps)
LIMIT=30 node tools/record.js                  # quick test
PER=6 FPS=30 W=1920 H=1080 node tools/record.js   # slower, larger
```

`record.js` replaces `requestAnimationFrame` with a manual stepper. Each frame it sets the scroll position, advances the page with a fake clock and takes a screenshot, so the result is smooth no matter how slow WebGL is. A full run takes about 15 minutes in a cloud container.

`encode.sh` adds a generated ambient drone using the same tones as the site's WebAudio pad.

Known quirk: CSS transitions (caption fade, `#fade`) still run on real time. Because each captured frame takes about 0.3 s of real time, caption fades look slightly faster in the video than on the site.

## Publish

- **Static hosting:** upload `dist/index.html` anywhere (GitHub Pages, Netlify, S3). No other files are needed.
- **claude.ai Artifact:** publish `dist/artifact.html` to the existing artifact URL so the link stays the same. Artifacts allow scripts only from cdnjs/jsdelivr/unpkg and stylesheets only from Google Fonts, which this page already respects.

## Editing captions and titles

Captions:
- They are at the top of `src/app.js` in the `CAPTIONS` object, one entry per scene key.
- An empty string hides the caption for that scene.
- Text rules: first person, one line, no flower wording.

Titles:
- `TITLE_A` / `TITLE_B` are the two halves of the big title in scene 0.
- `PRESENTS` is the small line under it.
- The same name appears in `src/head.html` (`<title>`) and in `src/body.html` (intro words, ending title, About footer). Change all of them together.
