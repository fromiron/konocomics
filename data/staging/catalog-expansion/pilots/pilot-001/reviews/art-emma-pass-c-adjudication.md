# Pilot 001 `エマ` — independent Art Pass C adjudication

## Disposition

- Work: `work-1fc61ddbeb429b4a2c15`
- Scope: Art only; `entry_1_3_volumes`
- Final vector: `artRealism=K3@0.88; artDensity=K3@0.91; visualSoftness=K3@0.87; motionImpact=K2@0.84`
- Static Art sample gate: **PASS** — 15 readable internal pages across 3 contexts.
- Motion gate: **PASS** — exact bounded continuous sequence at `v1-p007.png` through `v1-p009.png`.
- `reviewedByHuman`: `false`
- Art hard blocker: **none**
- Overall promotion status: outside this Art-only adjudication.
- Repository/source/matrix mutation: **none**

No cover, title page, contents page, synopsis, animation image, user opinion, or later-volume impression was used in any Art value.

## Blindness and adjudication protocol

`docs/factors/factor-dictionary.md` was read first. All 15 original-resolution packet PNGs were then inspected directly before either prior ledger was opened. The blind freeze was written to `/tmp/pilot-art-emma-pass-c.blind.md` with SHA-256 `c2994010748d1422c526a7ed15d7b7393844025a70e979e8b42b2a3d0fd83d2f`; its static vector was `3 / 3 / 3` and motion was initially `unknown`.

