GO

This GO approves FULL_EVIDENCE_ADJUDICATION as the pre-G1 integration policy only. It does not approve the current candidate as final, and G1 remains REVISE until adjudication is integrated and all gates pass.

The supplied bundle and request SHA-256 values match. The 50-work cohort, blind sample, A/B outputs, and conservative reconciliation are frozen; the current candidate builder still does not consume the main 9-work reconciliation. 

blind-retag-integration-panel-r…

1. Integration policy — FULL_EVIDENCE_ADJUDICATION

Choose FULL_EVIDENCE_ADJUDICATION.

The blind result is a valid diagnostic, but it was intentionally produced from a narrower evidence surface: one authorized work URL per sampled title, with no prior annotations or other official entry-volume sources. The original authoring records contain broader official volume 1–3 descriptions, first-chapter readers, and edition mappings. Therefore, a blind unknown proves that the narrow blind input did not support a value; it does not prove that the complete authorized evidence set cannot support it.

The three options resolve as follows:

Reject SPARSE_RETAIN. It would keep 105 disputed current non-Art known rows and 28 additional Theme rows without an explicit disposition. That is not reconciliation; it is silent fallback to the original labels. 

blind-retag-integration-panel-r…

Reject FULL_OVERRIDE as the final data policy. It is honest within the blind run, but treating the narrow input as the final evidence ceiling would immediately create 23 coverage failures and could force unnecessary replacements before the already-recorded full official evidence is adjudicated.

Adopt FULL_EVIDENCE_ADJUDICATION. Reopen the original data only after the blind result is frozen, examine every sampled field against all authorized entry-scope evidence, and produce one complete final disposition. Unsupported fields remain unknown; no values are recovered merely to satisfy coverage.

This matches the repository procedure: blind differences are not averaged, definitions and evidence are rechecked, accepted adjustments are incorporated, and only then is the candidate rebuilt atomically. The policy preserves unknown, fixed thresholds, and the frozen cohort rather than choosing between blind output and prior labels by default. 

blind-retag-integration-panel-r…

2. Art authority — preserve the exact 200-row audit

Yes. The separately audited 200-row Art manifest remains authoritative.

The blind run’s 36 Art rows are unknown because the blind input deliberately did not expose the official internal-page evidence used by the Art audit. That is missing evidence in the blind environment, not contrary evidence.

The bundled checks establish that:

the Art manifest has exactly 200 unique work-axis rows;

all 200 rows match the current candidate’s Art factor state, value, and confidence;

the manifest is bound to official interior-page authority, page/context minima, edition mapping, and motion-sequence rules;

there are zero Art-manifest-to-candidate mismatches.

Therefore:

the full-evidence adjudication artifact must exclude all four Art axes;

the builder must continue deriving or validating Art solely against art-evidence-manifest.csv;

any attempt by the non-Art adjudication artifact to override Art must fail.

This is not SPARSE_RETAIN. It is explicit evidence-source precedence: the Art audit is evidence-complete for that group, while the blind Art output was evidence-starved. 

blind-retag-integration-panel-r…

3. Coverage and current G1 status

Yes. The 23 coverage failures make G1 REVISE and prohibit approving or publishing a final candidate.

Applying the full 9-work blind reconciliation to non-Art data while preserving the audited Art rows produces exactly:

6 works failing Narrative and Tone;

JoJo failing Theme, Narrative, and Tone;

Bocchi and MONSTER failing Genre, Theme, Narrative, and Tone;

for 23 total COVERAGE_BELOW_THRESHOLD errors. 

blind-retag-integration-panel-r…

The current byte-identical candidate can remain as a pre-adjudication staging artifact, but it cannot be designated the final G1 candidate. Its apparent structural success results partly from the fact that the builder does not yet consume the accepted main blind reconciliation. A final candidate must reflect the completed adjudication and then pass with:

no coverage errors;

no structural or evidence errors;

only the expected pre-review UNREVIEWED_ELIGIBILITY errors at the appropriate stage.

Do not lower coverage thresholds, reinterpret unknown, or introduce work-specific exceptions.

4. Smallest durable artifact and builder rule
Durable artifact

Add one narrowly scoped adjudication bundle:

data/staging/g1/blind-retag/adjudicated/
├── manifest.json
├── factors.csv
├── genres.csv
├── themes.csv
└── adjudication.md

