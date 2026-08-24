# Pilot 001 text coverage follow-up D — independent Pass B review

- Reviewer: Local Codex independent Pass B
- Repository HEAD observed: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate packet SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Follow-up report SHA-256: `c5a1d08c3d18e7d2747b6332ea08ff52814fcc62e98ec987ca693d4ce74a7263`
- Reviewed at / retrieval date: `2026-08-23`
- Scope: exactly four works and their text-axis proposals; first 1–3 volumes or first major episode
- Out of scope: all Art-axis decisions
- Mutation boundary: no repository file was edited; temporary page images remain under ignored `output/playwright/pilot-text-gap-d/`

The conclusions in `pilot-text-gap-d.md` were not inherited. I independently re-read the Factor Dictionary, live coverage implementation, promotion method/gate, current-SHA Pass A rows and notes, the current-SHA Pass B/C and coverage-gap ledgers, the four official page packets, and the official identity/product pages.

## 1. Contract recheck

- Factor scope is entry volumes 1–3 or the first major episode.
- `unknown` is not numeric zero.
- Values 1 and 3 are permitted only when the observation lies between the 0/2/4 anchors.
- Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`.
- Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`.
- Live thresholds are Narrative `>=0.60` and Tone `>=0.60`. Therefore the exact count gates are Narrative **4/6** and Tone **5/7**.
- Non-empty Genre and Theme remain required. The raw chunk-04 rows provide one Genre and one Theme for every work reviewed here.
- A text coverage miss is not itself a hard blocker. A hard-blocker code is not available while an identified official or otherwise eligible evidence route remains unattempted.
- Passing these two text groups is not by itself `recommendationVerified`; Art, complete evidence rows, context, identity, safety, review/adjudication, and the other promotion gates remain separate.

Relevant contract locations:

- `docs/factors/factor-dictionary.md`, especially lines 9–38 and 74–104
- `src/domain/catalog/constants.ts`, lines 39–58 and 86–94
- `src/domain/catalog/coverage.ts`, lines 4–29
- `scripts/build-promotion-registry.ts`, lines 214–238
- `docs/catalog-expansion/01-promotion-method.md`, lines 7–15 and 31–52

## 2. Evidence identity check

`/tmp/pilot-text-gap-d.md` is byte-identical to the repository copy `reviews/text-coverage-followup-d.md` at SHA-256 `c5a1d08...a7263`.

I recomputed the report's aggregate hashes from sorted `filename + NUL + fileSha256 + newline` records. Every referenced packet matched:

| Packet | Files | Recomputed SHA-256 | Match |
|---|---:|---|---|
| 恋は雨上がりのように vol. 1 | 13 | `967a08e65822159050cef5422b3d7c0cb844e28173d894a7bde3560a0506419f` | yes |
| 恋は雨上がりのように vol. 2 | 11 | `b8cd5e99d6fd355d8527f52bebc595b549a8852925a5a426691978e6d223d784` | yes |
| 恋は雨上がりのように vol. 3 | 6 | `c8e1e85d1b765a9b58bdb4fe8eafc62d33c42d439d3cf20b8f13b732aa40f2ca` | yes |
| 透明なゆりかご episode 1 | 13 | `921c49b5547bfdae93269e31ea41689d0a39b5f578a9ad4f39e90f9f41b247cb` | yes |
| かげきしょうじょ！！ main vol. 1 | 15 | `1df21edae19b3e3c1449312255134c4093d3c87b61c9dfc2b0694cf041f138c6` | yes |
| かげきしょうじょ！！ main vol. 2 | 10 | `f335669cd12c5b8bb89210d7e14219a13819193f40e49e088b6669f4b6c4630b` | yes |
| かげきしょうじょ！！ main vol. 3 | 10 | `193644e76a1f46ff076214effbe13c169b36f85203781974b9f8a6e2aef4c243` | yes |
| さよならミニスカート episode 1 | 63 | `999e36f3b85e8ab103357bef489da8893a50d889d1174fe164fd515e2ac18cf7` | yes |
| さよならミニスカート vol. 2 | 13 | `3192293575104f65568e1c58c47a671f7719d6e7d533fadb69561adcd8c2926d` | yes |

## 3. Summary verdict

