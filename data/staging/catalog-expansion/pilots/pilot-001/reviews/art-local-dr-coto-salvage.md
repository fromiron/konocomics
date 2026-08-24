# Pilot 001 — Dr.コトー診療所 Art salvage, Local pass

## 1. Frozen scope

- Repository branch / HEAD: `main` / `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work: `work-b4b21d2ebe5b8efc84ea`
- Canonical title: `Dr.コトー診療所`
- Frozen representative ISBN: `9784091525017`
- Review/retrieval date: `2026-08-23`
- Reviewer: Local Codex, direct original-resolution pixel inspection
- Scope: official volume 1 / opening `KARTE.1` only; Art only
- `reviewedByHuman=false`
- Repository/source/matrix mutation: none

Applied contract: static Art can be known only from an official entry-volume internal preview with at least six readable internal pages and at least two scene contexts. `motionImpact` additionally needs one exact continuous start-to-end physical-action sequence. `unknown` is not a low value and is not itself a blocker.

## 2. Official edition and opening-content mapping

All pages were checked on `2026-08-23`.

| Role | Official source | Date field | URL | Direct result |
|---|---|---|---|---|
| Frozen representative lookup | 小学館コミック | electronic release `2014-02-17` | <https://shogakukan-comic.jp/book?isbn=9784091525017> | The ISBN request redirects to `?jdcn=091525010000d0000000` and resolves the official title `Dr.コトー診療所 公式版 1`, author 山田貴敏, JDCN `091525010000d0000000`. |
| Product / preview parent | 小学館eコミックストア | page undated | <https://e-comi.shogakukan.co.jp/books/091525010000d0000000> | Same title, author, volume, and JDCN. Its `試し読み` link points directly to the viewer below. |
| Official internal viewer | 小学館eコミックストア BinB Speed Reader | page undated | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091525010000d0000000> | Viewer metadata repeats `Dr.コトー診療所 公式版 1` and JDCN `091525010000d0000000`; the captured opening title spread visibly reads `KARTE.1 Dr.コトー、島に着く。`. |

The prior objection that `公式版` conflicts with the frozen ISBN is not supported: the publisher's own frozen-ISBN endpoint redirects to the same JDCN and displays the same `公式版 1` title. The next sampled spread continues the same opening arrival scene, and the later samples remain within that opening preview. Therefore the edition/content mapping is **qualified** for this Art scope.

Read-only source response hashes:

- Shogakukan ISBN redirect target HTML: `6816595e7200d8c59ad3d706b6a86f5fe20ff8476d22178e39a47329f8b3cc74`
- e-comi product HTML: `c0ad153c3fdd049a1613e20e9cc417cd8cfd59f34aab4c4707cc2c3858a64cf7`
- e-comi viewer wrapper HTML: `b608b92f7f96ec664a8980f470074fac01b2974b4d4c336f00f15de3a5c9e4c8`

## 3. Pixel packet and sample gate

The three counted files are exact existing `1280×900` official-viewer screenshots. Each is one readable two-page spread. Viewer pages `6–7` are a title/opening spread and were inspected only to verify `KARTE.1`; they are excluded from all Art values.

| Exact file | Viewer refs / visible printed refs | Context | SHA-256 |
|---|---|---|---|
| `output/playwright/pilot-art/ecomi-alt/dr-coto/pages-8-9.png` | viewer 8–9; visible printed pp.4–5 | sea/boat approach, harbor arrival, island villagers | `e2b845328ae98993a42d1160841e5bd20c16f0afa1ac1773218b7523caa1b47f` |
| `output/playwright/pilot-art/ecomi-alt/dr-coto/pages-14-15.png` | viewer 14–15; visible printed pp.10–11 | clinic exterior/arrival and nurse introduction/reception | `169d1a188cdd4b5fe5d5dfc12a879e3ce567ef7f7e4cab81dd64c720ce840c39` |
| `output/playwright/pilot-art/ecomi-alt/dr-coto/pages-22-23.png` | viewer 22–23; visible printed pp.18–19 | children's cave discussion and Takehiro's nighttime illness at home | `02cef0e4436b84f1f4d2152f621d926ea06202e2d77a6bac8008442fd90a4acb` |

Mapping-only excluded title spread:

- `pages-6-7.png`: `02ac5a3c43bf765736121230f4160b7a72c043a37f115f48dcf1ebcb249a3f17`
- Visible heading: `KARTE.1 Dr.コトー、島に着く。`

Packet manifest SHA-256: `5e1cea787344132aa50dbc78a3f8d821043a2410cbc6e44d7beabeab5d530604`, computed from GNU `sha256sum` lines in the explicit order `pages-8-9.png`, `pages-14-15.png`, `pages-22-23.png`.

Gate result: **qualified**. The packet supplies six distinct, fully readable internal pages and at least three concrete scene groups (maritime/harbor, clinic, children/home illness), exceeding the `>=6` page and `>=2` context requirements.

## 4. Local Art decisions

| Axis | Local state/value | Exact refs | Pixel-grounded decision |
|---|---|---|---|
| `artRealism` | `known=3` | all three spreads | Adult and child bodies use grounded proportions; boat, harbor, coast, clinic architecture, interiors, clothing, and facial structure are observationally rendered. Manga eye shapes, simplified noses/mouths, and heightened comic/sick reactions keep the sample below fully realistic `4`, but its sustained anatomy/environment treatment is more naturalistic than ordinary stylization `2`. |
| `artDensity` | `known=3` | all three spreads | Sea/coast/harbor, boat equipment, clinic walls/roof/rooms, wood interiors, fabric, hair, skin, and atmospheric fields use sustained line texture, hatching, screentone, and environmental information. Speech balloons, open sky/sea, and some isolated face/figure panels prevent consistently high `4`; the packet sits between balanced `2` and high `4`. |
| `visualSoftness` | `known=1` | all three spreads | Crosshatching, scratch-like environmental textures, heavy blacks, firm/angular silhouettes, distressed skin and water rendering, and high-contrast shadow repeatedly lean rougher than neutral `2`. Curved faces, smooth clothing contours, and clean character outlines prevent the dominantly harsh/angular `0` anchor, placing the sustained sample at `1`. |
| `motionImpact` | `unknown` | none qualifies | The frozen spreads are disconnected scene samples. They show boat travel, arrivals, walking/gestures, and illness reactions, but no one spread or adjacent packet contains a verifiable physical-action start, kinematic progression/impact, and endpoint. No value is inferred from genre, urgency, or isolated motion marks. |

Local vector in dictionary order: **`3 / 3 / 1 / unknown`**.

## 5. Closure before independent review

- Edition/content mapping: `qualified`.
- Static sample: `qualified`.
- Local motion state: explicit `unknown`, not `0` and not `notApplicable`.
- Local Art hard blocker: none.
- Required next step: Gemini 3.7 Flash High must inspect the exact same three-file packet. Only outer `SUCCESS`, exact model identity, complete output, all-file access, and page-specific pixel observations count. Any axis conflict goes to Pass C without averaging or voting.
