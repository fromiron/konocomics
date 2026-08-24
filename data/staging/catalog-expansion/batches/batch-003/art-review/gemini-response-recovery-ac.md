# Batch 003 recovery AC independent Gemini Art review report

## 1. Execution attestation

- **Model identity & effort:** Exact `gemini-3.7-flash-high` (`Gemini 3.7 Flash High`), effort `high`.
- **Completion status:** Normal completion without errors, timeouts, rate limits, degraded output, fallback behavior, or model substitution.
- **Input & pixel access:** Complete independent access to all ten frozen input documents and full pixel-level inspection of all 24 payload PNG image files at native original resolution.
- **Human review flag:** `reviewedByHuman=false`.
- **Reviewer independence:** Conducted completely independently. Local Codex outputs, prior chunk conclusions, Grok outputs (`ART_ABSTAIN`), Muse outputs (`NOT_USED`), Gold data, Genre labels, text Factors, and external reviews were not referenced or inspected.
- **Scope:** Frozen positions 41, 47, 48, and 50 only.

---

## 2. Frozen input verification & pixel-access proof

### Frozen input SHA-256 hashes

| Path                                                                                                       | SHA-256                                                            |
| :--------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `docs/factors/factor-dictionary.md`                                                                        | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                                         | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md`               | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv`                                     | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-05/recovery-a-preflight.csv`         | `49575cd19c74142185905ce40eecc7b221e9f04889769409bf4e62169e5bcc9a` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-05/recovery-a-ledger.md`             | `b4f9023d664bd37e73fced21f51057c4736fd9f7e7c5a44769ca1108cfd4afe2` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/recovery-c-preflight.csv`                  | `765a3a5085cabdd99a6c84d591c145598dd291678780390c251fa0699d1eb31c` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/recovery-c-ledger.md`                      | `25b6248eeff4f450ab51ad15c535b2488df7a1fdee488a5e04809c2a9664b0d2` |
| `data/staging/catalog-expansion/batches/batch-003/art-review/chunk-05/daybreak-recovery-a-verification.md` | `26119a831737fac878f361c010fcc4bd3359ed0200eafc1ac11c685fabca96a3` |
| `data/staging/catalog-expansion/batches/batch-003/art-review/daybreak-recovery-c-verification.md`          | `aa65b4ad35e5b50603562ce2803c22ebc8e0948d25885e785e4cd473a6f35f7c` |

### 24-file pixel-access proof

