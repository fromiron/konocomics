# Batch 005 Art preflight input ledger — chunk 03

- scope: positions 21–30 in frozen manifest order
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporary image root: `/tmp/konocomics-batch005-art-chunk03`
- repository image mutation: none
- archive format: uncompressed
- canonical output CSV: `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-03/preflight.csv`
- canonical output ledger: `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-03/ledger.md`
- canonical output CSV SHA-256: `8379215c7c1ddcde7c4d3bfe2848b974a2200f5a95b5c7758e6778b9436f38f0`
- canonical output ledger SHA-256: `ecda6c82f9b90e95354c7ed28c8234ecd774bf80ddacafef8c1ea45ddc60413c`

## Canonical input identities

| Input | Repository path | SHA-256 |
| --- | --- | --- |
| candidate root | supplied canonical candidate identity | `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695` |
| manifest | `data/staging/catalog-expansion/batches/batch-005/manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| payload ledger | `data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` |
| frozen work set | `data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| route registry | `data/staging/catalog-expansion/art-source-route-registry.csv` | applied as current repository input |
| research packet | `data/staging/catalog-expansion/batches/batch-005/research/chunk-03.md` | applied as current repository input |

## Frozen route bindings

| Pos | Work | Representative ISBN | Official route used or checked | Input disposition |
| ---: | --- | --- | --- | --- |
| 21 | 娚の一生 | `9784091322692` | 小学館eコミックストア JDCN `091322690000d0000000` viewer | sampled |
| 22 | リューシカ・リューシカ | `9784757529083` | スクウェア・エニックス volume 1 product and registered Gangan route check | product only |
| 23 | 千年万年りんごの子 | `9784063805789` | 講談社 product `0000046459` linked trial reader | sampled |
| 24 | 百舌谷さん逆上する | `9784063145120` | 講談社 product `0000029330` linked trial reader | sampled |
| 25 | 天にひびき | `9784785932909` | 少年画報社 volume 1 product `id=6719` and topic trial check | product only |
| 26 | クジラの子らは砂上に歌う | `9784253261012` | 秋田書店 product and registered Champion Cross route check | product only; ARC reader not substituted |
| 27 | 女王の花 | `9784091320094` | 小学館 JDCN `091320090000d0000000` viewer | sampled |
| 28 | 血潜り林檎と金魚鉢男 | `9784048860499` | KADOKAWA product `201108000200` and product-linked distributor check | product only |
| 29 | 鉄楽レトラ | `9784091234452` | 小学館eコミックストア JDCN `091234450000d0000000` viewer | sampled |
| 30 | ジョジョリオン | `9784088703114` | 集英社 exact ISBN reader | sampled |

The exact representative ISBN was required to bridge the official product to the internal sample. Generic retailer previews and unregistered routes were not accepted. For position 26 the official `arc.akitashoten.co.jp` reader was observable but is not the registered `championcross.jp` route for this batch, so its pages are not input to the preflight result.

## Selected temporary capture hashes

The following captures are six readable internal body-page screenshots per sampled position. The files remain temporary and are not repository artifacts.

