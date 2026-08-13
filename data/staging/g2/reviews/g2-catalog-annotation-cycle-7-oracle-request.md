You are the independent Oracle reviewer for konocomics (fromiron/konocomics).

Issue one formal, hash-bound Oracle panel vote on the attached ZIP evidence bundle. Work independently from the attachment and the normative sources named below. Do not rely on any prior reviewer response, panel report, verdict, summary, conversation, or repository review document.

## Review identity

- Repository: `fromiron/konocomics`
- Review branch: `main`
- Review HEAD: `4743ae84e6c97b4fe06ba646c3915decba11f806`
- Expected attachment: one ZIP whose root directory is exactly `konocomics-oracle-g2-vote/`
- This review concerns the frozen 150-work G2 candidate and its Art evidence. It is not a review of a PDF, a thumbnail-only proxy, or a prior report.

If GitHub tools or connectors are available, you may use them to confirm the live repository, exact branch/HEAD, checks, and current normative files. Live GitHub inspection is secondary corroboration only: it cannot replace extracting the attached ZIP, recomputing its hashes, opening every required image, or checking artifact identity. Do not inspect GitHub review files, PR comments containing reviewer opinions, or historical model verdicts.

## Independence boundary

Do not open, search for, quote, or use any of the following, even if a connector exposes them:

- `docs/planning/reviews/**`
- `data/staging/g2/reviews/**`
- any file named or described as a prior response, validity report, panel report, interim report, Oracle response, Gemini response, Grok response, or Local response
- earlier ChatGPT conversations or summaries about this vote

Use only the attached current bundle, its normative documents, its current candidate data, its manifests, direct image inspection, and optional live GitHub identity/check corroboration.

## Mandatory archive procedure

1. Locate the original attached ZIP bytes and compute their lowercase SHA-256 yourself.
2. Extract the ZIP into a fresh directory with Python or another available archive tool. Reject path traversal, absolute members, symlinks, duplicate member names, case-colliding names, encrypted members, unreadable members, and unexpected content outside the required root.
3. Recursively list the extracted tree before judging it. The required root and sections are:

   - `konocomics-oracle-g2-vote/REQUEST.md`
   - `konocomics-oracle-g2-vote/README.md`
   - `konocomics-oracle-g2-vote/identity/`
   - `konocomics-oracle-g2-vote/normative-docs/`
   - `konocomics-oracle-g2-vote/candidate/source/`
   - `konocomics-oracle-g2-vote/candidate/generated/`
   - `konocomics-oracle-g2-vote/evidence/static/`
   - `konocomics-oracle-g2-vote/evidence/motion/`
   - `konocomics-oracle-g2-vote/manifests/`

   `manifests/` must provide an image index, known-motion mapping, SHA-256 ledger, and audit ledger. Discover their exact filenames from `README.md`; do not guess away a missing file.

4. Recompute every file hash listed in the SHA-256 ledger from extracted bytes and compare it with the ledger. Also check the identity records against the review branch and HEAD above.
5. Independently recompute and explicitly report these four identity-critical candidate hashes:

   - `candidate/generated/catalog-v1.json`: `8695c5646a388f049dc25dcd6af5b5db06437ea82d8755b6b008ea4b97b27abb`
   - `candidate/generated/recommendation-context-v1.json`: `a802af6c04d5d3c81668493ff4af7eec5fba5169dc38578e3013f4a71752c171`
   - `candidate/source/factors.csv`: `4a0e3dc5450ac96250d23e84302ecd5554413f007adb751670ad59c4fb58973f`
   - `candidate/source/evidence/art-evidence-manifest.csv`: `356e1d2eba63bca92340860f06d3f94bd8049ae6000c1d3dd91461d2fee5fc8e`

   The expected generated catalog identity is `catalogVersion = v1-61168a24beea`, with exactly 150 works and 154 volumes. Do not infer a pass from filenames or supplied prose.

## Mandatory direct image review

- Count PNG files recursively. There must be exactly 100 under `evidence/static/` and exactly 6 under `evidence/motion/`.
- Open and visually inspect all 100 static PNGs and all 6 motion PNGs. Inspect each at a readable scale; zoom or crop locally when necessary. A directory listing, image metadata, OCR alone, a montage thumbnail, manifest prose, hash success, or random sampling is not inspection.
- Use the image-index manifest to prove a one-to-one mapping between all 100 static images and their intended candidate works. Track every inspected filename so omissions and duplicates are detectable.
- Use the known-motion manifest to map all 6 motion images to the corresponding works and `motionImpact` records. Inspect the depicted sequence/frames, not just the first frame or filename.
- Cross-check what is visibly supported against `candidate/source/factors.csv`, `candidate/source/evidence/art-evidence-manifest.csv`, the image index, known-motion mapping, and audit ledger.

