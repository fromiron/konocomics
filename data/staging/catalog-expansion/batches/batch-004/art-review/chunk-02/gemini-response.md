# Independent Gemini Art Review: Batch 004 Chunk 02

## 1. Attestation and Execution Verification

- **Model and Configuration**: Exact model `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`, plan mode.
- **Execution Completion**: Normal completion achieved without truncation, rate-limiting, timeout, degradation, fallback, substitution, or abnormality.
- **Input and Pixel Access**: All 8 frozen repository inputs and all 60 image files in the canonical uncompressed payload root `/tmp/konocomics-batch004-gemini-art02` were directly opened and inspected at original pixels.
- **Isolation and Non-Contamination**: `reviewedByHuman=false`. Muse status `NOT_USED`; Cursor Grok status `ART_ABSTAIN`. No local artifacts (`local-art.csv`, `local-codex.md`, adjudication logs, or other model conclusions) were inspected. No covers, synopses, animation frames, user opinions, Genre tags, text Factors, Gold data, or prior model memory were used.
- **Payload Identity**: Recomputed sorted-ledger payload identity SHA-256 is `31b101fc6ae938670bee2da4b68ac275ffad762d0afc28b1d80b378aea93147c`, matching `gemini-root-identity.json` and `gemini-payload-ledger.md` exactly.

---

## 2. Frozen Input Hashes and 60-Image Inspection Table

### 2.1 Frozen Input Hashes

| Path | Expected SHA-256 | Computed SHA-256 | Status |
| :--- | :--- | :--- | :--- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | MATCH |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | MATCH |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` | MATCH |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` | MATCH |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-02/preflight.csv` | `249d177ae697a41231e15801e86097e3d011a6689027a2bc4f1e80d67968feae` | `249d177ae697a41231e15801e86097e3d011a6689027a2bc4f1e80d67968feae` | MATCH |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-02/ledger.md` | `4509e34e78eb35596d2aa5b66babbe4ca55dcd02945afe89efc4978c1d6f4ae7` | `4509e34e78eb35596d2aa5b66babbe4ca55dcd02945afe89efc4978c1d6f4ae7` | MATCH |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/gemini-payload-ledger.md` | `0bb993f570fa77195bd7a69d8788aed2062fc1ff0e3e6388bad41fd63131c4ec` | `0bb993f570fa77195bd7a69d8788aed2062fc1ff0e3e6388bad41fd63131c4ec` | MATCH |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/gemini-root-identity.json` | `850239b5e7437df008e2068f099362e3cbf901485965a022ab946b0d0dc90421` | `850239b5e7437df008e2068f099362e3cbf901485965a022ab946b0d0dc90421` | MATCH |

### 2.2 60-Image Payload Inspection Table

