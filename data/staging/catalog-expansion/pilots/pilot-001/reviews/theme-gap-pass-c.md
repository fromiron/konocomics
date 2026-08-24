# Pilot 001 — non-empty Theme gap Pass C proposal

- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Scope: `ポーの一族`, `Papa told me`, `バラ色の明日`
- Dictionary boundary: Theme centrality `1` means an early bounded episode or subordinate mechanic; it does not claim a repeated whole-series core.
- Status: independently reviewed. Current-SHA Grok accepted `ポーの一族` and recorded `PIXEL_ABSTAIN` for the other two; direct-pixel Local review then accepted all three as `school=1` in `theme-gap-pass-c-review.md`. No majority vote or averaging was used.

## Proposed rows

| workId | Work | Theme | Centrality | Direct official entry evidence |
|---|---|---|---:|---|
| `work-9d5d64262dbc2893acd4` | ポーの一族 | `school` | 1 | 小学館eコミックストア official volume 3 description places the entry-volume episode in a 1959 Swiss boarding school, where transfer, school identity, and exposure risk constrain the plot. |
| `work-ad2b80b81b7bc9b602a3` | Papa told me | `school` | 1 | 集英社 official volume 1 internal pages 12–13 show class/group reassignment and peer interaction directly changing Chise's next action and relationship. |
| `work-440f93a4e60ef906685b` | バラ色の明日 | `school` | 1 | 集英社 official re-edited volume 2 internal pages 11–14 show school-year/class introduction, classmates, shoe lockers, and hallway interaction as the chapter's active setting and relationship mechanism. Standard-to-re-edited volume 2 identity is already resolved. |

## Source ledger

### ポーの一族

- Source: 小学館eコミックストア `ポーの一族 3`, undated; retrieved 2026-08-23.
- URL: <https://e-comi.shogakukan.co.jp/books/091300030000d0000000>
- Scope: standard entry volume 3 only.
- Limitation: `school=1` is restricted to this bounded early boarding-school arc; it is not centrality 2.

### Papa told me

- Source: 集英社 `Papa told me 1` official reader, undated; retrieved 2026-08-23.
- URL: <https://www.shueisha.co.jp/books/reader/main.php?cid=08864013864013315501>
- Edition: standard volume 1, ISBN `9784088640136`; JDCN body `08864013` matches the ISBN body.
- Exact ref: ignored `output/playwright/pilot-art/remaining/papa-told-me/pages-14-15.png`, printed pages 12–13.
- SHA-256: `c8c29050bc698f1e396646011ed1a6b5eb3dca3a8598bcfaacd70667196fdbf0`.
- Limitation: direct father–daughter family is not `foundFamily`; one school episode supports only `school=1`.

### バラ色の明日

- Source: 集英社 `バラ色の明日 2` official reader, undated; retrieved 2026-08-23.
- URL: <https://www.shueisha.co.jp/books/reader/main.php?cid=08782230848709315501>
- Edition: 2009 re-edited volume 2, JDCN `08782230848709315501`; archived standard volume 2 ISBN `9784088487601` contains the same chapter 5 in the same four-part order.
- Exact refs and SHA-256:
  - viewer p11: `649a421a117b95dfa6ac6a55634125583858ab397792c8117142118b55392188`
  - viewer p12: `b23122ad5994807b2f10d5ad293c870c4f29b721e2d02837b4e453db09ecb425`
  - viewer p13: `8a637854bf84c4c2c5fce90cc6ec5ecf38f7261cefbda53dd98582438c81311e`
  - viewer p14: `547d42141c921595b2d43ae75b25db618bbae90d6d7c36a188dabf3f1d819a4f`
- Limitation: the canonical work is an anthology, so the bounded school chapter supports only centrality 1. Anthology structure itself is not a Theme.

## Rejected shortcuts

- No Theme is inferred from Genre.
- `foundFamily` is rejected for `Papa told me` because the relationship is a biological father and daughter.
- `historicalReconstruction` is not attached to `ポーの一族` merely because its chronology spans historical periods.
- `workplace` is not attached to `バラ色の明日` from a job title in one synopsis.
- The non-empty validator requirement did not change; these rows are proposed only because direct official entry evidence matches the existing `school` tag and centrality-1 definition.
