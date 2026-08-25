# Batch 005 text gap recovery round 2 — chunk 04

## 조사 범위와 불변 조건

- 조사일·모든 외부 URL 조회일: `2026-08-25`
- 대상: `frozen-work-set.csv` positions `31–40`만
- 평가 범위: `entry_1_3_volumes` (권 1–3 또는 그에 직접 대응하는 초반 에피소드)
- `reviewedByHuman=false`
- branch: `main`
- HEAD at packet creation: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- candidate packet SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- prior research SHA-256: `46e6b37d07f4b2baee839dca05331e9c870a6d158c392e3d77ad77419a5b76a3`
- terminal text CSV read-only SHA-256: `1596f9527a41fd1819dd553de36d1d3f8b5fc3ca0a7a4be347802a5a3fe18378`

이 문서는 연구 packet만 추가한다. terminal CSV, Pass A, Genre·Theme CSV,
source/provenance, Art packet, promotion overlay, generated catalog은 수정하지
않았다. 아래의 `provisional`은 독립 adjudicator가 채택·기각할 입력이며 런타임
known 값이 아니다.

판정은 Factor Dictionary의 0/2/4 anchor를 그대로 적용했다. 제목·장르명·작품의
배경·단일 사건·별점·추천 등재만으로 Axis를 만들지 않았다. `unknown`을 0으로
바꾸지 않았고, Art는 이번 조사에서 전혀 판정하지 않았다. 리뷰는 서로 다른
도메인 또는 식별 가능한 서로 다른 작성자 집합의 구체적 관찰만 보조 근거로
사용했으며, 리뷰의 문장을 사용자 설명에 복사하지 않는다.

## 회복 요약

| pos | 작품 | 이번 라운드의 제한적 제안 | 남은 gate 상태 |
| ---: | --- | --- | --- |
| 31 | デストロ２４６ | 없음. 무장 대치·세력 증가는 `strategy`/`problemSolving`으로 자동 환산하지 않음 | N 2개, T 3개 이상 미충족 |
| 32 | 夢の雫、黄金の鳥籠 | 없음. 강제 신분 변화와 궁정 배경은 각각 `progression`·`strategy`가 아님 | N 2개 미충족 |
| 33 | 日常 | 없음. 반복 개그는 이미 `pacing`·`comedy`; 괴상한 인물은 `worldBuilding`이 아님 | N 3개, T 3개 미충족 |
| 34 | ひらやすみ | `foundFamily=2` provisional, `emotionalWarmth=2` provisional | N 3개 미충족 |
| 35 | ハイスコアガール | Genre `comedy;romance`, Theme `tournament=1`, N 4개, T 5개 provisional | 독립 adjudication 후에만 gate 재계산 |
| 36 | WOMBS | `romance=2` provisional | 나머지 text gate는 충족 가능성 있으나 채택 전 미승격 |
| 37 | ママはテンパリスト | `progression=2`, `problemSolving=2`, `mentalStress=2` provisional | Theme 없음, N 1개가 여전히 부족 |
| 38 | 僕らはみんな河合荘 | `foundFamily=2`, `comedy=3`, `progression=2` provisional | N 2개가 여전히 부족 |
| 39 | かよちゃんの荷物 | `pacing=2`, `comedy=2`, `emotionalWarmth=2` provisional | Theme 및 N 4개, T 2개 이상 미충족 |
| 40 | 脳内ポイズンベリー | `problemSolving=2`, `comedy=2` provisional | Theme 및 N 2개, T 0개 이상 미충족 |

위 제안은 기존 terminal CSV에 쓰지 않았다. 특히 35번은 공식 권리자 페이지가
작품을 명시적으로 `90年代アーケード・ラブコメディー`라고 부르므로 Genre
후보를 제시했지만, `tournament`는 정식 tournament가 아니라 초반 반복 대전
구조라는 제한 때문에 centrality 1로 낮췄다.

## 출처 ledger

`official/rightsholder`와 `licensed`는 1차 내용 확인에 우선했고, `review`는
정확한 권·초반 범위가 보이는 구체적 관찰만 보조 근거로 기록했다. 페이지에
개별 게시일이 표시되지 않은 review route는 그 사실을 명시했다. 모든 URL은
`retrievedAt=2026-08-25`이다.

