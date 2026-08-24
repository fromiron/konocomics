# Batch 003 chunk 01 bounded-recovery independent Gemini Art review report

## 1. Execution attestation

- **Model identity & label:** Exact `gemini-3.7-flash-high` (`Gemini 3.7 Flash High`), effort `high`.
- **Completion status:** Normal completion without errors, timeouts, rate limits, degraded mode, or fallback behavior.
- **Input & pixel access:** Complete access to all six frozen input documents and full pixel-level inspection of all 12 sampled image files at original native resolution.
- **Human review flag:** `reviewedByHuman=false`.
- **Reviewer independence:** Conducted completely independently. Local Codex recovery outputs, Cursor Grok outputs, and Muse outputs were not inspected. Neither Grok (`ART_ABSTAIN`) nor Muse (`NOT_USED`) was referenced or used as a substitute.

## 2. Frozen input verification & pixel-access proof

### Frozen input SHA-256 hashes

| Path                                                                                             | SHA-256                                                            |
| :----------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `docs/factors/factor-dictionary.md`                                                              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                               | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md`     | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv`                           | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-01/recovery-preflight.csv` | `4bbc75c574c04cd0ae6477873b4ef39477d7b9e85ea7a0d8ff8eb278af790472` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-01/recovery-ledger.md`     | `d098d6dcb4d9a53a9e4d33e359c56b745c03b7220e53de0d9fbec565d451a1b9` |

### 12-file pixel-access proof

| file                                        | expectedSha256                                                     | computedSha256                                                     | openedAtOriginalPixels | uniqueVisibleCue                                                                                                               |
| :------------------------------------------ | :----------------------------------------------------------------- | :----------------------------------------------------------------- | :--------------------: | :----------------------------------------------------------------------------------------------------------------------------- |
| `toybox/toybox-step-04.png`                 | `eb34b21c695f990b94ba207e7ccc0b945d10d99ee3d90c6f1ad244715241f39f` | `eb34b21c695f990b94ba207e7ccc0b945d10d99ee3d90c6f1ad244715241f39f` |          yes           | Momo kicking legs on floor next to handheld game console; upper monitor reads "夢は叶うものではなく叶えるもの"                 |
| `toybox/toybox-step-05.png`                 | `cda001cf504d883560b2516f17981ba676bf5c9736108734808ebad3e68859ec` | `cda001cf504d883560b2516f17981ba676bf5c9736108734808ebad3e68859ec` |          yes           | Bold "不採用通知" header beside calendar showing dates 24–28; Akihabara cityscape with SOLIDUS WORKS tower at bottom           |
| `toybox/toybox-step-06.png`                 | `5c5b49239661b91d7f5c81c4ba2ef4d6f0dbf26ee7c233ae265ab46b7aed4af1` | `5c5b49239661b91d7f5c81c4ba2ef4d6f0dbf26ee7c233ae265ab46b7aed4af1` |          yes           | Momo riding motorcycle with goggles pointing past Solidus tower ("ではなく") to small Studio G3 building entrance              |
| `dmc/dmc-step-04.png`                       | `7a2e1d42be7d738b938a8bf8706266749c846fe233fa5119812e24366ef7661b` | `7a2e1d42be7d738b938a8bf8706266749c846fe233fa5119812e24366ef7661b` |          yes           | Negishi falsely accused of grope on train platform; dropped notepad exposes violent handwritten death-metal lyrics             |
| `dmc/dmc-step-12.png`                       | `fbf6a740ffe97f1de9e174c1a5bf5b33aef407c1a70a67fa99b7310663a782c9` | `fbf6a740ffe97f1de9e174c1a5bf5b33aef407c1a70a67fa99b7310663a782c9` |          yes           | President in leather jacket smoking and shouting "ファック"; whiteboard displays sweet pop lyrics "ラズベリー キッス"          |
| `dmc/dmc-step-20.png`                       | `28bf800ff41c9bb19dae5b850e85abc2c96ffa8e7e4cb32e59f6177f82a8890b` | `28bf800ff41c9bb19dae5b850e85abc2c96ffa8e7e4cb32e59f6177f82a8890b` |          yes           | In-store display for DMC single "グロテスク c/w 魔王"; Aikawa expresses distaste for metal while Negishi sweats in plaid shirt |
| `watashino-recapture/watashino-step-09.png` | `bd27cd8fe7afa5fa7c44599be5b470b09550b861e530e9b14311d24070cfaefd` | `bd27cd8fe7afa5fa7c44599be5b470b09550b861e530e9b14311d24070cfaefd` |          yes           | Boy with soccer ball stating "俺 男です"; delicate tonal close-ups of Satoko and Mashu's eyes under night park lamps           |
| `watashino-recapture/watashino-step-10.png` | `b54115c494f284989fd4a7e6bd7a067e0f03ba36b6bcce3c0a7504ddf99fff33` | `b54115c494f284989fd4a7e6bd7a067e0f03ba36b6bcce3c0a7504ddf99fff33` |          yes           | Satoko waking with thermometer in mouth, cleaning dishes and vacuuming apartment in sweatpants, checking balcony at night      |
| `watashino-recapture/watashino-step-12.png` | `9efa70142f6ba133a49435e492a51ca5b5d64fd37f95e4a4d61b5b213125a0e8` | `9efa70142f6ba133a49435e492a51ca5b5d64fd37f95e4a4d61b5b213125a0e8` |          yes           | Park bench conversation; Mashu reveals his age ("12歳です…"), Satoko reacts in shock ("じゅうにっ…") waving hand               |
| `drifters/drifters-step-03.png`             | `55e78f45acd1050ee4e02cb259ed991a9aae51bdd8e57ea5d32db5643137b57f` | `55e78f45acd1050ee4e02cb259ed991a9aae51bdd8e57ea5d32db5643137b57f` |          yes           | Color/monochrome spread with Toyohisa ordering Lord Yoshihiro to retreat, drawing katana with ashigaru matchlock unit          |
| `drifters/drifters-step-04.png`             | `980d8d311ee25caa3c64900cad8dbfa37bb21e21e6f85eafb5a0f1616c323b8c` | `980d8d311ee25caa3c64900cad8dbfa37bb21e21e6f85eafb5a0f1616c323b8c` |          yes           | Full cavalry charge of Tokugawa Ii forces with dense spears; Toyohisa bracing to delay enemy while Yoshihiro retreats          |
| `drifters/drifters-step-05.png`             | `408e550410c27d5a94cacf6b465681e53371e3f2539fc0b5bcb10e6d3bcb09b7` | `408e550410c27d5a94cacf6b465681e53371e3f2539fc0b5bcb10e6d3bcb09b7` |          yes           | Matchlock volley command "放てぇ!!" with explosive gunfire smoke; Toyohisa charging into enemy ranks with sound effect "ドン"  |

