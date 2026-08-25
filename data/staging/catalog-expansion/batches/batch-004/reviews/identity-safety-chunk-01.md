# Batch 004 chunk 01 identity, safety, and edition review

- reviewDate: 2026-08-25
- reviewer: Local Codex independent review
- reviewedByHuman: `false`
- reviewedRange: frozen positions 1–10
- scope: canonical identity, Japanese manga scope, non-webtoon/non-adult safety, representative ISBN, edition mapping, duplicate and series-relation checks, and source metadata
- excluded: Factor values, Genre, Theme, Art, recommendation context, and promotion decisions
- sourceMutation: none

The review compares the frozen set and research packet with the live `works.csv`, `volumes.csv`, `canonical-mapping.csv`, `evidence.csv`, and `promotion-registry.csv` rows. Every representative ISBN occurs exactly once in `data/source/volumes.csv`, is marked `standard`, `volumeNumber=1`, and `isRepresentative=true`; all ten ISBN-13 checksums pass. The Rakuten evidence row for each work carries the same ISBN and the live product bridge URL.

All ten frozen titles exactly match their current `works.csv` title and contain no decorative `『』` characters. Editorial wrappers in source page headings are not copied into canonical titles. Same-title searches return one Work ID per title. `included`/`duplicate` selection mappings resolve to the same Work ID; they are source duplicates, not duplicate works. No separate same-title spin-off or edition Work ID is present. Same-creator rows for オノ・ナツメ and 石黒正数 are distinct works and do not collide with the reviewed series.

Japanese manga scope is supported by Japanese publisher/rightsholder or recognized Japanese bookseller records, named manga/comic imprints, and a matched paper-volume ISBN. No cited product is a vertical-scroll webtoon or an adult-only product. A work may have web serialization, crime, violence, alcohol, or sensitive relationship material; those are content leads, not automatic R18/成人向け/成年コミック blocks.

## Summary

| Pos | workId | canonicalTitle | representative ISBN | identity / edition | scope / safety | Verdict |
| --: | --- | --- | --- | --- | --- | --- |
| 1 | `work-025c8ab93483a39c9330` | ホストと社畜 | `9784575860016` | 双葉社 Action Comics standard volume 1; exact title/creator/ISBN bridge | Japanese commercial manga; no adult-only marker | PASS |
| 2 | `work-098b1781e14365eea667` | うるわしの宵の月 | `9784065217771` | 講談社 Dessert standard volume 1; official 1–3 volume chain | Japanese commercial manga; school-romance lead is not adult-only | PASS |
| 3 | `work-0f3a44f5dcab9623d1be` | 応天の門 | `9784107717429` | 新潮社 BUNCH COMICS standard volume 1; official 1–3 volume chain | Japanese commercial manga; crime/death leads are not adult-only | PASS |
| 4 | `work-11d23966f22f777e95d0` | のらみみ | `9784091884114` | 小学館 standard volume 1; official e-comic pages omit ISBN/date, Rakuten supplies exact bridge | Japanese commercial manga; no adult-only marker | PASS_WITH_IDENTITY_LIMITATION |
| 5 | `work-132ce7172750a3b1fa53` | ヒナまつり | `9784047273818` | historical エンターブレイン label aligns with KADOKAWA/Harta product; standard volume 1 | Japanese commercial manga; yakuza/action comedy is not adult-only | PASS |
| 6 | `work-15dba4fdb46308ab45d7` | 駅から5分 | `9784088654393` | 集英社 original standard volume 1; bunko reprints kept separate | Japanese commercial manga; accident/relationship leads are not adult-only | PASS_WITH_EDITION_LIMIT |
| 7 | `work-188ba092c6195603bb3f` | つらつらわらじ | `9784063729443` | 講談社 Morning KC standard volume 1; 1–3 series identity chain | Japanese commercial manga; political/travel danger is not adult-only | PASS |
| 8 | `work-19c2017b33c07f48634e` | ふうらい姉妹 | `9784047268685` | KADOKAWA Harta Comics standard volume 1; 1–3 chain and later electronic dates kept distinct | Japanese commercial manga; ordinary 4-panel comedy | PASS |
| 9 | `work-1a6ad6771865b43c8516` | それでも町は廻っている | `9784785926045` | 少年画報社 standard volume 1; official series page prevents title/spin-off collision | Japanese commercial manga; ordinary comics imprint | PASS |
| 10 | `work-1cdc6c5cca7c33fafe51` | 青空にとおく酒浸り | `9784199501746` | 徳間書店 Ryu Comics standard volume 1; bookseller series bridge | Japanese commercial manga; publisher synopsis unavailable, no adult-only marker | PASS_WITH_SOURCE_LIMIT |

