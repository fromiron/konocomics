# Batch 005 chunk 03 independent Gemini Art review report

## 1. Attestation and capability proof

- **Reviewer / Exact model**: `gemini-3.7-flash-high` (Gemini 3.7 Flash High)
- **Effort**: `high`
- **Execution mode**: Read-only `plan` mode
- **Completion status**: Normal, complete execution without truncation, timeout, rate-limiting, degradation, abnormal termination, or fallback substitution.
- **Direct pixel inspection**: All 36 supplied image captures across positions 21–30 were opened and directly inspected at original pixels (`openedAtOriginalPixels=yes`).
- **Input and hash validation**: Every declared SHA-256 in `PAYLOAD.sha256`, `gemini-payload-ledger.md`, `gemini-root-identity.json`, and all 10 frozen inputs was independently recomputed and verified against the canonical uncompressed root `/tmp/konocomics-batch005-gemini-art03.16ZXVH`. Zero mismatches were found.
- **Human review declaration**: `reviewedByHuman=false`
- **Peer panel status**: Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN` (non-Art review; abstained from Art without direct pixel inspection).
- **Isolation and independence**: Strictly zero access or inspection of Local reviewer conclusions, cover illustrations, synopsis texts, animated adaptations, user opinions, Genre classifications, text Factor drafts, Gold data, or prior model memory.

---

## 2. Frozen input verification and 36-image pixel inspection ledger

### 2.1 Frozen inputs SHA-256 verification

| File | Expected SHA-256 | Recomputed SHA-256 | Verification |
| --- | --- | --- | :---: |
| `inputs/docs__factors__factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | MATCH |
| `inputs/docs__factors__annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__annotation-review-adjudication-request.md` | `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__art-preflight__chunk-03__preflight.csv` | `8379215c7c1ddcde7c4d3bfe2848b974a2200f5a95b5c7758e6778b9436f38f0` | `8379215c7c1ddcde7c4d3bfe2848b974a2200f5a95b5c7758e6778b9436f38f0` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__art-preflight__chunk-03__ledger.md` | `ecda6c82f9b90e95354c7ed28c8234ecd774bf80ddacafef8c1ea45ddc60413c` | `ecda6c82f9b90e95354c7ed28c8234ecd774bf80ddacafef8c1ea45ddc60413c` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__reviews__daybreak-art-preflight-qa-chunk-03-round-3.md` | `70c26ee3952595ca74e2041ecc85349e3e63c6f08daf8f0b16db4f4e3e5dd05d` | `70c26ee3952595ca74e2041ecc85349e3e63c6f08daf8f0b16db4f4e3e5dd05d` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__art-review__chunk-03__gemini-request.md` | `51fc3f2c5cbe9d4049552c9c845c4e44a19b98afb952519d3205b980fac46a21` | `51fc3f2c5cbe9d4049552c9c845c4e44a19b98afb952519d3205b980fac46a21` | MATCH |
| `PAYLOAD.sha256` | `e8e47da8de3a5a7e22a46bd2c027444722cba187ae54d66428df27c88724b150` | `e8e47da8de3a5a7e22a46bd2c027444722cba187ae54d66428df27c88724b150` | MATCH |
| `gemini-payload-ledger.md` | `3605a5bc0962d019934e7dd77ddd0d71bc9e4abf9b53a798e3c2227c449145ea` | `3605a5bc0962d019934e7dd77ddd0d71bc9e4abf9b53a798e3c2227c449145ea` | MATCH |
| `gemini-root-identity.json` | `793228f2e76a487c534d5f74c6e9e51c59ddbf5abf313796f13e37728b4de610` | `793228f2e76a487c534d5f74c6e9e51c59ddbf5abf313796f13e37728b4de610` | MATCH |

### 2.2 36-image pixel inspection ledger

| File | Expected SHA-256 | Computed SHA-256 | `openedAtOriginalPixels=yes` | Unique visible cue |
| --- | --- | --- | :---: | --- |
| `images/21-reader-step-04.png` | `929fd481fb2d278e43cc6a1039277dd64e207e2a0ce4083e3e1210c65dc543e5` | `929fd481fb2d278e43cc6a1039277dd64e207e2a0ce4083e3e1210c65dc543e5` | yes | Tsugumi in sleeveless top standing among white lilies with title banner "第1話 葬儀"; 3 older women whispering above, key in hand, house with funeral lanterns ("忌中"). |
| `images/21-reader-step-05.png` | `9c0f95ba69797435776e64c9a2866bed3210c050b6b783cf549d832254b18c0e` | `9c0f95ba69797435776e64c9a2866bed3210c050b6b783cf549d832254b18c0e` | yes | Tsugumi in black shirt and apron pouring soy sauce from large bottle in domestic kitchen; relatives eating watermelon and discussing her corporate resignation. |
| `images/21-reader-step-06.png` | `9b42d6b2a50cb466796fc7ab4489ab3d4f40f134ef0710251ca2a4e57fb0a8b9` | `9b42d6b2a50cb466796fc7ab4489ab3d4f40f134ef0710251ca2a4e57fb0a8b9` | yes | Tsugumi kneeling viewed from back looking out sliding door; glass-wearing professor Junpei standing by rocky riverbank with travel suitcase, washing hands in shallow water. |
| `images/21-reader-step-07.png` | `df4866e5fd08d70c60fc71c544bfeda4ae8f320a8d1def588aab0dcf64acf408` | `df4866e5fd08d70c60fc71c544bfeda4ae8f320a8d1def588aab0dcf64acf408` | yes | Junpei wiping dripping water off face next to suitcase tagged "KOJ"; Tsugumi and Junpei seated together on porch in funeral attire talking to family. |
| `images/21-reader-step-08.png` | `ea9475225f62b2cde2b6e301aeb4c3b1874835b301e86eb6c86f8e6ae9b96854` | `ea9475225f62b2cde2b6e301aeb4c3b1874835b301e86eb6c86f8e6ae9b96854` | yes | Tsugumi in apron on veranda, vertical 5-panel progressive sequence of her shedding tears, looking down, and crying into her hands. |
| `images/21-reader-step-09.png` | `a4f244ecec2772100240b248e2d14a7227ad6e6ef104a82500cf5e31af38961a` | `a4f244ecec2772100240b248e2d14a7227ad6e6ef104a82500cf5e31af38961a` | yes | Relatives and brothers sitting on veranda looking through old photo album, discussing childhood white ceremonial kimono ("花環きとっただろ"). |
| `images/23-reader-step-04.png` | `3a04c9585e1f57ce2138c6063dd8f6a9cab93bf7c080b02cb79ac8543940010e` | `3a04c9585e1f57ce2138c6063dd8f6a9cab93bf7c080b02cb79ac8543940010e` | yes | Bespectacled young man Yukinojo in suit leaving for miai, elderly bald monk/grandfather sitting on tatami with striped cat by garden view. |
| `images/23-reader-step-05.png` | `38d013ba7c534a2c9743b52d1d6203c2e167c60f9808fd279203533d22d8b6df` | `38d013ba7c534a2c9743b52d1d6203c2e167c60f9808fd279203533d22d8b6df` | yes | Solitary small boat rowed across white expanse ("舟を漕いでいる"); lacquer tray with ceramic cups and wagashi sweets; glass-roofed arcade walkway. |
| `images/23-reader-step-06.png` | `f5274e88c63b8851965d73535ee3319c97fa0d697e04819cbc5dea4add230262` | `f5274e88c63b8851965d73535ee3319c97fa0d697e04819cbc5dea4add230262` | yes | Formal miai meeting in tatami room; bride Asahi bowing deeply with hands on knees pleading "入り婿さ来て下さい！" (Please come as an adopted husband!). |
| `images/23-reader-step-07.png` | `83116f9f697ed0161c5e7fa00b01fc05188c6f0b0107c5df0ece7d89518c808c` | `83116f9f697ed0161c5e7fa00b01fc05188c6f0b0107c5df0ece7d89518c808c` | yes | Close-up of Asahi's blushing ear peeking through black hair like a cooked apple slice ("煮りんご みたいに"); Yukinojo and Asahi kneeling opposite each other. |
| `images/23-reader-step-08.png` | `4bd728d88734529152661fe6284ea8937b1e7b75295c49de55945ba44f2f421f` | `4bd728d88734529152661fe6284ea8937b1e7b75295c49de55945ba44f2f421f` | yes | Traditional wedding ceremony on tatami with Asahi in white tsunokakushi headdress and Yukinojo in hakama; banquet guests serving sake and gossiping about Yukinojo being a foundling. |
| `images/23-reader-step-09.png` | `7623b77ddc003159f9e7aa288c951ca78ec3d72e9532da7ee145a37579ccf5a8` | `7623b77ddc003159f9e7aa288c951ca78ec3d72e9532da7ee145a37579ccf5a8` | yes | Smiling elder woman in kimono pouring sake at wedding; outside on corridor angry local young men grabbing each other and yelling "おめ うそばっかなっ!!!". |
| `images/24-reader-step-04.png` | `92abea8b4aa94fff54f14b89e269a8fa94219f734155430e7c0377f6e9f6e31a` | `92abea8b4aa94fff54f14b89e269a8fa94219f734155430e7c0377f6e9f6e31a` | yes | Mozutani in twintails aggressively swinging a school chair above her head in classroom frenzy; teacher slumped face-down on teacher's desk in despair ("ぬがあああああああ"). |
| `images/24-reader-step-05.png` | `ecd3cea43191300657310721453aaabb7e7df0131c9f3e760551d09c0f3317df` | `ecd3cea43191300657310721453aaabb7e7df0131c9f3e760551d09c0f3317df` | yes | Female teacher lecturing class about tsundere students; school hallway where student Kabao approaches Mozutani carrying flowers and offering to carry her bag. |
| `images/24-reader-step-06.png` | `7f9d3c98df7fc6877f94c93012c009c9243704eda1cda422673e82417323f5de` | `7f9d3c98df7fc6877f94c93012c009c9243704eda1cda422673e82417323f5de` | yes | Kabao handing newspaper-wrapped bouquet; Mozutani's sudden enraged glare and explosive punch knocking Kabao backwards ("ボキギキ", "ぬぎゃあ"). |
| `images/24-reader-step-07.png` | `812dc6c6936b3236c4d6c578a48940edad6e2bbd6e0acc977a2f9b00d6f81bf1` | `812dc6c6936b3236c4d6c578a48940edad6e2bbd6e0acc977a2f9b00d6f81bf1` | yes | Mozutani presenting at front podium pointing at bandaged Kabao, explaining to the seated class her clinical tsundere violent impulses. |
| `images/24-reader-step-08.png` | `996beb99f07b333619b7db6d6a6d340246663a00cfebd8ca545b70546f516386` | `996beb99f07b333619b7db6d6a6d340246663a00cfebd8ca545b70546f516386` | yes | Mozutani with Nicole emblem on blazer requesting the class shun/ignore her completely ("シカトして下さい"); teacher and classmates reacting in stunned silence. |
| `images/24-reader-step-09.png` | `6ffc6d95f2519e28b376dea2953d13b29d49503f077779eff78c0db72bece957` | `6ffc6d95f2519e28b376dea2953d13b29d49503f077779eff78c0db72bece957` | yes | School library with tall bookshelves where Mozutani studies alone; bandaged Kabao entering to talk and apologize, two-shot dialogue across desks. |
| `images/27-reader-step-04.png` | `f283db06cd04d06c3cddab3796c28d7555cc6781bab50e24d7e78be4010cbd28` | `f283db06cd04d06c3cddab3796c28d7555cc6781bab50e24d7e78be4010cbd28` | yes | High-angle aerial panorama of Asian palace complex in "亜・国都"; palace kitchen with maids in robes and young princess snatching steamed buns and scurrying away ("てけてけ"). |
| `images/27-reader-step-05.png` | `1bcda3bbec6ed83d84a853db909b5917fffd187b0f3c96dcfa06075db3d29ad6` | `1bcda3bbec6ed83d84a853db909b5917fffd187b0f3c96dcfa06075db3d29ad6` | yes | Princess Aki holding steamed bun smiling happily; attendants in panic shouting "姫様が出たぞー" as Aki flees along high stone castle ramparts. |
| `images/27-reader-step-06.png` | `5c81a04abd5a4ae7c7d99f4bdc0efb51b1b353a4569cad89b1773fa5f7e45f4a` | `5c81a04abd5a4ae7c7d99f4bdc0efb51b1b353a4569cad89b1773fa5f7e45f4a` | yes | Hooded boy Hakusei perches on rampart rail, leaps down with vertical motion lines, lands with heavy thud ("ダッ") before startled princess Aki. |
| `images/27-reader-step-07.png` | `ea775ffa3eb18160919a0986edcf0ff7895d6d26c62b4110a6fed900fc501f28` | `ea775ffa3eb18160919a0986edcf0ff7895d6d26c62b4110a6fed900fc501f28` | yes | Dramatic split close-up of blond boy with sky-blue eyes ("金の髪…天の色の眼!!") facing princess Aki; royal guards running on stone palace staircase in background. |
| `images/27-reader-step-08.png` | `2906c7decb5e90e1a0ac674ae6c4f2c91a63b43a61ca18d78ef69761e3d531b2` | `2906c7decb5e90e1a0ac674ae6c4f2c91a63b43a61ca18d78ef69761e3d531b2` | yes | Second Consort (亜の第二王妃・土妃) in ornate robes with young prince; map showing barbarian barbarian territory (胡); Aki dragging blond boy behind palace wall. |
| `images/27-reader-step-09.png` | `7fe5491aaf1ed6d0797625def24cfa41b2d72ef8cd894c8b0d4a94a6f9afa06e` | `7fe5491aaf1ed6d0797625def24cfa41b2d72ef8cd894c8b0d4a94a6f9afa06e` | yes | Consort smiling chillingly saying "駆除をしてやらねば…と"; royal lineage genealogical tree diagram (亜王, 土妃, 黄妃, 王子, 姫); rooftop panorama of palace complex. |
| `images/29-reader-step-04.png` | `fb313bdddc18d983219c2b78d1eb9180494bdfdc4a2eeb4ad4e90d81ccd4bda3` | `fb313bdddc18d983219c2b78d1eb9180494bdfdc4a2eeb4ad4e90d81ccd4bda3` | yes | Tetsuo in bedroom putting on uniform jacket, tying red dance shoes, looking out at panoramic sunrise over dense Japanese hillside neighborhood. |
| `images/29-reader-step-05.png` | `a927ae93f9c8b2b529ff5be4c3f7298262126247d4eff8a6ec715c0772da5ab3` | `a927ae93f9c8b2b529ff5be4c3f7298262126247d4eff8a6ec715c0772da5ab3` | yes | Balding elderly grandfather with arms raised yelling "ばんざーい", Tetsuo crouching at doorway reminding him high school is 2 hours away. |
| `images/29-reader-step-06.png` | `a2cb9e02f813392f5d0ee4b5e0190984b8bd6c90f2503a2bf470aaf45111d4fa` | `a2cb9e02f813392f5d0ee4b5e0190984b8bd6c90f2503a2bf470aaf45111d4fa` | yes | Close-up of grandfather talking about red shoes ("Kaminari-san mark"); Tetsuo walking out genkan while grandfather cheers banzai from entryway. |
| `images/29-reader-step-07.png` | `400ea2e057c5384146fb4f46286c6011ff55198a103dd11d4a981559202eec8f` | `400ea2e057c5384146fb4f46286c6011ff55198a103dd11d4a981559202eec8f` | yes | Tetsuo walking quiet suburban road, mother hitting grandfather with slipper; Tetsuo standing on train platform, sitting alone on train seat bathed in sunlight. |
| `images/29-reader-step-08.png` | `2f70f46ab410efbd5c2615e0c765bb20a0fcec4eed5918897fb7d4a357de67a8` | `2f70f46ab410efbd5c2615e0c765bb20a0fcec4eed5918897fb7d4a357de67a8` | yes | Junior high basketball practice flashback; teammates passing ball, basketball rolling across floor, Tetsuo feeling alienated and overshadowed. |
| `images/29-reader-step-09.png` | `4fff94f5aa17f58ff4abcb4fbd774ecc87c1ca2887896bdcac292e63a937b5af` | `4fff94f5aa17f58ff4abcb4fbd774ecc87c1ca2887896bdcac292e63a937b5af` | yes | Flashback of Tetsuo standing by glowing computer monitor posting on school smear board ("裏サイト"); lower left grandfather giving encouragement before match. |
| `images/30-reader-step-05.png` | `bba491a471d3ce544ec68d68af9e50462d3b14487ebd51cbf7a1c246b8d2730b` | `bba491a471d3ce544ec68d68af9e50462d3b14487ebd51cbf7a1c246b8d2730b` | yes | Yasuho Hirose tripping and falling over rocky slope ("ひっ", "うっ！うおおっ……"); landing beside naked half-buried Josuke wearing sailor cap in the earth. |
| `images/30-reader-step-06.png` | `f12ced145bae2595583e2d2471d184f815f3fe7ca23b2e07b28de6a05d6635e1` | `f12ced145bae2595583e2d2471d184f815f3fe7ca23b2e07b28de6a05d6635e1` | yes | Close-up hands placing coordinates on ground; Morioh town crest "M with crown", bridge over river, highway, and municipal intro text. |
| `images/30-reader-step-07.png` | `b655fa7fe144dd4be99e92b58cb3aeca65a95e83c1eb4dfc310da9b5d1f35682` | `b655fa7fe144dd4be99e92b58cb3aeca65a95e83c1eb4dfc310da9b5d1f35682` | yes | Map of Morioh city coastal damage after March 11 earthquake; towering uplift of the "Wall Eyes" (「壁の目」) geological fault pushing up ground and houses ("ゴゴゴ"). |
| `images/30-reader-step-08.png` | `9ad26c84852e6eefefe2e12c47f23490ff3c1ab5d731b967cb90f6399e174587` | `9ad26c84852e6eefefe2e12c47f23490ff3c1ab5d731b967cb90f6399e174587` | yes | Sprawling 10-km panoramic landscape of the "Wall Eyes" dividing Morioh; round eye-like cavities in the cliff face with sound effect "ゴゴゴ". |
| `images/30-reader-step-09.png` | `90155f576f780b31b62f2ac6d938ba333b1d4d259f9165c88093a4e195b9c599` | `90155f576f780b31b62f2ac6d938ba333b1d4d259f9165c88093a4e195b9c599` | yes | Yasuho standing over buried Josuke; Josuke reaching hand out from earth; shoulder close-up revealing Joestar star birthmark with mysterious human bite mark. |
| `images/30-reader-step-10.png` | `fbd1bbb44a4371f13cb59c16d8984f9ca3d584054305235f00daf3f233ab940e` | `fbd1bbb44a4371f13cb59c16d8984f9ca3d584054305235f00daf3f233ab940e` | yes | Close-up bleeding star birthmark on shoulder; Yasuho dialing emergency on mobile phone, Josuke lying confused in dirt asking about his name. |

---

## 3. Positions 21–30 Art factor table

Values are ordered strictly by: `artRealism / artDensity / visualSoftness / motionImpact`.

| Pos | workId | Canonical title | Preflight state | `artRealism` | `artDensity` | `visualSoftness` | `motionImpact` |
| ---: | --- | --- | --- | :---: | :---: | :---: | :---: |
| 21 | `work-1ec3d48e64b228bb8a92` | 娚の一生 | `sample-ready` | **2** | **2** | **4** | **U** |
| 22 | `work-238c04ae3a3a61451078` | リューシカ・リューシカ | `unknown-ready` | **U** | **U** | **U** | **U** |
| 23 | `work-43ebf010a490cfd4bb50` | 千年万年りんごの子 | `sample-ready` | **2** | **2** | **3** | **U** |
| 24 | `work-4b4bbe8c10859c46e726` | 百舌谷さん逆上する | `sample-ready` | **2** | **2** | **2** | **U** |
| 25 | `work-5ad62e6413f67d351f1d` | 天にひびき | `unknown-ready` | **U** | **U** | **U** | **U** |
| 26 | `work-5b7cf2105a4bc6f6b46c` | クジラの子らは砂上に歌う | `unknown-ready` | **U** | **U** | **U** | **U** |
| 27 | `work-5e30ab3c7e3fb43e51f2` | 女王の花 | `sample-ready` | **2** | **3** | **4** | **2** |
| 28 | `work-62fb5d8e9f6c6bbbeba9` | 血潜り林檎と金魚鉢男 | `unknown-ready` | **U** | **U** | **U** | **U** |
| 29 | `work-6c6341781c12b590864f` | 鉄楽レトラ | `sample-ready` | **2** | **2** | **2** | **U** |
| 30 | `work-77008e04537e3fd889e2` | ジョジョリオン | `sample-ready` | **3** | **4** | **0** | **2** |

*Total: 10 works, exactly 40 Factor cells.*

---

## 4. Work-level detailed evidence and Dictionary-anchored justifications

### Position 21 — `work-1ec3d48e64b228bb8a92` (娚の一生)
- **Preflight State**: `sample-ready` (6 readable body pages, 3 distinct contexts: domestic funeral prep, outdoor river scene, veranda family gathering).
- **`artRealism` = 2**
  - *Refs*: `images/21-reader-step-04.png`, `images/21-reader-step-06.png`, `images/21-reader-step-07.png`
  - *Observation*: Character faces feature classic josei stylization with large expressive eyes, delicate eyelashes, and slender necks, grounded in realistic everyday body proportions, realistic Japanese domestic architecture (traditional tiled roofs, tatami, shoji), real-life props (suitcases, tea cups, key), and naturalistic riverbank geography. Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluation limited to volume 1 entry preview pages (`reader-step-04` through `reader-step-09`).
  - *Confidence*: 0.90
- **`artDensity` = 2**
  - *Refs*: `images/21-reader-step-05.png`, `images/21-reader-step-06.png`, `images/21-reader-step-09.png`
  - *Observation*: Clean and airy panel compositions with balanced negative white space; selective detailed rendering on architectural exteriors, kitchen props, and floral motifs without heavy ink clutter. Corresponds to Factor Dictionary anchor 2 (균형).
  - *Limitation*: Evaluated on 6 entry-scope pages; full-volume rendering variations unobserved.
  - *Confidence*: 0.88
- **`visualSoftness` = 4**
  - *Refs*: `images/21-reader-step-04.png`, `images/21-reader-step-08.png`
  - *Observation*: Linework is exceptionally soft, fine, and fluid; gentle rounded facial contours, delicate floating floral decorations (step-04), subtle screentone gradients, and soft tearful emotional sequences (step-08) with no harsh angular hatching or heavy black contour blocks. Corresponds to Factor Dictionary anchor 4 (부드럽고 미려한 표현).
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.92
- **`motionImpact` = U**
  - *Unmet Gate*: `motionGateAttemptable=false` in preflight. Preflight limitation: Exact continuous start-development-impact-resolved motion sequence was not isolated in the 6 body pages. Closes as `unknown` without blocker.

---

### Position 22 — `work-238c04ae3a3a61451078` (リューシカ・リューシカ)
- **Preflight State**: `unknown-ready`
- **Art Axes**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`
- **Unmet Gate**: Official publisher product-only route. Registered Square Enix Gangan Online promotion route did not expose an edition-bound readable body page sample (`readableInternalPageCount=0`, `distinctContextCount=0`). Under the Factor Dictionary §2 and Annotation Guide §3/§5, all Art axes close as `unknown` without blocker or default zero.