**Result:** `12/12 HASH_MATCH`.

## 3. Factor evaluation matrix

| position | workId                      | artRealism | artDensity | visualSoftness | motionImpact |
| :------: | :-------------------------- | :--------: | :--------: | :------------: | :----------: |
|    2     | `work-048a39f42bd18cb0823e` |     2      |     2      |       2        |      U       |
|    3     | `work-04f35b4c99514d50231d` |     2      |     2      |       1        |      U       |
|    5     | `work-07faf4019b12de5e877d` |     3      |     2      |       4        |      U       |
|    7     | `work-171b262b7ad72871f795` |     2      |     4      |       0        |      U       |

## 4. Axis observations, evidence references, and limitations

### Position 2: `work-048a39f42bd18cb0823e` — 大東京トイボックス

- **`artRealism` = 2**
  - _Refs:_ `reader-step-04`, `reader-step-06`
  - _Observation:_ Characters follow standard commercial manga stylization with conventional facial proportions and expressive deformations, balanced with realistically proportioned urban architecture (Akihabara buildings, Studio G3 facade) and naturalistic interior layouts. Aligns with anchor 2 (일반적 스타일화).
  - _Limitation:_ Digital remastering from original manuscript data may subtly affect tone or line reproduction; evaluated across home, job hunt, and office arrival contexts.
  - _Confidence:_ 0.85
