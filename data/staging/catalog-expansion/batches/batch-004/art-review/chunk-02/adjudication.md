# Batch 004 Art adjudication — chunk 02

- adjudicationDate: `2026-08-25`
- adjudicator: Local Codex independent pixel adjudication
- reviewedByHuman: `false`
- scope: frozen positions 11–20; Factor Dictionary Art axes only
- method: Local and exact Gemini cells compared independently against the frozen official body-page pixels; no averaging or majority vote
- motionImpact: all `unknown`
- Muse was `NOT_USED`
- Cursor Grok: `ART_ABSTAIN`
- temporaryImagesCommitted: `false`
- promotion: not performed
- commit: not performed
- hardBlockers: `0`

## Frozen inputs and reviewer provenance

| Input | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `art-preflight/chunk-02/preflight.csv` | `249d177ae697a41231e15801e86097e3d011a6689027a2bc4f1e80d67968feae` |
| `art-preflight/chunk-02/ledger.md` | `4509e34e78eb35596d2aa5b66babbe4ca55dcd02945afe89efc4978c1d6f4ae7` |
| `reviews/daybreak-art-preflight-qa-chunk-02.md` | `123631accbf740e42f6a47e769f54e42ebc8e1c73e20a287bdd0759830e40a22` |
| `local-art.csv` | `3563468b2fb1612e86546574bc933bc2b6bb83f33d0a7504f96957cd2baddbd8` |
| `local-codex.md` | `f8e7e347fbfbd0331fd7b6482ece3a033e069ae36f0a0b421a243e0c8018cef6` |
| `gemini-request.md` | `1cb179dc10b04677e64695a8d3b38bc64a3a91c65d53b8bf6fcf2cc1beb293b1` |
| `gemini-response.md` | `b62bf20b19e28e0a488da3d076834046d955bbe219b12d0f913923b91fc18f4e` |
| `gemini-execution-ledger.md` | `9c5d74cb35f795bc4d27a9dcd41fd397136e15d0b066d45b61698e3ac22c31be` |
| `gemini-payload-ledger.md` | `0bb993f570fa77195bd7a69d8788aed2062fc1ff0e3e6388bad41fd63131c4ec` |
| `gemini-root-identity.json` | `850239b5e7437df008e2068f099362e3cbf901485965a022ab946b0d0dc90421` |

The exact Gemini authorizing run used `gemini-3.7-flash-high` at high effort in read-only plan mode. Its canonical uncompressed payload identity is `31b101fc6ae938670bee2da4b68ac275ffad762d0afc28b1d80b378aea93147c`. Local and Gemini were blind to one another's conclusions and both are `reviewedByHuman=false`.

## Recorded post-completion wrapper-error audit

The Gemini outer model execution completed normally with `outerResult: SUCCESS`. It returned the full 37,122-byte response, a 60-image inspection table, all ten works, and all 40 terminal cells; stderr was empty. The response attests no fallback, timeout, rate limit, truncation, degradation, substitution, or abnormality.

The recorded zsh failure happened only after direct `agy` completion when the surrounding wrapper attempted to assign the shell-reserved read-only parameter `status`. It did not interrupt or alter the response. Independent adjudication recomputed all 60 payload-file hashes (`60/60` matched, `0` mismatched), reproduced the payload identity, matched the complete response hash above, and found all eight frozen inputs present (`8/8`). The wrapper error is therefore accepted as a post-completion shell-only error, not a Gemini model-execution failure. Had any response, pixel, root, or hash check failed, Gemini would have been excluded rather than repaired or averaged.

## Original-pixel and hash preservation

All 60 official body-page originals under `/tmp/konocomics-batch004-gemini-art02/images` were reopened at original detail. The original pixels were adjudicated directly; no cover, synopsis, animation, Genre, or text Factor supplied an Art value. Every exact ref below matched its payload-ledger SHA-256.