---

### Position 23 — `work-43ebf010a490cfd4bb50` (千年万年りんごの子)
- **Preflight State**: `sample-ready` (6 readable body pages, 3 distinct contexts: temple/domestic living room, formal miai meeting room, traditional wedding reception).
- **`artRealism` = 2**
  - *Refs*: `images/23-reader-step-04.png`, `images/23-reader-step-06.png`, `images/23-reader-step-08.png`
  - *Observation*: Character faces feature stylized retro folk-tale features (round spectacles, simplified soft eye shapes, expressive stylized noses), paired with realistic traditional garments (formal kimono, montsuki haori hakama, Western suits), realistic tatami room architecture, and grounded rural banquet props. Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluation limited to volume 1 entry preview pages (`reader-step-04` through `reader-step-09`).
  - *Confidence*: 0.89
- **`artDensity` = 2**
  - *Refs*: `images/23-reader-step-05.png`, `images/23-reader-step-07.png`, `images/23-reader-step-08.png`
  - *Observation*: Crisp, structured linework with moderate detail in textile patterns, tatami textures, and banquet dishes; ample breathable white space and clean panel layouts without heavy visual congestion. Corresponds to Factor Dictionary anchor 2 (균형).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.88
- **`visualSoftness` = 3**
  - *Refs*: `images/23-reader-step-04.png`, `images/23-reader-step-07.png`, `images/23-reader-step-09.png`
  - *Observation*: Contours are warm, organic, rounded, and hand-drawn with gentle ink lines and soft screentone shading (such as the soft ear and hair rendering in step-07 and the temple cat in step-04), situated clearly between neutral (2) and delicate/graceful (4).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.88