- **`artDensity` = 2**
  - _Refs:_ `reader-step-04`, `reader-step-05`
  - _Observation:_ Clean, balanced line count with readable negative space in character-focused dialogue panels, combined with moderate background architectural hatching and screentones in street and room establishing shots. Matches anchor 2 (균형).
  - _Limitation:_ Digital remastering ceiling recorded.
  - _Confidence:_ 0.85
- **`visualSoftness` = 2**
  - _Refs:_ `reader-step-04`, `reader-step-06`
  - _Observation:_ Clean digital linework with moderately defined contours and standard gradient screentones; balances crisp angular character design elements with smooth rendering. Matches neutral anchor 2 (중립).
  - _Limitation:_ Digital remastering ceiling recorded.
  - _Confidence:_ 0.85
- **`motionImpact` = U**
  - _Unmet gate:_ No continuous action sequence isolating a bounded start, development, impact, and resolved endpoint exists in the sampled spread.

---

### Position 3: `work-04f35b4c99514d50231d` — デトロイト・メタル・シティ

- **`artRealism` = 2**
  - _Refs:_ `reader-step-04`, `reader-step-12`
  - _Observation:_ Retains standard human anatomical proportions in everyday settings (train station, meeting room), combined with exaggerated comedic facial grimaces and stylized caricature elements appropriate for commercial seinen comedy. Aligns with anchor 2 (일반적 스타일화).
  - _Limitation:_ Monochrome opening body pages evaluated; added commentary and color pages excluded.
  - _Confidence:_ 0.85
- **`artDensity` = 2**
  - _Refs:_ `reader-step-12`, `reader-step-20`
  - _Observation:_ Balanced panel layouts with clear white space in conversation panels, complemented by moderate commercial hatching on hair/clothing and detailed environmental props (record store shelves, whiteboard notes, office furniture). Matches anchor 2 (균형).
  - _Limitation:_ Sample limited to opening monochrome body chapters across three contexts.
  - _Confidence:_ 0.85
- **`visualSoftness` = 1**
  - _Refs:_ `reader-step-04`, `reader-step-12`, `reader-step-20`
  - _Observation:_ Scratchy, nervous, angular ink lines with jagged comedic speed lines, sharp stress hatching around faces, and harsh visual contrast, placing the rendering between rough/angular (0) and neutral (2). Aligns with intermediate anchor 1 (거칠고 각진 표현과 중립 사이).
  - _Limitation:_ Opening volume 1 body pages sampled.
  - _Confidence:_ 0.85
- **`motionImpact` = U**
  - _Unmet gate:_ No eligible continuous dynamic action sequence with verified start, development, impact, and endpoint was sampled.

---

### Position 5: `work-07faf4019b12de5e877d` — 私の少年

- **`artRealism` = 3**
  - _Refs:_ `reader-step-09`, `reader-step-10`, `reader-step-12`
  - _Observation:_ Anatomically precise body proportions, nuanced bone structure, naturalistic posture during domestic chores (washing dishes, vacuuming), and delicate, lifelike facial/eye details that exceed standard manga stylization toward realistic portraiture. Aligns with anchor 3 (일반적 스타일화와 현실적 비례 사이).
  - _Limitation:_ Licensed Kodansha reissue edition volume 1 sampled; edition bridge confirms body art identity with frozen Futabasha release.
  - _Confidence:_ 0.85
- **`artDensity` = 2**
  - _Refs:_ `reader-step-09`, `reader-step-10`
  - _Observation:_ Finely layered screentones, detailed hair strands, and well-rendered domestic interiors (kitchen sink, bed linens, curtains) balanced by generous, atmospheric negative space for emotional pacing. Matches anchor 2 (균형).
  - _Limitation:_ Opening body pages sampled.
  - _Confidence:_ 0.85
- **`visualSoftness` = 4**
  - _Refs:_ `reader-step-09`, `reader-step-10`, `reader-step-12`
  - _Observation:_ Exceptionally fine, delicate, airy line work, gentle pencil-like tonal textures, soft screentone shading, and luminous highlights creating an elegant, delicate aesthetic across all panels. Matches anchor 4 (부드럽고 미려한 표현).
  - _Limitation:_ Evaluated across three distinct narrative contexts (park encounter, domestic apartment routine, park bench dialogue).
  - _Confidence:_ 0.85
