# interiors — model polish summary (scenes 3 office, 4 desk, 11 flip, 18 room)

Branch `model/interiors`, worktree `wt/interiors`. Only the four scene blocks in `src/app.js` changed; no helper, caption, camera, `key`/`bg`/`dark` or hero code was touched. Each scene defines its own small `bevelBox` (the REFERENCE-STYLE "bevelled box" recipe: an 8-sided chamfered loft, 64 triangles) so nothing outside the assigned regions moved.

Images in this folder: `before_<key>_<pos>.png`, `after_<key>_<pos>.png`, `after_<key>_closeup.png` (1000×625 shots from `tools/shots.js`; close-ups are PIL crops at 2×). Big scroll jumps lag in the headless page, so the shots were taken with warm-up positions (3.0, 10.7, 17.7) before each scene.

## 3 — office (corridor)

What changed
- Walls are now bays with a real door opening every 5 m: wall segment + lintel per side, the wall .2 thick. Doors are recessed .1 into the wall; a lighter frame plate (0x3a) behind the 0x2a door slab shows as a .05 border; a dark glass panel (`B(0x05)`) in the upper half; a lever handle on the lock side.
- Lamps: each is an open 8-sided loft band (16 triangles) hanging .06 below the ceiling with the white lens recessed inside it, instead of a white box glued to the ceiling. Beam cones and floor pools unchanged.
- Skirting along both walls, a floor seam at every bay line, and a small unlit sign box with a dim lit face on the right wall every other bay (no text).
- Everything repeated is an `InstancedMesh` (one per part: 13 of them), added before `worldGroup()` so it slides with the corridor. Flat parts (skirting, glass, lens, seams, sign face) are 2-triangle planes. Bays beyond z = −65 were dropped (they never leave the fog).
- Hero, suitcase, `stroll`, point light and camera untouched.

Why: the audit called the corridor "a tunnel with faint rectangles"; recessed glass doors with frames and handles, troughed lamps and a skirting line are what make a corridor read in the film's two-tone look.

## 4 — desk

What changed
- Desk top is a .07 chamfered loft whose surface stays at y = .765, so the keyboard, papers, cup/daisy, monitor and the hands/forearms did not move; a drawer pedestal (.42 × .69 × .72) on the far side with three drawer seams and handles; the near side panel is now .06 thick; a small chamfered mouse beside the keyboard.
- Monitor: a 0x24 frame .015 proud of the 0x11 panel leaves the screen inset behind a thin dark inner bezel. Panel, neck, foot and screen positions unchanged.
- Office chair: chamfered seat cushion (top still at y = .495), a tilted backrest (−.12 rad) on a short spine with a lumbar gap, a 6-sided gas column, a hub and a five-arm star base on castor spheres. The column stands at z = .78 (world), behind the coat's seat piece (which ends at z ≈ .73), so no chair part enters the coat; the base arms stay below y = .07, under the coat's lowest point (.22) and clear of the feet.
- Desk tones lifted one step (0x30 top, 0x26 pedestal/panel; chair 0x2a / 0x1c).

Concern: the hero's rigid coat skirt still forms a block under the seat in the sit pose (hero item, not mine); the chair is placed so that fixing the coat needs no chair change.

## 11 — flip

What changed
- `desk()` now builds a solid desk: .07 chamfered top, two .06 side panels and a modesty panel instead of four .05 sticks; the laptop is a hinged wedge (chamfered base, dark key area and trackpad, a 6-sided hinge, a .018 lid leaning back .32 rad with a screen inset); the chair has a chamfered seat, four .045 legs, two uprights and a back slat.
- `desk(top, panels, legs/laptop, key area, screen)` takes its materials, so the mirrored copy is built from the very same models in its own tones (0x3a/0x2c/0x20/0x15) and gets a lit 0x99 screen so the upside-down world reads too. Sphere, horizon, stars, camera roll and the `scale.y = −1` mechanism untouched.

## 18 — room

