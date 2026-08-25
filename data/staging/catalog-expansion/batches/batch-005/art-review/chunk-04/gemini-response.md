# Batch 005 chunk 04 independent Gemini Art review report

## 1. Attestation and capability proof

- **Reviewer / Exact model**: `gemini-3.7-flash-high` (Gemini 3.7 Flash High)
- **Effort**: `high`
- **Execution mode**: Read-only `plan` mode
- **Completion status**: Normal, complete execution without truncation, timeout, rate-limiting, degradation, abnormal termination, or fallback substitution.
- **Direct pixel inspection**: All 37 supplied image captures across positions 31–40 were opened and directly inspected at original pixels (`openedAtOriginalPixels=yes`).
- **Input and hash validation**: Every declared SHA-256 in `PAYLOAD.sha256`, `gemini-payload-ledger.md`, and all 10 frozen inputs was independently recomputed and verified against the canonical uncompressed root `/tmp/konocomics-batch005-gemini-art04.EOXSVN` and declared payload identity `61deabd357de4ae2fb3e80e42249e67861de2a44630ae8dca1026c503282c469`. Zero mismatches were found.
- **Human review declaration**: `reviewedByHuman=false`
- **Peer panel status**: Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN` (non-Art review; abstained from Art without direct pixel inspection).
- **Isolation and independence**: Strictly zero access to or inspection of Local reviewer conclusions, cover illustrations, synopsis texts, animated adaptations, user opinions, Genre classifications, text Factor drafts, Gold data, or prior model memory.

---

## 2. Frozen input verification and 37-image pixel inspection ledger

### 2.1 Frozen inputs SHA-256 verification

- **Canonical uncompressed root**: `/tmp/konocomics-batch005-gemini-art04.EOXSVN`
- **Declared payload identity SHA-256**: `61deabd357de4ae2fb3e80e42249e67861de2a44630ae8dca1026c503282c469`

| File | Expected SHA-256 | Recomputed SHA-256 | Verification |
| --- | --- | --- | :---: |
| `inputs/docs__factors__factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | MATCH |
| `inputs/docs__factors__annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__annotation-review-adjudication-request.md` | `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__art-preflight__chunk-04__preflight.csv` | `a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7` | `a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__art-preflight__chunk-04__ledger.md` | `f10dda88943066dcfb4fdcd92b863b338cca9a184f27947440d5af990415323c` | `f10dda88943066dcfb4fdcd92b863b338cca9a184f27947440d5af990415323c` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__reviews__daybreak-art-preflight-qa-chunk-04-round-4.md` | `4873b025adb2591e1d540af5a5faca268fd4d5e3b7511fbd42bfe2a7daac2b38` | `4873b025adb2591e1d540af5a5faca268fd4d5e3b7511fbd42bfe2a7daac2b38` | MATCH |
| `inputs/data__staging__catalog-expansion__batches__batch-005__art-review__chunk-04__gemini-request.md` | `1c8b7773d375faa557dd0ab7f1de79cb80bf97ce238fe65984eadf0fe6c74ea1` | `1c8b7773d375faa557dd0ab7f1de79cb80bf97ce238fe65984eadf0fe6c74ea1` | MATCH |
| `gemini-payload-ledger.md` | `f256c325262fc8a55d5b47e577664505dded65ecedba514674f4754842d1accd` | `f256c325262fc8a55d5b47e577664505dded65ecedba514674f4754842d1accd` | MATCH |

---

### 2.2 37-image pixel inspection ledger

| File | Expected SHA-256 | Computed SHA-256 | `openedAtOriginalPixels=yes` | Unique visible cue |
| --- | --- | --- | :---: | --- |
| `images/31-reader-trg-05.png` | `4cfa073d5a14a0b96489b1f43071376783f1646d10185556c7a7bc4a403cbfc0` | `4cfa073d5a14a0b96489b1f43071376783f1646d10185556c7a7bc4a403cbfc0` | yes | Two maids in French maid dresses armed with tactical firearms (smoking suppressed handgun and slung submachine gun) before estate mansion, lamp post, and palm trees. |
| `images/31-reader-trg-06.png` | `a5339bfcd3eb435bbd8072cf54ffacc31840d2f9303ee6d1d973ac23b1961811` | `a5339bfcd3eb435bbd8072cf54ffacc31840d2f9303ee6d1d973ac23b1961811` | yes | Dark-haired maid with glowing blank white eyes and blood-spattered apron standing on spiral staircase holding smoking pistol; dead body lying behind on upper steps. |
| `images/31-reader-trg-07.png` | `d4107485f859cb16f35ddf486e5222f52f06acba99f312c2479bdf4baab12ed5` | `d4107485f859cb16f35ddf486e5222f52f06acba99f312c2479bdf4baab12ed5` | yes | Light-haired maid wielding heavy machete/cleaver and submachine gun in mansion foyer drenched with blood splatters; corpse sprawled across pool table. |
| `images/31-reader-trg-08.png` | `a226eb9b3dd83a03770ce3751bd3ddc148988fd8916ec815660061deef98dd68` | `a226eb9b3dd83a03770ce3751bd3ddc148988fd8916ec815660061deef98dd68` | yes | Close-up of the two maids smiling with blood on cheeks reporting "すべて片付きましてございます、御主人様。"; suited handler smiling in car interior ("こりゃ破格にイイ買い物をしたかもしれん。"). |
| `images/31-reader-trg-10.png` | `f8c11221c16397f9812eaacf0bf4039aa681043294304788418445de2e2441e6` | `f8c11221c16397f9812eaacf0bf4039aa681043294304788418445de2e2441e6` | yes | Restaurant conversation between tax handler Simon Saito (crew cut, stubble) and feminine executive Tono Ryuichi in suit holding chopsticks over sashimi platter. |
| `images/31-reader-trg-11.png` | `51581f20c6478bfb795ca514daaf16d823bad149fda898e689891b846e7bb19a` | `51581f20c6478bfb795ca514daaf16d823bad149fda898e689891b846e7bb19a` | yes | Tono demanding to see photos ("いいから見せろ！"); tablet screen displaying photo of the two armed maids flanking sunglasses-wearing boss seated in chair. |
| `images/32-reader-trg-04.png` | `c246803a959515d97348989cead460507186abc32f4b4202de436135e1bbcc1d` | `c246803a959515d97348989cead460507186abc32f4b4202de436135e1bbcc1d` | yes | 16th-century Ruthenia rural landscape panorama with wooden log church with cross tower, cabins, sheep grazing, distant mountains; priest talking to village girls Olga and Tatiana looking for Sasha; log cabin wall with cross-hatching. |
| `images/32-reader-trg-05.png` | `09d4f540e8cc01a9cae2fe6bb1c54797f068a37bcb591794440cb3511c5a702e` | `09d4f540e8cc01a9cae2fe6bb1c54797f068a37bcb591794440cb3511c5a702e` | yes | Large shojo portrait of Alexandra (Sasha) with flowing blonde curls and bonnet, dove flying; Sasha carrying water bucket on hill with pine trees; talking to village girl friends about watching birds. |
| `images/32-reader-trg-06.png` | `f33d2863769972f9f3237ad4aa19b0323482d995e3d2a7e566094f5d23fbcb5f` | `f33d2863769972f9f3237ad4aa19b0323482d995e3d2a7e566094f5d23fbcb5f` | yes | Village girls in headscarves and aprons with pitchforks and scythes harvesting wheat; Sasha looking pensive about finding a husband after harvest festival. |
| `images/32-reader-trg-07.png` | `836c1e5827e68e5a92fdb47bed067da88b241ef9300ed6dbd371619d9d70f63d` | `836c1e5827e68e5a92fdb47bed067da88b241ef9300ed6dbd371619d9d70f63d` | yes | Extreme close-up of Sasha's emotive sparkling eyes; panoramic vista of river curving through valley village under mountain range; wooden settlement cabins. |
| `images/32-reader-trg-08.png` | `8586d82b9ecf0464285fdfe8b0dae76a965c08d21ed6127448f15f127c16757c` | `8586d82b9ecf0464285fdfe8b0dae76a965c08d21ed6127448f15f127c16757c` | yes | Stippled/hatched vertical panel of villagers gathering and bundling harvested wheat in the fields; basket of bread on wagon; text narrating impoverished valley life. |
| `images/32-reader-trg-09.png` | `5ca088f603d370bf82f6823e18c61f8f3a00934910f2bc0055f247097f516fcd` | `5ca088f603d370bf82f6823e18c61f8f3a00934910f2bc0055f247097f516fcd` | yes | Night scene: vertical panel of starry night sky with billows of smoke/fire rising in distance; Sasha waking up in bed in nightgown, startled by screaming and commotion outside ("アレクサドラ!!", "ドッドッドッ"). |
| `images/34-reader-trg-05.png` | `a4d7556a4adb697a34a1857e8ee8d3891a4982135b10b6077b29768c45376c9d` | `a4d7556a4adb697a34a1857e8ee8d3891a4982135b10b6077b29768c45376c9d` | yes | Hiroto holding a Fujifilm camera taking a photo of Natsumi in blazer adjusting her hair clip beside mailbox labeled "Ikuta Hiroto / Kobayashi Natsumi". |
| `images/34-reader-trg-06.png` | `e333484e9fab86680de854abb8de8af10c0e5f645c9a4db021df817ba6cf8f7c` | `e333484e9fab86680de854abb8de8af10c0e5f645c9a4db021df817ba6cf8f7c` | yes | Single-story Japanese house (hiraya) with television antenna, air conditioner outdoor compressor unit, small garden bushes, and tiled roof in quiet suburban neighborhood under overcast sky. |
| `images/34-reader-trg-08.png` | `60b37748ca44b202adb920f28d8d5cd90080d3f2de577c017a727eb4547584c9` | `60b37748ca44b202adb920f28d8d5cd90080d3f2de577c017a727eb4547584c9` | yes | Asagaya Pearl Center shopping arcade exterior arch; Hiroto in small cluttered 1K apartment finding a 500-yen coin under low table; exterior staircase of "Midori-so" apartment building. |
| `images/34-reader-trg-09.png` | `011752167b59378d15fc1c0a458f81140deb4d81e5b7a320ed9e3a699a84e5f4` | `011752167b59378d15fc1c0a458f81140deb4d81e5b7a320ed9e3a699a84e5f4` | yes | Hiroto in hoodie and checkered scarf eating piping hot takoyaki on street ("ほっか〜"); elderly lady with grandson asking directions to "Kanamatsu Fishing Pond" (つり堀 金松). |
| `images/34-reader-trg-10.png` | `bdf19265c9ca509d15f0f907ba10fac7826566c0524d8ed31b7773020f38ee0d` | `bdf19265c9ca509d15f0f907ba10fac7826566c0524d8ed31b7773020f38ee0d` | yes | Kanamatsu outdoor fishing pond with elderly patrons sitting on benches around water basin; Hiroto in apron holding fishing rod, smiling and complimenting elderly lady's outfit. |
| `images/34-reader-trg-11.png` | `ee948b0b925da7dabea896680091ab84ab5bd0502ccdbded2c073b739ac9cd86` | `ee948b0b925da7dabea896680091ab84ab5bd0502ccdbded2c073b739ac9cd86` | yes | Hiroto waving goodbye easily to grandma; attractive young woman with ponytail asking for rental price, Hiroto getting flustered and blushing ("ドキッ"). |
| `images/35-reader-page-010.jpg` | `a4dafabef698ded2500aaea28819fc2827010e6e4d5459c4fec0de48e0f7dc4a` | `a4dafabef698ded2500aaea28819fc2827010e6e4d5459c4fec0de48e0f7dc4a` | yes | Complete single-page continuous punch sequence: Akira rising from chair and charging → launching explosive right straight punch with huge motion blur and severe facial deformation on Haruo ("一九九一年") → Haruo holding bleeding swollen jaw in aftermath while Akira glares with clenched fist. |
| `images/36-reader-page-08.png` | `5af2640fcd58ce66fe1594e8a4532a14560b1f92d44051ec00761fff12a3bb62` | `5af2640fcd58ce66fe1594e8a4532a14560b1f92d44051ec00761fff12a3bb62` | yes | Full-color painterly illustration of rugged alien coastal mountain plateau under starry blue night sky ("きっとあなたのそばにゆく。"), truck driving up winding switchback road overlooking ocean. |
| `images/36-reader-page-10.png` | `a9d5e1612cc4fc95145e069ec8d3b0cf767768ad794497c990bda3f025f7bac0` | `a9d5e1612cc4fc95145e069ec8d3b0cf767768ad794497c990bda3f025f7bac0` | yes | Color panels: multi-monitor military radar/sensor operations console, observation slit into operations room, massive spherical transfer chamber with grid tiles, officer and soldiers in control room. |
| `images/36-reader-page-11.png` | `4f3aeb0c29b8c852fcf05913d278f60ee4e09325f6049d6c813233587a8b251e` | `4f3aeb0c29b8c852fcf05913d278f60ee4e09325f6049d6c813233587a8b251e` | yes | Black-and-white: military commander in peaked cap arguing with female transfer soldier reclining in pod/chair, countdown alert on radar screen ("ALERT", "あと10秒！", "9秒、"), soldier raising hands in trance. |
| `images/36-reader-page-12.png` | `d084be32a6bc4e6c1dcb59369354752c27c11ddafb2119f781e984d04d854784` | `d084be32a6bc4e6c1dcb59369354752c27c11ddafb2119f781e984d04d854784` | yes | Massive cylindrical/spherical transfer chamber with glowing tiled grid and central bright illumination, numbered countdown speech bubble "8". |
| `images/36-reader-page-13.png` | `d1bea950de3618399c6a23b592ce219e54c357adcf551a85b43da7834d572242` | `d1bea950de3618399c6a23b592ce219e54c357adcf551a85b43da7834d572242` | yes | Curving tiled transfer tunnel wall with embedded luminous guide lights, countdown speech bubbles "6", "7". |
| `images/36-reader-page-14.png` | `2f75da848fb50015e2583bfe01eee2754faf255feeda62091254bcf1505da8e0` | `2f75da848fb50015e2583bfe01eee2754faf255feeda62091254bcf1505da8e0` | yes | Sudden materialization / teleportation breach at "5…": large floating slab of masonry hovering in mid-air, dozens of helmeted combat soldiers tumbling and charging out of light flare onto tiled tunnel surface. |
| `images/37-reader-page-07.png` | `1c5d966057a694029f320327e37dbdd5545632c07a0bbb542c5236cd5b2019d8` | `1c5d966057a694029f320327e37dbdd5545632c07a0bbb542c5236cd5b2019d8` | yes | Gag comedy essay: pregnant mother drawing manga manuscripts on her stomach, toddler Gocchan standing with watermelon, rubber balloon insertion diagram for induced labor. |
| `images/37-reader-page-08.png` | `61b6398e0e52433552fa7c1211859ad72a11396ba97f79b3684b609cf1f547f5` | `61b6398e0e52433552fa7c1211859ad72a11396ba97f79b3684b609cf1f547f5` | yes | Labor contractions progression: baby rotating in womb, father with frizzy hair and glasses looking anxious, metaphor of giant spiked demon club (鬼の金棒) slowly revolving inside. |
| `images/37-reader-page-09.png` | `aecc034a95ef85f7f9ba3907c23af005923e04de6a2eadb16b1e5ec5fc3013f5` | `aecc034a95ef85f7f9ba3907c23af005923e04de6a2eadb16b1e5ec5fc3013f5` | yes | Delivery room struggle: husband waiting outside in hallway, midwife massaging mother's lower back while chatting about yakiniku restaurants, vacuum suction extraction of baby's head. |
| `images/37-reader-page-10.png` | `24fdfc074edb6e9b868d3f1bd3745aaf439844377df89156efba68a635ec1b04` | `24fdfc074edb6e9b868d3f1bd3745aaf439844377df89156efba68a635ec1b04` | yes | Successful childbirth: newborn baby Gocchan with pointed/lumpy cone head ("ポコーン"), discussion of episiotomy without anesthesia, exhausted shaking hands, desperate craving for ice cream ("アイス食べたい!!"). |
| `images/37-reader-page-11.png` | `8952e5c7e28b3d11abf4dcb8ee6430f157dd105db4df3f0515e7f51239bba82e` | `8952e5c7e28b3d11abf4dcb8ee6430f157dd105db4df3f0515e7f51239bba82e` | yes | Sucking on frozen Coolish vanilla pouch; romantic parody shojo panels with huge sparkling eyes ("ああ幸せ… なんてかわいいの…") sharply contrasted with harsh reality of infant care ("すんません正直… 育児ナメてました!!!"). |
| `images/37-reader-page-13.png` | `81f229adf31906a27e490c637b19fea840d4b274b0a64c92df8f68beabd9dc0f` | `81f229adf31906a27e490c637b19fea840d4b274b0a64c92df8f68beabd9dc0f` | yes | Hospital orientation on infant formula, complaining about exact water temperature and measurements ("めんどくせぇ!!!!"), friend's grandma lactation story, walking on public street with leaking breastmilk. |
| `images/40-reader-page-06.png` | `099bd268df0bb3e7d36552a93be31846946824d4b2cd0c36c8afa5cc22e854f1` | `099bd268df0bb3e7d36552a93be31846946824d4b2cd0c36c8afa5cc22e854f1` | yes | Brain council meeting: Yoshida (glasses, black suit) pushing glasses up nose ("多数決をとろう"); Ishibashi, Kishi, Hatoko, and Ikeda raising hands to vote on whether to speak to the man. |
| `images/40-reader-page-07.png` | `b4c2259bae0cb3b982092ca29909b2e3a7d9ce3cc1317020acf670f2727b2d19` | `b4c2259bae0cb3b982092ca29909b2e3a7d9ce3cc1317020acf670f2727b2d19` | yes | Kishi taking meeting minutes with feather pen; debate among brain members; real-world perspective view from behind of blonde wavy-haired Ichiko standing at outdoor train station watching young man Saotome Ryoichi walk away down stairs. |
| `images/40-reader-page-08.png` | `5ffa8cf721a6e79b43df40dfc94f30872f60be6fc99abeb00ab10c9162df9210` | `5ffa8cf721a6e79b43df40dfc94f30872f60be6fc99abeb00ab10c9162df9210` | yes | Inner debate over past disastrous dating history; handsome close-up of Saotome Ryoichi's profile; Ichiko's wide panicked eyes ("どーしよ…"); flash card with "資料映像" of Saotome. |
| `images/40-reader-page-09.png` | `6c1f0ab24231725d7507f4f4a4bdb5dddc657cc9566a08f1b984bcd1b5409b42` | `6c1f0ab24231725d7507f4f4a4bdb5dddc657cc9566a08f1b984bcd1b5409b42` | yes | Ikeda arguing against approaching him, recalling bad ex-boyfriend with disgusting table manners (eating twice-cooked pork cabbage by cabbage, loud smacking); Ishibashi protesting. |
| `images/40-reader-page-10.png` | `9126070187030d572b8fe1e1c0e10f752b3d759ba18c48c8130e8b710b1dedeb` | `9126070187030d572b8fe1e1c0e10f752b3d759ba18c48c8130e8b710b1dedeb` | yes | Split panel: Saotome looking at smartphone on train platform, Ichiko trembling in coat ("あぁ どうしよう 頭の中が大騒ぎだ"), and brain meeting members screaming in a voting uproar as the 22-minute local train approaches. |
| `images/40-reader-page-11.png` | `52b97c9e551621d2dee1ef034f30a1976e9f0ad6b9f7658f42b57d6c7c1c98f1` | `52b97c9e551621d2dee1ef034f30a1976e9f0ad6b9f7658f42b57d6c7c1c98f1` | yes | Inner council vote in total chaos: Ishibashi and Hatoko raising hands enthusiastically ("絶対あの人のこと好きなんだもん!!"), Kishi consulting past record ledger. |

---

## 3. Positions 31–40 Art factor table

Values are ordered strictly by: `artRealism / artDensity / visualSoftness / motionImpact`.

| Pos | workId | Canonical title | Preflight state | `artRealism` | `artDensity` | `visualSoftness` | `motionImpact` |
| ---: | --- | --- | --- | :---: | :---: | :---: | :---: |
| 31 | `work-79c18b26dfde8a532f73` | デストロ２４６ | `sample-ready` | **2** | **3** | **1** | **U** |
| 32 | `work-7b6eb2b48ac06ffa26eb` | 夢の雫、黄金の鳥籠 | `sample-ready` | **2** | **3** | **4** | **U** |
| 33 | `work-8037856e7703fdaf4324` | 日常 | `unknown-ready` | **U** | **U** | **U** | **U** |
| 34 | `work-88cb26a0229ad7b83263` | ひらやすみ | `sample-ready` | **2** | **2** | **3** | **U** |
| 35 | `work-8a7846af8ead1797e6a2` | ハイスコアガール | `unknown-ready` | **U** | **U** | **U** | **4** |
| 36 | `work-8ff141505b0a27f8d630` | WOMBS | `sample-ready` | **3** | **3** | **2** | **U** |
| 37 | `work-982bb79e03193ebbafcd` | ママはテンパリスト | `sample-ready` | **1** | **1** | **3** | **U** |
| 38 | `work-9e98119539f60465ce66` | 僕らはみんな河合荘 | `unknown-ready` | **U** | **U** | **U** | **U** |
| 39 | `work-aa6018249b7fe7e92d95` | かよちゃんの荷物 | `unknown-ready` | **U** | **U** | **U** | **U** |
| 40 | `work-ab9331f7fed1990f7dc6` | 脳内ポイズンベリー | `sample-ready` | **2** | **2** | **3** | **U** |

*Total: 10 works, exactly 40 terminal Factor cells.*

---

## 4. Work-level detailed evidence and Dictionary-anchored justifications

### Position 31 — `work-79c18b26dfde8a532f73` (デストロ２４６)
- **Preflight State**: `sample-ready` (6 readable body pages across 2 distinct contexts: mansion exterior/foyer action aftermath and restaurant dining conversation).
- **`artRealism` = 2**
  - *Refs*: `images/31-reader-trg-05.png`, `images/31-reader-trg-08.png`, `images/31-reader-trg-10.png`
  - *Observation*: Character faces feature standard seinen action stylization (slender facial structures, stylized sharp anime maid archetypes, expressive eyes) constructed on anatomically grounded body proportions, realistic hand structures, and meticulously drafted real-world tactical weapons (suppressed handguns, tactical submachine guns, magazines) alongside authentic luxury architecture and dining tableware. Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluated on volume 1 entry preview pages (`reader-trg-05` to `08`, `10`, `11`).
  - *Confidence*: 0.91
- **`artDensity` = 3**
  - *Refs*: `images/31-reader-trg-05.png`, `images/31-reader-trg-06.png`, `images/31-reader-trg-07.png`
  - *Observation*: Sits between balanced (2) and high density (4). Backgrounds show rich architectural depth (exterior mansion facade, palm trees, grand curved foyer staircase, arched multi-pane windows), intricate texture work on firearms, and heavy splatter effects of blood across walls and floors, while conversational panels maintain clean character layouts.
  - *Limitation*: Limited to 6 entry-scope pages.
  - *Confidence*: 0.89
- **`visualSoftness` = 1**
  - *Refs*: `images/31-reader-trg-06.png`, `images/31-reader-trg-07.png`, `images/31-reader-trg-08.png`
  - *Observation*: Sits between harsh/angular (0) and neutral (2). Characterized by high-contrast black inking, stark dramatic lighting, sharp spiky hair contours, ominous blank glowing eyes, cold metallic weapon edges, and gritty blood spatters, moderated by smooth screentones on female character faces and maid uniforms.
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.90
- **`motionImpact` = U**
  - *Unmet Gate*: Preflight `motionGateAttemptable=false`. Poses show aftermath of massacre and smoking gun barrels, but no continuous multi-panel start-development-impact-resolved action sequence is isolated. Closes as `unknown` without blocker.

---

### Position 32 — `work-7b6eb2b48ac06ffa26eb` (夢の雫、黄金の鳥籠)
- **Preflight State**: `sample-ready` (6 readable body pages across 2 distinct contexts: Ruthenian village/wheat harvest landscape and bedroom/night disturbance).
- **`artRealism` = 2**
  - *Refs*: `images/32-reader-trg-04.png`, `images/32-reader-trg-05.png`, `images/32-reader-trg-07.png`
  - *Observation*: Classic vintage shojo/josei stylization with large emotive eyes, delicate noses, and stylized wavy curls, grounded in historically authentic 16th-century Eastern European rural garments, interlocking log cabin architecture, wooden church cupolas, and natural river valley topography. Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluated on volume 1 entry preview pages (`reader-trg-04` through `09`).
  - *Confidence*: 0.90
- **`artDensity` = 3**
  - *Refs*: `images/32-reader-trg-04.png`, `images/32-reader-trg-07.png`, `images/32-reader-trg-08.png`
  - *Observation*: Sits between balanced (2) and high density (4). Features dense fine-pen hatching on pine trees, timber log textures, thatched roofs, rolling mountain ridges, riverbank foliage, bundled wheat stalks, starry night skies, and billows of smoke.
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.89
- **`visualSoftness` = 4**
  - *Refs*: `images/32-reader-trg-05.png`, `images/32-reader-trg-07.png`, `images/32-reader-trg-09.png`
  - *Observation*: Linework is exceptionally soft, fluid, and delicate; gentle flowing curves for hair strands, rounded facial features, fine atmospheric screentone gradations, luminous sparkling eye highlights, and graceful romantic framing with zero harsh angular contour blocks. Corresponds to Factor Dictionary anchor 4 (부드럽고 미려한 표현).
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.94
- **`motionImpact` = U**
  - *Unmet Gate*: Preflight `motionGateAttemptable=false`. Poses show rural labor, gazing, and waking in bed; no isolated continuous start-development-impact-resolved action sequence. Closes as `unknown` without blocker.

---

### Position 33 — `work-8037856e7703fdaf4324` (日常)
- **Preflight State**: `unknown-ready`
- **Art Axes**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`
- **Unmet Gate**: Failed static sample gate. The BOOK☆WALKER trial reader yielded only 5 readable internal narrative pages (`reader-page-07` through `11`) representing only 1 distinct scene context (hospital-front / residential-street shake). Preflight closed `staticGateAttemptable=false` and `motionGateAttemptable=false`. Under Factor Dictionary §2 and Annotation Guide §3/§5, all Art axes close as `unknown` without blocker or default zero.