For Art evidence, enforce the current normative requirements in the attached documents, including: authorized source provenance; readable internal pages or equivalent frames; at least 6 samples across at least 2 contexts; at least 2 supporting references for a known static Art axis; continuous-motion evidence for known `motionImpact`; exact page/timecode and edition relationship where required; and `unknown` rather than `notApplicable` or a numeric value when evidence is insufficient. Passing coverage or a manifest declaration does not substitute for visible support.

## Candidate and contract checks

Use the attached normative documents according to their stated authority order, headed by `02-product-spec.md` and `factor-dictionary.md`. Verify at minimum:

- exactly 150 distinct recommendation-eligible works and 154 volumes;
- exactly 17 factor rows per work, valid 0/2/4/unknown/notApplicable semantics, and no missing or duplicate factor identity;
- role counts satisfy Anchor 30–40, Bridge 30–40, Discovery 70+;
- the original approved 50-work cohort remains present and is not weakened by the added 100 works;
- source, generated catalog, generated context, image index, audit ledger, and Art manifest refer to the same frozen candidate identity;
- no title-specific exception, unsupported certainty, fabricated provenance, evidence reuse mismatch, or unknown/notApplicable bypass materially affects the gate;
- any available exact-HEAD CI/check evidence is associated with the stated HEAD, not a nearby commit.

Every blocking finding must cite the exact archive-relative file path and, where applicable, work ID, factor ID, manifest row, image filename, and visible contradiction. Do not turn a minor cosmetic or immaterial identity difference into a blocker. Conversely, do not waive a material mismatch because other checks pass.

## Vote rules

Vote `GO` only if all of the following are true now, without future conditions:

- the ZIP was actually extracted and the original ZIP SHA-256 was computed;
- the archive structure and complete file-hash ledger passed;
- review branch and full HEAD identity passed;
- all four identity-critical candidate artifacts matched exactly;
- all 100/100 static and 6/6 motion PNGs were directly inspected and mapped;
- the candidate, provenance, annotation, and normative checks passed with no material blocker.

If ZIP extraction is unavailable, the original ZIP bytes cannot be hashed, any required file cannot be opened, fewer than 100 static or 6 motion images are inspected, any required identity/hash mismatches, or the evidence is materially inconclusive, you must vote `REVISE`. Never issue `GO` based on the prompt, README, manifest claims, filenames, GitHub, OCR, sampling, or prior reports alone. A conditional `GO if ...` is invalid; use `REVISE` and name the unmet condition.

This is one Oracle row in the user-authorized model-panel path. A condition-free Oracle `GO` authorizes recording only the Oracle GO row for this exact ZIP hash and candidate identity. It does not by itself open G2 or authorize Slice 5: overall authorization still requires hash-bound condition-free GO from Local, Gemini, Grok, and Oracle on the same frozen bundle, plus the current user's prior approval. Do not fabricate human respondents, human metrics, or an `authorizedModelProxy` row.

## Exact response contract

Begin with exactly one line containing only `GO` or `REVISE`. Then emit every field below exactly once in this order:

```text
Oracle panel row: GO|REVISE
Reviewed repository: fromiron/konocomics
Reviewed branch: main
Reviewed HEAD: 4743ae84e6c97b4fe06ba646c3915decba11f806
ZIP filename: <filename>
ZIP SHA-256: <64 lowercase hex>
Archive integrity: PASS|FAIL
File-hash ledger: <matched>/<total> PASS|FAIL
Candidate artifact identity: <matched>/4 PASS|FAIL
Static image inspection: <opened-and-mapped>/100 PASS|FAIL
Motion image inspection: <opened-and-mapped>/6 PASS|FAIL
Normative candidate checks: PASS|FAIL
Prior-review independence: PASS|FAIL
Panel-row authorization: RECORD_ORACLE_GO_ROW|RECORD_ORACLE_REVISE_ROW
Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_ORACLE_ALONE
```

After those fields, provide these sections:

1. `Inspection ledger summary` — counts and concise coverage by folder/manifest; do not dump 106 repetitive lines unless a discrepancy exists.
2. `Candidate identity and normative checks` — the four computed candidate hashes, catalog identity/counts, role counts, factor cardinality, cohort preservation, provenance/evidence conclusions, and optional exact-HEAD GitHub corroboration.
3. `Blocking findings` — `None.` for GO; for REVISE, a numbered list with exact evidence and the smallest complete correction.
4. `Vote rationale` — why the evidence warrants the vote, explicitly distinguishing direct inspection from manifest/hash corroboration.

Do not add a second verdict, do not claim overall G2 approval, and do not claim human validation.
