# Pilot 001 Art gate — chunk 04 Local Codex pass

- Scope: `pilot-001` chunk 04, ten works only
- Inspection date: 2026-08-23 (Asia/Tokyo)
- Method: existing frozen Pilot URLs and edition mappings only; Playwright real-browser rendering; every authoritative PNG opened at original detail and visually inspected
- Dictionary: `docs/factors/factor-dictionary.md` Art 0/2/4 anchors
- Gate: exact work/entry edition, official interior preview, at least 6 readable internal pages, at least 2 scene contexts
- Motion gate: `motionImpact=known` only with exact contiguous start/end page references for one continuous action sequence
- Repository files edited: none
- Temporary files: ignored `output/playwright/pilot-art/chunk-04/**`; do not commit
- Decision scope: Local Codex proposal only. Gemini 3.7 Flash High quorum and current-candidate Pass C remain required.

## Outcome

| Result | Works |
|---|---:|
| Qualified for static Art judgment | 10 |
| Closed all four Art axes unknown for insufficient sample | 0 |
| `motionImpact` Local known proposal | 1 |
| `motionImpact` Local unknown | 9 |

`unknown` below is not a low value and is not a promotion blocker by itself.

## Qualified works

### `work-8716f80d9b988bd0d055` — 恋は雨上がりのように

- Edition mapping: official Shogakukan volume-1 reader; representative standard ISBN `9784091867285`; reader title `恋は雨上がりのように 1`.
- Source: 小学館 ためし読み 恋は雨上がりのように 1, undated, <https://shogakukan.tameshiyo.me/9784091867285>, retrieved 2026-08-23.
- Authoritative refs: URL queries `?page=9`, `?page=11`, `?page=21`, reader counters 5/15, 6/15, 11/15; printed pages 5–8 and 16–17.
- Sample: 6 readable internal pages, 3 contexts: outdoor run/bus stop; family-restaurant service; rainy departure/following action.
- Local: `artRealism=3`, `artDensity=3`, `visualSoftness=3`, `motionImpact=1`.
- Basis: proportionate people and observed urban/restaurant backgrounds are realism-leaning but still stylized; backgrounds, screentone and panel information are above balanced; facial and hair lines are polished and soft. Printed pp.16–17 are an exact contiguous departure → umbrella retrieval → run/follow sequence; motion is legible but restrained, so 1 rather than a high-impact value.
- Files:
  - `3aed59ec57f714b1cff99d124b3733f0d08d89af6cb85bf52a9ccc2b125d504b` `output/playwright/pilot-art/chunk-04/koi-wa-ameagari/query-9.png`
  - `9cd5f9def6bf98796e6aa8c36f683081057d7dc8c013ad89214b68c8a2e5ed89` `output/playwright/pilot-art/chunk-04/koi-wa-ameagari/query-11.png`
  - `168b960700abc955fdb2763cd66cf11f356482f08b191c445546731be4eff470` `output/playwright/pilot-art/chunk-04/koi-wa-ameagari/query-21.png`

### `work-11296a590b885cb73b66` — 透明なゆりかご

- Edition mapping: official Kodansha/Comic DAYS first episode `第1話 命のかけら`, linked to representative standard volume 1 ISBN `9784063409574` by the frozen official volume-1 bibliography.
- Source: コミックDAYS 透明なゆりかご 第1話 命のかけら, 2018-03-09 page record, <https://comic-days.com/episode/13932016480030343945>, retrieved 2026-08-23.
- Authoritative refs: printed pp.6–7, 14–15, 24–25.
- Sample: 6 readable internal pages, 3 contexts: clinic job introduction; treatment-room specimen work; later specimen transfer/corridor sequence.
- Local: `artRealism=0`, `artDensity=1`, `visualSoftness=3`, `motionImpact=unknown`.
- Basis: people are intentionally highly simplified/deformed; pages use large white fields and sparse environment detail; rounded shapes and light lines are soft. No sampled exact bounded dynamic sequence supports `motionImpact`.
- Files:
  - `82b3bb6012d5b91e99ae85060e63418f97a59397f6f34068c768ebbe2b919b20` `output/playwright/pilot-art/chunk-04/toumei-yurikago/after-left.png`
  - `4798b6c46aaf9a33ef164a16b3a0b86f95ffb665e1ef5fcffad230c6829c9214` `output/playwright/pilot-art/chunk-04/toumei-yurikago/pages-14-15.png`
  - `415bec4ccfaeb9b6518da838f21f2cc4f86eaceb0f11ef937398255e64eb8de3` `output/playwright/pilot-art/chunk-04/toumei-yurikago/pages-24-25.png`