---

### Position 34 — `work-88cb26a0229ad7b83263` (ひらやすみ)
- **Preflight State**: `sample-ready` (6 readable body pages across 3 distinct contexts: home/hiraya domestic exterior, street takoyaki/neighborhood, and Kanamatsu fishing pond).
- **`artRealism` = 2**
  - *Refs*: `images/34-reader-trg-05.png`, `images/34-reader-trg-08.png`, `images/34-reader-trg-10.png`
  - *Observation*: Warm, expressive contemporary slice-of-life stylization: characters feature simplified organic facial features (simple dotted/slanted eyes, relaxed contours, expressive blushes) built on realistic human anatomy, set within realistically drafted Tokyo neighborhoods (Asagaya Pearl Center arcade, single-story house architecture, fishing pond facility, cluttered 1K apartment interior, Fujifilm camera). Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluated on volume 1 entry preview pages (`reader-trg-05`, `06`, `08`–`11`).
  - *Confidence*: 0.91
- **`artDensity` = 2**
  - *Refs*: `images/34-reader-trg-06.png`, `images/34-reader-trg-08.png`, `images/34-reader-trg-10.png`
  - *Observation*: Balanced density: breathable negative white space and uncluttered panel layouts combined with selective detailed rendering on neighborhood architecture, utility poles, cluttered interior props, and organic brush-textured shrubbery. Corresponds to Factor Dictionary anchor 2 (균형).
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.90
- **`visualSoftness` = 3**
  - *Refs*: `images/34-reader-trg-05.png`, `images/34-reader-trg-06.png`, `images/34-reader-trg-09.png`
  - *Observation*: Sits between neutral (2) and delicate/soft (4). Hand-drawn organic ink linework with soft rounded contours, gentle watercolor-like ink wash tonal rendering on house walls and garden plants, soft screentones, and cozy, warm character expressions.
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.90
- **`motionImpact` = U**
  - *Unmet Gate*: Preflight `motionGateAttemptable=false`. Poses show relaxed everyday actions (taking photos, eating takoyaki, fishing, greeting neighbors); no continuous start-development-impact-resolved motion sequence. Closes as `unknown` without blocker.

