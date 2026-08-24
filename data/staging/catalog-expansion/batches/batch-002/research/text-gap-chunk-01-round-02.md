# Batch 002 text-gap research — chunk 01, final finite pass

- `reviewedByHuman=false`
- Researcher: Primary Local Codex Pass A
- Scope: frozen positions 1, 2, 3, 4, 6, 7, and 8 only
- Explicit exclusion: position 5 RED was not researched because its upstream Art blocker owns closure
- Evidence scope: original or mapped volumes 1–3 and the first major episode only
- Research and retrieval date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Boundary: this is the last bounded evidence search. It is not Pass B, Pass C, promotion, or a source/final CSV edit.

## Frozen inputs

| Input                                               | SHA-256                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `AGENTS.md`                                         | `64abddef3e280a3293bef81f8ef964ce7cb8513a75aea8030f500daf7475ef72` |
| `docs/factors/factor-dictionary.md`                 | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                  | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `docs/catalog-expansion/01-promotion-method.md`     | `6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd` |
| `annotation-review-adjudication-request.md`         | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `adjudication/text-gap-queue-chunk-01-round-02.csv` | `ee97af0fd2f39cc25a8e022e609aa3b17068f3786a5fc90ca6558e7b009ccc21` |
| `research/text-gap-chunk-01.md`                     | `664adc9ea4c325cb0b5841a8c1b47d7d546b48a5661e96f232b4bf9c4e413071` |
| `reviews/text-gap-chunk-01-independent-review.md`   | `e7426964ac1f1e1308dc0c99df39380b0cd7de031aa4d97cd742c6666eb20b05` |
| `adjudication/text-chunk-01-round-02.md`            | `504e44329f1958ad484cddd1a518c42471bebcc062e82ff77fa63a31c0d40748` |
| `adjudication/text-final-chunk-01.csv`              | `55323c7f59e2d2a2444781dbf0ff32d7eaa92ee1633ad42b2896a355f1745732` |

## Method and closure rules

- Official publisher volume pages and internal previews were checked first. Exact-range independent reviews were checked only after the official range was fixed.
- A source family is a publisher, editorial publication, or review platform. Several accounts syndicated from Booklog remain one family. Ratings, popularity, list membership, and Genre labels were ignored.
- Candidate values below describe observable entry-range repetition against the Dictionary anchors. A coverage shortage never supplied a value. A known zero was not inferred from silence.
- User observations are auxiliary only when at least two independent families repeat a concrete observation and it does not contradict the official range. They are never copied into user-facing explanation text.
- `U` means closed `unknown`, not a low value. A failed finite route is closed with blocker candidate `SOURCE_INFORMATION_UNAVAILABLE`; only the recorded recheck artifact can reopen it.
- Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`. Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`.
- All source URLs below were requested on 2026-08-23. Ordinary pages returned HTTP 200 after redirects. The two Kodansha trial URLs and three Shogakukan viewer URLs returned HTTP 200 in a Chromium navigation check. Temporary preview images were not added to the repository.

## Result summary

