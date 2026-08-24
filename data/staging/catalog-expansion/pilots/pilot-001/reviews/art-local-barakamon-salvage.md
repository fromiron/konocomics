# Pilot Art salvage — ばらかもん

## 1. Frozen scope and result

- Repository branch / HEAD: `main` / `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Pilot candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work: `work-f5f0ee0b0ff16bc146e0`
- Canonical title: ばらかもん
- Research and retrieval date: `2026-08-23`
- Reviewer: Local Codex
- Actual pixel access: **YES**. I opened the official internal pages at original resolution and inspected the selected static packet and the bounded motion sequence.
- Scope: Art only. Covers, animation images, synopsis-derived Art claims, and user Art opinions were not used.
- Repository mutation: **none by this task**. All downloaded pages and captures are temporary files under `/tmp/pilot-barakamon.kAAalZ`.

**Local outcome:** the retry clears the prior sample failure. The official viewer yielded **15 distinct readable internal manga pages across at least 3 scene contexts**, so the static Art sample gate passes. Local candidates are `artRealism=2`, `artDensity=2`, `visualSoftness=3`, and `motionImpact=3`. These are not yet final-matrix values: the required independent Gemini 3.7 Flash High pixel review and conflict adjudication have not run on this new packet.

## 2. Contract applied

- Static Art may be known only from an official internal preview tied to the standard edition and the entry range, with at least 6 readable internal pages and at least 2 distinct scene contexts.
- `motionImpact` additionally requires an exact continuous start/end sequence.
- A failed sample gate closes the affected axes as explicit `unknown`; `unknown` is not a low score and is not itself a promotion blocker.
- Values use the current Factor Dictionary anchors; no dictionary or validator rule was changed.

The prior Local audit reported only 2 unique readable pixels from virtual nodes `page_7`–`page_12` and prescribed capturing immediately whenever a virtual page becomes current. This retry followed that exact route rather than counting DOM nodes.

## 3. Standard volume-1 and work mapping

| role | official source | URL | publication/date field | retrieved | direct mapping observation |
|---|---|---|---|---|---|
| Standard volume 1 | SQUARE ENIX, ばらかもん 1 | <https://magazine.jp.square-enix.com/top/comics/detail/9784757526167/> | Release `2009-07-22` | `2026-08-23` | Title `ばらかもん 1`, author `ヨシノサツキ`, ISBN `9784757526167`; the product page directly links the first-episode viewer below as `第1話 試し読み`. |
| Official internal preview | ガンガンONLINE, ばらかもん `ACT.1-1` | <https://www.ganganonline.com/title/868/chapter/33142> | Viewer has no separate publication date; mapped through the dated standard-volume product page | `2026-08-23` | Viewer metadata gives title `ばらかもん`, author `ヨシノサツキ`, chapter `ACT.1-1`, left-start mode, and `pageCount=17`. |

The product-to-viewer hyperlink is direct, so the sample is not inferred from matching titles alone. It is an official first-episode preview for the standard first volume, inside the allowed entry-volume range. The product HTML and viewer HTML response hashes are:

- `vol1-product.html`: `241f5284284a9260576c0a849c7f022a442a8d01cfe7a16847726c42c56b7ff2`
- `chapter-33142.html`: `75d0b6d5cc22411b6753ca007d5fd84e0963c33d6a5d6165f61381e9dfce6d77`

The viewer exposes 17 slots. Slots 1–15 are `manga_page` content IDs `673378` through `673420` in increments of 3. Slots 16–17 are `extra_manga_page` release/information pages and were excluded from the Art sample.

Signed internal image query URLs expire. Reproducible provenance therefore uses the stable chapter URL, chapter `ACT.1-1`, the durable content IDs below, retrieval date, dimensions, and byte hashes; the transient signed queries are preserved only in the temporary `page-urls.tsv`.

## 4. Current-page capture retry and sample gate

The official virtual viewer was opened in left-start mode. After every single `ArrowLeft` transition, I waited for the new page to become current and captured it immediately, before the virtualizer replaced its pixels. This produced `barakamon-page_01.png` through `barakamon-page_15.png`:

- Captures: **15/15 readable internal manga pages**
- Distinct capture SHA-256 values: **15/15**
- Capture dimensions: `1233x1291`
- Excluded non-manga slots: **2**
- Scene contexts: **at least 3**
  1. harbor/shoreline arrival and fishing interaction,
  2. island airport, transport, and travel/environment sequences,
  3. calligraphy-exhibition confrontation.

Therefore the static gate is **PASS**: `15 >= 6` readable pages and `3 >= 2` contexts.

### Selected six-page static packet

The selected packet deliberately spans all three contexts. `capture SHA-256` identifies the immediate current-page screenshot; `official raw SHA-256` identifies the corresponding direct official 960x1365 WebP response.

| viewer ref | content ID | context | capture SHA-256 | official raw SHA-256 |
|---|---:|---|---|---|
| `ACT.1-1`, page 2 | `673381` | harbor/child interaction | `5fcb9937743d5e31447d59aabfefee72830876f2b9d7a37919309a1b50a0da94` | `a9d1cf5ffe4c18f145138a57c9f02ed0cec73e918e7ec3c0a72acf42ac5200a6` |
| `ACT.1-1`, page 4 | `673387` | island airport/arrival | `3f12060b192130bbe85908236d21baa6d8dd71fe825f7dfa49c9987b672d15a8` | `85c7c53593745f71a12bb1c27bb4b1b954015c05220ad88e56cbf64d9f34a31d` |
| `ACT.1-1`, page 6 | `673393` | airport/transport | `105ecb6e35f8f929ec7e21b33accfda65afa866f32b8a429cf5c64d9f2be5ae0` | `281229c29fb5963be6a2b65e5132fb197369c463d57cc7d3ee5ed9348d9cc8f` |
| `ACT.1-1`, page 9 | `673402` | exhibition confrontation | `3afda9e4fa0b86fe9a52a021297a992d0178d3e9a898a534b3985c61549817f2` | `535dad794fa7e901de06cee1764012d75354cf8269e242035a2f204e437db826` |
| `ACT.1-1`, page 12 | `673411` | island transit/environment | `1deac683acb6c279207c9f70154c8c7a0655ede0e917d569ce5a4f4b386d1a8a` | `1b0697359c8cca31431966e987da35c195485e36d7eee701636c94c2cf6a7e8f` |
| `ACT.1-1`, page 15 | `673420` | vehicle/travel sequence | `b829e203a14dec76d8c8d42cc7c41710fb586657e77abdb9486ef54078ebe6e3` | `da2b7524240c3a95bc52a3a1bec62e3b81537f204eebad7ad41be8e1e7da88e9` |

## 5. Local Art decisions

| Axis | Local state/value | exact refs | direct visual observation and boundary |
|---|---|---|---|
| `artRealism` | `known=2` | static six-page packet | Adult anatomy, vehicles, airport structures, shoreline, and interiors remain legible and plausibly proportioned, but faces and the child figure use sustained ordinary manga stylization and occasional gag deformation. This fits the general-stylization anchor `2`, not sustained realistic anatomy/background treatment at `4`. |
| `artDensity` | `known=2` | static six-page packet | Architecture, vehicles, environmental cues, screentone, and multi-panel information are present, while scenic sky/sea areas, white space, and face-focused panels repeatedly keep pages open. The balance is neither sparse `0` nor consistently high-information `4`. |
| `visualSoftness` | `known=3` | static six-page packet | Thin clean contours, rounded child forms, airy pale screentone, and gentle sky/sea and facial handling are consistently softer than neutral `2`; strong black framing, angular hair, and impact marks prevent the maximum soft/beautiful anchor `4`. |
| `motionImpact` | `known=3` | `ACT.1-1` page 10 content `673405` -> page 11 content `673408` | Exact continuous sequence: page 10 bottom establishes the arm action after the confrontation; page 11 top completes it with the emphasized strike and motion/impact marks; page 11 middle supplies the immediate restraint/aftermath endpoint. This is stronger than ordinary `2`, but one bounded strike in the sampled entry episode does not justify maximum `4`. |

The motion sequence files are direct official 960x1365 WebPs:

- page 10 / content `673405`: capture `0d1343254d7a49fb03b5157ab53b87629f9d05d27cd5061fb9cfebb2e2b25947`; raw `bca9aafa1345d2943c7fe72f145a2a0ecf53dc50d851400ef16897886a5f6944`
- page 11 / content `673408`: capture `384b295481ad4d2101f157494e66b46ac076955ab6dc3809611d813a519b3a26`; raw `a74a99321888ef8ba8d126234acef2840f43513b335c66bb2f7cbc89d36ef621`

## 6. Portable packet manifests

Manifest algorithm: sort by stable basename; for each file emit exactly `<basename><NUL><lowercase file SHA-256><LF>`; concatenate the records and SHA-256 the resulting byte stream. Absolute paths are excluded.

| packet | count | portable manifest SHA-256 |
|---|---:|---|
| selected static official raw packet | 6 | `170ee566fa607e8c2f8cbc282ecf3800d22ef3b805542e6551f13045b103c5b8` |
| exact motion official raw packet | 2 | `960c74f3371b2a8425a0a301fe3cd93609e320030278d977515e080fd7949cda` |
| all selected official raw files | 8 | `8c7a631a6515c0739478711c2692557e0c6b47ff7c3c3cf8c825ecb4d38c8496` |
| all current-page captures | 15 | `e247e4a4611c1070e1f552f1e855829401e914c42ee36b64ed56b2abccd58556` |

The contact sheet was used only as a navigation aid, not as an evidence packet. Its SHA-256 is `96a3b71ad4b3e4438adf4e12516ffcffb0ccf7e8cbb979458dad491933e243c8`.

## 7. Closure, remaining route, and blocker boundary

- **Local sample status:** `qualified`.
- **Prior closure correction:** `sample-gate-failed` is no longer supported by the successful current-page retry and should be retired during adjudication.
- **Hard blocker:** none. The official standard-edition mapping, readable sample, and bounded motion route all exist.
- **Remaining official-content route:** none required for this bounded Local salvage. Additional page collection would not change the already-passed sample gate.
- **Required next review:** give Gemini 3.7 Flash High the exact eight-file official packet, manifest/hash ledger, Factor Dictionary anchors, and this request. It must prove pixel access and return a complete response. Grok remains Art-abstain unless it proves direct pixel access; Muse is optional only under its stability gate.
- **Finalization rule:** do not average or silently majority-vote disagreements. Adjudicate each conflicting axis against the exact refs and dictionary. Until the independent Art quorum completes, the repository matrix remains unchanged even though the Local sample failure has been resolved.


