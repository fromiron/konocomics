# Pilot 001 Art Pass C — Local–Gemini conflict adjudication

- Adjudicator: independent Local Codex subagent
- Date: 2026-08-23 (Asia/Tokyo)
- Repository edits: none
- Pixel access: every evidence PNG listed below was opened with `view_image(detail=original)`; montages and synopsis/cover/animation/user opinion were not used.
- Contract: `entry_1_3_volumes`; static axes require the already-qualified six readable pages and at least two contexts. `motionImpact` requires an exact contiguous start-to-end action sequence. Values were independently re-anchored to the Factor Dictionary's 0/2/4 descriptions; no averaging or majority vote was used.
- Scope: only Local–Gemini disagreements supplied for adjudication. Agreement axes were not reconsidered.

## Evidence sets

Base paths:

- `E/` = `output/playwright/pilot-art/ecomi/`
- `O/` = `output/playwright/pilot-art/other/`

| Ref | Work | Exact authoritative PNGs opened |
|---|---|---|
| MT | モンキーターン | `E/work-1cf7a0bb5f55e0d69b27-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| SA | 坂道のアポロン | `E/work-205e576ef057e3aed1ab-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| CO | 名探偵コナン | `E/work-39555fe7402dada0d79f-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| TE | 天は赤い河のほとり | `E/work-4a8a22fc766bf9bc4c59-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| GS | 銀の匙 Silver Spoon | `E/work-61f2b70ee9f8217b3604-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| CE | 妖しのセレス | `E/work-76c038b398f4b28b7748-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| PO | ポーの一族 | `E/work-9d5d64262dbc2893acd4-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| UM | 海街diary | `E/work-a7a1e0666169f1b2e8c0-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| KA | 風光る | `E/work-c4abbc1b44fa5706bce3-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| GF | ギャラリーフェイク | `E/work-303d0a9d67a606a817af-pages-6-7.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| MS | 深夜食堂 | `E/work-d7e64b0b5479ca943edd-pages-8-9.png`, `...-pages-14-15.png`, `...-pages-22-23.png` |
| SZ | 鈴木先生 | `O/suzuki-sensei/pages-2-3.png`, `.../pages-10-11.png`, `.../pages-20-21.png` |
| IH | アイアムアヒーロー | `O/i-am-a-hero/final-query-3-counter-2.png`, `.../final-query-11-counter-6.png`, `.../final-query-21-counter-11.png` |
| JI | その女、ジルバ | `O/sono-onna-jilba/final-query-7-counter-4.png`, `.../final-query-9-counter-5.png`, `.../final-query-11-counter-6.png` |
| KK | かくかくしかじか | `O/kakukaku-shikajika/pages-10-11.png`, `.../pages-14-15.png`, `.../pages-20-21.png` |
| UN | 写らナイんです | `O/utsuranai-n-desu/final-query-15-counter-8.png`, `.../final-query-17-counter-9.png`, `.../final-query-21-counter-11.png` |
| RF | 路傍のフジイ | `O/robo-no-fujii/final-query-9-counter-5.png`, `.../final-query-11-counter-6.png`, `.../final-query-21-counter-11.png` |
| KS | これ描いて死ね | `O/kore-kaite-shine/final-query-9-counter-5.png`, `.../final-query-11-counter-6.png`, `.../final-query-21-counter-11.png` |

The `...` above replaces only the unchanged directory and work filename prefix shown in the first path of the same cell; page/counter suffixes are exact.

## Final conflict decisions

