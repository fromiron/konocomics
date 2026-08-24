# Batch 002 text-gap independent review — chunk 01, round 02

- batchId: `batch-002`
- positions: `1`, `2`, `3`, `4`, `6`, `7`, `8`
- frozenWorkSetSha256: `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6`
- reviewer: Local Codex independent Pass B
- reviewedAt: `2026-08-23`
- reviewedByHuman: `false`
- evaluatedRange: 표준판 1~3권 또는 첫 주요 에피소드; 단권 완결은 완결 단권
- coverageGate: Narrative known `>=4/6`; Tone known `>=5/7`
- exclusion: position 5 RED는 upstream Art blocker 범위이므로 검수하지 않음
- boundary: 이 파일은 독립 텍스트 검수 결과만 기록한다. source/final CSV, registry,
  Art, Gold, identity, safety, eligibility, recommendation context와 promotion 상태는
  변경하지 않는다.

## 동결 입력과 검수 독립성

연구자의 gate 결론을 값의 근거로 사용하지 않았다. Factor Dictionary의 0/2/4
anchor, 공식 권차·판본, 관찰의 직접성, 리뷰 family 독립성을 다시 대조한 뒤 gate를
계산했다. 부족한 known 수를 채우기 위한 대체 축, 자동 평균, 다수결은 사용하지
않았다.

| Input                                             | SHA-256                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `AGENTS.md`                                       | `64abddef3e280a3293bef81f8ef964ce7cb8513a75aea8030f500daf7475ef72` |
| `docs/factors/factor-dictionary.md`               | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `annotation-review-adjudication-request.md`       | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `frozen-work-set.csv`                             | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `research/text-gap-chunk-01-round-02.md`          | `baa1a95202c5b97442240f0fd818b96768250e634a8915abfb9f0a2c6a67f7ed` |
| `reviews/text-gap-chunk-01-independent-review.md` | `e7426964ac1f1e1308dc0c99df39380b0cd7de031aa4d97cd742c6666eb20b05` |
| `adjudication/text-chunk-01-round-01.md`          | `4441b0502877f175ad5498d4b253675b23145fea7aadd7636ddae64f37240672` |
| `adjudication/text-chunk-01-round-02.md`          | `504e44329f1958ad484cddd1a518c42471bebcc062e82ff77fa63a31c0d40748` |
| `adjudication/text-final-chunk-01.csv`            | `55323c7f59e2d2a2444781dbf0ff32d7eaa92ee1633ad42b2896a355f1745732` |
| `adjudication/genres-final-chunk-01.csv`          | `8cc719334df730383c5b716c22f2791e79470a3f1c28c9ba200d5bfdf5db12be` |
| `adjudication/themes-final-chunk-01.csv`          | `10261fed1c9d20a3ddfab50f474116b7ab2ba37f5ccc78020bb42e5a63bed9a7` |

## 출처 권위·범위·독립성 재확인

공식 상품·viewer는 같은 출판사 family로 계산했다. 같은 플랫폼의 여러 계정과
Booklog 전재는 한 family로 묶었다. 사용자 리뷰는 공식 범위와 일치하는 구체 관찰의
보조 확인에만 사용했고, 문장을 전용하지 않고 공통 관찰만 요약했다.

