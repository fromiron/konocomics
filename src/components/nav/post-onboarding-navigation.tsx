import Link from "next/link";

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
    <ul className="app-navigation__list">
      {navigationItems.map((item) => {
        const active = isActivePath(activePathname, item.href);

        return (
          <li className="app-navigation__item" key={item.key}>
            <Link
              aria-current={active ? "page" : undefined}
              className={cn("app-navigation__link", active && "app-navigation__link--active")}
              href={item.href}
              prefetch={false}
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
        className="app-navigation app-navigation--mobile"
      >
        <NavigationLinks activePathname={activePathname} variant={variant} />
      </nav>
    );
  }

  return (
    <header className="app-navigation app-navigation--desktop">
      <div className="app-navigation__desktop-inner">
        <BrandMark />
        <nav aria-label={navigationStrings.desktopLabel}>
          <NavigationLinks activePathname={activePathname} variant={variant} />
        </nav>
      </div>
    </header>
  );
}