---

### Position 35 — `work-8a7846af8ead1797e6a2` (ハイスコアガール)
- **Preflight State**: `unknown-ready` (static gate failed: 6 body pages span only 1 scene context; motion gate authorized on single image `reader-page-010.jpg`).
- **Static Art Axes**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`
  - *Unmet Gate*: Static prerequisite failed because the 6 readable body pages (`reader-page-002` through `007`) cover only a single distinct scene context (classroom/arcade social interaction). All static Art cells close as `unknown`.
- **`motionImpact` = 4**
  - *Refs*: Subpanels of authorized image `images/35-reader-page-010.jpg`
  - *Observation*: Evaluated strictly on the single-page authorized continuous punch sequence:
    1. **Start** (top-right panel & middle-right inset): Akira Oono's knee/leg sharply rises from the arcade chair ("バッ"), followed by her aggressive charging stride with rushing speedlines ("ダッ", "テ… テメェ 何 しやがる").
    2. **Development & Impact** (large center panel): Akira executes an explosive, full-power right straight punch directly into Haruo Yaguchi's face. The panel features a massive sweeping speed arc / motion blur across the arm, starburst impact lines, and extreme physical facial deformation (Haruo's jaw compressed, cheek rippling under kinetic shock, eyes bulging white, teeth exposed, banner "一九九一年").
    3. **Resolved Aftermath** (bottom row panels): Bottom-right panel shows Haruo holding his bleeding nose and swollen jaw in shock/pain ("これが この女との 因縁の始まり…"); bottom-left panel shows Akira standing with her clenched fist, looking away in angry pouting resolve.
    - Demonstrates maximum speed, impact force, and dynamic motion exaggeration. Corresponds directly to Factor Dictionary anchor 4 (속도감·타격감·동작 강조가 강함).
  - *Limitation*: Evaluated strictly on the authorized single-page sequence in `reader-page-010.jpg`.
  - *Confidence*: 0.93

---

### Position 36 — `work-8ff141505b0a27f8d630` (WOMBS)
- **Preflight State**: `sample-ready` (6 readable body pages across 3 distinct contexts: planetary mountain switchback landscape, military control operations room, and transfer tunnel/chamber).
- **`artRealism` = 3**
  - *Refs*: `images/36-reader-page-08.png`, `images/36-reader-page-10.png`, `images/36-reader-page-11.png`
  - *Observation*: Sits between standard stylization (2) and high realism (4). Characters feature realistic, mature adult human proportions, bone structure, and authentic military uniform draping; environments show sophisticated perspective, realistic rendering of alien topography, winding cliffside roads, multi-monitor electronic radar consoles, and curved structural architecture.
  - *Limitation*: Evaluated on volume 1 entry preview pages (`reader-page-08` and `10`–`14`).
  - *Confidence*: 0.90
- **`artDensity` = 3**
  - *Refs*: `images/36-reader-page-08.png`, `images/36-reader-page-10.png`, `images/36-reader-page-14.png`
  - *Observation*: Sits between balanced (2) and high density (4). Rich painterly color texturing across coastal cliffs and skies (page 08), detailed control consoles and monitor screens (page 10), and a dense, crowded formation of combat-geared soldiers with helmets and equipment (page 14), balanced by open transfer chamber voids.
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.90
- **`visualSoftness` = 2**
  - *Refs*: `images/36-reader-page-08.png`, `images/36-reader-page-11.png`, `images/36-reader-page-14.png`
  - *Observation*: Balanced and neutral: painterly, brushed soft tonal washes across atmospheric night clouds and glowing radar screens balanced against bold, gritty, high-contrast ink brushwork and sharp military shadow blocking. Corresponds to Factor Dictionary anchor 2 (중립).
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.89
- **`motionImpact` = U**
  - *Unmet Gate*: Preflight `motionGateAttemptable=false`. While page 14 shows a sudden breach/emergence of troops and floating rock during a countdown, no isolated continuous start-development-impact-resolved action sequence is isolated. Closes as `unknown` without blocker.

---

### Position 37 — `work-982bb79e03193ebbafcd` (ママはテンパリスト)
- **Preflight State**: `sample-ready` (6 readable body pages across 3 distinct contexts: home/manuscript desk, hospital labor/delivery room, and postnatal orientation/street).
- **`artRealism` = 1**
  - *Refs*: `images/37-reader-page-07.png`, `images/37-reader-page-08.png`, `images/37-reader-page-11.png`
  - *Observation*: Sits between heavy cartoon caricature (0) and standard stylization (2). Dominated by comedic gag essay deformation: simplified cartoon anatomy, exaggerated rubbery chibi expressions, comedic diagrams (balloon induction, rotating spiked demon club), and parody shojo sparkles, anchored by recognizable everyday items (Coolish ice pack, infant formulas, hospital gowns).
  - *Limitation*: Evaluated on volume 1 entry preview pages (`reader-page-07`–`11`, `13`).
  - *Confidence*: 0.92
- **`artDensity` = 1**
  - *Refs*: `images/37-reader-page-07.png`, `images/37-reader-page-09.png`, `images/37-reader-page-13.png`
  - *Observation*: Sits between simple/sparse (0) and balanced (2). Minimalist, open panel compositions with large white negative space, high dialogue balloon volume, quick expressive character line sketches, and minimal background architectural rendering.
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.91
- **`visualSoftness` = 3**
  - *Refs*: `images/37-reader-page-07.png`, `images/37-reader-page-10.png`, `images/37-reader-page-11.png`
  - *Observation*: Sits between neutral (2) and delicate (4). Characterized by soft, rounded, hand-drawn brush contours, gentle curved shapes for toddler Gocchan and pregnant mother, soft dotted halftones, and playful decorative sparkles.
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.90
- **`motionImpact` = U**
  - *Unmet Gate*: Preflight `motionGateAttemptable=false`. Pages depict childbirth labor, comedic monologues, and infant feeding; no continuous start-development-impact-resolved action sequence. Closes as `unknown` without blocker.

---

### Position 38 — `work-9e98119539f60465ce66` (僕らはみんな河合荘)
- **Preflight State**: `unknown-ready`
- **Art Axes**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`
- **Unmet Gate**: Official publisher product-only route without registered preview. Shonengahosha volume 1 product page (`book_Info.php?id=6776`) contains metadata only and exposes no readable internal preview (`readableInternalPageCount=0`, `distinctContextCount=0`). The volume-3 page is not the frozen edition. Under Factor Dictionary §2 and Annotation Guide §3/§5, all Art axes close as `unknown` without blocker or default zero.

