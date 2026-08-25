# Batch 004 position 42 blocker adjudication — モテキ

## Scope and attestation

- Work: frozen position `42`, `work-d63a83030a8819ff553c`, モテキ only.
- Adjudication date: `2026-08-25`.
- Reviewer: Daybreak product-contract adjudication.
- `reviewedByHuman=false`.
- This document changes no Factor Dictionary entry, threshold, formula, validator, annotation, source row, promotion status, or generated catalog. It authorizes no promotion and no commit.

## Decision

**No permitted final hard blocker is established on the current packet. The existing `FACTOR_MODEL_INCOMPATIBLE` override is wrong and must not be treated as an adjudicated result.**

`SOURCE_INFORMATION_UNAVAILABLE` is also false at this point. The packet contains usable entry evidence, the official volume-1 internal reader was already accessed, and the official Kodansha product pages expose still-unreviewed volume-2 and volume-3 `試し読み` routes. The correct product-contract conclusion is therefore **bounded evidence re-adjudication required, with current data and status unchanged**. This phrase is a review disposition, not a new registry status or blocker code.

The current work is not promotion-ready. It still fails the unchanged Theme and Narrative gates. The conclusion above means only that those failures cannot yet be truthfully converted into a final hard blocker.

## Controlling contract

1. The Product Spec says that `unknown` is not a low taste value, Factor scope is the first 1–3 volumes, insufficient data must not produce high-confidence recommendation, and expansion works remain outside recommendation until the approved annotation gate (`docs/planning/02-product-spec.md:28-40,63-70`).
2. The same SSOT defines the recommendation eligibility filter and the fixed coverage treatment: Genre `0.80`, Theme `0.60`, Narrative `0.60`, Tone `0.60`, Art `0.30`, with no weight redistribution (`docs/planning/02-product-spec.md:293-320`).
3. The Factor Dictionary deliberately separates Genre, Theme, and Axis. `romance` is a Genre and a Tone Axis; it is not one of the 22 Theme IDs. Theme centrality `1` means an episode/sub-material and `2` means a repeated core structure (`docs/factors/factor-dictionary.md:40-67`). Narrative has exactly six axes and Tone has exactly seven (`docs/factors/factor-dictionary.md:74-104`).
4. `known 0`, `unknown`, and `notApplicable` have different meanings. Silence or incomplete access cannot be converted to zero, and `notApplicable` is limited to a conditional axis (`docs/factors/factor-dictionary.md:19-38`). The G1 acceptance contract likewise forbids relabeling insufficient Art evidence to evade coverage (`docs/planning/07-acceptance-test-plan.md:89-95`).
5. The promotion method requires narrow additional official/review research while qualifying material remains, then permits only a supported value, terminal `unknown`, more research, promotion, or an existing hard blocker (`docs/catalog-expansion/01-promotion-method.md:7-15`; `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md:35-39`).

Runtime pairwise Theme coverage and the promotion completeness gate are related but not identical. For a candidate work, the current promotion builder requires at least one Genre and at least one Theme in addition to the numeric Narrative/Tone/Art thresholds (`scripts/build-promotion-registry.ts:201-238`; `scripts/catalog/promotion-overlay.ts:669-688`). The Daybreak terminal table therefore expresses the single-work text minimums as Genre `1/1`, Theme `1/1`, Narrative `4/6`, and Tone `5/7` (`data/staging/catalog-expansion/batches/batch-004/reviews/daybreak-text-adjudication.md:14-24`).

## Frozen terminal evidence and gap math

The terminal chunk-05 artifacts currently say:

- Genre: `romance`, one non-empty Genre (`data/staging/catalog-expansion/batches/batch-004/adjudication/genres-final-chunk-05.csv:1-3`).
- Theme: no row for this work (`data/staging/catalog-expansion/batches/batch-004/adjudication/themes-final-chunk-05.csv:1-17`).
- Narrative: only `pacing=known 2`; the other five axes are `unknown` (`data/staging/catalog-expansion/batches/batch-004/adjudication/text-final-chunk-05.csv:19-24`).
- Tone: `characterArcWeight=2`, `relationshipStructure=2`, `comedy=2`, `mentalStress=2`, and `romance=4` are known; `darkness` and `emotionalWarmth` are unknown (`data/staging/catalog-expansion/batches/batch-004/adjudication/text-final-chunk-05.csv:25-31`).
- Art: `artRealism=4`, `artDensity=4`, `visualSoftness=2` are known and `motionImpact` is unknown (`data/staging/catalog-expansion/batches/batch-004/art-review/chunk-05/final-art.csv:6-9`).