- **`motionImpact` = U**
  - *Unmet Gate*: `motionGateAttemptable=false` in preflight. Preflight limitation: Exact continuous start-development-impact-resolved motion sequence was not isolated in the 6 body pages. Closes as `unknown` without blocker.

---

### Position 24 — `work-4b4bbe8c10859c46e726` (百舌谷さん逆上する)
- **Preflight State**: `sample-ready` (6 readable body pages, 3 distinct contexts: classroom, school hallway/exterior, school library).
- **`artRealism` = 2**
  - *Refs*: `images/24-reader-step-04.png`, `images/24-reader-step-05.png`, `images/24-reader-step-09.png`
  - *Observation*: Stylized comedy/manga facial archetypes (Mozutani's blonde twintails, comical rage eyes, teacher's expressive slump) constructed upon anatomically grounded human bodies and realistic school perspective (wooden desks, metal chairs, school corridors, library bookshelves). Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluation limited to volume 1 entry preview pages (`reader-step-04` through `reader-step-09`).
  - *Confidence*: 0.90
- **`artDensity` = 2**
  - *Refs*: `images/24-reader-step-05.png`, `images/24-reader-step-07.png`, `images/24-reader-step-09.png`
  - *Observation*: Well-balanced screentone values, structured architectural school backgrounds (desks, lockers, windows, tall library shelves), and clear linework without excessive over-rendering. Corresponds to Factor Dictionary anchor 2 (균형).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.89