### Position 31 — デストロ２４６ (`work-79c18b26dfde8a532f73`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 31-O1 | 小学館コミック 1권 — https://shogakukan-comic.jp/book?isbn=9784091573254 | 2012-10-19 | official publisher, vol.1 | 복수 의뢰, 가족 살해자 추적, 두 소녀 암살자의 출발 |
| 31-O2 | 小学館コミック 2권 — https://shogakukan-comic.jp/book?isbn=9784091573483 | 2013-05-17 | official publisher, vol.2 | 표적 조사, 여러 암살자·독 전문가의 합류 |
| 31-O3 | 小学館コミック 3권 — https://shogakukan-comic.jp/book?isbn=9784091573650 | 2013-12-19 | official publisher, vol.3 | 조직 확대, 총격과 배신 |
| 31-R1 | シーモア title review — https://www.cmoa.jp/title/customer_review/title_id/68820/ | page date not displayed | independent Cmoa reviewers, series review with vol.1–3 observations | 액션·세력 대립을 반복적으로 언급하지만 수치화할 내면 압박은 없음 |
| 31-R2 | Buzzman, 全7巻感想 — https://buzz-manga.blog.jp/Destro-246.html | 2015 (page date not displayed) | independent long review, explicitly labels vol.1/2/3 | 1권 대치, 2권 세력·전투 확대, 3권 무장 헬기와 대규모 충돌 |
| 31-R3 | LOMICO review — https://lomico.jp/review/4662/ | 2024 (page date not displayed) | independent review, entry/vol.1 framing | 여고생 암살자와 총격 액션이라는 반복 중심을 확인하나 전략 계획은 설명하지 않음 |

**결론:** 새로운 known 제안 없음. 1–3권의 수사·복수는 이미 `investigation`·
`revenge` Theme으로 반영되어 있고, 무장 대치나 인물 수 증가는 `strategy` 또는
`problemSolving` anchor가 아니다. 두 독립 review route도 위험·액션의 체감만
반복하며 `mentalStress`, `romance`, `emotionalWarmth`, `characterArcWeight`
중 어느 것도 직접적인 entry-range 반복 관찰로 만들지 못한다. 남은 route는
대표판 2·3권의 읽을 수 있는 본문/공식 미리보기에서 제약 분석과 해결 순서를
확인하거나, 그 범위를 명시한 독립 리뷰 두 개가 같은 관찰을 반복하는 경우뿐이다.

### Position 32 — 夢の雫、黄金の鳥籠 (`work-7b6eb2b48ac06ffa26eb`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 32-O1 | 小学館コミック 1권 — https://shogakukan-comic.jp/book?isbn=9784091340108 | 2011-09-09 | official publisher, vol.1 | 납치, 교육, 새 이름, 궁정으로 이동 |
| 32-O2 | 小学館コミック 2권 — https://shogakukan-comic.jp/book?isbn=9784091342164 | 2012-03-09 | official publisher, vol.2 | 후궁 신분, 질투·음모, 친구의 죽음과 생존 |
| 32-O3 | 小学館コミック 3권 — https://shogakukan-comic.jp/book?isbn=9784091346834 | 2012-11-09 | official publisher, vol.3 | 사랑·삼각 감정, 원정으로 인한 분리, 후궁의 새 만남 |
| 32-R1 | BookLive vol.1 review — https://booklive.jp/review/list/title_id/189166/vol_no/001 | page date not displayed | independent purchased reviewers, vol.1 | 역사 로맨스와 어두운 후궁 갈등의 entry 반응 |
| 32-R2 | シーモア title review — https://www.cmoa.jp/title/31768/ | page date not displayed | independent Cmoa reviewers, title review; vol.1 and entry observations | 후궁·권력·생존의 결합과 긴장감은 반복되나 전술 절차는 없음 |
| 32-R3 | 読書メーター vol.1 — https://bookmeter.com/books/4047745 | page date not displayed | independent readers, volume 1 | 역사 배경과 신분 이동을 확인하나 성장 보상·문제 해결을 구분하지 않음 |

**결론:** 새로운 known 제안 없음. 1권 납치와 2권 후궁 진입은 주인공에게
강제된 상태 변화이지 Dictionary의 반복 성장·획득 보상이 아니다. 궁정·후궁은
이미 `historicalReconstruction`과 `politics=1`의 보조 근거가 될 수 있지만,
작전·자원 운용의 반복 관찰이 없어 `strategy`로 올리지 않았다. 남은 route는
1–3권 본문에서 Hürrem이 의도적으로 제약을 분석해 결과를 얻는 두 개 이상의
장면을 판본과 함께 확인하거나, 그 장면 범위를 명시한 독립 review 두 개가
일치하는 경우다. 현재 route만으로는 채택 가능한 numeric cell이 없다.

