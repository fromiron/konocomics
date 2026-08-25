# Batch 004 chunk 04 identity, safety, and edition review

- reviewDate: 2026-08-25
- reviewer: Local Codex independent review
- reviewedByHuman: `false`
- reviewedRange: frozen positions 31–40
- scope: canonical identity, Japanese manga scope, safety, representative ISBN, edition mapping, and series relations
- excluded: Factor values, Genre, Theme, Art values, recommendation context, annotation, and promotion
- sourceMutation: none

The review compares the frozen manifest and official-first research with current `works.csv`, `volumes.csv`, `canonical-mapping.csv`, `rakuten-matches.csv`, `safety-review.csv`, and `promotion-registry.csv`. Each scoped Work ID and exact canonical title occurs once in `data/source/works.csv`; each representative ISBN has one representative row in `data/source/volumes.csv`, one exact standard Rakuten product bridge, and no ISBN collision with another source volume. All ten ISBN-13 values pass checksum validation.

Japanese manga scope is established by Japanese publisher or rightsholder product pages, creator/imprint bindings, and a matched standard paper ISBN. `あした死ぬには、` also has an official webcomic serialization, but its collected Japanese comic volume and ISBN are explicit; it is not a webtoon-only identity. Rakuten does not expose a reliable nationality or original-format field, so no nationality inference is made.

Safety means the matched Work and edition are not sold as R18, 成人向け, 成年コミック, adult-only BL/TL, or equivalent restricted products. Yakuza violence, a minor/adult relationship premise, disease and death, or extreme eating are content-review leads, not automatic adult blocks. All ten current safety rows are `safe`, and the official product pages use ordinary commercial comic imprints.

## Summary

| Pos | workId | canonicalTitle | representative ISBN | identity / edition | safety / scope | Verdict |
| --: | --- | --- | --- | --- | --- | --- |
| 31 | `work-925f371723beac5227f7` | 邪神の弁当屋さん | `9784065378557` | 講談社 standard volume 1; current title page keeps the same series identity | ordinary 講談社 comic; war/monster premise is not adult-only | PASS |
| 32 | `work-961a49798df191311f42` | 働かないふたり | `9784107717443` | 新潮社 BUNCH COMICS standard volume 1; related volumes retain one series identity | ordinary comic; NEET-family comedy is not adult-only | PASS |
| 33 | `work-9bd00739b995d84e2494` | あした死ぬには、 | `9784778323011` | 太田出版 standard paper volume 1; official webcomic-to-print mapping is same Work | ordinary comic; illness, aging, and death themes are not adult-only | PASS |
| 34 | `work-a3d922576a1a1ecc8e3e` | ドカ食いダイスキ！ もちづきさん | `9784592160311` | 白泉社 ヤングアニマルコミックス standard volume 1 | ordinary comic; extreme eating/health risk is not adult-only | PASS |
| 35 | `work-aa85b65d02f367e76a07` | ディグイット | `9784065398043` | 講談社 standard volume 1; later volumes and limited products remain edition variants | ordinary アフタヌーン comic; sports conflict is not adult-only | PASS |
| 36 | `work-af3443bab1c30d470a76` | 坂本ですが? | `9784047286337` | KADOKAWA ハルタコミックス standard volume 1; official `？` is punctuation-normalized to canonical `?` | ordinary school comic; no adult-only marker | PASS |
| 37 | `work-bd5c323a3dbc9f3a04d4` | 来世は他人がいい | `9784065103760` | 講談社 standard volume 1; current title page keeps one series identity | ordinary comic; yakuza violence is a content lead, not adult-only | PASS |
| 38 | `work-c2df32661c0b925ff74f` | カラオケ行こ！ | `9784047361515` | KADOKAWA ビームコミックス single standard volume; sequel is separate | ordinary comic; yakuza/minor relationship premise requires context review, not adult-only classification | PASS |
| 39 | `work-c2f3864045578cebb590` | となりの猫と恋知らず | `9784757591264` | スクウェア・エニックス standard volume 1; same title page lists the continuing series | ordinary ビッグガンガン comic; school first-love premise is not adult-only | PASS |
| 40 | `work-c5c2695ad33fd05af945` | カッコウの許嫁 | `9784065193808` | 講談社 standard volume 1; current title page keeps one series identity | ordinary shonen comic; high-school engagement premise is not adult-only | PASS |

## Per-work evidence and edition checks

### 31 — 邪神の弁当屋さん

