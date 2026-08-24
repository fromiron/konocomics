# Batch 002 text coverage gap research — chunk 05, round 02

- batchId: `batch-002`
- sourceChunk: `chunk-05`
- positions: `46`, `47`, `48`
- evaluatedRange: `タコピーの原罪` 완결 상·하권, 나머지 표준판 1~3권
- retrievedAt: `2026-08-23`
- reviewedByHuman: false
- outputKind: bounded-second-text-evidence-packet
- passBoundary: Research Pass A only
- decisionBoundary: 이 문서는 candidate-known 또는 closed-unknown만 제안한다. 독립
  Pass B, adjudication, source·registry·Gold·final CSV 반영, promotion 판정을 수행하지
  않는다.
- editBoundary: Art, identity, safety, source, registry, Gold, Genre·Theme와 기존 파일을
  변경하지 않는다.

## 동결 입력

| Input                                           | SHA-256                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`             | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/catalog-expansion/01-promotion-method.md` | `6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd` |
| `adjudication/text-chunk-05-round-01.md`        | `aec776f74dc872e4ba65478180699daf601211953c1e722f71222fd7b36ce2e3` |
| `adjudication/text-gap-queue-chunk-05.csv`      | `08bb055efd5daeec01d63e3bd85d9ffc2258e2a00311c1977b9a8696798948f0` |
| `research/text-gap-chunk-05.md`                 | `b66c895dd1da403cdccd4de95e49f8270152dc64de07ece36fde279bf5c57d2d` |
| `reviews/text-gap-review-chunk-05.md`           | `1eac003fbe871eee4e256e593e4659783d92947d5c65988d0727dd221a121627` |

배정된 선행 Pass B SHA와 실제 파일 SHA는 일치한다. 그 Pass B의 `romance=0`, 두 작품의
`problemSolving=1` 기각 사유를 그대로 제약으로 삼았고 같은 근거를 다시 후보화하지
않았다.

## 조사 계약과 route

- 공식 완결권 또는 공식 1~3권 소개를 먼저 읽고, 작가·담당 편집자 인터뷰로 범위와
  중심성을 확인한 뒤 정확한 권차의 독립 관찰만 보조로 사용했다.
- 리뷰는 구체 장면·변화·결말을 말하는 복수 작성자만 사용했다. 플랫폼 안의 여러
  계정은 한 source family로 계산했다. 별점, 인기, 순위, 독자 인구통계와 Genre는 Axis
  Evidence가 아니다.
- `known 0`은 능동적 부재 감사 없이는 만들지 않았다. 이번 후보에는 0이 없다.
- 후보값은 gate를 계산하기 전에 Dictionary의 0 / 2 / 4 anchor에 배치했다. gate는 그
  뒤 결과만 기록했다.
- 유한 route는 각 작품마다 공식 권 소개, 작가·편집 인터뷰, 정확 권차의 서로 다른
  platform family까지다. 이 route에서 반복 구조를 정하지 못한 축은 closed-unknown으로
  닫았다.
- Genre·Theme 후보는 만들지 않았다.

## 결과 요약

Axis 순서는 Narrative가 progression / problemSolving / strategy / pacing /
mysteryReveal / worldBuilding, Tone이 characterArcWeight / relationshipStructure /
comedy / darkness / mentalStress / romance / emotionalWarmth다. `U`는 `unknown`이다.

| Pos | workId                    | canonicalTitle     | 선행 N/T | round-02 candidate  | 후보 적용 N/T | 예상 text gate | blocker candidate |
| --: | ------------------------- | ------------------ | -------- | ------------------- | ------------- | -------------- | ----------------- |
|  46 | work-ef1bdac46a0956a87f7f | タコピーの原罪     | 4/6, 4/7 | `emotionalWarmth=1` | 4/6, 5/7      | pass 후보      | false             |
|  47 | work-f5847c45d30753150364 | 闇のパープル・アイ | 3/6, 5/7 | `progression=1`     | 4/6, 5/7      | pass 후보      | false             |
|  48 | work-fabc7f5d853e361acaf3 | YAIBA              | 3/6, 5/7 | `mysteryReveal=1`   | 4/6, 5/7      | pass 후보      | false             |

