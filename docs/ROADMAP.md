# Roadmap and improvement ideas

Ordered roughly by value-for-effort. Anything visual should be checked with screenshots (see [WORKFLOW.md](WORKFLOW.md)) and against [ART-DIRECTION.md](ART-DIRECTION.md).

## 1. Character quality (highest impact)

- **Spine and neck pivots.** Expose `up` as a spine joint (and add a neck) so the hero can slump, curl, look up and breathe. Scenes `shards`, `desk`, `room`, `call` and `skyline` all benefit.
- **Lying pose.** The coat is rigid when he lies down (`room`); the seated/curled poses were solved in v41 with lap and knee pieces, but lying needs a spine.
- **Two-bone arm IK** so hands can hold the phone, the pot and the keyboard precisely (today each scene is tuned by hand).
- **Standing idle.** A subtle breathing or weight shift for the still scenes (`end`, `skyline`, `bloom`, `minusone`). No trembling.
- **Gait polish.** Heel-to-toe roll (heel lifts before toe-off) would make `stroll()` more natural; keep the flat planted foot.

## 2. Scenes the owner may push back on

- **`subway`:** daisy petals still drift there; the owner removed flowers from most scenes, so consider removing them.
- **`crack`:** the crack reads as a line, not a fracture: one dark tone, ragged width, jogs along slab joints (see model-polish/water-ground.md).
- **`flood`:** a darker pool or an inverted hull copy under the waterline for hull contact; the thole pins are too small to read.
- **`desk`:** raise the hero ~.07 so the thighs sit on the chair seat instead of inside it.
- **`rooftop`:** the AC unit is hidden behind the tank from every camera position; move or remove it.
- **`field`:** the hero is nearly black against the light; add a faint fill so his walk reads.
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
- **Audio:** the generated piano follows only dark and light. A per-scene mood (rain noise in `flood`/`call`/`store`, a room tone in `office`) would add a lot. It must still be generated, not loaded from files.

## 4. Release checklist

- Confirm rights for the "Through the Dark" inspiration credit before any public or commercial use. No official logos are used; the daisy is an original model.
- Re-render the video (`tools/record.js`): the existing one predates the English text, the walk and the desk changes.
- Replace the "Privacy & Terms" placeholder link in the intro and About footer with a real page, or remove it.
- Add OG/Twitter meta tags and a share image (render one with `tools/shots.js`).
