# Batch 004 position 3 Art recovery input manifest

- workId: `work-0f3a44f5dcab9623d1be`
- canonicalTitle: `応天の門`
- creator: `灰原薬`
- retrievedAt: `2026-08-25`
- review mode: independent Art review input only
- reviewedByHuman: `false`
- values assigned here: `none`
- source image directory (temporary, not committed): `/tmp/konocomics-batch004-art01-recovery-pos03/`
- source page: https://kuragebunch.com/episode/13933686331620138885
- source owner: official Comic Bunch Kai / SHINCHOSHA

The six retained JPEGs in the temporary directory are the exact files listed in
`../art-preflight/chunk-01/recovery-pos03-preflight.csv` and
`../art-preflight/chunk-01/recovery-pos03-ledger.md`. They are an uncompressed
review input set: each file is the original official CDN response, not a crop,
thumbnail, montage, or transformed derivative. Their URLs, page identifiers,
context grouping, and SHA-256 values are recorded in the ledger. Reviewers must
open the pixels from the temporary directory, retain `unknown` when a factor is
not supported, and keep `motionImpact=unknown` unless an exact bounded sequence
is independently established.

Do not use page 663, which visibly carries the `第一話` title, the title page at
page 662, cover art, the publisher synopsis, or
third-party review text as Art evidence. Do not write Art values to source,
generated, final-art, or promotion files from this input manifest.
