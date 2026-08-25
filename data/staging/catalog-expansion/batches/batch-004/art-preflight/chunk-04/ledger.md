# Batch 004 Art preflight — chunk 04

- scope: frozen positions 31–40
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- review scope: official-route access, exact entry-edition bridge, readable internal page counts, distinct visual contexts, and temporary capture hashes only
- excluded: every Art axis value, annotation, promotion, recommendation, and factor value
- image root: `/tmp/konocomics-batch004-art-chunk04`
- repository image mutation: none

## Gate contract

- The frozen representative ISBN and the official product or product-linked reader had to identify the same title, creator, and entry volume. A first episode was accepted only when an exact product-linked bridge bound it to that edition and entry scope.
- The route registry was applied publisher by publisher. Generic publisher trial catalogs were not treated as edition bridges. Hakusensha and Ohta are not present in the registry; their linked readers were recorded as excluded rather than promoted.
- `sample-ready` requires at least six readable internal body pages and at least two materially distinct contexts. Covers, title splashes, contents, ads, loading placeholders, and duplicated viewer shells were excluded from the counts.
- `motionGateAttemptable` is `true` only for one exact continuous start/development/impact/resolved sequence. No scoped work met that stricter requirement.
- All other terminal outcomes are `unknown-ready`; no Art value is assigned by this preflight.

## Result summary

| pos | workId                      | route                                               | readable pages | contexts | static | motion | state         |
| --: | --------------------------- | --------------------------------------------------- | -------------: | -------: | ------ | ------ | ------------- |
|  31 | `work-925f371723beac5227f7` | 講談社 product-linked ヤンマガWeb 第1話             |              6 |        3 | true   | false  | sample-ready  |
|  32 | `work-961a49798df191311f42` | 新潮社 product only                                 |              0 |        0 | false  | false  | unknown-ready |
|  33 | `work-9bd00739b995d84e2494` | 太田出版 product only; unregistered reader excluded |              0 |        0 | false  | false  | unknown-ready |
|  34 | `work-a3d922576a1a1ecc8e3e` | 白泉社 product only; unregistered reader excluded   |              0 |        0 | false  | false  | unknown-ready |
|  35 | `work-aa85b65d02f367e76a07` | 講談社 official trial                               |              1 |        1 | false  | false  | unknown-ready |
|  36 | `work-af3443bab1c30d470a76` | KADOKAWA product-linked BOOK☆WALKER                 |              0 |        0 | false  | false  | unknown-ready |
|  37 | `work-bd5c323a3dbc9f3a04d4` | 講談社 product-linked Comic DAYS 第1話              |              1 |        1 | false  | false  | unknown-ready |
|  38 | `work-c2df32661c0b925ff74f` | KADOKAWA product-linked BOOK☆WALKER                 |              0 |        0 | false  | false  | unknown-ready |
|  39 | `work-c2f3864045578cebb590` | スクウェア・エニックス product only                 |              0 |        0 | false  | false  | unknown-ready |
|  40 | `work-c5c2695ad33fd05af945` | 講談社 official trial                               |              1 |        1 | false  | false  | unknown-ready |

## Work notes and evidence

### 31 — 邪神の弁当屋さん

