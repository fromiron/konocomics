# Batch 004 chunk 03 round-4 text recovery — independent QA

## Scope and bindings

- Reviewer: Daybreak independent QA; `reviewedByHuman=false`
- Review date / `retrievedAt`: `2026-08-25`
- Scope: frozen position `21`, `work-53fb816835ab36e40a1f` — アンデッドアンラック, exact `entry_1_3_volumes`
- Proposal reviewed: `comedy=2`; no Art, Genre, Theme, identity, safety, blocker, source, promotion, registry, overlay, or generated-artifact change
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- Round-4 recovery SHA-256: `4035282a31e7cf11eb5c29f9a3d2a7cd1841fa9f673f9b016d389f8e382feb1a`
- Terminal text SHA-256 before review: `c37820ca7d6399bd2f3c6fe8e26ea7309f350f3a46c1a84d69800354cd260c56`

The proposal conclusion was not inherited. Both exact Shueisha readers were reopened, all four retained pixels were inspected, and the comedy construct was evaluated independently. The battle itself, exaggerated drawing alone, the title's genre, and the earlier proposal were not treated as evidence.

## Exact official body evidence

| source | publishedAt | body refs and pixel SHA-256 | independent observation |
| --- | --- | --- | --- |
| 集英社 [volume 2 official reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300) | `2020-06-04` | printed pp. `21–22`; `p10.png` = `2de8c2304b929547a85a3c28815700b08435658e8336ba906e166233edf2fc66`; `p11.png` = `d1f5f08477c4ab0c87b6f3908928c58d4f992d70bc07ade6ab1c8fb52bc58349` | In a restaurant/order scene, Andy's death-oriented order and Fuko's immediate shocked response create a bounded everyday mismatch. The following interruption returns to plot/action, so this is an intermittent situational gag rather than proof that comedy is constant. |
| 集英社 [volume 3 official reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088824048) | `2020-09-04` | reader positions `7–8` (`P0007–P0008`); `p07.png` = `23f72b2e459407d589d28c022eea131439658113871719dc2363b2f8123b662d`; `p08.png` = `7805ab59dd4c0d2f935567f2a0542e7625b08bfe7aaffb15e823bf05c6da3539` | Position 7 is serious action and is not counted as comedy. In the distinct post-battle context at position 8, the defeated crowd, Fuko's flat reaction, and the group's off-beat exchange form another bounded situational gag before the page returns to serious Victor dialogue. |

The two accepted observations are from different entry volumes and different scene contexts: an ordinary restaurant exchange and a post-battle group reaction. Their recurrence supports the Dictionary midpoint, `중간중간 개그`. Neither source establishes comedy as the continuous or central reward required for `4`.

Temporary image files were inspected from `/tmp` and were not added to the repository. The official URLs, exact edition/range references, retrieval date, and pixel hashes are retained here.

## Decision

**ACCEPT `comedy=2` at confidence `0.78`.**

The direct official pixels establish two bounded, independent situation-comedy contexts inside volumes 2–3. The value remains conservative because the same pages also contain serious organization/action material. No user-review quorum, popularity signal, or recommendation provenance is needed for this decision.

Guardrails:

- This does not authorize `comedy=4`.
- It does not authorize any other Tone or Narrative cell.
- It does not supply Art evidence or change the all-unknown Art state for this work.
- Position 21 remains without a final hard blocker; this QA does not make a blocker decision.

## Terminal mutation

Exactly one row changed:

```text
work-53fb816835ab36e40a1f,comedy,unknown,,,ev-batch-004-a-work-53fb816835ab36e40a1f
→ work-53fb816835ab36e40a1f,comedy,known,2,0.78,ev-batch-004-a-work-53fb816835ab36e40a1f
```

The terminal matrix remains ten works × seventeen dictionary-order axes: `170` data rows, `170` unique work/axis keys, no duplicate keys. Genres and Themes are byte-preserved.

## Gate result and hashes

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`, and Art `>=2/4` for the complete promotion coverage gate.

| gate | before | after |
| --- | ---: | ---: |
| Position 21 Narrative | `4/6` | `4/6` |
| Position 21 Tone | `4/7` | `5/7` |
| Chunk 03 all-text gate | `0/10` | `1/10` |
| Position 21 complete coverage | fail (`Art 0/4`) | fail (`Art 0/4`) |

Position 21 now passes Genre, Theme, Narrative, and Tone text coverage. This review does not change its Art coverage and therefore authorizes no promotion by itself.

- Updated terminal text SHA-256: `6ac0f81582672c4d07e56b07208299b4c7b8ad92156ffffc48dc8178d5685fb8`
- Unchanged genres SHA-256: `6e4a37abd5683bdfcf5c58f6c4cf1ad7aec5028152feb2c9aaa8522e2112476e`
- Unchanged themes SHA-256: `5a938db4531544f619199cd6a2b72c6e9a6bf9667af56cfe622a89f59f936eec`
- Structural check: `rows=170 works=10 uniqueKeys=170` — PASS
- `git diff --check` — PASS
- `reviewedByHuman=false`

This review authorizes no Art, source, blocker, overlay, promotion, registry, generated-catalog, or commit change.
