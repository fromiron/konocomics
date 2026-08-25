# Batch 004 Art recovery — chunk 03 position 21 — Local Codex

- reviewDate: `2026-08-25`
- reviewer: Local Codex independent pixel review
- reviewedByHuman: `false`
- workId: `work-53fb816835ab36e40a1f`
- canonicalTitle: `アンデッドアンラック`
- scope: Factor Dictionary static Art axes on the corrected six-frame recovery sample
- Gemini / Grok / other model Art values: not consulted
- promotion: not performed
- adjudication: not performed
- image root: `/tmp/konocomics-batch004-art03-recovery`
- repository image mutation: none

## Input bindings

| Input                                                  | SHA-256                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                    | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                     | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `frozen-work-set.csv`                                  | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `recovery-pos21-preflight.csv`                         | `39ad64056fb4510a4bc35b69652377c0bcab39a670c9ddcebec91b3a62051432` |
| `recovery-pos21-ledger.md`                             | `927e89162c5564d68d862b456b4a085acc1b8e9a35d43860149abe72911b4c5d` |
| `daybreak-art-preflight-qa-chunk-03-pos21-recovery.md` | `40f90c6845fec9636c5d0f292bfeaf7d4d27fd37321e4dd629ac004735dd55ea` |

The frozen work identity is `アンデッドアンラック`, creator `戸塚 慶文`, with standard representative volume 1 ISBN `9784088823102`. The corrected preflight and independent Daybreak QA bind the reviewed standard volumes 2 and 3 to the same official 集英社 series and creator through ISBNs `9784088823300` and `9784088824048`, matching official reader ContentIDs. No special, limited, set, or alternate edition was used.

## Original-pixel access proof

All six exact transient PNGs were reopened independently at original `1280×1200` detail. Every SHA-256 recomputed locally matches the corrected preflight. Each frame is a readable numbered internal body spread rather than a cover, title page, synopsis, character profile, advertisement, or animation image.

| Ref                   | File             | SHA-256                                                            |
| --------------------- | ---------------- | ------------------------------------------------------------------ |
| `shueisha-vol2-adr08` | `vol2-adr8.png`  | `54bd7a74527d6dabb8ee4fb303661cb6d1f3e262f722b1d736258dd5e7a79090` |
| `shueisha-vol2-adr12` | `vol2-adr12.png` | `e0584d9fe82425db2c5210d31ec920de5f317dc937600ec54dd4d0a474a0a93d` |
| `shueisha-vol2-adr14` | `vol2-adr14.png` | `59d32287740794112af36811d8507a8bf4ac7a27a9be7a88a7f820ae7bcafac5` |
| `shueisha-vol2-adr16` | `vol2-adr16.png` | `9d9ee0f6d157b51429d0ce448886d89bee2c60979c36ddb7a17d4d4e20e55034` |
| `shueisha-vol3-adr16` | `vol3-adr16.png` | `659b8692cec31290069445f3033981a861a7d17aae53372db08ffb8c4e5aa7b9` |
| `shueisha-vol3-adr18` | `vol3-adr18.png` | `07fcd3a1b2a5b4153ee28b8f73809cb82061ad503d97955e8cc8c552db9956f4` |

The sample spans exactly two accepted contexts: the volume 2 barrier battle and aftermath exchange, and the volume 3 outdoor confrontation and battle. This satisfies the static six-page and two-context gate.

## Independent Art decision

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`. `U` is `unknown`, not a low value.

| Art vector      | Confidence               | Pixel-grounded decision                                                                                                                                                                                                                                     |
| --------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2 / 3 / 1 / U` | `0.91 / 0.92 / 0.91 / —` | General stylization persists despite coherent bodies and spaces; environmental texture, hatching, effects, and panel information remain above balanced; hard blacks, angular expressions, and jagged effects lean rough without becoming uniformly extreme. |

The Factor Dictionary `0 / 2 / 4` anchors were applied first. `artRealism=2` is supported because plausible bodies and settings coexist with persistent facial, reaction, and supernatural deformation. `artDensity=3` sits between balanced and maximal because detailed terrain, structures, groups, and effects recur in both contexts while close-ups and sky fields preserve open space. `visualSoftness=1` sits between rough/angular and neutral because hard blacks, sharp expressions, coarse hatching, and jagged action marks dominate, while quieter contours remain controlled enough to reject value 0.

## Motion boundary

The independently corrected preflight sets `motionGateAttemptable=false`. The six frames show isolated movement and impact, but they do not establish one exact gap-free sequence with a documented start or preparation, development, impact, and resolved endpoint. `motionImpact` therefore remains `unknown`; no action-presence shortcut or numeric inference was used.

## Output boundary

- output CSV rows: `4` plus header
- known static rows: `3`
- unknown motion rows: `1`
- reviewedByHuman: `false`
- source, generated catalog, aggregate `final-art.csv`, and promotion state: unchanged
- temporary images committed: `false`
