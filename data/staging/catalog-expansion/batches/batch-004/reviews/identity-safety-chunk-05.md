# Batch 004 chunk 05 identity, ISBN, scope, and safety review

- reviewDate: 2026-08-25
- reviewer: independent Daybreak Blue review
- reviewedByHuman: false
- officialRecheck: representative official publisher product pages, retrieved 2026-08-25
- Grok conclusions inspected: false
- Art and Factor values assigned: none

## Registry and batch checks

- Frozen positions 41–50 and current `data/source/works.csv` titles match exactly; no canonical title contains `『` or `』`.
- Current `promotion-registry.csv` rows are all `libraryOnly`, `canonicalStatus=verified`, `representativeIsbnStatus=verified`, `safetyStatus=safe`, and `plannedBatch=batch-004`; none is onboarding- or recommendation-eligible.
- Current `data/source/volumes.csv` has exactly one `isRepresentative=true`, `editionKind=standard` row per work. The ten representative ISBNs are unique and all pass ISBN-13 checksum validation.
- All ten are Japanese publisher manga products (少年・青年・少女 labels or their standard publisher imprints), not webtoons or adult-only products. Seinen is treated as an audience label, not an R18 classification.

| Pos | Work | Canonical title | Representative standard ISBN | Verdict |
| ---: | --- | --- | --- | --- |
| 41 | `work-c7280f9dcc2754d3f864` | 鵺の陰陽師 | `9784088836874` | PASS |
| 42 | `work-d63a83030a8819ff553c` | モテキ | `9784063522594` | PASS |
| 43 | `work-d8a87d01c1f35d58e791` | 八雲さんは餌づけがしたい。 | `9784757551107` | PASS with age-boundary note |
| 44 | `work-e2f095e08fc5e08d5a2b` | 高嶺と花 | `9784592213512` | PASS with age/power note |
| 45 | `work-e81955a9fc5c4d84580f` | ここは今から倫理です。 | `9784088907918` | PASS with sensitive-theme note |
| 46 | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | `9784088831671` | PASS with death/self-harm note |
| 47 | `work-f8cb26831612e0c6ece5` | 極楽街 | `9784088827407` | PASS with violence/horror note |
| 48 | `work-fc53cb5669aa4099ee4a` | アオハライド | `9784088466477` | PASS with bullying note |
| 49 | `work-fd2a957c501c36047ed0` | 青の祓魔師 | `9784088747095` | PASS with death/supernatural-threat note |
| 50 | `work-ff9b025f58d7e12f3cb1` | LOVE SO LIFE | `9784592187349` | PASS with minor-care note |

## Per-work review

### 41 — 鵺の陰陽師

- officialSource:
  - sourceName: 集英社公式商品ページ・ジャンプコミックス第1巻
  - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883687-4
  - publishedAt: 2023-10-04
  - retrievedAt: 2026-08-25
- identity: Official title `鵺の陰陽師 1`, creator 川江康太, Jump Comics, and ISBN `9784088836874` match the frozen work. The page identifies a 2020s 少年 manga; no title or creator conflict found.
- edition/relation: Paper ISBN is the standard representative; the linked digital edition is the same volume. No duplicate, alternate canonical title, or spin-off relation found.
- scope/safety: Japanese manga, non-webtoon, non-adult. Supernatural exorcism, confrontations, and weapon damage are safety signals only; official product copy does not establish gore, death intensity, or adult-only classification.
- verdict: PASS.

### 42 — モテキ

- officialSource:
  - sourceName: 講談社公式商品ページ・イブニングKC第1巻
  - sourceUrl: https://www.kodansha.co.jp/comic/products/0000038652
  - publishedAt: 2009-03-23
  - retrievedAt: 2026-08-25
- identity: The official indexed page (the current direct fetch returned 403) identifies title `モテキ（1）`, creator 久保ミツロウ, Evening KC, and ISBN `9784063522594`, matching the frozen work and current source row. Its indexed contents and bibliography identify the original volume 1.
- edition/relation: The official related-products list also contains `新装版 モテキ（1）`; that is a later edition, not a second Work. The frozen original standard ISBN remains representative. No spin-off conflict found.
- scope/safety: Japanese seinen manga, non-webtoon, non-adult-only. Romance, rejection, and popularity themes are not adult-content evidence.
- verdict: PASS.