---

### Position 39 — `work-aa6018249b7fe7e92d95` (かよちゃんの荷物)
- **Preflight State**: `unknown-ready`
- **Art Axes**: `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`
- **Unmet Gate**: Publisher route unregistered. Takeshobo (竹書房) is absent from the trusted publisher route registry; Manga Taisho 2010 jury comment PDF is not a publisher product or internal preview (`readableInternalPageCount=0`, `distinctContextCount=0`). Under Factor Dictionary §2 and Annotation Guide §3/§5, all Art axes close as `unknown` without blocker or default zero.

---

### Position 40 — `work-ab9331f7fed1990f7dc6` (脳内ポイズンベリー)
- **Preflight State**: `sample-ready` (6 readable body pages across 2 distinct contexts: internal brain council conference room and physical train station platform/street).
- **`artRealism` = 2**
  - *Refs*: `images/40-reader-page-06.png`, `images/40-reader-page-07.png`, `images/40-reader-page-10.png`
  - *Observation*: Stylized, expressive psychological josei art style: character designs feature stylized expressive eyes, emotive facial acting, and diverse conceptual personifications in the brain council, grounded in realistic everyday anatomy, realistic Tokyo commuter train station architecture, tracks, stairwells, coat textiles, and mobile phones. Corresponds to Factor Dictionary anchor 2 (일반적 스타일화).
  - *Limitation*: Evaluated on volume 1 entry preview pages (`reader-page-06` through `11`).
  - *Confidence*: 0.90
