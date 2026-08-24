# Independent Gemini Art Review — Batch 003 Chunk 04 (Positions 31–40)

## 1. Attestation and Execution Environment

- **Model ID & Resolved Label**: `gemini-3.7-flash-high` (effort: `high`).
- **Completion Status**: Normal completion without timeout, rate-limiting, degradation, fallback, or truncation.
- **Input & Pixel Access**: Full independent access to all 6 frozen inputs and all 33 uncompressed image payload files rendered at original pixel detail.
- **Human Review Flag**: `reviewedByHuman=false`.
- **Reviewer Isolation**: Local Codex output, Grok review, Muse evaluations, prior chunk reviews, adjudication tables, and final Art outputs were neither inspected nor utilized.
- **Remake Exclusion Attestation**: The full-color vertical remake `終末のワルキューレ 総天然色` (Whomor) was not inspected or used; only the original serialized monochrome/color-opening work was evaluated.
- **Filesystem Integrity**: Read-only operation strictly observed. No temporary images were copied, moved, deleted, or committed, and no repository files were edited.

---

## 2. Frozen Input Hashes and 33-Row Pixel-Access Proof

### Frozen Inputs Integrity

| Path                                                                                         | Expected SHA-256                                                   | Computed SHA-256                                                   | Match |
| :------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------- | :---- |
| `docs/factors/factor-dictionary.md`                                                          | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | Yes   |
| `docs/factors/annotation-guide.md`                                                           | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | Yes   |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` | Yes   |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv`                       | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` | Yes   |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-04/preflight.csv`      | `4bce1df481f80adf6d51719f989c48780db7adddda0b927bfee0eece4aabe17d` | `4bce1df481f80adf6d51719f989c48780db7adddda0b927bfee0eece4aabe17d` | Yes   |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-04/ledger.md`          | `bfc108991d9363f8780c927cd3976d63ea210193cff784c2229c746a4ec266cd` | `bfc108991d9363f8780c927cd3976d63ea210193cff784c2229c746a4ec266cd` | Yes   |

_Frozen inputs status: 6/6 HASH_MATCH._

---

### Complete 33-Row Pixel-Access Proof Table

| file                        | expectedSha256                                                     | computedSha256                                                     | openedAtOriginalPixels | uniqueVisibleCue                                                                                                                                                                            |
| :-------------------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tonari-step04.png`         | `08dbf05ad61aba2069261b93fb64d32fdbe6d88d3822e0bd2db8bff40bd5b087` | `08dbf05ad61aba2069261b93fb64d32fdbe6d88d3822e0bd2db8bff40bd5b087` | yes                    | Empty school desk with narration box ("となりの席の吉田くんは..."), batting center sign ("ミサワバッティングセンター"), and Shizuku holding envelope.                                       |
| `tonari-step08.png`         | `e65ff7f8d09276d366e1248fa9b08adbd2890364ea2d17053244f7f5bc18c1e9` | `e65ff7f8d09276d366e1248fa9b08adbd2890364ea2d17053244f7f5bc18c1e9` | yes                    | Staff room receipt labeled "領収書 コ様", teacher Saeko conversing with Shizuku, and Haru grasping Shizuku's uniform ("自分が行きたくないだけじゃん").                                      |
| `tonari-step15.png`         | `2355cd0d8b9c8b5d4188d2c34640e26cdefcab4d6e73b5d94242c273165935c2` | `2355cd0d8b9c8b5d4188d2c34640e26cdefcab4d6e73b5d94242c273165935c2` | yes                    | Shizuku resting chin on hand looking at empty desk on p. 28, and batting center receptionist wearing dark sunglasses pointing a finger asking "一発やってく？".                             |
| `shitsuren-step04.png`      | `7835452ef35e7d664e2d65b0ef59fc3fd387e66efb5c35c75806e104e4b93500` | `7835452ef35e7d664e2d65b0ef59fc3fd387e66efb5c35c75806e104e4b93500` | yes                    | Box of luxury assorted bonbon chocolates from "ラ・トゥリエ・ド・ボヌール (L'atelier de bonheur PARIS)" with floral border, Sota tasting chocolate, and Saeko smiling.                      |
| `shitsuren-step08.png`      | `5865eaba41276bda10a0e12628897ab7ddc39464ef744107f2ae11d484f7bfca` | `5865eaba41276bda10a0e12628897ab7ddc39464ef744107f2ae11d484f7bfca` | yes                    | Pastry kitchen ("patisserie TOKYO") with Sota stirring melted chocolate in a bowl, miniature fairy apparition ("妖精さん♡"), and female pastry chef in white toque hat.                     |
| `shitsuren-step15.png`      | `82e0766b55f6b3ef717656177a7c088a542128f4af95a9a3f8048025db673b8b` | `82e0766b55f6b3ef717656177a7c088a542128f4af95a9a3f8048025db673b8b` | yes                    | Snowy night scene where Sota shouts "別にいいじゃん!! 今まで通りでいいよ!! 二股でいいし!!", and large close-up of Saeko crying with visible tear trails.                                    |
| `silver-display04.png`      | `0684081b5c50bbebaa957ada97b908accf003cce3bbe47fc76f74e5120921e36` | `0684081b5c50bbebaa957ada97b908accf003cce3bbe47fc76f74e5120921e36` | yes                    | Massive snow-capped silver peak labeled "【序章】天狗に攫われた子", narration "高い高い… 大きい…大きい… 銀色のお山。", and Edo-period scholar holding brush and notes.                      |
| `silver-display06.png`      | `cb7c4d0b70c49291b441072c10b34b12b9a6664a1163c47a793ec1369e791190` | `cb7c4d0b70c49291b441072c10b34b12b9a6664a1163c47a793ec1369e791190` | yes                    | Night corridor framed by dense pinwheel stands (kazaguruma) and lantern light, fortune-teller elder, and scholar recording boy Torakichi's statement ("シッレイしました！").                |
| `silver-display09.png`      | `5d0ecc4fc0a8eeb06563695d0a534a207bcd196c673d3f5484aa7ab4df98bede` | `5d0ecc4fc0a8eeb06563695d0a534a207bcd196c673d3f5484aa7ab4df98bede` | yes                    | Deranged bloodstained tsujigiri rogue samurai with wide staring eyes and drawn katana ("死んで御座る… 辻斬り… ひいい！"), threatening scholar and Torakichi.                                |
| `samidare-slot08.jpg`       | `0495bc94723b9645e77b432c39e1d755b9962131f78717197c30c371778a220e` | `0495bc94723b9645e77b432c39e1d755b9962131f78717197c30c371778a220e` | yes                    | Web viewer scrambled tile slots showing lizard Noi on Yuuhi's shoulder ("...しかし 学ぶのは 大切なことだ"), university blackboard with equation, and bicycle riding.                        |
| `samidare-slot09.jpg`       | `76766547156ce8815adea1b5d317fbd5f4396d226937d3c007a028a7d59e1e63` | `76766547156ce8815adea1b5d317fbd5f4396d226937d3c007a028a7d59e1e63` | yes                    | Web viewer scrambled tile slots showing lizard Noi explaining "「掌握領域」" telekinesis powers and Yuuhi concentrating on ring on his hand.                                                |
| `samidare-slot10.jpg`       | `b80956f5e3612eae1f6a692a3baa97177f201684b34e56889617107a2b34c6fd` | `b80956f5e3612eae1f6a692a3baa97177f201684b34e56889617107a2b34c6fd` | yes                    | Web viewer scrambled tile slots showing Yuuhi levitating a small rock in mid-air with telekinesis while speaking with glasses-wearing professor Asahina ("朝日奈先生だ").                   |
| `samidare-slot14.jpg`       | `523f5960647e54f211db83a779be2fa2f97fd031ac59253e676eca03c355cbae` | `523f5960647e54f211db83a779be2fa2f97fd031ac59253e676eca03c355cbae` | yes                    | Web viewer scrambled tile slots showing lizard yelling "逃げろ!! 敵の気配だ!!" and Yuuhi fleeing across outdoor pathway ("言っとくけど ぼくは戦わないぞ！").                                |
| `samidare-slot15.jpg`       | `22938423582bdb747e8003aeab1d1c6f097f5eda20a70c28a263d9ade4580cc2` | `22938423582bdb747e8003aeab1d1c6f097f5eda20a70c28a263d9ade4580cc2` | yes                    | Web viewer scrambled tile slots showing Yuuhi sprinting up stairs panting ("ぜえぜえ... 心臓が破れるまで走り続けろ!!"), lizard shouting "追いつかれたっ...!!".                              |
| `samidare-slot16.jpg`       | `8317c0be1a45dbe8b4456d5afe83adb9514bba6091005bc72cd1b3c6cc29b164` | `8317c0be1a45dbe8b4456d5afe83adb9514bba6091005bc72cd1b3c6cc29b164` | yes                    | Web viewer scrambled tile slots showing manifestation of the sharp-toothed clay monster golem enemy ("魔法使いの使役する「泥人形」!!").                                                     |
| `ragnarok-step02-left.png`  | `c22d97ffd823763a6eabbc515f48d85bd517af2aad0270322a9f8000ea1d8dc1` | `c22d97ffd823763a6eabbc515f48d85bd517af2aad0270322a9f8000ea1d8dc1` | yes                    | Color page showing Brunhilde ("戦乙女13姉妹 長姉 ブリュンヒルデ") walking forward in white dress with Göll ("末妹 ゲル") looking anxious behind a pillar.                                   |
| `ragnarok-step02-right.png` | `1907a95a3694a40d8620173b5363942ee6013dfd8e11262c92512057aacafe5c` | `1907a95a3694a40d8620173b5363942ee6013dfd8e11262c92512057aacafe5c` | yes                    | Color page showing Brunhilde's white boots clicking ("カツン カツン") across ornate floor tiles overlooking floating Valhalla architecture.                                                 |
| `ragnarok-step03-left.png`  | `060f83e5790406b2ed3eee7f282e44585f5daa372ddff285033ad302116d9f3e` | `060f83e5790406b2ed3eee7f282e44585f5daa372ddff285033ad302116d9f3e` | yes                    | Color splash double-spread left half showing towering muscular deities looking down upon tidal waves swallowing drowning human souls ("終末を迎えようとしているのだ").                      |
| `ragnarok-step03-right.png` | `bb049234d0abc0725ec938d22cdec5559bfeea99bb63d5aa88f3cd39eb11b6a5` | `bb049234d0abc0725ec938d22cdec5559bfeea99bb63d5aa88f3cd39eb11b6a5` | yes                    | Color splash double-spread right half showing radiant bearded deity holding judgment gavel with roses and subtitle "第1話 神 vs 人類最終闘争".                                              |
| `ragnarok-step04-left.png`  | `61765cc989e49e12f5588eb135f80227f594c4b4401f878699067b63e20a337e` | `61765cc989e49e12f5588eb135f80227f594c4b4401f878699067b63e20a337e` | yes                    | Monochrome page showing gavel tapping ("コツン…") and Zeus ("ヴァルハラ評議会 議長 ゼウス（ギリシャ）") with sunken eyes sitting next to a huge sleeping horned dragon.                     |
| `ragnarok-step04-right.png` | `020a7ccde0f5704c2f180751cde62933821244480f132003868d35e1b4d2a9c1` | `020a7ccde0f5704c2f180751cde62933821244480f132003868d35e1b4d2a9c1` | yes                    | Overhead wide angle of the Valhalla Council amphitheater ("ヴァルハラ評議会 議事堂") filled with thousands of spectator gods and Zeus stroking his pet dragon ("ギュルル♡").                |
| `aoi-step04.png`            | `f1af297d160e3c4111956699f2e01c73748eaa02a32db5212ade5e1d5188abff` | `f1af297d160e3c4111956699f2e01c73748eaa02a32db5212ade5e1d5188abff` | yes                    | Chapter 1 opening splash ("第1章") showing Moyuru Hono holding "RAPPE" drink and Shonen Sunday, surrounded by parfaits, pudding, soft cream, and dreamy shojo heroine.                      |
| `aoi-step08.png`            | `499f1385911d0b0c263b30ccbed364013c9731f8f9c50430e7949ad4cb418122` | `499f1385911d0b0c263b30ccbed364013c9731f8f9c50430e7949ad4cb418122` | yes                    | Pages 16-17 spread showing tall Tonko-san in Osaka Arts shirt ("大芸大") with long legs, Hono lying on floor, and friend crying over rakugo cassette tape ("落語のテープ聴けよーーっ!!").   |
| `aoi-step15.png`            | `ddc1d02ca416c5c0fdad322694abdacf32ae67684ebc28b12688aaaa5cff4a54` | `ddc1d02ca416c5c0fdad322694abdacf32ae67684ebc28b12688aaaa5cff4a54` | yes                    | Pages 24-25/30 spread showing Hono in apartment cutting out Rumiko Takahashi manga pages from Shonen Sunday ("ちゃんと切りとってスクラップにしておくからな!!") by boiling pot.              |
| `rojikoi-step08.png`        | `ac2ed714f7d2d225a286330a105985b953a08170dd43aa823d8cb1f200f55284` | `ac2ed714f7d2d225a286330a105985b953a08170dd43aa823d8cb1f200f55284` | yes                    | Right page showing large traditional bamboo broom leaning against Japanese wall; left page showing Japanese Wikipedia article mockup on rock band "SHAKIN' HEADS".                          |
| `rojikoi-step15.png`        | `af9e40aa42c615a4ce3fc46187707912ddc654dae6d7cd0d0e549e1651c3d12f` | `af9e40aa42c615a4ce3fc46187707912ddc654dae6d7cd0d0e549e1651c3d12f` | yes                    | Illustrated bookbinding diagrams ("合紙製本", "手製本", "折帖", "布背ハードカバー"), Koharu with glasses looking wistfully at hand-bound book.                                              |
| `rojikoi-step20.png`        | `cd4d94071e81ffc3974c15ed55970c0fed852cacba9b169c6cf56574cb081753` | `cd4d94071e81ffc3974c15ed55970c0fed852cacba9b169c6cf56574cb081753` | yes                    | Night sky panel with glittering stars ("音符が星みたいにキラキラして キレイやな"), Towada looking up in profile, and Koharu binding pages by window ("一折一折 綴じ込んで").                |
| `hibirock-step04.png`       | `5be2869ed13b750255b75ad9d97e6156728d5f4d920b8222bc0e45a1bbffc5bb` | `5be2869ed13b750255b75ad9d97e6156728d5f4d920b8222bc0e45a1bbffc5bb` | yes                    | Live club stage with Takuro singing into microphone screaming with tears and sweat ("でも人気は死ぬほどありません"), smirking attendee in checkered jacket in foreground.                   |
| `hibirock-step08.png`       | `d544a0913020697a2f51ac838f8acd73e71380d4634aca819a104c06ddc835ff` | `d544a0913020697a2f51ac838f8acd73e71380d4634aca819a104c06ddc835ff` | yes                    | Pages 14-15 spread showing Takuro in black gakuran uniform with backpack walking down shopping street, blushing, and elderly man calling him "大仏様っ 大仏様っ".                           |
| `hibirock-step15.png`       | `03aa4e8df2a78fd14ec5fb95a05e936155cea868142f42a76e487e898a5e95b8` | `03aa4e8df2a78fd14ec5fb95a05e936155cea868142f42a76e487e898a5e95b8` | yes                    | Pages 28-29 spread showing street live spotlight, Takuro furiously tying towel headband around his forehead ("ぎゅっ 負け組に"), screaming into microphone ("クリスマス犬畜生").            |
| `kaiju-step04.png`          | `87f746d6f679103cfa0400b37716d6c26f7e4f3a9ddb87a8e85ac9ea1a870cc4` | `87f746d6f679103cfa0400b37716d6c26f7e4f3a9ddb87a8e85ac9ea1a870cc4` | yes                    | Ocean sailing yacht scene with woman in sunglasses observing boy Anglade ("ジムの刺青はまだ全身を覆っておらず..."), sailboat rigging and mast under open sky.                               |
| `kaiju-step08.png`          | `beafedd8fca6ee082231bae17850bb698faf1ccf2e51ccc5123292870ab7cf9c` | `beafedd8fca6ee082231bae17850bb698faf1ccf2e51ccc5123292870ab7cf9c` | yes                    | Pages 014-015 underwater night dive scene showing pointillist coral spawning eggs floating like stars ("星空を漂っているような……"), scuba divers with flashlights and fish.                 |
| `kaiju-step15.png`          | `0c29c294793e96a402eddd8a7c7581dc6b848ac8fb08e38c197c3acbd3335bbb` | `0c29c294793e96a402eddd8a7c7581dc6b848ac8fb08e38c197c3acbd3335bbb` | yes                    | Pages 016-017 / 028 sports sequence showing Ruka sprinting in handball practice ("いいぞ琉花！"), foot collision trip ("ガッ"), fall to floor ("いった…… 悪い悪い。"), and seated recovery. |