## Per-work review

### 1. ホストと社畜

- `workId`: `work-025c8ab93483a39c9330`
- Identity: frozen title, `works.csv` title, creator 河尻みつる, publisher 双葉社, and official press-release/product records agree. The PR title uses editorial `『』` wrappers, but the canonical title remains plain `ホストと社畜`.
- Scope/safety: the matched item is an Action Comics paper comic. The official synopsis mentions a host and salaried worker and does not identify an R18, 成人向け, or 成年コミック product; no vertical-scroll/webtoon marker is present.
- ISBN/edition: `9784575860016` passes ISBN-13 checksum, occurs once globally, and is the `standard`, volume 1, representative row. The 2nd/3rd-volume ISBNs remain separate editions/volumes and do not replace the frozen representative.
- Duplicate/relations: the award and bookseller mappings are one `included` plus one `duplicate`, both resolving to this Work ID; no same-title or same-creator collision is present.
- Blockers/conflicts: none. The mapping note’s kana normalization `ほすとと社畜` is an alias-level note; official title and Rakuten product title are exact.
- Evidence:
  - Source name: 双葉社 / PR TIMES official press release | URL: https://prtimes.jp/main/html/rd/p/000000821.000014531.html | date: 2025-09-25 | retrievedAt: 2026-08-25
  - Source name: 双葉社 official volume 1 product page | URL: https://www.futabasha.co.jp/book/97845758600160000000?type=2 | date: 2024-08 (page metadata) | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched paper product | URL: https://books.rakuten.co.jp/rb/17888858/ | date: 2024-08-28 release | retrievedAt: 2026-08-22
- Verdict: `PASS`.

### 2. うるわしの宵の月

- `workId`: `work-098b1781e14365eea667`
- Identity: frozen title, `works.csv`, creator やまもり 三香, publisher 講談社, and all three official Dessert volume pages agree. No `『』` appears in the canonical title.
- Scope/safety: official Kodansha product pages identify a Japanese Dessert comic volume chain. The school-romance content described for volumes 1–3 has no adult-only product marker and is not a webtoon listing.
- ISBN/edition: `9784065217771` passes ISBN-13 checksum, occurs once globally, and is the standard representative volume 1. Official volume 2/3 ISBNs (`9784065232798`, `9784065256800`) are retained as separate series volumes.
- Duplicate/relations: two award/editorial mappings (`included` and `duplicate`) resolve to this Work ID; no same-title or same-creator collision is present.
- Blockers/conflicts: none.
- Evidence:
  - Source name: 講談社 official volume 1 product page | URL: https://www.kodansha.co.jp/comic/products/0000347553 | date: 2020-12-11 | retrievedAt: 2026-08-25
  - Source name: 講談社 official volume 2 product page | URL: https://www.kodansha.co.jp/comic/products/0000351649 | date: 2021-05-13 | retrievedAt: 2026-08-25
  - Source name: 講談社 official volume 3 product page | URL: https://www.kodansha.co.jp/comic/products/0000356350 | date: 2021-11-12 | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched paper product | URL: https://books.rakuten.co.jp/rb/16517534/ | date: 2020-12-11 release | retrievedAt: 2026-08-22
