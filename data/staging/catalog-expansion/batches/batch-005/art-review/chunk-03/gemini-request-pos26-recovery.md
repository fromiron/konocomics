# konocomics Batch005 position26 independent Gemini Art review

You are the independent Gemini member of the konocomics model panel. Review only the exact canonical manga `クジラの子らは砂上に歌う`, workId `work-5b7cf2105a4bc6f6b46c`, standard volume 1, creator `梅田阿比`.

Open every original image in `images/` at actual pixel detail. There are exactly nine images. Static axes use only `page-04.jpg` through `page-09.jpg`. `motionImpact` may use only the continuous `page-15.jpg` through `page-17.jpg` sequence. Do not use cover art, anime images, plot memory, genre, or text reviews. Confirm all nine files were opened; abstain with `unknown` if pixel access is not real or the evidence is insufficient.

Use the repository Factor Dictionary. Scores are integers 0–4; 0, 2, 4 are the defined anchors and 1/3 are permitted only as conservative interpolation:

- `artRealism`: 0 strong deformation/simplification; 2 generally stylized; 4 realistic anatomy/background/proportions.
- `artDensity`: 0 simple/large whitespace; 2 balanced; 4 high line/background/information density.
- `visualSoftness`: 0 rough/angular; 2 neutral; 4 soft/elegant.
- `motionImpact`: 0 static/restrained dynamics; 2 ordinary; 4 strongly emphasized speed/impact/motion. Judge it only if pages15–17 truly form start-development-impact-resolution.

The preflight and independent QA in `context/` establish provenance and sample eligibility, not the values. Judge independently. Do not average with another model and do not modify files.

Return exactly:

1. An `ACCESS` table with one row per image: filename, dimensions if available, openedAtOriginalPixels=yes/no, observed scene.
2. A `VECTOR` CSV fenced block with header `workId,axisId,state,value,confidence,refs,observation,limitation` and exactly four rows in axis order. `state` is `known` or `unknown`; unknown has blank value/confidence.
3. A short conflict/extreme-value note.
4. Literal attestations: `model=gemini-3.7-flash-high`, `completionStatus=completed`, `reviewedByHuman=false`, `Grok=ART_ABSTAIN`, `Muse=NOT_USED`, and the count `openedOriginalPixels=9/9` only if true.
