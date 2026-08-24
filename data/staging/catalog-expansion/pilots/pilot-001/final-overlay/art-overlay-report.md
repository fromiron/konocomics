# Pilot 001 Art overlay compilation

- Authoritative confidence ledger: `data/staging/catalog-expansion/pilots/pilot-001/final-overlay/art-confidence-pass-c.csv`
- Art rows: 200; known 163; unknown/not-applicable 37.
- Combined factors: 850 (50 works x 17 current axes).
- Combined evidence: 250 unique IDs (50 text + 200 Art).
- reviewedByHuman: `false`; model-panel review is not human validation.

## Recompilation contract

Final state/value, source URL, edition, scope, page/time references, context, observation, limitation, evidence ID, and review provenance were preserved from the prior Art overlay. Every known factor, manifest, and Art evidence confidence now exactly equals the authoritative confidence-ledger value. Unknown factor/manifest value and confidence remain blank; their evidence-row confidence remains the pre-existing provenance/closure confidence required by the evidence schema and is not a Factor value.

No source, Gold, frozen Pilot input, documentation, or runtime code was edited. Validation results are added after the isolated source-schema run.

## Validation

- `workSourceRowSchema`: 50/50 valid.
- `themeSourceRowSchema`: 78/78 valid.
- `recommendationContextSourceRowSchema`: 50/50 valid.
- `factorSourceRowSchema`: 850/850 valid, exact manifest work order x current `AXIS_IDS` order.
- `evidenceSourceRowSchema`: 250/250 valid and IDs unique.
- `artEvidenceManifestRowSchema`: 200/200 valid.
- Corrected Art manifest and `/tmp/pilot-001-art-evidence-manifest-final.csv`: byte-identical.
- `validateArtEvidence`: 0 issues.
- Coverage: 50/50 pass. Minimums are genre 1.0, theme 1.0, Narrative 4/6, Tone 5/7, Art 3/4; current thresholds are 0.8/0.6/0.6/0.6/0.3.
- Validation ledger: `/tmp/pilot-001-final-overlay-validation.json`.
