# Batch 005 Art preflight recovery input ledger — position 26

- scope: frozen Batch 005 position 26 only
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporary image root: `/tmp/konocomics-batch005-pos26-recovery`
- repository image mutation: none
- archive format: uncompressed
- browser capture: Playwright Chromium route screenshots; temporary only
- no local image path was added to the repository

## Frozen repository inputs

| Input | Path or identity | SHA-256 |
| --- | --- | --- |
| candidate identity | supplied Batch 005 candidate root | `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695` |
| batch manifest | `data/staging/catalog-expansion/batches/batch-005/manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| payload ledger | `data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` |
| frozen work set | `data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| route registry | `data/staging/catalog-expansion/art-source-route-registry.csv` | current repository input; registered Akita route is `championcross.jp`, while this recovery binds the direct publisher ARC link shown on the exact product page |

## Official HTTP inputs

| Input | URL | Temporary response SHA-256 |
| --- | --- | --- |
| vol. 1 product | https://www.akitashoten.co.jp/comics/4253261019 | `d59e16689410d166df9f1578a5ed1c15295b32f2df684b92ce90951521665fb3` |
| vol. 2 product | https://www.akitashoten.co.jp/comics/4253261027 | `40ab6ad11c7fd23d4ad2d09412be587b364b3c22981c080a7171c3fc1d502c8c` |
| vol. 3 product | https://www.akitashoten.co.jp/comics/4253261035 | `7bd3a72f99ad7e8019bf2fcc9cf0129c3b9ba634c4dc593d02f33e2c012a20b7` |
| ARC viewer HTML | https://arc.akitashoten.co.jp/comics/kojiranoko/1 | `8d5cdd3c4b1b306683c97cf65487a02b0aeb7a275c7622521f76db0cd01dc98f` |
| ARC episode JSON | https://arc.akitashoten.co.jp/comics/kojiranoko/1.json | `8569535d979bc9f4a5368c46e692ff1133dba0ace2b3d27a180934925989dcf2` |

The ARC JSON response contains exactly 45 `episode_pages` entries with order indices 1 through 45, and the official product HTML contains the direct ARC `試し読み！` link. The product ISBN is `978-4-253-26101-2`; the ARC JSON title, author, and volume are an exact identity match.

## Temporary rendered inputs

The full 45-page packet was fetched transiently for classification and every original-resolution page was reopened. Page 01 is the full-color cover; pages 02–45 are readable interior body pages. Six static body-page hashes and three exact motion-sequence page hashes are recorded in the recovery preflight and output ledger. The complete transient packet is not a repository artifact.

| Temporary route proof | Path | SHA-256 |
| --- | --- | --- |
| Playwright product screenshot | `/tmp/konocomics-batch005-pos26-recovery/product.png` | `6a3cc0c4b4bd3a85f5d686fa218cbfcab737d9d8e71e1a0ff290b08c788339d8` |
| Playwright ARC screenshot | `/tmp/konocomics-batch005-pos26-recovery/reader.png` | `6abb79ef1a9cae6978fde579608f70a1e6a6bff8dd1b71ac6134fbe065bfe557` |

## Acquisition boundary

The nine retained pages are fetched from the official ARC `pc_url` endpoints: six pages for the static gate and three pages for the exact bounded motion sequence. No cover, retailer sample, animation image, or user-generated image was used. The route and page packet are evidence for preflight eligibility only; they do not assign an Art value.
