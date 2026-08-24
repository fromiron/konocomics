# Batch 003 chunk 03 independent Gemini Art review request

## Execution contract

- Requested model: exact `gemini-3.7-flash-high`, effort `high`.
- Mode: read-only plan; do not edit repository or temporary files.
- `reviewedByHuman=false`.
- Work scope: frozen positions 21–30 only, in the exact order below.
- Content scope: official entry-edition samples recorded by chunk 03 preflight.
- Independently open every one of the 27 selected image files at full pixel detail. Do not use covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, Local Codex output, or model memory.
- Do not inspect any other file below `data/staging/catalog-expansion/batches/batch-003/art-review/` except this request document. In particular, do not inspect `chunk-03/local-art.csv`, `chunk-03/local-codex.md`, earlier chunk conclusions, adjudication, final Art, or another reviewer output.
- Muse is `NOT_USED`. Cursor Grok is `ART_ABSTAIN`. Neither is a substitute and neither supplies Art values.

## Frozen inputs

| Path                                                                                         | SHA-256                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                          | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                           | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv`                       | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-03/preflight.csv`      | `0d922527dcb8b1cbfc1196810c5e5963c01d1c3c6b4540999cd7185ce9f1b7aa` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-03/ledger.md`          | `2c69e652a9399d110e98e0c77efb14da686d2c29d303d02a52e44b8f2e6bfe38` |

The selected image directory is supplied as an additional read-only workspace
root at execution. Recompute every file SHA-256 and compare it with the exact
manifest below before judging. Do not rely only on metadata or hashes: actually
render and inspect every file at native or original pixel detail.

If any frozen-input hash differs, an image is missing, a file cannot be
rendered, the exact requested model is not running, the response is truncated,
or a timeout, rate limit, degraded, fallback, or abnormal outer condition
occurs, stop and return `INPUT_OR_CAPABILITY_FAILURE` with the exact reason. Do
not substitute another model.

## Exact 27-file pixel manifest

| Position | workId                      | Work                       | Ref                  | File                            | Expected SHA-256                                                   |
| -------: | --------------------------- | -------------------------- | -------------------- | ------------------------------- | ------------------------------------------------------------------ |
|       22 | `work-7abb6e8396c5e1252173` | 甘々と稲妻                 | `reader-step-04`     | `amama-step04.png`              | `ebfc5835ddbe0807f83c990b4cb6f9de9a5b5a5ef2731031afaeddc9169b685c` |
|       22 | `work-7abb6e8396c5e1252173` | 甘々と稲妻                 | `reader-step-08`     | `amama-step08.png`              | `783e321d28552ddb631418d3ca0f2fabd80fac691dda25dc169b162e82a3d3f3` |
|       22 | `work-7abb6e8396c5e1252173` | 甘々と稲妻                 | `reader-step-15`     | `amama-step15.png`              | `0ae426b6ef29451b4866d0fc2f8b799379925ad387b269f7694b21c7a3efdfbe` |
|       23 | `work-81c561ca6bb74a301cf8` | ライドンキング             | `reader-step-04`     | `rideon-step04.png`             | `27b8642ff89ffa955ee2920eb1cd8be9e4d93f7f1c683077dc80824029a9af0c` |
|       23 | `work-81c561ca6bb74a301cf8` | ライドンキング             | `reader-step-08`     | `rideon-step08.png`             | `3d76b5b015f486593c6a61f254fc5b42c774c2a8252228f860205bc6b893d960` |
|       23 | `work-81c561ca6bb74a301cf8` | ライドンキング             | `reader-step-15`     | `rideon-step15.png`             | `77adfa1e92b40f2ccefbb83c2fe99f352ba2e4a51a2736f6d3adf423f03c9e41` |
|       24 | `work-83510afea8d961aec880` | 俺はまだ本気出してないだけ | `printed-p004-p005`  | `honki-p004-p005.png`           | `b806c0b9f8ac06877cfd10a422d6c38f267cbe9536312854e8fb0982963f5f05` |
|       24 | `work-83510afea8d961aec880` | 俺はまだ本気出してないだけ | `printed-p018-p019`  | `honki-p018-p019.png`           | `cddc8a3f8cc5d0f74f52be238afee591ac8cf2bdebef84f36a52ba4638603c8e` |
|       24 | `work-83510afea8d961aec880` | 俺はまだ本気出してないだけ | `printed-p028-p029`  | `honki-p028-p029.png`           | `9e43895c5d4a9986dc670e5f0b9ab26178e35b0de024570dbaefb089eda31dee` |
|       25 | `work-84a6a139c55f2760544e` | 僕の心のヤバイやつ         | `episode-1-range-17` | `bokuyaba-episode1-range17.png` | `3e612344b1d6105c571ade767874da5bac8309b5e0f82f8e7bfef3907cd86496` |
|       25 | `work-84a6a139c55f2760544e` | 僕の心のヤバイやつ         | `episode-1-range-13` | `bokuyaba-episode1-range13.png` | `f18b9701bfc0e1479c6d00374f5a46ee383234b3d2fced8fd2d4e27f479c3be2` |
|       25 | `work-84a6a139c55f2760544e` | 僕の心のヤバイやつ         | `episode-1-range-11` | `bokuyaba-episode1-range11.png` | `b2c88ca482702a59c1ff674667eb257a5e37e41636937712d0929a5b034b77ae` |
|       26 | `work-88e75622b83b794c03ac` | 山賊ダイアリー             | `printed-p006-p007`  | `sanzoku-p006-p007.png`         | `e6014e2a88ce2381c6af962479a7bcdb600f081ba75096e282b70041ed6ffeea` |
|       26 | `work-88e75622b83b794c03ac` | 山賊ダイアリー             | `printed-p014-p015`  | `sanzoku-p014-p015.png`         | `06502bcc01517a16e028719d2f2faab78a2f6a1346b0947bbc744be820df98af` |
|       26 | `work-88e75622b83b794c03ac` | 山賊ダイアリー             | `printed-p016-p017`  | `sanzoku-p016-p017.png`         | `10be96e33fd033f3b2cc13dd728738962770bd3e1e0030d2a77c2a7096751bbf` |
|       27 | `work-9036a98c069b5ef8cd54` | よふかしのうた             | `printed-p009-p010`  | `yofukashi-p009-p010.png`       | `95e352cada50d7ce34e4f87cd45003b18e391b7de77db0cb07d3f8c8f9c2be3e` |
|       27 | `work-9036a98c069b5ef8cd54` | よふかしのうた             | `printed-p017-p018`  | `yofukashi-p017-p018.png`       | `3995fb782363612ec20fdb07c09d12a15d54609a1d956e37a1373b430f1105da` |
|       27 | `work-9036a98c069b5ef8cd54` | よふかしのうた             | `printed-p025-p026`  | `yofukashi-p025-p026.png`       | `13df73d8822be5d36dcd950b09057de231243e324025655c0564772fdf1b0fd7` |
|       29 | `work-a25bac53b4757f13f21a` | 鬼灯の冷徹                 | `reader-step-04`     | `hozuki-step04.png`             | `77abc356d539d4b5b84289c813b8eabf71b3e51960b963e16b778d1b9f775090` |
|       29 | `work-a25bac53b4757f13f21a` | 鬼灯の冷徹                 | `reader-step-08`     | `hozuki-step08.png`             | `2ae289cd016b10309ad482a5e66fa4574b0a5feb293ca8c8e993d2969ce38795` |
|       29 | `work-a25bac53b4757f13f21a` | 鬼灯の冷徹                 | `reader-step-15`     | `hozuki-step15.png`             | `45ac58e3d42810816164549ae52e5ee1d301eeacd9e1100a0f090277f87da53a` |
|       30 | `work-a4ca6e21e97927928e1a` | 喰う寝るふたり住むふたり   | `page-004`           | `kuuneru-p004.png`              | `bf0925dc0cce399c49ece7ebda58dd1230f77ad44dffac04a1140bb69d8cbb1d` |
|       30 | `work-a4ca6e21e97927928e1a` | 喰う寝るふたり住むふたり   | `page-005`           | `kuuneru-p005.png`              | `81f81e8f815e2c5e55fa63b7520084894e1a5c6c414853d3b3c28268f891fa6b` |
|       30 | `work-a4ca6e21e97927928e1a` | 喰う寝るふたり住むふたり   | `page-011`           | `kuuneru-p011.png`              | `7fe0684d1b1e4f299b346ac8c491bd8781714c91dbf39e83b203d6d880286e09` |
|       30 | `work-a4ca6e21e97927928e1a` | 喰う寝るふたり住むふたり   | `page-012`           | `kuuneru-p012.png`              | `2c5cde8ef99abf69338faa245ce092cf2a04be0f1c9744c1eca23af79bb32e89` |
|       30 | `work-a4ca6e21e97927928e1a` | 喰う寝るふたり住むふたり   | `page-016`           | `kuuneru-p016.png`              | `1186d12b468119a8f0e41b0c45054705b23c9911e9dabc4a933f041250d819d9` |
|       30 | `work-a4ca6e21e97927928e1a` | 喰う寝るふたり住むふたり   | `page-017`           | `kuuneru-p017.png`              | `4b9d87b6abb34976bb50115fde46b31d0b096635cf35a11f56b432ef4dc0642d` |

## Art gate

- `sample-ready`: 甘々と稲妻, ライドンキング, 俺はまだ本気出してないだけ, 僕の心のヤバイやつ, 山賊ダイアリー, よふかしのうた, 鬼灯の冷徹, 喰う寝るふたり住むふたり. Only these eight works met six readable internal pages and at least two distinct contexts. Only their three static Art axes may become known.
- `unknown-ready`: 青空エール, いつかティファニーで朝食を. These works have no qualifying pages and must return `U/U/U/U`.
- `motionImpact` must be `U` for every one of the ten works. Chunk 03 preflight has `motionGateAttemptable=false` throughout and supplies no exact bounded continuous start, development, impact, and resolved endpoint sequence. Isolated poses, gestures, effect lines, or action fragments cannot become a motion value.
- `U` means unknown, never zero, low, or a promotion blocker. Do not average values. Judge each static axis independently from the 0, 2, and 4 dictionary anchors; use 1 or 3 only when the pixels directly place the sample between adjacent anchors.

## Pixel-access proof

Before the factor matrix, include a complete 27-row verification table with
columns `file, expectedSha256, computedSha256, openedAtOriginalPixels,
uniqueVisibleCue`. `openedAtOriginalPixels` must be `yes` for every row.
`uniqueVisibleCue` must give one concise, file-specific visual observation
proving that the rendered pixels were inspected; a repeated generic phrase is
insufficient. Report `27/27 HASH_MATCH` only if every computed hash matches.

## Required response

Return one complete Markdown document and nothing else.

1. Execution attestation: actual model ID and resolved label, effort, normal completion, full frozen-input and pixel access, no timeout, rate limit, degraded or fallback output, `reviewedByHuman=false`, and Local, Grok, and Muse conclusions not inspected.
2. Echo all six frozen input hashes and give the complete 27-row pixel-access proof table required above.
3. Give one exact-order table for all ten works with columns `position, workId, artRealism, artDensity, visualSoftness, motionImpact`; cells are `U` or integers `0`–`4`. This table must contain exactly ten work rows and all forty terminal cells.
4. For every known static cell, give at least two exact selected image refs, a concise pixel observation tied to the Factor Dictionary anchors, a limitation, and confidence. For every unknown cell, state the unmet gate. Do not assign any known `motionImpact` value.
5. List every static value 0 or 4 and explicitly confirm whether all selected contexts support the extreme. If not fully supported, lower it or return `U`.
6. Confirm explicitly that 青空エール and いつかティファニーで朝食を are `U/U/U/U`, that all ten `motionImpact` cells are `U`, and that Art unknown is not a blocker.
7. Confirm that no temporary image was copied, moved, deleted, or committed and no repository file was edited.

Do not recommend promotion, compare with Local values, or write a final
adjudication.
