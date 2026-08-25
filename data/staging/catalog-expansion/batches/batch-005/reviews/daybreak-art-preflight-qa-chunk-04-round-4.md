# Batch 005 Art preflight 독립 결속 재-QA — chunk 04 round 4

- 검수 범위: round 3 이후 ledger SHA 결속 교정만
- 검수일: `2026-08-25`
- reviewedByHuman: `false`
- 전체 판정: **PASS**
- downstream Art panel 승인: **가능**
- Art 값 부여: `none`
- 현재 `preflight.csv` SHA-256:
  `a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7`
- 현재 `ledger.md` SHA-256:
  `f10dda88943066dcfb4fdcd92b863b338cca9a184f27947440d5af990415323c`
- round 3 QA SHA-256:
  `6374819416a47a2371b53a54f4451e0badaf3512695e36bc3471a73914ae6245`

## Binding-only 확인

입력 전체와 픽셀 판정을 반복하지 않았다. Round 3가 결속한
`preflight.csv` SHA는 그대로
`a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7`이며,
현재 `ledger.md`의 `preflightCsvSha256` 값도 정확히 같은 SHA다. Round 3에서
발견한 이전 값 `406b754f22acf55971ceaa93caefde3589fceb72d389c33b926665d737f8f6e9`는
현재 ledger 결속 필드에 남아 있지 않다.

Round 3 보고서 자체의 SHA도 변하지 않았다. 따라서 그 보고서가 독립
재계산한 다음 결과를 그대로 승계할 수 있다.

- frozen positions 31–40 작품 판정: `PASS 10 / FAIL 0`
- 실제 임시 이미지 SHA: `48/48` 일치
- 누락 `0`, mismatch `0`, 중복 hash `0`
- position 35 `reader-page-010` SHA:
  `a4dafabef698ded2500aaea28819fc2827010e6e4d5459c4fec0de48e0f7dc4a`
- position 35: static gate false, motion gate true, state unknown-ready 조합
  일관

Round 3의 유일한 실패였던 stale ledger binding이 현재 SHA로 교정됐으므로
추가 픽셀 수집이나 작품 재판정 없이 chunk 04 preflight를 최종 PASS로
종결한다. Local/Gemini 패널은 sample-ready static 작품과 position 35의
motion-only 범위를 정확히 유지해 진행할 수 있다.

이 QA는 preflight, ledger, source, promotion, terminal Factor를 수정하지
않았고 `reviewedByHuman=false`를 유지한다.
