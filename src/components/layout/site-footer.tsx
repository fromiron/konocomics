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
  immersive?: boolean;
}>;

/**
 * The footer as a manga volume's colophon (奥付): the notes beside a ruled table of the site's
 * routes, under one heavy rule, closed by the wordmark set faintly across the content width and
 * trimmed at the page's foot.
 */
export function SiteFooter({ className, immersive = false }: SiteFooterProps) {
  return (
    <footer className={cn("site-footer", className)}>
      <div className="site-footer__inner mx-auto w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--space-8)]">
        <div className="site-footer__colophon grid gap-[var(--space-6)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <div className="grid content-start gap-[var(--space-content)]">
            <p className="max-w-[28rem] text-[length:var(--text-caption-size)] text-text-muted">
              {siteFooterStrings.localFirst}
            </p>
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {landingStrings.footer.credit}
            </p>
            <p className="flex flex-wrap items-center gap-x-[var(--space-4)] text-[length:var(--text-caption-size)] text-text-muted">
              <Link
                className="inline-flex min-h-[var(--control-min-size)] items-center underline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-strong [@media(hover:hover)_and_(pointer:fine)]:hover:underline"
                preload={false}
                to="/about"
              >
                {siteFooterStrings.about}
              </Link>
              <small className="text-[length:inherit]">{siteFooterStrings.copyright}</small>
              {immersive ? (
                <Link
                  className="inline-flex min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] items-center md:hidden [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-strong"
                  preload={false}
                  to="/settings"
                >
                  {navigationStrings.items.settings}
                </Link>
              ) : null}
            </p>
          </div>
          <div className="site-footer__table hidden md:block">
            {footerGroups.map((group) => (
              <nav
                aria-label={`${siteFooterStrings.navigationLabel} · ${group.title}`}
                className="site-footer__row hidden md:block"
                key={group.title}
              >
                <h2 className="site-footer__row-title">{group.title}</h2>
                <ul className="site-footer__row-links">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        className="inline-flex min-h-[var(--control-min-size)] items-center text-[length:var(--text-caption-size)] text-text-muted [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-strong"
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
        </div>
        <div className="site-footer__mark">
          <BrandWordmark />
        </div>
      </div>
    </footer>
  );
}
