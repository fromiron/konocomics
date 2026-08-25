# Batch 005 Art preflight — chunk 01

- retrievedAt: `2026-08-25`
- scope: frozen Batch 005 positions 1–10 in manifest order
- preflightCsvSha256: `6d6ba98891618f57360849c924e9cd73ce64795c8d3e70f3a96799d021fb7e4d`
- frozenWorkSetSha256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- candidateSha256 at re-freeze: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256 at re-freeze: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- payloadSha256 at re-freeze: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- reviewedByHuman: `false`
- temporaryImagesCommitted: `false`
- factorValuesAssigned: `false`
- imageRoot: `/tmp/konocomics-batch005-art-chunk01`

## Route and model boundary

Official publisher or publisher-authorized routes were attempted first, using the Batch004 route registry and the supplied Batch005 research packet. Product pages, covers, title pages, contents pages, promotional pages, blank reader screens, and user reviews were not counted as Art evidence. The temporary screenshots and downloaded official Fotorama pages remain outside the repository under `/tmp/konocomics-batch005-art-chunk01/`; no image is copied into this chunk.

The re-freeze changed the canonical packet binding. The earlier preflight binding using manifest `b42ac6a84cc9116a1687372cbd2b79787e87881917d497418a95692c47b4b6d3`, candidate `12ad0c6351c60707abc63903dbac3bc405cc253caa786d799b20776b294e533b`, and prior `abda20eb624780d0861d4df3b29164480859e318b8f58834e9ccc73c8c3d2c8` root was discarded after the canonical title/root re-freeze. Those stale bindings are invalid and are not used here. All rows below use the current frozen work IDs and titles, and the current frozen-work-set SHA above.

## Gate policy

`sample-ready` requires an exact entry-scope edition bridge, at least six readable internal body pages, and at least two genuinely distinct scene contexts. A failed prerequisite closes the row as `unknown-ready`; this is not an Art value and is not a promotion decision. `motionGateAttemptable` is `true` only when one exact continuous start-development-impact-resolved sequence can be isolated. No row met that higher motion prerequisite, so all motion flags are `false`.

## Result

| Pos | Work | Pages | Contexts | Static | Motion | State | Decisive boundary |
|---:|---|---:|---:|:---:|:---:|---|---|
| 1 | `work-060a72fe10cf6ba9cbfc` チェーザレ 破壊の創造者 | 5 | 3 | no | no | `unknown-ready` | Kodansha vol1 trial maps directly to frozen ISBN; the front-matter pair was excluded, leaving five body pages below the six-page static threshold |
| 2 | `work-076beb86f844b642beef` くーねるまるた | 6 | 2 | yes | no | `sample-ready` | Shogakukan JDCN vol1 matches frozen ISBN; temple/residential approach and apartment interior/threshold contexts |
| 3 | `work-091d231d37f037fb07e8` インベスターZ | 0 | 0 | no | no | `unknown-ready` | Exact Kodansha product has no work-specific internal trial route |
| 4 | `work-0cf463005cc77eeded8e` 黄泉のツガイ | 6 | 4 | yes | no | `sample-ready` | Square Enix first-episode image sequence; pages 004–009 after title splash |
| 5 | `work-0d1ad77728a44df56508` ラーメン大好き小泉さん | 0 | 0 | no | no | `unknown-ready` | Only broadcaster promotion and licensed distributor identity; no registered publisher preview |
| 6 | `work-0dabd1d17e5fcf2992b9` 忘却のサチコ | 6 | 1 | no | no | `unknown-ready` | Shogakukan tameshiyo exact ISBN; six body pages are one wedding-reception/bridal-preparation sequence |
| 7 | `work-0ebf010ac12b9b60d80e` 機動旅団八福神 | 6 | 2 | no | no | `unknown-ready` | BookWalker sample is vol1 ISBN 9784757720923 while frozen representative is vol9 ISBN 9784757746954; ceremony/interior and orbital-strike/cutaway contexts |
| 8 | `work-0ede6921b81169dc2dda` 不滅のあなたへ | 6 | 2 | yes | no | `sample-ready` | Pocket first episode retains six body canvases after finite lazy-load exploration; snowy wilderness and inhabited/human contexts |
| 9 | `work-0eff8190c0c6ff604527` よるくも | 6 | 1 | no | no | `unknown-ready` | Shogakukan JDCN vol1 matches frozen ISBN; six qualifying body pages are one restaurant closing/meal-conversation sequence |
| 10 | `work-12b484cd79bfe6852ea1` 高校球児 ザワさん | 2 | 2 | no | no | `unknown-ready` | Title-opening pair excluded; reader ended after two qualifying internal pages |

## Acquisition notes

- Position 1: Kodansha reader step 07 was `PREMESSA` front matter and was removed. Steps 08–12 are five retained body pages covering bedroom/interior, street, courtyard, and group contexts; the static gate closes unknown-ready below six pages.
- Position 2: Shogakukan e-comic reader steps 04–09 are readable body pages. Cover, “Go to next page” interstitial, and contents material were excluded.
- Position 3: the official Kodansha product record reports `trial_links: []`; no generic or unrelated reader was substituted.
- Position 4: the linked Square Enix Fotorama image sequence exposes 63 image slots. Official pages 004–009 are readable body pages; title/character splash pages 001–003 were excluded.
- Position 5: the supplied Fujitv page is an adaptation promotion page, not a manga internal-page preview. The Animate page is bibliographic support only.
- Position 6: the Shogakukan tameshiyo reader exposes 27 pages. Reader pages 05–10 are body pages from one wedding-reception/bridal-preparation sequence; opening/title/contents pages 01–04 were excluded and the static gate closes unknown-ready without a second context.
- Position 7: the KADOKAWA product page links the exact BookWalker vol1 trial. Pages 09, 10, 12, 13, 14, and 15 are retained body pages across ceremony/interior and orbital-strike/cutaway contexts, but the frozen representative is volume 9 and the exact edition bridge is absent.
- Position 8: the Kodansha product links the authorized Pocket first episode. Canvas pages 04–06 were excluded as advertorial, blank/logo, and chapter/title opening. Existing body canvases 07–08 plus finite lazy-loaded canvases 09–12 provide six readable body pages across snowy wilderness and inhabited/human contexts.
- Position 9: the Shogakukan e-comic reader is accessible for JDCN `091885380000d0000000`; opening cover/title/contents material was excluded, and reader steps 10–15 are six qualifying body pages from one restaurant closing/meal-conversation sequence, so the static gate closes unknown-ready.
- Position 10: the Shogakukan e-comic reader ended at its final screen after two qualifying pages; `reader-step-04` was the `第1話 岡山` title opening and was excluded; no unrelated image route was substituted.

## Verification boundary

The CSV must contain exactly 10 data rows in frozen order and no Art factor values. SHA-256 values were recomputed from the temporary screenshots or official Square Enix image files before writing. `staticGateAttemptable` and `stateEligibility` agree for every row; all `motionGateAttemptable` values are `false`. No annotations, adjudications, promotions, catalog files, or commits were made.
