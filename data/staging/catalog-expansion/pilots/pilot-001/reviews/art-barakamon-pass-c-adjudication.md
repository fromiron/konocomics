# Pilot 001 — ばらかもん independent Art Pass C adjudication

## 0. Blind pixel pass (completed before opening either model report)

I first read `docs/factors/factor-dictionary.md` and then inspected all eight files below at their original `960×1365` resolution. I did not open either Local or Gemini proposal before recording these anchors.

| Official raw page | SHA-256 |
|---|---|
| `act1-1-page-02-673381.webp` | `a9d1cf5ffe4c18f145138a57c9f02ed0cec73e918e7ec3c0a72acf42ac5200a6` |
| `act1-1-page-04-673387.webp` | `85c7c53593745f71a12bb1c27bb4b1b954015c05220ad88e56cbf64d9f34a31d` |
| `act1-1-page-06-673393.webp` | `281229c29fbf5963be6a2b65e5132fb197369c463d57cc7d3ee5ed9348d9cc8f` |
| `act1-1-page-09-673402.webp` | `535dad794fa7e901de06cee1764012d75354cf8269e242035a2f204e437db826` |
| `act1-1-page-10-673405.webp` | `bca9aafa1345d2943c7fe72f145a2a0ecf53dc50d851400ef16897886a5f6944` |
| `act1-1-page-11-673408.webp` | `a74a99321888ef8ba8d126234acef2840f43513b335c66bb2f7cbc89d36ef621` |
| `act1-1-page-12-673411.webp` | `1b0697359c8cca31431966e987da35c195485e36d7eee701636c94c2cf6a7e8f` |
| `act1-1-page-15-673420.webp` | `da2b7524240c3a95bc52a3a1bec62e3b81537f204eebad7ad41be8e1e7da88e9` |

### Blind anchors

- `artRealism=2`: standard stylized manga anatomy and faces dominate. Adult bodies and airport/gallery/coast environments keep credible proportions and perspective, while the child and reaction faces use obvious simplification/deformation. This is the dictionary's general-stylization midpoint, not strong deformation `0` or realistic anatomy `4`.
- `artDensity=2`: airport, machinery, gallery, coast, vehicles, vegetation, clothing, and calligraphy furnish functional environmental information, but many panels deliberately use white or flat-tone fields and uncluttered figures. The sample is balanced rather than sparse `0` or highly information-dense `4`.
- `visualSoftness=3`: clean tapered contours, smooth youthful faces, rounded child deformation, light screentone, and airy coastal panels repeatedly lean softer/polished than neutral. Spiky hair, solid black clothing, the elderly faces, and the punch panel's hard lines prevent the consistently delicate/soft maximum `4`.
- `motionImpact=3`: the exact bounded sequence begins on page 10 with Handa's sudden forward launch in the bottom-right panel (`ダッ`) after the confrontation and ends on page 11's top impact panel. The large diagonal arm/body sweep, cropped contact, dense motion smearing, oversized impact mark, and shouted lettering make the hit stronger than ordinary `2`; it is a single forceful human blow rather than the repeated extreme speed/tremor/destruction language expected for `4`. Page 15's near-collision adds radial speed lines, a braking trajectory, large alarm lettering, and body recoil, corroborating an above-midpoint dynamic treatment.

Blind vector fixed before comparison: **`2 / 2 / 3 / 3`** in `artRealism / artDensity / visualSoftness / motionImpact` order.

## 1. Frozen identity, edition, and evidence scope

