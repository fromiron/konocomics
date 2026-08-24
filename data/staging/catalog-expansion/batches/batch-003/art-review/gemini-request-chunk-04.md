# Batch 003 chunk 04 independent Gemini Art review request

## Execution contract

- Requested model: exact `gemini-3.7-flash-high`, effort `high`.
- Mode: read-only; do not edit repository or temporary files.
- `reviewedByHuman=false`.
- Work scope: frozen positions 31–40 only, in exact order.
- Independently open every one of the 33 selected image files at original pixel detail. Do not use covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, Local Codex output, or model memory.
- Do not inspect any other file below `data/staging/catalog-expansion/batches/batch-003/art-review/` except this request. In particular, do not inspect `chunk-04/local-art.csv`, `chunk-04/local-codex.md`, earlier chunk conclusions, adjudication, final Art, or another reviewer output.
- Muse is `NOT_USED`. Cursor Grok is `ART_ABSTAIN`. Neither supplies an Art value.

## Frozen inputs

| Path                                                                                         | SHA-256                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                          | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                           | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv`                       | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-04/preflight.csv`      | `4bce1df481f80adf6d51719f989c48780db7adddda0b927bfee0eece4aabe17d` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-04/ledger.md`          | `bfc108991d9363f8780c927cd3976d63ea210193cff784c2229c746a4ec266cd` |

The selected image directory is supplied as one canonical uncompressed read-only payload root. Recompute every file SHA-256 against the manifest below and render every file; hashes alone are not pixel access. If any frozen input or image hash differs, a file cannot be rendered, the exact model is unavailable, or execution is truncated, rate-limited, timed out, degraded, substituted, or abnormal, return `INPUT_OR_CAPABILITY_FAILURE` with the exact reason.

## Exact 33-file pixel manifest

| Position | workId                      | Work               | Ref                    | File                        | Expected SHA-256                                                   |
| -------: | --------------------------- | ------------------ | ---------------------- | --------------------------- | ------------------------------------------------------------------ |
|       31 | `work-a7413b6e35e0d316a538` | となりの怪物くん   | `reader-step-04`       | `tonari-step04.png`         | `08dbf05ad61aba2069261b93fb64d32fdbe6d88d3822e0bd2db8bff40bd5b087` |
|       31 | `work-a7413b6e35e0d316a538` | となりの怪物くん   | `reader-step-08`       | `tonari-step08.png`         | `e65ff7f8d09276d366e1248fa9b08adbd2890364ea2d17053244f7f5bc18c1e9` |
|       31 | `work-a7413b6e35e0d316a538` | となりの怪物くん   | `reader-step-15`       | `tonari-step15.png`         | `2355cd0d8b9c8b5d4188d2c34640e26cdefcab4d6e73b5d94242c273165935c2` |
|       32 | `work-a7e0062c7153978fc6fe` | 失恋ショコラティエ | `reader-step-04`       | `shitsuren-step04.png`      | `7835452ef35e7d664e2d65b0ef59fc3fd387e66efb5c35c75806e104e4b93500` |
|       32 | `work-a7e0062c7153978fc6fe` | 失恋ショコラティエ | `reader-step-08`       | `shitsuren-step08.png`      | `5865eaba41276bda10a0e12628897ab7ddc39464ef744107f2ae11d484f7bfca` |
|       32 | `work-a7e0062c7153978fc6fe` | 失恋ショコラティエ | `reader-step-15`       | `shitsuren-step15.png`      | `82e0766b55f6b3ef717656177a7c088a542128f4af95a9a3f8048025db673b8b` |
|       33 | `work-a960372ed5efa4031896` | シルバーマウンテン | `reader-display-04`    | `silver-display04.png`      | `0684081b5c50bbebaa957ada97b908accf003cce3bbe47fc76f74e5120921e36` |
|       33 | `work-a960372ed5efa4031896` | シルバーマウンテン | `reader-display-06`    | `silver-display06.png`      | `cb7c4d0b70c49291b441072c10b34b12b9a6664a1163c47a793ec1369e791190` |
|       33 | `work-a960372ed5efa4031896` | シルバーマウンテン | `reader-display-09`    | `silver-display09.png`      | `5d0ecc4fc0a8eeb06563695d0a534a207bcd196c673d3f5484aa7ab4df98bede` |
|       34 | `work-aa6d796e2e04a55b94b1` | 惑星のさみだれ     | `episode-slot-08`      | `samidare-slot08.jpg`       | `0495bc94723b9645e77b432c39e1d755b9962131f78717197c30c371778a220e` |
|       34 | `work-aa6d796e2e04a55b94b1` | 惑星のさみだれ     | `episode-slot-09`      | `samidare-slot09.jpg`       | `76766547156ce8815adea1b5d317fbd5f4396d226937d3c007a028a7d59e1e63` |
|       34 | `work-aa6d796e2e04a55b94b1` | 惑星のさみだれ     | `episode-slot-10`      | `samidare-slot10.jpg`       | `b80956f5e3612eae1f6a692a3baa97177f201684b34e56889617107a2b34c6fd` |
|       34 | `work-aa6d796e2e04a55b94b1` | 惑星のさみだれ     | `episode-slot-14`      | `samidare-slot14.jpg`       | `523f5960647e54f211db83a779be2fa2f97fd031ac59253e676eca03c355cbae` |
|       34 | `work-aa6d796e2e04a55b94b1` | 惑星のさみだれ     | `episode-slot-15`      | `samidare-slot15.jpg`       | `22938423582bdb747e8003aeab1d1c6f097f5eda20a70c28a263d9ade4580cc2` |
|       34 | `work-aa6d796e2e04a55b94b1` | 惑星のさみだれ     | `episode-slot-16`      | `samidare-slot16.jpg`       | `8317c0be1a45dbe8b4456d5afe83adb9514bba6091005bc72cd1b3c6cc29b164` |
|       35 | `work-ae0ac8a5acfc5fbb7dd6` | 終末のワルキューレ | `reader-step-02-left`  | `ragnarok-step02-left.png`  | `c22d97ffd823763a6eabbc515f48d85bd517af2aad0270322a9f8000ea1d8dc1` |
|       35 | `work-ae0ac8a5acfc5fbb7dd6` | 終末のワルキューレ | `reader-step-02-right` | `ragnarok-step02-right.png` | `1907a95a3694a40d8620173b5363942ee6013dfd8e11262c92512057aacafe5c` |
|       35 | `work-ae0ac8a5acfc5fbb7dd6` | 終末のワルキューレ | `reader-step-03-left`  | `ragnarok-step03-left.png`  | `060f83e5790406b2ed3eee7f282e44585f5daa372ddff285033ad302116d9f3e` |
|       35 | `work-ae0ac8a5acfc5fbb7dd6` | 終末のワルキューレ | `reader-step-03-right` | `ragnarok-step03-right.png` | `bb049234d0abc0725ec938d22cdec5559bfeea99bb63d5aa88f3cd39eb11b6a5` |
|       35 | `work-ae0ac8a5acfc5fbb7dd6` | 終末のワルキューレ | `reader-step-04-left`  | `ragnarok-step04-left.png`  | `61765cc989e49e12f5588eb135f80227f594c4b4401f878699067b63e20a337e` |
|       35 | `work-ae0ac8a5acfc5fbb7dd6` | 終末のワルキューレ | `reader-step-04-right` | `ragnarok-step04-right.png` | `020a7ccde0f5704c2f180751cde62933821244480f132003868d35e1b4d2a9c1` |
|       36 | `work-b2be97620643b3342637` | アオイホノオ       | `reader-step-04`       | `aoi-step04.png`            | `f1af297d160e3c4111956699f2e01c73748eaa02a32db5212ade5e1d5188abff` |
|       36 | `work-b2be97620643b3342637` | アオイホノオ       | `reader-step-08`       | `aoi-step08.png`            | `499f1385911d0b0c263b30ccbed364013c9731f8f9c50430e7949ad4cb418122` |
|       36 | `work-b2be97620643b3342637` | アオイホノオ       | `reader-step-15`       | `aoi-step15.png`            | `ddc1d02ca416c5c0fdad322694abdacf32ae67684ebc28b12688aaaa5cff4a54` |
|       38 | `work-bd42208a660912d9d95d` | 路地恋花           | `reader-step-08`       | `rojikoi-step08.png`        | `ac2ed714f7d2d225a286330a105985b953a08170dd43aa823d8cb1f200f55284` |
|       38 | `work-bd42208a660912d9d95d` | 路地恋花           | `reader-step-15`       | `rojikoi-step15.png`        | `af9e40aa42c615a4ce3fc46187707912ddc654dae6d7cd0d0e549e1651c3d12f` |
|       38 | `work-bd42208a660912d9d95d` | 路地恋花           | `reader-step-20`       | `rojikoi-step20.png`        | `cd4d94071e81ffc3974c15ed55970c0fed852cacba9b169c6cf56574cb081753` |
|       39 | `work-c5e8c957903bf1832dc5` | 日々ロック         | `reader-step-04`       | `hibirock-step04.png`       | `5be2869ed13b750255b75ad9d97e6156728d5f4d920b8222bc0e45a1bbffc5bb` |
|       39 | `work-c5e8c957903bf1832dc5` | 日々ロック         | `reader-step-08`       | `hibirock-step08.png`       | `d544a0913020697a2f51ac838f8acd73e71380d4634aca819a104c06ddc835ff` |
|       39 | `work-c5e8c957903bf1832dc5` | 日々ロック         | `reader-step-15`       | `hibirock-step15.png`       | `03aa4e8df2a78fd14ec5fb95a05e936155cea868142f42a76e487e898a5e95b8` |
|       40 | `work-c805c5b70111f75d6fb5` | 海獣の子供         | `reader-step-04`       | `kaiju-step04.png`          | `87f746d6f679103cfa0400b37716d6c26f7e4f3a9ddb87a8e85ac9ea1a870cc4` |
|       40 | `work-c805c5b70111f75d6fb5` | 海獣の子供         | `reader-step-08`       | `kaiju-step08.png`          | `beafedd8fca6ee082231bae17850bb698faf1ccf2e51ccc5123292870ab7cf9c` |
|       40 | `work-c805c5b70111f75d6fb5` | 海獣の子供         | `reader-step-15`       | `kaiju-step15.png`          | `0c29c294793e96a402eddd8a7c7581dc6b848ac8fb08e38c197c3acbd3335bbb` |

## Art gate

- `sample-ready`: positions 31–36 and 38–40. Only these nine works met six readable internal pages and at least two contexts. Their static axes may become known.
- `unknown-ready`: position 37 ねこだらけ. It has no qualifying page and must return `U/U/U/U`.
- `motionImpact` may be known only for position 40 海獣の子供 and only from `reader-step-15`, printed pages 016–017. Judge whether that bounded run-contact-or-trip-fall-resolved-reaction sequence supports a value. All other nine motion cells must be `U`.
- `U` is unknown, never zero, low, or a blocker. Do not average. Use 0, 2, and 4 anchors first; use 1 or 3 only when pixels place the sample between adjacent anchors.

## Pixel-access proof

Before the factor matrix, include a complete 33-row table with `file, expectedSha256, computedSha256, openedAtOriginalPixels, uniqueVisibleCue`. Every `openedAtOriginalPixels` must be `yes`, each cue must be file-specific, and `33/33 HASH_MATCH` is allowed only if every hash matches.

## Required response

Return one complete Markdown document and nothing else.

1. Attest actual model ID and resolved label, effort, normal completion, full frozen-input and pixel access, no timeout/rate-limit/degradation/fallback, `reviewedByHuman=false`, and that Local/Grok/Muse conclusions were not inspected.
2. Echo all six frozen input hashes and give the complete 33-row pixel proof.
3. Give one exact-order 10-row matrix with `position, workId, artRealism, artDensity, visualSoftness, motionImpact`; every cell is `U` or integer 0–4.
4. For every known cell, give at least two exact refs except the single allowed motion sequence, an anchor-linked observation, limitation, and confidence. For unknown cells, state the unmet gate.
5. Audit every static 0 or 4 and confirm all selected contexts support it; otherwise lower it or return `U`.
6. Confirm ねこだらけ is `U/U/U/U`, positions 31–39 motion are `U`, and Art unknown is not a blocker.
7. Confirm the full-color vertical `終末のワルキューレ 総天然色` remake was not inspected or used.
8. Confirm no temporary image was copied, moved, deleted, or committed and no repository file was edited.

Do not recommend promotion, compare with Local values, or adjudicate.
