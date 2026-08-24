# Pilot 001 narrow official text research D

- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Prior current-SHA review: `reviews/text-pass-bc-chunks-03-04.md`
- Scope: exactly four works requested; first 1–3 volumes or first major episode
- Retrieved at: `2026-08-23`
- Coverage gate: Narrative known `>=4/6`, Tone known `>=5/7`
- Method: only the official entry-volume preview routes named by the current review were opened. Genre was not used to infer an Axis, synopsis omission was not treated as numeric zero, and unresolved observations remain `unknown`.
- Identity boundary: `かげきしょうじょ！！` values below use only Hakusensha main-series volumes 1–3. `かげきしょうじょ！` and `シーズンゼロ` were excluded from Factor observations.

## Outcome

| Work | Before | Narrow official finding | After | Result |
|---|---|---|---|---|
| `work-8716f80d9b988bd0d055` 恋は雨上がりのように | N 3/6, T 5/7 | Volumes 1–3 previews are partial scene excerpts and do not resolve the pacing conflict or prove a distinct progression/planning loop | N 3/6, T 5/7 | `RESEARCH_REQUIRED` |
| `work-11296a590b885cb73b66` 透明なゆりかご | N 3/6, T 5/7 | Full official episode 1 repeatedly shows practical, immediate clinical responses in two different medical situations; `problemSolving=1` | N 4/6, T 5/7 | `PASS_CANDIDATE` |
| `work-9d04c47e7efbbbd8aca6` かげきしょうじょ！！ | N 4/6, T 4/7 | Main-volume-1 pages directly show repeated peer sharing and an explicit first-friend/birthday emotional payoff; `emotionalWarmth=2` | N 4/6, T 5/7 | `PASS_CANDIDATE` |
| `work-07ff2a01ef593ce2f809` さよならミニスカート | N 3/6, T 4/7 | Full 63-page official first episode is reaction-led rather than plan-led and contains intermittent comic relief; `strategy=0`, `comedy=1` | N 4/6, T 5/7 | `PASS_CANDIDATE` |

Pass count after this research: **3/4**. Remaining coverage failure: **1/4**. Hard blocker candidates: **0**.

`PASS_CANDIDATE` means the new direct observations can enter independent Pass B/C; this research report does not self-approve promotion.

## 1. 恋は雨上がりのように — work-8716f80d9b988bd0d055

### Official sources inspected

1. 小学館 公式試し読み 恋は雨上がりのように 1
   - URL: https://shogakukan.tameshiyo.me/9784091867285
   - Edition: Big Comics volume 1, ISBN `9784091867285`
   - Published: `2015-01-09`
   - Range inspected: viewer states `3/15–15/15`, volume contents and opening excerpt
   - Direct observation: the excerpt moves from school to the family restaurant and introduces Akira’s reserved daily conduct and restaurant relationships. It does not complete the first episode and does not show a repeated mastery/acquisition loop or a planning mechanism.
2. 小学館 公式試し読み 恋は雨上がりのように 2
   - URL: https://shogakukan.tameshiyo.me/9784091868688
   - Edition: Big Comics volume 2, ISBN `9784091868688`
   - Published: `2015-04-10`
   - Range inspected: viewer states `3/13–13/13`, opening excerpt
   - Direct observation: rain, a closed restaurant, Akira’s direct request for an answer, and the manager’s hesitation/care are shown. The scene is relationship-led; it does not establish a progression reward or settle overall cadence.
3. 小学館 公式試し読み 恋は雨上がりのように 3
   - URL: https://shogakukan.tameshiyo.me/9784091872005
   - Edition: Big Comics volume 3, ISBN `9784091872005`
   - Published: `2015-09-11`
   - Range inspected: viewer states `3/8–8/8`, opening excerpt
   - Direct observation: Akira visits and cares for the sick manager. This confirms relationship action and warmth already covered by the current review, but it does not prove a separate Narrative axis.

### Decision

