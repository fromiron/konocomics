# Batch 004 Chunk 05 Gemini Art Review Response

## 1. Attestation and Execution Status

- **Exact model & effort:** `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`.
- **Execution status:** Completed normally in one turn with zero degradation, zero truncation, zero rate limiting, and zero model fallback or substitution.
- **Verification of inputs & pixel inspection:** All eight frozen input files and metadata ledgers were read and verified by SHA-256 hash. All 48 canonical payload images under `/tmp/konocomics-batch004-gemini-art05` were directly opened and inspected at original pixel detail.
- **Human review status:** `reviewedByHuman = false`.
- **Reviewer independence & boundaries:** Neither `local-art.csv`, `local-codex.md`, any adjudication, nor any other model conclusion was inspected or referenced. Muse was `NOT_USED`, and Cursor Grok was `ART_ABSTAIN`. Covers, synopses, animation adaptations, external reader opinions, Genre tags, text Factors, Gold set data, and prior model memory were strictly excluded from Art factor evaluation.
- **Payload & repository immutability:** No file in `/tmp/konocomics-batch004-gemini-art05` or the repository `/home/bell/Toys/konocomics` was created, copied, moved, deleted, edited, or committed.

---

## 2. Frozen Input Hashes and Payload Image Verification

### 2.1 Frozen Input Hashes

| Input Path | Expected SHA-256 | Computed SHA-256 | Match |
| :--- | :--- | :--- | :--- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | Yes |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-05/preflight.csv` | `7b012de84db4bba279b343960183b5f36885575bf31d6949b4c28f156988a81e` | `7b012de84db4bba279b343960183b5f36885575bf31d6949b4c28f156988a81e` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-05/ledger.md` | `23bc330597b4ee010924459b4832f0f9d62b1a8eefec36639b7421a0f37e1a9a` | `23bc330597b4ee010924459b4832f0f9d62b1a8eefec36639b7421a0f37e1a9a` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-05/gemini-payload-ledger.md` | `5b3b61616da9304c68ed2e14bd0d884a2fb49eb517b981a5aa9287246c94b98f` | `5b3b61616da9304c68ed2e14bd0d884a2fb49eb517b981a5aa9287246c94b98f` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-05/gemini-root-identity.json` | `3637dcbf9378a564b28f57fbfd14dbc3176aae228b23d6f78ae70b7656e7365f` | `3637dcbf9378a564b28f57fbfd14dbc3176aae228b23d6f78ae70b7656e7365f` | Yes |

- **Payload Root Directory:** `/tmp/konocomics-batch004-gemini-art05`
- **Payload Sorted Identity SHA-256:** `05f535d6dfac5c886c03635296f13b78a7fe65128a531b11cace239189e34bf9` (matches `gemini-payload-ledger.md` and `gemini-root-identity.json`).

### 2.2 Payload Image Pixel Inspection Table