_Pixel-access verification: 33/33 HASH_MATCH._

---

## 3. Exact-Order 10-Row Art Factor Matrix

| position | workId                      | artRealism | artDensity | visualSoftness | motionImpact |
| :------: | :-------------------------- | :--------: | :--------: | :------------: | :----------: |
|    31    | `work-a7413b6e35e0d316a538` |     2      |     2      |       3        |      U       |
|    32    | `work-a7e0062c7153978fc6fe` |     2      |     2      |       3        |      U       |
|    33    | `work-a960372ed5efa4031896` |     2      |     3      |       1        |      U       |
|    34    | `work-aa6d796e2e04a55b94b1` |     2      |     2      |       2        |      U       |
|    35    | `work-ae0ac8a5acfc5fbb7dd6` |     3      |     4      |       0        |      U       |
|    36    | `work-b2be97620643b3342637` |     2      |     3      |       1        |      U       |
|    37    | `work-b708734262fb9b67f948` |     U      |     U      |       U        |      U       |
|    38    | `work-bd42208a660912d9d95d` |     2      |     2      |       3        |      U       |
|    39    | `work-c5e8c957903bf1832dc5` |     2      |     3      |       1        |      U       |
|    40    | `work-c805c5b70111f75d6fb5` |     4      |     4      |       3        |      2       |

