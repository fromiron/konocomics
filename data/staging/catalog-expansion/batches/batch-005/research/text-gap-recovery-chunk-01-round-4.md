# Batch 005 text-gap recovery — chunk 01 round 4

- 조사일: `2026-08-25`
- 대상: `batch-005/frozen-work-set.csv` positions `1, 2, 5, 6, 7, 8, 9, 10`
- 평가 범위: representative edition에 매핑 가능한 entry volume 1–3 또는 첫
  major arc. 공식 출판사·권 소개·권리자 자료만 새 근거로 사용했다.
- `reviewedByHuman=false`
- 외부 자료 `retrievedAt`: `2026-08-25`
- Art, 이미지 캡처, 픽셀 판정, `motionImpact`는 이번 회차 범위가 아니다.
- `『』`·`「」`는 canonical title에 넣지 않았다.

Positions `3` (`インベスターZ`)와 `4` (`黄泉のツガイ`)는
`reviews/daybreak-text-blocker-adjudication-chunk-01.md`에서
`SOURCE_INFORMATION_UNAVAILABLE`가 이미 확정되어 재개방하지 않았다. Round 2/3의
승인·기각·소진 결론을 되돌리지 않았으며, terminal CSV·source·generated·registry·
promotion 상태도 변경하지 않는다. 이 파일은 연구 packet이다.

## Read-only attestation

