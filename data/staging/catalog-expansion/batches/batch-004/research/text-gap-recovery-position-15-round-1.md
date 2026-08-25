# Batch 004 text-gap recovery — position 15 round 1

- 조사일 / `accessedAt`: `2026-08-25`
- 대상: `work-2df743e085adef5e9bd3` / `キルアオ` / 藤巻忠俊
- 범위: Factor Dictionary의 `entry_1_3_volumes`; 集英社 공식 1–3권 상품·시험 읽기와 1권 초반 학교/위기 아크의 직접 페이지
- 판정 경계: research only, `reviewedByHuman=false`
- 변경 경계: 이 문서만 생성한다. terminal/source/generated/Genre/Theme/Art/promotion/blocker 파일은 수정하지 않는다.
- 작품명, 장르, 인구통계, 선정·평판·기억으로 Narrative 값을 만들지 않는다. 리뷰는 공식 근거의 보조 확인으로만 사용한다.

## Bound inputs and current gate

| input | value |
|---|---|
| repository root at read | `7c23eaf23297c0e0dc042b632c48f0fc77d9d047` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| frozen work set | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| terminal text CSV before this note | `0baabb3833eb2c4551eac5b97a8211b773d9bb59a1073c5b2bebc4622cd21c60` |

The current terminal vector is Narrative `U/2/U/2/U/2` (`3/6`), Tone `2/2/3/2/U/2/2` (`6/7`), and Art `2/3/1/U` (`3/4`). Genre `action;comedy;scienceFiction` and Theme `combat:2; school:2` are already present. The residual Narrative candidates are `progression`, `strategy`, and `mysteryReveal`; only one is proposed below.

| axis | proposed state | value | confidence | Dictionary anchor | gate effect if independently accepted |
|---|---|---:|---:|---|---|
| `progression` | `known` | `2` | `0.76` | `2 = 서서히 성장`; `4` requires repeated clear growth/acquisition/mastery rewards | Narrative `4/6 = 0.667`; Tone and Art unchanged |

This is an adjudication proposal, not a terminal value or promotion decision.

## Direct official Shueisha source ledger

All routes below were opened and the reader pages were inspected on `2026-08-25`. Product release dates are used as `sourcePublishedAt`; reader routes are edition-bound to the matching product. Reader page indexes are the ordered internal reader positions; printed page numbers are recorded where visible in the page image.

