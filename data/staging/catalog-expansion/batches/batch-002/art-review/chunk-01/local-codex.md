# Batch 002 Art review chunk 01 — Local Codex blind pass

- Review date: `2026-08-23`
- Reviewer path: Local Codex blind pass
- `reviewedByHuman=false`
- Inputs opened: Factor Dictionary; annotation guide; chunk-01 preflight CSV and ledger; the exact selected captures under `/tmp/batch002-art-preflight.DZG1uL`
- Isolation: no Batch 002 Gemini conclusion or ledger was opened before or during this freeze.
- Exclusions: covers; synopsis text; animation; and user opinion were not used for any Art value.

## Pixel and hash verification

Every selected capture was opened at original pixel detail. SHA-256 was recomputed from the temporary file bytes and joined back to the preflight page reference. Result: `27 recomputed / 27 matched / 0 missing / 0 mismatched`. RED has no selected capture. The temporary captures remain under `/tmp`; this review directory contains no image file.

| Work and page ref           | Temporary capture                   | Recomputed SHA-256                                                 |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| サンダー３ p010-p011        | `thunder-sample-01.png`             | `d764131a1787b67e71e55ab5856b7a11e965c6cc952c9aaaaae813113e5f24dd` |
| サンダー３ p012-p013        | `thunder-sample-02.png`             | `6b7855bc48ad40457db4023704f46c13ebd71b00d5e83c97ef889270ad036615` |
| サンダー３ p014-p015        | `thunder-sample-03.png`             | `bdb0763f79db3371dca015068feafc0341078533749ceb0ece4db5d3e475f1ef` |
| のたり松太郎 reader-step-05 | `notari-sample-step05.png`          | `e9244590ce5fa604b8716085f13633fdf2e78cfbdf79d9214bb4fe1ddf3b3ae4` |
| のたり松太郎 reader-step-06 | `notari-sample-step06.png`          | `4b46b3ca753a3d3a7f6056181ee038b0b20cbc275e1e75ead1db583b100d4d65` |
| のたり松太郎 reader-step-07 | `notari-sample-step07.png`          | `a563ce13f1fb9e494759e7c021627e2d9d067c3758c7e49f661318fc4ab8361a` |
| デカワンコ p006-p007        | `deka-deep-02.png`                  | `e70c28b902d74b708308a69c4123de3280d37f663d8da220ca1c6d4b4be951e6` |
| デカワンコ p010-p011        | `deka-story-01.png`                 | `f40c202aec15c1c55064c5538bd5468e04f418115e4a5002ebba8c2b82c774e6` |
| デカワンコ p012-p013        | `deka-story-02.png`                 | `7c1fe91e9d1e0ae7dd80274c179d942cb40f3f2f89cdbf4b83c5b4fd14468384` |
| ファイアパンチ p004-p005    | `page-2026-08-22T20-18-34-769Z.png` | `4a53def0072410f4af3461f3173b46f52346dc07d31fcb95873dc0bba1c6fa13` |
| ファイアパンチ p006-p007    | `page-2026-08-22T20-18-37-114Z.png` | `70671376f055bc7354368706c1c58580075aa646d0c66404bb81b69fe6b4a1b8` |
| ファイアパンチ p008-p009    | `page-2026-08-22T20-17-23-793Z.png` | `e4a6dc03f61fe87df665b08e83a70dd886fb55e2b1672be54f81dae563888b57` |
| 邪眼は月輪に飛ぶ p010-p011  | `jagan-sample-step05.png`           | `120884a7b7b4412872570c6beac3e3e448cc5ba87da12c6d96fb763bd003e03a` |
| 邪眼は月輪に飛ぶ p012-p013  | `jagan-sample-step06.png`           | `a6050e7b43e79898e683ebe70874f0cb594067b936b17de6ed6551bfaf210f3f` |
| 邪眼は月輪に飛ぶ p014-p015  | `jagan-sample-step07.png`           | `c289429deaf403bf73c311e536ef4d57e669a439b06d00a988e3baff1f8a3687` |
| 銀河鉄道999 p016-p017       | `galaxy999-sample-step05.png`       | `0ff6c5d54f42789fd11d68c696ae4f30b1b3f41632c14c4f5c4cdec69b360346` |
| 銀河鉄道999 p018-p019       | `galaxy999-sample-step06.png`       | `cd117d881ea8a749e876b0540c2752d63dade3010b625be6815fba876be08dd1` |
| 銀河鉄道999 p020-p021       | `galaxy999-sample-step07.png`       | `57c6c9d87c58feb20d7b16236054b735180ac0d835b3a329ef66265a9201e88c` |
| 吉祥天女 p018-p019          | `kichijo-sample-step05.png`         | `5ae4c01cc93cd89f885f62dba5d82fd196201c9ac6ce6c56729c53405a97b218` |
| 吉祥天女 p020-p021          | `kichijo-sample-step06.png`         | `f888ddf6461d5f4c29f2df4840187586155203688e9cb14841cbdbb5d5fcd77e` |
| 吉祥天女 p022-p023          | `kichijo-sample-step07.png`         | `69dbc1327c9420d160be26b5e32730c90e9649542d71c15918fc95534a1c58b9` |
| 六三四の剣 p018-p019        | `musashi-sample-step05.png`         | `694e6108f011aee83ca9114a69df18b54b30e93a55a921000c1bbbc1f14b0e4b` |
| 六三四の剣 p020-p021        | `musashi-sample-step06.png`         | `b653472dad22aaa2ac88b64ddc0a5270d3b00fa5d0d6f3abf93ec37ed56063e9` |
| 六三四の剣 p022-p023        | `musashi-sample-step07.png`         | `2e06569fb3eab745b58cd5d4f3e72474ad13f8f89cfe45dd09c5cd4e4a419edf` |
| 怪獣8号 reader-step-12      | `kaiju8-deep-02.png`                | `4c19bcdd2a5cc57a3195aa5f7539a0519963e5449c0056e0a1e16b83c4ef09fa` |
| 怪獣8号 reader-step-14      | `kaiju8-deep-03.png`                | `ebabcb2a7f0e4a362b0eae72fd745c1c71d694699124326d3b288755443ee9f6` |
| 怪獣8号 reader-step-18      | `kaiju8-story-02.png`               | `756e2787083e44c8aea3821eb8328f87141409e700ad8113624961e3129b651e` |

