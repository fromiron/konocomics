"use client";

import { usePathname, useRouter } from "next/navigation";
import { lazy, type ReactNode, Suspense, useEffect, useMemo } from "react";
import { preload } from "react-dom";

import { hasCatalogBackedProfileById } from "@/domain/profile/catalog-profile";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { catalogAssetUrl } from "@/lib/catalog-asset";
import { catalogStrings, navigationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { BrandWordmark } from "./brand-wordmark";
import { PostOnboardingNavigation } from "./post-onboarding-navigation";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

type AppShellContentProps = Readonly<{
  children: ReactNode;
  pathname: string;
  showNavigation: boolean;
}>;

const RecommendationCatalogBoundary = lazy(() =>
  import("@/features/catalog/static-asset-catalog-provider").then((module) => ({
    default: module.StaticAssetCatalogProvider,
  })),
);

function isImmersivePath(pathname: string) {
  return pathname === "/" || pathname === "/onboarding" || pathname.startsWith("/onboarding/");
}

function requiresProfile(pathname: string) {
  return (
    pathname === "/recommendations" ||
    pathname.startsWith("/recommendations/") ||
    pathname === "/taste" ||
    pathname.startsWith("/taste/")
  );
}

function requiresRecommendationCatalog(pathname: string) {
  return pathname === "/recommendations" || pathname.startsWith("/recommendations/");
}

function getRouteLabel(pathname: string) {
  if (pathname === "/recommendations" || pathname.startsWith("/recommendations/")) {
    return navigationStrings.items.recommendations;
  }

  if (pathname === "/taste" || pathname.startsWith("/taste/")) {
    return navigationStrings.items.taste;
  }

  if (pathname === "/library" || pathname.startsWith("/library/")) {
    return navigationStrings.items.library;
  }

  if (pathname === "/settings" || pathname.startsWith("/settings/")) {
    return navigationStrings.items.settings;
  }

  if (pathname.startsWith("/works/")) {
    return navigationStrings.routeNames.workDetail;
  }

  if (pathname.startsWith("/onboarding")) {
    return navigationStrings.routeNames.onboarding;
  }

  return navigationStrings.routeNames.home;
}

function RecommendationCatalogLoading() {
  return (
    <main
      className="recommendations-page recommendations-page--loading"
      data-catalog-state="loading"
    >
      <p aria-live="polite">{catalogStrings.loading}</p>
    </main>
  );
}

function AppShellContent({ children, pathname, showNavigation }: AppShellContentProps) {
  return (
    <div className={cn("app-shell", showNavigation && "app-shell--post-onboarding")}>
      <a className="skip-link" href="#app-content">
        {navigationStrings.skipLink}
      </a>
      <p aria-atomic="true" aria-live="polite" className="visually-hidden">
        {navigationStrings.routeAnnouncement(getRouteLabel(pathname))}
      </p>
      {showNavigation ? (
        <PostOnboardingNavigation activePathname={pathname} variant="desktop" />
      ) : null}
      <div className="app-shell__content" id="app-content" tabIndex={-1}>
        {children}
      </div>
      {showNavigation ? (
        <PostOnboardingNavigation activePathname={pathname} variant="mobile" />
      ) : null}
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const catalogIdentity = useCatalogIdentity();
  const { userWorks } = usePersistence();
  const hasProfile = useMemo(
    () => hasCatalogBackedProfileById(userWorks, catalogIdentity.workIds),
    [catalogIdentity.workIds, userWorks],
  );
  const guarded = requiresProfile(pathname);
  const recommendationCatalog = requiresRecommendationCatalog(pathname);
  const showNavigation = hasProfile === true && !isImmersivePath(pathname);

  useEffect(() => {
    if (guarded && hasProfile === false) {
      router.replace("/onboarding");
    }
  }, [guarded, hasProfile, router]);

  if (guarded && hasProfile !== true) {
    return (
      <div className="app-shell app-shell--guarding">
        <BrandWordmark className="app-shell__guard-wordmark" />
        <p aria-live="polite" className="visually-hidden">
          {navigationStrings.profileLoading}
        </p>
      </div>
    );
  }

  const shell = (
    <AppShellContent pathname={pathname} showNavigation={showNavigation}>
      {children}
    </AppShellContent>
  );

  if (!recommendationCatalog) return shell;

  preload(catalogAssetUrl(catalogIdentity.catalogVersion), {
    as: "fetch",
    crossOrigin: "anonymous",
    fetchPriority: "high",
  });

  return (
    <Suspense fallback={<RecommendationCatalogLoading />}>
      <RecommendationCatalogBoundary>{shell}</RecommendationCatalogBoundary>
    </Suspense>
  );
}
