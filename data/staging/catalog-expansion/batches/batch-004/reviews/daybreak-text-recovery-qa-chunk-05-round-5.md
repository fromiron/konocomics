# Batch 004 chunk 05 round-5 text recovery — independent adjudication

## Scope and bindings

- Reviewer: Daybreak independent adjudicator; `reviewedByHuman=false`.
- Work: frozen position `49`, `work-fd2a957c501c36047ed0`, 青の祓魔師.
- Repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Independent retrieval and verification date: `2026-08-25`; every source below has
  `retrievedAt=2026-08-25`.
- Round-5 recovery packet SHA-256:
  `9e3dea80601e89d2c4d3a55f7210a673233216cc1e1858f3adb8c444b4d18276`.
- Previous chunk-05 recovery QA SHA-256:
  `9bbbbdf3e00676d7935d3b402ae44b56d4080eec3fa01b4b4507a0c8c50b6ec6`.
- Frozen work-set SHA-256:
  `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Factor Dictionary SHA-256:
  `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Position-42 final blocker adjudication SHA-256:
  `8bb960c54e8c2d574290242870df9a21a21246c683d9c200c92f8ed10a4a5a39`.
- Mutation boundary: one `mysteryReveal` cell in
  `adjudication/text-final-chunk-05.csv` and this report. No Art, Genre, Theme,
  source, generated, promotion, registry, identity, safety, ISBN, blocker, or
  overlay file was changed.

The Luna conclusion was not inherited. The official edition and exact body sequence were reopened in
a fresh browser session, and the proposal was compared directly with the Dictionary's `0 / 2 / 4`
anchors. The pages were used only for readable dialogue and event order, not for any Art Axis.

## Decision

`mysteryReveal=2`, confidence `0.68`: **ACCEPT**.

This is not merely a genre premise stated by a product blurb. The official first-volume body presents a
guardian-held identity secret as a staged disclosure: an unexplained demonic manifestation is followed
by the two-world/demon rule, the protagonist's demonic parentage and Satan lineage, the concealment key,
the sword's containment rule, and the fact that the twins were raised as humans. The protagonist reacts
to each newly disclosed condition, and the sequence changes his understanding of his identity and
available choices.

That structured entry reveal satisfies the value-2 anchor, `비밀·반전이 일부 존재`. Value 2 does not
require a multi-volume clue-solving loop. Value 4 is rejected because the inspected entry does not show
clue collection, deduction, or recurring truth disclosure as the work's major reward. The later volume-2
and volume-3 training/mission material was not converted into additional reveal evidence.

## Official evidence reopened

| Source | Published | Retrieved | Independent finding |
| --- | --- | --- | --- |
| [集英社 official volume-1 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874709-5) | `2009-08-04` | `2026-08-25` | Confirms title, creator, first-volume ISBN `9784088747095`, 194-page edition, and the official trial link. The synopsis establishes the public-facing lineage premise but was not used alone to score the Axis. |
| [集英社 ISBN-bound licensed reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088747095) | edition route bound to the product date | `2026-08-25` | Fresh Playwright navigation reproduced the official title and the body sequence corresponding to reader current approximately `35–41`. The sequence separately discloses concealment/awakening, the world rule, demonic parentage/Satan lineage, the concealment key and sword rule, and human upbringing of the twins. |
| [集英社 official volume-2 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874757-6) | `2009-11-04` | `2026-08-25` | Retained only as the entry-range boundary. Its training/camp material does not add a second reveal claim. |
| [集英社 official volume-3 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-870016-8) | `2010-03-04` | `2026-08-25` | Retained only as the entry-range boundary. Its mission/power material does not add a second reveal claim. |

The fresh browser screenshots were transient and remain outside the repository. Their SHA-256 values are:

- reveal stage A: `20f9c81a51f9f18eec94a43cdbd7506f181574784dc5ef709585ddc8d63b683a`
- reveal stage B: `6b3d13b87eed546ee813016be2726108fe93a1acc7cc6964bdfcd99ae7154df4`
- reveal stage C: `94cfd0bd61b2d3cdcb0b8f371c9c962b388c70bd7a9f42d39c73606b48348bc6`

No screenshot or temporary reader asset was committed.

## Cell adjudication

| Position | Proposed cell | Decision | Applied terminal cell | Dictionary-anchor rationale |
| ---: | --- | --- | --- | --- |
| 49 | `mysteryReveal=2` | `ACCEPT` | `known,2,0.68` | Multiple linked identity conditions are deliberately concealed and then disclosed in successive stages of the official first-volume body. This is a real secret/reversal signal at 2, but not a clue/deduction-centered major reward at 4. |

The existing `progression=2`, `pacing=2`, and `worldBuilding=2` cells were not reopened. No genre,
combat, danger, or public synopsis alone was converted into this Axis.

## Hash, reverse-substitution, and schema checks

- Terminal CSV before adjudication:
  `ccb7e51c60ba966f65a77855483847b31d32e34436ce2caa3c1ec95a67156fa6`.
- Terminal CSV after the one-cell overlay:
  `3fd5e246b3aa9c0fb6220cb80912ab6e686636f8e455b4e1cace3637710dc647`.
- In-memory reverse substitution of exactly the accepted row:
  `ccb7e51c60ba966f65a77855483847b31d32e34436ce2caa3c1ec95a67156fa6` — **PASS**.
- CSV cardinality: `170` data rows, `10` works, `17` axes per work, `170` unique
  `(workId, axis)` pairs — **PASS**.
- Position-42 terminal block: `17` rows; ordered-row SHA-256
  `e39986a76a791872fdbae8dc93c5203c6739986c35af18a392e2cc5c737a5754` — **UNCHANGED**.
- Genre CSV:
  `c7c7ab76b16caa86418da729165b0f457f763be691fdf5941ddd14c97af3214b` — unchanged.
- Theme CSV:
  `4fd1c0aad8ca4ef2a32cc288d250fc7aab675bbd443b275ecb9ba228e27855cc` — unchanged.

## Gate recount

Position 49 changes from Narrative `3/6` to `4/6`; Tone remains `5/7`, Genre and Theme remain
present, and Art remains `3/4` known with `motionImpact=unknown`. It therefore changes from
`TEXT_GATE_FAIL — N+1` to `TEXT_GATE_PASS` and satisfies the existing Factor coverage gates.

- Chunk-05 all-text-gate positions change from `43, 44, 47` (`3/10`) to
  `43, 44, 47, 49` (`4/10`).
- Against the live Batch-004 terminal snapshot, all-text-gate positions change from
  `3, 14, 17, 20, 21, 43, 44, 47` (`8/50`) to
  `3, 14, 17, 20, 21, 43, 44, 47, 49` (`9/50`).
- This report authorizes the text cell only. It does not independently authorize promotion or alter
  any blocker decision.

## Handoff

- Position 49 now passes the text and existing Art coverage gates.
- Position 42 remains untouched with
  `FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE`.
- No source, generated artifact, final overlay, promotion registry, or blocker record was modified.
