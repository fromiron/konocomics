# Pilot 001 — バラ色の明日 Art edition-gate recheck

- Work: `work-440f93a4e60ef906685b` / `バラ色の明日`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Retrieved: 2026-08-23
- Official product: 集英社 `バラ色の明日 2`, paper 2009-07-24, digital 2013-04-09, <https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782230848709315501>
- Official browser viewer: undated, <https://www.shueisha.co.jp/books/reader/main.php?cid=08782230848709315501>
- Edition mapping: the archived 集英社 standard volume 2 (1998-01-23, ISBN `9784088487601`) and the 2009 re-edited volume 2 contain the same chapter 5, `エンジェルベイビー`, in the same four-part order. The mapping proof remains in `text-coverage-followup-b-review.md`.
- Temporary pixels: ignored `output/playwright/pilot-art/barairo-recheck/**`; no image is a commit artifact.

## Gate

The prior `edition-gate-failed` closure is superseded. The official viewer yielded six readable internal pages (`content-p9` through `content-p14`) across at least three contexts: symbolic narration, bedroom interaction, and school hallway/class introduction. Cover, animation, synopsis, and user art opinion were not used.

| Viewer ref | SHA-256 |
|---|---|
| `vol2-p09.png` | `9ce000dc4ca60bd4c0438ce14f652381ff7b4d70525f3842a87970db2992424b` |
| `vol2-p10.png` | `4309595c5b487f9d392c99eb0be0ff0eb62e0b00192d19c74509f7236a508c06` |
| `vol2-p11.png` | `649a421a117b95dfa6ac6a55634125583858ab397792c8117142118b55392188` |
| `vol2-p12.png` | `b23122ad5994807b2f10d5ad293c870c4f29b721e2d02837b4e453db09ecb425` |
| `vol2-p13.png` | `8a637854bf84c4c2c5fce90cc6ec5ecf38f7261cefbda53dd98582438c81311e` |
| `vol2-p14.png` | `547d42141c921595b2d43ae75b25db618bbae90d6d7c36a188dabf3f1d819a4f` |

## Independent quorum

Local Codex opened all six PNGs directly. Gemini ran independently with exact model `gemini-3.7-flash-high`, effort `high`, and direct pixel access. The first Gemini attempt (`8bc5bf6a-bbc1-4d5b-a866-1a35b26b7114`) ended `ERROR` after a sandbox connection reset and is excluded. The second attempt (`71474700-ea62-4434-a61a-48c18037f3ea`) ended `SUCCESS`, reported the exact six hashes, and is authoritative. Muse was not needed; Cursor Grok remains `ART_ABSTAIN`.

| Axis | Local | Gemini SUCCESS | Final | Direct reason |
|---|---:|---:|---:|---|
| `artRealism` | known 3 | known 3 | **known 3** | Naturalistic adolescent proportions, individualized facial anatomy, and credible locker/hallway perspective remain visibly shoujo-stylized, so the sample is above general styling 2 and below fully realistic 4. |
| `artDensity` | known 2 | known 2 | **known 2** | Open white space and readable staging balance selective hair, clothing, screentone, and architectural detail across the contexts. |
| `visualSoftness` | known 3 | known 3 | **known 3** | Fluid curved contours, delicate hair, gentle tone gradients, and decorative motifs are consistently soft without reaching an absolute 4 anchor. |
| `motionImpact` | unknown | unknown | **unknown** | No supplied page range contains an exact contiguous physical action with a verifiable start and endpoint. |

No value conflict required averaging or majority vote. The final Art coverage is 3/4 known and passes the immutable 0.30 Art threshold; `unknown` motion is not a low value.