| Pos | sourceName / URL                                                                                                                                                                                                                                                                                              | 발표일 또는 연도                                          | 조회일     | 권위·직접성·범위 검수                                                                                                                                                            |
| --: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | 講談社 サンダー３ 2·3권: https://www.kodansha.co.jp/comic/products/0000372698 ; https://www.kodansha.co.jp/comic/products/0000376761 ; 공식 trial은 같은 상품의 내부 reader                                                                                                                                   | 2023-01-17; 2023-05-17                                    | 2026-08-23 | 표준 2·3권과 동일 작품·권차다. 구조·구출·가족 동기·전투 결정을 직접 고정한다. BookLive 2권 family는 plot 속도 관찰이 갈려 후보 값의 근거로 쓰지 않았다.                          |
|   2 | 小学館 のたり松太郎 2·3권: https://shogakukan-comic.jp/book?jdcn=091800720000d0000000 ; https://shogakukan-comic.jp/book?jdcn=091800730000d0000000                                                                                                                                                            | 전자판 2017-12-01                                         | 2026-08-23 | JDCN이 표준 2·3권을 직접 식별한다. 같은 인물에 대한 호감, 방문, 재회 반응이 두 권에 이어진다. Cmoa family는 모순 검사만 담당한다.                                                |
|   3 | 集英社 デカワンコ 2·3권: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865527865501315501 ; https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865554865501315501                                                                                                                      | 종이판 2009-04-17; 2009-09-18                             | 2026-08-23 | 정확 권차의 공식 소개가 웃음과 감정적 사건의 혼합을 직접 고정한다.                                                                                                               |
|   3 | BookLive 2권: https://booklive.jp/review/list/title_id/152565/vol_no/002?spoiler=1 ; honto 2권: https://honto.jp/ebook/pd_34737694.html                                                                                                                                                                       | 사용 리뷰 2019-11-24, 2024-11-14; 2022-03-08              | 2026-08-23 | 서로 다른 두 플랫폼의 정확 2권 관찰이다. 안도 가능한 팀 관계와 감정적인 사건 종결이 반복되며, 별점·태그는 제외했다.                                                              |
|   4 | 集英社 ファイアパンチ 2·3권: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08880797880731315501 ; https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-880873-4                                                                                                                     | 2016-10-04; 2016-12-02                                    | 2026-08-23 | 표준 2·3권이다. 새 인물의 개입과 계획의 붕괴를 직접 확인하지만, 공식 마케팅의 충격 표현만으로 reveal을 만들지는 않았다.                                                          |
|   4 | TOKYO ALONE 2권 비평: https://kracpot.hatenablog.com/entry/2016/10/04/204621 ; BookLive 2권: https://booklive.jp/review/list/title_id/385889/vol_no/002                                                                                                                                                       | 2016-10-04; 사용 리뷰 2017-08-20 이후                     | 2026-08-23 | 서로 독립인 정확 2권 family다. 기존 세계 설명이 허위였다는 공개, 앞선 복선, 인물의 숨은 기능을 구체적으로 반복한다. 단순한 예측 불가 감상은 제외했다.                            |
|   6 | 小学館 邪眼は月輪に飛ぶ 완결 단권: https://shogakukan-comic.jp/book?isbn=9784091811974 ; 공식 viewer: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091811970000d0000000                                                                                                                                   | 2007-04-27; 전자판 2013                                   | 2026-08-23 | ISBN과 JDCN이 같은 완결 단권을 식별한다. 7개 장, 즉사 규칙, 네 인물, 도심 추격과 최종 대결을 직접 고정한다. viewer는 opening 범위 한계가 있다.                                   |
|   6 | Cmoa 완결 단권: https://www.cmoa.jp/title/62742/ ; 孤譚: https://isolated.hyakunin-isshu.net/book/comic-jagan-ha-gachirin-ni-tobu ; note: https://note.com/jenniferrrrrrrw/n/nab1e79333e0a ; https://note.com/miyabichito227/n/n5736630a819a ; 漫画の虎: https://manga-blog.net/jagan-ha-gachirin-ni-tobu/    | 2013-2026; 2016-03-24; 2025-12-02; 2022-07-30; 2017-06-08 | 2026-08-23 | Cmoa, 독립 블로그 두 곳, note family가 서로 독립이다. 제한 분석과 협동 해결, 과거 공개, 부녀 관계 회복을 반복한다. 두 note 작성자는 별도 사람이어도 한 플랫폼 family로 계산했다. |
|   7 | 小学館 銀河鉄道999 1~3권: https://shogakukan-comic.jp/book?jdcn=091880010000d0000000 ; https://shogakukan-comic.jp/book?jdcn=091880020000d0000000 ; https://shogakukan-comic.jp/book?jdcn=091880030000d0000000                                                                                                | 전자판 2015-08-07                                         | 2026-08-23 | 선행 identity adjudication이 대표 小学館 판본의 entry bridge를 확정했다. 1권의 구조와 동행, 2·3권의 행성별 만남·위험을 직접 고정한다. 원판 서지로 확장하지 않았다.               |
|   7 | BookLive 2권: https://booklive.jp/review/list/title_id/327375/vol_no/002 ; honto 2권: https://honto.jp/ebook/pd-review_0627290102_192.html                                                                                                                                                                    | 사용 리뷰 2023-03-01~~03-09; 2024-02-29~~04-05            | 2026-08-23 | 서로 다른 정확 2권 family다. 주민과의 교류·친절을 반복하지만, 성장과 큰 수수께끼 해결은 공식 자료와 일치하지 않아 후보로 만들지 않았다.                                          |
|   8 | 小学館 吉祥天女 2·3권 및 공식 viewer: https://shogakukan-comic.jp/book?jdcn=091313020000d0000000 ; https://shogakukan-comic.jp/book?jdcn=091313030000d0000000 ; https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091313020000d0000000 ; https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091313030000d0000000 | 전자판 2014-03-03                                         | 2026-08-23 | 표준판 2·3권과 viewer JDCN이 일치한다. 각 권 opening 6쪽씩의 가족·학교 관계와 동기만 사용하며 전체 권 서사로 일반화하지 않았다.                                                  |
|   8 | BookLive 2·3권: https://booklive.jp/product/index/title_id/246501/vol_no/002 ; https://booklive.jp/product/index/title_id/246501/vol_no/003                                                                                                                                                                   | 사용 리뷰 2009-10-04; 2013-09-19                          | 2026-08-23 | 정확 권차지만 Booklog 전재를 포함한 한 family다. 공식 viewer의 관계·동기 관찰을 보조할 뿐 독립 두 표로 계산하지 않았다.                                                          |