### Position 33 — 日常 (`work-8037856e7703fdaf4324`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 33-O1 | KADOKAWA 1권 — https://www.kadokawa.co.jp/product/200879000105/ | 2007-07-24 | official publisher, vol.1 | 학생 생활 주변의 짧고 뜻밖인 사건, 로봇·염소·정체불명 존재 |
| 33-O2 | KADOKAWA 2권 — https://www.kadokawa.co.jp/product/200879000106/ | 2007-10-24 | official publisher, vol.2 | 유코·마이·나노·사사하라 등 인물군과 어긋난 일상 반복 |
| 33-R1 | Sony Reader vol.2 reviews — https://ebookstore.sony.jp/review/title/10813956/id/LT000001279004315463/?sort=-like | 2013-05-02 / 2021-04-28 records | independent readers, vol.2 | 에피소드별 미술 대결·엘리베이터·시험·벌레 등 구체적 단편 반복 |
| 33-R2 | 個人読書記録 1–10권 — https://blog.livedoor.jp/gintakosu/archives/27416148.html | 2021 (page date not displayed) | independent long review, vols.1–10 | 캐릭터 간 반복 대화와 표정 개그, 후반까지 이어지는 생활 에피소드 |
| 33-R3 | BookLive vol.2 review — https://booklive.jp/review/list/title_id/13350/vol_no/002 | page date not displayed | independent users, vol.2 | 단편 에피소드와 고전적 개그 반복을 별도로 관찰 |

**결론:** N/T 추가 제안 없음. 이 자료는 이미 `pacing=3`, `comedy=4`,
`relationshipStructure=2`를 지지하지만, 단편의 웃음·돌발성만으로 `problemSolving`,
`mysteryReveal`, `worldBuilding`, `characterArcWeight`, `darkness` 또는
`emotionalWarmth`를 만들 수 없다. 괴상한 존재는 반복 등장인물이지 Dictionary의
load-bearing 세계 규칙이 아니다. 남은 route는 공식 1–3권의 readable body에서
반복되는 해결 절차나 명시적인 관계 변화가 실제로 확인될 때뿐이며, 현재
description/review route에서는 그런 관찰이 없다.

### Position 34 — ひらやすみ (`work-88cb26a0229ad7b83263`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 34-O1 | 小学館コミック 1권 — https://shogakukan-comic.jp/book?isbn=9784098611188 | 2021-09-10 | official publisher, vol.1 | 할머니에게 받은 집, 사촌과의 동거, 주변 고민을 가진 사람들의 유입 |
| 34-O2 | 小学館コミック 2권 — https://shogakukan-comic.jp/book?isbn=9784098612048 | 2021-12-10 | official publisher, vol.2 | 동거 지속, 출산 준비·자신감 문제·동네 축제와 주변 인물 교차 |
| 34-O3 | 小学館コミック 3권 — https://shogakukan-comic.jp/book?isbn=9784098612994 | 2022-04-28 | official publisher, vol.3 | 집 주변 관계 확대, 진로·연애 위기와 일상 변화 |
| 34-R1 | Real Sound book review — https://realsound.jp/book/2022/04/post-1002327_2.html | 2022-04-10 | independent critical review, vol.1 focus | 평屋의 생활감과 향수·위로의 독서 효과를 구체적으로 관찰 |
| 34-R2 | incubator 1–2권 — https://incubator.hatenablog.com/entry/manga7682-7683 | 2022-01-01 | independent long review, vols.1–2 | 주인공·사촌·주변 인물이 각자 삶의 고민을 가진 채 집과 생활권에 모임 |
| 34-R3 | BookLive vol.1 review — https://booklive.jp/review/list/title_id/20036920/vol_no/001 | page date not displayed | independent purchasers, vol.1 | 느린 생활과 평온함, 주변 고민의 수용을 관찰 |

**Provisional proposals:**

| cell | proposal | confidence | bounded reason |
| --- | ---: | ---: | --- |
| Theme `foundFamily` | centrality `2` | 0.67 | 1–3권 모두 집을 지속적 교차점으로 삼고, 혈연 사촌·친구·이웃이 각자의 고민을 가진 채 생활 공동체에 들어온다. 단순 동거가 아니라 반복되는 돌봄·수용 장면을 readable body 또는 추가 entry review로 확인해야 최종 채택한다. |
| `emotionalWarmth` | `2` | 0.70 | Real Sound·incubator·BookLive가 생활 공간의 위로·평온·타인의 고민을 받아들이는 온도를 독립적으로 반복한다. 전면적 치유 보상인 4는 근거가 부족하다. |