| File | Expected SHA-256 | Computed SHA-256 | `openedAtOriginalPixels` | Unique Visible Cue |
| :--- | :--- | :--- | :---: | :--- |
| `11-reader-step-10.png` | `c370c02f33cebdf904bf62761749b30175fead274a9a83c0d1b55f6e840581ff` | `c370c02f33cebdf904bf62761749b30175fead274a9a83c0d1b55f6e840581ff` | yes | Watercolor wash of child with afro blowing harmonica under open red umbrella indoors; shelving with tadpole in glass bowl |
| `11-reader-step-14.png` | `d04af5c5ceff23971354af49e9ec648190691273e4a0d185d5703a1dcfe2666a` | `d04af5c5ceff23971354af49e9ec648190691273e4a0d185d5703a1dcfe2666a` | yes | Blonde boy in sunglasses sitting in yellow Sunny car daydreaming desert gunfight with bleeding hooded driver and coyote |
| `11-reader-step-16.png` | `d0f58c0e618d6f4a3e2cca44367a482d8a7b5f587b441e801dac6f31671ed27b` | `d0f58c0e618d6f4a3e2cca44367a482d8a7b5f587b441e801dac6f31671ed27b` | yes | Child shouting "Haruo!" under umbrella near yellow car; boy lowering sunglasses beside "Hoshinoko Gakuen" entrance and black cat |
| `11-reader-step-18.png` | `bf91ee6641c075c38510ac86f025a64e416b9587e30a91437a1477cf062ad313` | `bf91ee6641c075c38510ac86f025a64e416b9587e30a91437a1477cf062ad313` | yes | Boy wearing glasses and 'W' cap introduced in hallway; circular inset diagram of stag beetle (クワガタ) |
| `11-reader-step-20.png` | `ace75183ef34fbe69cfb66784f1a57cd5a5345532ad95080f3c54275032646de` | `ace75183ef34fbe69cfb66784f1a57cd5a5345532ad95080f3c54275032646de` | yes | Children and dog playing outside; adults talking in tatami room; elderly director asleep in rocking chair by window |
| `11-reader-step-22.png` | `3f12578d39f1f87b81c25c67658bc3e687e6202c8d84191ea2a712b0b1072eb4` | `3f12578d39f1f87b81c25c67658bc3e687e6202c8d84191ea2a712b0b1072eb4` | yes | Round-faced Tarou-kun singing with open mouth; boys gathered by front grille of derelict Sunny 1200 automobile |
| `12-reader-step-09.png` | `5819716a1312da994da5423384cb056f6f26cc1693e8d2a1e4448e9e2c52c134` | `5819716a1312da994da5423384cb056f6f26cc1693e8d2a1e4448e9e2c52c134` | yes | Genkou-youshi manuscript page titled "夕暮れの花束" with silhouettes, and framed photo of girl with glasses flashing V-signs beside N700 Shinkansen |
| `12-reader-step-13.png` | `1effd76864a71a010f49d753c7d988f03881a173f4611aedc0cd1cd56dca5301` | `1effd76864a71a010f49d753c7d988f03881a173f4611aedc0cd1cd56dca5301` | yes | Mother seeing daughter off at train platform; girl resting chin gazing out Shinkansen window beside woven bento basket |
| `12-reader-step-17.png` | `4b962394aab03fa0f0f4c3d592d5b77b5c17c91955a5a20969ea215aaba3a501` | `4b962394aab03fa0f0f4c3d592d5b77b5c17c91955a5a20969ea215aaba3a501` | yes | Hiroshima station platform arrival sign, and stepmother Nanae presenting her Hiroshima driver's license |
| `12-reader-step-21.png` | `b012f33b9e168e6878d6cfdc4bc25b2b47ccc1c645b4c14faeb73e4bd1572647` | `b012f33b9e168e6878d6cfdc4bc25b2b47ccc1c645b4c14faeb73e4bd1572647` | yes | Stepping into apartment unit 805, handing over Unagi Pie (うなぎパイ) box, and dinner table overlooking coastal town |
| `12-reader-step-25.png` | `61259a5534a23001ab14dff32c7a533f73546a47a3a07ac1cb777fad9deda369` | `61259a5534a23001ab14dff32c7a533f73546a47a3a07ac1cb777fad9deda369` | yes | Stepmother asleep on sofa beside beer cans and Marlboro cigarette pack; deer herd grazing in park below (鹿すごいっ!) |
| `12-reader-step-29.png` | `7e335fdc5bf089502ac1a23be6991ccb5b3e1ce7e71f58961888b3b5637620aa` | `7e335fdc5bf089502ac1a23be6991ccb5b3e1ce7e71f58961888b3b5637620aa` | yes | Massive wooden Torii gate shrine approach (大鳥居); girl breaking into tears holding glasses after phone call about father |
| `13-reader-value-11.png` | `ee8901ed48893f56d770c3145d19d83e8a06cc92c6b0cea337e7b628e4ff9064` | `ee8901ed48893f56d770c3145d19d83e8a06cc92c6b0cea337e7b628e4ff9064` | yes | Hero showering after mission, time-card machine punch-out, corporate izakaya karaoke afterparty, and collapsing into bed |
| `13-reader-value-15.png` | `9e698b89203796e097087557f71e51c3b0cbe07519668aa8fe8be9d1165e8e60` | `9e698b89203796e097087557f71e51c3b0cbe07519668aa8fe8be9d1165e8e60` | yes | Suspension bridge tower at night; winged armored hero swooping to rescue falling woman and presenting signature slip |
| `13-reader-value-19.png` | `a3f843ed45b9acb76216ac8383a9ae043bcad16c732f2bc9e8c7b3497471bb43` | `a3f843ed45b9acb76216ac8383a9ae043bcad16c732f2bc9e8c7b3497471bb43` | yes | Enormous mechanical blast explosion on bridge deck with hero shielding victim and handing over pen for signature |
| `13-reader-value-23.png` | `ad6c40dc44729d4de406ff8e4e8be195f285ccff9c21ece276ce047f1924c2d8` | `ad6c40dc44729d4de406ff8e4e8be195f285ccff9c21ece276ce047f1924c2d8` | yes | Hero catching woman amidst dense smoke clouds and arguing over corporate response time and service charges |
| `13-reader-value-27.png` | `cc1ec4481007dc2c44c9aad20302a9635476de34e0f83f9ce487e3f107b306aa` | `cc1ec4481007dc2c44c9aad20302a9635476de34e0f83f9ce487e3f107b306aa` | yes | Industrial spy robot firing machine guns in corporate office while secretary flees downstairs holding laptop |
| `13-reader-value-31.png` | `0e4b4c5a42edb17ad316651672ea01d2ba6f80d46d3b19b92a512c67da47dd0b` | `0e4b4c5a42edb17ad316651672ea01d2ba6f80d46d3b19b92a512c67da47dd0b` | yes | Crowded weapons rental counter (武器装備貸出センター) and sci-fi speeder vehicles scrambling for deployment |
| `14-reader-page-P0008.png` | `331f7ec1ac16a44b6b132d5f2e8da3d000bfc11c56fe5a20c5603e1e2e5d7efa` | `331f7ec1ac16a44b6b132d5f2e8da3d000bfc11c56fe5a20c5603e1e2e5d7efa` | yes | Arcade crane game machine featuring buck-toothed seal plushies (でっぱアザラシ) and purikura photo booth corridor |
| `14-reader-step-11.png` | `6ed85cf500ea29cce6c57955dab8b404db4fa17499452238d9ef6b64d2f008c2` | `6ed85cf500ea29cce6c57955dab8b404db4fa17499452238d9ef6b64d2f008c2` | yes | Wounded man in floral shirt bleeding on floor with broken glass while making frantic phone call; Nezumi walking past arcade booths |
| `14-reader-step-15.png` | `133d547bee4ea6e7ee2f92a650676a4de78cf419d8c3e63f6bd4fec5c7bcf7f8` | `133d547bee4ea6e7ee2f92a650676a4de78cf419d8c3e63f6bd4fec5c7bcf7f8` | yes | Boy offering to win seal doll for Nezumi at crane game as mechanical claw positions directly above toy |
| `14-reader-step-19.png` | `63c13628537981b5f708c464c1357ce0913bfc79ec1a544363cb1c17e68ae839` | `63c13628537981b5f708c464c1357ce0913bfc79ec1a544363cb1c17e68ae839` | yes | Tengu-sensei driving getaway car; Nezumi sitting alone on bed in minimalist apartment popping medicine blister pack |
| `14-reader-step-23.png` | `9604530c70810c70350106b1ff82fd4108e12e1c4627c47a681d1416f7ded367` | `9604530c70810c70350106b1ff82fd4108e12e1c4627c47a681d1416f7ded367` | yes | Grotesque yakuza boss with dragon and '豚' back tattoo grinning menacingly over young doll-like Nezumi |
| `14-reader-step-27.png` | `7eddd36bc95a86feb0d601126a26fbcf2d4954e00f231aabbe8460020b3ea7e2` | `7eddd36bc95a86feb0d601126a26fbcf2d4954e00f231aabbe8460020b3ea7e2` | yes | Pinstripe-suited boss Iruka-san swirling whiskey glass (最強の道具) while Nezumi sits in armchair surrounded by syndicate members |
| `15-reader-page-P0007.png` | `f1aa1af6cdc7aa3a7c7b11c4cda2fb42ce0e6d80b42d7f6e4867756aa2d843ab` | `f1aa1af6cdc7aa3a7c7b11c4cda2fb42ce0e6d80b42d7f6e4867756aa2d843ab` | yes | Middle-aged assassin Ogami smoking cigarette holding newspaper pierced by bullet hole with muzzle flashes |
| `15-reader-step-11.png` | `5748be20229e753dc20ec6f649aa88673d740f2926a32b2d0d49be331e75d9ed` | `5748be20229e753dc20ec6f649aa88673d740f2926a32b2d0d49be331e75d9ed` | yes | Warehouse gunfight across high wooden rafters with muzzle flashes, falling casings, and point-blank headshot |
| `15-reader-step-15.png` | `7d99d44a3f093fbb9af1ae5ae7fd048812a1512caad038787b6c9e67fabe721b` | `7d99d44a3f093fbb9af1ae5ae7fd048812a1512caad038787b6c9e67fabe721b` | yes | Porsche SUV driving out of garage, wasp nest contained in glass jar (蜂の巣), and assassins eating garlic ramen at counter |
| `15-reader-step-19.png` | `5583e0bc2e9fa23352349bff8758fd17f867f9649e8b11bf539c5e5500779095` | `5583e0bc2e9fa23352349bff8758fd17f867f9649e8b11bf539c5e5500779095` | yes | Ogami holding framed photo of former wife and daughter; balcony table with Laphroaig 10 scotch bottle and cigarette ashtray |
| `15-reader-step-23.png` | `6acc3befdc9925f17e10a54c69be6391e542b0f426048a00a8ef244059c8b229` | `6acc3befdc9925f17e10a54c69be6391e542b0f426048a00a8ef244059c8b229` | yes | De-aged Ogami awakening in hospital bed with vitals monitor '80'; ex-wife chief scientist Eri examining wasp venom sample |
| `15-reader-step-27.png` | `ef69fdbc713d3ae211246c3f44e855045d3671e12f7bfec2254cfe2896d23c6b` | `ef69fdbc713d3ae211246c3f44e855045d3671e12f7bfec2254cfe2896d23c6b` | yes | Hitman boss ordering middle school infiltration ("中学校に通ってくれ") over phone; de-aged Ogami donning school uniform and glasses |
| `16-reader-step-09.png` | `5c5d613717e5b4a0f905e444851d05347543ec968bfef8376af6228ed0c95b3c` | `5c5d613717e5b4a0f905e444851d05347543ec968bfef8376af6228ed0c95b3c` | yes | Smartphone screen playing viral video of horned monster girl ("Ganjin" / 幻人); high school building exterior with students entering |
| `16-reader-step-13.png` | `d8c04cac4e20e6c5ed0c13f9906f947487591f275e49f7ec2a83e9f1003ffbb4` | `d8c04cac4e20e6c5ed0c13f9906f947487591f275e49f7ec2a83e9f1003ffbb4` | yes | Werewolf girl Tsumiki sitting atop shoe lockers showing off giant oversized sneakers and bushy tail |
| `16-reader-step-17.png` | `d08be82bd9bcb172d9fd5577da5cf1fe9d60ec6d3a8d0b926304addcecbe1dec` | `d08be82bd9bcb172d9fd5577da5cf1fe9d60ec6d3a8d0b926304addcecbe1dec` | yes | Nervous boy asking Tsumiki to tap him on chest ("たたいてくれない!?") to prove he isn't scared; Tsumiki smiling reassuringly |
| `16-reader-step-21.png` | `a605b9ed88e93cc5749e2466d51a9a4d3e66458f2a3fb5a2f18980b34c25c107` | `a605b9ed88e93cc5749e2466d51a9a4d3e66458f2a3fb5a2f18980b34c25c107` | yes | High school classroom with classmates swarming around popular Tsumiki's desk while boy watches from distance |
| `16-reader-step-25.png` | `07c59686e7c99ae7b24e5604288c338ed06a8c2b6a4cad85e0b594549fc19b01` | `07c59686e7c99ae7b24e5604288c338ed06a8c2b6a4cad85e0b594549fc19b01` | yes | Tsumiki sitting on locker room bench grooming her fluffy tail with paddle hairbrush and showing elastic thigh strap belt |
| `16-reader-step-29.png` | `24c2cf85c71c23d7e231697fea4306887fbe4771076b3c94a1f86650c69d122c` | `24c2cf85c71c23d7e231697fea4306887fbe4771076b3c94a1f86650c69d122c` | yes | Tsumiki browsing monster merchandise on "万物屋" online store on smartphone and smiling widely with sharp fangs ("今は食べないよ!") |
| `17-page-05.jpg` | `4b62149a58f880ac3e4b7779d1d83abbf5df3aceca369cf9b4243df3dfdf4dc6` | `4b62149a58f880ac3e4b7779d1d83abbf5df3aceca369cf9b4243df3dfdf4dc6` | yes | Shinjuku streetscape with Don Quijote neon sign (ドン・キホーテ), batting center, and gruff elderly florist Zouroku saying "...注文の品だ" |
| `17-page-15.jpg` | `0aeb5e515060773b6cb8c47a7e381a3998f3cbcec91650af50ca6dc6560d2242` | `0aeb5e515060773b6cb8c47a7e381a3998f3cbcec91650af50ca6dc6560d2242` | yes | Sana wearing miniature crown and frilled gothic dress offering wish-granting deal to Zouroku in convenience store bakery aisle |
| `17-page-25.jpg` | `143ff6d4faf5c589d6ec2a5a415001264e878e0eddd87be0843b09fd2dad9419` | `143ff6d4faf5c589d6ec2a5a415001264e878e0eddd87be0843b09fd2dad9419` | yes | Girl falling headfirst crashing onto hood/windshield of Mini Cooper as Zouroku drives; girl eating takeout hamburger |
| `17-page-35.jpg` | `b373332b09b603f674e485b88e6fb390d83740a3bd38d5440bb3748d25640224` | `b373332b09b603f674e485b88e6fb390d83740a3bd38d5440bb3748d25640224` | yes | Sana confronting twin teleporters proclaiming herself "King of Monsters" ("バケモノの王様"); Zouroku trapped behind deployed steering wheel airbag |
| `17-page-45.jpg` | `b19874cc9b85e80634787ede33f69749d95943ceb33808470c58014066b45699` | `b19874cc9b85e80634787ede33f69749d95943ceb33808470c58014066b45699` | yes | Bystanders snapping photos of smashed car windshield; Zouroku conversing with police inspector Kura-san in Yotsuya Police Station smoking room |
| `17-page-55.jpg` | `821a28f557798c6b696a2aabc54480f61c8e9587f97ffd0522de8bc812104273` | `821a28f557798c6b696a2aabc54480f61c8e9587f97ffd0522de8bc812104273` | yes | Chinese dining table with dishes labeled "大葱羊肉" (stir-fried lamb with scallions) and "銀絲巻" (fried bread); Sana staring wide-eyed with sparkle effects |
| `18-reader-step-07.png` | `1761f90ceacb5597bfa2d1d82b4ccce0013d453c041e36543fdff78f31e75a1f` | `1761f90ceacb5597bfa2d1d82b4ccce0013d453c041e36543fdff78f31e75a1f` | yes | Metalworker exhibiting patchy industrial UV sunburn on forearms and face; welder frying tempura in hot oil without flinching |
| `18-reader-step-11.png` | `d3a7a4976e4179963868d6f9d6d63dbafd59cd0d1f6ce280cf501d5992897571` | `d3a7a4976e4179963868d6f9d6d63dbafd59cd0d1f6ce280cf501d5992897571` | yes | Anatomical diagrams of molten spatter burning inside ears and safety boots; wire brush filament piercing eyeball with leaking "ドロッ" fluid |
| `18-reader-step-15.png` | `33b557eb7a8fcfe2cb862614015f2aceccc2fb0a2b24fe679b5eaaa2f4895690` | `33b557eb7a8fcfe2cb862614015f2aceccc2fb0a2b24fe679b5eaaa2f4895690` | yes | Worker explaining welding on group date (goukon) comparing it to giant plastic models; welder knocked out sleeping in work clothes on floor |
| `18-reader-step-19.png` | `97a972ba4f4dc84d0970f05ac985d19b4176f818704d8fd4574719275758d8ce` | `97a972ba4f4dc84d0970f05ac985d19b4176f818704d8fd4574719275758d8ce` | yes | Giant Gundam-esque robot on maintenance platform (ロボットの足場!!); small industrial chip manufacturing robot shaking violently (バタバタバタ) |
| `18-reader-step-23.png` | `ff4ae425e9b815a9421b768d881519132f62968918bc11614c9ce9ddf880e2db` | `ff4ae425e9b815a9421b768d881519132f62968918bc11614c9ce9ddf880e2db` | yes | Senior worker Kita-san (28) playing acoustic guitar ("22の夜"); flashback to secretly practicing welding techniques under crescent moon |
| `18-reader-step-27.png` | `30181d99ef9b951f4e72c3467ef92b4283af7b8829040577c3fc9f937de7770a` | `30181d99ef9b951f4e72c3467ef92b4283af7b8829040577c3fc9f937de7770a` | yes | Freshly welded steel I-beam seam with arrow pointing to bead; disc grinder hand tool diagram (サンダー / ディスクグラインダー) |
| `19-viewer-page-01.png` | `f17e1655f4422bd5396060da7b98d89087823b1f896abc2d9d7f5f12ba12c886` | `f17e1655f4422bd5396060da7b98d89087823b1f896abc2d9d7f5f12ba12c886` | yes | Momose and handsome boss standing under sunlit park tree canopy with flying butterfly and bold title "ど天然でした。" |
| `19-viewer-page-02.png` | `68a0aa782e810df75f598ef7fa2618d98848c8bb9e349cfeeaf12094e7ee18b1` | `68a0aa782e810df75f598ef7fa2618d98848c8bb9e349cfeeaf12094e7ee18b1` | yes | Subordinate asking for LINE contact while boss Shirosaki stares at cracked smartphone screen ("ちょっと割れてる...") |
| `19-viewer-page-03.png` | `21961c251d92db7868023d805f4a092c48f20bd960744f12c29a788c12088409` | `21961c251d92db7868023d805f4a092c48f20bd960744f12c29a788c12088409` | yes | Boss handing medicine box labeled "生理痛 頭痛に" (menstrual / headache pain) to male subordinate who laughs/blushes in embarrassment |
| `19-viewer-page-04.png` | `b6ec7756a0afe0265a50507b412bcd6a9b9fa5cf6dce44ca555dbac39022b549` | `b6ec7756a0afe0265a50507b412bcd6a9b9fa5cf6dce44ca555dbac39022b549` | yes | Sweating boss returning with drugstore plastic bag containing medicine and water bottle ("薬買ってきた") for stomachache |
| `19-viewer-page-05.png` | `9060572506d579e898f3e3ace2e088954b34e876cf6eb42f17d3bcac418e69d3` | `9060572506d579e898f3e3ace2e088954b34e876cf6eb42f17d3bcac418e69d3` | yes | Momose crouching in business suit on sidewalk with stomachache pain SFX "キリキリ" unpacking pharmacy bag from "ネコドラッグ" |
| `19-viewer-page-06.png` | `ea328819bace3d851c29f4edacfd94a5134cad08c28619fae86963306ffc5191` | `ea328819bace3d851c29f4edacfd94a5134cad08c28619fae86963306ffc5191` | yes | Opening page detailing power-harassment trauma (パワハラ上司) as Momose collapses on one knee during outdoor sales calls ("外回り中") |
| `20-reader-step-10.png` | `b47aa6ecdefb270f34ea7b2861de752c9a56b5e6ed1669547d94b6a90455805b` | `b47aa6ecdefb270f34ea7b2861de752c9a56b5e6ed1669547d94b6a90455805b` | yes | Mother with glasses discussing daughter's dating with father in living room while daughter Shuri glances back over shoulder |
| `20-reader-step-12.png` | `4c7d758b2e6eff1a8d742e155248977cd82cf926dc670352ee5d57c4154cac51` | `4c7d758b2e6eff1a8d742e155248977cd82cf926dc670352ee5d57c4154cac51` | yes | Father remembering when he liked a male classmate in 9th grade, then gently knocking ("コツコツ") on daughter's room door |
| `20-reader-step-14.png` | `ec3b028f51a3bfb41cce08813bc4d512a5a6d1f054da0627f2b57bb1a92c02b9` | `ec3b028f51a3bfb41cce08813bc4d512a5a6d1f054da0627f2b57bb1a92c02b9` | yes | Father and daughter lying on floor/bed talking casually about corgi dogs spotted during morning exercise ("コーギーちゃんいたよ") |
| `20-reader-step-18.png` | `4c69801da6d6fd1d323042cbf1851dc9e8510dd8d763b741885c8fc4c25744f8` | `4c69801da6d6fd1d323042cbf1851dc9e8510dd8d763b741885c8fc4c25744f8` | yes | Middle school memory of classmate encouraging him for high school entrance exams with outstretched hand; adult workplace dining scene |
| `20-reader-step-22.png` | `7cde69d0ed08196988480fa63ff25c9e775b256fe00642754075619725659fc8` | `7cde69d0ed08196988480fa63ff25c9e775b256fe00642754075619725659fc8` | yes | Mother holding "Monkey Man" (モンキーマン) manga; father reminiscing about past friend while sharing beer at izakaya counter |
| `20-reader-step-26.png` | `56c8a54e7e8ace4c9ffef56372346eed9b4992c58c26a06a78fa672563766c39` | `56c8a54e7e8ace4c9ffef56372346eed9b4992c58c26a06a78fa672563766c39` | yes | Heated domestic argument between mother, father and teenage daughter regarding laundry net and household chores division |

