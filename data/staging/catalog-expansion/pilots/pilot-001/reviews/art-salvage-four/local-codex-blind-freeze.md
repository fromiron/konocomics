# Pilot Art 0/4 salvage — Local Codex blind freeze

- frozenAt: 2026-08-23T00:00:00+09:00 (date-level evidence; wall-clock time intentionally not fabricated)
- candidateSha256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- dictionary: `docs/factors/factor-dictionary.md`, Art anchors read before pixel review
- scope: entry-volume sample only; three official two-page screenshots per work; six readable internal pages and at least two contexts
- reviewedByHuman: false
- sequence rule: this file was written before any Gemini conclusion was requested or read

## work-98d513b70560f2f96a38 — 漂流教室

- Official sample: `https://e-comi.shogakukan.co.jp/books/091931710000d0000000`, `漂流教室〔文庫版〕 1`, official Shogakukan e-comi bunko volume 1.
- Mapping limitation: official canonical title/author match, but this is an alternate bunko edition rather than frozen representative standard-edition ISBN `9784091200013`; conclusions are limited to broad entry-volume visual characteristics visible in this edition.
- Files:
  - `pages-8-9.png` — `e8769145972c62659ff5b0c502e92ff46a729fdcfb78a85031a96d255c297b18`
  - `pages-20-21.png` — `73803487f2b6c82f42a4d2f305eb09cef9038bcca247f3dc22474d4ea001c05d`
  - `pages-32-33.png` — `6769033ea8fe29cbf29042ee1a87a0acac29c014e44b67386849eba74edbad99`
- Contexts: toy-store/city-street errand; domestic argument/stairs/desk search; exterior catastrophe.
- Blind observations: realistic spatial settings and recognizable anatomy are combined with expressive horror faces; shelves, toys, streets, rooms, loose objects, rain and hatching make information density consistently high; contours and faces are hard, angular and heavily inked rather than soft. The printed pp.18→19 desk-search sequence is continuous: running/upstairs and grasping/opening lead into forceful drawer emptying and falling/scattered contents; the later catastrophe spread independently shows strong speed/rain/impact emphasis.
- Local vector:
  - `artRealism`: known `3`, confidence `0.84`
  - `artDensity`: known `4`, confidence `0.91`
  - `visualSoftness`: known `0`, confidence `0.93`
  - `motionImpact`: known `4`, confidence `0.87`; exact bounded sequence `pages-20-21.png` printed pp.18→19, start = boy runs/reaches desk, development = drawers are opened and searched, impact/end = contents are dumped/fall and remain scattered.

## work-f50fa290eb4116a7078e — 11人いる！

- Official sample: `https://e-comi.shogakukan.co.jp/books/091910110000d0000000`, `11人いる!`, official Shogakukan e-comi single volume.
- Mapping limitation: the official volume also contains the sequel and `スペース ストリート`; the official contents page places the original `11人いる！` at p.3 and the sequel at p.125, so requested pages 8–13 are confined to the original story opening.
- Files:
  - `pages-8-9.png` — `a29efba575dc7ab660ddc5d1e603f08ffeebb9ceec5bd27533bb2ede15e28c20`
  - `pages-10-11.png` — `db6f872bf3f796dc41c549550209088a6fd783c87ba34379c02a2eb5e937b9c4`
  - `pages-12-13.png` — `b7bf8706baf3b83768e198ed3d6dc510cc5de63418591e8e3e3a79e04c435dbc`
- Contexts: examination-pod/control puzzle; candidates' briefing and group assembly; outer-space transfer and entry hatch.
- Blind observations: figures use credible proportions and differentiated faces but remain visibly stylized; repeated pods, machinery, group blocking and spacecraft establish above-balanced information density; linework and faces are clean, elegant and rounded without reaching an extremely soft anchor. The pp.12→13 zero-gravity transfer is continuous but deliberately restrained: departure/floating, orderly drift, then hatch entry, with little speed-line or impact emphasis.
- Local vector:
  - `artRealism`: known `3`, confidence `0.82`
  - `artDensity`: known `3`, confidence `0.86`
  - `visualSoftness`: known `3`, confidence `0.84`
  - `motionImpact`: known `0`, confidence `0.78`; exact bounded sequence `pages-12-13.png`, start = candidates leave/fan out from the structure, development = bodies drift toward the ship, end = candidates reach/enter the hatch. The sequence satisfies continuity but visually anchors at restrained motion.