## Edition and gate ledger

Axis order in vectors is `artRealism / artDensity / visualSoftness / motionImpact`. `U` means `unknown` and is never a low score.

| Work                                       | Official URL and edition mapping                                                                                                | Pages / contexts | Local gate and frozen vector                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------------: | ------------------------------------------------------------------------------------------- |
| work-017446dd1a9039d9839b サンダー３       | <https://comic-days.com/episode/3269754496887933824>; first episode maps to volume 1 ISBN `9784065289280`                       |            6 / 2 | static pass; motion sequence absent; `0 / 1 / 4 / U`                                        |
| work-02d5d329c9ef85e481cb のたり松太郎     | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091800710000d0000000>; digital volume 1 JDCN maps to ISBN `9784091800718`     |            6 / 3 | static pass; motion sequence not fully bounded; `2 / 4 / 0 / U`                             |
| work-089947c5303024841fef デカワンコ       | <https://www.shueisha.co.jp/books/reader/main.php?cid=08865501865501315501>; digital volume 1 JDCN maps to ISBN `9784088655017` |            6 / 2 | static pass; isolated kick impact is insufficient; `2 / 2 / 2 / U`                          |
| work-0e036724913c69bb937a ファイアパンチ   | <https://www.shueisha.co.jp/books/reader/main.php?cid=08880731880731315501>; digital volume 1 JDCN maps to ISBN `9784088807317` |            6 / 2 | static pass; no exact resolved motion sequence; `3 / 3 / 1 / U`                             |
| work-1012948f5de799831da4 RED              | <https://www.kodansha.co.jp/comic/products/0000009137>; digital volume 1 JDCN maps to ISBN `9784063460124`                      |            0 / 0 | official product only; four-axis unknown-ready; `U / U / U / U`                             |
| work-1088a1dc00a3b0d22201 邪眼は月輪に飛ぶ | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091811970000d0000000>; standard single-volume ISBN `9784091811974`            |            6 / 3 | static pass; bridge impact lacks continuous development; `4 / 4 / 0 / U`                    |
| work-19a26f01512166856a6a 銀河鉄道999      | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091880010000d0000000>; digital volume 1 JDCN maps to ISBN `9784091880017`     |            6 / 2 | static pass; firing image lacks resolved endpoint; `2 / 3 / 3 / U`                          |
| work-1e27731b880d0d9012f8 吉祥天女         | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091313010000d0000000>; digital volume 1 JDCN maps to ISBN `9784091313010`     |            6 / 3 | static pass; printed p020 exact bucket-collision sequence passes motion; `3 / 2 / 4 / 2`    |
| work-207bb1ca28b7472fbe1d 六三四の剣       | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091206310000d0000000>; digital volume 1 JDCN maps to ISBN `9784091206312`     |            6 / 3 | static pass; printed p023 exact setup-strike-impact sequence passes motion; `2 / 4 / 0 / 4` |
| work-23851cd7ccf1d0c676cc 怪獣8号          | <https://www.shueisha.co.jp/books/reader/main.php?cid=9784088825250>; official volume 1 reader keyed by ISBN `9784088825250`    |            6 / 3 | static pass; sampled reader steps are discontinuous for motion; `3 / 4 / 1 / U`             |

## Motion gate reinspection

The preflight conservatively marked every motion gate as not attemptable. The Local pixel pass retains `unknown` for seven of the nine sampled works and for RED. It independently upgrades two exact visual sequences rather than treating the preflight eligibility label as an Art conclusion:

- 吉祥天女 printed p020: approach to the stair landing; bucket displacement and contact; immediate clutching reaction. The ordinary comic impact matches anchor 2. The sequence is short and confidence is therefore `0.82`.
- 六三四の剣 printed p023: explicit two-step strike setup; hand transition and accelerating swing; debris-filled impact endpoint with converging speed lines. The strong motion and impact emphasis matches anchor 4 with confidence `0.91`.

Isolated impacts in デカワンコ and 邪眼は月輪に飛ぶ were not promoted. のたり松太郎 contains forceful gag images but the initiating action and development are not visually unambiguous across the selected spread. Static pose changes and non-contiguous reader steps likewise remain `unknown`.

## Uncertainty and terminal scope

- Static known values are supported by exactly six readable internal pages and at least two contexts for each of the nine sample-ready works. Each CSV static row cites all selected refs and therefore at least two pages.
- Intermediate values `1` and `3` are used only where the complete six-page sample visibly falls between adjacent Dictionary anchors; they are not averages.
- RED remains four-axis `unknown` because no internal page was sampled. The official product and edition mapping cannot substitute for pixels.
- Seven other `motionImpact` rows remain `unknown` because exact continuous sequence evidence is absent or incomplete. They are not `0` and not `notApplicable`.
- Values describe the selected official entry-edition sample. No claim is made about unsampled volume-one pages or later volumes.
- No source catalog file or frozen Pilot artifact was changed and no temporary capture was copied into the repository.