| File | Expected SHA-256 | Computed SHA-256 | openedAtOriginalPixels | Unique Visible Cue |
| :--- | :--- | :--- | :---: | :--- |
| `41-reader-page-05.png` | `947711a16100920c4419dabdb725535050ecf88330a8e21b535d1ddc38adcd58` | `947711a16100920c4419dabdb725535050ecf88330a8e21b535d1ddc38adcd58` | yes | High-angle top panel showing students walking on school grounds past a large tree with chapter banner `第1話 縦長の空` and dialogue `まさか 入学が夏に ずれ込む とはね`; bottom panels show horned woman in dark dress by window speaking `最近 色々 流行ってるし 仕方ないの かなぁ` and `しかし この部屋を 見つけられる 人も もう60年は 見てないな` surrounded by shadow wisps with sound effect `ズズズ`. |
| `41-reader-page-06.png` | `df12f1b03f0d45a6932e9a7dd756769584b95937dd7b88a4a3a53d7b8382eb7c` | `df12f1b03f0d45a6932e9a7dd756769584b95937dd7b88a4a3a53d7b8382eb7c` | yes | Diagonal panel layout featuring horned woman closing eyes speaking `今年の新入生が 最後の望みだね` and `現れなかったら 今年で人間とも お別れだ` beside a monstrous apparition on the left and a young male protagonist with spiky hair and dark mark under his left eye walking into school on the right. |
| `41-reader-page-07.png` | `d3c18b52a287fc3bf4f90fc5a8aace35380e6754ff83838ac8fc3bbcf583341d` | `d3c18b52a287fc3bf4f90fc5a8aace35380e6754ff83838ac8fc3bbcf583341d` | yes | Full-page illustration of horned woman standing in three-quarter back view looking over her shoulder with flowing long dark hair and ribboned dress, with a massive centipede-like monster composed of multiple dangling humanoid arms/legs hanging above from the ceiling. |
| `41-reader-page-09.png` | `efc1ff199decab826f036817ec035e31ba4e75513c6b1220d072a1bf3715aae1` | `efc1ff199decab826f036817ec035e31ba4e75513c6b1220d072a1bf3715aae1` | yes | Classroom sequence where a male classmate smiles saying `膳野君 だったっけ？ 先刻消しゴム 拾ってくれて ありがとね`, followed by classmates asking him to buy bread (`それでさ パン買って くるのお願い してもいい？ 3人分 何でも いいんだけど 60円あったら 何個でも 買えぞぉ〜！`) while a dark-haired girl on the left watches thinking `初日から パシリか…`. |
| `41-reader-page-13.png` | `9bd8ffea180ef5ed06c104f90519c010150610fd272ca4844f0b9cc16bfd07b0` | `9bd8ffea180ef5ed06c104f90519c010150610fd272ca4844f0b9cc16bfd07b0` | yes | School hallway interaction where a boy with glasses tells protagonist `お前 変わってるよ 自分から パシリ肩代わり するとかよ`, and protagonist waves running off `あ…あっ ままあの そっそんなじゃ シャー` leaving the boy with glasses thinking `……飯 1人で 喰うのか`. |
| `41-reader-page-14.png` | `4a96259337c1fd4b17387784c4347e1ca6c8e2c6a545dd38c71b2d690deaaad8` | `4a96259337c1fd4b17387784c4347e1ca6c8e2c6a545dd38c71b2d690deaaad8` | yes | Protagonist walking through school corridor thinking `もっと自然に 助けられる ようになろう` while shadow apparitions (Genyo) drift around him, with narration explaining `幻妖という 人には 見えない 存在がいる それらは人の 怒りや悲しみ とかを察知して 集まってくる`. |
| `42-reader-page-09.png` | `0c53d7d956682d02f6aa4dbf3ed0e851ab2f6f77ca848eb9013069ce64af0946` | `0c53d7d956682d02f6aa4dbf3ed0e851ab2f6f77ca848eb9013069ce64af0946` | yes | Young man with black hair and glasses slurping cup ramen noodles while staring in shock at his flip phone (`それは ある日 突然に やって来た`), with flip phone screen displaying an email from Aki Doi (`久しぶり〜 元気してた？ 一年ぶりだね。ライブのお誘いなんですが、明日の夜どうかな？ サマソニにも出るバンドで…`). |
| `42-reader-page-10.png` | `c990d5ec5299ca87eb06eedc975a48efb3809afc1d049cf3bf59ae7ab95728f0` | `c990d5ec5299ca87eb06eedc975a48efb3809afc1d049cf3bf59ae7ab95728f0` | yes | Close-up of protagonist on mobile phone talking to an old crush (`あの……幸世君？ 久しぶり…… 私の事 覚えてる……？` with narration `三年前…… 三年前に 片思いして フラれた女から 電話が来た`), followed by another phone call from his first sexual partner (`そしたら 思い出したくない 初体験の女からも 電話が来て……`). |
| `42-reader-page-11.png` | `9c212bfe012608f7901b1a72b818df50fec7f7db36c3c0c1375ff10ec75a5f43` | `9c212bfe012608f7901b1a72b818df50fec7f7db36c3c0c1375ff10ec75a5f43` | yes | Full-page depiction of protagonist with three heads and multiple arms holding phones frantically taking simultaneous call-waiting and emails (`藤本先輩！？ あのー 私の事 分かりますか？`, `ププププププ`, `俺のキャパは 一気に溢れかえった`) sitting cross-legged behind steaming ramen noodles. |
| `42-reader-page-12.png` | `bc4983530f3501977605f1b7d9d986306bedfc8a0e36413cf7d20cafc34eea79` | `bc4983530f3501977605f1b7d9d986306bedfc8a0e36413cf7d20cafc34eea79` | yes | Surreal fantasy festival scene with protagonist wearing a loincloth (`fundoshi`) standing atop a sacred palanquin (`mikoshi`) beneath bursting fireworks, surrounded by adoring women reaching up shouting `これが 好き 好き 抱いてッ 抱いてッ もっと もっと`. |
| `42-reader-page-18.png` | `39e41e7a0edc16b887868b75b56487981b97b2d07b69020e577dbf849cd8799c` | `39e41e7a0edc16b887868b75b56487981b97b2d07b69020e577dbf849cd8799c` | yes | Protagonist lying back on his pillow tossing phone aside (`めんどくせ…`), but getting up (`ムクッ`) to compose a polite decline email to Aki Doi (`社会人として 断りのメール くらい…… 土井亜紀…… 何を今更 スケスケと……`). |
| `42-reader-page-19.png` | `3fb6e7c153aee5e862f35fd7a7fa1ec6113c60a337fe0fa8127cca503259efec` | `3fb6e7c153aee5e862f35fd7a7fa1ec6113c60a337fe0fa8127cca503259efec` | yes | Flashback to office environment where Aki Doi wearing glasses and a shawl approaches protagonist by the copy machine asking `藤本さん 週末のフジロック 行かれるって 聞いたんですが…`, with a densely drawn crowded open-plan office at the bottom filled with paperwork and colleagues. |
| `43-episode-01-page-005.jpg` | `07da429fd50180481162f8a9bdba5a9d103cf290e92591fcd86d541712e46b03` | `07da429fd50180481162f8a9bdba5a9d103cf290e92591fcd86d541712e46b03` | yes | Apartment entryway scene where high school boy enters (`おじゃまします`) carrying a sports bag, and glasses-wearing woman Yakumo pinches and stretches both his cheeks with sound effect `ぷに` saying `まーた眉間に シワよってる わよ！`. |
| `43-episode-01-page-006.jpg` | `36aa2ebe87039d3d58f4a65fe0d687d2ae54fdc031cea63ec647e7b726feb224` | `36aa2ebe87039d3d58f4a65fe0d687d2ae54fdc031cea63ec647e7b726feb224` | yes | Yakumo in knit turtleneck and apron asking boy taking off his jacket `先 に テーブル 拭いててね 今日も 遅く まで 練習 疲れたでしょ`, with boy replying `ウス いや 大丈夫っス`, and narrative box introducing `彼は 大和翔平クン 高校一年生 名門の野球部で 早速レギュラーに 選ばれたらしい`. |
| `43-episode-01-page-007.jpg` | `9377e28da1b083682663abe3a5a8013d9ad076cdffb15cd510339916c87bffc1` | `9377e28da1b083682663abe3a5a8013d9ad076cdffb15cd510339916c87bffc1` | yes | Kitchen cooking scene where Yakumo prepares a salad with cherry tomatoes and lettuce on a wooden cutting board (`そんな彼に 私は――`), then places her hand on his back by the kitchen sink (`あの日から 毎晩――`). |
| `43-episode-01-page-008.jpg` | `ee11fec46e8595d79539ca01c98318cb35f95a780c2b47c8c7ff361d2592a8ff` | `ee11fec46e8595d79539ca01c98318cb35f95a780c2b47c8c7ff361d2592a8ff` | yes | Full-page emotional scene with soft bokeh light bubbles in the background where Yakumo feeds a cherry tomato directly into the mouth of blushing Shohei, with large narration box `餌づけを している`. |
| `43-episode-01-page-009.jpg` | `ac210039353cb221ba2fd1b9e2b619b2f120ac9d55b78d704c179316eac3ae28` | `ac210039353cb221ba2fd1b9e2b619b2f120ac9d55b78d704c179316eac3ae28` | yes | Yakumo eating a snack asking `で どうだった？ だって今日 初試合だったん でしょ！？`, reacting excitedly (`わくわく`) when he says `勝ちましたよ`, exclaiming `よかったぁ！ お祝いでお 今日はごちそう なんだから！！`. |
| `43-episode-01-page-010.jpg` | `575dc156bd28c569d5fa79e74828dfa85a2564156512bfbfb25f95f5bfe444c0` | `575dc156bd28c569d5fa79e74828dfa85a2564156512bfbfb25f95f5bfe444c0` | yes | Yakumo presenting a giant platter of two large hamburger patties topped with fried eggs (`じゃーんっ！ 今夜は特大ハンバーグ 目玉焼きのせだよー！！ 大和クンは今日 がんばったから 特別に二個です！！`) and teasing Shohei (`ふふ…！ 今ピクッとしたのを 見逃さなかったわよ！！`). |
| `45-reader-page-07.png` | `3c95e75a095d1436b2d0962943dad12588acf8b559896887104d27b99411b3fe` | `3c95e75a095d1436b2d0962943dad12588acf8b559896887104d27b99411b3fe` | yes | Dark classroom scene with heavy cross-hatching and intense ink shadows depicting a physical/sexual confrontation between students at the back of an empty classroom (`あっ んっ ――それは この学校に 入学して2年目`, `色んなものを見た 色んな経験をしてきた`, `いち子っ`, `――でも ひとつだけ 知らない 事があった`). |
| `45-reader-page-08.png` | `46f03b94916fd62ced9bdee1ee1797fdc8e52aac6294f0e8168cd02aefe2d089` | `46f03b94916fd62ced9bdee1ee1797fdc8e52aac6294f0e8168cd02aefe2d089` | yes | Full-page dramatic close-up of entangled figures in classroom with exposed thigh/torso, heavy black inking, and perspiration droplets, with text boxes `たまに 校舎で すれ違う` and `“あの先生”の 担当教科`. |
| `45-reader-page-09.png` | `298e9ed22e60bfc24721c5d37db7fa20b559b7a13a98e79ade57f2d2b14c3c89` | `298e9ed22e60bfc24721c5d37db7fa20b559b7a13a98e79ade57f2d2b14c3c89` | yes | Classroom sliding door opens with sound effect `ガララッ` revealing ethics teacher Takayanagi in a turtleneck sweater holding a binder, looking at the students in the dark classroom. |
| `45-reader-page-13.png` | `5be6e7a38e704e65a52fa836b6828011b3730557d8100df2647e22ffb8f63c1b` | `5be6e7a38e704e65a52fa836b6828011b3730557d8100df2647e22ffb8f63c1b` | yes | Time skip box `1年後` showing exterior school building, school hallway with girls talking about elective classes (`えー えみたん 選択授業 何にしたの？ 体育だよ！`), and a classroom door with a sign reading `倫理`. |
| `45-reader-page-14.png` | `4e3658d09d46088048da46a58428ad96a63f8e590c5c0ba68a92fe0888a6333d` | `4e3658d09d46088048da46a58428ad96a63f8e590c5c0ba68a92fe0888a6333d` | yes | High-angle bird's-eye perspective of the ethics classroom showing scattered individual students sitting at desks in deep black shadow and intense contrast, each lost in thought or slouching. |
| `45-reader-page-15.png` | `d9d22145d8e384f9056ccb1428c0dbe51d2882d0581f0a6f958f7d25465e2862` | `d9d22145d8e384f9056ccb1428c0dbe51d2882d0581f0a6f958f7d25465e2862` | yes | High-angle perspective of the other half of the ethics classroom showing female students at desks with stark heavy solid black cast shadows and sharp ink contours. |
| `46-reader-page-05.png` | `74e86217e6ed167c727e01b65c68a144fc0c80bdd61852288ecee35f9659e087` | `74e86217e6ed167c727e01b65c68a144fc0c80bdd61852288ecee35f9659e087` | yes | Four-panel cinema-ratio format showing smartphone-recorded home video: parents posing with peace signs (`誕生日に スマホ買ってもらいました お父さんと お母さんで〜す`), protagonist Yuta's upside-down selfie perspective (`僕でーす こないだ 中学生に なりました`), and birthday cake with plate inscribed `優太12さい` as mother says `優太 お母さんね 優太に… 優太に 一つお願いが あるんだ`. |
| `46-reader-page-06.png` | `b49e8043fbe1fe80a4492d10fdcf564746eae777eef43a9647403ceede492836` | `b49e8043fbe1fe80a4492d10fdcf564746eae777eef43a9647403ceede492836` | yes | Four-panel sequence with mother speaking about her terminal illness (`お母さん 病気で 死んじゃう かもしれない でしょ？ その事… 優太は どう思う？`), followed by quiet window framing where father looks down (`…今する 話じゃ ないなー と思う`), and birthday cake at the bottom (`あのね…… 優太 あのね……`). |
| `46-reader-page-07.png` | `55ae0caf792591326335ae4a74fbb3b73a0d92822ead715ab8406587eab0b006` | `55ae0caf792591326335ae4a74fbb3b73a0d92822ead715ab8406587eab0b006` | yes | Four-panel sequence where mother asks `お母さんをね これから お母さんをね 優太に 動画で 撮って ほしいの`, looking directly into the smartphone camera lens (`動画なら お母さんの 声も動きも 見返せるから… …撮って くれる？`). |
| `46-reader-page-08.png` | `915c268425725d5ded88105db98abcbe493ee477bcddcd4c8fdef635b30023d1` | `915c268425725d5ded88105db98abcbe493ee477bcddcd4c8fdef635b30023d1` | yes | Four-panel sequence with fixed camera angle showing father and mother across table as Yuta responds `おっけー……` and mother smiles softly saying `ありがと……`, ending on the whole birthday cake with unlit candles. |
| `46-reader-page-09.png` | `1936f47375b752e47a5e7ac72c6b6a4b5e5cbe8d03d68e87872ea95e566b40cf` | `1936f47375b752e47a5e7ac72c6b6a4b5e5cbe8d03d68e87872ea95e566b40cf` | yes | Four-panel sequence recording family memories: visiting an aquarium tank full of fish (`みんなで 水族館に 来ていまーす お父さんも 仕事が 休みなので いまーす`), mother showing parfait in kitchen (`タンタ タラ〜ン！ パフェ完成`), a stray cat walking on a wall (`野良猫`), and parents watching TV on the sofa (`お父さんと お母さんが テレビを 見ています 笑ってます`). |
| `46-reader-page-13.png` | `17e0bfc24a05cc1d0227ff57a2a412fa0d943c4e728ef9d85b0c5d8242e009c9` | `17e0bfc24a05cc1d0227ff57a2a412fa0d943c4e728ef9d85b0c5d8242e009c9` | yes | Four-panel sequence showing a framed family photo beside a desk telephone, father crying at his desk (`お父さんが 泣いてます`), hospital nurse introducing herself (`ナースの 田口さん です 田内です お母さんと 仲が 良いです`), and Yuta's scraped arm wound (`僕の ケガした 傷口です イタそ 〜！`). |
| `47-reader-page-05.png` | `3a2fb1d63e91b9dde484b90b940f7a2e2c2cda884a40a98a2f21600cd3810370` | `3a2fb1d63e91b9dde484b90b940f7a2e2c2cda884a40a98a2f21600cd3810370` | yes | Office sequence with black rotary telephone ringing (`…リリン… ジリリリリン…`), boy Alma carrying a laundry basket answering `あい 極楽街解決事務所っす` while stylish woman Tao in glasses smokes with feet up reading a book. |
| `47-reader-page-09.png` | `564b1a0573be6f3362d9cbaf14f77845469f2c6511c7e9196c7c3a7e881201ea` | `564b1a0573be6f3362d9cbaf14f77845469f2c6511c7e9196c7c3a7e881201ea` | yes | Grand architectural cityscape of Gokurakugai townscape viewed from above with ornate multi-tiered East Asian buildings, hanging lanterns, and bustling crowds (`おかしな 世の中に なった`), passing through the ornate decorative gate inscribed `極楽街` with narration discussing disappearing people and mysterious deaths (`こうも毎日 人が消える ものかね？ 最近は 怪死事件も 増えている そうだよ`). |
| `47-reader-page-13.png` | `3053075080af2a8e106c4edad2e8d1e824c5715df9ffbffb84ec3184a27c3fc5` | `3053075080af2a8e106c4edad2e8d1e824c5715df9ffbffb84ec3184a27c3fc5` | yes | Middle-aged man slamming money on table (`バンッ 依頼金50万……`), talking to Tao and Alma in the office before leaving (`どうもありがとう また何かあったら頼むよ`), while Alma pauses sniffing the air (`待った ドキッ この匂い……`). |
| `47-reader-page-14.png` | `c9851662ca425f3b936da21be0ea0d0dc4df71b1db0e9ee5a14a5cfb686bedb7` | `c9851662ca425f3b936da21be0ea0d0dc4df71b1db0e9ee5a14a5cfb686bedb7` | yes | Dramatic confrontation where Alma leans close to the client's ear saying `嘘吐いてンだろ ヒュ〜〜ッ`, exposing the money envelope that contains only one real bill on top of blank paper (`あー！！！ まっしろ`). |
| `47-reader-page-15.png` | `7a6a289058a54bb4ea1b202b86d1872e53ace6013f915caa861d39cbe4d96fc6` | `7a6a289058a54bb4ea1b202b86d1872e53ace6013f915caa861d39cbe4d96fc6` | yes | Alma grabbing the fraudulent client by his lapels against the wall shouting `何 ガキみてえな ことしてんだ テメエ――！！ すぐバレる 嘘つくな！！`, while Tao calmly flicks her lighter (`カチッ`) reminding the client `何遍も 言わせんなよ 張さん アンタはもう ウチしか 頼れねぇ だろ？`. |
| `47-reader-page-19.png` | `ced67e7a45b9da7dc1c0a09420efe04923cfd28dd43d76e48fc6a905346d3031` | `ced67e7a45b9da7dc1c0a09420efe04923cfd28dd43d76e48fc6a905346d3031` | yes | Chinese diner scene where a waitress in double-bun hairstyle points to newspaper headline `死者・行方不明合わせて108人` telling Alma (eating with chopsticks) and Tao (holding the newspaper in leather gloves) about blood-drained corpses with bite marks (`変死体はみんな 大きな噛み痕があって…… 血が抜かれて カラカラなんだって`). |
| `48-reader-page-07.png` | `639b189cb5f18fc2c8d43a615331848499ae0e9d5a76ea6b90ac75fda398f28c` | `639b189cb5f18fc2c8d43a615331848499ae0e9d5a76ea6b90ac75fda398f28c` | yes | Middle school flashback of heroine Futaba with large luminous shojo manga eyes thinking `男子って 苦手 中学になって 益々 イヤだなー 乱暴だし うるさいし 色々雑だし`, watching boys roughhousing in hallway, then turning towards a quiet dark-haired boy (`でも そんな 男子の中で`). |
| `48-reader-page-08.png` | `532f3a928027d0e651be2a7198849231cae94729c015df63a022a9ded90c3356` | `532f3a928027d0e651be2a7198849231cae94729c015df63a022a9ded90c3356` | yes | Delicate shojo portrayal of Tanaka-kun (`となりの クラスの 田中くんは なんか 違う 田中くんは 背が小さくて 声が低くなくて 女のコみたいで サラサラしてる だからかな`), with soft bokeh circles and fine light lines. |
| `48-reader-page-09.png` | `f70bbbdf4a098331fe7442f044aa254b3fa1ee42db5cd3f5184f641fa1398f52` | `f70bbbdf4a098331fe7442f044aa254b3fa1ee42db5cd3f5184f641fa1398f52` | yes | School yard scene where students play a team game (`グーパージャーンの 内藤―― ドロケー！？ 私もやりたーい`), with Tanaka-kun smiling among them. |
| `48-reader-page-13.png` | `8817ea796f4ccb7ffa6a2b9bf67d46cd3d70afbdd20b9fd1e9b3f4582cc421a6` | `8817ea796f4ccb7ffa6a2b9bf67d46cd3d70afbdd20b9fd1e9b3f4582cc421a6` | yes | Close physical proximity scene hiding behind school lockers/corner (`わっ あぶね 見つかる とこだった！`), Futaba noticing his scent (`シャンプーの 匂いと 少しだけ 汗の匂いする これが 男のコの匂い なのかな……`). |
| `48-reader-page-14.png` | `6c008ab2d40399ffc4c8c24d59262eaad38b532fe5a45b8c1938e92b474a8699` | `6c008ab2d40399ffc4c8c24d59262eaad38b532fe5a45b8c1938e92b474a8699` | yes | Tanaka acts as a decoy running out (`ザッ`) saying `吉岡さんは ここにいな` to lead pursuers away (`あっ やっぱりいた！！`), while Futaba blushes hiding in the gazebo. |
| `48-reader-page-15.png` | `c83a93d1b672f8f078ff78d92b9800b157182865a0757c057645b4a5174816f9` | `c83a93d1b672f8f078ff78d92b9800b157182865a0757c057645b4a5174816f9` | yes | Tanaka gets caught and sits in the jail circle (`ろうや`), Futaba resolves to rescue him (`味方が タッチ すれば だっごく 出来んだよね よし 助けなきゃ 待ってて 田中くん 今 私が`). |
| `49-reader-page-08.png` | `10b83f292cf4fd149e35718a0cacbb239591b71017f2452f00e71de9291fe555` | `10b83f292cf4fd149e35718a0cacbb239591b71017f2452f00e71de9291fe555` | yes | Rin with bruised face and bloody nose looking at his fingerless-gloved fist (`あーあ… また ケンカしちゃった… やっぱし おこられん のかな…`), startled by a pigeon landing nearby, looking up at sunset sky (`…なに やってんだ 俺…`). |
| `49-reader-page-09.png` | `39c603f03158ed5a95ed03f19aa7b7f855fc88ceae05ed66889dea7669232370` | `39c603f03158ed5a95ed03f19aa7b7f855fc88ceae05ed66889dea7669232370` | yes | Exterior of Southern Cross Boys' Monastery in True Cross Academy Town (`正十字学園町――南十字男子修道院`), followed by dining hall scene where monks and Yukio eat hot pot, and Father Shiro Fujimoto in round glasses greets Rin (`職安行って 朝帰りたぁ 勤勉だな なんか仕事 決まったのか`). |
| `49-reader-page-13.png` | `2c2f87f97b7eff4e4f2768fe64156a63e011a4cf28dba06c51ed05ef2de334df` | `2c2f87f97b7eff4e4f2768fe64156a63e011a4cf28dba06c51ed05ef2de334df` | yes | Yukio treating Rin's hand wound with disinfectant and bandages, discussing True Cross Academy (`正十字学園て 超名門なんだろ？ 双子の兄として俺は 鼻が高いね！`), Yukio explaining his dream to become a doctor (`僕は医者に なりたいから ただそのために 必死なんだ`), and Rin encouraging him (`お前なら ぜってー なれるよ！`). |
| `49-reader-page-14.png` | `a67ea55b7bb1e5c244a56cbbcbd8854ab8dd577ddbd8351716b71b64e9edd09d` | `a67ea55b7bb1e5c244a56cbbcbd8854ab8dd577ddbd8351716b71b64e9edd09d` | yes | Yukio talking to Rin about their father Shiro (`神父さんだって 兄さんが 心配なんだよ`), Rin reflecting (`…俺だって これでも アセってんだ 早くまともに なんなきゃやって さ…`), and Yukio suggesting an interview at a Japanese restaurant (`料亭の面接 受けてみたら？`). |
| `49-reader-page-15.png` | `3f8f01326776b133fe8f86675a69b76d26311ec532e8b1bdb22899e3e18f4258` | `3f8f01326776b133fe8f86675a69b76d26311ec532e8b1bdb22899e3e18f4258` | yes | Monks giving Rin a recruitment suit (`スーツだよ スーツ！ リクルートなんだから ビシッと決めなきゃな`), Rin struggling comically to tie the necktie (`わあ〜〜！？ なんだコレ どうやって ああなんの！？`), rushing out in hallway pausing at a girl praying (`お世話になりました 神父様…`). |
| `49-reader-page-19.png` | `e9294e7178a0d4acb54bc04a0cd6656873b3b6a1e0cb21a0035ed5d2f6ca872d` | `e9294e7178a0d4acb54bc04a0cd6656873b3b6a1e0cb21a0035ed5d2f6ca872d` | yes | Father Shiro tying Rin's necktie (`おらよ できた！`), laughing at Rin with funny faces, standing outside the monastery entrance (`くやしかったら 少しは 俺に 成長のほどを 見せてみろ！`), Rin glaring back adjusting his tie (`ナメやがって…！ 悩み相談と 一緒にすんな…！ ボケッ`). |

