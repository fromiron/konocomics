# Pilot 001 Art qualification — non-e-comi assistance

- Scope: Pilot chunks 03 and 05 non-e-comi previews; chunk 04 only if capacity remained
- Inspection interval: 2026-08-22–2026-08-23 (Asia/Tokyo)
- Method: installed Playwright CLI, official reader/product identity, direct pixel inspection
- Repository files edited: none
- Temporary artifacts: `output/playwright/pilot-art/other/**` only
- Decision boundary: evidence assistance and Local Codex judgment only; Gemini quorum and Pass C remain required

## Outcome

| Result | Works |
|---|---:|
| Qualified: exact entry edition + at least 6 readable internal pages + at least 2 contexts | 7 |
| Closed Art unknown in this pass | 2 |
| Chunk 05 exact carry-forward list | 7 |
| Chunk 04 not attempted (capacity boundary) | 10 |

The qualifying screenshots below are the authoritative sample. Earlier exploratory PNGs in the same temporary directories are not evidence inputs.

## Qualified works and Local judgments

### `work-ebe399258f28460b8f9b` — 鈴木先生

- Edition mapping: representative standard volume 1 ISBN `9784575940237`; official Futabasha content ID `97845759402370000000`, reader title `鈴木先生 1`.
- Official URL: <https://reader.futabasha.co.jp/97845759402370000000>
- Reader proof: `window.__sreaderFunc__.lastPage = 24`; exact page refs 2–3, 10–11, 20–21.
- Sample: 6 readable internal pages, 3 contexts (restaurant dialogue, school/staffroom, classroom movement).
- Local: `artRealism=3`, `artDensity=3`, `visualSoftness=1`, `motionImpact=2`.
- Motion basis: exact contiguous pages 20–21 show the same classroom action developing across panels with movement lines/SFX; moderate rather than extreme impact. This value still requires Gemini agreement/adjudication.
- Files:
  - `134374a884ff22c02f4fc7782b5f60e8972b642b1df4afab7d444315278bcf75` `output/playwright/pilot-art/other/suzuki-sensei/pages-2-3.png`
  - `8d121ec9edd3a741961d13d0f3208be9d89c56329f4f03b0d8708fc7f70f4e9f` `output/playwright/pilot-art/other/suzuki-sensei/pages-10-11.png`
  - `c34f64b4d847ada98d4a6e8e0b55cc1b9cebc5886fa391e9758249dd88bb7f88` `output/playwright/pilot-art/other/suzuki-sensei/pages-20-21.png`

### `work-f391e591282e435a3c1d` — アイアムアヒーロー

- Edition mapping: representative standard volume 1 ISBN `9784091825803`; ISBN is the official reader path and title is volume 1.
- Official URL: <https://shogakukan.tameshiyo.me/9784091825803>
- Reader proof: 13-spread counter. Exact refs `?page=3` (2/13), `?page=11` (6/13), `?page=21` (11/13); each renders two readable internal pages.
- Sample: 6 pages, 3 contexts (door/lock close-ups, doorway body sequence, indoor dialogue/workspace).
- Local: `artRealism=4`, `artDensity=4`, `visualSoftness=0`, `motionImpact=unknown`.
- Motion limitation: sampled motion is not an exact, bounded action sequence adequate for the conditional axis.
- Files:
  - `e121ed5e641e0302ccc99de7017394560aef74556990f7d3f0844c699b5a79ed` `output/playwright/pilot-art/other/i-am-a-hero/final-query-3-counter-2.png`
  - `08ccc4ede93af1ccf03416fe8d1aad6d98334cf65b88cc98362d725ea60e23b8` `output/playwright/pilot-art/other/i-am-a-hero/final-query-11-counter-6.png`
  - `969b71d4f7d497dd6a5159176a45587f37c95138ddbf37fe0356c0c7a828944a` `output/playwright/pilot-art/other/i-am-a-hero/final-query-21-counter-11.png`

### `work-ef7106f6a387c9860877` — その女、ジルバ

- Edition mapping: representative standard volume 1 ISBN `9784091850249`; official ISBN URL redirects to JDcn `091850240000d0000000` and retains reader title `その女、ジルバ 1`.
- Official URL: <https://shogakukan.tameshiyo.me/9784091850249>
- Reader proof: 13-spread counter. Exact refs `?page=7` (4/13), `?page=9` (5/13), `?page=11` (6/13); two readable internal pages each.
- Sample: 6 pages, 3 contexts (commute/elder encounter, shopping/lunch/job situation, doorway/dialogue).
- Local: `artRealism=2`, `artDensity=2`, `visualSoftness=3`, `motionImpact=unknown`.
- Motion limitation: no exact bounded dynamic sequence was sampled.
- Files:
  - `106fbd0cd6d5cd4cf9c9bd15739ed472066baec31522fead14f707d2df6ae0f6` `output/playwright/pilot-art/other/sono-onna-jilba/final-query-7-counter-4.png`
  - `b51d785e9d3df32606594ad4b742cf0464c825abb493c9a8df252045dc8cfc60` `output/playwright/pilot-art/other/sono-onna-jilba/final-query-9-counter-5.png`
  - `1663af257693853c86d8a75b59179a50ddcc97b4b8005632412b66b9f404f9fc` `output/playwright/pilot-art/other/sono-onna-jilba/final-query-11-counter-6.png`

