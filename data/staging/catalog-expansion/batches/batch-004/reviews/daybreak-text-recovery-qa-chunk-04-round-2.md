# Batch 004 text-gap recovery independent QA — chunk 04, round 2

## Scope and bound inputs

- Reviewer: Daybreak independent QA
- Review date: `2026-08-25`
- Scope: frozen positions `31–40`, exact `entry_1_3_volumes`; position 38 is the complete single-volume work
- `reviewedByHuman=false`; Art, identity, safety, promotion, blocker, overlay, registry, source, and generated artifacts are outside this review
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- Round-2 recovery SHA-256: `f24eb79f366a84cf11c647e1ac06a1044f0c9cb6ab4492de5ded3ea41e47022b`
- Prior terminal text SHA-256: `a3a5f86bef048c12aea8cb7f15df4f118c9cfcc43d8b62d8a5093f6ea006f072`
- Genres SHA-256: `e0c501bf7575d0e5c02c98741a4637b3090b8b46a67eab3a2fdbb68990236acd`
- Themes SHA-256: `fa5511e1fcb9eabd5f650d84026492fa945e9b1df89ba4ee8067b96ada202ac0`

## Decision rule and provenance audit

`ACCEPT` requires a direct entry-range observation that fits the Dictionary anchor. `UNKNOWN` preserves a plausible claim whose primary evidence or exact reviewer-to-claim mapping is still incomplete. `REJECT` is used when the proposed construct does not fit the Axis definition. No value is averaged, inherited from genre, or filled to meet coverage.

- All ten official route families are title/creator/edition bound, but most round-2 checks expose a synopsis, viewer shell, or payload rather than a complete event ledger. Route availability therefore disproves source exhaustion but does not itself authorize a Factor.
- The position-38 corrected Note URL is live. Its page metadata exposes `datePublished=2024-07-09T08:33:26+09:00`; the round-2 report's `2024-07-09` is correct. The older `2024-07-08` ledger date must not be used as the final provenance date.
- Position 38 has distinct bounded review authors (Meg, 桐生薫, えとうまこ). Their repeated comedy-to-tension/state-change observation supplements the official weekly-meeting premise and supports ordinary pacing. Review-only reveal, mastery, and problem-solving interpretations remain non-terminal.
- Same-page Cmoa reviewer bundles for positions 31 and 37 do not map each proposed Tone/reveal claim to two exact independent reviewers. They remain supplemental leads, not terminal cells.
- No new Genre or Theme proposal survives this round. Eating remains distinct from the `cooking` Theme, and yakuza threats remain distinct from the `combat` Theme.

## Per-work cell adjudication

| pos | proposal | result | rationale |
|---:|---|---|---|
| 31 | `worldBuilding=2`, `pacing=2` | `FROZEN_NO_OP` | Both are already terminal known values. The viewer payload adds no new event/reaction ledger. |
| 32 | `progression=0` | `UNKNOWN` | One repetitive-day episode does not prove near-absence of growth rewards across volumes 1–3. |
| 33 | `progression=2` | `REJECT` | Health, work, and life-planning problems are character/life transitions, not repeated growth, acquisition, or mastery rewards. |
| 34 | `pacing=2`, `comedy=4` | `FROZEN_NO_OP` | Both are already terminal. The official route correctly rejects `cooking`; it supplies no new cell. |
| 35 | `problemSolving=2` | `UNKNOWN` | Positional self-proof and repeated matches establish sports action. No official bounded sequence demonstrates recurring constraint analysis plus solution; user reviews cannot supply that missing primary observation. |
| 36 | `pacing=2`, `problemSolving=2` | `FROZEN_NO_OP` | Both are already terminal. The fallback viewer yielded no new bounded incident ledger. |
| 37 | `mysteryReveal=2` | `UNKNOWN` | Official relationship/organization expansion is not a reveal mechanic, and the review bundle still lacks exact reviewer-to-entry-claim mapping. |
| 38 | `pacing=2` | `ACCEPT` | The official single-volume premise establishes weekly meetings, and three distinct complete-work reviews converge on bounded state changes from comedy through tension/payoff. This supports ordinary arc movement, not rapid `4`. |
| 38 | `progression=2` | `REJECT` | Singing lessons and relationship movement do not establish repeated skill/mastery reward with a start-to-result chain. |
| 38 | `problemSolving=2` | `REJECT` | A lesson goal is not recurring constraint analysis and ingenious resolution. |
| 38 | `mysteryReveal=2` | `UNKNOWN` | The clue/payoff observation is review-led; the official premise and award text do not directly establish reveal as a recurring reward. |
| 39 | `progression=2` | `REJECT` | Successive friendship and romance states belong to character/relationship movement, not the Dictionary's progression reward. |
| 40 | `progression=2` | `REJECT` | Cohabitation and widening relationships are not growth/acquisition/mastery rewards. |
| 40 | `mysteryReveal=2` | `REJECT` | The switched-birth fact is the opening premise; volumes 2–3 do not establish recurring clue/reveal reward. |

## Terminal mutation and gate result

Exactly one cell changed:

```text
work-c2df32661c0b925ff74f,pacing,unknown
→ work-c2df32661c0b925ff74f,pacing,known,2,0.65
```

Genres and Themes were not modified. The terminal text CSV remains `10` works × `17` unique axes (`170` rows, `0` duplicate work/axis keys).

| gate | before | after |
|---|---:|---:|
| Genre | 10/10 | 10/10 |
| Theme | 7/10 | 7/10 |
| Narrative | 0/10 | 0/10 |
| Tone | 3/10 | 3/10 |
| all four text gates | 0/10 | 0/10 |

Position 38 Narrative coverage changes from `0/6` to `1/6`; it remains `TEXT_GATE_FAIL — N+3, T+1`. No work becomes promotion-eligible or blocker-authorized.

The round-2 baseline's printed `remaining gate gap` values are not authoritative: several do not match the bound terminal CSV (for example positions 31, 33, 35, and 36). The counts above were recomputed from the terminal files.

## Result hashes and checks

- Updated terminal text SHA-256: `881e6595d369124d7ef13f0abe0e291cc58cb570fd984b757d2c3b8efe67e687`
- Unchanged genres SHA-256: `e0c501bf7575d0e5c02c98741a4637b3090b8b46a67eab3a2fdbb68990236acd`
- Unchanged themes SHA-256: `fa5511e1fcb9eabd5f650d84026492fa945e9b1df89ba4ee8067b96ada202ac0`
- Structural check: `works=10 rows=170 duplicate_keys=0`
- `git diff --check`: pass

This review authorizes no Art, source, blocker, overlay, promotion, registry, generated-catalog, or commit change.
