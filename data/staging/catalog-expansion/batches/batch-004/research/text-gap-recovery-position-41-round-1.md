# Batch 004 text-gap recovery — position 41, round 1

- workId: `work-c7280f9dcc2754d3f864`
- canonicalTitle: `鵺の陰陽師`
- representativeISBN: `9784088836874`
- evaluatedRange: entry volumes 1–3 / first arc material exposed by the official readers
- researchDate: `2026-08-25`
- accessedAt for all URLs below: `2026-08-25`
- current terminal snapshot: `N4/6 · T3/7 · A3/4`; Genre and Theme are present
- current known Tone cells: `characterArcWeight=2`, `relationshipStructure=2`, `comedy=1`
- residual Tone cells: `darkness`, `mentalStress`, `romance`, `emotionalWarmth`
- disposition: two bounded Tone candidates for independent Pass C adjudication; no terminal/source/generated/promotion file was edited
- reviewedByHuman: `false`

## Decision boundary

The Factor Dictionary is applied literally. `darkness=2` requires serious danger or tragedy to be
present, while `darkness=4` requires cruelty, bleakness, or tragedy to be central. `mentalStress=2`
requires a mixture of tension and frustration, while `mentalStress=4` requires sustained anxiety,
pressure, or psychological collapse. The official reader body was inspected before using any review
surface. No title, Genre, Theme, or memory inference is used. User reviews are not needed for these
two candidates and are not used as primary evidence.

## Official source ledger

| sourceId | official URL | publishedAt | accessedAt | bounded observation |
| --- | --- | --- | --- | --- |
| `shueisha-v1-product` | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883687-4 | `2023-10-04` | `2026-08-25` | The publisher frames the opening as Gakuro, who has seen 幻妖 since childhood, being asked by 鵺 to exterminate the school's 幻妖. |
| `shueisha-v1-reader` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088836874 | edition route for ISBN `9784088836874` | `2026-08-25` | Reader current `14–18` exposes the school 幻妖 encounter, a grotesque apparition, Gakuro's fear/reaction, and a reference to the death of his father. Earlier current `8–12` exposes repeated class/social friction and awkwardness. |
| `shueisha-v2-product` | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883788-8 | `2023-12-04` | `2026-08-25` | The publisher describes Dayo's family order, a difficult fight, and the occult club's continued group activity. |
| `shueisha-v2-reader` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088837888 | edition route for ISBN `9784088837888` | `2026-08-25` | Reader current `5–12` exposes Dayo being ordered to capture 鵺, an instruction not to fear death, pursuit/combat, and Gakuro carrying/protecting her while under attack. |
| `shueisha-v3-product` | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883820-5 | `2024-02-02` | `2026-08-25` | The publisher describes Dayo's defeat, her move into school life, her master's attack, 鵺's weapon being broken, and the countermeasure. |
| `shueisha-v3-reader` | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088838205 | edition route for ISBN `9784088838205` | `2026-08-25` | Reader current `5–12` exposes Dayo restrained in chains, family language treating mission failure as grounds for death/expulsion, her fear of being killed if she returns, and the group's school refuge/support. |

## Candidate 1 — `darkness=2`

- value: `2`
- confidence: `0.84`
- directOfficialSources:
  - `shueisha-v1-product` / `shueisha-v1-reader` — URLs, `publishedAt=2023-10-04`, `accessedAt=2026-08-25`
  - `shueisha-v2-product` / `shueisha-v2-reader` — URLs, `publishedAt=2023-12-04`, `accessedAt=2026-08-25`
  - `shueisha-v3-product` / `shueisha-v3-reader` — URLs, `publishedAt=2024-02-02`, `accessedAt=2026-08-25`
- recurringEntryRangeSupport:
  - vol. 1 reader current `14–18`: the first arc repeatedly places Gakuro in front of large, grotesque 幻妖; the body pages show fear/reaction and connect the danger to his father's death.
  - vol. 2 product/reader current `5–12`: family orders explicitly invoke death while the characters are pursued and attacked; the danger is shown as an ongoing conflict rather than a cover-only signal.
  - vol. 3 product/reader current `5–12`: Dayo is chained after failure, the family threat is death/expulsion, and 鵺's weapon is destroyed in the ensuing confrontation.
- dictionaryFit: serious supernatural danger, death-related backstory, coercive family violence, and repeated high-risk confrontations establish the `2` anchor across all three entry volumes.
- ceiling: `4` is not supported. The same bounded material also contains school banter, club leisure, and protective/group scenes; cruelty or bleak tragedy is not shown as the sole or central reward of the entry.

## Candidate 2 — `mentalStress=2`

- value: `2`
- confidence: `0.82`
- directOfficialSources:
  - `shueisha-v1-product` / `shueisha-v1-reader` — URLs, `publishedAt=2023-10-04`, `accessedAt=2026-08-25`
  - `shueisha-v2-product` / `shueisha-v2-reader` — URLs, `publishedAt=2023-12-04`, `accessedAt=2026-08-25`
  - `shueisha-v3-product` / `shueisha-v3-reader` — URLs, `publishedAt=2024-02-02`, `accessedAt=2026-08-25`
- recurringEntryRangeSupport:
  - vol. 1 reader current `8–12` shows Gakuro's repeated social hesitation/awkward response; current `14–18` adds fear and distress when the 幻妖 threat and father-loss memory surface.
  - vol. 2 reader current `5–12` shows Dayo acting under a death-threatening family command, then both characters reacting under pursuit and combat pressure; this is more than a genre label or a single action panel.
  - vol. 3 reader current `5–12` repeats the pressure after Dayo's defeat: restraint, apology, fear of being killed at home, and the need to remain at school. The surrounding club/school support keeps the value mixed rather than extreme.
- dictionaryFit: recurring social pressure, fear, coercive orders, defeat aftermath, and uncertainty about returning home establish the `2` anchor across the bounded entry range.
- ceiling: `4` is not supported. The material shows intermittent but concrete pressure mixed with comedy, ordinary school interaction, and refuge; it does not establish continuous psychological collapse or unbroken anxiety.

## Residual unknowns and no inference

`romance` and `emotionalWarmth` remain `unknown`. Protective actions, school refuge, and club
companionship are not converted into romance or a warmth score in this packet. The accepted
`comedy=1` is not reopened. No Genre, Theme, Narrative, Art, safety, identity, or terminal decision
is changed here.
