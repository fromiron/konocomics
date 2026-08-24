# Pilot 001 Art salvage audit — 放浪息子 (Local Codex)

- Audit/retrieval date: `2026-08-23` (Asia/Tokyo)
- Repository HEAD inspected: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work ID: `work-0bec5d8d9474a2197312`
- Canonical title: `放浪息子`
- Scope: Art-only Local Codex re-audit; no repository file was edited.
- Direct pixel access: **YES**. Local Codex opened the selected official internal-page PNGs at original resolution. Covers, front matter, animation, synopsis, and user Art opinions were excluded from Art values.

## 1. Gate and prior state

The current Art matrix closes this work as `preview-inaccessible`. That access fact is obsolete: the existing Pilot text follow-up subsequently captured three separate official BOOK☆WALKER trials and independently verified their printed-page sequence. The current policy permits reopening when the official entry sample reaches at least six readable internal pages in at least two contexts.

- Static Art gate: official interior pages tied to entry volumes 1–3, `>=6` readable pages, `>=2` contexts.
- `motionImpact=known`: additionally requires an exact bounded continuous action sequence.
- A sample failure would close an axis as `unknown`; `unknown` is not a low score or a blocker.

## 2. Official edition and entry mapping

The Pilot source freezes representative standard volume 1 ISBN `9784757715226`. The KADOKAWA official product for volume 1 identifies that standard book and links the corresponding BOOK☆WALKER product/trial. BOOK☆WALKER's official series index connects distinct volume-1, volume-2, and volume-3 products and distinct trial CIDs. Existing independent review confirmed that each viewer exposes the chronological opening of its named volume.

| volume | official product | official trial | verified printed story range |
|---|---|---|---|
| 1 | <https://bookwalker.jp/de4bd52269-b4b6-43d8-a916-9cf8c2437a09/> | <https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=4bd52269-b4b6-43d8-a916-9cf8c2437a09> | pp.8–17 |
| 2 | <https://bookwalker.jp/de446e1436-912e-4738-bba9-5916bcd3faff/> | <https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=446e1436-912e-4738-bba9-5916bcd3faff> | pp.6–18 |
| 3 | <https://bookwalker.jp/de028c9d22-530c-4728-b4d4-f45038f05b0b/> | <https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=028c9d22-530c-4728-b4d4-f45038f05b0b> | pp.6–18 |

Supporting official routes:

- KADOKAWA volume-1 product / representative ISBN route: <https://store.kadokawa.co.jp/shop/g/g200700002446/>
- BOOK☆WALKER series index: <https://bookwalker.jp/series/162/>

This is a standard electronic volume sequence in the declared `entry_1_3_volumes` scope, not a special, complete, bunko, or limited edition. The screenshots were already present under ignored `output/playwright/pilot-text-gap-a/`; this audit reused them and did not recollect the viewer.

## 3. Frozen pixel packet

Temporary root: `/tmp/pilot-hourou-art.caD9EV/`. Images remain uncommitted. The selected packet contains **12 readable interior pages across three official entry volumes**.

