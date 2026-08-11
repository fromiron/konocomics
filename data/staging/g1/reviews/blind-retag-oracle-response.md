# G1 blind-retag Oracle review

- Model: GPT-5.6 Pro
- Chat: https://chatgpt.com/c/6a7a6f34-c3f8-83e8-af26-c6d7476f0f01
- Reviewed: 2026-08-11 (Asia/Tokyo)
- Request SHA-256: c6889d29236b2c23947320bc0dc6f6df894e515136af51a0a04f6fb0a1a99fc1

## Response

1. Protocol/validator as a producer-and-boundary system — REVISE

The deterministic sampling and structural binding are otherwise sound: the producer selects 9 of 50 from frozen hashes, exposes no prior factors, roles, market data, or recommendation output, and regenerates byte-checked input.md plus its manifest. The validator enforces the exact four-file set, current input hash, 153-factor product and ordering, evidence IDs, canonical Genre/Theme order, exact per-work URLs, positive isolation attestation, required rationales, and rejection of additional URLs.

konocomics-origin-main-to-head +1

Two boundary defects remain.

P1. The authorized-page rule does not exclude user-generated or third-party text

The generated input currently says that a fact directly exposed by an authorized URL is in scope.

konocomics-origin-main-to-head

 The authorized Dungeon Meshi page directly exposes a section explicitly labeled as personal user reviews, followed by Bookmeter-supplied comments. Gemini consequently treated those comments as publisher evidence while remaining within a literal reading of the URL rule.
KADOKAWAオフィシャルサイト

Smallest exact correction: immediately after the existing authorized-URL sentence in scripts/build-g1-blind-retag.ts, add:

Only publisher-authored bibliographic, synopsis, table-of-contents, and editorial text on an authorized page is evidence. User reviews, ratings, comments, retailer or recommendation widgets, and other third-party text remain out of scope even when rendered on that exact URL.

Add one assertion for this sentence to tests/unit/catalog/build-g1-blind-retag.test.ts.

P2. notes.md is not actually constrained to the promised exact shape

readWorkSections() verifies the nine work headings, while requireMarkers() filters and validates required Axis, Genre, and Theme lines. It does not reject other nonempty lines within a work section. Consequently, plain-text prior labels, comparisons, rankings, or recommendations could be added while the validator still passes, provided they introduce no unauthorized URL.

konocomics-origin-main-to-head +1

Smallest exact correction: after parsing each section, reject every nonempty line that is not exactly one of:

the work heading;

the single authorized-URL line;

an expected Axis line;

the expected Genre lines or the single Genre-unknown sentinel;

the expected Theme lines or the single Theme-unknown sentinel.

Also require the preamble to consist only of the exact input-hash line, attestation line, and separator blank line. Add a regression that inserts - Recommendation: hidden candidate and expects rejection.

Because P1 changes input.md, its SHA-256 changes. Both model outputs must therefore be regenerated; the existing validator intentionally rejects outputs bound to a stale input hash.

konocomics-origin-main-to-head

2. Conservative reconciled sample — GO

The reconciliation policy is contract-preserving after applying the exact corrections in §3:

all 61 state disagreements become unknown;

all 14 value disagreements become unknown;

all one-model-only Genre and Theme entries are omitted;

ordinal values are never averaged;

confidence is never averaged;

for a retained, directly supported identical value, use min(gemini, grok);

an identical judgment unsupported by the authorized entry-scope evidence is still discarded.

That is consistent with the requested conservative rule and with the repository distinction between lack of evidence and an observed low value.

konocomics-blind-oracle-request

This is a GO for the semantic reconciliation policy and corrected target rows, not approval to integrate the current output bytes. The corrected input must first be regenerated and both isolated outputs rerun.

3. Smallest exact semantic correction list
berserk

Change relationshipStructure from known,0,... to:

csv
berserk,relationshipStructure,unknown,,,blind-retag-g1-v1-berserk

The authorized blurb presents Guts as a sword-bearing protagonist followed by blood and corpses. It does not establish that the entry experience repeatedly operates as a solo-protagonist relationship structure. darkness=4, Genre action;horror, and Theme combat=2 remain directly supported.
白泉社

dr-stone

Change problemSolving from known,4,... to:

csv
dr-stone,problemSolving,unknown,,,blind-retag-g1-v1-dr-stone

The authorized synopsis establishes global petrification, Taiju and Senku, rebuilding civilization from zero, and an SF survival adventure. It does not directly expose the repeated constraint-analysis and ingenious-solution process required for problemSolving=4.
集英社　―　SHUEISHA　―

