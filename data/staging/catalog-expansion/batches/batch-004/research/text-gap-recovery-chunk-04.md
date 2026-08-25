# Batch 004 text-gap recovery — chunk 04

- 대상: Batch 004 frozen manifest positions 31–40
- 조사일/조회일: `2026-08-25`
- 범위: `entry_1_3_volumes`; 단권 완결작은 확인 가능한 완결 범위
- 목적: Daybreak Pass C가 지정한 Genre/Theme/Narrative/Tone 잔여 셀의 추가 근거 수집
- 상태: research only. Pass A CSV, Genre/Theme CSV, promotion registry, source registry, generated catalog는 수정하지 않음
- `reviewedByHuman`: `false`
- canonical title normalization: 장식용 `『`·`』`는 작품명에 포함하지 않음
- Art: 이 문서에서 다루지 않음. 기존 Art `unknown`/`ART_ABSTAIN` 상태를 변경하지 않음

## Reading and evidence policy

공식 출판사·권리자 권 소개를 먼저 대조했다. 기존 Batch 004 official packet의 판본·범위는 유지하고, 이번 문서에서는 남아 있는 셀에 직접 연결되는 관찰만 추가했다. 유저 리뷰는 작품을 실제로 읽은 entry-scoped 리뷰에서 구체적 반복 관찰이 두 명 이상의 독립된 작성자에게 일치할 때만 보조 근거로 사용했다. 평점·태그·추천 목록 등재·작품을 읽지 않은 반응은 Factor 근거로 사용하지 않았다.

각 리뷰 lead의 독립성은 작성자와 페이지가 서로 다른지 확인했다. 한 플랫폼의 review page라도 서로 다른 reviewer의 구체적 관찰은 별도 관찰로 기록하되, 동일 문장 복제나 자동 집계는 제외했다. 게시일이 페이지에 노출되지 않으면 `not exposed`로 기록했다. 모든 URL의 조회일은 `2026-08-25`다. 아래 값은 adjudication 입력 후보이지 최종 승인값이 아니다.

장르에서 Axis를 자동 추론하지 않았고, 제목·줄거리의 침묵을 0으로 바꾸지 않았다. 표지·애니메이션·줄거리만으로 Art 값을 known으로 만들지 않았다.

## Residual gate baseline

다음은 `reviews/daybreak-text-adjudication.md`의 동결 결과를 그대로 전사한 것이다. 기존 accepted cell은 변경하지 않는다.

| position | workId                      | canonicalTitle                  | remaining gate gap              | current bounded result                                                                                                                                             |
| -------: | --------------------------- | ------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|       31 | `work-925f371723beac5227f7` | 邪神の弁当屋さん                | Narrative +3, Tone +4           | Genre `fantasy;sliceOfLife`; Theme `cooking:2`; Tone `relationshipStructure=2`                                                                                     |
|       32 | `work-961a49798df191311f42` | 働かないふたり                  | Theme +1, Narrative +4, Tone +3 | Genre `comedy;sliceOfLife`; Tone `relationshipStructure=2`, `comedy=2`                                                                                             |
|       33 | `work-9bd00739b995d84e2494` | あした死ぬには、                | Narrative +4                    | Genre `sliceOfLife`; Theme `workplace=1`; Tone `characterArcWeight=3`, `relationshipStructure=2`, `darkness=2`, `mentalStress=2`, `romance=1`, `emotionalWarmth=2` |
|       34 | `work-a3d922576a1a1ecc8e3e` | ドカ食いダイスキ！ もちづきさん | Theme +1, Narrative +4, Tone +4 | Genre `comedy;sliceOfLife`; Tone `comedy=4`                                                                                                                        |
|       35 | `work-aa85b65d02f367e76a07` | ディグイット                    | Narrative +2, Tone +3           | Genre `sports`; Theme `sportsCompetition:2`; Narrative `progression=2`, `pacing=2`; Tone `characterArcWeight=3`, `relationshipStructure=2`                         |
|       36 | `work-af3443bab1c30d470a76` | 坂本ですが?                     | Narrative +4, Tone +4           | Genre `comedy;sliceOfLife`; Theme `school:2`; Tone `comedy=4`                                                                                                      |
|       37 | `work-bd5c323a3dbc9f3a04d4` | 来世は他人がいい                | Theme +1, Narrative +3          | Genre `romance`; Narrative `pacing=2`; Tone `characterArcWeight=3`, `relationshipStructure=3`, `comedy=2`, `darkness=2`, `mentalStress=2`, `romance=4`             |
|       38 | `work-c2df32661c0b925ff74f` | カラオケ行こ！                  | Narrative +4, Tone +2           | Genre `comedy;sliceOfLife`; Theme `school:1`; Tone `characterArcWeight=3`, `relationshipStructure=2`, `comedy=2`                                                   |
|       39 | `work-c2f3864045578cebb590` | となりの猫と恋知らず            | Narrative +3, Tone +2           | Genre `sliceOfLife;romance`; Theme `school:2`; Narrative `pacing=2`; Tone `characterArcWeight=3`, `relationshipStructure=2`, `romance=4`                           |
|       40 | `work-c5c2695ad33fd05af945` | カッコウの許嫁                  | Narrative +3, Tone +2           | Genre `sliceOfLife;romance`; Theme `school:2`; Narrative `pacing=2`; Tone `characterArcWeight=3`, `relationshipStructure=3`, `romance=4`                           |

## Additional source ledger

공식 source는 기존 `research/chunk-04.md`에 있는 동일 판본을 다시 사용했다. 아래는 이번 recovery에서 실제로 읽은 공식 source와 독립 리뷰 lead다.

