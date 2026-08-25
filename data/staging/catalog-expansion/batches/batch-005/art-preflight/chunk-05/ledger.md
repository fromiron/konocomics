# Batch 005 Art preflight — chunk 05

- scope: frozen positions 41–50 in manifest order
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- preflightCsvSha256: `57ef95da4593b94895e053c686cb316bde2a83259b071b474456ab7fefb1c8f9`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- batch manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- candidateSha256 echoed from manifest: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozen-work-set SHA-256 verified by `PAYLOAD.sha256`: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- image root: `/tmp/konocomics-batch005-art-chunk05`
- repository image mutation: none
- review bundle: none; the independent QA record remains at `data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-art-preflight-qa-chunk-05.md`

## Scope and gate contract

This is official-route access and sampling preflight only. Each route below is a publisher or rights-holder product or a product-linked official reader, and each exact frozen representative edition was bridged against the official volume 1–3 route set. Generic retailer previews, unregistered readers, and unrelated promotions were not substituted. The selected sample files remain temporary under `/tmp` only.

`sample-ready` requires six readable internal body pages and at least two genuinely distinct scene contexts. Covers, blank opening pages, opening montages, contents, chapter or title splashes, advertisements, and synopsis material were excluded. `motionGateAttemptable=true` would require one exact continuous start-development-impact-resolved sequence; no position met that stricter condition. A failed prerequisite closes as `unknown-ready` without an Art value or promotion blocker.

## Result summary

| Pos | Work | Official volume/product routes | Pages | Contexts | Static | Motion | State |
| --: | --- | --- | ---: | ---: | --- | --- | --- |
| 41 | 機械仕掛けの愛 | 小学館 exact JDCN tameshiyo reader | 6 | 3 | yes | no | sample-ready |
| 42 | 臨死!!江古田ちゃん | 講談社 product-linked trial; reader render obfuscated | 0 | 0 | no | no | unknown-ready |
| 43 | 町でうわさの天狗の子 | 小学館eコミ exact JDCN reader; tile-scrambled assets | 0 | 0 | no | no | unknown-ready |
| 44 | 万福児 | 集英社 exact JDCN reader; tile-scrambled assets | 0 | 0 | no | no | unknown-ready |
| 45 | スピリットサークル | 少年画報社 exact products; no mapped preview | 0 | 0 | no | no | unknown-ready |
| 46 | トリリオンゲーム | 小学館 exact ISBN tameshiyo reader | 6 | 2 | yes | no | sample-ready |
| 47 | デッドデッドデーモンズデデデデデストラクション | 小学館 exact ISBN tameshiyo reader | 6 | 3 | yes | no | sample-ready |
| 48 | 月に吠えらんねえ | 講談社 product-linked trial; reader render obfuscated | 0 | 0 | no | no | unknown-ready |
| 49 | 1/11 じゅういちぶんのいち | 集英社 exact JDCN reader; tile-scrambled assets | 0 | 0 | no | no | unknown-ready |
| 50 | シュトヘル | 小学館 exact JDCN tameshiyo reader | 6 | 2 | yes | no | sample-ready |

## Exact edition and route ledger