- No new numeric Axis is supported.
- Keep `progression=unknown`: the three excerpts show emotional/relationship change, not repeated acquisition or mastery distinct from `characterArcWeight`.
- Keep `strategy=unknown`: partial scenes are insufficient to establish the whole entry as plan-led or reactive-only.
- Keep `pacing=unknown`: the official excerpts do not resolve the existing disagreement between independent entry reviews.
- Final Narrative remains `U / 0 / U / U / 0 / 1` = **3/6**.
- Final Tone remains `4 / 2 / U / U / 2 / 4 / 2` = **5/7**.
- Genre/Theme remain non-empty: `romance`; `workplace=2`.

### Temporary evidence identity

- `koi_v1`: 13 PNGs, aggregate SHA-256 `967a08e65822159050cef5422b3d7c0cb844e28173d894a7bde3560a0506419f`
- `koi_v2`: 11 PNGs, aggregate SHA-256 `b8cd5e99d6fd355d8527f52bebc595b549a8852925a5a426691978e6d223d784`
- `koi_v3`: 6 PNGs, aggregate SHA-256 `c8e1e85d1b765a9b58bdb4fe8eafc62d33c42d439d3cf20b8f13b732aa40f2ca`
- Paths: `output/playwright/pilot-text-gap-d/koi-q*.png`, `koi-v2-*.png`, `koi-v3-*.png`

### Remaining route

The named ISBN-matched volume 1–3 previews are exhausted. A further official route must provide a complete entry episode or page-level volume cadence/progression observation; the existing short product descriptions and these excerpts should not be recycled as a numeric fill. This is not yet `SOURCE_INFORMATION_UNAVAILABLE`, so it is not a hard blocker.

## 2. 透明なゆりかご — work-11296a590b885cb73b66

### Official sources inspected

1. コミックDAYS 透明なゆりかご 第1話 命のかけら
   - URL: https://comic-days.com/episode/13932016480030343945
   - Source date: `2018-03-09`
   - Edition/range: official digital episode 1, printed pages 5–28; the full episode endpoint was reached
   - Direct observation A, pp. 12–17: the trainee is instructed through an abortion-related clinical task, carries out the procedure, records the result, and hands the work over. The response is practical/direct, not analytical or ingenious.
   - Direct observation B, pp. 18–23: when a patient enters labor, staff immediately checks and assists; the trainee responds to instructions and observes the delivery. This is a second distinct clinical context with the same direct-response pattern.
   - Direct observation C, pp. 24–28: the episode closes on the contrast between terminated and born life and the trainee’s changed perspective, not on solving a puzzle.
2. 講談社 透明なゆりかご 1
   - URL: https://www.kodansha.co.jp/comic/products/0000036416
   - Published: `2015-05-13`
   - Edition/range: volume 1, ISBN `9784063409574`
3. 講談社 透明なゆりかご 2
   - URL: https://www.kodansha.co.jp/comic/products/0000036427
   - Published: `2015-10-13`
   - Edition/range: volume 2
4. 講談社 透明なゆりかご 3
   - URL: https://www.kodansha.co.jp/comic/products/0000036443
   - Published: `2016-04-13`
   - Edition/range: volume 3
   - Direct observation across product descriptions: volumes 2–3 continue rotating through separate medical/ethical cases, consistent with the direct procedural response visible in episode 1.

### Candidate decision for independent review

- Add `problemSolving=known 1`, confidence `0.75`.
- Dictionary fit: two separate constraints receive active practical responses, but analysis/clever resolution is not the core reward. This lies between the direct-action anchor 0 and the mixed analysis/action anchor 2.
- Do not raise it to 2 and do not infer it merely from the medical setting.
- Keep `strategy=unknown` and `mysteryReveal=unknown`; no long-horizon plan or clue/reveal reward is directly established.
- Final Narrative candidate: `2 / 1 / U / 3 / U / 2` = **4/6**.
- Final Tone remains `4 / 2 / U / 4 / 4 / U / 2` = **5/7**.
- Genre/Theme remain non-empty: `sliceOfLife`; `workplace=2`.

### Temporary evidence identity

- 13 viewer PNGs, aggregate SHA-256 `921c49b5547bfdae93269e31ea41689d0a39b5f578a9ad4f39e90f9f41b247cb`
- Path: `output/playwright/pilot-text-gap-d/yurikago-*.png`

### Remaining route

