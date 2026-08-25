# Batch 005 Art preflight — chunk 04

- scope: frozen positions 31–40 in manifest order
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- preflightCsvSha256: `a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- batch manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- candidateSha256 echoed from manifest: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozen-work-set SHA-256 verified by `PAYLOAD.sha256`: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- research chunk SHA-256 verified by manifest: `46e6b37d07f4b2baee839dca05331e9c870a6d158c392e3d77ad77419a5b76a3`
- image root: `/tmp/konocomics-batch005-art-chunk04`
- repository image mutation: none

The preflight is bound to the current Batch005 candidate and frozen work set
only. It assigns no Art axis value, confidence, promotion status, or
annotation decision.

## Scope and gate contract

This is official-route access and sampling preflight only. Each sample was
checked against the publisher route registry in
`data/staging/catalog-expansion/art-source-route-registry.csv`. The frozen
representative ISBN had to bridge to an official product-linked internal
preview within volumes 1–3 or the first major episode. Generic retailer,
unregistered reader, and unrelated product routes were not substituted.

`sample-ready` requires at least six readable internal narrative/body pages
and at least two genuinely distinct scene contexts. Covers, title splashes,
contents, opening montages, synopsis material, and advertisements were
excluded. `motionGateAttemptable=true` requires one exact continuous
start-development-impact-resolved sequence. Position 35 has the exact official
page-010 punch sequence needed for a motion-only attempt, so it sets
`motionGateAttemptable=true`; its static prerequisite still fails and the row
closes `unknown-ready`. A failed prerequisite closes `unknown-ready` without a
blocker.

Temporary browser-rendered captures remain only under the `/tmp` image root;
none were copied into the repository. The CSV preserves the official route,
edition bridge, page references, counts, contexts, and SHA-256 values.

## Result summary

| Pos | Work | Route/evidence | Pages | Contexts | Static | Motion | State |
| --: | --- | --- | ---: | ---: | --- | --- | --- |
| 31 | デストロ２４６ | 小学館 exact ISBN tameshiyo | 6 | 2 | yes | no | sample-ready |
| 32 | 夢の雫、黄金の鳥籠 | 小学館 exact ISBN tameshiyo | 6 | 2 | yes | no | sample-ready |
| 33 | 日常 | KADOKAWA exact ISBN bridge to BOOK☆WALKER | 5 | 1 | no | no | unknown-ready |
| 34 | ひらやすみ | 小学館 exact ISBN tameshiyo | 6 | 3 | yes | no | sample-ready |
| 35 | ハイスコアガール | Square Enix series ISBN bridge to 第1話 trial | 6 | 1 | no | yes | unknown-ready |
| 36 | WOMBS | 小学館 exact product/JDCN e-comi viewer | 6 | 3 | yes | no | sample-ready |
| 37 | ママはテンパリスト | 集英社 exact ISBN reader | 6 | 3 | yes | no | sample-ready |
| 38 | 僕らはみんな河合荘 | 少年画報社 exact volume-1 product only | 0 | 0 | no | no | unknown-ready |
| 39 | かよちゃんの荷物 | official award comment only; publisher route unregistered | 0 | 0 | no | no | unknown-ready |
| 40 | 脳内ポイズンベリー | 集英社 JDCN-to-paper-ISBN reader | 6 | 2 | yes | no | sample-ready |

## Route and evidence notes

### 31 — デストロ２４６

The Shogakukan product for ISBN `9784091573254` links the registered
`sc-portal.tameshiyo.me/9784091573254` reader and identifies volume 1 by
高橋慶太郎. Browser-rendered `reader-trg-05` through `08`, then `10` and
`11`, are readable body pages. The excluded `trg-09` is the 第1話 title
splash. The retained contexts are violent/action interiors and office or
group conversation; no exact bounded motion sequence was isolated.

### 32 — 夢の雫、黄金の鳥籠

The Shogakukan product for ISBN `9784091340108` links the exact tameshiyo
reader and identifies volume 1 by 篠原千絵. The retained body pages are
`reader-trg-04` through `08` plus the replacement `reader-trg-09`;
the title splash at `reader-trg-03` was removed. Six readable narrative
pages remain across village or landscape and bedroom or attack contexts; no
exact bounded motion sequence was isolated.

### 33 — 日常

The KADOKAWA product `200879000105` lists frozen ISBN `9784047139497` as
日常 1 by あらゐけいいち and exposes the product-linked BOOK☆WALKER trial.
The browser viewer is `viewer-trial.bookwalker.jp/...cid=7565af46-8b86-4ab8-849d-fd96e6514879`.
The TOC page `reader-page-06` was removed; pages `07`–`11` remain as
five readable internal narrative pages from one hospital-front or
residential-street shake context. Static Art closes `unknown-ready` at one
genuine context; no exact bounded motion sequence was isolated.

### 34 — ひらやすみ

The Shogakukan product for ISBN `9784098611188` links the exact tameshiyo
reader and identifies volume 1 by 真造圭伍. The chapter title splash at
`reader-trg-07` was removed and replaced by body page `reader-trg-11`;
`reader-trg-05`, `06`, `08`–`11` remain. Six readable narrative pages
span home, street, and shop or neighborhood contexts; no exact bounded motion
sequence was isolated.

### 35 — ハイスコアガール

The official Square Enix series page lists the exact frozen ISBN
`9784757535121` as ハイスコアガール 1 and links the first-episode trial at
`https://magazine.jp.square-enix.com/biggangan/tachiyomi/his01/`. The trial
contains ten official pages; `reader-page-002` through `007` remain as six
genuine narrative pages from one classroom, arcade, or social-interaction
context. Static Art closes `unknown-ready`. The exact official
`reader-page-010` contains a bounded continuous
start-development-impact-resolved punch sequence and is retained as
motion-only evidence, so `motionGateAttemptable=true`; it does not promote the
row past the static gate.