| file            | expectedSha256                                                     | computedSha256                                                     | openedAtOriginalPixels | uniqueVisibleCue                                                                                                                                                      |
| :-------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------- | :--------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `41/p41-01.png` | `9538a3079b4c557067db396381ace20c2d30c6172e4ae0a957d7d5edae17bdb4` | `9538a3079b4c557067db396381ace20c2d30c6172e4ae0a957d7d5edae17bdb4` |          yes           | Dark spiky-haired boy reading birthday/exorcism notice letter in apartment ("お誕生日おめでとう御座います", "強制送還!?")                                             |
| `41/p41-02.png` | `a3e157ce083889b371c6f55e4268dfde9e162cda404daf21ac41fba22727074e` | `a3e157ce083889b371c6f55e4268dfde9e162cda404daf21ac41fba22727074e` |          yes           | Spiky-haired boy holding head in cafeteria table ("やべ〜〜ッ まだ4体しか喰ってねェ〜〜〜") while friends talk around lunch trays                                     |
| `41/p41-03.png` | `686f68db68710d6baf27d2e1569903b2fb7cc36d8de32c0fd71b395b26bb30f1` | `686f68db68710d6baf27d2e1569903b2fb7cc36d8de32c0fd71b395b26bb30f1` |          yes           | Boy grinning with fangs and toothy smile pulling mouth ("それだーッ") with pointing finger and comic speed lines                                                      |
| `41/p41-04.png` | `0950bea6d0149f3559b96ad8b9c268956854792dfb2bb5e477d057998fc21148` | `0950bea6d0149f3559b96ad8b9c268956854792dfb2bb5e477d057998fc21148` |          yes           | Student council room with "生徒会室" sign, photograph of shattered window glass ("またやられました"), dark-haired president staring ("幽霊……だと？")                  |
| `41/p41-05.png` | `30fd14fdd9ecfba0ecb50ba4ea0822514eb4c45de99e4768255df5a5782f1031` | `30fd14fdd9ecfba0ecb50ba4ea0822514eb4c45de99e4768255df5a5782f1031` |          yes           | Spiky-haired boy bursting through student council door shouting "すいあっせ〜ん！ 失礼しゃ〜す！" facing two tall blazered council members with armbands              |
| `41/p41-06.png` | `9df8fba0f8c0f7e2a785637c303506f5479f6bb3810e00f0020269c4f5f0366b` | `9df8fba0f8c0f7e2a785637c303506f5479f6bb3810e00f0020269c4f5f0366b` |          yes           | Spiky-haired boy with wide open grinning mouth ("本気も本気よ！") next to sweating glasses student; president listening in shadow below                               |
| `47/p47-01.png` | `34871d86c766042020c4db5855c9c38f4e261001bb25ffd00dd86ed5da2736fb` | `34871d86c766042020c4db5855c9c38f4e261001bb25ffd00dd86ed5da2736fb` |          yes           | Chapter 26 ("第26話 妻、たのむぞ!! の巻") title with wife trying on dresses and sweating husband in bed ("どう？ この服", "ずんぐりむっくりして見える")               |
| `47/p47-02.png` | `8eda5785ff40823f1d745c186f585eeaadeca6e64c9c9175f637bfe8ef0d683e` | `8eda5785ff40823f1d745c186f585eeaadeca6e64c9c9175f637bfe8ef0d683e` |          yes           | Wife ironing in morning bedroom, husband and wife entering crowded publisher launch party ("創刊パーティー") meeting A-sensei                                         |
| `47/p47-03.png` | `e6da388780acf294c0ab6ed70e9a2de6f13b71b0ed579daeb4b93f1f572b0a06` | `e6da388780acf294c0ab6ed70e9a2de6f13b71b0ed579daeb4b93f1f572b0a06` |          yes           | Publisher party buffet with dishes ("肉うまい", "マッシュポテトよ"), wife taking photo ("林家パー子のようにたのむぞ!!"), receiving souvenir bags                      |
| `47/p47-04.png` | `b2fedbbfdbab116acac9c9435a796675e4f406e72b5095ae57fcd60eb3e2ba9d` | `b2fedbbfdbab116acac9c9435a796675e4f406e72b5095ae57fcd60eb3e2ba9d` |          yes           | Night street and station bench after party ("ジャンプ・ス●●ア 入ってる..."), wife running off to cake shop ("ケーキ買っていっていい？")                               |
| `47/p47-05.png` | `4dc5d14c51f8258a0f978d99abb2338f5ca23197b545c8fdc2cbc25578cd7f7a` | `4dc5d14c51f8258a0f978d99abb2338f5ca23197b545c8fdc2cbc25578cd7f7a` |          yes           | Chapter 27 ("第27話 水をさす妻 の巻") title with husband unwrapping souvenir box discovering an iPod ("アイポッド...「パッド」？") and wife showing hers              |
| `47/p47-06.png` | `502fa764050f93004c69f5a3ac5d0f7e7c3973db854d1b6b0356fad4dbb585d1` | `502fa764050f93004c69f5a3ac5d0f7e7c3973db854d1b6b0356fad4dbb585d1` |          yes           | Wife at CRT desktop computer reading instruction manual trying to import music CD ("マニュアル本買ってる"), husband watching ("がんばれ！ 僕のポケモン")              |
| `48/p48-01.png` | `68aeb03ec5342791fe8a358dfec71576513f80f99773a0a3eaf819ac88110a5d` | `68aeb03ec5342791fe8a358dfec71576513f80f99773a0a3eaf819ac88110a5d` |          yes           | Hakumei peeking out from dense mountain herb bushes ("ローズマリー いや セイボリーか？") and Mikochi gathering herbs in basket ("岩山ハーブは香りが良いわね")         |
| `48/p48-02.png` | `ebc1650d131e595c3659834d55206172f3e7a9c1fb2511956fe8048cf1211951` | `ebc1650d131e595c3659834d55206172f3e7a9c1fb2511956fe8048cf1211951` |          yes           | Hakumei and Mikochi holding rope on rocky mountain slope beside menacing dark silhouette of giant predator owl Oroshi ("オロシって奴の縄張りらしい")                  |
| `48/p48-03.png` | `9dededb97de0b15495d93613679d17834b84d4f825d137c539b84f3baaabb3af` | `9dededb97de0b15495d93613679d17834b84d4f825d137c539b84f3baaabb3af` |          yes           | Giant owl swooping overhead ("バッ サッ") with extreme close-up of bird eye texture ("ザッ") as Hakumei and Mikochi freeze in panic holding rope                      |
| `48/p48-04.png` | `cb07a5f9e8064c27c52d2e08e702a884968e1fc3b2d10bf8e314e5a36c6ae2d7` | `cb07a5f9e8064c27c52d2e08e702a884968e1fc3b2d10bf8e314e5a36c6ae2d7` |          yes           | Chapter 15 ("第15話 長い一日 (一) 蜂蜜館の人々") opening on cobblestone stairs amidst detailed stone archways, balconies, and masonry walls                           |
| `48/p48-05.png` | `fc05d9800420ec2e5e069858f03b5f079d0bd7e9f0c36fd7a47e2e07d531b8a3` | `fc05d9800420ec2e5e069858f03b5f079d0bd7e9f0c36fd7a47e2e07d531b8a3` |          yes           | Intricate brick and stone masonry alleyway ("ここは無法地帯ですわ") with Hakumei, Mikochi, and companion walking past arched doorways and street lamps                |
| `48/p48-06.png` | `026fb77c2bc10256c58370b8f54680e64425fa56ac52f1b80e509bfbae584620` | `026fb77c2bc10256c58370b8f54680e64425fa56ac52f1b80e509bfbae584620` |          yes           | Stone street conversation encountering injured squirrel Nobuki ("ノブキ どうしたの？ やられた", "古参の奴ら……!!") in front of stone wall                              |
| `50/p50-01.png` | `183bd1275489338ba4acee84a819098fa32b96d5264e6611b34035963edfbdc8` | `183bd1275489338ba4acee84a819098fa32b96d5264e6611b34035963edfbdc8` |          yes           | Wakako sitting alone at restaurant counter sipping chilled sake alongside freshly served grilled salmon on plate ("焼き鮭には 冷が合う")                              |
| `50/p50-02.png` | `6e4604c5218c2e9bb21c93bc449358f804c9d3862fe921cef010d7af6be05f4b` | `6e4604c5218c2e9bb21c93bc449358f804c9d3862fe921cef010d7af6be05f4b` |          yes           | Close-up of grilled salmon skin peeling with chopsticks ("じわノ") and Wakako's satisfied "ぷしゅー" expression with big round eyes ("日本酒と鮭の皮は こたえられん") |
| `50/p50-03.png` | `8f7533b0b7eefcd5f75443a4837fcd533e8d443bfc0db7dd68f1252296c5c413` | `8f7533b0b7eefcd5f75443a4837fcd533e8d443bfc0db7dd68f1252296c5c413` |          yes           | Izakaya counter view with chef and neighboring salarymen ordering salmon ("オレさぁ 鮭の皮 超好きなんだよね") while Wakako watches secretly                           |
| `50/p50-04.png` | `652b977d84d40b83b90925ae8fe5df6a991745a1d97a493b1aa645c96c55fc89` | `652b977d84d40b83b90925ae8fe5df6a991745a1d97a493b1aa645c96c55fc89` |          yes           | Salarymen receiving rice sets, Wakako finishing meal contentedly and looking over counter ("ご飯セットにしてください")                                                |
| `50/p50-05.png` | `109e006070bd7ec1f27fe8662c57571c712fca8138e9a8b010953de28dc007fb` | `109e006070bd7ec1f27fe8662c57571c712fca8138e9a8b010953de28dc007fb` |          yes           | Night 2 ("2夜 焼き鳥") opening stroll on stone pathway ("おさんぽでいい汗かいた") entering yakitori restaurant through hanging noren curtain ("とりあえず生ビール")   |
| `50/p50-06.png` | `f18bc6a7e2806e544438b6124aa728fd37280751fd7866efe56ad7b56e5c3f44` | `f18bc6a7e2806e544438b6124aa728fd37280751fd7866efe56ad7b56e5c3f44` |          yes           | Wakako drinking first draft beer at yakitori counter ("一杯目のビール さながら水分補給", "ぷしゅー") and ordering assorted skewers ("つくねとぼんじりと手羽先")       |