No further official route is required for Narrative/Tone coverage. Independent Pass B/C must verify the `problemSolving=1` boundary; failure should return it to `unknown`, not substitute another value.

## 3. かげきしょうじょ！！ — work-9d04c47e7efbbbd8aca6

### Official sources inspected

1. 白泉社 かげきしょうじょ！！ 1
   - Product URL: https://www.hakusensha.co.jp/comicslist/46806/
   - Preview URL: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221726kagesho00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D46806
   - Published: `2015-11-05`
   - Edition/range: Hakusensha main-series volume 1, ISBN `9784592217268`, trial `0_29`, 31 viewer pages including front matter
   - Direct observation A, printed pp. 6–11: classmates exchange souvenirs, share reactions to performances, move and talk together, and frame the school day as a recurring peer network. Warmth is present but mixed with competitive training.
   - Direct observation B, printed pp. 24–27: Ai explicitly wants to make Sarasa happy because Sarasa is her first friend; birthday messages/gifts produce a visible emotional payoff, followed by the class returning to shared activity. This directly supports bond warmth rather than merely inferring it from co-presence.
2. 白泉社 かげきしょうじょ！！ 2
   - Product URL: https://www.hakusensha.co.jp/comicslist/48355/
   - Preview URL: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221727kagesho00211&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D48355
   - Published: `2016-09-05`
   - Edition/range: Hakusensha main-series volume 2, trial `0_9`
   - Direct observation: the short sample continues school/training interactions; the product description separately places Sarasa and Ai together on the homecoming trip and reunion.
3. 白泉社 かげきしょうじょ！！ 3
   - Product URL: https://www.hakusensha.co.jp/comicslist/48734/
   - Preview URL: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221728kagesho00311&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D48734
   - Published: `2016-12-05`
   - Edition/range: Hakusensha main-series volume 3, trial `0_9`
   - Direct observation: the short sample continues the cohort/class context; the product description supplies shared centenary-performance preparation.

Season Zero URL https://www.hakusensha.co.jp/comicslist/53883/ was used only to verify the identity boundary. No Season Zero page or observation supports the candidate value.

### Candidate decision for independent review

- Add `emotionalWarmth=known 2`, confidence `0.80`.
- Dictionary fit: peer sharing and an explicit friendship/birthday payoff recur in the official main-volume-1 range, while competition and performance pressure keep warmth at the mixed anchor 2 rather than core-healing 4.
- Final Narrative remains `4 / 1 / U / 3 / U / 3` = **4/6**.
- Final Tone candidate: `4 / 4 / 1 / U / 2 / U / 2` = **5/7**.
- Genre/Theme remain non-empty: `sliceOfLife`; `school=2`.
- Keep `darkness` and `romance` unknown. The samples do not establish their entry-wide frequency.

### Temporary evidence identity

- Main volume 1: 15 PNGs, aggregate SHA-256 `1df21edae19b3e3c1449312255134c4093d3c87b61c9dfc2b0694cf041f138c6`
- Main volume 2: 10 PNGs, aggregate SHA-256 `f335669cd12c5b8bb89210d7e14219a13819193f40e49e088b6669f4b6c4630b`
- Main volume 3: 10 PNGs, aggregate SHA-256 `193644e76a1f46ff076214effbe13c169b36f85203781974b9f8a6e2aef4c243`
- Paths: `output/playwright/pilot-text-gap-d/kage-*.png`, `kage-v2-*.png`, `kage-v3-*.png`

### Remaining route

No further official route is required for Narrative/Tone coverage. Independent Pass B/C must verify the main-series identity binding and the level-2 warmth anchor. Season Zero remains excluded.

## 4. さよならミニスカート — work-07ff2a01ef593ce2f809

### Official sources inspected

