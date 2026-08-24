# Batch 003 Art adjudication chunk 04

- adjudicationDate: 2026-08-24
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: exact official entry-edition samples in chunk-04 preflight
- method: per-axis Factor Dictionary and original-detail pixel adjudication; no averaging or majority vote
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                                   | Identity or SHA-256                                                | Result                                                                     |
| --------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Preflight CSV                           | `4bce1df481f80adf6d51719f989c48780db7adddda0b927bfee0eece4aabe17d` | nine proposed sample-ready works and one terminal unknown-ready work       |
| Preflight ledger                        | `bfc108991d9363f8780c927cd3976d63ea210193cff784c2229c746a4ec266cd` | 33 temporary assets; official URLs editions refs and SHA-256 frozen        |
| Local Art CSV                           | `8392fcd78eca324abd6d6e7a6ba82be9468b6c7764226376c66c669e7eaf54d1` | 40 rows; all selected asset hashes matched                                 |
| Local report                            | `be37d6234645d32c6041cc499e209d17882c0cfdbc4e7585490b5f454e59eb86` | completed before Gemini conclusions                                        |
| Gemini request                          | `d3c0fca493e2242beeb3fa99cfdc6962329fd3dd329bba78e1570d444f8b1b33` | exact independent frozen input                                             |
| Gemini response                         | `87b7a3f03e09e07907d3f187864b084fddf2306eac73fd1a05c185efa2162cae` | exact model; outer SUCCESS; 33/33 hashes and per-file pixel cues           |
| Gemini execution ledger                 | `b7dfc0ecf3cef264d0f22b06ea87e064437233c478b3fd1299e926d1fce8fd85` | failed attempts excluded and one exact successful reviewer run counted     |
| Daybreak Blue supplemental verification | `b0df3e746c764ae937dc8c2f8200338084bb204f5d58f720a363847fc6aae30f` | independent hash and pixel verification; not a human or quorum replacement |

The counted Gemini run resolved exact model `gemini-3.7-flash-high`, effort
`high`, matched every frozen input and asset hash, returned every required cell,
and ended with outer `SUCCESS`. Local conclusions were hidden from Gemini.
Muse is `NOT_USED`. Cursor Grok is `ART_ABSTAIN` because it did not prove pixel
access. Daybreak Blue supplied an additional independent pixel check, but Pass C
still applies the dictionary and evidence directly rather than taking a vote.

## Readability correction

Original-detail reinspection found that all six downloaded `惑星のさみだれ`
assets are permuted page-tile payloads, not readable reconstructed pages. The
preflight proposal therefore fails the explicit six-readable-page prerequisite.
Neither the Local values nor the Gemini values for that work are counted as
eligible Art judgments. All four axes close `unknown`; this is not a promotion
blocker. The official URL, six frozen asset hashes, and failure mode remain
recorded so a later browser-rendered official capture can retry the work without
restarting identity research.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work               | Local     | Gemini    | Final     | Dictionary and pixel decision                                                                                                                           |
| ------------------ | --------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| となりの怪物くん   | `2/2/3/U` | `2/2/3/U` | `2/2/3/U` | Both reviewers independently matched the three static values; sampled gestures do not open motion.                                                      |
| 失恋ショコラティエ | `3/2/3/U` | `2/2/3/U` | `2/2/3/U` | Elongated figures and expressive faces remain ordinary stylization; realistic confectionery and interiors do not make realism predominant.              |
| シルバーマウンテン | `3/3/1/U` | `2/3/1/U` | `2/3/1/U` | Grounded period props coexist with enlarged child eyes and caricatured adult faces, so the balanced realism anchor is retained.                         |
| 惑星のさみだれ     | `1/3/1/U` | `2/2/2/U` | `U/U/U/U` | The six frozen assets are permuted page tiles and fail the readable-page gate; fragment impressions cannot be promoted to page-level values.            |
| 終末のワルキューレ | `3/3/2/U` | `3/4/0/U` | `3/3/2/U` | Open figure and caption fields prevent density 4, while polished color pages and curved drapery prevent sustained roughness 0 across all contexts.      |
| アオイホノオ       | `2/3/1/U` | `2/3/1/U` | `2/3/1/U` | Both reviewers independently matched the static values; dramatic posturing is not a bounded motion sequence.                                            |
| ねこだらけ         | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The exact standard collected-volume product exposes zero eligible internal pages, so every Art axis closes unknown.                                     |
| 路地恋花           | `3/2/3/U` | `2/2/3/U` | `3/2/3/U` | Mature anatomy, hands, materials, books, and tools retain observed scale beyond ordinary stylization without approaching full realism.                  |
| 日々ロック         | `2/2/1/U` | `2/3/1/U` | `2/2/1/U` | Dense performance hatching alternates with open street, school, portrait, and black fields, so density does not stay above balanced across contexts.    |
| 海獣の子供         | `4/3/2/2` | `4/4/3/2` | `4/3/2/2` | Open sky, water, and gym fields prevent density 4; granular marine texture and hard gym contours balance organic softness; exact motion refs support 2. |

## Endpoint and count resolution

`海獣の子供` retains `artRealism=4` because realistic anatomy, body weight,
marine organisms, rigging, and depth persist across all three contexts. Its
bounded gym sequence is the only exact start-development-contact-fall-resolved
endpoint set, so it retains `motionImpact=2`. No other work opens motion.

The final matrix contains 25 known and 15 unknown cells. No Art unknown became a
blocker. No value was averaged, and no temporary image, source row, generated
artifact, recommendation formula, validator, Factor Dictionary, or Gold value
was changed.
