# Batch 005 position 12 Narrative recovery — round 2

- 조사일 및 조회일: `2026-08-25`
- 대상: `work-1550d4a52c3fe6d9f94c` — `ボクラノキセキ`
- frozen position: `12`
- 평가 범위: `entry_1_3_volumes`
- `reviewedByHuman=false`
- current terminal text SHA-256: `fb132a8ab74fe0a73f10e18fd44a1644229f01fb363ca53f0cdf15435d4b9f0e`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- terminal CSV, Pass A, source/provenance, overlay, registry, generated catalog, and promotion state were not edited.

이번 조사는 position 12에 한정한 Narrative 잔여 축 회복 라운드다. 이전 chunk-02 rounds와 독립 QA를 먼저 대조했으며, 이미 `REJECT`, `UNKNOWN`, 또는 exact exhaustion으로 종결된 셀은 재제안하지 않았다. 따라서 `progression`은 재개방하지 않고, 현재 남은 `problemSolving`과 `strategy`만 확인했다. `pacing`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `relationshipStructure`는 현재 known 값으로 유지하며 재평가하지 않았다. `comedy=2`는 직전 round에서 이미 독립 QA가 수용한 terminal 값이며 이 보고서의 대상이 아니다.

## 현재 terminal

| Axis | 상태 | 값 | 이번 라운드 처리 |
| --- | --- | ---: | --- |
| `progression` | unknown | — | 이전 round에서 `mysteryReveal`과 중복되는 기억 회복으로 반려. 재개방하지 않음 |
| `problemSolving` | unknown | — | exact exhaustion |
| `strategy` | unknown | — | exact exhaustion |
| `pacing` | known | 2 | 유지 |
| `mysteryReveal` | known | 3 | 유지 |
| `worldBuilding` | known | 2 | 유지 |
| `characterArcWeight` | known | 3 | 유지 |
| `relationshipStructure` | known | 2 | 유지 |

## 확인한 출처와 범위

모든 URL은 `2026-08-25`에 조회했다. 공식 권 페이지의 `publishedAt`은 출판사 서지일이며, reader route의 확인 범위는 해당 정식 유통 미리보기에서 실제 확인된 초반 페이지다.

1. **一迅社WEB — ボクラノキセキ 1巻**
   URL: https://data.ichijinsha.co.jp/detail/75805394
   `publishedAt: 2009-02-25`, `evaluatedRange: volume 1`
   공식 소개는 미나미가 전쟁으로 멸망한 나라의 왕녀 베로니카의 기억을 지닌 채 학교에서 고립되는 도입을 설명한다.

2. **BookLive — ボクラノキセキ 1巻 reader**
   URL: https://booklive.jp/bviewer/s/?cid=176973_001&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F001
   `publishedAt: 2009-02-25`, `evaluatedRange: opening sample`
   기억과 정체성에 관한 학교 대화, 역사·기억 설명, 인물 간 반응을 확인했다. 제약을 분석해 해법을 선택하는 과정이나 반복 전술 계획은 확인되지 않았다.

3. **一迅社WEB — ボクラノキセキ 2巻**
   URL: https://data.ichijinsha.co.jp/detail/75805477
   `publishedAt: 2010-01-25`, `evaluatedRange: volume 2`
   공식 소개는 반 친구들이 전생 기억을 차례로 되찾고 히로키가 베로니카라고 주장하는 상태 변화를 설명한다.

4. **BookLive — ボクラノキセキ 2巻 reader**
   URL: https://booklive.jp/bviewer/s/?cid=176973_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F002
   `publishedAt: 2010-01-25`, `evaluatedRange: printed pp. 7–8`
   학급회·카라오케·건배와 인물의 반응이 보이는 장면을 확인했다. 이는 이미 terminal인 `comedy=2`의 보조 범위이며, 경쟁 조건을 분석하거나 단기 계획을 실행하는 장면은 아니다.

5. **一迅社WEB — ボクラノキセキ 3巻**
   URL: https://data.ichijinsha.co.jp/detail/75805543
   `publishedAt: 2010-09-25`, `evaluatedRange: volume 3`
   공식 소개는 오토모가 기억 보유자를 모으기 시작하고 현재 생활을 중시하는 미나미와 전생 지향이 충돌하는 전개를 제시한다.