| item | SHA-256 |
| --- | --- |
| repository HEAD | `a423c20add1162b7cdf71342a721ffcd7191d3c2` |
| candidate root (prior packet) | `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695` |
| `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| terminal `text-final-chunk-01.csv` | `dde01a78cb4ddfc5b51805e8828bc45ba83ab9f9d6ff77342ce504a7524369e7` |
| terminal `genres-final-chunk-01.csv` | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` |
| terminal `themes-final-chunk-01.csv` | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` |
| `PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` |
| Pass A `factors.csv` | `d49ca60fc5ebe84c5ca0b7665be613f3fd66682c0d25459edce9189254251511` |

## New proposal packet

이번 회차에서 기존 packet에 없던 공식 권리자 자료가 residual cell을 직접
사전 정의의 `0/2/4` 기준에 연결되는 경우만 제안했다. 새 proposal은 1건이다.

| pos | workId | canonicalTitle | kind | axisId | proposedState | proposedValue | confidence | status |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | --- |
| 8 | `work-0ede6921b81169dc2dda` | 不滅のあなたへ | axis | `progression` | known | `2` | `0.88` | provisional; independent adjudication required |

### Position 8 — 不滅のあなたへ / progression=2

| field | value |
| --- | --- |
| sourceName | 講談社マンガIPサーチ公式 — 不滅のあなたへ（２） |
| sourceUrl | https://cstation.kodansha.co.jp/mangaip/database/0000019946 |
| publishedAt | page 자체는 날짜를 노출하지 않음; 해당 volume 2 종이판 발매일 `2017-03-17`을 edition date로 함께 기록 |
| retrievedAt | `2026-08-25` |
| evaluatedRange | volume 2, entry volumes 1–3 범위 안 |
| exact observation | 공식 권리자 소개는 Fushi가 “刺激を受けながら成長していく”라고 명시하고, Parona가 March를 구하기 위한 “脱出計画を練っていた”고 설명한다. |
| paraphrase | 소녀들과의 첫 주요 arc에서 Fushi가 자극을 받아 성장하고, 동료가 구출 계획을 세우는 구체적 진행을 권리자 공식 소개가 직접 서술한다. |
| dictionaryAnchor | `progression=2`: gradual growth. `成長していく`는 성장의 존재를 직접 지시하지만, 여러 반복 보상 루프까지 증명하지 않으므로 `4`가 아닌 `2`만 제안한다. |
| decisionBoundary | 이 자료는 progression에만 사용한다. 탈출 계획 한 건은 `problemSolving`/`strategy`의 반복 핵심 메커니즘으로 일반화하지 않으며, 소녀들의 집단도 `relationshipStructure`로 확장하지 않는다. |
| evidenceConfidence | `0.88`; official rightsholder, volume-specific, entry-range bounded. The phrase directly supports gradual growth; whether one bounded volume synopsis satisfies the repository's terminal coverage contract must be decided by independent adjudication. |

이 제안은 Round 3의 “growth/acquisition은 lead이나 exact proposal/confidence 없음”을
반복하는 것이 아니다. Round 3의 Kodansha 상품 페이지와 달리, 이번 URL은 동일
권을 별도 권리자 IP 자료에서 다시 설명하며 `成長していく`라는 직접적인 성장
관찰과 권 단위 범위를 함께 제공한다. 그래도 terminal CSV에는 쓰지 않았다.

## New official routes inspected but no new valid cell

아래는 이번 회차에 처음 확인한 공식 route와 결과다. 이미 승인된 셀을 다시
제안하거나, 장르·홍보 문구·단일 사건을 residual Axis/Theme으로 변환하지
않았다. `publishedAt`이 `undated`인 경우 페이지가 날짜를 제공하지 않는다는
뜻이며, 추정일을 만들지 않았다.

| pos | sourceName | sourceUrl | publishedAt | bounded observation | result |
| ---: | --- | --- | --- | --- | --- |
| 1 | 講談社 モーニング公式 — チェーザレ作品ページ | https://morning.kodansha.co.jp/c/cesare | `undated` | 르네상스 역사·정확성·작품 세계 소개. 이미 known인 historical/world/strategy를 보강할 뿐 residual progression/problemSolving/mysteryReveal 또는 Tone의 직접 기준은 없음. | no new cell; residual set exhausted for this round |
| 2 | 小学館 ビッグコミックBROS — くーねるまるた 작품 페이지 | https://bigcomicbros.net/work/6203/ | `undated` | 마르타의 유학생활, 이웃 미오코와의 나눔, 인물 소개. 이미 known인 cooking/relationship/warmth를 보강할 뿐 residual Narrative/Tone 기준 없음. | no new cell |
| 2 | 小学館 ビッグコミックBROS — くーねるまるた 第2集 | https://bigcomicbros.net/comics/30443/ | `2013-05-30` | 계절 음식·이웃 나눔·일상적 즐거움을 소개하지만, `愉快`·`毎日笑って` 홍보 문구는 반복 comedy Axis의 직접 근거가 아님. | no new cell |
| 5 | 秋田書店 공식 작품 페이지 — ラーメン大好き小泉さん | https://www.akitashoten.co.jp/series/13421 | `undated` | “日々、至福の一杯を追い求める”라는 라멘 탐색·소비 전제. preparation/crafting이 아니므로 `cooking`을 재제안하지 않고, 목적지 나열만으로 `exploration`을 만들지 않음. | no new Theme or text Axis |
| 6 | 小学館 ビッグコミックBROS — 忘却のサチコ 第1集 | https://bigcomicbros.net/comics/30598/ | `2014-12-26` | 문예지 편집자, 결혼 파기 후 미식으로 망각을 찾는다는 공식 소개와 “絶品グルメ・コメディー”. 기존 comedy/mentalStress/pacing 문맥을 보강하지만 residual progression/problemSolving/strategy/mysteryReveal/worldBuilding/relationship/darkness/warmth를 닫지 않음. | no new cell |
| 7 | KADOKAWA 공식 상품 페이지 — 機動旅団八福神 3巻 | https://www.kadokawa.co.jp/product/200700003057/ | `2005-12-26` | volume 3의 ISBN·판본·BOOK☆WALKER trial 연결을 확인했으나 product page에는 residual Axis를 직접 설명하는 bounded synopsis가 없음. | no new cell |
| 8 | 講談社マンガIPサーチ公式 — 不滅のあなたへ（２） | https://cstation.kodansha.co.jp/mangaip/database/0000019946 | page `undated`; volume 2 edition `2017-03-17` | `成長していく`가 progression 후보를 생성. 탈출계획·동료 표현은 다른 Axis로 확장하지 않음. | one provisional cell above |

Positions `9`와 `10`에서는 새 route가 발견되지 않았다. 기존 Shogakukan
volume 1–3 URLs는 Round 1–3 packet에 이미 포함되어 있으므로 duplicate evidence로
재기록하지 않았다. Out-of-scope later-volume 자료도 사용하지 않았다.

## Exact exhaustion register

“소진”은 해당 회차에서 새롭고 범위가 맞으며 사전 기준을 직접 충족하는
근거가 더 이상 없다는 뜻이다. unknown을 `0`으로 바꾸지 않았고, 시간 부족이나
우선순위를 blocker 사유로 사용하지 않았다.

| pos | work | residual scope checked | round-4 disposition |
| ---: | --- | --- | --- |
| 1 | チェーザレ 破壊の創造者 | progression/problemSolving/mysteryReveal; characterArcWeight/comedy/darkness/mentalStress/romance/emotionalWarmth | Morning official work page는 역사·정치·세계 설명만 보강. 새 numeric cell 없음; residual 전체 `unknown` 유지. |
| 2 | くーねるまるた | progression/problemSolving/strategy/mysteryReveal/worldBuilding; characterArcWeight/comedy/romance | BROS work/vol2는 음식·계절·이웃·나눔만 보강. 새 numeric cell 없음; residual 전체 `unknown` 유지. |
| 3 | インベスターZ | final blocker position | prior `SOURCE_INFORMATION_UNAVAILABLE`를 재개방하지 않음; round-4 evidence 없음. |
| 4 | 黄泉のツガイ | final blocker position | prior `SOURCE_INFORMATION_UNAVAILABLE`를 재개방하지 않음; round-4 evidence 없음. |
| 5 | ラーメン大好き小泉さん | Theme; all residual Narrative/Tone | Akita official series page도 라멘 추구·소비만 확인. Round 3의 `cooking` 및 destination→`exploration` 기각을 유지; 새 cell 없음. |
| 6 | 忘却のサチコ | progression/problemSolving/strategy/mysteryReveal/worldBuilding/relationshipStructure/darkness/emotionalWarmth | BROS vol1은 이미 알려진 comedy/회복 전제를 보강할 뿐. 새 cell 없음; prior provisional warmth를 승격하지 않음. |
| 7 | 機動旅団八福神 | progression/problemSolving/strategy/mysteryReveal; characterArcWeight/comedy/mentalStress/romance/emotionalWarmth | KADOKAWA vol3은 서지·trial 연결만 추가. 새 cell 없음; weapon/war/political user-review 추론을 추가하지 않음. |
| 8 | 不滅のあなたへ | progression/problemSolving/strategy/mysteryReveal/worldBuilding; relationshipStructure/comedy/mentalStress/romance | `progression=2`만 provisional 제안. 나머지는 새 공식 자료가 직접 닫지 못함; `unknown` 유지. |
| 9 | よるくも | Theme; progression/problemSolving/strategy/mysteryReveal; comedy/romance/emotionalWarmth | 기존 공식 JDCN volume 1–3 route 외 genuinely new route 없음. Round 3의 `survival=2` 기각 및 intimacy→romance/warmth 비승격 유지; 새 cell 없음. |
| 10 | 高校球児 ザワさん | progression/problemSolving/strategy/mysteryReveal/worldBuilding; characterArcWeight/comedy/mentalStress/romance/emotionalWarmth | 기존 공식 JDCN volume 1–3 route 외 genuinely new route 없음. “dokidoki”→romance 및 training→progression 추론을 반복하지 않음; 새 cell 없음. |

## Adjudication handoff

1. `8/progression=2`의 공식 C-station volume-2 근거가 해당 batch의 terminal
   coverage 계약을 충족하는지 독립 검수한다.
2. 채택 시에도 `problemSolving`, `strategy`, `relationshipStructure`로
   전이하지 않는다.
3. 기각되면 이 packet은 새 terminal cell `0`건으로 해석하고 기존 unknown을
   그대로 유지한다.
4. Round 4는 terminal CSV, Factor Dictionary, recommendation 산식, validator,
   promotion gate를 변경하지 않았다.

## Verification

After writing this packet, run:

```bash
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-chunk-01-round-4.md
sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-chunk-01-round-4.md
```
