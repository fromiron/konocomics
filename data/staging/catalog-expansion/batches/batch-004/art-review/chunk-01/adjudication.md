# Batch 004 Art adjudication — chunk 01

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent Art adjudication
- reviewedByHuman: `false`
- scope: frozen positions 1–10; Factor Dictionary Art axes only
- method: Local and exact Gemini cells resolved against frozen official body-page pixels and exact edition gates; no averaging or majority vote
- Local + Gemini quorum: `COMPLETE`
- Cursor Grok: `ART_ABSTAIN`
- Muse: `NOT_USED`
- promotion: not performed
- commit: not performed

## Frozen inputs and reviewer provenance

| Input | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `art-preflight/chunk-01/preflight.csv` | `51862c41c9f15af4a2780aeed27db95c976b8e01c705efef9019425ec84f7a81` |
| `art-preflight/chunk-01/ledger.md` | `c32d3903fc677000576a4c743aa1f0707d7727eea5ebb45a8275bd80459d4a0a` |
| `local-art.csv` | `4f641d914264ae18ceae5f7c825bc36498afeba7122a7ac99830319cca0ff585` |
| `local-codex.md` | `f2893b0498e451c6244cbac8eb080af9e2ececa1313e49f5c7b9227d65363b15` |
| `gemini-request.md` | `8bc1666f9cd86e8acc41ffd470fef352b3daf903821e8d9639ffc44eccaa9ee6` |
| `gemini-response.md` | `8c987dd0319a4e6a02a44653e298f5db85eba8721bcf516fefe17eb4caf3393f` |
| `gemini-execution-ledger.md` | `1eafa619b0c223fc29e818ff2aed82b547e8317bcec59cb8315af18e22449915` |
| `gemini-payload-ledger.md` | `f49c56a3f453173edb250c2b3dd7abdbc21890d4075300f2b0d76ab508679ee5` |
| `gemini-root-identity.json` | `c45b45989ed81f9568603731dd987b96326c3c0264b6377f569dacb48fbe0be4` |

The authorizing Gemini run used exact model `gemini-3.7-flash-high` at effort
`high` in read-only plan mode. It completed normally with outer `SUCCESS`, no
fallback, degradation, truncation, rate limit, or timeout. The canonical
uncompressed payload identity recomputed as
`25d6a71faac9d570c91370a703505261504f6a48cb157bb84d3cde062044d18b`.
Local conclusions were hidden from Gemini. Local and Gemini each returned all
10 works and 40 terminal cells with `reviewedByHuman=false`; no substitute Art
reviewer was counted.

## Original-pixel and hash validation

- The 40 exact temporary files mapped in `local-codex.md` were rehashed:
  `40/40` matched their declared SHA-256 and `40/40` were `1233×1291` PNGs.
  Extra intermediate or duplicate captures in the temporary directory were
  excluded from the mapped proof set.
- The 24 sample-ready originals in the isolated Gemini root were rehashed:
  `24/24` matched `gemini-payload-ledger.md`; all were `1233×1291` PNGs.
- The sorted `sha256  filename` ledger recomputed to the exact payload identity
  above. All six metadata copies also matched their frozen repository inputs.
- All 24 sample-ready originals were reopened at original detail for this
  adjudication. The other 16 retained pages are diagnostic-only gate failures;
  their exact mapped hashes and dimensions were validated but they were not
  converted into Art values.
- No cover, title or chapter-opening page, contents page, advertisement,
  animation, synopsis, Genre, text Factor, Gold data, or user opinion was used.

## Cell-by-cell conflict adjudication

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`.
`U` is terminal unknown and never numeric zero.

| Pos | Work | Local | Exact Gemini | Final | Dictionary- and pixel-anchored ruling |
| --: | --- | --- | --- | --- | --- |
| 1 | ホストと社畜 | `3/3/3/U` | `2/2/2/U` | `3/3/3/U` | Grounded anatomy and constructed restaurant office rail and city settings consistently exceed ordinary stylization without reaching realism 4. Recurrent signage furnishings infrastructure tones and layered environments support density 3 while dialogue close-ups prevent 4. Rounded clean contours and smooth tonal handling remain softer than neutral while firm male features prevent softness 4. |
| 2 | うるわしの宵の月 | `2/2/4/U` | `2/2/4/U` | `2/2/4/U` | The two reviewers agree. Shojo proportions remain generally stylized and the airy pages balance selective school detail. Delicate curved hair eyelash and facial lines plus light tones persist across every context and support softness 4. |
| 3 | 応天の門 | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Exact volume identity is resolved but no work-specific official internal trial exists. Zero eligible pages close every cell unknown without blocker. |
| 4 | のらみみ | `1/2/2/U` | `0/2/2/U` | `0/2/2/U` | Realism resolves to 0 because simplified anatomy round mascot construction and caricatured human faces dominate all six pages and every accepted context; grounded scene identity does not raise figure or background construction above the strong-deformation endpoint. Density and softness are unanimously neutral. |
| 5 | ヒナまつり | `4/3/1/U` | `2/2/2/U` | `4/3/1/U` | Realistic adult anatomy hands clothing vehicles rooms objects and perspective persist across both contexts; the anomalous capsule figure is a story object rather than the dominant drawing mode. Detailed interiors ceramics skyline debris and effects recur above balanced density but sparse capsule panels prevent 4. Angular faces hard blacks coarse hatching and impact marks recur enough for softness 1 while clean object rendering prevents 0. |
| 6 | 駅から5分 | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Six exact-edition body pages preserve only one independently accepted scene context. The two-context static gate fails. |
| 7 | つらつらわらじ | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Excluding the chapter-opening page leaves five genuine body pages. The six-page static gate fails. |
| 8 | ふうらい姉妹 | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Excluding the opening page leaves five genuine body pages. The six-page static gate fails. |
| 9 | それでも町は廻っている | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Exact volume identity is resolved but no work-specific internal preview exists. |
| 10 | 青空にとおく酒浸り | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Licensed retailer identity bridges the frozen ISBN but the finite registry has no Tokuma official preview route. |

Seven static cells conflicted: all three at position 1, `artRealism` at position
4, and all three at position 5. Each was resolved directly from the dictionary
anchors and the complete eligible context set. The other 33 terminal cells
agreed. Endpoint audits retain position 2 `visualSoftness=4`, position 4
`artRealism=0`, and position 5 `artRealism=4`; each endpoint survives every
eligible sampled context for that axis.

## Motion boundary

All ten accepted preflight rows have `motionGateAttemptable=false`. No retained
set fixes one continuous action with exact start, development, impact, and
resolved endpoint refs. All ten `motionImpact` cells therefore remain
`unknown` with blank value and confidence. Action presence was not converted
to a score and evidence shortage was not converted to `notApplicable`.

## Final output accounting

- works: `10`
- axes per work: `4`
- data rows: `40` plus one header
- known static cells: `12`
- unknown cells: `28`
- notApplicable cells: `0`
- reviewedByHuman: `false`
- Local + exact Gemini quorum: complete
- Cursor Grok Art: `ART_ABSTAIN`
- Muse: `NOT_USED`
- temporary images committed: `false`
- preflight, source, promotion, catalog, and generated artifacts changed by this adjudication: none
