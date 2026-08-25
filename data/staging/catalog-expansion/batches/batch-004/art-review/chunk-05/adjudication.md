# Batch 004 Art adjudication — chunk 05

- adjudicationDate: `2026-08-25`
- adjudicator: Local Codex independent pixel adjudication
- reviewedByHuman: `false`
- scope: frozen positions 41–50; Factor Dictionary Art axes only
- method: Local and exact Gemini cells compared against the frozen official body-page pixels; no averaging or majority vote
- motionImpact: all `unknown`
- promotion: not performed
- commit: not performed

## Frozen inputs and reviewer provenance

| Input | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `art-preflight/chunk-05/preflight.csv` | `7b012de84db4bba279b343960183b5f36885575bf31d6949b4c28f156988a81e` |
| `art-preflight/chunk-05/ledger.md` | `23bc330597b4ee010924459b4832f0f9d62b1a8eefec36639b7421a0f37e1a9a` |
| `local-art.csv` | `4cf8bbb5990333681ad7ec86bae0024beb00e857cb19b95b2ec2677b983d7eb4` |
| `local-codex.md` | `38868a1b4db8134640f4f74b1951fd90621d9d246c8d04e0c5e6693e749a893b` |
| `gemini-request.md` | `2d4062836f7a627d52556e05ffd983a0caddc66e5c7ab745a0c6b5fb067b7fdf` |
| `gemini-response.md` | `61e230a50c6554c391687165bbe9842daf797bad551c469730563001525de42d` |
| `gemini-execution-ledger.md` | `722b83fee0b5b1b4d9e9272be4585754bbecf68beafca25bebc6b900049476e5` |
| `gemini-payload-ledger.md` | `5b3b61616da9304c68ed2e14bd0d884a2fb49eb517b981a5aa9287246c94b98f` |
| `gemini-root-identity.json` | `3637dcbf9378a564b28f57fbfd14dbc3176aae228b23d6f78ae70b7656e7365f` |

The exact Gemini authorizing run used `gemini-3.7-flash-high` at high effort and completed `SUCCESS` without fallback degradation truncation or rate limiting. Its canonical uncompressed payload identity is `05f535d6dfac5c886c03635296f13b78a7fe65128a531b11cace239189e34bf9`. Local and Gemini are both `reviewedByHuman=false`; Muse was `NOT_USED` and Grok was `ART_ABSTAIN`.

## Original-pixel and hash preservation

All 48 official body-page originals under `/tmp/konocomics-batch004-gemini-art05` were reopened at original detail during adjudication. Every recomputed file hash matched the payload ledger (`48/48`). The exact frozen page range and SHA-256 set is preserved below.

