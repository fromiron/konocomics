# Batch 005 recommendation context and Art scene-context seed — position 35

- reviewedAt: `2026-08-25`
- reviewedByHuman: `false`
- scope: research-only recommendation context and Art scene-context seed for frozen position `35`
- canonical title: `ハイスコアガール`; frozen title has no decorative `『` or `』` delimiters
- source, generated, final-overlay, builder, promotion, and terminal files were not changed

## Frozen identity

- Frozen row: position `35`, `work-8a7846af8ead1797e6a2`, `ハイスコアガール`.
- Frozen representative volume: standard volume `1`, ISBN `9784757535121`, publisher スクウェア・エニックス, creator 押切蓮介. The identity row is unchanged.
- The [official SQUARE ENIX Big Gangan series page](https://magazine.jp.square-enix.com/biggangan/introduction/highscoregirl/) identifies the title and creator, lists standard `ハイスコアガール 1巻` through `10巻（完）`, and separates `ハイスコアガール CONTINUE` 1–5 and the official fanbook as distinct entries.

## Recommendation context result

| Position | Work | catalogRole | seriesGroupId | volumeCount | status | reviewAverage | reviewCount |
| -------: | ---- | ------------ | ------------- | ----------: | ------ | ------------: | -----------: |
| 35 | ハイスコアガール | bridge | _(blank)_ | 10 | completed | 4.41 | 98 |

- `catalogRole=bridge`: the official entry centers both arcade/gameplay culture and a three-character love-comedy relationship. Those are distinct gaming/nostalgia and relationship/comedy taste clusters, so the work connects clusters rather than serving only as a single-axis contrast. This role is a recommendation-diversity role, not a popularity inference.
- `seriesGroupId` remains blank. The frozen set and existing canonical context contain no separate direct-franchise Work for this title. `ハイスコアガール CONTINUE`, the fanbook, and `ハイスコアガール DASH` are excluded related products/derivative scope here; author or thematic similarity alone does not create a group key.

## Standard main-series volume and status provenance

- The [official Big Gangan series bibliography](https://magazine.jp.square-enix.com/biggangan/introduction/highscoregirl/) lists the standard numbered main series from volume 1 through volume 10 and labels volume 10 `（完）`.
- The [official SQUARE ENIX volume-10 page](https://magazine.jp.square-enix.com/top/comics/detail/9784757560765/) identifies `ハイスコアガール 10（完）`, creator 押切蓮介, release date `2019-03-25`, and paper ISBN `9784757560765`; it calls the book the final volume.
- Therefore the standard Japanese paper main series is `volumeCount=10` and `status=completed` as of `2026-08-25`.
- `ハイスコアガール CONTINUE` 1–5, `ハイスコアガール公式ファンブック KAJIMEST CONTINUE`, `ハイスコアガール DASH`, digital editions, special editions, and sets are not counted as standard main-series volumes. The official bibliography visibly separates these entries from volumes 1–10.

## Review market signal provenance

- The [楽天ブックス exact ISBN search for `9784757535121`](https://books.rakuten.co.jp/search?g=001&sitem=9784757535121) currently returns one `ハイスコアガール（1）` row with ISBN `9784757535121`, author 押切蓮介, release `2012年02月`, user rating `4.41`, and `レビュー98件` in the same result row.
- The exact ISBN search was fetched on `2026-08-25`; the paired mutable market snapshot is therefore `reviewAverage=4.41`, `reviewCount=98`. If a future exact-ISBN search no longer reproduces both values, blank both review fields together; do not substitute another volume, edition, set, sale signal, or review prose.
- The review snapshot is separate from official identity, volume/status provenance, Factor evidence, and award/selection provenance.

## Art scene-context seed

- The accepted static recovery packet is `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-04/recovery-pos35-preflight.csv`, with independent QA in `data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-art-preflight-qa-chunk-04-pos35-recovery.md`. The QA result is `PASS — SAMPLE_READY`: six readable BODY pages, at least two contexts, normal browser-rendered official JPEGs, and exact `6/6` URL/ref/hash mapping.
- The authoritative static page refs are `reader-his02-p002;reader-his02-p003;reader-his02-p004;reader-his02-p005;reader-his02-p006;reader-his02-p007`, from the official [第2話 trial](https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/). Pages `p002`–`p004` are street or social-interaction material; `p005`–`p007` are arcade/gameplay material. The recovery correction ledger preserves the exact official `/img/002.jpg`–`/img/007.jpg` bindings and excludes the chapter opener.
- Static Art recovery was subsequently adjudicated from those six original-pixel pages as `artRealism=1`, `artDensity=2`, and `visualSoftness=1`; this seed records the accepted evidence boundary and does not mutate the final Art overlay.
- `motionReference=reader-page-010` is retained from the original 第1話 packet, not the static recovery. The [official 第1話 trial](https://magazine.jp.square-enix.com/biggangan/tachiyomi/his01/) page `reader-page-010` contains the bounded seated-play → approach/charge → face-impact → nosebleed aftermath sequence. Existing final Art preserves `motionImpact=4` with confidence `0.93`; the recovery packet itself correctly makes no new motion claim.
- Art provenance files: recovery preflight, corrected static final rows, static adjudication, original motion-capable preflight/final rows, and the independent recovery QA/correction ledger are listed in the CSV `artSourceFile` field. No source/generated/promotion/image terminal file was changed by this research seed.

## Provenance boundary

- Official SQUARE ENIX bibliography establishes standard main-series identity, `volumeCount=10`, and `status=completed`.
- The exact Rakuten ISBN search supplies only the mutable representative-volume market snapshot (`4.41`, `98`).
- The official Square Enix internal trials plus accepted recovery/preflight and Art review files supply only page refs, scene contexts, and the existing motion reference. No recommendation score, generated row, final-overlay value, or promotion decision is changed by this seed.