---

## 3. Work Terminal Summary (Positions 11–20)

| Position | workId | Canonical Title | State | `artRealism` | `artDensity` | `visualSoftness` | `motionImpact` |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 11 | `work-23077ad33a2066bef5a6` | Sunny | sample-ready | 2 | 3 | 3 | U |
| 12 | `work-2356050c72240569e1c5` | すみれファンファーレ | sample-ready | 1 | 1 | 3 | U |
| 13 | `work-2c4fe00df5255fc082f9` | ヒーローカンパニー | sample-ready | 2 | 3 | 1 | U |
| 14 | `work-2d385ad0525742330e70` | ねずみの初恋 | sample-ready | 3 | 3 | 3 | U |
| 15 | `work-2df743e085adef5e9bd3` | キルアオ | sample-ready | 2 | 2 | 2 | U |
| 16 | `work-2f1d1c3ad0f943f1562f` | 尾守つみきと奇日常。 | sample-ready | 2 | 2 | 3 | U |
| 17 | `work-3713ab561de583d709bc` | アリスと蔵六 | sample-ready | 2 | 2 | 2 | U |
| 18 | `work-39c1a2b6791238827ed5` | とろける鉄工所 | sample-ready | 0 | 0 | 3 | U |
| 19 | `work-3ad85a2ffdc026007d61` | 新しい上司はど天然 | sample-ready | 2 | 1 | 3 | U |
| 20 | `work-44d0000353478596369e` | 環と周 | sample-ready | 2 | 1 | 3 | U |