N 3개는 아직 제안하지 않았다. 생활권·축제·진로·연애 위기는 `worldBuilding`,
`problemSolving`, `strategy`, `mysteryReveal` 중 하나를 자동으로 만들지 않으며,
`progression`에도 해당하지 않는다. 남은 route는 1–3권의 실제 본문에서 인물의
목표·제약·해결 순서가 반복되는 구체 장면을 찾는 것이다.

### Position 35 — ハイスコアガール (`work-8a7846af8ead1797e6a2`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 35-O1 | SQUARE ENIX series page — https://magazine.jp.square-enix.com/biggangan/introduction/highscoregirl/ | 2021 (current page year) | official rightsholder, series + linked episodes 1–3 | 명시적 `90年代アーケード・ラブコメディー`, 1991 격투게임 붐, 하루오·아키라·코하루와 오락실 |
| 35-O2 | SQUARE ENIX 第1話体験版 — https://magazine.jp.square-enix.com/biggangan/tachiyomi/his01/ | 2021 (page year) | official rightsholder, episode 1 route | 제1화 체험판의 판본·에피소드 경로를 확인했으나 본문 텍스트는 안정 추출되지 않음 |
| 35-O3 | SQUARE ENIX CONTINUE 1권 — https://magazine.jp.square-enix.com/top/comics/detail/9784757550391/ | 2014-08-22 | official rightsholder, vol.1 content bridge | 초반 내용을 유지한 리뉴얼판임을 확인; 대표판과 동일 내용 관계를 보조 확인 |
| 35-R1 | 読書メーター 1권 — https://bookmeter.com/b/4757535120 | page date not displayed | independent readers, vol.1 | 게임과 소년·소녀의 초기 관계를 읽은 독자 집합; 개별 리뷰 날짜는 페이지에서 일부 비노출 |
| 35-R2 | 俺ブログ 1권 7–9화 — https://ameblo.jp/abstract1/entry-11256902714.html | 2012 (page date not displayed) | independent review, vol.1, explicitly episodes 7–9 | 게임 대결·작별·캐릭터 감정 변화를 초반 화수와 함께 기록 |
| 35-R3 | 漫画アニメレビューブログ 2권 — https://mangablog.blog.jp/archives/5926133.html | 2013 (page date not displayed) | independent review, vol.2, explicitly vol.2 | 재회·게임 공간·반지/기억·흔들리는 감정을 권 단위로 기록 |

**Provisional proposals:**

| cell | proposal | confidence | bounded reason |
| --- | ---: | ---: | --- |
| Genre | `comedy;romance` | 0.92 | 권리자 공식 장르 문구가 직접 `ラブコメディー`이며, 초기 공식 인물·리뷰도 게임 매개 연애와 코미디를 별도로 확인한다. |
| Theme `tournament` | centrality `1` | 0.64 | 1–2권의 반복적인 격투게임 대전·재대결은 competitive event 관찰을 제공하지만, 공식 tournament 형식은 확인되지 않아 1로 제한한다. |
| `progression` | `2` | 0.63 | 1–2권에서 게임 실력·경쟁 관계와 중학교 시기로의 상태 변화가 반복되나, 레벨업식 보상으로 과대평가하지 않는다. |
| `problemSolving` | `2` | 0.60 | 1권 화수 리뷰와 2권 리뷰에서 대전 상황에 맞춘 게임 선택·대응이 반복되지만, 실제 페이지 확인 전에는 저수준 제안으로만 둔다. |
| `strategy` | `2` | 0.61 | 격투게임 대전에서 상대·기술·승패를 고려하는 단기 전술이 반복된다는 두 review의 공통 관찰. 장기 계획이나 자원 운용은 없다. |
| `worldBuilding` | `2` | 0.70 | 1991 오락실·격투게임 문화가 1–3권의 반복 무대와 역사적 감각을 구성한다. 단순 게임 등장보다 넓지만 4는 지지하지 않는다. |
| `characterArcWeight` | `2` | 0.64 | 1권 후반과 2권 재회 리뷰가 게임을 통해 관계·감정이 변하는 entry arc를 직접 관찰한다. |
| `relationshipStructure` | `2` | 0.66 | 하루오·아키라·코하루의 세 인물과 재회·경쟁 관계가 초반부터 반복된다. 복잡한 군상극인 4는 아니다. |
| `comedy` | `2` | 0.66 | 권리자 장르 문구와 두 독립 review의 가벼운 게임·청춘 코미디 관찰. 상시 개그 4는 아니다. |
| `mentalStress` | `2` | 0.58 | 1권 작별과 2권 재회·경쟁에서 긴장과 망설임이 관찰되지만 지속적 심리 붕괴는 아니다. |
| `romance` | `3` | 0.82 | 권리자 공식 `ラブコメディー`와 1–2권 독립 리뷰가 게임 관계를 연애 감정의 중심 축으로 반복한다. |
| `emotionalWarmth` | `2` | 0.60 | 추억·재회·청춘 감정의 따뜻한 payoff가 보조적으로 반복되며, 치유가 주 보상인 4는 아니다. |