| Work | Candidate values reviewed | Independent verdict | Exact effective result | Text gate | Hard blocker now |
|---|---|---|---|---|---|
| 恋は雨上がりのように | no numeric addition; retain unknowns | no-value conclusion accepted; route-exhaustion/terminal wording rejected | N `U/0/U/U/0/1` = **3/6**; T `4/2/U/U/2/4/2` = **5/7** | fail N | no |
| 透明なゆりかご | `problemSolving=1 @ .75` | **ACCEPT** | N `2/1/U/3/U/2` = **4/6**; T `4/2/U/4/4/U/2` = **5/7** | pass | no |
| かげきしょうじょ！！ | `emotionalWarmth=2 @ .80` | **ACCEPT** | N `4/1/U/3/U/3` = **4/6**; T `4/4/1/U/2/U/2` = **5/7** | pass | no |
| さよならミニスカート | `strategy=0 @ .80`; `comedy=1 @ .85` | **ACCEPT / ACCEPT** | N `U/U/0/3/2/1` = **4/6**; T `4/2/1/3/4/U/U` = **5/7** | pass | no |

Independent text pass candidates after this review: **3/4**. Remaining text coverage failure: **1/4**. Hard-blocker candidates: **0**.

## 4. Work-level review

### 4.1 恋は雨上がりのように — `work-8716f80d9b988bd0d055`

#### Official packet and edition/range

1. 小学館公式試し読み volume 1
   - URL: https://shogakukan.tameshiyo.me/9784091867285
   - Edition: Big Comics volume 1, ISBN `9784091867285`
   - Edition published: `2015-01-09`
   - Retrieved: `2026-08-23`
   - Inspected viewer states: `3/15–15/15`
   - Boundary check: the contents page places chapter 1 at printed p. 3 and chapter 2 at p. 29, while the visible sample ends at printed p. 24. It therefore does **not** contain the final pages of chapter 1.
2. 小学館公式試し読み volume 2
   - URL: https://shogakukan.tameshiyo.me/9784091868688
   - Edition: Big Comics volume 2, ISBN `9784091868688`
   - Edition published: `2015-04-10`
   - Retrieved: `2026-08-23`
   - Inspected viewer states: `3/13–13/13`
3. 小学館公式試し読み volume 3
   - URL: https://shogakukan.tameshiyo.me/9784091872005
   - Edition: Big Comics volume 3, ISBN `9784091872005`
   - Edition published: `2015-09-11`
   - Retrieved: `2026-08-23`
   - Inspected viewer states: `3/8–8/8`

The visible material directly supports relationship-led scenes, immediate emotional requests/hesitation, restaurant interaction, and care. It does not establish a repeated acquisition/mastery loop, a sustained planning structure, or a reliable volume-level change interval. The prior two scoped reviews still conflict on felt pacing.

#### Value decision

- `progression=unknown`: retain. Emotional/relationship change remains covered by `characterArcWeight`; no distinct repeated acquisition/mastery reward is shown.
- `strategy=unknown`: retain. The sampled scenes are reaction-led, but the volume-1 chapter is incomplete and the other bounded samples are not an exhaustive positive demonstration of the whole entry's planning horizon.
- `pacing=unknown`: retain. The page samples do not resolve the independent-review conflict.
- No replacement value may be filled merely to reach 4/6.

Final effective state remains:

- Narrative `U / 0 / U / U / 0 / 1` = **3/6**, below gate.
- Tone `4 / 2 / U / U / 2 / 4 / 2` = **5/7**, at gate.
- Genre `romance`: non-empty.
- Theme `workplace=2`: non-empty.

#### The route is not exhausted

The follow-up report is correct that the three ISBN `tameshiyo` samples cannot be recycled as a fourth Narrative value. It is **not** correct to treat the work as having no concrete official entry route left.

Big Comic BROS.NET, an official Shogakukan property, still exposes three complete volume-1 episodes and explicitly labels them `まるごと試し読み`:

1. Episode 1
   - URL: https://bigcomicbros.net/7742/
   - Source: ビッグコミックBROS.NET / 小学館, 週刊スピリッツ
   - Published: `2015-01-02`
   - Retrieved: `2026-08-23`
   - Range: complete episode 1, 25 enumerated page images (`koiame-01-01` through `-25`)
2. Episode 4
   - URL: https://bigcomicbros.net/7743/
   - Published: `2015-01-03`
   - Retrieved: `2026-08-23`
   - Range: complete episode 4, 18 enumerated page images
3. Episode 5
   - URL: https://bigcomicbros.net/7744/
   - Published: `2015-01-04`
   - Retrieved: `2026-08-23`
   - Range: complete episode 5, 18 enumerated page images

