# G1 replacement annotation reconciliation

- Policy version: `g1-replacement-v1`
- Blind input SHA-256: `f74d8cf9e11efdf95496f6823191be722ada635b72e026b9fe0797967ef5881d`
- Adjudication input SHA-256: `d51dab1ca865e2afef3a94c955fd07c3bbfb1ecb34ccb3f9b742958fe7918900`
- Reviewers: A and B independently annotated all ten candidates; C independently annotated only the disputed fields. All three used `gemini-3.6-flash-high`, high effort, in separate clean projects.
- Isolation: no removed-work vector, slot mapping, market/review/popularity data, recommendation output, or prior reviewer output was available during A/B annotation or C adjudication. Target comparison started only after the reconciled files below were frozen.

## Input hashes

| Reviewer | File          | SHA-256                                                            |
| -------- | ------------- | ------------------------------------------------------------------ |
| A        | `factors.csv` | `e5398f041b3e1e9d67ab4133b306280dfedcab90190db4aaf6987c835e65e7bd` |
| A        | `genres.csv`  | `968b454e552f8c57fe9e9ea71f7c0b70fb20963f3882aee06635ccd115c85c6c` |
| A        | `themes.csv`  | `24c803cc4e3a4dd32d6ca1ae44a8def3e8200f7a6933360422723927ffa73064` |
| A        | `notes.md`    | `d85b072f71342305a06e4982a49cae33c5c8948aff89fee68e2c51f983297397` |
| B        | `factors.csv` | `04ae302c666a98babf51f4bdc741b26ebf515ca7419621b7865fedc03a6a9bbb` |
| B        | `genres.csv`  | `668bb26536f6b503c745ae2b98958357179e6616682dff5b825274bb617ca2e7` |
| B        | `themes.csv`  | `0b60c0b92aa7eb337f8d59a9ea4aa728b6d7d3c43c737a495e9294f9450e2834` |
| B        | `notes.md`    | `b5ec1dded6a2e8822ae267969f76dc1e9a7f92ae479f148dabdc16fffaa60194` |
| C        | `factors.csv` | `3da66c2d1e585f808d5a628bb50056411ead0fdca1c3b83c01e7e66967bf4fea` |
| C        | `genres.csv`  | `aab69ae9c217a67e7e333e02cb5eae3876989d13260227265e42ace85b94d6f7` |
| C        | `themes.csv`  | `44117525eb934d9f6d750b16e34ee708d22072be6d1519528bed0980be30f6df` |
| C        | `notes.md`    | `a4a3170c5ad0ff8634f81c8ae124435e181191f05a595dbe8739fb2b9489a5a3` |

Reviewer B emitted CRLF CSV. The repository copies normalize only line endings to LF. The raw B hashes were `e9786870d064163a3f4086d9ba087722d99347178baea7970bb749a0593495d4` (factors), `69dc32b7c878069e99af2f929c69f3bd635fc9264d153f923f9693e41c841b72` (genres), and `4215fca88e754cebf523dfeed1826468622a9ca4fd955bf2c6a59eb68c4b1078` (themes); removing CR bytes produces the normalized hashes above.

## Fixed reconciliation rule

1. Axis value: keep an A/B agreement. For an A/B disagreement, take the median of A, B, and blind adjudicator C. This produces a deterministic middle judgment even for the single `1/2/0` case (`the-seven-deadly-sins/strategy` → `1`).
2. Genre: retain each enum tag with at least two of three votes for the two disputed works; retain the exact A/B agreement elsewhere. Emit tags in dictionary order.
3. Theme: retain each tag with at least two of three presence votes. Use the median centrality among reviewers that included it. Emit tags in dictionary order.
4. Confidence: use the minimum confidence among the reviewers considered for that resolved field. This is deliberately conservative and does not affect candidate admission.
5. Evidence ID: use `blind-replacement-v1-reconciled-{workId}`. Art remains excluded from selection distance and is handled by the separate 200-row Art manifest.

No reusable reconciliation helper was added: this is a one-time frozen data decision, and the three committed outputs plus hashes are the reproducibility boundary.

## Output hashes

| File                     | Rows excluding header | SHA-256                                                            |
| ------------------------ | --------------------: | ------------------------------------------------------------------ |
| `reconciled/factors.csv` |                   130 | `2664d6ea7e64ab85e51012b3b6652324ff63b2c0d48131b0911c8575c548adf8` |
| `reconciled/genres.csv`  |                    10 | `0c2546a2d70f05115c3f0285c7650095ba47c7e7aafa708c32df9a672b59fbb1` |
| `reconciled/themes.csv`  |                    31 | `742579f45e6fee74fa001bfe4b847155abb373d6db330bf380bf484ed480e86c` |