Only after that freeze were `/tmp/pilot-art-emma-local.md` and `/tmp/pilot-art-emma-gemini.md` opened. Local proposed `3 / 3 / 3 / unknown`; the counted Gemini 3.7 Flash High run proposed `4 / 4 / 4 / unknown`. Gemini provenance is valid: exact model `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort `high`, `completionStatus=completed`, all 15 returned pixel hashes matched local recomputation, and the complete run exited normally. Differences were resolved from the pixels and dictionary anchors, without averaging or voting.

Targeted post-ledger reinspection changed only `motionImpact`: the visible `p007–009` doorway sequence does meet the explicit continuous start–development/impact–end requirement. This correction comes from direct reinspection of those PNGs, not from accepting either ledger by authority.

## Identity, authority, edition, and scope

| Field | Final record |
|---|---|
| Canonical title | `エマ` |
| Representative ISBN | `9784047298804` |
| KADOKAWA identity URL | https://www.kadokawa.co.jp/product/301407000933/ |
| Exact official BOOK WALKER product/sample URL | https://bookwalker.jp/dee971444a-72e5-4aab-a1fe-979347425373/?sample=1 |
| Exact live viewer URL | https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=e971444a-72e5-4aab-a1fe-979347425373 |
| BOOK WALKER UUID | `e971444a-72e5-4aab-a1fe-979347425373` |
| `authorityClass` | `publisherAuthorizedPlatform` |
| `sourceType` | `manual` |
| Edition | KADOKAWA standard Japanese volume 1; ISBN `9784047298804`; paper release `2002-08-30`; electronic release `2014-01-14`; BOOK WALKER title `エマ 1巻`; no special, bunko, complete, or limited-edition label in the verified identity path. |
| `scopeMapping` | KADOKAWA product `301407000933` identifies ISBN `9784047298804` as standard `エマ 1` and directly links the BOOK WALKER UUID above for electronic volume 1. Volume 1 is within `entry_1_3_volumes`; the packet is 15 sequential internal printed pages `p005–019`. |
| Packet | `/tmp/pilot-emma-art.xpEjuI/packet/`; 15 unique PNGs; each `1500×2450`, RGB; inspected at original detail. |
| `sampleCount` | `15` |
| Contexts | `3`: (1) maps, London city/architecture, cat, horse and carriage (`p005–006`); (2) street arrival, house 29, doorway collision and greeting (`p007–010`); (3) parlour conversation, tea service, period clothing, furniture, mantel and portrait handling (`p011–019`). |

The KADOKAWA page contains the ISBN and an official sample link to the exact BOOK WALKER UUID. The BOOK WALKER product identifies that UUID as `エマ 1巻`; the trial URL redirects to the live viewer with the same `cid`. Packet basenames form the gap-free sequence `v1-p005.png` through `v1-p019.png`; all 15 hashes are distinct and the page content is narratively continuous.

## Final axis records

| Axis | State | Value | Confidence | Page refs | Observation | Limitation |
|---|---|---:|---:|---|---|---|
| `artRealism` | `known` | `3` | `0.88` | `v1-p005.png`; `v1-p006.png`; `v1-p007.png`; `v1-p009.png`; `v1-p014.png`; `v1-p016.png`; `v1-p018.png`; `v1-p019.png` | Maps, masonry, streets, horse/carriage, perspective, clothing, hands, furniture, and adult body proportions are repeatedly grounded. Emma's and other figures' enlarged eyes, simplified noses, smooth facial planes, and selective anatomy remain visibly manga-stylized. This is above ordinary stylization 2 but does not satisfy realistic anatomy/background/proportion as a dominant, unqualified 4. | Only volume-1 entry pages `p005–019` were sampled; detailed environments cannot erase repeated facial stylization. |
| `artDensity` | `known` | `3` | `0.91` | `v1-p005.png`; `v1-p006.png`; `v1-p007.png`; `v1-p011.png`; `v1-p014.png`; `v1-p015.png`; `v1-p016.png`; `v1-p019.png` | The maps, city roofs, architecture, carriage, hatching, clothing texture, bookshelf, mantel, frames, and room furnishings repeatedly exceed balanced density. However `p010`, `p012–013`, and `p017–018` also contain large open close-up/dialogue fields and omitted backgrounds. The sample lies between balanced 2 and consistently high 4. Lettering was excluded. | Density varies by establishing versus dialogue panel; it is not sustained at anchor 4 across the full sequential sample. |
| `visualSoftness` | `known` | `3` | `0.87` | `v1-p007.png`; `v1-p009.png`; `v1-p010.png`; `v1-p014.png`; `v1-p016.png`; `v1-p018.png`; `v1-p019.png` | Clean rounded face and garment contours, gentle expressions, controlled screentone, and delicate hair/glasses treatment lean soft and refined. Dense parallel hatching, firm architectural edges, and large high-contrast black garments keep the work from the fully soft/beautiful anchor 4. It is softer than neutral 2. | Soft character treatment coexists with hard environmental and textile rendering; neither side should be discarded. |
| `motionImpact` | `known` | `2` | `0.84` | **continuous printed pages `p007–009` / `v1-p007.png–v1-p009.png`**: approach and face house 29 → knock/door opens outward → forehead collision and immediate clutching reaction → visible bruise and Emma's apology | The bounded sequence has an exact start, development, impact, and endpoint. Panel-to-panel timing, impact marks/exclamations, reaction framing, and the persistent bruise make movement and contact ordinarily clear. It does not sustain the heavy speed lines, force, debris, or body displacement required for high impact 4, so anchor 2 is the supported value. | This is one short domestic-comedy collision rather than repeated action; confidence is therefore lower than the static axes. |

## Conflict resolution

| Axis | Local | Gemini 3.7 Flash High | Pass C | Resolution against anchors |
|---|---:|---:|---:|---|
| `artRealism` | `K3` | `K4` | `K3@0.88` | Gemini's 4 overstates natural facial proportion; repeated enlarged eyes and simplified facial construction make 3 the exact 2↔4 midpoint. |
| `artDensity` | `K3` | `K4` | `K3@0.91` | Gemini's claim that every panel is filled is contradicted by multiple sparse dialogue/close-up pages; repeated dense settings still place the sample above 2. |
| `visualSoftness` | `K3` | `K4` | `K3@0.87` | Soft faces and contours are clear, but hard hatching, architecture, and black clothing prevent the fully soft 4 anchor from dominating the complete sample. |
| `motionImpact` | `U` | `U` | `K2@0.84` | Both ledgers incorrectly required an athletic/combat-like sequence. The dictionary permits any dynamic scene, and `p007–009` is an exact bounded approach/knock–door impact–bruised aftermath sequence with ordinary impact emphasis. |

## Exact packet SHA-256

| PNG | SHA-256 |
|---|---|
| `v1-p005.png` | `72db68ce7bffa2043c25ebe2307d145a35731caf1c6745887a3fc2ef162973d7` |
| `v1-p006.png` | `28a13eddbbf9b98ea2f8450a8c68f099787361fe1ca60a38bc1927bf7484cfc5` |
| `v1-p007.png` | `bc3db7e76c525dc763dc458306bcc3af508bbd4ff3565d9949754219d2f46ba7` |
| `v1-p008.png` | `499d181732f11a75588b1869edb96c8f2240b0efc15480554d20d89c643237bb` |
| `v1-p009.png` | `40d73371cf931fd5f67a7c228263f518b124e0ccb453136e6e5984325de32a61` |
| `v1-p010.png` | `884f41cd087908be555dcbe9438564c5382b202c55bfddc592363a3e9c3c534f` |
| `v1-p011.png` | `c69a09143d32aa92f9b1caf4ed6ffd775bb9753ad3f30aff5b8185e01592eb5b` |
| `v1-p012.png` | `108128e92de7948c41981903712e93ee4d250d3f3d4f769e03121c6a66224e0d` |
| `v1-p013.png` | `894e64abe03da4cc7b765f33bfd8c9cb40ecc4c05f8e86a5df863bbd1dd218d1` |
| `v1-p014.png` | `d43276608ec778f1cae17f5f2a2c232b450bee6c0e5fa4bfef4d190f0ac00f91` |
| `v1-p015.png` | `182dfda65a1619ba8b4eccec86198db9e2a578b3c377f9cf064a1aa49e8fa657` |
| `v1-p016.png` | `5ab9f3af57ce065adb0ef2c249b31e68a7bbe1f4decc071365cae98c8bfe2a91` |
| `v1-p017.png` | `132d23de201c46a168b95c2d17a8d9768c130c87dcf531260a225ca6af5b2eba` |
| `v1-p018.png` | `e2ada592d47dc1b4c24d8b12e3f34d5fb9fb29de7eae9ec87f6b3181e4caa223` |
| `v1-p019.png` | `25a779b3f89f7ce32914376c7359db599c35fb21d4cf2b14826f9843c3d59bdd` |

Portable packet-manifest SHA-256: `2bfa13ca6316c9d3cbfb34a6d5d00eb2bf1c1b0c4b70798fd6f2b4d4b4baf69a`.

## Final limitation and blocker statement

The inspected evidence is a 15-page sequential sample from standard volume 1, not a census of all three entry volumes. It is nevertheless inside the required scope, exceeds the six-page/two-context gate, supports all three static axes, and contains one qualifying continuous motion sequence. No Art hard blocker remains. The result is model adjudication only and must remain `reviewedByHuman=false`.
