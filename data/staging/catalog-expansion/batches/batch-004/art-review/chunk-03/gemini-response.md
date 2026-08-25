# Batch 004 Chunk 03 Independent Gemini Art Review

## 1. Attestation and Execution Environment

- **Exact Model & Effort:** Gemini 3.7 Flash High (`gemini-3.7-flash-high`), effort `high`.
- **Execution Mode:** Read-only `plan` mode with normal completion; no repository files, payload files, or images were created, copied, moved, deleted, edited, or committed.
- **Input & Pixel Verification:** All eight frozen inputs and all 58 preview images under `images/` were opened, inspected, and verified at original pixels. No image rendering failed, and no fallback, substitution, rate-limiting, timeout, truncation, or quality degradation occurred.
- **Reviewer Independence & Protocol:** `reviewedByHuman=false`. Muse status is `NOT_USED`. Cursor Grok status is `ART_ABSTAIN`. No Local reviewer conclusions, adjudication artifacts, final-art conclusions, or peer outputs (including any `local-art.csv` or `local-codex.md`) were inspected or utilized. Art determinations rely solely on the frozen metadata inputs and the 58 original preview images at original pixels without relying on covers, synopses, animation, genre tags, text factors, or model memory.

---

## 2. Frozen Input Hashes & 58-Image Verification Ledger

### 2.1 Frozen Input Hashes

| Input Path | Expected SHA-256 | Computed SHA-256 | Match |
| --- | --- | --- | :---: |
| `docs/factors/factor-dictionary.md` (`inputs/factor-dictionary.md`) | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | Yes |
| `docs/factors/annotation-guide.md` (`inputs/annotation-guide.md`) | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md` (`inputs/annotation-review-adjudication-request.md`) | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv` (`inputs/frozen-work-set.csv`) | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-03/preflight.csv` (`inputs/preflight.csv`) | `cfea3c57b84331d9255dabf652aef7c2b9ef48031d2db31e64b5aaca569a7eee` | `cfea3c57b84331d9255dabf652aef7c2b9ef48031d2db31e64b5aaca569a7eee` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-03/ledger.md` (`inputs/preflight-ledger.md`) | `5aba86caccc6d9c114a8709d3b9f67899ab077ae7e0591be87864a8c0172b6de` | `5aba86caccc6d9c114a8709d3b9f67899ab077ae7e0591be87864a8c0172b6de` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-03/gemini-payload-ledger.md` (`gemini-payload-ledger.md`) | `47041b5568f3128683675febd14b3dc236b7562536a0996cfe79410a39e529dd` | `47041b5568f3128683675febd14b3dc236b7562536a0996cfe79410a39e529dd` | Yes |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-03/gemini-root-identity.json` (`gemini-root-identity.json`) | `b92aa89baddb43f28c379d8a3abe7959e141c11932ce7f85d690c709997f8c92` | `b92aa89baddb43f28c379d8a3abe7959e141c11932ce7f85d690c709997f8c92` | Yes |

- **Sorted Payload Identity SHA-256:** `059722be6395a449ed9e305687529f319f3eb033c89cb64445895c09516189be` (Verified match).

---

### 2.2 58-Image Inspection and Verification Table

