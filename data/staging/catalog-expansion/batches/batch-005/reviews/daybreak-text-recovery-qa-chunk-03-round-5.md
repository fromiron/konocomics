# Batch 005 text recovery round 5 — chunk 03 independent QA

## Scope and binding

- reviewer: Daybreak independent QA/adjudicator
- reviewDate: `2026-08-25`
- reviewedByHuman: `false`
- frozen position: `29`, `work-6c6341781c12b590864f` — 鉄楽レトラ
- evaluation scope: `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- round-5 recovery input SHA-256: `85150ee698e3b7e0394f42671a3aefd33f6d0983be68b5bb037fae22db7aa8c6`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`

The Factor Dictionary Theme rules, current terminal text/Genre/Theme files,
the original official-first packet, all chunk-03 recovery and independent QA
reports, the blocker challenge and blocker adjudication were read before the
proposal was independently checked. No prior model conclusion was inherited.
Art axes and Art evidence were not evaluated or changed.

## Exact official reader recheck

All three exact Shogakukan e-comi readers were reopened and their rendered body
pages were read on `2026-08-25`.

| Volume | Official route | PublishedAt | Reopened page | Direct bounded observation |
| --- | --- | --- | --- | --- |
| 1 | [小学館eコミックストア 鉄楽レトラ 1 reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091234450000d0000000) | `2011-10-12` | UI pages `28/52`, `40/52` | A school rooftop/peer scene recurs before a conversation explicitly connects the protagonist's transfer to starting basketball. This is school life acting on the restart arc, not a school building used as scenery once. |
| 2 | [小学館eコミックストア 鉄楽レトラ 2 reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091236160000d0000000) | `2012-04-12` | UI page `8/11` | Uniformed students conduct a timed running start (`位置について`, `スタート`, `タイム計りまーす`) beside the school building. The peer activity continues the school-life strand in a separate volume and scene context. |
| 3 | [小学館eコミックストア 鉄楽レトラ 3 reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091240770000d0000000) | `2012-11-12` | UI page `8/11` | A visible message makes the midterm-test result and subjects below 50 points an immediate character consequence. School obligations therefore remain active in the third entry volume rather than disappearing after the initial setting. |

The three observations cover peer interaction, physical activity, transfer,
and academic consequence across volumes 1–3. Together they establish school as
a recurring sub-material that organizes part of the bounded youth/restart
experience. They do not establish school as the sole repeated core mechanic,
so centrality `2` is not supported. No sports competition, strategy,
problem-solving, mental-stress, or Art value is inferred from these pages.

## Decision

| Work | Proposal | Verdict | Rationale |
| --- | --- | --- | --- |
| `work-6c6341781c12b590864f` — 鉄楽レトラ | `school`, centrality `1`, confidence `0.73` | `ACCEPT` | Three exact official entry-volume readers independently reproduce distinct school-life functions. This satisfies the Dictionary's centrality-1 boundary of recurring sub-material and is stronger than incidental setting recurrence. |

Exactly one row was added to `adjudication/themes-final-chunk-03.csv` with
evidence ID `ev-batch-005-r5-work-6c6341781c12b590864f`. Theme uniqueness is
preserved. No terminal text or Genre row was changed.

## Hash and gate audit

| File | Rows excluding header | Prior SHA-256 | Current SHA-256 | Change |
| --- | ---: | --- | --- | --- |
| `adjudication/themes-final-chunk-03.csv` | 8 | `8565742fbe22b73f265857248834573c57c6a312941173eb377b62ab67d7f5d8` | `58a5b3b5e77ced981d7059492e090ad0bb6073ec8c4965dd14dae71f367f28df` | exactly one unique Theme row added |
| `adjudication/text-final-chunk-03.csv` | 170 | `93fb420cefad1eac48a2191c7e1f558a935d21b2b716f242a9d2de6a16530089` | same | byte-identical during this QA |
| `adjudication/genres-final-chunk-03.csv` | 10 | `ed6869c24e1d55a2f651ebfd1ee0191c0d2e54156c997eb09be936e877b044f6` | same | byte-identical during this QA |

For position 29, the non-Art gates change from `1/1 · 0/1 · 2/6 · 3/7`
to `1/1 · 1/1 · 2/6 · 3/7` for Genre, Theme, Narrative, and Tone. It still
fails the unchanged text gate by two Narrative and two Tone cells, so this QA
does not authorize promotion or a blocker.

At the current terminal hashes, chunk-03 non-Art totals are Genre `10/10`,
Theme `6/10`, Narrative `2/10`, Tone `6/10`, and all four text gates `2/10`.
Art was neither adjudicated nor used to change this verdict.

## Boundary

- Unknown cells remain explicit; no zero or midpoint was synthesized.
- No Art, source/provenance, safety, identity, blocker, overlay, registry,
  eligibility, generated catalog, recommendation formula, Gold, or commit state
  was changed.
- No human-review claim was made.
