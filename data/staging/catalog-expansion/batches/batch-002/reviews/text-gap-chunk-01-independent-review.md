# Batch 002 text gap independent Pass B — chunk 01

- `reviewedByHuman=false`
- Reviewer: Local Codex
- Review scope: the 20 `candidate-known` text axes in `research/text-gap-chunk-01.md`
- Allowed inputs: the supplemental research packet, round-01 adjudication, Factor Dictionary, and annotation guide only
- Decision vocabulary: `accept` retains the proposed known value; `modify` retains a known value at a different anchor; `unknown` rejects the known proposal because the entry evidence is insufficient
- Boundary: this review does not change source data, Gold data, Art values, eligibility, recommendation context, safety, identity, or promotion state.

## Frozen inputs

| Input                                    | SHA-256                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `research/text-gap-chunk-01.md`          | `664adc9ea4c325cb0b5841a8c1b47d7d546b48a5661e96f232b4bf9c4e413071` |
| `adjudication/text-chunk-01-round-01.md` | `4441b0502877f175ad5498d4b253675b23145fea7aadd7636ddae64f37240672` |
| `docs/factors/factor-dictionary.md`      | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`       | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |

## Decision ledger

| #   | workId                      | canonicalTitle   | Axis                    | Candidate | Pass B  | Final     |
| --- | --------------------------- | ---------------- | ----------------------- | --------- | ------- | --------- |
| 1   | `work-089947c5303024841fef` | デカワンコ       | `emotionalWarmth`       | 2         | unknown | `unknown` |
| 2   | `work-1012948f5de799831da4` | RED              | `pacing`                | 2         | accept  | 2         |
| 3   | `work-1012948f5de799831da4` | RED              | `characterArcWeight`    | 3         | accept  | 3         |
| 4   | `work-1012948f5de799831da4` | RED              | `mentalStress`          | 3         | accept  | 3         |
| 5   | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | `problemSolving`        | 3         | unknown | `unknown` |
| 6   | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | `pacing`                | 4         | accept  | 4         |
| 7   | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | `worldBuilding`         | 2         | accept  | 2         |
| 8   | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | `characterArcWeight`    | 2         | unknown | `unknown` |
| 9   | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | `relationshipStructure` | 2         | accept  | 2         |
| 10  | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | `darkness`              | 4         | accept  | 4         |
| 11  | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | `mentalStress`          | 3         | modify  | 2         |
| 12  | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | `emotionalWarmth`       | 2         | unknown | `unknown` |
| 13  | `work-19a26f01512166856a6a` | 銀河鉄道999      | `progression`           | 2         | unknown | `unknown` |
| 14  | `work-19a26f01512166856a6a` | 銀河鉄道999      | `emotionalWarmth`       | 2         | unknown | `unknown` |
| 15  | `work-1e27731b880d0d9012f8` | 吉祥天女         | `characterArcWeight`    | 3         | unknown | `unknown` |
| 16  | `work-1e27731b880d0d9012f8` | 吉祥天女         | `relationshipStructure` | 2         | unknown | `unknown` |
| 17  | `work-1e27731b880d0d9012f8` | 吉祥天女         | `darkness`              | 3         | modify  | 2         |
| 18  | `work-1e27731b880d0d9012f8` | 吉祥天女         | `mentalStress`          | 3         | modify  | 2         |
| 19  | `work-1e27731b880d0d9012f8` | 吉祥天女         | `emotionalWarmth`       | 2         | unknown | `unknown` |
| 20  | `work-207bb1ca28b7472fbe1d` | 六三四の剣       | `comedy`                | 2         | accept  | 2         |

Outcome: `accept=8`, `modify=3`, `unknown=9`. No candidate is a known-zero proposal, and this review creates no new known zero.

## Per-work findings

### デカワンコ

- `emotionalWarmth=2` → `unknown`. The official volume-2 and volume-3 descriptions establish emotional or serious police incidents beside comedy, but they do not directly establish recurring care, healing, or warm relationship reward. The user-review packet supplies the warmth claim, yet one review reaches volume 5 and the other review ranges are unspecified. Same-platform accounts cannot repair that entry-range gap: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865527865501315501 ; https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865554865501315501 ; https://www.cmoa.jp/title/customer_review/title_id/54544/
- Dependency finding: this candidate would become known primarily from user reviews after the official entry text establishes only a broader emotional mixture. It is rejected rather than used to make the work pass the Tone coverage gate.

### RED

- Edition bridge: the official new-edition volume 1 expressly covers original volumes 1–2, while the official bibliography and distributor description identify original volume 3 and ISBN `9784063460490`. No later new-edition event is back-mapped into original volume 3: https://www.kodansha.co.jp/comic/products/0000044514 ; https://www.kodansha.co.jp/comic/new-releases/p?page=2159 ; https://www.kinokuniya.co.jp/f/dsg-08-9973091248
- `pacing=2` → accept. The mapped entry moves from massacre and encounter into a revenge journey that continues through original volume 3. This supports an ordinary arc-level change, while neither the bibliography nor the short distributor description supports a faster 3–4 value.
- `characterArcWeight=3` → accept. Loss of the tribe, erased future, sustained hatred, and willingness to continue despite self-destruction directly motivate the entry events. The evidence supports motivation as a strong reward alongside the revenge plot, not an isolated premise or a level-4 character-only structure.
- `mentalStress=3` → accept. The mapped volumes repeatedly connect bereavement, hatred, and self-destructive risk to the protagonist's continuing choice. These are direct subjective pressures rather than a darkness inference. The available text does not support the sustained-collapse anchor at 4.
- Independence finding: the distributor description is not treated as an independent critical review. It is used as content metadata for the exact original volume 3, together with the official edition bridge.

### 邪眼は月輪に飛ぶ

- Range finding: the Work is a single 204-page volume. A complete-volume review is therefore within the entry scope; it is not a later-series spillover. The same-platform user accounts remain secondary and do not become multiple independent source types.
- `problemSolving=3` → `unknown`. The official complete-volume description states the constraint and goal of stopping the lethal gaze, but it does not expose the analysis or resolution method. User reviews repeat the difficulty of defeating the threat, not a concrete analysis-and-solution sequence. A hard problem is not by itself the `problemSolving` axis: https://shogakukan-comic.jp/book?isbn=9784091811974 ; https://www.cmoa.jp/title/62742/
- `pacing=4` → accept. The official complete sequence moves through forest, city, military and intelligence response, vehicle pursuit, and tower confrontation in seven chapters. These are frequent large changes of place and state inside one entry volume: https://shogakukan-comic.jp/book?isbn=9784091811974
- `worldBuilding=2` → accept. The lethal-gaze rule and the military and CIA response functionally constrain the whole conflict. The packet does not justify a higher culture, history, or faction-system value: https://shogakukan-comic.jp/book?isbn=9784091811974 ; https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091811970000d0000000
- `characterArcWeight=2` → `unknown`. The official material establishes a returning elderly hunter and the cast, but not repeated inner change or relationship reward. The claimed heart connection appears only in the user-review packet, so it cannot independently make this axis known.
- `relationshipStructure=2` → accept. The official complete-volume character and event sequence establishes the hunter, daughter, military, and CIA as the fixed core around the threat; exact-volume reader observations corroborate the short buddy structure. Nothing supports a complex ensemble value above 2: https://shogakukan-comic.jp/book?isbn=9784091811974 ; https://www.cmoa.jp/title/62742/
- `darkness=4` → accept. The official opening directly shows mass death and fear, and the official complete-volume sequence keeps an instant-death, humanity-scale threat central through the final confrontation. This is entry-wide official evidence, not an inference from horror or combat: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091811970000d0000000 ; https://shogakukan-comic.jp/book?isbn=9784091811974
- `mentalStress=3` → modify to 2. The official packet directly supports fear, an unidentified lethal threat, protective response, and a despairing soldier, so `unknown` would discard real pressure. It does not, however, show sustained inner collapse or repeated subjective pressure throughout the full resolution. The mixed tension anchor at 2 is supported; the intermediate 3 is not.
- `emotionalWarmth=2` → `unknown`. Trust and heart connection are supplied by the same-platform reader packet. The official summary lists participants and conflict but does not directly describe recurring care or healing, so the review packet remains a lead rather than the basis for a known value.

### 銀河鉄道999

- Edition boundary: the later official electronic volumes may support the chronological content they describe, but they are not evidence for original-edition bibliography. This review makes no identity inference from them: https://shogakukan-comic.jp/book?jdcn=091880010000d0000000 ; https://shogakukan-comic.jp/book?jdcn=091880020000d0000000 ; https://shogakukan-comic.jp/book?jdcn=091880030000d0000000
- `progression=2` → `unknown`. The official entry descriptions establish repeated encounters with different societies and people, but they do not directly state that gradual personal growth is a recurring reward. That conclusion comes from same-platform volume-2 reader reviews. The cross-platform review is a full-work retrospective and cannot supply the missing entry boundary: https://booklive.jp/review/list/title_id/327375/vol_no/001 ; https://booklive.jp/product/index/title_id/327375/vol_no/002 ; https://www.cmoa.jp/title/98509/
- `emotionalWarmth=2` → `unknown`. Kind people, Maetel's kindness, and life-value observations are supplied by the reader packet rather than the official entry descriptions. The BookLive observations share one platform, and the only cross-platform observation is not entry-scoped. Tragedy and companionship in the official summaries do not by themselves establish warmth.
- Dependency finding: both proposed values rely on user reviews for the defining axis observation. Official content alignment is contextual, not direct enough to make either axis known.

### 吉祥天女

- Range boundary: official direct evidence covers six opening pages of volume 1. BookLive observations cover volume 1, while the Comic Cmoa packet covers the complete four-volume Work and cannot separate volume 4 from volumes 1–3. No official volume-2 or volume-3 event sequence is available: https://shogakukan-comic.jp/book?jdcn=091313010000d0000000 ; https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091313010000d0000000 ; https://booklive.jp/review/list/title_id/246501/vol_no/001 ; https://www.cmoa.jp/title/2733/
- `characterArcWeight=3` → `unknown`. The official opening establishes intervention and an initial relationship, and volume-1 reviews add self-defense and conflict. The sustained wound, motive, relationship, and fate claims come from complete-work reviews that include the ending. The packet does not identify a first major episode whose boundary would permit that full-work observation to be narrowed.
- `relationshipStructure=2` → `unknown`. The opening pair and several volume-1 participants do not prove a fixed recurring core through the entry scope. Complete-work relationship observations cannot supply the missing volume-2 and volume-3 recurrence.
- `darkness=3` → modify to 2. Official opening bullying and isolation, corroborated by entry-scoped volume-1 observations of sexual threat, directly establish serious harm within the entry experience. The stronger violence, revenge, and death persistence comes from complete-work reviews, so 3 is not supported. The Dictionary's serious-risk anchor at 2 is.
- `mentalStress=3` → modify to 2. Isolation, humiliation, sexual threat, fear, and self-defense directly establish mixed psychological pressure in the opening and volume 1. Sustained pressure at 3 depends on the unpartitioned four-volume reviews, so the conservative entry-supported value is 2.
- `emotionalWarmth=2` → `unknown`. The official opening contains one protective intervention, but recurring compassion and protection are supplied by the complete-work reviews. One event does not establish mixed warmth across the entry scope.
- Full-work contamination finding: the five candidates must not inherit persistence from the four-volume review packet. Only the directly supported volume-1 seriousness and pressure survive, each at the lower 2 anchor.

### 六三四の剣

- `comedy=2` → accept. The official volume-1 pages contain several distinct comic mishaps and reactions. Two early-volume readers independently describe the same childhood segment as repeatedly comic. The bunko volume has a different extent, but the packet limits its use to the explicitly shared early-childhood content: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091206310000d0000000 ; https://bookmeter.com/books/11059
- Range finding: the whole-work editorial review is not needed for the decision and is not used to extend comedy beyond the shared early range. Its unstable direct URL and full-work scope remain non-determinative.

## Cross-candidate evidence audit

### User-review-dependent known proposals rejected

- デカワンコ `emotionalWarmth=2`
- 邪眼は月輪に飛ぶ `characterArcWeight=2` and `emotionalWarmth=2`
- 銀河鉄道999 `progression=2` and `emotionalWarmth=2`

In each case, official material supplies a setting, event, or cast frame, while user reviews supply the defining warmth, growth, or inner-change observation. Multiple accounts on one retailer platform are not treated as multiple independent source types.

### Full-work review spillover excluded

- デカワンコ: one review reaches volume 5 and the remaining review ranges are unspecified.
- 銀河鉄道999: the Comic Cmoa review is a whole-series retrospective.
- 吉祥天女: the Comic Cmoa packet includes the four-volume ending and cannot isolate volumes 1–3.
- 六三四の剣: the editorial review is a whole-work retrospective and is not needed for the accepted value.

邪眼は月輪に飛ぶ is not in this spillover group because the Work and the entry range are the same single complete volume.

### Known-zero audit

- None of the 20 candidates proposes value 0.
- No absence claim is converted from a missing tag, omitted romance, genre label, or reader silence.
- Existing round-01 zero values are outside this supplemental candidate review and are not reopened or generalized.

## Pass B boundary

- The ledger closes all 20 supplemental candidates as `accept`, `modify`, or `unknown` without using coverage shortage as evidence.
- The resulting values remain model-reviewed drafts. `reviewedByHuman=false` is unchanged.
- Applying these decisions to annotation or source data requires a separate adjudication step.