| File | Expected SHA-256 | Computed SHA-256 | openedAtOriginalPixels | Unique Visible Cue |
| --- | --- | --- | :---: | --- |
| `21-reader-step-04.png` | `13d3a1c76cb66a27442c87459853df940ec7b3f3a5db975cde0b2b76d4565172` | `13d3a1c76cb66a27442c87459853df940ec7b3f3a5db975cde0b2b76d4565172` | yes | Fuuko in knit hat holding manga volume 101 against chest over railway tracks as oncoming train approaches below |
| `21-reader-step-08.png` | `948cf8d499d6ce9d3ab35fdcfa31063bcbb9ca29a06b677796d5710254dc5b1d` | `948cf8d499d6ce9d3ab35fdcfa31063bcbb9ca29a06b677796d5710254dc5b1d` | yes | Fuuko clenching manga on overpass railing as panicked crowd and businessman plead with her from staircase |
| `21-reader-step-12.png` | `63d3cb9e0e662fc4bbf8cdac67a224e9dfd339ec60dee3971b7c368adfc8eb95` | `63d3cb9e0e662fc4bbf8cdac67a224e9dfd339ec60dee3971b7c368adfc8eb95` | yes | Fuuko leaping from overpass into train windshield causing black blood/impact splatter across front glass |
| `21-reader-step-16.png` | `533d8ca73a3eba15c0f4d60bc8813e0a1721b40091f902ef34ff45eb424b2fc8` | `533d8ca73a3eba15c0f4d60bc8813e0a1721b40091f902ef34ff45eb424b2fc8` | yes | Undead naked man (Andy) regenerating upper body grasping Fuuko shouting "俺は…不死だ" as spectators scream |
| `21-reader-step-20.png` | `9d0a16d5d90eee0694264d36d0c9d3c26d6bbe70d388899247b16d787044355b` | `9d0a16d5d90eee0694264d36d0c9d3c26d6bbe70d388899247b16d787044355b` | yes | Andy pinned under falling steel I-beam on trackside gravel asking Fuuko about her unluck origin 10 years ago |
| `21-reader-step-24.png` | `4b19197c011ee078d7c97dc4a5f98f79ac9aa31e21c88895bfbde89e26e6cb0b` | `4b19197c011ee078d7c97dc4a5f98f79ac9aa31e21c88895bfbde89e26e6cb0b` | yes | Andy bursting out of BANANA wooden crate while Fuuko slips on banana peel falling backward down roof opening |
| `22-reader-step-08.png` | `2c59afc5a485c1f35e763a6f087721c5c31f75fc162224517f9e351d62e9d4ea` | `2c59afc5a485c1f35e763a6f087721c5c31f75fc162224517f9e351d62e9d4ea` | yes | Takeo Gouda at 50th junior high graduation ceremony receiving tearful farewells and messages from male club juniors |
| `22-reader-step-12.png` | `50e0bb1daf36ed1cd5f5f2bcc28090a3034b8a5629c0ba82f287d0ea089339d2` | `50e0bb1daf36ed1cd5f5f2bcc28090a3034b8a5629c0ba82f287d0ea089339d2` | yes | Flashback panels showing girls confessing love to Sunakawa since kindergarten while rejecting young Takeo |
| `22-reader-step-16.png` | `64234bb591f95d07e08d62029bae5b813876849ebdec2c31f1efbd0cc489c7d8` | `64234bb591f95d07e08d62029bae5b813876849ebdec2c31f1efbd0cc489c7d8` | yes | Sunakawa laughing aloud with Takeo walking along railway embankment while passenger train passes below |
| `22-reader-step-20.png` | `267e611d57271ac60b96eeed0602485fabb574de9c218a53eeb9d207b3ba9563` | `267e611d57271ac60b96eeed0602485fabb574de9c218a53eeb9d207b3ba9563` | yes | Takeo collaring groper on commuter train while Rinko Yamato looks up with sparkling eyes offering to testify |
| `22-reader-step-24.png` | `84c180390b81b45624fce97c0d1ee617b82f6fe986f6853120dcc4b6e4d07a8e` | `84c180390b81b45624fce97c0d1ee617b82f6fe986f6853120dcc4b6e4d07a8e` | yes | Takeo and Sunakawa conversing in bedroom before Takeo's mother announces Yamato has arrived at front door |
| `23-reader-step-04.png` | `a7595cb3c80b73fe4a85e0ea6e9ebd056b581b88c0f342d71bf1fabe06eb8a8b` | `a7595cb3c80b73fe4a85e0ea6e9ebd056b581b88c0f342d71bf1fabe06eb8a8b` | yes | Salaryman smashing alarm clock and walking past office building under chapter header "第1服 茶道部" |
| `23-reader-step-08.png` | `5dd49f573c089b8a0bcde4b4a0da069b7507009851195a073f4e173d6d699ed5` | `5dd49f573c089b8a0bcde4b4a0da069b7507009851195a073f4e173d6d699ed5` | yes | Spiky-haired Masatoshi Funabashi walking on street confronted by three smirking delinquents in jackets |
| `23-reader-step-12.png` | `4b01bf97465cbb0fe840590115b1df77445205b5da64ae7fb1789e92fbc37b6f` | `4b01bf97465cbb0fe840590115b1df77445205b5da64ae7fb1789e92fbc37b6f` | yes | Short-haired schoolgirl carrying schoolbag walking past delinquents telling them to fight in a secluded area |
| `23-reader-step-16.png` | `118cf80045e02921e22af044d59b89d90c42abb9dceb2f99217756e78edc2eab` | `118cf80045e02921e22af044d59b89d90c42abb9dceb2f99217756e78edc2eab` | yes | Delinquents slumped unconscious against wall as friendly schoolmate Wataru Yamada greets Funabashi |
| `23-reader-step-20.png` | `c02bd179155760afda81307ea15da1640e9752eaf786b6d281504cf9d70fc4fe` | `c02bd179155760afda81307ea15da1640e9752eaf786b6d281504cf9d70fc4fe` | yes | Flashback panels of Funabashi recalling various past brawls at convenience stores, vending machines, and beaches |
| `23-reader-step-24.png` | `d0266a090d026dc20cceba235e13a7e64d9e566fe8bbd7ea682088b37a96d97b` | `d0266a090d026dc20cceba235e13a7e64d9e566fe8bbd7ea682088b37a96d97b` | yes | Funabashi grinning amidst falling sakura petals in front of high school entrance and new student class list board |
| `24-reader-step-08.png` | `e0fa0a5a5b20464fc22d573d793a1c9f70c07367e73d9b4edeffc8d9ce70d4d4` | `e0fa0a5a5b20464fc22d573d793a1c9f70c07367e73d9b4edeffc8d9ce70d4d4` | yes | Giant dark circular void eye with "You saw me." looming over protagonist before massive fanged monster mouth appears |
| `24-reader-step-12.png` | `0edd0282307ac922d4da4aa943b13843b23ff659c3506871ed6a57e728298f19` | `0edd0282307ac922d4da4aa943b13843b23ff659c3506871ed6a57e728298f19` | yes | Job interview room with two evaluators behind long office desk telling blond candidate he is one minute late |
| `24-reader-step-16.png` | `855348385abe6cc629840b40d4d626794bb224044b5e00b6da01efc1ff4778db` | `855348385abe6cc629840b40d4d626794bb224044b5e00b6da01efc1ff4778db` | yes | Tall busty woman in form-fitting black turtleneck and heels standing under elevated highway underpass |
| `24-reader-step-20.png` | `78f6a586ab1258cd1aea4d00653dc7ec7ea9d1a46057324b69684526cb7fe3f7` | `78f6a586ab1258cd1aea4d00653dc7ec7ea9d1a46057324b69684526cb7fe3f7` | yes | Protagonist sprinting in frantic panic along night street after making direct eye contact with eerie apparition |
| `24-reader-step-24.png` | `6d39a46daf0ecb174ad162c14ca3e3ad20f87b2aeafaa7a413fb0d963fa61b47` | `6d39a46daf0ecb174ad162c14ca3e3ad20f87b2aeafaa7a413fb0d963fa61b47` | yes | Mysterious woman decapitating monster with needle wire ("左") as headless torso spurts black blood |
| `24-reader-step-28.png` | `6eb2d310d02230e436fbdce65c6b4f8fd0370afee8a8bd9c184902f13f4f306d` | `6eb2d310d02230e436fbdce65c6b4f8fd0370afee8a8bd9c184902f13f4f306d` | yes | Woman wearing apron in kitchen chopping food asking protagonist "起きましたか" as he wakes in shock on floor |
| `25-reader-step-02.png` | `65223c3997dd6f0d74a2b38fe7d1d832c6c517de02b08e8f7613fc843007aa50` | `65223c3997dd6f0d74a2b38fe7d1d832c6c517de02b08e8f7613fc843007aa50` | yes | Teacher handing out 4th grade school newspaper in classroom while students praise Ayumu Fujino's 4-koma manga |
| `25-reader-step-03.png` | `f2e11ee01c71e3f21674e2c9099135d23495520a897485336170b1acb2625d8f` | `f2e11ee01c71e3f21674e2c9099135d23495520a897485336170b1acb2625d8f` | yes | Fujino acting nonchalant at desk while her printed 4-koma "ファーストキス" (First Kiss) appears in newspaper |
| `25-reader-step-04.png` | `dffcfba325f5eb11a9beb2940f86053e82cecac6287506447967c39ce3c0b180` | `dffcfba325f5eb11a9beb2940f86053e82cecac6287506447967c39ce3c0b180` | yes | Fujino discussing future manga career with friend before teacher summons her to the faculty room (職員室) |
| `25-reader-step-05.png` | `7239f4917f077f86736a247a6481ad41598738909b467da0639b499ee854b081` | `7239f4917f077f86736a247a6481ad41598738909b467da0639b499ee854b081` | yes | Faculty room with teacher seated at cluttered office desk asking Fujino to give one newspaper slot to Kyomoto |
| `25-reader-step-06.png` | `019bee04c59fee18fb045ba1ea2a0639c68c3fdf2408233b6bdac11e519356bb` | `019bee04c59fee18fb045ba1ea2a0639c68c3fdf2408233b6bdac11e519356bb` | yes | Smirking Fujino dismissing amateur competition before receiving the new school newspaper issue in classroom |
| `25-reader-step-07.png` | `5bad5fba8d0dd6f6f72be158ef0da2b5be44b4f9b86443f3f2c3d69a269470bb` | `5bad5fba8d0dd6f6f72be158ef0da2b5be44b4f9b86443f3f2c3d69a269470bb` | yes | School newspaper showing Fujino's simple comic next to Kyomoto's hyper-detailed background art "放課後の学校" |
| `26-reader-page-005.png` | `acab0f646c50d7d851d074b4dba96da87c8257abb9c3f5e985fd03392de98f2c` | `acab0f646c50d7d851d074b4dba96da87c8257abb9c3f5e985fd03392de98f2c` | yes | Sports festival relay race and student drawing scavenger hunt prompt "かわいい人" (cute person) on folded paper |
| `26-reader-page-006.png` | `affc4cbe636b4b0eaf1174cd2f682b68286070d1afcee837e3751c548dfb1074` | `affc4cbe636b4b0eaf1174cd2f682b68286070d1afcee837e3751c548dfb1074` | yes | Ema spotting Hayashi tangled inside obstacle-course net and dragging him along as his scavenger hunt entry |
| `26-reader-page-007.png` | `674a6116a5fc581a6958b1aa0807f08002bd183c67d053500b35a85723dd03f5` | `674a6116a5fc581a6958b1aa0807f08002bd183c67d053500b35a85723dd03f5` | yes | Hayashi wrapped in net interviewed at announcer microphone during sports festival ceremony |
| `26-reader-page-008.png` | `bd384aaba7abdd5eb17c8994dd0c0ab7866f3202c564024a3285a61c7fae21de` | `bd384aaba7abdd5eb17c8994dd0c0ab7866f3202c564024a3285a61c7fae21de` | yes | High school boys washing hands and fixing hair at restroom mirror sinks while discussing bear encounters |
| `26-reader-page-009.png` | `6d054a04306ce320ee8387ed81e6ed32755b5ebbcb66aa44d6f2b8b770ee5169` | `6d054a04306ce320ee8387ed81e6ed32755b5ebbcb66aa44d6f2b8b770ee5169` | yes | Students eating set lunches in school cafeteria (食堂) waving away flies and looking out through open window |
| `26-reader-page-010.png` | `fb094439c474b90ec5c0172158ee62d9f3fb9ff21b545e4390ea510a9c41c0ea` | `fb094439c474b90ec5c0172158ee62d9f3fb9ff21b545e4390ea510a9c41c0ea` | yes | Hayashi sitting on outdoor stair landing eating snack bun and holding BOSU cafe au lait bottle |
| `27-reader-page-005.png` | `8f41f4fac83624f57d31b3b2607cb46ff2fb119b3121d733162e406cd1dff973` | `8f41f4fac83624f57d31b3b2607cb46ff2fb119b3121d733162e406cd1dff973` | yes | Takafumi checking smartphone on pedestrian crossing in front of large delivery truck before heading to hospital |
| `27-reader-page-006.png` | `baba685186aa20d155e4cd777749e79365071a1ab11efce8b7fb1a2134450e1e` | `baba685186aa20d155e4cd777749e79365071a1ab11efce8b7fb1a2134450e1e` | yes | Close-up of Takafumi with glowing glasses and long-haired Uncle's stubbled chin in hospital gown |
| `27-reader-page-008.png` | `cb0801b2612ac471e60bb9609750fe2a68eda5d06077b97b830ed4d637c9371d` | `cb0801b2612ac471e60bb9609750fe2a68eda5d06077b97b830ed4d637c9371d` | yes | Uncle sitting up in hospital bed declaring he has returned after 17 years in fantasy world Granbahamal |
| `27-reader-page-009.png` | `86d57ce38c36b8b061b1be1abe2ebd367c9fb097976836c53c6796acdfe78432` | `86d57ce38c36b8b061b1be1abe2ebd367c9fb097976836c53c6796acdfe78432` | yes | Cheerful nurse entering hospital room to take temperature as Uncle utters bizarre fantasy spells |
| `27-reader-page-010.png` | `95f1771213244899100ba17d75ec9eed26a6dac0341066ff38c910d0d04638b8` | `95f1771213244899100ba17d75ec9eed26a6dac0341066ff38c910d0d04638b8` | yes | Nurse leaving hospital room as Takafumi and Uncle stare silently at each other through reflective glasses |
| `28-reader-step-04.png` | `ce21d4d86db9b71f6686520617c2a1e3349f2086e147c11d1ff9216203b196b3` | `ce21d4d86db9b71f6686520617c2a1e3349f2086e147c11d1ff9216203b196b3` | yes | Girl listening to voicemail on phone on rainy day holding umbrella handle at waist under soft tone overlay |
| `28-reader-step-08.png` | `8899258e2d6fadb2d8ca40003f210031b857295572b7f23405bad950bf36215d` | `8899258e2d6fadb2d8ca40003f210031b857295572b7f23405bad950bf36215d` | yes | Smartphone dropped in rainy street puddle displaying incoming call screen from "父" (father) |
| `28-reader-step-12.png` | `e6caf0002f0607b8aea29b7862a3dc2d5f5ce2b9250e14da9dea321141d7f053` | `e6caf0002f0607b8aea29b7862a3dc2d5f5ce2b9250e14da9dea321141d7f053` | yes | Girl weeping softly while remembering storybook fairy tale prince riding winged dragon holding handkerchief |
| `28-reader-step-16.png` | `c86aede9c153425fb7eddcda62521cb6693d4d6048fd79a9b5b006dd6dd4dff8` | `c86aede9c153425fb7eddcda62521cb6693d4d6048fd79a9b5b006dd6dd4dff8` | yes | Dark-haired girl at train station ticket machine gasping in distress upon realizing she forgot her wallet |
| `28-reader-step-20.png` | `8e247865d49599588b390109c8ca02210c063994a49df8346d882df32a347d8a` | `8e247865d49599588b390109c8ca02210c063994a49df8346d882df32a347d8a` | yes | Blonde girl offering bracelet as security on train station platform next to author title column note |
| `28-reader-step-24.png` | `dea3aad7fa300b54dbe2037cee8fcb21b01377900d4948d9e1619f68e3018e4b` | `dea3aad7fa300b54dbe2037cee8fcb21b01377900d4948d9e1619f68e3018e4b` | yes | Blonde girl ducking down in convenience store aisle then turning around in shock to see handsome boy on phone |
| `29-reader-step-04.png` | `0695b256ed66f044a60a4534c7226f8b0329b4de5568d78ebfb5220ff69ec69f` | `0695b256ed66f044a60a4534c7226f8b0329b4de5568d78ebfb5220ff69ec69f` | yes | Young man lying on wooden hallway floor looking up as bare feet approach under title header "式の前日" |
| `29-reader-step-06.png` | `866136f4f1d830637392a9c6079f5e341e4be3bc297b600c2654f6ee601cc989` | `866136f4f1d830637392a9c6079f5e341e4be3bc297b600c2654f6ee601cc989` | yes | Young man and short-haired woman sitting on floor by window discussing his 3rd year working in society |
| `29-reader-step-08.png` | `1447c05c3a33382a3a807d9ba4f3b7da9d37e12ecef838d0848b957f7b8f0c07` | `1447c05c3a33382a3a807d9ba4f3b7da9d37e12ecef838d0848b957f7b8f0c07` | yes | Couple standing before mirror discussing wedding dress fit and puff sleeves for tomorrow's ceremony |
| `29-reader-step-10.png` | `3bcc5cbe3061a4f87069611d04082ef0583465930fdef466efff053d464f2733` | `3bcc5cbe3061a4f87069611d04082ef0583465930fdef466efff053d464f2733` | yes | Young man lying on tatami discussing wedding reception course menu A vs B and his social awkwardness |
| `29-reader-step-12.png` | `504a46c70ec19df4fd371fdf4b1279a6b97602eb70d8b9910e5c423565a8385c` | `504a46c70ec19df4fd371fdf4b1279a6b97602eb70d8b9910e5c423565a8385c` | yes | Couple seated across round low table (chabudai) eating home-cooked meal together in traditional room |
| `29-reader-step-14.png` | `21f2c6030006756abbc37771e40843c8517da171742fc7983949ad0395fc4b01` | `21f2c6030006756abbc37771e40843c8517da171742fc7983949ad0395fc4b01` | yes | Woman kneeling with hands clasped praying before family altar as man walks down darkened hallway corridor |
| `30-reader-step-08.png` | `bced0b866bf404ca6030c0a7526854f7b0df1e5d46fb3ff6f6bb87e98bce0d44` | `bced0b866bf404ca6030c0a7526854f7b0df1e5d46fb3ff6f6bb87e98bce0d44` | yes | Scarf-wearing friend greeting Kyotaro at shrine door holding up straw voodoo doll (ワラ人形) |
| `30-reader-step-12.png` | `838904b7d32b10dd4011b994a2ba7e735b42c8ad7f37b173f14c677eddfed705` | `838904b7d32b10dd4011b994a2ba7e735b42c8ad7f37b173f14c677eddfed705` | yes | Glasses-wearing friend examining straw doll with photo of Kyotaro pinned to it outdoors on shrine grounds |
| `30-reader-step-16.png` | `70c5e125fe2e4222b5a6577c0443fc3f147676910111b939abb40d4a0bd2a273` | `70c5e125fe2e4222b5a6577c0443fc3f147676910111b939abb40d4a0bd2a273` | yes | Kyotaro falling to knees in shrine hall despairing over being cursed before friends suggest counterplan |
| `30-reader-step-20.png` | `8950ceaaa43f6aed1c25b98ed9a7248e6020b7db3c4469ca80973da44aba960b` | `8950ceaaa43f6aed1c25b98ed9a7248e6020b7db3c4469ca80973da44aba960b` | yes | Woman in kimono hammering straw doll into sacred tree trunk at night as three friends watch from behind |
| `30-reader-step-24.png` | `4ae59ff8b6c23910f744490bf7d7f89129353e750b506472f3cff6618eab27d4` | `4ae59ff8b6c23910f744490bf7d7f89129353e750b506472f3cff6618eab27d4` | yes | Kyotaro's mother in bun grabbing him by shoulder praising him for stopping curse before realizing truth |
| `30-reader-step-28.png` | `c27880635d6e247b33e04e3af33ffab549ad75815bbe151a74078b98d7f86229` | `c27880635d6e247b33e04e3af33ffab549ad75815bbe151a74078b98d7f86229` | yes | Furious mother with demon horns wielding broom chasing Kyotaro and friends down stone shrine pathway |

