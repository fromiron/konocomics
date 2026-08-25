# Batch 004 chunk 02 identity, safety, and edition review

- reviewDate: 2026-08-25
- reviewer: Local Codex independent review
- reviewedByHuman: false
- reviewedRange: frozen positions 11–20
- frozenManifestSha256: a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1
- scope: canonical identity, decorative-title delimiters, Japanese manga/non-webtoon/non-adult scope, representative ISBN, edition mapping, duplicate and spin-off relations, and source metadata
- excluded: Factor values, Genre, Theme, Art, recommendation context, annotation, eligibility, and promotion
- sourceMutation: none

The review compares the frozen set and assigned official-first research packet with current data/source/works.csv, data/source/volumes.csv, shared catalog-expansion candidates.csv, rakuten-matches.csv, canonical-mapping.csv, source-membership.csv, safety-review.csv, and live promotion-registry.csv. The shared registries are read-only inputs for the existing identity/product bridge and safety state; no new selection or promotion decision is made here.

All ten scoped Work IDs and exact canonical titles occur once in data/source/works.csv. Every representative ISBN occurs once as an isRepresentative=true, editionKind=standard row in data/source/volumes.csv; all ten ISBN-13 checksums pass. The corresponding Rakuten rows are exact normalized-title/creator matches with a standard manga product and are used only as the existing product bridge. Repeated award/bookseller memberships collapse to the same Work; no membership points to a second canonical Work, remake, set, or spin-off.

Japanese manga scope is established from the official Japanese publisher/rightsholder page, comics imprint, or Japanese manga serial venue recorded below. No reviewed source identifies a vertical-scroll/webtoon original. The live safety rows are safe for all ten, with no R18, 成人向け, 成年コミック, adult-only BL/TL, or equivalent restricted-product marker. Violence, abduction, murder training, workplace harassment, illness, death, and relationship conflict are content context, not automatic adult blocks.

## Summary

| Pos | workId | canonicalTitle | representative ISBN | Verdict |
| --: | --- | --- | --- | --- |
| 11 | work-23077ad33a2066bef5a6 | Sunny | 9784091885579 | PASS_WITH_EDITION_LIMIT |
| 12 | work-2356050c72240569e1c5 | すみれファンファーレ | 9784091885791 | PASS_WITH_EDITION_LIMIT |
| 13 | work-2c4fe00df5255fc082f9 | ヒーローカンパニー | 9784864683043 | PASS_WITH_EDITION_LIMIT |
| 14 | work-2d385ad0525742330e70 | ねずみの初恋 | 9784065344231 | PASS |
| 15 | work-2df743e085adef5e9bd3 | キルアオ | 9784088836867 | PASS |
| 16 | work-2f1d1c3ad0f943f1562f | 尾守つみきと奇日常。 | 9784098531820 | PASS_WITH_EDITION_LIMIT |
| 17 | work-3713ab561de583d709bc | アリスと蔵六 | 9784199503375 | PASS |
| 18 | work-39c1a2b6791238827ed5 | とろける鉄工所 | 9784063522471 | PASS |
| 19 | work-3ad85a2ffdc026007d61 | 新しい上司はど天然 | 9784253142311 | PASS_WITH_SCOPE_LIMIT |
| 20 | work-44d0000353478596369e | 環と周 | 9784088448398 | PASS |

## Per-work findings

### 11 — Sunny

- verdict: PASS_WITH_EDITION_LIMIT.
- identity: 小学館 binds Sunny to 松本大洋; the frozen title has no decorative delimiters. The standard volume-1 bridge ISBN 9784091885579 is valid and unique.
- scope/safety: Official pages cover volumes 1–3 and the same six-volume series. The 2013 selection is included; 2014 and 小学館漫画賞 rows are duplicates. No alternate Work, set, remake, or spin-off is present. Ordinary Japanese manga; parent separation, institutional living, loneliness, and sadness are content leads.
- evidence: 小学館eコミックストア Sunny 1, https://e-comi.shogakukan.co.jp/books/091885570000d0000000 (sourceDate 2011-08-30; retrievedAt 2026-08-25); 小学館コミック Sunny 2, https://shogakukan-comic.jp/book?isbn=9784091885760 (sourceDate 2012-02-29; retrievedAt 2026-08-25); Sunny 3, https://shogakukan-comic.jp/book?isbn=9784091886132 (sourceDate 2013-01-30; retrievedAt 2026-08-25).
- limitation: The first-volume official page is electronic while the frozen ISBN is the standard paper product. Keep page-level evidence edition-bound.

### 12 — すみれファンファーレ