---

## 4. Axis Observations, Exact References, Limitations, and Confidence

### Position 31: `work-a7413b6e35e0d316a538` (となりの怪物くん)

- **`artRealism` = 2**
  - _Refs_: `tonari-step04.png`, `tonari-step08.png`, `tonari-step15.png`.
  - _Observation_: Character anatomy follows standard shoujo manga stylization (slender proportions, large expressive eyes, simplified facial geometry) placed within clean modern high school and urban batting-cage environments (Anchor 2).
  - _Limitation_: Preview is limited to early school and neighborhood orientation scenes in Volume 1.
  - _Confidence_: 0.90
- **`artDensity` = 2**
  - _Refs_: `tonari-step04.png`, `tonari-step08.png`, `tonari-step15.png`.
  - _Observation_: Balanced line density with clean white panel gutters, moderate screen tone application for school uniforms and shadows, and clear compositional hierarchy (Anchor 2).
  - _Limitation_: Later volume crowded group sequences are not evaluated.
  - _Confidence_: 0.90
- **`visualSoftness` = 3**
  - _Refs_: `tonari-step04.png`, `tonari-step08.png`, `tonari-step15.png`.
  - _Observation_: Soft, delicate, rounded pen contours and smooth screentone gradients, placing the visual texture between neutral baseline (2) and high decorative softness (4).
  - _Limitation_: Restricted to initial encounter chapters.
  - _Confidence_: 0.88
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight motion gate unmet (`motionGateAttemptable=false`). The sampled panels depict static classroom conversations and brief comedic grabs without a bounded continuous start-development-impact-resolved-end action sequence.

