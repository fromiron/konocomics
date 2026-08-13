# G2 Catalog 주석 Cycle 7 v3 네 경로 종료 보고

## 결론

동일한 ZIP byte identity에 대한 Local, Gemini, Grok, Oracle 네 raw 응답은 모두 조건 없는 `GO`다. Local, Gemini, Grok 응답은 각각 `VALID`, Oracle 응답은 `VALID_WITH_ACTIVITY_TRACE_LIMIT`로 판정한다.

따라서 이번 Cycle 7 v3의 **150작품 Catalog 주석 후보는 `GO`**이며, 동결 후보를 정식 `data/source`와 generated Catalog/context로 승격하는 것은 **승인한다**. 이 승인은 기존 `authorizedModelPanel` 49작품을 그대로 보존하고, 현재 `unreviewed`인 101작품만 `authorizedModelPanel`로 전환하며, 모든 evidence의 `reviewedByHuman=false`를 유지하는 범위에 한정된다.

그러나 이 네 표는 제품 방향 G2를 닫지 않는다. v3 ZIP에는 G2의 engine identity, 구현 diff, contract/metric tests, deterministic aggregate output, manual browser pilot 및 이를 함께 묶은 최종 hash manifest가 없다. 따라서 제품 UI, Slice 5 및 Vercel 배포는 승인하지 않는다.

## 동결 identity

- repository: `konocomics (fromiron/konocomics)`
- branch / HEAD: `main` / `cc71d38d573cd24c520cbef62c607ee7a876490f`
- exact-HEAD GitHub Actions: run `31682502622`, `success`
- candidate catalog version: `v1-61168a24beea`
- request SHA-256: `cd917f67d36ac623f058cbf503d0fadad46c3e5f5c695a74ea72ddee70a2f793`
- ZIP SHA-256: `cee690a0b2a35b12c5cdfd655bdf84b13e7d1a22470e46a6d690cdb908d818c4`
- ZIP size: `122649860` bytes

Local, Gemini, Grok은 `konocomics-g2-four-path-v3.zip`, Oracle은 Windows 업로드 별칭 `konocomics-g2-four-path-v3-cee690a0.zip`을 기록했다. 파일명은 다르지만 네 경로가 직접 계산해 보고한 ZIP SHA-256은 동일하므로 같은 동결 byte identity에 대한 표다.

## 네 경로 판정

| 경로   | raw 판정 | 유효성                            | 승격 효력                                                  |
| ------ | -------- | --------------------------------- | ---------------------------------------------------------- |
| Local  | GO       | `VALID`                           | 정확한 Catalog 주석 후보에 대한 유효한 GO 한 표            |
| Gemini | GO       | `VALID`                           | 정확한 Catalog 주석 후보에 대한 유효한 GO 한 표            |
| Grok   | GO       | `VALID`                           | 정확한 Catalog 주석 후보에 대한 유효한 GO 한 표            |
| Oracle | GO       | `VALID_WITH_ACTIVITY_TRACE_LIMIT` | 정확한 Catalog 주석 후보에 사용할 수 있는 scope-limited 표 |

Oracle은 ZIP hash, container audit, candidate/manifest 검사, aggregate image-review activity와 exact-HEAD GitHub corroboration을 남겼다. 다만 ChatGPT UI/activity metadata는 100개 static과 6개 motion 각각의 viewer/open event를 외부에서 재구성할 수 있는 path-by-path trace를 노출하지 않는다. 그러므로 Oracle raw 응답의 직접 검사 주장은 이 패킷의 reviewer row로는 사용하되, 모든 개별 open event가 독립적으로 입증되었다고 확대 해석하지 않는다.

Local, Gemini, Grok은 각각 100개 static 원본 경로와 6개 motion 원본 경로의 직접 열람 set을 추적했고, 현재 v3의 `wave-listen-to-me.png`도 직접 열었다. 네 응답 모두 `179/179` complete-file ledger, candidate identity `4/4`, candidate normative checks, prior-review independence 및 blocking finding 없음에 합의했다.

## Artifact hashes

### 요청과 응답

