# Batch 005 independent annotation QA — chunks 01–02

- reviewer: Daybreak subagent (independent Pass B QA)
- reviewedByHuman: `false`
- reviewDate: 2026-08-25
- scope: frozen positions 1–20; `entry_1_3_volumes` or the explicitly narrower first-major-episode range
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- payloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozenWorkSetSha256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- chunk01NotesSha256: `4857566793b21112dc258fe7c23663277598a33a2e69f796d12579402e2350c0`
- chunk02NotesSha256: `0ea56e271b53ebbad98cd6eb80e71c6f5512893b48551366e31cd73f4f841c49`
- excluded: Gold and other-batch annotations, recommendation outcomes, web recollection, Art inference, and promotion decisions
- sourceMutation: none

## Overall verdict

**PASS — 20/20 works against the current canonical root.**

This is a fresh review of the current manifest, payload ledger, corrected Pass A
files, assigned research chunks, dictionary, guide, and annotation request. The
superseded `12ad…` and `abda…` roots and the prior QA text were not accepted as
current evidence. Both notes now bind the exact current candidate, manifest,
payload ledger, frozen work set, annotation request, dictionary, guide, and
assigned research chunk.

## Mechanical and contract validation

| check | chunk 01 | chunk 02 | result |
| --- | ---: | ---: | --- |
| unique works | 10 | 10 | PASS |
| Factor rows | 170 | 170 | PASS |
| known | 36 | 43 | PASS |
| unknown | 134 | 127 | PASS |
| notApplicable | 0 | 0 | PASS |
| Theme rows | 10 | 16 | PASS |
| exact 17-axis dictionary order | 10/10 | 10/10 | PASS |
| Art axes explicitly unknown | 40/40 | 40/40 | PASS |
| legal Genre and Theme ids | yes | yes | PASS |
| `reviewedByHuman=false` | yes | yes | PASS |
| canonical title contains `『` or `』` | 0 | 0 | PASS |

Both current-root validator invocations passed:

```text
pnpm catalog:promotion:annotations --batch-id batch-005 --pass annotation-pass-a --chunk 01
pnpm catalog:promotion:annotations --batch-id batch-005 --pass annotation-pass-a --chunk 02
```

The validator reported candidate
`8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
for both chunks and independently reproduced the row/state counts above.

## Evidence-boundary review

- Every known non-Art value has a direct entry-scope observation in the assigned
  research packet and a bounded explanation in the corresponding current notes.
- Selection labels and publisher demographics are not reused as Factor evidence.
  Genre is not used to derive an Axis, and unknown remains non-numeric.
- The earlier overextensions remain closed: `よるくも` has no workplace Theme;
  `高校球児 ザワさん` warmth is unknown; `ボクラノキセキ` problem solving is
  unknown; `ニラメッコ` has neither comedy Genre/Axis nor warmth; `恋愛ラボ`
  warmth is 2; `銀のスプーン` problem solving is unknown; `おかめ日和`
  darkness is unknown with stress/warmth 2; `新黒沢 最強伝説` darkness and
  stress are unknown; `カレチ` relationship structure is unknown; and
  `GREEN WORLDZ` progression, problem solving, and mystery reveal are unknown.
- The remaining endpoints are directly supported: `よるくも darkness=4` rests
  on repeated murder, abduction, tragedy, and the explicitly dark social world;
  `銀のスプーン emotionalWarmth=4` rests on explicit family love and cooking
  functioning as repeated support across the entry volumes.
- Positions 5 and 13 remain all-unknown at the Axis level because their bounded
  packet does not establish sustained entry experience. No neutral numeric
  vector was fabricated.
- All 80 Art cells remain `unknown`. The packet establishes zero qualifying
  readable internal pages and zero distinct scene contexts, so no cover,
  animation, synopsis, or memory is converted into Art evidence.

## Work-level verdicts

| pos | workId | canonical title | verdict |
| --: | --- | --- | --- |
| 1 | `work-060a72fe10cf6ba9cbfc` | チェーザレ 破壊の創造者 | PASS |
| 2 | `work-076beb86f844b642beef` | くーねるまるた | PASS |
| 3 | `work-091d231d37f037fb07e8` | インベスターZ | PASS |
| 4 | `work-0cf463005cc77eeded8e` | 黄泉のツガイ | PASS |
| 5 | `work-0d1ad77728a44df56508` | ラーメン大好き小泉さん | PASS |
| 6 | `work-0dabd1d17e5fcf2992b9` | 忘却のサチコ | PASS |
| 7 | `work-0ebf010ac12b9b60d80e` | 機動旅団八福神 | PASS |
| 8 | `work-0ede6921b81169dc2dda` | 不滅のあなたへ | PASS |
| 9 | `work-0eff8190c0c6ff604527` | よるくも | PASS |
| 10 | `work-12b484cd79bfe6852ea1` | 高校球児 ザワさん | PASS |
| 11 | `work-151b456508f78852b002` | ヨルムンガンド | PASS |
| 12 | `work-1550d4a52c3fe6d9f94c` | ボクラノキセキ | PASS |
| 13 | `work-15d6508605fbd4a266fc` | おまかせ精霊 | PASS |
| 14 | `work-18e08fe95968a6537773` | ニラメッコ | PASS |
| 15 | `work-19b578d0e828242f14f3` | 恋愛ラボ | PASS |
| 16 | `work-1b3afe12c434a9cf7603` | 銀のスプーン | PASS |
| 17 | `work-1b7c4ed54d7761cd242b` | おかめ日和 | PASS |
| 18 | `work-1bce95b6c02673e59bcf` | 新黒沢 最強伝説 | PASS |
| 19 | `work-1d5a3158e78e639f1973` | カレチ | PASS |
| 20 | `work-1e9c4852863a22bba058` | GREEN WORLDZ | PASS |

## Closure

No identity, safety, title, Factor, Genre, Theme, or review-provenance blocker
was found in positions 1–20 against the current root. This model-panel QA does
not claim human validation and does not authorize source mutation, promotion,
or adjudication.
