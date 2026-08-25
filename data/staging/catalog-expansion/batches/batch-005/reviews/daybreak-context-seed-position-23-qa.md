# Batch 005 context seed independent QA — position 23

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- reviewedByHuman: `false`
- scope: `research/context-seed-position-23.csv` and `.md` only
- result: **PASS**

## Recomputed result

| Position | Work | catalogRole | seriesGroupId | volumeCount | Work status | reviewAverage | reviewCount |
| -------: | ---- | ----------- | ------------- | ----------: | ----------- | ------------: | ----------: |
| 23 | 千年万年りんごの子 | bridge | _(blank)_ | 3 | `completed` | 4.07 | 47 |

The frozen identity, recommendation-context values, official volume and status
evidence, exact-ISBN market snapshot, Art refs, three Art contexts, motion
boundary, and corrected Art review-chain provenance all pass.

## Findings

### 1. Frozen identity and representative volume — PASS

- Frozen position `23` is exactly `work-43ebf010a490cfd4bb50`,
  `千年万年りんごの子`.
- Batch 005 and canonical source volume rows bind this Work to representative
  standard volume 1, ISBN `9784063805789`. The Batch Rakuten match preserves the
  same title, creator 田中 相, standard-edition flag, and ISBN.
- The live 講談社 volume-1 page independently reproduces the title, creator,
  paper release date `2012-07-06`, and ISBN `9784063805789`.
- The canonical title contains neither `『` nor `』`. No electronic edition,
  special edition, set, or related Work was folded into the frozen identity.

### 2. Standard volume count and completion status — PASS

- The live 講談社 title page marks the Work `完結`, identifies the latest book as
  `千年万年りんごの子（３）＜完＞`, and lists `PUBLICATIONS 全3件`.
- The three official standard paper products are volume 1, ISBN
  `9784063805789`, released `2012-07-06`; volume 2, ISBN `9784063806250`,
  released `2013-05-07`; and volume 3, ISBN `9784063806786`, released
  `2014-03-07`. The volume-3 page and description explicitly say `完結`.
- Therefore `volumeCount=3` and `status=completed` are directly supported.
  Electronic records, alternate editions, specials, sets, and related works are
  not counted.

`status` is a Work field, not one of the six recommendation-context fields. The
current Batch 005 and canonical source Work rows still say `unknown`, while the
shared overlay builder spreads `sourceWork` without replacing status. Before
promotion, the permitted Work-overlay path must carry `completed`; otherwise
the `preferCompleted` policy can apply the non-completed penalty incorrectly.

### 3. Exact Rakuten market signal and provenance separation — PASS

The live exact-ISBN search
`https://books.rakuten.co.jp/search?g=001&sitem=9784063805789` returns exactly
one result: paper `千年万年りんごの子（1） （KCx）`, creator 田中 相, ISBN
`9784063805789`, rating `4.07`, `レビュー47件`, and `2012年07月発売` in the
same row. Thus `reviewAverage=4.07`, `reviewCount=47`,
`reviewSourcePublishedAt=2012-07`, and `retrievedAt=2026-08-25` pass.

The CSV and Markdown correctly keep this mutable representative-volume market
snapshot separate from official identity, standard-volume/completion evidence,
Factor evidence, and award/selection provenance. If the exact search later
stops reproducing either market value, blank `reviewAverage` and `reviewCount`
together rather than substituting an electronic edition, another volume, a
set, sales data, or review prose.

### 4. Catalog role and series grouping — PASS

- `catalogRole=bridge` is supported by the terminal profile: `fantasy;romance`,
  `investigation`, strong world-building, mystery reveal, a central married
  relationship, and emotional warmth connect rural-folklore/speculative and
  relationship-oriented taste clusters. This is a diversity role, not a
  popularity inference.
- Blank `seriesGroupId` is correct. No direct sequel or separate canonical Work
  in the frozen set establishes a shared franchise key; the effective key
  remains this `workId`.

### 5. Art refs, contexts, and motion — PASS

- The six seed refs exactly equal the accepted preflight row and every terminal
  `final-art.csv` row for this Work:
  `reader-step-04;reader-step-05;reader-step-06;reader-step-07;reader-step-08;reader-step-09`.
- The three seed context tokens exactly reproduce the accepted preflight
  limitation's bounded groups:
  `mountain or outdoor scenes;domestic interiors;community or family gatherings`.
  The accepted preflight ledger and independent Art review preserve the same
  body-page coverage as outdoor/landscape, temple or domestic conversation,
  and family or wedding-group scenes. Covers, title/contents material,
  advertisements, and synopsis material were excluded.
- `motionReference=none` is correct. Preflight has
  `motionGateAttemptable=false`; terminal `motionImpact` is `unknown`; and no
  exact continuous start/development/impact/resolved sequence was established.
  Ordinary gestures and scene transitions were not promoted to motion evidence.

### 6. Applied Art provenance correction — PASS

The corrected CSV now preserves the complete preflight → independent review →
adjudication → terminal chain in this exact `artSourceFile` value:

```text
data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-03/preflight.csv;data/staging/catalog-expansion/batches/batch-005/art-review/chunk-03/gemini-response.md;data/staging/catalog-expansion/batches/batch-005/art-review/chunk-03/adjudication.md;data/staging/catalog-expansion/batches/batch-005/art-review/chunk-03/final-art.csv
```

The corrected Markdown separately names the accepted preflight and exact
scene-context source, independent Gemini review, final `adjudication.md`, and
terminal `final-art.csv`. All four paths exist and agree with the CSV. The
correction changes provenance naming only, not refs, contexts, motion state,
Art values, or recommendation eligibility.

### 7. Current schema and builder integration prerequisites

Projecting the seed to
`workId,catalogRole,seriesGroupId,volumeCount,reviewAverage,reviewCount` passes
the current `recommendationContextSourceRowSchema`. The research CSV itself is
not directly ingestible by the shared promotion overlay:

- Map `volumeSourceName`, `volumeSourceUrl`, and `volumeSourcePublishedAt` to
  the builder's `sourceName`, `sourceUrl`, and `sourcePublishedAt` research
  fields, while retaining and validating the separate review provenance.
- `scripts/catalog/promotion-overlay.ts` currently hard-codes
  `reviewAverage: ""` and `reviewCount: ""`. Promotion must instead emit the
  validated paired `context.reviewAverage` and `context.reviewCount`, or the
  accepted `4.07` / `47` snapshot will be silently discarded.
- Add the exact accepted context string to the future Batch 005
  `sceneContexts` map if this Work becomes recommendation-verified. No motion
  map entry is needed while motion remains unknown.
- Carry `status=completed` through the permitted Work overlay; it cannot be
  encoded in `recommendation-context-final.csv`.

These are promotion prerequisites, not authorization to change the builder,
source, generated, final-overlay, promotion, or terminal artifacts during this
QA.

## Source checks

- https://www.kodansha.co.jp/titles/1000005956
- https://www.kodansha.co.jp/comic/products/0000046459
- https://www.kodansha.co.jp/comic/products/0000046505
- https://www.kodansha.co.jp/comic/products/0000046557
- https://books.rakuten.co.jp/search?g=001&sitem=9784063805789

## Scope boundary

This recheck updated only this QA report. The corrected seed was read but not
edited; builder, source, generated, final-overlay, promotion, terminal, and
frozen artifacts were not edited.