All three pages state that episodes 1, 4, and 5 were completely and freely published to accompany volume 1's `2015-01-09` release. They are entry-volume, publisher-owned, page-level routes and are more complete than the currently inspected volume-1 sample.

Therefore:

- This work cannot end as `recommendationVerified` at N 3/6.
- It also cannot end as `promotionBlocked` now: `SOURCE_INFORMATION_UNAVAILABLE` is false while the official complete episodes remain unreviewed, and `FACTOR_MODEL_INCOMPATIBLE` has not been established.
- Correct current status is `RESEARCH_REQUIRED` with the three exact URLs above.
- Their inspection may or may not support a fourth Narrative axis. No value is pre-authorized.

### 4.2 透明なゆりかご — `work-11296a590b885cb73b66`

#### Official packet and direct correspondence

- URL: https://comic-days.com/episode/13932016480030343945
- Source: コミックDAYS / 講談社
- Source publication date: `2018-03-09`
- Retrieved: `2026-08-23`
- Edition/range: official digital episode 1, `第1話 命のかけら`, printed pp. 5–28; the full endpoint and next-episode UI were reached
- Identity cross-check: volume 1 is ISBN `9784063409574`, published `2015-05-13`; official volume 2 and 3 product descriptions remain within the agreed entry range.

Direct observations:

- pp. 12–17 show a complete abortion-related post-procedure work sequence: instruction, immediate procedural handling, recording, and hand-off.
- pp. 18–23 show a separate labor situation: staff recognizes the immediate condition, examines/assists, and the trainee responds to instructions and observes the delivery.
- pp. 24–28 close on the trainee's changed understanding of terminated and born life, not on a puzzle or clever solution.

#### Value decision

`problemSolving=known 1`, confidence `0.75`: **ACCEPT**.

This is not inferred from the medical Genre. The complete official episode positively shows the work's low-analysis response mechanism in two distinct clinical situations. Constraints receive practical action, but the protagonist is not an ingenious analyst and no clever resolution is the core reward. That places the observation between the direct/emotional 0 anchor and the mixed analysis/direct-action 2 anchor. It must not be raised to 2.

The known value describes the entry's recurring resolution mode, not a claim that the trainee independently makes every clinical decision. If a later reviewer requires protagonist-only agency, the safe fallback is `unknown`, not a substitute value; the page-level work pattern nonetheless supports the current low anchor under the repository's existing `problemSolving=1` calibration.

Final effective state:

- Narrative `2 / 1 / U / 3 / U / 2` = **4/6**, pass.
- Tone `4 / 2 / U / 4 / 4 / U / 2` = **5/7**, pass.
- Retain `strategy=unknown` and `mysteryReveal=unknown`.
- Genre `sliceOfLife`: non-empty.
- Theme `workplace=2`: non-empty.
- No text hard blocker and no further official text route is required for N/T coverage.

### 4.3 かげきしょうじょ！！ — `work-9d04c47e7efbbbd8aca6`

#### Identity and edition boundary

- Main-series product URL: https://www.hakusensha.co.jp/comicslist/46806/
- Main-series preview: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221726kagesho00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D46806
- Edition: 白泉社 花とゆめコミックス main volume 1, ISBN `9784592217268`
- Published: `2015-11-05`
- Retrieved: `2026-08-23`
- Range: trial `0_29`, 31 viewer positions including front matter; inspected main-series printed pages through p. 27

The Season Zero page, https://www.hakusensha.co.jp/comicslist/53883/, explicitly says it re-edits the earlier Shueisha `かげきしょうじょ!` volumes 1–2. It was used only to close identity/seriesGroup context. No Season Zero panel supports the Factor decision.

The repository canonical title `かげきしょうじょ!!` uses a punctuation alias for the official full-width `かげきしょうじょ！！`; neither spelling contains decorative `『』`.

#### Direct correspondence and value decision

- Main-volume-1 printed pp. 6–11 show classmates exchanging souvenirs, discussing performances, moving together, and recurring peer-group interaction.
- Printed pp. 24–27 provide a direct emotional payoff: Ai explicitly wants to make Sarasa happy because Sarasa is her first friend; birthday messages/gifts follow before the class returns to shared activity.

`emotionalWarmth=known 2`, confidence `0.80`: **ACCEPT**.

