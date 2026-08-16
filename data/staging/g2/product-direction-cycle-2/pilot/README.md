# G2 synthetic browser pilot — product-direction cycle 2

이 디렉터리는 `fromiron/konocomics`의 수정된 설명 방향 계약과 승인된 150작품 카탈로그를 사용해 실제 `/synthetic-pilot/` 정적 UI에서 수행한 browser → download → aggregate 왕복 증거다.

이 결과는 인간 응답이나 인간 선호 지표가 아니다. 정상적인 authoritative readback은 human `0`, synthetic pilot `1`, verdict `INCOMPLETE`, 다섯 인간 GO 기준 `NOT_RUN`이다. 이 pilot만으로 G2나 Slice 5를 승인하지 않는다.

## 실행 identity

- Repository: `fromiron/konocomics`
- Branch: `agent/promote-approved-catalog`
- Code HEAD: `1de02b59f11999f49f646ce905fa4e330c9bceb2`
- Code tree: `3c7ea0227f43b72c490fe539436e7d037c061d4e`
- Catalog version: `v1-83f85ca42c87`
- Browser: Google Chrome `151.0.7922.137`
- Browser executable: `/usr/bin/google-chrome`
- Viewport: `1440×1000`
- Served entry: `http://127.0.0.1:4173/synthetic-pilot/`
- Fresh temporary execution root: `/tmp/konocomics-g2-pilot-cycle2.AVsKq9`
- Preserved runner SHA-256: `42a5cf59ea5ad7992e3ba515c8f62fcfab6fe97fca3604f18f3727b99f997d96`

## 실제 control flow

1. `harness/out`을 localhost 정적 서버로 제공했다.
2. 실제 실행 경로 `/tmp/konocomics-g2-pilot-cycle2.AVsKq9/run-browser-pilot.mjs`가 새 Chrome context에서 `/synthetic-pilot/`을 열었다. 이 실행본은 보존된 `browser/run.mjs`와 byte-identical하다.
3. `input[type=text]`에 가명 participant ID를 `fill`하고 `input[type=file]`에 `input/pilot-browser-one-profile.json`을 `setInputFiles`했다.
4. pre 단계에서 실제 radio input을 `check`하고 submit button을 `click`했다.
5. after 단계에서 실제 radio input을 `check`하고 final submit button을 `click`했다.
6. complete 단계에서 브라우저 `download` event를 기다린 뒤 결과 버튼을 `click`하고 원본 JSON을 `output/konocomics-g2-pilot-browser-one.json`으로 저장했다.
7. 다운로드 원본을 편집하지 않고 `TEMP=/tmp TMP=/tmp TMPDIR=/tmp pnpm --silent g2:aggregate -r <result> -o <report>`에 두 번 입력했다. 브라우저 실행도 같은 `/tmp` 환경 접두사를 사용했다.

React state 주입, `checked` 직접 대입, test-only route, 결과 JSON 손편집, browser storage, 외부 network는 사용하지 않았다. `page.evaluate`는 DOM·attribute·storage를 읽는 blinding audit에만 사용했다.

## Authoritative readback

- A/B occurrences: `20` (`10 + 10`)
- Distinct pre-response works: `16`
- Shared pre responses: `4`
- After responses: `20`
- Explanation agreements: `20`
- 수정된 낮은 코미디 문장: `「ギャグ・コメディ」が控えめな点が、あなたの好みに合う作品です。`
- 수정 문장 occurrences: `3`
- 기존 방향 없는 문장 occurrences: `0`
- Downloaded result SHA-256: `98429bdd94a864cc2e29a2edf48971ed0ab38983fa4f6b98c01d60d0806bddb8`
- Aggregate SHA-256, both runs: `98db33b126521e3bce9f7ce58bed76f08e4175149ed0f147d06585061f6c3e60`
- Aggregate outputs: byte-identical
- Human: `0`
- Synthetic pilot: `1`
- Verdict: `INCOMPLETE`
- Five human GO criteria: all `NOT_RUN`

## Blinding and runtime evidence

- `browser/before-ready.html`과 `.aria.txt`는 모든 pre 응답을 완료하고 확정하기 직전에 캡처했다.
- `browser/after-ready.html`과 `.aria.txt`는 모든 after 응답을 완료하고 최종 제출하기 직전에 캡처했다.
- 두 체크포인트 모두 각각 렌더링된 목록과 동일한 A/B 원제목·순위를 유지했다.
- 두 체크포인트 모두 engine mapping, score, confidence, best-anchor, contribution metadata, penalty, market snapshot, maturity, catalog role, download control, query/hash, JSON-LD, cookie, local/session storage, CacheStorage, IndexedDB entry가 없었다.
- engine mapping은 complete 단계 debrief에서만 나타났다.
- 모든 application document, JavaScript, stylesheet 요청은 localhost에서 성공했다. 정적 서버에는 비차단 `favicon.ico` `404` 하나만 기록됐고 application asset 또는 data 요청 실패는 없었다.
- `browser/evidence.json`은 구조화된 interaction/readback 기록이고, `browser/static-server.txt`는 격리된 단일 실행의 서버 ledger다.

`output/aggregate-1.md`와 `output/aggregate-2.md`는 결정론적 byte equality를 입증하기 위한 의도적 중복이다. 어느 것도 인간 GO 보고서로 취급하지 않는다.
