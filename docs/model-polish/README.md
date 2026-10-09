# Model polish (v41)

The owner asked 「幫我把每個 model 優化，維持低面數，可參考原本影片」: optimise every model, keep it low-poly, reference the original film.

The work was split into seven groups, each on its own branch (`model/<group>`), each rebuilt against [REFERENCE-STYLE.md](../REFERENCE-STYLE.md) and the per-scene [audit](audit.md), then reviewed by an independent art director and a technical reviewer and fixed until no blocker remained. The groups and their notes (what changed, why, what was measured, what is still open):

| Group | Scenes / helpers | Notes | Before / after |
|---|---|---|---|
| city | 1 arrive, 5 skyline, 9 towers, 20 bloom; `facadeTex`, `building`, `street` | [city.md](city.md) | [city.jpg](../../assets/model-polish/city.jpg) |
| night-city | 6 grid, 7 subway, 13 eclipse | [night-city.md](night-city.md) | [night-city.jpg](../../assets/model-polish/night-city.jpg) |
| interiors | 3 office, 4 desk, 11 flip, 18 room | [interiors.md](interiors.md) | [interiors.jpg](../../assets/model-polish/interiors.jpg) |
| street-props | 8 store, 10 umbrellas, 19 call | [street-props.md](street-props.md) | [street-props.jpg](../../assets/model-polish/street-props.jpg) |
| water-ground | 2 crack, 16 flood, 17 rooftop, 21 field | [water-ground.md](water-ground.md) | [water-ground.jpg](../../assets/model-polish/water-ground.jpg) |
| void-objects | 12 drift, 14 petals, 15 shards, 22 minusone; `suitcase()` | [void-objects.md](void-objects.md) | [void-objects.jpg](../../assets/model-polish/void-objects.jpg) |
| hero | `makeHero()` | [hero.md](hero.md) | [hero.jpg](../../assets/model-polish/hero.jpg) |

The [brief](brief.md) every agent worked from lists the hard rules (low-poly limits, no faces, no new flowers, no text changes, ground contact, walk-in-place props inside `worldGroup`).

Image paths inside the notes refer to the job folders of the session that produced them (`jobs/<group>/...`); only the comparison sheets above were kept in the repo.

Two engineering facts learned on the way, which every future model change must respect:

- The film pass renders into a 16-bit depth target (three.js r128 default), so a panel less than ~3 cm proud of a face z-fights at 5–10 units and ~30 cm at 30 units. Trim is drawn after its parent (`renderOrder`) **and** stands clear by at least that much.
- `tools/shots.js` eases toward the scroll target; a jump of more than a few scenes lags, so shoot with a lead-in position (e.g. `15.9 16.35`).

Still open after the reviews (all minor): the crack in scene 2 reads as a dark line rather than a fracture; the subway petals (owner decision pending); the flood water tone was lifted from `#0c` to `#20` so the hull and wake read; the hidden AC unit on the rooftop; the lying hero in the room is still a straight slab (needs a spine); the desk thighs pass through the chair seat slab (raise the hero ~.07 in scene 4).