---

### Position 32: `work-a7e0062c7153978fc6fe` (失恋ショコラティエ)

- **`artRealism` = 2**
  - _Refs_: `shitsuren-step04.png`, `shitsuren-step08.png`, `shitsuren-step15.png`.
  - _Observation_: Josei romance aesthetic with stylized elongated characters and expressive eyes, balanced by realistic depictions of culinary confectionery, kitchen implements, and Parisian storefront architecture (Anchor 2).
  - _Limitation_: Evaluated on entry-scope Volume 1 preview pages.
  - _Confidence_: 0.90
- **`artDensity` = 2**
  - _Refs_: `shitsuren-step04.png`, `shitsuren-step08.png`, `shitsuren-step15.png`.
  - _Observation_: Balanced compositional density; detailed rendering of chocolate boxes and pastry work surfaces contrasted against open emotional character close-ups and clean gutters (Anchor 2).
  - _Limitation_: Limited to 3 preview steps across 6 readable pages.
  - _Confidence_: 0.90
- **`visualSoftness` = 3**
  - _Refs_: `shitsuren-step04.png`, `shitsuren-step08.png`, `shitsuren-step15.png`.
  - _Observation_: Delicate, shimmering, and graceful linework with soft tonal gradations, fine hair rendering, and glossy textures on bonbons, placing the style between neutral (2) and peak delicate softness (4).
  - _Limitation_: Evaluated on early narrative arc scenes.
  - _Confidence_: 0.88
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight motion gate unmet (`motionGateAttemptable=false`). Focus is on conversational drama and culinary preparation without continuous dynamic kinetic sequences.