---

## 3. Chunk 03 Review Table (Positions 21–30)

| Position | workId | Canonical Title | artRealism | artDensity | visualSoftness | motionImpact | State |
| :---: | --- | --- | :---: | :---: | :---: | :---: | :---: |
| 21 | `work-53fb816835ab36e40a1f` | アンデッドアンラック | U | U | U | U | `unknown-ready` |
| 22 | `work-62fbc6b2253b895e3a66` | 俺物語！！ | U | U | U | U | `unknown-ready` |
| 23 | `work-634f34830600e07d8f17` | お茶にごす。 | 2 | 2 | 1 | U | `sample-ready` |
| 24 | `work-65f856a6fa2078f21d2f` | 黒月のイェルクナハト | 2 | 3 | 1 | U | `sample-ready` |
| 25 | `work-741deb03d9f59e723929` | ルックバック | 3 | 3 | 2 | U | `sample-ready` |
| 26 | `work-7c8931bc010e2f28f7ec` | 夢中さ、きみに。 | 3 | 2 | 2 | U | `sample-ready` |
| 27 | `work-7d4568dcc8e9175d35ba` | 異世界おじさん | U | U | U | U | `unknown-ready` |
| 28 | `work-7f0f63c5d80083f2be7f` | 思い、思われ、ふり、ふられ | 2 | 2 | 4 | U | `sample-ready` |
| 29 | `work-80a2f62ce5073ade2ec2` | 式の前日 | 3 | 3 | 3 | U | `sample-ready` |
| 30 | `work-8733067e6afcaeadbd8d` | さんすくみ | 2 | 2 | 2 | U | `sample-ready` |

