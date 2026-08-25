# Batch 005 text-gap recovery QA — chunk 01 round 2

## 범위와 attestation

- reviewer: Daybreak independent recovery QA
- reviewDate: `2026-08-25`
- frozen positions: `1–10` only
- scope: `entry_1_3_volumes` 또는 research packet이 명시한 더 좁은 first-major-episode 범위
- `reviewedByHuman=false`
- current candidate root SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- original research chunk SHA-256: `2390a3e9b6f57c48b109710728568d4eeb2f6d08416122f9f91b2e81b78909e0`
- Pass A factors SHA-256: `d49ca60fc5ebe84c5ca0b7665be613f3fd66682c0d25459edce9189254251511`
- Grok exact response SHA-256: `9a3e883d4c9c48445c48d06a0902834e502aa0ac45bd5e0ca539388183f57f0d`
- Grok ledger SHA-256: `a4b725b715f2341b3b8898710da25bbe60b77bfe9653b74b76c6f390994c52dd`
- terminal Pass C report SHA-256: `be2f7dbcad0f03306efd160fb8c17261c7b6175af0cefe68b9c4c774244c8271`
- round-2 recovery packet SHA-256: `63ba9983b6659c466ef7a0e9a667601efb3b9f5ec65caf936bdc39be7c75ca8e`

`PAYLOAD.sha256`의 17개 frozen payload 항목은 모두 재검증되어 `OK`였다. 이 QA는 Factor Dictionary, annotation guide, frozen packet, original research/Pass A, exact Grok response와 ledger, Daybreak Pass C, terminal chunk-01 CSV, round-2 recovery packet만 판정 입력으로 사용했다. 다른 batch, Gold, recommendation 결과, selection provenance, Art 추론은 사용하지 않았다.

## 판정 규칙

- 다수결이나 평균 없이 source authority, entry scope, 반복 관찰, Factor Dictionary anchor로 각 셀을 독립 판정한다.
- `ACCEPT`는 exact proposal을 terminal known/Genre로 물질화할 수 있다는 뜻이다.
- `UNKNOWN`은 제안 방향이 가능해도 현재 근거가 exact value 또는 centrality를 닫지 못한다는 뜻이며 terminal은 그대로 `unknown`/empty다.
- `CONFIRM UNKNOWN`은 recovery가 새 값을 제안하지 않은 residual을 다시 열지 않고 terminal unknown으로 유지한다는 뜻이다.
- synopsis silence는 known `0`이 아니다. Genre/retailer label은 Axis로 전환하지 않는다. Theme subject와 Theme mechanic을 구분한다.
- 기존 Pass C known 셀은 재심하지 않는다. Art 4축은 전부 `unknown`이며 이 QA의 대상이 아니다.

## source·scope·independence audit

- recovery ledger의 고유 URL `69`개를 모두 재확인했다. `68`개는 HTTP `200`, Kodansha volume-1 trial route 하나는 `302`였고 `4xx/5xx`는 없었다. 접근 가능성은 내용 적합성과 별개로 판정했다.
- position 6의 공식/공인 volume 1–3 소개는 각각 `グルメ・コメディー` 또는 `美食×旅コメディー`를 직접 반복한다. 1–3권을 명시한 Hatena 독립 리뷰도 사치코의 과도하게 진지한 행동과 음식 추구의 반복적 우스움을 구체적으로 설명한다. 이는 `comedy=2`에는 충분하고 상시 개그인 4까지는 지지하지 않는다.
- position 6 `emotionalWarmth=2`의 Cmoa 근거는 scope mapping이 불완전하다. recovery ledger는 named reviewer/date/reading range를 claim에 매핑하지 않았고, 현재 페이지에서 `ゆるやかに癒される`와 일치하는 리뷰는 `2025-08-08`로 노출되어 ledger의 열거 날짜와도 맞지 않는다. Hatena 1–3권 리뷰 하나는 개인 회복을 지지하지만, 두 번째 독립적이고 range-matched한 반복 관찰이 없어 셀을 닫지 않는다.
- position 9 BOOK☆WALKER volume-1 licensed page는 Genre 목록에 `SF`와 `ファンタジー`를 직접 표시한다. Shogakukan volume 1–3의 City/Fields/Forest 계층 세계와 비현실적 killer premise가 두 legal Genre를 내용상 함께 지지한다. 두 Genre는 배타적 후보가 아니므로 dictionary order인 `fantasy;scienceFiction`으로 수용한다. 이 label은 어떤 Axis에도 사용하지 않는다.
- position 9의 murder, abduction, escape, disposable-life wording은 위험과 계층 폭력을 지지하지만, entry 1–3에서 `survival`이 반복적 핵심 mechanic/reward라는 centrality 2까지 직접 보여 주지 않는다.
- position 10의 BookLive와 Sony review route는 서로 다른 domain이지만 동일한 Booklog 리뷰를 재배포한다. `ザワさんが主人公…` 등 같은 문장이 양쪽에 반복되어 독립 관찰 두 개로 셀 수 없다. Sony 페이지는 개별 review date도 노출하므로 recovery ledger의 `undated` 표기도 정확하지 않다. 공식 volume 3의 `どこか間の抜けた表情` 하나와 단일 독립 comedy 관찰만으로 entry 1–3의 `comedy=2` recurrence를 닫지 않는다.
- positions 1–5, 7–8의 새 source들은 기존 residual을 닫는 반복 mechanism을 추가하지 않았다. 공식 사건·설정, award/retailer label, review 인상을 Axis 0/2/4 또는 Theme centrality로 확장하지 않았다.