Use existing source-compatible formats:

factors.csv: exactly 9 × 13 = 117 non-Art rows, including every unknown;

genres.csv: exactly nine rows, including explicit blank Genre cells;

themes.csv: the complete final Theme sets for the nine works;

adjudication.md: exact field/tag dispositions and supporting official entry-scope URLs, volume/chapter/page ranges, limitations, and edition mappings;

manifest.json: hashes binding the four payload files to:

sample-manifest.json;

the three frozen reconciliation files;

the 200-row Art manifest;

the pre-adjudication works/factors/themes/evidence source hashes;

the exact nine sampled work IDs.

The CSV rows should reuse factorSourceRowSchema, themeSourceRowSchema, canonical enums, and existing evidence IDs where those evidence bundles were revalidated. If new evidence IDs are used, include corresponding source-compatible evidence rows; the existing missing blind-retag-g1-v1-* IDs must never enter the candidate unresolved.

Builder rule

Extend build-g1-candidate.ts with a targeted adjudication stage—no general merge framework:

Verify all manifest hashes before reading adjudicated values.

Require the work IDs to equal the frozen blind sample exactly.

Require an exact sample × 13 non-Art-axis product.

Reject duplicate, missing, extra, or Art-axis rows.

Replace all 13 non-Art factor rows for each sampled work, including unknown.

Replace each sampled work’s entire Genre cell.

Remove the existing Theme work-set for all nine sampled IDs, then append the adjudicated Theme rows. This must also represent an intentionally empty Theme set.

Require every factor and Theme evidenceId to resolve.

Reject any sampled non-Art value or tag that survives only because the adjudication artifact omitted it.

Independently assert that final Art rows still exactly equal the 200-row Art manifest.

Run the complete catalog pipeline and publish only through the existing atomic whole-directory swap.

This directly prevents both sparse fallback and accidental replacement of the Art audit.

5. Retaining existing values or tags

Existing candidate data may be retained only through an explicit field-level evidence disposition.

For each sampled work, adjudication must cover:

all 13 non-Art axes;

the complete Genre set;

every currently present Theme;

every blind-retained Theme;

any newly proposed Theme.

Each field or tag must receive one disposition:

RETAIN_CURRENT
ADOPT_BLIND
REPLACE_WITH_NEW_VALUE
SET_UNKNOWN
KEEP_TAG
REMOVE_TAG
ADD_TAG

Every non-unknown value and retained/added tag must identify exact official entry-scope evidence and explain why it satisfies the dictionary’s frequency, centrality, or 0/2/4 boundary. An existing value cannot be retained merely because the broader source packet contains more material; the relevant material must actually support that field.

For example:

a broader first-three-volume source may restore a value that the narrow blind page could not establish;

a synopsis-only inference cannot be restored merely because it was in the original CSV;

an edition mismatch such as MONSTER remains unresolved unless the edition/entry-scope crosswalk is proved;

absence of evidence remains unknown, never known 0;

confidence is reassessed from evidence, not copied or averaged.

The final data must therefore be a complete evidence adjudication, not “current data plus the eleven blind-retained rows.”

6. Decisive next step and rerun requirement
Next step

Perform the full official-evidence adjudication for all nine sampled works, without opening recommendation outputs or market/review signals. Freeze the resulting adjudication bundle, integrate it through the complete-replacement builder rule above, and run the catalog builder and coverage gate.

Must the cohort or blind sample be rerun first?

No.

Before that adjudication:

the cohort remains the same frozen 50;

the policy and factor dictionary remain unchanged;

the sample was deterministically drawn from that cohort;

the blind outputs and reconciliation were frozen before reopening prior data.

Therefore neither the cohort freeze nor the 9-work blind run should be repeated merely because adjudication now uses the fuller official evidence.

A rerun becomes mandatory only if adjudication causes one of these changes:

a sampled work still cannot meet coverage and is replaced;

the 50-work cohort changes for any other reason;

the factor dictionary or annotation-policy semantics change;

the blind-input-generating policy version changes.

In that case, freeze the revised cohort and rerun the deterministic 15–20% blind sample before attempting G1 again.

Current status: integration policy GO; final candidate and G1 remain REVISE. G2 and UI work remain blocked.
