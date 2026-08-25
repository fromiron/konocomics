# Batch 004 Chunk 01 Independent Gemini Art Review

## 1. Execution Attestation

- **Exact Model & Effort**: `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`.
- **Execution Mode**: Read-only `plan` mode with normal, un-degraded, un-truncated completion; zero repository, workspace, or payload edits.
- **Isolation & Source Integrity**: All 8 frozen metadata inputs under [metadata/](file:///tmp/konocomics-batch004-gemini-art01/metadata) and all 24 preview images at the canonical root `/tmp/konocomics-batch004-gemini-art01` were verified and opened at original pixel resolution.
- **Prior Conclusions**: Local reviewer conclusions (including `local-art.csv`, `local-codex.md`, adjudication reports, and final-art outputs) were not inspected or utilized. No external covers, synopses, anime adaptations, user reviews, Genre/Theme texts, Gold data, or model memory were used for Art factor determinations.
- **Review Protocol**: `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.

---

## 2. Frozen Input Hashes & 24-Image Pixel Verification

### 2.1 Frozen Input Metadata Verification

| Path | Expected SHA-256 | Computed SHA-256 | Status |
| --- | --- | --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | Matched |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | Matched |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` | Matched |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` | Matched |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-01/preflight.csv` | `51862c41c9f15af4a2780aeed27db95c976b8e01c705efef9019425ec84f7a81` | `51862c41c9f15af4a2780aeed27db95c976b8e01c705efef9019425ec84f7a81` | Matched |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-01/ledger.md` | `c32d3903fc677000576a4c743aa1f0707d7727eea5ebb45a8275bd80459d4a0a` | `c32d3903fc677000576a4c743aa1f0707d7727eea5ebb45a8275bd80459d4a0a` | Matched |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-01/gemini-payload-ledger.md` | `f49c56a3f453173edb250c2b3dd7abdbc21890d4075300f2b0d76ab508679ee5` | `f49c56a3f453173edb250c2b3dd7abdbc21890d4075300f2b0d76ab508679ee5` | Matched |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-01/gemini-root-identity.json` | `c45b45989ed81f9568603731dd987b96326c3c0264b6377f569dacb48fbe0be4` | `c45b45989ed81f9568603731dd987b96326c3c0264b6377f569dacb48fbe0be4` | Matched |

- **Sorted-Ledger Payload Identity SHA-256**: `25d6a71faac9d570c91370a703505261504f6a48cb157bb84d3cde062044d18b` (Verified exact match).

---

### 2.2 24-Row Original Pixel Verification Table

| File | Expected SHA-256 | Computed SHA-256 | openedAtOriginalPixels | Unique Visible Cue |
| --- | --- | --- | :---: | --- |
| `01-reader-step-04.png` | `ab2600908d218d448c0f3e7b8151f085ee2074d0daf11ca4a30e7ccf082b51dc` | `ab2600908d218d448c0f3e7b8151f085ee2074d0daf11ca4a30e7ccf082b51dc` | yes | Storefront of beef bowl restaurant "吉田屋", set breakfast meal with fried egg and salmon, Suzuki holding chopsticks with smiling waitress in uniform |
| `01-reader-step-07.png` | `2c0a5186f274a5539a26c80826a3df4def3ef1f08b28a17a5802123b207196f7` | `2c0a5186f274a5539a26c80826a3df4def3ef1f08b28a17a5802123b207196f7` | yes | Blonde host character biting into sunny-side-up egg with runny yolk ("半熟"), Suzuki watching and commenting "…うまそうに食べるなぁ" |
| `01-reader-step-09.png` | `e84073c2b4b84c72785d2ad1600c3344101c4f8fb86fef0b5bef3f1aefadea31` | `e84073c2b4b84c72785d2ad1600c3344101c4f8fb86fef0b5bef3f1aefadea31` | yes | Office ceiling AC vent, Suzuki slumped at office desk clutching cat plush cushion surrounded by empty energy drink cans |
| `01-reader-step-11.png` | `815029c94d5f068120f5f4062fe924960713474b558d16df7bebf9c7170493b6` | `815029c94d5f068120f5f4062fe924960713474b558d16df7bebf9c7170493b6` | yes | Smartphone lock screen showing 00:50 over city night view, Suzuki standing on exterior stair landing smoking a cigarette |
| `01-reader-step-13.png` | `bda0f60e87ffd77fb725cfe1c11655b8844ac432cb0778db4ffa31716b8b4be2` | `bda0f60e87ffd77fb725cfe1c11655b8844ac432cb0778db4ffa31716b8b4be2` | yes | Overhead perspective of train tracks with sparrow on wire, Suzuki in train looking at rain alert monitor ("急な雨に注意"), rainy street |
| `01-reader-step-17.png` | `072fbd0c275a7910ed7ef4a8a7d553a27c9358b7186dbf23434fa0d58e2d3203` | `072fbd0c275a7910ed7ef4a8a7d553a27c9358b7186dbf23434fa0d58e2d3203` | yes | Blonde host smiling cheerfully holding smartphone saying "当たりだよ", glistening fried egg yolk, lower-face close-up of Suzuki |
| `02-reader-step-11.png` | `0914eeb5ea8a2cdbdaca4d52fad191ea0e893003a3a16292e2917729759bf135` | `0914eeb5ea8a2cdbdaca4d52fad191ea0e893003a3a16292e2917729759bf135` | yes | Side profile of Yoi wearing over-ear headphones on train with heart bubble "横顔美し〜〜♡", girls gossiping, page 9 |
| `02-reader-step-17.png` | `3e1b2aef615abe0bade4106a0adb05ed3ce63b159c09b0562643b91bd4277693` | `3e1b2aef615abe0bade4106a0adb05ed3ce63b159c09b0562643b91bd4277693` | yes | Yoi walking in school corridor with two female friends discussing shoujo manga hero tropes, schoolgirls whispering "王子 いつ来るかな〜" |
| `02-reader-step-19.png` | `c45ee3184b81f39d3680784ed839d54b695f197a03331ee68897cfbe83b5b0ca` | `c45ee3184b81f39d3680784ed839d54b695f197a03331ee68897cfbe83b5b0ca` | yes | Blonde male student vaulting over indoor staircase landing railing with sound effect "ガッ タッ", Yoi looking up startled |
| `02-reader-step-22.png` | `310cbed67a106e973ed12391e62254171ecbd770262607010b57ec2144407304` | `310cbed67a106e973ed12391e62254171ecbd770262607010b57ec2144407304` | yes | Vertical split panel: piercing-wearing blonde student (Ichimura) staring down and Yoi staring upward in surprise ("なに この人") |
| `02-reader-step-27.png` | `d306a4cb0a2a33d0451af613d3a60bff36538c9cdcd8ab64c12418d167a946ab` | `d306a4cb0a2a33d0451af613d3a60bff36538c9cdcd8ab64c12418d167a946ab` | yes | Classroom scene with Yoi sitting at desk talking with friends about the "other Prince" Ichimura-senpai, fantasy bubble with cheetah/tycoon, page 25 |
| `02-reader-step-30.png` | `5728fb3c66e94607abed523ffa277fbe0557ce64070e08bc3c74f98fca00a4fa` | `5728fb3c66e94607abed523ffa277fbe0557ce64070e08bc3c74f98fca00a4fa` | yes | Split confrontation panel: Ichimura looking down saying "よぉ", Yoi looking back in astonishment with speed lines and text "今朝の…！！ なっ" |
| `04-reader-step-07.png` | `c6bd0da753d2a25e9749ceb117e9d77341362cc5f16fd89f03f3497c8c907eff` | `c6bd0da753d2a25e9749ceb117e9d77341362cc5f16fd89f03f3497c8c907eff` | yes | Suited chubby bald customer entering Hello Kids 59th branch agency, greeted by bear mascot with bell collar seeking new lodging placement |
| `04-reader-step-08.png` | `b77652d14b34dc17e452a252d9a1a4207eaed13db16299896c63cf02e6db31cf` | `b77652d14b34dc17e452a252d9a1a4207eaed13db16299896c63cf02e6db31cf` | yes | Agency manager complimenting mascot tradition, bear mascot yelling in fury "誰がタヌキだ！ ワシはクマだ！！", page 008 |
| `04-reader-step-12.png` | `e9ab295d61e803a82381afe353b140ff981e77d3fbf74e188d18c9d05eec2ebe` | `e9ab295d61e803a82381afe353b140ff981e77d3fbf74e188d18c9d05eec2ebe` | yes | Agency waiting couch with Noramimi mascot, dumpling-headed mascot eating mizuame syrup with a wooden stick from ceramic pot, page 012 |
| `04-reader-step-17.png` | `914cd62a97ba2aa76cd228d2b83952d7ac085ff87982661081655efdb1b84591` | `914cd62a97ba2aa76cd228d2b83952d7ac085ff87982661081655efdb1b84591` | yes | Agency counselor reviewing laptop file discovering the applicant bear began lodging 16 years ago when child was 7 ("現在23歳ですよ！？") |
| `04-reader-step-22.png` | `5dbb613dbf8923ec07b7d578f9d0552d3bd2754556cd100b1f9ca4e2e3fb86ec` | `5dbb613dbf8923ec07b7d578f9d0552d3bd2754556cd100b1f9ca4e2e3fb86ec` | yes | Young adult glasses-wearing man expressing awkward hesitation about having a mascot, female family member placing tea on table ("ガタ") |
| `04-reader-step-27.png` | `cf85a391f2e06b9adf7aaa6bca6774c17540d7902849f1bcdfe756e1562551ea` | `cf85a391f2e06b9adf7aaa6bca6774c17540d7902849f1bcdfe756e1562551ea` | yes | Sunset beach flashback of boy chasing girl and collapsing, boy kneeling at agency counter submitting application ("申し込み、お願いします……") |
| `05-reader-step-05.png` | `68ee266ca3c178eb377df0425594adfead81e1c71b8493ce35554fc712210b6f` | `68ee266ca3c178eb377df0425594adfead81e1c71b8493ce35554fc712210b6f` | yes | Nitta riding in chauffeur-driven luxury car, arriving at luxury high-rise apartment elevator, unlocking front door ("第一話") |
| `05-reader-step-07.png` | `af17b8a0282cdb0c73e0ff861f92cd67fd2e6ee7e9ddc0e99f80a339dbebfe8f` | `af17b8a0282cdb0c73e0ff861f92cd67fd2e6ee7e9ddc0e99f80a339dbebfe8f` | yes | Broken ceramic vase fragments floating mid-air via telekinesis ("ブゥン"), Nitta yelling about non-burnable trash sorting ("陶器類は不燃ゴミなんだ！") |
| `05-reader-step-08.png` | `6fc15120fb36e034199fb6d933426fe34e6092224ed9bc2b4d80eba328e30939` | `6fc15120fb36e034199fb6d933426fe34e6092224ed9bc2b4d80eba328e30939` | yes | Nitta enjoying wine in living room admiring vase collection, on phone celebrating winning 2 million yen ceramic auction, page 006 |
| `05-reader-step-09.png` | `da1e722e7eefec9cd387af436fc6cec48549241782334b2c82ae68c0109ef6a4` | `da1e722e7eefec9cd387af436fc6cec48549241782334b2c82ae68c0109ef6a4` | yes | Spatial tear opening above sofa while Nitta laughs, capsule striking Nitta squarely on head ("ガッ", "ハンッ", "いった〜〜！！"), page 007 |
| `05-reader-step-10.png` | `e21515e2200b3db38468e6e9f2160974b42b2b3374ca7614753ad1ada8a9f236` | `e21515e2200b3db38468e6e9f2160974b42b2b3374ca7614753ad1ada8a9f236` | yes | Metallic egg capsule with human face opening eyes, Nitta rubbing his wine-stained face in confusion ("何これ……", "おっかしいな……"), page 008 |
| `05-reader-step-11.png` | `05e6a3264f57bce06b3db97085b39eed420e919d34692ad61fdd89e321da22ea` | `05e6a3264f57bce06b3db97085b39eed420e919d34692ad61fdd89e321da22ea` | yes | Nitta heading to bedroom to sleep ("よし！！ 寝よう……"), morning city skyline panel, Nitta finding capsule still on the living room floor, page 009 |

---

## 3. Positions 1–10 Art Factor Results Table

The exact 10 works and 40 terminal factor cells in `artRealism / artDensity / visualSoftness / motionImpact` order:

| Position | workId | Canonical Title | Preflight State | `artRealism` | `artDensity` | `visualSoftness` | `motionImpact` | Terminal Status |
| ---: | --- | --- | --- | :---: | :---: | :---: | :---: | :---: |
| 1 | `work-025c8ab93483a39c9330` | ホストと社畜 | sample-ready | 2 | 2 | 2 | U | 2 / 2 / 2 / U |
| 2 | `work-098b1781e14365eea667` | うるわしの宵の月 | sample-ready | 2 | 2 | 4 | U | 2 / 2 / 4 / U |
| 3 | `work-0f3a44f5dcab9623d1be` | 応天の門 | unknown-ready | U | U | U | U | U / U / U / U |
| 4 | `work-11d23966f22f777e95d0` | のらみみ | sample-ready | 0 | 2 | 2 | U | 0 / 2 / 2 / U |
| 5 | `work-132ce7172750a3b1fa53` | ヒナまつり | sample-ready | 2 | 2 | 2 | U | 2 / 2 / 2 / U |
| 6 | `work-15dba4fdb46308ab45d7` | 駅から5分 | unknown-ready | U | U | U | U | U / U / U / U |
| 7 | `work-188ba092c6195603bb3f` | つらつらわらじ | unknown-ready | U | U | U | U | U / U / U / U |
| 8 | `work-19c2017b33c07f48634e` | ふうらい姉妹 | unknown-ready | U | U | U | U | U / U / U / U |
| 9 | `work-1a6ad6771865b43c8516` | それでも町は廻っている | unknown-ready | U | U | U | U | U / U / U / U |
| 10 | `work-1cdc6c5cca7c33fafe51` | 青空にとおく酒浸り | unknown-ready | U | U | U | U | U / U / U / U |

---

## 4. Work-by-Work Factor Evidence & Gate Audit

### Position 1: `work-025c8ab93483a39c9330` — ホストと社畜 (`sample-ready`)

- **Scope & Edition**: Futabasha official product and linked vol. 1 reader (ISBN 9784575860016), 6 internal body pages across 4 distinct contexts (diner breakfast, office desk/corridor, outdoor stair landing, commuter train).
- **`artRealism` = 2**
  - *Exact Refs*: `reader-step-04`, `reader-step-09`, `reader-step-13`
  - *Pixel Observation*: Human figures display realistic head-to-body proportions, realistic hands holding utensils/phones, and authentic architectural environments (Yoshida-ya beef bowl storefront, commuter train tracks, office desks). Facial expressions and eyes follow standard contemporary manga stylization (일반적 스타일화) rather than severe caricature or photorealistic gekiga.
  - *Limitation*: Evaluation limited to entry-chapter preview pages; subsequent chapters not sampled.
  - *Confidence*: 0.90
- **`artDensity` = 2**
  - *Exact Refs*: `reader-step-04`, `reader-step-13`
  - *Pixel Observation*: Well-balanced visual information density (균형). Backgrounds include specific signage ("吉田屋", "Cafe Niyama"), detailed overhead train tracks, power cables, and weather monitors, balanced by clean negative space in dialogue panels.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.90
- **`visualSoftness` = 2**
  - *Exact Refs*: `reader-step-07`, `reader-step-17`
  - *Pixel Observation*: Clean, smooth line contours, gentle curvature in hair and facial outlines, and soft screentone shading for cheek blushes and fried egg textures. Sits comfortably at neutral balance (중립), neither gritty/angular nor elaborately ornamented.
  - *Limitation*: Preview lacks full spread illustrations.
  - *Confidence*: 0.90
- **`motionImpact` = U**
  - *Unmet Gate*: `motionGateAttemptable=false`. No continuous start-development-impact-resolved action sequence exists in the sampled slices.

---

### Position 2: `work-098b1781e14365eea667` — うるわしの宵の月 (`sample-ready`)

- **Scope & Edition**: Kodansha official vol. 1 preview reader (ISBN 9784065217771), 6 internal body pages across 3 distinct contexts (train commute, school corridor, staircase landing, classroom).
- **`artRealism` = 2**
  - *Exact Refs*: `reader-step-11`, `reader-step-22`
  - *Pixel Observation*: Slender, elegant shojo character proportions, anatomically grounded posture, realistic clothing draping, and authentic school environments. Eyes and facial features adhere to high-grade modern shojo stylization (일반적 스타일화).
  - *Limitation*: Limited to vol. 1 preview sample.
  - *Confidence*: 0.92
- **`artDensity` = 2**
  - *Exact Refs*: `reader-step-17`, `reader-step-27`
  - *Pixel Observation*: Refined linework with fine individual hair strands and subtle screentone gradations, combined with balanced, airy shojo panel compositions (균형) that maintain ample negative space for emotional resonance.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.90
- **`visualSoftness` = 4**
  - *Exact Refs*: `reader-step-11`, `reader-step-22`, `reader-step-30`
  - *Pixel Observation*: Exceptionally soft, delicate, and aesthetically beautiful linework (부드럽고 미려한 표현). Fine, curved strokes for hair locks and eyelashes, smooth tonal gradients, luminous eye highlights, and gentle shadow transitions across all character portraits.
  - *Limitation*: Preview is black-and-white print capture.
  - *Confidence*: 0.95
- **`motionImpact` = U**
  - *Unmet Gate*: `motionGateAttemptable=false`. The staircase jump in `reader-step-19` is an isolated kinetic pose rather than a multi-panel continuous action sequence.

---

### Position 3: `work-0f3a44f5dcab9623d1be` — 応天の門 (`unknown-ready`)

- **Unmet Gate**: `official-product-only` (0 eligible internal pages). The official Shinchosha product page matches ISBN 9784107717429 but provides no work-specific internal preview viewer (the publisher generic `/tryme/` catalog was excluded). Fails the 6-page static gate and 2-context gate.
- **Terminal Status**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.

---

### Position 4: `work-11d23966f22f777e95d0` — のらみみ (`sample-ready`)

- **Scope & Edition**: Shogakukan e-comi store official JDCN vol. 1 viewer (ISBN 9784091884114 identity), 6 internal body pages across 5 distinct contexts (storefront, office counter, waiting room, consultation desk, domestic tea table, beach flashback).
- **`artRealism` = 0**
  - *Exact Refs*: `reader-step-07`, `reader-step-08`, `reader-step-12`
  - *Pixel Observation*: Strong cartoon deformation and comedic simplification (강한 데포르메·단순화). Characters and mascots have exaggerated round silhouettes, simplified dot/slit facial features, stubby limbs, button bellies, and caricatured facial expressions across all panels.
  - *Limitation*: Limited to vol. 1 preview sample.
  - *Confidence*: 0.95
- **`artDensity` = 2**
  - *Exact Refs*: `reader-step-07`, `reader-step-17`
  - *Pixel Observation*: Clean line economy paired with structured screentone textures (mascot fur hatching, suit tones, office desks, background signage, and room perspective) providing a balanced visual density (균형).
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.90
- **`visualSoftness` = 2**
  - *Exact Refs*: `reader-step-08`, `reader-step-22`
  - *Pixel Observation*: Rounded cartoon line contours, smooth mascot curves, and clean screentone shading. Sits at a neutral balance (중립), neither harshly hatched/angular nor delicate/ornate shojo linework.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.90
- **`motionImpact` = U**
  - *Unmet Gate*: `motionGateAttemptable=false`. No continuous start-development-impact-resolved action sequence present.

---

### Position 5: `work-132ce7172750a3b1fa53` — ヒナまつり (`sample-ready`)

- **Scope & Edition**: KADOKAWA/BOOK WALKER official vol. 1 preview (ISBN 9784047273818), 6 internal body pages across 2 distinct contexts (luxury car/corridor arrival, high-rise apartment living room).
- **`artRealism` = 2**
  - *Exact Refs*: `reader-step-05`, `reader-step-08`, `reader-step-10`
  - *Pixel Observation*: Realistic adult male anatomy, facial bone structure (nose bridge, brow, jaw), clothing folds, and detailed interior/exterior perspective (luxury car, elevator, apartment furniture, city skyline), combined with stylized comedic facial features for Hina (일반적 스타일화).
  - *Limitation*: Limited to vol. 1 preview sample.
  - *Confidence*: 0.90
- **`artDensity` = 2**
  - *Exact Refs*: `reader-step-08`, `reader-step-11`
  - *Pixel Observation*: Balanced density (균형) featuring high architectural and object detail (hundreds of windows in Tokyo skyline, detailed ceramic vases, car dashboard) offset by clean panel compositions.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.90
- **`visualSoftness` = 2**
  - *Exact Refs*: `reader-step-05`, `reader-step-10`
  - *Pixel Observation*: Crisp, firm, structured linework with clean contour definition and neutral screentone contrast (중립). Avoids both rough/scratchy gekiga hatching and ornate softness.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.90
- **`motionImpact` = U**
  - *Unmet Gate*: `motionGateAttemptable=false`. Telekinetic levitation and dropping capsule are gag moments lacking a continuous multi-panel combat/action progression.

---

### Position 6: `work-15dba4fdb46308ab45d7` — 駅から5分 (`unknown-ready`)

- **Unmet Gate**: `accessible-context-gate-failed` (1 distinct context). Retained 6 body pages from Shueisha JDCN reader, but independent QA failed the 2-distinct-context requirement. Closed unknown-ready without blocker.
- **Terminal Status**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.

---

### Position 7: `work-188ba092c6195603bb3f` — つらつらわらじ (`unknown-ready`)

- **Unmet Gate**: `accessible-below-threshold` (5 eligible body pages). After removing chapter-title page `reader-step-07`, only 5 genuine body pages remain, failing the 6-page static gate. Closed unknown-ready without blocker.
- **Terminal Status**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.

---

### Position 8: `work-19c2017b33c07f48634e` — ふうらい姉妹 (`unknown-ready`)

- **Unmet Gate**: `accessible-below-threshold` (5 eligible body pages). After removing opening/title page `reader-step-05`, only 5 genuine story pages remain, failing the 6-page static gate. Closed unknown-ready without blocker.
- **Terminal Status**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.

---

### Position 9: `work-1a6ad6771865b43c8516` — それでも町は廻っている (`unknown-ready`)

- **Unmet Gate**: `official-product-only` (0 eligible internal pages). Official Shonen Gahosha product page matches ISBN 9784785926045 but exposes no work-specific internal preview route. Fails 6-page static gate and 2-context gate. Closed unknown-ready without blocker.
- **Terminal Status**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.

---

### Position 10: `work-1cdc6c5cca7c33fafe51` — 青空にとおく酒浸り (`unknown-ready`)

- **Unmet Gate**: `identity-only-no-official-route` (0 eligible internal pages). Tokuma Shoten publisher route unresolved; preserved Rakuten source is licensed retailer bibliographic identity only. Fails 6-page static gate and 2-context gate. Closed unknown-ready without blocker.
- **Terminal Status**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.

---

## 5. Endpoint (0 / 4) Cross-Context Audits & Invariant Confirmations

### 5.1 Endpoint Value Audits

1. **Position 2 (`work-098b1781e14365eea667`): `visualSoftness = 4`**
   - *Context 1 (Train Commute, `step-11`)*: Extremely fine, curved hair lines, soft cheek tones, gentle facial profiles.
   - *Context 2 (School Hallway, `step-17`, `step-19`, `step-22`)*: Delicate contouring, fine eyelashes, smooth screentone gradients across close-up portraits.
   - *Context 3 (Classroom & Split Dialogue, `step-27`, `step-30`)*: Refined, delicate penmanship with soft emotional screentone shading; zero harsh cross-hatching or aggressive angularity.
   - *Audit Verdict*: **Passed** — all 6 contexts consistently support endpoint 4 (`부드럽고 미려한 표현`).

2. **Position 4 (`work-11d23966f22f777e95d0`): `artRealism = 0`**
   - *Context 1 (Storefront Entrance, `step-07`)*: Cartoonish proportions, simplified button bellies, round heads.
   - *Context 2 (Store Interior & Manager Encounter, `step-08`)*: Exaggerated caricature expressions, simplified comic silhouettes.
   - *Context 3 (Waiting Room & Mascot Snack, `step-12`)*: Dumpling-head character, simplified mascot anatomy.
   - *Context 4 (Consultation Desk, `step-17`)*: Comic facial expressions, simplified chibi-like human anatomy.
   - *Context 5 (Domestic Room & Meeting, `step-22`)*: Caricatured human faces, simplified round mascots.
   - *Context 6 (Beach Flashback & Agency Application, `step-27`)*: Deformed comical proportions in both memory and current scenes.
   - *Audit Verdict*: **Passed** — all 6 contexts consistently support endpoint 0 (`강한 데포르메·단순화`).

### 5.2 Motion & Unknown Invariants Confirmation

- **All Motion Cells `U`**: Confirmed. Preflight establishes `motionGateAttemptable=false` for all 10 positions, and no sample captures a continuous start-development-impact-resolved action sequence.
- **Positions 3, 6, 7, 8, 9, 10 `U/U/U/U`**: Confirmed. All unmet static gates result in `unknown` across all four Art axes without blocker.

---

## 6. Review Isolation & Cleanliness Confirmation

- **No Repository/Payload Modifications**: Confirmed that zero temporary images or repository files were copied, moved, deleted, created, edited, or committed during this review.
- **No Promotion/Adjudication Claims**: Adjudication, promotion recommendations, and comparisons against Local reviewer values were strictly avoided in accordance with the execution contract.
