# Batch 005 Art preflight recovery request — position 39 round 2

- project: `fromiron/konocomics`
- batch: `batch-005`
- scope: frozen position 39 only
- workId: `work-aa6018249b7fe7e92d95`
- canonical title: `かよちゃんの荷物`
- creator: `雁須磨子`
- publisher: `竹書房`
- frozen representative ISBN: `9784812465752` (standard original volume 1)
- requested operation: re-open the corrected BookLive lower route, enumerate all manifest pages, classify cover/front matter/body, verify the same-work new-edition bridge, and inspect the exact BOOK☆WALKER upper/lower inline trial routes recorded by the final blocker adjudication
- prohibited operation: no Art values, no Factor edits, no source/generated/promotion edits, no existing final-Art edits, no image commit
- gate: static `sample-ready` requires at least 6 readable internal body pages and at least 2 distinct scene contexts; motion is attemptable only with an exact bounded start-development-impact-resolved sequence
- review status: `reviewedByHuman=false`
- retrievedAt: `2026-08-25`

## Exact routes

- BookLive lower product: https://booklive.jp/product/index/title_id/439092/vol_no/002
- BookLive lower reader: https://booklive.jp/bviewer/s/?cid=439092_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F439092%2Fvol_no%2F002
- BookLive lower manifest: https://d1cv2lzt22ijfr.cloudfront.net/439092/002/pub/binb/trial/content.js?dmytime=20170427150205
- BOOK☆WALKER upper product and inline trial: https://bookwalker.jp/de823a2c37-d79e-4358-82e2-c84b8acc9d33/
- BOOK☆WALKER lower product and inline trial: https://bookwalker.jp/de90e7d72e-1f81-40ad-904b-9e0c6ed2de25/

The BOOK☆WALKER product pages expose signed inline trial image URLs under
`viewer-epubs-trial.bookwalker.jp`; signed query parameters are ephemeral and
are retained in the temporary uncompressed URL inventory, not copied into the
canonical CSV. The lower BookLive manifest is the selected static sample.
