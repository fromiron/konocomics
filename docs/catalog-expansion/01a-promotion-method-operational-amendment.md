# 승격 방법론 운영 보충

적용일: `2026-08-24`

이 문서는 `01-promotion-method.md`의 `promotion-evidence-v2` 계약을 바꾸지 않고 대량 처리 순서와 판정원 역할만 명시한다. Factor Dictionary, `unknown`·coverage, 추천 산식, Gold 150, safety·identity·promotion gate는 그대로다.

## 출판사별 Art 경로 재사용

미리보기 접근은 `data/staging/catalog-expansion/art-source-route-registry.csv`의 검증된 출판사별 경로에서 시작한다. 같은 출판사를 작품마다 다시 검색하지 않고 `공식 상품 → 공식 또는 상품이 직접 연결한 정식 유통 미리보기`를 재사용한다. 작품별로는 frozen 판본 연결과 표본 gate만 다시 확인하며, 경로 실패·판본 충돌만 예외 조사 큐로 보낸다.

초반 1–3권의 각 판본이 모두 공식 상품과 직접 연결되면, 같은 Work의 여러 초반 권에서 확인한 판독 가능 본문 페이지를 합산할 수 있다. 그러나 총 6쪽 이상·서로 다른 장면 맥락 2개 이상은 유지하고, 권별 ISBN·JDCN·판본 연결과 페이지 SHA-256을 각각 남긴다.

## 모델 역할

- Luna xhigh subagent는 출판사 경로 재사용, 공식 상품·미리보기 연결, 임시 페이지 캡처와 SHA-256 수집만 담당한다. 주석 값이나 승격 여부는 결정하지 않는다.
- Daybreak Blue는 Luna 산출물의 판본 연결, 표본 gate, 픽셀·해시, Local Art 제안을 독립 검증한다. 단독으로 Local Codex와 Gemini의 최소 Art 정족수를 대체하지 않는다.
- Cursor Grok 4.6 High non-fast는 비작화 Factor·Theme·identity·safety를 검수하고, 픽셀 접근을 입증하지 못한 Art에서 기권한다.

이 운영 보충은 기존 batch candidate 정체성이나 승인된 overlay를 재서명하지 않는다. 새로 수집된 페이지·판정 아티팩트는 해당 batch의 별도 원장과 SHA-256으로 동결한다.
