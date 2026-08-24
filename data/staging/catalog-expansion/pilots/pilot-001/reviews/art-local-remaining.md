# Pilot 001 — remaining 6-work Art gate (Local Codex)

- Scope: `陽だまりの樹`, `Papa told me`, `バラ色の明日`, `エマ`, `放浪息子`, `大奥`
- Executed: 2026-08-23 (Asia/Tokyo)
- Contract: `docs/factors/factor-dictionary.md` `entry_1_3_volumes`; official internal preview; exact work/edition; at least 6 readable internal pages and at least 2 scene contexts for static Art axes; an exact bounded continuous action sequence for `motionImpact`
- Existing inputs reused: Pilot frozen research packet, `art-local-ecomi-audit.md`, `art-local-other-audit.md`, frozen representative ISBNs, and their already-recorded official product/preview URLs. No source corpus was reset or recollected.
- Pixel inspection: Local Codex opened every authoritative PNG listed below with `view_image(detail=original)`. Cover, animation, synopsis, and user art opinions were not used for Art values.
- Repository edits: none. Temporary PNGs are under ignored `output/playwright/pilot-art/remaining/**` and must not be committed.

## Outcome

| workId | Work | frozen representative edition | official preview result | readable pages / contexts | Art closure |
|---|---|---|---|---:|---|
| `work-671e3453cf9e1df2ee87` | 陽だまりの樹 | `9784091806017`, Shogakukan standard v1 | official rightsholder page links a Rakuten preview titled volume 1, but the opaque token has no ISBN/edition identifier and no evidence maps it to the frozen Shogakukan edition | 0 / 0 | all four `unknown` — edition gate failed |
| `work-ad2b80b81b7bc9b602a3` | Papa told me | `9784088640136`, Shueisha standard v1 | exact official product and reader; JDCN prefix `08864013` equals the ISBN body and the reader reports title `Papa told me 1`, author, publisher, and 52 page nodes | 6 / 3 | static axes proposed known; `motionImpact=unknown` |
| `work-440f93a4e60ef906685b` | バラ色の明日 | `9784088487090`, 1997 standard v1 | available reader is JDCN `08782229…`, whose product is the 2009 re-edited complete collection; it explicitly has a redrawn cover and added author commentary | 0 / 0 | all four `unknown` — edition gate failed |
| `work-1fc61ddbeb429b4a2c15` | エマ | `9784047298804`, KADOKAWA standard v1 | exact KADOKAWA product links BOOK☆WALKER product `dee971…`; the trial redirects to its official viewer, but the renderer did not answer screenshot, evaluation, or CDP capture after commit | 0 / 0 | all four `unknown` — official preview inaccessible |
| `work-0bec5d8d9474a2197312` | 放浪息子 | `9784757715226`, KADOKAWA standard v1 | exact KADOKAWA product links BOOK☆WALKER product `de4bd5…`; the trial redirects to its official viewer, but the renderer did not answer CDP capture after commit | 0 / 0 | all four `unknown` — official preview inaccessible |
| `work-464322afcd10013437b9` | 大奥 | `9784592143017`, Hakusensha standard v1 | exact official product links JDCN `59214301ookuXXX00111`; prefix `59214301` equals the ISBN body; official reader counter is 79 | 6 / 3 | static axes proposed known; `motionImpact=unknown` |

Totals: 2 qualified, 4 explicitly closed unknown; 6 proposed known static axes and 18 unknown axes. No `motionImpact` value was proposed.

## Qualified evidence and Local proposals

### `work-ad2b80b81b7bc9b602a3` — Papa told me

Edition and range proof:

- Source: 集英社 `Papa told me 1` official product; paper release 1988-02-19, digital release 2016-12-01; retrieved 2026-08-23. <https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501>
- Preview: 集英社 official reader, undated; retrieved 2026-08-23. <https://www.shueisha.co.jp/books/reader/main.php?cid=08864013864013315501>
- Frozen ISBN `9784088640136` has body `08864013`; reader ContentID begins `08864013`, and `__sreaderFunc__.contentInfo` reports publisher `集英社`, title `Papa told me 1`, and the same ContentID.
- Reader exposed 52 `content-p*` pages. Authoritative refs are viewer pages 6–7, 14–15, and 22–23: six distinct, readable internal pages in episode 1.
- Contexts: home/father's pocket and daughter's essay; school/class assignment and peer interaction; library return and walk home. These are three distinct scene contexts.

