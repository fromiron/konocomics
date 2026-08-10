# Slice 3 Baseline·설명·CLI 계약 패널 결과

## 최종 결과

**GO — 3/3 만장일치**

- 심사 번들: `slice3-contract-panel-request.md`
- SHA-256: `fc87c07f60b770964706de41ebe1a0f0c850d3d344d3a1ca9635d6ee8bb6f4fd`
- 심사 프롬프트: `slice3-contract-panel-prompt.md`
- 판정일: 2026-08-11 JST

## 최종 독립 판정

### Codex 서브에이전트 — gpt-5.6-sol high

```text
GO
- baseline validity: PASS
- comparison fairness: PASS
- explanation grounding: PASS
- determinism and privacy: PASS
- minimality: PASS
```

### `agy -p` — gemini-3.6-flash-high, effort high

```text
GO
- baseline validity: PASS
- comparison fairness: PASS
- explanation grounding: PASS
- determinism and privacy: PASS
- minimality: PASS
```

### `agent -p` — cursor-grok-4.5-high, non-fast

```text
GO
- baseline validity: PASS
- comparison fairness: PASS
- explanation grounding: PASS
- determinism and privacy: PASS
- minimality: PASS
```

## 반복 이력

만장일치 규칙에 따라 한 심사자라도 REVISE이면 번들을 수정하고 세 심사를 처음부터 반복했다.

1. Genre overlap 0 후보의 anchor cap과 실험 policy 범위를 닫고, 불호 source가 근거 Anchor로 노출되지 않게 했다.
2. Baseline contribution group·reason template·version과 q12/escape 직렬화를 고정했다.
3. positive reason과 caution이 같은 group/cluster에서 경쟁할 때 절댓값이 큰 근거가 생존하도록 만들었다.
4. 전역 최대 음수 similarity만 caution 후보가 되고, 충돌 시 더 약한 음수로 백필하지 않게 했다.
5. Genre template의 제목 resolve 분기, cluster label 우선, Taste-only confidence 범위를 고정했다.
6. template placeholder를 단일 비재귀 pass로 고정한 최종 번들이 3/3 GO를 받았다.

## 적용 범위

- Baseline `v1`은 Genre 0.60 / Bayesian 0.30 / maturity 0.10의 실험 전용 control이다.
- Taste/Baseline은 동일 후보·hard exclusion·기본 리스트 제약을 공유하고 Slice 3 profile의 policy는 모두 false다.
- 설명과 evidence Anchor는 렌더링된 실제 contribution identity에서만 생성한다.
- CLI는 결정론적 Markdown·strict JSON 경계·로컬 개인정보 격리 계약을 따른다.
- holdout·승패·블라인드 지표는 계획대로 Slice 4에 남긴다.
