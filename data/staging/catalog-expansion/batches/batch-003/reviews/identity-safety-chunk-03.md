# Batch 003 chunk 03 identity, safety, and edition review

- reviewDate: 2026-08-23
- reviewer: Local Codex independent review
- reviewedByHuman: `false`
- reviewedRange: frozen positions 21–30
- scope: canonical identity, safety and scope, representative ISBN, edition mapping, and source metadata
- excluded: Factor values, Genre, Theme, Art, recommendation context, and promotion
- sourceMutation: none

The review compares the frozen set and research packet with current `works.csv`, `volumes.csv`, `canonical-mapping.csv`, `rakuten-matches.csv`, `safety-review.csv`, `promotion-registry.csv`, and the recorded chunk-03 Art preflight edition bridges. All ten representative ISBN-13 values pass checksum validation and each occurs exactly once in `data/source/volumes.csv`; every scoped Work ID and exact canonical title also occurs once in `data/source/works.csv`. These are catalog collision checks, not external identity sources.

Rakuten has no reliable nationality or original-format field. No nationality-inference test is added. Japanese manga scope is established from official Japanese publisher or rightsholder pages, creator and comics-imprint bindings, and the matched paper edition.

Safety means the matched Work and edition are not sold as R18, 成人向け, 成年コミック, adult-only BL/TL, or an equivalent restricted product. Terrorism and combat, a murder fantasy, hunting and animal disassembly, a minor/vampire relationship, hell punishments, or adult sexual-life topics are review leads rather than automatic adult blocks.

## Summary

| Pos | workId                      | canonicalTitle             | representative ISBN | identity / edition                                                                                                          | safety / scope                                                                                  | Verdict                 |
| --: | --------------------------- | -------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------- |
|  21 | `work-7a4e7ba45413e1b8af34` | 青空エール                 | `9784088463667`     | 集英社 original paper standard volume 1; official text and reader are a later electronic remaster                           | ordinary マーガレットコミックス                                                                 | PASS_WITH_EDITION_LIMIT |
|  22 | `work-7abb6e8396c5e1252173` | 甘々と稲妻                 | `9784063879179`     | 講談社 standard volume 1                                                                                                    | ordinary アフタヌーンKC; teacher/student shared meals are a context lead, not an adult category | PASS                    |
|  23 | `work-81c561ca6bb74a301cf8` | ライドンキング             | `9784065142103`     | 講談社 standard volume 1                                                                                                    | terrorism, combat, and monsters are violence leads                                              | PASS                    |
|  24 | `work-83510afea8d961aec880` | 俺はまだ本気出してないだけ | `9784091883773`     | 小学館 original standard volume 1; official JDCN preview maps to the paper ISBN                                             | ordinary 月刊IKKI manga                                                                         | PASS                    |
|  25 | `work-84a6a139c55f2760544e` | 僕の心のヤバイやつ         | `9784253226158`     | 秋田書店 standard volume 1; the later volume-3 special edition is a separate product                                        | ordinary 少年チャンピオン・コミックス; murder fantasy is a content lead                         | PASS                    |
|  26 | `work-88e75622b83b794c03ac` | 山賊ダイアリー             | `9784063523911`     | 講談社 standard volume 1                                                                                                    | hunting, firearms, animal death, and disassembly are content leads                              | PASS                    |
|  27 | `work-9036a98c069b5ef8cd54` | よふかしのうた             | `9784091294920`     | 小学館 standard volume 1; official JDCN preview maps to the paper ISBN                                                      | ordinary 少年サンデーコミックス; minor/vampire romance is a context lead                        | PASS                    |
|  28 | `work-98637340992f2f50107d` | いつかティファニーで朝食を | `9784107716774`     | 新潮社 standard volume 1                                                                                                    | ordinary BUNCH COMICS; adult relationship content is not adult-only sales                       | PASS                    |
|  29 | `work-a25bac53b4757f13f21a` | 鬼灯の冷徹                 | `9784063870176`     | 講談社 standard volume 1                                                                                                    | hell punishment and sadistic behavior are content leads                                         | PASS                    |
|  30 | `work-a4ca6e21e97927928e1a` | 喰う寝るふたり住むふたり   | `9784199801198`     | original ノース・スターズ・ピクチャーズ standard volume 1; current Coamix original-series bridge; 2021 new edition excluded | ordinary commercial manga; adult cohabitation and sexual-life topics are not adult-only sales   | PASS                    |

## Edition-sensitive cases

### 青空エール

