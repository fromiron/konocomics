# Batch 005 Art preflight 독립 재검수 — chunk 01 round 2

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions `1–10`
- overallVerdict: `PASS`
- work-level results: `PASS 10 / FAIL 0`
- Art values assigned: `none`

## 결속·무결성 검증

- 현재 root는 `main@a423c20add1162b7cdf71342a721ffcd7191d3c2`다. `pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`가 통과했고 candidate `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`가 독립 재산출됐다.
- manifest SHA-256은 `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`, `PAYLOAD.sha256` SHA-256은 `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`, frozen-work-set SHA-256은 `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`이며 현재 packet과 일치한다.
- 교정된 preflight SHA-256은 `6d6ba98891618f57360849c924e9cd73ce64795c8d3e70f3a96799d021fb7e4d`, ledger SHA-256은 `50f18b1f93d6620650f84fdedf38c4fe51985fdee45250b11740cd50585f3df4`다. ledger의 `preflightCsvSha256`은 교정된 CSV와 일치한다.
- preflight는 정확히 17열·10행이고 frozen positions 1–10의 순서와 `workId`가 모두 일치한다. `pageRefs` 수, `temporarySampleSha256` pair 수, `readableInternalPageCount`도 각 행에서 일치한다.
- retained `pageRef=SHA-256` pair는 정확히 43개이며 digest도 43개 모두 고유하다. `/tmp/konocomics-batch005-art-chunk01`의 대응 원본 파일에서 SHA-256을 다시 계산해 `43/43` 일치함을 확인했다.
- 43개 retained 파일을 모두 원본 픽셀로 열어 검사했다. 전부 판독 가능한 manga body page이고, 이전 QA에서 지적한 front matter·홍보 splash·blank/logo·chapter/title opening은 retained 표본에서 제거됐다.

## 이전 FAIL 교정 확인

| Pos | 교정 사항 | 재검수 |
| --: | --- | --- |
| 1 | `reader-step-07` front matter 제거, `5/3`, static false, `unknown-ready` | **PASS** |
| 2 | 실제 두 맥락인 temple/residential approach와 apartment interior/threshold로 `6/2` 정정 | **PASS** |
| 6 | wedding reception/bridal preparation 한 맥락으로 `6/1`, static false, `unknown-ready` 정정 | **PASS** |
| 7 | ceremony/interior와 orbital-strike/cutaway의 `6/2`, frozen vol.9 bridge 부재를 분리 기록 | **PASS** |
| 8 | canvas 4–6 제거 후 같은 공식 episode의 body canvas 7–12를 고정해 `6/2` 충족 | **PASS** |
| 9 | restaurant closing/meal-conversation 한 맥락으로 `6/1`, static false, `unknown-ready` 정정 | **PASS** |
| 10 | `reader-step-04` title opening 제거 후 `2/2`, static false, `unknown-ready` 유지 | **PASS** |

이전 retained pair 중 아래 다섯 개는 현재 CSV와 43개 digest 집합에 존재하지 않는다.

- position 1 `reader-step-07=7b9c3b583cb54bf0f664be110519a59ec70dedc0b2580ea2aa4ed44935f9be88` — `PREMESSA` 산문 front matter
- position 8 `episode-1-canvas-4=2d9446d285688eed5bc48e6f25b3446d0d7198b2ca7c3f9d0e623896337da587` — 홍보 splash
- position 8 `episode-1-canvas-5=318aacc247b63f18f89ca2f445c961af67860369a6e3a113576042e31cd518d0` — blank/logo
- position 8 `episode-1-canvas-6=54cfcf6985e41e630827f4755c5026206a7bd8eee5467810b2608f763ec7ed6b` — chapter/title opening
- position 10 `reader-step-04=5798748abd29e84c89e917b56693d817483b4a457983e3cf5de58bc9e15587aa` — chapter/title opening

## 작품별 판정

