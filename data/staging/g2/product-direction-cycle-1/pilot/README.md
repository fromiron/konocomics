# G2 synthetic browser pilot

이 디렉터리는 승인된 150작품 카탈로그를 사용해 실제 `/synthetic-pilot/` 정적 UI에서 수행한 browser → download → aggregate 왕복 증거다.

이 결과는 인간 응답이나 인간 선호 지표가 아니다. 정상적인 authoritative readback은 human `0`, synthetic pilot `1`, verdict `INCOMPLETE`, 다섯 인간 GO 기준 `NOT_RUN`이다. 이 pilot만으로 G2나 Slice 5를 승인하지 않는다.

## 실행 identity

- Repository: `fromiron/konocomics`
- Branch: `agent/promote-approved-catalog`
- Code HEAD: `5773b74ff19a717db9e08068ce0fd0241c84fbe8`
- Code tree: `dfd16d86a081f71668dffa6d9c79f977494a3e4a`
- Catalog version: `v1-83f85ca42c87`
- Browser: Google Chrome `151.0.7922.137`
- Browser executable: `/usr/bin/google-chrome`
- Viewport: `1440×1000`
- Served entry: `http://127.0.0.1:4173/synthetic-pilot/`

## 실제 control flow

1. `harness/out`을 localhost 정적 서버로 제공했다.
2. 실제 실행 경로 `/tmp/konocomics-g2-pilot.fjIE7t/run-browser-pilot.mjs`가 새 Chrome context에서 `/synthetic-pilot/`을 열었다. 이 실행본은 보존된 `browser/run.mjs`와 byte-identical하다.
3. `input[type=text]`에 가명 participant ID를 `fill`하고 `input[type=file]`에 `input/pilot-browser-one-profile.json`을 `setInputFiles`했다.
4. pre 단계에서 실제 radio input을 `check`하고 submit button을 `click`했다.
5. after 단계에서 실제 radio input을 `check`하고 final submit button을 `click`했다.
6. complete 단계에서 브라우저 `download` event를 기다린 뒤 결과 버튼을 `click`하고 원본 JSON을 `output/konocomics-g2-pilot-browser-one.json`으로 저장했다.
7. 다운로드 원본을 편집하지 않고 `TEMP=/tmp TMP=/tmp TMPDIR=/tmp pnpm --silent g2:aggregate -r <result> -o <report>`에 두 번 입력했다. 브라우저 실행도 같은 `/tmp` 환경 접두사를 사용해 WSL의 Windows TEMP socket `ENOTSUP` 경계를 피했다.

React state 주입, `checked` 직접 대입, test-only route, 결과 JSON 손편집, browser storage, 외부 network는 사용하지 않았다. `page.evaluate`는 DOM·attribute·storage를 읽는 blinding audit에만 사용했다.

## Authoritative readback

- A/B occurrences: `20` (`10 + 10`)
- Distinct pre-response works: `16`
- Shared pre responses: `4`
- After responses: `20`
- Explanation agreements: `20`
- Downloaded result SHA-256: `98429bdd94a864cc2e29a2edf48971ed0ab38983fa4f6b98c01d60d0806bddb8`
- Aggregate SHA-256, both runs: `98db33b126521e3bce9f7ce58bed76f08e4175149ed0f147d06585061f6c3e60`
- Aggregate outputs: byte-identical
- Human: `0`
- Synthetic pilot: `1`
- Verdict: `INCOMPLETE`
- Five human GO criteria: all `NOT_RUN`

## Blinding and runtime evidence

- `browser/before-ready.html` and `.aria.txt` were captured after all pre answers, immediately before locking them.
- `browser/after-ready.html` and `.aria.txt` were captured after all after answers, immediately before final submit.
- Both checkpoints had the same A/B native titles and ranks as their respective rendered lists.
- Both checkpoints had no engine mapping, score, confidence, best-anchor, contribution metadata, penalty, market snapshot, maturity, catalog role, download control, query/hash, JSON-LD, cookie, local/session storage, CacheStorage, or IndexedDB entry.
- Engine mapping appeared only in the complete-stage debrief.
- All application document, JavaScript, and stylesheet requests succeeded from localhost. The static server logged one non-blocking `favicon.ico` `404`; no application asset or data request failed.
- `browser/evidence.json` is the structured interaction/readback record, and `browser/static-server.txt` is the isolated one-run server ledger.

`output/aggregate-1.md` and `output/aggregate-2.md` are intentionally duplicated to prove deterministic bytes. The final product-direction evidence bundle may retain both or retain one plus their equality assertion, but neither may be represented as a human GO report.