## position별 독립 판정

| pos | canonical title | proposal | QA | 근거 요약 |
| ---: | --- | --- | --- | --- |
| 1 | チェーザレ 破壊の創造者 | none | `CONFIRM UNKNOWN` | 정치·역사 구조는 기존 known 셀을 지지하지만 residual Narrative/Tone의 반복 anchor를 추가로 닫지 않는다. |
| 2 | くーねるまるた | none | `CONFIRM UNKNOWN` | 음식·이웃 일상은 기존 cells를 지지할 뿐, residual 성장·해결·전략·미스터리·로맨스를 affirmative 0 또는 known으로 만들지 않는다. |
| 3 | インベスターZ | legal Genre none | `CONFIRM UNKNOWN` | `金融/部活/歴史`는 product Genre enum의 direct legal tag가 아니다. Tone도 club/investment premise로부터 추론하지 않는다. |
| 4 | 黄泉のツガイ | none | `CONFIRM UNKNOWN` | 공격·이동·진영은 기존 pacing/world/darkness를 지지하지만 residual growth/strategy/Tone의 exact anchor는 아니다. |
| 5 | ラーメン大好き小泉さん | Theme none | `CONFIRM UNKNOWN` | 라멘 탐색·섭취는 `cooking` 준비 mechanic이 아니다. 좁은 first-major-episode 근거로 Narrative/Tone recurrence도 만들지 않는다. |
| 6 | 忘却のサチコ | `comedy=2` | `ACCEPT` | 공인 volume 1–3 소개가 comedy framing을 반복하고 1–3권 독립 리뷰가 구체적인 comic mismatch를 보강한다. |
| 6 | 忘却のサチコ | `emotionalWarmth=2` | `UNKNOWN` | 개인 회복 lead는 있으나 두 번째 독립 review의 exact scope/date/claim mapping이 없다. healing lead를 known 2로 승격하지 않는다. |
| 7 | 機動旅団八福神 | none | `CONFIRM UNKNOWN` | war/loss/team facts는 기존 combat/war/darkness를 지지하지만 residual strategy/stress/warmth 등의 직접 관찰은 아니다. |
| 8 | 不滅のあなたへ | none | `CONFIRM UNKNOWN` | `小さな進化`와 `新しい家族`는 제한된 TOC/premise이며 recurrence evidence가 아니다. 기존 unknown을 유지한다. |
| 9 | よるくも | Genre `scienceFiction` | `ACCEPT` | licensed volume-1 page의 direct `SF` label과 공식 1–3권의 invented stratified world가 legal Genre를 지지한다. |
| 9 | よるくも | Genre `fantasy` | `ACCEPT` | 같은 entry page의 direct `ファンタジー` label과 공식 setting이 legal Genre를 지지한다. Genre는 복수 허용이다. |
| 9 | よるくも | Theme `survival:2` | `UNKNOWN` | 생존 위험 사건은 있으나 survival mechanic의 반복 중심성 2는 직접 확정되지 않는다. |
| 10 | 高校球児 ザワさん | `comedy=2` | `UNKNOWN` | BookLive/Sony의 핵심 review block이 syndicated duplicate이고, 공식 소개만으로 comedy recurrence를 닫지 못한다. |