| source | exact URL | sourcePublishedAt | bounded direct use |
|---|---|---:|---|
| S-MANGA `キルアオ 1` product | [official product](https://www.s-manga.net/items/contents.html?isbn=978-4-08-883686-7) | `2023-09-04` | Identifies the standard vol. 1 ISBN `9784088836867`, author, and the body-change/school entry premise. |
| S-MANGA `キルアオ 1` trial | [official vol. 1 reader](https://www.s-manga.net/reader/main.php?cid=9784088836867) | `2023-09-04` | The ordered reader has 60 positions. The direct first school/crisis sample at indexes `38`, `40`, `44`, and `46` shows repeated school learning, classroom adaptation, and a bounded classmate-danger response. |
| S-MANGA `キルアオ 2` product | [official product](https://www.s-manga.net/items/contents.html?jdcn=08X10000000032350600) | `2023-11-02` | The official description and contents list continue with Juzo as Noren's boyfriend role, repeated fiancé-position contests, a school exam, and futsal episodes. |
| S-MANGA `キルアオ 2` trial | [official vol. 2 reader](https://www.s-manga.net/reader/main.php?cid=08X10000000032350600) | `2023-11-02` | The ordered reader has 28 positions. Indexes `8–26` directly show the new role being assigned, transfer-school/social adjustment, the fiancé challenge, and Juzo carrying that role through the bounded contest setup. |
| S-MANGA `キルアオ 3` product | [official product](https://www.s-manga.net/items/contents.html?isbn=978-4-08-883797-0) | `2024-01-04` | The official description states that Juzo returns to adult form during a double date, Noren is kidnapped again, and Juzo and Tenma pursue the kidnappers. |
| S-MANGA `キルアオ 3` trial | [official vol. 3 reader](https://www.s-manga.net/reader/main.php?cid=9784088837970) | `2024-01-04` | The ordered reader has 26 positions. Indexes `10`, `15`, and `20` directly show the established school-group members responding to Noren's danger and Juzo/Tenma pursuing together; this is a later entry-range role/team continuation, not a new Genre inference. |

### Bounded page observations

- **Vol. 1, reader indexes 38 and 40 (printed p. 38 onward):** Juzo explicitly reacts to discovering school study as enjoyable and names multiple subjects. The following pages keep him in the school routine, with study and classroom interaction rather than only the initial body-change premise. This is a direct acquisition/learning observation.
- **Vol. 1, reader indexes 44 and 46 (printed pp. 45–46):** a classmate crisis interrupts that school routine; Juzo responds while constrained by his student identity and the surrounding classmates. The scene supports the already-known mixed action/problem-solving cell, but is not separately counted as `strategy`.
- **Vol. 2, reader indexes 8–26:** the official pages move from the assigned boyfriend/fiancé cover role into transfer-student classroom interaction and the next contest challenge. Juzo repeatedly adjusts his adult assassin identity to a school/social role; the pages do not show a long-range mastery ladder.
- **Vol. 3, reader indexes 10, 15, and 20:** the official pages show the Noren abduction/pursuit situation and Juzo and Tenma acting as a pair. This carries the school/relationship role into a new rescue state across the entry range; it does not by itself justify `progression=4`.

The three volumes therefore supply a bounded sequence of (1) forced school entry, (2) explicit school learning and repeated social-role adjustment, and (3) carrying the established school/group role into a later pursuit with Tenma. This is sustained entry-range change, not a value inferred from the title or action label.

## Axis decision

### Proposed: `progression=known:2`, confidence `0.76`

The strongest direct anchor is vol. 1's reader page around printed p. 38: the protagonist explicitly discovers and engages with school subjects, after which the reader continues through classroom adaptation and classmate response. Vol. 2 then repeats role adaptation through the boyfriend/fiancé cover and school contests, while vol. 3 carries the established school-group role into a joint pursuit/rescue. Across three official volumes, the entry range contains repeated learning/acquisition and gradual adaptation rather than a single premise-only status change.

This remains the midpoint `2`. The direct trials do not expose a repeated training ladder, quantified mastery, or several clear skill-level rewards sufficient for `progression=4`. The proposal is intentionally conservative and must be accepted or rejected by independent adjudication.

### Residual Narrative disposition

- `strategy` remains `unknown`: the sampled pages show immediate action and social-role constraints, not a plan/counter-plan or sustained resource-management process. The existing `problemSolving=2` is not relabeled as strategy.
- `mysteryReveal` remains `unknown`: the biological-weapon premise and later pursuit do not expose a bounded clue-to-truth reward in the inspected entry pages. No mystery value is inferred from “謎” wording or identity concealment.

Existing `problemSolving=2`, `pacing=2`, `worldBuilding=2`, all Tone values, Genre, Theme, and Art are not re-opened by this note. No Art value is inferred from page appearance.

## Supplemental independent review ledger

These sources are secondary corroboration only; none is used to override the official page evidence or to infer a value from ratings, tags, or popularity.

| source | URL | publishedAt | bounded observation and use |
|---|---|---:|---|
| #AQM, `キルアオ 1巻 評論` | [review](https://aqm.hatenablog.jp/entry/2023/09/05/221106) | `2023-09-05` | The volume-1 review describes the forced middle-school return and explicitly notes Juzo's awakening to the interest of middle-school study. It corroborates the vol. 1 learning anchor only. |
| HobbyForest, `キルアオの漫画のあらすじと感想` | [review](https://hobbyforest.com/2025/07/01/kiruaocomic/) | `2025-07-01` | The volume-1 portion describes Juzo initially struggling to blend in, rescuing classmates under a non-lethal school constraint, and gradually gaining understanding classmates and enjoying school. Later-volume overview claims are excluded. |
| めぎしす！, `キルアオ第1話評論` | [review](https://www.menuguildsystem.com/killblue-episode1-impression/) | `2023-04-17` (updated `2024-05-14`) | Opening-episode review independently confirms the school restart and the unusual study-interest beat. It is used only as an entry-opening cross-check, not as evidence for vol. 2/3 or for a high value. |

## Handoff

If an independent adjudicator accepts the single proposal, this work moves from Narrative `3/6` to `4/6` and satisfies the text coverage minimum; Tone `6/7` and Art `3/4` already satisfy their minima. This file does not change that terminal state, `recommendationVerified`, eligibility, or promotion.

- `reviewedByHuman=false`
- no terminal/source/generated/Genre/Theme/Art/registry/overlay/promotion/blocker file was changed
- rejected residual axes remain `unknown`; no blocker is authorized
