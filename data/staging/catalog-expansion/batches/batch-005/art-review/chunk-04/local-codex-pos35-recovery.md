# Batch 005 Art recovery — position 35 — Local Codex

- reviewDate: `2026-08-25`
- reviewer: Local Codex independent original-pixel review
- reviewedByHuman: `false`
- scope: frozen Batch 005 position `35`, `work-8a7846af8ead1797e6a2`, `ハイスコアガール`
- judged axes: static `artRealism`, `artDensity`, `visualSoftness` only
- `motionImpact`: not judged; existing terminal evidence preserved out of scope
- other model Art conclusions consulted: `false`
- promotion performed: `false`
- final-Art/source/generated/promotion data edited: `false`
- image mutation: `false`
- canonical uncompressed image root: `data/staging/catalog-expansion/batches/batch-005/reviews/art-preflight/chunk-04-pos35-recovery/images/`

## Decision rule and isolation

The values use only the current Factor Dictionary `0 / 2 / 4` Art anchors,
with `1 / 3` reserved for a sustained between-anchor result. Only the six
authorized readable BODY JPEGs in the uncompressed recovery packet supplied a
static value. All six were opened individually at original detail. No cover,
anime frame, synopsis, lettering meaning, user review, memory of the work, or
another model's Art conclusion supplied a value. The Daybreak document was
used only for its `PASS — SAMPLE_READY` preflight gate and exact byte mapping,
not for an Art judgment.

## Input and terminal bindings

| Input | SHA-256 |
| --- | --- |
| Factor Dictionary | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| corrected recovery preflight | `976c4a6dc54470b6fdfc56dd23dd16a8161200f9599a0d88a940e915a13db79b` |
| corrected recovery ledger | `967fa34a1babc9f4ae987d386973db4084bb74bebaf7ed918d537e91856d8d51` |
| PASS Daybreak preflight QA | `84c3212b366c6882896b1703d267ad05489273f3bfba112544de8e4ab2eb1156` |
| recovery root identity | `d54f35f6a1038c5c921f895522fe1be6cade3a0ddf23645929655a0bfa82c733` |
| current chunk-04 final-Art terminal | `b93020f3f1bdbc0aad0adbc2efe9cd9254e7ecb8b678dc7bcc519dbfe60fe346` |

The PASS preflight binds the frozen position, work ID, title, creator, standard
volume 1 representative ISBN `9784757535121`, official episode 2 route, six
BODY pages, and two static contexts. The current terminal retains the earlier
static `unknown` rows and `motionImpact=known 4`; this recovery is a separate
Local static proposal and does not edit that terminal.

## Per-image original-pixel access and hash proof

Each file below was opened directly and individually with original-detail
inspection. Each recomputed SHA-256 matches the corrected preflight, recovery
ledger, root identity, and PASS QA mapping. All six are valid baseline RGB
JPEGs at `870 x 1236`.

| Exact ref | SHA-256 | Direct original-pixel observation |
| --- | --- | --- |
| `reader-his02-p002` | `0161e58893499257746ad7bd1cba7e6e07d7591711e3edd406044e176c3c4966` | Girl and boy figures outside a fully drawn storefront; roofs, utility lines, foliage, clothing tone, and sky texture coexist with simplified faces and open ground. |
| `reader-his02-p003` | `a5c3d1c83994934c193101fd0d10d676a462a48d28bda4421b65069349da803f` | Cabinet, joystick, multi-button control panel, hands, two figures, and extreme eye and mouth close-ups fill a tightly segmented page with hard blacks and hatching. |
| `reader-his02-p004` | `6ec72f8e4fcb9c0ab0ffec6b2f0b13176210e71b3b355486e01a61c95155d487` | Fine-eyed girl close-up contrasts with the boy's increasingly distorted faces and compressed seated body; cabinet, wall, roof, and sky fragments retain the street setting. |
| `reader-his02-p005` | `112acb66d9bf6b5f8f9842982ced40fc5f90836127522d98312e8716927f61b5` | Control-panel close-up, simplified extended-leg diagram, multiple grotesque face studies, garment tone, and a standing girl are separated by large graphic blacks and flat fields. |
| `reader-his02-p006` | `44de76624bfaf4c4421794c8d670693d2ec5f8c1a2d4fe21c8861a09d26fbb9f` | Shop shelves, counter equipment, cabinet surfaces, three figures, doorway geometry, and an exterior cut are observed; the elderly face and boy remain strongly caricatured. |
| `reader-his02-p007` | `aee2737299e01a69175e69d013b95f82589aac058cd67f8ace6cca05dbd72de2` | Large girl portrait has rounded modeling, fine eyes, smooth hair highlights, hand, and garment detail; house, foliage, wires, open street, and simplified boys preserve the broader social context. |

## Local static result

| Axis | State | Value | Confidence | Anchor rationale |
| --- | --- | ---: | ---: | --- |
| `artRealism` | known | 1 | 0.92 | Recognizable spaces, objects, clothes, hands, and body staging prevent total simplification, but enlarged eyes, compressed anatomy, diagram figures, and recurring grotesque facial deformation remain stronger than the dictionary's general-stylization value 2. |
| `artDensity` | known | 3 | 0.88 | Store and shop architecture, machines, controls, shelves, clothing textures, foliage, hatching, tones, and dense panel division keep both contexts above balanced; broad white grounds and sparse close-ups prevent value 4. |
| `visualSoftness` | known | 1 | 0.90 | Hard black masses, jagged expressions, scratchy marks, sharp effects, and coarse caricature dominate; rounded girl portraits and fine polished eyes and hair keep the result between rough 0 and neutral 2. |

These are independent per-axis anchor judgments, not page scores and not an
average across pages.

## Motion and mutation boundary

No `motionImpact` row is emitted. The six recovery JPEGs were not used to
rejudge motion, and the earlier `reader-page-010` motion evidence was not
opened or interpreted in this review. Its current terminal `motionImpact=4`
record remains untouched and explicitly out of scope.

The CSV contains exactly three static known rows. No aggregate `final-art`,
terminal, source, generated catalog, promotion registry, or image was edited.
This Local output is only an independent static proposal for the existing
quorum and adjudication workflow.