- candidate-known works: 3
- candidate-known axes: 3
- expected text-gate-pass candidates: 3
- retained rejected candidates: 3, `romance=0` 1건과 `problemSolving=1` 2건
- retained closed-unknown alternatives inspected: 3, 각 작품 `comedy` 또는 `strategy`
- candidate calibration conflicts: 3
- Genre·Theme candidates: 0
- identity·safety contradictions: 0
- hard blocker candidates: 0

## 46. work-ef1bdac46a0956a87f7f — タコピーの原罪

### Source packet

#### Source A — 集英社 완결 상·하권 공식 소개

- sourceName: 集英社 `タコピーの原罪` 상권·하권
- sourceUrl1:
  https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883049-0
- sourceUrl2:
  https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883104-6
- publicationDate: `2022-03-04`; `2022-04-04`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 출판사 1차 자료 두 건이며 같은 official family다.
- evaluatedRange: frozen 상·하권 전편. 하권 페이지가 완결권임을 직접 표시한다.
- directObservation: 타コピー는 시즈카의 웃음을 되찾으려 계속 개입하지만 가혹한 학교·
  가정 환경을 이해하지 못한다. 하권에서는 죽음·수사 뒤에도 시즈카와 둘이 이동하는
  관계선이 완결까지 이어진다.
- limitation: 웃음을 되찾으려는 목적만으로 warmth를 만들지 않고, 결말의 실제 관계
  보상은 아래 complete-work 자료와 교차 확인했다.

#### Source B — 작가·담당 편집자 완결일 인터뷰

- sourceName: 集英社オンライン 타이잔5·담당 편집 F田 인터뷰 후편
- sourceUrl: https://shueisha.online/articles/-/4466
- publicationDate: `2022-04-04`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 작가와 담당 편집자의 직접 발언이며 Source A와 같은 출판
  계열이다. 독립 독자 family로 가산하지 않았다.
- evaluatedRange: 최종화 공개일에 실시한 전 16화 회고. 작가가 15화의 시즈카와의
  대화까지 사전 결정했다고 밝힌 구간을 사용했다.
- directObservation: 최종부의 중심 행위는 새 도구 획득이 아니라 시즈카와의 대화다.
  작가와 편집자는 무구함과 심각함, 밝음과 어두움의 대비를 작품 설계로 설명한다.
- limitation: 화면의 명암은 Art 근거로 전용하지 않았고, 대화 예정 사실만으로 warmth
  빈도를 확정하지 않았다.

#### Source C — 완독한 독립 선고위원의 복수 구체 관찰

- sourceName: マンガ大賞2023 선고위원 코멘트
- sourceUrl: https://www.mangataisho.com/data/2023/comment2023.pdf
- publicationDate: `2023-03-26`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 위원회가 공개한 공식 코멘트 모음이다. 서로 다른 서점원,
  교원, 회사원 등 이름이 표시된 작성자들을 독립 관찰자로 확인했지만 PDF 한 family로
  계산했다.
- evaluatedRange: 완결 후 후보가 된 상·하권 전편. 결말, 최종화와 다시 읽기를 직접
  언급한 항목만 사용했다.
- directObservation: 여러 작성자가 마지막 대화, 두 소녀가 스스로 앞으로 나아가는
  결말, 절망 속 제한된 희망과 가혹함 속의 친절함을 구체적으로 짚는다. 다른 위원들은
  같은 전편을 끊임없는 절망과 무거움으로 관찰한다.
- limitation: 이 충돌은 따뜻함의 존재를 없애지 않지만, 관계 온기를 혼합 2 이상으로
  올리지 못하게 한다.

#### Source D — 독립 비평의 complete-work 분석

- sourceName: Real Sound Book 완결 만화 비평
- sourceUrl: https://realsound.jp/book/2025/08/post-2134467.html
- publicationDate: `2025-08-26`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 출판사·상업 리뷰 플랫폼과 분리된 편집 매체의 기명 비평
  한 건이다.