- **`visualSoftness` = 2**
  - *Refs*: `images/24-reader-step-06.png`, `images/24-reader-step-08.png`, `images/24-reader-step-09.png`
  - *Observation*: Clean, sharp inking with angular impact lines during rage gags (step-06) balanced against standard rounded school-life character linework (step-08, 09). Corresponds to Factor Dictionary anchor 2 (중립).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.90
- **`motionImpact` = U**
  - *Unmet Gate*: `motionGateAttemptable=false` in preflight. Preflight limitation: Exact continuous start-development-impact-resolved motion sequence was not isolated in the 6 body pages. Closes as `unknown` without blocker.

---

### Position 25 — `work-5ad62e6413f67d351f1d` (天にひびき)
- **Preflight State**: `unknown-ready`
- **Art Axes**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`
- **Unmet Gate*: Official publisher product-only route. No product-linked readable internal preview could be mapped to the frozen Shonengahosha edition (`readableInternalPageCount=0`, `distinctContextCount=0`). Under the Factor Dictionary §2 and Annotation Guide §3/§5, all Art axes close as `unknown` without blocker or default zero.

---

### Position 26 — `work-5b7cf2105a4bc6f6b46c` (クジラの子らは砂上に歌う)
- **Preflight State**: `unknown-ready`
- **Art Axes**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`
- **Unmet Gate**: Registered official publisher promotion route unavailable. Official Akita product was verified, but the registered Champion Cross promotion route was unavailable and the discovered unregistered ARC reader was not substituted (`readableInternalPageCount=0`, `distinctContextCount=0`). Under the Factor Dictionary §2 and Annotation Guide §3/§5, all Art axes close as `unknown` without blocker or default zero.

