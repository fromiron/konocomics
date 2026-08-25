# Batch 004 text-gap recovery — chunk 03, round 4

## 조사 범위와 불변 조건

- 조사·조회일: `2026-08-25`
- 대상: frozen positions `21–30` only
- 평가 범위: 권 1–3의 초반 진입 범위. 단권 작품은 전체 단권 범위
- `retrievedAt`: `2026-08-25`
- `reviewedByHuman=false`
- branch: `main`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- current terminal text CSV SHA-256: `c37820ca7d6399bd2f3c6fe8e26ea7309f350f3a46c1a84d69800354cd260c56`
- candidate annotation SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`
- prior round-3 research SHA-256: `7dc0b66fad281a649fe9c9ec5d538cc16e761350b7c14b6a44bba073fbb25d38`
- bound round-3 independent QA SHA-256: `a87accb7895a21fcc15004bd6559f374e5f04c54e9ab1bc522f2fa1bd68aa35a`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`

이 문서는 research-only packet이다. terminal Factor/Genre/Theme CSV, source/provenance,
Art, safety, identity, blocker, overlay, registry, generated artifact, promotion 상태는
수정하지 않았다. 아래 `PROPOSE`는 독립 adjudication 입력이며 승인 결과가 아니다.

Round-2와 round-3에서 `REJECT`, `ACCEPTED_NO_OP`, `UNKNOWN`으로 종결된 셀은 다시
제안하지 않았다. 이번 round는 새로 공식 출판사 리더를 실제로 렌더링해 확인한
장면 단위의 텍스트·상황 관찰만 사용한다. 표지·애니메이션·작화 품질은 사용하지
않았고 Art 축은 다루지 않았다. 제목·장르·상품 태그·추천목록을 Axis 값으로
변환하지 않았다.

## Round-3 이후 재오픈 금지 셀

다음 셀은 이전 독립 QA에서 종결됐으므로 이번 packet에서 재제안하지 않았다.

- 21: `problemSolving` reject
- 22: `problemSolving` reject
- 23: `characterArcWeight` downgrade reject, `worldBuilding` reject
- 24: `problemSolving` reject
- 25: `progression` reject
- 28: existing `mentalStress=2` accepted no-op 및 기존 확정 셀
- 29: prior pacing/relationship/character/progression/problem-solving findings
- 30: `problemSolving` reject

## 새 공식 1차 근거

### 21 — アンデッドアンラック — `comedy=2` 제안

**작품 ID:** `work-53fb816835ab36e40a1f`

공식 리더를 브라우저에서 렌더링해 페이지의 대사·패널 배열을 확인했다. 원본
reader URL과 판본을 기록하고, 임시 캡처는 커밋하지 않았다.

1. 集英社 volume 2 reader, published `2020-06-04`, retrieved `2026-08-25`:
   https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300
   - rendered printed pages `21–22`(reader 순회 캡처 `p10.png`, `p11.png`).
   - 식당 주문 장면에서 Andy의 죽음 농담, Fuko의 과장된 표정과 즉각적인 반응,
     주변 인물의 짧은 대화가 연속적으로 배치된다. 전투 설명이 아니라 일상적
     상황의 엇박자와 인물 반응으로 웃음을 만드는 장면이다.
   - 임시 캡처 SHA-256: `p10.png`
     `2de8c2304b929547a85a3c28815700b08435658e8336ba906e166233edf2fc66`,
     `p11.png`
     `d1f5f08477c4ab0c87b6f3908928c58d4f992d70bc07ade6ab1c8fb52bc58349`.

2. 集英社 volume 3 reader, published `2020-09-04`, retrieved `2026-08-25`:
   https://www.shueisha.co.jp/books/reader/main.php?cid=9784088824048
   - volume 3 초반 reader 순회 위치 `7–8`(임시 캡처 `p07.png`, `p08.png`).
   - 전투 직후 여러 인물이 한 화면에 모인 상태에서 과장된 표정, 무덤덤한 응답,
     갑작스러운 장면 전환과 상황의 엇박자가 함께 배치된다. 같은 comedy 장치가
     volume 2의 식당 일상 장면과 다른 전투 후 맥락에서도 반복된다.
   - 임시 캡처 SHA-256: `p07.png`
     `23f72b2e459407d589d28c022eea131439658113871719dc2363b2f8123b662d`,
     `p08.png`
     `7805ab59dd4c0d2f935567f2a0542e7625b08bfe7aaffb15e823bf05c6da3539`.

**Dictionary anchor:** `comedy=2`는 간헐적인 웃음·상황 코미디를 뜻한다. 두 권의
서로 다른 초반 장면에서 인물 반응과 상황의 엇박자가 반복되므로 `known=2` 후보가
된다. 그러나 comedy가 모든 장면의 중심 보상이라는 직접 근거는 없어 `4`로 올리지
않는다.

**범위·한계:** 이는 official reader의 두 volume에서 확인한 두 장면 클러스터에
한정한다. 작품 전체가 상시 코미디라는 주장을 하지 않는다. 이 round에는 유저평을
새로 사용하지 않았으며, 기존 round의 보조 리뷰 근거와도 별개인 1차 근거로 기록한다.

