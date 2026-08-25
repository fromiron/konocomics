# Batch 005 Theme recovery independent QA — position 23 round 1

## Scope and binding

- reviewer: Daybreak independent Theme QA/adjudicator
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- frozen position: `23`
- work: `work-43ebf010a490cfd4bb50` — `千年万年りんごの子`
- evaluation range: `entry_1_3_volumes`
- repository HEAD: `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- Theme recovery proposal SHA-256: `730b4a0781fa2ff1358fe5233a3bafee1e0d96a606a1e6d578e9c7069e3d7c6a`
- terminal Theme SHA-256 before this QA: `58a5b3b5e77ced981d7059492e090ad0bb6073ec8c4965dd14dae71f367f28df`

제안 결론을 상속하지 않고 Factor Dictionary의 Theme/centrality 정의, 현재
terminal, position 23의 선행 text/annotation/blocker QA를 먼저 읽었다. 작품명,
Genre, 기존 `mysteryReveal=2`, Art 관찰은 Theme 근거로 사용하지 않았다.

## Reopened official source check

두 출판사 직결 URL을 `2026-08-25`에 다시 조회했으며 모두 HTTP `200`이었다.
응답 해시는 이번 QA에서 받은 압축 해제 HTML 본문을 식별한다.

| source | publishedAt | response SHA-256 | bounded direct observation |
| --- | --- | --- | --- |
| [講談社公式 — 千年万年りんごの子（２）](https://www.kodansha.co.jp/comic/products/0000046505) | `2013-05-07` | `22a7cf92654f601583a9162455092c1e764c092a9db0635dab0b2c417bfabeee` | 소개문은 雪之丞가 陸郎에게서 마을의 전승을 `聞き出した` 뒤 朝日를 데리고 돌아갈 결정을 한다고 직접 서술한다. 이는 구출 문제에 대한 능동적 정보 획득이다. |
| [講談社公式 — 千年万年りんごの子（３）＜完＞](https://www.kodansha.co.jp/comic/products/0000046557) | `2014-03-07` | `5ddaaf60a6059c9f18ac22c14c40b68dbe6b22ccc6f46f55d7193644941ec5b3` | 다음 권에서도 같은 구출 목표가 이어지고, 유일한 단서가 60년 전 사건을 기록한 `祭文`이라고 직접 명시된다. |

2권의 전승 청취는 단순히 수수께끼가 존재한다는 진술이 아니라 등장인물이
직접 정보를 얻는 행위다. 3권은 별개의 공식 권 소개에서 같은 구출 목표를 기록
단서에 결속한다. 따라서 정보 획득과 단서 추적이 두 연속 entry 권에 걸쳐 이어지는
서브 소재이며, 한 번 등장한 clue나 mystery Genre의 역추론만으로 만든 값이 아니다.

다만 3권 소개는 雪之丞가 `祭文`을 직접 찾아내거나 사용했다고까지 서술하지 않는다.
그 주장은 근거에서 제외했다. 여러 독립 사건의 조사 loop나 작품 전체의 반복 핵심
구조도 확인되지 않으므로 centrality `2`는 지지되지 않는다.

## Independent decision

**ACCEPT — Theme `investigation`, centrality `1`, confidence `0.84`.**

Dictionary의 centrality `1`인 일부 에피소드·서브 소재 경계에 맞는다. 의례나
민속 신앙을 Theme로 치환하지 않았고, `historicalReconstruction`, `politics`,
`survival`을 추가하지 않았다. 기존 `problemSolving=2` 및 `mysteryReveal=2`도
재판정하지 않았다.

## Materialized row and integrity

정확히 한 행을 canonical work 순서의 position 23 위치에 추가했다.

```text
work-43ebf010a490cfd4bb50,investigation,1,0.84,ev-batch-005-a-work-43ebf010a490cfd4bb50
```

terminal schema의 기존 work-bound evidence ID를 유지한다. 세부 출판사 근거는
해시로 고정된 recovery proposal의 `p23-theme-r1-k2`와 `p23-theme-r1-k3` ledger에
결속된다.

| file | rows excluding header | before SHA-256 | after SHA-256 | change |
| --- | ---: | --- | --- | --- |
| `adjudication/themes-final-chunk-03.csv` | `9` | `58a5b3b5e77ced981d7059492e090ad0bb6073ec8c4965dd14dae71f367f28df` | `0cbb43019eb966cb6b7269285616324c84ebbf1c9c0c7a33a277b0e825b169dd` | position 23 Theme 행 1개 추가 |
| `adjudication/text-final-chunk-03.csv` | `170` | `da7cfbd54918d877e1d4fab8425d2902278c34b796e52d2db37823a7f5329c6d` | unchanged | byte-identical |
| `adjudication/genres-final-chunk-03.csv` | `10` | `ed6869c24e1d55a2f651ebfd1ee0191c0d2e54156c997eb09be936e877b044f6` | unchanged | byte-identical |
| `art-review/chunk-03/final-art.csv` | `40` | `f495bc0bfa6719a85cd8870cb855fb2a2f64bedf0b00c3a5a806ffe84eee53bf` | unchanged | byte-identical |

추가 행만 제거한 역검산 SHA-256은 prior Theme hash
`58a5b3b5e77ced981d7059492e090ad0bb6073ec8c4965dd14dae71f367f28df`와
정확히 일치한다. header, legal Theme ID, centrality `1|2`, canonical work/Theme
order, `(workId, themeId)` uniqueness를 재검증했으며 position 23 Theme 행은 정확히
하나다. `git diff --check`도 통과했다.

## Gate recount

Coverage 최소값은 Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`,
Art `2/4`다.

| state | Genre | Theme | Narrative | Tone | Art | full coverage gate |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| position 23 before | `1/1` | `0/1` | `4/6` | `5/7` | `3/4` | fail: Theme |
| position 23 after | `1/1` | `1/1` | `4/6` | `5/7` | `3/4` | **PASS** |

Chunk 03의 현재 gate pass 수는 Genre `10/10`, Theme `7/10`, Narrative
`4/10`, Tone `6/10`, Art `7/10`, all five `4/10`이다. position 23의 all-five
pass는 이 Theme 판정으로 `false → true`가 되었지만, 이 QA 자체는 promotion,
eligibility, blocker 또는 registry 상태를 승인하지 않는다.

## Boundary

- source/provenance, Pass A/B/C, Art, promotion, registry, eligibility, blocker,
  overlay, generated catalog, recommendation code는 변경하지 않았다.
- 사람 검증 또는 사람 승인 주장을 하지 않았다. `reviewedByHuman=false`다.
