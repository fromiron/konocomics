# Batch 004 context seed independent QA — position 18

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- reviewedByHuman: `false`
- scope: `research/context-seed-position-18.csv` and `.md` only
- result: **PASS**

## Recomputed result

| Position | Work | catalogRole | seriesGroupId | volumeCount | Work status | reviewAverage | reviewCount |
| -------: | ---- | ----------- | ------------- | ----------: | ----------- | ------------: | ----------: |
| 18 | とろける鉄工所 | bridge | _(blank)_ | 10 | `completed` | 4.06 | 58 |

The identity, context values, source-date precision, Art refs, three Art
contexts, motion boundary, and corrected provenance naming are accepted. The
completed Work-status and builder integration boundaries below remain mandatory
before promotion.

## Findings

### 1. Frozen identity and representative volume — PASS

- Frozen position `18` is exactly `work-39c1a2b6791238827ed5`,
  `とろける鉄工所`.
- Batch 004 and canonical source volume rows bind this Work to representative
  standard volume 1, ISBN `9784063522471`. Batch provenance records the same
  ISBN, title, creator 野村宗弘, and Rakuten product identity.
- The 講談社 volume-1 page independently reproduces title, creator, ISBN, and
  paper release date `2008-11-21`.
- The canonical Work title contains neither `『` nor `』`. No selection volume,
  edition, set, or other Work was folded into the frozen identity.

### 2. Standard volume count and completion status — PASS

- The live 講談社 title endpoint returns 11 paper products: numbered standard
  volumes 1 through 10 plus the separately named `とろける鉄工所 選り抜き編`.
  Excluding that selection book leaves exactly `volumeCount=10`.
- The title page marks the series `完結`; its title metadata records
  `is_completed=true` and `last_volume=10`.
- The volume-10 page identifies `とろける鉄工所（１０） ＜完＞`, ISBN
  `9784063524659`, and paper release date `2013-06-21`. Therefore
  `status=completed` is directly supported rather than inferred from age or
  volume count.
- Electronic releases, the selection book, special editions, and sets are not
  counted.

`status` is a Work field, not a recommendation-context field. The current Batch
004 and canonical source Work rows still say `unknown`, and the overlay builder
copies `sourceWork` unchanged. Before promotion, the permitted Work-overlay path
must carry `completed`; otherwise `完結作優先` will apply the non-completed
penalty incorrectly.

### 3. Rakuten market signal — PASS

The exact ISBN search
`https://books.rakuten.co.jp/search?g=001&sitem=9784063522471` currently returns
one manga result for `とろける鉄工所（1）`, creator 野村宗弘, ISBN
`9784063522471`, rating `4.06`, and `レビュー58件` in the same result row. It
also displays only `2008年11月発売`.

Therefore `reviewAverage=4.06`, `reviewCount=58`,
`reviewSourcePublishedAt=2008-11`, and `retrievedAt=2026-08-25` are accepted.
The corrected month precision matches the Rakuten result and keeps the official
講談社 volume-1 day `2008-11-21` in its separate provenance boundary. If the
exact ISBN result later stops reproducing both market values, blank
`reviewAverage` and `reviewCount` together.

### 4. Catalog role and series grouping — PASS

- `catalogRole=bridge` is supported by the terminal profile: Genre
  `sliceOfLife`, central Themes `crafting` and `workplace`, practical work
  knowledge, comedy, relationships, and emotional warmth connect craft/work
  and everyday-life taste clusters. This is a diversity role, not a popularity
  inference.
- Blank `seriesGroupId` is correct. No direct sequel or separate canonical Work
  in the frozen catalog establishes a shared key; the effective key remains the
  Work ID.

### 5. Art refs, contexts, motion, and provenance naming — PASS

- The six seed refs exactly equal the accepted preflight row and all four
  terminal `final-art.csv` rows:
  `reader-step-07;reader-step-11;reader-step-15;reader-step-19;reader-step-23;reader-step-27`.
- The three seed context labels exactly reproduce the accepted original-pixel
  multi-context audit:
  `welding shop floor;social/family/office;moonlight training & tool`.
  They are bounded by page pairs 07/11, 15/19, and 23/27 respectively and are
  compatible with the independently accepted preflight's three-context gate.
- `motionReference=none` is correct. Preflight has
  `motionGateAttemptable=false`; terminal Art has `motionImpact=unknown` with
  blank value and confidence. Isolated tool use, vibration, or injury imagery
  does not establish one continuous start/development/impact/resolved sequence.

The corrected CSV now preserves the complete reproducible provenance chain in
this exact `artSourceFile` value:

```text
data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-02/preflight.csv;data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/gemini-response.md;data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/adjudication.md;data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/final-art.csv
```

The corrected Markdown separately identifies the Gemini response as the exact
label source, `adjudication.md` as final adjudication, and `final-art.csv` as
terminal output. The four-file CSV value and Markdown wording now agree.

### 6. Current schema and builder integration boundary

Projecting the seed to
`workId,catalogRole,seriesGroupId,volumeCount,reviewAverage,reviewCount` passes
the current `recommendationContextSourceRowSchema`. The research CSV itself is
not directly compatible with the existing Batch 004 overlay ingestion contract:

- Map `volumeSourceName`, `volumeSourceUrl`, and `volumeSourcePublishedAt` to
  the builder's current `sourceName`, `sourceUrl`, and `sourcePublishedAt`
  research fields, while retaining and validating the separate review
  provenance.
- The builder currently emits `reviewAverage: ""` and `reviewCount: ""`.
  Promotion must emit the validated `context.reviewAverage` and
  `context.reviewCount` instead, or this accepted snapshot will be silently
  discarded.
- Add the exact accepted context string to Batch 004's `sceneContexts` map if
  this Work becomes recommendation-verified. No motion-map entry is needed
  while motion remains unknown.
- Carry `status=completed` through the permitted Work overlay; it cannot be
  encoded in `recommendation-context-final.csv`.

These are promotion prerequisites, not permission to alter the builder or any
source/generated/final-overlay artifact during this QA.

## Applied corrections reverified

| File | Field or sentence | Accepted corrected value |
| ---- | ----------------- | ------------------------ |
| `context-seed-position-18.csv` | `reviewSourcePublishedAt` | `2008-11` |
| `context-seed-position-18.csv` | `artSourceFile` | exact four-file value above |
| `context-seed-position-18.md` | Art provenance sentence | Gemini label source, `adjudication.md`, and terminal `final-art.csv` are separate |

## Source checks

- https://www.kodansha.co.jp/comic/products/0000038640
- https://www.kodansha.co.jp/comic/products/0000038856
- https://www.kodansha.co.jp/titles/1000004427
- https://www.kodansha.co.jp/titles/1000004427/api?count=0
- https://books.rakuten.co.jp/search?g=001&sitem=9784063522471

## Scope boundary

This recheck updated only this QA report. The corrected seed was read but not
edited; builder, source, generated, final-overlay, promotion, and terminal files
were not edited.