---

## 3. Terminal Positions 41–50 Art Factor Table

| Pos | Work ID | Canonical Title | `artRealism` | `artDensity` | `visualSoftness` | `motionImpact` |
| ---: | :--- | :--- | :---: | :---: | :---: | :---: |
| 41 | `work-c7280f9dcc2754d3f864` | 鵺の陰陽師 | 2 | 2 | 2 | U |
| 42 | `work-d63a83030a8819ff553c` | モテキ | 4 | 4 | 0 | U |
| 43 | `work-d8a87d01c1f35d58e791` | 八雲さんは餌づけがしたい。 | 2 | 2 | 4 | U |
| 44 | `work-e2f095e08fc5e08d5a2b` | 高嶺と花 | U | U | U | U |
| 45 | `work-e81955a9fc5c4d84580f` | ここは今から倫理です。 | 2 | 4 | 0 | U |
| 46 | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | 2 | 0 | 2 | U |
| 47 | `work-f8cb26831612e0c6ece5` | 極楽街 | 2 | 4 | 4 | U |
| 48 | `work-fc53cb5669aa4099ee4a` | アオハライド | 2 | 0 | 4 | U |
| 49 | `work-fd2a957c501c36047ed0` | 青の祓魔師 | 2 | 2 | 2 | U |
| 50 | `work-ff9b025f58d7e12f3cb1` | LOVE SO LIFE | U | U | U | U |

