# Batch 004 Art preflight recovery — position 21

- scope: frozen Batch 004 position 21 only
- workId: `work-53fb816835ab36e40a1f`
- canonicalTitle: `アンデッドアンラック`
- creator: `戸塚 慶文`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- promotionPerformed: `false`
- acquisition boundary: 集英社 official product pages, their official 試し読み links, and the linked `mangabroadcast.jp` reader/API only; no retailer or unregistered reader was substituted

## Frozen identity and edition bridge

| Item                           | Value                                                                       |
| ------------------------------ | --------------------------------------------------------------------------- |
| frozen representative ISBN     | `9784088823102`                                                             |
| official vol. 1 product        | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882310-2 |
| official vol. 2 product        | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882330-0 |
| official vol. 3 product        | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882404-8 |
| vol. 1 release / standard form | `2020-04-03` / `新書判`                                                     |
| vol. 2 release / standard form | `2020-06-04` / `新書判`                                                     |
| vol. 3 release / standard form | `2020-09-04` / `新書判`                                                     |
| product creator                | `戸塚 慶文`                                                                 |
| product series                 | `アンデッドアンラック`                                                      |
| vol. 2 reader                  | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300          |
| vol. 3 reader                  | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088824048          |
| vol. 2 reader ContentID        | `9784088823300`                                                             |
| vol. 3 reader ContentID        | `9784088824048`                                                             |
| vol. 2/3 reader API identity   | `戸塚 慶文` / `集英社` / matching volume title                              |

The frozen work row and source volume row identify `9784088823102` as the standard representative vol. 1 edition. The official vol. 1 product JSON links the next volume ISBN `978-4-08-882330-0`; the vol. 2 product JSON identifies title, creator, release date, standard form, and the official reader URL. The same bridge was independently checked for vol. 3 (`978-4-08-882404-8`). The reader API returned the matching ContentID, title, author, and publisher for both later volumes. No special, set, limited, or alternate edition was used for the captures.

## Official route and capture verification

The publisher route registry directs 集英社 trials through the exact product ISBN to `reader/main.php?cid=...`. The vol. 2 and vol. 3 pages expose an ordered `content.js` page sequence with 29 and 25 reader page entries respectively. The official reader was opened at `adr` positions using Playwright Chromium; transient screenshots were written under `/tmp/konocomics-batch004-art03-recovery/` only. The browser UI button at the bottom is reader chrome and was not treated as page content.

Supporting transient payload hashes:

| artifact                             | SHA-256                                                            |
| ------------------------------------ | ------------------------------------------------------------------ |
| vol. 2 reader HTML                   | `507c5b3dc3ffbaeafdc7f29aad64dcf1e215f21de79f378cd68d99f25e8d5b98` |
| vol. 3 reader HTML                   | `60236d6255ad7d055834594a0e094f71d79ba61ed275be8476b2fd8ff1d6ca5d` |
| vol. 2 reader API JSON               | `190ef147b24da1e84ce73e421b4726e098aa0e031afe707f22db44c434777c9f` |
| vol. 3 reader API JSON               | `51f7f3d5aa427264c14f20e426f352b268c4b51ebafd52dc794033883c25538c` |
| vol. 2 content.js                    | `7b3bee8dadba7b07e684244dc11b5c1f600c5fcd819c0b90cb248cb62a0cd2af` |
| vol. 3 content.js                    | `665deb37207e8b0df094cba2d71e446c6e4876f644cae8ad351fa802df085100` |
| vol. 1 product HTML                  | `a5138303bd5818723a64e3766084d4d5efc2bef7481b0b3cb7f06c52f314f496` |
| vol. 2 product HTML                  | `1d75f4fdc96e02606ba5d3d7274848f1aa7bde13bf8a1b8373a2bca63ced6aef` |
| vol. 3 product HTML                  | `9c45f8638c3a67c08da841649f38db53185a71ae90ffb4df3220e926b6f09cfe` |
| publisher route registry at recovery | `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28` |

The vol. 2 reader HTML hash above is recorded from the transient download; the route and API hashes are the identity evidence used for this recovery.

## Selected internal page sample

All six selected refs are body pages, not cover, title, synopsis, or character-profile material.

| page ref              | official reader URL                                                       | body/context observation                     | temporary capture SHA-256                                          |
| --------------------- | ------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| `shueisha-vol2-adr08` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300&adr=8  | barrier encounter and impact/action panels   | `54bd7a74527d6dabb8ee4fb303661cb6d1f3e262f722b1d736258dd5e7a79090` |
| `shueisha-vol2-adr12` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300&adr=12 | outdoor ability exchange and group reaction  | `e0584d9fe82425db2c5210d31ec920de5f317dc937600ec54dd4d0a474a0a93d` |
| `shueisha-vol2-adr14` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300&adr=14 | movement/aftermath and character interaction | `59d32287740794112af36811d8507a8bf4ac7a27a9be7a88a7f820ae7bcafac5` |
| `shueisha-vol2-adr16` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300&adr=16 | dialogue and group/scene transition          | `9d9ee0f6d157b51429d0ce448886d89bee2c60979c36ddb7a17d4d4e20e55034` |
| `shueisha-vol3-adr16` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088824048&adr=16 | character interaction and outdoor setting    | `659b8692cec31290069445f3033981a861a7d17aae53372db08ffb8c4e5aa7b9` |
| `shueisha-vol3-adr18` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088824048&adr=18 | battle/action panels with multiple figures   | `07fcd3a1b2a5b4153ee28b8f73809cb82061ad503d97955e8cc8c552db9956f4` |

The six retained reader frames each show a readable numbered body spread. They support exactly two distinct scene contexts: the vol. 2 barrier battle and aftermath exchange, and the vol. 3 outdoor confrontation and battle. The static sample gate is therefore attemptable (`6` readable body-page frames and `2` contexts). This opens independent static Art review; it assigns no Art values here.

## Motion disposition

The captures contain action imagery, but this recovery did not establish a single exact bounded continuous sequence that begins with a clearly identified request/preparation, develops through the action, and ends at a resolved impact/reaction. `motionGateAttemptable=false` is therefore intentional. `motionImpact` must remain unknown unless a later reviewer independently establishes that complete sequence from exact contiguous reader references.

## Closure

This bounded recovery supersedes the earlier vol. 1-only `one-context` preflight for position 21 by documenting official vol. 2/3 product-to-reader bridges and a six-frame, two-context sample. It does not modify the existing terminal `final-art.csv`, source data, generated catalog, promotion registry, or any Factor value. `reviewedByHuman=false`, `temporaryImagesCommitted=false`, and `FactorValuesAssigned=false` remain explicit.
