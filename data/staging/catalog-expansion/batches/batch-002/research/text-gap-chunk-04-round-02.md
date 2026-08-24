# Batch 002 text coverage gap research — chunk 04, round 02

- batchId: `batch-002`
- sourceChunk: `chunk-04`
- positions: `31`, `34`, `39`
- evaluatedRange: 표준판 1~3권 또는 첫 주요 에피소드
- accessedDate: 2026-08-23
- reviewedByHuman: false
- outputKind: finite-second-text-evidence-packet
- passBoundary: Research Pass A only
- decisionBoundary: 이 문서는 새 독립 review, adjudication, source 반영, registry 반영, Gold 변경, promotion 판정을 수행하지 않는다.
- editBoundary: Art, source, registry, Gold, Genre·Theme final, text final CSV를 수정하지 않는다.

## 동결 입력

| Input                                                                                                | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `AGENTS.md`                                                                                          | `64abddef3e280a3293bef81f8ef964ce7cb8513a75aea8030f500daf7475ef72` |
| `docs/factors/factor-dictionary.md`                                                                  | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/catalog-expansion/01-promotion-method.md`                                                      | `6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd` |
| `data/staging/catalog-expansion/batches/batch-002/annotation-review-adjudication-request.md`         | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `data/staging/catalog-expansion/batches/batch-002/adjudication/text-chunk-04-round-02.md`            | `c55a336933045e3ef23a101e3bdda419f65315230dce59b3cc2db8ab038f11c3` |
| `data/staging/catalog-expansion/batches/batch-002/adjudication/text-gap-queue-chunk-04-round-02.csv` | `76d0e6a741171e240f5b94e34198706ae6630d4ab2a51e470aacb8bfa8ec42d5` |
| `data/staging/catalog-expansion/batches/batch-002/research/text-gap-chunk-04.md`                     | `10c1d1b22d5bcf406beb08b23017b35b65e21b28ea3d4022b10fcb2539579eeb` |
| `data/staging/catalog-expansion/batches/batch-002/reviews/text-gap-review-chunk-04.md`               | `dbbcf51b532769f149e1039aed479f5d06811f4b8662cfb329d75e287e980000` |
| `data/staging/catalog-expansion/batches/batch-002/adjudication/text-final-chunk-04.csv`              | `3fb67d62ae703f717f8a7fca65c220dd2214a9115305cff87bbd682304db9689` |
| `data/staging/catalog-expansion/batches/batch-002/adjudication/genres-final-chunk-04.csv`            | `f193e19a5045d54ee1216ea4b7620d937c46353184131dd95845ea2806e9c840` |
| `data/staging/catalog-expansion/batches/batch-002/adjudication/themes-final-chunk-04.csv`            | `9f5aa2d468f1648ad8648025d7835ee897c43010da1a08c29a2d9c72ac547fca` |
| `data/staging/catalog-expansion/batches/batch-002/art-review/chunk-04/final-art.csv`                 | `ebae920c3e15c041d43ed8a1d7aaeae1578ffabf75103318ddf4309e64f61fdd` |

## 판정 계약

- 공식 출판사 1~3권 소개, 공식 내부 미리보기, 작가·담당 편집자 발언을 먼저 확인했다.
- 리뷰는 정확한 권차 또는 1~3권 범위와 구체 관찰을 확인할 수 있을 때만 보조 자료로 기록했다. 목록 등재, 별점, 순위, 인기, 독자 인구통계, Genre, 리뷰의 침묵은 Factor Evidence로 쓰지 않았다.
- `known 0`은 해당 구조의 능동적 부재 근거가 있어야 한다. 공포 Genre나 공식 소개·리뷰의 침묵으로 `comedy=0`을 만들지 않는다.
- 새 값은 text gate의 빈칸에 맞추지 않고, 확인한 반복 구조가 Factor Dictionary의 0 / 2 / 4 anchor 중 어디에 놓이는지만 판정한다.
- canonicalTitle에는 장식용 괄호를 넣지 않았다.

## 상위 Art 경계 갱신

`final-art.csv`에서 軍靴のバルツァー와 ケロロ軍曹는 네 Art 축이 모두 `unknown`이어서 known 수가 각각 0/4다. `unknown` 자체를 낮은 값이나 blocker로 취급하지 않았지만, 상위 배치가 unchanged Art coverage를 계산한 결과 두 작품 모두 최소 0.3을 충족할 수 없고 남은 적격 공식 Art route도 없다고 닫았다. 따라서 두 작품은 `SOURCE_INFORMATION_UNAVAILABLE` blocker 후보이며 text 추가조사 우선순위에서 제외한다.

이 경계 갱신 전에 확보한 text 자료는 아래에 감사 추적으로 보존한다. 다만 해당 자료로 새 Tone 값을 만들거나 text pass를 주장하지 않는다. 屍鬼만 이 Pass A에서 하나의 새 Tone 후보를 낸다.

## 결과 요약

Axis 표기 순서는 Narrative가 progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding, Tone이 characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth다. `U`는 `unknown`이다.

| Pos | workId                    | canonicalTitle   | 현재 N/T | 이번 Pass A 결과                 | 후보 적용 시 N/T | 예상 text gate | blocker 후보                     |
| --: | ------------------------- | ---------------- | -------- | -------------------------------- | ---------------- | -------------- | -------------------------------- |
|  31 | work-84b7c7d7720447075c25 | 軍靴のバルツァー | 4/6, 4/7 | 조사 중단, 새 Tone 값 없음       | 4/6, 4/7         | fail T+1       | `SOURCE_INFORMATION_UNAVAILABLE` |
|  34 | work-a59481c00155de21d75f | ケロロ軍曹       | 4/6, 4/7 | 조사 중단, 새 Tone 값 없음       | 4/6, 4/7         | fail T+1       | `SOURCE_INFORMATION_UNAVAILABLE` |
|  39 | work-c221a17d6b962b17c9f4 | 屍鬼             | 4/6, 4/7 | candidate-known `romance=2` 하나 | 4/6, 5/7         | pass 후보      | false                            |

- candidate-known works: 1
- candidate-known axes: 1
- stopped-on-Art-blocker works: 2
- expected text-gate-pass candidates: 1
- candidate-value conflict flags: 0
- retained closed-unknown conflict flags: 1, 屍鬼 `comedy`
- hard blocker candidates: 2

## 31. work-84b7c7d7720447075c25 — 軍靴のバルツァー

### Status

- researchStatus: stopped-on-upstream-Art-blocker
- textDecision: 새 Tone 값을 제안하지 않는다.
- retainedTone: `2 / 2 / U / 2 / U / U / 2 = 4/7`
- textPriority: excluded
- blockerCandidate: `SOURCE_INFORMATION_UNAVAILABLE`

### 확보된 미사용 증거

#### Source A — 新潮社 표준판 1~3권 공식 소개

- sourceName: 新潮社 軍靴のバルツァー 1권·2권·3권
- sourceUrl1: https://www.shinchosha.co.jp/book/771626/
- sourceUrl2: https://www.shinchosha.co.jp/book/771642/
- sourceUrl3: https://www.shinchosha.co.jp/book/771671/
- publicationDate: 2011-07-08; 2011-12-09; 2012-07-09
- accessedDate: 2026-08-23
- authorityAndIndependence: 출판사 1차 자료다.
- evaluatedRange: 표준판 1~3권
- directObservation: 군제·훈련 개혁, 실전 투입, 왕족 파벌 싸움과 제2왕자의 책사 역할이 이어지는 주 전개를 확인했다.
- limitation: 이 공식 소개만으로 반복 comedy, romance 또는 그 부재를 정하지 않았다.

#### Source B — 講談社 3권 공식 내부 미리보기

- sourceName: 講談社 軍靴のバルツァー 3권 trial
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000365957/trial
- publicationDate: 현 전자판 2022-08-09; 원 표준판 3권 2012-07-09
- accessedDate: 2026-08-23
- authorityAndIndependence: 현재 출판사의 공식 내부 미리보기이며 작품·권차는 Source A와 같은 3권이다.
- evaluatedRange: 표지·앞부분·등장인물·목차와 제11화 도입부까지 표시된 trial 범위
- directObservation: 제11화 도입은 기마 추격과 충돌을 진지하게 전개한다.
- limitation: 이 짧은 도입은 comedy의 능동적 부재가 아니며, 낮은 값도 만들지 않는다. URL은 Playwright에서 정상 렌더됐지만 독립 `curl -L` 검증은 viewer token redirect loop에 도달했다.

#### Source C — 작가·담당 편집자 인터뷰

- sourceName: このマンガがすごい！WEB 中島三千恒 인터뷰 전편 3·4쪽 보존본
- sourceUrl1: https://web.archive.org/web/20150412062825id_/http://konomanga.jp/interview/16932-2/3
- sourceUrl2: https://web.archive.org/web/20150802235408id_/http://konomanga.jp/interview/16932-2/4
- originalSourceUrl1: https://konomanga.jp/interview/16932-2/3
- originalSourceUrl2: https://konomanga.jp/interview/16932-2/4
- publicationDate: 2014-12-09
- accessedDate: 2026-08-23
- authorityAndIndependence: 작가와 담당 편집자의 직접 발언을 담은 편집 매체 인터뷰다. 원 URL은 현재 일반 landing으로 이동하므로 내용이 남은 보존 URL을 사용했다.
- evaluatedRange: 초기 구상과 3권 설정을 직접 언급하는 대목
- directObservation: 작가는 외국인 군사 교관 설정을 고른 배경에 문화 차이에서 생기는 고생담과 유쾌한 일화가 많았다고 설명한다. 이어 주인공을 매우 진지하지만 속물적이고 소심한 면도 있는 인물로 설계했고, 담당 편집자와 함께 회사원 같은 측면과 대사 반응을 설명한다.
- limitation: 제작 의도만으로 최종 1~3권의 comedy 빈도를 확정하지 않았다.

#### Source D — 정확 범위 독립 리뷰 세 건

- sourceName: INVISIBLE Dojo, ナカノ実験室, コミックシーモア
- sourceUrl1: https://m-dojo.hatenadiary.com/entry/20120925/p3
- sourceUrl2: https://nakano-laboratory.hatenablog.com/entry/2014/02/14/112548
- sourceUrl3: https://www.cmoa.jp/title/customer_review/title_id/249132/
- publicationDate: 2012-09-25; 2014-02-14; 2023-06-21
- accessedDate: 2026-08-23
- authorityAndIndependence: 서로 다른 세 작성자다. 앞의 두 사이트는 Hatena 계열이지만 작성자·도메인이 다르고, 세 번째는 별도 전자서점 계정이다.
- evaluatedRange: 명시적 1–3권; 정확히 3권; 명시적 1–3권
- directObservation: 첫 작성자는 출세욕을 드러내는 교관의 인간적 모순을 웃음으로, 두 번째는 3권 ヘルムート의 예상 밖 대사를 웃기는 지점으로, 세 번째는 1권의 적대적 제2왕자가 3권에서 누그러진 변화를 웃음으로 각각 특정한다.
- limitation: 모두 공식 자료의 보조 관찰이다. 별점, 추천 여부, 판매 정보와 단순히 흥미롭다는 평가는 사용하지 않았다.

### 중단 결론

- 위 자료는 제한된 comedy 장면 후보를 가리키지만, Art blocker가 먼저 닫힌 뒤 확보 자료를 gate 맞춤 값으로 변환하지 않았다.
- `comedy`, `mentalStress`, `romance`는 현행 `U`를 유지한다. 특히 객관적 군사 위험으로 `mentalStress`를 다시 열지 않는다.
- 新潮社 원판과 講談社 현 전자판의 출판사 차이는 동일 작가·제목·3권 내용의 이관이며 새 identity 충돌이 아니다. 대표 ISBN과 safety는 다시 판정하지 않았다.

## 34. work-a59481c00155de21d75f — ケロロ軍曹

### Status

- researchStatus: stopped-on-upstream-Art-blocker
- textDecision: 새 Tone 값을 제안하지 않는다.
- retainedTone: `U / 2 / 3 / 0 / 0 / U / U = 4/7`
- textPriority: excluded
- blockerCandidate: `SOURCE_INFORMATION_UNAVAILABLE`

### 확보된 미사용 증거

#### Source A — KADOKAWA 표준판 1~3권 공식 서지

- sourceName: KADOKAWA ケロロ軍曹 1권·2권·3권
- sourceUrl1: https://www.kadokawa.co.jp/product/200659000036/
- sourceUrl2: https://www.kadokawa.co.jp/product/200659000037/
- sourceUrl3: https://www.kadokawa.co.jp/product/200000000671/
- publicationDate: 종이 원판 1999-11-29; 2000-06-28; 2001-02-26
- accessedDate: 2026-08-23
- authorityAndIndependence: 출판사 1차 자료다.
- evaluatedRange: 표준판 1~3권
- directObservation: 각 공식 상품 페이지에서 제목·작가·권차와 BOOK☆WALKER 공식 sample 연결을 확인했다.
- limitation: 공식 소개의 comedy 문구, 동거 설정, 인구통계와 Genre는 새 Tone 축의 근거로 사용하지 않았다.

#### Source B — BOOK☆WALKER 1~3권 공식 sample

- sourceName: KADOKAWA-linked BOOK☆WALKER ケロロ軍曹 1권·2권·3권 sample
- sourceUrl1: https://bookwalker.jp/de8cbc67c9-024e-4d42-833e-a7ee6776897d/?sample=1
- sourceUrl2: https://bookwalker.jp/de2fdec566-862f-4a97-8db0-88b8268b0140/?sample=1
- sourceUrl3: https://bookwalker.jp/deac375629-d742-4ab5-ae12-9b6b4975f61f/?sample=1
- publicationDate: 대응 종이 원판 1999-11-29; 2000-06-28; 2001-02-26
- accessedDate: 2026-08-23
- authorityAndIndependence: KADOKAWA 상품 페이지가 직접 연결한 공식 viewer다. Source A와 같은 출판 계열이며 독립 리뷰로 세지 않는다.
- evaluatedRange: 각 18-page sample 전체; 1권 viewer 6/18 목차, 2권·3권 viewer 7/18 편집부 관계도 포함
- directObservation: 1권 목차에는 西澤桃華 등장과 桃華 중심 작전 회차가 있다. 2권과 3권은 少年エース編集部調べ 관계도를 반복 수록하고, 桃華에서 冬樹로 향하는 일방적 호감, ギロロ와 夏美의 love, 夏美의 623 동경, タママ와 モア의 ケロロ를 둘러싼 연정 경쟁을 명시한다.
- limitation: 관계도는 romance 존재 가능성을 직접 보여 주지만, Art blocker 경계 갱신 뒤 이 연구에서 점수로 변환하지 않았다. 같은 공식 source family이므로 독립 리뷰 수를 부풀리지 않았다.

### 중단 결론

- 이미 확보한 관계도 관찰은 보존하지만 `romance`를 새 known으로 제안하지 않는다.
- `characterArcWeight`, `romance`, `emotionalWarmth`는 현행 `U`를 유지한다. 동거와 집단 관계만으로 warmth를 다시 열지 않는다.
- 3권의 선행 민감도 고지는 별도 safety 경계로 유지한다. 이번 관계도 관찰과 identity·safety 충돌은 없으며 어느 항목도 다시 판정하지 않았다.

## 39. work-c221a17d6b962b17c9f4 — 屍鬼

### Source packet

#### Source A — 集英社 공식 디지털판 1~3권 소개

- sourceName: 集英社 屍鬼 공식 디지털판 1권·2권·3권
- sourceUrl1: https://www.s-manga.net/items/contents.html?jdcn=08874549874549315501
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874550874549315501
- sourceUrl3: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874585874549315501
- publicationDate: 종이 원판 2008-07-04; 2008-07-04; 2008-10-03, 디지털판 2012-07-06
- accessedDate: 2026-08-23
- authorityAndIndependence: 출판사 1차 자료다.
- evaluatedRange: 원판 1~3권과 같은 권차의 공식 디지털판
- directObservation: 2권 공식 소개는 사망한 清水恵가 結城夏野에게 마음을 두고 있었고, 夏野가 죽은 뒤에도 그녀의 시선을 느낀다고 명시한다. 이 관계는 연속 사망·조사라는 주 전개 안의 별도 인물 동기와 후속 위협으로 이어진다.
- limitation: 공식 소개의 공포·조사 사건이나 comedy 언급 부재로 `comedy=0`을 만들지 않았다.

#### Source B — 集英社 1권 공식 내부 미리보기

- sourceName: S-MANGA 屍鬼 1권 trial reader
- sourceUrl: https://www.s-manga.net/reader/main.php?cid=08874549874549315501
- publicationDate: 대응 종이 원판 2008-07-04; 디지털판 2012-07-06
- accessedDate: 2026-08-23
- authorityAndIndependence: Source A 상품 페이지가 연결한 같은 출판사 공식 viewer다. 독립 리뷰로 세지 않는다.
- evaluatedRange: viewer가 표시한 61쪽 전체를 확인했고, 관계 관찰은 `content-p20`–`content-p29`와 `content-p40`–`content-p48`에 한정한다.
- directObservation: 清水恵는 夏野가 자신을 알아보기를 바라며 직접 찾아가고, 거절 뒤에도 그를 중심에 둔 이상화된 공상과 집착을 반복한다. 감정은 배경 설정이 아니라 그녀가 집을 나서고 夏野에게 접근하는 행동을 일으킨다.
- limitation: 일방적 호감이지 상호 연애라고 확장하지 않는다. 같은 preview 안에 chibi 동물과 과장 반응의 고립된 comic beat가 있어 comedy의 능동적 부재도 성립하지 않지만, 빈도를 정할 수 없어 `comedy`는 `U`로 둔다.

### Axis 결론

- `romance=2`: candidate-known. 1권 공식 내부 페이지에서 반복되는 일방적 연정이 清水恵의 행동을 구동하고, 2권 공식 소개가 사망 이후에도 같은 관계를 夏野의 서사로 이어 간다. 연속 사망·조사가 중심이고 연정은 한 인물선의 반복 subplot이므로 거의 없음 0이나 중심 4가 아니라 anchor 2다.
- `comedy`: closed-unknown 유지. 공식 preview에 고립된 comic beat가 있어 `comedy=0`의 active-absence 문턱을 통과하지 못하고, 그 장면만으로 `comedy=1`의 반복 빈도도 정하지 않는다. 선행 전체작 리뷰의 comic tempo 관찰과 자동 다수결하지 않는다.
- `emotionalWarmth`: closed-unknown 유지. 일방적 연정과 집착을 warmth로 변환하지 않는다.
- retainedNarrative: `U / 2 / U / 2 / 3 / 2 = 4/6`
- retainedToneBeforeCandidate: `2 / 2 / U / 4 / 2 / U / U = 4/7`
- finalCandidateTone: `2 / 2 / U / 4 / 2 / 2 / U = 5/7`
- coverageAssessment: `romance=2`가 다음 독립 Pass B와 Pass C에서 채택될 때에만 text gate를 충족한다.
- hardBlockerAssessment: false. 이번 자료는 선행 identity·대표 ISBN resolved 상태와 safety를 다시 열지 않으며 새 모순도 만들지 않는다.

## 충돌·identity·safety 정리

| Work             | Factor conflict                                                                                     | Identity or safety contradiction                                                      | 처리                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 軍靴のバルツァー | 진지한 공식 주 전개와 제한된 웃음 관찰은 공존하지만, 중단 작품이라 값 수준을 adjudicate하지 않았다. | 출판사 이관 외 새 identity 충돌 없음; 새 safety 충돌 없음                             | 확보 자료만 보존, 새 값 없음, Art coverage blocker 후보             |
| ケロロ軍曹       | 공식 관계도는 연정선을 보이지만, 중단 작품이라 중심성 값을 adjudicate하지 않았다.                   | 선행 3권 민감도 경계 유지; 새 identity·safety 충돌 없음                               | 확보 자료만 보존, 새 값 없음, Art coverage blocker 후보             |
| 屍鬼             | 선행 `comedy=0`은 active absence가 없고 공식 preview의 고립 comic beat와도 맞지 않아 계속 `U`다.    | 선행 resolved identity·대표 ISBN과 새 모순 없음; 일방적 연정을 상호 관계로 과장 안 함 | `romance=2` 하나만 Pass A candidate-known, 나머지 Tone unknown 유지 |

## 산출물 검증

- expectedWorks: 3
- expectedStoppedWorks: 2
- expectedCandidateKnownWorks: 1
- expectedCandidateKnownAxes: 1
- expectedTextGatePassCandidates: 1
- expectedHardBlockerCandidates: 2
- sourceRecords: 8
- uniqueSourceUrls: 21
- urlLiveVerification: redirect 후 HTTP 200 = 20, 이 중 legacy 원 URL 2개는 일반 landing이라 내용이 있는 archive 2개로 대체; Playwright 정상 렌더·`curl` token redirect loop = 1; usable source record 누락 = 0
- officialInternalPreviewSetsInspected: 5, 軍靴のバルツァー 3권 1개·ケロロ軍曹 1~3권 3개·屍鬼 1권 1개
- independentExactRangeAuxiliaryReviewsUsedForValue: 0
- auxiliaryReviewUrlsPreservedButNotScored: 3
- canonicalTitleDelimiterCount: 0
- repositoryFilesCreatedOrEditedByThisPass: 1, 이 파일만 해당
- reviewedByHuman: false
- outputSha256: 자기참조를 피하기 위해 파일을 닫고 포맷한 뒤 상위 batch 원장에 전달한다.