- Verdict: `PASS`.

### 3. 応天の門

- `workId`: `work-0f3a44f5dcab9623d1be`
- Identity: frozen title, `works.csv`, creator 灰原薬, publisher 新潮社, and the official BUNCH COMICS pages agree. The official volume 1 page explicitly prints the same title, author, imprint, and ISBN.
- Scope/safety: Shinchosha labels the item as a Japanese comic/BUNCH COMICS volume. Mystery, crime, death, and historical danger in the official summaries do not establish adult-only content; no webtoon marker is present.
- ISBN/edition: `9784107717429` passes ISBN-13 checksum, occurs once globally, and is the standard representative volume 1. Official volumes 2/3 (`9784107717771`, `9784107718105`) remain separate volumes.
- Duplicate/relations: the 次にくるマンガ大賞 inclusion and bookseller duplicate both resolve to this Work ID; no alternate same-title or same-creator work is present.
- Blockers/conflicts: none.
- Evidence:
  - Source name: 新潮社 official volume 1 product page | URL: https://www.shinchosha.co.jp/book/771742/ | date: 2014-04-09 | retrievedAt: 2026-08-25
  - Source name: 新潮社 official volume 2 product page | URL: https://www.shinchosha.co.jp/book/771777 | date: 2014-10-09 | retrievedAt: 2026-08-25
  - Source name: 新潮社 official volume 3 product page | URL: https://www.shinchosha.co.jp/book/771810/ | date: 2015-04-09 | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched paper product | URL: https://books.rakuten.co.jp/rb/12689900/ | date: undated in local bridge record | retrievedAt: 2026-08-22
- Verdict: `PASS`.

### 4. のらみみ

- `workId`: `work-11d23966f22f777e95d0`
- Identity: frozen title, `works.csv`, creator 原一雄, publisher 小学館, and the official e-comic volume 1–3 paths agree. Canonical title is plain `のらみみ` with no `『』`.
- Scope/safety: the pages are Shogakukan e-comic manga products. The family/character slice-of-life premise is not an adult-only listing and no vertical-scroll/webtoon marker is present.
- ISBN/edition: `9784091884114` passes ISBN-13 checksum, occurs once globally, and is the standard representative volume 1. The official dynamic e-comic pages omit ISBN and release date; the exact ISBN/title/creator bridge is supplied by the Rakuten paper-product row and local volume/evidence rows.
- Duplicate/relations: three Manga Taisho year mappings (`included` plus `duplicate`s) all resolve to this Work ID; no same-title or same-creator collision is present.
- Blockers/conflicts: no identity blocker. Limitation is evidence depth only: the official dynamic pages do not expose the representative ISBN/date in the reviewed rendering.
- Evidence:
  - Source name: 小学館 eコミ official volume 1 page | URL: https://e-comi.shogakukan.co.jp/books/091884110000d0000000 | date: undated (dynamic page) | retrievedAt: 2026-08-25
  - Source name: 小学館 eコミ official volume 2 page | URL: https://e-comi.shogakukan.co.jp/books/091884120000d0000000 | date: undated (dynamic page) | retrievedAt: 2026-08-25
  - Source name: 小学館 eコミ official volume 3 page | URL: https://e-comi.shogakukan.co.jp/books/091884130000d0000000 | date: undated (dynamic page) | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched paper product | URL: https://books.rakuten.co.jp/rb/1619953/ | date: undated in local bridge record | retrievedAt: 2026-08-22
- Verdict: `PASS_WITH_IDENTITY_LIMITATION`.

### 5. ヒナまつり

