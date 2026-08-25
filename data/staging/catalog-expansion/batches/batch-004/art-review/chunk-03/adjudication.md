# Batch 004 Art adjudication — chunk 03

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent Art adjudication
- reviewedByHuman: `false`
- scope: frozen positions 21–30; Factor Dictionary Art axes only
- method: Local and exact Gemini cells resolved independently against frozen official body-page pixels, exact editions, and range gates; no averaging or majority vote
- Local + Gemini quorum: `COMPLETE`
- Cursor Grok: `ART_ABSTAIN`
- Muse: `NOT_USED`
- temporaryImagesCommitted: `false`
- promotion: not performed
- commit: not performed
- hardBlockers: `0`

## Frozen inputs and reviewer provenance

| Input | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `art-preflight/chunk-03/preflight.csv` | `cfea3c57b84331d9255dabf652aef7c2b9ef48031d2db31e64b5aaca569a7eee` |
| `art-preflight/chunk-03/ledger.md` | `5aba86caccc6d9c114a8709d3b9f67899ab077ae7e0591be87864a8c0172b6de` |
| `reviews/daybreak-art-preflight-qa-chunk-03.md` | `cd8778a25acf8486794a5091f2c6b54f8fc4215a580596a640342427eb5553eb` |
| `local-art.csv` | `55393bedc2eef873583bd21b628be6b6ada3e92d3d78d0d791aae1dc5e3e93e3` |
| `local-codex.md` | `4b57eba7aeb276a8820b38a5d44a2a4fba02f50cbc493203bc8ad515af16ac59` |
| `gemini-request.md` | `4bb65eee80f61b879fbd36c9d5f8685d7afe4ad7fa3f4b97dba44194f416d5fc` |
| `gemini-response.md` | `c127753ae744839c674c9ab4e99e594ce69024aab56a10a2d1733f2859e6c5ef` |
| `gemini-execution-ledger.md` | `a0193a849093bf8b14677e740a3972929836a9f5973c56eb8f53f690d2b82073` |
| `gemini-payload-ledger.md` | `47041b5568f3128683675febd14b3dc236b7562536a0996cfe79410a39e529dd` |
| `gemini-root-identity.json` | `b92aa89baddb43f28c379d8a3abe7959e141c11932ce7f85d690c709997f8c92` |

The exact authorizing run requested and resolved `gemini-3.7-flash-high`
(`Gemini 3.7 Flash High`) at effort `high` in read-only plan mode. Conversation
`224f2389-ee56-4ed9-92ee-cbff5e1afbc1` completed normally with outer result
`SUCCESS` in `503.257s`. It returned all ten works and all 40 terminal cells,
and inspected all 58 original pixels. There was no fallback, degradation,
truncation, timeout, rate limit, or model substitution. Local conclusions were
hidden from Gemini; both reviewers are `reviewedByHuman=false`.

The payload root was `/tmp/konocomics-batch004-gemini-art03`, whose recorded
identity was branch `main`, head
`a423c20add1162b7cdf71342a721ffcd7191d3c2`, dirty `true`. The canonical
uncompressed payload identity independently recomputed as
`059722be6395a449ed9e305687529f319f3eb033c89cb64445895c09516189be`.

## Failed-attempt exclusion audit

- Attempt 01 used invalid `--print-timeout 900`. The CLI rejected the missing
  duration unit before model invocation, so it supplied no review evidence.
- Attempt 02 used `--print-timeout 15m` and returned shell exit zero, but
  headless permission handling auto-denied the required read command and
  produced no review output. It supplied no review evidence.
- Only the later explicitly recorded read-only run with
  `--dangerously-skip-permissions` is counted. Its complete response, exact
  model identity, root identity, input copies, pixel hashes, and payload
  identity all survive independent verification. No failed-run output was
  repaired, merged, or substituted.

## Original-pixel and hash preservation

All 58 declared PNGs were reopened at original detail for this adjudication,
and all 58 independently recomputed hashes matched `gemini-payload-ledger.md`.
All eight frozen non-image payload inputs also byte-matched their repository
sources. Dimensions were preserved as follows: positions 21, 22, 25, and 28
are `1235×1937`; positions 23, 29, and 30 are `461×720`; position 24 is
`509×720`; positions 26 and 27 are `1850×1937`.