| sourceId                | position | source name and URL                                                                                                                                                                                                                                                          | publishedAt                                                                      | entry scope                                              | class / independence                                  | concrete use                                                                                                                                  |
| ----------------------- | -------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `tgr-31-kodansha-123`   |       31 | 講談社, [邪神の弁当屋さん 1](https://www.kodansha.co.jp/comic/products/0000404585), [2](https://www.kodansha.co.jp/comic/products/0000415367), [3](https://www.kodansha.co.jp/comic/products/0000420295)                                                                     | 2025-01-20 / 2025-06-19 / 2025-11-20                                             | 일반판 1–3권                                             | official publisher; primary                           | 도시락 가게를 중심으로 신·인간·괴물 인물의 결핍, 공동체 활동, 비밀과 내면 공간이 권별로 반복·확장됨을 확인                                    |
| `tgr-31-cmoa`           |       31 | Comic Cmoa, [邪神の弁当屋さん reviews](https://www.cmoa.jp/title/customer_review/title_id/311981/)                                                                                                                                                                           | reviewers 2025-03-12, 2025-03-14, 2026-01-25; other dates exposed                | 1–2권을 직접 읽은 reviewer 관찰; 일부 전권 언급은 제외   | user review page; distinct reviewers on one page      | 1권의 의문이 2권에서 일부 회수되고 관계가 깊어진다는 관찰, 신·인간의 상이한 관점, 개그와 진지한 부분의 교차를 독립 관찰로 기록                |
| `tgr-31-mangataisho`    |       31 | マンガ大賞, [2026 selection comments](https://www.mangataisho.com/data/2026/comment2026.pdf)                                                                                                                                                                                 | 2026                                                                             | 심사 당시 공개 범위; 권수 불명                           | official award commentary; secondary, not user review | 단순 옴니버스에서 배경·이야기 층이 겹치고 따뜻함이 쌓인다는 구체적 보조 관찰. 값의 단독 근거로 사용하지 않음                                  |
| `tgr-32-shinchosha-123` |       32 | 新潮社, [働かないふたり 1](https://www.shinchosha.co.jp/book/771744/), [2](https://www.shinchosha.co.jp/book/771765/), [3](https://www.shinchosha.co.jp/book/771782/)                                                                                                        | 2014-05-09 / 2014-08-09 / 2014-11-08                                             | 일반판 1–3권                                             | official publisher; primary                           | 남매의 게임·TV·대화 중심 생활과 4컷 에피소드, 이웃 인물의 접근을 권별로 확인                                                                  |
| `tgr-32-cmoa`           |       32 | Comic Cmoa, [働かないふたり reviews](https://www.cmoa.jp/title/89250/?order=up)                                                                                                                                                                                              | reviewer 2026-07-13; other dates exposed                                         | 1권을 읽은 review; 미독 상태 고백은 제외                 | user review page; distinct reviewer                   | 밝은 니트 남매 일상과 잠재적 미래 불안을 구분해 관찰. 작품 본편의 반복 구조를 직접 지지하는 부분만 사용                                       |
| `tgr-32-mangasuki`      |       32 | マンガ好きによるマンガ感想ブログ, [働かないふたり 1巻](https://mangasuki-info.com/hatarakanai_001/)                                                                                                                                                                          | published 2020-10-05; updated 2024-08-11                                         | 1권; 남매·친구·가족의 반복 일상                          | user review/blog; distinct author                     | TV·게임을 반복하는 남매와 친구가 여러 번 접촉하며 대화가 조금씩 열리는 구체적 entry 관찰                                                      |
| `tgr-33-ohta-123`       |       33 | 太田出版, [あした死ぬには 1](https://www.ohtabooks.com/publish/2019/06/12000000.html), [2](https://www.ohtabooks.com/publish/2020/01/16130028.html), [3](https://www.ohtabooks.com/publish/2021/03/11181256.html)                                                            | 2019-06-12 / 2020-01-16 / 2021-03-11                                             | 일반판 1–3권                                             | official publisher; primary                           | 몸의 변화, 직업·가족·돈·돌봄·죽음 인식이 세 권에 걸쳐 서로 다른 여성의 생활 문제로 전개됨을 확인                                              |
| `tgr-33-cmoa`           |       33 | Comic Cmoa, [あした死ぬには reviews](https://www.cmoa.jp/title/customer_review/title_id/177415/?site_kbn=1)                                                                                                                                                                  | reviewer example 2026-04-16; other dates exposed                                 | 1권 review와 전권 언급 분리; 전권 결말은 제외            | user review page; distinct reviewers                  | 직장·친구·가족 인물이 완결된 승리/패배보다 계속되는 삶의 관계로 남는다는 entry observation. 결말·전권 감상은 제외                             |
| `tgr-33-manba`          |       33 | マンバ, [40代の生活変化 review](https://manba.co.jp/topics/17875)                                                                                                                                                                                                            | not exposed                                                                      | 1권 초반의 건강 변화와 직장 대화                         | review article; distinct author                       | 40대의 건강 변화를 설명하고 주변 동료에게 상태를 알리는 구체적 대응을 기록                                                                    |
| `tgr-33-sony`           |       33 | Sony Reader, [あした死ぬには 1 reviews](https://ebookstore.sony.jp/review/title/10426205/id/LT000115468000927872/)                                                                                                                                                           | not exposed                                                                      | volume 1 review snippets; direct user entries            | user review page; distinct reviewers                  | 건강 변화와 현재를 다시 보게 되는 정서 반응을 보조적으로 확인. 평점·작화 평가는 제외                                                          |
| `tgr-34-hakusensha-123` |       34 | 白泉社, [ドカ食いダイスキ！ もちづきさん 1](https://www.hakusensha.co.jp/comicslist/72311/), [2](https://www.hakusensha.co.jp/comicslist/74386/), [3](https://www.hakusensha.co.jp/comicslist/76507/)                                                                        | 2024-10-29 / 2025-04-28 / 2025-11-28                                             | 일반판 1–3권                                             | official publisher; primary                           | 메뉴와 장소를 바꿔도 대량 섭취·미식 개그가 반복되는 권별 premise를 확인                                                                       |
| `tgr-34-note`           |       34 | まほろ, [もちづきさん 1巻 감상](https://note.com/mahorobooks/n/n49bcd8db5397)                                                                                                                                                                                                | 2026-06-18                                                                       | 1권, 1–6화의 episode별 독서 기록                         | user review; distinct author                          | 각 화에서 도시락·잔업식·건강검진·휴일 식사가 반복되고, 4화 이후 개그가 체감된다는 구체적 관찰                                                 |
| `tgr-34-mangawatch`     |       34 | MANGA Watch, [もちづきさん review](https://manga.watch.impress.co.jp/docs/review/1631411.html)                                                                                                                                                                               | 2024-10-28                                                                      | 1권 수록 초반 회차 중심의 professional review            | independent criticism; not selection provenance       | 음식량·건강검진·동료에게 음식 나눔·매회 다른 자기합리화가 반복된다는 구체적 관찰. 건강 위험을 안전 판정이나 darkness 자동값으로 사용하지 않음 |
| `tgr-34-cmoa`           |       34 | Comic Cmoa, [もちづきさん 1 reviews](https://www.cmoa.jp/title/304902/)                                                                                                                                                                                                      | reviewer dates not exposed; page accessed 2026-08-25                             | 1–3권 review page; 1화 완결 반복 구조만 사용             | user review page; distinct reviewers                  | 1화 완결과 읽기 속도, 음식·캐릭터의 귀여움에 대한 구체적 반복 관찰. tags/score는 제외                                                         |
| `tgr-35-kodansha-123`   |       35 | 講談社, [ディグイット 1](https://www.kodansha.co.jp/comic/products/0000413972), [2](https://www.kodansha.co.jp/comic/products/0000420816), [3](https://www.kodansha.co.jp/comic/products/0000425848)                                                                         | 2025-08-22 / 2025-12-23 / 2026-04-23                                             | 일반판 1–3권                                             | official publisher; primary                           | 아버지의 기대에서 리베로 자기증명으로 목표가 이동하고, 팀 연습·강호전·라이벌 경기가 이어짐을 확인                                             |
| `tgr-35-booklog`        |       35 | ブクログ, [ディグイット 1感想](https://booklog.jp/item/1/4065398045)                                                                                                                                                                                                         | reviewers 2025-08-28, 2025-08-30, 2025-09-13, 2025-09-29                         | 1권; 각 reviewer의 직접 독서 관찰                        | user review page; distinct reviewers                  | 리베로 시점의 수비, 부모 갈등, 라이벌과 2권 강호전으로 이어지는 기대를 구체적으로 기록. 점수는 제외                                           |
| `tgr-35-note`           |       35 | マンガ好き, [ディグイット 1巻感想](https://note.com/manga_log/n/n58628667c1e8)                                                                                                                                                                                               | 2025-09-20                                                                       | 1권, 초반 연습·練習試合                                  | user review; distinct author                          | 훈련 경기에서 포지션별 기술이 충돌하고, 코치와 지역 상위교전이 이어지는 반복 경기 구조를 확인                                                 |
| `tgr-36-kadokawa-123`   |       36 | KADOKAWA, [坂本ですが? 1](https://www.kadokawa.co.jp/product/201211000248), [2](https://www.kadokawa.co.jp/product/301307000930/), [3](https://www.kadokawa.co.jp/product/301410000750/)                                                                                     | 2013-01-15 / 2013-11-15 / 2014-12-15                                             | 일반판 1–3권                                             | official publisher; primary                           | 학교의 서로 다른 일상 상황에서 같은 주인공의 대응 형식이 반복되고, 3권에서 학교 행사로 상황이 이동함을 확인                                   |
| `tgr-36-note`           |       36 | hiro’, [坂本ですが? 감상](https://note.com/moonmusicroom/n/n1149bc7a7331)                                                                                                                                                                                                    | 2023-12-02                                                                       | 전권 독서; 1–3권 학교 코미디 관찰만 사용                 | user review; distinct author                          | 학교에서 학생 집단의 반응을 바꾸는 코미디 상황과 졸업·이별의 정서적 마무리를 구체적으로 기록                                                  |
| `tgr-36-buzzmanga`      |       36 | バズマン。, [坂本ですが? 전권 review](https://buzz-manga.blog.jp/Sakamotodesuga-All-Volumes-matome.html)                                                                                                                                                                     | 2016-03-16                                                                       | 전권; 1–3권의 반복 사례만 사용                           | manga review; distinct author                         | 장난·벌·학교 행사·곤란한 동물 등 매번 다른 문제를 같은 스타일의 행동으로 처리하고 주변 인물의 태도가 변하는 사례를 열거                       |
| `tgr-36-bulublog`       |       36 | ぶるぶろぐ, [坂本ですが? 1巻](https://bulublogpart1.seesaa.net/article/a63640131.html)                                                                                                                                                                                       | 2013-05-08                                                                       | 1권                                                      | user review/blog; distinct author                     | 괴롭힘, 벌, 벌집, 친구 보호 등의 개별 학교 사건을 직접 독서 관찰로 기록                                                                       |
| `tgr-37-kodansha-123`   |       37 | 講談社, [来世は他人がいい 1](https://www.kodansha.co.jp/comic/products/0000052167), [2](https://www.kodansha.co.jp/comic/products/0000310261), [3](https://www.kodansha.co.jp/comic/products/0000320388)                                                                     | 2017-11-22 / 2018-07-23 / 2019-05-23                                             | 일반판 1–3권                                             | official publisher; primary                           | 동서 지역 야쿠자 가족, 약혼·동거, 친족·지인 개입이 권별로 확장되고 사건·관계가 겹침을 확인                                                    |
| `tgr-37-cmoa`           |       37 | Comic Cmoa, [来世は他人がいい reviews](https://www.cmoa.jp/title/customer_review/title_id/139087/)                                                                                                                                                                           | reviewers 2021-06-07, 2023-11-13, 2024-12-31; other dates exposed                | 1권부터 읽은 reviewer의 관계·伏線 관찰; 후권 세부는 제외 | user review page; distinct reviewers                  | 야쿠자 관계가 복잡하고 반복 독서에서 복선이 회수된다는 관찰, 주요 인물 간 충돌·공조를 기록                                                    |
| `tgr-37-storygraph`     |       37 | The StoryGraph, [来世は他人がいい 1 reviews](https://app.thestorygraph.com/book_reviews/094f507c-75f8-45c0-b3d1-1217ea7f825d)                                                                                                                                                | reviewer dates not exposed; page accessed 2026-08-25                             | volume 1 edition-scoped written reviews                  | user review page; distinct reviewers                  | 야쿠자-coded romance, 어둡고 웃긴 분위기, 인물 결함·복합적 관계라는 구체 관찰만 사용; mood tags/점수는 제외                                   |
| `tgr-37-matsumoto`      |       37 | まつもとたかひと, [来世は他人がいい 1巻感想](https://www.matsumototakahito.com/archives/26743219.html)                                                                                                                                                                       | 2021-08-10                                                                       | 1권                                                      | manga review; distinct author                         | 두 지역 조직의 손녀·손자라는 설정, 긴장감이 유지되는 대화극, 초반의 여러 문제 전환을 구체적으로 기록                                          |
| `tgr-38-kadokawa-award` |       38 | KADOKAWA, [カラオケ行こ！](https://www.kadokawa.co.jp/product/322002001211/), マンガ大賞 [2021 comments](https://www.mangataisho.com/data/2021/comment2021.pdf)                                                                                                              | 2020-09-12 / 2021                                                                | 단권 완결; 심사 당시 단권 범위                           | official publisher + official award commentary        | 주간 노래 연습, 합唱부·야쿠자 관계, 코미디에서 긴장·정서적 결말로 이동하는 단권 구조를 확인                                                   |
| `tgr-38-note-meg`       |       38 | Meg, [カラオケ行こ！ 감상](https://note.com/suki_oshinikki/n/nce6b3d5bbeb8)                                                                                                                                                                                                  | 2025-08-23                                                                       | 단권; 원작 독서 감상. 애니메이션·후속작 언급은 제외      | user review; distinct author                          | 초반 개그와 반복 만남, 후반의 예상 밖 전환, 두 인물의 거리 변화와 여운을 직접 관찰                                                            |
| `tgr-38-note-kaoru`     |       38 | 桐生 薫, [カラオケ行こ！ 감상](https://note.com/kaoru246/n/n82165f7fd57c)                                                                                                                                                                                                    | 2024-07-08                                                                       | 단권; 전편·후편·추가 에피소드                            | user review; distinct author                          | 코미디에서 성대 변화·위험한 물건·긴장으로 전환되고 후반에 앞선 단서가 회수된다는 구체 관찰                                                    |
| `tgr-38-note-etou`      |       38 | えとうまこ, [奇妙な友情 review](https://note.com/ue_nm_5o/n/n263a35851d29)                                                                                                                                                                                                   | 2024-07-20                                                                       | 단권                                                     | manga review; distinct author                         | 야쿠자와 중학생의 비대칭 관계가 우정·코미디·긴장 사이를 오가는 반복 구조를 교차 확인                                                          |
| `tgr-39-squareenix-123` |       39 | スクウェア・エニックス, [となりの猫と恋知らず 1](https://magazine.jp.square-enix.com/top/comics/detail/9784757591264/), [2](https://magazine.jp.square-enix.com/top/comics/detail/9784757591646/), [3](https://magazine.jp.square-enix.com/top/comics/detail/9784757594883/) | 2024-03-25 / 2024-04-25 / 2024-10-25                                             | 일반판 1–3권                                             | official publisher; primary                           | 옆자리 접촉에서 친구 되기·사진부·고양이 활동으로 관계가 확장되는 권별 구조를 확인                                                             |
| `tgr-39-booklive`       |       39 | BookLive, [となりの猫と恋知らず 1巻 reviews](https://booklive.jp/review/list/title_id/20079328/vol_no/001)                                                                                                                                                                   | reviewers 2024-04-30, 2024-07-13, 2024-09-28, 2025-07-29, 2025-11-27, 2026-08-05 | 1권                                                      | user review page; distinct reviewers                  | 수줍은 두 사람이 학교·고양이 카페·보건실 등에서 접촉하고 천천히 친해지는 과정, 잔잔한 정서와 치유감을 구체적으로 기록                         |
| `tgr-39-note-haizuki`   |       39 | 灰月弥彦, [となりの猫と恋知らず 1・2 독서기록](https://note.com/tsutinoetatsu/n/nbe41095214da)                                                                                                                                                                               | 2024-09-14                                                                       | 1–2권; 2권 내용은 1권과 겹치는 관계 관찰만 사용          | user review; distinct author                          | 주인공이 말 걸기와 인간관계를 시도하며 변화하고 지인이 늘어나는 구체 관찰                                                                     |
| `tgr-39-note-uchiba`    |       39 | 内場悠月, [1화 감상](https://note.com/uchiba_yuzuki/n/na592e6cad050)                                                                                                                                                                                                         | 2025-08-17                                                                       | 첫 화만                                                  | user review; distinct author                          | 자유롭고 고양이 같은 인물과의 접촉에서 실제 연애의 두근거림·어려움을 느꼈다는 entry 관찰                                                      |
| `tgr-40-kodansha-123`   |       40 | 講談社, [カッコウの許嫁 1](https://www.kodansha.co.jp/comic/products/0000341183), [2](https://www.kodansha.co.jp/comic/products/0000342941), [3](https://www.kodansha.co.jp/comic/products/0000344125)                                                                       | 2020-05-15 / 2020-07-17 / 2020-09-17                                             | 일반판 1–3권                                             | official publisher; primary                           | 출생 비밀, 가짜 연인, 약혼, 동거, 가족·동급생 관계망이 권별로 이어짐을 확인                                                                   |
| `tgr-40-booklive`       |       40 | BookLive, [カッコウの許嫁 1巻 reviews](https://booklive.jp/review/list/title_id/754398/vol_no/001)                                                                                                                                                                           | reviewers 2021-02-25, 2021-07-18, 2022-01-08; other dates exposed                | 1권                                                      | user review page; distinct reviewers                  | 허위 연인에서 약혼·동거·다수 인물 관계로 전개되고 다음 권을 궁금하게 만드는 구체 관찰                                                         |
| `tgr-40-cmoa`           |       40 | Comic Cmoa, [カッコウの許嫁 reviews](https://www.cmoa.jp/title/customer_review/title_id/198816/)                                                                                                                                                                             | reviewer 2021-01-05, 2022-07-16; other dates exposed                             | 1권 및 초기 권의 reviewer 관찰                           | user review page; distinct reviewers                  | 여러 약혼·가족·동급생 관계가 함께 문제를 만들고 해결을 향해 움직이는 구조, 웃음과 따뜻함을 구체적으로 기록                                    |
| `tgr-40-uharu`          |       40 | ウハル＠ログ, [カッコウの許嫁 1巻 감상](https://hareumonosoregakoyomi.com/kakkounoiinazuke1/)                                                                                                                                                                                | 2020-06-20                                                                       | 1권                                                      | user review/blog; distinct author                     | 왕도 라브코미디의 대화 템포와 동거 시작을 직접 독서 관찰                                                                                      |

## Work-level recovery assessment

### 31 — 邪神の弁当屋さん

공식 1–3권은 도시락 가게를 공통 무대로 유지하면서 신·인간·괴물의 결핍과 공동체 사건을 늘린다. Cmoa의 서로 다른 reviewer들은 1권에서 남은 과거·관계 의문, 2권에서 일부 회수되는 비밀, 인물마다 다른 관점과 개그/진지함의 교차를 직접 언급했다. MangaTaisho 코멘트도 단순한 옴니버스에서 배경과 이야기 층이 겹친다고 보지만, 이는 공식 심사자의 보조 관찰이지 단독 값이 아니다.

| candidate cell       |    proposed value | evidence mapping                                                                                                 | limitation / confidence                                        |
| -------------------- | ----------------: | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `worldBuilding`      | known 2 candidate | 공식 1–3권의 신·인간·괴물·전쟁·신사/축제 설정 + Cmoa의 신들의 서로 다른 인식 관찰                                | 설정이 반복적으로 핵심인 정도는 3권 이후 불명. `0.60`          |
| `mysteryReveal`      | known 2 candidate | 공식 2권의 신력과 인물 과거, Cmoa의 1권 의문→2권 회수·아직 남은 비밀 관찰                                        | 단서 네트워크가 고밀도라는 뜻은 아님. `0.63`                   |
| `pacing`             | known 2 candidate | 1–3권에서 가게·공동 청소·축제·새 인물 사건으로 상태가 이동하고, 복수 reviewer가 이어지는 사건과 관계 심화를 기술 | 빠른 전개 `4`는 지지되지 않음. `0.54`                          |
| `characterArcWeight` | known 2 candidate | Cmoa가 레이니와 주변 인물의 서로 다른 사연·관점, 1권 의문 뒤 관계 심화를 반복 관찰                               | 관계가 핵심 보상인지 판정할 수 있는 내부 페이지는 없음. `0.56` |
| `emotionalWarmth`    | known 3 candidate | 공식 공동체/도시락 premise, Cmoa의 관계 심화·존중, MangaTaisho의 따뜻함이 쌓인다는 교차 lead                     | 공식 심사 코멘트의 범위가 통일되지 않아 `4`는 금지. `0.62`     |
| `mentalStress`       | known 2 candidate | 공식 2권의 인간에 대한 두려움과 과거 결핍, Cmoa의 진지한 부분·비밀·불안 관찰                                     | 지속적 심리 압박인지 불명. `0.42`; unknown 유지도 타당         |

`problemSolving`과 `strategy`는 도시락·생활 사건이 있다는 이유만으로 올리지 않는다. 위 후보를 적용해도 Narrative/Tone gate의 잔여가 남으므로 promotion 결정을 하지 않는다.

### 32 — 働かないふたり

공식 1–3권과 두 독립 리뷰는 남매가 집에서 게임·TV·대화를 반복하고, 짧은 4컷 에피소드 안에서 친구·이웃·가족과 접촉하는 범위를 확인한다. 이는 장기 목표나 추리 구조의 부재를 추론할 근거가 아니며, Daybreak가 거부한 `mysteryReveal=0`·`worldBuilding=0`을 되살리지 않는다.

| candidate cell    |    proposed value | evidence mapping                                                                                                               | limitation / confidence                                                                              |
| ----------------- | ----------------: | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `pacing`          | known 0 candidate | 공식 1–3권이 모두 짧은 4컷 생활 에피소드임을 명시하고, Cmoa와 mangasuki가 집에서의 TV·게임·짧은 일상 반복을 직접 기술          | “짧다”와 빠른 템포는 다르므로 `0`은 에피소드 내 목표/상태 변화가 적다는 뜻으로만 심사해야 함. `0.67` |
| `progression`     | known 0 candidate | 공식 1–3권의 반복되는 무직 상태와 Cmoa/mangasuki의 친구 접근·대화 장면은 관계 접촉을 보여주지만 성장 보상 축적은 확인하지 못함 | 부재를 침묵으로 판정하지 않도록, Pass C가 같은 범위의 본문/preview를 재확인해야 함. `0.55`           |
| `emotionalWarmth` | known 3 candidate | 공식의 친한 남매·가족, mangasuki의 친구가 간식을 가져와 대화가 열리는 반복, Cmoa의 “밝은 니트 일상” 관찰                       | 사회적 불안이 섞여 `4`는 부적절. `0.60`                                                              |

`problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`은 unknown을 유지한다. Theme 후보를 노동 문제나 가족으로 만들지 않는다. Theme/Narrative/Tone gate는 닫히지 않는다.

### 33 — あした死ぬには、

공식 1–3권은 40대 여성들의 몸·일·가족·돈·돌봄·죽음 인식을 병렬적인 생활 사건으로 제시한다. Cmoa, Mamba, Sony의 독립 리뷰가 건강 변화, 직장·가족·친구 관계, 명확한 승패보다 계속되는 삶의 대응을 교차 관찰한다. 전권 결말에 관한 리뷰 문장은 범위 밖이라 사용하지 않았다.

| candidate cell   |    proposed value | evidence mapping                                                                                                    | limitation / confidence                                            |
| ---------------- | ----------------: | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `pacing`         | known 2 candidate | 공식 1–3권에서 건강→직업/돈→돌봄/영화 제작으로 문제 범위가 이어지고, Mamba·Cmoa가 생활 변화와 동료 대화를 직접 기술 | 생활 문제의 병렬 배치가 빠른 전개 `4`를 뜻하지 않음. `0.64`        |
| `progression`    | known 2 candidate | 공식 2–3권의 직장 변경·간병·죽음 인식, Mamba의 상태 설명과 대응 행동, Cmoa의 관계·일상이 계속된다는 관찰            | 숙련/보상 중심 성장보다는 삶의 전환이다. `0.48`; unknown 우선 가능 |
| `problemSolving` | known 1 candidate | 공식 소개의 직장·건강·돌봄 문제와 Mamba의 상태 설명/동료에게 알리기, Sony의 현재를 다시 보게 된다는 대응 관찰       | 분석적 해결이 반복되지는 않는다. `0.41`; 강제하지 않음             |

`strategy`, `mysteryReveal`, `worldBuilding`은 공식·리뷰에 책임 있는 직접 근거가 없어 unknown이다. Narrative +4가 남으며 blocker나 promotion을 결정하지 않는다.

### 34 — ドカ食いダイスキ！ もちづきさん

공식 1–3권, Note, MANGA Watch, Cmoa는 메뉴와 장소를 바꾼 대량 섭취·건강검진·직장 생활의 반복을 직접 확인한다. MANGA Watch와 Note가 각각 여러 화의 자기합리화와 섭취 후 결과를 기록하지만, 건강 위험을 safety/adult 판정이나 darkness 자동값으로 바꾸지 않았다.

| candidate cell       |         proposed value | evidence mapping                                                                                       | limitation / confidence                                                       |
| -------------------- | ---------------------: | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `cooking` Theme      | centrality 1 candidate | 공식 1–3권의 메뉴·식사 에피소드, Note의 도시락/잔업식/건강검진/휴일 식사, Cmoa의 1화 완결 관찰         | 주인공은 조리보다 섭취·직장 일상이 중심이므로 `2`가 아니라 `1`을 우선. `0.71` |
| `pacing`             |      known 2 candidate | 공식 권별 메뉴·장소 변화, Note의 1–6화 독립 에피소드 기록, MANGA Watch의 회차마다 다른 자기합리화      | 반복 에피소드가 고속 전개를 의미하지 않음. `0.66`                             |
| `problemSolving`     |      known 1 candidate | MANGA Watch의 건강검진 금식에 대한 자가 통제/대체 음식, 매회 식욕을 정당화하는 구체적 행동             | 해결보다 개그성 우회가 중심이라 `2` 이상 불가. `0.50`                         |
| `characterArcWeight` |      known 2 candidate | MANGA Watch의 체중 증가·다이어트 시도·평범한 생활 욕구와 극단적 식욕의 반복 대비, Note의 건강검진 회차 | 장기 인물 변화가 아니라 반복되는 대비일 수 있음. `0.52`                       |
| `mentalStress`       |      known 1 candidate | 건강검진 결과와 식욕/건강 사이의 반복된 불안·후회 관찰                                                 | 위험을 심리적 압박의 지속으로 과대해석하지 않음. `0.40`; unknown 유지 가능    |
| `emotionalWarmth`    |      known 2 candidate | MANGA Watch가 동료에게 음식을 나누는 장면과 평범한 가족·사회적 욕구를 반복 관찰                        | 관계가 중심 보상은 아님. `0.43`; unknown 유지 가능                            |

`worldBuilding`, `mysteryReveal`, `strategy`, `darkness`는 근거 부족으로 unknown이다. Theme 1개와 Narrative 1개 이상 후보만 발견했으며, gate 잔여를 해소하지 않는다.

### 35 — ディグイット

공식 1–3권은 아버지의 아들 기대에서 자기 포지션을 증명하는 목표로 이동하고, 팀 연습·강호전·라이벌 경기가 이어지는 것을 명시한다. Booklog의 서로 다른 reviewer와 Note가 리베로 수비, 포지션 기술 충돌, 아버지·라이벌 갈등을 직접 관찰한다.

| candidate cell    |    proposed value | evidence mapping                                                                                  | limitation / confidence                                           |
| ----------------- | ----------------: | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `problemSolving`  | known 2 candidate | 공식의 포지션 전환·팀 경기, Booklog의 수비 방식과 리베로 시점 관찰, Note의 경기 중 개별 기술 충돌 | 실제 전술판/분석보다 경기 수행 중심이므로 `4` 금지. `0.63`        |
| `pacing`          | known 2 candidate | 공식 1–3권의 연속 경기와 Note의 1권 초반 연습→코치 등장→강호교 연습시합 구조                      | “전력 질주”라는 감상 표현은 보조일 뿐이며 `4` 근거가 아님. `0.64` |
| `mentalStress`    | known 2 candidate | 공식 아버지의 기대·결별·자기 증명, Booklog의 부모 갈등과 진로 의문 관찰                           | 스포츠 경기 전체가 지속적 심리 압박이라는 뜻은 아님. `0.61`       |
| `emotionalWarmth` | known 2 candidate | 공식 팀·코치·동료의 합류, Note의 팀 미래 기대와 코치/동료 등장 관찰                               | 가족 갈등과 경기 경쟁이 공존하므로 `3` 이상 불가. `0.54`          |

`strategy`는 팀 전술의 반복을 직접 기술한 출처가 부족해 unknown이다. `comedy`, `darkness` 역시 올리지 않는다. Narrative는 후보 2개로 gate가 닫힐 수 있으나 Tone은 추가 검수 없이는 닫히지 않는다.

### 36 — 坂本ですが?

공식 1–3권, Note, Buzzman, Bulublog는 학교 안의 장난·벌·벌집·행사·친구 보호 같은 서로 다른 상황에서 동일한 인물이 비정상적으로 세련된 대응을 반복하는 것을 확인한다. 이는 학교 Theme에서 Axis를 자동 추론한 것이 아니라, entry-scoped 사건의 구체적 반복 관찰에 근거한다.

| candidate cell          |    proposed value | evidence mapping                                                                                             | limitation / confidence                                                     |
| ----------------------- | ----------------: | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `pacing`                | known 2 candidate | 공식 권별 학교 사건 이동, Buzzman/Bulublog의 여러 1–3권 사건 나열, Note의 다양한 학교 에피소드               | 사건 수가 빠른 템포 `4`를 의미하지 않음. `0.68`                             |
| `problemSolving`        | known 2 candidate | Bulublog의 숨겨진 책상·벌집·심부름, Buzzman의 장난·학교 행사·동물 상황을 매번 다른 행동으로 처리하는 관찰    | 해결은 초능력적 개그 대응에 가깝고 분석적 제약 해결은 아님. `0.57`          |
| `relationshipStructure` | known 2 candidate | Note의 남녀 학생·불량 학생 집단, Buzzman의 불량생·반 친구·교내 인물이 반복적으로 반응하고 태도가 변하는 사례 | 군상극이라기보다 주인공 중심 주변 반응일 수 있음. `0.49`; unknown 유지 가능 |
| `emotionalWarmth`       | known 2 candidate | Bulublog/Buzzman의 괴롭힘당한 학생 보호와 주변 인물에 대한 비살상·배려 사례, Note의 졸업·이별 감정           | 따뜻함이 주된 보상인지 코미디와 분리해 재검수 필요. `0.51`                  |

`progression`, `strategy`, `mysteryReveal`, `worldBuilding`, `mentalStress`는 올리지 않는다. 사건 반복만으로 인물 성장이나 세계관을 만들지 않는다. 후보를 모두 채택해도 Narrative/Tone 게이트는 여전히 닫히지 않는다.

### 37 — 来世は他人がいい

공식 1–3권은 두 지역 야쿠자 가족과 약혼·동거에서 시작해 친족·지인·조직 사건으로 관계망을 넓힌다. Cmoa의 독립 reviewer들은 조직 관계가 복잡하고 반복 독서에서 복선이 회수된다고 관찰했으며, StoryGraph의 서로 다른 reviewer와 Matsumoto 리뷰는 어둡고 웃긴 긴장, 대화 중심의 초반 구조, 불안한 분위기를 구체적으로 기록한다.

| candidate cell   |         proposed value | evidence mapping                                                                                          | limitation / confidence                                                                           |
| ---------------- | ---------------------: | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `combat` Theme   | centrality 1 candidate | 공식 2–3권의 야쿠자 사건·위협, Cmoa의 충돌·공조 및 조직 관계 관찰                                         | 실제 전투가 작품 반복 핵심인지, 조직 드라마의 배경인지 세부 장면 표본이 부족해 `1`만 제안. `0.53` |
| `worldBuilding`  |      known 2 candidate | 공식의 동서 조직·가족·친족 관계 확장, Matsumoto의 두 조직 수장 손자 도입, Cmoa의 복잡한 야쿠자 관계 관찰  | 범죄 조직 규칙의 설명이 반복되는지 불명. `0.62`                                                   |
| `mysteryReveal`  |      known 2 candidate | Cmoa의 반복 독서에서 복선 회수, Matsumoto의 초반 긴장·예상 밖 인물 성격 변화, 공식 2–3권의 숨은 관계 확장 | 고밀도 추리 구조로 보지 않음. `0.61`                                                              |
| `problemSolving` |      known 1 candidate | 공식의 약혼·조직 사건, Cmoa의 인물들이 충돌·공조로 사건에 대응한다는 관찰                                 | 분석·계획보다 관계와 위협이 중심이라 low confidence. `0.39`; unknown 유지 가능                    |

`strategy`는 조직이라는 장르/설정만으로 올리지 않는다. Theme 후보와 Narrative 후보는 별도 adjudication이 필요하며 promotion은 하지 않는다.

### 38 — カラオケ行こ！

단권 공식 소개와 MangaTaisho 코멘트, 두 독립 Note 리뷰는 주간 노래 연습과 야쿠자·중학생의 관계가 초반 개그에서 성대 변화·위험·예상 밖 결말로 이동하는 구조를 공통으로 관찰한다. 영화 감상만을 근거로 쓰지 않았다.

| candidate cell    |    proposed value | evidence mapping                                                                                                       | limitation / confidence                                                               |
| ----------------- | ----------------: | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `pacing`          | known 3 candidate | 공식의 주간 만남, Meg의 반복 레슨·후반 전환, Kaoru의 전편/후편에서 개그·진지함·물리적 위험이 빠르게 교차한다는 관찰    | 단권의 압축감은 확인되지만 `4`는 과함. `0.65`                                         |
| `mysteryReveal`   | known 2 candidate | Kaoru의 전반 단서가 후반에 회수되고, Meg의 마지막 예상 밖 전개, 공식 심사 코멘트의 급전환 관찰                         | 추리 작품의 단서망으로 과장하지 않음. `0.60`                                          |
| `problemSolving`  | known 1 candidate | 매주 노래를 가르치고 대회 실패를 피하려는 구체적 목표, 두 리뷰의 레슨·합창 관찰                                        | 지략보다 연습·대화가 중심. `0.44`; unknown 유지 가능                                  |
| `progression`     | known 2 candidate | 합창부 학생이 발성 고민을 다루고, 반복 레슨을 통해 두 사람의 관계와 행동 상태가 변한다는 두 독립 리뷰                  | 숙련 보상과 관계 변화가 완전히 일치하는지 낮은 confidence. `0.47`; unknown 유지 가능  |
| `emotionalWarmth` | known 3 candidate | Meg와 Etou의 독립 관찰에서 두 인물 사이의 존중·우정·거리 변화가 반복되고, 공식 심사 코멘트도 웃음과 정서적 결말을 확인 | 성인 야쿠자와 미성년자 관계의 안전 맥락은 별도 검수하며 romance로 바꾸지 않음. `0.66` |
| `mentalStress`    | known 2 candidate | Kaoru의 변성기 고민·위험한 물건·긴장 장면, Meg의 후반부 심리적 압박 관찰                                               | 지속적 불안이 중심은 아님. `0.51`                                                     |

`relationshipStructure`와 `comedy`의 accepted 값을 바꾸지 않는다. 문제 해결·progression 후보가 거부되면 Narrative gap은 남는다.

### 39 — となりの猫と恋知らず

공식 1–3권은 학교 옆자리에서 친구 되기·사진부·고양이 활동으로 관계가 이어지는 과정을 명시한다. BookLive의 서로 다른 reviewer들과 Note의 독립 독서 기록은 말을 걸기, 고양이 카페/보건실에서의 접촉, 지인 증가, 수줍은 인물의 노력과 치유감을 구체적으로 관찰한다.

| candidate cell    |    proposed value | evidence mapping                                                                                                                           | limitation / confidence                                                         |
| ----------------- | ----------------: | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `problemSolving`  | known 1 candidate | 공식의 친구 되기·사진부 활동, BookLive의 말 걸기/접촉 과정, 灰月弥彦의 관계를 넓히려는 노력 관찰                                           | 사회적 시도는 분석적 문제 해결이 아니므로 `1`만 제안. `0.43`; unknown 유지 가능 |
| `emotionalWarmth` | known 3 candidate | BookLive의 서로 다른 reviewer가 반복적으로 차분함·치유·귀여운 관계와 천천히 친해지는 장면을 기술하고 Note도 지인 증가와 성장의 정서를 기록 | 독자 감정 태그는 제외했으며, 관계가 따뜻함의 중심 보상인지 재검수 필요. `0.61`  |
| `mentalStress`    | known 1 candidate | BookLive의 극도 수줍음·말 걸기 어려움, Note의 관계 시도와 노력                                                                             | 지속 압박이 아닌 초기 장벽일 수 있음. `0.38`; unknown 유지 권장                 |

`progression`은 관계 단계만으로 올리지 않고, `strategy`, `mysteryReveal`, `worldBuilding`, `comedy`도 직접 반복 근거가 부족하다. Narrative +3가 남아 promotion하지 않는다.

### 40 — カッコウの許嫁

공식 1–3권은 출생 비밀·가짜 연인·부모가 정한 약혼에서 공동생활과 다수 관계로 확장된다. BookLive, Cmoa, Uharu의 독립 리뷰는 이 설정이 실제로 동거·가족·동급생·여러 약혼 관계의 문제와 웃음으로 이어지는 것을 구체적으로 관찰한다.

| candidate cell    |    proposed value | evidence mapping                                                                                                                 | limitation / confidence                                          |
| ----------------- | ----------------: | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `mysteryReveal`   | known 2 candidate | 공식 1권의 출생 비밀이 2–3권의 공동생활·관계로 이어지고, BookLive/Cmoa 리뷰가 출생 비밀·약혼 관계와 이어지는 새 관계를 직접 기술 | 비밀이 반복 단서·추리 보상으로 확장되는지는 불명. `0.55`         |
| `problemSolving`  | known 1 candidate | 공식의 가짜 연인·동거·가족 문제, Cmoa의 여러 문제가 발생하고 인물들이 넘어간다는 관찰                                            | 지략보다 관계 코미디·감정 대응이 중심. `0.42`; unknown 유지 가능 |
| `emotionalWarmth` | known 3 candidate | BookLive의 서로 다른 reviewer가 함께 살며 마음을 열고 따뜻한 가족/관계로 읽는 관찰, Cmoa의 가족·동급생 관계와 회복적 분위기      | 하렘 관계와 경쟁도 있어 `4`는 과함. `0.58`                       |
| `comedy`          | known 2 candidate | BookLive의 “웃기는” 관계·동거 문제 관찰, Cmoa의 여러 인물과 문제를 함께 다루는 라브코미디 관찰                                   | `4`를 지지할 회차 빈도 자료 없음. `0.55`                         |

`progression`, `strategy`, `worldBuilding`은 약혼·동거라는 설정에서 자동 추론하지 않는다. 후보를 모두 채택해도 Narrative gap이 남으며, promotion은 하지 않는다.

## Consolidated proposed cells

아래는 research 후보만 요약한 것이다. `U`는 책임 있는 승격 후보를 찾지 못했다는 뜻이며, 최종 CSV·승격 상태와 다르다.

| position | proposed new cells                                                                                                         | intentionally unresolved                                                    | gate outlook                                                          |
| -------: | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
|       31 | `worldBuilding=2`, `mysteryReveal=2`, `pacing=2`, `characterArcWeight=2`, `emotionalWarmth=3`, low `mentalStress=2`        | `problemSolving`, `strategy`; low mentalStress                              | remains open; adjudication required                                   |
|       32 | `pacing=0`, `progression=0`, `emotionalWarmth=3`                                                                           | `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`              | remains open; zero candidates must be checked against no-silence rule |
|       33 | `pacing=2`, low `progression=2`, low `problemSolving=1`                                                                    | `strategy`, `mysteryReveal`, `worldBuilding`                                | remains open                                                          |
|       34 | `cooking:1`, `pacing=2`, low `problemSolving=1`, low `characterArcWeight=2`, low `mentalStress=1`, low `emotionalWarmth=2` | `strategy`, `mysteryReveal`, `worldBuilding`, `darkness`                    | remains open                                                          |
|       35 | `problemSolving=2`, `pacing=2`, `mentalStress=2`, `emotionalWarmth=2`                                                      | `strategy`, `comedy`, `darkness`, `romance`                                 | Narrative may close; Tone remains open                                |
|       36 | `pacing=2`, `problemSolving=2`, low `relationshipStructure=2`, low `emotionalWarmth=2`                                     | `progression`, `strategy`, `mysteryReveal`, `worldBuilding`, `mentalStress` | remains open                                                          |
|       37 | low `combat:1`, `worldBuilding=2`, `mysteryReveal=2`, low `problemSolving=1`                                               | `strategy`; identity/safety separate                                        | potentially closes text gate only after adjudication                  |
|       38 | `pacing=3`, `mysteryReveal=2`, low `problemSolving=1`, low `progression=2`, `emotionalWarmth=3`, `mentalStress=2`          | `worldBuilding`, `strategy`; low Narrative candidates                       | potentially closes only if low candidates survive                     |
|       39 | low `problemSolving=1`, `emotionalWarmth=3`, low `mentalStress=1`                                                          | `progression`, `strategy`, `mysteryReveal`, `worldBuilding`, `comedy`       | remains open                                                          |
|       40 | `mysteryReveal=2`, low `problemSolving=1`, `emotionalWarmth=3`, `comedy=2`                                                 | `progression`, `strategy`, `worldBuilding`                                  | remains open                                                          |

## Closure

- No Pass A CSV, Genre/Theme CSV, generated catalog, promotion registry, or Art record was edited.
- No candidate was marked `recommendationVerified`, `promotionBlocked`, or `gold`.
- No Art value was inferred from covers, reviews, anime, or prose.
- All evidence rows preserve full URL, source name, published date/year where exposed, access date `2026-08-25`, entry scope, independence, observation, limitation, and confidence.
- User-review observations were summarized rather than copied into user-facing explanation text.
- Decorative `『` and `』` were excluded from every canonical title.
- `reviewedByHuman=false` remains unchanged.
