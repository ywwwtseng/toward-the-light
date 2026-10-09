# Model-polish job brief (shared by every agent)

Project: "Toward the Light", a scroll-driven low-poly black-and-white three.js story. The owner (William) asked, in Chinese:
「幫我把每個 model 優化，維持低面數，可參考原本影片」 = "optimise every model, keep it low-poly, you can reference the original film."

## Paths
- MAIN repo (read-only for improve agents; only the study agent commits here): `repo/toward-the-light`
- Worktrees for improve agents: `wt/<item>` (branch `model/<item>`). They already exist when you start.
- Job folder for before/after images and notes: `jobs/<item>/`
- Reference film frames (one every 3 s, 632x480, from the original "Through the Dark" screen recording): `ref/frames/fNNN.jpg` (fNNN = frame number; time = (NNN-1)*3 s). Contact sheets with timestamps: `ref/sheet1.jpg` … `ref/sheet4.jpg`. The story starts at about 96 s; before that is the loader.
- Current storyboard of all 24 scenes: `MAIN/assets/storyboard.jpg`.
- Docs to read first: `MAIN/AGENTS.md`, `MAIN/docs/ARCHITECTURE.md` (helpers), `MAIN/docs/SCENES.md`, `MAIN/docs/CHARACTER.md`, `MAIN/docs/ART-DIRECTION.md` (the owner's rejections), and `MAIN/docs/REFERENCE-STYLE.md` once it exists.

## Source layout
Everything is in `src/app.js` (about 1150 lines). `./build.sh` writes `dist/index.html`, `dist/artifact.html` and `dist/test.html` (local three.js, used by the tools). Scenes are objects in the `SCENES` array, each preceded by a banner comment `/* N — … */`. Helpers (`M`, `B`, `box`, `loftGeo`, `building`, `street`, `suitcase`, `rain`, `makeDaisy`, `glow`, `ground`, `worldGroup` …) are above the array.

## Commands (run inside your worktree)
```bash
./build.sh
NODE_PATH=/opt/node-tools/node_modules WAIT=9000 node tools/shots.js 4.35 4.65     # -> out/shots/s_4.35.png (1000x625). Positions = scene index + fraction. Captions show for .12–.75.
NODE_PATH=/opt/node-tools/node_modules WAIT=9000 node tools/shots.js --all         # every scene at .5 (slow: ~4 min)
python3 -c "from PIL import Image; Image.open('out/shots/s_4.65.png').crop((300,150,700,450)).resize((800,600)).save('crop.png')"   # close-ups
```
Headless WebGL is software (SwiftShader), ~5 fps; the page eases toward the scroll target, so WAIT must stay ≥ 9000 and shots taken in nearby, increasing order lag least. Chromium is auto-detected. Only one `shots.js` run at a time per worktree. Expect each shot to take ~10 s.

For the hero only: `tools/pose.html?v=0|1|2` and `tools/gait.html` need a static server from the worktree root: `python3 -m http.server <PORT> &` with a port unique to you (use 8800 + your item index), then a small Playwright script like `gaitshot.js` (edit the URL/port). Kill the server when done.

## Hard rules (the owner has rejected each of these before; a reviewer will check)
1. **Low-poly stays low-poly.** Flat shading, visible facets, few segments (cylinders ≤ 8 sides, spheres ≤ 8×6, lofts 4–8 sides). No smooth high-segment geometry, no normal maps, no image or model files. Everything is generated in code. Total triangles per scene should not grow by more than roughly 2×; use `InstancedMesh` for repeats.
2. **Only touch your assigned regions** of `src/app.js` (your scene blocks and the helpers named in your assignment). Never edit another scene, `CAPTIONS`, any text, CSS, HTML, the render loop, the film pass, or the hero rig unless assigned. Do not change a scene's `key`, `bg`, `dark`, the `return{scene,update…}` shape, or caption timing.
3. **No faces on the hero. No new flowers. No text changes. No trembling/jitter.** Ground must be visible under buildings. Nothing may float or clip (hands through objects, feet through floors, props through walls). Light sources on the horizon need `depthTest:false` halos.
4. **Keep the camera moves and staging** of each scene (small reframing is fine if the model demands it, but the reviewer must still recognise the scene). Keep `rng(seed)` determinism; no `Math.random()`.
5. **Walk-in-place scenes** (arrive 1, crack 2, office 3, field 21) move the environment through `worldGroup`; new props must be added to the scene *before* `worldGroup()` is called (or added to the returned group), so they move with the ground.
6. Daisies may stay as props in scenes 2, 4, 17 but must not be added anywhere else.

## What "optimise the model" means here (from the reference film)
Read `docs/REFERENCE-STYLE.md`. In short: every object should read as a deliberately designed low-poly sculpture, not a placeholder box. That means: a recognisable silhouette with a few confident facets; bevelled or chamfered edges where light catches them; a correct scale against the 1.75-unit hero; secondary forms that tell what the object is (a bed has a headboard and a folded blanket, a boat has a keel line, ribs and thwarts, a bus shelter has a frame, a bench and a sign); contact with the ground (feet, legs, shadow); and tone separation so it reads in black-and-white.

## Deliverables for an improve or fix agent
1. Before you change anything: build and shoot your scenes at two positions each (`i+.35` and `i+.65`) and copy the PNGs to `jobs/<item>/before_<key>_<pos>.png`.
2. Make the changes, rebuild, shoot the same positions (plus a close-up crop of each improved object) to `jobs/<item>/after_<key>_<pos>.png` and `jobs/<item>/after_<key>_closeup.png`. Look at every image yourself; iterate until it is clearly better.
3. `git add -A && git commit` on your branch (message: what changed, one line per scene). Commit only `src/app.js` (and `docs/` notes if you add them). Do not commit `out/` or `dist/test.html`.
4. Write `jobs/<item>/summary.md`: per scene, what changed and why, with any concern you could not resolve.
5. Return the structured result the harness asks for. Paths must be absolute.
