# Pilot 001 chunk-05 narrow official text research F

## 0. Freeze, contract, and limits

- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Frozen baseline: `data/staging/catalog-expansion/pilots/pilot-001/reviews/text-pass-bc-chunk-05.md`
- Dictionary: `docs/factors/factor-dictionary.md`
- Scope: standard edition volumes 1–3 or the first major episode. Only the five designated unexhausted official routes were inspected.
- Gate: Narrative known `>= 4/6`; Tone known `>= 5/7`. The thresholds were not changed.
- Narrative order: `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`.
- Tone order: `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`.
- `U` means a closed `unknown`, not zero. A missing statement in a synopsis was never converted into `0`.
- Art was not reassessed. Official internal pages were read only for story text, event sequence, and rules. No Art value was added, removed, or changed.
- Selection provenance was not used as Factor Evidence. No Genre was converted directly into an Axis.
- `retrievedAt` for every live official source below is `2026-08-23`.
- Temporary rendered pages are not repository artifacts.

> Reproducibility correction: the nine page-packet hashes below were actually
> computed as `sha256sum <absolute page paths> | sha256sum`. Their records are
> `64hex + two spaces + absolute path + LF`, not a basename/NUL portable
> manifest. They are therefore path-dependent audit values and must not be used
> as durable packet identity. Pass B must recompute portable basename-sorted
> manifests before these packets can support the final ledger.

## 1. Outcome

| Work | Baseline Narrative | Added or corrected Narrative | Final Narrative | Baseline Tone | Added or corrected Tone | Final Tone | Genre / Theme | Gate | Hard blocker |
|---|---|---|---|---|---|---|---|---|---|
| 君と宇宙を歩くために | `3/4/U/2/U/U` 3/6 | `strategy U->2` | `3/4/2/2/U/U` **4/6** | `4/2/U/0/2/U/4` 5/7 | none | unchanged **5/7** | `sliceOfLife`; `school:2`, `workplace:1` | PASS | no |
| 写らナイんです | `U/U/U/4/U/U` 1/6 | `progression U->2`; `problemSolving U->2`; `worldBuilding U->2` | `2/2/U/4/U/2` **4/6** | `U/2/3/2/U/1/3` 5/7 | none | unchanged **5/7** | `comedy;horror`; `school:2` | PASS | no |
| ふつうの軽音部 | `2/U/U/3/U/U` 2/6 | `problemSolving U->1`; `worldBuilding U->2` | `2/1/U/3/U/2` **4/6** | `2/3/2/U/3/U/2` 5/7 | none | unchanged **5/7** | `sliceOfLife`; `school:2` | PASS | no |
| 本なら売るほど | `U/2/U/1/U/2` 3/6 | `strategy U->2` | `U/2/2/1/U/2` **4/6** | `4/3/U/U/1/U/3` 4/7 | `comedy U->1` | `4/3/1/U/1/U/3` **5/7** | `sliceOfLife`; `workplace:2` | PASS | no |
| 路傍のフジイ | `U/U/U/1/2/U` 2/6 | `progression U->0`; `strategy U->0` | `0/U/0/1/2/U` **4/6** | `4/2/U/1/2/U/3` 5/7 | none | unchanged **5/7** | `sliceOfLife`; `workplace:2` | PASS | no |

Counts:

- Narrative gate pass: `5/5`.
- Tone gate pass: `5/5`.
- Both text groups pass: `5/5`.
- Genre changes: `0`; Theme changes: `0`.
- New known Narrative axes: `10`; new known Tone axes: `1`.
- Values newly closed at zero: `2`, both for 路傍のフジイ and both supported by positive cross-volume mode evidence rather than synopsis omission.
- `SOURCE_INFORMATION_UNAVAILABLE`: `0`.
- Hard-blocker candidates: `0`.
- Open text adjudications: `0`.

These results close only the assigned text coverage gap. They do not themselves authorize promotion if another unchanged promotion gate fails.

## 2. Official evidence ledger

### F01 — 君と宇宙を歩くために

