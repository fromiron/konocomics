# Batch 005 Art preflight recovery — position 45

- scope: frozen Batch 005 position 45 only
- workId: `work-e658d3aee2e33c17aa38`
- canonicalTitle: `スピリットサークル`
- creator: `水上悟志`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- promotionPerformed: `false`
- acquisition boundary: exact standard publisher product pages and product-linked BOOK☆WALKER trial entries for volumes 1–3; no generic search hit or unrelated edition was substituted

## Result summary

| entry volume | product-linked route | observed image refs | cover/frontmatter/opening excluded | readable BODY | contexts | gate |
| ---: | --- | --- | --- | ---: | ---: | --- |
| 1 | BOOK☆WALKER CID `d91ce5bd-eb14-46e5-938c-f27e4a0203c2` | `p001`–`p011` | `p001`–`p006` | 5 | 2 school subcontexts | insufficient; remains diagnostic only |
| 2 | BOOK☆WALKER CID `10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df` | `p001`–`p011` | `p001`–`p005` | `p006`–`p011` (6) | 2 | **sample-ready** |
| 3 | BOOK☆WALKER CID `110df35f-cfc9-40cc-98e4-be4ce5ec9584` | `p001`–`p009` observed | `p001` cover | `p002`–`p009` observed | not needed for gate | route corroboration only; no missing pages inferred |

The reader's 12-slot counter is UI configuration, not a license to invent page
bytes. Only actual image requests observed in the bounded run are enumerated.
Volume 2 is sufficient by itself and is the only route bound into the recovery
preflight row.

## exact volume-2 sample

The six selected refs are `reader-v2-p006` through `reader-v2-p011`. They are
readable internal BODY pages and are split across two genuine contexts:

1. `p006`: colour fantasy/travel-memory scene with characters and landscape.
2. `p007`–`p011`: present-day school corridor/classroom character interaction.

The temporary JPEG files are under
`/tmp/konocomics-spirit45-recovery-v2/actual-p-006.jpeg` through
`actual-p-011.jpeg` only. There is no repository image root for this recovery.

## page/hash binding

| ref | public official image path | SHA-256 |
| --- | --- | --- |
| `reader-v2-p006` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-006.xhtml/0.jpeg` | `54ea32927502dd995b0952d77a64e726f3f03441f84e8f2927cb85677bacd9ad` |
| `reader-v2-p007` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-007.xhtml/0.jpeg` | `6e572900e5e33c863c26e2f87b5d574f2b38b41e5c7a7f48c4af0108903b41a4` |
| `reader-v2-p008` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-008.xhtml/0.jpeg` | `65a6e3949dd6e08d4b724497b0673d96f3f1acbcd29a890213eac7752dfe938c` |
| `reader-v2-p009` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-009.xhtml/0.jpeg` | `39dd198ac1d80541b03abd9faa1f01c94a070532b0cad4f913e3f7a6722dcfc4` |
| `reader-v2-p010` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-010.xhtml/0.jpeg` | `0d37650396712882c4147ef87c7334fc4cbd244c09a981b94d33a771fef26dd5` |
| `reader-v2-p011` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-011.xhtml/0.jpeg` | `e2b97fdebf7d8b483136615e770e87470bc437f14153e0b62d85b58811c23ed4` |

Selected-byte set hash (sorted six files):
`17d9246b0ea04ecd2af200225ca0f20de318f906f3006bf644ccacc30bdccead`.

## closure

This recovery changes only the preflight evidence surface by adding a separate
position-scoped row and ledger. It does not alter the frozen preflight row, final
Art data, recommendation data, promotion registry, or canonical source. The
result is `sample-ready` for the existing independent static Art review only;
it is not an Art annotation or promotion decision. Motion remains unopened.

```text
reviewedByHuman=false
retrievedAt=2026-08-25
temporaryImagesCommitted=false
git diff --check -- data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-05/recovery-pos45-preflight.csv data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-05/recovery-pos45-ledger.md  # PASS
```
