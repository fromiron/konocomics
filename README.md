<div align="center">

# konocomics

**Know your manga taste. Find the next work that fits it.**

A local-first web app for Japanese manga taste analysis and explainable recommendations.

[Live app](https://konocomics.vercel.app)

</div>

## Overview

konocomics turns a reader's preferences into a structured **Manga DNA** profile and recommends works from a curated catalog. Recommendation scores and explanations are deterministic: the product does not call an LLM at runtime and does not invent reasons that are absent from the scoring evidence.

The app is designed around three constraints:

- **Explainable recommendations** — recommendation copy is generated only from measured factor contributions.
- **Unknown is not dislike** — missing factor data is excluded from scoring rather than treated as a negative preference.
- **Local-first ownership** — profiles, library state, feedback, and imported external works stay in IndexedDB and can be exported or deleted by the user.

## Product capabilities

- Guided taste onboarding and a reusable 17-axis preference profile
- Ranked recommendations with factor-level contribution explanations
- Bundled catalog of 150 curated manga works
- Catalog and external-work detail pages with stable URL contracts
- Rakuten Books search and item lookup through server-only proxy routes
- Local library, reading state, preference feedback, and backfill behavior
- Versioned export/import and complete local-data deletion
- Keyboard-accessible, responsive dark-only interface
- Deterministic catalog validation and recommendation experiment tooling

## Architecture

```text
routes
  └─ features
       ├─ domain            # deterministic recommendation and profile logic
       └─ infrastructure    # IndexedDB, Rakuten boundary, import/export
```

The browser owns the product state. The only server boundaries are:

```text
/api/rakuten/search
/api/rakuten/item
```

Bundled work detail pages are prerendered. External works use a fixed client-resolved shell and remain local to the user's browser.

## Tech stack

- **Application:** TanStack Start, TanStack Router, React 19, TypeScript, Vite
- **UI:** Tailwind CSS 4, Base UI primitives, Motion, Lucide
- **Local data:** Dexie / IndexedDB
- **Validation and search:** Zod, Fuse.js
- **Testing:** Vitest, Testing Library, Playwright
- **Deployment target:** Vercel

## Development

Requires Node.js 24 LTS and pnpm 10.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Rakuten-backed search requires the server-side values documented in `.env.example`. The local profile, bundled catalog, recommendation engine, and library do not require a remote database.

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

Catalog and experiment utilities are also available through the `catalog:*`, `experiment:*`, and `g2:*` scripts in `package.json`.

## Recommendation contract

The scoring model, factor dictionary, unknown-data behavior, and explanation provenance are treated as versioned product contracts. The current model uses:

- 17 observable preference axes
- explicit known / unknown factor coverage
- deterministic similarity and contribution calculations
- explanations derived only from returned contribution evidence
- no runtime generative model in ranking or explanation generation

The product documents and validates changes to these contracts before changing generated catalog data or recommendation snapshots.

## Privacy

konocomics has no account system and no product database. Personal taste data and library state are stored locally in the browser. Rakuten credentials remain server-side and are not included in the client bundle.