The 42 pages at positions 23–26 and 28–30 pass the static sample gate. The 16
pages at positions 21, 22, and 27 remain diagnostic gate-failure evidence only:
position 21 has six pages from one context, and positions 22 and 27 each have
five genuine body pages after opening-page exclusion. No cover, title or
chapter-opening page, animation, synopsis, Genre, text Factor, Gold value, or
user opinion supplied an Art value.

| Pos | Work | Exact page ref = SHA-256 |
| --: | --- | --- |
| 21 | アンデッドアンラック | `reader-step-04=13d3a1c76cb66a27442c87459853df940ec7b3f3a5db975cde0b2b76d4565172`<br>`reader-step-08=948cf8d499d6ce9d3ab35fdcfa31063bcbb9ca29a06b677796d5710254dc5b1d`<br>`reader-step-12=63d3cb9e0e662fc4bbf8cdac67a224e9dfd339ec60dee3971b7c368adfc8eb95`<br>`reader-step-16=533d8ca73a3eba15c0f4d60bc8813e0a1721b40091f902ef34ff45eb424b2fc8`<br>`reader-step-20=9d0a16d5d90eee0694264d36d0c9d3c26d6bbe70d388899247b16d787044355b`<br>`reader-step-24=4b19197c011ee078d7c97dc4a5f98f79ac9aa31e21c88895bfbde89e26e6cb0b` |
| 22 | 俺物語！！ | `reader-step-08=2c59afc5a485c1f35e763a6f087721c5c31f75fc162224517f9e351d62e9d4ea`<br>`reader-step-12=50e0bb1daf36ed1cd5f5f2bcc28090a3034b8a5629c0ba82f287d0ea089339d2`<br>`reader-step-16=64234bb591f95d07e08d62029bae5b813876849ebdec2c31f1efbd0cc489c7d8`<br>`reader-step-20=267e611d57271ac60b96eeed0602485fabb574de9c218a53eeb9d207b3ba9563`<br>`reader-step-24=84c180390b81b45624fce97c0d1ee617b82f6fe986f6853120dcc4b6e4d07a8e` |
| 23 | お茶にごす。 | `reader-step-04=a7595cb3c80b73fe4a85e0ea6e9ebd056b581b88c0f342d71bf1fabe06eb8a8b`<br>`reader-step-08=5dd49f573c089b8a0bcde4b4a0da069b7507009851195a073f4e173d6d699ed5`<br>`reader-step-12=4b01bf97465cbb0fe840590115b1df77445205b5da64ae7fb1789e92fbc37b6f`<br>`reader-step-16=118cf80045e02921e22af044d59b89d90c42abb9dceb2f99217756e78edc2eab`<br>`reader-step-20=c02bd179155760afda81307ea15da1640e9752eaf786b6d281504cf9d70fc4fe`<br>`reader-step-24=d0266a090d026dc20cceba235e13a7e64d9e566fe8bbd7ea682088b37a96d97b` |
| 24 | 黒月のイェルクナハト | `reader-step-08=e0fa0a5a5b20464fc22d573d793a1c9f70c07367e73d9b4edeffc8d9ce70d4d4`<br>`reader-step-12=0edd0282307ac922d4da4aa943b13843b23ff659c3506871ed6a57e728298f19`<br>`reader-step-16=855348385abe6cc629840b40d4d626794bb224044b5e00b6da01efc1ff4778db`<br>`reader-step-20=78f6a586ab1258cd1aea4d00653dc7ec7ea9d1a46057324b69684526cb7fe3f7`<br>`reader-step-24=6d39a46daf0ecb174ad162c14ca3e3ad20f87b2aeafaa7a413fb0d963fa61b47`<br>`reader-step-28=6eb2d310d02230e436fbdce65c6b4f8fd0370afee8a8bd9c184902f13f4f306d` |
| 25 | ルックバック | `reader-step-02=65223c3997dd6f0d74a2b38fe7d1d832c6c517de02b08e8f7613fc843007aa50`<br>`reader-step-03=f2e11ee01c71e3f21674e2c9099135d23495520a897485336170b1acb2625d8f`<br>`reader-step-04=dffcfba325f5eb11a9beb2940f86053e82cecac6287506447967c39ce3c0b180`<br>`reader-step-05=7239f4917f077f86736a247a6481ad41598738909b467da0639b499ee854b081`<br>`reader-step-06=019bee04c59fee18fb045ba1ea2a0639c68c3fdf2408233b6bdac11e519356bb`<br>`reader-step-07=5bad5fba8d0dd6f6f72be158ef0da2b5be44b4f9b86443f3f2c3d69a269470bb` |
| 26 | 夢中さ、きみに。 | `reader-page-005=acab0f646c50d7d851d074b4dba96da87c8257abb9c3f5e985fd03392de98f2c`<br>`reader-page-006=affc4cbe636b4b0eaf1174cd2f682b68286070d1afcee837e3751c548dfb1074`<br>`reader-page-007=674a6116a5fc581a6958b1aa0807f08002bd183c67d053500b35a85723dd03f5`<br>`reader-page-008=bd384aaba7abdd5eb17c8994dd0c0ab7866f3202c564024a3285a61c7fae21de`<br>`reader-page-009=6d054a04306ce320ee8387ed81e6ed32755b5ebbcb66aa44d6f2b8b770ee5169`<br>`reader-page-010=fb094439c474b90ec5c0172158ee62d9f3fb9ff21b545e4390ea510a9c41c0ea` |
| 27 | 異世界おじさん | `reader-page-005=8f41f4fac83624f57d31b3b2607cb46ff2fb119b3121d733162e406cd1dff973`<br>`reader-page-006=baba685186aa20d155e4cd777749e79365071a1ab11efce8b7fb1a2134450e1e`<br>`reader-page-008=cb0801b2612ac471e60bb9609750fe2a68eda5d06077b97b830ed4d637c9371d`<br>`reader-page-009=86d57ce38c36b8b061b1be1abe2ebd367c9fb097976836c53c6796acdfe78432`<br>`reader-page-010=95f1771213244899100ba17d75ec9eed26a6dac0341066ff38c910d0d04638b8` |
| 28 | 思い、思われ、ふり、ふられ | `reader-step-04=ce21d4d86db9b71f6686520617c2a1e3349f2086e147c11d1ff9216203b196b3`<br>`reader-step-08=8899258e2d6fadb2d8ca40003f210031b857295572b7f23405bad950bf36215d`<br>`reader-step-12=e6caf0002f0607b8aea29b7862a3dc2d5f5ce2b9250e14da9dea321141d7f053`<br>`reader-step-16=c86aede9c153425fb7eddcda62521cb6693d4d6048fd79a9b5b006dd6dd4dff8`<br>`reader-step-20=8e247865d49599588b390109c8ca02210c063994a49df8346d882df32a347d8a`<br>`reader-step-24=dea3aad7fa300b54dbe2037cee8fcb21b01377900d4948d9e1619f68e3018e4b` |
| 29 | 式の前日 | `reader-step-04=0695b256ed66f044a60a4534c7226f8b0329b4de5568d78ebfb5220ff69ec69f`<br>`reader-step-06=866136f4f1d830637392a9c6079f5e341e4be3bc297b600c2654f6ee601cc989`<br>`reader-step-08=1447c05c3a33382a3a807d9ba4f3b7da9d37e12ecef838d0848b957f7b8f0c07`<br>`reader-step-10=3bcc5cbe3061a4f87069611d04082ef0583465930fdef466efff053d464f2733`<br>`reader-step-12=504a46c70ec19df4fd371fdf4b1279a6b97602eb70d8b9910e5c423565a8385c`<br>`reader-step-14=21f2c6030006756abbc37771e40843c8517da171742fc7983949ad0395fc4b01` |
| 30 | さんすくみ | `reader-step-08=bced0b866bf404ca6030c0a7526854f7b0df1e5d46fb3ff6f6bb87e98bce0d44`<br>`reader-step-12=838904b7d32b10dd4011b994a2ba7e735b42c8ad7f37b173f14c677eddfed705`<br>`reader-step-16=70c5e125fe2e4222b5a6577c0443fc3f147676910111b939abb40d4a0bd2a273`<br>`reader-step-20=8950ceaaa43f6aed1c25b98ed9a7248e6020b7db3c4469ca80973da44aba960b`<br>`reader-step-24=4ae59ff8b6c23910f744490bf7d7f89129353e750b506472f3cff6618eab27d4`<br>`reader-step-28=c27880635d6e247b33e04e3af33ffab549ad75815bbe151a74078b98d7f86229` |

