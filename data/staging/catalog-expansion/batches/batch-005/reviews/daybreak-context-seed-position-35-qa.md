# Batch 005 context seed independent QA — position 35

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- reviewedByHuman: `false`
- scope: `research/context-seed-position-35.csv` and `.md` only
- result: **PASS**

## Recomputed result

| Position | Work | catalogRole | seriesGroupId | volumeCount | Work status | reviewAverage | reviewCount |
| -------: | ---- | ----------- | ------------- | ----------: | ----------- | ------------: | ----------: |
| 35 | ハイスコアガール | bridge | _(blank)_ | 10 | `completed` | 4.41 | 98 |

The frozen identity, recommendation-context values, official standard-series
bibliography, exact-ISBN market snapshot, Art six-page/two-context recovery,
exact motion reference, dates, and every path listed in `artSourceFile` pass.
No seed correction was required.

## Findings

### 1. Frozen identity and canonical title — PASS

- Frozen position `35` is exactly `work-8a7846af8ead1797e6a2`,
  `ハイスコアガール`.
- Batch 005 and canonical source rows identify creator `押切蓮介`, publisher
  `スクウェア・エニックス`, and representative standard volume 1 ISBN
  `9784757535121`.
- The official SQUARE ENIX series page reproduces the exact title and creator.
  The canonical title contains neither `『` nor `』`, and no alternate title or
  edition was substituted.

### 2. Standard main-series count and completion status — PASS

- The official Big Gangan bibliography lists standard `ハイスコアガール`
  volumes 1 through 10 and labels volume 10 `10巻（完）`.
- The official volume-10 page identifies `ハイスコアガール 10（完）`, creator
  `押切蓮介`, paper ISBN `9784757560765`, release date `2019-03-25`, and calls
  it the completed final volume.
- `ハイスコアガール CONTINUE` volumes 1–5 and the official fanbook are
  separate entries in the official bibliography. The volume-10 page separately
  lists `ハイスコアガール DASH` under related works. None is a standard
  numbered volume of the original main series. Digital editions, special
  editions, and sets likewise do not increase the standard main-series count.

Therefore `volumeCount=10`, `status=completed`,
`volumeSourcePublishedAt=2019-03-25`, and the cited volume source all pass.
`status` is a Work-overlay field rather than one of the six final
recommendation-context columns.

### 3. Exact Rakuten ISBN market signal and dates — PASS

The live exact-ISBN route
`https://books.rakuten.co.jp/search?g=001&sitem=9784757535121` returned HTTP 200
and one manga result row containing all of the following together:

- `ハイスコアガール（1） （ビッグガンガンコミックスSUPER）`
- creator `押切蓮介`
- ISBN `9784757535121`
- `2012年02月発売`
- user rating `4.41`
- `レビュー98件`

Thus `reviewAverage=4.41`, `reviewCount=98`,
`reviewSourcePublishedAt=2012-02`, and `retrievedAt=2026-08-25` pass. The seed
correctly keeps this mutable representative-volume snapshot separate from the
official series-count/completion bibliography. If the exact route later stops
reproducing either market value, both review fields must be blanked together.

### 4. Catalog role and series grouping — PASS

- `catalogRole=bridge` is supported by the official `90年代アーケード・ラブコメディー`
  description and three-character entry, together with the accepted terminal
  `comedy;romance`, arcade/game-rule world-building, relationship, comedy, and
  romance evidence. It connects gaming/nostalgia and relationship/comedy taste
  clusters; this is a diversity role, not a popularity inference.
- Blank `seriesGroupId` is correct. The current canonical source and Batch 005
  frozen set contain only this `ハイスコアガール` Work. CONTINUE editions, the
  fanbook, and the separately listed DASH derivative do not create a shared key
  without a second canonical recommendation Work.

### 5. Static Art refs and scene contexts — PASS

- The seed's six refs exactly equal the accepted recovery preflight and the
  three recovered static rows in both `final-art-pos35-recovery.csv` and the
  aggregate `final-art.csv`:
  `reader-his02-p002;reader-his02-p003;reader-his02-p004;reader-his02-p005;reader-his02-p006;reader-his02-p007`.
- The corrected recovery binds them one-to-one to official episode-2 JPEGs
  `/img/002.jpg` through `/img/007.jpg`. The independent preflight QA records
  exact `6/6` URL/ref/hash matching and six readable `870x1236` BODY pages.
- The two seed contexts, `street or social interaction;arcade/gameplay`, match
  the accepted dominant grouping: p002–p004 street/social and p005–p007
  arcade/gameplay. Pages containing elements of both contexts do not collapse
  the six-page sample to one context.
- The static recovery was accepted `SAMPLE_READY` and adjudicated to
  `artRealism=1`, `artDensity=2`, `visualSoftness=1`. The seed only preserves
  evidence provenance and does not alter those values.

### 6. Exact motion boundary — PASS

`motionReference=reader-page-010` exactly matches the original episode-1
preflight and terminal Art row. That single authorized page binds seated play,
the girl's approach, direct face impact with speed/burst marks, and a separate
nosebleed aftermath, supporting the existing `motionImpact=4` at confidence
`0.93`. The episode-2 static recovery correctly has
`motionGateAttemptable=false` and makes no new motion claim.

### 7. Art provenance paths — PASS

Every semicolon-delimited path in the CSV `artSourceFile` field exists and has
the stated role:

1. `art-preflight/chunk-04/recovery-pos35-preflight.csv` — accepted episode-2
   static recovery preflight.
2. `art-review/chunk-04/gemini-response-pos35-recovery.md` — independent static
   model review.
3. `art-review/chunk-04/final-art-pos35-recovery.csv` — adjudicated three-row
   static result.
4. `art-review/chunk-04/adjudication-pos35-recovery.md` — recovery adjudication
   and preserved-motion boundary.
5. `art-preflight/chunk-04/preflight.csv` — original episode-1 motion-capable
   preflight.
6. `art-review/chunk-04/final-art.csv` — current four-axis aggregate rows,
   including exact `reader-page-010` motion provenance.
7. `reviews/daybreak-art-preflight-qa-chunk-04-pos35-recovery.md` — independent
   `PASS — SAMPLE_READY` recovery QA.
8. `reviews/art-preflight/chunk-04-pos35-recovery/correction-round-2.md` — exact
   adjacent ref/hash remap ledger.

The Markdown descriptions agree with these files. No final-overlay, source,
generated, registry, or image artifact is referenced as changed by the seed.

### 8. Schema compatibility — PASS

Projecting the seed to
`workId,catalogRole,seriesGroupId,volumeCount,reviewAverage,reviewCount` passes
the current `recommendationContextSourceRowSchema`: blank `seriesGroupId`
normalizes to absent, `volumeCount=10` is a nonnegative integer, and `4.41/98`
is a valid paired market signal. The additional research provenance, Work
`status`, and Art fields remain outside the final six-column context schema.

## Source checks

- https://magazine.jp.square-enix.com/biggangan/introduction/highscoregirl/
- https://magazine.jp.square-enix.com/top/comics/detail/9784757560765/
- https://books.rakuten.co.jp/search?g=001&sitem=9784757535121

## Scope boundary

This QA added only this report. The seed CSV/Markdown passed unchanged.
Final-overlay, source, generated, registry, image, builder, promotion, terminal,
and frozen artifacts were not edited. `reviewedByHuman=false` remains unchanged.