| Pos | workId                      | canonicalTitle   | Current N/T | New candidate-known axes                                                           | Candidate N/T | Expected gate | Closure                                    |
| --: | --------------------------- | ---------------- | ----------: | ---------------------------------------------------------------------------------- | ------------: | ------------- | ------------------------------------------ |
|   1 | `work-017446dd1a9039d9839b` | サンダー３       |    3/6, 2/7 | `characterArcWeight=2`; `emotionalWarmth=1`                                        |      3/6, 4/7 | fail N+1, T+1 | `SOURCE_INFORMATION_UNAVAILABLE` candidate |
|   2 | `work-02d5d329c9ef85e481cb` | のたり松太郎     |    6/6, 4/7 | `romance=2`                                                                        |      6/6, 5/7 | pass          | continue to Pass B/C                       |
|   3 | `work-089947c5303024841fef` | デカワンコ       |    4/6, 4/7 | `emotionalWarmth=2`                                                                |      4/6, 5/7 | pass          | continue to Pass B/C                       |
|   4 | `work-0e036724913c69bb937a` | ファイアパンチ   |    3/6, 5/7 | `mysteryReveal=2`                                                                  |      4/6, 5/7 | pass          | continue to Pass B/C                       |
|   6 | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ |    2/6, 3/7 | `problemSolving=3`; `mysteryReveal=2`; `characterArcWeight=2`; `emotionalWarmth=2` |      4/6, 5/7 | pass          | continue to Pass B/C                       |
|   7 | `work-19a26f01512166856a6a` | 銀河鉄道999      |    2/6, 3/7 | `emotionalWarmth=2`                                                                |      2/6, 4/7 | fail N+2, T+1 | `SOURCE_INFORMATION_UNAVAILABLE` candidate |
|   8 | `work-1e27731b880d0d9012f8` | 吉祥天女         |    0/6, 2/7 | `characterArcWeight=2`; `relationshipStructure=2`; `emotionalWarmth=1`             |      0/6, 5/7 | fail N+4      | `SOURCE_INFORMATION_UNAVAILABLE` candidate |

Candidate-known total: 13 axes across 7 Works. Expected result if Pass B and Pass C accept the proposals: 4 text-gate passes and 3 finite-route hard-blocker candidates. Position 5 is excluded from both counts.

## 1. work-017446dd1a9039d9839b — サンダー３

### Official-first and independent evidence

| ID  | URL                                                         | Source; publishedAt/year                          | retrievedAt | Independence                                        | Exact range and direct observation                                                                                                                                                                                                                                                          | Limitation                                                                                                                                 |
| --- | ----------------------------------------------------------- | ------------------------------------------------- | ----------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1-A | https://www.kodansha.co.jp/comic/products/0000372698        | 講談社, volume 2; 2023-01-17                      | 2026-08-23  | Official publisher family                           | Volume 2 follows the Small 3 searching for Futaba, a parent and child being rescued, Futaba escaping, and a consequential encounter.                                                                                                                                                        | Product copy names outcomes but not a repeated analytical method or sustained subjective state.                                            |
| 1-B | https://www.kodansha.co.jp/comic/products/0000372698/trial  | 講談社 official internal preview; 2023            | 2026-08-23  | Same publisher family as 1-A                        | Volume 2 episode 5 opening and page 8 show the children with a protective adult, then armed pursuers closing on the child. Captured content hashes: `e3e9f169f7b8e0255aeacefdc246a95802dd7618a6122c798e33c630eab2f8b3`, `1e82de8e6437b1049a760a8ff585b85a15b1d8650ee8ffdaec189762db713a5d`. | The trial closes immediately after the opening; it cannot establish a solution loop or a whole-volume Tone frequency.                      |
| 1-C | https://www.kodansha.co.jp/comic/products/0000376761        | 講談社, volume 3; 2023-05-17                      | 2026-08-23  | Official publisher family                           | A message from Segami's mother prompts his decision to fight and join the rebellion; Futaba separately turns to fight the armed alien force.                                                                                                                                                | Personal decisions are direct, but the copy does not expose repeated strategy, problem solving, or a mystery payoff.                       |
| 1-D | https://www.kodansha.co.jp/comic/products/0000376761/trial  | 講談社 official internal preview; 2023            | 2026-08-23  | Same publisher family as 1-C                        | Volume 3 episode 9 is titled `DETERMINATION`; its page 8 has Segami and the Small 3 discuss his endangered sister. Captured hashes: `e7f5621fa35f71d310fd9271d4079c10f0730f850f98a1c73c131a9facf94b46`, `7d7b05eef319e25b0fd1520f61ba3905089fa16754bb2ba481248f85cb9f6668`.                 | Only the opening is available. It corroborates motivation and family concern, not the rest of the requested axes.                          |
| 1-E | https://booklive.jp/review/list/title_id/1232321/vol_no/002 | BookLive exact-volume reviews; 2023-01-18 to 2026 | 2026-08-23  | One review-platform family, independent of Kodansha | Accounts describe widening cast and situation, resistance context, and low plot advance in volume 2.                                                                                                                                                                                        | Claims are mixed, several are unscoped impressions, and no second independent review family repeats a missing Narrative or Tone mechanism. |