결과: 신규 proposal 6개 중 `ACCEPT 3`, `UNKNOWN 3`. 새 값을 제안하지 않은 7개 position의 residual은 `CONFIRM UNKNOWN`이다.

## materialized terminal changes

허용된 두 terminal row만 바꾸고 themes는 byte-identical하게 보존했다.

| file | exact old cell | exact new cell |
| --- | --- | --- |
| `adjudication/text-final-chunk-01.csv` | `work-0dabd1d17e5fcf2992b9,comedy,unknown,,,ev-batch-005-a-work-0dabd1d17e5fcf2992b9` | `work-0dabd1d17e5fcf2992b9,comedy,known,2,0.78,ev-batch-005-a-work-0dabd1d17e5fcf2992b9` |
| `adjudication/genres-final-chunk-01.csv` | `work-0eff8190c0c6ff604527,` | `work-0eff8190c0c6ff604527,fantasy;scienceFiction` |
| `adjudication/themes-final-chunk-01.csv` | no change | no change |

| file | old SHA-256 | new SHA-256 | rows excluding header |
| --- | --- | --- | ---: |
| `adjudication/text-final-chunk-01.csv` | `4905ce2a2336323ad7c3573ed0df38d2a8b1fce26c80a0e170fc9568ff8376d6` | `dde01a78cb4ddfc5b51805e8828bc45ba83ab9f9d6ff77342ce504a7524369e7` | 170 |
| `adjudication/genres-final-chunk-01.csv` | `20cf598439f4d2ba363a1e220afe6fb26706c40f6efb26abdd75996f177171c9` | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | 10 |
| `adjudication/themes-final-chunk-01.csv` | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | 11 |

검증 결과 text는 frozen position 순서의 정확한 `10 × 17 = 170` rows이고, 각 work의 Axis는 dictionary order다. 모든 text/theme evidence ID는 `ev-batch-005-a-{workId}`이고, known/unknown 필드 shape, legal Genre/Theme IDs, Theme centrality `1|2`, Genre와 work row 순서가 모두 통과했다.

## gate recount

Coverage minimum은 Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`, Art `2/4`다.

| pos | G | Th | Narrative | Tone | Art | remaining text deficiency |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 1/1 | 1/1 | 3/6 | 1/7 | 0/4 | N+1, T+4 |
| 2 | 1/1 | 1/1 | 1/6 | 4/7 | 0/4 | N+3, T+1 |
| 3 | 0/1 | 1/1 | 4/6 | 0/7 | 0/4 | G+1, T+5 |
| 4 | 1/1 | 1/1 | 3/6 | 2/7 | 0/4 | N+1, T+3 |
| 5 | 1/1 | 0/1 | 0/6 | 0/7 | 0/4 | Th+1, N+4, T+5 |
| 6 | 1/1 | 1/1 | 1/6 | 4/7 | 0/4 | N+3, T+1 |
| 7 | 1/1 | 1/1 | 2/6 | 2/7 | 0/4 | N+2, T+3 |
| 8 | 1/1 | 1/1 | 1/6 | 3/7 | 0/4 | N+3, T+2 |
| 9 | 1/1 | 0/1 | 2/6 | 4/7 | 0/4 | Th+1, N+2, T+1 |
| 10 | 1/1 | 1/1 | 1/6 | 2/7 | 0/4 | N+3, T+3 |

| scope | Genre pass | Theme pass | Narrative pass | Tone pass | Art pass | all non-Art text gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| chunk 01 before | 8/10 | 8/10 | 1/10 | 0/10 | 0/10 | 0/10 |
| chunk 01 after | 9/10 | 8/10 | 1/10 | 0/10 | 0/10 | 0/10 |
| positions 1–20 after, chunk 02 unchanged | 19/20 | 17/20 | 1/20 | 3/20 | 0/20 | 0/20 |

Position 6 Tone은 `3/7 → 4/7`, position 9 Genre는 `0/1 → 1/1`이다. 어느 work도 모든 non-Art text gate를 새로 통과하지 않으며, `TEXT_GATE_FAIL`과 Art `unknown` 경계는 그대로다.

## non-mutation boundary

- original research, Pass A, frozen packet, manifest, payload ledger, source/provenance registry, Art, identity, safety, eligibility, generated catalog, overlay, status, promotion 파일은 편집하지 않았다.
- candidate root와 `reviewedByHuman=false`는 그대로다.
- source promotion, overlay build, catalog promotion, commit은 수행하지 않았다.