## 후보별 독립 판정

### 1. work-017446dd1a9039d9839b — サンダー３

| 후보                   | 판정     | 최종 | confidence | 근거와 제한                                                                                                                                        |
| ---------------------- | -------- | ---: | ---------: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `characterArcWeight=2` | `ACCEPT` |    2 |       0.76 | 2권의 구출·분리와 3권의 가족 소식에 따른 결심, 별도 전투 결정을 공식 범위가 반복한다. 인물 동기와 외부 사건이 균형이며 4의 핵심 보상까지는 아니다. |
| `emotionalWarmth=1`    | `ACCEPT` |    1 |       0.70 | 보호·구출과 가족 염려가 2·3권에 재등장하지만 침공과 분리가 지배적이다. 차가움 0과 혼합 2 사이만 지지한다.                                          |

- `progression`, `problemSolving`, `mysteryReveal`, `comedy`, `mentalStress`,
  `romance`는 `UNKNOWN` 종결이다. 사건 발생을 반복 메커니즘으로 바꾸지 않았다.
- Genres: `action;scienceFiction` 유지.
- Themes: `adventure:2;combat:2` 유지. 설정만으로 새 Theme를 만들지 않았다.
- Narrative: `U / U / 1 / 3 / U / 2` = `3/6`, **FAIL**; 1개 부족.
- Tone: `2 / 2 / U / 2 / U / U / 1` = `4/7`, **FAIL**; 1개 부족.
- finite deficiency: 공식 2·3권 full internal range 또는 안정적인 entry editorial이
  Narrative 1개와 Tone 1개의 반복 메커니즘을 직접 노출할 때만 재검수한다. 현재는
  Pass C의 `SOURCE_INFORMATION_UNAVAILABLE` blocker 후보이며 Pass B가 직접 blocker를
  확정하지 않는다.

### 2. work-02d5d329c9ef85e481cb — のたり松太郎

| 후보        | 판정     | 최종 | confidence | 근거와 제한                                                                                                                |
| ----------- | -------- | ---: | ---------: | -------------------------------------------------------------------------------------------------------------------------- |
| `romance=2` | `ACCEPT` |    2 |       0.86 | 같은 호감 대상이 2권의 방문과 3권의 재회·의식 반응으로 이어진다. 반복되는 부차 관계선이므로 subplot 2이며 중심 4는 아니다. |

