# Batch 004 Art recovery adjudication — chunk 03 position 21

- workId: `work-53fb816835ab36e40a1f`
- canonicalTitle: `アンデッドアンラック`
- reviewer: Daybreak independent final Art adjudicator
- reviewDate: `2026-08-25`
- result: `VERIFIED`
- reviewedByHuman: `false`
- Grok Art status: `ART_ABSTAIN`
- Muse status: `NOT_USED`
- temporaryImagesCommitted: `false`
- sourceOrGeneratedDataChanged: `false`
- promotionPerformed: `false`

## Bound inputs

| Input                                    | SHA-256                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`      | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| corrected `recovery-pos21-preflight.csv` | `39ad64056fb4510a4bc35b69652377c0bcab39a670c9ddcebec91b3a62051432` |
| corrected `recovery-pos21-ledger.md`     | `927e89162c5564d68d862b456b4a085acc1b8e9a35d43860149abe72911b4c5d` |
| independent preflight QA                 | `40f90c6845fec9636c5d0f292bfeaf7d4d27fd37321e4dd629ac004735dd55ea` |
| Local vector CSV                         | `b30760c62e4b2edc3a5f7210939e1941b0e7dd00ea7e48fdc7d0c88f2a64fe09` |
| Local review report                      | `a4496ba1927dbe3eebff7ce15e5980dae8ab2319470ab3d9bdb3145c3dced60c` |
| exact Gemini request                     | `c9c1379899bdadea1152d809a3aeb515aeef95ca4fa3489ec67c906efad71407` |
| complete Gemini response                 | `1941990789ec9b962f78512c56347192faeacc53ee9510f1a9eb4f421336e146` |
| Gemini payload ledger                    | `123fbf7df88cf7d3205e91409d6c698b63283376b51e106c81dc0c9a5eb03e9b` |
| Gemini root identity                     | `f511e78c7c46e08b399c6225de3b6780121696132a02c5b0c1316414428aa3a6` |
| Gemini execution ledger                  | `9a850df3ffd785026de595b821da81a6a41d1191f3b21683d0982c27b3e7f844` |

The exact Gemini payload remained available as the canonical uncompressed directory `/tmp/konocomics-batch004-gemini-art03-pos21.I4PBg7`. `sha256sum -c payload-files.sha256` passed for all eleven payload files. The Local report and complete Gemini response each attest `openedOriginalPixels=6/6`; both vectors therefore meet the two-model static Art quorum.

## Independent original-pixel recheck

The adjudicator independently reopened all six payload PNGs at original `1280×1200` detail and recomputed every hash. Each is a readable official internal body spread from the standard editions, not a cover, title page, profile, advertisement, or animation image.

| Ref                   | Context                                 | SHA-256                                                            |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------ |
| `shueisha-vol2-adr08` | vol. 2 barrier battle                   | `54bd7a74527d6dabb8ee4fb303661cb6d1f3e262f722b1d736258dd5e7a79090` |
| `shueisha-vol2-adr12` | vol. 2 barrier battle                   | `e0584d9fe82425db2c5210d31ec920de5f317dc937600ec54dd4d0a474a0a93d` |
| `shueisha-vol2-adr14` | vol. 2 battle aftermath                 | `59d32287740794112af36811d8507a8bf4ac7a27a9be7a88a7f820ae7bcafac5` |
| `shueisha-vol2-adr16` | vol. 2 aftermath exchange               | `9d9ee0f6d157b51429d0ce448886d89bee2c60979c36ddb7a17d4d4e20e55034` |
| `shueisha-vol3-adr16` | vol. 3 outdoor confrontation            | `659b8692cec31290069445f3033981a861a7d17aae53372db08ffb8c4e5aa7b9` |
| `shueisha-vol3-adr18` | vol. 3 outdoor confrontation and battle | `07fcd3a1b2a5b4153ee28b8f73809cb82061ad503d97955e8cc8c552db9956f4` |

The six frames span exactly two accepted scene contexts. The static gate is open. The samples do not establish one exact gap-free start, development, impact, and resolved endpoint; the motion gate remains closed.

## Panel comparison

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`; `U` means `unknown`, not a low value.

| Reviewer              | Vector          |
| --------------------- | --------------- |
| Local Codex           | `2 / 3 / 1 / U` |
| Gemini 3.7 Flash High | `2 / 2 / 2 / U` |
| Final adjudication    | `2 / 3 / 1 / U` |

No value was averaged and no simple vote was used. Each disagreement was resolved against the Factor Dictionary anchors and the six reopened frames.

### `artRealism = 2`

Both reviewers agree and the pixels confirm the general-stylization anchor. Coherent anatomy, hands, clothing, terrain, and perspective coexist with enlarged eyes, elastic expressions, exaggerated musculature, and supernatural deformation. The sample is neither strongly simplified nor consistently realistic.

### `artDensity = 3`

The Local value is retained. Terrain, barrier and water texture, distant structures, group staging, hatching, screentone, speed lines, and effect marks recur in both contexts, keeping the full sample above the balanced value-2 anchor. Gemini's value 2 underweights this sustained background and mark density. Value 4 is rejected because close-ups, sky fields, and figure-led panels preserve deliberate open space.

### `visualSoftness = 1`

The Local value is retained. Hard black masses, angular faces and hair, coarse hatching, sharp reactions, and jagged action effects dominate both contexts, placing the sample between the rough/angular value-0 anchor and neutral value 2. Gemini's neutral value underweights that repeated hard treatment. Value 0 is rejected because quieter faces and character contours remain clean and controlled rather than uniformly rough.

### `motionImpact = unknown`

All reviewers agree. Isolated action and impact imagery cannot replace the required exact continuous start-development-impact-resolved sequence. `motionImpact` remains explicitly `unknown`.

## Aggregate replacement

Only the four rows for `work-53fb816835ab36e40a1f` were replaced in the existing 40-row aggregate, preserving row order and every other work row.

| Artifact                               | SHA-256                                                            |
| -------------------------------------- | ------------------------------------------------------------------ |
| aggregate `final-art.csv` before       | `90e7a0fb8d306d919029608cd0ee6d4b3ae83f15d9aeff7d8aceafd682bc0f83` |
| bounded `final-art-pos21-recovery.csv` | `cdd5cfa6ef04e4f8e8743a637454778dcb2545fc8bba408e6340a231e101eaa4` |
| aggregate `final-art.csv` after        | `4777d2276d5913c340215c56706692ce075a160e685857dce4bf73fd85c765e2` |

The bounded CSV contains exactly four unique axes. The aggregate contains exactly 40 unique `(workId, axisId)` rows, with position 21 resolved to `2 / 3 / 1 / U`. No text, source, generated catalog, registry, or promotion file was changed.