---

### Position 33: `work-a960372ed5efa4031896` (シルバーマウンテン)

- **`artRealism` = 2**
  - _Refs_: `silver-display04.png`, `silver-display06.png`, `silver-display09.png`.
  - _Observation_: Historical period manga combining stylized expressive character faces (large expressive eyes for child Torakichi, caricatured samurai facial features) with grounded Edo period clothing, weaponry, and architectural props (Anchor 2).
  - _Limitation_: Limited to Chapter 1 prologue preview.
  - _Confidence_: 0.88
- **`artDensity` = 3**
  - _Refs_: `silver-display04.png`, `silver-display06.png`, `silver-display09.png`.
  - _Observation_: Dense atmospheric stippling across the mountain landscape, hundreds of individual pinwheels lining the temple passage, and heavy hatching on the tsujigiri ronin's garments and face, exceeding neutral balance (2) toward high density (4).
  - _Limitation_: Sample capped at 6 readable body pages.
  - _Confidence_: 0.88
- **`visualSoftness` = 1**
  - _Refs_: `silver-display04.png`, `silver-display06.png`, `silver-display09.png`.
  - _Observation_: Crisp, angular ink linework with sharp, aggressive hatching on the confronting samurai and harsh black-and-white contrast, leaning toward rough/angular expression (1).
  - _Limitation_: Limited to early prologue encounter.
  - _Confidence_: 0.88
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight motion gate unmet (`motionGateAttemptable=false`). The sword encounter is a static drawn standoff without a continuous motion sequence from initiation to impact and resolved endpoint.