- evaluatedRange: 만화 전 2권 분석. 애니메이션의 반응·성과 대목은 제외했다.
- directObservation: 도구가 문제를 해결하지 못해도 타コピー가 시즈카 곁에 머무는
  행위 자체가 제한된 구원이 되고, 마지막의 작은 관계 변화가 세계를 조금 덜 가혹하게
  만든다고 분석한다.
- limitation: 비평가의 theme 해석을 그대로 점수화하지 않고 Source A~C의 결말 관찰과
  겹치는 관계 효과만 사용했다.

#### Source E — 정확한 완결권 복수 계정

- sourceName: BookLive `タコピーの原罪 下` 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/1080370/vol_no/002
- publicationDate: 사용 항목 `2022-05-09`–`2026-07-03`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 서로 다른 구매·완독 계정이지만 BookLive 한 platform family로
  계산했다. 일부 Booklog 전재도 별도 family로 중복 가산하지 않았다.
- evaluatedRange: exact 하권 또는 상·하권 완독을 명시하고 결말을 구체적으로 서술한
  항목만 사용했다.
- directObservation: 복수 작성자가 두 소녀가 조금 나아지거나 친구가 되는 결말,
  마지막 웃음과 희망을 반복 관찰한다. 동시에 근본 문제가 해결되지 않고 어두움이
  남는다고 말한다.
- limitation: 별점, 감정 tag, 단순 감동 반응은 사용하지 않았다.

### Axis conclusion

- `emotionalWarmth=1`: candidate-known, confidence `0.86`. 공식 완결 범위의 마지막
  대화와 희생 이후 두 소녀의 관계·웃음·제한된 희망이 복수 독립 자료에서 반복된다.
  따라서 관계가 전적으로 차갑고 가혹한 0으로만 남지는 않는다. 그러나 학교·가정·핵심
  관계의 대부분은 계속 가혹하고 온기는 결말에 제한되므로 혼합 2나 핵심 보상 4가
  아니라 0과 2 사이의 1이다.
- conflict: complete-work 관찰은 희망과 우정을 확인하면서도 절망·미해결을 더 큰
  비중으로 확인한다. 자동 다수결 대신 낮은 1로 제한했다.
- `romance`: 선행 `REJECT→U` 유지. 다른 관계의 상세와 romance 침묵은 active absence가
  아니다.
- `comedy`: closed-unknown 유지. 밝고 어두운 표현 대비와 캐릭터 외형은 반복 개그의
  직접 관찰이 아니다.
- retainedNarrative: `U / 1 / U / 4 / 4 / 2 = 4/6`
- retainedToneBeforeCandidate: `4 / 3 / U / 4 / 4 / U / U = 4/7`
- finalCandidateTone: `4 / 3 / U / 4 / 4 / U / 1 = 5/7`
- gateAssessment: 이 후보가 다음 독립 Pass B와 Pass C를 통과할 때에만 text gate pass다.
- blockerCandidate: false

## 47. work-f5847c45d30753150364 — 闇のパープル・アイ

### Source packet

#### Source A — 小学館 표준판 1~3권 공식 소개

- sourceName: 小学館 `闇のパープル・アイ` 1권·2권·3권
- sourceUrl1: https://shogakukan-comic.jp/book?jdcn=091316510000d0000000
- sourceUrl2: https://shogakukan-comic.jp/book?jdcn=091316520000d0000000
- sourceUrl3: https://shogakukan-comic.jp/book?jdcn=091316530000d0000000
- publicationDate: 공식 전자판 `2013-01-01`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 출판사 1차 자료 세 건이며 같은 official family다.
- evaluatedRange: frozen 표준판 1~3권과 같은 권차.
- directObservation: 1권에서 신체의 마성이 깨어나고, 2권에서 변신 사실을 알게 된
  적대자의 함정에 맞서 구출 행동을 하며, 3권에서 실제 변신과 복수 결의로 전환한다.