The shared mysteryReveal=2, relationshipStructure=2, darkness=2, Genre scienceFiction, and common adventure/survival/crafting/postApocalypse Themes may remain, using the lower confidence where the models differ.

20th-century-boys

Change these three rows to unknown with blank value and confidence:

csv
20th-century-boys,worldBuilding,unknown,,,blind-retag-g1-v1-20th-century-boys
20th-century-boys,characterArcWeight,unknown,,,blind-retag-g1-v1-20th-century-boys
20th-century-boys,mentalStress,unknown,,,blind-retag-g1-v1-20th-century-boys

The authorized page supplies a chapter list and summaries for the first two chapters: a missing household, police inquiry, strange mark, and childhood-friend oath. That supports relationshipStructure=2, darkness=2, Genre mystery, and Theme investigation=2; it does not establish repeated world-rule construction, character change as the central reward, or sustained psychological pressure.
小学館コミック

The Grok-only school Theme is already removed by the generic one-model-only rule.

kingdom

Change characterArcWeight from known,2,... to:

csv
kingdom,characterArcWeight,unknown,,,blind-retag-g1-v1-kingdom

The authorized synopsis establishes the BCE Chinese war era and Shin’s goal of making his name through his own ability. It does not expose repeated character change or character drama as a balanced/core reward.
集英社コミック公式 S-MANGA

progression is already a value disagreement and therefore becomes unknown. The common Genres action;historical and common combat/war/historicalReconstruction Themes remain defensible.

monster

Replace the entire semantic annotation with:

all 13 non-Art Axis rows: unknown, blank value, blank confidence;

all four Art rows: remain unknown;

Genre cell: blank;

Theme rows: none.

Therefore remove the common mystery Genre and the common investigation and workplace Theme rows as well as every common known Axis.

The authorized page is explicitly MONSTER 完全版 1, ISBN 9784091817907, while the blind input’s representative ISBN is 9784091836519. The input expressly prohibits assuming that these editions share pagination or entry scope without a verified mapping.

konocomics-origin-main-to-head

 The page provides complete-edition chapter and synopsis material, but it does not establish the required crosswalk to the representative entry edition.
小学館コミック

The Grok-only revenge Theme is independently removed by the one-model-only rule.

blue-lock

Change these six shared rows to unknown with blank value and confidence:

csv
blue-lock,progression,unknown,,,blind-retag-g1-v1-blue-lock
blue-lock,problemSolving,unknown,,,blind-retag-g1-v1-blue-lock
blue-lock,mysteryReveal,unknown,,,blind-retag-g1-v1-blue-lock
blue-lock,relationshipStructure,unknown,,,blind-retag-g1-v1-blue-lock
blue-lock,darkness,unknown,,,blind-retag-g1-v1-blue-lock
blue-lock,romance,unknown,,,blind-retag-g1-v1-blue-lock

Delete these two common Theme rows:

tournament
school

The exposed premise supports a functional Blue Lock facility/rule system, soccer classification, and soccer competition. It does not directly establish a repeated growth-reward loop, analytical problem-solving cadence, known absence of mystery or romance, a fixed-party relationship structure, or recurring darkness. High-school age alone does not make school a Theme, and a selection premise alone does not establish the dictionary’s repeated tournament structure. The supplied independent audit likewise identifies these Blue Lock overstatements.

konocomics-blind-oracle-request

Retain only:

worldBuilding=known 2, confidence 0.6;

Genre sports;

Theme sportsCompetition, centrality 2, confidence 0.9;

four Art axes unknown.

No additional equal-row corrections

jojo-bizarre-adventure: the three common non-Art values are directly supported.

dungeon-meshi: there are no common known Axis rows; the common fantasy Genre and dungeon/cooking Themes do not require the user-review text.

bocchi-the-rock: 17 Axis rows unknown, blank Genre, and zero Themes are safe.

All 36 Art rows remain unknown, as required.

konocomics-blind-oracle-request

4. MONSTER edition-scope decision

Yes. MONSTER must remain entirely unknown and untagged until the edition scope is mapped.

A valid mapping must demonstrate that the complete-edition material exposed by ISBN 9784091817907 corresponds to the representative edition’s entry range for ISBN 9784091836519. Matching title, chapter numbering, or general knowledge of the series is insufficient under the frozen rule. Until that crosswalk exists, retain only bibliographic identity and evidence limitations—no Axis value, Genre, or Theme.

5. Decisive next step

Harden the generated blind input and close the notes.md grammar, regenerate the same frozen 9-work input/manifest, rerun Gemini and Grok from isolation, then create one reconciled output using the conservative rule plus §3 and pass it through the structural validator.

This remains a pre-G1 adjudication checkpoint only; it does not approve G1, G2, or UI work.