### Candidate axes and closure

- `characterArcWeight=2` — candidate-known. 1-A–1-D repeatedly tie the conflict to rescue, sibling concern, a mother's message, and Segami's decision to fight. Personal motivation and external events are balanced; the material does not justify 4.
- `emotionalWarmth=1` — candidate-known. Protective care and sibling concern recur in both official volumes, but danger and separation dominate. This is between the Dictionary's cold/harsh 0 and mixed 2 anchors.
- `progression`, `problemSolving`, and `mysteryReveal` remain closed `unknown`. Search, escape, resistance membership, and combat are events; none of the accessible official pages exposes a repeated acquisition loop, an analysis-and-solution method, or a truth-reveal reward.
- `comedy`, `mentalStress`, and `romance` remain closed `unknown`. The previews do not establish repeated comedy, sustained subjective pressure, or a romance subplot. No known zero is inferred.

Expected Narrative: `U / U / 1 / 3 / U / 2` = 3/6. Expected Tone: `2 / 2 / U / 2 / U / U / 1` = 4/7. Expected gate: fail.

Closure: `SOURCE_INFORMATION_UNAVAILABLE` candidate. Recheck only if an official volume-2-or-3 full internal range, or a stable exact-volume editorial packet, directly exposes at least one additional Narrative mechanism and one additional Tone mechanism. General series reviews or later-volume events do not reopen it.

## 2. work-02d5d329c9ef85e481cb — のたり松太郎

### Official-first and independent evidence

| ID  | URL                                                        | Source; publishedAt/year                                                | retrievedAt | Independence                                          | Exact range and direct observation                                                                                      | Limitation                                                                                    |
| --- | ---------------------------------------------------------- | ----------------------------------------------------------------------- | ----------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 2-A | https://shogakukan-comic.jp/book?jdcn=091800720000d0000000 | 小学館コミック, digital volume 2; 2017-12-01                            | 2026-08-23  | Official publisher family                             | Matsutaro visits the teacher he admires; she welcomes him despite the harm his behavior caused, and he tears up.        | One volume alone would not prove a persistent subplot.                                        |
| 2-B | https://shogakukan-comic.jp/book?jdcn=091800730000d0000000 | 小学館コミック, digital volume 3; 2017-12-01                            | 2026-08-23  | Same publisher family                                 | Reiko remains identified as the woman Matsutaro admires. Meeting her makes him self-conscious, and Tanaka also blushes. | This establishes a recurring minor relationship thread, not romance as the main plot.         |
| 2-C | https://www.cmoa.jp/title/customer_review/title_id/139847/ | コミックシーモア reader reviews; relevant exact-range review 2018-01-25 | 2026-08-23  | One review-platform family, independent of Shogakukan | A review explicitly scoped through volume 3 discusses the protagonist's harsh conduct.                                  | It does not independently define the romance claim; it is used only as a contradiction check. |

### Candidate axis and expected gate

- `romance=2` — candidate-known. 2-A and 2-B provide direct recurrence across exact volumes 2 and 3: admiration, a visit, visible self-consciousness, and a small triangle-like reaction. It matches a subplot, not the central-relationship anchor 4.
- `mentalStress` and `emotionalWarmth` remain `unknown`. A single warm visit is not enough for sustained warmth, and harsh conduct is not automatically subjective psychological pressure.

Expected Narrative: `3 / 0 / 0 / 3 / 0 / 2` = 6/6. Expected Tone: `2 / 3 / 2 / 1 / U / 2 / U` = 5/7. Expected gate: pass, subject to Pass B and Pass C.

Recheck path: Pass B should verify only that the volume-2 and volume-3 official descriptions belong to the frozen edition. No additional web search is required unless that identity check fails.

## 3. work-089947c5303024841fef — デカワンコ

### Official-first and independent evidence

