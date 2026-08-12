# G2 Catalog 주석 독립 패널 Cycle 5 종료 보고

## 결론

Cycle 5의 승격 판정은 **REVISE**다. Catalog 주석, `data/source`, 제품 UI, G2 제품 방향 및 Slice 5는 승인하지 않는다.

동결 identity는 `main`의 `e56f663ea602b09d52d3d1608a4f89bf8b3c3398`, 요청 SHA-256은 `39066eef87f659ef8cec96182a8787462c6c79f5edf62c65abd32c32cf4283e1`이다.

## 검토 경로

| 경로                | 실행                                                                  | 판정   | 승격 효력                                                                             |
| ------------------- | --------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| Local               | 공식 source 100/100, 정적 Art 100/100, motion 6/6을 실제 검사         | REVISE | 유효한 비승인                                                                         |
| Gemini 3.1 Pro High | 12 tool calls; browser/web/image 0, source·Art·motion 0/100·0/100·0/6 | GO     | INVALID, 효력 없음                                                                    |
| Grok 4.5 High       | Cursor `agent -p`로만 실행; 정적 Art 100/100과 motion 6/6은 실제 열람 | REVISE | 공식 source 100/100·150작품·1300셀 전수 주장이 trace보다 커 INVALID, 효력 없음        |
| GPT-5.6 Pro Oracle  | ChatGPT.com Pro에서 사용자 재개 후 실행; GitHub와 첨부 시각 번들 검사 | REVISE | 유효한 비승인. 스스로 repository bundle 0/5와 candidate pipeline 미재현을 FAIL로 보고 |

Grok은 Oracle로 사용하지 않았으며, Oracle은 `https://chatgpt.com/`의 GPT-5.6 Pro로만 실행했다.

## 독립 재현으로 확정된 다음 수정 범위

다음 여섯 항목은 현재 SSOT·공식 source·실제 이미지로 별도 재판정해 수정 대상으로 확정했다.

1. `welcome-to-the-ballroom.status`: `completed -> ongoing`
2. `historie` 대표 1권 `releaseDate`: `2004-10-22 -> 2004-10-21`
3. `i-think-our-son-is-gay.relationshipStructure`: `3 -> 2`
4. `my-brothers-husband.relationshipStructure`: `3 -> 2`
5. `she-loves-to-cook-and-she-loves-to-eat.foundFamily`: centrality `2 -> row absent`
6. `i-think-our-son-is-gay` Art: 현재 PASS로 재분류된 sheet는 실제로 Pixiv UI·공백·부분 crop·표지를 포함한다. 같은 공식 source에서 판독 가능한 내부 페이지 6장을 다시 확보해 manifest·sheet·ledger를 교체한다. 확보 전에는 세 정적 Art 축을 `unknown`으로 둔다.

## 자동 반영하지 않는 이견

- Local만 제기한 `requiem-of-the-rose-king`, `blue-period` Art lead와 Oracle만 제기한 추가 Art lead는 검토자 간 판정이 갈렸다. 다음 cycle에서 동일한 title/frontispiece 제외 기준과 더 늦은 대체 page를 사용해 별도 재검증한다.
- Grok의 `police-in-a-pod completed`, `REAL` 제목 교체, `GTO.workplace=1`은 공식 source·SSOT 재판정에서 기각했다.
- Grok이 추가한 다른 Art lead도 실행 trace 유효성 결함 때문에 자동 수정 근거로 쓰지 않는다.

## 경계

- 4/4 유효 GO가 없으므로 annotation promotion은 금지한다.
- 모델 검토는 사람 검수가 아니며 모든 evidence의 `reviewedByHuman=false`를 유지한다.
- 이 보고서는 Taste Engine 대 Baseline G2, 사람 10명 블라인드 테스트, `data/source`, UI 변경, 추천 산식 또는 Slice 5를 허가하지 않는다.
- 다음 단계는 위 확정 6건을 최소 완전 범위로 수정하고, disputed Art는 같은 제외 기준으로 재증거화한 뒤 새 hash-bound cycle을 여는 것이다.