What changed
- Bed rebuilt after the reference hospital bed (f106–f110): 6-sided tube frame 0xc4 on castors, headboard (posts to .95, rounded top rail, lower rail, five instanced spindles) and a lower footboard (.8), side rails at y = .2, a chamfered base slab, a rounded .19 mattress (0xe0) with a .03 sheet (0xfa) on top, a rounded pillow whose top stays at y = .71, a blanket folded over the footboard rail (three planes), and a wide soft contact shadow (radial-gradient plane) on the floor. The bed was lengthened to 2.2 (footboard at z = 1.2) so his feet are inside the frame; the hero's position, lying pose and head/pillow contact are unchanged.
- Desk: .07 chamfered top on four .08 legs with a back apron (it floated on two legs before); laptop as a hinged wedge with the lid leaning back; lamp with a base disc, stem, joint, angled arm, 6-sided cone shade and a bulb (the point light moved 5 cm to sit in the shade).
- Window sits in a real reveal: the back wall is one 16-triangle mesh with the opening cut out (four front quads + four reveal faces), the city plane set .08 back, a deeper sill, a head and a mullion. City texture untouched. (A first version split the wall into four boxes, which left a faint seam line at the window edge; the single mesh removed it.)
- Skirting along both walls.

Concern: the hero's coat panels still make a box under his thighs when lying (hero item). The gap between his back and the sheet is about .01; the sheet could not be raised further without changing the tuned head/pillow contact.

## Triangle budget (counted in the browser with `tricount.js`, instances multiplied, hero included)

| scene | before | after | growth |
|---|---|---|---|
| 3 office | 1959 | 3621 | 1.85× |
| 4 desk | 4995 | 5623 | 1.13× |
| 11 flip | 6916 | 7572 | 1.09× |
| 18 room | 1393 | 2759 | 1.98× |

All within the "roughly 2×" rule. Cylinders are 6-sided, spheres ≤ 8×6, lofts 8-sided, no files, no `Math.random()`. `shots.js` printed no PAGE ERROR.

Commit: `0901709` on `model/interiors` (only `src/app.js`; `dist/` restored, `out/` untracked).

## Round 1 (fixes after the art/tech review)

Images: `after1_<key>_<pos>.png` (same eight positions, `tools/shots.js` with warm-ups 3.0 / 10.7 / 17.7) and `after1_<key>_closeup*.png` (debug-camera views from `dbgcam_round1.js`, plus 2× crops of the main shots as `*_closeup_main.png`). `after1_shots.log` / `after1_dbg.log`: no PAGE ERROR. Only the four scene blocks changed; keys/bg/dark/captions/camera/hero untouched; no `Math.random()`.

