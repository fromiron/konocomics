# Batch 005 research QA — chunks 01–02

## Verdict

- overall: `PASS`
- work-level results: `PASS 20`, `NEEDS_REVIEW 0`, `REJECT 0`
- reviewedByHuman: `false`
- reviewDate: `2026-08-25`
- reviewer: Luna independent static QA
- scope: frozen-work-set positions 1–20, annotation-review request, research validation contract in `scripts/build-promotion-batch-packet.ts`, and research chunks 01–02
- sourceMutation: none; this report is the only requested output

The previously reported source/provenance issues are closed. The corrected Animate record now binds to `ラーメン大好き小泉さん`, Fuji TV is labeled as broadcaster adaptation promotion, and all three `おまかせ精霊` classifications now match their evidence roles and the defined taxonomy.

## Contract checks

| check | result |
| --- | --- |
| Frozen positions covered | `20/20` |
| Heading count | chunk 01 `10`, chunk 02 `10` |
| Heading IDs/titles equal frozen positions 1–20 and order | `PASS 20/20` |
| Decorative `『`/`』` in frozen titles or headings | `0` |
| Source records | `58` |
| Required fields (`sourceUrl`, `publishedAt`, `retrievedAt`, `authorityClass`, `provenanceFactorClassification`, `evaluatedRange`, `supportedClaims`, `observation`, `limitation`) | `58/58` records complete |
| `retrievedAt=2026-08-25` | `58/58` |
| Source URLs | `58/58` single directly bound URL; semicolon chains `0` |
| Scope | No volume beyond 1–3; first-major-episode and series-premise limits are explicitly stated where used |
| Factor/Genre/Theme/Art/eligibility/promotion assignments | None; only boundary/limitation statements appear |

Publisher, rights-holder series, broadcaster adaptation, licensed distributor, and licensed platform routes are labeled consistently with their URLs. No award or selection-provenance source is present in these chunks, so none is being reused as Factor Evidence.

## Work-by-work disposition

`PASS` means the research record is structurally valid, scope-bounded, identity-consistent, and has an honest authority/provenance classification. It is not an annotation, eligibility, or promotion approval.

| position | workId | canonicalTitle | result | finding |
| ---: | --- | --- | --- | --- |
| 1 | `work-060a72fe10cf6ba9cbfc` | チェーザレ 破壊の創造者 | `PASS` | Three directly bound Kodansha volume pages; complete fields, volume 1–3 scope, and no assignments. |
| 2 | `work-076beb86f844b642beef` | くーねるまるた | `PASS` | Three directly bound Shogakukan e-comic pages; undated publication values are explained and scope is bounded to volumes 1–3. |
| 3 | `work-091d231d37f037fb07e8` | インベスターZ | `PASS` | Three official Kodansha volume records; entry-range claims remain descriptive and no financial eligibility or factor value is assigned. |
| 4 | `work-0cf463005cc77eeded8e` | 黄泉のツガイ | `PASS` | Three official Square Enix volume pages with direct volume scope and explicit limitations. |
| 5 | `work-0d1ad77728a44df56508` | ラーメン大好き小泉さん | `PASS` | Corrected Animate title/URL is directly bound to the frozen work; Fuji TV is explicitly labeled broadcaster adaptation promotion and remains secondary, first-major-entry evidence. |
| 6 | `work-0dabd1d17e5fcf2992b9` | 忘却のサチコ | `PASS` | Three official Shogakukan volume pages with direct volume claims and no classification leakage. |
| 7 | `work-0ebf010ac12b9b60d80e` | 機動旅団八福神 | `PASS` | Official KADOKAWA volume plus clearly marked licensed platform/distributor supplements; 1–3 scope is explicit. |
| 8 | `work-0ede6921b81169dc2dda` | 不滅のあなたへ | `PASS` | Three official Kodansha pages; repeated series-premise text is explicitly not expanded into unsupported volume detail. |
| 9 | `work-0eff8190c0c6ff604527` | よるくも | `PASS` | Three official Shogakukan e-comic pages with bounded plot observations and limitations. |
| 10 | `work-12b484cd79bfe6852ea1` | 高校球児 ザワさん | `PASS` | Three official Shogakukan e-comic pages; promotional language is not converted into Genre, Theme, or eligibility. |
| 11 | `work-151b456508f78852b002` | ヨルムンガンド | `PASS` | Three official Shogakukan volume records; direct 1–3 scope and primary classification are appropriate. |
| 12 | `work-1550d4a52c3fe6d9f94c` | ボクラノキセキ | `PASS` | Official Ichijinsha volumes plus a clearly labeled rights-holder series premise; volume-3 detail is not claimed. |
| 13 | `work-15d6508605fbd4a266fc` | おまかせ精霊 | `PASS` | Bibliographic Sources 1–2 are `identity-edition-lead-only`; the volume-1 distributor synopsis is `factor-evidence-secondary-lead`. |
| 14 | `work-18e08fe95968a6537773` | ニラメッコ | `PASS` | Official Hakusensha volume/series/editorial routes are clearly identified; release notice is not treated as selection provenance or an assignment. |
| 15 | `work-19b578d0e828242f14f3` | 恋愛ラボ | `PASS` | One official publisher series page gives bounded volume 1–3 summaries with complete source fields. |
| 16 | `work-1b3afe12c434a9cf7603` | 銀のスプーン | `PASS` | Three official Kodansha volume records with direct 1–3 scope. |
| 17 | `work-1b7c4ed54d7761cd242b` | おかめ日和 | `PASS` | Three official Kodansha volume records; generic volume-2 wording is limited rather than inflated. |
| 18 | `work-1bce95b6c02673e59bcf` | 新黒沢 最強伝説 | `PASS` | Three official Big Comic Bros/Shogakukan volume records with bounded claims. |
| 19 | `work-1d5a3158e78e639f1973` | カレチ | `PASS` | Three official Kodansha volume records; short-story observations stay within the recorded volumes. |
| 20 | `work-1e9c4852863a22bba058` | GREEN WORLDZ | `PASS` | Three official Kodansha volume records with direct volume scope and no downstream assignments. |

## Closure verification

- `research/chunk-01.md`: Animate Source 2 now uses `ラーメン大好き小泉さん` and a directly bound product URL; Fuji TV Source 1 now uses `official broadcaster adaptation promotion page`.
- `research/chunk-02.md`: `おまかせ精霊` Sources 1–2 now use `identity-edition-lead-only`; Source 3 now uses `factor-evidence-secondary-lead`.
- Re-run result: 20/20 frozen identity order, 58/58 complete source records, 58/58 exact retrieval dates, 0 semicolon URL chains, 0 decorative title delimiters, and 0 Factor/Genre/Theme/Art/eligibility/promotion assignments.
- No research source file was edited by this QA, and `reviewedByHuman=false` remains in force.
