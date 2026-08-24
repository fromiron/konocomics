# Batch 002 text coverage gap Pass B — chunk 02, round 02

- batchId: `batch-002`
- sourceChunk: `chunk-02`
- reviewKind: `independent-pass-b-round-02`
- reviewer: `Local Codex subagent`
- reviewedAt: `2026-08-23`
- reviewedByHuman: `false`
- evaluatedRange: 작품별 진입 1~3권 또는 첫 주요 에피소드; 外天楼은 완결 1권 전체
- scope: frozen positions 11, 12, 15, 16, 17, 18, 19, 20
- explicitExclusion: position 14 orange; 선행 Art blocker가 있으며 이번 text Pass B 범위 밖이다.
- decisionBoundary: source data, final CSV, registry, Art, Gold, identity, safety, eligibility, promotion 상태를 수정하지 않고 보강 후보와 예상 coverage gate만 판정한다.

## 동결 입력과 독립성

| Input                                               | SHA-256                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `AGENTS.md`                                         | `64abddef3e280a3293bef81f8ef964ce7cb8513a75aea8030f500daf7475ef72` |
| `docs/factors/factor-dictionary.md`                 | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/catalog-expansion/01-promotion-method.md`     | `6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd` |
| `annotation-review-adjudication-request.md`         | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `frozen-work-set.csv`                               | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `research/text-gap-chunk-02-round-02.md`            | `5e3ab431af2f51907f9f50739f77f6644a0548d53b7749588fe3a3ee3e85698f` |
| `research/text-gap-chunk-02.md`                     | `096619821632f85be1325425ca4ee025eec27fcf0ef7de1691ddd42018f8d844` |
| `reviews/text-gap-chunk-02-independent-review.md`   | `7b0787a72c048b288aa03c133bbc9ba5a2b699f39d95b8a3ede334767a862348` |
| `adjudication/text-chunk-02-round-01.md`            | `fda86dd1ec1c8868faf8f1678b9d95e9fcb5f547f5df741b48e4f406e3949726` |
| `adjudication/text-chunk-02-round-02.md`            | `364031098b49f6e8d7ff8e803a026f65e37b000ab0160cf042d7a5ef1a45c3e9` |
| `adjudication/text-gap-queue-chunk-02-round-02.csv` | `fa4f83e929dd6192c41df75d2f5fdd2a28dc414990216ab71b22732da659b1b8` |
| `adjudication/text-final-chunk-02.csv`              | `cf97a9df50b9d72a26502e8dcfd07a69897489299e9311df28b757d6399b9b11` |
| `adjudication/genres-final-chunk-02.csv`            | `ec67b6066b0f820e59d30e404707a14cea4c9c1cc8af4bd6073b6e04e1aa5eea` |
| `adjudication/themes-final-chunk-02.csv`            | `47ea2fcc3252d8c37b85f25ba6836b5811b3acc5456fc4563cfed3cbc7b8cbd2` |

보강 문서의 결론과 gate 결과를 가린 상태에서 각 제안을 먼저 공식 권 범위, 판본 연결, Dictionary의 0/2/4 앵커에 대조했다. 그 뒤 기존 final과 이전 adjudication은 충돌 점검에만 사용했다. 보강 문서의 고유 URL 48개를 검수일에 다시 요청해 `48/48 HTTP 200`을 확인했지만, 접근 가능성 자체는 내용 충분성으로 세지 않았다.

## 공통 검수 규칙

- `ACCEPT`는 proposed known 상태와 값을 유지한다. `REVISE`는 known 상태를 유지하되 값을 바꾼다. 숫자를 책임 있게 닫지 못하면 `UNKNOWN`이다.
- 공식 출판사 권 소개와 판본 bridge가 범위를 먼저 고정한다. 리뷰는 exact-volume 또는 명시적인 entry-range 관찰만 보조로 사용하며, 같은 플랫폼의 여러 계정은 하나의 source family로 센다.
- Genre, Theme, 선정 목록, 별점, 인기, 위험의 존재, 인물 수만으로 Axis를 만들지 않는다. known `0`은 침묵이 아니라 반복 대응 방식이나 적극적 부재가 0 앵커에 직접 맞을 때만 허용한다.
- 공식 자료와 리뷰가 충돌하면 평균하거나 다수결하지 않는다. 값과 range를 직접 지지하는 근거가 없으면 `unknown`으로 닫는다.
- 리뷰 원문은 UI 문구로 복사하지 않고 공통 관찰만 저작권을 침해하지 않는 형태로 요약한다.
- 이번 Pass B는 Art를 판정하지 않는다. 새 identity, safety, ISBN 모순은 발견하지 않았다.

Narrative 순서는 `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`, Tone 순서는 `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`다. `U`는 낮은 값이 아니라 명시적 `unknown`이다.

## 작품별 독립 판정

### 11. work-29d4300ad9d3358fb67a — 外天楼

#### Source 권위·직접성·범위

- 講談社 [완결 1권](https://www.kodansha.co.jp/comic/products/0000223170) `(2011-10-21; 조회 2026-08-23)`은 234쪽·9개 수록 단위와 코믹한 시작이 건물의 진실로 수렴하는 전체 범위를 고정한다.
- [Sony Reader Store 완결권 리뷰](https://ebookstore.sony.jp/review/title/00180806/id/BT000018080600100101/) `(2012-01-10~2012-06-17)`, [AL 완결권 편집 기사](https://alu.jp/series/%E5%A4%96%E5%A4%A9%E6%A5%BC/article/IcdhbWxCbOd9v9urKjjs) `(2020-08-12)`, [독립 Hatena 완결권 기록](https://pandatocircus.hatenablog.com/entry/2020/06/15/124329) `(2020-06-15)` `(모두 조회 2026-08-23)`은 서로 다른 세 family다. 이들은 가벼운 전반, 연결 구조, 윤리적 무게와 무거운 결말을 반복하지만 특정 인물의 지속 변화를 별도 축으로 추적하지 않는다.

| Axis                 | Proposed | Decision  | Final | 판정                                                             |
| -------------------- | -------- | --------- | ----- | ---------------------------------------------------------------- |
| `characterArcWeight` | `U`      | `UNKNOWN` | `U`   | 기원·동기 공개는 반복 변화가 중심 보상이라는 직접 근거가 아니다. |
| `mentalStress`       | `U`      | `UNKNOWN` | `U`   | 독자 충격과 무거운 결말은 인물의 지속 불안·압박과 다르다.        |
| `romance`            | `U`      | `UNKNOWN` | `U`   | 지속 연애 또는 적극적 부재를 입증하지 못한다.                    |
| `emotionalWarmth`    | `U`      | `UNKNOWN` | `U`   | 여운은 반복 유대·회복·위안의 직접 근거가 아니다.                 |

- Final supported axes: Narrative `U / 2 / U / 3 / 4 / 2`; Tone `U / 2 / 2 / 2 / U / U / U`.
- Final supported Genre/Theme: Genre `mystery`; Theme `investigation:2` 유지. 새 Genre·Theme 후보는 없다.
- expectedTextGate: Narrative `4/6`; Tone `3/7`; **fail T+2**.
- deficiency: 유한한 완결권 공식 경로와 독립 해설 세 family를 확인했지만 서로 다른 Tone 축 2개가 부족하다.
- finiteRecheckPath: 권리자·작가 편집 자료 또는 지속 가능한 페이지·장면 참조가 있는 합법적 완결권 내부 자료가 반복되는 주관적 압박, 인물 변화, 연애, 회복 유대를 직접 추적할 때만 재개한다. 결말의 무거움을 여러 Tone 축으로 재사용하지 않는다.

### 12. work-3dfaf6231e21133620c6 — 忍者と極道

#### Source 권위·직접성·범위

- 講談社 공식 [1권](https://www.kodansha.co.jp/comic/products/0000339844), [2권](https://www.kodansha.co.jp/comic/products/0000342928), [3권](https://www.kodansha.co.jp/comic/products/0000344749) `(2020-04-08, 2020-07-08, 2020-10-14; 조회 2026-08-23)`은 신념·복수·육체 능력·대규모 충돌이 결말을 내는 진입 범위를 고정한다.
- 講談社 [작가·편집 대담](https://creatorslab.kodansha.co.jp/topics/1879/) `(2023-10-23; 조회 2026-08-23)`은 강자 대 강자, 장별 보스, 육체적 최후라는 반복 틀을 확인한다. 후반 제작 방식은 entry 값으로 투영하지 않고, 1~3권 공식 서술과 겹치는 직접 충돌 틀만 보조한다.
- [독립 2권 기록](https://dokusyozanmai.blog.jp/archives/89598516.html) `(2025-04-23; 조회 2026-08-23)`은 화상·부상·의지·신체 강화가 주요 대결을 끝내고 약물 정체 공개가 그 물리적 결말을 대신하지 않는다고 구체적으로 기록한다. 단일 리뷰라 공식 반복 구조의 보조로만 사용한다.

| Axis             | Proposed | Decision | Final | Dictionary 대응                                                                                                                       |
| ---------------- | -------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving` | `0`      | `ACCEPT` | `0`   | 진입 3권의 주요 충돌이 분석보다 직접 힘, 육체적 버팀, 강화 능력과 감정적 결단으로 반복 종결된다. action Genre에서 추론한 값이 아니다. |