**Result:** `24/24 HASH_MATCH`.

---

## 3. Factor evaluation matrix

| position | workId                      | artRealism | artDensity | visualSoftness | motionImpact |
| :------: | :-------------------------- | :--------: | :--------: | :------------: | :----------: |
|    41    | `work-c9e32218e26c6c6292f9` |     2      |     2      |       2        |      U       |
|    47    | `work-ec6767cc7d294c2b0d67` |     1      |     1      |       3        |      U       |
|    48    | `work-f59be454d59478f33914` |     2      |     4      |       3        |      U       |
|    50    | `work-f6fa4c2d3a7e1dc5257b` |     1      |     1      |       3        |      U       |

---

## 4. Axis observations, evidence references, limitations, and confidence

### Position 41: `work-c9e32218e26c6c6292f9` — ファントムバスターズ

- **`artRealism` = 2**
  - _Refs:_ `41/p41-01.png`, `41/p41-03.png`, `41/p41-05.png`
  - _Observation:_ Characters feature standard commercial shonen manga proportions, stylized expressive facial deformation (exaggerated toothy grins, comical yelling mouth, sweatdrops, simplified pupil highlights), combined with conventionally proportioned high school student bodies and grounded uniform/schoolroom architecture. Matches anchor 2 (일반적 스타일화).
  - _Limitation:_ Sample evaluated from Shueisha official volume 2 reader across apartment notice and school lunch/student-council contexts.
  - _Confidence:_ 0.88