## Cell-by-cell conflict adjudication

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`.
`U` is terminal unknown and never numeric zero.

| Pos | Work | Local | Exact Gemini | Final | Dictionary- and pixel-anchored ruling |
| --: | --- | --- | --- | --- | --- |
| 21 | アンデッドアンラック | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Six readable pages are confined to one railway encounter and action sequence. The two-context static gate fails; action fragments do not establish an exact complete motion sequence. |
| 22 | 俺物語！！ | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Excluding the title splash leaves five genuine body pages. The six-page static gate fails and the retained packet supplies no complete motion sequence. |
| 23 | お茶にごす。 | `2/2/1/U` | `2/2/1/U` | `2/2/1/U` | The reviewers agree: general stylization and balanced school information coexist with angular jaws, spiky hair, hard blacks, and sharp expressions. |
| 24 | 黒月のイェルクナハト | `2/3/1/U` | `2/3/1/U` | `2/3/1/U` | The reviewers agree: coherent bodies coexist with supernatural distortion; architecture, fixtures, hatching, and effects sustain density 3; hard angular treatment sustains softness 1. |
| 25 | ルックバック | `3/2/3/U` | `3/3/2/U` | `3/2/3/U` | Density resolves to 2 because classroom and staff-room detail is balanced by open close-ups and broad white fields; one detailed office and diegetic drawings do not sustain high density. Softness resolves to 3 because fine rounded faces and polished quiet primary rendering persist across both contexts; rough diegetic drawings and hard architecture prevent 4 but do not reduce the primary treatment to neutral. |
| 26 | 夢中さ、きみに。 | `4/2/3/U` | `3/2/2/U` | `4/2/3/U` | Realism resolves to 4 because natural human anatomy, posture, hands, and field, restroom, dining, and stairwell geometry remain realistically proportioned in every context. Softness resolves to 3 because controlled elegant faces, smooth organic contours, and restrained tones persist throughout; crisp architecture prevents 4 but does not erase the sustained polished treatment. |
| 27 | 異世界おじさん | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Excluding the chapter-opening image leaves five genuine body pages. The six-page static gate fails and the retained packet supplies no complete motion sequence. |
| 28 | 思い、思われ、ふり、ふられ | `2/1/4/U` | `2/2/4/U` | `2/1/4/U` | Density resolves to 1 because broad white fields, light tone, and close-ups dominate; station and store props keep it above 0 but do not sustain balanced information. Softness 4 is unanimous and survives all five sampled contexts. |
| 29 | 式の前日 | `3/3/2/U` | `3/3/3/U` | `3/3/2/U` | Softness resolves to 2 because elegant contour and intimate staging are offset throughout both domestic contexts by scratchy hair hatching, dense grain, and hard shadow; the polished treatment is not sustained above neutral. |
| 30 | さんすくみ | `2/3/2/U` | `2/2/2/U` | `2/3/2/U` | Density resolves to 3 because shrine architecture, foliage, garments, screentone, effects, and group staging recur across the full sample; figure close-ups prevent 4 but do not reduce recurring information to balanced density. |

Seven static cells conflicted: position 25 `artDensity` and
`visualSoftness`; position 26 `artRealism` and `visualSoftness`; position 28
`artDensity`; position 29 `visualSoftness`; and position 30 `artDensity`.
Each was resolved from exact pixels and Factor Dictionary anchors rather than
reviewer identity, vote, or arithmetic. The other 33 terminal cells agree.
Endpoint audits retain position 26 `artRealism=4` across all four contexts and
position 28 `visualSoftness=4` across all five contexts. No zero endpoint is
retained.

## Motion boundary

All ten accepted preflight rows have `motionGateAttemptable=false`, which the
Daybreak QA independently upheld. None of the 58 originals fixes one continuous
action with exact start, development, impact, and resolved endpoint refs. All
ten `motionImpact` cells therefore remain `unknown` with blank value and
confidence. Action presence was not converted to a score, and absence of a
complete sequence was not converted to `notApplicable`.

## Final output accounting

- `final-art.csv` schema matches `local-art.csv` exactly.
- `final-art.csv` SHA-256: `90e7a0fb8d306d919029608cd0ee6d4b3ae83f15d9aeff7d8aceafd682bc0f83`
- works: `10`
- axes per work: `4`
- data rows: `40` plus one header
- known static cells: `21`
- unknown cells: `19` (`10` motion plus `9` static cells at positions 21, 22, and 27)
- notApplicable cells: `0`
- Local/Gemini terminal agreements: `33`
- Local/Gemini static conflicts adjudicated from exact pixels: `7`
- reviewedByHuman: `false`
- Local + exact Gemini quorum: complete
- Cursor Grok Art: `ART_ABSTAIN`
- Muse was `NOT_USED`
- temporary images committed: `false`
- preflight, source, promotion, catalog, and generated artifacts changed by this adjudication: none
