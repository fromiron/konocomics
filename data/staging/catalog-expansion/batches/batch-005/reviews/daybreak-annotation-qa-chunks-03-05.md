# Batch 005 Annotation Pass B Re-QA — Chunks 03–05

- Reviewer: Daybreak independent Pass B
- Review date: 2026-08-25
- `reviewedByHuman`: `false`
- Scope: frozen positions 21–50, Pass A chunks 03–05
- Candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- Constraint: this review does not assign promotion, eligibility, catalog role, safety, or identity status

## Final verdict

**PASS — 30/30 works pass independent Pass B re-review.**

The prior annotation findings were applied exactly, the canonical title defect for position 41 was corrected upstream, and the packet was re-frozen. No remaining Pass A rejection or adjudication finding was identified in chunks 03–05.

## Packet and binding verification

| Input | Verified SHA-256 |
|---|---|
| Candidate | `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695` |
| `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `PAYLOAD.sha256` ledger | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` |
| Annotation request | `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` |
| Factor Dictionary | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| Annotation guide | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| Research chunk 03 | `92f9a69121128aa2668898bdb70a112492bda8958247cd0e9c8202128e533191` |
| Research chunk 04 | `46e6b37d07f4b2baee839dca05331e9c870a6d158c392e3d77ad77419a5b76a3` |
| Research chunk 05 | `cf36b8d5e6fe4a363e87d832de0079b52dd0e96ecffb2e0f96e0c4b627864710` |

`sha256sum -c PAYLOAD.sha256` passes for every listed packet file. Each chunk note binds the current candidate, manifest, frozen set, payload ledger, request, dictionary, guide, and assigned research digest. No stale manifest-file or research binding remains.

The earlier QA artifact bound to candidate `abda20eb624780d0861d4df3b29164480859e318b8f58834e9ccc73c8c3d2c8c` was discarded after the deterministic re-freeze. This report was independently rerun against the current root; it is not a mechanical relabel of the stale QA.

## Validator results

Executed independently:

```text
pnpm catalog:promotion:annotations --batch-id batch-005 --pass annotation-pass-a --chunk 03
pnpm catalog:promotion:annotations --batch-id batch-005 --pass annotation-pass-a --chunk 04
pnpm catalog:promotion:annotations --batch-id batch-005 --pass annotation-pass-a --chunk 05
```

| Chunk | Works | Factor rows | Known | Unknown | Not applicable | Theme rows | Result |
|---|---:|---:|---:|---:|---:|---:|---|
| 03 | 10 | 170 | 54 | 116 | 0 | 8 | PASS |
| 04 | 10 | 170 | 43 | 127 | 0 | 8 | PASS |
| 05 | 10 | 170 | 42 | 128 | 0 | 16 | PASS |

All works have exactly 17 axes in dictionary order. Every Genre and Theme ID is dictionary-legal, known rows have legal values and confidence, and unknown rows have blank numeric fields.

## Prior-finding resolution

| Position | Required correction | Re-QA result |
|---:|---|---|
| 21 | Remove unsupported `school` Theme and notes claim | PASS — no Theme row or stale claim remains |
| 23 | Remove unsupported `politics` Theme and notes claim | PASS — no Theme row remains; limitation is explicit |
| 24 | Remove stale notes-only `school=2` claim | PASS |
| 25 | Remove stale `school=2`; set `emotionalWarmth` unknown | PASS |
| 26 | Set `progression` unknown | PASS |
| 32 | Set `progression` unknown | PASS |
| 34 | Set `worldBuilding` and `emotionalWarmth` unknown | PASS |
| 36 | Set `problemSolving` unknown | PASS |
| 38 | Remove comedy Genre; set `comedy` and `worldBuilding` unknown | PASS — Genre is now `sliceOfLife;romance` |
| 40 | Set `progression` and `worldBuilding` unknown; lower `relationshipStructure` to `2` at `0.80` | PASS |
| 41 | Correct canonical title and re-freeze packet | PASS — canonical title is `機械仕掛けの愛` throughout the authoritative packet and Pass A note |
| 43 | Set `emotionalWarmth` unknown | PASS |
| 46 | Set `mentalStress` unknown | PASS |
| 47 | Set `mentalStress` unknown while preserving separately supported darkness | PASS |

The resulting known-count deltas are exactly the expected corrections: chunk 03 `56→54`, chunk 04 `51→43`, and chunk 05 `45→42`. Theme rows changed only where required in chunk 03 (`10→8`); chunks 04 and 05 remain at 8 and 16. No collateral Factor, Genre, or Theme drift was found.