---

### Position 27 — `work-5e30ab3c7e3fb43e51f2` (女王の花)
- **Preflight State**: `sample-ready` (6 readable body pages, 3 distinct contexts: palace kitchen & courtyard, castle ramparts & descent, garden corridor & royal family meeting).
- **`artRealism` = 2**
  - *Refs*: `images/27-reader-step-04.png`, `images/27-reader-step-07.png`, `images/27-reader-step-08.png`
  - *Observation*: Classic shojo facial stylization (large radiant eyes, delicate slender profiles, fine eyelashes) paired with historically accurate Chinese/Asian palace architecture, stone battlements, intricate tiled roofs, and authentic royal garments. Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluation limited to volume 1 entry preview pages (`reader-step-04` through `reader-step-09`).
  - *Confidence*: 0.90
- **`artDensity` = 3**
  - *Refs*: `images/27-reader-step-04.png`, `images/27-reader-step-06.png`, `images/27-reader-step-09.png`
  - *Observation*: Sits between balanced (2) and high density (4). Features intricate architectural cityscapes of the capital (step-04, 09), detailed brick/stone textures on palace ramparts, and ornate decorative robes, balanced with clean facial panels.
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.88
- **`visualSoftness` = 4**
  - *Refs*: `images/27-reader-step-05.png`, `images/27-reader-step-07.png`, `images/27-reader-step-08.png`
  - *Observation*: Highly luminous, delicate shojo aesthetic; soft flowing hair strands, radiant screentone highlights, delicate facial contours, and shimmering atmospheric effects across all panels. Corresponds to Factor Dictionary anchor 4 (부드럽고 미려한 표현).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.92