- Edition bridge: [講談社 volume 1 product](https://www.kodansha.co.jp/comic/products/0000404585) matches ISBN `9784065378557`. Its product-linked [ヤンマガWeb 第1話](https://yanmaga.jp/viewer/comics/%E9%82%AA%E7%A5%9E%E3%81%AE%E5%BC%81%E5%BD%93%E5%B1%8B%E3%81%95%E3%82%93/5e0f9d58735d88cea80648bd92847be6?cid=06A0000000000847698A) was used as the official internal source.
- Six readable body pages were retained as `reader-step-6`, `reader-step-8`, `reader-step-10`, `reader-step-12`, `reader-step-14`, and `reader-step-15`.
- Contexts: bakery and household; outdoor market and flower stall; city-history and wall tableau. These are materially distinct and satisfy the static gate.
- Hashes: `reader-step-6=ed0320975c2d2a6727c9b40ffef0eaedbe1e2ef440d6b0ee630c919ba5b583b3`; `reader-step-8=aeefe29218d852e60fdf0c43e78f39d4c5f6dd4f5de7aa9aafce83acd69cecd5`; `reader-step-10=8c87b5fbd023e7c821078172ffc2a3c4d3975d1daa5f451f9896f67fcbbb69e1`; `reader-step-12=fcdd9ba008b2ad2f6f68038ea38e5fe9d262f8f4d447e70bbe835d15c20b381a`; `reader-step-14=eef7b2f37f5506f860b2a0831e639925476c6ae019b4dd2b7aa924a762286fa7`; `reader-step-15=cd7b3b166c940c8d28bb096ee28d9f9314216cbff0c8c78a6770e7b50672298e`.
- The direct 講談社 trial exposed only five page slots, so the product-linked first episode was the only route that reached the six-page threshold. No exact bounded continuous start/development/impact/resolved motion sequence was isolated.

### 32 — 働かないふたり

- [新潮社 volume 1 product](https://www.shinchosha.co.jp/book/771744/) matches ISBN `9784107717443` and the exact title/creator/volume.
- No work-specific internal trial was exposed. The generic `tryme` catalog was excluded by the route registry. This is `official-product-only` with zero captures.

### 33 — あした死ぬには、

- [太田出版 volume 1 product](https://www.ohtabooks.com/publish/2019/06/12000000.html) matches ISBN `9784778323011` and the exact title/creator/volume.
- The product-linked YONDEMILL trial was observed but excluded because 太田出版 has no trusted route-registry entry. This remains `official-product-only` with zero captures.

### 34 — ドカ食いダイスキ！ もちづきさん

- [白泉社 volume 1 product](https://www.hakusensha.co.jp/comicslist/72311/) matches ISBN `9784592160311` and the exact title/creator/volume.
- The product-linked 白泉社e-net reader was observed but excluded because 白泉社 has no trusted route-registry entry. This remains `official-product-only` with zero captures.

### 35 — ディグイット

- [講談社 volume 1 trial](https://www.kodansha.co.jp/comic/products/0000413972/trial) maps product `0000413972` to ISBN `9784065398043`.
- The reader exposed one readable internal story page after cover, title, and contents assets were excluded. It shows one sports-introduction context; the six-page and two-context gate fails.
- Capture: `reader-p5=405724e5956552c04ea208fe9a1405508b36a92966962ee8ff9692391306901f`.

### 36 — 坂本ですが?

- [KADOKAWA volume 1 product](https://www.kadokawa.co.jp/product/201211000248) matches ISBN `9784047286337` and links the exact licensed [BOOK☆WALKER trial](https://bookwalker.jp/deefae4a8f-92f6-4093-8a11-61ce9bea897d/?adpcnt=g2vvr2xz&utm_source=kadokawa.co.jp&utm_medium=referral&utm_campaign=button&sample=1&from=1).
- The product-linked viewer redirected to the official trial viewer but did not finish loading readable internal pages within the bounded preflight. No captures or hashes were retained.

### 37 — 来世は他人がいい

- [講談社 volume 1 product](https://www.kodansha.co.jp/comic/products/0000052167) matches ISBN `9784065103760` and links [Comic DAYS 第1話](https://comic-days.com/episode/13932016480029553694).
- One readable internal body canvas was retained from the traditional-house introduction. The six-page and two-context gate fails.
- Capture: `episode-01-page-00=de4a459e2e52edbcb57c034ac72da76efc727a2c39bb9093fb1efcf0f526d4be`.

### 38 — カラオケ行こ！

- [KADOKAWA single-volume product](https://www.kadokawa.co.jp/product/322002001211/) matches ISBN `9784047361515` and links the exact licensed [BOOK☆WALKER trial](https://bookwalker.jp/de542153af-b038-486c-9d6b-e58d0548ba2b/?adpcnt=g2vvr2xz&utm_source=kadokawa.co.jp&utm_medium=referral&utm_campaign=button&sample=1&from=1).
- The product-linked viewer redirected to the official trial viewer but did not finish loading readable internal pages within the bounded preflight. No captures or hashes were retained.

### 39 — となりの猫と恋知らず

- [スクウェア・エニックス volume 1 product](https://magazine.jp.square-enix.com/top/comics/detail/9784757591264/) matches ISBN `9784757591264` and the exact title/creator/volume.
- No product-linked Gangan Online chapter was exposed. The registry requires that chapter bridge for sampling, so this remains `official-product-only` with zero captures.

### 40 — カッコウの許嫁

- [講談社 volume 1 trial](https://www.kodansha.co.jp/comic/products/0000341183/trial) maps product `0000341183` to ISBN `9784065193808`.
- The reader exposed one readable internal story page after cover, title, and contents assets were excluded. It shows one hospital-introduction context; the six-page and two-context gate fails.
- Capture: `reader-p5=e247a15b86db560c981b7c6498db40771cc807f475fca87c1d52c7c5102815da`.

## Verification boundary

- The CSV has exactly the prescribed 17 columns and ten scoped rows.
- Every retained hash names a file under `/tmp/konocomics-batch004-art-chunk04`; no image is stored in the repository.
- `reviewedByHuman=false` is preserved and no Art values are present. `sample-ready` is a preflight state only and is not an Art annotation or promotion decision.