---

## 4. Factor Observations, Evidence References, and Limitations

### Position 11: `work-23077ad33a2066bef5a6` — Sunny

- **`artRealism` = 2**
  - *Refs*: `11-reader-step-14.png`, `11-reader-step-20.png`
  - *Pixel Observation*: Balances distinctive auteur stylization and character facial deformation (expressive distorted facial lines, non-standard silhouettes) with structurally grounded realistic proportions in background architecture, traditional interiors, and mechanical objects like the Nissan Sunny 1200 automobile.
  - *Limitation*: Sample limited to 6 body preview pages of Volume 1; later volume changes not inspected.
  - *Confidence*: 0.85
- **`artDensity` = 3**
  - *Refs*: `11-reader-step-10.png`, `11-reader-step-18.png`
  - *Pixel Observation*: High informational density across panels, characterized by textured watercolor/ink hatchings, dense room shelving clutter (posters, glass bowls, boxes), and rich environmental tactile details.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 3**
  - *Refs*: `11-reader-step-10.png`, `11-reader-step-22.png`
  - *Pixel Observation*: Hand-drawn brush and pencil inking with soft watercolor washes, gentle tonal blending, and organic paper textures rather than sharp digital vectors.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: No continuous start-development-impact-resolved action sequence isolated across consecutive body pages.