| Pos | Work | Exact page ref = SHA-256 |
| --: | --- | --- |
| 11 | Sunny | `reader-step-10=c370c02f33cebdf904bf62761749b30175fead274a9a83c0d1b55f6e840581ff`<br>`reader-step-14=d04af5c5ceff23971354af49e9ec648190691273e4a0d185d5703a1dcfe2666a`<br>`reader-step-16=d0f58c0e618d6f4a3e2cca44367a482d8a7b5f587b441e801dac6f31671ed27b`<br>`reader-step-18=bf91ee6641c075c38510ac86f025a64e416b9587e30a91437a1477cf062ad313`<br>`reader-step-20=ace75183ef34fbe69cfb66784f1a57cd5a5345532ad95080f3c54275032646de`<br>`reader-step-22=3f12578d39f1f87b81c25c67658bc3e687e6202c8d84191ea2a712b0b1072eb4` |
| 12 | すみれファンファーレ | `reader-step-09=5819716a1312da994da5423384cb056f6f26cc1693e8d2a1e4448e9e2c52c134`<br>`reader-step-13=1effd76864a71a010f49d753c7d988f03881a173f4611aedc0cd1cd56dca5301`<br>`reader-step-17=4b962394aab03fa0f0f4c3d592d5b77b5c17c91955a5a20969ea215aaba3a501`<br>`reader-step-21=b012f33b9e168e6878d6cfdc4bc25b2b47ccc1c645b4c14faeb73e4bd1572647`<br>`reader-step-25=61259a5534a23001ab14dff32c7a533f73546a47a3a07ac1cb777fad9deda369`<br>`reader-step-29=7e335fdc5bf089502ac1a23be6991ccb5b3e1ce7e71f58961888b3b5637620aa` |
| 13 | ヒーローカンパニー | `reader-value-11=ee8901ed48893f56d770c3145d19d83e8a06cc92c6b0cea337e7b628e4ff9064`<br>`reader-value-15=9e698b89203796e097087557f71e51c3b0cbe07519668aa8fe8be9d1165e8e60`<br>`reader-value-19=a3f843ed45b9acb76216ac8383a9ae043bcad16c732f2bc9e8c7b3497471bb43`<br>`reader-value-23=ad6c40dc44729d4de406ff8e4e8be195f285ccff9c21ece276ce047f1924c2d8`<br>`reader-value-27=cc1ec4481007dc2c44c9aad20302a9635476de34e0f83f9ce487e3f107b306aa`<br>`reader-value-31=0e4b4c5a42edb17ad316651672ea01d2ba6f80d46d3b19b92a512c67da47dd0b` |
| 14 | ねずみの初恋 | `reader-page-P0008@IB_TxaSt.jpg=331f7ec1ac16a44b6b132d5f2e8da3d000bfc11c56fe5a20c5603e1e2e5d7efa`<br>`reader-step-11=6ed85cf500ea29cce6c57955dab8b404db4fa17499452238d9ef6b64d2f008c2`<br>`reader-step-15=133d547bee4ea6e7ee2f92a650676a4de78cf419d8c3e63f6bd4fec5c7bcf7f8`<br>`reader-step-19=63c13628537981b5f708c464c1357ce0913bfc79ec1a544363cb1c17e68ae839`<br>`reader-step-23=9604530c70810c70350106b1ff82fd4108e12e1c4627c47a681d1416f7ded367`<br>`reader-step-27=7eddd36bc95a86feb0d601126a26fbcf2d4954e00f231aabbe8460020b3ea7e2` |
| 15 | キルアオ | `reader-page-P0007@CDgySzgz.jpg=f1aa1af6cdc7aa3a7c7b11c4cda2fb42ce0e6d80b42d7f6e4867756aa2d843ab`<br>`reader-step-11=5748be20229e753dc20ec6f649aa88673d740f2926a32b2d0d49be331e75d9ed`<br>`reader-step-15=7d99d44a3f093fbb9af1ae5ae7fd048812a1512caad038787b6c9e67fabe721b`<br>`reader-step-19=5583e0bc2e9fa23352349bff8758fd17f867f9649e8b11bf539c5e5500779095`<br>`reader-step-23=6acc3befdc9925f17e10a54c69be6391e542b0f426048a00a8ef244059c8b229`<br>`reader-step-27=ef69fdbc713d3ae211246c3f44e855045d3671e12f7bfec2254cfe2896d23c6b` |
| 16 | 尾守つみきと奇日常。 | `reader-step-09=5c5d613717e5b4a0f905e444851d05347543ec968bfef8376af6228ed0c95b3c`<br>`reader-step-13=d8c04cac4e20e6c5ed0c13f9906f947487591f275e49f7ec2a83e9f1003ffbb4`<br>`reader-step-17=d08be82bd9bcb172d9fd5577da5cf1fe9d60ec6d3a8d0b926304addcecbe1dec`<br>`reader-step-21=a605b9ed88e93cc5749e2466d51a9a4d3e66458f2a3fb5a2f18980b34c25c107`<br>`reader-step-25=07c59686e7c99ae7b24e5604288c338ed06a8c2b6a4cad85e0b594549fc19b01`<br>`reader-step-29=24c2cf85c71c23d7e231697fea4306887fbe4771076b3c94a1f86650c69d122c` |
| 17 | アリスと蔵六 | `page-05=4b62149a58f880ac3e4b7779d1d83abbf5df3aceca369cf9b4243df3dfdf4dc6`<br>`page-15=0aeb5e515060773b6cb8c47a7e381a3998f3cbcec91650af50ca6dc6560d2242`<br>`page-25=143ff6d4faf5c589d6ec2a5a415001264e878e0eddd87be0843b09fd2dad9419`<br>`page-35=b373332b09b603f674e485b88e6fb390d83740a3bd38d5440bb3748d25640224`<br>`page-45=b19874cc9b85e80634787ede33f69749d95943ceb33808470c58014066b45699`<br>`page-55=821a28f557798c6b696a2aabc54480f61c8e9587f97ffd0522de8bc812104273` |
| 18 | とろける鉄工所 | `reader-step-07=1761f90ceacb5597bfa2d1d82b4ccce0013d453c041e36543fdff78f31e75a1f`<br>`reader-step-11=d3a7a4976e4179963868d6f9d6d63dbafd59cd0d1f6ce280cf501d5992897571`<br>`reader-step-15=33b557eb7a8fcfe2cb862614015f2aceccc2fb0a2b24fe679b5eaaa2f4895690`<br>`reader-step-19=97a972ba4f4dc84d0970f05ac985d19b4176f818704d8fd4574719275758d8ce`<br>`reader-step-23=ff4ae425e9b815a9421b768d881519132f62968918bc11614c9ce9ddf880e2db`<br>`reader-step-27=30181d99ef9b951f4e72c3467ef92b4283af7b8829040577c3fc9f937de7770a` |
| 19 | 新しい上司はど天然 | `viewer-page-01@seek-7=f17e1655f4422bd5396060da7b98d89087823b1f896abc2d9d7f5f12ba12c886`<br>`viewer-page-02@seek-9-left=68a0aa782e810df75f598ef7fa2618d98848c8bb9e349cfeeaf12094e7ee18b1`<br>`viewer-page-03@seek-9-right=21961c251d92db7868023d805f4a092c48f20bd960744f12c29a788c12088409`<br>`viewer-page-04@seek-11-left=b6ec7756a0afe0265a50507b412bcd6a9b9fa5cf6dce44ca555dbac39022b549`<br>`viewer-page-05@seek-11-right=9060572506d579e898f3e3ace2e088954b34e876cf6eb42f17d3bcac418e69d3`<br>`viewer-page-06@seek-13=ea328819bace3d851c29f4edacfd94a5134cad08c28619fae86963306ffc5191` |
| 20 | 環と周 | `reader-step-10=b47aa6ecdefb270f34ea7b2861de752c9a56b5e6ed1669547d94b6a90455805b`<br>`reader-step-12=4c7d758b2e6eff1a8d742e155248977cd82cf926dc670352ee5d57c4154cac51`<br>`reader-step-14=ec3b028f51a3bfb41cce08813bc4d512a5a6d1f054da0627f2b57bb1a92c02b9`<br>`reader-step-18=4c69801da6d6fd1d323042cbf1851dc9e8510dd8d763b741885c8fc4c25744f8`<br>`reader-step-22=7cde69d0ed08196988480fa63ff25c9e775b256fe00642754075619725659fc8`<br>`reader-step-26=56c8a54e7e8ace4c9ffef56372346eed9b4992c58c26a06a78fa672563766c39` |