- **`artDensity` = 2**
  - _Refs:_ `41/p41-02.png`, `41/p41-04.png`, `41/p41-05.png`
  - _Observation:_ Balanced panel layouts with clear white space in dialogue-driven comedy frames, complemented by standard screentones, speed-line bursts, and moderate background details (cafeteria tables, student council desks, blinds, doorway fixtures). Matches anchor 2 (균형).
  - _Limitation:_ Opening volume 2 pages evaluated.
  - _Confidence:_ 0.88
- **`visualSoftness` = 2**
  - _Refs:_ `41/p41-01.png`, `41/p41-03.png`, `41/p41-05.png`
  - _Observation:_ Crisp digital ink linework with clean, sharp hair spikes and well-defined contours, balanced with smooth gradient screentone shading and neutral black-and-white tonal contrast. Matches neutral anchor 2 (중립).
  - _Limitation:_ Digital screentone rendering evaluated.
  - _Confidence:_ 0.88
- **`motionImpact` = U**
  - _Unmet gate:_ Sampled body pages depict dialogue, comedic reaction poses, and a doorway entrance. No continuous dynamic action sequence with verified start, development, impact, and resolved endpoint exists.

---

### Position 47: `work-ec6767cc7d294c2b0d67` (`work-f1d22b68efa7fbd501ee`) — 僕の小規模な生活