| Artifact                                      | SHA-256                                                            |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `g2-catalog-annotation-cycle-7-v3-request.md` | `cd917f67d36ac623f058cbf503d0fadad46c3e5f5c695a74ea72ddee70a2f793` |
| Local response                                | `9ca36386672c846cff30cc5ef556b4df1454441c659b7635a4ce4edd31ace7d9` |
| Gemini response                               | `96c02900e32a862d5b1f71dbfc3a64a8ed4ccdf4f66facb4dabb926eda59ec51` |
| Grok response                                 | `8d775a830fc2e965fcc59dea34e00c3475b3e11ac03fc39e3cd04a8a43b1ce4d` |
| Oracle response                               | `73b0f22c2e75aaed4b93e6824e683b61f18f54bcc11898531248fdbaf34dac91` |

### Validity records

| Artifact        | SHA-256                                                            |
| --------------- | ------------------------------------------------------------------ |
| Local validity  | `a66f4e529f453315f987b1640252d6627e9074da6c78edf8c679e64e1c5bf2f1` |
| Gemini validity | `a754a31532cf72e7a8ad01b64f775ebc7a237b05a06e1a94ec111600f7d2cd70` |
| Grok validity   | `749ef2f58b5c844b36149d9ca3d3cab7cdf44aeea422d65269f468d4a6d103fa` |
| Oracle validity | `27fabe2c363e9c1078dcf63d95f20362b20be072fe882a264954174dc7e09166` |

### Identity-critical candidate artifacts

| Artifact                                              | SHA-256                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| `candidate/generated/catalog-v1.json`                 | `8695c5646a388f049dc25dcd6af5b5db06437ea82d8755b6b008ea4b97b27abb` |
| `candidate/generated/recommendation-context-v1.json`  | `a802af6c04d5d3c81668493ff4af7eec5fba5169dc38578e3013f4a71752c171` |
| `candidate/source/factors.csv`                        | `4a0e3dc5450ac96250d23e84302ecd5554413f007adb751670ad59c4fb58973f` |
| `candidate/source/evidence/art-evidence-manifest.csv` | `356e1d2eba63bca92340860f06d3f94bd8049ae6000c1d3dd91461d2fee5fc8e` |

### v3 manifest artifacts

| Artifact                               | SHA-256                                                            |
| -------------------------------------- | ------------------------------------------------------------------ |
| `manifests/ALL-FILES.sha256`           | `b56daef851b97fa07508e837ba1865d1fa02c0afc5d2ca950856967106e6ebfd` |
| `manifests/static-index.csv`           | `cd4578a4fab5d508c8fee17b68b386907215de066176b3bf7d072c6a60182461` |
| `manifests/static-sheets.sha256`       | `637b6466972a85fc4f2648120ec5339f3ad6023f7253ba190d9622697701f69b` |
| `manifests/known-motion-index.csv`     | `862570a9f36aab0789d16eaa4343131fa0126009c7576b8fbab53a149f3b7a93` |
| `manifests/known-motion-sheets.sha256` | `d2000a155067510a3989fb73a33c0568b7d55ba6e5f6afaaecbc2e4700f9b128` |
| `manifests/visual-source-audit.json`   | `c77d16bc9654c6b647f7e020f7e7b3b3dad2189343d7eb31b68fb63a30813107` |

## Catalog 주석 후보 합의

네 경로가 검토한 후보는 다음 identity와 계약을 만족한다.

- recommendation-eligible Work 150개, Volume 154개, Work별 representative volume 1개다.
- Factor는 `150 × 17 = 2550`개이고 `(workId, axisId)` 누락·중복이 없다.
- role은 Anchor 30, Bridge 30, Discovery 90이다.
- 추가 packet은 `8 + 31 + 31 + 30 = 100`작품으로 서로 disjoint이며, 기존 50작품 cohort를 유지한다.
- Art manifest는 `150 × 4 = 600`행이고 factor 상태·값·confidence와 일치한다.
- static 원본은 100개, known motion 원본은 6개이며, 106개 경로와 103개 고유 byte hash 관계가 manifest와 일치한다.
- 새 100작품의 known static Art는 허용된 출처, 판본 관계, 최소 6 samples와 2 contexts 및 정확한 reference를 갖는다.
- known `motionImpact`는 연속 동작 근거가 있는 6작품뿐이고, 나머지 94작품은 보수적으로 `unknown`이다.
- 모델 패널 검토는 사람 검수가 아니므로 모든 evidence의 `reviewedByHuman=false`를 유지한다.