*Note: Exactly 10 works and 40 terminal cells.*

---

## 4. Position Evaluations & Dictionary Evidence

### Position 21: `work-53fb816835ab36e40a1f` — アンデッドアンラック
- **State:** `unknown-ready`
- **Cell Determinations:** `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.
- **Unmet Gates:**
  - *Static Gate Failure:* All 6 readable internal pages (`reader-step-04`, `08`, `12`, `16`, `20`, `24`) stem from a single continuous railway overpass encounter and immediate trackside aftermath (`distinctContextCount=1`, failing the mandatory prerequisite of at least two distinct scenes/contexts).
  - *Motion Gate Failure:* `motionGateAttemptable=false` in frozen preflight; no bounded continuous start-development-impact-resolved action sequence is isolated.

---

### Position 22: `work-62fbc6b2253b895e3a66` — 俺物語！！
- **State:** `unknown-ready`
- **Cell Determinations:** `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.
- **Unmet Gates:**
  - *Static Gate Failure:* Only 5 genuine internal body pages are available after excluding the `reader-step-04` opening/title splash (`readableInternalPageCount=5`, failing the mandatory prerequisite of at least six readable body pages).
  - *Motion Gate Failure:* `motionGateAttemptable=false` in frozen preflight; no bounded continuous action sequence is isolated.