### `work-5e7eef6cc23d9738e034` — ゴールデンゴールド

- Edition mapping: official Kodansha/Comic DAYS opening episode `GOLDEN 001`, linked to representative standard volume 1 ISBN `9784063886153` by the frozen official volume-1 bibliography.
- Source: コミックDAYS ゴールデンゴールド GOLDEN 001, 2018-03-09 page record, <https://comic-days.com/episode/13932016480030208354>, retrieved 2026-08-23.
- Authoritative refs: printed pp.4–5, 12–13, 20–21.
- Sample: 6 readable internal pages, 3 contexts: color shore/nightmare opening; bookshop/town exchange; ferry arrival and island landscape.
- Local: `artRealism=4`, `artDensity=4`, `visualSoftness=1`, `motionImpact=unknown`.
- Basis: anatomy, town/vehicle/landscape perspective and textures are consistently reality-oriented; line, background and surface information are dense; hard hatching and unsettling precision dominate. Sampled pages show no exact bounded action sequence.
- Files:
  - `e98ac9abc6bc6456a6c7d80909876652ba58da4371aafbdac47e4e61517aa67c` `output/playwright/pilot-art/chunk-04/golden-gold/spread-01.png`
  - `8fdf1d20a0ed3cf499106288b6e1aa1ddd534105d4646953b70d17944b932a14` `output/playwright/pilot-art/chunk-04/golden-gold/spread-05.png`
  - `53b17d3b336a672ab3bbb38c0821efecfe925174e55b8adc41c199d7904067da` `output/playwright/pilot-art/chunk-04/golden-gold/spread-09.png`

### `work-0153a125c5a56225b06c` — 違国日記

- Edition mapping: official FEEL web first episode of the exact work, linked to the volume-1 entry range by the frozen Shodensha work/volume index; representative standard ISBN `9784396767174`.
- Source: FEEL web 違国日記 第1話, 2021-06-04, <https://feelweb.jp/episode/3269754496334652322>, retrieved 2026-08-23.
- Authoritative refs: exact reader spreads after navigation steps 5, 9 and 13 (two pages each; printed folios are not exposed in the render).
- Sample: 6 readable internal pages, 3 contexts: solo cooking/writing; doorway encounter; shared meal/conversation.
- Local: `artRealism=3`, `artDensity=2`, `visualSoftness=3`, `motionImpact=unknown`.
- Basis: people and domestic space are proportionate and observational while faces remain stylized; density is balanced with deliberate white space; flowing contour and restrained tone are soft. No exact bounded dynamic sequence was sampled.
- Files:
  - `f105b113f4106235ac77da77f2383e3830155f50d3038dec8531e32b25894468` `output/playwright/pilot-art/chunk-04/ikoku-nikki/spread-05.png`
  - `57a2c3444456371b8f46e48d50d653b6d8795b26b7a706fb972bf3a7fc17e383` `output/playwright/pilot-art/chunk-04/ikoku-nikki/spread-09.png`
  - `bf48923e8b8a1d5c751dcaa25fb39dce8589e4d2eea27c68dc79d1d6a413b767` `output/playwright/pilot-art/chunk-04/ikoku-nikki/spread-13.png`

### `work-34bba03e2a127ef29cd7` — 北北西に曇と往け

