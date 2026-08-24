# Batch 003 chunk 02 identity, safety, and edition review

- reviewDate: 2026-08-23
- reviewer: Local Codex independent review
- reviewedByHuman: `false`
- reviewedRange: frozen positions 11–20
- scope: canonical identity, safety and scope, representative ISBN, edition mapping, and source metadata
- excluded: Factor values, Genre, Theme, Art, recommendation context, and promotion
- sourceMutation: none

The review compares the frozen set and research packet with current `works.csv`, `volumes.csv`, `canonical-mapping.csv`, `rakuten-matches.csv`, `safety-review.csv`, and `promotion-registry.csv`. Every representative ISBN occurs once in `data/source/volumes.csv`; this is a catalog collision check, not an external identity source.

Rakuten has no reliable nationality or original-format field. No nationality-inference test is added. Japanese manga scope is established from official Japanese publisher or rightsholder pages, creator and imprint bindings, and the matched paper edition.

Safety means the matched work and edition are not sold as R18, 成人向け, 成年コミック, adult-only BL/TL, or an equivalent restricted product. Violence, sexual content between adults, an age-gap household premise, or another sensitive subject is a review lead rather than an automatic adult block.

## Summary

| Pos | workId | canonicalTitle | representative ISBN | identity / edition | safety / scope | Verdict |
| --: | --- | --- | --- | --- | --- | --- |
| 11 | `work-29806fe5f9633b940747` | 暗殺教室 | `9784088705965` | 集英社 standard volume 1 | ordinary ジャンプコミックス; assassination and abduction are violence leads | PASS |
| 12 | `work-319e39a597d16251efc9` | 乱と灰色の世界 | `9784047261457` | KADOKAWA standard volume 1 and continuous volumes 1–3 | ordinary commercial manga; the child/adult-desire juxtaposition is a context lead | PASS |
| 13 | `work-3ba6e8e3cfdec674eae3` | 劇光仮面 | `9784098613632` | 小学館 standard volume 1 | ordinary ビッグコミックス; crime and trial are content leads | PASS |
| 14 | `work-40ea287aae6305289cf6` | その着せ替え人形は恋をする | `9784757559202` | スクウェア・エニックス standard volume 1 | ordinary ヤングガンガンコミックス | PASS |
| 15 | `work-550854424fc9cc94d585` | 高杉さん家のおべんとう | `9784040661001` | current KADOKAWA record and Rakuten standard product map the frozen ISBN; early Media Factory lineage remains an edition-use limit | guardian/child cohabitation is a context lead, not an adult-only category | PASS_WITH_EDITION_LIMIT |
| 16 | `work-5baea1ce0e7e74df34b9` | 刻刻 | `9784063728224` | 講談社 standard volume 1 | kidnapping, strong violence, death, and a religious group are content leads | PASS |
| 17 | `work-672862529a341488245b` | BUTTER！！！ | `9784063106824` | 講談社 standard volume 1; full-width triple exclamation retained | ordinary commercial manga; body-shaming and interpersonal distress are context leads | PASS |
| 18 | `work-680837b0db4ec9d2932c` | トクサツガガガ | `9784091866066` | 小学館 standard volume 1 | ordinary ビッグコミックス | PASS |
| 19 | `work-724c064d491faf4c7414` | もやしもん | `9784063521061` | 講談社 original standard volume 1; later shinsoban is the same Work but not the representative edition | ordinary commercial manga | PASS |
| 20 | `work-78d44d381562e37dd94a` | きょうは会社休みます。 | `9784088467696` | Rakuten exact standard product maps the print ISBN; current 集英社 content pages are JDCN electronic records | both partners are adults; sexual content and age difference do not establish adult-only sales | PASS_WITH_EDITION_LIMIT |

## Edition-limited cases

### 高杉さん家のおべんとう

- The current KADOKAWA volume-1 record directly binds title, creator, release date, volume number, and ISBN `9784040661001`. The current Rakuten product independently matches the same title, creator, volume, standard-edition class, and ISBN.
- The earlier Media Factory imprint lineage does not create a second canonical Work or invalidate the standard ISBN. It limits use of an internal preview unless its edition relationship is explicit.
- Verdict: retain the Work ID and representative ISBN; require an explicit bridge before transferring page references between editions.

### きょうは会社休みます。

- The current 集英社 volume descriptions bind the same title, creator, and paper publication dates but use JDCN electronic identifiers. The frozen print ISBN is independently mapped by an exact Rakuten standard-volume product and the catalog candidate record.
- The JDCN pages may support their scoped text descriptions. They do not by themselves prove print pagination or license page-reference transfer to the paper edition.
- Verdict: retain the Work ID and representative print ISBN; record the electronic-to-print limitation for page-level Evidence.

## Evidence

- 集英社 暗殺教室 1: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870596-5 — 2012-11-02; retrieved 2026-08-23
- KADOKAWA 乱と灰色の世界 1: https://www.kadokawa.co.jp/product/200908000223/ — 2009-11-16; retrieved 2026-08-23
- 小学館 劇光仮面 1: https://www.shogakukan.co.jp/books/09861363 — 2022-05-30; retrieved 2026-08-23
- スクウェア・エニックス その着せ替え人形は恋をする 1: https://magazine.jp.square-enix.com/top/comics/detail/9784757559202/ — 2018-11-24; retrieved 2026-08-23
- KADOKAWA 高杉さん家のおべんとう 1: https://www.kadokawa.co.jp/product/302408001751/ — 2010-01-23; retrieved 2026-08-23
- Rakuten Books 高杉さん家のおべんとう 1: https://books.rakuten.co.jp/rb/17971343/ — publication year 2010; retrieved 2026-08-23
- 講談社 刻刻 1: https://www.kodansha.co.jp/comic/products/0000013948 — 2009-08-21; retrieved 2026-08-23
- 講談社 BUTTER！！！ 1: https://www.kodansha.co.jp/comic/products/0000029740 — 2010-07-23; retrieved 2026-08-23
- 小学館 トクサツガガガ 1: https://www.shogakukan.co.jp/books/09186606 — 2014-11-28; retrieved 2026-08-23
- 講談社 もやしもん 1: https://www.kodansha.co.jp/comic/products/0000038500 — 2005-05-21; retrieved 2026-08-23
- 集英社 きょうは会社休みます。 1: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846769846769315501 — paper publication 2012-04-25; retrieved 2026-08-23
- Rakuten Books きょうは会社休みます。（1）: https://books.rakuten.co.jp/rb/11603974/ — publication year 2012; retrieved 2026-08-23

No title delimiter, Work ID, ISBN, publisher field, first-published year, safety row, or source row is changed by this review. Decorative `『』` remains absent; meaningful punctuation in `BUTTER！！！` and `きょうは会社休みます。` remains part of each canonical title.