The value is grounded in an explicit friendship/birthday payoff, not co-presence, school Genre, or Season Zero. Warmth is meaningful but mixed with competition, evaluation, and performance pressure, so 2 fits and 4 would overstate the entry.

Final effective state:

- Narrative `4 / 1 / U / 3 / U / 3` = **4/6**, pass.
- Tone `4 / 4 / 1 / U / 2 / U / 2` = **5/7**, pass.
- Retain `darkness=unknown` and `romance=unknown`.
- Genre `sliceOfLife`: non-empty.
- Theme `school=2`: non-empty.
- No text hard blocker and no further official text route is required for N/T coverage.

### 4.4 さよならミニスカート — `work-07ff2a01ef593ce2f809`

#### Official packet and edition/range

- Official first-episode URL: https://ribon.shueisha.co.jp/sayonara_miniskirt_trial/
- Source: 集英社 りぼん
- Page publication date: undated
- Retrieved: `2026-08-23`
- Range: all `page_001` through `page_063`, followed by the explicit continuation panel; complete first major episode
- Edition binding: the official page footer links volume 1, Ribon Mascot Comics ISBN `9784088675206`; the official product page records publication `2018-11-22`, 168 pages, and りぼん serialization.
- Volume-2 cross-check: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-867543-5, ISBN `9784088675435`, published `2019-03-25`; only its opening sample was used as corroboration.

#### `strategy=0`

**ACCEPT**, confidence `0.80`.

Across the complete 63-page episode, disclosures and threats are handled through immediate observation, following, confrontation, dialogue, physical protection, and disclosure. There is no staged tactical sequence or long-horizon plan; the episode repeatedly changes state and the characters react. This is positive evidence of the 0-anchor improvisational response pattern, not zero inferred from the mystery Genre or a synopsis omission.

`problemSolving` remains `unknown`: protection and questioning occur, but the episode does not establish analysis/ingenious resolution as a repeated reward distinct from the already-known reveal structure.

#### `comedy=1`

**ACCEPT**, confidence `0.85`.

The complete official pages directly disprove `comedy=0`. Bounded comic-reaction clusters appear in the idol backstage chatter (for example p. 2), classroom/misgender gossip (for example pp. 6 and 30), teacher/student exchanges (for example p. 11), and idol-peer phone banter near the close (p. 59). Long uninterrupted stretches remain focused on assault trauma, hidden identity, threat, and victim blaming.

The correct conservative fit is 1: more than `almost none`, but below the Dictionary's level-2 recurring middle-weight comic presence and far below comedy as a core reward. The serious subject matter itself was not used as an absence argument.

Final effective state:

- Narrative `U / U / 0 / 3 / 2 / 1` = **4/6**, pass.
- Tone `4 / 2 / 1 / 3 / 4 / U / U` = **5/7**, pass.
- Retain `progression=unknown`, `problemSolving=unknown`, `romance=unknown`, and `emotionalWarmth=unknown`.
- Genre `mystery`: non-empty.
- Theme `school=2`: non-empty.
- No text hard blocker and no further official text route is required for N/T coverage.

Sensitive assault/gender material remains content-scope evidence, not evidence of adult-only sale; no new safety conflict was found.

## 5. Patch-ready Pass B decisions

These are review decisions only; they were not written to source CSV:

| workId | axisId | state | value | confidence | decision |
|---|---|---|---:|---:|---|
| `work-11296a590b885cb73b66` | `problemSolving` | known | 1 | 0.75 | accept |
| `work-9d04c47e7efbbbd8aca6` | `emotionalWarmth` | known | 2 | 0.80 | accept |
| `work-07ff2a01ef593ce2f809` | `strategy` | known | 0 | 0.80 | accept |
| `work-07ff2a01ef593ce2f809` | `comedy` | known | 1 | 0.85 | accept |

For `work-8716f80d9b988bd0d055`, make no numeric patch. Preserve Narrative 3/6 and route it to the official complete episodes 1, 4, and 5 before any blocker adjudication.

## 6. Final blocker and provenance boundary

- `恋は雨上がりのように`: `RESEARCH_REQUIRED`; exact unattempted official route exists; not a hard blocker.
- Other three works: N/T text coverage candidates pass after the accepted values; no text blocker.
- No identity conflict, safety conflict, or empty Genre/Theme was found for these four.
- Art remains outside this review and cannot be inferred from these text observations.
- This is model Pass B evidence, not human validation. `reviewedByHuman=false` must remain unchanged.
- No canonical title here includes decorative `『` or `』`.