---

### Position 12: `work-2356050c72240569e1c5` — すみれファンファーレ

- **`artRealism` = 1**
  - *Refs*: `12-reader-step-13.png`, `12-reader-step-21.png`
  - *Pixel Observation*: Marked character simplification with large rounded glasses, minimalist facial features, and stylized figures, set against clean, accurate architectural backgrounds of the Shinkansen interior and apartment rooms.
  - *Limitation*: Sample limited to 6 preview pages of Volume 1.
  - *Confidence*: 0.85
- **`artDensity` = 1**
  - *Refs*: `12-reader-step-09.png`, `12-reader-step-25.png`
  - *Pixel Observation*: Clean, uncluttered layouts with expansive negative white space, sparse line art, and minimal screentone hatching across dialogue and domestic scenes.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 3**
  - *Refs*: `12-reader-step-13.png`, `12-reader-step-29.png`
  - *Pixel Observation*: Tender, rounded line weights, gentle character expressions, and soft contours creating a warm, approachable aesthetic.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: No continuous start-development-impact-resolved action sequence isolated across consecutive body pages.

---

### Position 13: `work-2c4fe00df5255fc082f9` — ヒーローカンパニー

- **`artRealism` = 2**
  - *Refs*: `13-reader-value-15.png`, `13-reader-value-27.png`
  - *Pixel Observation*: Standard classic shonen action stylization with dynamic exaggerated expressions, dramatic heroic anatomy, and structured mechanical/office rendering.
  - *Limitation*: Sample limited to 6 preview pages of Episode 1.
  - *Confidence*: 0.85
