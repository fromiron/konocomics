import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { Suspense } from "react";

import { Button } from "@/components/design-system/button";
import { AppShell } from "@/components/nav/app-shell";
import { PersonalCatalogProvider } from "@/features/catalog/personal-catalog-provider";
import { LazyCatalogIdentityProvider } from "@/features/catalog/catalog-provider";
import { PersistenceProvider } from "@/infrastructure/db";
import { securityHeaders, siteMetadata } from "@/lib/site-metadata";
import { coreStrings, routeBoundaryStrings } from "@/lib/strings";

import globalStyles from "../styles/globals.css?url";

export const Route = createRootRoute({
  headers: () => securityHeaders,
  beforeLoad: ({ location }) => ({ documentPathname: location.pathname }),
  head: ({ match }) => {
    const pathname = match.context.documentPathname;
    const indexable = pathname === "/" || pathname === "/about";
    const metadata = siteMetadata(pathname, indexable);
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { title: coreStrings.appName },
        { name: "description", content: coreStrings.metadata.description },
        ...metadata.meta,
      ],
      links: [
        { rel: "stylesheet", href: globalStyles },
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "icon", href: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
        { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png", sizes: "180x180" },
        ...metadata.links,
      ],
    };
  },
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
      <h1>{routeBoundaryStrings.notFoundTitle}</h1>
      <p>{routeBoundaryStrings.notFoundDescription}</p>
      <Link
        className="interactive-press inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent-ink underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:active:scale-100"
        to="/"
      >
        {routeBoundaryStrings.home}
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
        <LazyCatalogIdentityProvider>
          <PersistenceProvider>
            <PersonalCatalogProvider>
              <Suspense fallback={<GlobalPending />}>
                <AppShell>
                  <Outlet />
                </AppShell>
              </Suspense>
            </PersonalCatalogProvider>
          </PersistenceProvider>
        </LazyCatalogIdentityProvider>
        <Scripts />
      </body>
    </html>
  );
}
