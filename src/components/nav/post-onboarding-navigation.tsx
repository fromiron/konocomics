import { Link } from "@tanstack/react-router";

import { AccentControl } from "@/features/appearance/accent-control";
import { navigationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { BrandMark } from "./brand-mark";
import { NavigationIcon, type NavigationIconName } from "./navigation-icon";

const navigationItems = [
  {
    key: "recommendations",
    href: "/recommendations",
    label: navigationStrings.items.recommendations,
  },
  { key: "taste", href: "/taste", label: navigationStrings.items.taste },
  { key: "library", href: "/library", label: navigationStrings.items.library },
  { key: "settings", href: "/settings", label: navigationStrings.items.settings },
] as const satisfies ReadonlyArray<{
  key: NavigationIconName;
  href: string;
  label: string;
}>;

export type NavigationVariant = "desktop" | "mobile";

type PostOnboardingNavigationProps = Readonly<{
  activePathname: string;
  variant: NavigationVariant;
}>;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationLinks({ activePathname, variant }: PostOnboardingNavigationProps) {
  return (
    <ul
      className={cn(
        "app-navigation__list m-0 flex w-full min-w-0 list-none p-0",
        variant === "desktop" && "gap-[var(--space-1)]",
      )}
    >
      {navigationItems.map((item) => {
        const active = isActivePath(activePathname, item.href);

        return (
          <li
            className={cn(
              "app-navigation__item min-w-0",
              variant === "mobile" ? "flex-1" : "shrink-0",
            )}
            key={item.key}
          >
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "app-navigation__link relative isolate flex min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] items-center justify-center font-bold transition-[opacity,transform,color] duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] active:scale-[0.97] motion-reduce:active:scale-100",
                variant === "mobile"
                  ? "h-[var(--mobile-navigation-height)] flex-col gap-0.5 px-[var(--space-1)] pt-[6px] pb-[var(--space-1)] text-[length:var(--text-caption-size)] leading-[1.25]"
                  : "px-[var(--space-4)] text-[length:var(--font-size-14)]",
                active && "app-navigation__link--active",
              )}
              to={item.href}
              preload={false}
            >
              {variant === "mobile" ? <NavigationIcon name={item.key} /> : null}
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PostOnboardingNavigation({
  activePathname,
  variant,
}: PostOnboardingNavigationProps) {
  if (variant === "mobile") {
    // Mobile has no top header: the accent selector takes the tab bar's last cell, after the
    // four tabs and outside their link list (03 §0).
    return (
      <nav
        aria-label={navigationStrings.mobileLabel}
        className="app-navigation app-navigation--mobile fixed inset-x-0 bottom-0 z-30 flex min-h-[var(--layout-mobile-navigation-clearance)] pb-[var(--layout-safe-area-bottom)] md:hidden"
      >
        <NavigationLinks activePathname={activePathname} variant={variant} />
        <div className="app-navigation__accent flex h-[var(--mobile-navigation-height)] shrink-0 items-center px-[var(--space-2)]">
          <AccentControl side="top" />
        </div>
      </nav>
    );
  }

  return (
    <header className="app-navigation app-navigation--desktop sticky top-0 z-30 hidden h-[var(--desktop-navigation-height)] md:block">
      <div className="app-navigation__desktop-inner mx-auto grid h-full w-full max-w-[var(--layout-width-navigation)] grid-cols-[auto_minmax(0,1fr)] items-center gap-[var(--space-6)] px-[var(--layout-page-padding)]">
        <BrandMark />
        <div className="flex min-w-0 items-center gap-[var(--space-3)] justify-self-end">
          <nav aria-label={navigationStrings.desktopLabel}>
            <NavigationLinks activePathname={activePathname} variant={variant} />
          </nav>
          <AccentControl />
        </div>
      </div>
    </header>
  );
}
