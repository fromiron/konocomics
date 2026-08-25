# Batch 005 Art preflight — chunk 02

- scope: frozen positions 11–20 in manifest order
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- preflightCsvSha256: `6b629ffda6d0335fad773b630b5fb2769462e93b93ca653f936ba19f965fbcf7`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- batch manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- candidateSha256 echoed from manifest: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozen-work-set SHA-256 verified by `PAYLOAD.sha256`: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- image root: `/tmp/konocomics-batch005-art-chunk02`
- repository image mutation: none

The earlier preflight binding using manifest `b42ac6a84cc9116a1687372cbd2b79787e87881917d497418a95692c47b4b6d3` and candidate `12ad0c6351c60707abc63903dbac3bc405cc253caa786d799b20776b294e533b` was discarded after the canonical title/root re-freeze. Any pre-freeze `abda` binding was also discarded. The packet identity above is authoritative; captures were acquired against the unchanged frozen-work-set SHA and remain bound to these ten work IDs.

## Scope and gate contract

This is official-route access and sampling preflight only. No Art axis value
or confidence was inferred and no annotation or promotion decision was made.
The exact frozen representative ISBN had to bridge to the official product and
internal preview within volumes 1–3 or the first major episode. The route
registry in `data/staging/catalog-expansion/art-source-route-registry.csv` was
applied publisher by publisher; unregistered publisher routes were not
substituted with generic retailer or preview catalogs.

`sample-ready` requires six readable internal body pages and at least two
genuinely distinct scene contexts. Covers title splashes contents pages ads
and synopsis material were excluded. `motionGateAttemptable=true` would
require one exact continuous start-development-impact-resolved sequence; no
position met that stricter condition. A failed prerequisite closes as
`unknown-ready` without an Art value or promotion blocker.

Temporary captures remain only under the image root above. No image was copied
into the repository; the hashes in `preflight.csv` are the selected temporary
PNG captures after browser rendering of the official preview.

## Result summary

| Pos | Work | Route | Pages | Contexts | Static | Motion | State |
| --: | --- | --- | ---: | ---: | --- | --- | --- |
| 11 | ヨルムンガンド | 小学館 exact ISBN tameshiyo | 5 | 3 | no | no | unknown-ready |
| 12 | ボクラノキセキ | 一迅社 product only; route unregistered | 0 | 0 | no | no | unknown-ready |
| 13 | おまかせ精霊 | KADOKAWA exact product; no linked trial | 0 | 0 | no | no | unknown-ready |
| 14 | ニラメッコ | 白泉社 product only; route unregistered | 0 | 0 | no | no | unknown-ready |
| 15 | 恋愛ラボ | 芳文社 series product only; route unregistered | 0 | 0 | no | no | unknown-ready |
| 16 | 銀のスプーン | 講談社 product-linked trial | 5 | 2 | no | no | unknown-ready |
| 17 | おかめ日和 | 講談社 product-linked trial | 5 | 3 | no | no | unknown-ready |
| 18 | 新黒沢 最強伝説 | 小学館 exact ISBN tameshiyo | 5 | 3 | no | no | unknown-ready |
| 19 | カレチ | 講談社 product-linked trial | 5 | 2 | no | no | unknown-ready |
| 20 | GREEN WORLDZ | 講談社 product-linked trial | 5 | 3 | no | no | unknown-ready |

## Route and evidence notes

### 11 — ヨルムンガンド