- `mentalStress`와 `emotionalWarmth`는 `UNKNOWN` 유지. 따뜻한 한 방문이나 거친 행동을
  지속 체감으로 확장하지 않았다.
- Genres: `sports;comedy` 유지.
- Themes: `martialArts:2;workplace:2;sportsCompetition:2` 유지.
- Narrative: `3 / 0 / 0 / 3 / 0 / 2` = `6/6`, **PASS**.
- Tone: `2 / 3 / 2 / 1 / U / 2 / U` = `5/7`, **PASS**.

### 3. work-089947c5303024841fef — デカワンコ

| 후보                | 판정     | 최종 | confidence | 근거와 제한                                                                                                                                                                                      |
| ------------------- | -------- | ---: | ---------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `emotionalWarmth=2` | `ACCEPT` |    2 |       0.84 | 공식 2권이 웃음과 감정적 사건의 반복을 고정하고, BookLive와 honto의 정확 2권 family가 안도 가능한 관계와 감정적인 사건 종결을 독립적으로 반복한다. 상해와 범죄가 섞여 있어 핵심 보상 4는 아니다. |

- `mentalStress`와 `romance`는 `UNKNOWN` 유지.
- Genres: `mystery;comedy` 유지.
- Themes: `investigation:2;workplace:2` 유지.
- Narrative: `U / 3 / U / 3 / 4 / 1` = `4/6`, **PASS**.
- Tone: `2 / 3 / 3 / 2 / U / U / 2` = `5/7`, **PASS**.

### 4. work-0e036724913c69bb937a — ファイアパンチ

| 후보              | 판정     | 최종 | confidence | 근거와 제한                                                                                                                                                                                               |
| ----------------- | -------- | ---: | ---------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mysteryReveal=2` | `ACCEPT` |    2 |       0.82 | 정확 2권에서 기존 세계 설명의 허위성과 앞선 복선이 공개되고 인물의 숨은 기능이 드러난다는 독립 관찰이 일치한다. 공식 2·3권은 그 인물 개입과 재맥락화를 고정한다. clue/reveal 자체가 주 보상인 4는 아니다. |

- `progression`과 `problemSolving`은 `UNKNOWN` 유지. 급격한 전환이나 생존을 성장·분석
  루프로 바꾸지 않았다.
- Genres: `action;fantasy;horror` 유지.
- Themes: `combat:2;survival:2;revenge:2;postApocalypse:2` 유지.
- Narrative: `U / U / 2 / 4 / 2 / 3` = `4/6`, **PASS**.
- Tone: `3 / 3 / 2 / 4 / 4 / U / U` = `5/7`, **PASS**.

### 6. work-1088a1dc00a3b0d22201 — 邪眼は月輪に飛ぶ

| 후보                   | 판정     | 최종 | confidence | 근거와 제한                                                                                                                                                                                                                              |
| ---------------------- | -------- | ---: | ---------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving=3`     | `ACCEPT` |    3 |       0.82 | 공식 완결 단권이 불가능에 가까운 즉사 제약과 최종 대결을 고정한다. 서로 독립인 exact-volume family가 약점 발견과 여러 인물·수단을 잇는 제한 해결을 반복하고 한 close reading이 순서를 구체화한다. 직접 전투도 커서 분석 핵심 4는 아니다. |
| `mysteryReveal=2`      | `ACCEPT` |    2 |       0.76 | 숨은 임무·과거, 늦은 자기 실명 공개, 약점과 마지막 인식이 완결 범위에서 반복 확인된다. 괴물의 기원은 끝내 설명되지 않아 일부 비밀·반전 2에 머문다.                                                                                       |
| `characterArcWeight=2` | `ACCEPT` |    2 |       0.84 | 공식 네 인물과 결전 구조 안에서 여러 독립 family가 후회·불화·상호 이해와 관계 회복을 반복한다. 인물 변화와 외부 추격이 균형이다.                                                                                                         |
| `emotionalWarmth=2`    | `ACCEPT` |    2 |       0.78 | 도움·신뢰 형성·부녀 관계 회복이 독립 family에서 반복되지만 대량 죽음과 위협이 함께 지배한다. 혼합 2이며 4는 아니다.                                                                                                                      |

