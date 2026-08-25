# Batch 004 Art route recovery — position 44

- workId: `work-e2f095e08fc5e08d5a2b`
- canonicalTitle: `高嶺と花`
- creator: `師走ゆき`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- reviewedByModel: `local browser route verification only`
- valuesAssigned: `false`

## Result

The previous `unknown-ready` disposition was caused by the route registry lacking a 白泉社 trusted preview row. A publisher-linked official route is in fact available from the exact volume-1 product page:

- Product: https://www.hakusensha.co.jp/comicslist/46600/
- Linked preview: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221351takaneX00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D46600
- Reader host after redirect: `https://bsreader.hakusensha-e.net/`
- Preview JDCN: `59221351takaneX00111`
- Trial window observed: `0_49`

The product page and linked route bind the same title/creator/entry edition: `高嶺と花 1`, 師走ゆき, ISBN `9784592213512`, 花とゆめコミックス, released `2015-03-20`. The browser loaded the official reader `face.xml`, page XML, and rendered image requests. The complete uncompressed recovery bundle is at `/tmp/konocomics-batch004-art-recovery-pos44-round1/`; it is not a repository artifact.

## Sample gate

Six temporary rendered reader frames were retained from the entry-volume trial after the cover/title/contents material. Their refs and SHA-256 values are recorded in [the recovery ledger](../art-preflight/chunk-05/recovery-pos44-ledger.md) and `recovery-pos44-preflight.csv`.

The frames cover at least three distinct contexts: formal omiai/restaurant interior, school/public outing, and home/office/meal interaction. This satisfies the threshold to attempt static Art review (`6` readable frames, `3` contexts). It does not authorize an Art value by itself; Local Codex and Gemini must independently inspect the same temporary bundle under the existing panel policy. No motion sequence meeting the exact bounded start-development-impact-resolved rule was established, so `motionImpact` remains unknown.

## Scope and non-effects

- No `final-art.csv` row was changed.
- No source, generated, recommendation, or promotion file was changed.
- No Art or Factor value was assigned.
- Temporary images remain under `/tmp` only.
- `reviewedByHuman=false` remains explicit.

The route registry should be updated separately only after the parent pipeline owner reviews this discovery and decides whether this publisher-linked route is a reusable trusted route for future 白泉社 works.