*Matrix dimensions: exactly 10 works and 40 terminal cells.*

---

## 4. Factor Evidence, Pixel Observations, and Unmet Gates

### Position 41: `work-c7280f9dcc2754d3f864` (鵺の陰陽師)

- **`artRealism = 2` (General stylization)**
  - **Exact refs:** `reader-page-05`, `reader-page-06`, `reader-page-07`, `reader-page-09`, `reader-page-13`, `reader-page-14` (six body pages spanning supernatural, classroom, and hallway contexts).
  - **Dictionary-anchored pixel observations:** Character artwork is governed by standard modern shonen manga stylization (`2: 일반적 스타일화`). Characters feature stylized anime facial geometry, large expressive eyes, spiky hair silhouettes, and clean facial contours (`reader-page-06`, `reader-page-09`, `reader-page-13`), while maintaining natural human body proportions, standard perspective, and anatomical consistency across all sampled contexts. Neither extreme cartoon deformation (0) nor photorealistic rendering (4) is observed.
  - **Limitation:** Evaluated exclusively on the official volume 1 sample (six body pages); color spreads and later chapters are outside the scope.
  - **Confidence:** `0.95`.

- **`artDensity = 2` (Balanced)**
  - **Exact refs:** `reader-page-05`, `reader-page-07`, `reader-page-09`, `reader-page-14`.
  - **Dictionary-anchored pixel observations:** Artwork exhibits a clean, balanced modern distribution of line art, background architecture, and screentone gradients (`2: 균형`). School backgrounds (`reader-page-05`, `reader-page-09`, `reader-page-14`) and monstrous apparitions (`reader-page-05`, `reader-page-07`) provide defined contextual depth without overwhelming hatch clutter (4) or minimal empty line art (0).
  - **Limitation:** Preview sample does not include potential double-page spreads from later battle arcs.
  - **Confidence:** `0.95`.