---

### Position 23: `work-634f34830600e07d8f17` — お茶にごす。
- **State:** `sample-ready`
- **Static Gate:** Met (6 readable internal pages, 2 distinct contexts: school entrance/grounds and outdoor street confrontations).
- **Motion Gate:** Unmet (`motionGateAttemptable=false`; physical skirmishes are isolated gags/recollections without a bounded continuous start-development-impact-resolved sequence -> `motionImpact=U`).
- **Static Axis Evaluations:**
  - **`artRealism` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 일반적 스타일화 (Standard stylized manga aesthetic).
    - *Pixel Observations:* Proportions of high school students and adults are anatomically sound with standard human builds, combined with stylized manga conventions (slanted slit eyes, angular jawlines, spiky hair contours, and comedic exaggerated expressions in fight flashbacks).
    - *Exact Refs:* `23-reader-step-08` (Funabashi's stylized face and delinquent trio proportions on street), `23-reader-step-24` (Funabashi's expression and anatomy against school gate).
  - **`artDensity` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 균형 (Balanced line and background density).
    - *Pixel Observations:* Clear, uncluttered line economy with functional architectural rendering (school facade, concrete street walls, fences) and clean flat screentone shading; balanced negative white space across panels.
    - *Exact Refs:* `23-reader-step-04` (building facade, alarm clock, street perspective), `23-reader-step-24` (school gate, sakura foliage, class list board).
  - **`visualSoftness` = 1** (Confidence: 0.80)
    - *Dictionary Anchor:* 1 = 거칠고 각진 표현과 중립 사이 (Sharp/angular linework leaning).
    - *Pixel Observations:* Nishimori's signature sharp, spiky hair contours, angular jawlines, straight-edged hatching on scowls, and crisp ink contours give the character linework an angular, sharp feel, balanced with soft tone fills.
    - *Exact Refs:* `23-reader-step-08` (sharp spiky hair outlines and scowling angular eyebrows/chin), `23-reader-step-20` (sharp angular facial expressions and rigid combat lines).
