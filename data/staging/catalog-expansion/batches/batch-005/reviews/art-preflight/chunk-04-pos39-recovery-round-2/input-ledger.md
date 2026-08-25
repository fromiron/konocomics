# Batch 005 Art preflight recovery input ledger — position 39 round 2

- project: `fromiron/konocomics`
- scope: frozen Batch 005 position 39 only
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporary image root: `/tmp/konocomics-batch005-pos39-recovery-round2`
- repository image mutation: none
- archive format: uncompressed
- browser: Playwright Chromium; original-resolution route responses and direct tile-scrambled pixels reopened
- no local image path was added to the repository

## Frozen repository inputs

| Input | Path or identity | SHA-256 |
| --- | --- | --- |
| candidate identity | supplied Batch 005 candidate root | `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695` |
| batch manifest | `data/staging/catalog-expansion/batches/batch-005/manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| payload ledger | `data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` |
| frozen work set | `data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| route registry | `data/staging/catalog-expansion/art-source-route-registry.csv` | current repository input; no 竹書房 row, so the explicitly adjudicated licensed routes below were checked as fallback |

## BookLive lower official licensed inputs

| Input | URL | Temporary response SHA-256 |
| --- | --- | --- |
| lower product | https://booklive.jp/product/index/title_id/439092/vol_no/002 | `57d9c94e62854df669d9ce9deeb62cf86c5c17f1c80abc632d9d2c659ae0bf09` |
| lower reader | https://booklive.jp/bviewer/s/?cid=439092_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F439092%2Fvol_no%2F002 | `944920726ab9c257d44d488f375f52a35885dcd8fbd4216676e8b5c46bbc3022` |
| lower content manifest | https://d1cv2lzt22ijfr.cloudfront.net/439092/002/pub/binb/trial/content.js?dmytime=20170427150205 | `fcab73d8bc9bb4620505aaefce8bac3f06e69df7ef287a1fa2f007108f2a3a22` |

The lower product metadata contains `datePublished=2017-04-27`, title
`かよちゃんの荷物 新装版 下`, creator `雁須磨子`, publisher `竹書房`, and
ISBN `9784801959255`. The manifest has title `かよちゃんの荷物　新装版　下`,
`author="雁須磨子"`, `publisher="竹書房"`, and twelve ordered `P0000`–`P0011`
image entries. `L0000`–`L0011` are the same image sources for the opposite
reading layout and are not additional pages.

## Complete BookLive manifest enumeration

| manifest ID | image source | classification | count disposition |
| --- | --- | --- | --- |
| `P0000` | `pages/k4Nozhd5.jpg` | cover | excluded |
| `P0001` | `pages/9hAPeO_u.jpg` | blank front matter | excluded |
| `P0002` | `pages/2og2kAWR.jpg` | title/colour front matter | excluded |
| `P0003` | `pages/GOx2yQwx.jpg` | illustration gallery | excluded |
| `P0004` | `pages/WbURVRXf.jpg` | illustration gallery | excluded |
| `P0005` | `pages/tKM9GIm6.jpg` | illustration gallery | excluded |
| `P0006` | `pages/c4r2yM7F.jpg` | manifest BODY candidate; direct bytes tile-scrambled | not admitted |
| `P0007` | `pages/zDNOzQS9.jpg` | manifest BODY candidate; direct bytes tile-scrambled | not admitted |
| `P0008` | `pages/GAJPL0_6.jpg` | manifest BODY candidate; direct bytes tile-scrambled | not admitted |
| `P0009` | `pages/oYXQsaxB.jpg` | manifest BODY candidate; direct bytes tile-scrambled | not admitted |
| `P0010` | `pages/4SDjXxe4.jpg` | manifest BODY candidate; direct bytes tile-scrambled | not admitted |
| `P0011` | `pages/8hMOKUJ_.jpg` | manifest BODY candidate; direct bytes tile-scrambled | not admitted |

## Retrieved raw BODY candidates — not admitted

| page ref | temporary path | SHA-256 |
| --- | --- | --- |
| `booklive-lower-p006` | `/tmp/konocomics-batch005-pos39-recovery-round2/pages/c4r2yM7F.jpg` | `c70c9518ef30e2efca298a6d19cb1825b852ea4078d3c88265e9b8d3943089b8` |
| `booklive-lower-p007` | `/tmp/konocomics-batch005-pos39-recovery-round2/pages/zDNOzQS9.jpg` | `1d6eb3fd7d6302e78896b8f50b22ac70067c9b3019c65838b5aeab49765d5922` |
| `booklive-lower-p008` | `/tmp/konocomics-batch005-pos39-recovery-round2/pages/GAJPL0_6.jpg` | `5bee41954f2b5c97ee81f5d2e26469ae094e8dacfce2d4331539ac04f0c11fac` |
| `booklive-lower-p009` | `/tmp/konocomics-batch005-pos39-recovery-round2/pages/oYXQsaxB.jpg` | `1b1d87e53c218afe1a1ec1f41b72fd9740f7207be7e2a785f0c7fe7140c64325` |
| `booklive-lower-p010` | `/tmp/konocomics-batch005-pos39-recovery-round2/pages/4SDjXxe4.jpg` | `faef78011c5020ee9389e37e3155143677b9bfc6bbe1ec9ad10b93076b98e35e` |
| `booklive-lower-p011` | `/tmp/konocomics-batch005-pos39-recovery-round2/pages/8hMOKUJ_.jpg` | `6b11807a7bb66f79f2bde88ab4dd380d244ef47c58fec6eabd66483f888027bf` |

## BOOK☆WALKER fallback route inputs

| Edition | Product / inline trial entry | Status | Unique inline image paths |
| --- | --- | ---: | --- |
| upper | https://bookwalker.jp/de823a2c37-d79e-4358-82e2-c84b8acc9d33/ | 200 | 12: `p-cover.xhtml`, `p-001.xhtml`–`p-011.xhtml` |
| lower | https://bookwalker.jp/de90e7d72e-1f81-40ad-904b-9e0c6ed2de25/ | 200 | 12: `p-cover.xhtml`, `p-001.xhtml`–`p-011.xhtml` |

The signed full inline URLs, response inventory, and route screenshots are
preserved temporarily in `/tmp/konocomics-batch005-pos39-recovery-round2/`.
The inventory JSON SHA-256 is
`831d29f473cc14f3ca73d2557074ff11c53999702f361f23ffcb61769351feab`.
Upper and lower product titles both identify `かよちゃんの荷物 新装版`,
`雁須磨子`, and Bamboo Comics/竹書房. These fallback routes were not merged
with the selected BookLive sample.

## Route proof screenshots

| Capture | Path | SHA-256 |
| --- | --- | --- |
| BookLive lower reader | `/tmp/konocomics-batch005-pos39-recovery-round2/reader.png` | `053050ff10debc2400a07692dc138338198c96bfdb37724654ddd44f3ab3a746` |
| BOOK☆WALKER upper product/inline trial | `/tmp/konocomics-batch005-pos39-recovery-round2/bookwalker-upper.png` | `a58bba5391ca9a5e18ec10e03b9f2425ec28166e21cca5d2dcc6b5c8b51688c5` |
| BOOK☆WALKER lower product/inline trial | `/tmp/konocomics-batch005-pos39-recovery-round2/bookwalker-lower.png` | `682551d0a9f2324404650af86a9045abfc3d9cf7b4ae7dc9c6c70582389bb130` |

All temporary images remain outside the repository and are not Art values. The
six raw BODY candidates are retained only for hash audit: each is tile-scrambled,
and no decoded browser-rendered BODY capture exists in this packet.
