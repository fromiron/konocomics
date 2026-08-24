# Pilot 001 independent review — かくかくしかじか / ましろのおと

## 0. Review boundary and contract

- Repository HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Frozen candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Review date / source retrieval date: `2026-08-23`
- Scope: official standard-volume material from entry volumes 1–3 or the first major episode.
- Axis order:
  - Narrative: `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`
  - Tone: `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`
- Immutable gate checked from `src/domain/catalog/coverage.ts`, `src/domain/catalog/constants.ts`, and `docs/planning/02-product-spec.md` §6: Narrative and Tone each require coverage `>=0.60`, hence at least `4/6` and `5/7` known axes respectively. `unknown` is not a midpoint or a low value.
- I read the Factor Dictionary and annotation guide before inspecting the evidence. I then inspected the archived official pages independently; I did not use the conclusions in `/tmp/pilot-text-gap-g.md` as premises.
- `reviewedByHuman=false`. This is model-panel evidence, not human validation or promotion authorization. Art is out of scope.

## 1. Evidence integrity and source ledger

The stored page checksum manifests for all inspected 集英社 page sets and the complete 講談社 Track 1 page set passed `sha256sum -c` during this review.

| Work | Official source and URL | Published / released | Inspected entry range | Locally rechecked integrity |
|---|---|---:|---|---|
| かくかくしかじか | 集英社 [volume 1 product](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782457-5) and [reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784087824575) | 2012-07-25 | Standard vol.1; complete chapters 1–2, pp.5–48 | HTML `1ccbb4bdbaf77c02a686cff86cc7d2a483dcb8bf8f5f61f4b3fa8caffc52179d`; page manifest `eb8c2b57672658d2c0bf8f85d4150a14e517fd48b23aa8e45463ceae65b92a4a` |
| かくかくしかじか | 集英社 [volume 2 product](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782653-1) and [reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784087826531) | 2013-05-24 | Standard vol.2; complete chapter 8, pp.3–22 | HTML `042a8cf444459e3c2283d1acfe94be5c62536b45f771972c74a3fb4ccda1de7c`; page manifest `d2c20466e9ddc6982aef7867781d90d92ed70396b55c4b34d4390538e25d7cd4` |
| かくかくしかじか | 集英社 [volume 3 product](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782746-0) and [reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784087827460) | 2014-01-24 | Standard vol.3; complete chapter 15, pp.3–22 | HTML `b6cfca874409fdea16f37062e88e73b05ee4798c27c0522e592d8eab4d98f7bf`; page manifest `d4efb94516c9624cb1f8ef3313f513791b1f2a19a091e182b2afede559e21c5f` |
| ましろのおと | 講談社 [volume 1 product/trial](https://www.kodansha.co.jp/comic/products/0000043275/trial), マガポケ official Track 0 parts 1–7 and Track 2 parts 1–2, and 講談社 [complete Track 1 publication](https://news.kodansha.co.jp/comics/9461) | vol.1 2010-10-15; article 2022-10-14; web republication shown 2019-01-16 | Entire standard vol.1, Track 0–2, printed pp.3–212 | Product HTML `d5dafd31f5b460efa35d4478272b0c6813635b6dd802a1b0d3fb600d8dce3d6b`; article HTML `b6cbcbaa364a9f847a916676c9322639e15f5e42cb4daa300992df5c68d96f96`; Track 1 page manifest `710b3a8d2dd11e94c043a5894e6e8e544481392d0f4f306d4b20f3ad3adaaae1` |
| ましろのおと | 講談社 [volume 2 product/trial](https://www.kodansha.co.jp/comic/products/0000043280/trial) | 2010-12-17 | Standard vol.2 product description and 15-page opening trial | HTML `991ae0eb4b0ced73dbdd2e29a9752042baa023e7f08a59b3fcafe72673a48309`; page manifest `7a44658e3996ce1e31f3f413d36200de8b2475e9d80f18373aca205628954048` |
| ましろのおと | 講談社 [volume 3 product/trial](https://www.kodansha.co.jp/comic/products/0000043295/trial) | 2011-04-15 | Standard vol.3 product description and 15-page opening trial | HTML `fd398c111d1d56d365355e17b06828afcfcea0a6eb86a5674e02b1be05e26f3b`; page manifest `98dc0c0ccafc0f7bc0e1745d0540d32bdc0171c2b4a3c589c4fa73e109add5b1` |
| ましろのおと | マンガ大賞2011 [official jury comments](https://www.mangataisho.com/data/2011/comment2011.pdf) | 2011 | Comments explicitly bounded to the two volumes then released; used only for concrete entry observations, never for award provenance as Factor evidence | PDF `04eb7b41b26901ad8084ad3fec6871a8780aa481853610e41816ecee9892cd28` |

## 2. かくかくしかじか — independent decisions

Work: `work-07b11ec79f10c7eb7e05`; representative ISBN `9784087824575`.

### `mysteryReveal=0` — ACCEPT

This is supported as a structural negative, not inferred from a non-mystery Genre or a synopsis omission. Four complete chapters distributed across volumes 1–3 directly show the work's entry reward structure:

- chapters 1–2 repeatedly pay off art instruction, redraw/practice, the protagonist's self-appraisal, and the student–teacher relationship;
- chapter 8 stages an examination result as progression and comic reversal, not as a clue, deduction, hidden identity, or truth-disclosure line;
- chapter 15 continues chronological memoir, post-graduation circumstances, and renewed teacher contact.

The three official volume descriptions independently preserve the same chronological memoir/training/career structure. An ordinary exam result becoming known is not by itself a mystery/reveal mechanic. Across these complete bounded units there is enough positive evidence of the alternative recurring rewards to place the entry at the dictionary's `0` anchor, “수수께끼 구조가 거의 없음.” Confidence should remain moderate rather than maximal because the public reader is sampled, not the full three volumes.

### `comedy=3` — ACCEPT

Humor is repeated in every inspected complete chapter: self-aggrandizing memoir narration is undercut by the remote studio and severe teacher; redraw/time-limit demands repeatedly land through exaggerated and deadpan reactions; the examination-result unit uses an extended comic reversal; and the post-graduation return is repeatedly framed through self-deprecating/exaggerated beats. This is more sustained than intermittent `2`, while art growth and the mentor bond remain co-primary rewards, preventing core/constant `4`.

### `emotionalWarmth=3` — ACCEPT

Warmth is directly repeated rather than imported from whole-work jury commentary. The entry shows a friend bringing the protagonist to the studio, family support such as preparing food, a severe teacher who persistently invests in the student's development and predicts her success, and continuing peer/teacher support around the examination and later return. The harsh pedagogy and regret keep it below healing/bond-centered `4`; the repeated supportive bond places it above mixed `2`.

### Final text vector and gate

- Narrative: `3 / U / U / 3 / 0 / 2` = `4/6` known — PASS.
- Tone: `4 / 2 / 3 / U / 2 / U / 3` = `5/7` known — PASS.
- Genre / Theme: `sliceOfLife`; `school=2` — supported.
- `problemSolving` remains `unknown`: repeated drills and persistence are progression, not demonstrated constraint-analysis/solution reward.
- `strategy`, `darkness`, and `romance` remain `unknown`.
- Remaining official route: no uninspected content remains in the named public volume 1–3 product/readers. If a later adjudicator overturns the structural zero, the next route is additional authorized entry chapters or an entry-scoped official interview; current coverage does not require that expansion.
- Hard blocker: none. Text gate passes without fabricating a problem-solving or strategy value.

## 3. ましろのおと — independent decisions

Work: `work-3823ff0766f67c015c53`; representative ISBN `9784063712612`.

### `mysteryReveal=1` — ACCEPT, with a narrower evidentiary basis

The final Track 2 scene in which another character recognizes Setsu in a performance video is not sufficient by itself: it reveals little to the reader and should not be counted merely because a character learns an identity. The direct support comes from the official volume 2 description. It explicitly structures the next plot movement around an initially unexplained familiar melody on Aki's phone and then identifies it as the grandfather's piece `春暁`. That is a bounded, plot-driving truth/connection disclosure in the entry range.

One subordinate disclosure does not establish recurring secrets/twists at `2`, much less clue/deduction-centered `4`. It does, however, place the entry between “almost no reveal structure” (`0`) and “secrets/twists sometimes” (`2`), so `1` is the conservative supported value. The axis is not inferred from Genre and is not filled from mere synopsis silence. Recommended confidence: moderate (`~0.70–0.75`).

### Genre `sliceOfLife` — ACCEPT

This is supported by the complete standard-volume-1 structure, not by automatically translating `school`, `青春`, or the publisher's human-drama label. Track 0–2 repeatedly follows contemporary domestic/cohabitation life, housing and family pressure, everyday adjustment after relocation, relationships around rehearsal/performance, school entry, classmates, and ordinary home/school transitions. Volumes 2–3 extend that day-to-day structure through school-club formation and practice. With no `music` Genre in the dictionary, this is still a direct structural fit for `sliceOfLife`, not a catch-all invented solely to make Genre non-empty. `school=2` remains independently supported as a Theme.

### Final text vector and gate

- Narrative: `3 / U / U / 3 / 1 / 2` = `4/6` known — PASS.
- Tone: `4 / 2 / U / U / 2 / 1 / 2` = `5/7` known — PASS.
- Genre / Theme: `sliceOfLife`; `school=2` — supported.
- `problemSolving` remains `unknown`: the full first volume shows direct/emotional responses and performance; volume 3 names member/instructor shortages but the public material does not expose a completed solve mechanism.
- `strategy`, `comedy`, and `darkness` remain `unknown`.
- Remaining official route: the named public volume 1 material is complete and the public volume 2–3 product/trial routes have been inspected. Track 3 onward is access-gated. No additional public route is needed for the accepted vector; if `mysteryReveal=1` is later overturned, an authorized fuller volume-2 interior or entry-scoped official interview is the reproducible next route.
- Hard blocker: none. Text gate and Genre/Theme contract pass.

## 4. Consolidated verdict

| Work | Disputed item | Independent verdict | Final Narrative | Final Tone | Text result | Hard blocker |
|---|---|---|---|---|---|---|
| かくかくしかじか | `mysteryReveal=0` / `comedy=3` / `emotionalWarmth=3` | accept / accept / accept | `3/U/U/3/0/2` = 4/6 | `4/2/3/U/2/U/3` = 5/7 | PASS | none |
| ましろのおと | `mysteryReveal=1` / Genre `sliceOfLife` | accept with narrower reveal basis / accept | `3/U/U/3/1/2` = 4/6 | `4/2/U/U/2/1/2` = 5/7 | PASS | none |

No value was averaged, inferred from a Genre, or substituted for an unresolved axis merely to clear coverage. Both `problemSolving` axes and both `strategy` axes remain explicit `unknown`.

