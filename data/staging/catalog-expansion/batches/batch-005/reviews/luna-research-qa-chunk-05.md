# Batch 005 research QA — chunk 05

- overall: `PASS`
- reviewedByHuman: `false`
- reviewedAt: `2026-08-25`
- reviewer: Luna independent static QA
- scope: frozen-work-set positions 41–50, annotation/review request, `scripts/build-promotion-batch-packet.ts` research contract, and `research/chunk-05.md`
- sourceMutation: none; this report is the only requested output

## Contract checks

| check | result |
| --- | --- |
| Frozen positions covered | `10/10` |
| Heading count | `10` |
| Heading IDs/titles equal frozen positions 41–50 and order | `PASS 10/10` |
| Decorative `『`/`』` in frozen titles or headings | `0` |
| Source records | `30` |
| Required fields (`sourceUrl`, `publishedAt`, `retrievedAt`, `authorityClass`, `provenanceFactorClassification`, `evaluatedRange`, `supportedClaims`, `observation`, `limitation`) | `30/30` records complete |
| `retrievedAt=2026-08-25` | `30/30` |
| Source URLs | `30/30` single direct HTTP(S) URL; semicolon chains `0` |
| Entry scope | All records are limited to volumes 1–3 or an explicitly bounded catalog cross-check within that range. |
| Factor/Genre/Theme/Art/safety/eligibility/promotion assignments | None; limitations explicitly leave unverified dimensions unassigned. |

## Official route and provenance check

All 30 URLs use the rights-holder routes recorded by the route registry: Shogakukan/Shogakukan e-comic, Kodansha, Shueisha, and Shonen Gahosha publisher domains. Product pages are labeled `official-publisher-volume` or `official-publisher-digital-volume`; the two Kodansha catalog-list records are labeled `official-publisher-catalog`. All 30 records use `factor-evidence-primary`, which is consistent with direct rights-holder product/catalog descriptions and is not used as selection provenance.

## Work-by-work disposition

`PASS` means structurally valid, frozen-identity matched, route-identity consistent, scope-bounded, and free of downstream assignments. It is not an annotation, eligibility, safety, or promotion approval.

| position | workId | canonicalTitle | result | exact fixes |
| ---: | --- | --- | --- | --- |
| 41 | `work-c50ea94bb66f72c679a2` | 機械仕掛けの愛 | `PASS` | None. Three direct Shogakukan volume routes; representative volume 1 identity and volumes 1–3 scope are explicit. |
| 42 | `work-c7e065f61bb7a176ee56` | 臨死!!江古田ちゃん | `PASS` | None. Kodansha product plus official catalog routes are honestly distinguished; catalog records are bounded to volume 2/3 identity and series cross-checks. |
| 43 | `work-c8243866b7c8a6d9a2f8` | 町でうわさの天狗の子 | `PASS` | None. Three direct Shogakukan e-comic volume routes with volume-specific scope. |
| 44 | `work-db4a0ec451d7f4ffd8b8` | 万福児 | `PASS` | None. Three direct Shueisha rights-holder digital-volume routes with volume-specific scope. |
| 45 | `work-e658d3aee2e33c17aa38` | スピリットサークル | `PASS` | None. Three direct Shonen Gahosha publisher volume routes with volume-specific scope. |
| 46 | `work-e906b3eaa9ef9eafe23c` | トリリオンゲーム | `PASS` | None. Three direct Shogakukan publisher volume routes with volume-specific scope. |
| 47 | `work-f31a42ea4ad724acefa5` | デッドデッドデーモンズデデデデデストラクション | `PASS` | None. Three direct Shogakukan publisher volume routes with volume-specific scope. |
| 48 | `work-f4bfc29a5e0a9b5148d0` | 月に吠えらんねえ | `PASS` | None. Three direct Kodansha publisher volume routes with volume-specific scope. |
| 49 | `work-fb89f119251610cf1648` | 1/11 じゅういちぶんのいち | `PASS` | None. Three direct Shueisha rights-holder digital-volume routes with volume-specific scope. |
| 50 | `work-fe35a5f01946f5153eb4` | シュトヘル | `PASS` | None. Three direct Shogakukan digital-volume routes; JDCN and representative ISBN are kept distinct and volume scope is explicit. |

## Exact fixes

- Required fixes: `none`.
- No research source was edited.
- `reviewedByHuman=false` remains in force; this QA does not assign Factor, Genre, Theme, Art, safety, eligibility, or promotion values.
