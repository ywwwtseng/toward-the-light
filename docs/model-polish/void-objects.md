# void-objects — model polish summary (branch `model/void-objects`)

Only `src/app.js` changed: the `suitcase()` helper and scene blocks 12 drift, 14 petals, 15 shards, 22 minusone.
All geometry is generated, flat-shaded, ≤ 8 sides; no files, no `Math.random()`, no caption/key/bg/camera changes.
Triangle counts (scene total, before → after): arrive 1443 → 1595, office 1959 → 2111, drift 1173 → 1747,
petals 1147 → 2239 (1.95×), shards 2373 → 4533 (1.9×), minusone 5893 → 4693. No `PAGE ERROR` in any shots run.

## suitcase() (scenes 1 arrive, 3 office)
- Was a `.13 × .44 × .32` slab with a 3 cm handle, hanging below the hand (the fist did not reach it; read as a portfolio).
- Now a cabin case `.2 × .46 × .34`: chamfered 8-sided loft (bevel .014, corner cut .03), a rib line round the shell
  (second thin loft ring, lighter), a carry handle = bar `.02 × .02 × .15` on two posts, two 6-sided wheels under the
  back edge, two trolley-handle caps on top. ~190 triangles. Tones: shell `#454545`, rib/caps `#5a5a5a`, handle/wheels `#141414`
  (lighter than the coat, so it separates from him in both the white street and the dark corridor).