- **`artRealism` = 1**
  - _Refs:_ `47/p47-01.png`, `47/p47-02.png`, `47/p47-05.png`
  - _Observation:_ Prominent caricature-based deformation on character figures (rounded heads, minimalist dot/slit eyes, curved simple mouths, squat ~3–4 head proportions) paired with recognizable real-world domestic objects (CRT TV, PC, iron, bed, buffet trays, station bench). Positioned between heavy deformation and standard manga stylization. Matches anchor 1 (강한 데포르메와 일반적 스타일화 사이).
  - _Limitation:_ Sample evaluated from Kodansha official volume 2 reader across chapter 26 (party preparation/attendance) and chapter 27 (iPod unpacking/PC setup).
  - _Confidence:_ 0.88
- **`artDensity` = 1**
  - _Refs:_ `47/p47-01.png`, `47/p47-04.png`, `47/p47-05.png`
  - _Observation:_ Clean, uncluttered multi-panel essay comic layout with simple, sparse line work, generous white space in speech balloons and background planes, and minimal background hatching. Matches anchor 1 (단순하고 여백이 많음과 균형 사이).
  - _Limitation:_ Evaluated across bedroom, party, street bench, and living room scenes.
  - _Confidence:_ 0.88
- **`visualSoftness` = 3**
  - _Refs:_ `47/p47-01.png`, `47/p47-05.png`, `47/p47-06.png`
  - _Observation:_ Hand-drawn, organic, rounded pen contours with gentle curves on character silhouettes and domestic furnishings, light warm screentone application, and an absence of sharp razor angles, mechanical straight lines, or heavy gritty dark ink shadows. Matches anchor 3 (중립과 부드러운 표현 사이).
  - _Limitation:_ Volume 2 digital reader sample evaluated.
  - _Confidence:_ 0.88
- **`motionImpact` = U**
  - _Unmet gate:_ Sampled scenes depict trying on clothes, walking into a reception, sitting on a bench, and operating a PC. No continuous dynamic action sequence exists.

---

### Position 48: `work-f59be454d59478f33914` — ハクメイとミコチ

- **`artRealism` = 2**
  - _Refs:_ `48/p48-01.png`, `48/p48-03.png`, `48/p48-04.png`
  - _Observation:_ Character designs feature stylized ~2.5-head miniature/chibi fairy-tale proportions with large expressive eyes, harmoniously integrated into meticulously realistic natural environments (accurately observed herb veins, rock strata, owl feather anatomy) and authentic stone masonry architecture. Matches anchor 2 (일반적 스타일화: 데포르메 캐릭터와 사실적 배경의 표준적 조화).
  - _Limitation:_ Evaluated across volume 2 forest foraging and volume 3 stone town scenes.
  - _Confidence:_ 0.90
- **`artDensity` = 4**
  - _Refs:_ `48/p48-01.png`, `48/p48-03.png`, `48/p48-04.png`, `48/p48-05.png`
  - _Observation:_ Extraordinary line and texture density. Every panel features dense cross-hatching, microscopic plant vein and leaf detail, detailed owl eye and feather texturing, intricate stone brick masonry, cobblestone pavement patterns, and detailed textile folds, leaving almost no unworked empty space. Matches anchor 4 (선·배경·정보 밀도가 높음).
  - _Limitation:_ Volume 2 and volume 3 BookWalker trial pages evaluated.
  - _Confidence:_ 0.92
- **`visualSoftness` = 3**
  - _Refs:_ `48/p48-01.png`, `48/p48-04.png`, `48/p48-06.png`
  - _Observation:_ Rounded organic pen strokes, warm storybook fairytale rendering, lush soft hatching textures, curved character silhouettes, and gentle tonal gradations creating a soft, inviting atmosphere without harsh sharp mechanical edges. Matches anchor 3 (중립과 부드러운 표현 사이).
  - _Limitation:_ Evaluated across forest and town contexts.
  - _Confidence:_ 0.88
