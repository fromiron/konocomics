# Batch 005 blocker-challenge independent QA — chunk 05, round 1

## Scope and attestation

- reviewDate: `2026-08-25`
- retrievedAt: `2026-08-25` for every route below
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- position: `45`
- work: `work-e658d3aee2e33c17aa38` — `スピリットサークル`
- scope: `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- blocker challenge SHA-256: `bf252035c915f507e3d545358c9c5c78bd0de423829d62aa5ef900a39dffd6c6`
- prior blocker report SHA-256: `67a4b7f6d20481fa9e6af6c12d477471659f2f307cf34ab6ac26e46c30766d1e`

The challenge conclusion was not inherited. The exact BOOK☆WALKER products,
their product-linked trial redirects, the trial content API, the rendered
volume-2 body sequence, and the separately labelled MangaPedia volume 1–3
summaries were independently reopened. No Art value was reviewed or assigned.

## Access and edition audit

| Volume | Product and trial route | Publication/date basis | Fresh status | Edition result |
| ---: | --- | --- | --- | --- |
| 1 | [BOOK☆WALKER product](https://bookwalker.jp/ded91ce5bd-eb14-46e5-938c-f27e4a0203c2/) and [product-linked trial](https://bookwalker.jp/ded91ce5bd-eb14-46e5-938c-f27e4a0203c2/?sample=1) | publisher standard volume `2012-12-10`; BOOK☆WALKER route date not separately stated | product HTTP 200; trial HTTP 200 after two redirects | Final viewer CID `d91ce5bd-eb14-46e5-938c-f27e4a0203c2`; trial API returned exact title `スピリットサークル （１）` and 12 configured page entries. |
| 2 | [BOOK☆WALKER product](https://bookwalker.jp/de10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/) and [product-linked trial](https://bookwalker.jp/de10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/?sample=1) | publisher standard volume `2013-07-30`; BOOK☆WALKER route date not separately stated | product HTTP 200; trial HTTP 200 after two redirects | Final viewer CID `10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df`; trial API returned exact title `スピリットサークル （２）` and 12 configured page entries. |
| 3 | [BOOK☆WALKER product](https://bookwalker.jp/de110df35f-cfc9-40cc-98e4-be4ce5ec9584/) and [product-linked trial](https://bookwalker.jp/de110df35f-cfc9-40cc-98e4-be4ce5ec9584/?sample=1) | publisher standard volume `2014-04-03`; BOOK☆WALKER route date not separately stated | product HTTP 200; trial HTTP 200 after two redirects | Final viewer CID `110df35f-cfc9-40cc-98e4-be4ce5ec9584`; trial API returned exact title `スピリットサークル （３）` and 12 configured page entries. |
| 1–3 | [MangaPedia work and volume summaries](https://mangapedia.com/%E3%82%B9%E3%83%94%E3%83%AA%E3%83%83%E3%83%88%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB-7u23pcfj9) | page date not stated | HTTP 200 | Exact title and creator match; summaries are separately bounded as volumes 1, 2, and 3. |

The three product pages identify 水上悟志, ヤングキング, and 少年画報社 and
expose `試し読み`. The redirects terminate at the licensed BOOK☆WALKER trial
viewer rather than a generic catalog shell. Therefore the prior assertion that
products 7155–7157 had no product-linked readable internal route is false.

## Direct text check and Dictionary fit

The volume-2 official trial body provides a primary, edition-bound observation:

- `p-007`–`p-009` establish that Futa recognizes present classmates as people
  connected through the prior life and resumes the discussion with Koko.
- `p-010`–`p-011` show Futa directly asking how Koko's prior self died and the
  pair tracing the causal chain through the murdered pharmacist, the church's
  subjugation request, and the village response. This is a bounded causal
  inquiry, not a genre inference or a mere statement that a mystery exists.

Temporary page files were used only to verify this text and were not committed.
Their SHA-256 values are retained for reproducibility:

| Reader ref | SHA-256 |
| --- | --- |
| volume 2 `p-007` | `6e572900e5e33c863c26e2f87b5d574f2b38b41e5c7a7f48c4af0108903b41a4` |
| volume 2 `p-008` | `65a6e3949dd6e08d4b724497b0673d96f3f1acbcd29a890213eac7752dfe938c` |
| volume 2 `p-009` | `39dd198ac1d80541b03abd9faa1f01c94a070532b0cad4f913e3f7a6722dcfc4` |
| volume 2 `p-010` | `0d37650396712882c4147ef87c7334fc4cbd244c09a981b94d33a771fef26dd5` |
| volume 2 `p-011` | `e2b97fdebf7d8b483136615e770e87470bc437f14153e0b62d85b58811c23ed4` |

MangaPedia is supporting rather than sole evidence. Its volume-2 summary
independently records Futa and Koko comparing viewpoints and examining the
ritual's consequences. Its volume-3 summary records Futa identifying a
present/past location link and beginning a joint investigation into what
happened after their deaths. This confirms that the direct causal inquiry is
not an isolated line while staying inside volumes 1–3.

Under the Dictionary, this supports `problemSolving=2`: causal analysis and
inquiry are mixed with direct use of the Spirit Circle and continued
investigation. It does not support `4`, because constraint analysis and
ingenious solution construction are not established as the core reward.
`progression` and `strategy` remain `unknown`; past-life accumulation is not a
mastery-reward loop, and investigation is not long-range planning, war,
politics, or resource management.

## Verdict and materialized delta

| Item | Independent verdict |
| --- | --- |
| Proposed `SOURCE_INFORMATION_UNAVAILABLE` blocker | **BLOCKER_DEFEATED** — exact authorized volume 1–3 readers are currently reachable. |
| `problemSolving` | **ACCEPT** as `known,2,0.70`. |
| Other text cells | unchanged. |
| Art | untouched; all four cells remain `unknown`. |

Only one terminal cell was changed:

| Work ID | Axis | Before | After | Evidence binding |
| --- | --- | --- | --- | --- |
| `work-e658d3aee2e33c17aa38` | `problemSolving` | `unknown` | `known,2,0.70` | existing `ev-batch-005-a-work-e658d3aee2e33c17aa38` |

## Integrity and gates

| Terminal | Rows excluding header | Shape/result | SHA-256 after QA |
| --- | ---: | --- | --- |
| Text | 170 | 10 works; `known=68`, `unknown=102` | `ffbef1b703a2298be829caff980fb94db429aeaa9b2eeb5cfa69b4879f8cfac0` |
| Genre | 10 | unchanged | `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` |
| Theme | 16 | unchanged | `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa` |
| Art | 40 | unchanged | `d37620879b365a826cd4e835e63136f2152bdb8a043c616e3a0f9d9daeb87093` |

Position 45 now has Genre `1/1`, Theme `2/1`, Narrative `4/6`, Tone `5/7`,
and Art `0/4`. It passes the complete text gate and fails only the Art coverage
gate. Chunk-05 text-gate positions are now `[45]`; all-five-gate positions
remain empty. Art shortage is not converted into a blocker by this QA. The
reachable exact readers instead provide a finite Art recheck path under the
normal six-readable-BODY-page, two-context, Local-plus-Gemini policy.

No source, Genre, Theme, Art, registry, overlay, generated catalog, eligibility,
Gold, formula, Factor Dictionary, or validator file was edited. No canonical
title gained decorative corner-quote delimiters.
