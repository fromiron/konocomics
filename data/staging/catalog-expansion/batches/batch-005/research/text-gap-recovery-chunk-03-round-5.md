# Batch 005 text-gap recovery — chunk 03, round 5

## Scope and binding

- 조회일 / `retrievedAt`: `2026-08-25`
- 대상: `batch-005/frozen-work-set.csv` positions `21`, `23`, `24`, `27`, `29`
- 평가 범위: `entry_1_3_volumes` (초반 1–3권, 공식 reader의 실제 본문 장면 포함)
- `reviewedByHuman=false`
- repository HEAD at research start: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- current terminal text SHA-256: `dcb6a9accea0933e3cbfd8fb79c4670156f39b32f5099a70b0601b6351cd3f29`
- current terminal Genre SHA-256: `ed6869c24e1d55a2f651ebfd1ee0191c0d2e54156c997eb09be936e877b044f6`
- current terminal Theme SHA-256: `8565742fbe22b73f265857248834573c57c6a312941173eb377b62ab67d7f5d8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- prior round-4 exhaustion SHA-256: `9f6199ac3da221451fc698120da80d289ba89b71e34efbe0828823ee3d2231c9`

This is a research-only packet. It does not modify terminal text, Genre or
Theme CSV, Pass A/B/C, source/provenance, Art, safety, identity, promotion,
registry, generated catalog, eligibility, Gold data, or recommendation code.
Existing accepted and rejected cells are not reopened. Any proposal below is
for independent adjudication only and is not a materialized annotation.

## Reader method and evidence boundary

The official Shogakukan e-comi and Kodansha trial readers were opened in a
browser using the exact edition routes below. The BinB/SpeedBinb session's raw
TTX contains page image references (`t-img`) but no OCR/text layer;
`content.page[].image.texts` was empty. Therefore the packet records only
short, visibly readable speech/signs and scene events from the rendered pages,
plus official product metadata. It does not manufacture OCR or infer Art.

The following dictionary anchors controlled all decisions:

- `progression=2` requires repeated slow growth with meaningful improvement;
  a single decision, training mention, or changed relationship is not enough.
- `problemSolving=2` requires a mixed wits/direct-action problem-solving
  pattern; a rescue, fight, or one-off decision is not enough.
- `strategy=2` requires tactics or short plans, not political exposition or
  a character merely holding status.
- `mysteryReveal=2` requires recurring secrets/reversals; a family backstory
  or one clue is not enough.
- `school=1` means school is a recurring sub-material in the bounded entry,
  while `sportsCompetition` requires actual competition rather than exercise.
- `mentalStress=2` requires mixed, repeated pressure and is not inferred from
  one exam, threat, or sad scene.

## Exact official reader route manifest

All routes were retrieved on `2026-08-25`; dates below are the paper-volume
publication dates preserved by the existing source packet.

| Pos | Work | Vol.1 official reader | Vol.2 official reader | Vol.3 official reader | Published dates (1/2/3) |
| --: | --- | --- | --- | --- | --- |
| 21 | 娚の一生 | [Shogakukan e-comi reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091322690000d0000000) | [Shogakukan e-comi reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091326380000d0000000) | [Shogakukan e-comi reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091330270000d0000000) | `2009-03-10` / `2009-10-09` / `2010-03-10` |
| 23 | 千年万年りんごの子 | [Kodansha trial](https://www.kodansha.co.jp/comic/products/0000046459/trial/reader?cid=16004bb7861da5596a0684a912a8f99c1021434d87c50d73d1a592067049f05b) | [Kodansha trial](https://www.kodansha.co.jp/comic/products/0000046505/trial/reader?cid=56e678f2df9766f824a09fefe2b0189812567a041d226b356cf468599dd20cec) | [Kodansha trial](https://www.kodansha.co.jp/comic/products/0000046557/trial/reader?cid=7390232d899457a0c036dcbc21a9eae13ffe71a7525b54eb32923c2b16340c2a) | `2012-07-06` / `2013-05-07` / `2014-03-07` |
| 24 | 百舌谷さん逆上する | [Kodansha trial](https://www.kodansha.co.jp/comic/products/0000029330/trial/reader?cid=034a122d6baedf99186dba7826e6b6620e120a3e356d1f9881a05bb535e684a0) | [Kodansha trial](https://www.kodansha.co.jp/comic/products/0000029364/trial/reader?cid=4f7cc731a19be4fad8a4506afcd10101b9b84989760e5504d383b1e9a5427eba) | [Kodansha trial](https://www.kodansha.co.jp/comic/products/0000029395/trial/reader?cid=ef4ca932ddadaa2c069c4ac2d1b0b0a1d6da6143db79a5edae9f498e892d7be6) | `2008-06-23` / `2009-01-23` / `2009-07-23` |
| 27 | 女王の花 | [Shogakukan reader](https://shogakukan-comic.jp/viewer-open?jdcn=091320090000d0000000&u1=https%3A%2F%2Fshogakukan-comic.jp%2Fbook%3Fjdcn%3D091320090000d0000000) | [Shogakukan speed reader](https://shogakukan-comic.jp/reader/speed.php?cid=091333830000d0000000_582&u0=1&u1=https%3A%2F%2Fshogakukan-comic.jp%2Fbook%3Fjdcn%3D091320090000d0000000) | [Shogakukan speed reader](https://shogakukan-comic.jp/reader/speed.php?cid=091336540000d0000000_582&u0=1&u1=https%3A%2F%2Fshogakukan-comic.jp%2Fbook%3Fjdcn%3D091336540000d0000000) | `2008-08-26` / `2010-07-26` / `2011-01-26` |
| 29 | 鉄楽レトラ | [Shogakukan e-comi reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091234450000d0000000) | [Shogakukan e-comi reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091236160000d0000000) | [Shogakukan e-comi reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091240770000d0000000) | `2011-10-12` / `2012-04-12` / `2012-11-12` |

## Position-by-position text review

### 21 — 娚の一生

Sampled official reader page indexes `6`, `18`, and `22` in vol.1, index `8`
in vol.2, and index `8` in vol.3. The visible scenes are adult cohabitation,
food preparation, and relationship conversations. Vol.2 metadata describes
the already-known cohabitation and marriage disagreement; vol.3 reader pages
again show household conversation and cooking. No page gives a bounded clue
chain, tactical plan, repeated growth/reward loop, or a listed Theme.

**Result:** no proposal. `Theme` remains unknown; `progression`,
`problemSolving`, `strategy`, `mysteryReveal`, and `worldBuilding` remain
unknown where not already terminally known. Research confidence for the
negative result: `0.86`. The accepted romance/relationship/emotional cells and
the previously rejected cells are unchanged.

### 23 — 千年万年りんごの子

Sampled vol.1 indexes `16` and `20`, vol.2 index `8`, and vol.3 indexes `6`
and `8`. Vol.1 visibly presents the village ceremony and family setting. In
vol.2 the characters discuss the village god, the date-bound rite, and an old
record; vol.3 shows the husband caring for the ill wife and the continuing
family/ritual conflict. The official volume descriptions also identify the
60-year ritual condition, the village crisis, and a historical festival
record.

These pages are direct evidence for the already-known world/relationship/
mystery boundary. Ritual and folk belief are not one of the 22 legal Themes.
Finding an old record and deciding to protect a spouse is one information and
decision sequence, not repeated `problemSolving=2` (mixed wits/direct action),
and no short-plan or long-plan loop is visible. The evidence does not justify
`historicalReconstruction`, `politics`, `exploration`, or `survival` by label
leakage.

**Result:** no proposal. `Theme` remains unknown and no new Narrative cell is
assigned. Research confidence for the negative result: `0.84`. Existing
`mysteryReveal`, `worldBuilding`, romance, darkness, and relationship values
remain unchanged.

### 24 — 百舌谷さん逆上する

Sampled vol.1 indexes `10`, `14`, and `18`, vol.2 indexes `4` and `6`, and
vol.3 index `5`. Vol.2 contains the birthday episode and a dense interpersonal
reaction sequence; vol.3 shows a character caring for an injured/sick person,
domestic conversation, and gift/relationship reaction. These are the same
interpersonal comedy mechanism already represented by the accepted Genre and
Theme/Tone cells. They do not form a repeatable constraint-solving or tactical
planning process.

**Result:** no proposal. The accepted `comedy` decision is not reopened, and
the residual Narrative cells stay unknown. Research confidence for the
negative result: `0.88`. No Art value was inferred from any page.

### 27 — 女王の花

Sampled vol.2 reader indexes `24` and `32`, and vol.3 index `26` in addition to
the previously bound vol.1 route. Vol.2 shows a merchant/protagonist exchange,
an action threat, and a discussion of social value and role. Vol.3 shows an
immediate weapon threat and a protector/queen dialogue. These are direct
action, political status, and relationship exposition, not a recurring plan
under resource/constraint trade-offs. The official vol.2/3 descriptions likewise
describe hostage status, the merchant, and protection, without an entry-bounded
planning loop.

**Result:** no proposal. The prior rejection of `progression=2` is not reopened;
the sampled threat/action is not `problemSolving=2` or `strategy=2`. Research
confidence for the negative result: `0.83`. Existing historical/political and
relationship values remain unchanged.

### 29 — 鉄楽レトラ

Sampled vol.1 reader indexes `28` and `40`, vol.2 index `8`, and vol.3 index
`8`. Across these pages the character is repeatedly situated in school life:
vol.1 includes a school-day conversation and a basketball-start decision;
vol.2 includes after-school physical/club activity (the visible cues include
`位置について` and `スタート`); vol.3 includes a school notice about a failed
subject and make-up study. These are separate entry-volume observations, not
one title-page label.

**Proposal for adjudication only:** add Theme `school` with `centrality=1`,
confidence `0.73`, evidence ID `ev-batch-005-r5-work-6c6341781c12b590864f`,
bounded to the three exact reader routes above. The proposed centrality is 1,
not 2: school is a recurring sub-material in the sampled entry, but the packet
does not claim that school is the series' sole repeated core structure.

Do **not** add `sportsCompetition`: the visible basketball/running/dance
material establishes activity and school context, not an actual competition.
Do **not** reopen `mentalStress=2`: one test/failure notice is not sustained
pressure. The dance/dream/reunion material does not create `strategy` or
`problemSolving`, and the already-known `progression`, character arc,
relationship, and warmth cells are not rewritten. Proposal confidence is
`0.73`; if adjudication finds the school scenes to be setting-only, retain
unknown rather than converting them to a midpoint.

## No-reopen ledger

| Pos | Cells intentionally not reopened | Reason |
| --: | --- | --- |
| 21 | romance, relationship, emotional warmth; all rejected Narrative candidates | Exact reader scenes repeat domestic relationship material only. |
| 23 | ritual → Theme; one-off record search → problem solving/strategy | Ritual is not a legal Theme; one decision is not a repeated solution loop. |
| 24 | comedy; interpersonal reaction → Narrative | Comedy was already accepted; reactions are not constraint analysis or strategy. |
| 27 | progression; threat/action → problem solving/strategy | Prior progression rejection is final for this packet; action alone is not planning. |
| 29 | mentalStress; sports activity → sportsCompetition; dance/dream → strategy | One school failure is not sustained stress; no competition or planning loop was observed. |

## Handoff and non-mutation

- Only one new candidate is proposed: `work-6c6341781c12b590864f` →
  `school=1`, pending independent adjudication.
- No terminal CSV, source, generated, promotion, registry, eligibility, Art,
  Gold, or recommendation file was edited.
- No `『` or `』` wrapper was added to any canonical title.
- No Art axis was assigned or inferred.
- No user-review text was copied into a UI explanation.
- All remaining unknowns remain explicit; no midpoint or zero was synthesized.
- This packet does not authorize a commit or promotion materialization.