## 승인된 승격 변환

이번 보고서가 승인하는 변환은 다음의 작은 완전 범위뿐이다.

1. 현재 `unreviewed`인 101개 Work(추가 100작품과 재검토를 위해 열어 둔 `haikyu`)를 `authorizedModelPanel`로 전환한다.
2. 그 101개 Work의 annotation review metadata는 이 네 경로 보고서를 참조하도록 기록한다.
3. 기존 `authorizedModelPanel` 49작품의 review 상태와 기존 review provenance는 보존한다.
4. evidence의 `reviewedByHuman`은 전부 `false`로 유지하며 사람 검증을 주장하지 않는다.
5. 승인된 `data/staging/g2/candidate-source/**`를 정식 `data/source/**`로 게시하고, 같은 authoritative pipeline으로 `data/generated/**`와 `src/data/generated/**`를 다시 생성·검증한다.

annotation review metadata 반영 뒤 source/generated hash와 catalogVersion이 바뀌는 것은 승인된 provenance 변경의 결과다. 게시 시에는 새 identity를 다시 계산하고 validator와 generated-artifact parity를 통과시켜야 하며, 이 보고서의 pre-promotion candidate hash를 새 artifact hash처럼 재사용하지 않는다.

Catalog 내용, factor 값, Art 판정 또는 150작품 구성의 추가 변경은 이 승인 범위가 아니다.

## AUTHORITY INVERSION

v3 request의 마지막 gate 문구는 동일 ZIP에 대한 4/4 GO와 사용자 사전 승인만으로 전체 G2 / Slice 5가 열릴 수 있다고 적었다. 그러나 이 request는 검토 요청 artifact이며, 제품 SSOT인 `docs/planning/02-product-spec.md` §7의 model-panel 계약과 `docs/planning/06-implementation-plan.md`의 Slice 4 실행·G2 provenance보다 낮은 권위다.

SSOT는 frozen 150-work catalog/context뿐 아니라 engine identity, 구현 diff, contract/metric tests, deterministic aggregate output, manual browser pilot 증거를 하나의 hash manifest에 묶어 네 reviewer에게 동일 제공하도록 요구한다. v3 ZIP의 root에는 `harness/`, 제품 `src/`, `scripts/`, `tests/`가 없고, browser synthetic-pilot download, authoritative aggregate readback 또는 deterministic aggregate report도 없다. 즉 이 패킷은 Catalog/Art 후보를 충분히 검토하지만 제품 방향 엔진과 실제 G2 control flow를 검토하지 않는다.

따라서 lower-authority request가 SSOT의 필수 evidence를 생략한 채 더 넓은 gate effect를 선언한 부분은 `AUTHORITY INVERSION`이다. 그 효과는 채택하지 않고, 네 GO의 권한을 Catalog 주석 후보 승격에만 복원한다.

## 남은 제품 방향 G2 절차

Catalog 승격 뒤에는 정식 150-work source/generated identity로 Slice 4의 대표 flow를 실행해야 한다.

1. 실제 `/synthetic-pilot/` browser UI에서 canonical JSON을 다운로드한다.
2. 그 파일을 authoritative `pnpm --silent g2:aggregate`에 그대로 입력해 accepted pilot 1, human 0, verdict `INCOMPLETE` readback을 확인한다.
3. frozen catalog/context, engine identity, 구현 diff, contract/metric tests, deterministic aggregate output, manual pilot 증거를 하나의 최종 hash manifest로 묶는다.
4. 그 동일한 완전 evidence bundle에 대해 Local, Gemini, Grok, GPT-5.6 Pro의 새 hash-bound 조건 없는 GO 4/4를 받는다.
5. 그때 `humanValidation: "not-run"`, `decisionBasis: "user-authorized-model-panel"`, human metrics `null`/`not-run`인 결정 artifact를 기록한 뒤에만 제품 방향 G2와 Slice 5를 연다.

`CATALOG ANNOTATION CANDIDATE: GO`

`PROMOTION AUTHORIZATION: YES`

`PRODUCT-DIRECTION G2 AUTHORIZATION: NO`

`PRODUCT UI CHANGE AUTHORIZATION: NO`

`SLICE 5 AUTHORIZATION: NO`

`VERCEL DEPLOYMENT AUTHORIZATION: NO`