### 43 — 八雲さんは餌づけがしたい。

- officialSource:
  - sourceName: スクウェア・エニックス公式商品ページ・ヤングガンガンコミックス第1巻
  - sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757551107/
  - publishedAt: 2016-09-24
  - retrievedAt: 2026-08-25
- identity: Official title, creator 里見U, Young Gangan, and ISBN `9784757551107` match the frozen work. The publisher identifies the series as `八雲さんは餌づけがしたい。`; punctuation is retained without decorative brackets.
- edition/relation: The paper ISBN is the standard representative; digital distribution is the same volume. The official series list's later `11（完）` and `12 特別読切（完）` are continuation/special-reading products, not duplicate canonical Works; no spin-off conflict found.
- scope/safety: Japanese seinen manga, non-webtoon, non-adult-only. The official copy explicitly pairs a 28-year-old widow with a 16-year-old high-school baseball player and private meals; retain this age/relationship-boundary note for follow-up safety review. No explicit sexual or adult-only marker appears in the publisher product route.
- verdict: PASS with age-boundary note.

### 44 — 高嶺と花

- officialSource:
  - sourceName: 白泉社公式商品ページ・花とゆめコミックス第1巻
  - sourceUrl: https://www.hakusensha.co.jp/comicslist/46600/
  - publishedAt: 2015-03-20
  - retrievedAt: 2026-08-25
- identity: Official title `高嶺と花 1`, creator 師走ゆき, Hana to Yume Comics, and ISBN `9784592213512` match the frozen work. Publisher copy identifies a high-school girl and the heir 才原高嶺; no identity conflict found.
- edition/relation: Standard paper volume 1 is representative. Any digital or limited-format purchase links remain editions of the same volume; no duplicate or spin-off relation found.
- scope/safety: Japanese shojo manga, non-webtoon, non-adult-only. The publisher's arranged-meeting setup involves a high-school protagonist and an older wealthy heir; retain age/power/consent-boundary observation without inferring coercion or sexual content from the blurb.
- verdict: PASS with age/power note.

### 45 — ここは今から倫理です。

- officialSource:
  - sourceName: 集英社公式商品ページ・ヤングジャンプコミックス第1巻
  - sourceUrl: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-890791-8
  - publishedAt: 2017-11-22
  - retrievedAt: 2026-08-25
- identity: Official title, creator 雨瀬シオリ, Young Jump Comics, and ISBN `9784088907918` match the frozen work. The page identifies a 2010s 青年 manga and the same teacher 高柳 premise; no duplicate title found.
- edition/relation: Standard paper volume 1 is representative; digital is the same work/volume. No edition split or spin-off conflict found.
- scope/safety: Japanese seinen manga, non-webtoon, non-adult-only. Student problems, inner distress, and the publisher's “救い” framing are sensitive-theme signals; the official product copy does not establish self-harm, abuse, death, or adult classification.
- verdict: PASS with sensitive-theme note.

### 46 — さよなら絵梨

- officialSource:
  - sourceName: 集英社公式商品ページ・ジャンプコミックス単行本
  - sourceUrl: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1
  - publishedAt: 2022-07-04
  - retrievedAt: 2026-08-25
- identity: Official title `さよなら絵梨`, creator 藤本タツキ, Jump Comics, and ISBN `9784088831671` match the frozen work. This is a complete one-shot; the source row's blank volume number is correct for the single-volume exception.
- edition/relation: Standard paper one-shot is representative; digital is the same one-shot. No volume 2/3, duplicate Work, or spin-off relation found.
- scope/safety: Japanese shonen manga/one-shot, non-webtoon, non-adult-only. The official copy explicitly mentions illness, death, a suicide attempt, and mourning; retain those safety signals without inferring graphicness or risk level from the product copy.
- verdict: PASS with death/self-harm note.

