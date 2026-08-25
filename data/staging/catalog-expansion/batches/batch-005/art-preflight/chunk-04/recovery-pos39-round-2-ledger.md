# Batch 005 Art preflight recovery ledger — position 39 round 2

- scope: frozen position 39 only
- workId: `work-aa6018249b7fe7e92d95`
- canonical title: `かよちゃんの荷物`
- creator: `雁須磨子`
- publisher: `竹書房`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporary images committed: `false`
- Art or other Factor values assigned: `false`
- promotion performed: `false`
- selected route: BookLive licensed lower reader/manifest
- fallback routes checked: BOOK☆WALKER licensed upper/lower inline trials

## Identity and edition bridge

The frozen source row and Rakuten match use the clean canonical title
`かよちゃんの荷物`, creator `雁須磨子`, publisher `竹書房`, and standard
representative ISBN `9784812465752`. BookLive lower metadata identifies the
same work as `かよちゃんの荷物 新装版 下`, creator `雁須磨子`, publisher
`竹書房`, digital publication `2017-04-27`, and lower-edition ISBN
`9784801959255`. The 2017 upper/lower new edition is retained only as an
explicit same-work bridge; it does not replace the frozen standard ISBN.

The manifest title, author, and publisher attributes independently agree with
the product page. The exact title is stored without `『』` and without the
edition suffix in the canonical identity; the suffix is present only in the
route evidence.

## Manifest enumeration and classification

The BookLive lower manifest returned twelve ordered `P` images. The paired
`L` IDs point to the same twelve image sources for the alternate reading
layout, so they are not double-counted. Independent original-pixel inspection
found that every directly retained image is tile-scrambled. The manifest
classification is:

| IDs | Classification | Reason |
| --- | --- | --- |
| `P0000` | cover | manifest contents explicitly labels `表紙` |
| `P0001` | blank front matter | no readable narrative content |
| `P0002` | title/colour front matter | title/new-edition and colour illustration material |
| `P0003`–`P0005` | illustration gallery | manifest contents explicitly labels `イラストギャラリー` |
| `P0006`–`P0011` | BODY candidates | manifest contents begins `baggage22 かよちゃんと遊ぼう` immediately before `P0006`; direct bytes are tile-scrambled |

The six manifest BODY candidates are not admitted as readable pages because no
decoded browser-rendered capture was preserved. Fragments suggest more than one
scene, but scrambled fragments cannot establish complete page contexts under the
Art policy. The static gate is therefore `0 pages / 0 contexts`. No exact
bounded continuous start-development-impact-resolved motion sequence was
retained; `motionGateAttemptable=false` and `motionImpact` remains unknown.

## BOOK☆WALKER route check

Both exact product pages returned HTTP 200 and exposed signed inline trial
images from the licensed `viewer-epubs-trial.bookwalker.jp` host. Each edition
had 24 DOM image nodes but 12 unique page paths: `p-cover.xhtml` and
`p-001.xhtml` through `p-011.xhtml`. The signed URL inventory is temporary;
only the exact product routes and normalized page-path inventory are recorded
here. These routes confirm a second same-work licensed edition-bound source,
but their pages were not combined with the six-page BookLive sample.

## Gate result

| Gate | Result | Evidence |
| --- | --- | --- |
| canonical identity | pass | BookLive product/manifest title and creator/publisher match frozen work |
| edition mapping | pass | new-edition lower is explicitly bridged to frozen standard work; ISBN unchanged |
| static Art preflight | `unknown-ready` | direct BODY candidates are tile-scrambled; zero decoded readable pages |
| motion Art preflight | not attemptable | no exact bounded sequence retained |
| Art assignment | not performed | independent Local + Gemini quorum still required |
| promotion | not performed | this packet changes no terminal or recommendation state |

This is a terminal Art-unknown preflight result only. Reopening requires six
decoded browser-rendered BODY pages with two contexts and fresh retained hashes.
It does not authorize known Art values, recommendation promotion, source edits,
generated edits, or blocker removal by itself.