- **`motionImpact` = U**
  - _Unmet gate:_ Domestic and conversational scenes only; no bounded dynamic motion sequence present.

---

### Position 7: `work-171b262b7ad72871f795` — ドリフターズ

- **`artRealism` = 2**
  - _Refs:_ `reader-step-03`, `reader-step-04`
  - _Observation:_ Heroic action manga stylization with distinct authorial facial exaggeration (elongated grins, intense pupil styling) set against historically grounded armor, weaponry, cavalry equipment, and realistic anatomical perspective. Aligns with anchor 2 (일반적 스타일화).
  - _Limitation:_ Licensed standard edition volume 1 opening pages evaluated.
  - _Confidence:_ 0.85
- **`artDensity` = 4**
  - _Refs:_ `reader-step-03`, `reader-step-04`, `reader-step-05`
  - _Observation:_ Intense visual density characterized by heavy black ink fills, dense cross-hatching, flying grit/blood specks, intricate armor plates, overlapping masses of charging spearmen, and heavy plumes of gunsmoke filling nearly every panel. Matches anchor 4 (선·배경·정보 밀도가 높음).
  - _Limitation:_ Evaluated across tactical command and cavalry/matchlock battle contexts.
  - _Confidence:_ 0.85
- **`visualSoftness` = 0**
  - _Refs:_ `reader-step-03`, `reader-step-04`, `reader-step-05`
  - _Observation:_ Extremely hard-edged, aggressive, angular linework with heavy solid black shading, jagged speed lines, intense facial contours, and gritty high-contrast ink application throughout. Matches anchor 0 (거칠고 각진 표현).
  - _Limitation:_ Opening battlefield sequence evaluated.
  - _Confidence:_ 0.85
- **`motionImpact` = U**
  - _Unmet gate:_ Sampled battle scenes continue past the preview spreads without a closed, bounded endpoint; motion gate cannot be confirmed.

## 5. Review of extreme values (0 and 4)

- **`work-07faf4019b12de5e877d` (`私の少年`) — `visualSoftness` = 4**
  - _Context 1 (step 09, park soccer encounter):_ Extremely delicate eye highlights, soft hair contours, and gentle gradient shading.
  - _Context 2 (step 10, apartment domestic routine):_ Soft linework on awakening face, gentle rendering of fabric/curtains, and airy atmosphere.
  - _Context 3 (step 12, park bench dialogue):_ Soft facial profiles, delicate hand gestures, and fine tonal transitions.
  - _Confirmation:_ All three sampled contexts consistently support the extreme soft/delicate anchor (4).
- **`work-171b262b7ad72871f795` (`ドリフターズ`) — `artDensity` = 4**
  - _Context 1 (step 03, command dialogue):_ Intricate armor detail, heavy black inking, dense background hatching, and atmospheric dirt spatter.
  - _Context 2 (steps 04 & 05, cavalry charge and musket volley):_ Extremely dense overlapping spears, detailed horse musculature, heavy black ink masses, and thick textured smoke clouds.
  - _Confirmation:_ All sampled contexts consistently support the extreme high-density anchor (4).
- **`work-171b262b7ad72871f795` (`ドリフターズ`) — `visualSoftness` = 0**
  - _Context 1 (step 03):_ Harsh angular facial contours, jagged speech balloons, aggressive crosshatching, and stark high-contrast shadows.
  - _Context 2 (steps 04 & 05):_ Sharp speed lines, aggressive impact sound effects, hard-edged silhouettes, and raw heavy ink rendering.
  - _Confirmation:_ All sampled contexts consistently support the extreme rough/angular anchor (0).

## 6. Motion gate & unknown state confirmation

- All four works have `motionImpact = U`.
- None of the four sampled works contains an exact, continuous, and resolved action sequence with verifiable start, development, impact, and endpoint within the available spreads.
- In accordance with the system specification and factor dictionary rules, `motionImpact = U` represents an unknown state due to evidence boundary constraints, not a score of zero, a low rating, or a catalog promotion blocker.

## 7. Storage and environment confirmation

- No temporary image file was copied, moved, deleted, renamed, or committed.
- No repository file was modified or edited during this read-only review process.
