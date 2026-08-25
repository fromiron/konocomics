# Batch 005 text-gap recovery QA — chunk 01 round 3

## Scope and attestation

- reviewer: Daybreak independent recovery QA
- reviewDate: `2026-08-25`
- frozen positions: `1–10`; this round reopens only positions `1, 2, 5, 6, 7, 8, 9, 10`
- scope: `entry_1_3_volumes`
- `reviewedByHuman=false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- round-3 recovery packet SHA-256: `c19b5a4a2994f95eaa32d08d12957f9b40c5b6436a3c987a88dc557ac312776a`
- prior round-2 QA SHA-256: `2b49dd81341bfb79f91de8c4e0d64751e99d6aeb6d1f932034fd2bc1ef232720`
- prior blocker adjudication SHA-256: `e02c9a6b7a9ce7d2602b8f802a051d12770905f64e3be6a8e2f4c3ce57889c4c`

`pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`
reproduced 50 works and the candidate SHA above. All 17 frozen payload entries
passed `sha256sum -c PAYLOAD.sha256`. The frozen position/work/title order also
matches the terminal Genre, Theme, and factor files. Positions 3 and 4 remain
outside this recovery round and their prior blocker adjudication is not reopened.

## Decision rule

Round 3 is an observation packet, not an annotation proposal packet. It explicitly
states that its observations are not terminal known values, leaves every named
residual cell `unknown`, and supplies no confidence for a new claim. Therefore a
new terminal cell can be written only if the packet both names an exact legal
Genre/Theme or Axis `0–4` proposal and directly supports it against the Factor
Dictionary. Source reachability, a product synopsis, or a possible direction does
not satisfy that requirement. Silence is not known `0`.

## Source identity, date, and scope audit

- All 18 primary product/viewer URLs independently sampled from the round-3 ledger
  returned HTTP `200` after redirects and resolved to the asserted titles and
  volumes. Kodansha product IDs, BookLive volume numbers and overlap notices,
  Shogakukan JDCNs/ISBNs, KADOKAWA product IDs, BOOK☆WALKER CIDs, and the Sony
  title/item pair all bind to entry volumes 1–3 as claimed.
- The asserted product dates were independently reproduced for Cesare volumes 2–3
  (`2006-10-23`, `2007-04-23`), the BookLive alternate editions (`2024-10-08`),
  Sachiko volumes 2–3 (`2015-04-30`, `2015-08-28`), Hachifukujin volume 2
  (`2005-06-25`), the Sony volume-3 record (`2014-03-08`), and To Your Eternity
  volumes 2–3 (`2017-03-17`, `2017-06-16`). Viewer-only routes remain `undated`.
- The current Shogakukan e-comic book pages for Yoru Kumo and Zawa-san do not expose
  either `2013-01-01` or the earlier ledger's `2013-07-18` as the work publication
  date. Those four direct-page date annotations are not independently verified and
  must be treated as `undated` unless a preserved dated record is supplied. Their
  JDCN identity and displayed volume synopsis are valid; the date defect creates no
  factor value.
- A stateless replay of the six Shogakukan `bibGetCntntInfo` routes returned
  `result=-100`, not the packet's browser-session `result=1`. The viewer redirects,
  exact JDCNs, direct official book pages, and displayed descriptions are still
  reproducible, but the API success/image-count assertion is excluded from this
  adjudication because it is not independently replayable here.
- The Tameshiyo volume-2/3 pages expose distinct `book_cd` ISBNs and valid volume
  descriptions. Their shared `bookHash` is not an edition identifier and was not
  used as one. Official Shogakukan book records independently bind each ISBN and
  date.

These limitations affect only route metadata. No proposal below depends on the
unverified dates, API success, image count, or shared hash.

## Independent proposal adjudication

| pos | canonical title | round-3 candidate observation | QA | direct anchor result |
| ---: | --- | --- | --- | --- |
| 1 | チェーザレ 破壊の創造者 | political/religious conflict, succession manoeuvring, new strategist | `CONFIRM UNKNOWN` | These observations reinforce already-known `strategy=4` and `worldBuilding=3`; they do not explicitly propose or directly close any residual growth, solution, reveal, or Tone value. |
| 2 | くーねるまるた | recurring food, seasons, neighbours, and sharing | `CONFIRM UNKNOWN` | They reinforce existing `cooking:2`, `relationshipStructure=2`, and `emotionalWarmth=2`. Promotional pleasantness and recipe lists do not supply an explicit residual `0/2/4` proposal. |
| 5 | ラーメン大好き小泉さん | ramen seeking, destinations, and consumption across volumes 1–3 | `REJECT cooking`; otherwise `CONFIRM UNKNOWN` | Consumption is not the preparation mechanic required by `cooking`; destinations alone do not establish `exploration` centrality. Retailer comedy/gourmet tags cannot become an Axis. No legal Theme or numeric residual proposal is made. |
| 6 | 忘却のサチコ | work/travel assignments, food as forgetting, schedule pressure | `CONFIRM UNKNOWN` | The official records corroborate the already-accepted `comedy=2`, `pacing=2`, `mentalStress=2`, and workplace context. They do not explicitly propose three missing Narrative values or a missing Tone value; fiancé presence is not a new romance claim. |
| 7 | 機動旅団八福神 | eight-person cast, named defense machine, new member, acceleration | `CONFIRM UNKNOWN` | The claims reinforce existing `worldBuilding=2`, `relationshipStructure=2`, and `pacing=2`. Weapon/war facts are not direct problem-solving or strategy anchors, and “accelerates” is not progression. |
| 8 | 不滅のあなたへ | growth/acquisition wording, rescue plan, encounters, sibling care | `UNKNOWN` | The volume-2/3 wording is a credible `progression` lead, but round 3 deliberately supplies no exact `progression=0/2/4` proposal or confidence. The rescue event and changing companions do not close problem-solving, strategy, or relationship structure. No terminal value may be invented by QA. |
| 9 | よるくも | class system, murder/abduction/escape, intimacy and family claims | `REJECT survival:2`; otherwise `CONFIRM UNKNOWN` | Repeated danger is not itself a recurring survival mechanic/reward, so the packet's expressly discussed `survival:2` candidate remains rejected. Intimacy, care, and tragedy are bounded events but no exact romance/warmth proposal is supplied. Existing world/tone known cells remain unchanged. |
| 10 | 高校球児 ザワさん | baseball-club daily-life contrast, gender restriction, admiration wording | `CONFIRM UNKNOWN` | Training does not establish progression; “dokidoki” copy does not establish an active romance subplot; an absent-minded expression is not recurring comedy. No exact numeric proposal is present. |

Result: `ACCEPT 0`, `REJECT 2` candidate mappings (`cooking`, `survival:2`), and
`UNKNOWN/CONFIRM UNKNOWN 8` position-level residual sets. The two rejected mappings
were already non-terminal leads, so they require no CSV reversal. No Genre or Theme
row is added or removed and no factor state/value/confidence is changed.

## Reverse-substitution and hash audit

Because round 3 contains no authorized exact terminal proposal, applying its
decision set is the identity transformation. Reversing every considered candidate
mapping back to the pre-review terminal bytes reproduces the same three hashes:

| file | rows excluding header | before SHA-256 | after/reversed SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | 170 | `dde01a78cb4ddfc5b51805e8828bc45ba83ab9f9d6ff77342ce504a7524369e7` | `dde01a78cb4ddfc5b51805e8828bc45ba83ab9f9d6ff77342ce504a7524369e7` |
| `adjudication/genres-final-chunk-01.csv` | 10 | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` |
| `adjudication/themes-final-chunk-01.csv` | 11 | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` |

The text matrix remains exactly `10 × 17 = 170` rows in frozen work and dictionary
order. Known rows retain values/confidence/evidence IDs; unknown rows retain empty
value/confidence; all terminal evidence IDs remain
`ev-batch-005-a-{workId}`. Canonical titles contain no `『』` delimiters.

## Gate recount

Coverage minimums remain Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`,
and Art `2/4` for this batch workflow.