| ID  | URL                                                                            | Source; publishedAt/year                               | retrievedAt | Independence                                   | Exact range and direct observation                                                                                                  | Limitation                                                                                             |
| --- | ------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 3-A | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865527865501315501 | 集英社, volume 2; paper 2009-04-17, digital 2012-06-29 | 2026-08-23  | Official publisher family                      | The exact volume is described as repeatedly combining laughter with moving incidents across Files 10–18.                            | Publisher marketing alone cannot define warmth, so independent exact-volume observations are required. |
| 3-B | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865554865501315501 | 集英社, volume 3; paper 2009-09-18, digital 2012-06-29 | 2026-08-23  | Same publisher family                          | Serious injury and successive cases remain interleaved with comedy and police ensemble activity.                                    | It corroborates the mixed tone but does not itself name warmth.                                        |
| 3-C | https://booklive.jp/review/list/title_id/152565/vol_no/002?spoiler=1           | BookLive volume-2 reviews; 2019-11-24 and 2024-11-14   | 2026-08-23  | Review-platform family independent of Shueisha | Separate accounts repeat relief, relaxation, safe interpersonal chemistry, and laughter while reading volume 2.                     | Multiple accounts remain one source family; ratings and emotion tags are excluded.                     |
| 3-D | https://honto.jp/ebook/pd_34737694.html                                        | honto volume-2 reviews; 2022-03-07 and 2022-03-08      | 2026-08-23  | Independent of BookLive and Shueisha           | An exact-volume account identifies the hospital-case ending as moving; another grounds the observation in specific volume-2 scenes. | The platform has few reviews, so it corroborates only the mixed warmth claim, not an extreme value.    |

### Candidate axis and expected gate

- `emotionalWarmth=2` — candidate-known. 3-A establishes moving incidents as repeated volume content, while 3-C and 3-D independently repeat relief, interpersonal safety, and an emotionally moving case ending. Comedy and injury keep the result mixed rather than warmth-centered 4.
- `mentalStress` and `romance` remain `unknown`; no scoped packet directly establishes their repeated entry-range structure.

Expected Narrative: `U / 3 / U / 3 / 4 / 1` = 4/6. Expected Tone: `2 / 3 / 3 / 2 / U / U / 2` = 5/7. Expected gate: pass, subject to Pass B and Pass C.

Recheck path: Pass B should independently confirm that 3-C and 3-D are volume-2 product reviews rather than series-wide syndicated text. If either loses exact scope, return `emotionalWarmth` to `unknown` instead of substituting another Tone value.

## 4. work-0e036724913c69bb937a — ファイアパンチ

### Official-first and independent evidence

| ID  | URL                                                                            | Source; publishedAt/year                           | retrievedAt | Independence                                             | Exact range and direct observation                                                                                                                                          | Limitation                                                                           |
| --- | ------------------------------------------------------------------------------ | -------------------------------------------------- | ----------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 4-A | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08880797880731315501 | 集英社, volume 2; 2016-10-04                       | 2026-08-23  | Official publisher family                                | A mysterious woman abruptly starts filming, and the volume reaches a shocking turn.                                                                                         | Marketing language alone does not distinguish pacing from a secret/reveal structure. |
| 4-B | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-880873-4    | 集英社, volume 3; 2016-12-02                       | 2026-08-23  | Same publisher family                                    | Togata has planted hostile participants, but Agni's sudden decision collapses the expected plan.                                                                            | It proves another reversal but not clue-driven mystery as the main reward.           |
| 4-C | https://kracpot.hatenablog.com/entry/2016/10/04/204621                         | TOKYO ALONE exact volume-2 review; 2016-10-04      | 2026-08-23  | Hatena Blog family, independent of Shueisha and BookLive | The review identifies an apparent governing explanation as disinformation, a different underlying cause being disclosed, and earlier material functioning as foreshadowing. | One personal review cannot carry the value alone.                                    |
| 4-D | https://booklive.jp/review/list/title_id/385889/vol_no/002                     | BookLive exact volume-2 reviews; 2016-11-09 onward | 2026-08-23  | Independent review-platform family                       | Accounts separately repeat foreshadowing, a hidden identity/function for Togata, and a major direction change within volume 2.                                              | Accounts share one platform; unscoped whole-series remarks are excluded.             |

