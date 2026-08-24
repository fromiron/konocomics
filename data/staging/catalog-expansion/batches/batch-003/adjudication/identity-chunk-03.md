# Batch 003 chunk 03 identity adjudication

- adjudicationDate: 2026-08-23
- adjudicator: Local Codex
- reviewedByHuman: `false`
- inputReview: `../reviews/identity-safety-chunk-03.md`
- hardBlockers: 0
- sourceMutations: 0

## Decisions

| workId                      | Decision                                                                                                                                                                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `work-7a4e7ba45413e1b8af34` | Retain canonical Work `青空エール` and original paper standard-volume ISBN `9784088463667`. Treat the 2012 electronic remaster as a related Evidence edition; do not transfer its pagination or edition-specific visual material without an explicit bridge.                                                                 |
| `work-84a6a139c55f2760544e` | Retain canonical Work `僕の心のヤバイやつ` and standard volume-1 ISBN `9784253226158`. Keep standard volume 3 and its separately identified special edition distinct; neither changes or replaces the representative volume-1 mapping.                                                                                       |
| `work-a4ca6e21e97927928e1a` | Retain canonical Work `喰う寝るふたり住むふたり`, original standard-volume ISBN `9784199801198`, and current source publisher metadata. The current Coamix `z_R0017` record bridges the original series; the spaced display title and 2021 new edition do not create a duplicate Work or replace the representative edition. |

The remaining seven works pass without adjudicated metadata changes. All ten representative ISBN-13 values pass checksum validation, are standard editions rather than special, limited, set, or new editions, and occur once each in `data/source/volumes.csv`. The special and new-edition products discussed above have different identities and are not representative rows. No Work ID, exact canonical title, or scoped ISBN collision was found.

Only `青空エール` retains a page-level edition limitation because no official original-paper-to-remaster equivalence bridge was found. The explicit standard/special split for `僕の心のヤバイやつ` and original/new-edition split for `喰う寝るふたり住むふたり` resolve those leads without a hard blocker.

No nationality conclusion is inferred from Rakuten, and no nationality test is added. This adjudication changes no source row, title, Factor, Genre, Theme, Art value, registry status, eligibility, recommendation data, or Gold data. `『』` is absent from canonical titles and remains a delimiter when an external page uses it as a wrapper.
