# Batch 002 text coverage gap Pass B — chunk 04, round 02

- batchId: `batch-002`
- sourceChunk: `chunk-04`
- reviewKind: `independent-pass-b-round-02`
- reviewer: `Local Codex subagent`
- reviewedAt: `2026-08-23`
- reviewedByHuman: `false`
- evaluatedRange: 표준판 1~3권 또는 첫 주요 에피소드
- decisionBoundary: position 39의 `romance=2` 후보만 검수한다. Art, identity,
  safety, source data, final CSV와 promotion 상태는 수정하지 않는다.

## 동결 입력

| Input                                           | SHA-256                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| `research/text-gap-chunk-04-round-02.md`        | `724b8579e17734e27b029182a5b52633537088178d4c0effd8f74ba52723367f` |
| `docs/factors/factor-dictionary.md`             | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/catalog-expansion/01-promotion-method.md` | `6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd` |
| `annotation-review-adjudication-request.md`     | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `adjudication/text-final-chunk-04.csv`          | `3fb67d62ae703f717f8a7fca65c220dd2214a9115305cff87bbd682304db9689` |
| `art-review/chunk-04/final-art.csv`             | `ebae920c3e15c041d43ed8a1d7aaeae1578ffabf75103318ddf4309e64f61fdd` |

연구자의 결론이나 gate 통과 여부를 값의 근거로 삼지 않았다. 공식 출판사
상품 설명과 공식 내부 viewer를 다시 열어 작품, 권차, 판본 범위와 관찰을 직접
대조했다.

## 공식 Source 재검증

| Source                            | URL                                                                            | 발표일                                      | 조회일     | 독립 확인 결과                                                                                                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 集英社 屍鬼 디지털판 1권          | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874549874549315501 | 종이판 2008-07-04, 디지털판 2012-07-06      | 2026-08-23 | 제목, 小野不由美 원작, 藤崎竜 만화, 종이판 발매일과 디지털 권차를 확인했다.                                                                                                                                              |
| 集英社 屍鬼 디지털판 2권          | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874550874549315501 | 종이판 2008-07-04, 디지털판 2012-07-06      | 2026-08-23 | 清水恵가 結城夏野에게 마음을 두었고 사망 뒤에도 夏野가 그녀의 시선을 느낀다는 공식 소개를 확인했다.                                                                                                                      |
| 集英社 屍鬼 디지털판 3권          | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874585874549315501 | 종이판 2008-10-03, 디지털판 2012-07-06      | 2026-08-23 | 같은 초기 사건선에서 夏野가 清水恵의 죽음을 의심하고 무덤을 확인하는 후속 전개를 확인했다.                                                                                                                               |
| S-MANGA 屍鬼 1권 공식 내부 viewer | https://www.s-manga.net/reader/main.php?cid=08874549874549315501               | 대응 종이판 2008-07-04, 디지털판 2012-07-06 | 2026-08-23 | viewer가 61쪽을 노출했다. `content-p24`~~`content-p29`, `content-p42`~~`content-p49`에서 清水恵가 夏野를 찾아가고, 그에게 인정받기를 바라며, 이상화된 관계를 상상하고, 거절 뒤에도 접근을 계속하는 흐름을 직접 확인했다. |

공식 디지털 상품은 원판과 같은 제목, 창작자 역할, 권차와 종이판 발매일을
표시한다. frozen 대표 ISBN `9784088745497`을 현재 viewer가 직접 표시하지 않는
한계는 선행 identity adjudication과 동일하게 유지한다. 이번 Pass B는 그 identity
결론을 다시 열거나 다른 판본으로 확장하지 않는다.

## 독립 판정

| Pos | workId                      | canonicalTitle | 후보        | 판정     | 최종 | 판단                                                                                                                                                                                                                                                                                                        |
| --: | --------------------------- | -------------- | ----------- | -------- | ---: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  39 | `work-c221a17d6b962b17c9f4` | 屍鬼           | `romance=2` | `ACCEPT` |    2 | 1권 공식 내부 페이지에서 일방적 호감과 이상화가 반복되고 실제 접근 행동을 일으킨다. 2권 공식 소개가 같은 감정을 사망 이후의 夏野 서사까지 잇고, 3권도 清水恵 사건선을 계속한다. 연정은 반복되는 인물 subplot이지만 연속 사망과 조사가 주 전개이므로 중심값 4가 아니라 Dictionary의 subplot 앵커 2에 맞는다. |

- confidence: `0.86`
- 범위 제한: 상호 연애나 작품 전체의 romance 중심성을 주장하지 않는다. 일방적
  연정을 `emotionalWarmth`로 재사용하지 않는다.
- 사용자 리뷰: 값 확정에 사용하지 않았다. 이 후보는 공식 1차 자료만으로 직접
  확인되므로 복수 유저평을 추가해 신뢰도를 부풀리지 않는다.
- conflict: 없음. horror Genre에서 romance를 자동 추론하지 않았고, 공식 범위가
  직접 보여 준 반복 subplot만 판정했다.

## 제외된 position

| Pos | canonicalTitle   | Pass B 상태    | 이유                                                                            |
| --: | ---------------- | -------------- | ------------------------------------------------------------------------------- |
|  31 | 軍靴のバルツァー | `NO_CANDIDATE` | upstream Art coverage blocker 후보로 이번 round에 새 text 값이 제안되지 않았다. |
|  34 | ケロロ軍曹       | `NO_CANDIDATE` | upstream Art coverage blocker 후보로 이번 round에 새 text 값이 제안되지 않았다. |

두 작품의 선행 텍스트 자료를 새 값으로 변환하지 않았으며 blocker 자체도 이 파일에서
확정하지 않는다.

## 예상 coverage

Axis 순서는 Narrative가 `progression / problemSolving / strategy / pacing /
mysteryReveal / worldBuilding`, Tone이 `characterArcWeight /
relationshipStructure / comedy / darkness / mentalStress / romance /
emotionalWarmth`다.

- 屍鬼 Narrative: `U / 2 / U / 2 / 3 / 2` = `4/6`, gate 통과 유지.
- 屍鬼 Tone: `2 / 2 / U / 4 / 2 / 2 / U` = `5/7`, 후보 채택 시 gate 통과.
- 屍鬼 Art: 선행 final 기준 `3/4 known`; 이번 review에서 변경 없음.
- expectedTextGatePass: `1/1` 검수 후보.
- expectedHardBlockerFromThisReview: `0`.
- nextStep: Pass C가 `romance=2`와 판본 한계를 함께 확인한 뒤에만 final CSV에
  반영한다.

## 품질 경계

- canonical title delimiter count: `0`
- source URL, 출처명, 발표일, 조회일 누락: `0`
- Genre에서 Axis 자동 추론: `0`
- review silence로 known 0 생성: `0`
- source 또는 final CSV 변경: `0`
- reviewedByHuman: `false`