### Candidate axis and expected gate

- `mysteryReveal=2` — candidate-known. 4-A and 4-B fix two exact-volume reversals. 4-C and 4-D independently identify a disclosed false world explanation, prior foreshadowing, and Togata's entry changing the apparent story. This matches “some secrets and twists,” while the evidence does not support clue/inference/reveal as the main reward 4.
- `progression` and `problemSolving` remain `unknown`. Survival, revenge, abrupt decisions, and shocking direction changes do not establish a repeated acquisition loop or analytical solution method.

Expected Narrative: `U / U / 2 / 4 / 2 / 3` = 4/6. Tone remains `3 / 3 / 2 / 4 / 4 / U / U` = 5/7. Expected gate: pass, subject to Pass B and Pass C.

Recheck path: Pass B must verify the exact volume-2 scope of 4-C and 4-D and distinguish a real disclosed secret/reversal from mere unpredictability. If that distinction fails, close `mysteryReveal` as `unknown`; do not replace it with progression or problem solving.

## 6. work-1088a1dc00a3b0d22201 — 邪眼は月輪に飛ぶ

### Official-first and independent evidence

| ID  | URL                                                                      | Source; publishedAt/year                                                                             | retrievedAt | Independence                                                   | Exact range and direct observation                                                                                                                                                           | Limitation                                                                              |
| --- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 6-A | https://shogakukan-comic.jp/book?isbn=9784091811974                      | 小学館コミック, complete single volume; 2007-04-27                                                   | 2026-08-23  | Official publisher family                                      | Seven chapters run from the lethal-gaze outbreak through city pursuit and a tower duel. The former hunter, his daughter, military, and intelligence participants form the complete conflict. | The product copy fixes rules, cast, and endpoint but omits the detailed final solution. |
| 6-B | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091811970000d0000000    | 小学館 official internal preview; digital edition 2013                                               | 2026-08-23  | Same publisher family                                          | The opening directly establishes mass death and the gaze constraint.                                                                                                                         | The public sample does not reach the mid-volume preparation or final shot.              |
| 6-C | https://www.cmoa.jp/title/62742/                                         | コミックシーモア complete-volume reviews; 2013-10-24, 2018-12-27, 2019-08-16, 2022-12-25, 2025-03-09 | 2026-08-23  | One exact-volume review-platform family                        | Independent accounts repeat an apparently impossible constraint, a hunter/military partnership, hearts connecting during the pursuit, and a final head shot.                                 | Several accounts remain one platform; no single one is treated as sufficient.           |
| 6-D | https://isolated.hyakunin-isshu.net/book/comic-jagan-ha-gachirin-ni-tobu | 孤譚 complete-volume review; 2016-03-24                                                              | 2026-08-23  | Independent authored review family                             | It describes four participants exploiting an unexpected weakness, hidden missions and pasts, estranged father/daughter reconciliation, and growing mutual understanding.                     | It withholds the exact weakness and final mechanics.                                    |
| 6-E | https://note.com/jenniferrrrrrrw/n/nab1e79333e0a                         | ジェニファー / note complete-volume close reading; 2025-12-02                                        | 2026-08-23  | Independent note author and platform account                   | It records the coordinated aircraft, free-fall, canopy, lighting, evaporation-window, and forehead-shot sequence, plus a late disclosure about Uhei's earlier self-blinding.                 | A recent personal close reading; it is used only with 6-A, 6-C, and 6-D.                |
| 6-F | https://note.com/miyabichito227/n/n5736630a819a                          | chito / note complete-volume review; 2022-07-30                                                      | 2026-08-23  | Independent author from 6-E, but the same note platform family | It confirms that the major characters' past and present feelings are exposed while Minerva's origin remains deliberately unexplained.                                                        | Same platform as 6-E; useful for conflict/limit checking, not an extra platform vote.   |
| 6-G | https://manga-blog.net/jagan-ha-gachirin-ni-tobu/                        | 漫画の虎 complete-volume review; 2017-06-08                                                          | 2026-08-23  | Independent authored site                                      | It repeats the four-person pursuit, uneasy parent/child relationship, regrets in each participant's past, and human drama alongside the fight.                                               | It does not detail the final mechanical solution.                                       |

