# Batch 004 chunk 03 identity, safety, and edition review

- reviewDate: 2026-08-25
- reviewer: Local Codex independent review
- reviewedByHuman: `false`
- reviewedRange: frozen positions 21–30
- scope: canonical identity, Japanese manga/non-webtoon scope, safety, representative ISBN, edition mapping, duplicate and series relations, and source provenance
- excluded: Factor values, Genre, Theme, Art, recommendation context, and promotion
- sourceMutation: none

The review compares the frozen positions and research packet with the live `works.csv`, `volumes.csv`, `rakuten-matches.csv`, `safety-review.csv`, `source-membership.csv`, `canonical-mapping.csv`, and the current source registry. Official publisher pages were rechecked for title, creator, comic product, and edition identity. ISBN-13 checks were calculated locally.

All ten frozen IDs occur exactly once in `data/source/works.csv` with the exact frozen title and without `『` or `』`. Each has exactly one representative row in `data/source/volumes.csv`; every representative ISBN is a valid ISBN-13, occurs exactly once in the live volume registry, and matches a `matched`/`standard`/`isRepresentative=true` Rakuten product row. Each candidate has one included mapping plus duplicate source mappings, and each has a `safe` safety row. These are registry collision checks; the publisher links below are the identity evidence.

## Summary

| Pos. | workId | canonicalTitle | representative ISBN | identity / edition | Japanese manga / safety scope | Verdict |
| ---: | --- | --- | --- | --- | --- | --- |
| 21 | `work-53fb816835ab36e40a1f` | アンデッドアンラック | `9784088823102` | 集英社のジャンプコミックス紙版 1; official page binds title, creator, paper date, and ISBN | ordinary 少年コミック; death, ability, and combat are content leads, not adult-only classification | PASS |
| 22 | `work-62fbc6b2253b895e3a66` | 俺物語！！ | `9784088467566` | 集英社のマーガレットコミックス紙版 1; official page binds title, creators, paper date, and ISBN | ordinary 少女・女性コミック; the chikan rescue and romance premise are safety leads, not adult-only classification | PASS |
| 23 | `work-634f34830600e07d8f17` | お茶にごす。 | `9784091211682` | 小学館 official e-comic 1 confirms the work/creator and completed 11-volume series; paper representative is the exact Rakuten standard product | 少年・青年マンガ／少年サンデー; delinquency and violence-avoidance premise are content leads; digital-to-paper bridge remains edition-limited | PASS_WITH_EDITION_LIMIT |
| 24 | `work-65f856a6fa2078f21d2f` | 黒月のイェルクナハト | `9784065400753` | 講談社 official comic product 1 binds title, creator, and ISBN | ordinary commercial comic product; combat, coercive choice, and death language are safety leads, not an adult-only product marker | PASS |
| 25 | `work-741deb03d9f59e723929` | ルックバック | `9784088827827` | 集英社 official Jump Comics DIGITAL page also records the paper edition and ISBN; one-shot book | ordinary 少年コミック; tragic content is a content lead; no second volume or spin-off identity is implied | PASS |
| 26 | `work-7c8931bc010e2f28f7ec` | 夢中さ、きみに。 | `9784047357181` | KADOKAWA official ビームコミックス paper collection, 168 pages; paper and digital metadata share the ISBN | ordinary commercial manga collection; official “WEBなど” origin note is not a vertical/webtoon designation or a second Work | PASS |
| 27 | `work-7d4568dcc8e9175d35ba` | 異世界おじさん | `9784040653686` | KADOKAWA official MFC paper 1 confirms title, creator, date, and series; Rakuten is the exact standard-ISBN product bridge | ordinary MFC comic product; blood/combat wording is a content lead, not an adult-only marker | PASS |
| 28 | `work-7f0f63c5d80083f2be7f` | 思い、思われ、ふり、ふられ | `9784088454672` | 集英社のマーガレットコミックス紙版 1; official page binds title, creator, paper date, and ISBN | ordinary 少女・女性コミック; youth-romance premise is not adult-only classification | PASS |
| 29 | `work-80a2f62ce5073ade2ec2` | 式の前日 | `9784091345851` | 小学館 official e-comic one-volume short-story collection confirms title/creator; paper representative is the exact Rakuten standard product | commercial manga collection; digital-to-paper ISBN bridge is recorded as an edition lead; no vol. 2/3 | PASS_WITH_EDITION_LIMIT |
| 30 | `work-8733067e6afcaeadbd8d` | さんすくみ | `9784091334602` | 小学館 official e-comic 1 confirms title/creator and entry volume; paper representative is the exact Rakuten standard product | commercial manga; religious work/rites and relationship pressure are content leads, not adult-only classification; digital-to-paper bridge remains edition-limited | PASS_WITH_EDITION_LIMIT |

