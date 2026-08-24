# Batch 002 Art preflight chunk 04

- Review date: `2026-08-23`
- Frozen positions: `31–40`
- Candidate HEAD at capture start: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- `reviewedByHuman=false`
- Muse Spark 1.2: `NOT_USED`
- Cursor Grok 4.6 High non-fast Art role: `ABSTAIN`

This is the official-preview access and sampling preflight plus the bounded Local Codex pass requested for chunk 04. It does not promote a work and does not write source Factors. Temporary browser captures remain only under `/tmp/batch002-art-preflight-chunk04.7n26GY`.

## Frozen inputs

| Input                               | SHA-256                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `frozen-work-set.csv`               | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `research/chunk-04.md`              | `c7436d6d23b304d72700ad7a1d4ebff881ac08e865438a4974c1de36c96b0999` |
| `adjudication/identity-chunk-04.md` | `65b08172722607773bb10c65940e3052c5c6280abcc2a27606b1694321be255a` |

## Efficiency gate

- Only publisher-hosted or publisher-linked official internal previews were attempted.
- A static Art axis becomes attemptable only after the preview is mapped to the frozen entry edition and exactly six readable internal pages cover at least two scene contexts.
- Covers, chapter-title splashes, synopsis copy, animation imagery, and user opinion were excluded.
- `motionImpact` requires one exact continuous start-development-impact-end sequence. Isolated gestures, poses, or discontinuous pages never satisfy it.
- An access, page-count, or edition failure closes the axis `unknown-ready`. It is neither a low value nor a promotion blocker.

## Results

| Work                         | Edition mapping                                     | Access       | Pages | Contexts | Static | Motion | State           |
| ---------------------------- | --------------------------------------------------- | ------------ | ----: | -------: | ------ | ------ | --------------- |
| 軍靴のバルツァー             | exact standard volume 1 ISBN                        | product only |     0 |        0 | no     | no     | `unknown-ready` |
| flat                         | official first episode links exact volume 1         | accessible   |     6 |        3 | yes    | no     | `sample-ready`  |
| スーパーの裏でヤニ吸うふたり | official introduction lists exact volume 1          | accessible   |     6 |        3 | yes    | no     | `sample-ready`  |
| ケロロ軍曹                   | exact volume 1 delegates to BOOK☆WALKER             | timeout      |     0 |        0 | no     | no     | `unknown-ready` |
| 百姓貴族                     | official volume 1 viewer                            | accessible   |     6 |        3 | yes    | no     | `sample-ready`  |
| 月刊少女野崎くん             | official opening chapter to exact volume 1          | accessible   |     6 |        3 | yes    | no     | `sample-ready`  |
| 私の推しは悪役令嬢。         | official first episode links exact manga volume 1   | accessible   |     6 |        3 | yes    | no     | `sample-ready`  |
| 僕とロボコ                   | reader cid is exact volume 1 ISBN                   | accessible   |     6 |        3 | yes    | no     | `sample-ready`  |
| 屍鬼                         | original-volume digital JDCN with paper-ISBN caveat | accessible   |     6 |        3 | yes    | no     | `sample-ready`  |
| 大ダーク                     | trial route embeds exact volume 1 ISBN              | accessible   |     6 |        3 | yes    | no     | `sample-ready`  |

Totals: `8 sample-ready`, `2 unknown-ready`, `0 motion-gate-attemptable`, `0 Art hard blockers`.

All ten recorded official URLs returned HTTP `200` after redirects in the final live check on `2026-08-23`. This checks route availability only; it does not override the BOOK☆WALKER viewer timeout recorded for ケロロ軍曹.

## Access and edition limitations

1. 軍靴のバルツァー has an exact official product page but no discoverable publisher internal preview. No pixels were interpreted.
2. ケロロ軍曹 has an exact KADOKAWA volume mapping and its product page delegates trial reading to BOOK☆WALKER. Repeated browser attempts timed out before any internal page became readable. No pixels were retained.
3. 屍鬼 uses the official original-volume digital JDCN reader. The official item record preserves the original paper volume order and release date but does not display frozen paper ISBN `9784088745497`; the Local result is therefore explicitly limited to that official digital entry sample.
4. The 私の推しは悪役令嬢。 color chapter-title splash and 大ダーク cover/color plates were captured during access checks but excluded from the selected page set.
5. Some viewers expose deterministic interaction refs rather than stable printed folios. Those refs and exact screenshot hashes are preserved in `preflight.csv`; no temporary image is in the repository.

## Closure

The eight qualifying works proceed only as Local Art drafts. 軍靴のバルツァー and ケロロ軍曹 close four-axis `unknown` for this pass. All ten `motionImpact` axes close `unknown` because no selected packet isolates the exact continuous sequence demanded by current policy.
