# The protagonist

`makePerson(opts)` routes to `makeHero(opts)` unless `child` or `father` is set; those two are legacy and unused. `makeHero` builds a **faceless, deliberately low-poly figure**. Each body part is a `loftGeo` with 4–6 sides and a per-facet tone jitter, like folded paper or plaster. He measures about 1.92 units from the soles to the top of the hair (default stance bounding box y −.035 … 1.916; the head is a gem under a hair shell, so eye level is about 1.7), with the feet at y = 0. Older docs say 1.75; use 1.92 when you place things against his head.

The owner asked for this direction ("低面數、更藝術感") after rejecting every attempt at a realistic or anime face. **Do not add a face** unless the owner supplies a model, such as a VRoid `.vrm`. See [ART-DIRECTION.md](ART-DIRECTION.md).

## Options

```js
makePerson({ body, jacket, mat })
// body   -> trouser colour (default 0x2a2a2a; the shoes are derived from it, half as bright and never above 0x101010, so the trousers always read one tone lighter than the shoes)
// jacket -> coat colour (default 0x3a3a3a)
// mat    -> override material for every part (used for the 'end' reflection and the dark copy in 'flip')
```

## Rig (`person.userData`)

The hero faces +z in his own space. **Index 0 is his right side (local −x); index 1 is his left.**

| Joint | Type | Notes |
|---|---|---|
| `legs[0..1]` | hip pivots | `rotation.x` < 0 swings the leg forward; `rotation.z` spreads it |
| `knees[0..1]` | knee pivots | `rotation.x` > 0 bends the shin back |
| `ankles[0..1]` | ankle pivots (hero only) | the shoe hangs here, 0.44 below the knee. `stroll()` sets them so the sole stays flat while the foot is planted |
| `arms[0..1]` | shoulder pivots | `rotation.x` < 0 swings the arm forward; `rotation.z` moves it sideways (positive moves the hand toward +x) |
| `elbows[0..1]` | elbow pivots | `rotation.x` < 0 bends the forearm forward/up. Single axis only, so forearms cannot cross the body |
| `hands[0..1]` | hand groups (hero only) | children of the elbows, 0.255 below them. See **Hands** |
| `head` | head pivot | `rotation.x` > 0 looks down |

The torso is an inner group `up` at y = 0.88. It is not exposed, so **the spine cannot bend**. To make him curl or lean, rotate the whole group (`person.rotation.x`).

**The coat** is a fixed seat piece plus two skirt panels, one per leg. Each panel's pivot overrides `updateMatrix` to copy its leg's swing:
- 50 % of the leg's rotation while walking (`userData.walking`, set by `stroll`), so the coat reads as one garment.
- 80 % otherwise.
- From −.45 to −.6 rad the follow factor fades to 100 %, so by the switch the panel already lies on the thigh.
- Past −.6 rad (above `walk()`'s amplitude of .45; sitting and curling are at −1.5/−1.75) the panel is hidden and two other pieces take over: a lap piece that hugs the thigh (100 % follow; its end ring hides the flap's top so no lit shelf shows on the knee) and a short flap hinged on the knee group that hangs down the shin; the seat piece swaps to a short version ending at y .92, above the thighs' underside (hip −.08), so nothing in the rig hangs under a seat whatever height a scene chooses. Both panels share one jitter seed and overlap 2–3 cm at the centre line (the left one is 1.4 mm deeper so the faces are not coplanar), so there is no split line down the back and no gap at the hem.

A dark collar ring (coat tone × .55) stands on the sloped shoulders, tapering from .29 at the base to .215 at the rim (1.25× the head) and leaning back so the chin overhangs its front; a six-sided turtleneck in the inner tone rises inside it into the jaw (its top cap is inside the head loft), so the neck never shows from any angle; the same dark tone makes the sleeve cuffs. The sleeve's small cap ring sits 6 cm inside the torso so the shoulder has no bump. The hair shell has a flat top 6 cm above the crown and a fringe plate lying on the forehead down to y ≈ .16 with a straight, slightly swept lower edge; the skin loft's facets under the fringe, on the crown and under the chin carry a darker vertex tone (×.85 / ×.7 / ×.82, flat per facet) so the lit face reads as a shaded face when the head tilts back. Shoes are a six-sided plan (flat heel, flat toe) whose widest ring (the sole lip) is at −.02 below the ankle, 2 cm above the floor line when standing, with the sole still .06 below the ankle pivot, which `stroll()` and the boat rely on.

## Hands

