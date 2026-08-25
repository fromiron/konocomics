# Batch 005 text recovery independent QA — position 23 round 1

## Scope and attestation

- reviewer: Daybreak independent recovery QA
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
- recovery proposal SHA-256: `a496b6d744f51d768f668614680934f75d58160b1b7e2a4639ab43ecddff8732`
- terminal text SHA-256 immediately before this row patch: `1fdbcfe31a54bc911dc142ee7de45d9455e1f7bb97e46ed9567cc36e14391b54`
- terminal Art SHA-256: `f495bc0bfa6719a85cd8870cb855fb2a2f64bedf0b00c3a5a806ffe84eee53bf`

The proposal conclusion was not inherited. The current terminal row and the
Dictionary's `problemSolving` anchors were read first, then the official Kodansha
volume-2 and volume-3 pages were fetched again. The decision uses only the bounded
entry-range action chain. No Genre, premise label, later-volume material, or Art
observation was used to create the value.

## Reopened official source check

Both direct rightsholder routes returned HTTP `200` on `2026-08-25`. Response hashes
identify the bodies captured during this review.

| source | edition date | response SHA-256 | bounded observation |
| --- | --- | --- | --- |
| [講談社公式 — 千年万年りんごの子（２）](https://www.kodansha.co.jp/comic/products/0000046505) | `2013-05-07` | `4d41688884d8ee19b4cad60b711f0175b014970d16e3b07f8402677ae2fd7142` | After the rite makes 朝日 the local god's wife, 雪之丞 elicits the village lore from 陸郎, decides to return to Tokyo with 朝日, and fights the god to protect her. |
| [講談社公式 — 千年万年りんごの子（３）＜完＞](https://www.kodansha.co.jp/comic/products/0000046557) | `2014-03-07` | `0ac0cde575a02c4979717e2dc308bac6d7f0c80a7a6385b09bd430ca33c6c1f3` | The same rescue objective continues while 雪之丞 remains in the village: the only clue for saving 朝日 is the `祭文`, a record of events sixty years earlier, and the conclusion is framed around his final choice. |

The volume-2 evidence is not treated as an isolated combat event. It explicitly
combines information acquisition, a rescue decision, and direct confrontation.
Volume 3 then sustains that same rescue problem through a clue-bound continuation
and final choice. The repeated objective and mixed methods occur across two
consecutive entry volumes.

## Independent decision

**ACCEPT `problemSolving=known 2`, confidence `0.82`.** The sustained volume-2 to
volume-3 rescue chain mixes information-led assessment and decision-making with
direct action, matching the Dictionary midpoint `지략과 직접 행동 혼합`. It is not
`4`: the official descriptions do not establish repeated ingenious constraint
analysis or clever solution payoffs as the work's primary reward.

`progression` and `strategy` remain `unknown`. A rescue objective does not establish
repeated growth, and this bounded action chain does not establish long-term planning,
politics, war, or resource operation. The ritual and historical record were not
converted into a Theme or Genre value.

## Terminal patch and gate recount

Exactly one existing row changed, preserving its evidence ID and position:

```text
work-43ebf010a490cfd4bb50,problemSolving,unknown,,,ev-batch-005-a-work-43ebf010a490cfd4bb50
→ work-43ebf010a490cfd4bb50,problemSolving,known,2,0.82,ev-batch-005-a-work-43ebf010a490cfd4bb50
```

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-03.csv` | `170` | `1fdbcfe31a54bc911dc142ee7de45d9455e1f7bb97e46ed9567cc36e14391b54` | `da7cfbd54918d877e1d4fab8425d2902278c34b796e52d2db37823a7f5329c6d` |
| `adjudication/genres-final-chunk-03.csv` | `10` | `ed6869c24e1d55a2f651ebfd1ee0191c0d2e54156c997eb09be936e877b044f6` | unchanged |
| `adjudication/themes-final-chunk-03.csv` | `8` | `58a5b3b5e77ced981d7059492e090ad0bb6073ec8c4965dd14dae71f367f28df` | unchanged |
| `art-review/chunk-03/final-art.csv` | `40` | `f495bc0bfa6719a85cd8870cb855fb2a2f64bedf0b00c3a5a806ffe84eee53bf` | unchanged |

Reverse-substituting only the accepted row in the after state reproduces the before
hash exactly. The aggregate terminal includes an independently reviewed concurrent
position-27 row that was already present in this review's before state; it is outside
this decision.

Coverage minima are Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`,
and Art `>=2/4`.

| state | Genre | Theme | Narrative | Tone | Art | full coverage gate |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| position 23 before | `1/1` | `0/1` | `3/6` | `5/7` | `3/4` | fail: Theme, Narrative `+1` |
| position 23 after | `1/1` | `0/1` | `4/6` | `5/7` | `3/4` | fail: Theme |

The terminal text matrix remains `10 × 17 = 170` rows in frozen-work and Dictionary
Axis order. In the aggregate after state it contains `69` known and `101` unknown
rows; all known and unknown row shapes and work-bound evidence IDs remain valid.
Chunk 03 still has three all-gate works (`26`, `27`, and `30`). This patch closes only
the target's Narrative deficit and does not authorize blocker, eligibility, or
promotion changes.

## Verification

- official Kodansha routes: `2/2 HTTP 200`
- sustained rather than isolated action check: pass across volumes 2–3
- no Genre/premise inference: pass
- reverse-substitution row-local audit: pass
- schema/order audit: `PASS — rows=170 works=10 axesPerWork=17`
- terminal shape audit: `PASS — badOrder=0 badShape=0 badEvidence=0 badWork=0`
- changed terminal cells: `1`
- reviewedByHuman: `false`

No Art, source, generated catalog, registry, blocker, eligibility, promotion, Gold
work, Factor Dictionary, or recommendation file was changed.
