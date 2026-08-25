# Batch 004 position 42 final blocker adjudication — モテキ

## Scope and attestation

- Work: frozen position `42`, `work-d63a83030a8819ff553c`, モテキ.
- Adjudication date: `2026-08-25`.
- Candidate binding: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- `reviewedByHuman=false`.
- This review changes no code, CSV, terminal cell, overlay/config, status, Factor Dictionary, promotion registry, or generated catalog. It authorizes no promotion or commit.

## Final decision

Position 42 is terminal **`promotionBlocked`** with two independent existing hard blockers:

1. `FACTOR_MODEL_INCOMPATIBLE` for the mandatory Theme gap.
2. `SOURCE_INFORMATION_UNAVAILABLE` for the residual Narrative coverage gap.

The registry representation must therefore be exactly:

```text
FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE
```

This is not a pending state. No terminal Factor, Genre, Theme, or Art cell changes are authorized.

The round-2 conclusion that the exact official route is exhausted while both blocker codes remain false is contradictory. An open reader proves that a delivery route exists; it does not prove that usable evidence for every required Factor exists. Conversely, the Theme problem is not source scarcity: after the exact entry route was reviewed, the work's directly established organizing material is romance/relationship drama, which the frozen model represents as Genre `romance` and Axis `romance`, not as any of the 22 Theme IDs. The two failures therefore require two codes rather than one generic code.

## Verified evidence and gate math

The three Kodansha product pages currently expose working product-linked trials. A fresh Playwright recheck reproduced the following official title/edition routes and `200` reader/content responses:

