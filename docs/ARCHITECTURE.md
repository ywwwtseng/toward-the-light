# Architecture

Everything runs in one HTML page. `build.sh` stitches together `src/head.html`, `src/style.css`, `src/body.html`, the three.js r128 `<script>` tag and `src/app.js`.

## Page flow

```
#intro (BEGIN button)
  -> click: startAudio(), show #loader
  -> runLoader(): spins a canvas loader; ~0.3s in, buildAll() builds every scene once and pre-compiles shaders
  -> loader done: show #hint ("Scroll down / walk with him toward the light"), unlock body scroll
  -> first scroll/wheel/touch: started = true, the 3D loop begins drawing scenes
  -> last scene, t > .72: #ending overlay (title + "Walk again" + About button)
  -> #about: slide-up panel (story, concept, credit line)
```

`body.locked` prevents scrolling until the loader is done. `#track` is an empty div whose height is `SCENES.length * 130vh`; it exists only to create scroll distance.

## Scroll → scene mapping (`frame()`)

```js
target = progress();                 // scrollY / maxScroll * SCENES.length, so 0..N
cur += (target - cur) * .07;         // eased; the 3D trails the scrollbar (instant if prefers-reduced-motion)
i = floor(cur); t = cur - i;         // scene index and 0..1 progress inside it
SCENES[i].inst.update(t, time);      // the scene moves its own camera and objects
```

- **Handheld drift:** after `update`, the camera gets a small sinusoidal drift (x, y and roll). Keep `update` deterministic in `t`; `time` is only for idle motion (rain, flicker, walking).
- **Dip between scenes:** the full-screen `#fade` div fades to the *next* scene's `bg` colour for t ∈ [.9, 1], and from the current `bg` for t ∈ [0, .1]. This is why each scene declares `bg`: pick the colour that dominates its first and last frames.
- **Caption:** shown while t ∈ (.12, .75). It is swapped with a 450 ms delay so the CSS fade-out finishes first. The colour flips on `dark(t)`: white text with a dark halo, or black text with a white halo.
- **No scene counter.** The `NN — NN` line was removed at the owner's request; `#caption` holds only `.cap-t`.

## The scene contract

```js
{ key: 'store',              // caption key, also used in docs/tools
  bg: '#060606',             // dip colour
  dark: t => true,           // is the frame dark at progress t? (caption colour, shader grain/vignette strength)
  build() {                  // called once by the loader
    const scene = new THREE.Scene();
    ...
    return { scene, update(t, time) { /* move things + set `camera` */ } };
  } }
```

There is one shared `camera` (45° fov, 62° on portrait screens). Each scene owns it completely while active: set position and lookAt every frame.

**Shadows are assigned automatically in `buildAll()`:**
- Every opaque `MeshStandardMaterial` mesh receives shadows.
- Only meshes with a world bounding radius < 1.2 cast them. This keeps big floors and buildings from darkening the scene.
- Instanced meshes are skipped.
- `lights(scene, {hemi, dir})` adds a hemisphere light, a shadow-casting key light (shadow camera ±14, 1536 px map) and a rim light from behind. Most scenes use it; dark scenes often hand-place lights instead.

## Film pass

The scene renders into `RT` (multisampled on WebGL2). A full-screen `ShaderMaterial` (`post.mat`) then applies these steps in order:

1. **Chromatic fringe**, growing with radius.
2. **Glow:** 8 directions × 3 radii sampling pixels above 0.8 brightness. Strength 0.3; reduced in light scenes via `dark`.
3. **Desaturation:** 25 %. This is why the few colours (daisy yellow, green stems) read as muted.
4. **S-curve and lifted blacks:** the `c*.95+.03` printed-film look.
5. **Cool shadows and warm highlights.**
6. **Vignette:** stronger when `dark`.
7. **Animated grain:** stronger when `dark`.

Uniforms: `tex`, `res`, `time`, `dark`. Pure white reads as `#f4f4f4`-ish after the pass; that is intentional.

## Helpers you will reuse

| Helper | Notes |
|---|---|
| `M(color, opts)` | `MeshStandardMaterial`, flat-shaded, roughness 1, double-sided. Pass `{flatShading:false}` for smooth things. |
| `B(color, opts)` | `MeshBasicMaterial`, unlit: screens, windows, light sources |
| `box(w,h,d,mat,x,y,z)` | positioned box mesh |
| `gradTex(top, bottom)` | vertical gradient texture for `scene.background` |
| `glow(scale, opacity)` | additive radial-gradient sprite. For a light source on the horizon, set `material.fog=false`; to stop the ground clipping it, also set `depthTest=false` and `renderOrder=10`. |
| `stars(n, radius, opts)` | point sprites |
| `ground(color, size=400)` | horizontal plane at y=0. Every city scene needs one, or buildings look like they float (owner feedback). |
| `building(w,h,d,night,{col})` | box with a procedural window-grid facade, base at y=0 |
| `street(scene, opts)` | two rows of buildings along -z |
| `rain(n, area, seed)` | line segments; animate `.position.y` |
| `rng(seed)` | deterministic PRNG. Use it instead of `Math.random()` so scenes are identical every load. |
| `canvasTex(w,h,draw)` | draw on a 2D canvas, get a texture (calendar pages, city-at-night window, etc.) |
| `worldGroup(scene, keep=[])` | moves every non-light child of `scene` (except `keep`) into one group and returns it. Used by the walk-in-place scenes: animate the group, not the hero. |

## Loader, audio, About

- **`runLoader`:** draws orbiting rings on `#loadCanvas`, alternates "Loading N%" with "For the best experience, wear headphones", then wipes to white.
- **Audio:** WebAudio only, no files. Four detuned oscillators (55, 82.4, 110.2 and 164.8 Hz) with slow LFOs go through a low-pass filter. `audioMood(dark)` moves the cutoff between 380 Hz in dark scenes and 1400 Hz in light ones. `#sound` toggles mute.
- **About illustrations (`aboutShots`):** one offscreen render of the hero, plus a hand-drawn canvas phone/eclipse icon.

## Legacy code still in `app.js`

These are not referenced by the current story but are kept intentionally:

- `faceTexture`, `silMat`, and `makePerson({father:true})` / `{child:true}`: earlier character experiments, including a father-and-son version of the story.
- `forest`, `rock`: from the original snowy-forest replica.

They can be deleted in a cleanup pass. Check with `grep` first.

## Walking in place

The hero never travels through the world. In `arrive`, `crack`, `office` and `field`, he stays at a fixed position and the environment moves:

```js
const world = worldGroup(scene, [me]);   // in build(), after the set is built
// in update(t):
const d = t * 22;                         // how far the ground has moved this scene
world.position.z = d;                     // world slides toward the camera
me.userData.stroll(d, {amp: .3});         // the gait phase comes from the same distance, so feet stay planted
```

Snow and rain usually stay outside the group so they keep falling around him. In `arrive`, footprints are placed in the world group at exact heel-strike positions and revealed as `d` grows.