| pos | G | Th | Narrative | Tone | Art | remaining text deficiency |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 1/1 | 1/1 | 3/6 | 1/7 | 0/4 | N+1, T+4 |
| 2 | 1/1 | 1/1 | 1/6 | 4/7 | 0/4 | N+3, T+1 |
| 3 | 0/1 | 1/1 | 4/6 | 0/7 | 0/4 | G+1, T+5 |
| 4 | 1/1 | 1/1 | 3/6 | 2/7 | 0/4 | N+1, T+3 |
| 5 | 1/1 | 0/1 | 0/6 | 0/7 | 0/4 | Th+1, N+4, T+5 |
| 6 | 1/1 | 1/1 | 1/6 | 4/7 | 0/4 | N+3, T+1 |
| 7 | 1/1 | 1/1 | 2/6 | 2/7 | 0/4 | N+2, T+3 |
| 8 | 1/1 | 1/1 | 1/6 | 3/7 | 0/4 | N+3, T+2 |
| 9 | 1/1 | 0/1 | 2/6 | 4/7 | 0/4 | Th+1, N+2, T+1 |
| 10 | 1/1 | 1/1 | 1/6 | 2/7 | 0/4 | N+3, T+3 |

Chunk-01 totals remain Genre `9/10`, Theme `8/10`, Narrative `1/10`, Tone
`0/10`, Art `0/10`, and all non-Art text gates `0/10`. Round 3 changes no gate
count and authorizes no promotion or blocker change.

## Non-mutation boundary

- `adjudication/text-final-chunk-01.csv`, `genres-final-chunk-01.csv`, and
  `themes-final-chunk-01.csv` are byte-identical to the round-3 input attestations.
- No source, registry, overlay, promotion, Art, safety, identity, generated catalog,
  or commit state was changed.
- The four unverifiable Shogakukan direct-page dates and the stateless API replay
  limitation are recorded here rather than silently converted into evidence.
