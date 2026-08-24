# Batch 002 Art review chunk 02 — Local Codex blind pass

- Review date: `2026-08-23`
- Reviewer path: Local Codex blind pass
- `reviewedByHuman=false`
- Inputs opened: the Factor Dictionary; the Batch 002 Art-state request; chunk-02 preflight CSV; and only its selected captures under `/tmp/batch002-art-preflight-chunk02.polhkX`
- Isolation: no Gemini Art conclusion or later adjudication was opened before this local freeze.
- Exclusions: covers; synopsis text; animation; user opinion; and the unselected `mahoyome-reader-step01.png` were not used for an Art value.

## Pixel and hash verification

All 27 eligible captures for the nine `sample-ready` works were opened at original pixel detail. The three `orange` captures were not interpreted because their edition prerequisite failed. SHA-256 was recomputed for all 30 captures selected by preflight and joined to the frozen refs: `30 recomputed / 30 matched / 0 missing / 0 mismatched`. The temporary captures remain under `/tmp`; this review directory contains no image file.

| Work and page ref                | Temporary capture                    | Recomputed SHA-256                                                 |
| -------------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| 外天楼 p006-p007                 | `getenrou-reader-step05.png`         | `ee9acad550c01a9341697c80c9f23c5d919a25b241fdeb79dccce1d441d178ce` |
| 外天楼 p020-p021                 | `getenrou-reader-step12.png`         | `6605c10369ab010a72441ae021a428163d61b90456b87bdc292f5441536f1ef0` |
| 外天楼 p040-p041                 | `getenrou-reader-step22.png`         | `264c680c35dbe85ce8a06797d21490e34855e5149b374fd74dde9f0926ffb967` |
| 忍者と極道 reader-step-05        | `ninja-gokudo-reader-step05.png`     | `3e23def13222a5f474653f4f190ca3bc549faefe0c3c5a74049ce3a654b9ec43` |
| 忍者と極道 reader-step-12        | `ninja-gokudo-reader-step12.png`     | `2d7c34c657bfa5f00ef9e5796eeb1947226f0a49fb7c048681bad51ffa0e208f` |
| 忍者と極道 reader-backstep-05    | `ninja-gokudo-reader-backstep05.png` | `b7facfadee3652b4133735be60bb2928828934af251625d9ab99a03cf08988a1` |
| 嘘解きレトリック reader-index-09 | `usotoki-p006-p007.png`              | `feb7999339cf0313ba35dc9a98f57fb549a7821a87d39294582bcf366f8d3bb5` |
| 嘘解きレトリック reader-index-21 | `usotoki-reader-index21.png`         | `5de8711e1043feb6436828cc47087e050ec51d2757833ffda3f4553752d0d63a` |
| 嘘解きレトリック reader-index-37 | `usotoki-p034-p035.png`              | `71dd75aa0ca37753d6ade9fcf96da835ffcfca2b301902971d222474426f5e20` |
| orange reader-step-04            | `orange-reader-step04.png`           | `960cf377765c28fe67beba4eac2542b908e15972faef7beee4a4979b3f736489` |
| orange reader-step-14            | `orange-reader-step14.png`           | `c27063b464b3ad544c4c0732ea9c737ead629ed00149b3cf266ab287c30f50e3` |
| orange reader-step-24            | `orange-reader-step24.png`           | `84d8fea02df3a5a24a5c0b601847cce5b69a6271620fcea431e2326cbeb6c721` |
| 正反対な君と僕 reader-step-05    | `seihantai-reader-step05.png`        | `09c087922e4d06b6add5f11c533570daeb73d6c938a4b87f23e845558f876155` |
| 正反対な君と僕 reader-step-12    | `seihantai-reader-step12.png`        | `2a1214b3786677822dd2d2d217eff75b35c9d1d9ceab7f95252bed0920b734c7` |
| 正反対な君と僕 reader-step-19    | `seihantai-reader-step19.png`        | `cb9aff359194fc662a50aee3e8e7a06a2b1e4470bf67802b0ef2032b6f458b82` |
| 墨攻 reader-step-06              | `bokko-reader-step06.png`            | `2b3ca1d02ec16fd19e2fed8b16863b5a2ddbcca7dd6f7641a4f40a255c2eb458` |
| 墨攻 reader-step-10              | `bokko-reader-step10.png`            | `5a8e20f038615d844408b3cf7f1439c24836ee4a5f96754f6c30f0ec623d0d30` |
| 墨攻 reader-step-14              | `bokko-reader-step14.png`            | `521798a688c8ad15b39e6b18574ba7f6cb379e85b613159cec2a7655c31115d5` |
| がんばれ元気 reader-step-06      | `ganbare-genki-reader-step06.png`    | `f1c7dfe24ab50fc79cc82bccd357e662a08678f8498001d1bd6fd09a9478d205` |
| がんばれ元気 reader-step-12      | `ganbare-genki-reader-step12.png`    | `236f0dfe4ec2de5c3e2e5423a736e6f8e5f966c41195ebadc14f2e9c7dac2314` |
| がんばれ元気 reader-step-18      | `ganbare-genki-reader-step18.png`    | `c5ed40dd8df680d868f2eba5f5fbdc23e615943ffc319f079d4b1d9af47ce447` |
| 赤髪の白雪姫 reader-index-09     | `akagami-reader-index09.png`         | `2f73e07e5a47b6c0d7adaff6a18a794884306f7a761ffc762ac772970a8f7070` |
| 赤髪の白雪姫 reader-index-21     | `akagami-reader-index21.png`         | `53c69323d8f87f77ee6b2295628883c1b852cedda53b51adfe016cf3fbd65512` |
| 赤髪の白雪姫 reader-index-37     | `akagami-reader-index37.png`         | `079c5f9ed4a959a6a1913d54236802465f20ecb3607257b4cffd4f980b937dc7` |
| 人形芝居 reader-index-09         | `ningyo-reader-index09.png`          | `9e6e4dc1828dbc14d595a3d7761896c70fdc082fc1f22cbeb7cd52256cc99a80` |
| 人形芝居 reader-index-21         | `ningyo-reader-index21.png`          | `7b6c447984af22625c77d80952cc21d9a20b82c76234e9d85fddc82ed5988678` |
| 人形芝居 reader-index-37         | `ningyo-reader-index37.png`          | `f4b6650c138b6cc3c2da37d54cb2d2053a94d3cf11daf9c593a7628e766df7ef` |
| 魔法使いの嫁 reader-step-05      | `mahoyome-reader-step05.png`         | `e69ac0bde9392e7f308e57844ce197a96fc99ddf6f16a286a64c941aa56d209a` |
| 魔法使いの嫁 reader-step-10      | `mahoyome-reader-step10.png`         | `42a4919c49139769985c14dcd8c81fc93699df488521a9647fc42b673e8e70e5` |
| 魔法使いの嫁 reader-step-15      | `mahoyome-reader-step15.png`         | `d853e0aa9e387c8ed0940169e6fcb85475d2cf73587a57f8da557936574b1619` |

