import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { HeroBackdrop } from "@/components/media/hero-backdrop";

type WorkDetailShellProps = Readonly<{
  children: ReactNode;
  coverUrl: string | null;
  creators: readonly string[];
  kind: "catalog" | "external";
  title: string;
}>;

export function WorkDetailShell({
  children,
  coverUrl,
  creators,
  kind,
  title,
}: WorkDetailShellProps) {
  return (
    <HeroBackdrop className="border-b border-line" coverUrl={coverUrl} priority>
      <div className="mx-auto grid w-full max-w-[var(--layout-width-detail)] gap-[var(--space-4)] px-[var(--layout-page-padding)] pt-[var(--space-4)] pb-[var(--space-6)] md:grid-cols-[minmax(13rem,18rem)_minmax(0,1fr)] md:gap-[var(--space-8)] md:py-[var(--space-section-large)]">
        <div
          className="mx-auto max-h-[30svh] w-[min(44vw,11rem)] md:sticky md:top-[calc(var(--desktop-navigation-height)+var(--space-6))] md:w-full md:max-h-none"
          data-external-detail-cover={kind === "external" ? true : undefined}
          data-work-detail-cover={kind === "catalog" ? true : undefined}
        >
          <CoverImage
            className="max-h-[30svh] [&_.cover-image__image]:max-h-[30svh] [&_.cover-image__image]:object-contain md:max-h-[calc(100dvh-var(--desktop-navigation-height)-var(--space-section-large))] md:[&_.cover-image__image]:max-h-[calc(100dvh-var(--desktop-navigation-height)-var(--space-section-large))]"
            coverUrl={coverUrl}
            creators={creators}
            priority
            requestedSize={600}
            title={title}
          />
        </div>

        <div className="grid min-w-0 content-start gap-[var(--space-4)] md:gap-[var(--space-5)]">
          {children}
        </div>
      </div>
    </HeroBackdrop>
  );
}