Local proposal:

| Axis | State/value | Confidence | Direct observation |
|---|---|---:|---|
| `artRealism` | known 2 | .88 | generally proportionate figures and recognizable domestic/school settings, with clear shoujo stylization rather than either strong deformation or photorealism |
| `artDensity` | known 2 | .86 | multi-panel pages alternate character close-ups, screentone, and selective room/street backgrounds; neither sparse throughout nor consistently highly packed |
| `visualSoftness` | known 4 | .90 | fine clean contours, delicate hair/eyes, rounded expressions, and light tonal treatment remain consistent across all three contexts |
| `motionImpact` | unknown | — | sampled pages contain ordinary gestures and walking, but no exact start/end continuous dynamic sequence adequate for this conditional axis |

Authoritative PNGs:

| Viewer refs | Context | SHA-256 | Temporary file |
|---|---|---|---|
| 6–7 | home / essay introduction | `bcb596f8b4c0b6553cc0b2ed1de9302b57eb8482f05bb27c641584a2937d5d7a` | `output/playwright/pilot-art/remaining/papa-told-me/pages-6-7.png` |
| 14–15 | school / classmates | `c8c29050bc698f1e396646011ed1a6b5eb3dca3a8598bcfaacd70667196fdbf0` | `output/playwright/pilot-art/remaining/papa-told-me/pages-14-15.png` |
| 22–23 | library / walk home | `cb54bb8624d4d29958245460c9cf3fb0f3948c4af08c744748120790766f663e` | `output/playwright/pilot-art/remaining/papa-told-me/pages-22-23.png` |

### `work-464322afcd10013437b9` — 大奥

Edition and range proof:

- Source: 白泉社 `大奥 1` official product; published 2005-09-29; retrieved 2026-08-23. <https://www.hakusensha.co.jp/comicslist/40895/>
- Preview: 白泉社 official reader, undated; retrieved 2026-08-23. <https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59214301ookuXXX00111&viewer=bs>
- The product page states ISBN `9784592143017` and directly links the preview. ISBN body `59214301` equals the preview JDCN prefix.
- Official CLIP STUDIO reader reports 79 pages. Authoritative refs are viewer pages 14–15, 22–23, and 30–31: six distinct readable internal story pages. Viewer pages 6–7 were inspected but excluded because one side is a color title illustration and the other is blank; that temporary PNG is not evidence.
- Contexts: epidemic/village tragedy and exposition; Edo streets, commerce, and Mizuno's arrival; Ooku entrance interview. These are three distinct contexts.

Local proposal:

| Axis | State/value | Confidence | Direct observation |
|---|---|---:|---|
| `artRealism` | known 3 | .88 | realistic adult proportions, faces, period clothing, village/Edo architecture, and restrained anatomy, tempered by visibly stylized facial design |
| `artDensity` | known 3 | .90 | detailed historical environments, patterned clothing, dense crowd/architecture panels, narration, and multiple panel scales; large close-ups keep it below an unqualified 4 |
| `visualSoftness` | known 2 | .84 | clean elegant linework is balanced by sharp jaws, strong black masses, and stark tragedy panels, placing the sample near neutral rather than consistently soft |
| `motionImpact` | unknown | — | the three samples show exposition, walking/arrival, and dialogue; no exact bounded continuous action sequence is present |

Authoritative PNGs:

| Viewer refs | Context | SHA-256 | Temporary file |
|---|---|---|---|
| 14–15 | epidemic / village tragedy | `448635ce03f63ea39add0f676b9fb1069d51ea6d86adcc5694f410240d2539ba` | `output/playwright/pilot-art/remaining/ooku/pages-14-15.png` |
| 22–23 | Edo streets / arrival | `c612e2a562338ba2eb9bd490a156139f4ab44a95febfb4c04895b555799a8755` | `output/playwright/pilot-art/remaining/ooku/pages-22-23.png` |
| 30–31 | Ooku entrance interview | `60320780c7eeed68f2c12abc313e637660d3a6a53487a4592bab7d3ba1bfb49a` | `output/playwright/pilot-art/remaining/ooku/pages-30-31.png` |