- limitation: 구출·복수라는 직접 행동은 선행 기각된 problemSolving이나 strategy로
  전용하지 않았다.

#### Source B — 작가의 초기 arc 직접 회고

- sourceName: コミックナタリー Sho-Comi 50주년 篠原千絵 인터뷰
- sourceUrl: https://natalie.mu/comic/pp/sho-comi50th_06
- publicationDate: `2018-10-19`; modified `2018-12-20`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 작가 직접 발언을 담은 기명 편집 인터뷰다. 출판사 상품
  페이지와 독립된 editorial family지만 사용자 리뷰는 아니다.
- evaluatedRange: 개시부의 이변, 최초 변신, 여동생 죽음과 변신 정체 공개까지를
  작가가 직접 회고한 부분. 정확한 권차 배치는 Source A만 따른다.
- directObservation: 작가는 최초 살상이 본인 의사와 무관한 변신이었다고 설명하고,
  변신을 긍정적 성취가 아니라 주인공에게 닥친 재난과 궁지에서 벗어나는 부정적
  접근으로 설계했다고 밝힌다.
- limitation: 부정적 접근이 progression의 능동적 부재를 뜻하지는 않는다. 능력의
  실제 변화량은 Source A와 D로 별도 판정했다.

#### Source C — 연재 확장 범위에 대한 작가 인터뷰

- sourceName: ebookjapan 篠原千絵 데뷔 30주년 인터뷰
- sourceUrl: https://ebookjapan.yahoo.co.jp/content/author/2830/interview.html
- publicationDate: `2011` (페이지에 월일 미표시)
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 작가 직접 발언을 담은 정식 전자서점 편집 인터뷰다. Source
  B와 별도 매체다.
- evaluatedRange: 작품의 최초 단행본 계획이 독자 반응에 따라 2권, 3권, 최종 12권으로
  연장된 창작 경계만 사용했다.
- directObservation: frozen 1~3권은 완결작의 임의 절단이 아니라 최초 계획과 두 차례
  연장으로 만들어진 연속 초기 단위다.
- limitation: 연장 사실이나 독자 반응은 Axis Evidence가 아니다. Source A의 exact
  1~3권 범위를 보조하는 scope control로만 사용했다.

#### Source D — 정확한 2권의 상반된 구체 관찰

- sourceName: honto `闇のパープル・アイ 2` 리뷰
- sourceUrl: https://honto.jp/ebook/pd-review_0635338787.html
- publicationDate: 사용 항목 `2021-02-18`; `2021-12-07`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 서로 다른 두 작성자지만 honto 한 platform family로
  계산했다.
- evaluatedRange: exact 2권 리뷰. 전체작·드라마 회고는 제외했다.
- directObservation: 한 작성자는 주인공이 점차 강해진다고 관찰하고, 다른 작성자는
  변신 사실을 알게 되어도 아직 변신을 통제하지 못한다고 구체적으로 관찰한다.
- limitation: 상반된 두 관찰을 성장 2 또는 부재 0으로 다수결하지 않고, 공식
  1~3권의 각성→행동 변화가 제한적임을 정하는 보조로만 사용했다.

### Axis conclusion

- `progression=1`: candidate-known, confidence `0.81`. 1권의 능력 각성에서 3권의 실제
  변신·자기 목적 행동까지 획득과 강해짐은 존재한다. 반면 작가가 밝힌 비자발적 시작,
  exact 2권의 통제 불능 관찰과 지속되는 재난 framing 때문에 서서히 숙련되는 2의
  보상 구조에는 못 미친다. 성장 보상이 거의 없는 0과 서서히 성장하는 2 사이의
  제한된 1이다.
- conflict: 강해짐과 통제 불능이 같은 초기 범위에 공존한다. 이는 후보를 없애는
  모순이 아니라 2 이상을 막는 직접 범위 제한이다.
- `problemSolving`: 선행 `REJECT→U` 유지. 잠입·구출·도피에는 제약 분석과 기지 해결의
  구체 관찰이 없다.