The owner asked for five fingers (「要五隻手指」) and then for them to join cleanly (「沒有銜接很好」). Each hand has:
- a faceted palm that starts inside the cuff (no wrist gap) and covers the finger bases
- four fingers with two overlapping segments each, and a two-segment thumb

The palm faces the thigh (hand-local −z) and the fingers curl toward it. `hand.rotation.y = side·π/2` by default; set it to `0` for palms-down poses like typing.

```js
hand.userData.grip(k)   // 0 open, ~.18 relaxed (default), ~.35 resting on keys, 1 closed around a handle
```

`suitcase(person)` hangs the case from the **left** hand (index 1) and closes it. The rowing scene closes both hands on the oars.

## Built-in poses

- **`stroll(dist, {amp=.34, carry=false, gaze=.05})`** (hero only): the walk. It is a walk in place, with the phase driven by how far the ground has moved (`dist`, scene units):
  - stance is linear, so the planted foot travels exactly with the ground and never slides
  - swing is a soft arc with an early knee lift; the toe lifts slightly mid-swing
  - ankles keep the sole flat while planted
  - the whole figure drops so the lower sole stays at y = 0
  - shoulders counter-rotate only a little (a big twist breaks the coat at the waist), and the arms swing with a small lag
  - `carry` makes the left arm swing only slightly, as if holding something heavy; `gaze` sets the head pitch
  - scenes use `amp` .27–.3. The owner found larger strides odd
- `walk(phase, amp=.45)`: the old mechanical gait. **Do not use it** (the owner rejected it).
- `sit()`: thighs at −1.5, knees at 1.45, arms resting forward. Seat height offset: the hero's origin sits about 0.95 below the seat top, so place him at `seatY - .95`.
- `float(time)`: loose, drifting limbs, used in `drift`.

## Poses set by hand in scenes

| Scene | Pose |
|---|---|
| `desk` (typing) | `sit()`, arms `(-1.42, 0, ±.2)` turned in, elbows `-.15`, hands `rotation.y = 0`, `grip(.35)`. With the shoulder at y .88, the elbows end up at about y .835, so the forearms clear the desktop (y .765) and the hands land on the keyboard |
| `flood` (rowing) | `sit()`, stroke: arms `lerp(-1.25, -.6, pull)`, elbows `lerp(-.15, -1.2, pull)` (v41: hands stay below the shoulder line). Each oar is aimed every frame from the grip point (elbow-local `(0, -.33, 0)`) through an oarlock, so the oars follow the hands |
| `shards` (curled up) | `legs -1.75, knees 2.25, arms (-.85, 0, ±.45), elbows -1.0, head .9`, plus whole body `rotation.x = .25` |
| `call` (phone to ear) | left arm `arms[1]` `(-.35, 0, .15)` with `elbows[1]` `-2.45` (index 1 = his left), the other arm `-.7` / elbow `-.6`, head tilted `(.25, 0, -.12)`. The phone mesh follows `head.getWorldPosition()` each frame |
| `room` (lying in bed) | `person.rotation.x = -π/2` on the mattress, `head.rotation.x = .55` so the head rests *on* the pillow, not in it |
| `store` | `sit()`, then arms `-.97`, elbows `-.6` (forearms on the counter), knees `2.0`, ankles `-.5` (heels on the stool ring), head `.15` |

Contact points the owner has caught: head in the pillow, hands sinking into the desk, hands separated from the oars, fingers detached from the palm. Check every contact in a close screenshot.

## Tools

- `tools/pose.html?v=0|1|2`: side, front or three-quarter view of the hero alone. Edit `POSE` at the top.
- `tools/gait.html`: eight phases of `stroll()` from the side and from behind.

Both fetch `dist/test.html`, so run `./build.sh` and serve the repo root (`python3 -m http.server 8000`). They don't work from `file://`.

## Known limitations and ideas

- **No spine or neck chain.** Curling, slumping and looking far up are approximations. `up` already exists; expose it in `userData` and offset the shoulders.
- **The skirt pieces are rigid.** Standing panels, seated lap pieces and knee flaps are each one loft; the switch at −.6 rad on the thigh only swaps shapes (the panel already follows the thigh 100 % there), so a pose that crosses it while on screen would show a small shape change, not a block (no scene does).
- **No arm IK.** Hand placement is solved per scene by hand (desk) or by moving the object to the hand (oars). A two-bone IK would make the phone, the pot and the keyboard exact.
- **No idle breathing.** A subtle breathing or weight shift would help the standing scenes (no trembling).
