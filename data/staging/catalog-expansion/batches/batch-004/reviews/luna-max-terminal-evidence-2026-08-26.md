# Batch 004 Luna Max terminal evidence — 2026-08-26

- reviewedByHuman: `false`
- model: `gpt-5.6-luna`, reasoning `max`
- policy: `promotion-evidence-v3`
- environment: Windows paths only; no WSL path was used

## Position 7 — つらつらわらじ

- workId: `work-188ba092c6195603bb3f`
- official entry binding: [Kodansha volume 1](https://www.kodansha.co.jp/comic/products/0000014069), 2010-09-22; [Sony volume 2](https://ebookstore.sony.jp/title/00133690/id/BT000013369000200201/), 2011-03-23
- independent Japanese community routes: [CMOA volume 3](https://www.cmoa.jp/title/45802/vol/3/), [Manba volume 2](https://manba.co.jp/boards/11640/books/2), [BookLive volume 1 reviews](https://booklive.jp/review/list/title_id/132077/vol_no/001), and [Kinokuniya volume 2 reviews](https://www.kinokuniya.co.jp/f/dsg-01-9784063729900)
- accepted cells: `strategy=2` (`0.79`), `characterArcWeight=2` (`0.80`), `darkness=2` (`0.70`), `mentalStress=2` (`0.80`), `emotionalWarmth=2` (`0.76`)
- bounded observation: the entry range repeatedly describes itinerary and timing adjustments, the young retainer's conflict and growth, political surveillance and tension, and recurring humane or warm treatment. Value-4 endpoints are not established.
- retained unknown: `progression`, `problemSolving`, `comedy`, and `romance`; no claim was duplicated to fill coverage.
- Korean discovery queries: `"츠라츠라 와라지" 만화 리뷰`, `"츠라츠라 와라지" 1권`, `"츠라츠라 와라지" 2권`, `느릿느릿 짚신`; no qualifying bounded Korean numeric evidence was found.
- terminal result: Narrative `4/6`, Tone `5/7`, Genre `1`, Theme `3`; `recommendationVerified`.
- recommendation context: [Kodansha release listing](https://www.kodansha.co.jp/comic/new-releases?page=1799) marks standard volume 5 complete on 2013-04-26; the later electronic special episode is excluded. Role: `bridge`.

## Position 9 — それでも町は廻っている

- workId: `work-1a6ad6771865b43c8516`
- official entry binding: [Shonen Gahosha volume 1](https://www.shonengahosha.co.jp/book_Info.php?id=5944), 2006-01-02; [volume 3](https://www.shonengahosha.co.jp/book_Info.php?id=6146), 2007-08-03
- independent Japanese community routes: [BookLive editorial review](https://booklive.jp/bkmr/soremachi-review), [Soraoboe entry-range review](https://soraoboe.biz/soremati/), [BookLive volume 1 reviews](https://booklive.jp/review/list/title_id/144592/vol_no/001?spoiler=1), and [volume 2 reviews](https://booklive.jp/review/list/title_id/144592/vol_no/002)
- accepted cells: `problemSolving=2` (`0.82`) and `romance=2` (`0.76`)
- bounded observation: separate entry-range reviews identify everyday mysteries with clues and solutions, while volume 1–2 observations repeat a limited romantic-comedy thread. Neither axis reaches the value-4 endpoint.
- retained unknown: `progression`, `strategy`, `darkness`, and `mentalStress`; source silence was not converted to zero.
- Korean discovery queries: `"그래도 마을은 돌아간다" 만화 리뷰`, `"그래도 마을은 돌아간다" 1권 리뷰`, `그래도 마을은 돌아간다 만화 후기`; no qualifying bounded Korean numeric evidence was found.
- terminal result: Narrative `4/6`, Tone `5/7`, Genre `2`, Theme `1`; `recommendationVerified`.
- recommendation context: [Shonen Gahosha volume 16](https://www.shonengahosha.co.jp/book_Info.php?id=5430), 2017-02-14, calls the 11-year series concluded. The separate guidebook is excluded. Role: `bridge`.

## Positions 36–40, 45–46, 48, and 50 — terminal blockers

All nine works retain their existing known cells. The bounded official, Japanese independent-review, and Korean-title searches below produced no additional Dictionary-valid numeric cell. Each result is `promotionBlocked` with `SOURCE_INFORMATION_UNAVAILABLE`; optional Art is not part of any blocker.

| Pos. | Work | Remaining gate failure | Official and Japanese review routes | Korean title queries | Confidence |
| ---: | --- | --- | --- | --- | ---: |
| 36 | 坂本ですが? | N 2/6; T 2/7 | [KADOKAWA](https://www.kadokawa.co.jp/product/201211000248), [BookWalker trial](https://bookwalker.jp/deefae4a8f-92f6-4093-8a11-61ce9bea897d/?sample=1&from=1), [note](https://note.com/moonmusicroom/n/n1149bc7a7331), [Buzzmanga](https://buzz-manga.blog.jp/Sakamotodesuga-All-Volumes-matome.html) | `사카모토입니다만?`, `사카모토입니다만 1권` | 0.88 |
| 37 | 来世は他人がいい | Theme 0; N 2/6 | [Comic DAYS](https://comic-days.com/episode/13932016480029553694), [Afternoon](https://afternoon.kodansha.co.jp/c/raisehataningaii/), [CMOA](https://www.cmoa.jp/title/customer_review/title_id/139087/), [Matsumoto](https://www.matsumototakahito.com/archives/26743219.html) | `내세에는 남남이 좋겠어`, `내세남남`, `내세남남 1권` | 0.92 |
| 38 | カラオケ行こ！ | N 1/6 | [KADOKAWA](https://www.kadokawa.co.jp/product/322002001211/), [BookWalker trial](https://bookwalker.jp/de542153af-b038-486c-9d6b-e58d0548ba2b/?sample=1&from=1), [Meg note](https://note.com/suki_oshinikki/n/nce6b3d5bbeb8), [Etou note](https://note.com/ue_nm_5o/n/n263a35851d29) | `가라오케 가자!`, `가라오케 가자`, `가라오케 이코` | 0.87 |
| 39 | となりの猫と恋知らず | N 1/6; T 4/7 | [Square Enix episode](https://magazine.jp.square-enix.com/comiweb/2024w/tcym/tonarinoneko_01/), [BookLive](https://booklive.jp/review/list/title_id/20079328/vol_no/001), [note](https://note.com/tsutinoetatsu/n/nbe41095214da) | `옆자리 고양이와 순수남`, `옆자리 고양이`, `옆자리 고양이 2권` | 0.90 |
| 40 | カッコウの許嫁 | N 1/6 | [Kodansha title](https://www.kodansha.co.jp/titles/1000036978), [volume 1 trial](https://www.kodansha.co.jp/comic/products/0000341183/trial), [BookLive](https://booklive.jp/review/list/title_id/754398/vol_no/001), [CMOA](https://www.cmoa.jp/title/customer_review/title_id/198816/) | `뻐꾸기 커플`, `뻐꾸기의 약혼녀`, `뻐꾸기 약혼자` | 0.93 |
| 45 | ここは今から倫理です。 | N 2/6 | [Shueisha volume 1 reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088907918), [Bookworms](https://bookworms.jp/book/4088907914), [poco-ku](https://poco-ku.com/kokohaimakara/), [tunabook](https://tunabook03.hatenablog.com/entry/2018/08/03/200003) | `여기는 지금부터 윤리 시간입니다.`, `지금부터 윤리입니다`, `코코와 이마카라 린리데스` | 0.94 |
| 46 | さよなら絵梨 | N 2/6; T 4/7 | [Shueisha](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1), [Jump+](https://shonenjumpplus.com/volume/4856001361007486895), [the338](https://the338.hatenablog.com/entry/2022/04/11/185823), [spaceplace](https://spaceplace.hatenablog.jp/entry/goodbye-eri) | `안녕, 에리`, `안녕 에리`, `안녕,에리` | 0.96 |
| 48 | アオハライド | N 2/6 | [Shueisha volume 1 reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088466477), [volume 2](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088466903), [volume 3](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088467313) | `아오하라이드`, `아오 하라이드`, `아오하라이드 1권` | 0.94 |
| 50 | LOVE SO LIFE | N 1/6; T 4/7 | [Hakusensha volume 1](https://www.hakusensha.co.jp/comicslist/44745/), [volume 2 CMOA](https://www.cmoa.jp/title/70262/vol/2/), [Sony reviews](https://ebookstore.sony.jp/review/title/10132778/id/LT000025962000394693/) | `러브 소 라이프`, `러브소라이프`, `LOVE SO LIFE 1권` | 0.95 |

## Positions 1–6, 8, and 10–35 — terminal blockers

The same terminal rule was applied to these 26 works: official entry-range material, independent Japanese reviews, and Korean searches using the Korean titles below were exhausted. Missing cells remain `unknown`; Art is optional and did not block any work.

| Pos. | Work | Remaining gate failure | Primary official route | Korean title queries | Confidence |
| ---: | --- | --- | --- | --- | ---: |
| 1 | ホストと社畜 | N 1/6 | [Futabasha volume 1](https://www.futabasha.co.jp/book/97845758600160000000?type=2) | `호스트와 사축 만화 리뷰` | 0.90 |
| 2 | うるわしの宵の月 | N 2/6 | [Kodansha volume 1](https://www.kodansha.co.jp/comic/products/0000347553) | `아름다운 초저녁의 달 만화 리뷰 한국`, `아름다운 초저녁달 만화 후기` | 0.91 |
| 4 | のらみみ | N 2/6; T 4/7 | [Shogakukan volume 1](https://e-comi.shogakukan.co.jp/books/091884110000d0000000) | `노라미미 만화 리뷰 일본`, `노라미미 만화책` | 0.88 |
| 5 | ヒナまつり | N 3/6 after accepting `problemSolving=2` | [KADOKAWA volume 1](https://www.kadokawa.co.jp/product/301306000979/) | `히나마츠리 1권 리뷰 만화`, `히나마츠리 2권 리뷰 만화`, `히나마츠리 3권 리뷰 만화` | 0.87 |
| 6 | 駅から5分 | N 2/6; T 4/7 | [Shueisha volume 1](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865439865439315501) | `역에서 5분 만화 후기`, `역에서 5분 쿠라모치 마치코 리뷰` | 0.86 |
| 8 | ふうらい姉妹 | Theme 0; N 0/6; T 4/7 | [KADOKAWA volume 1](https://www.kadokawa.co.jp/product/201008000188/) | `후라이 자매`, `풍래 자매`, `후라이 자매 1권 리뷰` | 0.92 |
| 10 | 青空にとおく酒浸り | N 1/6; T 2/7 | [Manga Taisho jury PDF](https://www.mangataisho.com/data/2012/mantai_comment2012.pdf) | `푸른 하늘에 술에 만화`, `아오조라 사케비타리 만화`, `청공에 멀리 술에 취해 만화` | 0.86 |
| 11 | Sunny | N 2/6 | [Shogakukan volume 1](https://e-comi.shogakukan.co.jp/books/091885570000d0000000) | `써니 마츠모토 타이요 만화 리뷰`, `써니 Sunny 1권 리뷰` | 0.90 |
| 12 | すみれファンファーレ | N 2/6 | [Shogakukan volume 1](https://shogakukan-comic.jp/book?jdcn=091885790000d0000000) | `스미레 팡파레 만화 리뷰`, `스미레 판파레` | 0.88 |
| 13 | ヒーローカンパニー | N 3/6; T 3/7 | [HERO'S Web](https://viewer.heros-web.com/episode/10834108156657187802) | `히어로 컴퍼니 일본 만화 리뷰`, `히어로 컴퍼니 시마모토 만화` | 0.87 |
| 15 | キルアオ | N 3/6 | [S-MANGA volume 1](https://www.s-manga.net/items/contents.html?isbn=978-4-08-883686-7) | `킬 블루 만화 리뷰 1권`, `킬 블루 한국 만화 리뷰` | 0.90 |
| 16 | 尾守つみきと奇日常。 | N 2/6 | [Shogakukan volume 1](https://e-comi.shogakukan.co.jp/books/098531820000d0000000) | `오가미 츠미키와 기일상`, `오모리 츠미키와 기묘한 일상` | 0.87 |
| 19 | 新しい上司はど天然 | N 1/6 | [Akita Shoten release](https://prtimes.jp/main/html/rd/p/000000029.000040601.html) | `새로운 상사는 천연`, `새로운 상사는 도천연` | 0.89 |
| 22 | 俺物語！！ | N 1/6 | [Shueisha volume 1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-846756-6) | `내 이야기!! 만화 리뷰 1권`, `내 이야기 만화 후기` | 0.91 |
| 23 | お茶にごす。 | N 2/6 | [Shogakukan volume 1](https://e-comi.shogakukan.co.jp/books/091211680000d0000000) | `차를 마시자!! 2권 리뷰`, `차를 마시자 만화 후기` | 0.89 |
| 25 | ルックバック | N 2/6 | [Shueisha product](https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000016342800) | `룩 백 만화 리뷰`, `룩백 후지모토 타츠키 리뷰` | 0.92 |
| 26 | 夢中さ、きみに。 | N 0/6; T 1/7 | [KADOKAWA](https://www.kadokawa.co.jp/product/321904000716/) | `빠졌어, 너에게`, `빠졌어 너에게`, `빠졌어, 너에게 만화 리뷰` | 0.89 |
| 27 | 異世界おじさん | N 3/6 | [KADOKAWA volume 1](https://www.kadokawa.co.jp/product/321808000769/) | `이세계 삼촌`, `이세계의 삼촌`, `이세계 삼촌 1권 리뷰` | 0.89 |
| 28 | 思い、思われ、ふり、ふられ | N 2/6 | [Shueisha volume 1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-845467-2) | `사랑하고 사랑받고, 차고 차이고` | 0.90 |
| 29 | 式の前日 | Theme 0; N 1/6; T 1/7 | [Shogakukan](https://shogakukan-comic.jp/book?jdcn=091345850000d0000000) | `결혼식 전날`, `결혼식 전 날`, `결혼식 전날 호즈미` | 0.91 |
| 30 | さんすくみ | N 2/6 | [Shogakukan](https://shogakukan-comic.jp/book?jdcn=091334600000d0000000) | `삼삼세 만화`, `산스쿠미 만화 리뷰`, `삼스쿠미` | 0.87 |
| 31 | 邪神の弁当屋さん | N 3/6; T 3/7 | [Kodansha volume 1](https://www.kodansha.co.jp/comic/products/0000404585) | `사신의 도시락집`, `사신의 도시락 가게`, `사신의 벤토 가게` | 0.87 |
| 32 | 働かないふたり | Theme 0; N 1/6; T 3/7 | [Shinchosha volume 1](https://www.shinchosha.co.jp/book/771744/) | `일하지 않는 두 사람`, `일하지않는 두사람`, `일하지 않는 두 사람 1권` | 0.86 |
| 33 | あした死ぬには、 | N 1/6 | [Ohta Books volume 1](https://www.ohtabooks.com/publish/2019/06/12000000.html) | `내일 죽기에는`, `내일 죽기에는 1`, `내일 죽기에는 만화` | 0.87 |
| 34 | ドカ食いダイスキ！ もちづきさん | N 1/6; T 1/7 | [Hakusensha volume 1](https://www.hakusensha.co.jp/comicslist/72311/) | `폭식 너무 좋아! 모치즈키 양`, `폭식너무 좋아 모치즈키양` | 0.91 |
| 35 | ディグイット | N 2/6; T 3/7 | [Kodansha volume 1](https://www.kodansha.co.jp/comic/products/0000413972) | `디그 잇`, `디그잇`, `디그 잇 배구 만화 리뷰` | 0.86 |
