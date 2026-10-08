# The protagonist

`makePerson(opts)` routes to `makeHero(opts)` unless `child` or `father` is set; those two are legacy and unused. `makeHero` builds a **faceless, deliberately low-poly figure**. Each body part is a `loftGeo` with 4–6 sides and a per-facet tone jitter, like folded paper or plaster. Height is about 1.75 units, with the feet at y = 0.

The owner asked for this direction ("低面數、更藝術感") after rejecting every attempt at a realistic or anime face. **Do not add a face** unless the owner supplies a model, such as a VRoid `.vrm`. See [ART-DIRECTION.md](ART-DIRECTION.md).

## Options

```js
makePerson({ body, jacket, mat })
// body   -> trouser colour (default 0x1a1a1a)
// jacket -> coat colour (default 0x3a3a3a)
// mat    -> override material for every part (used for the 'end' reflection and the dark copy in 'flip')
```

## Rig (`person.userData`)

| Joint | Type | Notes |
|---|---|---|
| `legs[0..1]` | hip pivots | `rotation.x` < 0 swings the leg forward; `rotation.z` spreads it |
| `knees[0..1]` | knee pivots | `rotation.x` > 0 bends the shin back |
| `arms[0..1]` | shoulder pivots | `rotation.x` < 0 swings the arm forward; `rotation.z` lifts it sideways (sign mirrors per side) |
| `elbows[0..1]` | elbow pivots | `rotation.x` < 0 bends the forearm forward/up. There is a single axis only, so forearms cannot cross the body. |
| `head` | head pivot | `rotation.x` > 0 looks down |

Index 0 is the character's right side; 1 is the left.

The torso is an inner group `up` at y = 0.88. It is not exposed, so **the spine cannot bend**. To make him curl or lean, rotate the whole group (`person.rotation.x`).

**The coat** is a fixed seat piece plus two skirt panels, one per leg. Each panel overrides `updateMatrix` to copy its leg's swing:
- It follows 80 % of the leg's rotation normally.
- It follows 92 % when the thigh is raised past −1 rad. This prevents the leg poking through when sitting.

## Built-in poses

- `walk(phase, amp=.45)`: legs, knees and arms swing with a slight bob. **Currently unused:** William asked (2026-10-08) that the hero never walks. He stands still and the scene moves past him (see `worldGroup` in ART-DIRECTION).
- `sit()`: thighs at −1.5, knees at 1.45, arms resting forward. Seat height offset: the hero's origin sits about 0.95 below the seat top, so place him at `seatY - .95`.
- `float(time)`: loose, drifting limbs, used in `drift`.

## Poses set by hand in scenes

| Scene | Pose |
|---|---|
| `shards` (curled up) | `legs -1.75, knees 2.25, arms (-.85, 0, ±.45), elbows -1.0, head .9`, plus whole body `rotation.x = .25` |
| `call` (phone to ear) | right arm `(-.35, 0, .15)` with elbow `-2.45`, head tilted `(.25, 0, -.12)`. The phone mesh follows `head.getWorldPosition()` each frame. |
| `room` (lying in bed) | `person.rotation.x = -π/2` on the mattress, `head.rotation.x = .55` so the head rests *on* the pillow, not in it |
| `desk` / `store` | `sit()` with arms −1.0…−1.1 forward onto the table |

Use `tools/pose.html` to iterate on a pose. It shows a side, front or three-quarter view of the hero alone (`?v=0|1|2`).

## Known limitations and ideas

- **No spine or neck chain.** Curling, slumping and looking far up are approximations. Adding an `up.rotation` spine pivot would help a lot. `up` already exists; expose it in `userData` and offset the shoulders.
- **The skirt panels are rigid.** In deep poses (curl, sit) they form a block. Options: hide the panels when the thigh angle is < −1.4, or give them a hinge at the knee.
- **No IK.** Hands can't reliably reach objects such as a phone, cup or flower pot. A simple two-bone IK for arms would let scenes place hands precisely.
- **Animation is procedural sinusoids.** For richer motion, consider baked clips via a small keyframe helper (still in code, no files).