- **`visualSoftness = 2` (Neutral)**
  - **Exact refs:** `reader-page-06`, `reader-page-07`, `reader-page-09`, `reader-page-13`.
  - **Dictionary-anchored pixel observations:** Line work uses clean, controlled digital inking with smooth curves and balanced ink weighting (`2: 중립`). It avoids both abrasive dry-brush/heavy jagged hatching (0) and ultra-delicate shojo pastel/bokeh softness (4).
  - **Limitation:** Black-and-white digital preview body pages only; color textures cannot be evaluated.
  - **Confidence:** `0.95`.

- **`motionImpact = U` (Unknown)**
  - **Unmet gate:** The sampled pages contain atmospheric, supernatural, and school conversational scenes. No continuous, multi-panel start-development-impact-resolved action sequence is present. Under `annotation-guide.md` §3, isolated postures cannot establish motion impact, closing strictly as `U`.

---

### Position 42: `work-d63a83030a8819ff553c` (モテキ)

- **`artRealism = 4` (Realistic anatomy, backgrounds, and proportions)**
  - **Exact refs:** `reader-page-09`, `reader-page-10`, `reader-page-11`, `reader-page-12`, `reader-page-18`, `reader-page-19` (six body pages spanning domestic room and office contexts).
  - **Dictionary-anchored pixel observations:** Human anatomy, bone structures, facial features, and postures are drawn with grounded, nuanced realism (`4: 현실적인 인체·배경·비례`). Facial bone structures, realistic lip contours, unidealized adult expressions, detailed hands, realistic hair growth, and lifelike physical postures are consistently rendered across all scenes (`reader-page-09`, `reader-page-10`, `reader-page-18`, `reader-page-19`).
  - **Limitation:** Evaluated exclusively on six verified body pages of volume 1.
  - **Confidence:** `0.95`.