이 항목들은 공식 1–3권 본문과 패널의 독립 검수가 필요하다. 특히 `tournament`,
`problemSolving`, `strategy`는 게임 장르명만으로 채택할 수 없고, 실제 대전
상황이 동일 범위에서 확인되어야 한다. 남은 route는 대표판 1–3권의 readable
body page와 제1–3화 체험판의 정확한 권차 연결이다.

### Position 36 — WOMBS (`work-8ff141505b0a27f8d630`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 36-O1 | 小学館 eコミック 1권 — https://e-comi.shogakukan.co.jp/books/091884940000d0000000 | 2015-06-26 | official digital vol.1, first 8 episodes | 징집, 특수 전송부대, 전쟁, 연인·가족을 남긴 신병의 entry |
| 36-O2 | 紀伊國屋 2권 — https://www.kinokuniya.co.jp/f/dsg-08-EK-0259910 | 2015-06-26 | licensed digital vol.2 | 첫 실전과 기지 공격 |
| 36-O3 | 小学館 eコミック 3권 — https://e-comi.shogakukan.co.jp/books/091885830000d0000000 | 2015-06-26 | official digital vol.3 | 개척자 역할, 능력 기원·영향의 점진적 공개 |
| 36-R1 | BookLive 1권 reviews — https://booklive.jp/review/list/title_id/319608/vol_no/001 | page date not displayed | independent readers, vol.1 | 가족·연인을 뒤로하고 입대한 마나, 군사·생체 설정의 entry 관찰 |
| 36-R2 | honto 1권 reviews — https://honto.jp/ebook/pd-review_0627220576.html | 2010-02-07 / 2010-02-13 / 2010-02-28 etc. | independent named readers, vol.1 | 전쟁·연인·여성 병사의 설정과 entry 관계를 구체적으로 기록 |
| 36-R3 | BookLive 2권 review — https://booklive.jp/product/index/title_id/319608/vol_no/002 | 2011-03-30 | independent reader, vol.2 | 전쟁 설정을 단순 전쟁에서 SF 세계관으로 확장하는 관찰 |

**Provisional proposal:** `romance=2`, confidence `0.61`. 1권의 명시적인
연인·가족 이별과 1권 독립 review 두 route가 관계를 entry emotional stake로
확인하지만, 군사 SF의 중심 보상은 전쟁·능력·세계관이다. 4가 아닌 2로 제한한다.
`comedy`와 `emotionalWarmth`는 전쟁·생체 이식의 어두움과 일부 인간 관계만으로
알려진 값으로 만들지 않았다. 이 제안이 기각되면 남은 route는 edition-bridged
본문에서 romance가 반복되는 실제 장면을 확보하는 것뿐이며, Art에는 절대 쓰지
않는다.

### Position 37 — ママはテンパリスト (`work-982bb79e03193ebbafcd`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 37-O1 | 集英社 1권 — https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-782188-8 | 2008-10-17 | official publisher, vol.1 | 첫 육아, 아이의 예상 밖 반응, 에피소드형 기록 |
| 37-O2 | 集英社 2권 — https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782240-3 | 2009-06-19 | official publisher, vol.2 | 아이 행동과 부모 대응의 지속 |
| 37-O3 | 集英社 3권 — https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-782273-1 | 2010-03-19 | official publisher, vol.3 | 아이의 언어 발달과 새로운 육아 에피소드 |
| 37-R1 | ウチのこと。ソトのこと。 — https://maresara.exblog.jp/11805807/ | 2010 (page date not separately displayed) | independent personal review, vols.1–3 | 1권의 영아기, 2권의 3–4세 에피소드, 어머니의 당황·한숨·대응을 비교 |
| 37-R2 | レビューン 작품 해설 — https://reviewne.jp/contents/5573 | 2016 (review date shown) | independent review collection, early-series scope | 육아 상황이 반복되는 코미디이면서 실제 대응의 고단함도 있다는 관찰 |
| 37-R3 | Zigsow 1권 — https://zigsow.jp/item/126832 | 2009-06-25 / 2010-03-26 / 2011-12-20 records | independent named reviewers, vol.1 | 영아와의 의사소통 난점·육아 상황에서 웃음을 찾는 반복 관찰 |

