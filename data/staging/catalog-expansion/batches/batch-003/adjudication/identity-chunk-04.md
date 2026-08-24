# Batch 003 chunk 04 identity adjudication

- adjudicationDate: 2026-08-24
- adjudicator: Local Codex
- reviewedByHuman: `false`
- inputReview: `../reviews/identity-safety-chunk-04.md`
- hardBlockers: 0
- sourceMutations: 0

## Decision

All ten frozen Works retain their current canonical Work ID, exact title, and representative standard ISBN. Every ISBN-13 passes checksum validation, has one representative row, and occurs once in `data/source/volumes.csv`; every scoped Work ID and exact title occurs once in `data/source/works.csv`.

The only Cursor Grok identity conflict is closed for `work-ae0ac8a5acfc5fbb7dd6` (`終末のワルキューレ`). The original volume-1 ISBN `9784199804953` belongs to the original ノース・スターズ・ピクチャーズ edition. Coamix's official merger notice establishes that ノース・スターズ・ピクチャーズ merged into surviving Coamix on 2020-04-01 and that the publishing and rights-management business continued there. The current Coamix `z_R0123` record therefore provides a valid original-series rightsholder bridge. The separately cataloged full-color vertical remake remains excluded and supplies no Evidence to the frozen original.

The remaining nine Works pass without adjudicated metadata changes. Paper/electronic format bridges for the original 小学館 and 集英社 volumes do not create duplicate Works, while later collector, special, or remake products remain excluded from representative identity and page transfer.

No nationality conclusion is inferred from Rakuten, and no nationality test is added. This adjudication changes no source row, title, Factor, Genre, Theme, Art value, registry status, eligibility, recommendation data, or Gold data. `『』` is absent from canonical titles and remains a delimiter when an external page uses it as a wrapper.
