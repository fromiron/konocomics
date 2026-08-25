# Batch 005 Art preflight recovery input ledger — position 35

- scope: frozen Batch 005 position 35 only
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- browser: headed Playwright Chromium through ordinary Square Enix routes
- archive format: uncompressed
- acquisition root: `/tmp/konocomics-batch005-pos35-recovery`
- preserved originals: review-packet `images/` only; no source/generated/promotion image path
- static sample: six original first-party 第2話 JPEGs, each `870x1236`
- round-2 correction: Daybreak rejected only the prior filename/ref/hash pairing. The packet filenames and all dependent references now use the exact mapping below; bytes are unchanged and no new route acquisition was performed.

| corrected packet/ref | exact official image URL | corrected SHA-256 | prior packet/ref SHA-256 |
| --- | --- | --- | --- |
| `his02-p002` / `reader-his02-p002` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/002.jpg` | `0161e58893499257746ad7bd1cba7e6e07d7591711e3edd406044e176c3c4966` | `a5c3d1c83994934c193101fd0d10d676a462a48d28bda4421b65069349da803f` |
| `his02-p003` / `reader-his02-p003` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/003.jpg` | `a5c3d1c83994934c193101fd0d10d676a462a48d28bda4421b65069349da803f` | `0161e58893499257746ad7bd1cba7e6e07d7591711e3edd406044e176c3c4966` |
| `his02-p004` / `reader-his02-p004` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/004.jpg` | `6ec72f8e4fcb9c0ab0ffec6b2f0b13176210e71b3b355486e01a61c95155d487` | `112acb66d9bf6b5f8f9842982ced40fc5f90836127522d98312e8716927f61b5` |
| `his02-p005` / `reader-his02-p005` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/005.jpg` | `112acb66d9bf6b5f8f9842982ced40fc5f90836127522d98312e8716927f61b5` | `6ec72f8e4fcb9c0ab0ffec6b2f0b13176210e71b3b355486e01a61c95155d487` |
| `his02-p006` / `reader-his02-p006` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/006.jpg` | `44de76624bfaf4c4421794c8d670693d2ec5f8c1a2d4fe21c8861a09d26fbb9f` | `aee2737299e01a69175e69d013b95f82589aac058cd67f8ace6cca05dbd72de2` |
| `his02-p007` / `reader-his02-p007` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/007.jpg` | `aee2737299e01a69175e69d013b95f82589aac058cd67f8ace6cca05dbd72de2` | `44de76624bfaf4c4421794c8d670693d2ec5f8c1a2d4fe21c8861a09d26fbb9f` |

## Frozen repository inputs

| Input | Path or identity | SHA-256 |
| --- | --- | --- |
| candidate identity | supplied Batch 005 candidate root | `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695` |
| batch manifest | `data/staging/catalog-expansion/batches/batch-005/manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| payload ledger | `data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` |
| frozen work set | `data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| route registry | `data/staging/catalog-expansion/art-source-route-registry.csv` | `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28` |
| prior chunk-04 preflight | `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-04/preflight.csv` | `a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7` |

## Official route responses

| Route | HTTP | Temporary response SHA-256 |
| --- | ---: | --- |
| `https://magazine.jp.square-enix.com/biggangan/introduction/highscoregirl/` | 200 | `7c43d81e47e206c40c92c9cca2e3aaa612d6a14a9cfd25f559425d4f7567b9c6` |
| `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/` | 200 | `9d96b2366381370988e53cfded2fe8231ec5e2c23886e97e45a50eac5dbdae05` |
| `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his03/` | 200 | `2a51ee08e66486af1311b6dd05364fdcfca7a02ec87bde9773a78ab1bd42c490` |
| `https://magazine.jp.square-enix.com/top/comics/detail/9784757535121/` | 404 | `44e79f2b4b84f6322582feacc7daece661a91f3c3f1fe39ce05d83bb4da2e1ee` |
| `https://magazine.jp.square-enix.com/top/comics/detail/9784757536425/` | 404 | `44e79f2b4b84f6322582feacc7daece661a91f3c3f1fe39ce05d83bb4da2e1ee` |
| `https://magazine.jp.square-enix.com/top/comics/detail/9784757538412/` | 404 | `44e79f2b4b84f6322582feacc7daece661a91f3c3f1fe39ce05d83bb4da2e1ee` |

The series page is the current official identity bridge. The old detail paths
are retained as exhaustion evidence only; no generic no-slash response or
CONTINUE reissue was treated as a standard-edition product page.