- **`motionImpact` = 2**
  - *Refs*: `images/27-reader-step-05.png`, `images/27-reader-step-06.png`, `images/27-reader-step-07.png`
  - *Observation*: Evaluated on the authorized bounded sequence `reader-step-05→06→07`: Start (Princess Aki fleeing along the palace wall with attendants giving chase in step-05) → Development / Impact (Hakusei leaping from high ramparts with vertical speed lines, impacting the stone pavement with a loud thud "ダッ" in step-06) → Resolved endpoint (Hakusei crouching and rising before Aki in a dramatic confrontation freeze in step-07). Represents clear kinetic movement and impact of moderate intensity. Corresponds to Factor Dictionary anchor 2 (보통).
  - *Limitation*: Evaluated strictly on the authorized 3-page continuous sequence.
  - *Confidence*: 0.88

---

### Position 28 — `work-62fb5d8e9f6c6bbbeba9` (血潜り林檎と金魚鉢男)
- **Preflight State**: `unknown-ready`
- **Art Axes**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`
- **Unmet Gate**: Official publisher product-only route. Official KADOKAWA product matches frozen edition, but `pre_trial_reading_flg=0` and no verified product-linked preview was accessible (`readableInternalPageCount=0`, `distinctContextCount=0`). Under the Factor Dictionary §2 and Annotation Guide §3/§5, all Art axes close as `unknown` without blocker or default zero.

---

### Position 29 — `work-6c6341781c12b590864f` (鉄楽レトラ)
- **Preflight State**: `sample-ready` (6 readable body pages, 3 distinct contexts: domestic bedroom/genkan, suburban morning commute/train, junior high basketball gym flashback).
- **`artRealism` = 2**
  - *Refs*: `images/29-reader-step-04.png`, `images/29-reader-step-07.png`, `images/29-reader-step-08.png`
  - *Observation*: Expressive modern shonen/seinen facial stylization with realistic human anatomical structure, accurate perspective on Japanese suburban neighborhoods, train platforms, train interiors, and sports gymnasiums. Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluation limited to volume 1 entry preview pages (`reader-step-04` through `reader-step-09`).
  - *Confidence*: 0.90
- **`artDensity` = 2**
  - *Refs*: `images/29-reader-step-04.png`, `images/29-reader-step-06.png`, `images/29-reader-step-07.png`
  - *Observation*: Sits at balanced density (2). Features a detailed panoramic townscape at sunrise (step-04) and clean, structured black-and-white graphic contrast with uncluttered panel layouts. Corresponds to Factor Dictionary anchor 2 (균형).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.90
- **`visualSoftness` = 2**
  - *Refs*: `images/29-reader-step-05.png`, `images/29-reader-step-06.png`, `images/29-reader-step-07.png`
  - *Observation*: Confident, crisp ink contours, sharp graphic shadows, clean screentones, and balanced contour lines without excessive jaggedness or overly soft romantic blur. Corresponds to Factor Dictionary anchor 2 (중립).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.90
- **`motionImpact` = U**
  - *Unmet Gate*: `motionGateAttemptable=false` in preflight. Preflight limitation: Exact continuous start-development-impact-resolved motion sequence was not isolated in the 6 body pages. Closes as `unknown` without blocker.

---

### Position 30 — `work-77008e04537e3fd889e2` (ジョジョリオン)
- **Preflight State**: `sample-ready` (6 readable body pages, 3 distinct contexts: "Wall Eyes" crevice & character encounter, municipal cartographic/street exposition, 10-km panoramic geological fault landscape).
- **`artRealism` = 3**
  - *Refs*: `images/30-reader-step-05.png`, `images/30-reader-step-08.png`, `images/30-reader-step-10.png`
  - *Observation*: Sits between general stylization (2) and high realism (4). Features classical Greco-Roman sculptural anatomy, highly detailed bone/muscle modeling, realistic hands and feet, authentic urban architecture, and photographic landscape rendering, combined with stylized dramatic fashion posing and expressive eyes.
  - *Limitation*: Evaluation limited to volume 1 entry preview pages (`reader-step-05` through `reader-step-10`).
  - *Confidence*: 0.91
- **`artDensity` = 4**
  - *Refs*: `images/30-reader-step-05.png`, `images/30-reader-step-07.png`, `images/30-reader-step-08.png`
  - *Observation*: Extremely dense rendering across all pages: intense cross-hatching across characters, clothing wrinkles, rocky crevices, ground debris, detailed cartographic maps, and massive panoramic geological city views. Corresponds to Factor Dictionary anchor 4 (선·배경·정보 밀도가 높음).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.94
- **`visualSoftness` = 0**
  - *Refs*: `images/30-reader-step-05.png`, `images/30-reader-step-07.png`, `images/30-reader-step-09.png`
  - *Observation*: Character rendering and environments are intensely angular, sharp, and harsh; chiseled facial structures, heavy black shadow blocking, sharp jagged rock faults, and gritty cross-hatch shading throughout. Corresponds to Factor Dictionary anchor 0 (거칠고 각진 표현).
  - *Limitation*: Evaluated on 6 entry-scope pages.
  - *Confidence*: 0.94
- **`motionImpact` = 2**
  - *Refs*: `images/30-reader-step-05.png`
  - *Observation*: Evaluated on the authorized bounded sequence within `reader-step-05`: Start (top panel: Yasuho stumbling on the rocky slope with speed lines "ひっ") → Development / Impact (middle panel: Yasuho tumbling down and crashing onto rocks and dirt beside buried Josuke with sound effects "うっ！うおおっ……") → Resolved aftermath/endpoint (bottom panels: coming to a rest in the dirt, catching breath, observing Josuke, and recovering into a crouch). Shows a clear continuous physical collision and kinetic tumble of moderate intensity. Corresponds to Factor Dictionary anchor 2 (보통).
  - *Limitation*: Evaluated strictly on the single-page continuous fall sequence.
  - *Confidence*: 0.90

---

## 5. Audit of 0/4 endpoints and authorized motion sequences

### 5.1 Endpoint value audits across all recorded contexts

#### 1. Position 21 (`work-1ec3d48e64b228bb8a92` — 娚の一生): `visualSoftness = 4`
- **Context 1 (Domestic / funeral prep & interior: `reader-step-04`, `05`, `08`)**: Delicate, fine linework, soft blooming lilies in step-04, gentle facial curves, and soft progressive crying sequence in step-08. Strongly supports 4.
- **Context 2 (Outdoor riverbank scene: `reader-step-06`, `07`)**: Soft water ripples, gentle atmospheric hatching on river stones, soft hair rendering on Junpei. Strongly supports 4.
- **Context 3 (Veranda family gathering: `reader-step-07`, `09`)**: Warm rounded contours, soft screentone shading across photo albums and seated family members. Strongly supports 4.
- **Audit Conclusion**: Value `4` is consistently supported across all 3 selected contexts without exception.

#### 2. Position 27 (`work-5e30ab3c7e3fb43e51f2` — 女王の花): `visualSoftness = 4`
- **Context 1 (Palace interior & kitchen: `reader-step-04`, `09`)**: Delicate decorative linework, soft tone transitions on imperial buildings, gentle rounded maid figures. Strongly supports 4.
- **Context 2 (Castle ramparts & descent: `reader-step-05`, `06`, `07`)**: Luminous large shojo eyes, soft wind-blown hair strands, radiant highlights, gentle floating tones. Strongly supports 4.
- **Context 3 (Garden corridor & royal consort meeting: `reader-step-08`, `09`)**: Flowing silk robes, soft delicate facial shading, graceful contours. Strongly supports 4.
- **Audit Conclusion**: Value `4` is consistently supported across all 3 selected contexts without exception.

#### 3. Position 30 (`work-77008e04537e3fd889e2` — ジョジョリオン): `artDensity = 4`
- **Context 1 ("Wall Eyes" crevice & character encounter: `reader-step-05`, `09`, `10`)**: Saturated, tight cross-hatching across rocks, soil, clothes, boots, and skin textures. Strongly supports 4.
- **Context 2 (Municipal cartographic & urban exposition: `reader-step-06`, `07`)**: Dense municipal maps, detailed streetscapes, bridge, vehicles, architectural facade details, and disaster rubble. Strongly supports 4.
- **Context 3 (10-km panoramic geological fault: `reader-step-07`, `08`)**: Immense structural detail in sprawling landscape, cliff fissures, destroyed buildings, and dense text insets. Strongly supports 4.
- **Audit Conclusion**: Value `4` is consistently supported across all 3 selected contexts without exception.

#### 4. Position 30 (`work-77008e04537e3fd889e2` — ジョジョリオン): `visualSoftness = 0`
- **Context 1 ("Wall Eyes" crevice & character encounter: `reader-step-05`, `09`, `10`)**: Sharp chiseled jawlines, angular black shadow blocks, jagged rocks, abrasive ink hatching. Strongly supports 0.
- **Context 2 (Municipal cartographic & urban exposition: `reader-step-06`, `07`)**: Sharp geometric building corners, jagged concrete fractures, harsh angular signs. Strongly supports 0.
- **Context 3 (10-km panoramic geological fault: `reader-step-07`, `08`)**: Jagged rock ruptures, sharp fault lines, heavy stark contrast without soft feathering. Strongly supports 0.
- **Audit Conclusion**: Value `0` is consistently supported across all 3 selected contexts without exception.

---

### 5.2 Authorized motion sequence audits

#### 1. Position 27 (`work-5e30ab3c7e3fb43e51f2` — 女王の花): `reader-step-05 → reader-step-06 → reader-step-07`
- **Start (`reader-step-05`)**: Princess Aki flees along the stone ramparts with royal attendants running in pursuit.
- **Development & Impact (`reader-step-06`)**: Hakusei leaps from the top of the rampart rail, dynamic vertical speedlines indicate rapid descent, and lands with heavy impact on the courtyard pavement ("ダッ").
- **Resolved Endpoint (`reader-step-07`)**: Hakusei crouches and turns to face Aki; the motion resolves into a dramatic confrontation freeze as guards catch up in the background.
- **Motion Evaluation**: Clear continuous kinetic descent and impact with moderate dynamic emphasis (`motionImpact = 2`).

#### 2. Position 30 (`work-77008e04537e3fd889e2` — ジョジョリオン): Within `reader-step-05`
- **Start (`reader-step-05` top panel)**: Yasuho trips and loses her footing on the steep rocky slope with kinetic streak lines ("ひっ").
- **Development & Impact (`reader-step-05` middle panels)**: Yasuho tumbles down backwards into the fissure, crashing into the rocks and dirt beside buried Josuke with collision sound effects ("うっ！うおおっ……おおっ!!").
- **Resolved Endpoint (`reader-step-05` bottom panels)**: Yasuho comes to a complete rest in the dirt, catches her breath, turns her head to observe Josuke, and rises to a crouched posture.
- **Motion Evaluation**: Complete bounded fall and collision sequence with kinetic speedlines and sound effects of moderate dynamic intensity (`motionImpact = 2`).

---

## 6. Filesystem and mutation integrity confirmation

- **File Mutation Status**: Confirmed that **zero** temporary, staged, or repository files were created, copied, moved, modified, deleted, or committed by this review.
- **Root Directory**: The canonical uncompressed root `/tmp/konocomics-batch005-gemini-art03.16ZXVH` remains in its exact pristine, read-only state.
- **Scope Compliance**: This review has abstained from catalog promotion recommendations, comparative Local value adjudication, or non-Art modifications.