- Official evidence: [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000404585) — published 2025-01-20; retrievedAt 2026-08-25. The page binds the title, creator イシコ, and ISBN `9784065378557` to a standard comic volume.
- Series check: [講談社 title page](https://www.kodansha.co.jp/titles/1000047807) lists the same title's collected volumes; no competing canonical title or spin-off is merged.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/18045058/) — exact normalized title/creator, standard edition, ISBN `9784065378557`; checkedAt 2026-08-22. Safety staging is `safe`.

### 32 — 働かないふたり

- Official evidence: [新潮社 volume 1](https://www.shinchosha.co.jp/book/771744/) — published 2014-05-09; retrievedAt 2026-08-25. The page identifies 吉田覚, BUNCH COMICS, comic format, and ISBN `9784107717443`.
- Series check: the official page's related-volume list keeps volumes 2 and 3 under `働かないふたり`; no duplicate work or adult-only edition is indicated.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/12724392/) — exact normalized title/creator, standard edition, ISBN `9784107717443`; checkedAt 2026-08-22. Safety staging is `safe`.

### 33 — あした死ぬには、

- Official evidence: [太田出版 volume 1](https://www.ohtabooks.com/publish/2019/06/12000000.html) — published 2019-06-12; retrievedAt 2026-08-25. The page identifies 雁須磨子, comic format, and ISBN `9784778323011`.
- Edition/format check: [official webcomic series page](https://webcomic.ohtabooks.com/ashita/) maps the web serialization to the collected volumes; the frozen standard paper ISBN remains the representative edition. This is a Japanese manga serialization/collection, not a webtoon-only replacement.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/15898729/) — exact normalized title/creator, standard edition, ISBN `9784778323011`; checkedAt 2026-08-22. Safety staging is `safe`.

### 34 — ドカ食いダイスキ！ もちづきさん

- Official evidence: [白泉社 volume 1](https://www.hakusensha.co.jp/comicslist/72311/) — published 2024-10-29; retrievedAt 2026-08-25. The page identifies まるよのかもめ, ヤングアニマルコミックス, and ISBN `9784592160311`.
- Edition check: the official volume 1–3 product pages in the frozen packet use the same title and series; no duplicate, remake, or spin-off is merged into the representative row.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/17983412/) — exact normalized title/creator, standard edition, ISBN `9784592160311`; checkedAt 2026-08-22. Safety staging is `safe`.

### 35 — ディグイット

- Official evidence: [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000413972) — published 2025-08-22; retrievedAt 2026-08-25. The page binds ヨシダ。, the title, and ISBN `9784065398043` to a standard comic volume.
- Series/edition check: [アフタヌーン official series page](https://afternoon.kodansha.co.jp/c/digit/) continues the same title through later volumes; later limited-cover products do not replace the frozen volume 1.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/18217869/) — exact normalized title/creator, standard edition, ISBN `9784065398043`; checkedAt 2026-08-22. Safety staging is `safe`.

### 36 — 坂本ですが?

- Official evidence: [KADOKAWA volume 1](https://www.kadokawa.co.jp/product/201211000248) — published 2013-01-15; retrievedAt 2026-08-25. The official title uses full-width `？`; title, creator 佐野菜見, ハルタコミックス, and ISBN `9784047286337` match after the canonical ASCII punctuation normalization.
- Edition check: official volume 2 and 3 pages in the frozen packet continue the same title; no duplicate or spin-off is merged into the volume 1 representative.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/12127522/) — exact normalized title/creator, standard edition, ISBN `9784047286337`; checkedAt 2026-08-22. Safety staging is `safe`.

### 37 — 来世は他人がいい

- Official evidence: [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000052167) — published 2017-11-22; retrievedAt 2026-08-25. The page identifies 小西明日翔, the title, and ISBN `9784065103760`.
- Series check: [講談社 title page](https://www.kodansha.co.jp/titles/1000030107) lists the continuing collected series under the same title; anime and related notices do not replace the standard manga edition.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/15182068/) — exact normalized title/creator, standard edition, ISBN `9784065103760`; checkedAt 2026-08-22. Safety staging is `safe`.

### 38 — カラオケ行こ！

- Official evidence: [KADOKAWA single-volume page](https://www.kadokawa.co.jp/product/322002001211/) — published 2020-09-12; retrievedAt 2026-08-25. The page identifies 和山やま, ビームコミックス, and ISBN `9784047361515`; no volume number is required because this is a single collected volume.
- Series relation check: [ファミレス行こ。 上](https://www.kadokawa.co.jp/product/322308000882/) is explicitly described by KADOKAWA as a sequel and has a distinct ISBN (`9784047377479`); it remains a separate title and is excluded from this Work's representative edition.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/16353169/) — exact normalized title/creator, standard edition, ISBN `9784047361515`; checkedAt 2026-08-22. Safety staging is `safe`.

### 39 — となりの猫と恋知らず

- Official evidence: [スクウェア・エニックス volume 1](https://magazine.jp.square-enix.com/top/comics/detail/9784757591264/) — published 2024-03-25; retrievedAt 2026-08-25. The page identifies あきのこ, ビッグガンガン, and ISBN `9784757591264`.
- Series check: [ビッグガンガン official series page](https://magazine.jp.square-enix.com/biggangan/introduction/tonarinoneko/) lists the continuing same-title series; later volumes are not duplicate Works or replacement editions.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/17788427/) — exact normalized title/creator, standard edition, ISBN `9784757591264`; checkedAt 2026-08-22. Safety staging is `safe`.

### 40 — カッコウの許嫁

- Official evidence: [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000341183) — published 2020-05-15; retrievedAt 2026-08-25. The page identifies 吉河美希, the title, and ISBN `9784065193808`.
- Series check: [講談社 title page](https://www.kodansha.co.jp/titles/1000036978) lists the same collected series and later volumes; anime notices do not create a second Work or edition identity.
- Product bridge: [Rakuten Books](https://books.rakuten.co.jp/rb/16208859/) — exact normalized title/creator, standard edition, ISBN `9784065193808`; checkedAt 2026-08-22. Safety staging is `safe`.

All ten canonical titles are free of decorative `『` and `』` delimiters. No scoped Work ID, exact title, representative ISBN, or standard edition bridge collides with another current catalog Work. This review does not change annotation, safety staging, promotion registry, or any source/target data.