- Source name: 講談社 コミックDAYS.
- URL: <https://comic-days.com/episode/4856001361225662498>
- PublishedAt: `2023-06-26T03:00:00Z` (`2023-06-26` on the official page).
- Edition/scope: standard volume-1 entry episode, 第1話 ワン・ジャイアント・リープ; official payload contains 90 main pages. The complete episode was inspected through rendered spreads `01–44`; navigation/next-episode frames after that were excluded.
- Directly inspected references: spreads `21–23`, `25–29`, `31–35`, and `37–44` for the notebook/routine, task decomposition, recorded work procedure, execution, and result.
- Path-dependent audit SHA-256 (not portable packet identity): `1eacc08ad20d332ce23dca43deedd90439bbfd0b526a1dae3b099642838edf4f`.
- Limitation: one complete entry episode was read, not every chapter of volumes 1–3. Volume 2–3 internal pages remain a reproducible re-review route if recurrence beyond the entry episode is challenged.

### F02 — 写らナイんです

- Source name: 小学館コミック and 小学館公式試し読み.
- Volume 1 product: <https://shogakukan-comic.jp/book?isbn=9784098535439>; standard volume 1, ISBN `9784098535439`, released `2024-08-17`.
- Volume 1 reader: <https://sc-portal.tameshiyo.me/9784098535439>; viewer pages `1–54`, including the complete chapter 1 ending on viewer page 54. Direct story observations principally use viewer pages `13–54`.
- Volume 1 path-dependent audit SHA-256 (not portable packet identity): `2b32ab778280ed209546264759910dd86cd579d42b6e9d2aedb255962a2793c6`.
- Volume 2 product: <https://shogakukan-comic.jp/book?isbn=9784098536825>; standard volume 2, ISBN `9784098536825`, released `2024-11-18`.
- Volume 2 reader: <https://sc-portal.tameshiyo.me/9784098536825>; viewer pages `1–22`, with chapter 8 story on viewer pages `5–22` and an explicit chapter-end marker on page 22.
- Volume 2 path-dependent audit SHA-256 (not portable packet identity): `81669e3a0f26945fd25d0e86f35945f49024e60d008ed34e7f3ee4a98c1855ab`.
- Volume 3 product: <https://shogakukan-comic.jp/book?isbn=9784098540129>; standard volume 3, ISBN `9784098540129`, released `2025-02-18`.
- Volume 3 reader: <https://sc-portal.tameshiyo.me/9784098540129>; viewer pages `1–22`, with chapter 18 story on viewer pages `5–22` and an explicit chapter-end marker on page 22.
- Volume 3 path-dependent audit SHA-256 (not portable packet identity): `1da2986458f1a68d4e7149e3774e03c1c474ed02bc208855c6ab29e297a026ad`.
- Official editorial scope: volume 2 states the national occult-club competition goal, senior recruitment, and recurring supernatural incidents; volume 3 states training at a forbidden place and further supernatural confrontations.
- Limitation: the official reader route exposes one complete chapter in each of volumes 2 and 3, not all intervening chapters. Full serial chapters 2–7 and 9–17 remain a reproducible re-review route; their absence from this pass is not information unavailability.

### F03 — ふつうの軽音部

- Source name: 集英社 少年ジャンプ＋.
- URL: <https://shonenjumpplus.com/episode/16457717013869519536>
- PublishedAt: `2024-01-13T15:00:00Z` (`2024-01-14` JST on the official page).
- Edition/scope: official 第1話～第4話 bundle linked to standard volume 1; official payload contains 53 main pages. The complete bundle was inspected through rendered spreads `01–27`; later navigation frames were excluded.
- Directly inspected references: spreads `03–06` for constrained instrument selection and purchase, `14–18` for club membership/band/practice rules, and `19–27` for practice and band formation.
- Path-dependent audit SHA-256 (not portable packet identity): `99233bf1611bb87a7ae2a5ed1883986dda7441ee7ef4050d1521a399fee36e74`.
- Limitation: the complete first four episodes were read. Official volume 2–3 internal samples and subsequent Jump+ episodes remain a reproducible re-review route if recurrence is disputed.

### F04 — 本なら売るほど

- Source name: KADOKAWA カドコミ.
- URL: <https://comic-walker.com/detail/KC_006231_S/episodes/KC_0062310000200012_E?episodeType=first>
- PublishedAt: `2025-01-09` on the official episode page.
- Edition/scope: standard volume-1 first episode, 第1話 本を葬送る; the same official page links standard volume 1, ISBN `9784047381070`, released `2025-01-15`.
- Directly inspected range: all official viewer manuscript pages `1–32`; page 32 carries the episode-end marker. Principal text references are viewer pages `4–8`, `10–23`, and `26–32`.
- Path-dependent audit SHA-256 (not portable packet identity): `a19308ad56316f04872ffc5a2ada4f786514c7558f449d225eb2fe04b912a61b`.
- Limitation: the full first episode was read, but official volume 2–3 internal samples were not needed for the current low/moderate decisions. They remain a reproducible re-review route. The KADOKAWA `大人向け` audience label remains distinct from adult-only/R18 classification.