- `workId`: `work-132ce7172750a3b1fa53`
- Identity: frozen title, `works.csv`, creator 大武政夫, and the KADOKAWA/Harta product chain agree. The source publisher field `エンターブレイン` is the historical imprint label for the KADOKAWA product, not a competing Work identity. Canonical title has no `『』`.
- Scope/safety: KADOKAWA identifies a Harta/Fellows! Japanese comic paper volume. Yakuza, psychic threat, and action-comedy material are content leads; the matched product is not marked R18, 成人向け, or 成年コミック and is not a webtoon.
- ISBN/edition: `9784047273818` passes ISBN-13 checksum, occurs once globally, and is the standard representative volume 1. Official volume 2/3 records remain separate series volumes.
- Duplicate/relations: the Manga Taisho mappings for 2012, 2014, and 2015 resolve to this Work ID; the KADOKAWA page’s same-series list confirms a volume chain, not a spin-off collision.
- Blockers/conflicts: none. `ヒナ` versus the award mapping’s `ひな` is a source-level orthographic alias; official product title and frozen title agree.
- Evidence:
  - Source name: KADOKAWA official volume 1 product page | URL: https://www.kadokawa.co.jp/product/301306000979/ | date: 2011-07-15 paper release (2013-08-01 electronic listing) | retrievedAt: 2026-08-25
  - Source name: KADOKAWA official volume 2 product page | URL: https://www.kadokawa.co.jp/product/301306000980/ | date: 2011-11-15 paper release | retrievedAt: 2026-08-25
  - Source name: KADOKAWA official volume 3 product page / Store | URL: https://www.kadokawa.co.jp/product/201110000430/ ; https://store.kadokawa.co.jp/shop/g/g201110000430/ | date: 2012-03-03 paper release | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched paper product | URL: https://books.rakuten.co.jp/rb/11229227/ | date: undated in local bridge record | retrievedAt: 2026-08-22
- Verdict: `PASS`.

### 6. 駅から5分

- `workId`: `work-15dba4fdb46308ab45d7`
- Identity: frozen title, `works.csv`, creator くらもちふさこ, publisher 集英社, and the official digital/original-volume pages agree. Canonical title has no `『』`.
- Scope/safety: Shueisha identifies a Japanese comic volume and the content leads are ordinary relationship/accident story material. No adult-only or webtoon product marker is present.
- ISBN/edition: `9784088654393` passes ISBN-13 checksum, occurs once globally, and is the standard original paper volume 1. The official `9784086196543`/`9784086196550` bunko reprints are explicitly separate editions; they do not replace the frozen representative. The Rakuten row bridges the frozen original ISBN to title/creator.
- Duplicate/relations: the 2008, 2009, and 2010 Manga Taisho mappings all resolve to this Work ID; no same-title or same-creator collision is present.
- Blockers/conflicts: no identity blocker. Edition limitation only: the first official URL is a digital route and does not itself expose the original ISBN; the original-paper ISBN is fixed by the frozen volume row and exact Rakuten bridge.
- Evidence:
  - Source name: 集英社 official original volume 1 digital page | URL: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865439865439315501 | date: 2007-11-19 paper release (2012-07-06 digital listing) | retrievedAt: 2026-08-25
  - Source name: 集英社 S-MANGA official bunko volume 1/2 pages | URL: https://www.s-manga.net/items/contents.html?isbn=978-4-08-619654-3 ; https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-619655-0 | date: 2016-12-16 | retrievedAt: 2026-08-25
  - Source name: 集英社 official volume 3 digital page and e-hon bibliographic record | URL: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865566865439315501 ; https://www.e-hon.ne.jp/bec/SA/Detail?refBook=9784088655666&refHpStenCode=92005 | date: 2009-11 original volume 3 | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched original paper product | URL: https://books.rakuten.co.jp/rb/4969576/ | date: undated in local bridge record | retrievedAt: 2026-08-22
- Verdict: `PASS_WITH_EDITION_LIMIT`.

### 7. つらつらわらじ

