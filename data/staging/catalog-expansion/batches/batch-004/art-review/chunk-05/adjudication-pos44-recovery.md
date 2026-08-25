# Batch 004 Art recovery adjudication — chunk 05 position 44

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent original-pixel adjudication
- reviewedByHuman: `false`
- scope: frozen Batch 004 position 44 `高嶺と花` only
- workId: `work-e2f095e08fc5e08d5a2b`
- vector order: `artRealism / artDensity / visualSoftness / motionImpact`
- Local: `2 / 2 / 3 / U`
- exact Gemini: `2 / 2 / 2 / U`
- final: `2 / 2 / 3 / U`
- Grok: `ART_ABSTAIN`
- Muse: `NOT_USED`
- promotion: not performed

## Frozen input verification

| Input                                                  | SHA-256                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                    | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `frozen-work-set.csv`                                  | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `recovery-pos44-preflight.csv`                         | `88505a92f3253ca1c2aadaeca2fcc6daa973e91a3cebc13a23f63985449dc334` |
| `recovery-pos44-ledger.md`                             | `083c57069da586dcbeb7ff63255f957b7c36587ec6c225cac959b635b1c81151` |
| `daybreak-art-preflight-qa-chunk-05-pos44-recovery.md` | `c26efe6524c8b50575fbb2adb52ef870f4c91d939b9940d1b193dde02e53b134` |
| `local-art-pos44-recovery.csv`                         | `7e3e68bac99a4cb8531b98dc94e5a8d717244c0833a7d8c2051fd37e14515a89` |
| `local-codex-pos44-recovery.md`                        | `cf0e21e96067959974eabf09c7869eaf49bf5505ae8920cbfddcbce27e7a26ea` |
| `gemini-request-pos44-recovery.md`                     | `883952e41c2dc1effe1fbbdfa409a1f833bf8745fdfa3d85ef6f35a083a9b9b9` |
| `gemini-response-pos44-recovery.md`                    | `41bcf9a10da5ad658cc4866fd09e55c2f27e767cf71356fea3074c12a41cb14f` |
| `gemini-root-identity-pos44-recovery.json`             | `7e28141ed4b94480c5920417914a69e912df6f93fb9c2269288bbc3203e1add9` |
| `gemini-payload-files-pos44-recovery.sha256`           | `838f5683a6a57e8cecc9191e765aeca5d223ad6be81aafab6694919ab9485677` |
| `gemini-execution-ledger-pos44-recovery.md`            | `42b9dda07a91a2db51440ec4d985c9e69f6f8648ffea7a2fa244837ab39741ca` |

The complete temporary acquisition bundle and the exact uncompressed Gemini payload both passed their SHA-256 manifests. The Gemini root declares model `gemini-3.7-flash-high`, high effort, six images, completed status, and `reviewedByHuman=false`; its response contains six original-pixel access rows and the four required axis rows.

## Independent 6/6 original-pixel check

All six `1280 × 720` RGB originals were reopened directly at original detail. The page-07 right-hand author-introduction/frontmatter leaf was excluded; only the left story-body leaf was considered.

| Ref                         | SHA-256                                                            | Eligible observation                                                                                                         |
| --------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `hakusensha-reader-page-07` | `8c80ef213245f7b96c338b05bbcf316ba24eeea2f61ed352f7c7ff001ee10aab` | left story leaf: formal clothing, coherent figures and furniture, patterned kimono, rounded eyes; right frontmatter excluded |
| `hakusensha-reader-page-09` | `07bcdcfe2074e38c40bb70f19e71d53be536abebb6f0b2139f79b0839a066997` | full figures and suit construction alternate with enlarged eyes, floral tones, and chibi reactions                           |
| `hakusensha-reader-page-11` | `ab12a0518883042c1cadbbcecd8d2eef229a4d083cb9a39680dea865d78a2185` | meeting-room perspective, clothing, smooth close-ups, screentone, and expressive deformation                                 |
| `hakusensha-reader-page-13` | `cd7ae3904292865167c3035cf338e54564d5b58c9e788fc0ed578283a33c2fd8` | flowing hair and patterned clothing coexist with hard black masses and sharp emphasis lines                                  |
| `hakusensha-reader-page-15` | `950eaca334d28f65d98a4e3f5543262e5b86e79e657012df57fb42a9377e186c` | clean rounded faces, school and vehicle detail, open fields, and simplified comic inserts                                    |
| `hakusensha-reader-page-17` | `d1946f0d29b76100d259fc68b3129a91c1a603d945af50fc3dd8693896204cd6` | smooth character contours, clothing and house detail, broad white fields, and angular male hair                              |

The eligible leaves span the formal meeting, school/transit, and restaurant/home-preparation contexts. Static Art therefore satisfies the six-page and two-context contract. The spaced frames do not establish one exact start-development-impact-resolved action sequence.

## Dictionary-anchored adjudication

No cells were averaged and no majority vote was used.

- `artRealism=2`: plausible anatomy, hands, clothing, vehicles, furniture, and perspective recur, but enlarged eyes, idealized proportions, simplified facial planes, and recurring chibi deformation keep the sample at the dictionary's general-stylization anchor rather than realistic 4.
- `artDensity=2`: patterned clothing, flowers, screentone, furnishings, vehicles, and emphasis marks are repeatedly balanced by large white dialogue fields, clean close-ups, and simplified backgrounds. Neither sparse 0 nor dense 4 is sustained.
- `visualSoftness=3`: this resolves the sole panel conflict. Clean tapered contours, rounded eyes and faces, flowing hair, floral decoration, and smooth screentone persist across all eligible contexts, so neutral 2 understates the observed surface. Hard black hair masses, angular male silhouettes, and sharp comic emphasis remain substantial enough to reject fully soft 4. The ruling uses visible line and tone anchors, not demographic genre or story content.
- `motionImpact=unknown`: `motionGateAttemptable=false`; isolated gestures, reaction marks, and a vehicle image are not a continuous bounded motion packet. Unknown is not a low score.

## Output accounting

| Output                                                   | SHA-256                                                            |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `final-art-pos44-recovery.csv`                           | `8becc560a0d24fd307efef86d535aad50bc519dfd44dbc0e8d84e5473bee5faa` |
| aggregate `final-art.csv` before position-44 replacement | `a39f8061c73b1b79a5ba39f64b6f6d3fb92618a9bf40291714092c34da5a54c4` |
| aggregate `final-art.csv` after position-44 replacement  | `a6febf5a33fea570bca5def814416b2dfead69b2e30a240f2dd575850f6e3e7e` |

The recovery output has four axis rows. Only the existing four position-44 rows were replaced in the aggregate; work order and the other 36 rows were preserved. The aggregate remains 10 works × 4 axes = 40 rows, now with 27 known and 13 unknown cells. No text, source, generated catalog, registry, or promotion file was changed.