### F05 — 路傍のフジイ

- Source name: 小学館コミック and 小学館公式試し読み.
- Volume 1 product: <https://shogakukan-comic.jp/book?isbn=9784098625420>; standard volume 1, ISBN `9784098625420`, released `2023-10-30`.
- Volume 1 reader: <https://sc-portal.tameshiyo.me/9784098625420>; viewer pages `1–47`. The table of contents places chapter 2 at printed page 51, while the public sample stops around printed page 45; therefore this is explicitly an incomplete chapter-1 sample.
- Volume 1 path-dependent audit SHA-256 (not portable packet identity): `5c73d726df62a3776f26843284e277174b7898395ae31fde4c861d5eeeffead8`.
- Volume 2 product: <https://shogakukan-comic.jp/book?isbn=9784098627080>; standard volume 2, ISBN `9784098627080`, released `2024-02-29`.
- Volume 2 reader: <https://sc-portal.tameshiyo.me/9784098627080>; viewer pages `1–22`, an official chapter-9 entry excerpt.
- Volume 2 path-dependent audit SHA-256 (not portable packet identity): `4a2ca0feb80ab9a3dfb753248f6f482eb740d46a80e7cdf6a59b0e2bf6d2fd36`.
- Volume 3 product: <https://shogakukan-comic.jp/book?isbn=9784098630202>; standard volume 3, ISBN `9784098630202`, released `2024-08-30`.
- Volume 3 reader: <https://sc-portal.tameshiyo.me/9784098630202>; viewer pages `1–26`, an official chapter-18 entry excerpt.
- Volume 3 path-dependent audit SHA-256 (not portable packet identity): `43e0c4a52e24cf7572143d87fece78cbff717758ed4a0de86518e89050b1bfda`.
- Official editorial scope: volume 2 describes a man who lives each day following his own interests and affections while revealing student/family context. Volume 3 explicitly says his self-paced manner is unchanged and illustrates it with immediate interest-led acts before covering his middle-school past.
- Limitation: the public reader samples are not a continuous full three-volume read, and volume 1 does not finish chapter 1. Complete official serial chapters or full chapter units are a reproducible re-review route. The present zero decisions therefore rely on the positive cross-volume editorial characterization plus three edition-linked internal samples, never on the incomplete volume-1 sample alone.

## 3. Work-level decisions

### 3.1 君と宇宙を歩くために — `work-7730845c9cf7ba0cccc8`

#### Missing-axis decision

- `strategy`: **CORRECT `U -> known 2`**.
  - F01 spreads `21–23` establish that unfamiliar places/questions trigger failure and that a written routine/response notebook is used as a deliberate coping plan.
  - Spreads `25–29` show Kobayashi decomposing the part-time job into written steps rather than merely reacting after each failure.
  - Spreads `31–35` show diagnosis of the mistake/anxiety loop followed by execution of the recorded procedure; spreads `37–44` complete the consequence and relational payoff.
  - This is distinct from the existing `problemSolving=4`: the latter covers constraint analysis and solution quality; `strategy=2` covers the repeated short-horizon procedure, pre-recorded responses, and task plan. It reaches the Dictionary's tactical/short-plan anchor, not long-term planning value 4.
- `mysteryReveal`, `worldBuilding`: **UNKNOWN retained**. The full first episode does not need either axis to describe the observed mechanism.

#### Closure

- Final Narrative: `3/4/2/2/U/U` = `4/6`, PASS.
- Final Tone: `4/2/U/0/2/U/4` = `5/7`, PASS, unchanged.
- Genre/Theme: no change.
- Route state: the specified complete first-episode route is exhausted. Volume 2–3 internal pages are still available as a recurrence re-review route; therefore a disagreement about `strategy=2` would be `needs re-review`, never a hard blocker.

### 3.2 写らナイんです — `work-112589a161d1596ec97f`

#### Missing-axis decisions

- `progression`: **CORRECT `U -> known 2`**.
  - F02 volume 1 gives the encounter and formation of the working occult pair; volume 2's official description adds the national competition goal and senior recruitment; volume 3 explicitly adds training.
  - The internal chapter samples show the club operating beyond the initial encounter. This supports gradual progress at value 2, not repeated high-intensity mastery/reward at value 4.