- `progression`, `strategy`, `comedy`, `romance`는 `UNKNOWN` 유지. 단권 결전 계획을
  장기 전략으로 만들지 않았고, 리뷰 침묵으로 0을 만들지 않았다.
- Genres: 선행 빈 값을 `action;horror`로 `REVISE` 권고한다. 완결 공식 소개의 추격·결투와
  대량 즉사 위협이 각각 직접 반복되며, Cmoa의 exact-volume 분류와 독립 완독 관찰이
  보조한다. Genre에서 Axis 값을 추론하지 않았다.
- Themes: `combat:2;survival:2` 유지. 두 구조 모두 완결 단권의 반복 핵심이다.
- Narrative: `U / 3 / U / 4 / 2 / 2` = `4/6`, **PASS**.
- Tone: `2 / 2 / U / 4 / 2 / U / 2` = `5/7`, **PASS**.

### 7. work-19a26f01512166856a6a — 銀河鉄道999

| 후보                | 판정     | 최종 | confidence | 근거와 제한                                                                                                                                                 |
| ------------------- | -------- | ---: | ---------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `emotionalWarmth=2` | `ACCEPT` |    2 |       0.76 | 공식 1권의 구조·동행과 정확 2권의 BookLive·honto family가 여러 주민과의 교류·친절을 독립적으로 반복한다. 비극적 에피소드가 계속되어 따뜻함 핵심 4는 아니다. |

