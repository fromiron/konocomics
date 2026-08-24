# Batch 003 Art recovery B — Daybreak verification

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- agent: `/root/daybreak_verify_art_b`
- reviewedByHuman: `false`
- mode: independent evidence verification; no Art values assigned
- scope: frozen positions 2, 3, 5, 7, and 12 only
- overallResult: `REJECT`
- workResults: `1 PASS / 4 REJECT`
- temporaryImagesCommitted: `false`
- sourceOrPromotionMutation: `none`

## Verification method

The frozen Work IDs, titles, and representative volume-one ISBNs were checked
against `frozen-work-set.csv` and the batch `source/volumes.csv`. The licensed
product records and publisher-product bridges were then checked against the
recovery B ledger. All 30 selected temporary files were opened at original
detail and their SHA-256 values were recomputed: `30/30 HASH_MATCH` with the
recovery B preflight and ledger.

The page gate was applied after excluding covers, title or chapter-opening
splash pages, contents, advertisements, and added edition material. Distinct
contexts mean separate scene contexts, not successive beats of one continuous
scene. Motion remains ineligible only when the selected pixels do not expose an
exact continuous start, development, impact, and resolved endpoint.

## Per-work results

| Pos | Work | Result | Edition/body bridge | Body-page and context gate | Hash check | Motion abstention | Exact reason |
| --: | ---- | ------ | ------------------- | -------------------------- | ---------- | ----------------- | ------------ |
| 2 | 大東京トイボックス (`work-048a39f42bd18cb0823e`) | **REJECT** | **PASS.** Frozen vol.1 ISBN `9784344809437` matches the licensed digital-remaster vol.1. The product states that it was remade from original manuscript data; added end matter is excluded, leaving a valid body-content bridge with the recorded reproduction/tone ceiling. | **REJECT: 5 eligible body pages, at least 2 contexts.** `reader-pos-02-p3` is a title-and-credits splash, not an eligible body page. The remaining five readable pages cover street and home/bedroom material. | `6/6 HASH_MATCH` | **Supported** for the eligible refs: walking/running poses and unrelated scene changes do not provide a resolved continuous sequence. | The row claims six eligible body pages but counts the visibly excluded title splash `reader-pos-02-p3`; the static sample gate is therefore short by one page. |
| 3 | デトロイト・メタル・シティ (`work-04f35b4c99514d50231d`) | **PASS** | **PASS.** Frozen vol.1 ISBN `9784592143512` matches the licensed complete-edition vol.1. The product explicitly states that prior body contents are unchanged apart from added commentary and color-enhancement pages, which are not in the selected set. | **PASS: 6 readable body pages, at least 3 contexts.** The pages show performance/club, office, and station/street contexts. | `6/6 HASH_MATCH` | **Supported.** The selected performance, running, escort, and gesture panels are separated by dialogue or scene changes and do not form one exact resolved action sequence. | Exact edition bridge, body-page threshold, context threshold, hashes, and motion abstention all hold. |
| 5 | 私の少年 (`work-07faf4019b12de5e877d`) | **REJECT** | **PASS.** The current licensed Kodansha vol.1 ISBN `9784065116838` states that the previously sold version has unchanged contents with only a renewed cover; the frozen Futabasha vol.1 is ISBN `9784575848106`. This supports body content only, not identical pagination or design metadata. | **REJECT: 5 eligible body pages, at least 2 contexts.** `reader-pos-06-p7` is the explicit chapter-opening title page `第1話 体温計`, so it cannot be counted as one of six body pages. The remaining pages still cover home, park/transit, and office material. | `6/6 HASH_MATCH` | **Supported.** No selected eligible run supplies a continuous start-through-resolved-end action sequence. | The row reaches six only by counting the chapter title page `reader-pos-06-p7`; the static sample gate is short by one page. |
| 7 | ドリフターズ (`work-171b262b7ad72871f795`) | **REJECT** | **PASS.** Licensed vol.1 directly matches frozen ISBN `9784785934071`; no edition substitution or cross-volume inference is present. | **REJECT: 5 eligible body pages.** `reader-pos-04-p5` is the explicit chapter-title splash `第1話 FIGHT SONG`, not an eligible body page. | `6/6 HASH_MATCH` | **Supported.** The battlefield action continues beyond `reader-pos-08-p8`, so the selected run has no resolved endpoint. | The row reaches six only by counting the chapter-title splash `reader-pos-04-p5`; the static sample gate is short by one page. |
| 12 | 乱と灰色の世界 (`work-319e39a597d16251efc9`) | **REJECT** | **PASS.** Licensed KADOKAWA/HARTA COMIX vol.1 directly matches frozen ISBN `9784047261457` and the KADOKAWA product record. | **REJECT: 6 readable body pages but only 1 scene context.** `reader-pos-02-p3` through `reader-pos-08-p8` are one continuous bedroom/household magical-transformation scene. No selected school scene or separate family-interaction context is present. | `6/6 HASH_MATCH` | **Rejected.** The contiguous `reader-pos-04-p4` through `reader-pos-08-p8` run shows objects and clothing lift, the child levitate and tumble, impact/landing, and the child resting afterward. That is an exact bounded start-development-impact-resolved sequence, so blanket motion abstention is not valid. | Both the recorded `distinctContextCount=3` and `motionGateAttemptable=false` contradict the selected pixels. No motion value is assigned here. |

## Boundary

This is supplemental model verification only. It does not adopt or replace any
Local or Gemini Art value, does not satisfy the required Art quorum, and is not
human approval. No Art row, source row, promotion state, generated artifact, or
temporary image was changed.
