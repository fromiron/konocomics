# Slice 4 / G2 블라인드 테스트 계약 패널 결과

## 최종 결과

**GO — 4/4 만장일치**

- 최종 심사 번들: `slice4-contract-panel-request.md`
- SHA-256: `32f944749ec7f54e188f78dd6a05534d145967b447bd7bb0f398915541dc6e5b`
- 판정 시각: 2026-08-12T12:27:43+09:00
- review HEAD: `2e4c5141a14966f1b3f5d706ec5ef9fb33b5b66a`

## 최종 독립 판정

| Reviewer | 실행 identity | 원문 | SHA-256 | 판정 |
| --- | --- | --- | --- | --- |
| Local | Codex subagent, `gpt-5.6-sol`, effort high | `slice4-contract-local-response.md` | `3f46285a88ca8b499fa935ab00e02dc8b46168fd170d25d47f09dd294cbf1772` | GO |
| Gemini | `agy -p`, `gemini-3.6-flash-high`, effort high | `slice4-contract-gemini-response.md` | `3f46285a88ca8b499fa935ab00e02dc8b46168fd170d25d47f09dd294cbf1772` | GO |
| Grok | `agent -p`, `cursor-grok-4.5-high`, non-fast | `slice4-contract-grok-response.md` | `3f46285a88ca8b499fa935ab00e02dc8b46168fd170d25d47f09dd294cbf1772` | GO |
| Oracle | Signed-in ChatGPT in Microsoft Edge 151 via CDP `127.0.0.1:9222`; visible model `GPT-5.6 Sol`, visible reasoning `Pro` | `slice4-contract-oracle-response.txt` | `3f46285a88ca8b499fa935ab00e02dc8b46168fd170d25d47f09dd294cbf1772` | GO |

Oracle conversation: `https://chatgpt.com/c/6a7be566-5578-83ee-9076-89ca53554171`

과거 핸드오프는 Oracle 설정을 합성 표기 `GPT-5.6 Pro`로 적었지만 현재 ChatGPT UI는 model과 reasoning을 분리한다. 화면에는 performance slider가 `Pro, 5개 중 5번째`로 표시됐고 model row는 `GPT-5.6 Sol`, reasoning row는 `Pro`였다. 위 표는 현재 UI의 model/reasoning 값을 그대로 기록하며 다른 모델 identity를 소급 주장하지 않는다.

최종 네 응답의 verbatim text는 같다.

```text
GO
- comparison fairness: PASS
- blinding and survey cardinality: PASS
- metrics and gate semantics: PASS
- canonical boundary and determinism: PASS
- provenance honesty: PASS
- architecture and minimality: PASS
```

## 수정 이력

만장일치 규칙에 따라 최종 GO 전에 발견한 모순을 수정하고 모든 리뷰를 새 해시로 다시 실행했다.

1. 최초 번들 `b87d66c094bf15c981deec903c50d9b2e7f62778b2d30660328343f6adee9335`에서 Local reviewer가 distinct-work pre 응답과 participant-level listPreference의 cardinality 충돌을 지적했다.
   - 원문: `slice4-contract-local-revise-1.md`
   - SHA-256: `4ec3bf5844ca61f1db5a3b3eebb237866183cc20adc0d04e4fabf3510dc95087`
2. 수정 번들 `87d6aaf4b8ce2d830f5d197c587d850dec880e2d6e954b3fec3dc9bd72149e7d`에서 Local reviewer가 human/pilot respondent를 의도된 browser surface로 고정하는 진입점이 없음을 지적했다.
   - 원문: `slice4-contract-local-revise-2.md`
   - SHA-256: `e982ff9ec415a88eead5a857341afdac52078e207e9a1c46da6333de071e68e1`
3. `/human/`과 `/synthetic-pilot/` 정적 진입점을 추가한 최종 번들 `32f944...`이 네 reviewer 모두에게서 조건 없는 GO를 받았다.

## 동결 범위

- G2 profile ingress, 6~10 anchor, deterministic 1~2 holdout, native Top 10, deterministic A/B mapping.
- pre/after blinding과 overlap cardinality, exact Japanese 1~5 scale, final-submit 전 비밀 정보 차단.
- strict canonical result JSON, artifact identity, cross-field engine recomputation과 tamper rejection.
- 사용자별 승패, Unknown WTR, Explanation Agreement/Lift, Disliked Leakage@10, Holdout Recall@10의 exact numerator/denominator/tie/null 규칙.
- 정확히 10명 human path와 가짜 participant row가 없는 user-authorized model-panel path의 분리.
- 별도 local-only static `harness/`, 단일 wizard, 순수 G2 domain logic, aggregate CLI, 기존 dependency/code reuse.
- harness UI E2E/visual automation은 제외하되 순수 계약·지표·aggregator boundary test와 실제 browser pilot round-trip은 필수.

이 GO는 **Slice 4 계약 동결 승인**이다. 아직 150작품 확장, 하니스 구현, G2 evidence GO 또는 제품 UI Slice 5를 승인하지 않는다.

## 다음 Oracle 심사 프롬프트 규칙

G2 evidence 심사부터 Oracle 프롬프트는 프로젝트를 `konocomics (fromiron/konocomics)`로 식별하고 실제 검토 branch와 HEAD를 명시한다. 또한 사용 가능한 GitHub 도구/커넥터가 live repository, PR, checks와 관련 맥락을 직접 확인할 수 있음을 알려 로컬 첨부 evidence와 GitHub 상태를 함께 검토하게 한다. 이 규칙은 다른 branch·HEAD를 현재 artifact로 오인하게 하거나 첨부 hash 검증을 생략하게 하지 않는다.