### Candidate axes and expected gate

- `problemSolving=3` — candidate-known. 6-A and 6-B establish the lethal constraint and bounded tower confrontation. 6-C–6-E independently repeat a weakness-dependent, multi-part coordinated solution, with 6-E supplying the exact sequence. Direct combat remains important, so the value stays between mixed 2 and analytical-core 4.
- `mysteryReveal=2` — candidate-known. 6-D–6-F repeat hidden missions and pasts, Uhei's late self-blinding disclosure, the enemy weakness, and the final thought, while 6-F explicitly notes that the creature's origin remains unresolved. This is “some secrets and twists,” not a clue/reveal-centered work.
- `characterArcWeight=2` — candidate-known. The official cast and decision to take up the gun are paired with three independent families describing estrangement, regret, mutual understanding, and reconciliation alongside the external hunt. Character change and events are balanced.
- `emotionalWarmth=2` — candidate-known. 6-C, 6-D, and 6-G independently repeat heart connection, assistance, and parent/child repair within an otherwise lethal and harsh story. The mixed anchor 2 fits; 4 would contradict the dominant threat.
- `progression`, `strategy`, `comedy`, and `romance` remain `unknown`. The one-shot coordinated plan does not prove long-horizon strategy, and absent comedy or romance is not inferred from review silence.

Expected Narrative: `U / 3 / U / 4 / 2 / 2` = 4/6. Expected Tone: `2 / 2 / U / 4 / 2 / U / 2` = 5/7. Expected gate: pass, subject to Pass B and Pass C.

Recheck path: Pass B should independently verify 6-D and 6-E against the complete single-volume range and test whether `problemSolving=3` is supported without importing memory. If the exact solution source cannot be reproduced, return only `problemSolving` to `unknown`; the other candidates have separate evidence routes.

## 7. work-19a26f01512166856a6a — 銀河鉄道999

### Official-first and independent evidence

| ID  | URL                                                        | Source; publishedAt/year                                  | retrievedAt | Independence                                     | Exact range and direct observation                                                                                                                 | Limitation                                                                                           |
| --- | ---------------------------------------------------------- | --------------------------------------------------------- | ----------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 7-A | https://shogakukan-comic.jp/book?jdcn=091880010000d0000000 | 小学館コミック, digital volume 1; 2015-08-07              | 2026-08-23  | Official publisher family                        | Tetsuro loses his mother, is rescued by Maetel, receives a pass, and starts the journey through ten listed locations/episodes.                     | It establishes tragedy, aid, and episodic travel, not a completed growth loop.                       |
| 7-B | https://shogakukan-comic.jp/book?jdcn=091880020000d0000000 | 小学館コミック, digital volume 2; 2015-08-07              | 2026-08-23  | Same publisher family                            | Ten new planet episodes repeatedly expose Tetsuro and Maetel to residents, conflict, and danger.                                                   | The descriptions do not directly state a stable personal change or analytical solution method.       |
| 7-C | https://shogakukan-comic.jp/book?jdcn=091880030000d0000000 | 小学館コミック, digital volume 3; 2015-08-07              | 2026-08-23  | Same publisher family                            | Six further episodes include an unseen caller, a vanished train, unknown gravity, and derailment.                                                  | Mysteries are posed, but the public copy does not expose their resolutions or Maetel's larger truth. |
| 7-D | https://booklive.jp/review/list/title_id/327375/vol_no/002 | BookLive exact volume-2 reviews; 2023-03-01 to 2023-03-09 | 2026-08-23  | Review-platform family independent of Shogakukan | Accounts repeat encounters with residents, Tetsuro's perceived growth, his toughness, Maetel's kindness, and the fragility of individual stories.  | Several accounts are on one platform; perceived growth is not directly stated by official copy.      |
| 7-E | https://honto.jp/ebook/pd-review_0627290102_192.html       | honto exact volume-2 reviews; 2024-02-29 to 2024-04-05    | 2026-08-23  | Independent of BookLive and Shogakukan           | A review repeats kindness and emotionally resonant contact with residents; another says volume-1 mysteries deepen rather than resolve in volume 2. | It supports warmth and an unresolved-mystery limit, not progression or a reveal payoff.              |