- **`artDensity = 4` (High line, background, and information density)**
  - **Exact refs:** `reader-page-09`, `reader-page-11`, `reader-page-12`, `reader-page-18`, `reader-page-19`.
  - **Dictionary-anchored pixel observations:** Panels are filled with rich cross-hatching, fine skin textures, fabric folds, and environmental detail (`4: 선·배경·정보 밀도가 높음`). The open-plan office scene (`reader-page-19`) displays intricate stacks of paperwork, photocopiers, desks, and coworkers. The mikoshi festival scene (`reader-page-12`) and bedroom phone sequences (`reader-page-09`, `reader-page-11`, `reader-page-18`) exhibit heavy, continuous textural hatching and high information density.
  - **Limitation:** Limited to black-and-white serialization body pages.
  - **Confidence:** `0.95`.

- **`visualSoftness = 0` (Rough, gritty, angular expression)**
  - **Exact refs:** `reader-page-09`, `reader-page-10`, `reader-page-11`, `reader-page-12`, `reader-page-18`, `reader-page-19`.
  - **Dictionary-anchored pixel observations:** Inking is distinctly rough, gritty, textured, and angular (`0: 거칠고 각진 표현`). Prominent cross-hatching across skin and clothing, sharp shadow edges, and dense unsoftened linework impart high tactile friction rather than soft or gentle finishes.
  - **Limitation:** Serialization preview sample scope only.
  - **Confidence:** `0.95`.

- **`motionImpact = U` (Unknown)**
  - **Unmet gate:** The sampled body pages cover psychological panic, domestic phone calls, and office conversations; no continuous start-development-impact-resolved dynamic action sequence is present. Closes strictly as `U`.

---

### Position 43: `work-d8a87d01c1f35d58e791` (八雲さんは餌づけがしたい。)

- **`artRealism = 2` (General stylization)**
  - **Exact refs:** `episode-01-page-005`, `episode-01-page-006`, `episode-01-page-007`, `episode-01-page-008`, `episode-01-page-009`, `episode-01-page-010` (six body pages spanning entryway/living and kitchen/cooking contexts).
  - **Dictionary-anchored pixel observations:** Characters are rendered with clean, expressive rom-com/slice-of-life stylization (`2: 일반적 스타일화`). Eyes are stylized and enlarged, comedic facial deformations occur (`episode-01-page-005`, `episode-01-page-009`, `episode-01-page-010`), while maintaining consistent human proportions, grounded domestic environments, and realistic food presentation.
  - **Limitation:** Evaluated on chapter 1 official preview sample.
  - **Confidence:** `0.95`.

- **`artDensity = 2` (Balanced)**
  - **Exact refs:** `episode-01-page-006`, `episode-01-page-007`, `episode-01-page-010`.
  - **Dictionary-anchored pixel observations:** Demonstrates a clean, balanced layout (`2: 균형`). Culinary preparations (textured hamburger patties, fried eggs, fresh salad on `episode-01-page-007` and `episode-01-page-010`) and hair rendering feature high precision, balanced against open, uncluttered domestic backgrounds.
  - **Limitation:** Sample bounded to entry episode domestic interior.
  - **Confidence:** `0.95`.

- **`visualSoftness = 4` (Soft, gentle, rounded aesthetic)**
  - **Exact refs:** `episode-01-page-005`, `episode-01-page-006`, `episode-01-page-007`, `episode-01-page-008`, `episode-01-page-010`.
  - **Dictionary-anchored pixel observations:** Line work is consistently soft, rounded, and gentle (`4: 부드럽고 미려한 표현`). Delicate curves define facial contours, knit clothing, and hair strands; warm blush marks and soft bokeh light circles (`episode-01-page-008`) create a gentle, comforting visual tone.
  - **Limitation:** Grayscale digital manga format only.
  - **Confidence:** `0.95`.

- **`motionImpact = U` (Unknown)**
  - **Unmet gate:** The sampled pages depict cooking, eating, and domestic conversation. No continuous action/combat sequence is present. Closes strictly as `U`.

---

### Position 44: `work-e2f095e08fc5e08d5a2b` (高嶺と花)

- **`artRealism = U` / `artDensity = U` / `visualSoftness = U` / `motionImpact = U` (Unknown-ready)**
  - **Unmet gate:** Hakusensha is not registered with a trusted internal preview route in `art-source-route-registry.csv`. Zero readable internal body pages were sampled. All Art factors close unknown without a blocker.

---

### Position 45: `work-e81955a9fc5c4d84580f` (ここは今から倫理です。)

- **`artRealism = 2` (General stylization)**
  - **Exact refs:** `reader-page-07`, `reader-page-08`, `reader-page-09`, `reader-page-13`, `reader-page-14`, `reader-page-15` (six body pages spanning dark classroom and daytime group contexts).
  - **Dictionary-anchored pixel observations:** The human figures and environment exhibit strong anatomical grounding, realistic body language, accurate high-angle perspective, and realistic bone structures (`reader-page-14`, `reader-page-15`), combined with stylized dramatic facial eyes and hair contours (`reader-page-07`, `reader-page-09`, `reader-page-13`), falling within expressive general stylization (`2: 일반적 스타일화`).
  - **Limitation:** Evaluated exclusively on volume 1 official sample.
  - **Confidence:** `0.95`.

- **`artDensity = 4` (High line, background, and information density)**
  - **Exact refs:** `reader-page-07`, `reader-page-08`, `reader-page-14`, `reader-page-15`.
  - **Dictionary-anchored pixel observations:** High density of line work, intricate hatching, and deep shadow textures (`4: 선·배경·정보 밀도가 높음`). High-angle classroom scenes (`reader-page-14`, `reader-page-15`) detail individual wooden desk grains across every single desk, heavy solid black cast shadows, and dense clothing drapery.
  - **Limitation:** Serialization preview sample scope only.
  - **Confidence:** `0.95`.

