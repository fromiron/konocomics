# Blind replacement annotation adjudication v1

You are Reviewer C. Independently annotate only the disputed non-Art fields listed below. Do not infer or search for any removed work, replacement slot, target vector, market/review/popularity signal, recommendation output, Git history, parent path, or prior reviewer output. You are not choosing a replacement.

Allowed inputs only:

1. `data/staging/g1/replacement-blind/input-v1.md`
2. `docs/factors/factor-dictionary.md`
3. Official URLs named in `input-v1.md` and the official preview readers linked from them

Apply the same entry scope as `input-v1.md`: volumes 1–3 / first major episode preview. Art axes are out of scope.

## Disputed Axis fields

Write exactly one `known` row for each of these 20 `workId,axisId` pairs, in the order shown. Use integer value 0–4, confidence 0–1, and evidenceId `blind-replacement-v1c-{workId}`.

```text
chis-sweet-adventures,pacing
fairy-tail,strategy
fairy-tail,worldBuilding
fairy-tail,relationshipStructure
fire-force,strategy
fire-force,relationshipStructure
fire-force,darkness
lovely-muco,pacing
lovely-muco,relationshipStructure
lovely-muco,comedy
noragami-stray-god,pacing
noragami-stray-god,comedy
penguin-and-house,pacing
penguin-and-house,worldBuilding
penguin-and-house,relationshipStructure
sheetas-little-big-world,comedy
sheetas-little-big-world,emotionalWarmth
the-seven-deadly-sins,strategy
the-seven-deadly-sins,mysteryReveal
the-seven-deadly-sins,relationshipStructure
```

## Disputed Genre fields

Independently write the complete Genre set, ordered by the dictionary enum, for:

```text
sheetas-little-big-world
tokyo-revengers
```

## Disputed Theme fields

Independently write the complete Theme set supported in the entry scope, ordered by the dictionary enum, with centrality 1 or 2 and confidence 0–1, for:

```text
beyond-the-clouds
fairy-tail
fire-force
lovely-muco
noragami-stray-god
sheetas-little-big-world
the-seven-deadly-sins
tokyo-revengers
```

## Required output

Create only these four files under `output/`:

- `factors.csv`: header `workId,axisId,state,value,confidence,evidenceId`, then exactly 20 rows in the listed order.
- `genres.csv`: header `workId,genres`, then exactly 2 rows in workId order; semicolon-separated genres in dictionary enum order.
- `themes.csv`: header `workId,themeId,centrality,confidence,evidenceId`; workId order then dictionary theme order.
- `notes.md`: source/page observations for each disputed work, limitations, and an explicit isolation attestation naming the three allowed input classes and stating that no prior reviewer output or target/slot/market/rank data was accessed.

Do not read or write anything outside this project root. Do not create any other file. Finish only after validating row counts and enum/order constraints.