**Provisional proposals:**

| cell | proposal | confidence | bounded reason |
| --- | ---: | ---: | --- |
| `progression` | `2` | 0.68 | 공식 1–3권과 Exblog review가 아이의 연령·언어 발달 변화가 새로운 반복 소재가 된다고 명시한다. 성장 보상 구조 4가 아니라 ordinary arc 2다. |
| `problemSolving` | `2` | 0.60 | 젖 떼기·식사·재우기 같은 반복적인 육아 문제와 부모의 대응을 두 독립 review가 구체적으로 관찰한다. 영리한 해결 중심은 아니므로 2다. |
| `mentalStress` | `2` | 0.67 | 공식 소개의 당황과 두 review의 한숨·막막함이 entry 범위에서 반복되지만, 심리 붕괴·암울함은 아니다. |

육아는 현재 Theme ID가 아니므로 Theme를 새로 만들지 않는다. 직업이 만화가라는
사실도 `workplace` Theme의 반복 핵심으로 확정하지 않았다. 남은 N route는
1–3권에서 목표·전략·세계 규칙·수수께끼가 실제로 반복되는지 확인하는 것이며,
현재 자료로는 `strategy`, `mysteryReveal`, `worldBuilding`을 추가할 수 없다.

### Position 38 — 僕らはみんな河合荘 (`work-9e98119539f60465ce66`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 38-O1 | 少年画報社 3권 — https://www.shonengahosha.co.jp/book_Info.php?id=7102 | 2012-08-30 | official publisher, vol.3 | 하숙집 공동생활, 리츠와 우사의 거리 좁히기, 독특한 거주자 |
| 38-O2 | マンガ大賞2013 comment — https://www.mangataisho.com/data/2013/comment2013.pdf | 2013 | official award commentary, early boarding-house reading | 느슨한 일상과 결점 있는 거주자들의 관계를 보조 확인 |
| 38-R1 | BookLive 1권 reviews — https://booklive.jp/review/list/title_id/175276/vol_no/001?spoiler=1 | page date not displayed | independent users, vol.1 | 공동생활·개성 강한 거주자·천천히 좁혀지는 연애와 일상 개그 |
| 38-R2 | Bookworms vol.1 review — https://bookworms.jp/book/B00FZFBN38 | page date not displayed | independent critical review, vol.1 | 식탁·생활 공간이 귀가할 곳처럼 기능하고 집단의 애착이 쌓인다는 관찰 |
| 38-R3 | すみにおけないこと vol.1 — https://suminai.com/entry/bokura-wa-minna-kawaisou-1 | 2025-12-07 | independent personal review, vol.1 | 거주자와 우사·리츠의 관계가 반복적으로 가까워지는 장면을 기록 |

**Provisional proposals:**

| cell | proposal | confidence | bounded reason |
| --- | ---: | ---: | --- |
| Theme `foundFamily` | centrality `2` | 0.70 | 1권의 다인 하숙 공동체와 3권의 지속적 관계가 단순 주거 배경을 넘어 반복되는 생활·돌봄·애착 구조로 관찰된다. `family`라는 단어가 없어도 Dictionary의 found-family 구조에 해당할 수 있으나 독립 adjudication 필요. |
| `comedy` | `3` | 0.78 | BookLive와 Bookworms가 생활 공동체의 반복적인 보케·ツッコミ와 일상 코미디를 entry 중심으로 확인한다. 공식 장르 문구만으로 4를 부여하지 않는다. |
| `progression` | `2` | 0.62 | 1권의 입주·적응과 3권의 관계 거리 변화가 반복되지만, 명확한 성장 보상 loop는 아니다. |

남은 N 2개는 집·관계 자체를 `worldBuilding`, `problemSolving`, `strategy`,
`mysteryReveal`로 중복 변환하지 않도록 보류한다. 실제 1–3권 본문에서 생활
문제를 분석하고 해결하는 반복 장면 또는 별도 세계 규칙이 확인될 때만 재개한다.