## Explicit unknown closures

### `work-671e3453cf9e1df2ee87` — 陽だまりの樹

- Source: 手塚治虫 official rightsholder work page, undated; retrieved 2026-08-23. <https://tezukaosamu.net/jp/manga/380.html>
- Correction to the earlier interim ledger: the page does contain eleven rightsholder-linked Rakuten instant-preview URLs, and the first image alt is `陽だまりの樹（1）`. Therefore “no preview exists” is too strong.
- Gate failure: the first preview is an opaque Rakuten token (`8b71f80f…`) without ISBN, publisher, or edition marker. The rightsholder page does not connect that token to frozen representative ISBN `9784091806017` or prove pagination/content equivalence with the Shogakukan standard edition.
- Result: sample 0; `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` all `unknown`. Recheck only after a product/edition mapping for that token is available.

### `work-440f93a4e60ef906685b` — バラ色の明日

- Source: 集英社 `バラ色の明日 1` official digital product, paper release 2009-07-24, digital release 2013-04-09; retrieved 2026-08-23. <https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782229848709315501>
- Preview: 集英社 official reader, undated; retrieved 2026-08-23. <https://www.shueisha.co.jp/books/reader/main.php?cid=08782229848709315501>
- Gate failure: frozen representative ISBN `9784088487090` has body `08848709`; the preview JDCN begins `08782229`. The official product identifies itself as a 2009 `完全収録、完全完結` re-edit with a redrawn cover and added author commentary, not the frozen 1997 standard volume 1. No authoritative story-page mapping was available.
- Result: sample 0; all four Art axes `unknown`. A re-edited edition must not be silently substituted.

### `work-1fc61ddbeb429b4a2c15` — エマ

- Source: KADOKAWA `エマ 1` official product, paper release 2002-08-30, electronic release 2014-01-14; retrieved 2026-08-23. It states ISBN `9784047298804` and directly links the BOOK☆WALKER sample. <https://www.kadokawa.co.jp/product/301407000933/>
- Preview product: BOOK☆WALKER `dee971444a-72e5-4aab-a1fe-979347425373`, undated; retrieved 2026-08-23. <https://bookwalker.jp/dee971444a-72e5-4aab-a1fe-979347425373/?sample=1&from=1>
- Access result: the official page advertises 19 sample pages and redirects to `viewer-trial.bookwalker.jp` with matching content ID `e971…`. In both bundled Chromium and system Google Chrome, navigation committed but the viewer renderer did not answer DOM evaluation, Playwright screenshot, or direct CDP screenshot capture after the wait/timeout boundary. No page became a reproducibly readable evidence input.
- Result: sample 0; all four Art axes `unknown`. Recheck only if the same official viewer becomes normally readable; do not replace it with covers or an unofficial scan.

### `work-0bec5d8d9474a2197312` — 放浪息子

- Source: KADOKAWA official store `放浪息子 1`, published 2003-07-25; retrieved 2026-08-23. It states ISBN `9784757715226` and directly links the BOOK☆WALKER sample. <https://store.kadokawa.co.jp/shop/g/g200700002446/>
- Preview product: BOOK☆WALKER `de4bd52269-b4b6-43d8-a916-9cf8c2437a09`, undated; retrieved 2026-08-23. <https://bookwalker.jp/de4bd52269-b4b6-43d8-a916-9cf8c2437a09/?sample=1&from=1>
- Access result: the official trial redirects to `viewer-trial.bookwalker.jp` with matching content ID `4bd5…`; navigation committed, but direct CDP screenshot capture timed out and produced no readable page.
- Result: sample 0; all four Art axes `unknown`. Recheck only if the same official viewer becomes normally readable.

## Handoff / adjudication boundary

- These two known-static proposals are Local evidence assistance, not final promotion approval. Gemini 3.7 Flash High must inspect the same six authoritative hashes per work; conflicts must be resolved against the Factor Dictionary and exact refs, never averaged or decided by raw majority.
- The other four works are closed `unknown`, not low-valued and not Art blockers by themselves. They should not remain pending merely because a visual sample is unavailable.
- Do not send the excluded `output/playwright/pilot-art/remaining/ooku/pages-6-7.png` to the Art panel; it is not part of the authoritative six-page sample.