- The group pivots at the bar, which sits inside the closed fist (hand-local y −.058 on the palm side; `grip(1)` kept);
  the case hangs plumb (`rotation.z −.17` cancels the arm's outward push) and the arm is pushed out to `.2` rad so the
  shell clears the coat skirt (inner face ≈ .26 from the centre line vs skirt ≈ .205). Lowest point over the whole
  stroll cycle: y = 0.175 (measured in `out/suit.html`), so nothing touches the ground.
- Checked with `before/after_arrive_1.5`, `before/after_office_3.5`, `after_arrive_suitcase_zoom.png`, `_suit_test2.png`
  (back and side views at four gait phases).

## 12 drift
- Papers were 40 flat unlit `#dddddd` quads (read as confetti). Now single-layer sheets curled across their height
  (4 bands, 8 triangles; three curl profiles), lit `M(0x868686)` so the key/rim lights shade each band; 30 % at scale .75.
- Added five small objects drifting with them, each a 6/8-sided build: two pens (tube + tip cone + clip), a mug
  (6-sided loft, C handle, dark coffee disc), a phone (chamfered 8-sided slab with a lighter screen), a notebook
  (two cover lofts, a lighter page block, a spine). They share the papers' orbit/rotation code.
- `float()`, the pivot rotation and the orbit camera are untouched.

## 14 petals (calendar pages)
- Pages were rigid planes that rendered as white blobs once landed. Now each page is a closed slab (front, back and edge
  faces, 44 triangles): .34 × .42, paper thickness .005, curled toward its top (`curl·v^2.2`, three variants), with a torn top
  edge (each top vertex dropped .012–.042 by `rng`, so the dark binding band is cut into a jagged stub). Back and edges sample
  a blank corner of the same DAY texture, so the reverse is blank paper.
- Material now `color 0xbcbcbc`, `flatShading:true` (the DAY canvas drawing is unchanged) so landed pages read as paper,
  not as lights; the rest height became .008 (thickness sits on the ground, curl lifts the top).
- Fall timing, DAY textures and the dawn glow are untouched.

## 15 shards
- 320 flattened tetrahedra → three instanced meshes as in frames f080–f083: 160 plates `Box(1,.04,1)` scaled to plates
  and planks, 110 sticks `Box(.06,.06,1)`, 50 flat wedges (tetra scaled y .15). Per-instance greys: 80 % `#1a–#52`,
  12 % mid `#66–#a6`, 8 % white-lit `.9` (they bloom in the film pass like the reference slivers).
- Nothing starts closer than 1.2 (was .6) and pieces inside 1.8 are scaled ×.6, so the curled figure is visible from
  the first frame (`after_shards_15.35` vs `before_shards_15.35`). A weak point light (.5, range 10) follows the camera
  side so he is not only rim-lit. Explosion easing, pose and camera are unchanged.

## 22 minusone
- Each light was an 8×6 sphere; now a 6-sided faceted lantern loft (60 triangles, pointed bottom, wide shoulder, small
  cap) with `M(0x8c8c8c, emissive white .42)` so the top facets go white and the lower ones stay grey, plus the existing
  halo sprite. A slow `rotation.y` turn per lantern (`ph + time·.3`), no jitter. Ring gather, gap and camera rise untouched.

## Concerns / notes
- The lanterns' facets are only visible when a light passes near the camera (around t ≈ .3–.5); in the top-down end
  frame they are a few pixels and read as before (dots with halos).
- In drift, sheets that face the key light still bloom to white (fewer than before, and now with shaded bands);
  the owner can lower `pm` further if he wants them all grey.
- Shots at 22.35 and 14.35 lag when taken right after a big jump (the first before_minusone_22.35 showed scene 21);
  the after shots were taken with a warm-up position (22.2 / 13.9) first.
- `out/suit.html` and `out/props.html` (close-up test pages, gitignored) are left in the worktree for the reviewer.

## Round 1 (fixes after the art + technical review; images `after1_<key>_<pos>.png`, `after1_<key>_closeup.png`)

Only `src/app.js` changed again (same regions). Triangle counts after this round: arrive 1595, office 2111, drift 1747,
petals 1719 (1.5× of 1147, was 2239), shards 4533, minusone 4693. No `PAGE ERROR` in any run; no `Math.random` added.
Numeric checks (`verify_r1.js`, 400-step sweep of t with time = 40·t): petals lowest world-space corner y = +0.003 (never below
the floor), largest per-step height change of a page under y .6 = .06 (its normal fall speed, i.e. no pop); drift origins
≥ 1.113 from the pivot axis and ≥ .813 from each other, sheets receiveShadow = castShadow = false, pm opacity 1; shards 13 of 320
pieces white-lit (the other 13 of the original 8 % head downward and are demoted to the .3 dark tone), darkest band .150.

- **[blocker] 12 drift — shadow-acne lattice on sheets.** `pm=M(0x707070,{transparent:true})` (opacity stays 1) so `buildAll()`
  leaves the sheets out of the shadow pass, exactly the reviewer's verified fix, with a comment saying why. No lattice on any
  sheet in 12.2 / 12.35 / 12.65 (`after1_drift_12.35`, `after1_drift_12.65`, `after1_drift_closeup`).
- **12 drift — blown-out sheets:** pm lowered 0x86 → 0x70 so the key-lit band stays grey instead of clipping (the shaded bands
  the reviewer liked are still there, see the close-up).
- **12 drift — props unreadable:** the pens, mug, phone and notebook are scaled ×2 and still orbit within ±2 of him; the mug
  reads beside his shoulder at 12.35 and the mug/notebook at 12.65.
- **12 drift — sheets through him / fused crossings:** `drift()` now re-draws an origin (same `rng(12)`, deterministic) until it
  is > 1.1 from the pivot axis and > .8 from every earlier origin (60 tries max). Sheets still cross in projection, but no
  orbit passes through the figure and fewer sheets intersect each other. `float()`, pivot and camera untouched.
- **14 petals — floor cut + rotation snap:** over the last 15 % of each fall the spin eases to lying flat (Euler angles re-wound
  to the nearest turn and frozen when the blend starts, then lerped to (−π/2, 0, seed)); and the page is held up by its lowest
  rotated corner (`y = max(fall y, .003 − lowest corner)`), so no leaf ever pokes below y = 0 and it settles onto .008 without a
  jump. Fall timing (`k`), DAY textures and the dawn glow unchanged.
- **14 petals — triangle count:** edge faces dropped; a page is now front + back (24 triangles), scene 2239 → 1719.
- **14 petals (own finding):** pages could swing through him (`R` from .7, sway ±.6 along x). Now `R ≥ .95` and the sway is
  tangential, so the radius never shrinks; the composition is otherwise the same.
- **15 shards — white plate behind the caption:** the white-lit tone (same `k < .08` draw, so the `rng(31)` sequence and the
  reviewed piece layout are unchanged) is given only to pieces flying upward (`dir.y ≥ −.05`); the ones that end low in frame get a
  .3 dark tone instead (a .5 mid grey still rendered as a pale plate behind the caption when the key light hit it). No blooming piece sits behind the caption at 15.35 or 15.65 (`after1_shards_closeup`). I first tried
  widening the white draw to `k < .12` to keep the white count up, but that shifts the rng sequence (a different piece then filled
  the frame white at 15.35), so it was reverted.
- **15 shards — black-hole pieces:** dark band floor raised .10 → .15 (`.15 + r()·.2`), one step above the #1c backdrop.
- **22 minusone — dimmer ring, gem-like drop:** `emissiveIntensity .42 → .75` (each lantern blooms white again after the film pass;
  the lower facets stay grey) and the profile is inverted into a 天燈: narrow open bottom (.034), wide shoulder near the top
  (.074), small cap. Ring at 22.65 is as bright/crisp as the old white dots (`after1_minusone_closeup`, right half vs
  `_rv_mo_before.png`); the lantern that passes the camera at 22.35 reads as a lantern (left half).
- **22 minusone — unusable before at 22.35:** re-shot from a pristine `git archive 5118a02` export of main with a 22.2 warm-up;
  `before_minusone_22.35.png` now shows scene 22.
- **suitcase() — handle invisible in the office:** bar and posts in the trim grey (0x5a5a5a), wheels 0x2a2a2a. The handle shows
  between the fist and the shell in the corridor and still reads dark on the white street (`after1_office_closeup`,
  `after1_arrive_closeup`); geometry, pivot, `grip(1)` and arm angle unchanged, so the clearance checks of the first round hold.
- **process — unreviewed pending edit:** the worktree had no uncommitted `src/app.js` change when this round started (only the
  rebuilt `dist/` files); nothing to drop. `dist/index.html`/`artifact.html` are left uncommitted as before.
- **tools/pose.html `?v=`:** not in my regions; untouched.

Concerns: the drift sheets no longer cast shadows on him (they were tiny anyway); 12.35/12.65 show a sheet in front of his chest
in projection (it is .7+ in front of him in depth). At 15.35 a mid-band (.4–.65) plate lit by the key still sits pale at the lower right behind the end of the caption
(it was there in the reviewed frame too and is not one of the white-lit pieces; the white one at (480,600) is gone); the caption
stays legible. Shots at 15.35 need a settled warm-up chain (14.9, 15.1, 15.25) or the frame lags.

## Round 2 (fixes after the second review; images `after2_<key>_<pos>.png`, `after2_<key>_closeup.png`)

Only `src/app.js` changed (suitcase helper, scenes 12, 14, 15; scene 22 untouched this round). Triangle counts unchanged: arrive 1595,
office 2111, drift 1747, petals 1719, shards 4533, minusone 4693. No `PAGE ERROR`, no `Math.random`. Numeric checks (`verify_r2.js`,
`out/verify_r2.log`): petals — pages receiveShadow in 0 of 201 sampled frames, castShadow on 0 landed pages (9 falling pages still cast at
t .3), lowest page corner y = +.003, 27 overlapping landed pairs and 0 of them share a plane (rest heights .008/.015/.022/.029/.036), min
radius 1.34; drift — over 240 camera frames (48 t values × 5 times) no sheet or prop overlaps his silhouette in front of him and none sits
on the caption box, pm 0x60 opaque, 0 sheets/props in the shadow pass; shards — 13 white, 16 mid, darkest tone .05 on a #26 emissive
floor, nearest approach of any piece to the camera 1.14 (a stick); suitcase (probe, scene 1 stroll sweep) — lowest point y = .175, inner
face .223 from his centre line (skirt .205), `grip(1)` still applied.

- **[blocker] 14 petals — acne lattice on airborne pages.** Pages are taken out of the shadow pass explicitly in `update()`
  (`m.receiveShadow=false`, every frame, since `buildAll()` turns it on) and stop casting once landed (`m.castShadow=k<1`), so neither the
  grazing-angle receive acne nor page-on-page self-shadow can appear; ground shadows of falling pages are kept. Pages '15' (14.65), '13'
  (14.5), '20' (14.65) and the landed clusters are clean in `after2_petals_closeup` (5× crops).
- **[blocker] 14 petals — lattice on overlapping landed pages / interpenetration.** Each page gets its own rest height at build:
  .008, or 7 mm above the highest earlier-landing page whose centre is within .4 in xz (chains stack: max .036). With receiveShadow off the
  lattice is gone independently; the stagger removes the shared plane (verify: 0 pairs on one plane).
- **14 petals — pages reading as attached to him / page over his face.** `R = 1.15 + r()·1.2` as suggested, and additionally every
  page's (a, R) is re-drawn from the same `rng(55)` while its deterministic fall path (position depends on t only) would project onto his
  silhouette in front of him from the scene camera, or would sit on the caption strip (lower middle of the frame) while the caption shows
  (t .12–.75), falling or landed. The first re-draw layout put page 12 straight over his face at 14.5, which is why the silhouette test was
  added; the caption test was added after page 15 landed against the word "counts" at 14.65. Max 14 draws for a page; no page needed the
  60-try fallback.
- **14 petals — 'DAY' comb teeth.** Tear depth .05–.066 (was .012–.042): the torn edge now sits in the blank margin of the band below the
  lettering (v .843–.881, baseline at .8875), so the stub is a plain dark strip (`after2_petals_closeup`, page 13 and 15 crops). Canvas untouched.
- **12 drift — sheets over his torso / on the caption.** `drift()` now also projects each candidate origin through the scene camera over
  the whole orbit (t .04–.96, sway ±.4 in x and y sampled as a 3×3 grid) and rejects it if, in front of him, it would overlap his silhouette
  (half-width .45 + lean allowance) or, during t .1–.77, the caption box (NDC y −.82…−.68, |x| < .47, grown by the sheet's apparent size).
  Same `rng(12)` draws; the worst case needed 15 tries. 12.35/12.5/12.65: nothing on his chest, caption strip empty (`after2_drift_*`).
- **12 drift — mug/page block blooming, pens as dark sticks.** Mug 0xbd→0x9a, notebook pages 0xcf→0xb0, pen barrel 0x2a→0x50 with the
  light tip/clip kept. The mug is now an open cup (walls without caps, bottom disc inside, dark coffee disc 12 mm below the rim) so from above
  it reads as a rim + dark interior instead of a white cap.
- **12 drift — sheets clipping to white.** pm 0x70→0x60; the brightest band tops out light grey (~#d0) in the three frames.
- **12 drift — explicit shadow opt-out.** The `transparent:true` trick is gone: on the first `update()` call every sheet and prop gets
  `receiveShadow = castShadow = false` (comment says why), so the scene no longer depends on `buildAll()`'s transparent filter and the 40
  sheets stay in the opaque pass.
- **12 drift — hatched props (own finding).** With the sheets clean, the notebook and the mug showed a fine lattice in the review frames.
  It was not shadow related (reproduced with the shadow map off): the film pass renders into a 16-bit depth target (three.js r128 render-target
  default), and at the 6–8 unit orbit two parallel faces closer than ~.012 world units z-fight. The props were rebuilt with that spacing:
  notebook = two .008 covers + an open ring of pages (no spine, no page-block faces parallel to the covers), phone = chamfered .01 slab + a
  .01 screen block on top, mug = open cup as above, pens = open-ended barrel with the tip cone starting inside it and the clip .006 off the
  barrel. Verified clean at 12.35 in the shot and in a direct-jump probe (`after2_drift_closeup`, `out/r2/p3b_props.png`).
- **15 shards — pale mid plate behind the caption.** Mid-band tone (k .08–.2) is now only given to pieces flying upward; downward ones take the
  dark band (same `rng(31)` draw count, so the reviewed layout stays). 20 of 40 mid pieces were demoted.
- **15 shards — black holes / near-camera plates.** Shard material gets `emissive 0x262626` (a flat floor: an unlit face renders ~#2e after
  the film pass vs #22 backdrop) and the bands are lowered to compensate (dark .05–.2, mid .22–.4, demoted white .15, white .9), so lit faces
  stay as dark as before; frame mean brightness at 15.35 is 47 vs 49 in round 1 (a first try with 0x33 lifted everything to a grey wall and was
  reverted). Pieces whose flight would pass within 1.2 (plates/wedges) or .7 (sticks) of the orbiting camera are mirrored to the far side
  (azimuth + π, no rng draws): 6 pieces, including the top-left wedge at 15.35 and the crossing plates at lower right at 15.65
  (`after2_shards_closeup`).
- **suitcase() — dead wheels and caps.** Wheels (r .028) moved to the outer bottom edge at x = +.09, proud of the chamfer, caps to the outer top
  edge (x = +.066): both now read as bumps on the case's silhouette from the back three-quarter cameras (`after2_arrive_closeup`, 1.3/1.5 and
  3.3/3.5). Pivot, bar, posts, arm angle and `grip(1)` unchanged; the inner face is where it was (.223 from the centre line), lowest point .175.
- **22 minusone:** no issues this round; re-shot only (`after2_minusone_*`).

Concerns: the petals layout is new (re-draws), so the composition differs from the reviewed round-1 frames (pages further out, the big
foreground pages at lower left/right); nothing crosses him or the caption now, which was the ask. The shards are a touch flatter in contrast
than round 1 because of the emissive floor. Shots at x.35 still need a two-step warm-up (x.2, x.3) and WAIT ≥ 12 s on this machine or the
caption is not yet up. The 16-bit depth of the film-pass target is a renderer property outside my regions; I only designed around it.