1. 集英社 りぼん さよならミニスカート official first-episode trial
   - URL: https://ribon.shueisha.co.jp/sayonara_miniskirt_trial/
   - Associated edition: Ribon Mascot Comics volume 1, ISBN `9784088675206`
   - Edition published: `2018-11-22`; the trial page does not display a separate publication date and links to this edition
   - Range inspected: all `page_001.jpg–page_063.jpg`, complete first major episode
   - Direct observation A: conflicts are handled through immediate observation, following, confrontation, dialogue, and physical protection. The episode repeatedly reacts to new disclosures and threats; it does not form a tactical or long-horizon plan.
   - Direct observation B: comic reaction panels recur in idol backstage chatter, classroom gossip, teacher/student exchanges, and peer banter. They are intermittent relief inside a trauma/identity mystery, not the core reward.
   - Direct observation C: identity clues and disclosures support the already-known `mysteryReveal=2`; character change is kept separate from `progression`.
2. 集英社 さよならミニスカート 2
   - Product URL: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-867543-5
   - Preview URL: https://www.shueisha.co.jp/books/reader/main.php?cid=9784088675435
   - Published: `2019-03-25`
   - Edition/range: volume 2 opening sample, chapter 4 front matter and opening excerpt
   - Direct observation: the entry continues through immediate questioning, confrontation, and reactions to the idol/stalker situation. It also contains bounded light exchanges but remains serious overall. It does not introduce a long-horizon strategy.

### Candidate decisions for independent review

- Add `strategy=known 0`, confidence `0.80`.
  - Dictionary fit: the complete first major episode positively demonstrates an immediate/reactive handling pattern. This is not zero inferred from the `mystery` Genre or from synopsis omission.
  - Keep `problemSolving=unknown`: direct protection and questioning are present, but the packet does not establish analysis/ingenious resolution as a repeated reward distinct from reveal structure.
- Add `comedy=known 1`, confidence `0.85`.
  - Dictionary fit: comic relief occurs repeatedly but intermittently; serious threat, trauma, identity, and mystery remain primary. The official pages directly disprove `comedy=0` without inflating it to 2 or 4.
- Keep `progression=unknown`: identity/relationship change remains represented by `characterArcWeight`; no repeated mastery/acquisition loop appears.
- Final Narrative candidate: `U / U / 0 / 3 / 2 / 1` = **4/6**.
- Final Tone candidate: `4 / 2 / 1 / 3 / 4 / U / U` = **5/7**.
- Genre/Theme remain non-empty: `mystery`; `school=2`.
- Sensitive assault/gender material is content scope, not evidence of adult-only sale. No new safety conflict was found.

### Temporary evidence identity

- First episode: 63 PNGs, aggregate SHA-256 `999e36f3b85e8ab103357bef489da8893a50d889d1174fe164fd515e2ac18cf7`
- Volume 2 sample: 13 PNGs, aggregate SHA-256 `3192293575104f65568e1c58c47a671f7719d6e7d533fadb69561adcd8c2926d`
- Paths: `output/playwright/pilot-text-gap-d/miniskirt-*.png`, `miniskirt-v2-*.png`

### Remaining route

No further official route is required for Narrative/Tone coverage. Independent Pass B/C should test whether the complete-episode reactive pattern is sufficient for `strategy=0`; rejection must return the axis to `unknown` rather than fill another Narrative value.

## Aggregate checks

- Works researched: `4`
- Narrative/Tone coverage candidates passing after narrow research: `3`
- Still research-required: `1` (`恋は雨上がりのように`)
- Non-empty Genre: `4/4`
- Non-empty Theme: `4/4`
- New hard blocker: `0`
- New safety conflict: `0`
- New identity conflict: `0`
- Open value conflicts in this report: `0`; all unsupported axes are explicit `unknown`
- Canonical-title ornament check: no canonical title includes decorative corner brackets.
- Temporary files are under ignored `output/playwright/pilot-text-gap-d/` and must not be committed.
- Aggregate SHA definition: SHA-256 over sorted records `filename + NUL + fileSha256 + newline`.

## Handoff

1. Independent Pass B/C: review only the four candidate values `透明なゆりかご problemSolving=1`, `かげきしょうじょ！！ emotionalWarmth=2`, `さよならミニスカート strategy=0`, and `さよならミニスカート comedy=1` against the page references above.
2. Keep `恋は雨上がりのように` at Narrative 3/6 until a genuinely new complete official entry route resolves a fourth Narrative axis. Do not reuse the same partial previews as nominal additional evidence.
3. No source CSV, annotation CSV, registry, or repository document was edited by this task.