- Edition mapping: official BOOK WALKER trial title `北北西に曇と往け 1`, content UUID `293cf0ea-592c-4260-8b9f-9124527bbfc4`; exact volume-1 electronic edition of the same standard work. Representative paper ISBN `9784047348318`; official volume-1 release 2017-10-13.
- Source: BOOK WALKER 北北西に曇と往け 1 official trial, undated, <https://bookwalker.jp/de293cf0ea-592c-4260-8b9f-9124527bbfc4/?sample=1&from=1>, retrieved 2026-08-23.
- Authoritative refs: reader captures at counters corresponding to the visible printed pp.6–7, later camp/landscape spread, and printed pp.20–21. The SHA-addressed captures are the exact refs because the middle spread does not print folios.
- Sample: 6 readable story pages, 3 contexts: overturned vehicle/landscape; camp and character encounter; night weather/route planning.
- Local: `artRealism=3`, `artDensity=4`, `visualSoftness=3`, `motionImpact=unknown`.
- Basis: anatomy and machines/landscapes are realism-leaning but retain manga stylization; vehicles, clothing, weather and terrain are highly detailed; watercolor-like landscape treatment and flowing figure lines are soft. The overturned vehicle is an aftermath image, not a verified continuous start/end action sequence.
- Files:
  - `0f024ab27deff067bcfea0ca27d61ed920d26d7de440afc36a5eddb234d01995` `output/playwright/pilot-art/chunk-04/hokuhokusei/pages-10-11.png`
  - `f4c5cd67249f68ded664974a9cf8c4b931a4f2bc82f70914e2426346bf1e5871` `output/playwright/pilot-art/chunk-04/hokuhokusei/pages-18-19.png`
  - `65859ca72e1eed441a7cc95dbb7c3f4d24d5da899b79b997c518050d201bc571` `output/playwright/pilot-art/chunk-04/hokuhokusei/pages-26-27.png`

### `work-9d04c47e7efbbbd8aca6` — かげきしょうじょ!!

- Edition mapping: official Hakusensha e-net/CLIP STUDIO READER trial `jdcn=59221726kagesho00111`, callback product `p=46806`; exact `かげきしょうじょ！！ 1`, representative standard ISBN `9784592217268`, released 2015-11-05. It is not the Shueisha predecessor or `シーズンゼロ`.
- Source: 白泉社 e-net かげきしょうじょ！！ 1 official trial, undated, <https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221726kagesho00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D46806>, retrieved 2026-08-23.
- Authoritative refs: reader pp.14–15, 22–23, 28–29.
- Sample: 6 readable internal pages, 3 contexts: acting/class observation; home/family exchange; school corridor/classroom.
- Local: `artRealism=2`, `artDensity=2`, `visualSoftness=3`, `motionImpact=unknown`.
- Basis: general manga stylization with proportionate bodies; panels and backgrounds are balanced rather than sparse or heavily rendered; round facial construction and polished line are soft. No sampled exact bounded dynamic sequence supports `motionImpact`.
- Files:
  - `12c2e95a1ef2af49a7215e704a4768768f102c63f01a018b2477b3a9a295ff40` `output/playwright/pilot-art/chunk-04/kageki-shoujo/pages-14-15.png`
  - `9fa2b7ae9ac11855bda266366938663b8212367a1c7287565a7fb04decfedb79` `output/playwright/pilot-art/chunk-04/kageki-shoujo/pages-22-23.png`
  - `75fe978bec357a3f7a7577385e1ebc6b2dea985a57f1dc5520647ec0da00750b` `output/playwright/pilot-art/chunk-04/kageki-shoujo/pages-28-29.png`

### `work-222504590507d3ab8093` — 王様ランキング

