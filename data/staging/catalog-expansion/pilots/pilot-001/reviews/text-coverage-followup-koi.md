# Pilot 001 narrow official text research — 恋は雨上がりのように

## Boundary

- Repository HEAD inspected: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Work: `work-8716f80d9b988bd0d055`
- Canonical title: `恋は雨上がりのように` (the decorative `『` and `』` used in source-page headings are not part of the title)
- Scope: official complete episodes 1, 4, and 5, all explicitly published by Shogakukan as volume-1 pre-release samples; text Narrative judgment only
- Out of scope: Art values, later-volume inference, repository modification
- Starting effective vector:
  - Narrative (`progression/problemSolving/strategy/pacing/mysteryReveal/worldBuilding`): `U/0/U/U/0/1` = `3/6`
  - Tone (`characterArcWeight/relationshipStructure/comedy/darkness/mentalStress/romance/emotionalWarmth`): `4/2/U/U/2/4/2` = `5/7`
- Gate: Narrative known `>=4/6`; Tone known `>=5/7`

This pass does not turn a synopsis omission into zero and does not infer an Axis from the romance Genre. The only proposed numeric addition is supported by repeated, directly observed action structure inside the complete official episodes.

## Official evidence identity

### Episode 1

- Source: ビッグコミックBROS.NET（小学館）／週刊スピリッツ
- URL: <https://bigcomicbros.net/7742/>
- Source published: `2015-01-02` (page date and original-publication note)
- Retrieved: `2026-08-23`
- Edition binding: Big Comics volume 1; the official page states that episodes 1, 4, and 5 were released in full for volume 1's `2015-01-09` publication. Representative ISBN in the current packet: `9784091867285`.
- Range directly inspected: complete episode 1, official images `koiame-01-01.jpg` through `koiame-01-25.jpg` (`25` pages/images)
- Temporary aggregate SHA-256: `6b9cc000ea568b63d9ece52eac6868cd63f0bc5ae666d15a989918d1429d73db`

### Episode 4

- Source: ビッグコミックBROS.NET（小学館）／週刊スピリッツ
- URL: <https://bigcomicbros.net/7743/>
- Source published: `2015-01-03` (page date and original-publication note)
- Retrieved: `2026-08-23`
- Edition binding: the same official volume-1 full-episode release
- Range directly inspected: complete episode 4, official images `koiame-04-01.jpg` through `koiame-04-18.jpg` (`18` pages/images)
- Temporary aggregate SHA-256: `e813c6e2aeed4ec5b22cba70cd36cf01a7d2f5cb93e575305ff00732aae59d0a`

### Episode 5

- Source: ビッグコミックBROS.NET（小学館）／週刊スピリッツ
- URL: <https://bigcomicbros.net/7744/>
- Source published: `2015-01-04` (page date and original-publication note)
- Retrieved: `2026-08-23`
- Edition binding: the same official volume-1 full-episode release
- Range directly inspected: complete episode 5, official images `koiame-05-01.jpg` through `koiame-05-18.jpg` (`18` pages/images)
- Temporary aggregate SHA-256: `7d17be3764b754ebde3afba613ad9e8e1479bdf3f432089ac7bcc3e16684c192`

Across all three episodes, `61` official images were inspected. Aggregate SHA-256 over filename-sorted records `filename + NUL + fileSha256 + newline`: `4be698cb7e3451f73a416fb6c5323732f30d1d0bf02725f296ce0b62a94a1ffb`.

The temporary files are under the ignored directory `output/playwright/pilot-text-gap-koi/`; they are evidence-inspection artifacts and must not be committed.

## Direct observations

### Episode 1 — pages/images 01–25

- Pages 2–6 establish an event-driven chain: Akira wakes after school, feels the old leg injury, runs after and misses a bus, then enters the nearby restaurant in response to the immediate situation.
- Pages 7–17 move through ordinary restaurant work and Kondo's small acts of care. Akira responds in the moment to a coworker, Kondo's food, his questions, and her own embarrassment; no resource allocation, staged tactic, or long-horizon plan drives the episode.
- Pages 18–20 pivot on rain, an offered umbrella, and a chance meeting with a male classmate. Kondo and Akira react to what occurs in front of them.
- Pages 21–25 return to home and school. The old injury is made explicit, and Akira decides to go to her shift. This is a direct emotional/ordinary-life choice, not an acquisition/mastery reward loop.

