# Batch 004 position 24 round-1 text recovery — independent QA

## 범위와 결론

- Reviewer: Daybreak independent QA; `reviewedByHuman=false`.
- 대상: frozen position `24`, `work-65f856a6fa2078f21d2f`, `黒月のイェルクナハト`.
- 검토일: `2026-08-25`; Factor 범위는 공식 1–3권이다.
- `darkness=known 2`, confidence `0.88`을 **ACCEPT**했다. terminal의 정확히 한 행만 변경했다.
- Narrative 신규 셀은 승인하지 않았다. `problemSolving`, `strategy`, `mysteryReveal`은 `unknown`을 유지한다.
- Recovery note의 Narrative `exact exhaustion` 주장은 **REJECT**한다. 공식 3권 trial 전체와 2권 trial의 Narrative용 미매핑 구간이 남아 있다.
- 변경 후 coverage는 Narrative `3/6`, Tone `5/7`, Art `3/4`다. Tone은 통과하지만 Narrative는 `N+1`로 실패한다.
- `SOURCE_INFORMATION_UNAVAILABLE`은 **NOT AUTHORIZED**다. coverage 실패만으로 blocker를 만들 수 없고, 사용하지 않은 qualifying official route가 남아 있다.
- Genre, Theme, Art, source, generated catalog, overlay, promotion, registry, blocker CSV는 수정하지 않았다.

## 입력 바인딩

- Repository HEAD: `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`.
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Recovery note SHA-256: `df99989021d98e4a9cee0e424920dc9dc113840fd4f68b1299e137b63ddc9f76`.
- Terminal text CSV before SHA-256: `6ac0f81582672c4d07e56b07208299b4c7b8ad92156ffffc48dc8178d5685fb8`.
- Genre terminal SHA-256: `6e4a37abd5683bdfcf5c58f6c4cf1ad7aec5028152feb2c9aaa8522e2112476e`.
- Theme terminal SHA-256: `5a938db4531544f619199cd6a2b72c6e9a6bf9667af56cfe622a89f59f936eec`.
- Art terminal SHA-256: `4777d2276d5913c340215c56706692ce075a160e685857dce4bf73fd85c765e2`.

## 공식 講談社 1–3권 재검증

세 exact product URL을 `2026-08-25`에 다시 열었다. 모두 HTTP `200`으로 matching title, creator, volume, release date, publisher copy를 노출했다. 판정은 아래 공식 소개문에만 한정하며 제목·장르·수상·평판으로 Factor를 만들지 않았다.