### Position 39 — かよちゃんの荷物 (`work-aa6018249b7fe7e92d95`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 39-O1 | マンガ大賞2010 comment — https://www.mangataisho.com/data/2010/comment2010.pdf | 2010 | official award commentary, entry comment | 30세 가요의 느슨한 일상과 별도 단편의 사회적 곤경을 구분해 관찰 |
| 39-O2 | 竹書房/HMV new-edition metadata — https://www.hmv.co.jp/artist_%E9%9B%81%E9%A0%88%E7%A3%A8%E5%AD%90_000000000159134/item_%E3%81%8B%E3%82%88%E3%81%A1%E3%82%83%E3%82%93%E3%81%AE%E8%8D%B7%E7%89%A9-%E6%96%B0%E8%A3%85%E7%89%88-%E4%B8%8A-%E3%83%90%E3%83%B3%E3%83%96%E3%83%BC%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9_7730890 | page date not displayed | licensed bookseller, new-edition identity only | 대표판·신장판 관계를 확인; 내용 numeric 근거에는 사용하지 않음 |
| 39-R1 | webDICE review, 1권 발췌 — https://www.webdice.jp/dice/detail/2068/index.html | 2009 (page date not separately displayed) | independent critical review, explicitly vol.1 | 결혼 압박·화장·자기비하를 30대 여성의 일상 개그로 읽고, 감정이 긍정으로 착지한다고 관찰 |
| 39-R2 | のんのんの部屋, early series review — https://nonnon4u.com/post-9413/ | 2018-12-14 | independent personal review, series 3 vols / chapter 28 identified | 8쪽 단편의 일상 구조, 직장·친구·연애·가방 에피소드와 인간관계의 모호함을 구체적으로 기록 |
| 39-R3 | マンガ大賞2008 comment — https://www.mangataisho.com/data/2008/comment.pdf | 2008 | official selector comments, selection context | 작품 식별과 일상·감정 인상을 보조하나 권차 numeric 근거로 사용하지 않음 |

**Provisional proposals:**

| cell | proposal | confidence | bounded reason |
| --- | ---: | ---: | --- |
| `pacing` | `2` | 0.60 | 두 독립 review가 느슨한 일상과 8쪽 단편의 반복을 직접 관찰한다. 첫 3권의 상태 변화가 큰 작품은 아니지만 0으로 단정하지 않는다. |
| `comedy` | `2` | 0.69 | webDICE가 1권의 30대 여성 일상과 자기 인식을 개그·공감 구조로 읽고, nonnon이 직장·친구의 짧은 에피소드와 어긋난 대화를 반복적으로 기록한다. |
| `emotionalWarmth` | `2` | 0.61 | webDICE의 부정 감정이 긍정으로 착지한다는 관찰과 nonnon의 관계적 배려·모호함이 보조적으로 일치한다. 작품 전체의 치유 핵심인 4는 아니다. |

Theme은 제안하지 않는다. 일상·직장·친구·연애가 개별 단편의 소재로 보이지만
현재 Theme ID 중 하나가 반복 핵심 mechanic이라고 확정할 직접 근거가 없다. 남은
N 4개와 T 2개는 권별 본문 또는 정확한 초기 단편 범위를 표시한 독립 리뷰 두 개가
같은 구체 관찰을 제공해야 한다. 신장판 metadata는 내용 근거로 재사용하지 않는다.

### Position 40 — 脳内ポイズンベリー (`work-ab9331f7fed1990f7dc6`)