- `problemSolving`: **CORRECT `U -> known 2`**.
  - The complete first chapter directly establishes observation of Kurokiri's supernatural condition, Michiru's occult knowledge/tool use, and action chosen in response to the encountered spirit.
  - The complete volume-2 chapter sample again shows the group identifying an occult threat and responding with knowledge plus direct action. This fits the mixed ingenuity/direct-action anchor. It does not establish analysis as the work's dominant reward, so value 4 is rejected.
- `worldBuilding`: **CORRECT `U -> known 2`**.
  - Across F02 volume 1 viewer pages `13–54` and the volume 2–3 samples, supernatural traits and occult effects are stable, action-constraining rules rather than decorative horror imagery. Club competition/training also functions as a recurring institutional frame.
  - The evidence supports a functional setting at value 2, not a history/culture/faction-heavy value 4.
- `strategy`, `mysteryReveal`: **UNKNOWN retained**. Neither the contest goal nor occult incidents alone prove planning as a recurring reward or a clue/reveal structure.
- Theme `investigation`: **remains rejected**. Known `problemSolving` and functional supernatural rules do not silently create a repeated investigation mechanic.

#### Closure

- Final Narrative: `2/2/U/4/U/2` = `4/6`, PASS.
- Final Tone: `U/2/3/2/U/1/3` = `5/7`, PASS, unchanged.
- Genre/Theme: no change; `comedy;horror`, `school:2` retained.
- Route state: the designated public ISBN samples for volumes 1–3 are exhausted. Consecutive official serial chapters remain a narrower recurrence check; information is not genuinely unavailable and no blocker applies.

### 3.3 ふつうの軽音部 — `work-268e1fa3599955359969`

#### Missing-axis decisions

- `problemSolving`: **CORRECT `U -> known 1`**.
  - F03 spreads `03–06` show a concrete price/preference constraint, comparison/trial of an available used instrument, and direct purchase. This is an observed small practical resolution, not a Genre inference.
  - The evidence is one bounded mechanism and is not ingenious or dominant enough for anchor 2; value 1 records limited presence without inflating recurrence.
- `worldBuilding`: **CORRECT `U -> known 2`**.
  - F03 spreads `14–18` explicitly establish club size, instrument/member composition, band-formation requirements, practice-frame allocation, and the shared practice-room system. Spreads `19–27` show those rules causing band formation and practice actions.
  - These are functional institutional/music rules, not merely the facts that the work is set at school and involves music. They fit value 2, not elaborate setting value 4.
- `strategy`, `mysteryReveal`: **UNKNOWN retained**. The practice and band frames do not yet prove strategy as a separate recurring reward, and no reveal structure is established.

#### Closure

- Final Narrative: `2/1/U/3/U/2` = `4/6`, PASS.
- Final Tone: `2/3/2/U/3/U/2` = `5/7`, PASS, unchanged.
- Genre/Theme: no change.
- Route state: the complete official episodes 1–4 bundle is exhausted. Later official Jump+ chapters and volume 2–3 pages remain a recurrence re-review route; rejection of the low `problemSolving=1` would require that review, not a hard blocker.

### 3.4 本なら売るほど — `work-192cbecc59e9c028142b`

#### Missing-axis decisions

- `strategy`: **CORRECT `U -> known 2`**.
  - F04 viewer pages `10–23` establish a fixed next-day clearance deadline, many rooms of books, limited carrying/store capacity, and the need to prioritize saleable or valuable books.
  - The bookseller proceeds room by room, identifies collection patterns and rare ownership marks, explicitly weighs store budget/capacity, and changes priority under the deadline. This is repeated short-horizon triage and resource planning.
  - The decision is distinct from existing `problemSolving=2`: professional appraisal solves the customer/task constraint, while `strategy=2` is the observed sequence and allocation plan. There is no long-term resource campaign, so value 4 is rejected.
- `comedy`: **CORRECT `U -> known 1`**.
  - Across the complete episode, several independent light beats recur: blunt shop banter, exaggerated race-against-clock reactions, the contrast between the bookseller's obsession and the property agent's practical stance, and the restrained final price joke on viewer page 32.
  - Comedy is present but not the chapter's core reward, so value 1 is safer than anchor 2.