| 공식 근거 | 발매일 | 직접 확인한 bounded observation |
|---|---:|---|
| [講談社 1권](https://www.kodansha.co.jp/comic/products/0000415577) | `2025-07-16` | 직업·꿈·생의 의욕이 없는 18세 주인공, 비인간 Yerkunacht와의 만남, 결혼 또는 죽음의 강제 선택을 소개한다. |
| [講談社 2권](https://www.kodansha.co.jp/comic/products/0000419091) | `2025-10-17` | Noa와의 사투, 힘 부족 인식, 실전 훈련, 피투성이 전투를 소개한다. |
| [講談社 3권](https://www.kodansha.co.jp/comic/products/0000424213) | `2026-02-17` | 공동생활 중 의문의 조직에 납치되고 격렬한 구출전이 벌어진 뒤 목욕·세탁·비프스튜 일상으로 이어진다고 소개한다. |

Stable trial endpoints도 같은 날 재확인했다. [2권 trial](https://www.kodansha.co.jp/comic/products/0000419091/trial)과 [3권 trial](https://www.kodansha.co.jp/comic/products/0000424213/trial)은 각각 HTTP `302`로 講談社의 tokenized ebook-provider branch를 발급했다. Token 자체는 session-bound이므로 provenance에는 stable product trial URL을 보존한다. 선행 round 4는 브라우저에서 2권 trial 일부 페이지를 확인했지만 warmth 판정 범위만 기록했고, 3권 trial의 Narrative event ledger는 만들지 않았다.

## `darkness` 독립 판정

| 후보 | 결정 | 근거 |
|---|---|---|
| `darkness=0` | **REJECT** | 1권의 죽음 선택, 2권의 사투·피투성이 전투, 3권의 납치·격투가 밝고 가벼운 진입 범위와 양립하지 않는다. |
| `darkness=2` | **ACCEPT** | Dictionary의 `진지한 위험·비극 존재` anchor가 1–3권 모두에서 직접 반복된다. 한 권의 safety lead나 전투 Genre를 수치로 바꾼 것이 아니다. |
| `darkness=4` | **REJECT** | 잔혹·암울·비극이 entry 보상의 중심이라는 근거는 없다. 공식 소개는 battle romance, 전투 후 보상, 공동생활과 가사 일상을 함께 전면에 둔다. |

Confidence `0.88`을 유지한다. 위험의 반복은 세 공식 권 소개에서 직접 확인되지만, page-indexed complete event ledger가 아니라 publisher synopsis 범위이므로 극단값은 허용하지 않는다. `mentalStress`와는 분리 판정하며, 절망·위험 표현만으로 심리 압박의 지속성을 다시 추론하지 않는다.

## Narrative route와 blocker 판정

현재 product copy만으로는 새로운 Narrative 셀을 만들 수 없다.

| residual axis | 현재 결정 | route 상태 |
|---|---|---|
| `problemSolving` | `unknown` 유지 | 기존 independent QA가 같은 defeat/training/rescue synopsis에서 분석·직접 해결 과정의 반복이 없다고 reject했다. 같은 문구로 재개하지 않는다. 새로운 page-level process sequence가 나올 때만 별도 adjudication이 가능하다. |
| `strategy` | `unknown` 유지 | 상품 소개에는 계획·대응 계획·자원 운용이 없다. 그러나 2권의 미매핑 trial 구간과 3권 trial 전체를 전략 event ledger로 검사하지 않았다. |
| `mysteryReveal` | `unknown` 유지 | `謎の組織`은 미해결 label이지 clue-to-truth reward가 아니다. 그러나 3권 trial 전체의 단서·공개 sequence를 검사하지 않았다. |

따라서 이번 QA는 신규 Narrative 값을 승인하지 않지만, source route exhaustion도 승인하지 않는다. “현재 읽은 synopsis가 부족함”과 “허용된 source가 없음”은 다른 상태다.

Blocker 계약상 unchanged gate를 먼저 계산하고, unused qualifying official source 또는 eligible independent review가 남으면 narrow evidence를 요청해야 한다. 변경 후 Tone `5/7`은 통과하지만 Narrative `3/6`은 실패한다. 이 수학만으로 `SOURCE_INFORMATION_UNAVAILABLE`을 만들 수 없다.

### Provenance와 정확한 recheck path

| field | value |
|---|---|
| evidenceName | `講談社 黒月のイェルクナハト 2–3권 공식 trial` |
| evidenceUrl | `https://www.kodansha.co.jp/comic/products/0000419091/trial`; `https://www.kodansha.co.jp/comic/products/0000424213/trial` |
| evidencePublishedAt | `2025-10-17`; `2026-02-17` |
| retrievedAt | `2026-08-25` |
| blockerCode | `NOT_AUTHORIZED` |
| recheckPath | Stable product page에서 trial을 열어 session을 만든 뒤, 2권의 아직 매핑하지 않은 sample pages와 3권 sample 전체를 순회한다. `strategy`와 `mysteryReveal`에 대해 page/event 순서와 직접 대사를 기록한다. `problemSolving`은 기존 reject를 반복하지 말고, 새 분석·제약·직접 해결 sequence가 실제로 발견될 때만 별도 재심한다. |

이 exact route가 실제로 완주되고, permitted official·licensed-distributor·critical·eligible independent-review 경로까지 bounded ledger로 소진됐는데도 Narrative가 `3/6`이면 그때만 `SOURCE_INFORMATION_UNAVAILABLE`을 다시 심사할 수 있다. 이번 QA는 blocker row 생성·수정을 허가하지 않는다.

## Terminal mutation과 무결성

- Exact mutation: `work-65f856a6fa2078f21d2f,darkness,unknown,,` → `known,2,0.88`; evidence ID와 row 위치를 보존했다.
- Terminal text CSV after SHA-256: `764e5d582cf45e6e85278087394098d4f0ce601a2973785b3b25734fe607bc32`.
- Reverse-substitution SHA-256: `6ac0f81582672c4d07e56b07208299b4c7b8ad92156ffffc48dc8178d5685fb8`; pre-mutation hash와 일치한다.
- Structure: six-column header, `170` data rows, `10` work IDs, work마다 `17` unique axes, target `17` rows와 row order 유지 — **PASS**.
- Position 24 after-state: Narrative `3/6`, Tone `5/7`, Art `3/4`; Genre `action;fantasy;romance`, Theme `combat:2` 유지.
- 다른 terminal/source/generated/overlay/promotion/blocker 파일 변경: `0`.
