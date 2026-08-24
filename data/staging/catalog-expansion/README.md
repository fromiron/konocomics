# Catalog expansion staging

This directory is the review boundary between external lists and `data/source`.
Nothing here is loaded by the product runtime.

The expansion target is **at least 1,000 canonical works, not a maximum**. A qualifying
work is never dropped merely to keep the final count near 1,000.

## Flow

1. Register a finite source in `source-registry.csv` and preserve either its fetched-file hash or,
   for HTML pages, the canonical extracted-item payload hash.
2. Import every list entry into `raw-source-items.csv` without silently filtering it.
3. Give every raw entry exactly one row in `source-membership.csv` with one of:
   `included`, `duplicate`, `excluded-webtoon`, `excluded-adult`,
   `excluded-non-japanese`, `excluded-non-manga`, or `unresolved`.
4. Record canonical identity decisions in `canonical-mapping.csv` and exclusions in
   `exclusions.csv`.
5. A recommendation-eligible promotion requires `safe` safety review and complete bibliography,
   Factor, Theme, Evidence, Art evidence, and annotation review gates. A conservative
   `libraryOnly` promotion may remain `unreviewed`, but all 17 axes must be explicit `unknown`,
   Themes must make no claims, and onboarding/recommendation eligibility must stay off.
6. `promotion-registry.csv` is generated from the actual source catalog and staging decisions.
   Missing work is `pending`; only an explicit, evidenced row in `promotion-blockers.csv` can make
   a canonical Work `promotionBlocked`.

Blocked sources may leave `originalItemCount` blank when the public body cannot be observed;
`0` must not be used to mean “unknown”.

## Rakuten research cache

`rakuten-search-results.jsonl` is a generated, review-only cache, not product runtime data. It keeps
only title, creator, publisher, ISBN, Rakuten Books genre, release date, and product URL. Searches
are constrained to the general print-comic branch `001001`; Adult, BL, and TL roots are not used by
automatic promotion. The deterministic tranche covers all Kono Manga, Next Manga Awards comics,
Shogakukan Manga Award, bookseller lists, all Manga Taisho finalists, and Manga Taisho first-stage
lists from 2008–2015. Every other acquired row remains explicit `unresolved` rather than being
dropped.

Rakuten does not provide work-origin nationality or original layout format in this response, so
adjudication records both as `unknown` and does not infer them from title, creator, publisher, or a
print edition. A format exclusion is made only for an exact title backed by separate official
evidence that the original is vertical-scroll-first.

`representative-volume-decisions.csv` is the single audited source for the 84 cases where the
default title parser did not select or recognize the first standard volume. Repair, adjudication,
promotion projection, and staging validation all consume this same sorted decision set.

CSV remains the canonical review format. JSONL is used only for the nested provider cache; the
current staging set is small enough that SQLite would add migration and tooling cost without a
measured bottleneck.

Recommendation-list membership, ratings, and popularity ranks are selection provenance, not
Factor evidence. Repeated concrete observations from multiple independent user reviews may be
used only as secondary text-Factor evidence when their URLs, dates, independence, repeated claim,
and reviewed entry scope are recorded. A single reaction, copied review, bare preference, or
unread reaction is never Factor evidence. Conflicts go to adjudication or `unknown`; user-review
text never establishes an Art value and is never copied into product-facing explanations.

## Review-language staging isolation

Bare evaluative phrases such as `예쁜 그림`, `감동적`, or `액션이 좋다` are staging-only audit
signals. They may enqueue or reorder a qualifying official-source reinspection or raise a conflict
warning. They never satisfy coverage, create a blocker, change eligibility, or become a Factor,
Theme, market signal, profile reason, contribution, explanation, promotion overlay, recommendation
context, or generated runtime field. In particular, they must not be mapped directly to
`visualSoftness`, `emotionalWarmth`, `motionImpact`, or any other Axis value.

Gender-coded art labels are not Work traits. They may be retained only as source-scoped audit text
and a hypothesis for rechecking official internal pages. The review phrase itself never changes Art
state, value, or confidence; the normal edition bridge, page/context gate, direct-pixel review, and
`motionImpact` sequence requirement remain mandatory.

This isolation does not alter the existing numeric `reviewAverage`/`reviewCount` market contract or
explicit user-selected profile reasons such as `artStyleDislike`. Review-language signals must not
be converted into either contract. Any eventual Factor annotation must remain independently
supported and reproducible after removing the review-language signal. If a machine-readable signal
registry is introduced later, adding, removing, or reordering only its rows must leave Gold,
promotion, generated catalog/context, coverage, score, contribution, and explanation outputs
byte-identical.

Art preflight starts from `art-source-route-registry.csv`. Reuse a verified publisher product and
preview route before doing title-level web research; only route misses or edition conflicts enter
the exception research queue. A route match still needs the per-work edition bridge and sample
gate, and a failed route closes Art as `unknown` rather than weakening those gates.

`gold-set-manifest.json` freezes the current 150 Work rows and their referenced review
documents while allowing rows for new Work IDs to be appended.

## Deterministic checks

```bash
pnpm catalog:expansion:validate
pnpm catalog:promotion:registry --check
pnpm catalog:expansion:cache-rakuten --check
pnpm catalog:expansion:adjudicate-rakuten --check
pnpm catalog:expansion:promote-library --check
```

The corresponding `--write` commands are one-way research/promotion steps; run them only after the
upstream registry and cache are final. The promotion command validates a temporary source copy,
preserves the Gold manifest, and refuses a final Catalog below 1,000 works.