## Edition and Evidence ledger

Axis order in vectors is `artRealism / artDensity / visualSoftness / motionImpact`. `U` means `unknown` and is never a low score. Each evidence ID binds all three static rows for that work to the listed refs and scene contexts; confidence remains row-specific in `local-art.csv`.

| Work                                       | Evidence ID       | Official URL and edition mapping                                                                                                                                                            | Pages / contexts | Scene contexts                                    | Local gate and vector         |
| ------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------: | ------------------------------------------------- | ----------------------------- |
| work-29d4300ad9d3358fb67a 外天楼           | `ART-B002-C02-11` | <https://www.kodansha.co.jp/comic/products/0000223170/trial>; single-volume product maps to ISBN `9784063761597`                                                                            |            6 / 2 | shop search; later investigation                  | static pass; `2 / 2 / 2 / U`  |
| work-3dfaf6231e21133620c6 忍者と極道       | `ART-B002-C02-12` | <https://www.kodansha.co.jp/comic/products/0000339844/trial>; official volume 1 maps to ISBN `9784065193655`                                                                                |            6 / 2 | public concourse; gang-hall confrontation         | static pass; `3 / 4 / 0 / U`  |
| work-3e725951eb9c49771087 嘘解きレトリック | `ART-B002-C02-13` | <https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59219633rhetori00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D45955>; digital volume 1 maps to ISBN `9784592196334` |            6 / 3 | town arrival; restaurant meal; fall response      | static pass; `2 / 3 / 4 / U`  |
| work-40b8c35b1d8c9a90144c orange           | `ART-B002-C02-14` | <https://comic-action.com/episode/3269632237258846992>; Futabasha preview to frozen earlier Shueisha ISBN `9784088468044` remains officially unresolved                                     |            6 / 3 | captures retained but ineligible                  | edition fail; `U / U / U / U` |
| work-4c784fc78dfd9b139c3f 正反対な君と僕   | `ART-B002-C02-15` | <https://www.shueisha.co.jp/books/reader/main.php?cid=08X10000000022198000>; digital volume 1 maps to ISBN `9784088831251`                                                                  |            6 / 3 | classroom; home night; later school               | static pass; `1 / 1 / 4 / U`  |
| work-518d7ed42dd9253679c3 墨攻             | `ART-B002-C02-16` | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091830410000d0000000>; digital volume 1 maps to ISBN `9784091830418`                                                                      |            6 / 3 | army march; water demonstration; fortress arrival | static pass; `3 / 4 / 0 / U`  |
| work-53e54c95f637b66c4fb2 がんばれ元気     | `ART-B002-C02-17` | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091202110000d0000000>; digital volume 1 maps to ISBN `9784091202116`                                                                      |            6 / 3 | roadside conflict; field chase; station departure | static pass; `2 / 3 / 1 / U`  |
| work-5915d6d7601377fcc75f 赤髪の白雪姫     | `ART-B002-C02-18` | <https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59218373akagami00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D44169>; digital volume 1 maps to ISBN `9784592183730` |            6 / 3 | journey encounter; conversation; confrontation    | static pass; `2 / 2 / 4 / U`  |
| work-5b4dc4e6e966436b2990 人形芝居         | `ART-B002-C02-19` | <https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59217709ninsiba00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D41133>; digital volume 1 maps to ISBN `9784592177098` |            6 / 3 | domestic reunion; child episode; workplace        | static pass; `2 / 1 / 4 / U`  |
| work-5b9a3ec60ac5fc90f444 魔法使いの嫁     | `ART-B002-C02-20` | <https://comic-growl.com/episodes/100daaf157782>; Bushiroad episode maps to former Mag Garden ISBN `9784800002846` through the unchanged-content KADOKAWA bridge                            |            6 / 3 | auction; fairy bath; bedroom                      | static pass; `2 / 3 / 2 / U`  |