- **`artDensity` = 2**
  - *Refs*: `images/40-reader-page-07.png`, `images/40-reader-page-08.png`, `images/40-reader-page-10.png`
  - *Observation*: Balanced density: clear spatial separation between inner mental boardroom panels and physical train station environments, balanced screentones, smooth halftones, and clear architectural rendering of train platforms without ink clutter. Corresponds to Factor Dictionary anchor 2 (균형).
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.90
- **`visualSoftness` = 3**
  - *Refs*: `images/40-reader-page-07.png`, `images/40-reader-page-08.png`, `images/40-reader-page-10.png`
  - *Observation*: Sits between neutral (2) and delicate/soft (4). Delicate, fine pen contours, soft flowing wavy hair curls for protagonist Ichiko, soft screentone gradients across eyes and backgrounds, and gentle emotional facial nuances.
  - *Limitation*: Limited to 6 preview pages.
  - *Confidence*: 0.91
- **`motionImpact` = U**
  - *Unmet Gate*: Preflight `motionGateAttemptable=false`. Poses show voting gestures and standing on train platforms; no continuous start-development-impact-resolved action sequence. Closes as `unknown` without blocker.

---

## 5. Audit of 0/4 endpoints and authorized motion sequences

### 5.1 Endpoint value audits across all recorded contexts

