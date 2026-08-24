# Batch 003 chunk 05 Daybreak recovery A verification

- reviewDate: 2026-08-25
- reviewer: `gpt-daybreak-blue-latest`
- agent: `/root/daybreak_verify_art_a`
- reviewedByHuman: `false`
- scope: frozen positions 41, 45, 46, 47, and 48 only
- mode: independent gate and pixel verification; no Art values assigned
- result: `REJECT`
- findings: 2
- repositoryEditsByReviewer: this report only

## Frozen input and hash verification

- Frozen Work order and identities match positions 41, 45, 46, 47, and 48 in `frozen-work-set.csv`.
- Their representative source rows are volume 1. The operational amendment permits exact official early-volume 1–3 samples, including aggregation when every used volume has its own direct product bridge.
- Recovery preflight SHA-256: `49575cd19c74142185905ce40eecc7b221e9f04889769409bf4e62169e5bcc9a`.
- Recovery ledger SHA-256: `b4f9023d664bd37e73fced21f51057c4736fd9f7e7c5a44769ca1108cfd4afe2`.
- All selected temporary files were opened as readable internal body pages and recomputed as `33/33 HASH_MATCH`: position 41 `6/6`, position 45 `6/6`, position 46 `9/9`, position 47 `6/6`, and position 48 `6/6`.
- No cover, title, contents, blank, decorative, or adjacent-page fragment was counted as an eligible body page.

## Per-work result

| Pos | Work | Result | Exact reason |
| --: | --- | --- | --- |
| 41 | ファントムバスターズ | **PASS** | The Shueisha volume-2 product identifies ISBN `9784088838946` and directly links reader CID `9784088838946`; the rendered reader also identifies volume 2. All six selected hashes match readable body pages. The pixels supply at least two real contexts: the delivery/apartment scene at `vol2-P0011` and later school lunch/student-council scenes in the remaining refs. The ledger's statement that all `P0011-P0015` are apartment pages is imprecise, but the gate still has at least two contexts. The refs are dialogue and scene-separated material, not one exact start-development-impact-resolved motion sequence, so motion abstention is correct. |
| 45 | となりの関くん | **REJECT** | KADOKAWA product `301401001836` identifies volume 3 ISBN `9784040665191` and directly links the matching BookWalker CID; all six selected hashes match readable body pages. However, `vol3-P005-P010` are one continuous classroom desk-fossil lesson scene. The excavation panel on `P007` explicitly visualizes the dig recreated on the desk; it is not a second narrative scene or setting. Distinct context count is therefore `1`, below the required `2`. No exact bounded physical motion sequence is present, so motion abstention remains correct. |
| 46 | 男子高校生の日常 | **REJECT** | The Square Enix volume-1 product identifies frozen ISBN `9784757528062` and directly links official chapter `7961`; all nine selected hashes match readable episode-1 body pages after the page-0 title splash. The nine pages are nevertheless one continuous boys-room cross-dressing scene. The doorway and sister entrance continue the same location and action, not a second scene context. Distinct context count is therefore `1`, below the required `2`. The handbag swing lacks a separately referenced development and shown impact before its aftermath, so it is not an exact start-development-impact-resolved sequence and motion abstention is correct. |
| 47 | 僕の小規模な生活 | **PASS** | The Kodansha volume-2 product identifies ISBN `9784063756074` and directly links its trial; the rendered title material identifies volume 2. All six selected hashes match readable body pages. `vol2-reader-P007-P010` are chapter 26 bedroom/clothing interaction, while `P011-P012` visibly begin chapter 27 and cover a package and later living-room exchange, giving two distinct narrative contexts. No exact bounded motion sequence is retained, so motion abstention is correct. |
| 48 | ハクメイとミコチ | **PASS** | KADOKAWA products `301307000939` and `301411000822` identify ISBNs `9784047293946` and `9784047301542` and directly link the matching BookWalker volume-2 and volume-3 CIDs. All six selected hashes match readable body pages. Volume-2 forest pages and volume-3 town/community pages are distinct contexts and may be aggregated under the amendment. The forest sample stops at an unresolved owl attack, and the town sample contains no bounded action sequence; motion abstention is correct. |

## Boundary

Positions 45 and 46 must not be treated as static `sample-ready` from this recovery set unless a second genuine scene context is added. This report does not assign Art values, recommend promotion, modify source or promotion data, or constitute human review.