- `strategy`: closed-unknown 유지. 한 번의 잠입과 복수 결의를 반복 전술·단기 계획으로
  확대하지 않았다.
- finalCandidateNarrative: `1 / U / U / 4 / 3 / 2 = 4/6`
- retainedTone: `4 / 2 / U / 4 / 4 / 2 / U = 5/7`
- gateAssessment: 이 후보가 다음 독립 Pass B와 Pass C를 통과할 때에만 text gate pass다.
- blockerCandidate: false

## 48. work-fabc7f5d853e361acaf3 — YAIBA

### Source packet

#### Source A — 小学館 표준판 1~3권 공식 소개

- sourceName: 小学館 `YAIBA` 1권·2권·3권
- sourceUrl1: https://shogakukan-comic.jp/book?jdcn=091222710000d0000000
- sourceUrl2: https://shogakukan-comic.jp/book?jdcn=091222720000d0000000
- sourceUrl3: https://shogakukan-comic.jp/book?jdcn=091222730000d0000000
- publicationDate: 공식 전자판 `2013-01-01`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 출판사 1차 자료 세 건이며 같은 official family다.
- evaluatedRange: frozen 표준판 1~3권과 같은 권차.
- directObservation: 2권에서 라이벌이 風神の剣에 사로잡혀 악의 화신으로 변하고,
  주인공은 그 검과 대를 이루는 雷神の剣을 찾는다. 3권은 雷神の剣 안에 감춰진 위협을
  전면에 두어 앞선 마검 획득을 단순 power-up이 아닌 위험으로 다시 보게 한다.
- limitation: 수련, 새 필살기와 연속 자객은 이미 progression·combat 근거다. 이를
  problemSolving이나 strategy로 중복 배정하지 않았다.

#### Source B — 작가의 작품·초회 직접 회고

- sourceName: 少年サンデー 명작 museum `YAIBA` 작가 회고
- sourceUrl: https://websunday.net/4217/
- publicationDate: `2021-04-06`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 출판사 공식 사이트에 실린 青山剛昌의 직접 발언이다.
  Source A와 같은 출판 계열이므로 독립 리뷰로 가산하지 않았다.
- evaluatedRange: 제1화의 설계와 작품 전체의 창작 방향을 회고한 부분.
- directObservation: 작가는 움직임과 기세가 좋은 첫 화, 지속적인 gag와 action을 담은
  모험 활극을 목표로 했다고 설명한다.
- limitation: 이 발언은 중심성 상한을 정한다. gag/action 중심이라는 장르 설명이나
  mystery 침묵으로 mysteryReveal=0을 만들지 않았다.

#### Source C — exact 2권 BookLive 관찰

- sourceName: BookLive `YAIBA 2` spoiler 리뷰
- sourceUrl:
  https://booklive.jp/review/list/title_id/185663/vol_no/002?spoiler=1
- publicationDate: 사용 항목 `2024-06-16`; `2025-07-11`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 서로 다른 표시 항목이지만 익명 계정을 분리 가산하지 않고
  BookLive 한 platform family로 계산했다.
- evaluatedRange: exact 2권 spoiler 항목.
- directObservation: 라이벌의 갑작스러운 변신과 학교 대결에서 전국 규모 위협으로의
  전환을 구체적으로 관찰한다.
- limitation: 놀라움 자체는 mysteryReveal이 아니다. Source A의 숨은 마검 위협과
  연결되는 변신 공개 사실만 보조로 사용했다.

#### Source D — exact 2권의 독립 platform 관찰

- sourceName: honto `YAIBA 2` 리뷰
- sourceUrl: https://honto.jp/ebook/pd-review_0610222631.html
- publicationDate: 사용 항목 `2024-06-18`; `2025-07-30`
- retrievedAt: `2026-08-23`
- authorityAndIndependence: 기명 작성자 두 명을 확인했지만 honto 한 platform family로
  계산했다. Source C와는 별도 회사·작성자다.