- **Limitations:** Scope limited to 6 preview pages from volume 1 chapter 1 covering school entrance and street delinquent confrontations; interior tea ceremony club practice room is not depicted in these preview pages; electronic JDCN bridge to representative print ISBN.

---

### Position 24: `work-65f856a6fa2078f21d2f` — 黒月のイェルクナハト
- **State:** `sample-ready`
- **Static Gate:** Met (6 readable internal pages, 4 distinct contexts: eerie encounter, interview office, highway underpass street, action/kitchen aftermath).
- **Motion Gate:** Unmet (`motionGateAttemptable=false`; decapitation cut on step 24 is a single impact panel, lacking a continuous start-development-impact-resolved sequence -> `motionImpact=U`).
- **Static Axis Evaluations:**
  - **`artRealism` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 일반적 스타일화 (Standard stylized manga aesthetic).
    - *Pixel Observations:* Stylized anime character proportions (expressive large eyes, pointed chins, sharp monster fangs, exaggerated female chest silhouette) placed within realistic urban environments and office spaces.
    - *Exact Refs:* `24-reader-step-12` (interview room with standard proportions, stylized faces), `24-reader-step-16` (stylized female silhouette against realistic architectural underpass).
  - **`artDensity` = 3** (Confidence: 0.85)
    - *Dictionary Anchor:* 3 = 균형과 고밀도 사이 (High density leaning).
    - *Pixel Observations:* High visual density featuring rich screentones, dark solid black fills, frantic dense speedlines, crosshatching on clothes/hair, and detailed structural rendering under the highway underpass and in the office.
    - *Exact Refs:* `24-reader-step-08` (dense dark void eye with heavy ink fills and crosshatched monster teeth), `24-reader-step-20` (dense vertical scratchy speedlines and textured street background).
  - **`visualSoftness` = 1** (Confidence: 0.80)
    - *Dictionary Anchor:* 1 = 거칠고 각진 표현과 중립 사이 (Sharp/angular horror linework leaning).
    - *Pixel Observations:* High-contrast linework with sharp, scratchy horror hatching, jagged panic strokes on terrorized faces, and sharp geometric needle-wire decapitation contours, moderated by smooth tone gradients.
    - *Exact Refs:* `24-reader-step-20` (scratchy jagged terror lines on face and speedlines), `24-reader-step-24` (sharp decapitation line, sharp needle wire, high contrast black blood splatter).
- **Limitations:** Scope limited to 6 preview pages from volume 1 trial covering opening monster encounter, interview, and kitchen aftermath.

---