- **`visualSoftness = 0` (Rough, harsh, sharp, angular expression)**
  - **Exact refs:** `reader-page-07`, `reader-page-08`, `reader-page-09`, `reader-page-14`, `reader-page-15`.
  - **Dictionary-anchored pixel observations:** Inking is stark, harsh, angular, and sharp (`0: 거칠고 각진 표현`). High-contrast chiaroscuro lighting, heavy solid black ink fills, jagged shadow edges, and cutting contours create an austere, tense atmosphere.
  - **Limitation:** Grayscale print preview only.
  - **Confidence:** `0.95`.

- **`motionImpact = U` (Unknown)**
  - **Unmet gate:** The sampled pages feature intense emotional dialogue, classroom tension, and hallway walks. No continuous action/dynamic motion sequence is present. Closes strictly as `U`.

---

### Position 46: `work-eef84d07d90ba2b040cf` (さよなら絵梨)

- **`artRealism = 2` (General stylization)**
  - **Exact refs:** `reader-page-05`, `reader-page-06`, `reader-page-07`, `reader-page-08`, `reader-page-09`, `reader-page-13` (six body pages spanning dining table, video montage, and hospital contexts).
  - **Dictionary-anchored pixel observations:** Cinematic, naturalistic staging with realistic human proportions, natural facial asymmetry, lifelike camera perspectives (`2: 일반적 스타일화`), rendered with stylized manga ink outlines and character facial contours (`reader-page-05`, `reader-page-07`, `reader-page-13`).
  - **Limitation:** Evaluated on complete one-shot official preview sample.
  - **Confidence:** `0.95`.

- **`artDensity = 0` (Simple with abundant white space)**
  - **Exact refs:** `reader-page-05`, `reader-page-06`, `reader-page-07`, `reader-page-08`, `reader-page-13`.
  - **Dictionary-anchored pixel observations:** Layouts feature sparse, restrained linework with wide, open negative white space and minimalist flat tones (`0: 단순하고 여백이 많음`). Panels deliberately omit dense hatching or cluttered backgrounds (`reader-page-06`, `reader-page-07`, `reader-page-08`), focusing on clean silhouette contours and vast negative space.
  - **Limitation:** Sample does not cover later explosive climax sequences.
  - **Confidence:** `0.95`.

- **`visualSoftness = 2` (Neutral)**
  - **Exact refs:** `reader-page-05`, `reader-page-07`, `reader-page-09`, `reader-page-13`.
  - **Dictionary-anchored pixel observations:** Controlled, neutral pen lines with smooth straight edges and flat tones (`2: 중립`), balancing between sharp digital outlines and understated simplicity without aggressive roughness (0) or dreamy fluffiness (4).
  - **Limitation:** Grayscale digital sample only.
  - **Confidence:** `0.95`.

- **`motionImpact = U` (Unknown)**
  - **Unmet gate:** The sampled pages consist of static smartphone recordings, conversations across tables, and hospital visits. No continuous start-development-impact-resolved dynamic action sequence is present. Closes strictly as `U`.

---

### Position 47: `work-f8cb26831612e0c6ece5` (極楽街)

- **`artRealism = 2` (General stylization)**
  - **Exact refs:** `reader-page-05`, `reader-page-09`, `reader-page-13`, `reader-page-14`, `reader-page-15`, `reader-page-19` (six body pages spanning office, cityscape, and diner contexts).
  - **Dictionary-anchored pixel observations:** Highly polished modern stylization (`2: 일반적 스타일화`). Characters feature stylish anime facial features, sharp stylized hair, expressive eyes (`reader-page-05`, `reader-page-14`, `reader-page-19`), grounded by accurate human body proportions, realistic hand anatomy, and accurate architectural perspective.
  - **Limitation:** Volume 1 official preview sample scope only.
  - **Confidence:** `0.95`.

- **`artDensity = 4` (High line, background, and information density)**
  - **Exact refs:** `reader-page-05`, `reader-page-09`, `reader-page-13`, `reader-page-19`.
  - **Dictionary-anchored pixel observations:** Extraordinary information density across every panel (`4: 선·배경·정보 밀도가 높음`). The sweeping panoramic cityscape (`reader-page-09`) contains thousands of individual roof tiles, hanging lanterns, intricate shop signage, and bustling crowds. Interior scenes (`reader-page-05`, `reader-page-19`) render rich prop textures, leather gloves, newspaper print, and complex fabric folding.
  - **Limitation:** Grayscale serialized pages only.
  - **Confidence:** `0.95`.

- **`visualSoftness = 4` (Soft, beautiful, polished aesthetic)**
  - **Exact refs:** `reader-page-05`, `reader-page-09`, `reader-page-14`, `reader-page-19`.
  - **Dictionary-anchored pixel observations:** Linework is exceptionally sleek, delicate, and gorgeous (`4: 부드럽고 미려한 표현`). Smooth digital gradients, soft ambient lighting transitions, luminous skin and hair highlights, and refined, elegant strokes create a distinctly beautiful visual texture.
  - **Limitation:** Evaluated on grayscale preview pages.
  - **Confidence:** `0.95`.

- **`motionImpact = U` (Unknown)**
  - **Unmet gate:** The sampled pages cover office dialogue, townscapes, client confrontations, and diner conversations. No continuous dynamic combat sequence is present. Closes strictly as `U`.

---

### Position 48: `work-fc53cb5669aa4099ee4a` (アオハライド)

- **`artRealism = 2` (General stylization)**
  - **Exact refs:** `reader-page-07`, `reader-page-08`, `reader-page-09`, `reader-page-13`, `reader-page-14`, `reader-page-15` (six body pages spanning school hallway and outdoor yard contexts).
  - **Dictionary-anchored pixel observations:** Classic shojo manga stylization (`2: 일반적 스타일화`). Characters have large luminous eyes, delicate slender facial contours, and stylized hair, set against natural adolescent proportions and school settings.
  - **Limitation:** Volume 1 preview sample scope only.
  - **Confidence:** `0.95`.

- **`artDensity = 0` (Simple with abundant white space)**
  - **Exact refs:** `reader-page-07`, `reader-page-08`, `reader-page-09`, `reader-page-13`, `reader-page-14`, `reader-page-15`.
  - **Dictionary-anchored pixel observations:** Light, open, airy layouts with ample white space and minimal line clutter (`0: 단순하고 여백이 많음`). Panels feature fine minimalist linework, open unshaded backgrounds, and delicate light screentones with generous negative space.
  - **Limitation:** Sample bounded to early chapter 1.
  - **Confidence:** `0.95`.

