# konocomics Batch004 position21 independent Gemini Art review

Review only canonical manga `アンデッドアンラック`, workId `work-53fb816835ab36e40a1f`, creator `戸塚 慶文`, official standard volumes 2–3 bridged from standard volume 1.

Open every original image in `images/` at actual pixel detail: exactly six eligible BODY reader frames. Judge `artRealism`, `artDensity`, and `visualSoftness` from all six. `motionImpact` must be `unknown` because preflight did not establish one exact continuous start-development-impact-resolution sequence. Do not use covers, anime, plot memory, genre, or reviews. If actual pixel access is unavailable, abstain.

Use `context/factor-dictionary.md`. Values are integers 0–4; 0/2/4 are anchors and 1/3 only conservative interpolation:

- artRealism 0 deformed/simple, 2 generally stylized, 4 realistic anatomy/background/proportions.
- artDensity 0 simple/whitespace, 2 balanced, 4 high line/background/information density.
- visualSoftness 0 rough/angular, 2 neutral, 4 soft/elegant.

Return exactly: (1) ACCESS table with six rows, dimensions, openedAtOriginalPixels=yes/no, scene; (2) fenced CSV with header `workId,axisId,state,value,confidence,refs,observation,limitation` and exactly four rows in axis order; (3) short conflict/extreme note; (4) literal attestations `model=gemini-3.7-flash-high`, `completionStatus=completed`, `reviewedByHuman=false`, `Grok=ART_ABSTAIN`, `Muse=NOT_USED`, `openedOriginalPixels=6/6` only if true. Do not edit files.
