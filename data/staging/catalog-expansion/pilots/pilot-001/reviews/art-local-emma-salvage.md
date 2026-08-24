# エマ — Local Codex independent Art audit

## 1. Frozen identity and scope

- Audit date: `2026-08-23`
- Repository HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Pilot candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work: `work-1fc61ddbeb429b4a2c15`
- Canonical title: `エマ`
- Factor scope: `entry_1_3_volumes`
- Evaluated entry edition: KADOKAWA standard volume 1, ISBN `9784047298804`, paper release `2002-08-30`, electronic release `2014-01-14`
- Official publisher product: <https://www.kadokawa.co.jp/product/301407000933/>
- Official BOOK☆WALKER product/sample: <https://bookwalker.jp/dee971444a-72e5-4aab-a1fe-979347425373/> and <https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=e971444a-72e5-4aab-a1fe-979347425373>
- Retrieved: `2026-08-23`
- Repository mutation: none

KADOKAWA's product identifies standard volume 1 and ISBN `9784047298804`; the product's official sample route opens BOOK☆WALKER UUID `e971444a-72e5-4aab-a1fe-979347425373`, whose live viewer title is `エマ 1巻`. The existing bibliography audit also records KADOKAWA's older ISBN `9784757709720` as the same first-volume work/release relation and finds no official special, complete, bunko, or limited-edition label for the representative ISBN. Volume 1 is inside the required entry-volume range, and its 15 narrative pages already exceed the Art gate, so volumes 2–3 were not collected.

## 2. Capture and frozen packet

- Live viewer viewport: `1850×1937` CSS pixels; CDP output: `2775×2906` pixels
- Navigation: cover/flyleaf/title/contents followed by 15 distinct single-page `ArrowLeft` transitions
- Raw sequence: `step-04.png` through `step-18.png`
- Printed references: `p.005` is visible under the viewer overlay on the first narrative page; the following 14 distinct one-page transitions are sequential `p.006–019`, with no repeated page hash before the end dialog.
- Packet transform: deterministic crop `1500×2450+400+0`; this removes blank viewer margin and the unrelated BOOK☆WALKER end-frame cookie banner without altering sampled manga pixels.
- Frozen pixel packet: `/tmp/pilot-emma-art.xpEjuI/packet/`
- Page count: `15`
- Context count: `3`
- Portable packet SHA-256: `2bfa13ca6316c9d3cbfb34a6d5d00eb2bf1c1b0c4b70798fd6f2b4d4b4baf69a`
- Manifest algorithm: sort stable basenames; emit basename, NUL, lowercase file SHA-256, LF; concatenate; SHA-256 the byte stream. Absolute paths are excluded.
- Navigation contact sheet: `/tmp/pilot-emma-art.xpEjuI/emma-contact.jpg`, SHA-256 `d7b2b891f61b354ff294e37c44b73755fe35172ad4f5ab75104f52ea3385717c`

The 3 contexts are:

1. `v1-p005–006`: maps, London streets, period buildings, animals, and horse carriage.
2. `v1-p007–009`: a gentleman's carriage arrival, townhouse exterior, knock, doorway reaction, and greeting.
3. `v1-p010–019`: parlour/household conversation, tea service, framed photographs, furniture, clothing, and repeated character close-ups.

All 15 packet files are readable internal manga pages. Covers, title pages, contents, animation, synopsis, user opinions, and later volumes are excluded from the Art judgment.

## 3. Exact page hashes

