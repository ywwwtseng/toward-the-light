# Changelog

Every number is a published version of the claude.ai Artifact (same URL each time). Dates are 2026-10-08, except v41 and the scene and model docs (2026-10-09). The owner's words are quoted where they set a rule. Versions before the repo existed are summarised.

## Before the repo (v1–v28)

- **v1–v10:** a 2D replica of the "Through the Dark" reference film, then a three.js rebuild, then a re-story as one adult alone in a big city (13 scenes).
- **v11:** a film post pass (grain, glow, vignette, tone curve), soft shadows, rim light, handheld camera and serif captions, after 「希望有藝術感一點」.
- **v12–v15:** realistic, "handsome" and Korean-style faces, then a black silhouette. All were rejected (「太醜了」).
- **v16:** the current faceted, faceless low-poly hero (「低面數，更藝術感」).
- **v18–v19:** the PEACEMINUSONE-inspired daisy motif, 23 scenes, and a daisy remodelled from the owner's reference image.
- **v22:** 25 scenes, adding `store` and `call`.
- **v24–v27:** the flower motif pulled back: the giant-daisy scene removed (now 24 scenes), and no flower wording in any text. The hero curls up in `shards` with no trembling. The sunrise rooftop gets ground under the city. The final walk is through pure darkness toward one light.
- **Rename:** "Through the Dark" became "Toward the Light 向光而行".
- **Video:** a 1:52 walkthrough rendered with `tools/record.js`.

## Repo era

| Version | Change |
|---|---|
| repo | `src/` split, `build.sh`, tools and docs created (「幫我建立一個 repo, 並寫 docs」) |
| v29 | the hero stopped walking and the world moved instead (「角色不要走路，場景動」); added `worldGroup()` |
| v30 | walking returned as an artistic walk in place, `stroll()`, synced to the moving ground, with snow footprints (「這幾幕加入走路，要藝術」) |
| v31 | `flood`: two oars aimed from the hands every frame (「手根桿子分離了」) |
| v32 | five-finger hands with `grip()` (「要五隻手指」); thin ring in `minusone` removed (「不需要小圈圈」) |
| v33 | hands joined cleanly: palm inside the cuff, finger bases hidden, thumb tucked (「沒有銜接很好」) |
| v34 | `desk`: forearms rest above the desktop (「手埋進桌子了」) |
| v35 | `desk`: keyboard added (「加上鍵盤」); visible monitor stand removed (「螢幕不該有支架」) |
| v36 | `desk`: monitor at eye height on a stand hidden behind the panel (「螢幕要有高度」「需要支架」) |
| v37 | all copy rewritten to be poetic and hopeful (「文字 藝術一點 不要負面」) |
| v38 | the "03 — 24" scene counter removed |
| v39 | all text in English (「文字最後都用英文」); gait fixed with ankles, a smaller stride, gentler coat panels and less torso twist (「走路 身體跟腳怪怪的」) |
| docs | full docs refresh, new storyboard, this changelog (「docs 也幫我更新」) |
| v41 | **model polish** (「幫我把每個 model 優化，維持低面數，可參考原本影片」): every prop and set piece rebuilt as a deliberate low-poly sculpture after the reference film, in seven groups that were each reviewed by an art and a technical reviewer and fixed until no blocker remained. Highlights: buildings with hero-scale window floors, parapets, podiums with doors, setbacks and roof furniture; a railing the hero actually holds; a subway platform and train that read as a station; a bedroom bed after the film's hospital bed; a real office chair and desk; a shop front with mullions and a door; a bus shelter with volume; a plank-and-rib rowing boat with oarlocks on the gunwale; paving slabs, a kerb and a parapet roof; a cabin suitcase the fist closes on; calendar pages, shards and lanterns with real thickness; the hero's sloped shoulders, collar, draped coat skirt, trousers with cuffs and six-sided shoes. See `docs/model-polish/` for each group's notes. |
| docs | **scene and model docs** (「幫我把場景差異跟使用模型，也寫到文件，更新文件讓以後的 llm 更好優化開發」): one page per scene in `docs/scenes/` with a v41 screenshot, model table, lights, animation, v40 → v41 changes and editing notes; a scene-difference matrix in SCENES.md; a model catalogue in MODELS.md; `tools/inventory.js` with measured v40 and v41 data in `docs/data/`; CHARACTER.md corrected (hero height about 1.92, flood, call and store poses as coded). No change to the site itself. |
| v42 | **piano soundtrack** (「音樂現在很像背景噪音，我想要鋼琴音樂」): the low drone replaced by a generated solo piano, arpeggios and a sparse melody with room reverb, lower and sparser in dark scenes, fuller in light ones. Still no audio files. |