### 47 — 極楽街

- officialSource:
  - sourceName: 集英社公式商品ページ・ジャンプコミックス第1巻（digital page with paper-product bridge）
  - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024865900
  - publishedAt: 2022-11-04
  - retrievedAt: 2026-08-25
- identity: Official page identifies `極楽街 1`, creator 佐乃夕斗, and the paper ISBN `9784088827407`; this matches the frozen representative and current source row. The page also identifies Jump SQ. and 少年 classification.
- edition/relation: The URL is a digital product page, but its linked paper product supplies the standard representative ISBN; digital and paper are one volume, not duplicate Works. No spin-off conflict found.
- scope/safety: Japanese shonen manga, non-webtoon, non-adult-only. Missing persons, animal carcasses, cannibalistic inhuman figures, and action violence are explicit safety-review signals; gore and visual intensity remain unjudged.
- verdict: PASS with violence/horror note.

### 48 — アオハライド

- officialSource:
  - sourceName: 集英社公式商品ページ・マーガレットコミックス第1巻
  - sourceUrl: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846647-7
  - publishedAt: 2011-04-13
  - retrievedAt: 2026-08-25
- identity: Official title, creator 咲坂伊緒, Margaret Comics, and ISBN `9784088466477` match the frozen work. The page identifies the same high-school premise and includes `アオハライド unwritten` as collected material in volume 1.
- edition/relation: `unwritten` is bonus material inside volume 1, not a separate Work. Standard paper volume 1 remains representative; no duplicate or spin-off conflict found.
- scope/safety: Japanese shojo manga, non-webtoon, non-adult-only. Middle-school exclusion/bullying and social isolation are safety observations; the official copy provides no adult or explicit-sexual marker.
- verdict: PASS with bullying note.

### 49 — 青の祓魔師

- officialSource:
  - sourceName: 集英社公式商品ページ・ジャンプコミックス第1巻
  - sourceUrl: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874709-5
  - publishedAt: 2009-08-04
  - retrievedAt: 2026-08-25
- identity: Official title, creator 加藤和恵, Jump Comics, and ISBN `9784088747095` match the frozen work. The page identifies the same demon/exorcist premise and 少年 classification.
- edition/relation: Standard paper volume 1 is representative. Digital/color editions and companion guide products are editions or companion products, not a second canonical Work; no spin-off conflict found.
- scope/safety: Japanese shonen manga, non-webtoon, non-adult-only. Adoptive-parent death, demon attacks, weapons, and uncontrolled flames are safety signals; official copy does not establish gore intensity or adult-only classification.
- verdict: PASS with death/supernatural-threat note.

### 50 — LOVE SO LIFE

- officialSource:
  - sourceName: 白泉社公式商品ページ・花とゆめコミックス第1巻
  - sourceUrl: https://www.hakusensha.co.jp/comicslist/44745/
  - publishedAt: 2009-05-19
  - retrievedAt: 2026-08-25
- identity: Official title `LOVE SO LIFE 1`, creator こうち楓, Hana to Yume Comics, and ISBN `9784592187349` match the frozen work. The canonical title is recorded without the full-width spacing seen in some retailer metadata.
- edition/relation: Standard paper volume 1 is representative. The official related list contains `LIFE SO HAPPY`, a distinct sequel/related Work; it must not be merged into `LOVE SO LIFE`. No same-work duplicate found.
- scope/safety: Japanese shojo manga, non-webtoon, non-adult-only. A 16-year-old orphan working as a babysitter and childcare/family setting are protection-boundary observations; the official product copy has no adult-only or explicit-sexual marker.
- verdict: PASS with minor-care note.

## Adjudication

All ten frozen Works retain their canonical Work IDs, exact titles, standard representative ISBNs, and `libraryOnly` boundary. No duplicate, wrong-edition, webtoon, adult-only, or spin-off merge blocker was found. Sensitive-content notes remain visible for follow-up safety review; they do not change the scope verdict. This review assigns no Factor, Theme, Genre, Art, promotion, onboarding, or recommendation values.