| Packet page | Raw viewer capture | Raw SHA-256 | Packet SHA-256 |
|---|---|---|---|
| `v1-p005.png` | `step-04.png` | `f63783e5a443abbf8c98d67a05bc491d1a67f170a88fffc433931da81ae5e648` | `72db68ce7bffa2043c25ebe2307d145a35731caf1c6745887a3fc2ef162973d7` |
| `v1-p006.png` | `step-05.png` | `2af675e60f5cf877a9e1700833f29e9a65f2f759da25cd616c6a9edb1c794a33` | `28a13eddbbf9b98ea2f8450a8c68f099787361fe1ca60a38bc1927bf7484cfc5` |
| `v1-p007.png` | `step-06.png` | `ae5e8ed4bee969ec7c3ab6ac87a453466681c5534196c84fc35ff185cf1cfb9b` | `bc3db7e76c525dc763dc458306bcc3af508bbd4ff3565d9949754219d2f46ba7` |
| `v1-p008.png` | `step-07.png` | `e13cb4c92361091930571f959b4e675585d726667db5f69a08db61c77e0d10e1` | `499d181732f11a75588b1869edb96c8f2240b0efc15480554d20d89c643237bb` |
| `v1-p009.png` | `step-08.png` | `f8b5d85d100a773716067a8ce1d5da35eb5164520f7d27839d536cdbbbbb5b69` | `40d73371cf931fd5f67a7c228263f518b124e0ccb453136e6e5984325de32a61` |
| `v1-p010.png` | `step-09.png` | `71ea0737fdbc2658ab73b973bb69c7e92195ccc2ed0cfc4626d37fe1bf3af92d` | `884f41cd087908be555dcbe9438564c5382b202c55bfddc592363a3e9c3c534f` |
| `v1-p011.png` | `step-10.png` | `5142ea732beab2b5fee2b64ac13f67fd7e4826253822ef43747a2d7c6831c988` | `c69a09143d32aa92f9b1caf4ed6ffd775bb9753ad3f30aff5b8185e01592eb5b` |
| `v1-p012.png` | `step-11.png` | `ac775b3d201fcbc1a63343d2b7670a18a9fe2e8a0fe6f18e39c03a82e24f578d` | `108128e92de7948c41981903712e93ee4d250d3f3d4f769e03121c6a66224e0d` |
| `v1-p013.png` | `step-12.png` | `5ccf57e0956f422fa9b62550d4a26a37ffe810a0fe15572bba09dc5adc68885c` | `894e64abe03da4cc7b765f33bfd8c9cb40ecc4c05f8e86a5df863bbd1dd218d1` |
| `v1-p014.png` | `step-13.png` | `a3de83a15f0c78b3aa3ecb5e2c9612543b6ede19d2c6d8895ac23a1b8d03d9e5` | `d43276608ec778f1cae17f5f2a2c232b450bee6c0e5fa4bfef4d190f0ac00f91` |
| `v1-p015.png` | `step-14.png` | `1ce08dadb31f5eb11e6893f3e4dbf44d4f586f5f84fd2da8216422ea1c56bcdb` | `182dfda65a1619ba8b4eccec86198db9e2a578b3c377f9cf064a1aa49e8fa657` |
| `v1-p016.png` | `step-15.png` | `dcaec05f9fd67c8fd07a54b1555f0fc454b3ecdb1a775922ef0f34eb54fd0bea` | `5ab9f3af57ce065adb0ef2c249b31e68a7bbe1f4decc071365cae98c8bfe2a91` |
| `v1-p017.png` | `step-16.png` | `8607807552299619c239a3958cfa5e1350eafdf15013d9dee78d892b57b54faf` | `132d23de201c46a168b95c2d17a8d9768c130c87dcf531260a225ca6af5b2eba` |
| `v1-p018.png` | `step-17.png` | `73500cf954c52eefb475d9cb175cca5d1079adc1d1d7de74c6c367a9f93b89af` | `e2ada592d47dc1b4c24d8b12e3f34d5fb9fb29de7eae9ec87f6b3181e4caa223` |
| `v1-p019.png` | `step-18.png` | `a8cf5ebde494952bb479d66e93fb3ef17704edbc52227494b44ef4b4a34a5d41` | `25a779b3f89f7ce32914376c7359db599c35fb21d4cf2b14826f9843c3d59bdd` |

## 4. Local actual-pixel judgment

| Axis | State/value | Direct pixel basis |
|---|---:|---|
| `artRealism` | `known=3` | Period maps, London masonry, streets, carriage, household objects, clothing, and human body proportions are repeatedly grounded and perspective-consistent (`p005–009`, `p014–019`), while enlarged eyes and simplified noses/faces keep the sample below realistic anchor 4. It lies between ordinary stylization 2 and realistic 4. |
| `artDensity` | `known=3` | Opening environments use sustained hatching, masonry, roof/window grids, animals, carriage construction, and crowd/street information (`p005–006`). Conversation pages retain multi-panel layouts, clothing texture, furniture, photographs, and screentone, but also use speech-bubble and face-close-up whitespace (`p010–019`), placing the bounded sample between balanced 2 and high density 4. |
| `visualSoftness` | `known=3` | Clean curved face and garment contours, restrained screentone gradients, rounded eyes, and gentle portrait framing recur across the parlour pages (`p009–019`). Hard architectural lines and high-contrast black clothing keep it below uniformly soft/milky anchor 4, while the sustained finish is softer than neutral 2. |
| `motionImpact` | `unknown` | No frozen page range preserves an exact start → development/impact → endpoint physical-action sequence. The carriage/arrival transition is contextual movement, not a bounded action sequence whose dynamic rendering can be scored. Unknown is not 0. |

Static Art gate: **PASS** (`15` readable internal pages, `3` contexts). Motion gate: **unknown-closed**. Local vector: `3 / 3 / 3 / unknown`.

## 5. Disposition

- Art hard blocker: **none**.
- Promotion status from this audit alone: unchanged; this is an Art-only salvage ledger.
- Grok: Art abstention required because no current direct-pixel capability proof is attached.
- Muse: not invoked.
- Gemini: must review the same frozen packet independently with Local values withheld. Differences go to Pass C; no average or vote is permitted.