- Repository branch / HEAD: `main` / `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Pilot candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work: `work-f5f0ee0b0ff16bc146e0`
- Canonical title: `ばらかもん`
- Standard edition: SQUARE ENIX, `ばらかもん 1`, author `ヨシノサツキ`, ISBN `9784757526167`, release `2009-07-22`: <https://magazine.jp.square-enix.com/top/comics/detail/9784757526167/>
- Official internal preview: ガンガンONLINE, `ばらかもん ACT.1-1`: <https://www.ganganonline.com/title/868/chapter/33142>
- Edition mapping: the standard-volume product page directly links the viewer as `第1話 試し読み`; the viewer independently identifies the same title and author and labels the chapter `ACT.1-1`.
- Research/retrieval date: `2026-08-23`
- Source response hashes: product HTML `241f5284284a9260576c0a849c7f022a442a8d01cfe7a16847726c42c56b7ff2`; chapter HTML `75d0b6d5cc22411b6753ca007d5fd84e0963c33d6a5d6165f61381e9dfce6d77`.
- Portable manifest hashes: static six `170ee566fa607e8c2f8cbc282ecf3800d22ef3b805542e6551f13045b103c5b8`; bounded motion pair `960c74f3371b2a8425a0a301fe3cd93609e320030278d977515e080fd7949cda`; all eight `8c7a631a6515c0739478711c2692557e0c6b47ff7c3c3cf8c825ecb4d38c8496`.
- Review scope: Art only, limited to the exact original-resolution packet above. Covers, animation images, synopsis-derived Art claims, and user Art opinions were not used.
- `reviewedByHuman=false`.

The official viewer yielded 15 distinct readable internal manga pages across at least three observable scene contexts. The frozen static packet contains six pages across the coastal/island travel and calligraphy-exhibition contexts, and the motion packet contains the exact adjacent page 10 to page 11 action. It therefore satisfies the static `>=6` pages / `>=2` contexts gate and the conditional motion-sequence gate.

## 2. Independent-review comparison

Only after fixing the blind vector above did I read the two review ledgers.

| Axis | Local Codex | Gemini 3.7 Flash High | Pass C scope |
|---|---:|---:|---|
| `artRealism` | `2` | `2` | agreement; consistency check only |
| `artDensity` | `2` | `2` | agreement; consistency check only |
| `visualSoftness` | `3` | `2` | conflict adjudicated below |
| `motionImpact` | `3` | `2` | conflict adjudicated below |

Both reviewers proved access to the exact pixel packet and passed its sample gate. The resolution below is not an average, vote, or preference for one reviewer. Each value is selected against the dictionary anchors, exact pixels, and bounded entry-volume scope. The fact that both disputed decisions match my pre-comparison blind anchors is recorded as independence evidence, not as an additional vote.

## 3. Pass C decisions

### `visualSoftness`: **accept Local `known=3`; correct Gemini `2 -> 3`**

The dictionary midpoint `2` is neutral, while `4` is consistently soft/beautiful. Across the six-page static packet, softness is a repeated positive treatment rather than merely the absence of roughness: contours are clean, thin, and smoothly tapered; youthful faces and the child's deformations are rounded; pale screentone and substantial white space keep character panels light; and page 12's coast, sky, clouds, and waves are rendered as an airy scenic composition. These signals recur across distinct contexts.

Gemini correctly identifies crisp ink, sharp hair silhouettes, standard screentone, and solid blacks. Those are real counter-signals, but they bound the score below `4`; they do not erase the packet-wide softer-than-neutral handling. The old men's faces, angular hair, dark clothing, and the punch's hard marks likewise prevent the maximum. The interpolated value `3` is the closest dictionary fit.

### `motionImpact`: **accept Local `known=3`; correct Gemini `2 -> 3`**

The exact qualifying sequence is confined to adjacent official pages 10 and 11:

1. Page 10's bottom-right panel initiates Handa's sudden forward movement after the confrontation, marked by `ダッ`, while the surrounding characters react.
2. Page 11's top panel completes the movement as a punch: the arm and upper bodies cut strongly across the panel diagonal, the contact is cropped close, motion smear/shading and a large impact mark emphasize speed and force, and oversized sound/voice lettering reinforces the hit.
3. Page 11 immediately supplies the physical endpoint and aftermath as Handa is restrained and the struck curator/onlookers recoil.

This is more forceful than the dictionary's ordinary midpoint `2`: the sequence specifically concentrates speed, contact, impact, and reaction rather than merely showing a readable action. It remains below `4` because the packet does not sustain repeated extreme action-manga speed, destruction, or large-scale impact. Page 15's braking/near-collision treatment is only corroboration that the sampled visual grammar can rise above neutral; it is not substituted into the required page 10 to page 11 continuity proof.

### Agreement consistency checks

- `artRealism=known(2)` is retained. Credible adult proportions, vehicles, buildings, gallery space, and coastal perspective coexist with ordinary manga facial stylization, simplified child forms, and reaction deformation. Neither `0` nor `4` fits the sustained sample.
- `artDensity=known(2)` is retained. Environmental and object detail is functional and sometimes substantial, but repeated white fields, open sky/sea, flat screentone, and uncluttered character panels keep the packet balanced rather than sparse or dense.

## 4. Final Art result and closure

| Axis | Final state | Final value | Disposition |
|---|---|---:|---|
| `artRealism` | `known` | `2` | Local/Gemini agreement confirmed |
| `artDensity` | `known` | `2` | Local/Gemini agreement confirmed |
| `visualSoftness` | `known` | `3` | Local accepted; Gemini corrected |
| `motionImpact` | `known` | `3` | Local accepted; Gemini corrected |

Final Art vector: **`2 / 2 / 3 / 3`**.

- Sample status: `qualified`.
- Art adjudication status: `resolved`.
- Remaining official-content route: **none required** for this entry-volume Art judgment. The official standard-edition preview already clears both gates; more pages are not required to make these four states known.
- Hard blocker: **none**. The prior `sample-gate-failed` conclusion is superseded by this reproducible official-page packet.
- Promotion boundary: this adjudication closes Art only. It does not by itself authorize promotion or alter any non-Art gate.
- Repository mutation: **none**.