- **`motionImpact` = U**
  - _Unmet gate:_ The forest owl swoop (`48/p48-03.png`) freezes at the close-up eye encounter without showing development, impact, or a resolved endpoint; the town scene depicts leisurely walking and dialogue. No complete bounded motion sequence is present.

---

### Position 50: `work-f6fa4c2d3a7e1dc5257b` — ワカコ酒

- **`artRealism` = 1**
  - _Refs:_ `50/p50-01.png`, `50/p50-02.png`, `50/p50-06.png`
  - _Observation:_ Main character is drawn with distinct simplified caricature features (large round head, oversized circular eyes with simple pupil dots/gradients, simple triangle mouth, expressive "ぷしゅー" face, squat proportions) combined with realistically illustrated culinary dishes (glistening grilled salmon skin, draft beer glass, yakitori skewers) and standard izakaya interior layout. Positioned between strong deformation and standard stylization. Matches anchor 1 (강한 데포르메와 일반적 스타일화 사이).
  - _Limitation:_ Evaluated from Cmoa volume 1 preview across the salmon restaurant episode and the yakitori episode.
  - _Confidence:_ 0.88
- **`artDensity` = 1**
  - _Refs:_ `50/p50-01.png`, `50/p50-03.png`, `50/p50-05.png`
  - _Observation:_ Airy, uncluttered panel composition with ample open white space surrounding dialogue balloons and figures, clean line work, smooth light screentones, and minimalist background hatching. Matches anchor 1 (단순하고 여백이 많음과 균형 사이).
  - _Limitation:_ Evaluated across both episode contexts.
  - _Confidence:_ 0.88
- **`visualSoftness` = 3**
  - _Refs:_ `50/p50-01.png`, `50/p50-02.png`, `50/p50-06.png`
  - _Observation:_ Smooth, rounded pen strokes, soft facial contours, gentle tonal screentones, and a relaxed cozy atmosphere with no aggressive hatching, sharp angular contours, or stark high-contrast ink blocks. Matches anchor 3 (중립과 부드러운 표현 사이).
  - _Limitation:_ Opening volume 1 body episodes evaluated.
  - _Confidence:_ 0.88
- **`motionImpact` = U**
  - _Unmet gate:_ Pages depict sitting at restaurant counters, drinking, eating, and walking on the street. No dynamic physical action sequence exists.

---

## 5. Audit of extreme values (0 and 4)

- **`work-f59be454d59478f33914` (`ハクメイとミコチ`, Pos 48) — `artDensity` = 4**
  - _Context 1 (vol2 P008–P010, `48/p48-01.png`–`48/p48-03.png` — Forest foraging & owl encounter):_ Meticulous fine hatching across dense herb foliage, detailed leaf veins, intricate rock strata, and dense microscopic feather/eye rendering of the giant owl with full panel coverage.
  - _Context 2 (vol3 P009–P011, `48/p48-04.png`–`48/p48-06.png` — Honey House stone masonry town):_ Highly intricate brick and stone masonry, individual cobblestone textures, detailed wooden balustrades, tiled roofs, and ornate clothing folds with dense cross-hatching throughout every panel.
  - _Confirmation:_ Both distinct narrative contexts consistently exhibit extreme line, background, and informational density, firmly satisfying anchor 4.
- No other static factor was assigned an extreme value of `0` or `4`.

---

## 6. Motion gate & unknown state confirmation

- All four works have `motionImpact = U`.
- None of the four sampled works contains an exact, continuous, and resolved action sequence with verifiable start, development, impact, and endpoint within the eligible body spreads.
- Under the factor dictionary rules, `motionImpact = U` represents an unknown state due to evidence boundary constraints and is not a numerical score, a low rating, or a catalog promotion blocker.

---

## 7. Storage and environment confirmation

- No temporary image file was copied, moved, deleted, renamed, or committed.
- No repository file was modified or edited during this read-only review process.