### Position 25: `work-741deb03d9f59e723929` — ルックバック
- **State:** `sample-ready`
- **Static Gate:** Met (6 readable internal pages, 3 distinct contexts: classroom, faculty room, school hallway/newspaper).
- **Motion Gate:** Unmet (`motionGateAttemptable=false`; static slice-of-life and creative process scenes -> `motionImpact=U`).
- **Static Axis Evaluations:**
  - **`artRealism` = 3** (Confidence: 0.90)
    - *Dictionary Anchor:* 3 = 일반적 스타일화와 현실적 인체·배경 사이 (Realist-leaning manga style).
    - *Pixel Observations:* Realistic human proportions, naturalistic body postures, subtle facial micro-expressions (eyelid folds, lip shading, authentic gestures), coupled with Kyomoto's hyper-realistic architectural background illustrations.
    - *Exact Refs:* `25-reader-step-02` (realistic bird's-eye perspective of classroom desks and natural student postures), `25-reader-step-07` (Kyomoto's photorealistic fine-art perspective rendering of empty school desks, hallway lockers, and entrance facade).
  - **`artDensity` = 3** (Confidence: 0.90)
    - *Dictionary Anchor:* 3 = 균형과 고밀도 사이 (High density leaning).
    - *Pixel Observations:* Intricate environmental linework, detailed classroom and faculty office clutter (swivel chairs, cables, papers), and exceptionally dense fine crosshatching in Kyomoto's background panels.
    - *Exact Refs:* `25-reader-step-05` (faculty office desks with computer cords, papers, swivel chairs, windows), `25-reader-step-07` (dense fine line hatching on wooden shoe cubbies, floorboards, window panes, and building exterior).
  - **`visualSoftness` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 중립 (Neutral visual balance).
    - *Pixel Observations:* Fluid, organic dip-pen line art with nuanced facial shading, balanced line weight, and naturalistic hair rendering without harsh digital rigidity or excessive tone softness.
    - *Exact Refs:* `25-reader-step-03` (organic pen contours of Fujino resting chin on hand), `25-reader-step-06` (delicate ink contours on Fujino's smiling face and classroom background).
- **Limitations:** Scope limited to 6 preview pages from the one-shot edition covering elementary school newspaper 4-koma serialized competition.

---

### Position 26: `work-7c8931bc010e2f28f7ec` — 夢中さ、きみに。
- **State:** `sample-ready`
- **Static Gate:** Met (6 readable internal pages, 4 distinct contexts: sports festival field, restroom, cafeteria interior, exterior stair landing).
- **Motion Gate:** Unmet (`motionGateAttemptable=false`; deadpan conversational and observational scenes without continuous action -> `motionImpact=U`).
- **Static Axis Evaluations:**
  - **`artRealism` = 3** (Confidence: 0.90)
    - *Dictionary Anchor:* 3 = 일반적 스타일화와 현실적 인체·배경 사이 (Realist-leaning gekiga/indie aesthetic).
    - *Pixel Observations:* Grounded anatomical proportions, realistic facial features (subtle eyes, lifelike noses, natural jawlines), authentic school uniform draping, and realistic everyday postures.
    - *Exact Refs:* `26-reader-page-005` (anatomically grounded male student bodies in athletic uniforms running relay), `26-reader-page-010` (realistic sitting posture, hand anatomy holding cafe au lait bottle and snack).
  - **`artDensity` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 균형 (Balanced line and background density).
    - *Pixel Observations:* Restrained, clean line economy with generous open white space, flat screentone fields, and precise yet minimal architectural perspective lines.
    - *Exact Refs:* `26-reader-page-008` (clean tile lines in restroom, simple washbasin fixtures, flat suit tones), `26-reader-page-009` (clean cafeteria doorframe, simple table lines, flat grey tone fills).
  - **`visualSoftness` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 중립 (Neutral visual softness).
    - *Pixel Observations:* Crisp, delicate dip-pen linework with clean contours, precise eye outlines, and subtle screentone shading, balancing sharp ink definition with organic human warmth.
    - *Exact Refs:* `26-reader-page-006` (fine net mesh lines across Hayashi's face and clean hair lines), `26-reader-page-010` (crisp hair luster, defined jawline, and smooth stair shadow tones).
- **Limitations:** Scope limited to 6 pages from volume 1 digital trial covering Chapter 1 "かわいい人".

---

### Position 27: `work-7d4568dcc8e9175d35ba` — 異世界おじさん
- **State:** `unknown-ready`
- **Cell Determinations:** `artRealism=U`, `artDensity=U`, `visualSoftness=U`, `motionImpact=U`.
- **Unmet Gates:**
  - *Static Gate Failure:* Only 5 genuine internal body pages are available after excluding the `reader-page-007` chapter-opening illustration (`readableInternalPageCount=5`, failing the mandatory prerequisite of at least six readable body pages).
  - *Motion Gate Failure:* `motionGateAttemptable=false` in frozen preflight; no bounded continuous action sequence is isolated.

---

### Position 28: `work-7f0f63c5d80083f2be7f` — 思い、思われ、ふり、ふられ
- **State:** `sample-ready`
- **Static Gate:** Met (6 readable internal pages, 5 distinct contexts: home phone, rainy outdoor phone, fantasy/school memory, station platform/gate, convenience store interior).
- **Motion Gate:** Unmet (`motionGateAttemptable=false`; shojo emotional and romantic dialogue scenes -> `motionImpact=U`).
- **Static Axis Evaluations:**
  - **`artRealism` = 2** (Confidence: 0.90)
    - *Dictionary Anchor:* 2 = 일반적 스타일화 (Standard stylized shojo manga aesthetic).
    - *Pixel Observations:* Classic shojo stylized facial features with large, luminous, expressive eyes, detailed iris highlights, long eyelashes, and delicate facial structures, set against realistic urban station and store backgrounds.
    - *Exact Refs:* `28-reader-step-16` (large expressive shojo eyes with detailed eyelashes and emotional stippling), `28-reader-step-24` (shojo stylized female eyes and handsome male profile with detailed hair flow).
  - **`artDensity` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 균형 (Balanced line and screentone density).
    - *Pixel Observations:* Delicate, airy screentone distribution, clean fine linework with ample negative white space, and balanced environmental detailing (station ticket machines, convenience store shelves).
    - *Exact Refs:* `28-reader-step-08` (open rainy outdoor layout with puddle reflection, umbrella contour, and phone screen), `28-reader-step-20` (station platform column, signs, and delicate character linework).
  - **`visualSoftness` = 4** (Confidence: 0.95)
    - *Dictionary Anchor:* 4 = 부드럽고 미려한 표현 (Soft, delicate, and beautiful rendering across all contexts).
    - *Pixel Observations:* Exceptionally soft, airy, and gentle aesthetic across every context; delicate feathered linework, soft gradient tones, luminous eye reflections, watercolor-like softness, and subtle emotional stippling without harsh angular edges.
    - *Exact Refs:* `28-reader-step-04` (ethereal soft-focus rain atmosphere, delicate hair strands, soft tone transitions), `28-reader-step-12` (gentle watercolor-like tone gradients, soft weeping expression, fairy-tale soft rendering), `28-reader-step-16` (soft dotted aura around face, delicate hair texture), `28-reader-step-24` (soft luminous eye highlights, gentle hair luster).
- **Limitations:** Scope limited to 6 preview pages from volume 1 covering chapter 1 introductory encounter and station exchange.

---

### Position 29: `work-80a2f62ce5073ade2ec2` — 式の前日
- **State:** `sample-ready`
- **Static Gate:** Met (6 readable internal pages, 2 distinct contexts: bedroom/home dialogue and dining/hallway transition).
- **Motion Gate:** Unmet (`motionGateAttemptable=false`; quiet domestic dialogue and prayer scenes -> `motionImpact=U`).
- **Static Axis Evaluations:**
  - **`artRealism` = 3** (Confidence: 0.90)
    - *Dictionary Anchor:* 3 = 일반적 스타일화와 현실적 인체·배경 사이 (Realist-leaning josei / literary style).
    - *Pixel Observations:* Grounded, realistic human proportions, lifelike bone structure and subtle facial musculature, authentic Japanese household architecture and domestic furnishings (tatami mats, chabudai, shoji screens, family altar).
    - *Exact Refs:* `29-reader-step-04` (realistic anatomy of lying figure on hallway floor, lifelike barefoot perspective), `29-reader-step-08` (realistic couple standing before mirror, naturalistic body contours and posture).
  - **`artDensity` = 3** (Confidence: 0.85)
    - *Dictionary Anchor:* 3 = 균형과 고밀도 사이 (High density leaning).
    - *Pixel Observations:* Rich textured pen hatching on hair, clothing folds, and wooden floorboards, detailed ceramic food vessels and side dishes on the table, detailed home altar, and layered tonal textures.
    - *Exact Refs:* `29-reader-step-10` (intricate fine line hatching on hair texture, clothing wrinkles, and tatami lines), `29-reader-step-12` (detailed ceramic bowls, sauce bottle, food contents on table, and wooden wall panels).
  - **`visualSoftness` = 3** (Confidence: 0.85)
    - *Dictionary Anchor:* 3 = 중립과 부드럽고 미려한 표현 사이 (Soft/tender presentation leaning).
    - *Pixel Observations:* Warm, gentle hand-drawn hatching, soft rounded facial contours, tender domestic atmosphere, and delicate textural warmth throughout.
    - *Exact Refs:* `29-reader-step-06` (tender, soft expressive faces and gentle natural lighting from window), `29-reader-step-14` (gentle contemplative expressions, soft hatching on hair, warm intimate mood).
- **Limitations:** Scope limited to 6 preview pages from the title one-shot story "式の前日" within the collection; electronic JDCN bridge to representative print ISBN.

---

### Position 30: `work-8733067e6afcaeadbd8d` — さんすくみ
- **State:** `sample-ready`
- **Static Gate:** Met (6 readable internal pages, 2 distinct contexts: shrine interior/ceremony hall and shrine exterior grounds/sacred tree).
- **Motion Gate:** Unmet (`motionGateAttemptable=false`; comedic slapstick chase on step 28 is an isolated gag without a bounded continuous start-development-impact-resolved action sequence -> `motionImpact=U`).
- **Static Axis Evaluations:**
  - **`artRealism` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 일반적 스타일화 (Standard stylized manga aesthetic).
    - *Pixel Observations:* Proportional anatomy for young men and women with stylized shojo/josei faces (large eyes, sharp jawlines, elongated necks) and exaggerated comedic reaction expressions.
    - *Exact Refs:* `30-reader-step-08` (proportional figures in modern/shrine clothing with stylized smiling/shocked faces), `30-reader-step-20` (kimono-clad figure at sacred tree with stylized expressive faces).
  - **`artDensity` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 균형 (Balanced line and screentone density).
    - *Pixel Observations:* Clean, crisp linework, moderate screentones on traditional robes and shrine foliage, open panel compositions with clear read order.
    - *Exact Refs:* `30-reader-step-16` (shrine interior pillars, shimenawa rope, clean screentone shading), `30-reader-step-28` (stone path paving, tree trunks, speed lines, balanced tone distribution).
  - **`visualSoftness` = 2** (Confidence: 0.85)
    - *Dictionary Anchor:* 2 = 중립 (Neutral visual softness).
    - *Pixel Observations:* Clean, crisp ink lines with smooth curves, balanced screentones, and typical shojo/josei line cleanliness without harsh grit or excessive softness.
    - *Exact Refs:* `30-reader-step-12` (clean defined linework on hair, glasses, and straw doll), `30-reader-step-24` (smooth linework on mother's face and Kyotaro's profile).
- **Limitations:** Scope limited to 6 preview pages from volume 1 chapter 1 covering shrine wa-doll curse episode; electronic JDCN bridge to representative print ISBN.

---

## 5. Extreme Endpoint (0/4) & Gate Boundary Audit

### 5.1 Endpoint Value Audit (0 and 4)
- **Score 0 Audit:** No axis was assigned a value of `0` in this chunk.
- **Score 4 Audit:** One axis was assigned a value of `4`: Position 28 (`思い、思われ、ふり、ふられ`), `visualSoftness = 4`.
  - *Context 1 (`28-reader-step-04`, home phone):* Luminous soft-focus rain atmosphere, delicate hair strands, soft tone transitions.
  - *Context 2 (`28-reader-step-08`, rainy outdoor phone):* Soft rain streaks, gentle puddle reflection, delicate umbrella contour.
  - *Context 3 (`28-reader-step-12`, fantasy/school memory):* Delicate weeping face, gentle gradient tones, storybook soft rendering.
  - *Context 4 (`28-reader-step-16` & `20`, station):* Soft dotted aura around shocked face, delicate eyelashes, airy screentones, gentle platform linework.
  - *Context 5 (`28-reader-step-24`, convenience store interior):* Luminous eye highlights, soft blush, delicate hair luster, tender close-up profile.
  - *Conclusion:* All 5 inspected contexts uniformly exhibit pervasive softness, delicate feathered linework, and luminous tone rendering; endpoint `4` is fully justified across all selected contexts.

### 5.2 Motion & Static Gate Audit
- **All Motion Cells Confirmed as `U`:** All 10 works (positions 21–30) have `motionImpact = U`. No work met the continuous start-development-impact-resolved motion sequence prerequisite (`motionGateAttemptable=false` in preflight).
- **Failed Static Prerequisites Confirmed as `U/U/U/U`:**
  - Position 21 (`アンデッドアンラック`): `U/U/U/U` (1 context only).
  - Position 22 (`俺物語！！`): `U/U/U/U` (5 readable internal pages only).
  - Position 27 (`異世界おじさん`): `U/U/U/U` (5 readable internal pages only).

---

## 6. File & Integrity Confirmation

- **No File Modifications:** No repository files, temporary images, or payload files were copied, moved, deleted, edited, or committed during this review.
- **No Scope Drift:** No promotional recommendations, Local comparisons, or adjudications were made. This document constitutes the sole complete independent Gemini Art review for Chunk 03.