| id | sourceName / URL | publishedAt | range 및 독립성 | 관찰 |
| --- | --- | --- | --- | --- |
| 40-O1 | 集英社 1권 — https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865626865626315501&rf=ak | 2011-05-19 | official digital vol.1, chapters 1–6 identified | 연애 선택을 둘러싼 다섯 인격의 내부 회의와 1–6화 범위 |
| 40-O2 | 集英社 3권 — https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865666865626315501 | 2013-08-23 | official digital vol.3, chapters 13–18 identified | 전 약혼자·키스·메일로 관계 긴장이 변하고 13–18화 수록 |
| 40-O3 | ココハナ rightsholder page — https://cocohana.shueisha.co.jp/story/mizushiro/poisonberry/ | 2014 | official series page | 이치코의 연애와 머릿속 회의 구성원이 반복되는 구조임을 확인 |
| 40-R1 | マンバ 1권 reviews — https://manba.co.jp/boards/25308/books/1 | 2014-12-25 (volume page) | independent readers, vol.1 | 내부 캐릭터의 논쟁이 현실 행동의 결정을 만들고, 설정이 반복되어 웃음을 만든다는 관찰 |
| 40-R2 | 先刻の箚記 1권 — https://ameblo.jp/toraieisu/entry-11222827604.html | 2012 (page date not displayed) | independent long review, vol.1 | 말할지 말지·밀지 말지의 회의, 오해와 행동의 불일치를 entry 화수와 함께 분석 |
| 40-R3 | このマンガがすごい！WEB long review — https://konomanga.jp/special/32915-2 | 2015 | independent critical review, vols.1–5 with vol.1–3 links | 연애 규칙이 누적되고 내부 회의가 관계 선택의 반복 구조가 된다는 관찰 |
| 40-R4 | BookLive 2권 — https://booklive.jp/product/index/title_id/293660/vol_no/002 | page date not displayed | independent users, vol.2 | 내부 회의의 반성과 관계 조정이 2권에도 반복됨을 확인 |

**Provisional proposals:**

| cell | proposal | confidence | bounded reason |
| --- | ---: | ---: | --- |
| `problemSolving` | `2` | 0.66 | 1권의 반복적인 선택 회의가 말·행동의 제약을 검토하고 결정을 내리는 구조로 나타나며, 두 독립 review가 이를 구체적으로 설명한다. 4의 기발한 해결 중심으로는 올리지 않는다. |
| `comedy` | `2` | 0.70 | 내부 인격의 불일치와 행동 결과를 만바·Ameblo·Konomanga가 반복적인 웃음/어긋남으로 관찰한다. 연애 중심 작품이므로 4는 아니다. |

내부 회의는 반복 구조지만 별도 `worldBuilding`이나 `strategy`로 중복 부여하지
않는다. 관계의 진전은 이미 `characterArcWeight=4`, `romance=4`에 반영된 범위와
겹치므로 `progression`을 새로 만들지 않았다. Theme 후보도 현재 Dictionary의
legal ID와 직접 대응하지 않아 없다. 남은 route는 1–3권의 본문에서 problem-solving
관찰이 실제 장면 순서와 일치하는지 확인하고, T coverage를 위해 comedy 외에
`darkness`·`emotionalWarmth`가 반복되는지 독립 자료 두 개로 확인하는 것이다.

## 전체 residual route와 hard-blocker 판단

- 31–40 어느 작품에서도 이번 라운드에 safety, identity, adult-only, webtoon,
  duplicate 또는 source-unavailable hard blocker를 새로 확정하지 않았다.
- 이번 문서의 provisional 값만으로 승격하거나 terminal CSV를 재생성해서는 안
  된다. Daybreak 독립 adjudicator가 공식 범위·Dictionary anchor·독립성·판본
  연결을 다시 확인해야 한다.
- 가장 유망한 재검수 대상은 35번의 공식 Genre와 36번의 단일 Tone cell이다.
  34·38·40은 Theme/Axis 제안이 있으나, 단순 생활·관계·내부 회의를 Theme 또는
  다른 Axis로 중복 계수하지 않는지 adjudication이 필요하다.
- 가장 큰 잔여 공백은 39번이다. 1권 review와 수상 코멘트는 일상·개그·감정
  착지를 보이지만, 현재 Dictionary의 Theme 및 Narrative 네 축을 책임 있게
  채울 근거가 없다. 이를 이유로 blocker로 확정하지 않고 exact entry-page
  route를 남긴다.
- Art는 모든 40 cell이 계속 `unknown`이다. 표지·애니메이션·리뷰 작화평을
  Art evidence로 사용하지 않았고, Art packet 및 이미지 파일도 만들지 않았다.

## 읽기 전용 검증 기록

실행 결과:

```text
$ sha256sum data/staging/catalog-expansion/batches/batch-005/adjudication/text-final-chunk-04.csv
1596f9527a41fd1819dd553de36d1d3f8b5fc3ca0a7a4be347802a5a3fe18378

$ git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-chunk-04-round-2.md
PASS (new file; no whitespace errors)
```

이 packet 작성 동안 변경한 파일은 이 문서 하나뿐이다. terminal CSV의 SHA는
위에 기록한 값으로 유지되며, source·promotion·generated artifact·Art 파일은
변경하지 않았다.