| Pos | workId | 작품 | 검증 pages / contexts | 검증 state | QA | 근거 |
| --: | --- | --- | ---: | --- | --- | --- |
| 1 | `work-060a72fe10cf6ba9cbfc` | チェーザレ 破壊の創造者 | 5 / 3 | `unknown-ready` | **PASS** | five body pages만 남아 6쪽 gate 미달이다. |
| 2 | `work-076beb86f844b642beef` | くーねるまるた | 6 / 2 | `sample-ready` | **PASS** | temple/residential approach와 apartment interior/threshold 두 맥락의 body page 6쪽이다. |
| 3 | `work-091d231d37f037fb07e8` | インベスターZ | 0 / 0 | `unknown-ready` | **PASS** | 공식 product에 work-specific internal trial route가 없다. |
| 4 | `work-0cf463005cc77eeded8e` | 黄泉のツガイ | 6 / 4 | `sample-ready` | **PASS** | title splash를 제외한 공식 first-episode body page 004–009가 네 맥락을 포함한다. |
| 5 | `work-0d1ad77728a44df56508` | ラーメン大好き小泉さん | 0 / 0 | `unknown-ready` | **PASS** | publisher-linked internal preview가 없고 promotion/product identity만 존재한다. |
| 6 | `work-0dabd1d17e5fcf2992b9` | 忘却のサチコ | 6 / 1 | `unknown-ready` | **PASS** | 여섯 쪽 모두 같은 wedding-reception/bridal-preparation 장면이다. |
| 7 | `work-0ebf010ac12b9b60d80e` | 機動旅団八福神 | 6 / 2 | `unknown-ready` | **PASS** | vol.1 sample은 유효하지만 frozen 대표 vol.9 exact bridge가 없어 static gate를 닫았다. |
| 8 | `work-0ede6921b81169dc2dda` | 不滅のあなたへ | 6 / 2 | `sample-ready` | **PASS** | 공식 Pocket episode의 canvas 7–12가 snowy wilderness와 inhabited/human 두 맥락의 body page 6쪽을 제공한다. |
| 9 | `work-0eff8190c0c6ff604527` | よるくも | 6 / 1 | `unknown-ready` | **PASS** | 여섯 쪽 모두 같은 restaurant closing/meal-conversation 장면이다. |
| 10 | `work-12b484cd79bfe6852ea1` | 高校球児 ザワさん | 2 / 2 | `unknown-ready` | **PASS** | title opening 제거 뒤 official reader endpoint까지 body page가 두 쪽뿐이다. |

## Motion gate

43개 retained page 어디에도 한 동작의 exact start·development/impact·resolved endpoint가 함께 보존된 연속 시퀀스가 없다. 모든 행의 `motionGateAttemptable=false`는 정확하며, downstream에서도 `motionImpact`는 이 표본으로 known 처리할 수 없다.

## Downstream authorization

- positions `2`, `4`, `8`은 exact edition bridge·body page 6쪽·서로 다른 장면 맥락 2개 이상을 충족하므로 정적 Art 3축의 Local/Gemini 판정 bundle 생성으로 진행해도 된다.
- positions `1`, `3`, `5`, `6`, `7`, `9`, `10`은 재현 가능한 preflight 한계가 확정됐으므로 Art 4축을 `unknown`으로 종결해도 된다. 이 unknown은 promotion blocker가 아니다.
- 모든 position의 `motionImpact`는 `unknown`으로 종결한다. 이 QA는 어떤 Art 값·confidence·promotion blocker도 생성하지 않았다.

## 종합 판정

**PASS.** 이전 QA의 일곱 교정 지시가 모두 반영됐다. retained 43개 원본·해시·본문성, state 전이, context 수, edition boundary, motion flag가 서로 일치한다. chunk 01 Art preflight는 positions 2·4·8의 정적 Art 판정과 나머지 작품의 명시적 Art unknown 종결을 진행할 수 있다.