| Group | Current | Required | Result | Minimum gap |
| --- | ---: | ---: | --- | ---: |
| Genre | `1` | at least `1` | pass | `0` |
| Theme | `0` | at least `1` | fail | `+1` supported Theme |
| Narrative | `1/6 = 0.1667` | `>=0.60`, therefore at least `4/6` | fail | `+3` known axes |
| Tone | `5/7 = 0.7143` | `>=0.60`, therefore at least `5/7` | pass | `0` |
| Art | `3/4 = 0.7500` | `>=0.30`, therefore at least `2/4` | pass | `0` |

No `notApplicable` row changes these denominators. The exact remaining promotion deficiency is therefore **Theme `+1` and Narrative `+3`**, not a Tone, Art, Genre, identity, safety, or ISBN failure. Daybreak recorded the same `1/1 · 0/1 · 1/6 · 5/7` text result, withdrew the old source blocker, and raised `FACTOR_MODEL_INCOMPATIBLE` only as a candidate pending this explicit adjudication (`data/staging/catalog-expansion/batches/batch-004/reviews/daybreak-text-adjudication.md:70-72,135-141`).

## Evidence already established

The original research packet records exact Kodansha volume 1–3 product pages and limits them to contents/identity support rather than inventing values from chapter titles (`data/staging/catalog-expansion/batches/batch-004/research/chunk-05.md:98-165`):