---

### Position 34: `work-aa6d796e2e04a55b94b1` (惑星のさみだれ)

- **`artRealism` = 2**
  - _Refs_: `samidare-slot08.jpg`, `samidare-slot10.jpg`, `samidare-slot14.jpg`, `samidare-slot16.jpg`.
  - _Observation_: Standard seinen/shonen action stylization with simplified character contours, expressive cartoon physics for the lizard knight Noi, and grounded contemporary campus/rooftop backgrounds (Anchor 2).
  - _Limitation_: Scrambled web-viewer tiles from official digital preview.
  - _Confidence_: 0.88
- **`artDensity` = 2**
  - _Refs_: `samidare-slot08.jpg`, `samidare-slot09.jpg`, `samidare-slot15.jpg`.
  - _Observation_: Balanced ink weight with clear line economy, open background negative space, and moderate screentone application for urban environments (Anchor 2).
  - _Limitation_: Sample limited to Episode 1 slots.
  - _Confidence_: 0.88
- **`visualSoftness` = 2**
  - _Refs_: `samidare-slot08.jpg`, `samidare-slot10.jpg`, `samidare-slot16.jpg`.
  - _Observation_: Neutral manga ink penwork with moderate line weight, balancing rounded character features with straight architectural/action hatching (Anchor 2).
  - _Limitation_: Sample restricted to opening chapter.
  - _Confidence_: 0.88
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight motion gate unmet (`motionGateAttemptable=false`). The chase and golem emergence fragments lack a complete, bounded start-development-impact-endpoint action sequence.

---

### Position 35: `work-ae0ac8a5acfc5fbb7dd6` (終末のワルキューレ)

- **`artRealism` = 3**
  - _Refs_: `ragnarok-step02-left.png`, `ragnarok-step03-left.png`, `ragnarok-step04-left.png`.
  - _Observation_: Hyper-articulated anatomical musculature, realistic bone/skin rendering, and monumental perspective combined with dramatic high-fantasy character stylization, placing it between standard stylization (2) and strict realism (4).
  - _Limitation_: Initial chapter council/prologue scenes evaluated.
  - _Confidence_: 0.90
- **`artDensity` = 4**
  - _Refs_: `ragnarok-step02-right.png`, `ragnarok-step03-right.png`, `ragnarok-step04-right.png`.
  - _Observation_: Extremely dense graphical detail throughout: thousands of individually rendered spectators in the Valhalla amphitheater tiers, intricate dragon scales, mosaic floor textures, and heavy cross-hatching across every panel (Anchor 4).
  - _Limitation_: Limited to Episode 1 opening sequence.
  - _Confidence_: 0.92
- **`visualSoftness` = 0**
  - _Refs_: `ragnarok-step03-left.png`, `ragnarok-step04-left.png`, `ragnarok-step04-right.png`.
  - _Observation_: Heavily chiseled, sharp, aggressive ink lines, dark sunken eye sockets, rigid angular hatching, and stark contrast creating a distinctly rough, jagged aesthetic (Anchor 0).
  - _Limitation_: Evaluated on monochrome and color prologue pages.
  - _Confidence_: 0.92
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight motion gate unmet (`motionGateAttemptable=false`). Opening chapter depicts council deliberation and apocalyptic visions; no bounded tournament combat sequence is present in the sample.

---

### Position 36: `work-b2be97620643b3342637` (アオイホノオ)

- **`artRealism` = 2**
  - _Refs_: `aoi-step04.png`, `aoi-step08.png`, `aoi-step15.png`.
  - _Observation_: Classic expressive shonen/seinen parody stylization with hyperbolic facial expressions, sweat bursts, and retro-manga stylistic tributes on realistic human anatomy and 1980s campus/apartment settings (Anchor 2).
  - _Limitation_: Limited to Chapter 1 preview.
  - _Confidence_: 0.90
- **`artDensity` = 3**
  - _Refs_: `aoi-step04.png`, `aoi-step08.png`, `aoi-step15.png`.
  - _Observation_: High-energy visual composition with heavy black fills, detailed cross-hatching on clothing, detailed studio props (magazines, cassette players, cooking burners), and ornate parody splashes, exceeding neutral balance (2).
  - _Limitation_: Limited to entry chapter sample.
  - _Confidence_: 0.88
- **`visualSoftness` = 1**
  - _Refs_: `aoi-step04.png`, `aoi-step08.png`, `aoi-step15.png`.
  - _Observation_: Dynamic, forceful, angular ink brushwork with jagged speedlines, sharp speech bubbles, and rigid hatching, placing it on the rough/angular side of neutral (1).
  - _Limitation_: Sample restricted to opening chapter.
  - _Confidence_: 0.88
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight motion gate unmet (`motionGateAttemptable=false`). Comedic dramatic posturing and magazine clipping lack a continuous physical action sequence.