- Final confidence: `problemSolving=0.78` 유지.
- Closed alternatives: `progression`, `strategy`는 `UNKNOWN` 유지. 강화 약물은 숙련 보상 루프가 아니며 작가의 장 구성 계획은 작품 속 전략이 아니다.
- Final supported axes: Narrative `U / 0 / U / 3 / 2 / 3`; Tone `3 / 2 / U / 4 / 3 / U / 1`.
- Final supported Genre/Theme: Genre `action`; Themes `combat:2;revenge:1` 유지.
- expectedTextGate: Narrative `4/6`; Tone `5/7`; **pass**.
- finiteRecheckPath: 없음. 새 값은 권별 공식 반복 구조와 일치한다.

### 15. work-4c784fc78dfd9b139c3f — 正反対な君と僕

#### Source 권위·직접성·범위

- 集英社 공식 [1권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000022198000), [2권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024401900), [3권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883395-8) `(2022-07-04, 2022-10-04, 2023-03-03; 조회 2026-08-23)`은 1~22화가 일상 대화, 직접 감정 표현, 학교 행사와 관계 선택으로 이어지는 범위를 고정한다.
- 集英社オンライン [작가 인터뷰](https://shueisha.online/articles/-/135510) `(2023-06-04)`와 好書好日 [작가 인터뷰](https://book.asahi.com/article/15653552) `(2025-03-13)` `(조회 2026-08-23)`은 대화 중심 인물 묘사, 밝은 학생 일상, 자기 성찰과 감정 표현을 서로 다른 editorial family에서 확인한다. 완결 후 인터뷰는 공식 1~3권과 일치하는 진입 구조만 사용한다.
- マンガ大賞 [2023](https://www.mangataisho.com/data/2023/comment2023.pdf), [2024](https://www.mangataisho.com/data/2024/comment2024.pdf) `(각 연도; 조회 2026-08-23)`는 한 award-panel family다. 선정 사실은 제외하고, 사건 중심이 아닌 일상 대화와 충격적 사건이 거의 없는 보통의 고교 생활이라는 entry-era 관찰만 사용한다.

| Axis             | Proposed | Decision | Final | Dictionary 대응                                                                                                          |
| ---------------- | -------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------ |
| `problemSolving` | `0`      | `ACCEPT` | `0`   | 진입 갈등의 반복 대응이 분석·기발한 해법보다 대화, 용기, 자기 성찰과 감정적 결단이다. romance Genre에서 추론하지 않았다. |
| `strategy`       | `0`      | `ACCEPT` | `0`   | 누적 계획·자원 운영이 아니라 작은 일상 고민에 대한 즉시적 관계 대응이 반복된다.                                          |
| `mysteryReveal`  | `0`      | `ACCEPT` | `0`   | entry-era 자료가 충격 사건이나 비밀 공개보다 보통의 일상 대화 자체가 보상임을 적극적으로 확인한다.                       |
| `worldBuilding`  | `0`      | `ACCEPT` | `0`   | 보통의 고교 환경은 관계를 위한 최소 무대이며 별도 규칙·세력·문화가 반복해 결과를 제약하지 않는다.                        |

- Final confidence: `problemSolving=0.84`, `strategy=0.80`, `mysteryReveal=0.78`, `worldBuilding=0.80` 유지.
- Closed alternative: `progression`은 `UNKNOWN` 유지. 자기 이해와 관계 변화는 이미 `characterArcWeight=4`로 표현되며 획득·숙련 보상으로 중복하지 않는다.
- Final supported axes: Narrative `U / 0 / 0 / 2 / 0 / 0`; Tone `4 / 2 / U / U / 1 / 4 / 4`.
- Final supported Genre/Theme: Genres `comedy;sliceOfLife;romance`; Theme `school:2` 유지. Genre `comedy`는 공식 권 소개의 분류이며 numeric `comedy` Axis를 만들지 않는다.
- expectedTextGate: Narrative `5/6`; Tone `5/7`; **pass**.
- finiteRecheckPath: 없음. 네 0값은 모두 Genre 침묵이 아닌 공식 범위와 entry-era 구조 관찰에 연결된다.

### 16. work-518d7ed42dd9253679c3 — 墨攻

#### Source 권위·직접성·범위

- 小学館 공식 [1권](https://e-comi.shogakukan.co.jp/books/091830410000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091830420000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091830430000d0000000) `(페이지 무기재; 조회 2026-08-23)`은 성벽 수리, 무기·훈련, 잠입·굴 공격 대응, 학살·죽음·퇴각과 추방까지 정확한 entry 범위를 고정한다.
- BookLive exact [1권](https://booklive.jp/review/list/title_id/262257/vol_no/001), [2권](https://booklive.jp/product/index/title_id/262257/vol_no/002), [3권](https://booklive.jp/product/index/title_id/262257/vol_no/003) `(전자판 2014; 조회 2026-08-23)`은 한 authorized-retailer family다. 2권의 내적 갈등 하나는 전체 1~3권의 지속 `mentalStress`를 만들지 않는다.
- [manga-to-film exact-range 비교](https://takkun.hateblo.jp/entry/20070203/p4) `(2007-02-03)`는 영화 대응 범위를 만화 1~3권으로 명시하고 연애 소재가 이후 만화 오리지널 전개에 나온다고 구분한다. [독립 영화·원작 비교](https://www2s.biglobe.ne.jp/tetuya/EIGA/rekisi/bokko.html) `(2011-10-02)`는 영화의 히로인과 연애가 원작에 없는 추가 축임을 별도로 기록한다 `(모두 조회 2026-08-23)`. 두 자료는 적응판의 감정을 manga 값으로 쓰지 않고 entry manga의 적극적 부재만 교차 확인한다.

| Axis              | Proposed | Decision  | Final | 판정                                                                                                       |
| ----------------- | -------- | --------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| `romance`         | `0`      | `ACCEPT`  | `0`   | 두 독립 비교가 만화 1~3권에는 연애가 거의 없고 영화 또는 이후 만화 전개에 추가됐음을 범위 특정해 확인한다. |
| `mentalStress`    | `U`      | `UNKNOWN` | `U`   | 한 권의 내적 갈등과 공성 위험은 지속적인 주관적 압박을 입증하지 않는다.                                    |
| `comedy`          | `U`      | `UNKNOWN` | `U`   | 반복 개그 또는 그 적극적 부재를 exact range에서 입증하지 못한다.                                           |
| `emotionalWarmth` | `U`      | `UNKNOWN` | `U`   | 집단 방어와 사상적 관심만으로 반복 위안·유대 보상을 확정할 수 없다.                                        |

- Final confidence: `romance=0.70` 유지.
- Final supported axes: Narrative `U / 4 / 4 / 3 / 1 / 3`; Tone `2 / 3 / U / 3 / U / 0 / U`.
- Final supported Genre/Theme: Genres `action;historical`; Themes `combat:2;war:2;territoryManagement:2` 유지.
- expectedTextGate: Narrative `5/6`; Tone `4/7`; **fail T+1**.
- deficiency: 공식 1~3권, exact retailer 자료, 독립 적응판 비교 2개 뒤에도 별개의 다섯 번째 Tone 축이 없다.
- finiteRecheckPath: exact manga 1~3권 비평, 작가·편집 자료, 또는 지속 가능한 참조가 있는 합법적 내부 자료가 반복되는 주관적 압박, 개그 완화, 회복 유대를 직접 기록할 때만 재개한다. 영화 추가 감정은 사용할 수 없다.

### 17. work-53e54c95f637b66c4fb2 — がんばれ元気

#### Source 권위·직접성·범위

- 小学館 공식 [1권](https://e-comi.shogakukan.co.jp/books/091202110000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091202120000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091202130000d0000000) `(페이지 무기재; 조회 2026-08-23)`은 아버지의 복싱, 육체적 버팀과 결정타, 죽음 뒤 계승 목표, 반대 속 비밀 훈련과 체육관 진입을 고정한다.
- [BookLive exact 3권](https://booklive.jp/product/index/title_id/183057/vol_no/003) `(2012-10-05 전자판)`, [コミックシーモア series review family](https://www.cmoa.jp/title/528/) `(2008~2025)`, 小学館 공식 내부 reader 1~3권 `(모두 조회 2026-08-23)`은 초반의 노력·신체 지속·정서적 계승을 보조한다. whole-series 리뷰의 후반 관찰과 보존하지 않은 pixel 인상은 제외했다.

| Axis             | Proposed | Decision | Final | Dictionary 대응                                                                                                                          |
| ---------------- | -------- | -------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving` | `0`      | `ACCEPT` | `0`   | 진입 3권의 장애 대응이 분석보다 직접 싸움, 육체적 지속, 반복 연습과 감정적 결단으로 제시된다. sports Genre가 아닌 권별 실제 대응 근거다. |

- Final confidence: `problemSolving=0.76` 유지.
- Closed alternatives: `strategy`, `mysteryReveal`은 `UNKNOWN` 유지. 챔피언 목표와 장기 연습은 Dictionary의 전쟁·정치·자원 운영 전략이 아니며, reveal 구조의 적극적 부재도 입증하지 못했다.
- Final supported axes: Narrative `2 / 0 / U / 3 / U / 2`; Tone `4 / 2 / U / 2 / 2 / U / 3`.
- Final supported Genre/Theme: Genre `sports`; Themes `martialArts:2;sportsCompetition:2` 유지.
- expectedTextGate: Narrative `4/6`; Tone `5/7`; **pass**.
- finiteRecheckPath: 없음.

### 18. work-5915d6d7601377fcc75f — 赤髪の白雪姫

#### Source 권위·직접성·범위

- 白泉社 공식 [1권](https://www.hakusensha.co.jp/comicslist/44169/), [2권](https://www.hakusensha.co.jp/comicslist/44171/), [3권](https://www.hakusensha.co.jp/comicslist/44173/) `(2007-12-05, 2008-08-05, 2009-03-05; 조회 2026-08-23)`은 궁정 약제사 진입, 2권 요새 집단 질환과 이후 직업 맥락을 고정한다.
- [BookLive exact 2권](https://booklive.jp/review/list/title_id/319367/vol_no/002), [Ameba chapter account](https://ameblo.jp/yui-yui-13/entry-12055775420.html) `(2015-07-29)`, [楽天ブックス exact 2권](https://review.rakuten.co.jp/item/1/213310_12993545/1.1/) `(2008~2010)` `(모두 조회 2026-08-23)`은 서로 다른 세 review family다. 공식 질환 전제와 함께 공통 증상 관찰, 약 부족, 치료 반응, 장작이라는 공통 원인 특정과 치료를 보조한다.

| Axis             | Proposed | Decision | Final | Dictionary 대응                                                                                                                                                                                  |
| ---------------- | -------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `problemSolving` | `3`      | `REVISE` | `2`   | 2권 주요 사건에는 관찰·원인 추론·치료가 분명하지만, 1~3권에서 같은 분석 해결이 반복된다는 두 번째 사례는 없다. 직접 행동·직업 성장·관계 전개와 혼합된 entry 경험이므로 `2`가 책임 있는 상한이다. |

- Final confidence: `problemSolving=0.80`. 원래 `0.84`에서 값과 함께 낮춘다.
- Closed alternatives: `strategy`, `mysteryReveal`은 `UNKNOWN` 유지. 궁정 직업과 단일 질환 원인 공개만으로 장기 계획 또는 반복 reveal 보상을 만들지 않는다.
- Final supported axes: Narrative `2 / 2 / U / 3 / U / 2`; Tone `4 / 3 / U / 2 / 2 / 3 / 3`.
- Final supported Genre/Theme: Genres `fantasy;romance`; Themes `politics:1;workplace:1` 유지.
- expectedTextGate: Narrative `4/6`; Tone `6/7`; **pass**.
- finiteRecheckPath: 없음. `problemSolving`은 known이지만 한 사례 한계를 값 `2`와 검수 메모에 보존한다.

### 19. work-5b4dc4e6e966436b2990 — 人形芝居

#### Source 권위·직접성·범위

- 白泉社 공식 [1권](https://www.hakusensha.co.jp/comicslist/41133/), [2권](https://www.hakusensha.co.jp/comicslist/41065/), [3권](https://www.hakusensha.co.jp/comicslist/43939/) `(1998-10-19, 1999-07-19, 2008-09-19; 조회 2026-08-23)`은 외로운 사람의 마음을 채우는 인형, 마음을 감싸는 반복, 능력을 잃은 치유자와 세 편의 인간 드라마를 고정한다.
- [BookLive exact 3권 review family](https://booklive.jp/review/list/title_id/303790/vol_no/003) `(2009-10-04~2015-02-19)`와 [독립 exact 3권 비평](https://ikkamate.blog.jp/archives/26751862.html) `(2020-11-01)` `(조회 2026-08-23)`은 인간·인형의 애착, 결혼·죽음에 따른 이별, 함께할 수 없는 관계 선택, 10화의 인간·기계 연애 질문을 반복한다. 별점과 단순 감상은 제외하고 구체적인 권차 관찰만 사용한다.

| Axis             | Proposed | Decision | Final | Dictionary 대응                                                                                                                                          |
| ---------------- | -------- | -------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving` | `0`      | `ACCEPT` | `0`   | 세 공식 권의 반복 문제는 제약 분석보다 동행, 정서적 선택, 희생 또는 수용으로 답한다. human-drama 분류에서 자동 추론한 값이 아니다.                       |
| `romance`        | `2`      | `ACCEPT` | `2`   | 두 독립 exact-volume family가 3권에서 연애와 관계 이별을 구체적으로 확인하고, 1~2권은 더 넓은 가족·동행 유대이므로 entry 전체의 서브 플롯 값 `2`가 맞다. |

- Final confidence: `problemSolving=0.78`, `romance=0.84` 유지.
- Closed alternatives: `progression`, `strategy`, `comedy`, `mentalStress`는 `UNKNOWN` 유지. 에피소드별 변화는 획득·숙련이 아니며 독자 슬픔은 인물의 지속 압박이 아니다.
- Final supported axes: Narrative `U / 0 / U / 2 / 2 / 3`; Tone `3 / 3 / U / 2 / U / 2 / 3`.
- Final supported Genre/Theme: Genres `scienceFiction;sliceOfLife`; Theme 없음 유지.
- expectedTextGate: Narrative `4/6`; Tone `5/7`; **pass**.
- finiteRecheckPath: 없음. 4권 관찰은 값에서 제외했다.

### 20. work-5b9a3ec60ac5fc90f444 — 魔法使いの嫁

#### Source 권위·직접성·범위

- KADOKAWA current-edition [1권](https://store.kadokawa.co.jp/shop/g/g302401004255/), [2권](https://store.kadokawa.co.jp/shop/g/g302401004256/), [3권](https://store.kadokawa.co.jp/shop/g/g302401004784/) `(2024-04-06 현재판 발매; 조회 2026-08-23)`은 기존 Mag Garden판과 manga 내용이 같다고 명시하고, 제자 역할·교회 과제·힘과 대가를 권별로 연결한다. [BOOK WALKER current series](https://bookwalker.jp/series/458578/) `(2024-02-16 시작; 조회 2026-08-23)`은 같은 출판 생태계의 판본 보조이며 독립 Factor family로 세지 않는다.
- マンガ大賞 [2015 심사평](https://www.mangataisho.com/data/2015/comment2015.pdf) `(2015; 조회 2026-08-23)`은 선정 사실이 아니라 당시 진입권을 읽은 한 심사자의 구체적 관찰만 사용한다. 해당 관찰은 주인공이 마법사로 성장한다고 직접 기술하고, 다른 심사평은 제자 역할과 초기 마법 세계를 교차 확인한다.

| Axis          | Proposed | Decision | Final | Dictionary 대응                                                                                                                                                     |
| ------------- | -------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `progression` | `2`      | `ACCEPT` | `2`   | 공식 판본 bridge의 제자·과제 범위와 동시대 심사자의 역할 특정 성장 관찰이 서서히 획득·숙련하는 `2`를 지지한다. 반복 보상 극값 `4`나 단순 정서 회복으로 읽지 않는다. |

- Final confidence: `progression=0.80` 유지.
- Closed alternatives: `problemSolving`, `strategy`는 `UNKNOWN` 유지. 세 과제의 존재만으로 제약 분석의 반복이나 장기 계획·자원 운영을 입증할 수 없다.
- Final supported axes: Narrative `2 / U / U / 2 / 2 / 3`; Tone `4 / 2 / U / 3 / 2 / 3 / 3`.
- Final supported Genre/Theme: Genres `fantasy;romance`; Theme 없음 유지.
- expectedTextGate: Narrative `4/6`; Tone `6/7`; **pass**.
- finiteRecheckPath: 없음. 성장 관찰은 entry-era role-specific 근거로만 보존한다.

## 예상 gate와 blocker handoff

| Pos | workId                      | canonicalTitle | 검수 반영 Narrative           | 검수 반영 Tone                    | Text gate | Text blocker candidate                                    |
| --: | --------------------------- | -------------- | ----------------------------- | --------------------------------- | --------- | --------------------------------------------------------- |
|  11 | `work-29d4300ad9d3358fb67a` | 外天楼         | `U / 2 / U / 3 / 4 / 2` = 4/6 | `U / 2 / 2 / 2 / U / U / U` = 3/7 | fail T+2  | `SOURCE_INFORMATION_UNAVAILABLE` — finite route exhausted |
|  12 | `work-3dfaf6231e21133620c6` | 忍者と極道     | `U / 0 / U / 3 / 2 / 3` = 4/6 | `3 / 2 / U / 4 / 3 / U / 1` = 5/7 | pass      | none                                                      |
|  15 | `work-4c784fc78dfd9b139c3f` | 正反対な君と僕 | `U / 0 / 0 / 2 / 0 / 0` = 5/6 | `4 / 2 / U / U / 1 / 4 / 4` = 5/7 | pass      | none                                                      |
|  16 | `work-518d7ed42dd9253679c3` | 墨攻           | `U / 4 / 4 / 3 / 1 / 3` = 5/6 | `2 / 3 / U / 3 / U / 0 / U` = 4/7 | fail T+1  | `SOURCE_INFORMATION_UNAVAILABLE` — finite route exhausted |
|  17 | `work-53e54c95f637b66c4fb2` | がんばれ元気   | `2 / 0 / U / 3 / U / 2` = 4/6 | `4 / 2 / U / 2 / 2 / U / 3` = 5/7 | pass      | none                                                      |
|  18 | `work-5915d6d7601377fcc75f` | 赤髪の白雪姫   | `2 / 2 / U / 3 / U / 2` = 4/6 | `4 / 3 / U / 2 / 2 / 3 / 3` = 6/7 | pass      | none                                                      |
|  19 | `work-5b4dc4e6e966436b2990` | 人形芝居       | `U / 0 / U / 2 / 2 / 3` = 4/6 | `3 / 3 / U / 2 / U / 2 / 3` = 5/7 | pass      | none                                                      |
|  20 | `work-5b9a3ec60ac5fc90f444` | 魔法使いの嫁   | `2 / U / U / 2 / 2 / 3` = 4/6 | `4 / 2 / U / 3 / 2 / 3 / 3` = 6/7 | pass      | none                                                      |

Blocker는 이번 Pass B의 재현 가능한 후보이며 registry나 최종 `promotionBlocked`를 직접 변경하지 않는다. Pass C는 두 text coverage 실패를 다른 gate와 독립적으로 기록하고 각각의 좁은 재검토 경로를 blocker ledger에 보존해야 한다.

## 결과 요약

- reviewedWorks: 8
- candidateKnownWorks: 7
- candidateAxesReviewed: 11
- candidateDecisionAccept: 10
- candidateDecisionRevise: 1
- candidateDecisionUnknown: 0
- closedUnknownAxesConfirmed: 20
- expectedTextGatePass: 6
- expectedTextGateFail: 2
- expectedTextBlockerCandidates: 2
- actualIdentitySafetyIsbnContradictions: 0
- sourceUrlsReachable: 48/48
- sourceFamilies: 동일 플랫폼 계정은 한 family로 축약했고, official publisher와 retailer, award panel, 개인 비평을 별도 family로 기록했다.
- copyrightSafeParaphrase: pass
- canonicalTitleDelimiterCount: 0
- artJudgmentsMade: 0
- reviewedByHuman: false