- [Kodansha モテキ 1](https://www.kodansha.co.jp/comic/products/0000038652), published `2009-03-23`.
- [Kodansha モテキ 2](https://www.kodansha.co.jp/comic/products/0000038671), published `2009-08-21`.
- [Kodansha モテキ 3](https://www.kodansha.co.jp/comic/products/0000038689), published `2010-01-22`.

The bounded recovery then found usable content evidence rather than a source vacuum (`data/staging/catalog-expansion/batches/batch-004/research/text-gap-recovery-chunk-05.md:50-84`):

- [Rakuten Books volume-1 content/reviews](https://books.rakuten.co.jp/rb/5996532/?l-id=review-txt-book).
- [Comic Cmoa volume-1 page](https://www.cmoa.jp/title/41230/), including the dated review used by the packet.
- [BookLive volume-1 reviews](https://booklive.jp/review/list/title_id/39130/vol_no/001).

That recovery produced the currently accepted Genre, pacing, and five Tone values but explicitly proposed no Theme. Independent QA accepted those cells and stated that the bounded results make `SOURCE_INFORMATION_UNAVAILABLE` false (`data/staging/catalog-expansion/batches/batch-004/reviews/daybreak-text-recovery-qa-chunks-04-05.md:142-154`).

Cursor Grok's valid read-only Pass B also returned Theme none and only one known Narrative axis, while passing identity, safety, and representative ISBN. Its outcome was `insufficient-evidence`, not model or product incompatibility (`data/staging/catalog-expansion/batches/batch-004/reviews/grok-text-review-request-chunk-05.md:1-16,43-69`; `data/staging/catalog-expansion/batches/batch-004/reviews/grok-text-review-ledger-chunk-05.md:1-27`; `data/staging/catalog-expansion/batches/batch-004/reviews/grok-text-review-response-chunk-05.txt:21-55,82-116`).

## Why each blocker alternative is rejected now

### `FACTOR_MODEL_INCOMPATIBLE` — rejected as the current final code

The blocker means that the current Factor Dictionary cannot model the work responsibly (`scripts/build-promotion-registry.ts:78-109`). That has not been shown:

- The Dictionary already represents the work's central romance as Genre `romance` and Axis `romance=4`. Absence of a duplicate romance Theme is the intended Genre/Theme/Axis separation, not by itself a model defect.
- The Theme review has not exhausted direct internal-page evidence. The frozen official volume-1 sample includes an office flashback at `reader-page-19`; the archived pixel ledger describes the former coworker approaching the protagonist in an open-plan office (`data/staging/catalog-expansion/batches/batch-004/art-review/chunk-05/gemini-response.md:42-47`). That does **not** authorize `workplace:1`, because the cited Gemini run was Art-scoped. It does establish a concrete official page that a separate non-Art Theme reviewer has not yet adjudicated against centrality `1`.
- The current recovery's statement that a dispatch-worker fact alone does not make `workplace` central is sound against centrality `2`, but does not resolve whether the direct office episode is an active sub-material at centrality `1` (`data/staging/catalog-expansion/batches/batch-004/research/text-gap-recovery-chunk-05.md:72-82`).

Only if the bounded direct-page review rejects every existing Theme ID, while the non-empty Theme gate remains mandatory, may `FACTOR_MODEL_INCOMPATIBLE` be reconsidered for the Theme gap. No weak Theme may be added to satisfy a quota.

### `SOURCE_INFORMATION_UNAVAILABLE` — rejected now

The blocker means usable work or Factor evidence is unavailable (`scripts/build-promotion-registry.ts:78-109`). Usable evidence already exists, and an exact official route remains unreviewed. On `2026-08-25`, each Kodansha product HTML exposed an enabled `試し読み` link:

- [Volume 1 official trial](https://www.kodansha.co.jp/comic/products/0000038652/trial)
- [Volume 2 official trial](https://www.kodansha.co.jp/comic/products/0000038671/trial)
- [Volume 3 official trial](https://www.kodansha.co.jp/comic/products/0000038689/trial)

Volume 1 was already edition-mapped to frozen ISBN `9784063522594`; its official reader supplied six retained body pages (`data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-05/preflight.csv:1-3`; `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-05/ledger.md:23-52`). Volumes 2 and 3 were recorded only as product/contents sources in the text packet; their trial pages were not inspected for Narrative or Theme.

The generic overlay text would currently claim `Finite official-first routes exhausted` for every deficiency, even when a code override is supplied (`scripts/catalog/promotion-overlay.ts:679-688`). Combined with the position-42 override in `scripts/build-batch-004-overlay.ts:10-25`, it would emit a `FACTOR_MODEL_INCOMPATIBLE` code alongside a source-exhaustion detail that is factually unreproducible. This is an additional reason the existing override is wrong.

### Other permitted codes — rejected

- `PRODUCT_CONTRACT_INCOMPATIBLE`: モテキ is a canonical Japanese manga in an explicitly included adjacent romance/comedy Catalog area; the product contract is not fundamentally incompatible (`docs/planning/02-product-spec.md:63-70`).
- `IDENTITY_UNRESOLVED`, `SAFETY_UNRESOLVED`, `NON_JAPANESE`, `NON_MANGA`, `FAN_WORK`, `NON_WORK_MATERIAL`, `DUPLICATE_WORK`, `VERTICAL_WEBTOON`, and `ADULT_CONTENT`: no cited packet evidence supports them. Grok passed canonical title, safety, and representative ISBN `9784063522594`, and Daybreak preserved those results.

## Bounded recheck path

No open-ended search is required. Recheck only the following finite route, preserving `reviewedByHuman=false` unless a person actually reviews it:

1. Reopen the exact official Kodansha volume-1 trial and inspect the mapped body-page sequence, including the already frozen `reader-page-19`, in a **non-Art Theme review**. Decide only whether the office encounter actively functions as `workplace:1`; reject it if it is merely background. Do not inherit the Art review's prose as a Theme verdict.
2. Open the official volume-2 and volume-3 trial links above. Record exact edition/ISBN mapping, readable page refs, source date/retrieval date, and page hashes for any page used. Review only the residual Narrative axes `progression`, `problemSolving`, `strategy`, `mysteryReveal`, and `worldBuilding`, plus the residual Theme question, within volumes 1–3.
3. A Narrative value may become known, including known `0`, only when the inspected entry material affirmatively matches the Dictionary anchor. Absence from a short sample remains `unknown`. At least three additional Narrative axes must be supported to reach `4/6`; no particular three are pre-authorized.
4. Run an independent non-Art review and Daybreak Pass C on only the proposed cells. Do not average, infer an Axis from Genre, or add a weak Theme to satisfy the gate.
5. Recalculate all five gates unchanged:
   - Theme accepted and Narrative reaches `4/6`: no blocker from this adjudication.
   - Theme accepted but the exact Narrative routes are exhausted below `4/6`: `SOURCE_INFORMATION_UNAVAILABLE` may be established for the remaining Narrative evidence gap, with the attempted pages and rejected cells listed.
   - Narrative passes but every Dictionary Theme is directly reviewed and rejected: `FACTOR_MODEL_INCOMPATIBLE` may be established for the mandatory non-empty Theme conflict.
   - Both gaps remain after the exact routes are exhausted: record both independent reasons through the existing blocker model rather than mislabeling source scarcity as model incompatibility. Do not silently compress them into the current single override.

## Reproduction

The remaining official trial route can be reproduced without changing repository data:

```bash
for id in 0000038652 0000038671 0000038689; do
  curl -L --compressed -A 'Mozilla/5.0' -sS \
    "https://www.kodansha.co.jp/comic/products/$id" \
    | rg -o "https://www.kodansha.co.jp/comic/products/$id/trial" \
    | head -n 1
done
```

Observed on `2026-08-25`:

```text
https://www.kodansha.co.jp/comic/products/0000038652/trial
https://www.kodansha.co.jp/comic/products/0000038671/trial
https://www.kodansha.co.jp/comic/products/0000038689/trial
```

Final attestation: `reviewedByHuman=false`; final hard blocker **not established**; existing `FACTOR_MODEL_INCOMPATIBLE` override **wrong**; data/status/promotion/commit **unchanged**.