- `workId`: `work-188ba092c6195603bb3f`
- Identity: frozen title, `works.csv`, creator オノ・ナツメ, publisher 講談社, and the official/recognized 1–3 volume records agree. The canonical title is plain and has no `『』`.
- Scope/safety: Morning KC and recognized Japanese bookseller records identify a paper manga series. Political intrigue, travel danger, and historical setting are not adult-only markers; no webtoon marker is present.
- ISBN/edition: `9784063729443` passes ISBN-13 checksum, occurs once globally, and is the standard representative volume 1. Volume 2/3 ISBNs remain separate series volumes.
- Duplicate/relations: all three Manga Taisho source mappings resolve to this Work ID. Other オノ・ナツメ works in `works.csv` (`ACCA13区監察課`, `LA QUINTA CAMERA`, `COPPERS`) have different titles/IDs and are not spin-offs of this entry.
- Blockers/conflicts: none.
- Evidence:
  - Source name: 講談社 official volume 1 product page | URL: https://www.kodansha.co.jp/comic/products/0000014069 | date: 2010-09-22 | retrievedAt: 2026-08-25
  - Source name: Sony Reader recognized distributor volume 2 page | URL: https://ebookstore.sony.jp/title/00133690/id/BT000013369000200201/ | date: 2011-03-23 paper release (2011-11-25 digital listing) | retrievedAt: 2026-08-25
  - Source name: 講談社 official new-release list / Rakuten Books volume 3 record | URL: https://www.kodansha.co.jp/comic/new-releases/p?page=1396 ; https://books.rakuten.co.jp/rb/11364804/ | date: 2011-10-21 | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched representative paper product | URL: https://books.rakuten.co.jp/rb/6707522/ | date: undated in local bridge record | retrievedAt: 2026-08-22
- Verdict: `PASS`.

### 8. ふうらい姉妹

- `workId`: `work-19c2017b33c07f48634e`
- Identity: frozen title, `works.csv`, creator 長崎 ライチ, publisher KADOKAWA, and KADOKAWA/Harta volume 1–3 pages agree. Canonical title has no `『』`.
- Scope/safety: the official product is a Japanese Harta Comics paper/ebook 4-panel manga. Its comedy premise has no adult-only marker and is not a vertical-scroll webtoon.
- ISBN/edition: `9784047268685` passes ISBN-13 checksum, occurs once globally, and is the standard representative paper volume 1. Volume 2/3 ISBNs and later electronic dates are kept separate from the representative.
- Duplicate/relations: all three Manga Taisho mappings resolve to this Work ID; KADOKAWA’s same-series list confirms the volume chain and no spin-off collision.
- Blockers/conflicts: none. KADOKAWA Store and product pages expose paper/electronic date differences, which are edition metadata rather than identity conflicts.
- Evidence:
  - Source name: KADOKAWA official volume 1 product page / Store | URL: https://www.kadokawa.co.jp/product/201008000188/ ; https://store.kadokawa.co.jp/shop/g/g201008000188/ | date: 2010-11-15 paper release | retrievedAt: 2026-08-25
  - Source name: KADOKAWA official volume 2 product page | URL: https://www.kadokawa.co.jp/product/201109000335/ | date: 2012-01-14 | retrievedAt: 2026-08-25
  - Source name: KADOKAWA official volume 3 product page / Store | URL: https://www.kadokawa.co.jp/product/301309000222/ ; https://store.kadokawa.co.jp/shop/g/g201302000121/ | date: 2013-09-14 paper release (2013-10-03 electronic listing) | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched paper product | URL: https://books.rakuten.co.jp/rb/6796833/ | date: undated in local bridge record | retrievedAt: 2026-08-22
- Verdict: `PASS`.

### 9. それでも町は廻っている