### 36 — WOMBS

The exact Shogakukan product for ISBN `9784091884947` identifies ＷＯＭＢＳ 1
by 白井弓子 and JDCN `091884940000d0000000`. Its approved product-linked
e-comi viewer is
`https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091884940000d0000000`.
Browser-rendered body pages `08` and `10`–`14` were sampled; cover,
blank, title, contents, introductory material at pages `01`–`07`, and
chapter opener `09` were excluded. Six pages span planetary landscape,
military control-room or group-interior, and transfer-tunnel or crowd-action
contexts. No exact bounded continuous start-development-impact-resolved
sequence was isolated.

### 37 — ママはテンパリスト

The Shueisha product for ISBN `9784087821888` links the official reader
`cid=9784087821888` and identifies volume 1 by 東村アキコ. Readable body
captures are `reader-page-07` through `11` and `13`; cover, title, contents,
synopsis, and chapter-title splashes were excluded. The contexts are domestic,
family, and child-care scenes. No exact bounded motion sequence was isolated.

### 38 — 僕らはみんな河合荘

The exact 少年画報社 volume-1 product (`book_Info.php?id=6776`) matches frozen
ISBN `9784785936310` and identifies 宮原るり, but has no authorized internal
preview. The available official volume-3 page is not the frozen edition and
does not establish a product-linked sample for volume 1; Art closes
`unknown-ready` without blocker.

### 39 — かよちゃんの荷物

The research packet contains the official マンガ大賞2010 jury-comment PDF,
which identifies the work but is not a publisher product or internal preview.
竹書房 is absent from the current approved route registry; no edition-bound
internal preview was sampled, so Art closes `unknown-ready` within that
finite registry.

### 40 — 脳内ポイズンベリー

The Shueisha digital product JDCN `08865626865626315501` explicitly maps to
frozen paper ISBN `9784088656267`, identifies volume 1 by 水城せとな, and
links the official reader. `reader-page-05` was removed; pages `06`–`11`
remain as six readable body pages across real-world station and brain-meeting
contexts. No exact bounded motion sequence was isolated.

## Selected capture hashes

The selected temporary capture hashes are also encoded in both CSV hash
columns. These files remain outside the repository:

- 31 デストロ２４６: `reader-trg-05=4cfa073d5a14a0b96489b1f43071376783f1646d10185556c7a7bc4a403cbfc0`; `reader-trg-06=a5339bfcd3eb435bbd8072cf54ffacc31840d2f9303ee6d1d973ac23b1961811`; `reader-trg-07=d4107485f859cb16f35ddf486e5222f52f06acba99f312c2479bdf4baab12ed5`; `reader-trg-08=a226eb9b3dd83a03770ce3751bd3ddc148988fd8916ec815660061deef98dd68`; `reader-trg-10=f8c11221c16397f9812eaacf0bf4039aa681043294304788418445de2e2441e6`; `reader-trg-11=51581f20c6478bfb795ca514daaf16d823bad149fda898e689891b846e7bb19a`
- 32 夢の雫、黄金の鳥籠: `reader-trg-04=c246803a959515d97348989cead460507186abc32f4b4202de436135e1bbcc1d`; `reader-trg-05=09d4f540e8cc01a9cae2fe6bb1c54797f068a37bcb591794440cb3511c5a702e`; `reader-trg-06=f33d2863769972f9f3237ad4aa19b0323482d995e3d2a7e566094f5d23fbcb5f`; `reader-trg-07=836c1e5827e68e5a92fdb47bed067da88b241ef9300ed6dbd371619d9d70f63d`; `reader-trg-08=8586d82b9ecf0464285fdfe8b0dae76a965c08d21ed6127448f15f127c16757c`; `reader-trg-09=5ca088f603d370bf82f6823e18c61f8f3a00934910f2bc0055f247097f516fcd`
- 33 日常: `reader-page-07=0c840fd20a3bd407ef00af724ff6d09e121ccbfc828b527bf452d3d2e3893d31`; `reader-page-08=6ec37e9ec5b626a096abd47a656005b7d5741952507b58a2f3076b17f35773b8`; `reader-page-09=61ca96591a454dd9c439156f9cd3001306bb4ee313af66f3f6e48fe2783ded6c`; `reader-page-10=2711b2941dbb05b22aed0bdb20c40ae005229753482a4da8b862ff0d87585ef0`; `reader-page-11=7e4071d57efd91911d6d1d12e4ec559ed677934b1e9713cc676a3000f29f3b4b`
- 34 ひらやすみ: `reader-trg-05=a4d7556a4adb697a34a1857e8ee8d3891a4982135b10b6077b29768c45376c9d`; `reader-trg-06=e333484e9fab86680de854abb8de8af10c0e5f645c9a4db021df817ba6cf8f7c`; `reader-trg-08=60b37748ca44b202adb920f28d8d5cd90080d3f2de577c017a727eb4547584c9`; `reader-trg-09=011752167b59378d15fc1c0a458f81140deb4d81e5b7a320ed9e3a699a84e5f4`; `reader-trg-10=bdf19265c9ca509d15f0f907ba10fac7826566c0524d8ed31b7773020f38ee0d`; `reader-trg-11=ee948b0b925da7dabea896680091ab84ab5bd0502ccdbded2c073b739ac9cd86`
- 35 ハイスコアガール: `reader-page-002=cc11ca6b9c12bdb6fc2b674cf310756716afed56cf0d3fe7767683d4f40c3c5c`; `reader-page-003=108f619f0d849bb26d94dd0ca412328badbb85e4caf87f3924124552c26414bf`; `reader-page-004=b8feacad880eb89a079a12f1c02055de6d09ec40f031125cccac996ab8efff96`; `reader-page-005=1d924a4c6ce8f117977b29245019c8606819e422c3ceb25ca5b0faab07843b20`; `reader-page-006=b3d493076e1636ecaf5b721a2112ab12243f49f62314e67bb3c7046208c1313d`; `reader-page-007=5301e546d03d923e5c58554863f21dc7629684a4fe1071a49a67ffbddf4baefc`; `reader-page-010=a4dafabef698ded2500aaea28819fc2827010e6e4d5459c4fec0de48e0f7dc4a`
- 36 WOMBS: `reader-page-08=5af2640fcd58ce66fe1594e8a4532a14560b1f92d44051ec00761fff12a3bb62`; `reader-page-10=a9d5e1612cc4fc95145e069ec8d3b0cf767768ad794497c990bda3f025f7bac0`; `reader-page-11=4f3aeb0c29b8c852fcf05913d278f60ee4e09325f6049d6c813233587a8b251e`; `reader-page-12=d084be32a6bc4e6c1dcb59369354752c27c11ddafb2119f781e984d04d854784`; `reader-page-13=d1bea950de3618399c6a23b592ce219e54c357adcf551a85b43da7834d572242`; `reader-page-14=2f75da848fb50015e2583bfe01eee2754faf255feeda62091254bcf1505da8e0`
- 37 ママはテンパリスト: `reader-page-07=1c5d966057a694029f320327e37dbdd5545632c07a0bbb542c5236cd5b2019d8`; `reader-page-08=61b6398e0e52433552fa7c1211859ad72a11396ba97f79b3684b609cf1f547f5`; `reader-page-09=aecc034a95ef85f7f9ba3907c23af005923e04de6a2eadb16b1e5ec5fc3013f5`; `reader-page-10=24fdfc074edb6e9b868d3f1bd3745aaf439844377df89156efba68a635ec1b04`; `reader-page-11=8952e5c7e28b3d11abf4dcb8ee6430f157dd105db4df3f0515e7f51239bba82e`; `reader-page-13=81f229adf31906a27e490c637b19fea840d4b274b0a64c92df8f68beabd9dc0f`
- 40 脳内ポイズンベリー: `reader-page-06=099bd268df0bb3e7d36552a93be31846946824d4b2cd0c36c8afa5cc22e854f1`; `reader-page-07=b4c2259bae0cb3b982092ca29909b2e3a7d9ce3cc1317020acf670f2727b2d19`; `reader-page-08=5ffa8cf721a6e79b43df40dfc94f30872f60be6fc99abeb00ab10c9162df9210`; `reader-page-09=6c1f0ab24231725d7507f4f4a4bdb5dddc657cc9566a08f1b984bcd1b5409b42`; `reader-page-10=9126070187030d572b8fe1e1c0e10f752b3d759ba18c48c8130e8b710b1dedeb`; `reader-page-11=52b97c9e551621d2dee1ef034f30a1976e9f0ad6b9f7658f42b57d6c7c1c98f1`

## Verification boundary

- `preflight.csv` contains exactly the accepted 17-column contract and ten frozen work rows.
- Static sample-ready rows have six readable body pages, at least two contexts, `staticGateAttemptable=true`, and `motionGateAttemptable=false`.
- Positions 33 and 35 are explicit static-unknown rows: position 33 has five pages and one context; position 35 has six pages and one context plus the exact page-010 motion-only sample.
- Positions 38 and 39 are zero-sample unknown-ready rows with no image hashes and no Art values.
- Position 35 is the only motion-gate attemptable row; its motion evidence does not bypass the failed static gate.
- Temporary-image hashes were recomputed from `/tmp/konocomics-batch005-art-chunk04` and match both CSV hash columns.
- No Art values, promotion entries, commits, or unrelated files were changed.