## Cell-by-cell conflict adjudication

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`. `U` is unknown and not numeric zero.

| Pos | Work | Local | Exact Gemini | Final | Dictionary- and pixel-anchored ruling |
| --: | --- | --- | --- | --- | --- |
| 11 | Sunny | `2/3/2/U` | `2/3/3/U` | `2/3/2/U` | Realism 2 and density 3 are agreed. Softness resolves to 2 because rounded children and watercolor coexist with scratchy expressive ink, hard vehicle edges, and the later monochrome school pages; the soft treatment is not sustained above neutral across contexts. |
| 12 | すみれファンファーレ | `3/3/4/U` | `1/1/3/U` | `1/1/3/U` | Large eyes, tiny features, simplified limbs, expansive white fields, and economical tone persist across train, home, and outdoor contexts, supporting realism 1 and density 1. Rounded clean contours support softness 3, but rigid architecture prevents 4. Local over-weighted grounded settings and isolated detail. |
| 13 | ヒーローカンパニー | `2/3/1/U` | `2/3/1/U` | `2/3/1/U` | The static cells are unanimous: conventional heroic stylization, recurring urban/equipment information, and hard angular action treatment. The sampled action starts in progress and supplies no exact resolved endpoint, so agreement does not open motion. |
| 14 | ねずみの初恋 | `3/3/2/U` | `3/3/3/U` | `3/3/2/U` | Realism 3 and density 3 are agreed. Softness resolves to 2 because the polished rounded heroine and arcade imagery alternate with coarse shadows, tattoo detail, hard black fields, and threatening close-ups. Gemini 3 does not survive the crime and confrontation context. |
| 15 | キルアオ | `2/3/1/U` | `2/2/2/U` | `2/3/1/U` | Realism 2 is agreed. Density resolves to 3 because warehouses, vehicles, laboratory equipment, and action marks recur across contexts. Softness resolves to 1 because crisp angular faces, hard perspective, speed marks, and impact contrast are sustained beyond one fight while rounded school expressions keep it above 0. |
| 16 | 尾守つみきと奇日常。 | `1/2/4/U` | `2/2/3/U` | `2/2/3/U` | Coherent ordinary anatomy and school perspective keep intermittent animal traits and reactions within general stylization, so realism is 2. Density 2 is agreed. Fluffy features and smooth contours support softness 3, but classroom geometry and hard black accents prevent endpoint 4. |
| 17 | アリスと蔵六 | `1/3/2/U` | `2/2/2/U` | `2/2/2/U` | The doll-like heroine is balanced by proportionate adults, an observed older face, cars, and city construction, supporting realism 2. Detailed city pages alternate with sparse close-ups and broad white fields, supporting density 2. Rounded and craggy/angular construction balance at softness 2. |
| 18 | とろける鉄工所 | `0/1/1/U` | `0/0/3/U` | `0/1/1/U` | Strong simplified anatomy is unanimous at realism 0. Density is 1 because many panels, captions, technical objects, and equipment provide recurring information despite sparse linework. Softness is 1 because blunt silhouettes, injury close-ups, welding motifs, and irregular contours are rougher than neutral; rounded simplification is not polished softness. |
| 19 | 新しい上司はど天然 | `3/1/3/U` | `2/1/3/U` | `2/1/3/U` | Proportionate adults remain idealized through slender faces, simplified anatomy, and polished manga expressions, so realism is 2 rather than 3. Density 1 and softness 3 are agreed and persist across the workplace and outdoor-neighborhood contexts. |
| 20 | 環と周 | `3/2/3/U` | `2/1/3/U` | `3/1/3/U` | Observed adult anatomy, posture, clothing, and rooms persist through family, workplace, and argument contexts, supporting realism 3 despite simplified faces. Broad white fields and large dialogue panels dominate, supporting density 1; occasional shelves, streets, and groups keep it above 0. Softness 3 is agreed. |

## Motion boundary

All ten accepted preflight rows have `motionGateAttemptable=false`, which the Daybreak QA independently upheld. None of the 60 originals fixes one continuous sequence with exact start, development or impact, and resolved endpoint refs. All ten `motionImpact` cells therefore remain `unknown` with blank value and confidence. Action presence was not treated as a numeric score, and absence of an eligible sequence was not converted to `notApplicable`.

## Final output accounting

- `final-art.csv` schema matches `local-art.csv` exactly.
- works: `10`
- axes per work: `4`
- data rows: `40` plus one header
- known static cells: `30`
- unknown cells: `10` (all motion)
- Local/Gemini static agreements: `14`
- Local/Gemini static conflicts adjudicated from pixels: `16`
- reviewedByHuman: `false`
- promotion, source, preflight, or catalog mutation: none
