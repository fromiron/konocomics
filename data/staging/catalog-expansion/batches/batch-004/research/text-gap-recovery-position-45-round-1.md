# Batch 004 text-gap recovery — position 45 round 1

- 조사일 / `accessedAt`: `2026-08-25`
- 대상: `work-e81955a9fc5c4d84580f` / `ここは今から倫理です。` / 雨瀬シオリ
- 범위: Factor Dictionary의 `entry_1_3_volumes`; 集英社 공식 1–3권 상품 페이지와 edition-linked `試し読み` reader의 첫 아크 본문
- 판정 경계: research only, `reviewedByHuman=false`
- 변경 경계: 이 문서만 생성한다. terminal/source/generated/Genre/Theme/Art/promotion/blocker 파일은 수정하지 않는다.
- 제목·장르·인구통계·선정·기억에서 Narrative 값을 만들지 않는다. 리뷰는 공식 페이지 관찰의 보조 확인으로만 취급한다.

## Bound inputs and current gate

| input | value |
|---|---|
| repository root at read | `7c23eaf23297c0e0dc042b632c48f0fc77d9d047` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| frozen work set | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68f1` |
| terminal text CSV before this note | `3fd5e246b3aa9c0fb6220cb80912ab6e686636f8e455b4e1cace3637710dc647` |
| prior text-recovery QA | `1f61f1b8dabff8de05ad0cdfd01b68f4aaed22d0656bb9e0a17059fdf1c5caf6` |
| prior blocker adjudication | `c4be3b24ae4b9b9a3f1b1e8f4dff4531a3400dcb2e7e1fe77306a8425666abb1` |

The current terminal vector is Narrative `U/2/U/2/U/U` (`N2/6`), Tone `2/2/2/2/2/U/2` (`T5/7`), and Art `3/4` known (`A3`). Genre `sliceOfLife` and Theme `school:2; workplace:2` are already present. The residual Narrative axes are `progression`, `strategy`, `mysteryReveal`, and `worldBuilding`; exactly two additional known cells would reach the frozen Narrative minimum. This note proposes at most two and does not authorize a terminal write.

## Official source ledger

All routes below were opened and the visible reader state was inspected on `2026-08-25`. The product publication date is used as `sourcePublishedAt`; the reader URL is bound to the same ISBN. Reader page references are the printed page labels visible in the rendered trial image, not claims about the complete volume.

| source | exact URL | sourcePublishedAt | accessedAt | bounded direct observation |
|---|---|---:|---:|---|
| 集英社 official volume 1 product | [ここは今から倫理です。 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-890-791-8) | `2017-11-22` | `2026-08-25` | Official copy defines the recurring ethics-class/student-problem frame and 高柳's direct engagement with students. |
| 集英社 official volume 1 reader | [volume 1 `試し読み`](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088907918) | `2017-11-22` | `2026-08-25` | The exposed first-arc sample includes printed pp. `5–7`, `14–18`, and `24–35`: a student's incompletely stated personal situation is brought into the classroom; 高柳 sets a lesson, asks about happiness/death/religion, and continues with a student-specific reading/knowledge exchange and later class work. |
| 集英社 official volume 2 product | [ここは今から倫理です。 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891-056-7) | `2018-06-19` | `2026-08-25` | Official copy states that 高柳 repeatedly faces students' `心の澱` and thinks with them. |
| 集英社 official volume 2 reader | [volume 2 `試し読み`](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088910567) | `2018-06-19` | `2026-08-25` | The exposed first-arc sample includes printed pp. `5–7` and `10–16`. On pp. `5–7`, a student explicitly says she wanted to see the teacher's despair, then states that she planned it with two others (`作戦を練って3人で`), used a blind spot, and staged the situation. The subsequent pages show the intended reaction failing and the teacher/student ethical discussion continuing. |
| 集英社 official volume 3 product | [ここは今から倫理です。 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891-261-5) | `2019-04-19` | `2026-08-25` | Official copy continues the teacher's dialogue/support while students seek an answer about how to live. |
| 集英社 official volume 3 reader | [volume 3 `試し読み`](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088912615) | `2019-04-19` | `2026-08-25` | The exposed first-arc sample includes printed pp. `5–7`, `11–13`, and `15–23`: an adult/student situation is introduced with incomplete background, then the participants' family, conduct, and responsibility are progressively articulated in conversation about good, evil, and law. |

The official samples are the primary evidence. The product copy is used only to bind the 1–3 entry range and to verify that the three reader editions are the same series/author/volumes; no product genre label is converted into a Narrative value.

## Proposed Narrative cells

### `strategy=known:2`, confidence `0.76`

Dictionary anchor: `2` is the presence of tactical or short-term planning; `4` requires long-range planning, war/politics, or resource operation to be central.

The direct vol. 2 body pages provide the required plan/action/outcome sequence, not a title or synopsis inference:

1. A student states the intended objective: seeing 高柳's despair.
2. She states that three students devised a plan (`作戦を練って3人で`).
3. The group uses a deliberate blind-spot setup and staged harassment.
4. The teacher does not react as expected, so the planned effect fails and the students discuss what happened.

This is a bounded short-term tactic and supports `2`, not `4`. The vol. 1 and vol. 3 samples show the same work repeatedly moving through teacher-led case framing and response, but they do not expose a long-range resource or political strategy. The candidate is therefore conservative and remains a Pass-C proposal only.

### `mysteryReveal=known:2`, confidence `0.61`

Dictionary anchor: `2` permits some secrets/reversals; `4` requires clues, deduction, and truth disclosure to be a major reward.

The new official reader coverage is materially broader than the earlier limited vol. 1 sample and exposes a repeated, entry-bounded disclosure pattern across three distinct first-arc openings:

- **Vol. 1, pp. 5–7 and 24–29:** a student's “one thing” not yet known and her prior school/personal situation are disclosed through the teacher/student exchange rather than stated at entry; the class then reframes the disclosed issue through ethics and knowledge.
- **Vol. 2, pp. 5–7:** the student's motive, prior failed attempt to provoke 高柳, and the coordinated setup are initially withheld and then stated in the retrospective opening; the planned result is then shown to be different from what she expected.
- **Vol. 3, pp. 5–7 and 11–23:** the opening situation's family/relationship and conduct history is clarified incrementally as the participants explain what happened; the later dialogue distinguishes personal claims from “善/悪” and legal responsibility.

Across volumes 1–3, the limited reward is the articulation of previously incomplete personal information and the reversal between a participant's expectation and the teacher's response. This supports `2` only if the Dictionary's “秘密・反転が一部存在” includes bounded personal-case disclosures. It does not support `4`: the pages do not show a clue-board, deduction chain, or mystery-solving reward as the work's dominant engine. If Pass C reserves `mysteryReveal` for external clue/deduction structures, retain this cell as `unknown`.

This reopens the earlier low-confidence candidate only because the current pass directly inspected the official volume-2 and volume-3 reader bodies and the remainder of the volume-1 trial, including the explicit retrospective plan and the separate cross-volume disclosure openings. It does not reopen or alter any accepted cell.

## Residual Narrative disposition

| axis | disposition | exact reason |
|---|---|---|
| `progression` | remains `unknown` | The readers show a one-year classroom transition, students' questions, reading/knowledge discussion, and different cases, but no repeated acquisition, mastery, or growth-reward ladder. Time passage and emotional movement are not progression under the Dictionary. |
| `worldBuilding` | remains `unknown` | School/classroom and ethics discourse are ordinary setting/context. The inspected 1–3 pages do not establish a fictional history, culture, rules, or factions that repeatedly function as a constructed world system. |

Existing `problemSolving=2` and `pacing=2`, all Tone values, Genre, Theme, and Art are not re-opened. No low value is filled to meet the coverage quota.

## Supplemental review boundary

No user review is required to create either proposal: the official reader pages contain the direct observations. The already logged independent volume-1 review surfaces remain supplemental only:

| source | URL | sourcePublishedAt | accessedAt | limited use |
|---|---|---:|---:|---|
| Bookworms volume-1 review | [review](https://bookworms.jp/book/4088907914) | not exposed | `2026-08-25` | Corroborates a sequence of student-life cases; not used to create a new cell or extend the page range. |
| じぼうろく volume-1 review | [review](https://jibouroku.com/from-now-on-we-begin-ethics-1124) | `2018` | `2026-08-25` | Corroborates one-problem-at-a-time teacher engagement; not used to establish strategy or mystery by itself. |

Ratings, popularity, selection status, and review prose are not Factor evidence.

## Handoff

- Pass-C candidates: `strategy=2` (`0.76`) and `mysteryReveal=2` (`0.61`), both official-reader-first and provisional.
- Residual unknowns: `progression`, `worldBuilding`; preserve `unknown` if the adjudicator rejects either candidate's anchor.
- `reviewedByHuman=false`.
- No terminal/source/generated/Genre/Theme/Art/registry/overlay/promotion/blocker file was changed.

## Integrity

`git diff --check -- data/staging/catalog-expansion/batches/batch-004/research/text-gap-recovery-position-45-round-1.md` passed after writing this packet. This file is the only authorized addition for position 45 round 1.