### Candidate axis and closure

- `emotionalWarmth=2` — candidate-known. 7-A directly establishes rescue and accompaniment; 7-D and 7-E independently repeat kindness and emotionally resonant contact across exact volume 2. Recurrent tragedy prevents warmth from becoming the central reward 4.
- `progression` remains closed `unknown`. 7-D perceives growth, but the official 1–3 descriptions only establish sequential encounters; no second independent family directly repeats a concrete acquired capability or stable change.
- `problemSolving` and `strategy` remain closed `unknown`. Many incidents and departures do not identify a repeated response method or long-horizon plan.
- `mysteryReveal` remains closed `unknown`. 7-C poses episode mysteries, while 7-E directly says the larger entry mystery deepens rather than resolves. A later-series answer cannot be imported.
- `comedy`, `mentalStress`, and `romance` remain closed `unknown`. Danger and tragedy are already represented by `darkness`; they do not prove sustained subjective pressure.

Expected Narrative: `U / U / U / 3 / U / 4` = 2/6. Expected Tone: `2 / 2 / U / 3 / U / U / 2` = 4/7. Expected gate: fail.

Closure: `SOURCE_INFORMATION_UNAVAILABLE` candidate. Recheck only if official mapped volume-1-to-3 episode pages expose two additional repeated Narrative mechanisms and one additional Tone mechanism, or if two new independent exact-volume families corroborate claims also visible in those official pages. Film, anime, later-volume, and whole-series memories do not reopen it.

## 8. work-1e27731b880d0d9012f8 — 吉祥天女

### Official-first and independent evidence

| ID  | URL                                                                   | Source; publishedAt/year                                   | retrievedAt | Independence                                                            | Exact range and direct observation                                                                                                                                                                                                                                                                                                                                                              | Limitation                                                                                                               |
| --- | --------------------------------------------------------------------- | ---------------------------------------------------------- | ----------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 8-A | https://shogakukan-comic.jp/book?jdcn=091313020000d0000000            | 小学館コミック, digital volume 2; 2014-03-03               | 2026-08-23  | Official publisher family                                               | Confirms exact volume identity and the continuing school disruption after Sayoko's arrival.                                                                                                                                                                                                                                                                                                     | Product copy is too short to define an Axis.                                                                             |
| 8-B | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091313020000d0000000 | 小学館 official internal preview, volume 2; 2014           | 2026-08-23  | Same publisher family                                                   | Pages 6–11 show recurring family participants discussing Sayoko's police-related incident, resentment, parental distance, and a grandfather recalling a grandmother's care. Hashes: `4ba66c6c4f93e02b97129aaa7abfd20f3e0bae8811339348317708b31a941d20`, `d7d7dc0fca9c6d0e7661bc0991127bf298986efe20188242e6b88c2ec0b96ca3`, `88af4c978f5756a207c90d16c581757011a5c5b62f33f352796cb9627bd17377`. | Six opening pages cannot establish a full-volume Narrative mechanism.                                                    |
| 8-C | https://shogakukan-comic.jp/book?jdcn=091313030000d0000000            | 小学館コミック, digital volume 3; 2014-03-03               | 2026-08-23  | Official publisher family                                               | Confirms the exact following volume and continuity of the same school conflict.                                                                                                                                                                                                                                                                                                                 | Product copy does not isolate events.                                                                                    |
| 8-D | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091313030000d0000000 | 小学館 official internal preview, volume 3; 2014           | 2026-08-23  | Same publisher family                                                   | Pages 6–11 show Ryo's classmates noticing his changed behavior, expressing concern and proposing to check on him; a school confrontation with Sayoko follows. Hashes: `5857f07cee33efdc5eb72d0968595fe73bec3668eb72432e49f8fef0e2db5f44`, `5798568fcd739bbd10834ee1b7d922937b3363a534c5369804a2972a277d0655`, `99dd4f8841aa739bc1184e2c717323cda69f2b53c64a2f15a1f739e74723e58f`.               | Concern and one improvised check do not prove a repeated strategy/problem-solving structure.                             |
| 8-E | https://booklive.jp/product/index/title_id/246501/vol_no/002          | BookLive exact volume-2 review; 2013-09-19                 | 2026-08-23  | BookLive carries a Booklog-syndicated account independent of Shogakukan | The account enumerates the garden party, repeated assault attempts, Sayoko's counterattack, and Ryo helping her evade Akira.                                                                                                                                                                                                                                                                    | One syndicated account; it cannot supply a Narrative value without another independent family.                           |
| 8-F | https://booklive.jp/product/index/title_id/246501/vol_no/003          | BookLive exact volume-3 reviews; 2009-10-04 and 2013-09-19 | 2026-08-23  | Same BookLive/Booklog family as 8-E                                     | The accounts record retaliation against Ryo, the grandfather's death, Sayoko trying to protect the household, and the grandfather's self-acceptance message.                                                                                                                                                                                                                                    | Same family as 8-E; it corroborates official relationship and motivation content but is not a second independent family. |