- Edition mapping: official KADOKAWA/Kadocomi first episode of the exact page-based work, same creator/work as representative standard volume 1 ISBN `9784047355170`; entry range only.
- Source: カドコミ 王様ランキング 第1話, 2019-01-12, <https://comic-walker.com/detail/KC_002373_S/episodes/KC_0023730000100011_E>, retrieved 2026-08-23.
- Authoritative refs: initial story spread, one ArrowLeft spread, and five-ArrowLeft spread in the official reader; exact hashes below. The reader does not expose printed folios.
- Sample: 6 readable internal pages, 3 contexts: kingdom/ranking setup; public ridicule and street movement; Bojji–Kage encounter.
- Local: `artRealism=0`, `artDensity=1`, `visualSoftness=3`, `motionImpact=unknown`.
- Basis: character forms are strongly simplified and deformed; environments use sparse line and broad white fields; rounded shapes are soft. The sampled movement is not an exact bounded dynamic sequence suitable for the conditional axis.
- Files:
  - `ff66b848199bb6ef25aca25d9b0e758c21a27f7b63eb77ab17f26281185860b6` `output/playwright/pilot-art/chunk-04/osama-ranking/start.png`
  - `552df7fd5634110a8e2ae59b98dc228c2d67051fd6f1e73bfc6ddcc04270239c` `output/playwright/pilot-art/chunk-04/osama-ranking/after-left.png`
  - `e3cdd49a622723c3130d96b64d4d65f812aee2b8ca9190c497a05ab32bc067f2` `output/playwright/pilot-art/chunk-04/osama-ranking/spread-05.png`

### `work-07ff2a01ef593ce2f809` — さよならミニスカート

- Edition mapping: official Shueisha/Ribon 63-page first-chapter trial linked from the exact work page; representative standard volume 1 ISBN `9784088675206`, released 2018-11-22.
- Source: 集英社 りぼん さよならミニスカート 第1話 trial, undated, <https://ribon.shueisha.co.jp/sayonara_miniskirt_trial/>, retrieved 2026-08-23.
- Authoritative refs: official same-origin page resources `img/sp/page_004.png`, `005`, `020`, `021`, `040`, `041`. Direct resource renders were used because the scrolling landing page applies a pale transition layer during virtualized capture; all six resources are referenced by that official trial page.
- Sample: 6 readable internal pages, 3 contexts: judo/class transition; school/idol broadcast; rooftop conversation.
- Local: `artRealism=2`, `artDensity=3`, `visualSoftness=3`, `motionImpact=unknown`.
- Basis: conventional shojo stylization sits on proportionate figures and observed school/judo environments; screentone, expressive closeups and backgrounds are above balanced density; fine hair/eye lines are soft and polished. Pages 4–5 contain training/action fragments but not an exact continuous start/end sequence, so `motionImpact` remains unknown.
- Files:
  - `254bc7081c0b0d9231cb7224773a9621e599cb58022ba64f18f4c0b3e990bb98` `output/playwright/pilot-art/chunk-04/sayonara-miniskirt/direct-page-004.png`
  - `cec178df21021d4937ebb3d2aa1ab56857d46c8c4c36f50a11d233caf4acc3b8` `output/playwright/pilot-art/chunk-04/sayonara-miniskirt/direct-page-005.png`
  - `bdcfe1aa2cb51cabbb71386b2d45e8df03b068e8e68e91e496c68c20b8e8269e` `output/playwright/pilot-art/chunk-04/sayonara-miniskirt/direct-page-020.png`
  - `2a01f1a355339a01017e27ba48e044097cc96d414bb5f501d1616d1f41670742` `output/playwright/pilot-art/chunk-04/sayonara-miniskirt/direct-page-021.png`
  - `d8d85c45dd55c4b727fdde6a4f78745e8448f9653820a8c3b16893b109e56e22` `output/playwright/pilot-art/chunk-04/sayonara-miniskirt/direct-page-040.png`
  - `fac0c9caa8eafa9d49e37640d11def7dbdad84ee0f02032dab4a50d3592a1608` `output/playwright/pilot-art/chunk-04/sayonara-miniskirt/direct-page-041.png`

