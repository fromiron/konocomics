# Batch 003 chunk 01 identity, safety, and edition review

- reviewDate: 2026-08-23
- reviewer: Local Codex independent review
- reviewedByHuman: `false`
- reviewedRange: frozen positions 1–10
- scope: canonical identity, safety and scope, representative ISBN, edition mapping, and source metadata
- excluded: Factor values, Genre, Theme, Art, recommendation context, and promotion
- sourceMutation: none

The review compares the frozen set and research packet with current `works.csv`, `volumes.csv`, `canonical-mapping.csv`, `rakuten-matches.csv`, `safety-review.csv`, and `promotion-registry.csv`. Every representative ISBN occurs exactly once in `data/source/volumes.csv`; this is a catalog collision check, not an external identity source.

Rakuten has no reliable nationality or original-format field. No nationality-inference test is added. Japanese manga scope is established from official Japanese publisher or rightsholder pages, creator and imprint bindings, and the matched paper edition.

Safety means the matched work and edition are not sold as R18, 成人向け, 成年コミック, adult-only BL/TL, or equivalent restricted products. Violence, murder, sexual jokes, an age-gap relationship, or other sensitive subject matter is a review lead rather than an automatic adult block.

## Summary

| Pos | workId | canonicalTitle | representative ISBN | identity / edition | safety / scope | Verdict |
| --: | --- | --- | --- | --- | --- | --- |
| 1 | `work-0029e59a039dce3f6e74` | 【推しの子】 | `9784088916507` | 集英社 standard volume 1; official brackets retained | ordinary ヤングジャンプコミックス; murder lead is not adult-only | PASS |
| 2 | `work-048a39f42bd18cb0823e` | 大東京トイボックス | `9784344809437` | original 幻冬舎コミックス standard volume 1; current remaster kept separate as evidence edition | ordinary commercial manga; no adult-only marker | PASS_WITH_EDITION_LIMIT |
| 3 | `work-04f35b4c99514d50231d` | デトロイト・メタル・シティ | `9784592143512` | original 白泉社 standard volume 1; current licensed electronic listing is not the representative edition | ordinary ヤングアニマル comics; sexual-joke lead is not an adult-only category | PASS_WITH_EDITION_LIMIT |
| 4 | `work-064c0062e7a8e29cfbed` | COSMOS | `9784091577849` | 小学館 standard volume 1 | ordinary サンデーGX comics; crime lead is not adult-only | PASS |
| 5 | `work-07faf4019b12de5e877d` | 私の少年 | `9784575848106` | 双葉社 original standard volume 1 | ordinary commercial manga; adult/child relationship requires contextual review but is not an R18 classification | PASS |
| 6 | `work-131ba7a362fa9e38a10a` | 超巡！超条先輩 | `9784088841083` | 集英社 standard volume 1 | ordinary ジャンプコミックス | PASS |
| 7 | `work-171b262b7ad72871f795` | ドリフターズ | `9784785934071` | 少年画報社 standard volume 1 | ordinary YK comics; war violence is not adult-only | PASS |
| 8 | `work-174e7603bb0e71bb62ab` | からかい上手の高木さん | `9784091250155` | 小学館 original standard volume 1; full-color edition and spin-offs excluded | ordinary commercial manga | PASS |
| 9 | `work-197089286d30de82f9e9` | 多聞くん今どっち!? | `9784592224266` | 白泉社 standard volume 1; `!?` / `！？` is an alias-level punctuation normalization | ordinary 花とゆめコミックス | PASS |
| 10 | `work-1d447cc9026b530fb53d` | だがしかし | `9784091251251` | 小学館 standard volume 1 | ordinary 少年サンデーコミックス | PASS |

## Edition-limited cases

### 大東京トイボックス

- Canonical identity passes: the frozen title, creator うめ, original ISBN `9784344809437`, and first-volume number align across the current source rows, Rakuten product, licensed distributor listing, creator interview, and award record.
- The current 幻冬舎コミックス catalog no longer exposes the original product. Absence from the current catalog does not mean the Work or edition is invalid.
- The Studio G3 / ナンバーナイン electronic remaster contains additional material. It remains the same canonical Work but is not substituted for the original representative volume or treated as a byte-for-byte edition bridge without explicit page mapping.
- Verdict: retain the current Work ID and representative ISBN; limit preview Evidence to content whose original-volume relationship is explicit.

### デトロイト・メタル・シティ

- Canonical identity passes: the 白泉社 order list binds original volumes 1–3 and ISBN `9784592143512`; the current licensed listing uses the same ISBN and title/creator identity.
- The current distributor page's プロテカ field and “same as past product” notice do not rewrite the original representative publisher or prove identical pagination. It may support scoped text only under its recorded limitation.
- Lowbrow and sexual jokes trigger safety review but not an adult-only finding. The matched item remains an ordinary ヤングアニマル comics product with no R18 or 成年コミック marker.
- Verdict: retain the current Work ID and original standard ISBN; require an explicit bridge before using current internal pages as original-page Art references.

### 私の少年

- The 双葉社 official pages bind the frozen title, creator 高野ひと深, and original ISBN `9784575848106` across volumes 1–3. No duplicate or alternative Work identity appears in the reviewed rows.
- The official text directly identifies a 30-year-old adult and a 12-year-old child and leaves the relationship emotionally ambiguous. This requires careful Factor wording and prevents an automatic romance inference.
- The matched product is an ordinary 双葉社 commercial manga volume with no adult-only sales marker. Subject sensitivity is not an R18 classification.
- Verdict: identity and safety PASS. The relationship remains a content/context limitation in annotation and does not become a safety blocker.

## Evidence

- 集英社 【推しの子】 1: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-891650-7 — 2020-07-17; retrieved 2026-08-23
- コミックシーモア 大東京トイボックス original listing: https://www.cmoa.jp/title/49274/ — original volume 1 shown as 2007-03; retrieved 2026-08-23
- GAME Watch creator interview: https://game.watch.impress.co.jp/docs/news/616563.html — 2013-09-24; retrieved 2026-08-23
- 白泉社 ヤングアニマル order list: https://www.hakusensha.co.jp/book-store/order/pdf/young.pdf — 2026-08-01; retrieved 2026-08-23
- 双葉社 私の少年 1: https://www.futabasha.co.jp/book/97845758481060000000?type=1 — 2016-06-11; retrieved 2026-08-23
- 小学館 COSMOS 1: https://e-comi.shogakukan.co.jp/books/091577840000d0000000 — 2023-11-17; retrieved 2026-08-23
- 集英社 超巡！超条先輩 1: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884108-3 — 2024-06-04; retrieved 2026-08-23
- 少年画報社 ドリフターズ 1: https://www.shonengahosha.co.jp/book_Info.php?id=6358 — 2010-07-07; retrieved 2026-08-23
- 小学館 からかい上手の高木さん 1: https://e-comi.shogakukan.co.jp/books/091250150000d0000000 — 2014-06-12; retrieved 2026-08-23
- 白泉社 多聞くん今どっち！？ 1: https://www.hakusensha.co.jp/comicslist/62381/ — 2022-02-18; retrieved 2026-08-23
- 小学館 だがしかし 1: https://e-comi.shogakukan.co.jp/books/091251250000d0000000 — 2014-09-18; retrieved 2026-08-23

No title delimiter, Work ID, ISBN, publisher field, first-published year, safety row, or source row is changed by this review. The meaningful `【】` in 【推しの子】 remains part of the canonical title; decorative `『』` remains absent.