### Episode 4 — pages/images 01–18

- Pages 1–6 move from train-platform overhearing to restaurant work and Akira's immediate feelings toward Kondo. The order and workplace banter are local scene actions, not a tactical mechanism.
- Pages 7–10 introduce a customer's forgotten phone. Akira notices it; Kondo immediately runs after the customer, and Akira immediately follows.
- Pages 11–16 turn on Akira's running speed, her old injury, a sudden fall, and Kondo's unplanned decision to get his car and take her to a hospital.
- Pages 17–18 show Kondo selecting the nearby hospital in response to the accident. The episode's causal spine is successive incident-response transitions.

### Episode 5 — pages/images 01–18

- Pages 1–5 show examination of the injured ankle and Kondo's improvised handling of the practical uniform/return-to-work issue. Akira chooses to return immediately despite being told she need not.
- Pages 6–8 show her coworkers reacting to the injury and Akira leaving on crutches after the immediate situation is settled.
- Pages 9–16 move from rest at home to a memory/fantasy and a phone call. Kondo calls to check on her; Akira directly registers his number when it is supplied. The relationship step is obtained through an unexpected call, not through a plotted sequence.
- Pages 17–18 show follow-up treatment and recovery instructions; there is no repeated growth, acquisition, or mastery payoff established by this episode.

## Axis adjudication

| Axis | Decision | Value | Confidence | Direct-evidence rationale |
|---|---|---:|---:|---|
| `strategy` | `known` candidate | `0` | `0.83` | All three complete episodes positively exhibit the dictionary's low-end pattern, `즉흥 대응 중심`: missed transport and immediate movement to the restaurant; forgotten phone followed by an immediate chase; injury followed by an unplanned hospital trip; return-to-work and phone registration handled as events arise. This is a repeated observed action structure across different contexts, not a zero inferred from a synopsis failing to mention plans. Local intentions exist, but tactical/long-range planning does not organize these entry episodes. |
| `progression` | retain `unknown` | — | — | The pages disclose an old injury and relationship movement, but do not establish a repeated growth/acquisition/mastery reward structure. Relationship change is not automatically `progression`, and lack of such a loop in three selected volume-1 episodes is not enough to assign `0`. |
| `pacing` | retain `unknown` | — | — | Episodes contain clear scene and state changes, but the dictionary anchors this Axis to the first three volumes. Three complete, nonconsecutive volume-1 episodes cannot responsibly settle whether first-three-volume goals/situations change little, at ordinary arc cadence, or at short intervals. Prior partial volumes 1–3 excerpts do not remove that scope limitation. |

No other Narrative or Tone value is changed. Genre and Theme remain nonempty in the current packet (`romance`; `workplace`), but neither is used to generate the `strategy` value.

## Final effective result

- Narrative: `U/0/0/U/0/1` = **4/6** — gate passes
- Tone: `4/2/U/U/2/4/2` = **5/7** — gate passes unchanged
- Text gate: **PASS_CANDIDATE**
- New text hard blocker: **none**
- Identity/safety conflict found by this narrow pass: **none**
- Art: outside this pass and unchanged

The official complete-episode route specifically requested by the review is exhausted: episodes 1, 4, and 5 were all read in full. No additional official text route is required to meet N/T coverage if independent review accepts `strategy=0`. `progression` and `pacing` are explicitly and terminally `unknown` for this evidence packet; they are not pending work merely to increase known count.

If independent review rejects the repeated reaction-led pattern as insufficient for `strategy=0`, the value must revert to `unknown`, yielding Narrative `3/6`. That rejection would create a research-needed state, not a hard blocker: hard-blocker adjudication would still require a reproducible showing that eligible entry-volume information is substantively unavailable or cannot satisfy the product contract. No value should be substituted merely to recover coverage.

This report is model research/review evidence, not human blind validation. It must not change `reviewedByHuman=false`.
