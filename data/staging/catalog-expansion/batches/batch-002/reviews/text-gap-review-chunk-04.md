# Batch 002 text coverage gap Pass B — chunk 04

- batchId: `batch-002`
- sourceChunk: `chunk-04`
- reviewKind: `independent-pass-b`
- reviewer: `Local Codex subagent`
- reviewedAt: `2026-08-23`
- reviewedByHuman: `false`
- evaluatedRange: 작품별 진입 1~3권 또는 첫 주요 에피소드
- scope: 보충 조사 패킷의 10작품·candidate-known 50축과 Theme 후보 1개
- decisionBoundary: Factor source, promotion registry, final CSV, Pass C 산출물을 수정하지 않고 각 후보의 근거 적합성과 예상 text gate만 판정한다.

## 동결 입력과 독립성

| Input                                            | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `research/text-gap-chunk-04.md`                  | `10c1d1b22d5bcf406beb08b23017b35b65e21b28ea3d4022b10fcb2539579eeb` |
| `docs/factors/factor-dictionary.md`              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/catalog-expansion/01-promotion-method.md`  | `6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd` |
| `annotation-review-adjudication-request.md`      | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `adjudication/text-chunk-04-round-01.md`         | `f5272bd8a807ea876ffa2ff114e95e7ea47f3c0afd2e012de5ef1202f66f09fc` |
| `adjudication/text-gap-queue-chunk-04.csv`       | `00fdfd857e72e252355d96134a693dac4758ba86d79bd1578a1a8c332082e48d` |
| `annotation/pass-a-text-chunk-04.csv`            | `895e2f1715741065bbb5adfb6edf6f0688d09a8b0780d98047c43ade6fb9bb23` |
| `annotation/pass-a-text-chunk-04.md`             | `8db250f0688cf4f8dda8b5a8592503f19aba4362bc38b7889e44ad2665e5f2e2` |
| `reviews/grok-text-review-response-chunk-04.txt` | `c0d495de2e6693446c038c34e267123a1ef282bbf517c52dd274d3f037faf330` |
| `reviews/grok-text-review-ledger-chunk-04.md`    | `b61a5c2a77ec4fd046a6bb06116721fd40a8798360811d28e06eef7a818903c7` |
| `adjudication/identity-chunk-04.md`              | `65b08172722607773bb10c65940e3052c5c6280abcc2a27606b1694321be255a` |
| `frozen-work-set.csv`                            | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |

보강 패킷의 후보를 먼저 공식 범위·판본·Factor Dictionary 앵커에 대조한 뒤 Pass A, Grok, root round-01의 결론과 비교했다. 앞선 모델의 동의 수는 판정 근거로 쓰지 않았다. 보강 패킷에서 추출한 고유 URL 67개는 검수일에 다시 요청해 `67/67 HTTP 200`을 확인했지만, 접근 가능성 자체를 내용 충분성이나 독립성으로 세지 않았다.

## 검수 규칙

- `ACCEPT`는 제안값과 known 상태를 유지한다. `REVISE`는 known 상태를 유지하되 값을 바꾸고, `REJECT`는 후보 주장이 다른 직접 근거와 양립하지 않을 때 사용한다. `UNKNOWN`은 사실값을 반대로 확정하는 것이 아니라 현재 근거로 숫자를 책임 있게 닫지 못한다는 뜻이다.
- known `0`은 공식 소개의 침묵만으로 만들지 않았다. 공식 1~3권이 반복 구조를 빠짐없이 고정하고, 범위가 명시된 관찰이 해당 축의 실질적 부재나 다른 반복 보상을 직접 확인하는 경우만 허용했다.
- Genre, 선정 이력, 판매량, 별점은 Axis 근거에서 제외했다. 관계 변화는 자동으로 `progression`이나 `emotionalWarmth`가 아니며, 사건의 위험은 자동으로 `mentalStress`가 아니다.
- 같은 플랫폼의 여러 계정은 반복 관찰을 보여도 하나의 source family로만 계산했다. 서로 다른 플랫폼 리뷰도 공식 자료를 대체하지 않고, 정확한 범위와 구체 관찰이 공식 구조와 일치할 때만 보조로 사용했다.
- 작가·편집자 인터뷰의 작품 총론은 진입 1~3권에 직접 대응하는 제작 원칙만 사용했다. 후반 사례, 원작 소설, 애니메이션 관찰은 제외했다.
- identity, safety, 대표 ISBN은 선행 adjudication을 재개하지 않았다. 보강 패킷에서 실제 모순은 발견되지 않았다.

## 작품별 독립 판정

### 31. work-84b7c7d7720447075c25 — 軍靴のバルツァー

#### Source와 범위

- [新潮社 1권](https://www.shinchosha.co.jp/book/771626/), [2권](https://www.shinchosha.co.jp/book/771642/), [3권](https://www.shinchosha.co.jp/book/771671/)은 표준판 1~3권을 직접 고정한다.
- 보존된 [작가·담당 편집자 인터뷰 3쪽](https://web.archive.org/web/20150412062825id_/http://konomanga.jp/interview/16932-2/3)과 [4쪽](https://web.archive.org/web/20150802235408id_/http://konomanga.jp/interview/16932-2/4)은 초기 구상과 1~3권의 외부 교관, 인정·출세, 복수 관점 설계를 다룬다. [BookLive 3권](https://booklive.jp/review/list/title_id/1188582/vol_no/003)은 한 플랫폼 family의 권 고정 관찰이고, [コミックシーモア](https://www.cmoa.jp/title/249132/?order=up)는 3권까지 읽었다고 명시한 별도 플랫폼 계정이다.
- 공식 자료는 역할 확대와 신뢰 형성을 직접 보여 주지만 전투·파벌 압력 자체가 등장인물의 지속적 심리 압박을 증명하지는 않는다.

| Axis                 | Proposed | Decision  | Final | 값 앵커와 직접 근거 대응                                                                                            |
| -------------------- | -------- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------- |
| `progression`        | `2`      | `ACCEPT`  | `2`   | 교관 임무에서 책사 역할로 확대되고 인정·출세 보상이 이어진다. 반복 숙련·획득 중심 `4`가 아닌 서서히 성장하는 `2`다. |
| `characterArcWeight` | `2`      | `ACCEPT`  | `2`   | 학생과의 신뢰 및 제2왕자의 태도 변화가 반복되지만 정치·군사 사건과 균형을 이뤄 Dictionary의 혼합값 `2`에 맞는다.    |
| `mentalStress`       | `2`      | `UNKNOWN` | `U`   | 실전, 약한 협상 카드, 상하 관계는 객관적 제약이다. 정확한 범위에서 불안·답답함·심리 압박이 지속된다는 관찰은 없다.  |
| `emotionalWarmth`    | `2`      | `ACCEPT`  | `2`   | 공식 2권의 신뢰 형성과 별도 플랫폼의 1~3권 내 인정·태도 완화가 유대를 지지한다. 전쟁·정치와 혼합되므로 `2`다.       |

- expectedTextGate: Narrative `4/6`, Tone `4/7`; `fail T+1`.
- blockerCheck: 새 hard blocker 없음. `mentalStress`는 Evidence 한계로 닫는다.

### 32. work-9072892a767332254f00 — flat

#### Source와 범위

- マッグガーデン [1권](https://www.mag-garden.co.jp/comics/6038/), [2권](https://www.mag-garden.co.jp/comics/6039/), [3권](https://www.mag-garden.co.jp/comics/6040/)은 표준판 전 범위의 평온한 일상과 관계의 작은 변화를 고정한다.
- [BookLive 1권](https://booklive.jp/product/index/title_id/130205/vol_no/001)과 [コミックシーモア](https://www.cmoa.jp/title/24689/)는 서로 다른 플랫폼 family이며, 큰 사건보다 대화·배려·작은 웃음이 이어지는 진입 경험을 반복 관찰한다.
- [マンガ食堂의 정확한 1권 기록](https://mangashokudo.net/blog-entry-176.html)은 과자 만들기와 서로 다른 팬케이크 장면을 권 범위와 함께 고정한다.

| Axis                 | Proposed | Decision  | Final | 값 앵커와 직접 근거 대응                                                                                                        |
| -------------------- | -------- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| `progression`        | `2`      | `UNKNOWN` | `U`   | 두 인물의 작은 관계·내면 변화는 `characterArcWeight` 근거다. 성장·획득·숙련 보상 루프가 반복된다는 직접 근거는 없다.            |
| `problemSolving`     | `0`      | `ACCEPT`  | `0`   | 공식 1~3권과 두 리뷰 family가 큰 해결 과제 없이 대화와 작은 일상 반응이 반복되는 구조를 직접 덮는다. 공식 침묵만 쓴 0이 아니다. |
| `strategy`           | `0`      | `ACCEPT`  | `0`   | 1~3권의 반복 경험은 즉흥적 일상 반응이며 장기 계획·전술·자원 운영이 거의 없는 `0` 구조로 적극 확인된다.                         |
| `pacing`             | `1`      | `ACCEPT`  | `1`   | 평온한 날들이 계속되며 관계는 조금씩 움직인다. 정지 `0`과 일반 arc 변화 `2` 사이의 `1`이다.                                     |
| `mysteryReveal`      | `0`      | `ACCEPT`  | `0`   | 세 권의 공식 구조와 두 플랫폼 관찰이 일상·관계 보상을 반복하고 단서·추리·진실 공개 구조가 거의 없음을 범위 전체에서 확인한다.   |
| `characterArcWeight` | `3`      | `ACCEPT`  | `3`   | 平介와 秋의 작은 변화가 핵심 보상이지만 완전한 내면극 `4`보다는 일상 사건이 섞여 `3`이다.                                       |
| `comedy`             | `2`      | `ACCEPT`  | `2`   | 서로 다른 일상 맥락의 작은 웃음이 두 플랫폼에서 반복되지만 상시 핵심 개그 `4`는 아니다.                                         |
| `mentalStress`       | `1`      | `ACCEPT`  | `1`   | 자기 억제와 작은 걱정은 있으나 평온함과 배려가 우세해 무압박 `0`과 혼합 긴장 `2` 사이에 놓인다.                                 |
| `emotionalWarmth`    | `4`      | `ACCEPT`  | `4`   | 공식 하트풀 구조와 두 플랫폼의 배려·따뜻함 관찰이 1~3권의 핵심 보상으로 일치한다.                                               |

- Theme `cooking:1`: `ACCEPT`. 1권에서 과자 만들기와 두 팬케이크 맥락이 반복되지만 작품 전체의 핵심 mechanic은 아니므로 centrality 1이다.
- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음.

### 33. work-98b7d2ef065bde405972 — スーパーの裏でヤニ吸うふたり

#### Source와 범위

- SQUARE ENIX [1권](https://magazine.jp.square-enix.com/top/comics/detail/9784757580947/), [2권](https://magazine.jp.square-enix.com/top/comics/detail/9784757583627/), [3권](https://magazine.jp.square-enix.com/top/comics/detail/9784757586949/)은 일반판 1~3권의 반복 대화와 작은 사건을 직접 고정한다.
- [マンガ大賞 2023 심사 댓글](https://www.mangataisho.com/data/2023/comment2023.pdf)은 순위가 아니라 복수 심사자의 구체적 진입 경험만 사용했다. BookLive [1권](https://booklive.jp/review/list/title_id/20048232/vol_no/001)과 [3권](https://booklive.jp/review/list/title_id/20048232/vol_no/003)은 같은 플랫폼 family로만 세었다.

| Axis              | Proposed | Decision | Final | 값 앵커와 직접 근거 대응                                                                                                  |
| ----------------- | -------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving`  | `0`      | `ACCEPT` | `0`   | 세 권의 작은 사건은 분석·기발한 해결보다 대화와 관계 반응으로 끝나며 공식 심사자들도 단순 회화 구조를 반복 관찰한다.      |
| `strategy`        | `0`      | `ACCEPT` | `0`   | 관계 이동은 우연한 만남과 즉흥 대화로 진행된다. 장기 계획·전술·자원 운영이 거의 없는 Dictionary `0`에 맞는다.             |
| `worldBuilding`   | `0`      | `ACCEPT` | `0`   | 현실적 단일 장소가 기능할 뿐 역사·문화·규칙·세력이 반복 보상이 아니다. workplace Theme나 현실 장르에서 역추론하지 않았다. |
| `comedy`          | `2`      | `ACCEPT` | `2`   | 복수 공식 심사자와 정확한 1권·3권 리뷰가 오해와 대화의 작은 웃음을 반복 확인한다.                                         |
| `emotionalWarmth` | `3`      | `ACCEPT` | `3`   | 공식 관계 이동과 심사자·리뷰의 편안함·배려가 반복되며, 느린 관계극과 섞여 핵심 `4`보다 `3`이다.                           |

- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음. 흡연 소재는 Axis나 blocker 근거로 쓰지 않았다.

### 34. work-a59481c00155de21d75f — ケロロ軍曹

#### Source와 범위

- KADOKAWA [1권](https://www.kadokawa.co.jp/product/200659000036/), [2권](https://www.kadokawa.co.jp/product/200659000037/), [3권](https://www.kadokawa.co.jp/product/200000000671/)은 표준판 1~3권에서 침공 시도가 가정 소동으로 반복되는 구조를 고정한다.
- BookLive의 정확한 [1권](https://booklive.jp/product/index/title_id/13140/vol_no/001)과 [3권](https://booklive.jp/product/index/title_id/13140/vol_no/003)은 하나의 플랫폼 family이고, [コミックシーモア 3권](https://www.cmoa.jp/title/12586/vol/3/)은 별도 플랫폼이다. 두 family 모두 독립 에피소드와 가벼운 집단 소동을 보조한다.

| Axis              | Proposed | Decision  | Final | 값 앵커와 직접 근거 대응                                                                                                  |
| ----------------- | -------- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------- |
| `strategy`        | `1`      | `ACCEPT`  | `1`   | 침공 계획은 반복되지만 단기·즉흥적이며 자주 빗나간다. 계획 부재 `0`과 실질적 전술 `2` 사이의 `1`이다.                     |
| `mysteryReveal`   | `0`      | `ACCEPT`  | `0`   | 괴담 소재가 있어도 세 권의 반복 보상은 단서·추리·진실 공개가 아니라 독립 소동임이 공식 범위와 두 플랫폼에서 확인된다.     |
| `darkness`        | `0`      | `ACCEPT`  | `0`   | 침공·포획 표방이 지속 위험이나 비극으로 이어지지 않고 1~3권 내내 가벼운 가정 소동으로 전환된다.                           |
| `mentalStress`    | `0`      | `ACCEPT`  | `0`   | 실패와 갈등은 회차 단위 웃음으로 해소되며 지속 불안·답답함·압박이 거의 없는 반복 구조가 1권과 3권에서 교차 확인된다.      |
| `emotionalWarmth` | `2`      | `UNKNOWN` | `U`   | 동거·소대 집결·집단 상호작용은 관계 구조를 보여 줄 뿐, 유대·보호·힐링이 반복 보상이라는 구체 장면 관찰은 제공하지 않는다. |

- expectedTextGate: Narrative `4/6`, Tone `4/7`; `fail T+1`.
- blockerCheck: 새 hard blocker 없음. 3권 민감도 고지와 선행 safety 판정은 재개하지 않는다.

### 35. work-a8349445836546a82934 — 百姓貴族

#### Source와 범위

- 新書館 [1권](https://www.shinshokan.co.jp/book/b565859.html), [2권](https://www.shinshokan.co.jp/book/b565858.html), [3권](https://www.shinshokan.co.jp/book/b565857.html)은 표준판 전 범위의 농사·가족·가축 에피소드를 고정한다.
- [楽天ブックス 작가 인터뷰](https://books.rakuten.co.jp/event/book/interview/arakawa-h/)는 1권과 2권 예고, [ITmedia 작가 인터뷰](https://www.itmedia.co.jp/ebook/articles/1202/24/news041.html)는 1~2권과 초기 설계를 다룬다. 독자 반응 인용은 배제하고 작가의 직접 설명만 사용했다.

| Axis                    | Proposed | Decision | Final | 값 앵커와 직접 근거 대응                                                                                              |
| ----------------------- | -------- | -------- | ----- | --------------------------------------------------------------------------------------------------------------------- |
| `progression`           | `0`      | `ACCEPT` | `0`   | 작가가 작품을 성장 서사와 직접 구분하고 농업 소재의 독립 에피소드 구조라고 설명한다. 침묵이 아닌 제작 원칙 근거다.    |
| `mysteryReveal`         | `0`      | `ACCEPT` | `0`   | 공식 1~3권과 작가의 구조 설명이 농업 경험 전달과 웃음을 반복 보상으로 고정하며 단서·추리·공개의 반복 구조를 배제한다. |
| `relationshipStructure` | `2`      | `ACCEPT` | `2`   | 가족·가축·편집자·지역 인물이 반복 조연군이지만 관계망 자체가 핵심인 군상극 `4`는 아니다.                              |
| `comedy`                | `4`      | `ACCEPT` | `4`   | 두 작가 인터뷰가 웃음을 직접 제작 목표와 소재 전달 방식으로 명시한다.                                                 |
| `darkness`              | `2`      | `ACCEPT` | `2`   | 가축의 생사 판단과 농업의 가혹한 면이 실제 진입 소재지만 전편의 유일한 보상은 아니어서 혼합값 `2`다.                  |
| `mentalStress`          | `2`      | `ACCEPT` | `2`   | 연중 노동·수면 부족·해소되지 않은 생사 감정이 직접 언급되고 웃음과 병존하므로 혼합 압박 `2`다.                        |
| `emotionalWarmth`       | `2`      | `ACCEPT` | `2`   | 가축에 대한 애정과 가족 식탁의 웃음이 반복되지만 노동·생사의 가혹함과 섞여 `2`다.                                     |

- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음.

### 36. work-ab95f4d4997113e0687a — 月刊少女野崎くん

#### Source와 범위

- SQUARE ENIX [1권](https://magazine.jp.square-enix.com/top/comics/detail/9784757535664/), [2권](https://magazine.jp.square-enix.com/top/comics/detail/9784757537774/), [3권](https://magazine.jp.square-enix.com/top/comics/detail/9784757539853/)은 표준판 1~3권의 반복 오해와 4컷 일상을 고정한다.
- [マンガ大賞 2015 심사 댓글](https://www.mangataisho.com/data/2015/comment2015.pdf)은 순위 대신 복수 심사자의 구체 관찰만 사용했다. [BookLive 1권](https://booklive.jp/review/list/title_id/195926/vol_no/001)과 [コミックシーモア 3권](https://www.cmoa.jp/title/62958/vol/3/)은 서로 다른 플랫폼 family다.

| Axis              | Proposed | Decision | Final | 값 앵커와 직접 근거 대응                                                                                              |
| ----------------- | -------- | -------- | ----- | --------------------------------------------------------------------------------------------------------------------- |
| `progression`     | `0`      | `ACCEPT` | `0`   | 공식 세 권의 반복 오해·짧은 일상과 정확한 1권·3권의 관계 정체 관찰이 성장·획득 누적 보상이 거의 없음을 직접 지지한다. |
| `mysteryReveal`   | `0`      | `ACCEPT` | `0`   | 새 인물 면과 과거 고백 시도는 4컷 오치의 재료이며 단서·추리·진실 공개가 반복 보상이 아님이 전 범위 구조에서 확인된다. |
| `comedy`          | `4`      | `ACCEPT` | `4`   | 복수 공식 심사자와 두 권 고정 플랫폼이 회차마다 웃음이 핵심이라고 반복 확인한다.                                      |
| `emotionalWarmth` | `2`      | `ACCEPT` | `2`   | 호감 가는 인물군과 따뜻하게 지켜보는 관계 보상이 반복되지만 주된 보상은 comedy와 오해이므로 `2`다.                    |

- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음.

### 37. work-ad32c71b07fd13c65a79 — 私の推しは悪役令嬢。

#### Source와 범위

- 一迅社 만화판 [1권](https://data.ichijinsha.co.jp/detail/75802193), [2권](https://data.ichijinsha.co.jp/detail/75802263), [3권](https://data.ichijinsha.co.jp/detail/75802318)은 표준판 본편을 고정한다. 권말 소설과 원작 소설은 제외했다.
- [アニメ！アニメ！ 인터뷰](https://animeanime.jp/article/2023/11/28/81532.html)는 대상자가 읽은 만화판 1권 관찰만 사용했다. [BookLive 만화판 1권](https://booklive.jp/review/list/title_id/884440/vol_no/001)과 [독립 3권 리뷰](https://antaressmangakanso.iiblog.jp/article/484867024.html)는 서로 다른 source family다.

| Axis              | Proposed | Decision | Final | 값 앵커와 직접 근거 대응                                                                                          |
| ----------------- | -------- | -------- | ----- | ----------------------------------------------------------------------------------------------------------------- |
| `comedy`          | `3`      | `ACCEPT` | `3`   | 만화 1권 인터뷰와 별도 1권·3권 리뷰가 과장된 접근과 반응의 반복 웃음을 확인한다. 진지한 관계 장면도 있어 `3`이다. |
| `emotionalWarmth` | `2`      | `ACCEPT` | `2`   | 공식 태도 변화와 1권의 친절, 1권·3권의 관계 완화가 직접 대응한다. romance·character arc가 더 중심이므로 `2`다.    |

- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음. 만화판 밖 자료는 사용하지 않았다.

### 38. work-bbeeaad9e37ab267dc29 — 僕とロボコ

#### Source와 범위

- 集英社 [1권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882509-0), [2권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882548-9), [3권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882595-3)은 표준판 전 범위의 독립 목표·실패 에피소드를 고정한다.
- [少年ジャンプ 공식 작품 페이지](https://www.shonenjump.com/j/rensai/roboko/)와 [集英社 계열 작가 인터뷰](https://wpb.shueisha.co.jp/news/entertainment/20210711-114019/)는 한 권리자 family이며, 4권 고유 사건은 제외했다. [Real Sound의 1~2권 비평](https://realsound.jp/book/2021/02/post-712473_2.html)과 [BookLive 1권](https://booklive.jp/review/list/title_id/855753/vol_no/001)은 보조 source family다.

| Axis              | Proposed | Decision | Final | 값 앵커와 직접 근거 대응                                                                                                    |
| ----------------- | -------- | -------- | ----- | --------------------------------------------------------------------------------------------------------------------------- |
| `progression`     | `0`      | `ACCEPT` | `0`   | 공식 1~3권의 목표 시도·실패와 독립 비평의 회차 리셋 구조가 성장·획득 누적 보상이 거의 없음을 직접 지지한다.                 |
| `strategy`        | `0`      | `ACCEPT` | `0`   | 요리·감량·생활 문제는 즉흥 소동으로 끝나며 장기 계획·전술·자원 운영이 반복되지 않는다.                                      |
| `mysteryReveal`   | `0`      | `ACCEPT` | `0`   | 공식·창작자·비평 자료가 반복 보상을 패러디와 인물 반응으로 고정해 단서·추리·진실 공개의 실질적 부재를 확인한다.             |
| `darkness`        | `0`      | `ACCEPT` | `0`   | 타인을 해치지 않는 웃음이라는 제작 원칙과 1–2권 비평·1권 리뷰의 가벼운 구조가 1–3권 공식 에피소드와 일치한다.               |
| `mentalStress`    | `0`      | `ACCEPT` | `0`   | 갈등이 독립 회차 웃음으로 즉시 전환되고 부담 없는 진입 경험이라는 관찰이 반복돼 지속 불안·압박이 거의 없음을 적극 확인한다. |
| `emotionalWarmth` | `3`      | `ACCEPT` | `3`   | 공식의 마음 따뜻한 주인공, 비공격적 웃음, 친구들의 선의와 가벼운 감동이 반복된다. comedy도 핵심이므로 `4`보다 `3`이다.      |

- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음.

### 39. work-c221a17d6b962b17c9f4 — 屍鬼

#### Source와 범위

- 集英社 공식 디지털판 [1권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874549874549315501), [2권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874550874549315501), [3권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874585874549315501)은 원판과 같은 권차·종이 발매일을 보여 준다. 이 Pass는 선행 identity·대표 ISBN adjudication을 재개하지 않는다.
- BookLive의 정확한 [1권](https://booklive.jp/review/list/title_id/172303/vol_no/001)과 [3권](https://booklive.jp/review/list/title_id/172303/vol_no/003) 복수 계정은 하나의 source family다. [コミックシーモア 전체작 리뷰](https://www.cmoa.jp/title/customer_review/title_id/46832/)는 진입 범위가 아니어서 값 근거로 쓰지 않고 충돌 점검에만 사용했다.

| Axis     | Proposed | Decision  | Final | 값 앵커와 직접 근거 대응                                                                                                                                                                                                                      |
| -------- | -------- | --------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `comedy` | `0`      | `UNKNOWN` | `U`   | 공식 1~3권 소개와 정확한 1권·3권 리뷰는 사망·공포·조사를 강조하지만 comedy를 언급하지 않았다는 침묵이다. 내부 페이지 전 범위나 적극적 부재 관찰이 없고, 범위 밖 전체작 리뷰에는 comic한 템포 관찰도 있어 known `0`의 높은 문턱을 넘지 못한다. |

- conflictAssessment: 전체작 리뷰는 범위 밖이므로 comedy 존재를 확정하지도 않는다. 자동 다수결 대신 현재 후보를 `unknown`으로 닫는다.
- expectedTextGate: Narrative `4/6`, Tone `4/7`; `fail T+1`.
- blockerCheck: 새 hard blocker 없음. Tone coverage 재판정은 Pass C의 몫이다.

### 40. work-c55467873ec70e670484 — 大ダーク

#### Source와 범위

- 小学館 [1권](https://shogakukan-comic.jp/book?isbn=9784091294869), [2권](https://shogakukan-comic.jp/book?isbn=9784098502158), [3권](https://shogakukan-comic.jp/book?isbn=9784098504961)은 표준판 전 범위의 습격·잠입·합류·구출을 고정한다.
- [林田球 작가 인터뷰](https://natalie.mu/comic/pp/daidark)는 1–2권과 초기 구상을 직접 다룬다. [東京マンガレビュアーズ](https://note.com/tmreviewers/n/n50b2beb03fae), [AQM](https://aqm.hatenablog.jp/entry/2020/08/13/033100), [こたっつ](https://ktats.blog.fc2.com/blog-entry-869.html)는 각각 1–2권, 2권, 3권을 다룬 서로 다른 작성자·플랫폼이다. BookLive [1권](https://booklive.jp/review/list/title_id/672506/vol_no/001)과 [3권](https://booklive.jp/product/index/title_id/672506/vol_no/003)은 하나의 추가 family다.

| Axis              | Proposed | Decision | Final | 값 앵커와 직접 근거 대응                                                                                            |
| ----------------- | -------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------- |
| `problemSolving`  | `1`      | `ACCEPT` | `1`   | 직접 격퇴가 우세하고 잠입·구출의 전술 행동이 일부 섞인다. 직접 행동 `0`과 분석·행동 혼합 `2` 사이의 `1`이다.        |
| `strategy`        | `1`      | `ACCEPT` | `1`   | 즉흥 여행이 우세하며 짧은 계획만 존재한다. 장기 운영 중심 `2`에 못 미치는 `1`이다.                                  |
| `mysteryReveal`   | `1`      | `ACCEPT` | `1`   | 2권의 수수께끼 대상이 3권에서 일부 밝혀지지만 reveal이 핵심 보상은 아니어서 부재 `0`과 일부 비밀 `2` 사이에 놓인다. |
| `comedy`          | `4`      | `ACCEPT` | `4`   | 작가가 가볍게 읽는 comedy로 직접 설계했다고 밝히고, 세 독립 범위 리뷰와 권 고정 리뷰가 지속 웃음을 교차 확인한다.   |
| `mentalStress`    | `1`      | `ACCEPT` | `1`   | 위험은 있으나 작가의 비장감 배제와 여러 범위 리뷰의 낙관·느슨한 대응이 혼합 압박 `2`보다 낮은 진입 경험을 지지한다. |
| `romance`         | `0`      | `ACCEPT` | `0`   | 작가가 초기 name에 romance가 전혀 없다고 직접 밝히고 공식 1~3권 전개가 같은 반복적 부재와 일치한다.                 |
| `emotionalWarmth` | `2`      | `ACCEPT` | `2`   | 첫 친구·보호자·동료 합류와 3권 구출·우정이 공식 자료와 독립 범위 리뷰에서 반복되며 폭력적 모험과 혼합되어 `2`다.    |

- expectedTextGate: Narrative `5/6`, Tone `6/7`; `pass`.
- blockerCheck: 새 hard blocker 없음.

## 예상 text gate

Narrative 순서는 `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`, Tone 순서는 `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`다. `U`는 명시적 `unknown`이다.

| Pos | workId                      | canonicalTitle               | 검수 반영 Narrative           | 검수 반영 Tone                    | Gate     |
| --: | --------------------------- | ---------------------------- | ----------------------------- | --------------------------------- | -------- |
|  31 | `work-84b7c7d7720447075c25` | 軍靴のバルツァー             | `2 / U / 3 / 2 / U / 3` = 4/6 | `2 / 2 / U / 2 / U / U / 2` = 4/7 | fail T+1 |
|  32 | `work-9072892a767332254f00` | flat                         | `U / 0 / 0 / 1 / 0 / U` = 4/6 | `3 / 2 / 2 / U / 1 / U / 4` = 5/7 | pass     |
|  33 | `work-98b7d2ef065bde405972` | スーパーの裏でヤニ吸うふたり | `U / 0 / 0 / 1 / U / 0` = 4/6 | `3 / 2 / 2 / U / 1 / U / 3` = 5/7 | pass     |
|  34 | `work-a59481c00155de21d75f` | ケロロ軍曹                   | `U / U / 1 / 2 / 0 / 2` = 4/6 | `U / 2 / 3 / 0 / 0 / U / U` = 4/7 | fail T+1 |
|  35 | `work-a8349445836546a82934` | 百姓貴族                     | `0 / U / U / 2 / 0 / 2` = 4/6 | `U / 2 / 4 / 2 / 2 / U / 2` = 5/7 | pass     |
|  36 | `work-ab95f4d4997113e0687a` | 月刊少女野崎くん             | `0 / U / U / 2 / 0 / 2` = 4/6 | `3 / 3 / 4 / U / U / 2 / 2` = 5/7 | pass     |
|  37 | `work-ad32c71b07fd13c65a79` | 私の推しは悪役令嬢。         | `2 / 2 / U / 2 / U / 2` = 4/6 | `4 / 2 / 3 / U / U / 4 / 2` = 5/7 | pass     |
|  38 | `work-bbeeaad9e37ab267dc29` | 僕とロボコ                   | `0 / U / 0 / U / 0 / 2` = 4/6 | `U / 2 / 2 / 0 / 0 / U / 3` = 5/7 | pass     |
|  39 | `work-c221a17d6b962b17c9f4` | 屍鬼                         | `U / 2 / U / 2 / 3 / 2` = 4/6 | `2 / 2 / U / 4 / 2 / U / U` = 4/7 | fail T+1 |
|  40 | `work-c55467873ec70e670484` | 大ダーク                     | `U / 1 / 1 / 2 / 1 / 2` = 5/6 | `U / 2 / 4 / 2 / 1 / 0 / 2` = 6/7 | pass     |

## 결과 요약

- reviewedWorks: 10
- candidateKnownWorks: 10
- candidateAxesReviewed: 50
- candidateDecisionAccept: 46
- candidateDecisionRevise: 0
- candidateDecisionReject: 0
- candidateDecisionUnknown: 4
- themeCandidatesReviewed: 1
- themeDecisionAccept: 1
- supplementalGenreCandidatesReviewed: 0
- expectedTextGatePass: 7
- expectedTextGateFail: 3
- expectedHardBlockers: 0
- actualIdentitySafetyIsbnContradictions: 0
- canonicalTitleDelimiterCount: 0
- reviewedByHuman: false

네 `UNKNOWN`은 軍靴のバルツァー `mentalStress`, flat `progression`, ケロロ軍曹 `emotionalWarmth`, 屍鬼 `comedy`다. 모두 사실값을 낮게 확정한 것이 아니라 직접 대응 근거가 부족해 숫자 상태를 닫은 결과다. 특히 屍鬼의 공식 소개와 1권·3권 리뷰는 comedy의 부재를 적극적으로 관찰하지 않으므로 horror 사건 중심성이나 리뷰의 침묵만으로 `0`을 만들지 않았다.
