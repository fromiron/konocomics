# Batch 005 research QA — chunks 03–04

- overall: `PASS`
- work-level results: `PASS 20`, `NEEDS_REVIEW 0`, `REJECT 0`
- reviewedByHuman: `false`
- reviewDate: `2026-08-25`
- reviewer: Luna independent static QA
- scope: frozen-work-set positions 21–40, annotation-review request, research validation contract in `scripts/build-promotion-batch-packet.ts`, and research chunks 03–04
- sourceMutation: none; this report is the only requested output

`PASS` means the research record is structurally valid, identity-consistent for its declared source route, scope-bounded, and honestly classified. It is not an annotation, safety, eligibility, recommendation, or promotion approval.

## Contract checks

| check | result |
| --- | --- |
| Frozen positions covered | `20/20` |
| Heading count | chunk 03 `10`, chunk 04 `10` |
| Heading IDs/titles equal frozen positions 21–40 and order | `PASS 20/20` |
| Decorative `『`/`』` in frozen titles or headings | `0` |
| Source records | chunk 03 `30`, chunk 04 `28`, total `58` |
| Required fields (`sourceUrl`, `publishedAt`, `retrievedAt`, `authorityClass`, `provenanceFactorClassification`, `evaluatedRange`, `supportedClaims`, `observation`, `limitation`) | `58/58` records complete |
| `retrievedAt=2026-08-25` | `58/58` |
| Source URLs | `58/58` single direct HTTP(S) URL; semicolon chains `0` |
| Authority/provenance classification | `58/58` consistent with the declared route and role |
| Entry scope | `58/58` source records bounded to volumes 1–3 or first-major-episode scope |
| Factor/Genre/Theme/Art/safety/eligibility/promotion assignments | `0` assignments; boundary and limitation statements do not assign values or statuses |

The route classifications are appropriately separated: publisher volume and digital-volume pages are primary; Big Gangan pages are rights-holder series/episode routes; Kinokuniya is a licensed-distributor secondary lead; Manga Taisho pages are official-award-jury commentary or selection provenance. Award commentary is not presented as publisher evidence, and the selection-only record is explicitly excluded from content classification.

## Work-by-work disposition

| position | workId | canonicalTitle | result | finding / exact fix |
| ---: | --- | --- | --- | --- |
| 21 | `work-1ec3d48e64b228bb8a92` | 娚の一生 | `PASS` | Official Shogakukan e-comic volume 1–3 routes; source and representative paper ISBN relations are stated. |
| 22 | `work-238c04ae3a3a61451078` | リューシカ・リューシカ | `PASS` | Official Square Enix volume 1–3 pages with direct ISBN-bound routes. |
| 23 | `work-43ebf010a490cfd4bb50` | 千年万年りんごの子 | `PASS` | Official Kodansha volume 1–3 pages; each record stays at entry scope. |
| 24 | `work-4b4bbe8c10859c46e726` | 百舌谷さん逆上する | `PASS` | Official Kodansha volume 1–3 pages; promotional and medical-sounding wording is limited rather than classified. |
| 25 | `work-5ad62e6413f67d351f1d` | 天にひびき | `PASS` | Official 少年画報社 volume 1–3 pages; first-major-episode wording remains bounded. |
| 26 | `work-5b7cf2105a4bc6f6b46c` | クジラの子らは砂上に歌う | `PASS` | Official 秋田書店 volume 1–3 pages with direct edition routes. |
| 27 | `work-5e30ab3c7e3fb43e51f2` | 女王の花 | `PASS` | Official Shogakukan digital volume 1–3 routes; electronic and frozen paper ISBN relations are disclosed. |
| 28 | `work-62fb5d8e9f6c6bbbeba9` | 血潜り林檎と金魚鉢男 | `PASS` | Official KADOKAWA volume 1–3 routes, including the direct KADOKAWA store volume-3 product route. |
| 29 | `work-6c6341781c12b590864f` | 鉄楽レトラ | `PASS` | Official Shogakukan e-comic volume 1–3 routes with paper/electronic relation notes. |
| 30 | `work-77008e04537e3fd889e2` | ジョジョリオン | `PASS` | Official Shueisha volume 1–3 pages with direct ISBN-bound routes. |
| 31 | `work-79c18b26dfde8a532f73` | デストロ２４６ | `PASS` | Official Shogakukan volume 1–3 pages; the Manga Taisho commentary is honestly secondary and limited to cumulative 2–3 reading observations. |
| 32 | `work-7b6eb2b48ac06ffa26eb` | 夢の雫、黄金の鳥籠 | `PASS` | Official Shogakukan volume 1–3 pages with direct ISBN-bound routes. |
| 33 | `work-8037856e7703fdaf4324` | 日常 | `PASS` | Source 3 now states `1~3권` bibliographic identity and explicitly excludes volume 4 onward (`chunk-04.md:145`); it remains identity-only and makes no content claim. |
| 34 | `work-88cb26a0229ad7b83263` | ひらやすみ | `PASS` | Official Shogakukan volume 1–3 pages; plot claims and limitations remain entry-scoped. |
| 35 | `work-8a7846af8ead1797e6a2` | ハイスコアガール | `PASS` | Official rights-holder series and episode-preview routes are used for the allowed first-major-episode scope, with edition uncertainty explicitly limited. |
| 36 | `work-8ff141505b0a27f8d630` | WOMBS | `PASS` | Official Shogakukan digital volume 1/3 and licensed volume-2 route are honestly separated; physical/electronic mapping limitations are retained. |
| 37 | `work-982bb79e03193ebbafcd` | ママはテンパリスト | `PASS` | Official Shueisha volume 1–3 pages; no downstream classification is assigned. |
| 38 | `work-9e98119539f60465ce66` | 僕らはみんな河合荘 | `PASS` | The out-of-scope volume-4 record is gone; remaining Source 2 is the Manga Taisho early boardinghouse commentary and is honestly marked `factor-evidence-secondary-lead` with no volume-4 claim. |
| 39 | `work-aa6018249b7fe7e92d95` | かよちゃんの荷物 | `PASS` | Official Manga Taisho commentary is honestly marked secondary lead or selection-only; content and edition limitations prevent it from being treated as publisher/Factor evidence. |
| 40 | `work-ab9331f7fed1990f7dc6` | 脳内ポイズンベリー | `PASS` | Official Shueisha volume 1/3 and rights-holder series routes; electronic identifiers and 1–3 scope limits are stated. |

## Closure

- Re-QA after the two source corrections is clean: all 20 works pass identity/order, metadata, URL, authority/provenance, and entry-scope checks.
- The `researchPayloadFiles()` contract shape remains satisfied: 20 headings, 58 complete source records, 58 exact retrieval dates, and no out-of-scope volume record.
- `reviewedByHuman=false` remains in force. No research source file was edited and no commit was made.