## work-a089c0eef91d1213da38 — うる星やつら

- Official sample: `https://e-comi.shogakukan.co.jp/books/091207160000d0000000`, `うる星やつら 〔新装版〕 1`, official Shogakukan e-comi new-edition volume 1.
- Mapping limitation: this is an official new edition rather than frozen representative standard-edition ISBN `9784091204417`; the requested sample visibly begins with the original first story, but typography/restoration/reproduction can be edition-specific.
- Files:
  - `pages-6-7.png` — `e881869776d3349967c4110ab1d188df5ca0786cf8fdd8c7a1933a5c0c6ada2f`
  - `pages-14-15.png` — `3778c15d7e99505aa4c87b64f94337dde2845a503e0ab567b0fef81f21fb9106`
  - `pages-22-23.png` — `be08f55007986956d11b60f001e2101878504041fa442ccfd62e130b4f82a8a6`
- Contexts: neighborhood argument/chase/bridge splash; public tag match; training and repeated chase/impact action.
- Blind observations: bodies and reactions are deliberately elastic and cartoon-deformed, while props/backgrounds keep scenes legible; panels carry many figures, dialogue balloons, speed marks and setting cues but are not maximally rendered; contour character is mostly neutral-clean with round faces amid sharp comic reactions. Pages 14→15 contain a continuous tag attempt with approach/lunge, airborne dodge and failed endpoint; pages 22→23 independently repeat explosive kicks, hits and flight with strong speed/impact marks.
- Local vector:
  - `artRealism`: known `1`, confidence `0.91`
  - `artDensity`: known `3`, confidence `0.84`
  - `visualSoftness`: known `2`, confidence `0.79`
  - `motionImpact`: known `4`, confidence `0.94`; exact bounded sequence `pages-14-15.png`, start = Ataru closes in/begins the tag attempt, development = full-page diagonal lunge while Lum flies/dodges, impact/end = the attempt passes/fails and separation is shown.

## work-14e489bf1afd1587c44a — YAWARA！

- Official sample: `https://e-comi.shogakukan.co.jp/books/091813410000d0000000`, `ＹＡＷＡＲＡ！ 完全版 デジタル Ver. 1`, official Shogakukan e-comi complete-digital volume 1.
- Mapping limitation: Shogakukan's official endpoint for frozen representative ISBN `9784091813411` redirects to this same JDCN body, strongly linking the canonical entry; nevertheless the product states additions/corrections, full color restoration, and re-editing of 20 complete-edition volumes into 29 digital volumes. Values therefore describe this official digital entry sample and are not claims about identical paper reproduction.
- Files:
  - `pages-8-9.png` — `9263e39d58e55e6907405025bb621cdd612d6c7bd47d9667ddce36d13bfb080e`
  - `pages-14-15.png` — `10019c36357d8a976a3e90797de7cfe13b1514c9e02d7a3782fc05d024ce3fef`
  - `pages-22-23.png` — `fe88678ab2bf6991bd12011fa3b1568c91066e2328b86ed79edaa84b1d8b1e9a`
- Contexts: city phone booth/reporter/crowd; dojo conversation and magazine reveal; dojo mechanism/opening and approaching visitors.
- Blind observations: anatomy, urban perspective and architectural space are relatively realistic but still manga-stylized; density is balanced, with selective street/dojo detail and ample readable negative space; clean contours and composed faces are neutral rather than especially soft or rough. The printed pp.16→19 mechanism/door passage is continuous and bounded (grasp/pull, rattling development, opened-door endpoint), but its kinetic treatment is mild; the earlier crowd run supplies additional ordinary movement without strong impact.
- Local vector:
  - `artRealism`: known `3`, confidence `0.79`
  - `artDensity`: known `2`, confidence `0.75`
  - `visualSoftness`: known `2`, confidence `0.73`
  - `motionImpact`: known `1`, confidence `0.69`; exact bounded sequence spans `pages-22-23.png`, printed pp.16→19, start = grandfather grasps/pulls the mechanism, development = door/shutter rattles and moves, end = opening is complete and the resulting space/approach is shown.

## Local gate conclusion

All four packets contain six readable internal pages and at least two materially distinct contexts. Each motion decision is tied to a continuous bounded passage, not inferred from genre, cover, synopsis, or isolated pose. No Art-only hard blocker was found. All judgments remain model review (`reviewedByHuman=false`) and edition-bounded.
