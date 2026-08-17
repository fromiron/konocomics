import { Link } from "@tanstack/react-router";

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
        variant === "desktop" && "gap-[var(--space-content-tight)]",
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
                "app-navigation__link relative flex min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] items-center justify-center font-medium text-text-muted transition-[opacity,transform] duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] after:absolute after:h-0.5 after:w-6 after:bg-accent after:opacity-0 after:content-[''] active:scale-[0.97] motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3",
                variant === "mobile"
                  ? "h-[var(--mobile-navigation-height)] flex-col gap-0.5 px-[var(--space-1)] pt-[6px] pb-[var(--space-1)] text-[length:var(--text-caption-size)] leading-[1.25] after:top-0"
                  : "rounded-[var(--radius-control)] px-[14px] text-[length:var(--font-size-14)] after:bottom-0",
                active && "app-navigation__link--active font-bold text-accent after:opacity-100",
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
    return (
      <nav
        aria-label={navigationStrings.mobileLabel}
        className="app-navigation app-navigation--mobile fixed inset-x-0 bottom-0 z-30 flex min-h-[var(--layout-mobile-navigation-clearance)] border-t border-line bg-surface-1 pb-[var(--layout-safe-area-bottom)] md:hidden"
      >
        <NavigationLinks activePathname={activePathname} variant={variant} />
      </nav>
    );
  }

  return (
    <header className="app-navigation app-navigation--desktop sticky top-0 z-30 hidden h-[var(--desktop-navigation-height)] border-b border-line bg-surface-1 md:block">
      <div className="app-navigation__desktop-inner mx-auto flex h-full w-full max-w-[var(--layout-width-navigation)] items-center justify-between gap-[var(--space-6)] px-[var(--layout-page-padding)]">
        <BrandMark />
        <nav aria-label={navigationStrings.desktopLabel}>
          <NavigationLinks activePathname={activePathname} variant={variant} />
        </nav>
      </div>
    </header>
  );
}