- evaluatedRange: exact 2권.
- directObservation: 두 작성자가 온화하던 라이벌의 변모와 마검 두 자루의 위험을
  구체적으로 관찰한다.
- limitation: 한 작성자가 검의 보관 이유를 묻지만 미해결 질문은 reveal 근거로 쓰지
  않았다. 공식 2~3권에서 실제 공개된 마검의 변질·위협만 사용했다.

### Axis conclusion

- `mysteryReveal=1`: candidate-known, confidence `0.80`. 2권의 風神の剣에 의한 라이벌
  변모와 3권의 雷神の剣에 숨은 위협 공개는 하나로 이어지는 제한적 마검 비밀·반전이며,
  앞선 무기 획득을 재맥락화한다. 두 독립 platform family도 변모의 갑작스러움을 exact
  2권에서 확인한다. 다만 단서·추론·다수 진실 공개가 반복 보상인 구조는 아니고 작가가
  밝힌 중심은 gag/action 모험이므로 일부 비밀·반전 2보다 낮은 1이다.
- conflict: 마검 공개는 실제 plot reveal이지만 주 전개는 수련과 직접 전투다. 이
  중심성 충돌 때문에 단일 연결 reveal만 1로 제한했다.
- `problemSolving`: 선행 `REJECT→U` 유지. 수련·새 기술·직접 전투를 분석 해결로 다시
  포장하지 않았다.
- `strategy`: closed-unknown 유지. 자객 파견과 즉흥 전투는 주인공의 반복 전술·단기
  계획 근거가 아니다.
- finalCandidateNarrative: `4 / U / U / 4 / 1 / 3 = 4/6`
- retainedTone: `2 / 2 / 4 / 2 / 1 / U / U = 5/7`
- gateAssessment: 이 후보가 다음 독립 Pass B와 Pass C를 통과할 때에만 text gate pass다.
- blockerCandidate: false

## 충돌·identity·safety·blocker 정리

| Work               | Factor conflict                                               | 처리                                                                            | identity·safety |
| ------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------- |
| タコピーの原罪     | 가혹함이 지배하지만 결말의 우정·희망이 반복 관찰됨            | `emotionalWarmth=1`; 2 이상 금지, `romance=0` 기각 유지                         | 새 모순 없음    |
| 闇のパープル・アイ | 강해짐이 보이지만 변신은 비자발적이고 통제되지 않음           | `progression=1`; 성장 2와 부재 0 모두 피하고 `problemSolving` 기각 유지         | 새 모순 없음    |
| YAIBA              | 한 마검 reveal은 있으나 작품 중심은 gag/action·수련·직접 전투 | `mysteryReveal=1`; 반복 mystery 2 이상과 strategy·problemSolving 중복 배정 금지 | 새 모순 없음    |

- 세 후보는 모두 frozen entry 범위 안의 text 관찰이며 대표 ISBN, Work split, release,
  safety를 다시 열지 않는다.
- 아동 피해, 변신 살상, 복수와 마검 위협은 text 내용 관찰이다. 이를 adult-only 분류나
  safety 변경으로 전용하지 않았다.
- 세 작품 모두 후보가 하나씩 있어 `SOURCE_INFORMATION_UNAVAILABLE` blocker 후보로
  닫지 않는다. 다음 Pass B가 후보를 기각하면 해당 작품은 gate fail로 남기고 다른 약한
  값을 대체 생성해야 하는 것으로 해석하지 않는다.

## 산출물 검증

- expectedWorks: 3
- expectedCandidateKnownWorks: 3
- expectedCandidateKnownAxes: 3
- expectedTextGatePassCandidates: 3
- expectedHardBlockerCandidates: 0
- sourceRecords: 13
- uniqueSourceUrls: 18
- exact auxiliary review work-family packets: 4
- URL live verification: `curl -L`과 일반 브라우저 User-Agent로 18개 모두 최종 HTTP
  `200`
- inaccessible or scope-ambiguous source used for value: 0
- Genre·Theme inference used: 0
- Art, identity, safety, source, registry, Gold, final CSV changes: 0
