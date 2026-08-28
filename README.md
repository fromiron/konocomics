<p align="center">
  <a href="https://konocomics.vercel.app">
    <img src="./docs/assets/readme/konocomics-hero.webp" alt="Open konocomics" width="1600" />
  </a>
</p>

<h1 align="center">konocomics</h1>

<p align="center"><strong>Know your manga taste. Find your next read—with reasons.</strong></p>

<p align="center">
  A local-first web app that turns the manga you liked into a 17-axis Manga DNA profile and explainable recommendations.
</p>

<p align="center">
  <a href="https://konocomics.vercel.app"><strong>Open the app</strong></a>
  · <a href="#how-it-works">How it works</a>
  · <a href="#run-locally">Run locally</a>
</p>

<p align="center">
  <strong>English</strong> · <a href="./README.ko.md">한국어</a> · <a href="./README.ja.md">日本語</a>
</p>

<p align="center"><sub><strong>kono</strong> + <strong>mi</strong> = konomi (好み, “taste”). The product is hidden in the name.</sub></p>

## Why konocomics is different

### Taste beyond genre

Manga DNA models narrative, pace, relationships, tone, mental load, and art across **17 observable axes**.

### Reasons with provenance

Every recommendation sentence is derived from the scoring engine's returned factor contributions. A runtime LLM does not choose the rank or write the reason.

### Local by default

Profiles, reading records, feedback, and settings stay in **IndexedDB**. There is no account or server-side product database.

## How it works

1. **Choose 5–10 manga you enjoyed.** Optionally add up to three works you disliked or dropped, together with the reason.
2. **Read and tune your Manga DNA.** See the strongest factors, their supporting works, and how each factor affects recommendations.
3. **Explore 10 ranked candidates.** Open the reasons, save a work to your library, or tell the engine what did not fit.

The interface is currently Japanese. This README is available in English, Korean, and Japanese.

## The recommendation contract

The ranking rules are product contracts, not hidden heuristics:

- **Unknown is not dislike.** An unknown factor never becomes a negative preference. Low-coverage groups contract toward neutral `0.5`; their weight is not reassigned elsewhere.
- **Multiple tastes stay distinct.** Best Positive Anchor matching avoids flattening every liked work into one average vector.
- **Taste leads the rank.** Fixed factor-group weights determine taste fit. Market signals are used only to break close ties.
- **Reasons come from evidence.** Explanations and cautions are built only from the selected work's contribution ledger and supporting anchors.
- **Same input, same result.** Recommendation and explanation code is pure and deterministic: no clock, randomness, I/O, or runtime model call inside the domain layer.

The factor vocabulary is explicit: **10 genres, 22 themes, and 17 axes**, each with known, unknown, and not-applicable states.

## Catalog and architecture

The current generated catalog contains **1,614 works**: **1,441 recommendation-eligible** works and **173 library-only** records. Eligibility is explicit, so a work can live in the library without silently entering taste analysis.

```text
data/source/catalog.sqlite → validation → static JSON → browser
browser IndexedDB → profiles, library, feedback, settings
Rakuten Books API → /api/rakuten/search | /api/rakuten/item → browser
```

The tracked SQLite catalog is a **build-time authority**, not a runtime user database. The browser owns personal state. The only runtime server routes validate and reduce Rakuten Books search and item responses while keeping provider credentials server-side.

Key contracts:

- [Product specification](./docs/planning/02-product-spec.md)
- [Factor dictionary](./docs/factors/factor-dictionary.md)
- [Architecture](./docs/planning/05-architecture.md)
- [Catalog authoring authority](./docs/planning/09-catalog-authoring-authority.md)
- [UX screen contracts](./docs/planning/03-ux-screen-contracts.md)

## Run locally

Requires **Node.js 24** and **pnpm 10**.

```bash
pnpm install
pnpm dev
```

The bundled catalog, Manga DNA, recommendations, and local library work without a remote database. To enable Rakuten-backed search and item lookup, copy `.env.example` to `.env.local` and provide the documented server-only values.

### Quality gates

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm catalog:authority:verify
pnpm catalog:validate
```

## Stack

TanStack Start · TanStack Router · React 19 · TypeScript · Tailwind CSS 4 · Base UI · Motion · Dexie · Zod · Fuse.js · Vitest · Playwright
