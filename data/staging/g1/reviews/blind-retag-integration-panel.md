# G1 blind-retag integration policy panel

- Scope: pre-G1 integration policy only; this is not G1, G2, or UI approval.
- Reviewed commit: `6a4bc1a70a661824e2498445f5de6db0becbdb84` on `main`.
- Evidence bundle SHA-256: `d7a31e57bf42e57a07f33fa28d5a7bd1966df57155959132f15143e6e44de08c`.
- Request SHA-256: `849fb28a6e78c6f0988dda9d1be91661c94f95e8c0ba88ee23f80ed567993346`.
- Human review: none. Every evidence row remains `reviewedByHuman=false`.

## Independent decisions

| Reviewer | Exact model/path                                              | Response SHA-256                                                   | Decision                                                           |
| -------- | ------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Oracle   | ChatGPT in-app browser, GPT-5.6 Pro                           | `8a57fe731410e726b5e95035dfe60bb69dfb2a67f76932392390dff701be1c9b` | `GO` for `FULL_EVIDENCE_ADJUDICATION`; current G1 remains `REVISE` |
| Gemini   | `agy --model gemini-3.6-flash-high --effort high`             | `1dc1879777a4f0fc8d3daca5fae9c1d8fb7cd18d11b180b4360ae7ec935ba823` | `REVISE`; choose `FULL_EVIDENCE_ADJUDICATION`                      |
| Grok     | `agent -p --mode ask --model cursor-grok-4.5-high` (non-fast) | `08f99b096875ccd82d3e27b70d8720177f9c3a1625b39bc753f76809cff08dc2` | `REVISE`; choose `FULL_EVIDENCE_ADJUDICATION`                      |

All three independently agree on the operative decision:

1. Treat the frozen blind reconciliation as a diagnostic, not a final full override or sparse overlay.
2. Adjudicate every sampled non-Art factor, Genre cell, and Theme work-set against the complete official entry-scope evidence.
3. Preserve the separately audited exact 200-row Art result as authoritative.
4. Keep G1 `REVISE`; the current 23 coverage failures forbid final-candidate approval.
5. Do not rerun the cohort or blind sample before adjudication. Rerun only if remediation changes the cohort or governing policy.

## Required durable boundary

Use one narrowly scoped `data/staging/g1/blind-retag/adjudicated/` bundle with a hash manifest, exact 117 non-Art factor rows, nine Genre rows including blanks, complete Theme work-sets, and field-level evidence dispositions. The builder must replace those complete sampled work-sets, reject omissions and Art-axis rows, preserve the Art manifest, validate the entire candidate, and publish only through the existing atomic directory swap.
