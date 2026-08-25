# Batch 004 Art Pass — chunk 05 Local Codex

- reviewDate: `2026-08-25`
- reviewer: Local Codex independent Art Pass
- reviewedByHuman: `false`
- scope: frozen positions 41–50
- output: `local-art.csv` with 40 data rows (`10 works × 4 Art axes`)
- promotion decision: none
- adjudication decision: none
- Muse: `NOT_USED`
- Grok: `ART_ABSTAIN`

## Isolation and decision rule

The numeric Art decisions use only the Factor Dictionary's `artRealism`,
`artDensity`, and `visualSoftness` 0/2/4 anchors, with 1/3 used only between
anchors. Gemini output and every other Art conclusion were excluded from this
pass. The passed preflight supplied identity, edition, eligible refs, and
temporary-file hashes; it did not supply any Art value.

An extreme 0 or 4 was used only when every selected context supported that
anchor. The only extremes are:

- モテキ: `artRealism=4`, `artDensity=4`
- 八雲さんは餌づけがしたい。: `visualSoftness=4`
- ここは今から倫理です。: `artDensity=4`, `visualSoftness=0`
- 極楽街: `artDensity=4`
- アオハライド: `visualSoftness=4`

No genre, synopsis, cover, animation image, user opinion, memory of the work,
or other model's Art result supplied a value.

## Pixel and hash proof

- All 48 selected refs were opened from
  `/tmp/konocomics-batch004-art-chunk05` at original detail and compared with
  their exact preflight refs.
- The 48 expected SHA-256 values are unique and `48/48` match actual temporary
  PNG/JPEG files. The SHA-256 of newline-separated
  `workId,ref=sha256` records in preflight row/ref order is
  `a35f30693bace7f270dd73a99fa743befb5e7c20ae09c42d08357510ab15a5ac`.
- Positions 41–43 and 45–49 each contribute six readable internal body pages
  across at least two materially distinct contexts. No selected ref is a
  cover, frontispiece, title splash, table of contents, advertisement, blank
  asset, viewer shell, or animation image.
- モテキ uses only corrected body refs 09–12 and 18–19. Rejected opening refs
  06–07 are absent from `local-art.csv`.
- Positions 44 and 50 contribute no pixels. Their finite Hakusensha route miss
  yields `U/U/U/U`; it is not a low value or a blocker.
- No sample-ready packet fixes one exact continuous start,
  development/impact, and resolved endpoint sequence. Every
  `motionImpact` row is therefore `unknown`, not 0 and not `notApplicable`.

## Local result

| Pos | Work | artRealism | artDensity | visualSoftness | motionImpact |
| --: | --- | --: | --: | --: | --- |
| 41 | 鵺の陰陽師 | 2 | 3 | 3 | U |
| 42 | モテキ | 4 | 4 | 2 | U |
| 43 | 八雲さんは餌づけがしたい。 | 1 | 1 | 4 | U |
| 44 | 高嶺と花 | U | U | U | U |
| 45 | ここは今から倫理です。 | 3 | 4 | 0 | U |
| 46 | さよなら絵梨 | 3 | 2 | 3 | U |
| 47 | 極楽街 | 3 | 4 | 2 | U |
| 48 | アオハライド | 2 | 1 | 4 | U |
| 49 | 青の祓魔師 | 2 | 3 | 1 | U |
| 50 | LOVE SO LIFE | U | U | U | U |

Each known static row in `local-art.csv` cites all six inspected refs and has a
separate visual observation. Unknown rows have empty value and confidence.
This is a Local proposal only; it assigns no promotion, eligibility, final,
quorum, or adjudicated state.

## Input hashes

| Input | SHA-256 |
| --- | --- |
| `AGENTS.md` | `64abddef3e280a3293bef81f8ef964ce7cb8513a75aea8030f500daf7475ef72` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `data/staging/catalog-expansion/art-source-route-registry.csv` | `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `art-preflight/chunk-05/preflight.csv` | `7b012de84db4bba279b343960183b5f36885575bf31d6949b4c28f156988a81e` |
| `art-preflight/chunk-05/ledger.md` | `23bc330597b4ee010924459b4832f0f9d62b1a8eefec36639b7421a0f37e1a9a` |
| `reviews/daybreak-art-preflight-qa-chunk-05.md` | `db56ae888879969078a3dd59f213a8b3c1edfe8bd178ce9652fecf9069277fe8` |
| `art-review/chunk-05/local-art.csv` | `4cf8bbb5990333681ad7ec86bae0024beb00e857cb19b95b2ec2677b983d7eb4` |