**제안:** `PROPOSE comedy=2`, confidence `0.78`.

## 신규 제안이 없는 작품별 종결 기록

아래 항목은 이번 round에 공식 route를 재확인했지만, 새로 허용되는 Axis/Genre/Theme
셀을 만들 만한 직접 근거가 없었다. 기존 reject/no-op/unknown 결론은 유지한다.

| position | workId | title | 이번 round 확인 | 결과 |
|---:|---|---|---|---|
| 22 | `work-62fbc6b2253b895e3a66` | 俺物語！！ | 기존 volume 2–3의 물리적 구조·귀가 임무 범위를 다시 대조했으나, 남은 Narrative anchor를 채울 새 page/event ledger가 없음 | 신규 제안 없음. 기존 reject 유지 |
| 23 | `work-634f34830600e07d8f17` | お茶にごす。 | 공식 e-comi volume 2에서 차도부 예절·부원 상호작용을 렌더링했으나, 이미 확정된 comedy를 넘어 progression/problemSolving/worldBuilding의 anchor가 되지 않음 | 신규 제안 없음. 기존 값·reject 유지 |
| 24 | `work-65f856a6fa2078f21d2f` | 黒月のイェルクナハト | 講談社 volume 2 trial의 일부 reader 페이지를 확인했으나, 새로 독립적인 warmth/healing 관찰을 확정할 만큼의 범위가 아님 | 신규 제안 없음. 기존 `emotionalWarmth` unknown 유지. safety 판정·파일 수정 없음 |
| 25 | `work-741deb03d9f59e723929` | ルックバック | 단권 official reader route와 기존 accepted full-work 범위를 대조했으나, 남은 Narrative 셀을 만들 새 독립 event evidence 없음 | 신규 제안 없음. 기존 reject 유지 |
| 26 | `work-7c8931bc010e2f28f7ec` | 夢中さ、きみに。 | KADOKAWA product/press의 collection identity는 확인되지만, 8개 단편 전체의 goal/state event matrix는 확보되지 않음 | `pacing=0` 재제안 없음. 기존 unknown 유지 |
| 27 | `work-7d4568dcc8e9175d35ba` | 異世界おじさん | BookWalker/KADOKAWA route가 reader shell 단계에 머물러 panel-level process ledger가 없음 | 신규 제안 없음. 기존 unknown/reject 유지 |
| 28 | `work-7f0f63c5d80083f2be7f` | 思い、思われ、ふり、ふられ | 공식 volume 2–3 reader의 비밀·고백·관계 범위는 기존 `mentalStress=2`와 일치하나 terminal 셀을 다시 쓰지 않음 | 신규 제안 없음. existing accepted no-op 유지 |
| 29 | `work-80a2f62ce5073ade2ec2` | 式の前日 | collection reader payload는 tile/encrypted 상태로 남아 story title/page mapping을 만들지 못함 | 신규 제안 없음. 기존 unknown 유지 |
| 30 | `work-8733067e6afcaeadbd8d` | さんすくみ | 공식 e-comi API가 volume 2의 11-page sample payload를 반환했지만 이번 브라우저 순회는 cover에서 진행되지 않아 page-level 사건표를 확인하지 못함 | 신규 제안 없음. 기존 reject/unknown 유지 |

## Genre·Theme·Art·safety 경계

- 이번 round의 Genre/Theme 변경: `0`
- 새 Theme 후보: `0`
- Art 판정 또는 Art 상태 변경: `0`
- safety/identity/blocker 판정 또는 파일 변경: `0`
- review evidence 추가: `0` (이번 round는 공식 reader 1차 근거만 사용)
- terminal/source/generated/promotion 파일 변경: `0`

## Adjudication 입력 요약

| position | proposed cell | status | confidence | dictionary anchor | evidence scope |
|---:|---|---|---:|---|---|
| 21 | `comedy=2` | `PROPOSE` | `0.78` | 서로 다른 volume의 간헐적 상황 코미디·과장된 인물 반응. 상시 중심은 아니므로 4 아님 | volume 2 printed pp.21–22 + volume 3 reader positions 7–8 |

이번 packet만으로 terminal CSV를 수정하지 않는다. 독립 adjudication 시에도 이미
종결된 셀을 평균·다수결로 재개하지 말고, 위 직접 근거가 Dictionary의 `comedy=2`
anchor를 실제로 충족하는지와 범위 일치를 별도로 확인해야 한다.

## 실행 경계와 체크

- 작성 파일: 이 research packet 하나만 생성했다.
- temporary reader captures: `/tmp`에만 존재하며 저장소에 추가하지 않았다.
- `git diff --check`: tracked tree와 신규 packet의 no-index 비교 모두 PASS.
- 다음 단계는 independent adjudication이며, 그 전까지 current terminal SHA는
  `c37820ca7d6399bd2f3c6fe8e26ea7309f350f3a46c1a84d69800354cd260c56`로 유지된다.