- 21 娚の一生: `reader-step-04=929fd481fb2d278e43cc6a1039277dd64e207e2a0ce4083e3e1210c65dc543e5`; `reader-step-05=9c0f95ba69797435776e64c9a2866bed3210c050b6b783cf549d832254b18c0e`; `reader-step-06=9b42d6b2a50cb466796fc7ab4489ab3d4f40f134ef0710251ca2a4e57fb0a8b`; `reader-step-07=df4866e5fd08d70c60fc71c544bfeda4ae8f320a8d1def588aab0dcf64acf408`; `reader-step-08=ea9475225f62b2cde2b6e301aeb4c3b1874835b301e86eb6c86f8e6ae9b96854`; `reader-step-09=a4f244ecec2772100240b248e2d14a7227ad6e6ef104a82500cf5e31af38961a`
- 23 千年万年りんごの子: `reader-step-04=3a04c9585e1f57ce2138c6063dd8f6a9cab93bf7c080b02cb79ac8543940010e`; `reader-step-05=38d013ba7c534a2c9743b52d1d6203c2e167c60f9808fd279203533d22d8b6df`; `reader-step-06=f5274e88c63b8851965d73535ee3319c97fa0d697e04819cbc5dea4add230262`; `reader-step-07=83116f9f697ed0161c5e7fa00b01fc05188c6f0b0107c5df0ece7d89518c808c`; `reader-step-08=4bd728d88734529152661fe6284ea8937b1e7b75295c49de55945ba44f2f421f`; `reader-step-09=7623b77ddc003159f9e7aa288c951ca78ec3d72e9532da7ee145a37579ccf5a8`
- 24 百舌谷さん逆上する: `reader-step-04=92abea8b4aa94fff54f14b89e269a8fa94219f734155430e7c0377f6e9f6e31a`; `reader-step-05=ecd3cea43191300657310721453aaabb7e7df0131c9f3e760551d09c0f3317df`; `reader-step-06=7f9d3c98df7fc6877f94c93012c009c9243704eda1cda422673e82417323f5de`; `reader-step-07=812dc6c6936b3236c4d6c578a48940edad6e2bbd6e0acc977a2f9b00d6f81bf1`; `reader-step-08=996beb99f07b333619b7db6d6a6d340246663a00cfebd8ca545b70546f516386`; `reader-step-09=6ffc6d95f2519e28b376dea2953d13b29d49503f077779eff78c0db72bece957`
- 27 女王の花: `reader-step-04=f283db06cd04d06c3cddab3796c28d7555cc6781bab50e24d7e78be4010cbd28`; `reader-step-05=1bcda3bbec6ed83d84a853db909b5917fffd187b0f3c96dcfa06075db3d29ad6`; `reader-step-06=5c81a04abd5a4ae7c7d99f4bdc0efb51b1b353a4569cad89b1773fa5f7e45f4a`; `reader-step-07=ea775ffa3eb18160919a0986edcf0ff7895d6d26c62b4110a6fed900fc501f28`; `reader-step-08=2906c7decb5e90e1a0ac674ae6c4f2c91a63b43a61ca18d78ef69761e3d531b2`; `reader-step-09=7fe5491aaf1ed6d0797625def24cfa41b2d72ef8cd894c8b0d4a94a6f9afa06e`
- 29 鉄楽レトラ: `reader-step-04=fb313bdddc18d983219c2b78d1eb9180494bdfdc4a2eeb4ad4e90d81ccd4bda3`; `reader-step-05=a927ae93f9c8b2b529ff5be4c3f7298262126247d4eff8a6ec715c0772da5ab3`; `reader-step-06=a2cb9e02f813392f5d0ee4b5e0190984b8bd6c90f2503a2bf470aaf45111d4fa`; `reader-step-07=400ea2e057c5384146fb4f46286c6011ff55198a103dd11d4a981559202eec8f`; `reader-step-08=2f70f46ab410efbd5c2615e0c765bb20a0fcec4eed5918897fb7d4a357de67a8`; `reader-step-09=4fff94f5aa17f58ff4abcb4fbd774ecc87c1ca2887896bdcac292e63a937b5af`
- 30 ジョジョリオン: `reader-step-05=bba491a471d3ce544ec68d68af9e50462d3b14487ebd51cbf7a1c246b8d2730b`; `reader-step-06=f12ced145bae2595583e2d2471d184f815f3fe7ca23b2e07b28de6a05d6635e1`; `reader-step-07=b655fa7fe144dd4be99e92b58cb3aeca65a95e83c1eb4dfc310da9b5d1f35682`; `reader-step-08=9ad26c84852e6eefefe2e12c47f23490ff3c1ab5d731b967cb90f6399e174587`; `reader-step-09=90155f576f780b31b62f2ac6d938ba333b1d4d259f9165c88093a4e195b9c599`; `reader-step-10=fbd1bbb44a4371f13cb59c16d8984f9ca3d584054305235f00daf3f233ab940e`