## Per-work result

| Position | Work ID | Canonical title | Result |
|---:|---|---|---|
| 21 | `work-1ec3d48e64b228bb8a92` | 娚の一生 | PASS |
| 22 | `work-238c04ae3a3a61451078` | リューシカ・リューシカ | PASS |
| 23 | `work-43ebf010a490cfd4bb50` | 千年万年りんごの子 | PASS |
| 24 | `work-4b4bbe8c10859c46e726` | 百舌谷さん逆上する | PASS |
| 25 | `work-5ad62e6413f67d351f1d` | 天にひびき | PASS |
| 26 | `work-5b7cf2105a4bc6f6b46c` | クジラの子らは砂上に歌う | PASS |
| 27 | `work-5e30ab3c7e3fb43e51f2` | 女王の花 | PASS |
| 28 | `work-62fb5d8e9f6c6bbbeba9` | 血潜り林檎と金魚鉢男 | PASS |
| 29 | `work-6c6341781c12b590864f` | 鉄楽レトラ | PASS |
| 30 | `work-77008e04537e3fd889e2` | ジョジョリオン | PASS |
| 31 | `work-79c18b26dfde8a532f73` | デストロ２４６ | PASS |
| 32 | `work-7b6eb2b48ac06ffa26eb` | 夢の雫、黄金の鳥籠 | PASS |
| 33 | `work-8037856e7703fdaf4324` | 日常 | PASS |
| 34 | `work-88cb26a0229ad7b83263` | ひらやすみ | PASS |
| 35 | `work-8a7846af8ead1797e6a2` | ハイスコアガール | PASS |
| 36 | `work-8ff141505b0a27f8d630` | WOMBS | PASS |
| 37 | `work-982bb79e03193ebbafcd` | ママはテンパリスト | PASS |
| 38 | `work-9e98119539f60465ce66` | 僕らはみんな河合荘 | PASS |
| 39 | `work-aa6018249b7fe7e92d95` | かよちゃんの荷物 | PASS |
| 40 | `work-ab9331f7fed1990f7dc6` | 脳内ポイズンベリー | PASS |
| 41 | `work-c50ea94bb66f72c679a2` | 機械仕掛けの愛 | PASS |
| 42 | `work-c7e065f61bb7a176ee56` | 臨死!!江古田ちゃん | PASS |
| 43 | `work-c8243866b7c8a6d9a2f8` | 町でうわさの天狗の子 | PASS |
| 44 | `work-db4a0ec451d7f4ffd8b8` | 万福児 | PASS |
| 45 | `work-e658d3aee2e33c17aa38` | スピリットサークル | PASS |
| 46 | `work-e906b3eaa9ef9eafe23c` | トリリオンゲーム | PASS |
| 47 | `work-f31a42ea4ad724acefa5` | デッドデッドデーモンズデデデデデストラクション | PASS |
| 48 | `work-f4bfc29a5e0a9b5148d0` | 月に吠えらんねえ | PASS |
| 49 | `work-fb89f119251610cf1648` | 1/11 じゅういちぶんのいち | PASS |
| 50 | `work-fe35a5f01946f5153eb4` | シュトヘル | PASS |

## Boundary and quality checks

- Art: all 120 Art-axis rows are explicit `unknown` with blank numeric fields. No synopsis, cover, animation, title, memory, or user opinion was converted into a known Art value.
- Title normalization: `機械仕掛けの愛１` is absent from the frozen packet and Pass A outputs. The corrected title `機械仕掛けの愛` matches source Work data and canonical mapping. No decorative `『』` wrapper appears in a canonical title.
- Summary silence: unsupported values identified in the first review now terminate as `unknown`, not numeric zero or a fabricated midpoint.
- Theme centrality: no remaining inflation or Genre/Theme confusion was identified.
- Extreme values: the remaining values of 4 are supported by repeated, entry-scope official evidence rather than Genre inference.
- Duplicate vectors: positions 22 and 41 share an independently supported pacing-only vector; positions 35 and 39 independently terminate all axes as unknown. These sparse duplicates have separate evidence packets and are not copied annotation. The previous positions 25/29 collision is resolved.
- Evidence: every known Factor and Theme retains the work-scoped evidence ID; selection provenance is not used as Factor Evidence.
- Review boundary: all three notes state `reviewedByHuman=false`; no human approval, promotion, safety decision, or eligibility decision is implied.

## Pass B conclusion

Chunks 03–05 are ready to proceed to the next independent review/adjudication stage under candidate `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`. This PASS is limited to annotation QA and does not itself promote any work.
