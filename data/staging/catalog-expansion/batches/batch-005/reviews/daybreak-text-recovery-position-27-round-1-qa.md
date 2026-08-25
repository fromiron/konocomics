# Batch 005 text recovery independent QA — position 27 round 1

- reviewDate: `2026-08-25`
- retrievedAt: `2026-08-25` (Asia/Tokyo)
- reviewedByHuman: `false`
- scope: Batch 005 position `27`, `work-5e30ab3c7e3fb43e51f2`, 女王の花
- evaluationRange: `entry_1_3_volumes`
- repository HEAD: `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- recovery proposal SHA-256: `8edca76be707eab1fd5369e40f2f7276809828e573dd065535895ca72f613183`
- terminal Art SHA-256: `f495bc0bfa6719a85cd8870cb855fb2a2f64bedf0b00c3a5a806ffe84eee53bf`

The proposal was not inherited. The current terminal row and Dictionary were
read first. The exact official Shogakukan volume 2 and 3 readers were then
reopened at the cited zero-based indexes. Numeric support comes from the
entry-range reader body, not the historical-romance label, the existing
`politics` Theme, or later-series knowledge.

## Reopened official sources

| Source | Live identity / range | HTTP response SHA-256 | Independent bounded observation |
| --- | --- | --- | --- |
| [小学館 official volume 2](https://shogakukan-comic.jp/book?jdcn=091333830000d0000000) | 女王の花 2, JDCN `091333830000d0000000`, digital page date `2013-01-01` | `e3211acd885f5044b7ccce017eb5e526ac0fd1beeb53b43ee964358e5bc57755` | The synopsis binds the poisoning, hostage transfer, 薄星, and 青徹 to volume 2. It supplies political context only and was not used alone for `strategy`. |
| [小学館 official volume 2 reader](https://shogakukan-comic.jp/reader/speed.php?cid=091333830000d0000000_582&u0=1&u1=https%3A%2F%2Fshogakukan-comic.jp%2Fbook%3Fjdcn%3D091333830000d0000000) | title `女王の花 2`, `191` positions | `5c92e964b703b50732fc7e1463bda592a9a9aa05b49d2a49a9cebce6b23d4152` | Index `32` states that the princess has been taught military methods since childhood. Indexes `39–43` form one continuous short tactical sequence: assess an allegedly impossible situation, compare `10万` versus `5万`, inspect river direction and the opposing base, seek the reason behind a placement that ignores a basic military principle, then react to discovery. |
| [小学館 official volume 3](https://shogakukan-comic.jp/book?jdcn=091336540000d0000000) | 女王の花 3, JDCN `091336540000d0000000`, digital page date `2013-01-01` | `4bb41db014f714c6124c4e5102e2122cb7b91e1198786be06f74b0cd72327114` | The synopsis closes the first-three-volume boundary with the changed relationship and danger to 青徹. Its broad historical-romance wording was not converted into a numeric value. |
| [小学館 official volume 3 reader](https://shogakukan-comic.jp/reader/speed.php?cid=091336540000d0000000_582&u0=1&u1=https%3A%2F%2Fshogakukan-comic.jp%2Fbook%3Fjdcn%3D091336540000d0000000) | title `女王の花 3`, `194` positions | `e233f0b363ac9bf1b03a088452a6a8d5991f5fa3ab1ccd59e3fda7fb53bc485f` | Index `26` is an immediate weapon/protector crisis. It confirms the entry-range identity but adds no planning evidence and was not counted toward the value. |

The reader renders were inspected interactively at original resolution.
Temporary captures were not committed. Their review hashes were volume 2 index
`32` `fcdc630d3df7e5728b5211f4a961dd016abcefe7af0c263a8bea94d07f1e3ad0`,
index `40` `ea803954ccac1ecc0f7ba4177040297a9740d8abee3719732e1e048e1b296602`,
and volume 3 index `26`
`ddbb073e3c083597b70a49c650d0969cf410dae1009c1f61c3e22b0e5fba3268`.

## Independent decision

**ACCEPT `strategy=known 2`, confidence `0.86`.** This is not an isolated
battle-label inference. Within volume 2, index `32` establishes sustained
military-method instruction and index `40`, in the continuous `39–43` scene,
shows that instruction applied through explicit force, terrain, river, and
position analysis. Together they meet the Dictionary's level-2 anchor:
tactics or a short-term plan exists.

The evidence does not meet level 4. The reopened entry range does not establish
long-term planning, war or politics as a repeated planning system, or sustained
resource operation. Volume 3 index `26` is direct crisis response, not a second
strategic loop. `problemSolving` and the rejected `progression` proposal remain
`unknown`; no value was copied from Genre or Theme.

## Terminal patch, hashes, and concurrency audit

Only the existing position-27 strategy row changed:

```text
work-5e30ab3c7e3fb43e51f2,strategy,unknown,,,ev-batch-005-a-work-5e30ab3c7e3fb43e51f2
→ work-5e30ab3c7e3fb43e51f2,strategy,known,2,0.86,ev-batch-005-a-work-5e30ab3c7e3fb43e51f2
```

| State | terminal text SHA-256 | Meaning |
| --- | --- | --- |
| before this row patch | `93fb420cefad1eac48a2191c7e1f558a935d21b2b716f242a9d2de6a16530089` | Session-start terminal; position 27 still unknown. |
| position-27 local after | `1fdbcfe31a54bc911dc142ee7de45d9455e1f7bb97e46ed9567cc36e14391b54` | Exactly the accepted position-27 row over the prior terminal. |
| current aggregate after parallel position-23 QA | `da7cfbd54918d877e1d4fab8425d2902278c34b796e52d2db37823a7f5329c6d` | Includes the separately reviewed position-23 row; this review does not claim that row. |

Reverse-substituting only position 27 from the local-after state reproduces
`93fb420c...`. Reverse-substituting the separate position-23 row from the
current aggregate reproduces the position-27 local-after hash
`1fdbcfe3...`. This isolates the one-row delta despite concurrent review work.

The local-after matrix remains `170` rows, `10` frozen works, and exactly `17`
Dictionary-ordered axes per work, with `known=68` and `unknown=102`. Known
values remain integers in `0–4`; unknown rows retain empty value/confidence;
all evidence IDs and row order are unchanged. The current aggregate is
`known=69`, `unknown=101` only because of the independent position-23 patch.

## Gate recount

Operational minima are Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone
`>=5/7`, and Art `>=2/4`.

| Scope | Genre | Theme | Narrative | Tone | Art | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| position 27 before | 1/1 | 1/1 | 3/6 | 6/7 | 4/4 | fail: Narrative+1 |
| position 27 after | 1/1 | 1/1 | 4/6 | 6/7 | 4/4 | pass |

| Chunk 03 state | Genre gate | Theme gate | Narrative gate | Tone gate | Art gate | all-gate works |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| before this row patch | 10/10 | 6/10 | 2/10 | 6/10 | 7/10 | 2/10: positions `26`, `30` |
| position-27 local after | 10/10 | 6/10 | 3/10 | 6/10 | 7/10 | 3/10: positions `26`, `27`, `30` |
| current aggregate after parallel position-23 QA | 10/10 | 6/10 | 4/10 | 6/10 | 7/10 | 3/10: positions `26`, `27`, `30` |

No Genre, Theme, Art, source/provenance, generated catalog, registry, blocker,
eligibility, promotion, Gold work, or recommendation file was changed.