- verdict: PASS_WITH_EDITION_LIMIT.
- identity: 小学館 binds すみれファンファーレ to 松島直子; the frozen title has no decorative delimiters. ISBN 9784091885791 is a valid, unique standard volume-1 bridge.
- scope/safety: Official electronic pages cover volumes 1–3. The 2013 selection is included; 2014 and 2015 rows are duplicates. No alternate Work, set, or spin-off is present. Ordinary Japanese manga; divorce, childhood loneliness, tears, and adult constraints are content leads.
- evidence: 小学館コミック 1, https://shogakukan-comic.jp/book?jdcn=091885790000d0000000 (sourceDate 2015-01-26 electronic re-release; retrievedAt 2026-08-25); 2, https://shogakukan-comic.jp/book?jdcn=091886030000d0000000 (sourceDate 2015-01-26 electronic re-release; retrievedAt 2026-08-25); 3, https://shogakukan-comic.jp/book?jdcn=091886240000d0000000 (sourceDate 2015-01-26 electronic re-release; retrievedAt 2026-08-25).
- limitation: The official pages are electronic re-releases while the frozen ISBN is the 2012 standard paper volume. Do not transfer page-level evidence without an explicit bridge.

### 13 — ヒーローカンパニー

- verdict: PASS_WITH_EDITION_LIMIT.
- identity: HERO'S Web identifies the 島本和彦 work represented by standard ISBN 9784864683043; the ISBN is valid and unique. The frozen title has no decorative delimiters.
- scope/safety: The official rightsholder episode and assigned volume-1 bridge establish the entry premise; official 2–3 volume product pages were not confirmed in this narrow check, so no later-volume claim is made. The 2013 selection is included; 2014 and 2015 rows are duplicates. No alternate Work, set, or spin-off is present. Ordinary Japanese hero manga; disaster, crime response, and combat are content leads.
- evidence: HERO'S Web official episode, https://viewer.heros-web.com/episode/10834108156657187802 (sourceDate 2020-08-07; retrievedAt 2026-08-25); Sony Reader volume 1 bridge, https://ebookstore.sony.jp/title/00192282/ (sourceDate 2012-12-07 electronic release; retrievedAt 2026-08-25).
- limitation: The rightsholder source is episode/series-level and the assigned volume source is electronic/distributor evidence. Keep identity and evidence bounded to the confirmed episode/volume.

### 14 — ねずみの初恋

- verdict: PASS.
- identity: 講談社 binds title, 大瀬戸陸, volume 1, and ISBN 9784065344231; volumes 2 and 3 are in the same product family. The ISBN is valid and unique.
- scope/safety: Official 講談社 pages cover volumes 1–3 and the ヤングマガジン series page confirms one work. The award and bookseller rows are one included selection plus one duplicate. No spin-off or set is present. Ordinary Japanese manga; yakuza, murder training, first killing, abduction, and threats are content leads.
- evidence: 講談社 1, https://www.kodansha.co.jp/comic/products/0000385374 (sourceDate 2024-03-06; retrievedAt 2026-08-25); 2, https://www.kodansha.co.jp/comic/products/0000392937 (sourceDate 2024-06-06; retrievedAt 2026-08-25); 3, https://www.kodansha.co.jp/comic/products/0000398073 (sourceDate 2024-09-05; retrievedAt 2026-08-25); ヤングマガジン series, https://magazine.yanmaga.jp/c/nezuminohatsukoi/ (sourceDate not stated, current page; retrievedAt 2026-08-25).

### 15 — キルアオ

- verdict: PASS.
- identity: 集英社 S-MANGA binds volume 1, 藤巻忠俊, ジャンプコミックス, and ISBN 9784088836867; the ISBN is valid and unique. The canonical title is キルアオ, not retailer volume text キルアオ 1.
- scope/safety: Official S-MANGA pages cover volumes 1–3 and the 週刊少年ジャンプ page confirms the same series. Award and bookseller memberships are duplicate provenance. No spin-off or alternate Work is present. Ordinary 少年ジャンプ manga; assassination history, action, and kidnapping are content leads.
- evidence: S-MANGA 1, https://www.s-manga.net/items/contents.html?isbn=978-4-08-883686-7 (sourceDate 2023-09-04; retrievedAt 2026-08-25); 2, https://www.s-manga.net/items/contents.html?jdcn=08X10000000032350600 (sourceDate 2023-11-02; retrievedAt 2026-08-25); 3, https://www.s-manga.net/items/contents.html?isbn=978-4-08-883797-0 (sourceDate 2024-01-04; retrievedAt 2026-08-25); official series page, https://www.shonenjump.com/j/rensai/killblue/ (sourceDate 2023 serial start year; retrievedAt 2026-08-25).

### 16 — 尾守つみきと奇日常。

- verdict: PASS_WITH_EDITION_LIMIT.
- identity: 小学館 binds the exact terminal punctuation in 尾守つみきと奇日常。 to 森下みゆ. Standard bridge ISBN 9784098531820 is valid and unique; decorative quote delimiters are absent.
- scope/safety: Official pages cover volumes 1–3. The 2024 award and 2025 bookseller rows are one included selection plus one duplicate; the later 2025 article is outside entry scope. No alternate Work, set, or spin-off is present. Ordinary Japanese manga; non-human coexistence and social-boundary conflict are content leads.
- evidence: 小学館eコミックストア 1, https://e-comi.shogakukan.co.jp/books/098531820000d0000000 (sourceDate 2024-03-18 paper release stated in packet; retrievedAt 2026-08-25); 小学館コミック 2, https://shogakukan-comic.jp/book?isbn=9784098533817 (sourceDate 2024-06-18; retrievedAt 2026-08-25); 3, https://shogakukan-comic.jp/book?isbn=9784098535750 (sourceDate 2024-09-18; retrievedAt 2026-08-25).
- limitation: The first-volume official page is electronic while the frozen ISBN is the standard paper product. Keep page-level evidence edition-bound.

