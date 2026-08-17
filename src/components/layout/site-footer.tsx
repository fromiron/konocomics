import { Link } from "@tanstack/react-router";

import { BrandWordmark } from "@/components/nav/brand-wordmark";
import { landingStrings, navigationStrings, siteFooterStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const footerLinks = [
  { to: "/", label: navigationStrings.routeNames.home },
  { to: "/recommendations", label: navigationStrings.items.recommendations },
  { to: "/taste", label: navigationStrings.items.taste },
  { to: "/library", label: navigationStrings.items.library },
  { to: "/settings", label: navigationStrings.items.settings },
] as const;

type SiteFooterProps = Readonly<{
  className?: string;
}>;

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("border-t border-line bg-surface-1", className)}>
      <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-5)] px-[var(--layout-page-padding)] py-[var(--space-8)]">
        <div className="grid gap-[var(--space-content)]">
          <BrandWordmark className="text-[length:var(--text-section-title-size)]" />
          <p className="text-text-muted">{landingStrings.footer.storage}</p>
        </div>
        <nav aria-label={siteFooterStrings.navigationLabel}>
          <ul className="m-0 flex list-none flex-wrap gap-x-[var(--space-5)] gap-y-[var(--space-content)] p-0">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link
                  className="touch-target inline-flex min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] items-center justify-center text-text-muted [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-strong"
                  preload={false}
                  to={link.to}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-[length:var(--text-caption-size)] text-text-muted">
          {landingStrings.footer.credit}
        </p>
      </div>
    </footer>
  );
}
