# Batch 004 identity and safety QA

- reviewDate: 2026-08-25
- reviewer: Luna independent static audit
- reviewedByHuman: `false`
- inputs: `frozen-work-set.csv`, batch-local `source/works.csv`, `source/volumes.csv`, `provenance/canonical-mapping.csv`, `provenance/safety-review.csv`, `provenance/rakuten-matches.csv`, and `reviews/identity-safety-chunk-01.md` through `identity-safety-chunk-05.md`
- sourceMutation: none

## Result

The batch-local identity, representative-edition, provenance, safety, and eligibility fields are internally consistent for all 50 frozen works. No hard identity, duplicate, adult-only, webtoon, or safety blocker was found in the supplied inputs. No work is incorrectly marked recommendation-eligible: all 50 remain `libraryOnly=true`, `recommendationEligible=false`, and `onboardingEligible=false`.

This is a static QA result. It does not promote any work and does not independently verify paths outside the supplied batch-local inputs. The existing chunk reviews refer in places to `data/source/*` and `promotion-registry.csv`; those external claims were not treated as evidence in this audit.

## Coverage and review-document checks

| Check | Result |
| --- | ---: |
| Frozen works | 50 |
| Batch source works | 50 |
| Batch representative volume rows | 50 |
| Safety rows | 50 |
| Rakuten match rows | 50 |
| Included canonical mappings | 50 |
| Duplicate source mappings | 65 |
| Review summary/table rows | 50/50 |
| Review work IDs matched to frozen set | 50/50 |
| Review titles matched to frozen set | 50/50 |
| `reviewedByHuman=false` in all five reviews | 5/5 |
| Decorative `『`/`』` in frozen or source canonical titles | 0 |

All five review files cover disjoint ranges 1–10, 11–20, 21–30, 31–40, and 41–50. Chunk 03 has no separate `###` per-work headings, but its ten summary rows and ten corresponding official-evidence bullets provide 10/10 position coverage; this is a documentation-format warning, not an identity mismatch.

## Identity, edition, and provenance

- Every frozen `workId` occurs exactly once in batch `source/works.csv`, with an exact canonical-title match.
- Every representative volume row has `isRepresentative=true`, `editionKind=standard`, and a valid unique ISBN-13. ISBN duplicate count: 0. Checksum failures: 0.
- Rakuten rows are 50/50 `matched`, `standard`, and representative; each ISBN matches the batch representative ISBN.
- Canonical mappings are 50 `included` plus 65 source-level `duplicate` mappings. Every mapping points to the expected `candidate-*` and `work-*` pair, and every canonical title matches the frozen title.
- The six blank `volumeNumber` values are single-volume/one-shot exceptions recorded in the review material: positions 20, 25, 26, 29, 38, and 46. The other 44 representatives use volume 1.
- No duplicate canonical title occurs within the frozen batch, and no representative ISBN is shared by two works.
- No `『` or `』` remains in `frozen-work-set.csv`, `source/works.csv`, or `canonical-mapping.csv` canonical titles.

## Scope and safety

| Field/check | Count |
| --- | ---: |
| `safetyStatus=safe` | 50 |
| `safetyStatus=unknown` | 0 |
| adult/R18 status in safety rows | 0 |
| webtoon/vertical-scroll status in supplied rows | 0 |
| unresolved canonical mapping rows | 0 |
| alternate-work duplicate rows | 0 observed |
| source-level duplicate mappings | 65, all resolved to the same Work as their included mapping |

The review documents mention one unresolved raw source occurrence, `tsugimanga-2019-web-005`, for position 27 (`work-7d4568dcc8e9175d35ba`, `異世界おじさん`). It has no batch candidate/work mapping and is explicitly excluded from identity/format evidence; it is therefore a provenance note, not a duplicate or promotion-eligibility error for the canonical Work.

Sensitive-content notes in the reviews (violence, death, minor/adult relationship premises, self-harm, illness, or extreme eating) are not adult-only classifications. They do not change the batch safety status, but should remain available to the later content-context review.

## Unknown and eligibility audit

- `source/works.csv status=unknown`: 50/50, positions 1–50. This is unresolved work metadata, not a safety approval. It is not mis-marked as promotable because all 50 have `recommendationEligible=false` and `onboardingEligible=false`.
- `demographic=unknown`: 9 works, also not promotable:
  - position 10 — `work-1cdc6c5cca7c33fafe51` — 青空にとおく酒浸り
  - position 13 — `work-2c4fe00df5255fc082f9` — ヒーローカンパニー
  - position 17 — `work-3713ab561de583d709bc` — アリスと蔵六
  - position 24 — `work-65f856a6fa2078f21d2f` — 黒月のイェルクナハト
  - position 27 — `work-7d4568dcc8e9175d35ba` — 異世界おじさん
  - position 29 — `work-80a2f62ce5073ade2ec2` — 式の前日
  - position 30 — `work-8733067e6afcaeadbd8d` — さんすくみ
  - position 33 — `work-9bd00739b995d84e2494` — あした死ぬには、
  - position 39 — `work-c2f3864045578cebb590` — となりの猫と恋知らず
- All 50 have `factorScope=entry_1_3_volumes`, `libraryOnly=true`, and false recommendation/onboarding eligibility. No unknown value is being used as a positive recommendation signal in these inputs.

## Work-level findings

| Severity | Work IDs | Finding |
| --- | --- | --- |
| hard blocker | none | No supplied identity/safety/edition condition requires blocking a work. |
| follow-up metadata | positions 1–50 | `status=unknown` remains on every pre-promotion source row; resolve in the promotion annotation pipeline before eligibility changes. |
| follow-up metadata | positions 10, 13, 17, 24, 27, 29, 30, 33, 39 | `demographic=unknown`; not a current promotion error because eligibility is false. |
| provenance note | position 27 / `work-7d4568dcc8e9175d35ba` | Unresolved web-list raw occurrence is unmapped and explicitly not used as format evidence. |
| documentation format | positions 21–30 | Chunk 03 uses table/evidence bullets instead of ten `###` blocks; coverage remains 10/10. |

## QA disposition

`PASS_WITH_FOLLOW_UP`: the frozen batch is safe to continue into annotation/review processing, but it must not be promoted from these files until the ordinary promotion gates resolve the 50 unknown work-status fields and the nine unknown demographic fields where the product contract requires them. No source or review file was changed except this QA report.
