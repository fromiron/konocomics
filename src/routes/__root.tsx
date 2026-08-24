import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";

import { Button } from "@/components/design-system/button";
import { AppShell } from "@/components/nav/app-shell";
import catalogIdentityJson from "@/data/generated/catalog-identity-v1.json";
import { CatalogIdentityProvider } from "@/features/catalog/catalog-provider";
import {
  type CurrentCatalogIdentity,
  parseCurrentCatalogIdentity,
  PersistenceProvider,
} from "@/infrastructure/db";
import { coreStrings, routeBoundaryStrings, workDetailStrings } from "@/lib/strings";

import globalStyles from "../styles/globals.css?url";

let currentCatalogIdentity: CurrentCatalogIdentity | null = null;
try {
  currentCatalogIdentity = parseCurrentCatalogIdentity(catalogIdentityJson);
} catch {
  currentCatalogIdentity = null;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: coreStrings.appName },
      { name: "description", content: coreStrings.metadata.description },
    ],
    links: [{ rel: "stylesheet", href: globalStyles }],
  }),
  errorComponent: GlobalError,
  notFoundComponent: GlobalNotFound,
  pendingComponent: GlobalPending,
  component: RootDocument,
});

function GlobalPending() {
  return (
    <main
      aria-busy="true"
      className="mx-auto grid min-h-[calc(100dvh-var(--layout-mobile-navigation-clearance))] w-full max-w-[var(--layout-width-reading)] content-center gap-[var(--space-4)] p-[var(--layout-page-padding)]"
    >
      <p aria-live="polite" role="status">
        {routeBoundaryStrings.pending}
      </p>
    </main>
  );
}

function GlobalError() {
  const router = useRouter();

  return (
    <main
      className="mx-auto grid min-h-[calc(100dvh-var(--layout-mobile-navigation-clearance))] w-full max-w-[var(--layout-width-reading)] content-center justify-items-start gap-[var(--space-4)] p-[var(--layout-page-padding)]"
      role="alert"
    >
      <h1>{routeBoundaryStrings.errorTitle}</h1>
      <p>{routeBoundaryStrings.errorDescription}</p>
      <Button onClick={() => void router.invalidate()}>{routeBoundaryStrings.retry}</Button>
    </main>
  );
}

function GlobalNotFound() {
  return (
    <main className="work-detail-not-found mx-auto grid min-h-[calc(100dvh-var(--layout-mobile-navigation-clearance))] w-full max-w-[var(--layout-width-reading)] content-center justify-items-start gap-[var(--space-4)] p-[var(--layout-page-padding)]">
      <h1>{workDetailStrings.notFound.title}</h1>
      <p>{workDetailStrings.notFound.description}</p>
      <Link
        className="interactive-press inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:active:scale-100"
        to="/recommendations"
      >
        {workDetailStrings.notFound.recommendations}
      </Link>
    </main>
  );
}

function RootDocument() {
  return (
    <html className="dark" lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <CatalogIdentityProvider identity={currentCatalogIdentity}>
          <PersistenceProvider>
            <AppShell>
              <Outlet />
            </AppShell>
          </PersistenceProvider>
        </CatalogIdentityProvider>
        <Scripts />
      </body>
    </html>
  );
}