6. **BookLive — ボクラノキセキ 3巻 reader**
   URL: https://booklive.jp/bviewer/s/?cid=176973_003&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F003
   `publishedAt: 2010-09-25`, `evaluatedRange: printed pp. 5–8`
   기억 보유자와 주변 인물의 대화, 인물 소개·과거 설명과 지시·반응을 확인했다. 정보 공개와 관계 갈등은 이미 `mysteryReveal`·`characterArcWeight`·`relationshipStructure`에 반영된 범위이며, 제약 분석 또는 장기 자원·전술 운영을 반복하는 구조는 확인되지 않았다.

7. **一迅社 — Comic ZERO-SUM 작품 소개**
   URL: https://www.ichijinsha.co.jp/stories/comic-zerosum/bokuranok/
   `publishedAt: not stated on page`, `evaluatedRange: series premise cross-check`, 조회일 `2026-08-25`
   권리자 소개는 기억을 가진 동급생들이 과거의 진실을 풀어가는 기본 설정을 교차 확인한다. 이는 이미 `mysteryReveal=3` 및 `investigation=2`의 근거와 중복되며, 문제를 분석해 해결하는 반복 절차나 전술·단기 계획을 독립적으로 추가하지 않는다.

## Dictionary 대조

### `problemSolving`

Factor Dictionary의 값 2는 지략과 직접 행동이 혼합되고, 값 4는 제약을 분석해 기발하게 해결하는 과정이 핵심인 경우다. 권 1~3에서 확인된 직접 관찰은 기억·정체성·과거 설명, 학교의 관계 반응, 기억 보유자 집결과 입장 충돌이다. 이 중 어느 것도 반복되는 제약 분석→해법 선택→결과의 구조를 직접 보여주지 않는다. 기억을 추적한다는 작품 전제나 `unravel the truth`라는 소개 문장만으로 이 축을 추정하지 않는다.

**결론:** `problemSolving=unknown` 유지. 새 numeric proposal 없음.

### `strategy`

Factor Dictionary의 값 2는 전술·단기 계획이 존재하는 경우, 값 4는 장기 계획·전쟁·정치·자원 운영이 중심인 경우다. 권 3의 기억 보유자 모집은 목표·관계 상태의 변화이지만, 모집을 위해 세운 반복 계획이나 자원 운영이 공식 소개·reader 범위에서 드러나지 않는다. 왕국의 전쟁 배경은 설정·과거 사건이지 현재 인물의 전략 운용 장면이 아니다. 따라서 전쟁·정치 소재나 집결이라는 단일 동사를 strategy 값으로 변환하지 않는다.

**결론:** `strategy=unknown` 유지. 새 numeric proposal 없음.

## Exact exhaustion 판정

- 권 1: 기억과 학교 고립의 도입, 정체성 대화 — `problemSolving`/`strategy` anchor 없음.
- 권 2: 기억 회복과 베로니카 주장, 학급 장면 — `mysteryReveal`·관계 반응·이미 수용된 `comedy=2` 범위이며 잔여 Narrative anchor 없음.
- 권 3: 기억 보유자 집결과 현재/전생 지향 충돌, 인물·과거 설명 — 상태·관계 변화는 `pacing` 및 known 축에 반영되며 반복 계획·제약 해법은 없음.
- 이전 `progression` 반려는 기억의 획득을 성장·숙련 보상으로 재사용하지 말라는 독립 QA 경계로 유지한다.

이 exact 1–3권 출처 집합에서는 남은 두 Narrative 축을 책임 있게 known 처리할 직접 반복 근거가 없다. 이는 낮은 값의 판단이 아니라 현재 범위에서의 `unknown` 종결이다.

**exhaustion confidence: 0.92** — 세 권의 공식 권 소개, 권리자 시리즈 교차 확인, 권별 정식 reader 범위를 대조했고, 이미 반려·종결된 셀을 재사용하지 않았다. 후속 권이나 별도 장면을 조사하면 판단 범위가 달라질 수 있지만, 이번 frozen entry 범위의 promotion evidence로는 사용하지 않는다.

## Art·리뷰 경계

- Art 4축은 이번 작업에서 다루지 않았으며 기존 `unknown`을 유지한다.
- 유저 리뷰는 새 Factor 근거로 사용하지 않았다.
- 선정 provenance와 Factor Evidence를 혼동하지 않았다.
- terminal CSV, Pass A, generated artifact, validator, promotion registry는 변경하지 않았다.

## 무결성

```text
git diff --check: PASS
report sha256: recorded in the task handoff after write
```