### `work-d489f5a2229689aa5115` — 女の園の星

- Edition mapping: official FEEL web first episode of the exact work, linked to representative standard volume 1 ISBN `9784396767976` by the frozen Shodensha work/index evidence.
- Source: FEEL web 女の園の星 第1話, 2021-07-09, <https://feelweb.jp/episode/3269754496367124308>, retrieved 2026-08-23.
- Authoritative refs: printed pp.12–13, 20–21, 28–29.
- Sample: 6 readable internal pages, 3 contexts: teacher desk/preparation; staff-room conversation; classroom response.
- Local: `artRealism=4`, `artDensity=3`, `visualSoftness=1`, `motionImpact=unknown`.
- Basis: anatomy, faces, furnishings and perspective are observational and reality-oriented; offices/classrooms carry substantial object and line information; crisp contours and dry, angular facial rendering are not soft. No exact bounded dynamic sequence was sampled.
- Files:
  - `959cafb710022a5e46eaf3c765a40e8fa0714a3d798a785ec29d3e616fe710a3` `output/playwright/pilot-art/chunk-04/onna-no-sono-no-hoshi/spread-05.png`
  - `e85837b1788ddf2f3726258eb37043f65bfef63ff7996a8d8e4f1a8619a31ed1` `output/playwright/pilot-art/chunk-04/onna-no-sono-no-hoshi/spread-09.png`
  - `6d5bdaf4ec3c9fd8722f106e08dc69ebcde5f51f2c09a0bf1e19e17fecf08d56` `output/playwright/pilot-art/chunk-04/onna-no-sono-no-hoshi/spread-13.png`

### `work-cdf549d4b1888153e146` — ダンダダン

- Edition mapping: official Shonen Jump+ episode 1 of the exact page-based work, volume-1 entry range; representative standard ISBN `9784088825991`.
- Source: 少年ジャンプ＋ ダンダダン 第1話 それって恋のはじまりじゃんよ, 2021-04-06, <https://shonenjumpplus.com/episode/3269632237310729754>, retrieved 2026-08-23.
- Authoritative refs: exact official reader navigation spreads 5, 9 and 13 after the opening promotional pages; two pages per capture. Printed folios are not exposed.
- Sample: 6 readable internal pages, 3 contexts: classroom isolation; hallway occult argument; home/telephone exchange.
- Local: `artRealism=2`, `artDensity=3`, `visualSoftness=1`, `motionImpact=unknown`.
- Basis: characters retain conventional stylization while spaces and props are observed; heavy blacks, backgrounds, hatching and expressive panels are above balanced density; strong angular contour and contrast are hard rather than soft. The sampled shove/gesture panels do not establish an exact bounded continuous action sequence adequate for `motionImpact`.
- Files:
  - `c51af3e28d751cc3f77f12ab32eb213e3fa0a0f8d954aa4e9e6053fe39efac5e` `output/playwright/pilot-art/chunk-04/dandadan/spread-05.png`
  - `2037d16eba3f8f41559c6891793418c852668a1808113b4f5f3c47bcc649dfb0` `output/playwright/pilot-art/chunk-04/dandadan/spread-09.png`
  - `7b7fe1c78ab12e2054404db0bde2d610429c36a8316097af535c46a7416b5264` `output/playwright/pilot-art/chunk-04/dandadan/spread-13.png`

## Review boundary

- No cover, animation frame, synopsis, award ranking, or user art opinion was used for an Art value.
- The ten static-axis proposals all meet the 6-page/2-context threshold.
- Only 恋は雨上がりのように has a Local `motionImpact` proposal because only its sampled packet contains a sufficiently bounded continuous movement sequence with exact printed start/end refs.
- Gemini must inspect exactly the authoritative files/hashes above. Any disagreement goes to dictionary/evidence adjudication; do not average or majority-vote.
- The unused exploratory PNGs in the ignored directory are not evidence inputs and must not be committed.