### `work-07b11ec79f10c7eb7e05` — かくかくしかじか

- Edition mapping: representative standard volume 1 ISBN `9784087824575`; official Shueisha reader `ContentID` is the same ISBN and title is `かくかくしかじか 1`.
- Official URL: <https://www.shueisha.co.jp/books/reader/main.php?cid=9784087824575>
- Reader proof: each visible manga page is assembled from three blob strips; six visible strips equal two complete pages. Sequential reader steps establish refs 10–11, 14–15, 20–21.
- Sample: 6 readable internal pages, 3 contexts (art-room introduction, critique/teacher exchange, drawing instruction).
- Local: `artRealism=2`, `artDensity=2`, `visualSoftness=3`, `motionImpact=unknown`.
- Motion limitation: no exact bounded dynamic sequence was sampled.
- Files:
  - `c0a1439949d12011e795a49afce17ef0e46efbeb4d82d8d4e9604b7c7f805c42` `output/playwright/pilot-art/other/kakukaku-shikajika/pages-10-11.png`
  - `8d42178df035ba05a51f212144cd2df1c5451449d45fd51afc7bbbdcc5c477e6` `output/playwright/pilot-art/other/kakukaku-shikajika/pages-14-15.png`
  - `f45ec29b53fdd4396c1b26e8e21fbb24cc80a374d818a77925b78530cb7a19ba` `output/playwright/pilot-art/other/kakukaku-shikajika/pages-20-21.png`

### `work-e049c9aaf92ba31da8b0` — これ描いて死ね

- Edition mapping: representative standard volume 1 ISBN `9784098511433`; official reader URL and title identify volume 1.
- Official URL: <https://sc-portal.tameshiyo.me/9784098511433>
- Reader proof: 26-spread counter. Exact refs `?page=9` (5/26), `?page=11` (6/26), `?page=21` (11/26); two readable internal pages each.
- Sample: 6 pages, 3 contexts (reading gag, town/bookshop, drawing/classroom imagination).
- Local: `artRealism=1`, `artDensity=2`, `visualSoftness=3`, `motionImpact=unknown`.
- Motion limitation: the exaggerated gag panel is not a verified continuous start/end action sequence.
- Files:
  - `e1ad5385bfbf5d6fdae7f24418d5f07fc3cf92afa603a713c2b6f487dc187a40` `output/playwright/pilot-art/other/kore-kaite-shine/final-query-9-counter-5.png`
  - `0cd73bf569e6b36ef81e4c871b69414ccaef53b73526a27aa98803d7f762bf58` `output/playwright/pilot-art/other/kore-kaite-shine/final-query-11-counter-6.png`
  - `20116563f5ed67653d336d5232cef9022b5ef4881ce0bd686cf7d89f8ea60d38` `output/playwright/pilot-art/other/kore-kaite-shine/final-query-21-counter-11.png`

### `work-112589a161d1596ec97f` — 写らナイんです

- Edition mapping: representative standard volume 1 ISBN `9784098535439`; official reader URL and title identify volume 1.
- Official URL: <https://sc-portal.tameshiyo.me/9784098535439>
- Reader proof: 28-spread counter. Exact refs `?page=15` (8/28), `?page=17` (9/28), `?page=21` (11/28); two readable internal story pages each.
- Sample: 6 pages, 3 contexts (club recruitment, classroom relations, occult/classroom exchange).
- Local: `artRealism=2`, `artDensity=2`, `visualSoftness=2`, `motionImpact=unknown`.
- Motion limitation: no exact bounded dynamic sequence was sampled.
- Files:
  - `84317c622db6b65f04beb329a931f4c337a280eddcb43ef904f82ba86aad7095` `output/playwright/pilot-art/other/utsuranai-n-desu/final-query-15-counter-8.png`
  - `957038cde76c747943e36e99cf94a5dd47a40118d012d74fe9eda14855edde93` `output/playwright/pilot-art/other/utsuranai-n-desu/final-query-17-counter-9.png`
  - `096314cbbcbf4f4766738b2eeb506bfe132427aed17891140d6fe035dabce0f1` `output/playwright/pilot-art/other/utsuranai-n-desu/final-query-21-counter-11.png`

### `work-37ecced0b2392d7af9b2` — 路傍のフジイ

