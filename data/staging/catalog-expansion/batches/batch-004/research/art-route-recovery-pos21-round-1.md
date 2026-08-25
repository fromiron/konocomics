# Art route recovery — Batch 004 position 21 — round 1

- workId: `work-53fb816835ab36e40a1f`
- canonicalTitle: `アンデッドアンラック`
- creator: `戸塚 慶文`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- purpose: recover an official multi-context Art preflight sample only; no Art value assignment or promotion change

## Result

The previous vol. 1-only official reader route exposed six readable captures from one context and failed the two-context static gate. 集英社 vol. 2 and vol. 3 product pages were then followed to their official reader routes. Both routes were accessible and their reader APIs independently returned the exact ContentID, title, author, and publisher. Six new transient reader frames were retained from readable internal body spreads across two contexts. The static sample gate is now attemptable. Motion remains unopened because the retained pages do not prove one exact bounded start-development-impact-resolved sequence.

## Identity and edition bridge

The frozen representative remains standard print ISBN `9784088823102` (vol. 1). Official product JSON confirmed:

| volume | ISBN                | release      | product URL                                                                 | official reader                                                    |
| -----: | ------------------- | ------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
|      1 | `978-4-08-882310-2` | `2020-04-03` | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882310-2 | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823102 |
|      2 | `978-4-08-882330-0` | `2020-06-04` | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882330-0 | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300 |
|      3 | `978-4-08-882404-8` | `2020-09-04` | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882404-8 | https://www.shueisha.co.jp/books/reader/main.php?cid=9784088824048 |

Vol. 2 API identity: `ContentID=9784088823300`, `Authors=戸塚 慶文`, `Publisher=集英社`, title includes `アンデッドアンラック 2`. Vol. 3 API identity: `ContentID=9784088824048`, same author and publisher, title includes volume 3. The product JSON for both volumes also exposes the corresponding `試し読み` reader URL. This is a direct edition bridge, not a title-only inference.

## Route and sample method

The registered 集英社 route is the product ISBN → official reader `cid` bridge. The reader payloads enumerate 29 vol. 2 pages and 25 vol. 3 pages. Playwright Chromium opened exact `adr` positions and saved transient screenshots under `/tmp/konocomics-batch004-art03-recovery/`; no image was added to the repository. The selected six pages are listed in the recovery preflight and ledger:

- vol. 2: `adr=8`, `12`, `14`, `16`
- vol. 3: `adr=16`, `18`

All selected frames show readable internal body pages. Cover/title/character-profile pages were excluded. The resulting contexts are the vol. 2 barrier battle and aftermath exchange and the vol. 3 outdoor confrontation and battle. The six-frame and two-context thresholds are met.

## Gate disposition

- `staticGateAttemptable=true`
- `motionGateAttemptable=false`
- `stateEligibility=sample-ready`
- no Art axis value assigned
- no terminal Art row, source data, generated artifact, or promotion state edited

The next step is the existing independent Local + Gemini Art review using these exact official references. This file only records route recovery and sample eligibility; it does not turn a sample into a Factor value. `unknown` remains valid for any axis whose reviewer evidence is insufficient.

## Reproducibility

See `../art-preflight/chunk-03/recovery-pos21-preflight.csv` and `../art-preflight/chunk-03/recovery-pos21-ledger.md` for exact URLs, page references, retrieval date, and transient capture hashes. The existing terminal row remains unchanged.
