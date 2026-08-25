# Batch 005 text-gap recovery round 3 — chunk 03

## Scope and binding

- 조사·조회일: `2026-08-25`
- 대상: `batch-005/frozen-work-set.csv` positions `21–30` only
- 평가 범위: `entry_1_3_volumes` (초반 1–3권 또는 해당 권에 한정된 리뷰)
- `reviewedByHuman=false`
- repository HEAD at packet creation: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- prior terminal text SHA-256: `b7d4427d675f0f7097b5998c099ca5f4e4c63f4dbdc917ec64b3cf89847fde7a`
- prior terminal Genre / Theme SHA-256: `ed6869c24e1d55a2f651ebfd1ee0191c0d2e54156c997eb09be936e877b044f6` /
  `8565742fbe22b73f265857248834573c57c6a312941173eb377b62ab67d7f5d8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- prior round-2 packet SHA-256: `1e7a09fc5be364562f66ffe9a4d31dfafc57dbaf8e5642c3e53a4f0bf6979cc4`

This is a research-only packet. No terminal CSV, Pass A file, source/provenance,
Art, promotion, registry, generated catalog, eligibility, Gold, or blocker state
was changed. Existing known cells and the round-2 rejected/no-op proposals were
not reopened. The proposals below require independent adjudication; they are not
approval or automatic materialization.

The Dictionary anchors were applied literally. A review's star rating, popularity,
genre label, or general impression is not a Factor observation. User-review signals
were used only where two separately authored observations were bounded to the entry
volume range. Art remains out of scope.

## Fresh source routes

| Pos | Work | Source / date | Range and usable observation |
| --: | --- | --- | --- |
| 22 | リューシカ・リューシカ | [MANTANWEB「はじめの1巻」](https://mantan-web.jp/article/20100813dog00m200026000c.html), `2010-08-13`; [Sony Reader Store vol.1 reviews](https://ebookstore.sony.jp/review/title/00211004/id/BT000021100400100101), reviews dated `2010-06-25` and `2013-09-26`; [BookLive vol.1 reviews](https://booklive.jp/review/list/title_id/211004/vol_no/001), review dated `2012-10-15` | The publisher/editor route says the everyday episodes contain high-energy gags. Two separate vol.1 reader entries independently describe the child's repeated wrong-but-serious observations and the author's gag sense. The 2012 entry explicitly says the tone varies by episode, so only mid-level comedy is proposed. |
| 24 | 百舌谷さん逆上する | [楽天ブックス vol.1 reviews](https://books.rakuten.co.jp/rb/5719580/), review `アルファ0334`, `2010-12-31`; [マンガLOG](https://m-kikuchi.hatenablog.com/entry/20090124/1232804076), `2009-01-24`; [コミックシーモア vol.1](https://www.cmoa.jp/title/63124/), accessed `2026-08-25` | The Rakuten vol.1 reader describes dense tragedy/comedy and laughing while crying. The independent manga blog describes the recurring dialogue/character dynamic as producing repeated laughter. The two observations are compatible but not identical; level 4 is not supported. |
| 26 | クジラの子らは砂上に歌う | [BookLive vol.1 reviews](https://booklive.jp/review/list/title_id/247331/vol_no/001), entries `1055` dated `2024-03-11` and `ブクログ` dated `2022-07-29`; official [秋田書店 vol.1](https://www.akitashoten.co.jp/comics/4253261019), `2013-12-16` | Both reader entries are on the volume-1 page and independently observe a peaceful, gentle communal life before the disruptive turn. The first calls the initial life happy/comforting; the second describes the people as gentle and their life as calm, while also noting the later cruelty. This supports mixed warmth, not a uniformly healing tone. |
| 28 | 血潜り林檎と金魚鉢男 | official [KADOKAWA vol.1](https://www.kadokawa.co.jp/product/201108000200/), `2011-10-15`, user entries dated `2011-10-20` and `2017-07-07`; [マンバ新装版 vol.1](https://manba.co.jp/boards/57564/books/1), `2016-01-22`; [Akamegane review of vols.1–3](https://akamegane365museum.blog.fc2.com/blog-entry-381.html), publication date not stated | KADOKAWA's user entry describes the work as a modern horror; its second user entry explicitly reports absurd situations that provoke laughter and asks whether it is gag or horror. The Manba entry independently distinguishes comic everyday scenes from horror at the enemy's appearance and action scenes. The contrast recurs across the bounded opening range and supports comedy at 2 only. |

## New proposals for independent adjudication

| Pos | Work | Proposed cell | Confidence | Proposed evidence ID | Direct Dictionary fit |
| --: | --- | --- | ---: | --- | --- |
| 22 | リューシカ・リューシカ | `comedy=known 2` | 0.78 | `ev-batch-005-r3-work-238c04ae3a3a61451078` | Repeated everyday gags are described by the official editorial route and two distinct entry-volume reader observations, but one reader explicitly notes tonal variation; this is intermittent comedy, not dominant comedy. |
| 24 | 百舌谷さん逆上する | `comedy=known 2` | 0.70 | `ev-batch-005-r3-work-4b4bbe8c10859c46e726` | Two independent bounded observations report comedy mixed with serious material. The conflict between a positive dense-comedy observation and a negative first-volume reaction rules out 4 and requires adjudication rather than averaging. |
| 26 | クジラの子らは砂上に歌う | `emotionalWarmth=known 2` | 0.74 | `ev-batch-005-r3-work-5b7cf2105a4bc6f6b46c` | Two separate vol.1 reader observations repeat a calm, kind community before the crisis while also reporting cruelty. That is the Dictionary's mixed level, not warmth as the sole reward. |
| 28 | 血潜り林檎と金魚鉢男 | `comedy=known 2` | 0.76 | `ev-batch-005-r3-work-62fb5d8e9f6c6bbbeba9` | Two independent range-matched reader routes describe comic everyday material alongside horror/action. This establishes intermittent comedy only; no level-4 claim is made. |

No fresh Theme or Narrative value met the exact Dictionary threshold in this round.
In particular, imagined mysteries in `リューシカ・リューシカ`, relationship
decisions in `娚の一生`/`百舌谷さん逆上する`, village ritual in `千年万年りんごの子`,
music/university activity in `天にひびき`, and training/rescue activity in
`血潜り林檎と金魚鉢男` were not converted into a Theme or numeric Narrative Axis.

## Remaining route exhaustion

| Pos | Remaining gap after this packet | Routes checked in this round | Disposition |
| --: | --- | --- | --- |
| 21 | Theme + 3 Narrative | Existing Shogakukan vols.1–3 and the prior Culture Agency route were rechecked against the Dictionary. Corporate employment and cohabitation do not establish a recurring `workplace` Theme; relationship choices do not establish problem solving or strategy. | Remains `unknown`; no fresh proposal. |
| 22 | Theme + 3 Narrative; Tone still needs additional coverage after the comedy proposal | Square Enix vols.1–3, MANTAN, Sony/BookLive vol.1 reviews | `comedy=2` is the only new cell. Imagined monsters/signs are not a clue/reveal or world-rule mechanic. |
| 23 | Theme + 1 Narrative | Kodansha vols.1–3, MANTAN, and the two Cmoa entries previously checked | The existing `mysteryReveal=2` remains the only qualifying discovery. Ritual/folk belief is not silently remapped to `historicalReconstruction`; no fresh cell. |
| 24 | 2 Narrative + additional Tone coverage | Kodansha vols.1–3, Rakuten vol.1, Cmoa vol.1, MangaLOG | `comedy=2` is proposed. Dialogue density, interpersonal conflict, and emotional decisions do not satisfy problemSolving or strategy. |
| 25 | Theme + 2 Narrative + 3 Tone | Shonengahosha vols.1–3 and the previously checked reader/recommendation routes | University identity, violin/orchestra activity, and reunion are not a legal `school`/`workplace` Theme under the established boundary; no fresh value. |
| 26 | 1 Narrative + 1 Tone | Akita vols.1–3 and BookLive vol.1 reader entries | `emotionalWarmth=2` is proposed. Discovery, survival, and crisis events do not by themselves establish progression, problem solving, or strategy. |
| 27 | 1 Narrative | Shogakukan vols.1–3 and the prior independent review route | The rejected `progression` proposal is not reopened. Elapsed age, relationship change, and hostage movement do not show repeated growth/reward. |
| 28 | 2 Narrative + 2 additional Tone cells after the comedy proposal | KADOKAWA vols.1–3, Manba vol.1, Akamegane vols.1–3 | `comedy=2` is proposed. Repeated missions and blood-diving are direct action, not constraint analysis or a strategy loop; mental stress/warmth remain `unknown`. |
| 29 | Theme + 2 Narrative | Shogakukan vols.1–3, Manba vol.1, Reviewne, and the prior Manga Award route | Basketball backstory, flamenco learning, and a “dream baton” are not `sportsCompetition`, `crafting`, or a problem-solving/strategy process. No fresh value. |
| 30 | No remaining non-Art text gap after accepted `comedy=2` | Shueisha vols.1–3 and the two vol.1 reviews already adjudicated | No new proposal; the round-2 terminal state remains authoritative. |

## Boundaries and handoff

- Only the four proposal rows above are new. They must be independently accepted,
  reduced, or rejected by Daybreak adjudication; do not auto-average the review
  signals.
- No proposal is made for Art. No Art source or pixel claim was used.
- No source sentence is intended for user-facing explanation text. If accepted,
  evidence must be materialized in the normal provenance/evidence record before a
  terminal CSV change.
- Unknown remains an explicit evidence state. No midpoint or zero was synthesized.
- The source page for Akamegane has no visible publication date; this is recorded
  as `publication date not stated`, not guessed.
- `reviewedByHuman=false` remains unchanged.