### 4 — desk
- **Blocker fixed:** `back.rotation.x` is now `+.12`, so the backrest top recedes (front face z≈.84 at the bottom, ≈.89 at the top, hero's back at ≈.76); `after1_desk_4.65.png` / `after1_desk_closeup.png` show a wedge of air between his spine and the backrest. The bottom stayed at (0,.6,.245) so the spine still meets it.
- Back height .5 → .42 (top ≈1.02, shoulder level), i.e. the mid-back of the scale table rather than a high-back.
- Drawer seams and handles moved from the +z face to the -z face (z=-.362/-.368), which the 2.5→.55 rad orbit actually sees: three drawer fronts read in `after1_desk_4.35.png` and `after1_desk_closeup_drawers.png`.

### 3 — office
- Doors alternate: even bays open on the left wall, odd bays on the right; the other side of each bay is one full-length 5 m wall box with full-length skirting. Each wall now reads door / blank / door and the triangle count dropped (3621 → 3051, 1.56×).
- Lever handle is two instanced boxes at 0x6e: a .07 stub out of the door face and a .18 bar along the corridor at x=±(XF-.085), so it stands into the lamp light (`after1_office_closeup.png`; a bright speck on the far doors in the main shots).
- Floor seams widened to .06 and lifted to 0x2a (visible as faint lines on the floor in `after1_office_closeup_floor.png` and at 3.35).

### 11 — flip
- Chair moved to x=-2.2, z=.5 (seat .07 under the desk edge, legs clear of the side panel at -2.44): the lid silhouette clears the back slat in both 11.35 and 11.65 (`after1_flip_closeup_main.png`, `after1_flip_closeup.png`).

### 18 — room
- Side guard (f106): a U of .018 tube at y=.74 on the +x (camera) side, z from -.35 to .55 in bed space (over the torso, off the pillow end), on two uprights at x=PX+.02 with joint spheres at both ends (the lower ones merge with the frame rail). Clear of the mattress (.45), the base slab (.46) and both arms (the outstretched arm is `arms[0]` on the -x side). `after1_room_closeup.png`.
- Pillow: a .075 middle slab (top .685) between two raised bevelled ends (top .71, x=±.22), so the head sits in a .28-wide trough; the head/pillow contact and `head.rotation.x=.55` are unchanged. `after1_room_closeup_head.png`.
- Blanket: a rolled top (bevelBox .48×.08×.13, c=.4, 0xc4) over the footboard rail, a short inner panel resting on the sheet (0xca) and a longer outer panel (0xba); .46 wide and offset to x=-.12 so the two +x spindles stay visible from the camera. `after1_room_closeup_foot.png`, `after1_room_closeup_main.png`.
- Side wall: a 2.1×.9 door slab (0xd4) inside an architrave proud of the wall by .045 (0xec), with a 0x8a lever; the skirting stops at the jambs. Rug 1.6×2.5 at 0xe0 under the bed, showing on the camera side (0xe8 did not read against the 0xf4 floor). `after1_room_closeup_door.png`, `after1_room_18.35.png`.
- Budget: to pay for the additions the tubes are open-ended (every end sits inside a post, a joint sphere or a castor), the base slab and sheet are boxes, the castors are hex wheels standing on one flat (`after1_room_closeup_castor.png`) and the bulb is 6×4. Room: 2759 → 2705 (1.94×).

### Triangle budget (tricount.js, instances multiplied, hero included)

| scene | before | round 0 | round 1 | growth |
|---|---|---|---|---|
| 3 office | 1959 | 3621 | 3051 | 1.56× |
| 4 desk | 4995 | 5623 | 5623 | 1.13× |
| 11 flip | 6916 | 7572 | 7572 | 1.09× |
| 18 room | 1393 | 2759 | 2705 | 1.94× |

Not done (not this group's): the hero's rigid coat skirt under the chair (4.65) and under the thighs when lying (18.65) — tracked against the hero group; the chair and bed need no change for it. `bevelBox` is still copied into the four scenes (helpers are frozen); hoist when helpers are unfrozen.

## Round 2 (fixes after the round-1 review)

Images: `after2_<key>_<pos>.png` (3.35 3.65 4.35 4.65 11.35 11.65 18.35 18.65, plus `after2_room_18.85.png`; `tools/shots.js` with warm-ups 3.0 / 10.7 / 17.7), close-ups from `dbgcam_round2.js` / `dbgcam_round2_room.js` (`after2_room_closeup.png` side view, `_foot`, `_low` (reviewer's low side camera), `_rail`, `_sill`, `_rugtop`, `after2_office_closeup.png` handle, `after2_desk_closeup_drawers.png`) and 2× crops of the main shots (`after2_room_closeup_main.png`, `_corner` (3× crop of 18.85, the mattress corner), `_rug` (18.35), `after2_desk_closeup_main.png`). `after2_shots*.log` / `after2_dbg*.log`: no PAGE ERROR. Patch: `patch_round2.py`; pixel checks: `crops_round2.py`. Only the three scene blocks 3, 4 and 18 changed (flip untouched); keys/bg/dark/captions/camera/hero untouched; no `Math.random()`.

### 18 — room
- **Blockers fixed (mattress floating over the slab, slab floating over the rails):** the base slab is now `box(.92,.19,2.16,M(0xcacaca),0,.315,.1)`, spanning y .22–.41: its bottom rests on the side-rail tops (tube r .02 at y .2) and its top meets the mattress bottom (bevelBox from .41). Mattress, sheet height, pillow, hero, guard and castors did not move; the slab ends still sit inside the corner posts (post r .028 at z −1 / 1.2, slab ends at −.98 / 1.18). `after2_room_closeup_low.png` (reviewer's low camera): slab on the rails, mattress on the slab, no air; `after2_room_closeup_foot.png`: no slit or light leak behind the footboard; `after2_room_closeup_corner.png` (18.85, 3×): no lit ledge under the mattress chamfer; `after2_room_18.65.png`: no dark line under the mattress.
- **Blanket dropped.** The reference bed (f106/f107/f110) carries no blanket, and the alternative (a fold lying on the lower half of the sheet under his shins) would put a .06 slab through his legs, which lie on the sheet at that z, or require raising the hero and so the tuned head/pillow contact. The footboard spindles are open again (`after2_room_closeup_foot.png`), −88 triangles.
- **Rug that reads.** Two planes under the bed's contact shadow: a 1.6×2.5 border at 0x747474 (y .003) and a 1.48×2.38 field at 0x8c8c8c (y .005), rear edge at the skirting. Why so dark: under hemi .95 + dir .5 + the helper's rim light an upward face gets ≈1.46× its albedo, and the film pass's glow lifts it further, so anything lighter than ≈0x90 clips to the floor's 255 — the reviewers' 0xc8/0xd0 and my first try at 0xa4 all measured 252–255. Measured at 18.35 (`crops_round2.py`, row 440): field 225–226, border 111–142, floor 254–255, i.e. an 11 % step. `after2_room_18.35.png`, `after2_room_18.65.png`, `after2_room_18.85.png`, `after2_room_closeup_rugtop.png`.
- Sill lifted 5 mm (y 1.175, top at 1.205) so its top face is no longer coplanar with the reveal's bottom face at 1.2 (`after2_room_closeup_sill.png`).
- Sheet .92 → .86 wide, inside the mattress's .9 outline and its .04 top chamfer; the white lip along the mattress edge is gone (`after2_room_closeup.png`, `after2_room_closeup_corner.png`).
- Spindles: ten plain meshes sharing one open `CylinderGeometry(.012,.012,1,6,1)` (scaled in y) instead of one `InstancedMesh`, because `buildAll` excludes instanced meshes from `castShadow`; the headboard's shadow on the back wall now shows the bars between the posts and rails (`after2_room_18.65.png`, `after2_room_18.85.png`). Same 120 triangles, ten draw calls instead of one — the only place in these four scenes where a repeat is deliberately not instanced; noted in the code.

### 3 — office
- Glass panel centre 1.5 → 1.55 (spans 1.1–2.0, under the 2.12 slab top and the 2.2 lintel) and the lever handle 1.05 → 1.0, so a .09 strip of door leaf separates the bar from the glass; the handle now reads as a handle on the leaf (`after2_office_closeup.png`, `after2_office_3.35.png`, `after2_office_3.65.png`).

### 4 — desk
- Drawer seams .006 → .012 and 0x3a → 0x484848 (5 mm proud of the −z face): the two lines between the three drawer fronts now read in `after2_desk_closeup_drawers.png` and faintly at 4.35 (`after2_desk_closeup_main.png`); kept rather than dropped since they do read now.

### Triangle budget (tricount.js, instances multiplied, hero included)

| scene | before | round 0 | round 1 | round 2 | growth |
|---|---|---|---|---|---|
| 3 office | 1959 | 3621 | 3051 | 3051 | 1.56× |
| 4 desk | 4995 | 5623 | 5623 | 5623 | 1.13× |
| 11 flip | 6916 | 7572 | 7572 | 7572 | 1.09× |
| 18 room | 1393 | 2759 | 2705 | 2619 | 1.88× |

Concerns: the lower joint spheres of the side guard (r .024 at y .2, x .48) now touch the slab's bottom corner by ~4 mm, hidden inside the rail/upright joint — the reviewer's own prescription accepted this. The rug is a mid-grey in a white room by necessity of the lighting; if the owner wants it lighter, only lowering the hemi/dir intensities (which changes the whole scene) would let a lighter tone read. The hero's coat skirt under the thighs when lying (18.65) and under the chair (4.65) remain hero items.