- **`artDensity` = 3**
  - *Refs*: `13-reader-value-19.png`, `13-reader-value-31.png`
  - *Pixel Observation*: Dense panel packing filled with heavy speedlines, dense screentones, mechanical weapons clutter at the rental depot, and detailed blast debris.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 1**
  - *Refs*: `13-reader-value-19.png`, `13-reader-value-23.png`
  - *Pixel Observation*: Sharp, angular ink strokes with high-contrast solid blacks, aggressive jagged speed lines, hard metallic edges, and forceful hatching.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: Isolated action moments and explosion poses exist, but no bounded continuous start-development-impact-resolved sequence across consecutive frames was sampled.

---

### Position 14: `work-2d385ad0525742330e70` — ねずみの初恋

- **`artRealism` = 3**
  - *Refs*: `14-reader-step-11.png`, `14-reader-step-27.png`
  - *Pixel Observation*: High realism in anatomical rendering, facial bone structures, lifelike dental detail, wrinkles on adult yakuza figures, and realistic lighting reflections.
  - *Limitation*: Sample limited to 6 preview pages of Volume 1.
  - *Confidence*: 0.85
- **`artDensity` = 3**
  - *Refs*: `14-reader-step-19.png`, `14-reader-step-23.png`
  - *Pixel Observation*: Intricate screentone gradients, detailed yakuza back irezumi tattoos, rich ambient shadows, and glossy reflective surfaces.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 3**
  - *Refs*: `14-reader-page-P0008.png`, `14-reader-step-15.png`
  - *Pixel Observation*: Smooth digital airbrush tonal gradients, soft eye/hair highlights, and delicate lighting transitions softening the visual rendering.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: No continuous start-development-impact-resolved action sequence isolated across consecutive body pages.