- [Volume 1 product](https://www.kodansha.co.jp/comic/products/0000038652) → [Volume 1 reader](https://www.kodansha.co.jp/comic/products/0000038652/trial/reader?cid=c0763b2579d9e896920219c4d854ef772bf50f7a608e6025915e1993e353c741), ISBN `9784063522594`.
- [Volume 2 product](https://www.kodansha.co.jp/comic/products/0000038671) → [Volume 2 reader](https://www.kodansha.co.jp/comic/products/0000038671/trial/reader?cid=8cdd4ca88ce8ab5bf278007c8e3ef57b5135c241863b3b2c7bac1b50b2308796), ISBN `9784063522785`.
- [Volume 3 product](https://www.kodansha.co.jp/comic/products/0000038689) → [Volume 3 reader](https://www.kodansha.co.jp/comic/products/0000038689/trial/reader?cid=7787a82b401e15ae2fa516cb673d3bc0d8c62aa9e4d10bc6b6f31a7343d31b65), ISBN `9784063522969`.

The round-2 render hashes for all five listed volume-2 composites and all five listed volume-3 body composites recompute exactly. Direct inspection confirms the recorded boundary: volume 2 contains no usable sequential narrative body sample; volume 3 shows relationship discussion, ordinary urban space, and an office/workroom visit, but no repeated workplace-centered problem/goal structure and no direct anchor for `progression`, `problemSolving`, `strategy`, `mysteryReveal`, or `worldBuilding`. The original volume-1 official body pages and the prior Rakuten/Cmoa/BookLive recovery remain consistent with the already accepted Genre, pacing, and Tone values. Grok independently returned Theme none, only `pacing` known in Narrative, and outcome `insufficient-evidence` (`reviews/grok-text-review-response-chunk-05.txt:21-55,97-116`).

The unchanged terminal rows produce:

| Group | Terminal state | Gate | Result | Exact deficiency |
| --- | --- | --- | --- | --- |
| Genre | `romance` | at least one | pass | none |
| Theme | no row | at least one | fail | `+1` supported Theme |
| Narrative | only `pacing=2` known | `>=0.60` | `1/6 = 0.1667`, fail | `+3` known axes |
| Tone | five known | `>=0.60` | `5/7 = 0.7143`, pass | none |
| Art | `artRealism=4`, `artDensity=4`, `visualSoftness=2`; `motionImpact=unknown` | `>=0.30` | `3/4 = 0.7500`, pass | none |

No `notApplicable` value changes a denominator. Narrative needs `ceil(6 × 0.60) = 4` known axes, hence exactly three more. The Theme promotion gate is non-empty, hence exactly one Theme is required. This independently reproduces `Theme +1` and `Narrative +3`.

## Blocker 1 — mandatory Theme/model conflict

`FACTOR_MODEL_INCOMPATIBLE` is established for the Theme failure. The Dictionary contains Genre `romance` and Tone Axis `romance`, but no romance/relationship Theme (`docs/factors/factor-dictionary.md:40-66`). The official entry evidence establishes romance and relationships as the work's organizing material. The only superficially plausible existing Theme, `workplace`, is an ordinary setting in one volume-1 flashback and one volume-3 visit; it does not satisfy centrality `1` as an active episode/sub-material, much less centrality `2`. The round-2 review also found no support for any other Theme ID (`research/text-gap-recovery-position-42-round-2.md:28-38`). Adding one would be quota filling.

Use this exact blocker record content:

```text
blockerCode=FACTOR_MODEL_INCOMPATIBLE
blockerDetails=The frozen promotion contract requires at least one Dictionary Theme, but the exhausted official volume 1–3 entry review establishes central romance and relationship material only, represented by Genre romance and Axis romance rather than any of the 22 Theme IDs. workplace is only a setting and every existing Theme ID is unsupported. Adding a weak Theme would fill a quota, so the current Factor Dictionary cannot model this work responsibly while satisfying Theme 1/1.
recheckPath=Recheck only if the Factor Dictionary or mandatory non-empty Theme promotion gate changes, or if new direct official volume 1–3 evidence establishes an existing Theme at centrality 1 or 2.
```

## Blocker 2 — residual Narrative evidence unavailable

`SOURCE_INFORMATION_UNAVAILABLE` is established only for the Narrative failure. The code definition is “Usable work or Factor evidence is not available” (`scripts/build-promotion-registry.ts:78-92`), not “no source URL opens.” Original research, bounded review recovery, the existing volume-1 body packet, and the newly exhausted volume-2/3 trials still leave five Narrative cells unknown. Volume 2 provides no sequential body evidence; volumes 1 and 3 do not affirm a `0/2/4` anchor for any of those five cells. The remaining `+3` cannot be filled truthfully from the exhausted packet.

Use this exact blocker record content:

```text
blockerCode=SOURCE_INFORMATION_UNAVAILABLE
blockerDetails=The bounded official-first volume 1–3 route and eligible entry-review recovery are exhausted. Narrative remains 1/6=0.167 below 0.600: only pacing is known, while progression, problemSolving, strategy, mysteryReveal, and worldBuilding remain unknown. The inspected material does not affirm any additional 0/2/4 anchor, so usable Factor evidence for the required +3 Narrative cells is unavailable. Unknown is not a low value and no value was filled to meet a quota.
recheckPath=Provide new direct volume 1–3 evidence that truthfully establishes at least three of progression, problemSolving, strategy, mysteryReveal, and worldBuilding; otherwise recheck only if the frozen Narrative coverage contract changes.
```

Generic `SOURCE_INFORMATION_UNAVAILABLE` is therefore **not accurate for all remaining gaps**. It accurately names the Narrative evidence gap, but it would misdescribe the Theme/model conflict.

## Required compound representation

The global blocker model already permits more than one blocker row per work: `buildPromotionRegistry` groups all blocker rows, sorts them, joins codes with `;`, and joins details with ` | ` (`scripts/build-promotion-registry.ts:380,475-479,545-546`). The Batch 004 overlay generator does not currently expose that capability: it chooses one `blockerCode` per deficient work and emits one blocker row (`scripts/catalog/promotion-overlay.ts:679-740`), then asserts `blockers.length + verifiedIds.length === targetWorkCount` (`scripts/catalog/promotion-overlay.ts:899-910`). A single override must not compress this case.

The truthful future overlay is:

- one decision row with `blockerCode=FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE` and the two exact details above joined in that code order with ` | `;
- two `promotion-blockers` rows for this work, one per code, each retaining its own exact details and recheck path;
- cardinality checked by unique blocked work IDs, not raw blocker-row count.

No new blocker code is needed. The existing compound-capable registry model should be used; the one-row Batch overlay emission is the narrow incompatibility to fix in a separately authorized implementation.

## Evidence-ledger correction before binding

Round 2's volume-1 line misbinds `output/playwright/moteki-v1-hash19.png` SHA-256 `347cd7ccb2d7fae70660d5c81c215ccc5b79650624097e4b98ca6c4a09fd3ee4` to `reader-page-19`. Direct inspection shows that file is a duplicated volume-1 cover, not the office page. The actual existing `reader-page-19` file was independently found in both preflight/Gemini temporary sets, visually shows the office flashback, and recomputes to the frozen preflight hash `3fb6e7c153aee5e862f35fd7a7fa1ec6113c60a337fe0fa8127cca503259efec` (`art-preflight/chunk-05/preflight.csv:3`; `art-review/chunk-05/gemini-response.md:42-47`).

This is a round-2 provenance defect that must be corrected before any combined packet hash is bound. It does not change the final blocker result: the real volume-1 office page exists, and together with the verified volume-3 office pages still supports only “workplace setting,” not a Dictionary Theme.

## Final attestation

`reviewedByHuman=false`; final state **`promotionBlocked`**; final codes **`FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE`**; terminal cells unchanged; data/status/config/CSV/code/commit unchanged.