## Conflicts and relation checks

- `俺物語！！` is printed as `俺物語!!` on the official 集英社 page and in source-list aliases. This is an ASCII/fullwidth punctuation variant only; the frozen and live canonical title remains `俺物語！！`.
- Source records use normalized aliases such as `お茶にごす` (without the terminal `。`) and `黒月のいぇるくなはと` (hiragana in the normalized lead). They resolve to the same official title/creator and do not create a second Work.
- `tsugimanga-2019-web-005` contains an unresolved raw-source occurrence of `異世界おじさん` in the Webマンガ部門. It has no candidate/work mapping and is not used as identity, edition, or format evidence. The current Work is supported by the 2020 comics source plus the official KADOKAWA MFC paper product; no vertical/webtoon claim is inferred from the unresolved row.
- `お茶にごす。`, `式の前日`, and `さんすくみ` have official 小学館 electronic pages whose JDCN/date is not the frozen paper ISBN. Their paper ISBNs remain the exact standard Rakuten representative products. No internal-page, pagination, or visual evidence is transferred across those editions.
- `ルックバック` is a single long one-shot, `夢中さ、きみに。` is a single short-story collection, and `式の前日` is a single short-story collection. Their blank volume number in the live volume row is intentional; no synthetic vol. 2/3 rows are added.
- No current Work has a duplicate exact or punctuation-normalized title for these ten, no representative ISBN is shared by another current Work, and no alternate spin-off or special-edition product is mapped to any of the ten IDs.

## Provenance and source relations

Each line below is the live source-membership result. `included` is the retained provenance mapping; `duplicate` is a separate official list occurrence mapped to the same Work and representative product.

| Pos. | included source | duplicate source |
| ---: | --- | --- |
| 21 | `tsugimanga-2020-comics-006` | `nippan-bookseller-recommendations-2021-006` |
| 22 | `nippan-bookseller-recommendations-2013-005` | `shogakukan-manga-award-61-003` |
| 23 | `mangataisho-2008-115` | `nippan-bookseller-recommendations-2008-004` |
| 24 | `tsugimanga-2026-comics-011` | `nippan-bookseller-recommendations-2026-015` |
| 25 | `konomanga-2022-ranking-01` | `mangataisho-2022-002` |
| 26 | `konomanga-2020-ranking-22` | `mangataisho-2020-007` |
| 27 | `konomanga-2020-ranking-11` | `nippan-bookseller-recommendations-2020-007` |
| 28 | `nippan-bookseller-recommendations-2017-010` | `shogakukan-manga-award-63-003` |
| 29 | `mangataisho-2013-024` | `nippan-bookseller-recommendations-2013-012` |
| 30 | `mangataisho-2012-132` | `nippan-bookseller-recommendations-2012-013` |

Selection-list membership is provenance only. It is not Factor, Genre, Theme, or safety evidence.

## Official identity evidence

- 21 — [集英社 アンデッドアンラック 1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882310-2); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/16234574/).
- 22 — [集英社 俺物語!! 1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-846756-6); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/11536591/).
- 23 — [小学館eコミックストア お茶にごす。 1](https://e-comi.shogakukan.co.jp/books/091211680000d0000000); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/4449821/).
- 24 — [講談社 黒月のイェルクナハト 1](https://www.kodansha.co.jp/comic/products/0000415577); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/18219051/).
- 25 — [集英社 ルックバック](https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000016342800); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/16823430/).
- 26 — [KADOKAWA 夢中さ、きみに。](https://www.kadokawa.co.jp/product/321904000716/); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/15966863/).
- 27 — [KADOKAWA 異世界おじさん 1](https://www.kadokawa.co.jp/product/321808000769/); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/15665157/).
- 28 — [集英社 思い、思われ、ふり、ふられ 1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-845467-2); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/13383100/).
- 29 — [小学館コミック 式の前日](https://shogakukan-comic.jp/book?jdcn=091345850000d0000000); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/11842166/).
- 30 — [小学館コミック さんすくみ 1](https://shogakukan-comic.jp/book?jdcn=091334600000d0000000); representative bridge [Rakuten Books](https://books.rakuten.co.jp/rb/6797023/).

No canonical title, Work ID, ISBN, publisher field, safety row, source row, eligibility data, Factor, Theme, Art, or promotion result is changed by this review. `reviewedByHuman` remains `false`.