- Edition mapping: representative standard volume 1 ISBN `9784098625420`; official reader URL and title identify volume 1.
- Official URL: <https://sc-portal.tameshiyo.me/9784098625420>
- Reader proof: 24-spread counter. Exact refs `?page=9` (5/24), `?page=11` (6/24), `?page=21` (11/24); two readable internal pages each.
- Sample: 6 pages, 3 contexts (wedding/reception, commute/city, apartment/solitude).
- Local: `artRealism=4`, `artDensity=3`, `visualSoftness=1`, `motionImpact=unknown`.
- Motion limitation: no exact bounded dynamic sequence was sampled.
- Files:
  - `aec857e40fa43b25a05b05fec17988e9fbfe8d2890d272424b8ff8fdb2d4130f` `output/playwright/pilot-art/other/robo-no-fujii/final-query-9-counter-5.png`
  - `be4a169bb077645e6ff6ddd00a3c15b274abb734e1b6221513b8044af7f78944` `output/playwright/pilot-art/other/robo-no-fujii/final-query-11-counter-6.png`
  - `b6ba93b07a14f6ec4dec512abd8f32aae8e6daed7dda98275f5b054ee333d493` `output/playwright/pilot-art/other/robo-no-fujii/final-query-21-counter-11.png`

## Closed Art unknown

### `work-f5f0ee0b0ff16bc146e0` — ばらかもん

- Representative ISBN: `9784757526167`; official first-episode URL: <https://www.ganganonline.com/title/868/chapter/33142>.
- Access: HTTP 200; official title/creator match.
- Failure: the virtualized reader exposed six page nodes (`page_7`–`page_12`), but pixel capture yielded only two unique readable internal pages; the remaining artifacts were white/black placeholders or duplicated the same rendered page. Unique readable sample = 2, below 6; context count cannot satisfy 2 reliably.
- Result: all four Art axes `unknown`. Do not treat the DOM node count as page evidence.
- Recheck path: capture pages immediately as each virtualized page becomes current, then require six distinct hashes and two contexts.

### `work-3823ff0766f67c015c53` — ましろのおと

- Representative ISBN: `9784063712612`.
- Failure: frozen research contains official product/news/award material but no official internal-page preview URL. Sample = 0.
- Result: all four Art axes `unknown`.
- Recheck path: only reopen if Kodansha supplies an official volume-1/entry episode preview; cover/news images do not qualify.

## Chunk 05 carry-forward (not adjudicated here)

These were reachable in the HTTP access pass but not pixel-qualified before the capacity boundary. They are not failures and must remain pending for the next Art evidence pass, not silently treated as known.

- `work-07dc759bd91e1cffb2df` しあわせは食べて寝て待て — <https://souffle.life/manga/shiawase-ha-tabete-nete-mate/20200318-2/>
- `work-3588928ab8f6a2520923` 海が走るエンドロール — <https://souffle.life/topics/souffle-special/20210816-3/>
- `work-b2c37bdb52e2a78dfd41` 天幕のジャードゥーガル — <https://souffle.life/manga/tenmaku-no-ja-dougal/20210925/>
- `work-081e75d8bbc53ac64713` ダイヤモンドの功罪 — <https://tonarinoyj.jp/episode/4855956445056488441/embed>
- `work-7730845c9cf7ba0cccc8` 君と宇宙を歩くために — <https://comic-days.com/episode/4856001361225662498>
- `work-268e1fa3599955359969` ふつうの軽音部 — <https://shonenjumpplus.com/episode/16457717013869519536>
- `work-192cbecc59e9c028142b` 本なら売るほど — <https://comic-walker.com/detail/KC_006231_S/episodes/KC_0062310000200012_E>

## Chunk 04 capacity skip

No chunk 04 work was judged. Exact non-ecomi carry-forward list:

- `work-8716f80d9b988bd0d055` 恋は雨上がりのように — <https://shogakukan.tameshiyo.me/9784091867285>
- `work-11296a590b885cb73b66` 透明なゆりかご — <https://comic-days.com/episode/13932016480030343945>
- `work-5e7eef6cc23d9738e034` ゴールデンゴールド — <https://comic-days.com/episode/13932016480030208354>
- `work-0153a125c5a56225b06c` 違国日記 — <https://feelweb.jp/episode/3269754496334652322>
- `work-34bba03e2a127ef29cd7` 北北西に曇と往け — <https://bookwalker.jp/de293cf0ea-592c-4260-8b9f-9124527bbfc4/?sample=1&from=1>
- `work-9d04c47e7efbbbd8aca6` かげきしょうじょ!! — <https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221726kagesho00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D46806>
- `work-222504590507d3ab8093` 王様ランキング — <https://comic-walker.com/detail/KC_002373_S/episodes/KC_0023730000100011_E>
- `work-07ff2a01ef593ce2f809` さよならミニスカート — <https://mangahack.com/comics/5207>
- `work-d489f5a2229689aa5115` 女の園の星 — <https://feelweb.jp/episode/3269754496367124308>
- `work-cdf549d4b1888153e146` ダンダダン — <https://shonenjumpplus.com/episode/3269632237310729754>

## Adjudication notes

- No cover, animation image, synopsis, or user art opinion was used for the values above.
- `unknown` is not a low value and is not itself a blocker.
- No `motionImpact` value except the bounded 鈴木先生 pages 20–21 suggestion was made.
- The Local values are not final: Gemini 3.7 Flash High must inspect the same authoritative PNG hashes. Differences must be resolved against the dictionary and exact page scope, not averaged or voted.
- Temporary PNGs are intentionally uncommitted; only URL, edition, refs, context count, and SHA-256 belong in persistent evidence.
