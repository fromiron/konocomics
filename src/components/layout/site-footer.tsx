import { Link } from "@tanstack/react-router";

import { BrandWordmark } from "@/components/nav/brand-wordmark";
import { landingStrings, navigationStrings, siteFooterStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const footerGroups = [
  {
    title: siteFooterStrings.sections.discover,
    links: [
      { to: "/", label: navigationStrings.routeNames.home },
      { to: "/recommendations", label: navigationStrings.items.recommendations },
    ],
  },
  {
    title: siteFooterStrings.sections.understand,
    links: [{ to: "/taste", label: navigationStrings.items.taste }],
  },
  {
    title: siteFooterStrings.sections.manage,
    links: [
      { to: "/library", label: navigationStrings.items.library },
      { to: "/settings", label: navigationStrings.items.settings },
    ],
  },
] as const;

type SiteFooterProps = Readonly<{
  className?: string;
}>;

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("border-t border-line bg-surface-1", className)}>
      <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-6)] px-[var(--layout-page-padding)] py-[var(--space-8)] md:grid-cols-[minmax(14rem,1.4fr)_repeat(3,minmax(8rem,1fr))]">
        <div className="grid content-start gap-[var(--space-content)]">
          <BrandWordmark className="text-[length:var(--text-section-title-size)]" />
          <p className="max-w-[28rem] text-[length:var(--text-caption-size)] text-text-muted">
            {siteFooterStrings.localFirst}
          </p>
          <p className="text-[length:var(--text-caption-size)] text-text-muted">
            {landingStrings.footer.credit}
          </p>
        </div>
        {footerGroups.map((group) => (
          <nav
            aria-label={`${siteFooterStrings.navigationLabel} · ${group.title}`}
            key={group.title}
          >
            <h2 className="mb-[var(--space-content)] text-[length:var(--font-size-14)]">
              {group.title}
            </h2>
            <ul className="m-0 grid list-none p-0">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    className="inline-flex min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] items-center justify-center text-[length:var(--text-caption-size)] text-text-muted [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-strong"
                    preload={false}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