| Pos | Work | Exact page ref = SHA-256 |
| --: | --- | --- |
| 41 | 鵺の陰陽師 | `reader-page-05=947711a16100920c4419dabdb725535050ecf88330a8e21b535d1ddc38adcd58`<br>`reader-page-06=df12f1b03f0d45a6932e9a7dd756769584b95937dd7b88a4a3a53d7b8382eb7c`<br>`reader-page-07=d3c18b52a287fc3bf4f90fc5a8aace35380e6754ff83838ac8fc3bbcf583341d`<br>`reader-page-09=efc1ff199decab826f036817ec035e31ba4e75513c6b1220d072a1bf3715aae1`<br>`reader-page-13=9bd8ffea180ef5ed06c104f90519c010150610fd272ca4844f0b9cc16bfd07b0`<br>`reader-page-14=4a96259337c1fd4b17387784c4347e1ca6c8e2c6a545dd38c71b2d690deaaad8` |
| 42 | モテキ | `reader-page-09=0c53d7d956682d02f6aa4dbf3ed0e851ab2f6f77ca848eb9013069ce64af0946`<br>`reader-page-10=c990d5ec5299ca87eb06eedc975a48efb3809afc1d049cf3bf59ae7ab95728f0`<br>`reader-page-11=9c212bfe012608f7901b1a72b818df50fec7f7db36c3c0c1375ff10ec75a5f43`<br>`reader-page-12=bc4983530f3501977605f1b7d9d986306bedfc8a0e36413cf7d20cafc34eea79`<br>`reader-page-18=39e41e7a0edc16b887868b75b56487981b97b2d07b69020e577dbf849cd8799c`<br>`reader-page-19=3fb6e7c153aee5e862f35fd7a7fa1ec6113c60a337fe0fa8127cca503259efec` |
| 43 | 八雲さんは餌づけがしたい。 | `episode-01-page-005=07da429fd50180481162f8a9bdba5a9d103cf290e92591fcd86d541712e46b03`<br>`episode-01-page-006=36aa2ebe87039d3d58f4a65fe0d687d2ae54fdc031cea63ec647e7b726feb224`<br>`episode-01-page-007=9377e28da1b083682663abe3a5a8013d9ad076cdffb15cd510339916c87bffc1`<br>`episode-01-page-008=ee11fec46e8595d79539ca01c98318cb35f95a780c2b47c8c7ff361d2592a8ff`<br>`episode-01-page-009=ac210039353cb221ba2fd1b9e2b619b2f120ac9d55b78d704c179316eac3ae28`<br>`episode-01-page-010=575dc156bd28c569d5fa79e74828dfa85a2564156512bfbfb25f95f5bfe444c0` |
| 45 | ここは今から倫理です。 | `reader-page-07=3c95e75a095d1436b2d0962943dad12588acf8b559896887104d27b99411b3fe`<br>`reader-page-08=46f03b94916fd62ced9bdee1ee1797fdc8e52aac6294f0e8168cd02aefe2d089`<br>`reader-page-09=298e9ed22e60bfc24721c5d37db7fa20b559b7a13a98e79ade57f2d2b14c3c89`<br>`reader-page-13=5be6e7a38e704e65a52fa836b6828011b3730557d8100df2647e22ffb8f63c1b`<br>`reader-page-14=4e3658d09d46088048da46a58428ad96a63f8e590c5c0ba68a92fe0888a6333d`<br>`reader-page-15=d9d22145d8e384f9056ccb1428c0dbe51d2882d0581f0a6f958f7d25465e2862` |
| 46 | さよなら絵梨 | `reader-page-05=74e86217e6ed167c727e01b65c68a144fc0c80bdd61852288ecee35f9659e087`<br>`reader-page-06=b49e8043fbe1fe80a4492d10fdcf564746eae777eef43a9647403ceede492836`<br>`reader-page-07=55ae0caf792591326335ae4a74fbb3b73a0d92822ead715ab8406587eab0b006`<br>`reader-page-08=915c268425725d5ded88105db98abcbe493ee477bcddcd4c8fdef635b30023d1`<br>`reader-page-09=1936f47375b752e47a5e7ac72c6b6a4b5e5cbe8d03d68e87872ea95e566b40cf`<br>`reader-page-13=17e0bfc24a05cc1d0227ff57a2a412fa0d943c4e728ef9d85b0c5d8242e009c9` |
| 47 | 極楽街 | `reader-page-05=3a2fb1d63e91b9dde484b90b940f7a2e2c2cda884a40a98a2f21600cd3810370`<br>`reader-page-09=564b1a0573be6f3362d9cbaf14f77845469f2c6511c7e9196c7c3a7e881201ea`<br>`reader-page-13=3053075080af2a8e106c4edad2e8d1e824c5715df9ffbffb84ec3184a27c3fc5`<br>`reader-page-14=c9851662ca425f3b936da21be0ea0d0dc4df71b1db0e9ee5a14a5cfb686bedb7`<br>`reader-page-15=7a6a289058a54bb4ea1b202b86d1872e53ace6013f915caa861d39cbe4d96fc6`<br>`reader-page-19=ced67e7a45b9da7dc1c0a09420efe04923cfd28dd43d76e48fc6a905346d3031` |
| 48 | アオハライド | `reader-page-07=639b189cb5f18fc2c8d43a615331848499ae0e9d5a76ea6b90ac75fda398f28c`<br>`reader-page-08=532f3a928027d0e651be2a7198849231cae94729c015df63a022a9ded90c3356`<br>`reader-page-09=f70bbbdf4a098331fe7442f044aa254b3fa1ee42db5cd3f5184f641fa1398f52`<br>`reader-page-13=8817ea796f4ccb7ffa6a2b9bf67d46cd3d70afbdd20b9fd1e9b3f4582cc421a6`<br>`reader-page-14=6c008ab2d40399ffc4c8c24d59262eaad38b532fe5a45b8c1938e92b474a8699`<br>`reader-page-15=c83a93d1b672f8f078ff78d92b9800b157182865a0757c057645b4a5174816f9` |
| 49 | 青の祓魔師 | `reader-page-08=10b83f292cf4fd149e35718a0cacbb239591b71017f2452f00e71de9291fe555`<br>`reader-page-09=39c603f03158ed5a95ed03f19aa7b7f855fc88ceae05ed66889dea7669232370`<br>`reader-page-13=2c2f87f97b7eff4e4f2768fe64156a63e011a4cf28dba06c51ed05ef2de334df`<br>`reader-page-14=a67ea55b7bb1e5c244a56cbbcbd8854ab8dd577ddbd8351716b71b64e9edd09d`<br>`reader-page-15=3f8f01326776b133fe8f86675a69b76d26311ec532e8b1bdb22899e3e18f4258`<br>`reader-page-19=e9294e7178a0d4acb54bc04a0cd6656873b3b6a1e0cb21a0035ed5d2f6ca872d` |

