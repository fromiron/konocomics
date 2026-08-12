# konocomics G2 aggregate

## Identity

- Result format: `konocomics-g2-result`
- Contract version: `g2-v1`
- Catalog version: `report-catalog-v1`
- Factor dictionary version: `v1`
- Baseline version: `v1`

## Accepted results

- Human: 0
- Synthetic pilot: 1
- Verdict: **INCOMPLETE**

## Five GO criteria

Criterion | Status | Evidence
--- | --- | ---
Taste or tie | NOT_RUN | 0/0; requires exactly 10 humans and >=7
Unknown Want-to-Read | NOT_RUN | Taste 0/0 (null); Baseline 0/0 (null); Taste must be greater
Taste Explanation Agreement | NOT_RUN | Taste 0/0 (null); requires >=0.7
Disliked Leakage@10 | NOT_RUN | Taste 0/0 (null); Baseline 0/0 (null); Taste must be <=
Holdout Recall@10 | NOT_RUN | Taste 0/0 (null); Baseline 0/0 (null); Taste must be >=

## Aggregate counts and rates

- Preference: Taste 0, Baseline 0, tie 0, Taste-or-tie 0

Engine | Metric | Numerator/denominator (rate)
--- | --- | ---
Taste | Unknown Want-to-Read | 0/0 (null)
Taste | Explanation Agreement | 0/0 (null)
Taste | Disliked Leakage@10 | 0/0 (null)
Taste | Holdout Recall@10 | 0/0 (null)
Baseline | Unknown Want-to-Read | 0/0 (null)
Baseline | Explanation Agreement | 0/0 (null)
Baseline | Disliked Leakage@10 | 0/0 (null)
Baseline | Holdout Recall@10 | 0/0 (null)

## Participant rows

Participant | Respondent | Preference | Taste unknown WTR | Baseline unknown WTR | Taste agreement | Baseline agreement | Taste leakage | Baseline leakage | Taste recall | Baseline recall
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
pilot-one | syntheticPilot:manual-round-trip | baseline | 1/1 (1) | 0/0 (null) | 1/1 (1) | 0/1 (0) | 0/1 (0) | 0/1 (0) | 0/1 (0) | 0/1 (0)

## Diagnostics

Engine | Explanation Lift sum/coverage (average) | Explanation availability/occurrences
--- | --- | ---
Taste | 0/0 (null) | 0/0
Baseline | 0/0 (null) | 0/0
