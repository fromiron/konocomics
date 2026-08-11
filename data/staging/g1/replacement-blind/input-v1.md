# G1 replacement candidate blind annotation input v1

Read this file and `docs/factors/factor-dictionary.md` only. Official URLs linked below may be opened. Do not read any other repository file, Git history, generated catalog, recommendation output, market/review data, earlier annotation, cohort manifest, replacement pool, or another reviewer's output.

The ten works are listed once in `workId` order. Their eventual slot, removed work, target vector, and selection distance are intentionally absent. Annotate every work before any comparison or selection.

## Scope and procedure

1. Annotate only the entry experience in original volumes 1–3 or the first major episode contained there.
2. Use publisher synopsis and the publisher-owned/authorized first-chapter reader. If a repeated pattern cannot be established from the inspected entry scope, use `unknown`; absence of data is never a low value.
3. Assign Genre and Theme centrality before Axis values. Theme `1` is subordinate or occasional; Theme `2` is a repeated core structure.
4. For each non-Art Axis, compare to `0`, `2`, and `4` first. Use `1` or `3` only when the observed pattern lies clearly between anchors.
5. Do not annotate `artRealism`, `artDensity`, `visualSoftness`, or `motionImpact`. Art was an admission prerequisite and is excluded from replacement matching.
6. Do not infer from popularity, reviews, sales, rankings, adaptation fame, or presumed audience preference.
7. Record the exact official URLs and inspected page range in the notes. Do not copy page images into the repository.

## Candidate evidence

| workId                     | title                     | creators                      | publisher | entry ISBNs (volumes 1–3)                         | official entry source                                | first-chapter reader evidence                                                                            |
| -------------------------- | ------------------------- | ----------------------------- | --------- | ------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `beyond-the-clouds`        | Beyond the Clouds         | Nicke                         | Kodansha  | `9781632369574`; `9781632369581`; `9781632369802` | https://kodansha.us/series/beyond-the-clouds/        | chapter `8fe4ea10-de87-4f81-8ad3-bf1d51f1f7ee`, 38 pages; inspected pages 9, 16–17, 24–25, 30–31         |
| `chis-sweet-adventures`    | Chi's Sweet Adventures    | Konami Kanata; Kinoko Natsume | Kodansha  | `9781945054822`; `9781947194113`; `9781947194649` | https://kodansha.us/book/chis-sweet-adventures/      | chapter `e6ec6a44-e6a0-4990-aeaf-ed2e9a15e237`, 11 pages; inspected pages 6–11                           |
| `fairy-tail`               | FAIRY TAIL                | Hiro Mashima                  | Kodansha  | `9781612622767`; `9781612622774`; `9781612622781` | https://kodansha.us/series/fairy-tail/               | chapter `184d20bb-d49c-4589-952f-1b2dc82ea243`, 90 pages; inspected pages 16–17, 24–25, 32–33            |
| `fire-force`               | Fire Force                | Atsushi Ohkubo                | Kodansha  | `9781632363305`; `9781632363312`; `9781632363787` | https://kodansha.us/series/fire-force/               | volume-1 chapter 0 `17d7e552-f5a3-4f1f-83d3-17bd48aa496e`, 58 pages; inspected pages 16–17, 24–25, 32–33 |
| `lovely-muco`              | Lovely Muco!              | Takayuki Mizushina            | Kodansha  | `9781647292393`; `9781647292409`; `9781647292515` | https://kodansha.us/series/lovely-muco/              | chapter `424197ee-b3b2-4fc0-b7e4-66dbf919936c`, 16 pages; inspected pages 8–15                           |
| `noragami-stray-god`       | Noragami: Stray God       | Adachitoka                    | Kodansha  | `9781612629063`; `9781612629070`; `9781612629087` | https://kodansha.us/series/noragami-stray-god/       | chapter `d3cc16e6-ea58-4dd7-87cc-d4b97454264f`, 74 pages; inspected pages 8–9, 16–17, 24–25              |
| `penguin-and-house`        | Penguin & House           | Akiho Ieda                    | Kodansha  | `9781646513468`; `9781646513475`; `9781646513482` | https://kodansha.us/series/penguin-and-house/        | chapter `3051d494-5e06-41c4-b080-98bb207949f3`, 14 pages; inspected pages 6–7, 10–13                     |
| `sheetas-little-big-world` | Sheeta's Little Big World | Yuki Kamba                    | Kodansha  | `9798888775479`; `9798888775486`; `9798888775493` | https://kodansha.us/series/sheetas-little-big-world/ | chapter `1c5001f1-9a76-461c-ab4e-0bcc69481f0f`, 42 pages; inspected pages 8–9, 16–17, 24–25              |
| `the-seven-deadly-sins`    | The Seven Deadly Sins     | Nakaba Suzuki                 | Kodansha  | `9781612629216`; `9781612629230`; `9781612629254` | https://kodansha.us/series/the-seven-deadly-sins/    | chapter `65428188-c2d1-493d-8e0d-5794849cd107`, 68 pages; inspected pages 8–9, 16–17, 24–25              |
| `tokyo-revengers`          | Tokyo Revengers           | Ken Wakui                     | Kodansha  | `9781642125153`; `9781642125801`; `9781642126174` | https://kodansha.us/series/tokyo-revengers/          | chapter `dfb7c385-0e78-4ffb-9da7-b78ee3e512c6`, 68 pages; inspected pages 16–17, 24–25, 32–33            |

## Required output

Write exactly four files in the output directory assigned by the task:

- `factors.csv`: header `workId,axisId,state,value,confidence,evidenceId`; exactly 10 × 13 rows for `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`; evidence ID `blind-replacement-v1-{workId}`.
- `themes.csv`: header `workId,themeId,centrality,confidence,evidenceId`; canonical Theme IDs only.
- `genres.csv`: header `workId,genres`; semicolon-separated canonical Genre IDs.
- `notes.md`: inspected official URLs/ranges, repeated observable patterns, unknown limitations, and an explicit isolation attestation listing only this input, the factor dictionary, and official URLs.

Sort all outputs by the candidate order above, then by the canonical order in the factor dictionary. Do not compare candidates or recommend a replacement.