### Candidate axes and closure

- `characterArcWeight=2` — candidate-known. 8-B and 8-D directly foreground resentment, parental distance, changed behavior, concern, and confrontation across two official volumes; 8-E and 8-F corroborate that motivation and relationship consequences accompany the events. The samples do not justify central-reward 4.
- `relationshipStructure=2` — candidate-known. Family participants, Ryo, classmates, and Sayoko recur across both official previews as a fixed relationship core. The material is not a complex ensemble sufficient for 4.
- `emotionalWarmth=1` — candidate-known. Grandparental care, classmates' concern, Ryo's help, and the grandfather's reassurance recur, but they are surrounded by alienation, assault, retaliation, and death. This lies between cold/harsh 0 and mixed 2.
- All six Narrative axes remain closed `unknown`. The official previews expose only twelve opening pages. 8-E and 8-F are one syndicated review family, so their event list cannot establish repeated progression, problem solving, strategy, pacing, reveal, or world-building by itself.
- `comedy` and `romance` remain closed `unknown`; no known zero is inferred from their absence in the samples.

Expected Narrative: `U / U / U / U / U / U` = 0/6. Expected Tone: `2 / 2 / U / 2 / 2 / U / 1` = 5/7. Expected gate: fail Narrative.

Closure: `SOURCE_INFORMATION_UNAVAILABLE` candidate. Recheck only if official full volume-2-and-3 internal pages or a stable publisher editorial exposes at least four Narrative axes, or if multiple genuinely independent exact-volume review families corroborate mechanisms directly visible in official pages. Volume 4, complete-work endings, film material, and Booklog mirrors do not reopen it.

## Finite closure and handoff

| Outcome                                           | Works |                                                          Axes |
| ------------------------------------------------- | ----: | ------------------------------------------------------------: |
| Candidate text-gate pass                          |     4 |                                         7 newly proposed axes |
| Closed `SOURCE_INFORMATION_UNAVAILABLE` candidate |     3 | 6 newly proposed axes retained, remaining gaps closed unknown |
| Upstream Art exclusion                            |     1 |                                                not researched |
| Candidate-known total                             |     7 |                                                            13 |
| Human validation represented as complete          |     0 |                                                             0 |

- Pass B must independently inspect the direct claims rather than inherit these values. Pass C resolves any disagreement against the Dictionary and exact range; it must not average values or substitute a different Axis to save coverage.
- No source CSV, final CSV, registry, Art artifact, Gold data, or canonical title was changed by this pass.
- No canonical title in this report contains decorative title delimiters.
