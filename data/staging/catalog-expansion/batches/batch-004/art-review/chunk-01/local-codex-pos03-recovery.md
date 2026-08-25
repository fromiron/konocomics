# Batch 004 Art recovery — chunk 01 position 3 — Local Codex

- reviewDate: `2026-08-25`
- reviewer: Local Codex independent original-pixel review
- reviewedByHuman: `false`
- workId: `work-0f3a44f5dcab9623d1be`
- canonicalTitle: `応天の門`
- scope: Factor Dictionary static Art axes on the corrected six-page recovery sample
- Gemini / Grok / other model Art values: not consulted
- promotion: not performed
- adjudication: not performed
- image root: `/tmp/konocomics-batch004-art01-recovery-pos03`
- repository image mutation: none

## Input bindings

| Input                                                  | SHA-256                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                    | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                     | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `frozen-work-set.csv`                                  | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `recovery-pos03-preflight.csv`                         | `01e7a7c7c80e6d9dc552e190caff3846352d0bef010bc6846233d31fb2f33da8` |
| `recovery-pos03-ledger.md`                             | `e50216651b98700395a61224ea8318e0c19f0c38192df95d4e56c234a047c54d` |
| `recovery-pos03-input-manifest.md`                     | `7b1761bf1f9502070ca6bcc4ec14114943e73e6aac389af3c0b7b8f1f9d356cc` |
| `daybreak-art-preflight-qa-chunk-01-pos03-recovery.md` | `953456c5fbf70bc33a147a574c09f7caf952f13c59028d626a4046dd750bb56c` |

The frozen identity is `応天の門` by `灰原薬`, with standard volume 1 ISBN
`9784107717429`. Official Shinchosha standard-volume pages bind volumes 1–3 to
the same title, creator, and BUNCH COMICS series. The publisher-operated Comic
Bunch Kai payload identifies the reviewed first episode as
`content_id=outennomon_001`, and the corrected independent QA confirms that no
special edition, cover, chapter opening, advertisement, retailer pixel, or
animation image supplied an Art value.

Official references:

- standard volume 1: https://www.shinchosha.co.jp/book/771742/
- publisher-owned internal episode: https://kuragebunch.com/episode/13933686331620138885
- retrieval and review date: `2026-08-25`

## Original-pixel access proof

All six retained JPEGs were independently reopened at their original
`985 × 1400` resolution. Their locally recomputed SHA-256 hashes match the
corrected preflight exactly. Each image is a readable story-body page from the
official Comic Bunch Kai CDN. Page 663, which carries the `第一話` chapter
opening, was not present in the reviewed directory and was not evaluated.

| Ref               | SHA-256                                                            | Direct pixel observation                                                                                                                            |
| ----------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kurage-page-666` | `641c81e47c48f60f0436bc25f77e03721f15c594df11dbd4ca4c760731e6eeab` | Outdoor running and aerial city panels show extensive street detail, scratchy movement hatching, hard blacks, a horse, and a tightly observed face. |
| `kurage-page-674` | `d9384fe969953f9f76bc31f3b28dea48066937db68a0874417d0c97e4076a189` | A doorway encounter combines restrained adult faces, layered court clothing, carriage and roof detail, smooth tone, and deliberate white fields.    |
| `kurage-page-682` | `13d4a9e45e079a502bc4748bf5035bc9ded984a5f53b32a2ba9ab57db7eb8974` | The Heian palace route is rendered through repeated buildings, roofs, walls, grids, masonry, and spatially coherent architectural perspective.      |
| `kurage-page-690` | `479a89dbe21d157b7c87b35dbfca17501e12f7432d5d2b33acd79f09556e3b7d` | Multi-person dialogue preserves period costume, interior structure, latticework, realistic facial planes, and dense black garden textures.          |
| `kurage-page-698` | `1ae0f8b5745d9efff18df749280f4c90a79a36498a79c2dadb2a014e764b3e4d` | Court dialogue shows coherent bodies and garments, angular eyes and brows, controlled folds, repeated screentone, and broad speech-led open space.  |
| `kurage-page-703` | `6ddb6b65c143e69ccd1b5f579b6572c943181248a50444e3a838e8ad57d8ae13` | Close dialogue panels retain precise anatomy, garments, props, hard dark shapes, fine hatching, and sharply constructed faces.                      |

The sample spans four accepted contexts: outdoor movement, a doorway encounter,
palace architecture and route exposition, and multi-person court dialogue. It
satisfies the static six-page and two-context gate.

## Independent Art decision

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`. `U`
means `unknown`, not a low value.

| Art vector      | Confidence               | Pixel-grounded decision                                                                                                                                                                                                                              |
| --------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `3 / 3 / 1 / U` | `0.91 / 0.92 / 0.88 / —` | Realistic anatomy, period clothing, and architecture lean above general stylization; recurring environmental and tonal detail is above balanced but not uniformly maximal; angular faces, hard blacks, and rough action hatching lean below neutral. |

The Factor Dictionary `0 / 2 / 4` anchors were applied first.
`artRealism=3` lies between general stylization and full realism because adult
anatomy, facial proportions, costume, horses, buildings, and spatial perspective
remain plausible across contexts, while selective facial and action stylization
rejects value 4. `artDensity=3` lies between balanced and maximal because
city-plan, roof, lattice, garment, tone, and hatching detail recur, while
dialogue close-ups retain open fields. `visualSoftness=1` lies between rough and
neutral because angular features, sharp eyes and hair, hard black masses, crisp
edges, and scratchy tension marks persist, while the controlled line and smooth
tone reject value 0.

## Motion boundary

The independently verified preflight sets `motionGateAttemptable=false`. The
selected pages are spaced snapshots and do not preserve one exact continuous
start, development, impact, and resolved endpoint. The running fragments on
page 666 were not converted into a numeric value. `motionImpact` remains
`unknown`.

## Output boundary

- output CSV rows: `4` plus header
- known static rows: `3`
- unknown motion rows: `1`
- reviewedByHuman: `false`
- source, generated catalog, aggregate `final-art.csv`, and promotion state: unchanged
- temporary images committed: `false`
