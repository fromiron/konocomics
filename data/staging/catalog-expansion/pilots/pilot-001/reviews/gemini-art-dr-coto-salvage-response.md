# Pilot 001 — Dr.コトー診療所 independent Gemini Art review ledger

## 1. Frozen request and provenance

- Repository branch / HEAD: `main` / `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work: `work-b4b21d2ebe5b8efc84ea`
- Canonical title: `Dr.コトー診療所`
- Frozen representative ISBN: `9784091525017`
- Review date: `2026-08-23` (Asia/Tokyo)
- Requested/counted model: `gemini-3.7-flash-high`
- Resolved label: `Gemini 3.7 Flash (High)`
- Effort: `high`
- Route: `agy`
- Scope: official volume 1 opening `KARTE.1`, exact three-file Art packet only
- `reviewedByHuman=false`
- Repository/source/matrix mutation: none

Official mapping URLs:

- 小学館コミック frozen ISBN endpoint: <https://shogakukan-comic.jp/book?isbn=9784091525017>
- 小学館eコミックストア product: <https://e-comi.shogakukan.co.jp/books/091525010000d0000000>
- Official viewer linked by that product: <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091525010000d0000000>

The ISBN endpoint redirects to JDCN `091525010000d0000000` and resolves title `Dr.コトー診療所 公式版 1`, author 山田貴敏, electronic release `2014-02-17`. The product and viewer repeat the same title/JDCN, while the mapping-only excluded opening spread reads `KARTE.1 Dr.コトー、島に着く。`.

## 2. Exact input packet

The Gemini workspace contained copies of exactly these three existing `1280×900` screenshots and no title spread:

| File | Viewer / visible printed refs | SHA-256 |
|---|---|---|
| `pages-8-9.png` | viewer 8–9 / pp.4–5 | `e2b845328ae98993a42d1160841e5bd20c16f0afa1ac1773218b7523caa1b47f` |
| `pages-14-15.png` | viewer 14–15 / pp.10–11 | `169d1a188cdd4b5fe5d5dfc12a879e3ce567ef7f7e4cab81dd64c720ce840c39` |
| `pages-22-23.png` | viewer 22–23 / pp.18–19 | `02cef0e4436b84f1f4d2152f621d926ea06202e2d77a6bac8008442fd90a4acb` |

Packet manifest SHA-256: `5e1cea787344132aa50dbc78a3f8d821043a2410cbc6e44d7beabeab5d530604`, based on GNU `sha256sum` lines in the displayed narrative order.

Input/control artifact hashes:

| Artifact | SHA-256 |
|---|---|
| base independent-review prompt | `3b21f4c1d4730335d1388783f1289c1707850bb2cba0652788222d7d7166a98f` |
| strict JSON schema used only on excluded attempts | `00db9e8107f08862960ad54263f04da1270ff1a48771d0c44d609fa1a77bbe0a` |
| compact-retry note | `112ad4a8851accbac9232c0a741ae94b3200cd1a77cb7581206bd931c6e5981e` |
| plain-response transport note | `b5e35ed3d98df50aee1be6d9e6e5cff5e6dba05ad297718447e7d48244c60a49` |

## 3. Outer execution ledger

Only the third row is counted. The first two rows produced substantively complete pixel text but are wholly excluded because the outer status was not `SUCCESS`; none of their axis values contributes to the comparison below.

| Attempt | Time (JST) | Conversation | Outer status | Duration | Disposition |
|---|---|---|---|---:|---|
| 1 | `03:43:46`–`03:44:48` | `773bd869-14d6-46eb-8301-c00c438ed84d` | `ERROR` | `57.328038003s` | excluded — an intermediate schema submission omitted `resolvedLabel` |
| 2 | `03:45:20`–`03:46:15` | `79dc61fd-e71b-4b56-9f22-bab069489589` | `ERROR` | `49.253357614s` | excluded — an intermediate schema submission omitted required per-axis `state` fields |
| 3 | `03:46:57`–`03:47:43` | `d13ec7dc-2b03-4555-9f46-4dd52b2670d6` | **`SUCCESS`** | `40.38703546s` | **counted** |

Log hashes:

- attempt 1: `7b542bb6e5670cc207c9740d4a79349ca1a40b09a5634937953309f61d8688a3`
- attempt 2: `cdd2114d16929e386ff19f5e712af471da2c871e16c33347b15accee9d347c82`
- counted attempt 3: `b0e9d95d727b0da2692ddc709de6d5bdc5ad9bd5cbf6a65a0e568a118f135942`

Counted-run validity:

| Requirement | Result | Evidence |
|---|---|---|
| Outer status | PASS | `SUCCESS`; exit code `0` |
| Exact identity | PASS | invocation/log resolve `gemini-3.7-flash-high` and propagate `Gemini 3.7 Flash (High)` |
| Effort | PASS | invocation and response both say `high` |
| Completion | PASS | one ordinary final JSON object; `completionStatus=completed`; no schema tool used |
| All-pixel access | PASS | all three exact hashes reproduced and each has a distinct page-specific observation |
| Candidate/work identity | PASS | exact frozen SHA/workId returned |
| Timeout/rate-limit/degraded output | PASS | none reported; `issues=[]` |

Counted-run usage: input `42165`, output `13320`, thinking `8666`, cache-read `52953`, total `55485` tokens; one turn.

## 4. Counted Gemini result

Gemini independently reports:

- Edition mapping: `qualified`. The frozen ISBN publisher endpoint and e-comi product/viewer resolve the same JDCN/title and opening `KARTE.1` content.
- Static gate: `qualified`; 6 readable internal pages across 4 scene contexts.
- Motion gate: no qualifying sequence. The three ranges are disconnected, and no individual spread supplies start, kinematic progression/impact, and endpoint.

| Axis | Gemini state/value | Pixel-grounded basis |
|---|---|---|
| `artRealism` | `known=3` | Lifelike adult/child proportions, hands, faces, wrinkles, stubble, posture, and perspective-accurate boat/harbor/clinic/cave/home settings exceed ordinary stylization, while comic facial cues keep it below `4`. |
| `artDensity` | `known=3` | Crosshatched sea, coast, concrete/foliage, instruments/furnishings, cave textures, and wooden beams repeatedly exceed balanced `2`, but maintain sufficient clarity to remain below `4`. |
| `visualSoftness` | `known=2` | Gemini reads the contours, hatching, and screentones as crisp, disciplined, and neutral rather than dominantly rough `0` or soft `4`. |
| `motionImpact` | `unknown` | No exact continuous physical-action sequence exists in the supplied disjoint packet. |

Gemini vector: **`3 / 3 / 2 / unknown`**.

### Full counted pixel observations

1. `pages-8-9.png`: Dr. Goto suffers severe seasickness on a small fishing boat crossing choppy water, then reaches the island pier and is greeted by village officials against the detailed coast and tetrapods.
2. `pages-14-15.png`: officials escort him to the weathered one-story clinic; inside, nurse 星野彩佳 introduces herself and he checks the sparse equipment.
3. `pages-22-23.png`: Goto speaks with local children in a sea cave; the facing home scene shows Takehiro in acute abdominal pain and vomiting after taking medicine.

## 5. Local–Gemini comparison and required Pass C

| Axis | Local | Counted Gemini | Status |
|---|---:|---:|---|
| `artRealism` | `known=3` | `known=3` | agreement |
| `artDensity` | `known=3` | `known=3` | agreement |
| `visualSoftness` | `known=1` | `known=2` | **conflict — Pass C required** |
| `motionImpact` | `unknown` | `unknown` | agreement |

No vote, average, or final winner is selected here. The unresolved Art vector is **`3 / 3 / (Local 1 vs Gemini 2) / unknown`**. Pass C must compare the same pixels against the `0 rough/angular / 2 neutral / 4 soft/beautiful` anchors, specifically weighing Local's repeated scratch-like texture, heavy blacks, and rough environmental hatching against Gemini's reading of clean character contours and standard neutral screentone.

## 6. Gate and blocker status

- Edition mapping: `qualified`; the earlier `公式版` mismatch objection should be retired for this work.
- Static sample: `qualified`.
- Motion state: explicit `unknown`; this is not a low value and is not by itself a blocker.
- Required Gemini quorum member: valid and counted.
- Art hard blocker: none.
- Art finalization: pending only the explicit `visualSoftness` Pass C conflict.
- Promotion boundary: these reports do not authorize promotion or mutate the matrix.