- The official [小学館 volume 1 product](https://shogakukan-comic.jp/book?isbn=9784091570697) links the registered Shogakukan tameshiyo route. The canonical viewer is `https://sc-portal.tameshiyo.me/4091570690` and identifies `ヨルムンガンド 1` by 高橋慶太郎.
- Readable body captures `reader-step-06` through `reader-step-10` were retained after excluding the QA-identified table-of-contents and opening montage at `reader-step-05`.
- Contexts are interior character introduction, group conversation, and action or vehicle scenes. Five valid body pages remain, so the static gate closes `unknown-ready`. No exact continuous start-development-impact-resolved sequence was isolated.

### 12 — ボクラノキセキ

- The official [一迅社 volume 1 page](https://data.ichijinsha.co.jp/detail/75805394) is retained for identity and edition mapping to ISBN `9784758053945`.
- 一迅社 is absent from the trusted publisher route registry. No generic retailer or unregistered reader route was used; this closes Art `unknown-ready` with zero sampled pages.

### 13 — おまかせ精霊

- The official [KADOKAWA product](https://www.kadokawa.co.jp/product/201216022042/) matches `おまかせ精霊１`, 青本もあ, and ISBN `9784840116626`.
- The product payload reports `pre_trial_reading_flg=0` and an empty `bw_url`; no product-linked BOOK☆WALKER or publisher reader exists for the registered KADOKAWA route. No pages were sampled.

### 14 — ニラメッコ

- The official [白泉社 volume 1 page](https://www.hakusensha.co.jp/comicslist/60421/) matches ISBN `9784592166610` and 久世岳.
- 白泉社 is absent from the trusted publisher route registry. The linked or generic reader alternatives were not treated as authorized edition bridges; zero pages were sampled.

### 15 — 恋愛ラボ

- The official [芳文社／まんがタイム series page](https://manga-time.com/comics/cart/mru.html) lists the entry volumes and title.
- 芳文社 is absent from the trusted publisher route registry and the series page does not expose a frozen ISBN-bound internal preview. Zero pages were sampled.

### 16 — 銀のスプーン

- The official [講談社 volume 1 product](https://www.kodansha.co.jp/comic/products/0000044784) links the canonical trial reader and matches ISBN `9784063760231`.
- Five body pages were retained at `reader-step-06`, `reader-step-07`, `reader-step-08`, `reader-step-09`, and `reader-step-10` after excluding the `Recipe 1` chapter-title splash at `reader-step-03`. The remaining contexts are kitchen or domestic food and hospital or home conversation. The static gate closes `unknown-ready` below six pages.

### 17 — おかめ日和

- The official [講談社 volume 1 product](https://www.kodansha.co.jp/comic/products/0000043658) links the canonical trial reader and matches ISBN `9784063722802`.
- Five body pages were retained at `reader-step-04`, `reader-step-06`, `reader-step-07`, `reader-step-08`, and `reader-step-09` after excluding the `「はじめましてっ」` chapter-title and establishing splash at `reader-step-05`. The contexts remain street or neighborhood views, domestic interiors, and family interactions. The static gate closes `unknown-ready` below six pages.

### 18 — 新黒沢 最強伝説

- The official [Big Comic Bros volume 1 product](https://bigcomicbros.net/comics/30136/) matches ISBN `9784091856883` and links `https://shogakukan.tameshiyo.me/9784091856883`.
- Five body pages were retained at `reader-step-06` through `reader-step-10` after excluding the table-of-contents and title or opening montage at `reader-step-05`. The contexts are nighttime urban return, crowd or social scenes, and interior group scenes. The static gate closes `unknown-ready` below six pages.

### 19 — カレチ

- The official [講談社 volume 1 product](https://www.kodansha.co.jp/comic/products/0000013990) links the canonical trial reader and matches ISBN `9784063728644`.
- Five body pages were retained at `reader-step-05` through `reader-step-09` after excluding the `第1話「業務連絡書」` chapter-title splash at `reader-step-04`. The remaining contexts are train or platform and passenger-service or station conversations. The static gate closes `unknown-ready` below six pages.

### 20 — GREEN WORLDZ

- The official [講談社 volume 1 product](https://www.kodansha.co.jp/comic/products/0000019152) links the canonical trial reader and matches ISBN `9784063950717`.
- Five body pages were retained at `reader-step-04`, `reader-step-06`, `reader-step-07`, `reader-step-08`, and `reader-step-09` after excluding the `第1話 約束` chapter-title opening splash at `reader-step-05`. The contexts remain city or underground transit, station or shop interiors, and crowd or dialogue scenes. The static gate closes `unknown-ready` below six pages.

## Selected capture hashes

The selected temporary capture hashes are also encoded in the CSV as
`page-ref=SHA-256` pairs. The temporary files were not committed:

- 11 ヨルムンガンド: `reader-step-06=f1ad845f4ac39ff04f62a800596b408e7dda698f87c97d92015bf365979090ae`; `reader-step-07=c5611ac90c6b6cb3a1bba6fc1a45d7d73e2813adea5f74b132f49a2bcc7c10b6`; `reader-step-08=ece313e834ae989c9f6a16c01c6d9d1dcf333dae9cf385080c743ae69c707b20`; `reader-step-09=53d5efa22d9b752af5b38e67d6f57383371fa0a3709defd182c6310ab07a399f`; `reader-step-10=be8faf5e17fbfa9072cc50462dbc5057175f194210196d0e88c987627597d35f`
- 16 銀のスプーン: `reader-step-06=1c031f1f9023ef0adb8c3dfc917c06a978cabf3af3e4dc76fd0ff048f1c3340b`; `reader-step-07=d683caea7404ccf9a16fdac76def9b2b95f0a4f98d6392e9acfa54761b1a9ffb`; `reader-step-08=f4a568226bcbda68a9785c51878c76c527b3346567f65a034425929c068f1682`; `reader-step-09=66972e6e8b80d6b59aaa48646d87ecd4df21c6dafcfc37df050e0ac8c00128dd`; `reader-step-10=fd10746185ca98c9f352dd3deaaa603da0bb9f84456410a412f384803b9ee286`
- 17 おかめ日和: `reader-step-04=6b850b64b0e8408da85b15ef23111cb37fe1084cc85e13eae0c79591ee8d2a87`; `reader-step-06=8119da4ce8caf7ea8f17ca238dfb795636c88f2c719054740e96c0cc5023e25b`; `reader-step-07=89b602fae2c72abeeaa751449986aa916ab6662185de988308c363fefb90b33a`; `reader-step-08=4ea129ff2015754a499e842f47771140578c4e592b1fcc75edfec550bfb0772f`; `reader-step-09=539a48770406cd6950212f979ff4afc3f6e952108067329d9b6dfb23bdfa09b6`
- 18 新黒沢 最強伝説: `reader-step-06=6e5d378d1e4ae079b0b008ad7126d2703f5d501ee4a2acfd6e95b48619c135a7`; `reader-step-07=24ca702fef7f7edb47d34c13ecd5e83a17e54bb5311e30603327dc26a9f1e611`; `reader-step-08=e86fa7b8632cfa52f57b4d8614b94368958d4a833c5115c2d276a46e7c34a7ec`; `reader-step-09=fd85d9daef2a05e563697c9b03d468bbbd71b8d1d7fa5a035586a63d49dff7dd`; `reader-step-10=ae564e310762c17c17c302246d9011b4afd9f0ace2e72a187baf185e7360736b`
- 19 カレチ: `reader-step-05=fc793412efa24f9966e64e018c9fe6f586325fc2f6517c511c57530a8cbfe141`; `reader-step-06=bab3574180d4193ba281768beac93222008a55d76c3ac745963dc07e2b165db7`; `reader-step-07=ef8782f9c54cc989a0366cdba53fe568a25345ec49390697b50b95f32645f525`; `reader-step-08=fd74f2d5192dd67f92c6356f01abe92cfd6d67223f15f8785cc3b2ddd2682057`; `reader-step-09=64a0923f4c76bf4e4241b359ed11ed9a259c9759dc5ef4bb36473d0327778a06`
- 20 GREEN WORLDZ: `reader-step-04=bbb0260c8048da8eb907ff4e255e81ed5aa7a638975dd7040b46c7a555b4b108`; `reader-step-06=25e1a06e3ae1a5b223b82dd6cbcacdb636d49f8e1c540ddf4ecd1cd5b6a97605`; `reader-step-07=5c582c191d57f15bc4b2c67d87afe130958974b3d3838a110111d046ae17c5d0`; `reader-step-08=e259e8723325937ebb4f2add90db7030bb4f1c2539f5b5e9169ea670a5648259`; `reader-step-09=bec75358f775a0196b640bf2270c7438c373a458b24fa964b710ea8b639cc5b2`

## Excluded capture hashes

The following six rendered captures remain in `/tmp/konocomics-batch005-art-chunk02` for audit traceability but are excluded from the CSV sample evidence because Daybreak QA identified them as non-body material:

- 11 ヨルムンガンド: `reader-step-05=d02d0a0855b9d78cd3738c8be906f646754a5e6c1110e414221923241d24b42a` — table-of-contents and opening montage.
- 16 銀のスプーン: `reader-step-03=363ec3c92da9c6352500a6ee6388ddd43a784b3c26ce1b1885d906fd696ea488` — `Recipe 1` chapter-title splash.
- 17 おかめ日和: `reader-step-05=ce260283f9fdc7db212ac5284191e9345f7fb90509661c9d3c52ae54f8fb47ec` — chapter-title and establishing splash.
- 18 新黒沢 最強伝説: `reader-step-05=f75d26b6ba56f77a50e6b09a8051de79ac4fc76be622911285d29e2f57aae7a6` — table-of-contents and title or opening montage.
- 19 カレチ: `reader-step-04=47ade91292f4fddef48e13639a91b3174ca5715250c63a082ff9fbd85b2ae2d7` — chapter-title splash.
- 20 GREEN WORLDZ: `reader-step-05=04fbdc29f89c603fac8ebdb0c9034ab4cc2540ce9fc2e871015671e4f30936db` — chapter-title opening splash.

## Verification boundary

- `preflight.csv` has the prescribed 17 columns and exactly ten scoped data rows in frozen order.
- The selected image references have five hashes for each of six accessible works, for 30 valid body-page hashes; the six excluded hashes above remain traceable and were not counted. Every selected hash was recomputed from a temporary file under `/tmp/konocomics-batch005-art-chunk02`; no repository image exists in this chunk.
- All ten positions are terminal `unknown-ready`: positions 11 and 16–20 have five valid body pages after exclusion and therefore fail the six-page static gate; positions 12–15 remain route-limited at zero pages.
- All ten `motionGateAttemptable` values are `false`. No Art value was assigned and `reviewedByHuman=false` remains explicit.
