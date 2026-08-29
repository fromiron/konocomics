"use client";

import { useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useMemo } from "react";
import { preload } from "react-dom";

import { SiteFooter } from "@/components/layout/site-footer";
import { hasCatalogBackedProfileById } from "@/domain/profile/catalog-profile";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { catalogAssetUrl } from "@/lib/catalog-asset";
import { navigationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { BrandWordmark } from "./brand-wordmark";
import { PostOnboardingNavigation } from "./post-onboarding-navigation";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

type AppShellContentProps = Readonly<{
  children: ReactNode;
  pathname: string;
  showDesktopNavigation: boolean;
  showMobileNavigation: boolean;
}>;

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

function AppShellContent({
  children,
  pathname,
  showDesktopNavigation,
  showMobileNavigation,
}: AppShellContentProps) {
  const hasNavigation = showDesktopNavigation || showMobileNavigation;

  return (
    <div className={cn("app-shell min-h-dvh", hasNavigation && "app-shell--post-onboarding")}>
      <a
        className="skip-link fixed top-[var(--space-2)] left-[var(--space-2)] z-[100] min-h-[var(--control-min-size)] -translate-y-[calc(100%+var(--space-4))] rounded-[var(--radius-control)] border border-line bg-surface-1 px-[14px] py-[10px] font-bold text-text-strong shadow-[var(--shadow-raised)] transition-transform duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] focus-visible:translate-y-0"
        href="#app-content"
      >
        {navigationStrings.skipLink}
      </a>
      <p aria-atomic="true" aria-live="polite" className="visually-hidden sr-only">
        {navigationStrings.routeAnnouncement(getRouteLabel(pathname))}
      </p>
      {showDesktopNavigation ? (
        <PostOnboardingNavigation activePathname={pathname} variant="desktop" />
      ) : null}
      <div
        className={cn(
          "app-shell__content flex min-h-dvh flex-col",
          showMobileNavigation && "pb-[var(--layout-mobile-navigation-clearance)]",
          showDesktopNavigation &&
            "md:min-h-[calc(100dvh-var(--desktop-navigation-height))] md:pb-0",
        )}
        id="app-content"
        tabIndex={-1}
      >
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </div>
      {showMobileNavigation ? (
        <PostOnboardingNavigation activePathname={pathname} variant="mobile" />
      ) : null}
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const catalogIdentity = useCatalogIdentity();
  const { userWorks } = usePersistence();
  const hasProfile = useMemo(
    () => hasCatalogBackedProfileById(userWorks, catalogIdentity.profileWorkIds),
    [catalogIdentity.profileWorkIds, userWorks],
  );
  const guarded = requiresProfile(pathname);
  const recommendationCatalog = requiresRecommendationCatalog(pathname);
  const showDesktopNavigation = true;
  const showMobileNavigation = !isImmersivePath(pathname);

  useEffect(() => {
    if (guarded && hasProfile === false) {
      void navigate({ to: "/onboarding", replace: true });
    }
  }, [guarded, hasProfile, navigate]);

  if (guarded && hasProfile !== true) {
    return (
      <div className="app-shell app-shell--guarding grid min-h-dvh place-items-center px-[var(--layout-page-padding)] text-text-muted">
        <BrandWordmark className="app-shell__guard-wordmark text-[length:var(--font-size-28)]" />
        <p aria-live="polite" className="visually-hidden sr-only">
          {navigationStrings.profileLoading}
        </p>
      </div>
    );
  }

  const shell = (
    <AppShellContent
      pathname={pathname}
      showDesktopNavigation={showDesktopNavigation}
      showMobileNavigation={showMobileNavigation}
    >
      {children}
    </AppShellContent>
  );

  if (recommendationCatalog) {
    preload(catalogAssetUrl(catalogIdentity.catalogVersion), {
      as: "fetch",
      crossOrigin: "anonymous",
      fetchPriority: "high",
    });
  }

  return shell;
}