---

### Position 15: `work-2df743e085adef5e9bd3` — キルアオ

- **`artRealism` = 2**
  - *Refs*: `15-reader-page-P0007.png`, `15-reader-step-19.png`
  - *Pixel Observation*: Standard contemporary Weekly Shonen Jump stylization with crisp, sharp facial structures, proportioned action figures, and accurate mechanical/vehicle models (Porsche Cayenne, firearms).
  - *Limitation*: Sample limited to 6 preview pages of Volume 1.
  - *Confidence*: 0.85
- **`artDensity` = 2**
  - *Refs*: `15-reader-step-11.png`, `15-reader-step-15.png`
  - *Pixel Observation*: Balanced commercial manga density with clean line work, structured screentones, action speedlines, and crisp warehouse/ramen-shop environments.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 2**
  - *Refs*: `15-reader-step-11.png`, `15-reader-step-27.png`
  - *Pixel Observation*: Clean digital inking with neutral balance between sharp action edges/hair spikes and rounded character features.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: Shootout poses present, but no continuous start-development-impact-resolved action sequence across consecutive pages was isolated.

---

### Position 16: `work-2f1d1c3ad0f943f1562f` — 尾守つみきと奇日常。

- **`artRealism` = 2**
  - *Refs*: `16-reader-step-13.png`, `16-reader-step-21.png`
  - *Pixel Observation*: Standard supernatural romantic comedy stylization with large expressive anime eyes, stylized proportions, and cute kemonomimi character features alongside realistic modern high school classrooms and shoe lockers.
  - *Limitation*: Sample limited to 6 preview pages of Volume 1.
  - *Confidence*: 0.85
- **`artDensity` = 2**
  - *Refs*: `16-reader-step-09.png`, `16-reader-step-25.png`
  - *Pixel Observation*: Balanced density featuring neat school backgrounds, clean perspective grids, moderate screentoning, and soft texturing on hair and tail fur.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 3**
  - *Refs*: `16-reader-step-17.png`, `16-reader-step-25.png`
  - *Pixel Observation*: Soft, fluffy fur rendering, curved gentle line weights, delicate facial blushing, and warm rounded contours.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: No continuous start-development-impact-resolved action sequence isolated across consecutive body pages.

---

### Position 17: `work-3713ab561de583d709bc` — アリスと蔵六

- **`artRealism` = 2**
  - *Refs*: `17-page-05.jpg`, `17-page-55.jpg`
  - *Pixel Observation*: General stylization contrasting cute rounded moe child characters with realistically proportioned, rugged elderly characters and grounded Tokyo urban backgrounds (Don Quijote signage, police station, Chinese restaurant).
  - *Limitation*: Sample limited to 6 preview pages of Chapter 1.
  - *Confidence*: 0.85
- **`artDensity` = 2**
  - *Refs*: `17-page-05.jpg`, `17-page-35.jpg`
  - *Pixel Observation*: Balanced line density with clean architectural streetscapes, detailed vehicles, and clear panel spacing with moderate screentones.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 2**
  - *Refs*: `17-page-15.jpg`, `17-page-55.jpg`
  - *Pixel Observation*: Neutral line balance combining rounded cute curves for children with clean, crisp inking and cross-hatching for adult characters and environments.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: Dynamic vehicle crash moments present, but no continuous start-development-impact-resolved action sequence across consecutive pages was isolated.

---

### Position 18: `work-39c1a2b6791238827ed5` — とろける鉄工所