- `workId`: `work-1a6ad6771865b43c8516`
- Identity: frozen title, `works.csv`, creator 石黒正数, publisher 少年画報社, and the official volume 1/3 plus series page agree. Canonical title has no `『』`.
- Scope/safety: Shonen Gahosha identifies an ordinary Japanese comics imprint and paper volume. Maid-cafe comedy and a student detective lead are not adult-only content; no webtoon marker is present.
- ISBN/edition: `9784785926045` passes ISBN-13 checksum, occurs once globally, and is the standard representative volume 1. Volume 3 ISBN `9784785928278` remains a separate series volume.
- Duplicate/relations: all three Manga Taisho mappings resolve to this Work ID. Other 石黒正数 works in `works.csv` (`天国大魔境`, `木曜日のフルット`) have distinct titles/IDs and are not spin-offs of this entry.
- Blockers/conflicts: none.
- Evidence:
  - Source name: 少年画報社 official volume 1 product page | URL: https://www.shonengahosha.co.jp/book_Info.php?id=5944 | date: 2006-01-02 | retrievedAt: 2026-08-25
  - Source name: 少年画報社 official volume 3 product page | URL: https://www.shonengahosha.co.jp/book_Info.php?id=6146 | date: 2007-08-03 | retrievedAt: 2026-08-25
  - Source name: 少年画報社 official series page / Manga Taisho jury comment | URL: https://www.shonengahosha.co.jp/book_Search.php?bookTag=それでも町は廻っている ; https://www.mangataisho.com/data/2009/comment090324.pdf | date: 2009-03-24 for jury comment; series page undated | retrievedAt: 2026-08-25
  - Source name: Rakuten Books matched representative paper product | URL: https://books.rakuten.co.jp/rb/3701295/ | date: undated in local bridge record | retrievedAt: 2026-08-22
- Verdict: `PASS`.

### 10. 青空にとおく酒浸り

- `workId`: `work-1cdc6c5cca7c33fafe51`
- Identity: frozen title, `works.csv`, creator 安永航一郎, publisher 徳間書店, and the Rakuten/Honya Club bibliographic series records agree. Canonical title has no `『』`.
- Scope/safety: the matched item is a Japanese 徳間書店 Ryu Comics paper product. The award comment is not used to infer adult content; no R18, 成人向け, 成年コミック, or webtoon marker appears in the live bibliographic bridge.
- ISBN/edition: `9784199501746` passes ISBN-13 checksum, occurs once globally, and is the standard representative volume 1. Honya Club records volumes 2/3 as separate series ISBNs; they do not replace the frozen representative.
- Duplicate/relations: the 2011, 2012, and 2013 Manga Taisho mappings all resolve to this Work ID; no same-title or same-creator collision is present.
- Blockers/conflicts: no identity or safety blocker. Source limitation only: the research packet did not recover a current Tokuma publisher volume page with a synopsis, so identity/scope rely on the exact Rakuten product and Honya Club series records plus award provenance; no factor or promotion decision is made here.
- Evidence:
  - Source name: Rakuten Books recognized bibliography (徳間書店 Ryu Comics) | URL: https://books.rakuten.co.jp/rb/6414362/ | date: 2010-04 | retrievedAt: 2026-08-25
  - Source name: 日本出版販売 / Honya Club recognized series bibliography | URL: https://www.honyaclub.com/shop/e/eS4865176/ | date: 2010-04 volume 1; 2010-06 volumes 2–3 | retrievedAt: 2026-08-25
  - Source name: Manga Taisho official jury comment | URL: https://www.mangataisho.com/data/2012/mantai_comment2012.pdf | date: 2012 | retrievedAt: 2026-08-25
  - Source name: Live Rakuten evidence row for representative bridge | URL: https://books.rakuten.co.jp/rb/6414362/ | date: 2010-04 | retrievedAt: 2026-08-22
- Verdict: `PASS_WITH_SOURCE_LIMIT`.

No title, Work ID, ISBN, publisher field, volume row, safety row, mapping row, or promotion-registry row was changed by this review. The live registry remains `libraryOnly`/`pending`; this document does not assign promotion or annotation status.
