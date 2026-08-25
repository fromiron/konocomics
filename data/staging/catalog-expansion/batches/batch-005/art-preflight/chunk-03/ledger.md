# Batch 005 Art preflight — chunk 03

- scope: frozen positions 21–30 in manifest order
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- preflightCsvSha256: `8379215c7c1ddcde7c4d3bfe2848b974a2200f5a95b5c7758e6778b9436f38f0`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- batch manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- candidateSha256 echoed from manifest: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozen-work-set SHA-256 verified by `PAYLOAD.sha256`: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- image root: `/tmp/konocomics-batch005-art-chunk03`
- repository image mutation: none
- review bundle: `data/staging/catalog-expansion/batches/batch-005/reviews/art-preflight/chunk-03/`

## Scope and gate contract

This is official-route access and sampling preflight only. The exact frozen representative ISBN had to bridge to the official product and a registered official publisher or promotion route within volumes 1–3 or the first major episode. Unregistered readers and generic retailer previews were not substituted.

`sample-ready` requires six readable internal body pages and at least two genuinely distinct scene contexts. Covers, title splashes, contents pages, advertisements, and synopsis material were excluded. `motionGateAttemptable=true` requires one exact bounded continuous start-development-impact-resolved sequence. Positions 27 and 30 met that stricter condition. A failed prerequisite closes as `unknown-ready` without an Art value or promotion blocker.

## Result summary

| Pos | Work | Route | Pages | Contexts | Static | Motion | State |
| --: | --- | --- | ---: | ---: | --- | --- | --- |
| 21 | 娚の一生 | 小学館 exact JDCN e-comi reader | 6 | 3 | yes | no | sample-ready |
| 22 | リューシカ・リューシカ | スクウェア・エニックス product only | 0 | 0 | no | no | unknown-ready |
| 23 | 千年万年りんごの子 | 講談社 product-linked trial | 6 | 3 | yes | no | sample-ready |
| 24 | 百舌谷さん逆上する | 講談社 product-linked trial | 6 | 3 | yes | no | sample-ready |
| 25 | 天にひびき | 少年画報社 product only | 0 | 0 | no | no | unknown-ready |
| 26 | クジラの子らは砂上に歌う | 秋田書店 registered route unavailable | 0 | 0 | no | no | unknown-ready |
| 27 | 女王の花 | 小学館 exact JDCN reader | 6 | 3 | yes | yes | sample-ready |
| 28 | 血潜り林檎と金魚鉢男 | KADOKAWA product only | 0 | 0 | no | no | unknown-ready |
| 29 | 鉄楽レトラ | 小学館 exact JDCN e-comi reader | 6 | 3 | yes | no | sample-ready |
| 30 | ジョジョリオン | 集英社 exact ISBN reader | 6 | 3 | yes | yes | sample-ready |

## Route and evidence notes

### 21 — 娚の一生

The official 小学館eコミックストア volume 1 route exposes the JDCN-bound internal reader and bridges frozen ISBN `9784091322692`. Six readable body captures `reader-step-04` through `reader-step-09` cover home and domestic interiors outdoor or river scenes and group or family contexts.

### 22 — リューシカ・リューシカ

The official Square Enix volume 1 product matches frozen ISBN `9784757529083` and official volumes 2–3 bridge the entry range. The registered Gangan Online promotion route was not product-linked to an exact readable sample, so no pages were counted.

### 23 — 千年万年りんごの子

The official Kodansha product and linked reader match frozen ISBN `9784063805789`. Six readable body captures `reader-step-04` through `reader-step-09` cover outdoor or mountain scenes domestic interiors and community or family gatherings.

### 24 — 百舌谷さん逆上する

The official Kodansha product and linked reader match frozen ISBN `9784063145120`. Six readable body captures `reader-step-04` through `reader-step-09` cover classroom; school corridor/exterior; school assembly/library contexts.

### 25 — 天にひびき

The official Shonengahosha volume 1 product matches frozen ISBN `9784785932909` and volumes 2–3 bridge the entry range. No product-linked readable internal trial could be mapped to the frozen edition.

### 26 — クジラの子らは砂上に歌う

The official Akita product matches frozen ISBN `9784253261012` and volumes 2–3 bridge the entry range. An official ARC reader was observable, but the repository route registry requires a Champion Cross episode bridge; the ARC route was not substituted and no pages were counted.

### 27 — 女王の花

The official 小学館 JDCN reader bridges frozen ISBN `9784091320094`. Six readable body captures `reader-step-04` through `reader-step-09`; `reader-step-05` to `reader-step-06` to `reader-step-07` preserves an exact bounded sequence of flight start; pursuit and wall leap/descent; landing and confrontation endpoint.

### 28 — 血潜り林檎と金魚鉢男

The official KADOKAWA product matches frozen ISBN `9784048860499` and volumes 2–3 bridge the entry range. The product reports no trial and no exact product-linked BOOK WALKER sample was verified.

### 29 — 鉄楽レトラ

The official 小学館eコミックストア JDCN reader bridges frozen ISBN `9784091234452`. Six readable body captures `reader-step-04` through `reader-step-09` cover home and train scenes urban or school settings and sport or group scenes.

### 30 — ジョジョリオン

The official Shueisha exact ISBN reader bridges frozen ISBN `9784088703114`. Six readable body captures `reader-step-05` through `reader-step-10` exclude the title splash and cover ruined outdoor scenes city infrastructure and investigation or character-interaction contexts; `reader-step-05` preserves an exact bounded fall sequence of stumble start; fall/collision impact; fallen aftermath and rising endpoint.

## Verification boundary

- `preflight.csv` has the prescribed 17 columns and exactly ten scoped data rows in frozen order.
- Six accessible works have six selected temporary capture hashes each; four official-product-only positions have no sampled-page hashes.
- `motionGateAttemptable=true` is limited to positions 27 and 30; all other positions remain `false`.
- No Art value or other Factor value was assigned; `reviewedByHuman=false` remains explicit; no promotion or commit was performed.