- **`visualSoftness = 4` (Soft, gentle, rounded aesthetic)**
  - **Exact refs:** `reader-page-07`, `reader-page-08`, `reader-page-09`, `reader-page-13`, `reader-page-15`.
  - **Dictionary-anchored pixel observations:** Inking is delicate, gentle, and soft (`4: 부드럽고 미려한 표현`). Rounded contours, fine feather-light lines, soft bokeh light circles (`reader-page-08`), and tender emotional expressions produce a gentle aesthetic.
  - **Limitation:** Grayscale print preview only.
  - **Confidence:** `0.95`.

- **`motionImpact = U` (Unknown)**
  - **Unmet gate:** The sampled pages show students running during a school tag game and hiding behind corners. No continuous action/dynamic impact sequence is present. Closes strictly as `U`.

---

### Position 49: `work-fd2a957c501c36047ed0` (青の祓魔師)

- **`artRealism = 2` (General stylization)**
  - **Exact refs:** `reader-page-08`, `reader-page-09`, `reader-page-13`, `reader-page-14`, `reader-page-15`, `reader-page-19` (six body pages spanning rooftop, monastery interior, and monastery exterior contexts).
  - **Dictionary-anchored pixel observations:** Standard shonen manga stylization (`2: 일반적 스타일화`). Characters feature stylized anime faces, expressive comedic deformations (`reader-page-15`, `reader-page-19`), spiky hair, and balanced adolescent/adult human proportions.
  - **Limitation:** Volume 1 preview sample scope only.
  - **Confidence:** `0.95`.

- **`artDensity = 2` (Balanced)**
  - **Exact refs:** `reader-page-08`, `reader-page-09`, `reader-page-13`, `reader-page-15`, `reader-page-19`.
  - **Dictionary-anchored pixel observations:** Balanced visual density (`2: 균형`). The monastery architecture (`reader-page-09`, `reader-page-19`) and dining hall details are well-defined with clean screentones and linework, balanced against clear panel compositions without excessive clutter (4) or stark emptiness (0).
  - **Limitation:** Early chapter exposition sample only.
  - **Confidence:** `0.95`.

- **`visualSoftness = 2` (Neutral)**
  - **Exact refs:** `reader-page-08`, `reader-page-09`, `reader-page-13`, `reader-page-14`, `reader-page-19`.
  - **Dictionary-anchored pixel observations:** Standard shonen inking with crisp pen lines, solid black fills, and balanced hatching (`2: 중립`), avoiding both severe abrasive roughness (0) and delicate shojo softness (4).
  - **Limitation:** Grayscale digital sample only.
  - **Confidence:** `0.95`.

- **`motionImpact = U` (Unknown)**
  - **Unmet gate:** The sampled pages feature post-fight recovery, dining, wound treatment, and conversations outside the monastery. No continuous start-development-impact-resolved dynamic action sequence is present. Closes strictly as `U`.

---

### Position 50: `work-ff9b025f58d7e12f3cb1` (LOVE SO LIFE)

- **`artRealism = U` / `artDensity = U` / `visualSoftness = U` / `motionImpact = U` (Unknown-ready)**
  - **Unmet gate:** Hakusensha is not registered with a trusted internal preview route in `art-source-route-registry.csv`. Zero readable internal body pages were sampled. All Art factors close unknown without a blocker.

---

## 5. Audit of Endpoints (0/4) and Completeness Check

1. **Endpoint `artRealism = 4` Audit (Position 42):**
   - Evaluated across domestic room (`reader-page-09`, `reader-page-10`, `reader-page-11`, `reader-page-12`, `reader-page-18`) and workplace office (`reader-page-19`) contexts.
   - Grounded adult human anatomy, unidealized facial bone structures, lifelike posture, and realistic physical drapery are sustained across all contexts. Endpoint `4` is supported across all contexts.
2. **Endpoint `artDensity = 4` Audit (Positions 42, 45, 47):**
   - Position 42 (モテキ): Sustained across domestic bedroom and crowded office contexts; extensive cross-hatching, fabric texture, and dense background props supported across all contexts.
   - Position 45 (ここは今から倫理です。): Sustained across dark confrontation and high-angle classroom contexts; detailed woodgrain on every desk, deep black pooling, and rich hatching supported across all contexts.
   - Position 47 (極楽街): Sustained across office interior, town panoramic cityscape, and restaurant contexts; multi-tiered architecture, intricate signage, and rich textures supported across all contexts.
3. **Endpoint `artDensity = 0` Audit (Positions 46, 48):**
   - Position 46 (さよなら絵梨): Sustained across dining table, family video montage, and hospital contexts; sparse linework, open negative white space, and minimal background hatching supported across all contexts.
   - Position 48 (アオハライド): Sustained across hallway/classroom and outdoor yard contexts; airy open layouts, light delicate line art, and generous white space supported across all contexts.
4. **Endpoint `visualSoftness = 0` Audit (Positions 42, 45):**
   - Position 42 (モテキ): Sustained across domestic room and office contexts; gritty, textured cross-hatching and unsoftened angular contours supported across all contexts.
   - Position 45 (ここは今から倫理です。): Sustained across dark classroom and group daytime contexts; harsh high-contrast chiaroscuro, heavy solid blacks, and sharp angular ink lines supported across all contexts.
5. **Endpoint `visualSoftness = 4` Audit (Positions 43, 47, 48):**
   - Position 43 (八雲さんは餌づけがしたい。): Sustained across entryway/living and kitchen/dining contexts; soft rounded contours, delicate blush lines, and gentle aesthetic supported across all contexts.
   - Position 47 (極楽街): Sustained across office, cityscape, and diner contexts; polished digital gradients, luminous highlights, and refined elegant linework supported across all contexts.
   - Position 48 (アオハライド): Sustained across hallway/classroom and outdoor yard contexts; delicate curved lines, soft bokeh particles, and gentle shojo aesthetic supported across all contexts.
6. **Motion Cells Audit:**
   - All 10 motion cells (positions 41–50) are strictly `U`. No work contained a continuous start-development-impact-resolved dynamic action sequence.
7. **Unknown-Ready Matrix Audit:**
   - Positions 44 and 50 are strictly `U/U/U/U` (8 terminal `U` cells).
   - Across the 10 works (40 terminal cells), exactly 24 static cells are known and 16 cells are unknown.
8. **Unknown Semantics:**
   - `U` strictly denotes lack of verified evidence or unmet gate; it is never treated as a low numeric score or a promotion blocker.

---

## 6. Confirmation of System and Repository Integrity

- **No file mutations:** No image files under `/tmp/konocomics-batch004-gemini-art05` and no repository files in `/home/bell/Toys/konocomics` were copied, moved, deleted, created, modified, or staged for commit.
- **No out-of-scope actions:** No promotion recommendations, Local value comparisons, or adjudications were generated.
