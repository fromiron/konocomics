# 승격 방법론 운영 보충

적용일: `2026-08-26`

이 문서는 `01-promotion-method.md`의 `promotion-evidence-v3` 대량 처리 순서와 판정원 역할을 명시한다. Factor Dictionary의 값 기준, `unknown`·추천 산식, Gold 150, safety·identity gate는 그대로이며 Art는 선택 축이다.

## 선택 이미지 경로의 출판사별 재사용

이미지 경로를 선택한 경우 미리보기 접근은 `data/staging/catalog-expansion/art-source-route-registry.csv`의 검증된 출판사별 경로에서 시작한다. 같은 출판사를 작품마다 다시 검색하지 않고 `공식 상품 → 공식 또는 상품이 직접 연결한 정식 유통 미리보기`를 재사용한다. 작품별로는 frozen 판본 연결과 표본 gate만 다시 확인하며, 경로 실패·판본 충돌만 예외 조사 큐로 보낸다.

초반 1–3권의 각 판본이 모두 공식 상품과 직접 연결되면, 같은 Work의 여러 초반 권에서 확인한 판독 가능 본문 페이지를 합산할 수 있다. 그러나 총 6쪽 이상·서로 다른 장면 맥락 2개 이상은 유지하고, 권별 ISBN·JDCN·판본 연결과 페이지 SHA-256을 각각 남긴다.

## 모델 역할

- Luna xhigh subagent는 공식 홍보문구와 독립 JP/KR 커뮤니티 근거를 수집한다. 이미지 경로가 선택된 작품에만 출판사 경로 재사용, 공식 상품·미리보기 연결, 임시 페이지 캡처와 SHA-256 수집을 수행한다. 주석 값이나 승격 여부는 결정하지 않는다.
- Daybreak Blue는 이미지 경로에서 Luna 산출물의 판본 연결, 표본 gate, 픽셀·해시, Local Art 제안을 독립 검증한다. 단독으로 Local Codex와 Gemini의 이미지 Art 정족수를 대체하지 않는다.
- Cursor Grok 4.6 High non-fast는 Factor·Theme·identity·safety와 커뮤니티 근거를 검수하고, 픽셀 접근을 입증하지 못한 이미지 경로 Art에서만 기권한다.

커뮤니티 경로는 정확한 제목·검색어·URL·작성 주체·날짜·entry 범위·독립성·반복 관찰을 원장에 남긴다. 이미지와 커뮤니티 경로는 동급이며 함께 요구하지 않는다. 이 운영 보충은 기존 batch candidate 정체성을 바꾸지 않으며 새 판정 아티팩트는 해당 batch의 별도 원장과 SHA-256으로 동결한다.