- `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `comedy`, `mentalStress`,
  `romance`는 `UNKNOWN` 종결이다. 독자 한 family의 성장 인상은 공식 자료의 구체적인
  획득·숙련 루프와 교차되지 않았고, 큰 수수께끼는 2권에서 더 깊어진다는 반대 관찰이
  있다.
- Genres: `scienceFiction` 유지.
- Themes: `adventure:2;exploration:1` 유지.
- Narrative: `U / U / U / 3 / U / 4` = `2/6`, **FAIL**; 2개 부족.
- Tone: `2 / 2 / U / 3 / U / U / 2` = `4/7`, **FAIL**; 1개 부족.
- finite deficiency: 공식 mapped 1~3권 episode pages가 Narrative 2개와 Tone 1개의
  반복 메커니즘을 직접 노출하거나, 그 공식 관찰과 일치하는 새 exact-volume 독립
  family 둘이 생길 때만 재검수한다. 현재는 Pass C의
  `SOURCE_INFORMATION_UNAVAILABLE` blocker 후보다.

### 8. work-1e27731b880d0d9012f8 — 吉祥天女

| 후보                      | 판정     | 최종 | confidence | 근거와 제한                                                                                                                                                    |
| ------------------------- | -------- | ---: | ---------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `characterArcWeight=2`    | `ACCEPT` |    2 |       0.76 | 공식 2·3권 opening이 원망·가족 거리, 행동 변화, 염려와 대립을 두 권에 걸쳐 직접 보여 준다. 동기·관계와 사건이 균형이며 12쪽 표본으로 중심 4를 주장하지 않는다. |
| `relationshipStructure=2` | `ACCEPT` |    2 |       0.80 | 가족 구성원, 涼, 동급생과 小夜子가 두 공식 viewer 범위에 반복되는 고정 관계 core를 이룬다. 복잡한 군상극 4는 아니다.                                           |
| `emotionalWarmth=1`       | `ACCEPT` |    1 |       0.68 | 조부모의 돌봄 기억, 동급생의 염려와 도움은 서로 다른 두 권 opening에서 재등장한다. 공격·소외·죽음이 더 강하므로 차가움 0과 혼합 2 사이만 지지한다.             |

- 여섯 Narrative 축, `comedy`, `romance`는 `UNKNOWN` 종결이다. 공식 12쪽과 한
  Booklog 전재 family의 사건 목록을 전권 반복 메커니즘으로 확장하지 않았다.
- Genres: 현재 packet으로 최종 지원되는 Genre 없음. 상품의 수수께끼 표현이나 retailer
  tag만으로 `mystery`를 되살리지 않는다.
- Themes: `school:1` 유지. 학교는 직접 확인되지만 유일한 핵심 구조 2는 아니다.
- Narrative: `U / U / U / U / U / U` = `0/6`, **FAIL**; 4개 부족.
- Tone: `2 / 2 / U / 2 / 2 / U / 1` = `5/7`, **PASS**.
- finite deficiency: 공식 2·3권 full internal pages 또는 안정적인 출판사 editorial이
  Narrative 4개를 직접 노출할 때만 재검수한다. volume 4, 결말, 영화 자료, 같은
  Booklog 문장의 다른 전재는 재개 조건이 아니다. 현재는 Pass C의
  `SOURCE_INFORMATION_UNAVAILABLE` blocker 후보다.

## 극단값·Genre·Theme·저작권 검수

- 이번 13개 Axis 후보에 새 0 또는 4 극단값은 없다.
- 선행 극단값인 デカワンコ `mysteryReveal=4`, ファイアパンチ
  `pacing=4;darkness=4;mentalStress=4`, 邪眼は月輪に飛ぶ
  `pacing=4;darkness=4`, 銀河鉄道999 `worldBuilding=4`를 이번 후보로부터
  역추론하지 않았다. 재확인한 공식 범위에서 직접 모순은 발견되지 않았다.
- Genre가 Axis를 결정한 사례: `0`.
- Theme centrality를 새로 높인 사례: `0`.
- user-review family 중복 계산: `0`; Booklog 전재와 note 작성자 둘은 각각 플랫폼
  한 family로 묶었다.
- 별점·인기·선정 목록을 Factor Evidence로 사용한 사례: `0`.
- 리뷰 원문을 사용자 설명으로 복사한 사례: `0`; 이 문서는 관찰을 저작권 침해 없이
  요약하며 추천 설명은 contribution engine 경계를 유지한다.
- Art를 열거나 판정한 사례: `0`.
- canonical title의 장식 인용부호 수: `0`.
- human validation을 완료로 표시한 사례: `0`; `reviewedByHuman=false`다.

## 예상 gate와 Pass C handoff

| Pos | canonicalTitle   | 채택 후보 수 | Narrative | Tone | expectedTextGate | Pass C 상태 권고                        |
| --: | ---------------- | -----------: | --------: | ---: | ---------------- | --------------------------------------- |
|   1 | サンダー３       |            2 |       3/6 |  4/7 | FAIL             | finite route 소진; blocker adjudication |
|   2 | のたり松太郎     |            1 |       6/6 |  5/7 | PASS             | candidate 값 adjudication               |
|   3 | デカワンコ       |            1 |       4/6 |  5/7 | PASS             | candidate 값 adjudication               |
|   4 | ファイアパンチ   |            1 |       4/6 |  5/7 | PASS             | candidate 값 adjudication               |
|   6 | 邪眼は月輪に飛ぶ |            4 |       4/6 |  5/7 | PASS             | candidate 값·Genre adjudication         |
|   7 | 銀河鉄道999      |            1 |       2/6 |  4/7 | FAIL             | finite route 소진; blocker adjudication |
|   8 | 吉祥天女         |            3 |       0/6 |  5/7 | FAIL             | finite route 소진; blocker adjudication |

| 집계                                         | 결과 |
| -------------------------------------------- | ---: |
| 검수 작품                                    |    7 |
| 검수 후보 Axis                               |   13 |
| `ACCEPT`                                     |   13 |
| `REVISE -> unknown`                          |    0 |
| 최종 text gate `PASS`                        |    4 |
| 최종 text gate `FAIL`                        |    3 |
| Pass C `SOURCE_INFORMATION_UNAVAILABLE` 후보 |    3 |
| upstream Art exclusion                       |    1 |

Pass C는 채택값을 평균하거나 gate를 구하기 위해 다른 축을 만들지 않는다. 세 실패작의
`unknown`을 그대로 유지한 채 고정 coverage 계약으로 blocker 여부를 결정하고, 네
통과작도 Art·Evidence·context·identity·safety를 포함한 전체 promotion gate 전에는
승격하지 않는다.