Positions 44 and 50 are `unknown-ready` and have no eligible body-page original; no cover or product image was converted into Art evidence.

## Cell-by-cell conflict adjudication

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`. `U` is unknown and not numeric zero.

| Pos | Work | Local | Exact Gemini | Final | Dictionary- and pixel-anchored ruling |
| --: | --- | --- | --- | --- | --- |
| 41 | 鵺の陰陽師 | `2/3/3/U` | `2/2/2/U` | `2/2/3/U` | Realism 2 is agreed. Density resolves to 2 because highly rendered spirits and trees are not sustained through the sparse classroom and hallway pages. Softness resolves to 3 because smooth hair faces and tones dominate both contexts while black apparitions prevent 4; the dark subject matter itself does not make the line neutral or rough. |
| 42 | モテキ | `4/4/2/U` | `4/4/0/U` | `4/4/2/U` | Realism 4 and density 4 are supported throughout bedroom fantasy and office contexts. Softness resolves to 2: crosshatching raises density but smooth observed faces hands and fabric coexist with coarse shadow. Gemini 0 conflated heavy texture with uniformly rough angular expression and fails on pages 09 12 and 19. |
| 43 | 八雲さんは餌づけがしたい。 | `1/1/4/U` | `2/2/4/U` | `2/1/4/U` | Realism resolves to 2 because normal bodies domestic perspective and food dominate outside intermittent reaction deformation. Density resolves to 1 because open fields and economical rooms dominate while kitchen and food details keep it above 0. Softness 4 is unanimous and survives every context. |
| 45 | ここは今から倫理です。 | `3/4/0/U` | `2/4/0/U` | `3/4/0/U` | Realism resolves to 3: varied grounded anatomy posture and high-angle perspective consistently exceed ordinary stylization while expressive faces prevent 4. Density 4 and softness 0 are unanimous and persist in both the dark confrontation and later classroom context. |
| 46 | さよなら絵梨 | `3/2/3/U` | `2/0/2/U` | `3/2/2/U` | Natural anatomy and camera-like framing resolve realism to 3. Density resolves to 2 because page 09 and 13 preserve aquarium kitchen domestic office and hospital information so 0 is not sustained. Softness resolves to 2 because light clean framing is countered by scratchy naturalistic faces and hard straight structure; Local 3 overstates polish. |
| 47 | 極楽街 | `3/4/2/U` | `2/4/4/U` | `3/4/2/U` | Grounded hands age variation clothing and architecture resolve realism to 3 despite anime faces. Density 4 is unanimous. Softness resolves to 2 because sleek faces and gradients coexist with hard blacks angular architecture action marks gloves and craggy older faces; Gemini 4 does not survive every context. |
| 48 | アオハライド | `2/1/4/U` | `2/0/4/U` | `2/1/4/U` | Realism 2 and softness 4 are unanimous. Density resolves to 1 because abundant white space dominates but corridor crowds outdoor trees clouds school structures and multi-panel staging make the sample more than the simple-minimal 0 endpoint. |
| 49 | 青の祓魔師 | `2/3/1/U` | `2/2/2/U` | `2/3/1/U` | Realism 2 is agreed. Density resolves to 3 because town church dining props textures and supernatural staging recur across contexts although sparse dialogue pages prevent 4. Softness resolves to 1 because hard contours angular hair dark masses and sharp effects recur beyond isolated action while clean dialogue pages prevent 0. |

Positions 44 and 50 remain unanimously `U/U/U/U`. Their finite-route `unknown-ready` status is terminal and not a blocker.

## Motion boundary

All ten preflight rows have `motionGateAttemptable=false`. None of the 48 originals fixes one continuous sequence with exact start development or impact and resolved endpoint refs. All ten `motionImpact` cells therefore remain `unknown` with blank value and confidence. Action presence was not treated as a numeric score and absence of a complete packet was not converted to `notApplicable`.

## Final output accounting

- `final-art.csv` schema matches `local-art.csv` exactly.
- works: `10`
- axes per work: `4`
- data rows: `40` plus one header
- known static cells: `24`
- unknown cells: `16` (`10` motion plus `6` static cells at positions 44 and 50)
- reviewedByHuman: `false`
- promotion or catalog mutation: none