- The exact Rakuten paper product binds title, creator, マーガレットコミックス volume 1, and ISBN `9784088463667`. The 集英社 page binds the same title and creator and records the paper release on 2008-12-25.
- The available official digital item is explicitly a 2012 remaster that restores color manuscript material. The recorded Art preflight found no official page-equivalence bridge to the frozen original paper ISBN and retained no remaster page.
- Verdict: retain the Work ID and original standard representative ISBN. The remaster may support its bounded text, but its pagination and edition-specific visual material cannot be transferred to the paper edition without an explicit bridge.

### 僕の心のヤバイやつ

- The official volume-1 page directly binds the canonical title, creator, standard 少年チャンピオン・コミックス product, and ISBN `9784253226158`.
- 秋田書店 separately lists standard volume 3 as ISBN `9784253226172` and its special edition with an added booklet as ISBN `9784253226189`. Neither is the representative volume-1 product, a set, or a duplicate Work.
- Verdict: retain the Work ID and standard volume-1 ISBN. Do not substitute the special-edition product or transfer its booklet-only material to the standard edition.

### 喰う寝るふたり住むふたり

- The current Coamix rights-holder page identifies the completed original five-volume series as Work `z_R0017` and links the original-series listing whose first volume carries ISBN `9784199801198`. Recorded official page assets use the `z_R0017_001` volume-1 prefix.
- The 2021 Coamix notice explicitly labels a separately covered `新装版`. It does not replace the frozen original standard ISBN or license page-reference transfer from the new edition.
- Coamix displays the title with an internal presentation space, while the original product and frozen canonical row use `喰う寝るふたり住むふたり`. This whitespace variation and decorative `『』` wrappers in prose are not a second Work or a canonical-title delimiter.
- Verdict: retain the Work ID, canonical title, original representative ISBN, and current source publisher metadata. Keep original and new-edition Evidence explicitly separated.

## Evidence

- 集英社 青空エール 1 electronic remaster: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846366846366345501 — digital release 2012-06-15; paper release 2008-12-25; retrieved 2026-08-23
- Rakuten Books 青空エール（1）: https://books.rakuten.co.jp/rb/5922968/ — publication year 2008; retrieved 2026-08-23
- 講談社 甘々と稲妻 1: https://www.kodansha.co.jp/comic/products/0000047277 — 2013-09-06; retrieved 2026-08-23
- 講談社 ライドンキング 1: https://www.kodansha.co.jp/comic/products/0000318782 — 2019-01-09; retrieved 2026-08-23
- 小学館eコミックストア 俺はまだ本気出してないだけ 1: https://e-comi.shogakukan.co.jp/books/091883770000d0000000 — paper release 2007-10-30; retrieved 2026-08-23
- 秋田書店 僕の心のヤバイやつ 1: https://www.akitashoten.co.jp/comics/4253226159 — 2018-12-07; retrieved 2026-08-23
- 秋田書店 僕の心のヤバイやつ 3 standard: https://www.akitashoten.co.jp/comics/4253226175 — 2020-06-08; retrieved 2026-08-23
- 秋田書店 僕の心のヤバイやつ 3 special edition: https://www.akitashoten.co.jp/comics/4253226183 — 2020-06-08; retrieved 2026-08-23
- 講談社 山賊ダイアリー 1: https://www.kodansha.co.jp/comic/products/0000038783 — 2011-12-22; retrieved 2026-08-23
- 小学館eコミックストア よふかしのうた 1: https://e-comi.shogakukan.co.jp/books/091294920000d0000000 — 2019-11-18; retrieved 2026-08-23
- 新潮社 いつかティファニーで朝食を 1: https://www.shinchosha.co.jp/book/771677/ — 2012-09-07; retrieved 2026-08-23
- 講談社 鬼灯の冷徹 1: https://www.kodansha.co.jp/comic/products/0000018223 — 2011-05-23; retrieved 2026-08-23
- Coamix 喰う寝るふたり 住むふたり original-series page: https://catalog.coamix.co.jp/kuuneru/ — series start 2012-02-25; retrieved 2026-08-23
- コミックシーモア 喰う寝るふたり住むふたり original series: https://www.cmoa.jp/title/67697/ — undated; retrieved 2026-08-23
- Coamix 喰う寝るふたり 住むふたり new-edition notice: https://www.coamix.co.jp/topics/j1p2sfbvd28v — 2021-08-20; retrieved 2026-08-23

No canonical title, Work ID, ISBN, publisher field, safety row, source row, or eligibility data is changed by this review. `『』` is absent from all ten canonical titles; the wrappers shown by 新潮社 and Coamix are delimiters and remain excluded. No scoped ISBN, Work ID, exact title, or normalized edition identity collides with another current catalog Work.