| Work / axis | Local | Gemini | Final | Pixel-grounded reason and rejected proposal(s) |
|---|---:|---:|---:|---|
| モンキーターン / `artRealism` | 3 | 2 | **known 3** | MT 6–7/14–15/22–23 repeatedly show stable human anatomy plus mechanically credible boat, baseball equipment, motorcycle and car. Faces remain stylized, so 4 is not reached. Gemini 2 is rejected because the sustained anatomy/object realism is above the general-style anchor. |
| モンキーターン / `artDensity` | 3 | 2 | **known 3** | MT includes multi-panel sports choreography, equipment/city/vehicle backgrounds and dense motion/texture information in two contexts, while the opening splash prevents 4. Gemini 2 understates the repeated background and panel information. |
| モンキーターン / `visualSoftness` | 1 | 2 | **known 1** | MT has hard black masses, sharp facial construction, angular sports poses and emphatic straight speed lines across all contexts. It is cleaner than the rough 0 anchor, hence 1. Gemini 2 is rejected as too neutral for the repeated hard/angular treatment. |
| 坂道のアポロン / `artRealism` | 3 | 2 | **known 2** | SA 6–7/14–15/22–23 use credible school settings and proportions but consistently slender, simplified figures and stylized faces. Local 3 overweights the background perspective; the repeated character rendering sits at the general-style 2 anchor. |
| 坂道のアポロン / `visualSoftness` | 2 | 4 | **known 3** | SA uses thin, clean contours, restrained screen tone and softly shaped faces/hair, but also hard uniform blacks and angular male silhouettes. Independent anchoring places it between neutral 2 and soft/beautiful 4. Local 2 ignores the sustained delicate line; Gemini 4 overstates softness across all contexts. |
| 名探偵コナン / `artDensity` | 3 | 2 | **known 3** | CO 6–7/14–15/22–23 repeatedly show many panels, architecture, street/vehicle detail, screen tone and action-line information. White areas keep it below 4. Gemini 2 is rejected because the density is sustained rather than merely balanced. |
| 名探偵コナン / `visualSoftness` | 1 | 2 | **known 1** | CO repeatedly uses angular faces, spiky hair, hard blacks and jagged impact/speed marks; clean execution keeps it above 0. Gemini 2 is too neutral for those repeated hard forms. |
| 名探偵コナン / `motionImpact` | 4 | unknown | **known 4** | CO viewer pages 22–23 (printed right p17 → left p18) are an exact contiguous sequence: the roller-coaster car enters at speed and the right page shows the fatal impact with a large black burst; the left page is the immediate post-incident stop, reactions and scene examination. Large diagonal car framing, dense speed lines, black impact spray and oversized SFX reach the 4 anchor. Gemini unknown is rejected because the pair itself supplies both bounded action and immediate endpoint. |
| 天は赤い河のほとり / `visualSoftness` | 3 | 4 | **known 4** | TE 6–7/14–15/22–23 consistently use flowing hair, large delicate eyes, floral/soft-tone surrounds, thin contours and graceful figure treatment. Local 3 is rejected because softness is not occasional; it is the dominant treatment in every sampled context. |
| 銀の匙 Silver Spoon / `motionImpact` | 3 | 2 | **known 2** | GS pages 14–15 are a contiguous horse approach/leap to close encounter and character reaction. The large horse panel and SFX establish motion, but limited speed-line/impact emphasis fits ordinary impact 2, not the between-2-and-4 intensity proposed by Local. |
| 妖しのセレス / `motionImpact` | 3 | unknown | **unknown** | CE pages 14–15 show Aya going over the pedestrian-bridge railing and falling with downward speed lines, followed by psychological memory shards over her face. The pair does not show a physical impact, landing, rescue, or other action endpoint; the rescue occurs outside the supplied contiguous pair. The earlier Local reading mistook memory-shard imagery for a physical shattering endpoint, so the current-SHA Gemini recheck is adopted and the exact-sequence gate remains unmet. |
| ポーの一族 / `artDensity` | 2 | 1 | **known 1** | PO 6–7 and 22–23 are dominated by open white fields, isolated figures and sparse backgrounds; 14–15 adds rain/action texture but does not make density consistently balanced. Local 2 overweights that one denser context. |
| 海街diary / `artRealism` | 3 | 2 | **known 3** | UM 6–7/14–15/22–23 sustain natural body proportions, observational faces and spatially credible alley, dining room and station/train settings. Some comedic facial deformation keeps it below 4. Gemini 2 understates the repeated anatomical/environmental realism. |
| 風光る / `motionImpact` | 3 | 2 | **known 3** | KA pages 14–15 are one contiguous sparring exchange: weapon engagement/thrust, object/weapon displacement, hit/evasion and the receiving character's reaction. Diagonal panels, multiple speed fields and emphatic SFX place it above ordinary 2. Gemini 2 is rejected as too low; the sequence is not sustained enough for 4. |
| ギャラリーフェイク / `visualSoftness` | 1 | 2 | **known 1** | GF 6–7/14–15/22–23 repeatedly show square jaws, sharp noses, hard suit silhouettes and strong straight contours. Clean rendering prevents 0, but Gemini 2 is too neutral for the sustained angular character construction. |
| 深夜食堂 / `artDensity` | 1 | 0 | **known 1** | MS 8–9/14–15/22–23 use simple figures and open backgrounds, yet maintain multi-panel restaurant staging, food/room props and functional environmental detail. Gemini 0 is too absolute for that recurring information; the sample remains below balanced 2. |
| 深夜食堂 / `visualSoftness` | 1 | 2 | **known 2** | MS uses thin, rounded, lightly washed/watercolor-like lines and little harsh angular impact across all three contexts. The result is neutral rather than especially soft/beautiful. Local 1 overstates roughness; Gemini 2 matches the anchor. |
| 鈴木先生 / `motionImpact` | 2 | unknown | **unknown** | SZ pages 20–21 show classroom commotion and multiple people moving, but no single action has a verifiable start, continuous development and endpoint across the pair. Local 2 is rejected because motion presence alone does not satisfy the exact-sequence contract; Gemini unknown is retained. |
| アイアムアヒーロー / `visualSoftness` | 0 | 1 | **known 0** | IH's lock/door close-ups, contorted figure sequence and workspace dialogue consistently use hard edges, dense cross-hatching, gritty texture and severe contrast. Gemini 1 understates how fully the sample reaches the rough/hard 0 anchor. |
| その女、ジルバ / `artDensity` | 2 | 1 | **known 2** | JI spreads repeatedly divide into many panels and retain benches, station/town/store/work interiors and crowd/prop information. Light linework and white fields prevent high density, but Gemini 1 understates the balanced recurring environmental information. |
| かくかくしかじか / `artRealism` | 2 | 1 | **known 1** | KK consistently uses simplified round faces, compact/chibi figures and comedic deformation, alongside occasional realistic teacher/life-drawing inserts. This lies between strong simplification 0 and general styling 2. Local 2 overweights the inserted drawings and teacher rendering. |
| 写らナイんです / `artRealism` | 2 | 1 | **known 1** | UN repeatedly shows oversized eyes, highly simplified faces/bodies and explicit chibi/gag deformation. Normal body proportions in some panels keep it above 0. Local 2 understates the recurrent deformation. |
| 写らナイんです / `artDensity` | 2 | 1 | **known 1** | UN has several panels and screen tones, but backgrounds are repeatedly blank/minimal and characters carry most information. Local 2 overstates environmental/line density; the result sits between sparse 0 and balanced 2. |
| 路傍のフジイ / `artDensity` | 3 | 4 | **known 4** | RF 9/11/21-counter samples sustain detailed wedding crowds/interior, commuters, rail/city infrastructure, signage/screens and apartment/vending-machine environments. Local 3 is rejected because high background/information density recurs across all three contexts and reaches the 4 anchor. |
| これ描いて死ね / `artRealism` | 1 | 2 | **known 1** | KS repeatedly combines proportionate bodies and credible island/school/bookshop environments with oversized eyes, simplified rounded faces, a mascot, chibi reactions and large gag deformation. The character treatment is more deformed than the ordinary-style 2 anchor but not uniformly at the strong-deformation 0 anchor. Gemini 2 overweights the environments, so the intermediate 1 is retained. |

## Motion contract summary

- Final known from conflicts: 名探偵コナン `4`, 銀の匙 `2`, 風光る `3`.
- Final unknown from conflicts: 妖しのセレス, 鈴木先生.
- Known decisions cite the exact contiguous pair and its observable start/development/end. No sequence was inferred from title, genre, synopsis or noncontiguous pages.