### 17 — アリスと蔵六

- verdict: PASS.
- identity: COMICリュウ binds アリスと蔵六, 今井哲也, and volume-1 ISBN 9784199503375; it lists volumes 2–3 in the same series. The ISBN is valid and unique.
- scope/safety: Official rightsholder metadata and the assigned volume-3 description support the 1–3 scope. Award rows are duplicate provenance for one Work. No adaptation, set, or spin-off is substituted. Ordinary Japanese manga; research-facility escape, supernatural power, and danger are content leads.
- evidence: COMICリュウ series/creator page, https://www.comic-ryu.jp/author/simizu-jn/ (sourceDate 2013-03-30 volume-1 listing; retrievedAt 2026-08-25); official series guide, https://www.comic-ryu.jp/series_group/tv%E3%82%A2%E3%83%8B%E3%83%A1%E5%8C%96/ (sourceDate not stated, current page; retrievedAt 2026-08-25).

### 18 — とろける鉄工所

- verdict: PASS.
- identity: 講談社 binds volume 1, 野村宗弘, and ISBN 9784063522471; the ISBN is valid and unique. Volume-3 electronic/paper dates are an edition distinction, not a second Work.
- scope/safety: Official listings cover volumes 1–3. The 2010 award is included; 2011 and 2012 rows are duplicates. No set, remake, spin-off, or alternate Work is present. Ordinary ヤングマガジン manga; welding, shock, burns, scaffolding, and workplace stress are content leads.
- evidence: 講談社 1, https://www.kodansha.co.jp/comic/products/0000038640 (sourceDate 2008-11-21; retrievedAt 2026-08-25); 2, https://www.kodansha.co.jp/comic/products/0000038651 (sourceDate 2009-03-23; retrievedAt 2026-08-25); electronic listing 3, https://www.kodansha.co.jp/comic/new-releases/e?page=1629 (sourceDate 2013-01-04 electronic listing; retrievedAt 2026-08-25).
- limitation: Volume 3 also has a 2009 paper-release lead. Keep the frozen volume-1 identity and do not transfer edition-specific page references.

### 19 — 新しい上司はど天然

- verdict: PASS_WITH_SCOPE_LIMIT.
- identity: 秋田書店 binds the exact title, いちかわ暖, volume 1, and ISBN 9784253142311; the ISBN is valid and unique. No decorative delimiter, duplicate Work, set, or spin-off relation is present.
- scope/safety: The official catalog check confirmed volume 1 but did not confirm official volume-2 or volume-3 product pages. Treat the assigned scope as the confirmed first volume only; do not infer later content or permanent series completion. The 2020 bookseller row is duplicate provenance. Ordinary ヤングチャンピオン・コミックス manga; prior workplace power harassment and distress are content leads.
- evidence: 秋田書店 official release, https://prtimes.jp/main/html/rd/p/000000029.000040601.html (sourceDate 2019-08-20; retrievedAt 2026-08-25); 秋田書店 volume 1, https://www.akitashoten.co.jp/comics/4253142311 (sourceDate 2019-08-20; retrievedAt 2026-08-25).

### 20 — 環と周

- verdict: PASS.
- identity: 集英社 binds 環と周, よしながふみ, an unnumbered one-volume standard マーガレットコミックス product, and ISBN 9784088448398; the ISBN is valid and unique. The title has no decorative delimiters.
- scope/safety: The official product and author interview describe one collected volume containing multiple period-set stories. The 2025 selection is included and the 2024 award row is duplicate provenance. No second Work, set, adaptation, or spin-off is in scope. Ordinary Japanese manga; illness, death, postwar conflict, murder/revenge, forced marriage, separation, and same-sex relationships are content leads.
- evidence: 集英社 volume page, https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-844839-8 (sourceDate 2023-10-23; retrievedAt 2026-08-25); author interview, https://shueisha.online/articles/-/167862 (sourceDate 2023-10-23; retrievedAt 2026-08-25); interview page 3, https://shueisha.online/articles/-/167862?disp=paging&page=3 (sourceDate 2023-10-23; retrievedAt 2026-08-25).

No title, Work ID, publisher, ISBN, volume row, safety row, source row, annotation state, eligibility state, or promotion state is changed by this review. The canonical decorative 『』 delimiter is absent from all ten titles. Meaningful punctuation in 尾守つみきと奇日常。 is retained, and product volume labels such as （1） or 1 are not copied into canonical titles.
