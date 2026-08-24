# Pilot 001 Annotation Pass A — chunk 01

## Packet and isolation attestation

- Packet candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`.
- Policy rebind: the Factor Dictionary, annotation guide, source rows, and Art preflight bytes are unchanged; `promotion-evidence-v2`, its review request, batch-ledger policy, and the official Golgo volume-content mapping were added after this draft. Pass B must independently enforce the new method.
- Policy inputs were read in full: `docs/factors/factor-dictionary.md` and `docs/factors/annotation-guide.md`.
- Annotation inputs were limited to the frozen packet's `source/works.csv`, `source/volumes.csv`, `research/chunk-01.md`, `research/art-capability-preflight.md`, `manifest.json`, and `PAYLOAD.sha256`, plus the four explicitly authorized temporary Golgo preview images.
- The checked input hashes match the packet ledger for `source/works.csv` (`129905489d0cca3368773f9ba2cf48f29b2af0fe71246139914d3581b30ecb71`), `source/volumes.csv` (`0cc7ded7b16252c7d4e5c4d36bb299e04951cb817f8517a4fc6dc4fb783f02ca`), `research/chunk-01.md` (`b704a96c7bbf794da17f483c16284d74b61080566d3f5b767d390d0189f4bbae`), and `research/art-capability-preflight.md` (`b1e375c58afc705ba6ee433657d0d821967741b1deedcaed4c0dc154e4c9bec2`).
- Existing Gold or source Factor, Genre, Theme, recommendation-context, eligibility, and catalog-role annotations were not read. No eligibility, catalog role, or recommendation context is proposed here.
- Every judgment is scoped to the entry experience (`entry_1_3_volumes`). A `known 0` means observed structural absence in the frozen evidence, not dislike. All other unsupported claims remain `unknown`.

## work-0262dcaa820443c3185d — ゴルゴ13

Evidence ID: `ev-pilot-001-a-work-0262dcaa820443c3185d`. Frozen representative volume is standard volume 1, ISBN `9784845800018`.

### Genre and Theme rationale

- `action`: the official publisher identifies the lead as an elite professional sniper carrying out international assignments, and the inspected official pages contain a continuous violent escape sequence. Sources: https://www.leed.co.jp/9784845800018 and https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `combat` centrality 2: pages 6–11 make physical confrontation, evasion, and armed pursuit a sustained sequence rather than incidental background. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `politics` centrality 1: the official work description places assignments across international and political settings, but the frozen sample does not establish politics as the core of every early episode. Source: https://e-comi.shogakukan.co.jp/books/091794010001d0000000
- `workplace` centrality 2: commissioned professional assignments are the repeated premise used to define the work. Sources: https://www.leed.co.jp/9784845800018 and https://e-comi.shogakukan.co.jp/books/091794010001d0000000

### Known Axis rationale

- `progression=0` (0.82): the lead enters as an already top-class professional and the frozen premise is repeat assignment execution, not repeated acquisition or mastery reward. Sources: https://www.leed.co.jp/9784845800018 and https://e-comi.shogakukan.co.jp/books/091794010001d0000000
- `problemSolving=2` (0.72): the assignment premise and pages 6–11 mix situational reading and evasion with direct violence; there is evidence for a blend, but not for puzzle-like analysis as the sole reward. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `strategy=2` (0.68): the professional-assignment premise implies preparation, while the inspected entry sequence shows only short tactical responses, not enough for long-range strategy 4. Sources: https://e-comi.shogakukan.co.jp/books/091794010001d0000000 and https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `pacing=4` (0.88): pages 4–11 move in short intervals from observation and bedroom conversation to intrusion, multiple exchanges, escape, pursuit, and arrest, with repeated location/status changes. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `worldBuilding=2` (0.70): international criminal and political settings function directly in the assignment premise, but the evidence does not show a dense rules/history system. Source: https://e-comi.shogakukan.co.jp/books/091794010001d0000000
- `characterArcWeight=0` (0.70): the frozen premise presents a fixed expert executing cases, and the inspected sequence rewards operation/event resolution rather than personal change. Sources: https://www.leed.co.jp/9784845800018 and https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `relationshipStructure=0` (0.86): the official premise and pages 4–11 remain centered on the solitary professional, with transient counterparties rather than a fixed team or ensemble. Sources: https://e-comi.shogakukan.co.jp/books/091794010001d0000000 and https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `comedy=0` (0.80): the official premise and all eight inspected entry pages treat sex, intrusion, fighting, and pursuit without a repeated gag structure. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `darkness=3` (0.88): commissioned killing and criminal violence are central, while the entry sample is harsh without establishing uninterrupted tragedy at level 4. Sources: https://www.leed.co.jp/9784845800018 and https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `mentalStress=1` (0.72): danger is immediate, but the lead remains controlled and decisive throughout pages 4–11; psychological breakdown or sustained anxious delay is not the reward. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `romance=0` (0.84): a sexual/bedroom context appears on pages 4–5, but neither the official premise nor the sequence treats a romantic bond as plot structure. Sources: https://e-comi.shogakukan.co.jp/books/091794010001d0000000 and https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `emotionalWarmth=0` (0.82): pages 4–11 are emotionally detached and transactional, followed by violence and flight; no bond or healing payoff is present. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `artRealism=4` (0.93): pages 4–11 consistently use realistic adult proportions, musculature, facial anatomy, clothing, furniture, architecture, and depth. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `artDensity=3` (0.91): pages 4–5 show detailed fabric, curtains, furniture, brickwork, smoke, and facial shading; pages 8–11 add textured walls, rooms, stairs, uniforms, and exterior depth, while some action panels intentionally simplify. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `visualSoftness=0` (0.94): pages 4–11 use hard jawlines, angular brows, coarse hatching, heavy blacks, and sharp speed strokes rather than soft or ornamental rendering. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- `motionImpact=4` (0.95): the continuous sequence begins with the punch on page 6, continues through close-range strikes and throws on pages 7–9, and ends with the window escape and armed pursuit on pages 10–11; speed lines, impact lettering, body deformation, and changing camera distance emphasize force. Source: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000

### Unknowns, observations, and conflicts

- `mysteryReveal` is unknown: neither the short work descriptions nor pages 4–11 establish clue/reveal as a repeated entry reward.
- Art edition note: the inspected sample is official viewer pages 4–11 from the electronic volume identified by `jdcn=091794010001d0000000`; the packet representative is the Leed SP Comics volume 1 ISBN above. The two official product pages list the same title, author, volume number, lead story `ビッグ・セイフ作戦`, and the same other three stories, so the paper and digital products are content-equivalent entry volume 1 despite their different media. Sources: https://www.leed.co.jp/9784845800018 and https://e-comi.shogakukan.co.jp/books/091794010001d0000000 (retrieved 2026-08-22).
- Page contexts: pages 4–5 bedroom/watchful pause; pages 6–7 intrusion and first blows; pages 8–9 continued interior brawl and movement toward escape; pages 10–11 window exit, stair/exterior movement, and armed interception.
- Identity conflict: none at Work or representative-volume content level in the frozen inputs. Safety conflict: none proving adult-only classification, but explicit `adult=false` is absent and must remain a separate safety gate.

## work-9d5d64262dbc2893acd4 — ポーの一族

Evidence ID: `ev-pilot-001-a-work-9d5d64262dbc2893acd4`. Frozen representative volume is standard volume 1, ISBN `9784091300010`.

### Genre and Theme rationale

- `fantasy` and `horror`: the official work page directly centers an ageless vampanella clan and Edgar across eras. Source: https://e-comi.shogakukan.co.jp/books/091300010000d0000000
- No canonical Theme is assigned: the frozen descriptions support supernatural world and relationship Axes but do not directly establish one of the 22 Theme mechanics at a defensible centrality.

### Known Axis rationale

- `mysteryReveal=2` (0.72): the hidden nature and continuity of the immortal clan supply secrets/revelations, but the source does not show investigation or revelation as the sole recurring reward. Source: https://e-comi.shogakukan.co.jp/books/091300010000d0000000
- `worldBuilding=3` (0.82): an ageless clan moving across historical periods makes supernatural rules and time context repeatedly important, without enough detail for level 4. Sources: https://e-comi.shogakukan.co.jp/books/091300010000d0000000 and https://www.shogakukan.co.jp/news/240678
- `characterArcWeight=3` (0.76): the publisher retrospective frames the work's long history through Edgar and connected characters, indicating character/relationship reward alongside the supernatural premise. Source: https://www.shogakukan.co.jp/news/240678
- `relationshipStructure=3` (0.78): the clan and recurring characters across eras exceed a solitary lead or fixed pair, but the frozen text is insufficient to assert a full level-4 ensemble. Sources: https://e-comi.shogakukan.co.jp/books/091300010000d0000000 and https://www.shogakukan.co.jp/news/240678
- `darkness=3` (0.78): immortal vampires, death, and tragedy are core framing, while the short text does not establish level-4 sustained cruelty throughout the entry range. Sources: https://e-comi.shogakukan.co.jp/books/091300010000d0000000 and https://www.shogakukan.co.jp/news/240678

### Unknowns and conflicts

- `progression`, `problemSolving`, `strategy`, and `pacing` are unknown: the frozen synopsis and retrospective do not describe repeated growth, analytical solutions, planning cadence, or interval of state changes.
- `comedy`, `mentalStress`, `romance`, and `emotionalWarmth` are unknown: the sources do not quantify their early frequency, explicitly warn that romance/psychological pressure cannot be fixed from the short synopsis, and absence of mention is not value 0.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: the official preview URL https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091300010000d0000000 was not visually inspected in this pass.
- Identity uncertainty: the official editorial notes later sequel material, which must remain separate from the original Work during review. Safety conflict: none proving adult-only classification; explicit `adult=false` is absent.

## work-98d513b70560f2f96a38 — 漂流教室

Evidence ID: `ev-pilot-001-a-work-98d513b70560f2f96a38`. Frozen representative volume is standard volume 1, ISBN `9784091200013`.

### Genre and Theme rationale

- `scienceFiction` and `horror`: the official publisher describes an entire school transported into a ruined future and the ensuing extreme threat. Sources: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/ and https://e-comi.shogakukan.co.jp/books/091931710000d0000000
- `survival` centrality 2: student and staff attempts to remain alive are the repeated core structure. Source: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/
- `postApocalypse` centrality 2: the ruined future is not a passing location; it is the central environment that creates the survival problem. Sources: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/ and https://e-comi.shogakukan.co.jp/books/091931710000d0000000

### Known Axis rationale

- `problemSolving=2` (0.70): the group must respond to survival constraints, but the description supports a mix of analysis and direct action rather than clever analysis as the sole core. Source: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/
- `pacing=3` (0.78): the entry premise causes immediate large changes in place, safety, and social order, with continuing survival incidents rather than a static setup. Sources: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/ and https://e-comi.shogakukan.co.jp/books/091931710000d0000000
- `mysteryReveal=2` (0.72): the unexplained displacement and nature of the future introduce secrets, while survival remains at least as important as reveal. Source: https://e-comi.shogakukan.co.jp/books/091931710000d0000000
- `worldBuilding=3` (0.82): the devastated future and its conditions repeatedly constrain the group, but the short synopsis does not document enough rules/history for level 4. Sources: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/ and https://e-comi.shogakukan.co.jp/books/091931710000d0000000
- `relationshipStructure=4` (0.88): a whole school population of students and staff faces the crisis together, making group relations and conflict structurally central. Source: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/
- `darkness=4` (0.92): ruined civilization, death, violence, and children in extreme danger form the work's central condition rather than isolated episodes. Source: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/
- `mentalStress=4` (0.92): the trapped group faces sustained uncertainty and survival pressure in a hostile future; psychological pressure is inherent to the core setup. Source: https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/

### Unknowns and conflicts

- `progression`, `strategy`, and `characterArcWeight` are unknown: the synopsis does not establish repeated mastery rewards, long-range planning, or the relative weight of individual change versus crisis events.
- `comedy`, `romance`, and `emotionalWarmth` are unknown: extreme horror does not by itself prove these elements are absent, and no early frequency evidence was visually checked.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: the official preview URL https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091931710000d0000000 was not visually inspected.
- Identity uncertainty: the official electronic edition must be kept grouped with, not split from, the representative standard volume; exact edition mapping remains review work. Safety conflict: none proving adult-only classification, though violent content requires the separate safety gate.

## work-f50fa290eb4116a7078e — 11人いる！

Evidence ID: `ev-pilot-001-a-work-f50fa290eb4116a7078e`. Frozen representative ISBN is `9784091788115`, edition kind `standard`; its `volumeNumber` and the Work's `firstPublishedYear` are blank.

### Genre and Theme rationale

- `scienceFiction` and `mystery`: the official sources directly describe a space-university final test, a sealed ship, and an unexplained eleventh person among ten candidates. Sources: https://shogakukan-comic.jp/news/17107 and https://e-comi.shogakukan.co.jp/books/091910110000d0000000
- `survival` centrality 2: remaining safe within the closed-ship test and its dangers is a core continuous condition. Sources: https://shogakukan-comic.jp/news/17107 and https://e-comi.shogakukan.co.jp/books/091910110000d0000000
- `investigation` centrality 2: identifying the unexplained extra person is the defining question rather than an incidental subplot. Sources: https://shogakukan-comic.jp/news/17107 and https://e-comi.shogakukan.co.jp/books/091910110000d0000000

### Known Axis rationale

- `progression=0` (0.78): this is a bounded final test/mystery, not a repeated acquisition or mastery reward loop. Source: https://shogakukan-comic.jp/news/17107
- `problemSolving=3` (0.86): the group must reason about the numerical inconsistency and manage constraints in a sealed ship; direct survival action prevents an unsupported level 4. Sources: https://shogakukan-comic.jp/news/17107 and https://e-comi.shogakukan.co.jp/books/091910110000d0000000
- `mysteryReveal=4` (0.94): the discrepancy between ten candidates and eleven occupants is the explicit central premise and expected truth-reveal reward. Sources: https://shogakukan-comic.jp/news/17107 and https://e-comi.shogakukan.co.jp/books/091910110000d0000000
- `worldBuilding=2` (0.76): space-university admission and the closed-ship test provide functional rules, but the evidence does not show a level-4 history/culture system. Source: https://shogakukan-comic.jp/news/17107
- `relationshipStructure=4` (0.90): the premise is explicitly built around eleven uncertain occupants whose trust and identities form the problem. Sources: https://shogakukan-comic.jp/news/17107 and https://e-comi.shogakukan.co.jp/books/091910110000d0000000
- `darkness=2` (0.76): confinement and survival danger are serious, but the descriptions do not establish cruelty or tragedy as the dominant aesthetic.
  Source: https://shogakukan-comic.jp/news/17107
- `mentalStress=4` (0.88): an unidentified extra person inside a sealed exam ship creates continuous distrust and pressure central to the story. Sources: https://shogakukan-comic.jp/news/17107 and https://e-comi.shogakukan.co.jp/books/091910110000d0000000

### Unknowns and conflicts

- `strategy`, `pacing`, and `characterArcWeight` are unknown: the premise does not show long-range planning, interval of status changes, or whether personal change outweighs the mystery.
- `comedy`, `romance`, and `emotionalWarmth` are unknown: the frozen text does not establish their presence or absence.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: the official preview URL https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091910110000d0000000 was not visually inspected.
- Identity/metadata conflict: the representative ISBN exists, but blank `volumeNumber` and blank `firstPublishedYear` prevent a clean volume-one/year assertion and require adjudication. The named sequel must remain a separate Work relation. Safety conflict: none proving adult-only classification; explicit `adult=false` is absent.

## work-a089c0eef91d1213da38 — うる星やつら

Evidence ID: `ev-pilot-001-a-work-a089c0eef91d1213da38`. Frozen representative volume is standard volume 1, ISBN `9784091204417`.

### Genre and Theme rationale

- `scienceFiction`, `comedy`, and `romance`: the official publisher describes Ataru's contest with the Oni, Lum's arrival, aliens intruding on school life, and an ongoing romantic-comedy commotion. Sources: https://adpocket.shogakukan.co.jp/adnews/13902/ and https://e-comi.shogakukan.co.jp/books/091207160000d0000000
- `school` centrality 1: school is a recurring social setting named by the publisher, but alien and romantic commotion is the stronger core. Source: https://adpocket.shogakukan.co.jp/adnews/13902/

### Known Axis rationale

- `progression=0` (0.78): the official description presents recurring status-quo romantic/alien disturbances, not a mastery or acquisition reward loop. Source: https://adpocket.shogakukan.co.jp/adnews/13902/
- `problemSolving=0` (0.68): the defining events are contests, misunderstandings, and comic commotion rather than repeated constraint analysis; confidence is limited because no internal pages were inspected. Source: https://adpocket.shogakukan.co.jp/adnews/13902/
- `strategy=0` (0.78): neither the alien-romance premise nor the repeated school commotion centers long plans, warfare, politics, or resource operation. Sources: https://adpocket.shogakukan.co.jp/adnews/13902/ and https://e-comi.shogakukan.co.jp/books/091207160000d0000000
- `pacing=3` (0.80): alien arrivals, contests, school disruption, and romantic misunderstandings are described as successive commotion with frequent state changes. Source: https://adpocket.shogakukan.co.jp/adnews/13902/
- `mysteryReveal=0` (0.82): the official descriptions explain the alien premise openly and frame comedy/romance, not clue-and-reveal, as the reward. Sources: https://adpocket.shogakukan.co.jp/adnews/13902/ and https://e-comi.shogakukan.co.jp/books/091207160000d0000000
- `worldBuilding=2` (0.78): alien species and their intrusion into ordinary school life supply functional setting rules, without evidence for a dense level-4 system. Sources: https://adpocket.shogakukan.co.jp/adnews/13902/ and https://e-comi.shogakukan.co.jp/books/091207160000d0000000
- `characterArcWeight=2` (0.66): lead relationships matter alongside episodic incidents, but the status-quo comedy description does not support character-change dominance.
  Source: https://adpocket.shogakukan.co.jp/adnews/13902/
- `relationshipStructure=3` (0.82): Ataru and Lum are the center, while aliens and school characters repeatedly expand the relationship network beyond a fixed pair. Sources: https://adpocket.shogakukan.co.jp/adnews/13902/ and https://e-comi.shogakukan.co.jp/books/091207160000d0000000
- `comedy=4` (0.94): the publisher directly defines continuing alien/school romantic commotion as the work's central structure. Source: https://adpocket.shogakukan.co.jp/adnews/13902/
- `darkness=0` (0.88): the official presentation consistently frames the invasion premise as light romantic comedy rather than sustained danger or tragedy. Sources: https://adpocket.shogakukan.co.jp/adnews/13902/ and https://e-comi.shogakukan.co.jp/books/091207160000d0000000
- `mentalStress=1` (0.74): conflict and embarrassment recur, but the official framing is comic and does not indicate sustained anxiety or psychological collapse. Source: https://adpocket.shogakukan.co.jp/adnews/13902/
- `romance=4` (0.92): Ataru and Lum's relationship and continued love-comedy complications are defining, not a side plot. Sources: https://adpocket.shogakukan.co.jp/adnews/13902/ and https://e-comi.shogakukan.co.jp/books/091207160000d0000000

### Unknowns and conflicts

- `emotionalWarmth` is unknown: a romantic-comedy label does not prove that healing or warmth is a central reward.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: the official preview URL https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091207160000d0000000 was not visually inspected, and the packet notes possible re-edited/new-edition presentation.
- Identity uncertainty: the official electronic/new edition must map to the canonical original without becoming a duplicate Work; exact edition relation remains review work. Safety conflict: no adult-only label is evidenced, but sexual jokes/exposure and the absence of explicit `adult=false` require the separate safety gate.

## work-671e3453cf9e1df2ee87 — 陽だまりの樹

Evidence ID: `ev-pilot-001-a-work-671e3453cf9e1df2ee87`. Frozen representative volume is standard volume 1, ISBN `9784091806017`.

### Genre and Theme rationale

- `historical`: the official rightsholder directly places the paired lives of samurai Ibuya Manjiro and doctor Tezuka Ryoan in the late Tokugawa upheaval. Source: https://tezukaosamu.net/jp/manga/380.html
- `politics` centrality 1: political upheaval shapes the era and lives, but the frozen description does not show politics driving every entry episode. Source: https://tezukaosamu.net/jp/manga/380.html
- `historicalReconstruction` centrality 2: the named historical era, social roles, disease/medicine, and two lives across the transition are the work's repeated framework. Source: https://tezukaosamu.net/jp/manga/380.html

### Known Axis rationale

- `worldBuilding=4` (0.90): late-Tokugawa institutions, medicine, political transition, and social roles repeatedly matter to the two protagonists' lives. Source: https://tezukaosamu.net/jp/manga/380.html
- `characterArcWeight=4` (0.90): the official synopsis defines the work through the contrasting lives of two named protagonists over years, making personal trajectories the core reward. Source: https://tezukaosamu.net/jp/manga/380.html
- `relationshipStructure=2` (0.84): the dual leads and surrounding historical figures exceed a solitary protagonist, while the frozen synopsis does not prove a level-4 multi-view ensemble. Source: https://tezukaosamu.net/jp/manga/380.html
- `darkness=2` (0.78): disease, violence, and political turmoil create serious danger and tragedy, but the official synopsis alone does not support sustained level-4 bleakness. Source: https://tezukaosamu.net/jp/manga/380.html

### Unknowns and conflicts

- `progression`, `problemSolving`, `strategy`, `pacing`, and `mysteryReveal` are unknown: the official synopsis does not give repeated reward/cadence evidence for these axes.
- `comedy`, `mentalStress`, `romance`, and `emotionalWarmth` are unknown: their entry frequency and centrality are not stated.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: no authorized internal-page sample was visually inspected for this Work.
- Identity conflict: none visible between the official rightsholder identity and frozen Work/volume. Safety conflict: the source does not mark the work adult-only, but explicit current sales classification and `adult=false` are absent.

## work-14e489bf1afd1587c44a — YAWARA！

Evidence ID: `ev-pilot-001-a-work-14e489bf1afd1587c44a`. Frozen representative volume is standard volume 1, ISBN `9784091813411`.

### Genre and Theme rationale

- `sports`, `comedy`, and `romance`: the official publisher centers a gifted judoka who wants ordinary life while training, competing, and navigating relationships. Sources: https://bigcomicbros.net/7350/ and https://e-comi.shogakukan.co.jp/books/091813410000d0000000
- `sportsCompetition` centrality 2: judo training and competition repeatedly conflict with Yawara's desired ordinary life and drive the premise. Sources: https://bigcomicbros.net/7350/ and https://e-comi.shogakukan.co.jp/books/091813410000d0000000

### Known Axis rationale

- `progression=4` (0.90): training, latent ability, and repeated judo competition make skill and achievement rewards explicit and central. Sources: https://bigcomicbros.net/7350/ and https://e-comi.shogakukan.co.jp/books/091813410000d0000000
- `mysteryReveal=0` (0.84): the official premise openly frames sport, ordinary-life conflict, and relationships rather than secrets or clue/reveal reward. Source: https://bigcomicbros.net/7350/
- `worldBuilding=0` (0.84): the setting is ordinary contemporary life and judo competition; no recurring invented rules, factions, or history beyond the sport itself are established. Source: https://bigcomicbros.net/7350/
- `characterArcWeight=4` (0.88): Yawara's conflict between her own ordinary-life desire and imposed judo expectations is the defining personal drama. Source: https://bigcomicbros.net/7350/
- `relationshipStructure=3` (0.80): grandfather, competitors, observers, and romantic relationships repeatedly surround the central lead, but the evidence stops short of a level-4 ensemble. Sources: https://bigcomicbros.net/7350/ and https://e-comi.shogakukan.co.jp/books/091813410000d0000000
- `comedy=3` (0.82): the official publisher presents the mismatch between ordinary-life desire and elite judo expectation as recurring comedy alongside sport and romance. Source: https://bigcomicbros.net/7350/
- `darkness=0` (0.87): the official entry framing is ordinary-life sports comedy/romance without sustained tragedy or a cruel world. Source: https://bigcomicbros.net/7350/
- `mentalStress=2` (0.79): pressure from talent, training, and others' expectations conflicts with Yawara's desired life, but comedy and active competition prevent a level-4 sustained breakdown reading. Source: https://bigcomicbros.net/7350/
- `romance=2` (0.82): relationships are explicitly part of the work, while sport and personal conflict remain at least equally central. Sources: https://bigcomicbros.net/7350/ and https://e-comi.shogakukan.co.jp/books/091813410000d0000000

### Unknowns and conflicts

- `problemSolving`, `strategy`, and `pacing` are unknown: the official descriptions do not document tactical reads, long planning, or the interval of entry changes.
- `emotionalWarmth` is unknown: the presence of relationships and comedy does not establish healing/warmth as the central payoff.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: the official preview URL https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091813410000d0000000 was not visually inspected, so judo alone cannot determine motion impact.
- Identity uncertainty: the frozen notes warn that the electronic/complete-edition product must be related to the original edition without duplicate Work creation. Safety conflict: none proving adult-only classification; explicit `adult=false` is absent.

## work-ad2b80b81b7bc9b602a3 — Papa told me

Evidence ID: `ev-pilot-001-a-work-ad2b80b81b7bc9b602a3`. Frozen representative volume is standard volume 1, ISBN `9784088640136`.

### Genre and Theme rationale

- `sliceOfLife`: the official publisher directly describes the everyday life built by a father and daughter. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501
- No canonical Theme is assigned: biological parent-child life is not `foundFamily`, and the frozen description does not establish another one of the 22 mechanics.

### Known Axis rationale

- `progression=0` (0.78): the official premise is recurring domestic life and relationship experience, not acquisition or mastery rewards. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501
- `pacing=1` (0.72): everyday father-daughter situations imply small local changes rather than rapid goal/location/status shifts, while internal pages were not inspected. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501
- `mysteryReveal=0` (0.82): the publisher describes open domestic/relationship episodes rather than secrets and clue resolution. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501
- `worldBuilding=0` (0.80): the ordinary household setting has no evidenced recurring invented rules, history, or factions. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501
- `characterArcWeight=4` (0.88): the father-daughter lives and relationship are the stated subject rather than external goals or spectacle. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501
- `relationshipStructure=2` (0.90): one stable father-daughter pair is the clear core; no multi-view ensemble is established. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501
- `darkness=0` (0.82): the official general-market description frames ordinary family life without a central cruel or tragic world. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501
- `emotionalWarmth=4` (0.90): the repeated payoff explicitly comes from a father and daughter making a life together and their bond. Source: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501

### Unknowns and conflicts

- `problemSolving`, `strategy`, `comedy`, `mentalStress`, and `romance` are unknown: the short official description does not establish their early frequency or absence.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: the official preview URL https://www.shueisha.co.jp/books/reader/main.php?cid=08864013864013315501 was not visually inspected; household subject matter cannot justify `notApplicable` for motion.
- Identity conflict: none visible between the publisher identity and frozen Work/volume. Safety conflict: the general-market page has no adult-only indication, but explicit `adult=false` is absent.

## work-39555fe7402dada0d79f — 名探偵コナン

Evidence ID: `ev-pilot-001-a-work-39555fe7402dada0d79f`. Frozen representative volume is standard volume 1, ISBN `9784091233714`.

### Genre and Theme rationale

- `mystery`: the official serialization page defines a detective transformed into a child who repeatedly solves cases while facing the Black Organization. Sources: https://websunday.net/work/720/ and https://adpocket.shogakukan.co.jp/mangaplanning/detail/349c41201b62db851192665c504b350ff98c6b45fb62a8a2161f78b6534d8de9/
- `investigation` centrality 2: case investigation and solution are the repeated core mechanism. Source: https://websunday.net/work/720/
- `school` centrality 1: the transformed child's school identity recurs, but case investigation is the stronger central structure. Sources: https://websunday.net/work/720/ and https://adpocket.shogakukan.co.jp/mangaplanning/detail/349c41201b62db851192665c504b350ff98c6b45fb62a8a2161f78b6534d8de9/

### Known Axis rationale

- `progression=0` (0.82): Shinichi enters as a capable detective; repeated reward is solving cases, not accumulating skill or rank. Source: https://websunday.net/work/720/
- `problemSolving=4` (0.95): identifying constraints, reading clues, and solving crimes is explicitly the repeated core action. Sources: https://websunday.net/work/720/ and https://adpocket.shogakukan.co.jp/mangaplanning/detail/349c41201b62db851192665c504b350ff98c6b45fb62a8a2161f78b6534d8de9/
- `strategy=2` (0.82): case plans, concealment of identity, and countering the organization require short tactical planning, while the work is not defined solely by long-range resource/political strategy. Sources: https://websunday.net/work/720/ and https://adpocket.shogakukan.co.jp/mangaplanning/detail/349c41201b62db851192665c504b350ff98c6b45fb62a8a2161f78b6534d8de9/
- `pacing=3` (0.82): repeated cases create frequent incident, clue, confrontation, and resolution changes, alongside a slower organization thread. Source: https://websunday.net/work/720/
- `mysteryReveal=4` (0.95): clue interpretation and truth disclosure are the explicit repeated payoff. Source: https://websunday.net/work/720/
- `worldBuilding=2` (0.80): the shrinking drug, secret organization, concealed identity, and recurring cast supply functional rules, but the evidence does not show a dense level-4 constructed world. Sources: https://websunday.net/work/720/ and https://adpocket.shogakukan.co.jp/mangaplanning/detail/349c41201b62db851192665c504b350ff98c6b45fb62a8a2161f78b6534d8de9/
- `relationshipStructure=3` (0.83): the protagonist, surrounding detectives/family/school figures, and Black Organization form a recurring network, but the official description remains protagonist-led rather than fully level-4 ensemble. Source: https://adpocket.shogakukan.co.jp/mangaplanning/detail/349c41201b62db851192665c504b350ff98c6b45fb62a8a2161f78b6534d8de9/
- `darkness=3` (0.85): murder cases and a criminal organization repeatedly create severe danger, while the general-audience case format prevents an unsupported claim of uniformly level-4 bleakness. Sources: https://websunday.net/work/720/ and https://adpocket.shogakukan.co.jp/mangaplanning/detail/349c41201b62db851192665c504b350ff98c6b45fb62a8a2161f78b6534d8de9/
- `mentalStress=2` (0.78): concealed identity and organization threat create recurring pressure, but active case resolution mixes stress with competence. Source: https://adpocket.shogakukan.co.jp/mangaplanning/detail/349c41201b62db851192665c504b350ff98c6b45fb62a8a2161f78b6534d8de9/

### Unknowns and conflicts

- `characterArcWeight`, `comedy`, `romance`, and `emotionalWarmth` are unknown: the frozen official descriptions do not establish their entry-level frequency or relative reward weight.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: the official preview URL https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091233710000d0000000 was not visually inspected; action in a detective work cannot determine motion impact by genre.
- Identity conflict: named spin-offs such as `ゼロの日常` and `犯人の犯沢さん` must remain separate rather than merged into this Work. Safety conflict: murder and violence are present but do not prove adult-only classification; explicit `adult=false` is absent.

## work-4a8a22fc766bf9bc4c59 — 天は赤い河のほとり

Evidence ID: `ev-pilot-001-a-work-4a8a22fc766bf9bc4c59`. Frozen representative volume is standard volume 1, ISBN `9784091365019`.

### Genre and Theme rationale

- `fantasy`, `historical`, and `romance`: the official publisher describes a modern girl transported to the ancient Hittite empire, where war, succession politics, and her relationship with prince Kail drive the story. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `combat` centrality 1: violent conflict is present within war and court danger, but romance/politics are at least as central. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `war` centrality 1: war recurs as a major external pressure, without frozen evidence that every entry episode is a war campaign. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `politics` centrality 2: succession struggle and court power are explicit core causes of the protagonist's danger and choices. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `timeTravel` centrality 2: transport from modern life to the Hittite empire creates the work's central identity and ongoing displacement. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000

### Known Axis rationale

- `strategy=3` (0.80): succession conflict and war make coordinated plans and political maneuvering central, but the short description does not support a pure level-4 strategy reading. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `pacing=3` (0.78): the entry moves the protagonist across eras into immediate court threat, war, and a consequential relationship, producing repeated large status changes. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `worldBuilding=4` (0.90): the ancient empire, royal succession, war, and cultural displacement repeatedly determine the protagonist's options and relationships. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `characterArcWeight=4` (0.87): Yuri's adaptation, agency, and bond with Kail are central alongside the external conflict. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `relationshipStructure=3` (0.82): Yuri and Kail are central within a recurring court/rival relationship network, while the frozen synopsis does not prove a full level-4 multi-view ensemble. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `darkness=3` (0.84): war, murder threats, coercion, and succession conflict are central serious dangers, without enough evidence for uniformly level-4 bleakness. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `mentalStress=3` (0.82): sudden displacement, court danger, coercive pressure, and war sustain high strain, while active alliance and romance prevent an unsupported level 4. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000
- `romance=4` (0.93): Yuri and Kail's relationship is explicitly one of the central plot engines rather than a side story. Source: https://e-comi.shogakukan.co.jp/books/091365010000d0000000

### Unknowns and conflicts

- `progression`, `problemSolving`, and `mysteryReveal` are unknown: the frozen description does not show repeated mastery reward, analytical resolution, or clue/reveal cadence.
- `comedy` and `emotionalWarmth` are unknown: romance does not establish either comic frequency or warmth/healing as a repeated payoff.
- `artRealism`, `artDensity`, `visualSoftness`, and `motionImpact` are unknown: the official preview URL https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091365010000d0000000 was not visually inspected; combat in the synopsis cannot justify motion scoring.
- `historicalReconstruction` is intentionally not assigned: an ancient setting alone does not prove that reconstruction is a core mechanic.
- Identity conflict: none visible between the official Work identity and frozen representative volume. Safety conflict: war, threats, and coercive relationship material require separate review but do not prove adult-only classification; explicit `adult=false` is absent.