#### 1. Position 32 (`work-7b6eb2b48ac06ffa26eb` — 夢の雫、黄金の鳥籠): `visualSoftness = 4`
- **Context 1 (Ruthenian village / wheat harvest landscape: `reader-trg-04`, `05`, `06`, `07`, `08`)**: Delicate, fine linework, soft flowing wavy curls, gentle rounded facial curves, soft dove motifs, and luminous sparkling eye highlights. Strongly supports 4.
- **Context 2 (Bedroom / night disturbance: `reader-trg-09`)**: Soft flowing nightgown contours, delicate sleeping and startled facial features, soft pillow textures, and smooth tonal transitions on night sky. Strongly supports 4.
- **Audit Conclusion**: Value `4` is consistently supported across all selected contexts without exception.

---

### 5.2 Authorized motion sequence audit

#### Position 35 (`work-8a7846af8ead1797e6a2` — ハイスコアガール): `images/35-reader-page-010.jpg`
- **Start (`reader-page-010.jpg` top-right panel & middle-right inset)**: Akira Oono's knee sharply lifts from the arcade seat ("バッ"), followed by her aggressive charging stride with rushing speedlines ("ダッ", "テ… テメェ 何 しやがる").
- **Development & Impact (`reader-page-010.jpg` large center panel)**: Akira delivers an explosive right straight punch directly into Haruo Yaguchi's face. The panel features a sweeping motion blur arc, starburst impact lines, and severe facial distortion (jaw compressed, cheek rippling under kinetic shock, eyes bulging white, teeth exposed, banner "一九九一年").
- **Resolved Endpoint (`reader-page-010.jpg` bottom row panels)**: Haruo holds his bleeding nose and swollen jaw in shock/pain ("これが この女との 因縁の始まり…"); Akira stands with clenched fist, looking away with angry pouting glare.
- **Motion Evaluation**: Complete bounded punch sequence with maximum kinetic speed and violent physical impact (`motionImpact = 4`).
- **All Other Motion Cells**: Positions 31, 32, 33, 34, 36, 37, 38, 39, and 40 lack an authorized continuous motion sequence and are confirmed strictly as `U`.

---

## 6. Filesystem and mutation integrity confirmation

- **File Mutation Status**: Confirmed that **zero** files within `/tmp/konocomics-batch005-gemini-art04.EOXSVN` were created, edited, moved, renamed, overwritten, or deleted.
- **Root Integrity**: The canonical uncompressed root directory remains in its exact pristine, read-only state.
- **Scope Compliance**: This review has abstained from catalog promotion recommendations, comparative Local value adjudication, or non-Art modifications.