- 41 — frozen ISBN `9784091846440`; volume routes `https://shogakukan-comic.jp/book?isbn=9784091846440`, `https://shogakukan-comic.jp/book?isbn=9784091853844`, `https://shogakukan-comic.jp/book?jdcn=091867970000d0000000`; sampled reader `https://sc-portal.tameshiyo.me/091846440000d0000000`. Selected `reader-trg-06` through `reader-trg-11` are readable body pages across amusement-park, robot-shop, and home contexts. Their per-page hashes and set hash are in `preflight.csv`.
- 42 — frozen ISBN `9784063144130`; volume routes `https://www.kodansha.co.jp/comic/products/0000029261`, `https://www.kodansha.co.jp/comic/labels/afternoon?page=65`, `https://www.kodansha.co.jp/comic/new-releases/p?page=1654`; product-linked reader `https://www.kodansha.co.jp/comic/products/0000029261/trial/reader?cid=71a636f4fa3ab9c6bf92e5390a08ee9caf34b9fb9a5889802a9f041b6ee0f0e8`. The reader route opened but produced obfuscated or unusable renderings; the six-page threshold was not met.
- 43 — frozen ISBN `9784091313935`; exact JDCN volume routes `https://e-comi.shogakukan.co.jp/books/091313930000d0000000`, `https://e-comi.shogakukan.co.jp/books/091316920000d0000000`, `https://e-comi.shogakukan.co.jp/books/091322580000d0000000?page=1`; sampled reader `https://e-comi.shogakukan.co.jp/viewer/speedreader?cid=091313930000d0000000&u0=1&u1=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091313930000d0000000&rurl=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091313930000d0000000`. Selected assets were tile-scrambled, so no readable BODY pages, refs, contexts, or sample hash are counted; decoded originals would be required to reopen.
- 44 — frozen ISBN `9784088653457`; exact JDCN volume routes `https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865345865345315501`, `https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865380865345315501`, `https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865410865345315501`; reader `https://www.shueisha.co.jp/books/reader/main.php?cid=08865345865345315501`. Reader metadata and 52 commercial `content.js` page refs resolved, but directly fetched `M_L.jpg` bytes were tile-scrambled and no decoded BODY sample was preserved; no pages were counted.
- 45 — frozen ISBN `9784785939830`; exact publisher routes `https://www.shonengahosha.co.jp/book_Info.php?id=7155`, `https://www.shonengahosha.co.jp/book_Info.php?id=7156`, `https://www.shonengahosha.co.jp/book_Info.php?id=7157`. Product identity and volume bridge resolved, but no product-linked readable internal preview was mapped; no pages were counted.
- 46 — frozen ISBN `9784098610105`; volume routes `https://shogakukan-comic.jp/book?isbn=9784098610105`, `https://shogakukan-comic.jp/book?isbn=9784098611133`, `https://shogakukan-comic.jp/book?isbn=9784098612284`; sampled reader `https://sc-portal.tameshiyo.me/9784098610105`. Selected `reader-trg-11` through `reader-trg-16` are readable body pages across a coastal luxury residence and an urban flashback or assault sequence; their per-page hashes and set hash are in `preflight.csv`.
- 47 — frozen ISBN `9784091865007`; volume routes `https://shogakukan-comic.jp/book?isbn=9784091865007`, `https://shogakukan-comic.jp/book?isbn=9784091868572`, `https://shogakukan-comic.jp/book?isbn=9784091872609`; sampled reader `https://sc-portal.tameshiyo.me/9784091865007`. Selected `reader-trg-07` through `reader-trg-12` are readable body pages across household, street or bicycle, and school contexts; their per-page hashes and set hash are in `preflight.csv`.
- 48 — frozen ISBN `9784063879704`; volume routes `https://www.kodansha.co.jp/comic/products/0000047330`, `https://www.kodansha.co.jp/comic/products/0000047363`, `https://www.kodansha.co.jp/comic/products/0000047407`; product-linked reader `https://www.kodansha.co.jp/comic/products/0000047330/trial/reader?cid=2735a1c3e85522c8f46420da4f530f7fd47237c5fa17bbef78e21d796a56616d`. The reader route opened but its page images were obfuscated or unusable; the six-page threshold was not met.
- 49 — frozen ISBN `9784088701615`; exact JDCN volume routes `https://www.shueisha.co.jp/books/items/contents.html?jdcn=08870161870161315501`, `https://www.shueisha.co.jp/books/items/contents.html?jdcn=08870244870161315501`, `https://www.shueisha.co.jp/books/items/contents.html?jdcn=08870426870161315501`; reader `https://www.shueisha.co.jp/books/reader/main.php?cid=08870161870161315501`. Reader metadata and 59 commercial `content.js` page refs resolved, but directly fetched `M_L.jpg` bytes were tile-scrambled and no decoded BODY sample was preserved; no pages were counted.
- 50 — frozen ISBN `9784091825292`; JDCN volume routes `https://shogakukan-comic.jp/book?jdcn=091825290000d0000000`, `https://shogakukan-comic.jp/book?jdcn=091827990000d0000000`, `https://shogakukan-comic.jp/book?jdcn=091834200000d0000000`; sampled reader `https://sc-portal.tameshiyo.me/091825290000d0000000`. Selected `reader-trg-09` through `reader-trg-14` are readable body pages across historical battle or combat with injury or rescue, and modern karaoke or indoor dialogue, giving two genuine contexts; their per-page hashes and set hash are in `preflight.csv`.

## Temporary capture and verification boundary

- Original preview bytes were downloaded only under `/tmp/konocomics-batch005-art-chunk05/{41,43,46,47,50}raw/`; the Kodansha routes were also checked through the official reader, but their obfuscated bytes were not used as samples. No image was added to the repository.
- `preflight.csv` has the prescribed 17 columns and exactly ten scoped data rows in frozen order. CSV parsing verifies every row has 17 fields.
- Four accessible works have six selected temporary capture hashes each; six failed or insufficient routes have no sampled-page hashes. `pageRefs` carries every selected page SHA-256; `temporarySampleSha256` preserves that exact per-page material for 41 and uses deterministic selected-byte set hashes for 46, 47, and 50.
- Every `motionGateAttemptable` value is `false`; no exact bounded continuous start-development-impact-resolved sequence was isolated.
- No Art value, confidence, factor value, promotion, adjudication, or commit was performed. `reviewedByHuman=false` remains explicit.