## Motion gate result

All ten `motionImpact` rows close `unknown`. The nine eligible samples contain isolated falls; shots; thrown objects; running; cuts; or gestures but the frozen refs do not preserve one unambiguous continuous action with exact start and endpoint references. `がんばれ元気` reader-step-12 is energetic but the selected spread does not provide an exact independently addressable start-development-impact-end boundary. `orange` cannot reach the sequence test because edition mapping fails first. No isolated impact or genre expectation was converted into a motion score.

## Extrema and uncertainty

- Static values are based on exactly six readable internal pages and at least two contexts for each of the nine eligible works. Every known row cites all selected refs and names its work-level Evidence ID.
- Anchor `4` for density is used only for `忍者と極道` and `墨攻` where crowds or architecture plus persistent hatching keep visual information high in every sampled context.
- Anchor `0` for softness is used only for the same two works where hard angular contours and coarse hatching repeat across all six pages. Anchor `4` softness is limited to four samples with consistently smooth polished treatment.
- Intermediate values `1` and `3` mean the complete six-page sample visibly falls between adjacent Dictionary anchors. They are not averages.
- `orange` remains four-axis `unknown` solely because its official preview edition is not mapped to the frozen representative edition. This is terminal Art closure for the pass and not a promotion blocker.
- No temporary image was copied into the repository and no source catalog; Factor Dictionary; Gold row; or non-Art annotation was changed.
