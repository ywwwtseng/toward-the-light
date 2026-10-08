# Roadmap and improvement ideas

Ordered roughly by value-for-effort. Anything visual should be checked with screenshots (see [WORKFLOW.md](WORKFLOW.md)) and against [ART-DIRECTION.md](ART-DIRECTION.md).

## 1. Character quality (highest impact)

- **Spine and neck pivots.** Expose `up` as a spine joint (and add a neck) so the hero can slump, curl, look up and breathe. Scenes `shards`, `desk`, `room`, `call` and `skyline` all benefit.
- **Skirt panels in deep poses.** They form a slab when the thighs are raised (`shards`, `sit`). Hide or fold them past a threshold, or hinge them.
- **Two-bone arm IK** so hands can hold the phone, the cup and the pot precisely.
- **Richer gait.** Add weight shift, heel strike and a slower "tired" walk variant for the late scenes.

## 2. Scenes the owner may push back on

- **`subway`:** the train barely reads. Add window light strips moving across the platform and a stronger headlight.
- **`store`:** the shelves are blown out by glow. Lower the interior brightness to about 0.85 so products read, keeping the window bright.
- **`towers`:** no hero. Consider a tiny figure at the bottom of the frame for scale.
- **`end`:** the reflection is a mirrored copy. A real planar reflection (render target, or `Reflector` from three/examples) would be nicer.
- **Scene count:** the owner asked for 25 and later removed one, so it is 24 now. If asked for 25 again, candidates fitting the arc are:
  - morning commute in a crowd of identical walkers
  - laundromat at night
  - first snow on the way home

## 3. Engineering

- **Lazy scene building.** All 24 scenes are built during the loader. Building `i-1..i+1` on demand would cut start-up time and memory, but `renderer.compile` must then run before a scene first appears to avoid a hitch.
- **Adaptive quality.**
  - Drop the render-target size, glow taps and shadows when the frame time is above 20 ms.
  - Mobile GPUs currently get the full pass with DPR capped at 1.75.
- **Delete the legacy code:** `faceTexture`, `silMat`, father/child branches of `makePerson`, `forest`, `rock`. Verify with `grep` that nothing references them.
- **Rename historical keys:** `petals → days`, `bloom → sunrise`, `field → darkwalk`, `minusone → ring`. Update `CAPTIONS`, `SCENES` and the docs together.
- **Split `app.js` into modules** (e.g. `core/`, `character/`, `scenes/*.js`) with a tiny concatenating build. Keep the single-file output; the artifact host needs it.
- **Accessibility:**
  - `prefers-reduced-motion` already disables easing. Consider also disabling the handheld drift and grain.
  - Add a skip or "read the story" text version.
- **Audio:** the WebAudio pad is minimal. A per-scene mood (rain noise in `flood`/`call`/`store`, a room tone in `office`) would add a lot. It must still be generated, not loaded from files.

## 4. Release checklist

- Confirm rights for the PEACEMINUSONE inspiration credit before any public or commercial use. No official logos are used; the daisy is an original model.
- Replace the `隱私權與條款` placeholder link in the intro and About footer with a real page, or remove it.
- Add OG/Twitter meta tags and a share image (render one with `tools/shots.js`).