| frozen ref | source screenshot | SHA-256 | directly observed context |
|---|---|---|---|
| `v1-p009.png` | `hourou-page-10.png` | `8b5ad01a07e47b421978191139f8f406950b520db0836ca778c02d16f27cbee9` | transfer-day classroom introduction and seating |
| `v1-p013.png` | `hourou-page-14.png` | `7b110b796671622cb88feca2ecd328d4f5a43866fbe002062bf1bf72b9b96c01` | classroom self-introduction, teacher and pupils |
| `v1-p016.png` | `hourou-page-17.png` | `7fcebbba80f654dcd73468b87e721ae853dd6a27ead657fb450c92b725314443` | school-to-home transition and family interior |
| `v1-p017.png` | `hourou-page-18.png` | `06250a80889f44881e27788ac3d1e1e7aac9f0d99de3844403680dff854c38c4` | home entrance/room conversation |
| `v2-p006.png` | `hourou-v2-page-08.png` | `fd863e31daaa4d7b49f56168ff42ffac5e259c5f626276def16e15e0cef64d38` | New Year family gift and embrace |
| `v2-p010.png` | `hourou-v2-page-12.png` | `a2f35388032489fb7cb1e94748b6548afcd71b795e699a53fcb42fbb60661e52` | school exterior and class-placement reaction |
| `v2-p015.png` | `hourou-v2-page-17.png` | `3b6e82682539e11c523d772020d81c05191e0e8a70cbaafc36d6adbd57c17995` | posed full bodies and friendship portraits |
| `v2-p018.png` | `hourou-v2-page-20.png` | `aa022ba47571fcbcc099c716ab36253f82ca6ea3c946bd049ac938056ece0926` | café/group conversation and comic reaction |
| `v3-p006.png` | `hourou-v3-page-08.png` | `e790112fa936994f944151278dbfdc5666e5bd7438fa79f59a5d14d02c6981b5` | school phone call and corridor exit |
| `v3-p009.png` | `hourou-v3-page-11.png` | `ed2dc6cf8435bb4721d66233a88628f28f2f644b3b8ce5245dfb3a800e2b34f8` | department-store exterior and audition arrival |
| `v3-p014.png` | `hourou-v3-page-16.png` | `0464ca7e963fcbf28d2c78ff843532077f0b9661baf83b0e0cd662f8059146f3` | home/sibling group conversation |
| `v3-p018.png` | `hourou-v3-page-20.png` | `cf7619d13c325f135ce2beabd35835bfbc71ad08c533187df2a760498c373d01` | school computer-room apology and relationship adjustment |

Distinct scene contexts: **at least 6** (classroom/school corridor, family home, New Year family gathering, outdoor commute/school exterior, department store/audition, café/computer room). Static gate: **PASS** (`12 >= 6`, `6 >= 2`).

Portable packet algorithm: sort by stable basename; for each file emit UTF-8 basename, NUL, lowercase file SHA-256, LF; concatenate and SHA-256.

```text
84605afa84139ed2d6281846828b2f7435ff40222bcab6445f5986358623e384  selected 12-page packet
62dacf0d0bf3c8acad82328b906d24248ed752dc6f509feb864c91482eda4bea  derived contact sheet (navigation aid only)
```

## 4. Local Art decisions

| Axis | Local state/value | confidence | direct observation and boundary |
|---|---|---:|---|
| `artRealism` | `known=1` | `0.86` | Bodies and school/domestic spaces remain legible and broadly proportionate, but faces, eyes, noses, hands, and some child bodies are persistently simplified and rounded. This is above the strongest deformation/simplification anchor 0, yet below ordinary general stylization 2 across the packet. |
| `artDensity` | `known=1` | `0.88` | Many panels use open white or flat screentone fields, character close-ups, and omitted backgrounds; architecture, furniture, clothing and props appear selectively. Repeated multi-panel composition keeps it above consistently sparse 0, while the packet remains below balanced 2. |
| `visualSoftness` | `known=4` | `0.91` | Thin clean contours, rounded faces, smooth hair curves, pale screentones, airy negative space, and gentle expressions dominate all volumes and contexts. Occasional black hair/clothing masses do not displace the sustained soft/delicate treatment. |
| `motionImpact` | `unknown` | — | The packet includes walking, pointing, embracing, sitting, and a comic stumble, but no representative action is preserved with an exact continuous visual start, development, and resolved end. Ordinary pose changes are not promoted into a motion value. |

Final Local vector:

```text
artRealism=1
artDensity=1
visualSoftness=4
motionImpact=unknown
```

## 5. Authorization boundary

The prior `preview-inaccessible` reason is factually obsolete and the static sample gate now passes. This Local result alone does not authorize a source or final-matrix mutation. The exact frozen packet requires independent Gemini 3.7 Flash High pixel review; any difference must go to evidence/anchor adjudication, not averaging or vote count. Grok abstains from Art, and no Muse run is needed.

Art supplies no hard blocker. `motionImpact` is explicitly closed as `unknown` for this packet, not left pending.
