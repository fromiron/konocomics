# Batch 004 chunk 01 round-2 text recovery — independent adjudication

## Scope and bindings

- Reviewer: Daybreak independent adjudicator; `reviewedByHuman=false`.
- Repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Candidate SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Recovery packet SHA-256: `2b333e994e46a76f63e78b84f98ce636d06d0fe91f5c787922e79172399b7782`.
- Prior blocker adjudication SHA-256: `8663e88c4a3455e46222bb7f9ac1417019ea8990ce2b02b15131e0f270f9c4c3`.
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Retrieval/verification date: `2026-08-25`.
- Entry scope: volumes 1–3 only. Art, later-series impressions, ratings, popularity, and recommendation-list membership were excluded.
- Mutation boundary: only five accepted cells in `adjudication/text-final-chunk-01.csv` were changed. No Genre, Theme, Art, identity, safety, blocker, overlay, source, registry, generated artifact, or promotion state was changed.

## Source identity and range verification

| Position | Verified source identity and date | Entry-bound observation used |
|---:|---|---|
| 3 | Shinchosha official [volume 2](https://www.shinchosha.co.jp/book/771777/) (`2014-10-09`) and [volume 3](https://www.shinchosha.co.jp/book/771810/) (`2015-04-09`); Sony Reader licensed [volume-3 review page](https://ebookstore.sony.jp/review/title/00289449/id/BT000028944900300301/) with `originalPublicDt=2015-04-09` and distinct dated reviewers including `2015-04-18` and `2016-05-26`; BookLive [volume-3 reviews](https://booklive.jp/review/list/title_id/289449/vol_no/003). | The publisher establishes the recurring two-lead partnership. Independent volume-3 readers separately describe care for family, villagers, and the fiancée relationship. This is mixed warmth amid political danger, not healing as the core reward. |
| 4 | Shogakukan official [volume 1](https://e-comi.shogakukan.co.jp/books/091884110000d0000000), [volume 2](https://e-comi.shogakukan.co.jp/books/091884120000d0000000), and [volume 3](https://e-comi.shogakukan.co.jp/books/091884130000d0000000) (page dates not exposed); BookLive licensed [volume 1](https://booklive.jp/product/index/title_id/217921/vol_no/001) (`datePublished=2013-09-23`) and [reviews](https://booklive.jp/review/list/title_id/217921/vol_no/001), including distinct dated observations from `2009-10-04`, `2009-10-10`, `2009-10-14`, and `2011-04-08`. | Official volumes 1–2 repeatedly frame the entry as a light, healing gag/human-drama world. Independent volume-1 readers repeat relaxed, warm, lightly tearful episodes. One reader's darker-world gloss was retained as dissent, but it does not outweigh the repeated official entry framing or establish serious risk/tragedy as a recurring reward. |
| 5 | KADOKAWA official [volume 2](https://www.kadokawa.co.jp/product/301306000980/) (print record `2011-11-15`, electronic record `2013-08-01`) and [volume 3](https://www.kadokawa.co.jp/product/201110000430/) (`2012-03-03`); BookLive licensed [volume-1 reviews](https://booklive.jp/review/list/title_id/201266/vol_no/001) (`datePublished=2013-03-29`) with distinct reviewer identities dated `2013-03-29`, `2021-11-16`, and `2021-11-20`. | Official volumes 1–2 repeat forced cohabitation, life disruption, and increasing burdens. Two independent volume-1 observations distinguish recurring trouble from being psychologically overwhelmed. Separate entry observations repeat small acts of care and the caretaker's goodness. This supports mixed stress and mixed warmth, not either extreme. |
| 9 | Shonen Gahosha official [volume 1](https://www.shonengahosha.co.jp/book_Info.php?id=5944) (`2006-01-02`, ISBN `978-4-7859-2604-5`) and [volume 3](https://www.shonengahosha.co.jp/book_Info.php?id=6146) (`2007-08-03`, ISBN `978-4-7859-2827-8`); BookLive ISBN-matched [volume 1](https://booklive.jp/product/index/title_id/144592/vol_no/001) (`datePublished=2012-02-03`) and [reviews](https://booklive.jp/review/list/title_id/144592/vol_no/001), including an entry-linked observation dated `2012-09-20`. | The rights holder directly describes a human-centered shopping street and its recurring café/town ensemble. Licensed entry material and independent readers corroborate relaxed affection for the town and cast. Comedy and episodic variation keep warmth at 2 rather than 4. |

All four work/title/volume identities match the frozen work IDs. No decorative `『』` was imported into a canonical title. Review text was used only as supplemental, paraphrased observation; no review sentence is copied into product explanation data.

## Cell adjudication

| Position | Proposed cell | Decision | Applied terminal cell | Dictionary-anchor rationale |
|---:|---|---|---|---|
| 3 | `emotionalWarmth=2` | `ACCEPT` | `known,2,0.66` | Recurring support and affection are directly observed within volume 3, while political/family danger prevents warmth from being the sole core reward. |
| 4 | `darkness=0` | `ACCEPT` | `known,0,0.78` | Repeated official volumes 1–2 light/healing framing and independent entry observations directly match “bright and light”; difficult or tearful incidents do not by themselves establish value 2. |
| 5 | `mentalStress=2` | `ACCEPT` | `known,2,0.68` | Repeated burden and frustration are explicit across volumes 1–2, while reviewers independently note the pressure is not oppressive. That is the mixed-pressure anchor, not 4. |
| 5 | `emotionalWarmth=2` | `ACCEPT` | `known,2,0.66` | Caretaking and small consideration recur, but action and gag remain co-central. This matches mixed warmth, not the healing-core value 4. |
| 9 | `emotionalWarmth=2` | `ACCEPT` | `known,2,0.62` | The rights-holder's human-centered town ensemble and entry corroboration establish mixed warmth; episodic comedy prevents an extreme. |

No adjacent value was substituted. No rejected or merely plausible cell was added.

## Hash and reverse-substitution check

- Terminal CSV before this adjudication: `d617355aaf87727bc50f07f17876439aee3a529b5b659ef6ccefe090e396be12`.
- Terminal CSV after the five-cell overlay: `fbfd3b4d9039ae66bdcd7778c63dab317094ad2178a2c300f5f7bb0ee8775bfe`.
- In-memory reverse substitution of exactly those five rows: `d617355aaf87727bc50f07f17876439aee3a529b5b659ef6ccefe090e396be12`.
- Reverse result equals the recorded pre-adjudication hash: **PASS**.
- CSV cardinality remains `170` data rows: ten frozen works × seventeen axes.

## Gate recount

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`. Genre and Theme rows were not changed.

| Position | Before N / T | After N / T | Terminal text result |
|---:|---:|---:|---|
| 3 | `4/6 · 4/7` | `4/6 · 5/7` | `TEXT_GATE_PASS` |
| 4 | `2/6 · 4/7` | `2/6 · 5/7` | `TEXT_GATE_FAIL — N+2` |
| 5 | `2/6 · 4/7` | `2/6 · 6/7` | `TEXT_GATE_FAIL — N+2` |
| 9 | `2/6 · 3/7` | `2/6 · 4/7` | `TEXT_GATE_FAIL — N+2, T+1` |

- Chunk 01 all-text-gate count changes from `0/10` to `1/10` (position 3 only).
- Batch 004 all-text-gate count changes from `3/50` to `4/50` (positions 3, 14, 17, and 20).
- This is text-only closure. Position 3's Art and all separate promotion gates remain unchanged.

## Exact next-route disposition by position

| Position | Exact next route remains? | Reproducible disposition |
|---:|---|---|
| 1 | **Yes.** Futabasha's exact work reader and volume 2–3 product shells remain; a browser-capable retry of the work-specific content endpoint or the already identified licensed volume pages can test the missing Narrative observations. | `NO_FINAL_BLOCKER`; access control is not source absence. |
| 2 | **Yes.** Exact Kodansha volume 2 and 3 reader CIDs remain and can be retried through the provider handoff in a browser session. | `NO_FINAL_BLOCKER`; Narrative coverage remains incomplete. |
| 3 | **Yes, for separate Art follow-up.** Exact licensed volume 1–3 retailer routes remain identifiable even though the text gate now passes. | `NO_FINAL_BLOCKER`; this review does not close Art or promotion. |
| 4 | **Yes.** Shogakukan's exact volume-1 internal reader and official volume 2–3 records remain available for missing Narrative observations. | `NO_FINAL_BLOCKER`; Narrative coverage remains incomplete. |
| 5 | **Yes.** KADOKAWA-linked exact BOOK WALKER volume 2–3 trials remain available for missing Narrative observations. | `NO_FINAL_BLOCKER`; Narrative coverage remains incomplete. |
| 6 | **Yes.** Exact Shueisha volume 1 and 3 readers and their work-specific content endpoints remain; a volume-2 exact-edition route is also the bounded gap. | `NO_FINAL_BLOCKER`; the prior one-context result is not source exhaustion. |
| 7 | **Yes.** The exact Kodansha reader handoff, Sony volume 2, Rakuten volume 3 identity, and BookLive volume 1 route remain identifiable. | `NO_FINAL_BLOCKER`; required Narrative/Tone observations remain unestablished. |
| 8 | **Yes.** KADOKAWA-linked exact BOOK WALKER volume 2–3 trials remain available. | `NO_FINAL_BLOCKER`; absence of a current Dictionary Theme is not by itself incompatibility. |
| 9 | **Yes.** The ISBN-matched BookLive volume-1 browser trial remains available for the remaining Narrative/Tone cells. | `NO_FINAL_BLOCKER`; current text coverage remains incomplete. |
| 10 | **No new exact ISBN retailer/internal-preview route was identified in round 2.** The existing exact entry content routes—press, official jury material, and multiple bounded volume 1–3 reviews—remain readable. | `NO_FINAL_BLOCKER`; retailer-preview absence does not make the work information unavailable. |

This adjudication authorizes no hard blocker. A failed coverage gate remains an evidence/research state unless a permitted blocker is separately proven with reproducible route exhaustion.
