# Batch 002 text adjudication — chunk 02, round 02

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 11–20, supplemental coverage evidence only
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: supplemental proposals and the independent Pass B are resolved from source authority, edition scope, and Dictionary anchors. No value is averaged or accepted to satisfy a quota.
- Art boundary: no Art conclusion is used in this text pass.

## Frozen inputs

| Input                                             | SHA-256                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `adjudication/text-chunk-02-round-01.md`          | `fda86dd1ec1c8868faf8f1678b9d95e9fcb5f547f5df741b48e4f406e3949726` |
| `adjudication/text-gap-queue-chunk-02.csv`        | `5b10a5e91795c7b191ea9b38d1d98f5b986dd374b1f6f85cb0f8bba8f329963d` |
| `research/text-gap-chunk-02.md`                   | `096619821632f85be1325425ca4ee025eec27fcf0ef7de1691ddd42018f8d844` |
| `reviews/text-gap-chunk-02-independent-review.md` | `7b0787a72c048b288aa03c133bbc9ba5a2b699f39d95b8a3ede334767a862348` |

The independent reviewer rechecked all 43 URLs, distinguished accounts from
source families, preserved edition bridges, and reviewed all routed proposals
without changing identity, safety, or promotion state.

## Accepted supplemental decisions

- `外天楼 comedy=2` at confidence `0.86`: the exact complete-volume publisher description and two independent review families repeat an early-to-middle comic mode that later turns serious. Tone becomes **3/7**.
- `嘘解きレトリック comedy=2` at `0.80` and `emotionalWarmth=2` at `0.84`: exact volume-1 reviews plus a second platform repeat gentle comedy, acceptance, trust, and warmth alongside the mystery. Tone becomes **5/7** and the text gate passes.
- `人形芝居 darkness=2` at `0.77`: exact original-volume descriptions establish loneliness and loss, while two review families repeat unavoidable separation and sad episodes. Tone becomes **4/7**.
- `魔法使いの嫁 pacing=2`, `mysteryReveal=2`, `worldBuilding=3`, `characterArcWeight=4`, `relationshipStructure=2`, `darkness=3`, `mentalStress=2`, `romance=3`, and `emotionalWarmth=3` at the independently reviewed confidences. The KADOKAWA volume pages explicitly state unchanged manga content from the Mag Garden volumes, so the edition bridge is valid. Narrative becomes **3/6** and Tone **6/7**.
- Add Genre `comedy` to `正反対な君と僕` because all three official volume descriptions directly classify the scoped work as romantic comedy; this does not create a numeric comedy Axis.
- Add Genre `romance` to `魔法使いの嫁` because marriage and learning love recur in the bridged official volume 1–3 descriptions; this is not inferred from its numeric Axis.

## Rejected or modified proposals

- `魔法使いの嫁 progression=2 -> U`: restarting life, learning love, and expressing an opinion support the character arc, not repeated acquisition or mastery.
- `魔法使いの嫁 pacing=3 -> 2`: the official descriptions show volume-scale Arc changes, not repeated short-interval state changes.
- All other routed unknowns remain explicitly closed `unknown`; event danger is not subjective stress, a job is not a solution method, and Genre is not an Axis value.

## Coverage outcome

| Outcome                               | Works |
| ------------------------------------- | ----: |
| Text coverage pass                    |     1 |
| Finite additional evidence search     |     9 |
| Hard blocker                          |     0 |
| Unresolved proposal inside this round |     0 |

`嘘解きレトリック` is the sole text-gate pass. It is not promoted by this
document; Art, Evidence rows, recommendation context, independent final review,
and the unchanged promotion gate must still pass. The remaining nine works are
frozen in `text-gap-queue-chunk-02-round-02.csv`; a failed route leaves values
unknown and moves to an actual coverage decision rather than fabricated data.