---

### Position 37: `work-b708734262fb9b67f948` (ねこだらけ)

- **`artRealism` = U**
  - _Unmet Gate_: Preflight prerequisite gate unmet. Official publisher product page exposes 0 readable internal preview pages (`readableInternalPageCount=0`).
- **`artDensity` = U**
  - _Unmet Gate_: Preflight prerequisite gate unmet (0 readable internal preview pages).
- **`visualSoftness` = U**
  - _Unmet Gate_: Preflight prerequisite gate unmet (0 readable internal preview pages).
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight prerequisite gate unmet (0 readable internal preview pages).

---

### Position 38: `work-bd42208a660912d9d95d` (路地恋花)

- **`artRealism` = 2**
  - _Refs_: `rojikoi-step08.png`, `rojikoi-step15.png`, `rojikoi-step20.png`.
  - _Observation_: Grounded slice-of-life stylization with realistic human proportions, authentic Kyoto traditional craft workshops, bookbinding tools, and bamboo craft implements (Anchor 2).
  - _Limitation_: Sample limited to Volume 1 Chapter 1 preview.
  - _Confidence_: 0.90
- **`artDensity` = 2**
  - _Refs_: `rojikoi-step08.png`, `rojikoi-step15.png`, `rojikoi-step20.png`.
  - _Observation_: Clean line weight, open panel layouts, balanced white space, and selective placement of craft instructional diagrams and screen tone textures (Anchor 2).
  - _Limitation_: Limited to 3 preview steps across 6 readable body pages.
  - _Confidence_: 0.90
- **`visualSoftness` = 3**
  - _Refs_: `rojikoi-step08.png`, `rojikoi-step15.png`, `rojikoi-step20.png`.
  - _Observation_: Soft, delicate, rounded linework, gentle character contours, and atmospheric screentones creating a warm, calm visual aesthetic, leaning toward soft/delicate rendering (3).
  - _Limitation_: Evaluated on entry workshop arc.
  - _Confidence_: 0.88
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight motion gate unmet (`motionGateAttemptable=false`). Craftwork and conversational narrative contain no dynamic motion sequence.

---

### Position 39: `work-c5e8c957903bf1832dc5` (日々ロック)

- **`artRealism` = 2**
  - _Refs_: `hibirock-step04.png`, `hibirock-step08.png`, `hibirock-step15.png`.
  - _Observation_: Gritty underground seinen stylization featuring extreme emotional grimaces, heavy sweat, and exaggerated comedic caricature over grounded real-world human proportions and Tokyo streetscapes (Anchor 2).
  - _Limitation_: Volume 1 opening performance and street scenes.
  - _Confidence_: 0.88
- **`artDensity` = 3**
  - _Refs_: `hibirock-step04.png`, `hibirock-step08.png`, `hibirock-step15.png`.
  - _Observation_: Intense ink hatching, dense sweat droplets, crowded live club audience framing, and gritty screentone textures exceeding standard balance (3).
  - _Limitation_: Sample limited to 6 readable pages.
  - _Confidence_: 0.88
- **`visualSoftness` = 1**
  - _Refs_: `hibirock-step04.png`, `hibirock-step08.png`, `hibirock-step15.png`.
  - _Observation_: Raw, jagged, aggressive, sweaty, and scratchy ink strokes with sharp black contrasts, placing it on the rough/angular spectrum (1).
  - _Limitation_: Sample restricted to opening chapter.
  - _Confidence_: 0.88
- **`motionImpact` = U**
  - _Unmet Gate_: Preflight motion gate unmet (`motionGateAttemptable=false`). Musical performances show energetic emotional bursts but lack a continuous, bounded physical action sequence.

---

### Position 40: `work-c805c5b70111f75d6fb5` (海獣の子供)

- **`artRealism` = 4**
  - _Refs_: `kaiju-step04.png`, `kaiju-step08.png`, `kaiju-step15.png`.
  - _Observation_: Exceptionally realistic human anatomy, authentic athletic biomechanics in the handball sequence, accurate marine life biology, and precise nautical rigging perspective (Anchor 4).
  - _Limitation_: Evaluated across 3 distinct opening contexts in Volume 1.
  - _Confidence_: 0.94