- **`artRealism` = 0**
  - *Refs*: `18-reader-step-07.png`, `18-reader-step-11.png`
  - *Pixel Observation*: Extreme comedic deformation and caricature simplification across all characters, featuring bean-shaped heads, dot/slit eyes, minimal anatomical features, and simplified cartoon bodies across every context.
  - *Limitation*: Sample limited to 6 preview pages of Volume 1.
  - *Confidence*: 0.85
- **`artDensity` = 0**
  - *Refs*: `18-reader-step-15.png`, `18-reader-step-23.png`
  - *Pixel Observation*: Minimalist art style characterized by extensive open white space, spare linework, minimal shading, and plain background panels throughout all sampled contexts.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 3**
  - *Refs*: `18-reader-step-19.png`, `18-reader-step-27.png`
  - *Pixel Observation*: Soft, loose, hand-drawn rounded ink strokes and warm cartoon linework with blunt, gentle contours.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: No continuous start-development-impact-resolved action sequence isolated across consecutive body pages.

---

### Position 19: `work-3ad85a2ffdc026007d61` — 新しい上司はど天然

- **`artRealism` = 2**
  - *Refs*: `19-viewer-page-02.png`, `19-viewer-page-04.png`
  - *Pixel Observation*: Standard modern shoujo/josei office comedy stylization with handsome bishounen proportions, stylized expressive eyes, and slender character silhouettes.
  - *Limitation*: Sample limited to 6 preview pages of Episode 1.
  - *Confidence*: 0.85
- **`artDensity` = 1**
  - *Refs*: `19-viewer-page-01.png`, `19-viewer-page-05.png`
  - *Pixel Observation*: Clean, open layouts with ample negative white space, sparse background linework, and selective screentone application on clothing and foliage.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 3**
  - *Refs*: `19-viewer-page-01.png`, `19-viewer-page-03.png`
  - *Pixel Observation*: Soft digital tones, delicate eyelashes and hair strands, gentle blushing highlights, and warm, soothing visual presentation.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: No continuous start-development-impact-resolved action sequence isolated across consecutive body pages.

---

### Position 20: `work-44d0000353478596369e` — 環と周

- **`artRealism` = 2**
  - *Refs*: `20-reader-step-10.png`, `20-reader-step-18.png`
  - *Pixel Observation*: Standard mature josei stylization with grounded realistic human proportions, naturalistic facial expressions and gestures, and subtle anatomical rendering.
  - *Limitation*: Sample limited to 6 preview pages of the single volume.
  - *Confidence*: 0.85
- **`artDensity` = 1**
  - *Refs*: `20-reader-step-12.png`, `20-reader-step-26.png`
  - *Pixel Observation*: Clean, airy layouts with significant white space, uncluttered domestic and workplace interiors, and restraint in screentone usage.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`visualSoftness` = 3**
  - *Refs*: `20-reader-step-14.png`, `20-reader-step-22.png`
  - *Pixel Observation*: Gentle, delicate pen lines, soft screentone shading, and tender facial contouring throughout interpersonal interactions.
  - *Limitation*: Sample capped at 6 pages.
  - *Confidence*: 0.85
- **`motionImpact` = U**
  - *Unmet Gate*: No continuous start-development-impact-resolved action sequence isolated across consecutive body pages.

---

## 5. Endpoint (0 / 4) Multi-Context Audit and Motion Confirmation

### 5.1 Endpoint Audit

- **Work 18 (`work-39c1a2b6791238827ed5`, とろける鉄工所) — `artRealism` = 0**:
  - *Welding shop floor context* (`18-reader-step-07.png`, `18-reader-step-11.png`): Extreme caricature facial deformation, bean heads, slit/dot eyes, cartoon proportions.
  - *Social/family/office context* (`18-reader-step-15.png`, `18-reader-step-19.png`): Identical extreme deformation on female date characters, office workers, and sleeping figures.
  - *Moonlight training & tool context* (`18-reader-step-23.png`, `18-reader-step-27.png`): Chibi 2-head-tall caricature anatomy maintained uniformly.
  - *Audit conclusion*: All distinct contexts universally support endpoint 0.
- **Work 18 (`work-39c1a2b6791238827ed5`, とろける鉄工所) — `artDensity` = 0**:
  - *Welding shop floor context* (`18-reader-step-07.png`, `18-reader-step-11.png`): Minimal lines, large blank white backgrounds, sparse panel elements.
  - *Social/family/office context* (`18-reader-step-15.png`, `18-reader-step-19.png`): Extensive empty white margins, minimal screentone shading, unrendered room backdrops.
  - *Moonlight training & tool context* (`18-reader-step-23.png`, `18-reader-step-27.png`): Simple isolated tool sketches with open negative space across all panels.
  - *Audit conclusion*: All distinct contexts universally support endpoint 0.
- **No other 0 or 4 endpoints were assigned to any static Art factor**.

### 5.2 Motion Impact Confirmation

- All 10 works (Positions 11–20) have **`motionImpact = U`** (unknown).
- Continuous action sequence start-development-impact-resolved criteria were not met in the frozen preview samples.

---

## 6. Repository and Payload Invariance Confirmation

- **No mutations**: No temporary image, preflight file, payload asset, or repository file was copied, moved, deleted, edited, or committed.
- **Read-only execution**: All operations were strictly read-only inspections.