- `darkness`: **UNKNOWN retained**. Death of the former owner and impending disposal are serious context, but one warm/bittersweet episode does not establish a dark-world axis. This avoids using death as an automatic darkness conversion.
- `progression`, `mysteryReveal`, `romance`: **UNKNOWN retained**.

#### Closure

- Final Narrative: `U/2/2/1/U/2` = `4/6`, PASS.
- Final Tone: `4/3/1/U/1/U/3` = `5/7`, PASS.
- Genre/Theme: no change.
- Route state: the official first episode is complete and exhausted. Official volume 2–3 internal pages remain a recurrence re-review route for strategy/comedy. The accessible official material rules out `SOURCE_INFORMATION_UNAVAILABLE`; no blocker applies.

### 3.5 路傍のフジイ — `work-37ecced0b2392d7af9b2`

#### Missing-axis decisions

- `progression`: **CORRECT `U -> known 0`**.
  - This is not inferred from a missing synopsis. The volume-2 official editor text positively characterizes Fujii as continuing to live each day according to his own interests and affections while other people learn more about him.
  - Volume 3 explicitly says that his self-paced manner is unchanged, while the volume-1, 2, and 3 entry samples keep the reward on observers discovering an already-formed way of life and on past context being revealed.
  - That repeated cross-volume stability supports the Dictionary's near-absence of acquisition/mastery reward. Other characters' changed perception remains covered by `characterArcWeight`/relationships and is not double-counted as progression.
- `strategy`: **CORRECT `U -> known 0`**.
  - Again this is positive mode evidence, not omission. The volume-2 official text says his daily actions follow immediate interest/affection. Volume 3 gives concrete immediate acts—hearing music and buying it, seeing blossoms and running—and calls the manner unchanged.
  - The three edition-linked reader samples are consistent with spontaneous interest-led action, not short or long plans as a reward. That fits the Dictionary's improvisational anchor 0.
- `problemSolving`, `worldBuilding`: **UNKNOWN retained**. Workplace presence and other characters' re-evaluation do not establish either mechanism.

#### Zero-value safeguard and closure

- The incomplete volume-1 reader alone could not support either zero. The decisions require the official volume-2 and volume-3 editorial characterizations plus three separate edition-linked samples.
- Final Narrative: `0/U/0/1/2/U` = `4/6`, PASS.
- Final Tone: `4/2/U/1/2/U/3` = `5/7`, PASS, unchanged.
- Genre/Theme: no change.
- Route state: the designated public samples are exhausted, but continuous full chapters remain unexhausted. If a reviewer disputes either zero, the reproducible next step is complete official chapter units within volumes 1–3 or the corresponding official serial episodes, with special attention to acquisition rewards and advance plans. That is a re-review path, not information unavailability and not a blocker.

## 4. Strict hard-blocker audit

| Blocker class | Result for all five | Reason |
|---|---|---|
| adult-only / R18 | no | Current packet safety state remains `safe`; no official source introduced adult-only classification. KADOKAWA's audience tag is not R18. |
| webtoon / vertical-scroll original | no | All five are standard Japanese page-manga works with standard tankobon editions. |
| non-Japanese / non-manga / fan work / artbook | no | Current verified identities and official publisher editions remain intact. |
| duplicate edition / set / identity conflict | no | Each route matches the frozen canonical work and standard representative volume/ISBN. |
| safety unknown | no | No new safety conflict was found. |
| identity cannot be established | no | Exact official work/episode or ISBN-linked product identity exists for every work. |
| information genuinely unavailable | no | Every designated official route was reachable. Where a public sample is incomplete, a precise official serial/full-chapter re-review path remains. |
| Factor model fundamentally incompatible | no | All five now satisfy immutable Narrative and Tone coverage without changing the Dictionary or forcing unknowns. |

Final classification for this narrow pass:

- `recommendationVerified` text-gate candidates: `5`.
- `promotionBlocked`: `0`.
- `annotationDraft` or pending due solely to these text routes: `0`.

## 5. Handoff notes

- Apply the vectors above only against the exact candidate SHA.
- Preserve all baseline known axes not explicitly changed here.
- Preserve the existing Genre/Theme decisions; no new Theme row is requested.
- Keep all remaining `U` values unknown. In particular, do not derive mystery from horror, strategy from club membership, darkness from bereavement, or world-building from workplace/school labels.
- Art remains exactly as closed by the existing Art pipeline.
- No repository file was edited by this task; this report exists only at `/tmp/pilot-text-gap-f.md`.
