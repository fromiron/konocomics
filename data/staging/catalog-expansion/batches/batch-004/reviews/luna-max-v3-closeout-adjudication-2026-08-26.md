# Batch 004 v3 community closeout adjudication

- reviewedAt: `2026-08-26`
- reviewedByHuman: `false`
- model: `gpt-5.6-luna`, reasoning `max`
- policy: `promotion-evidence-v3`
- environment: Windows paths only; no WSL path or file mutation by the subagent

## Position 24 — 黒月のイェルクナハト

- workId: `work-65f856a6fa2078f21d2f`
- official scope binding:
  - Kodansha volume 1: <https://www.kodansha.co.jp/comic/products/0000415577>
  - Magapoke episode 1: <https://pocket.shonenmagazine.com/title/02756/episode/415013>
- independent Japanese community evidence:
  - Asika Blog, 2025-04-11: <https://www.asikablog02.com/kurotuki-review/>
  - Oninkun, 2025-08-13: <https://www.oninkun.com/yelknahat-of-the-black-moon-1st/>
- repeated bounded observation: episode 1 records the same short tactical sequence—anticipating pursuit, choosing the counter timing, ambushing at close range, then disengaging—on different hosts, by different authors, on different dates without copied wording.
- Korean layer: searches using `흑월의 예르크나흐트` and title variants found no qualifying bounded source; absence was not treated as a low value or blocker.

Verdict:

- `strategy=2`, confidence `0.78`: **ACCEPT**. This matches the Dictionary's short tactical-plan anchor.
- `strategy=0`: reject because the sequence includes anticipation and selected timing rather than only reflexive response.
- `strategy=4`: reject because no long-horizon war, politics, or resource operation is established.
- `problemSolving` and `mysteryReveal`: retain `unknown`; the same event is not double-counted into a second axis.

Resulting required coverage is Narrative `4/6`, Tone `5/7`, Genre `3`, Theme `1`. Art remains an optional peer signal under v3 and is not used to make the terminal promotion decision.

## Position 15 — キルアオ

- workId: `work-d79f9c540fead1f1acbb`
- Korean discovery used the common title `킬 블루` and spelling variants; no qualifying bounded residual cell was found.
- Official volumes 1–3 and independent Japanese reviews repeatedly establish school readjustment, exams, assigned roles, and pursuit events, but do not establish repeated growth/acquisition/mastery rewards, a plan/counterplan sequence, or clue-to-truth payoff under the Dictionary anchors.

Verdict:

- `progression`, `strategy`, and `mysteryReveal`: retain `unknown`.
- Narrative coverage remains `3/6`; the work remains `pending` and is not `recommendationVerified`.
- Art is optional and is not a blocker. No final blocker is assigned; later-volume substitution and quota filling are rejected.