- **`artDensity` = 4**
  - _Refs_: `kaiju-step04.png`, `kaiju-step08.png`, `kaiju-step15.png`.
  - _Observation_: Breathtaking line and information density: thousands of stippled coral eggs forming an underwater starfield, intricate fish scale textures, detailed yacht rigging, and dense organic shading (Anchor 4).
  - _Limitation_: Limited to 6 readable body pages.
  - _Confidence_: 0.94
- **`visualSoftness` = 3**
  - _Refs_: `kaiju-step04.png`, `kaiju-step08.png`, `kaiju-step15.png`.
  - _Observation_: Painterly, organic ink strokes, soft stippled tonal washes, and fluid contours balancing structural precision with delicate organic softness, placing the aesthetic between neutral (2) and soft/delicate (4).
  - _Limitation_: Sample restricted to entry volume preview.
  - _Confidence_: 0.90
- **`motionImpact` = 2**
  - _Refs_: `kaiju-step15.png` (printed pages 016–017).
  - _Observation_: Continuous handball sequence spanning run initiation / sprint ("いいぞ琉花！", "体が軽い…!!"), defender contact / foot trip ("ガッ"), slide-fall onto the floor ("いった……"), and seated aftermath with opponent apology ("悪い悪い。"). The sequence depicts grounded, natural, physical athletic kinetic motion without exaggerated shonen speedlines or shockwaves (Anchor 2: 보통).
  - _Limitation_: Single bounded physical sequence available in entry preview.
  - _Confidence_: 0.88

---

## 5. Audit of Extreme Static Values (0 and 4)

All static 0 and 4 assignments were audited across every available sample context:

1. **Position 35 (`終末のワルキューレ`) `artDensity` = 4**
   - _Context 1 (`reader-step-02`)_: Ornate multi-layered gown textures, marble floor reflections, and floating palace vistas.
   - _Context 2 (`reader-step-03`)_: Cosmic double-spread with thousands of drowning figures and intricate divine mandalas.
   - _Context 3 (`reader-step-04`)_: Colossal Valhalla amphitheater filled with thousands of individually tiered deities and detailed dragon anatomy.
   - _Conclusion_: All 3 contexts strongly support 4; value is sustained.

2. **Position 35 (`終末のワルキューレ`) `visualSoftness` = 0**
   - _Context 1 (`reader-step-02`)_: Sharp, hard-edged architectural contours and geometric panel borders.
   - _Context 2 (`reader-step-03`)_: Chiseled, muscular deities with dark hatching and high-contrast dramatic shading.
   - _Context 3 (`reader-step-04`)_: Sunken, dark eye sockets on Zeus with jagged cross-hatching and harsh black fills.
   - _Conclusion_: All 3 contexts support 0 (rough and angular); value is sustained.

3. **Position 40 (`海獣の子供`) `artRealism` = 4**
   - _Context 1 (`reader-step-04`)_: Precise nautical rigging, realistic facial bone structure, and naturalistic ocean horizon perspective.
   - _Context 2 (`reader-step-08`)_: Exact marine biology anatomy (coral, reef fish, crustaceans) and authentic scuba diving equipment.
   - _Context 3 (`reader-step-15`)_: Authentic athletic kinetic biomechanics, foot articulation, and weight transfer during the handball play.
   - _Conclusion_: All 3 contexts support 4 (realistic anatomy/background/proportions); value is sustained.

4. **Position 40 (`海獣の子供`) `artDensity` = 4**
   - _Context 1 (`reader-step-04`)_: Dense fine-line ocean hatching and complex yacht rigging details.
   - _Context 2 (`reader-step-08`)_: Intensive pointillist stippling across the two-page coral spawning underwater starfield.
   - _Context 3 (`reader-step-15`)_: Detailed athletic footwear treads, sports apparel folds, and textured court floor rendering.
   - _Conclusion_: All 3 contexts support 4 (high line/background/information density); value is sustained.

---

## 6. Closure and Gate Confirmations

1. **Position 37 (`ねこだらけ`)**: Preflight prerequisite failed (`readableInternalPageCount=0`). Returned `U/U/U/U`.
2. **Motion Gate for Positions 31–39**: Confirmed `U` for all positions 31 through 39 due to lack of a complete, bounded start-development-impact-resolved-end action sequence.
3. **Motion Gate for Position 40 (`海獣の子供`)**: Confirmed `motionImpact=2` based on the bounded handball sequence in `reader-step-15` (printed pages 016–017).
4. **Art Unknown Non-Blocker Principle**: Confirmed that `U` states represent absence of sufficient qualifying pixel evidence, not low values or catalog promotion blockers.
5. **Remake Exclusion**: Confirmed that the full-color vertical remake `終末のワルキューレ 総天然色` was excluded.
6. **Filesystem Integrity**: Confirmed that no repository or temporary files were edited, moved, copied, or deleted.
