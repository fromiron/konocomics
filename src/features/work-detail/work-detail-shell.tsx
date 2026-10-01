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
    <HeroBackdrop
      className="border-b border-line shadow-[inset_0_-1px_0_var(--line)]"
      coverUrl={coverUrl}
      priority
    >
      <div
        className={`mx-auto grid w-full gap-[var(--space-5)] px-[var(--layout-page-padding)] md:gap-[var(--space-8)] ${kind === "catalog" ? "max-w-[var(--layout-width-library)] py-[var(--space-section)] md:grid-cols-[12rem_minmax(0,1fr)]" : "max-w-[var(--layout-width-media)] pt-[var(--space-5)] pb-[var(--space-section)] md:grid-cols-[minmax(12rem,15rem)_minmax(0,1fr)] md:py-[var(--space-5)]"}`}
        data-slot="work-detail-hero"
      >
        <div
          className={`mx-auto max-h-[40svh] md:w-full md:max-h-none ${kind === "catalog" ? "w-[calc(var(--space-8)*4)]" : "w-[min(54vw,16rem)] md:sticky md:top-[calc(var(--desktop-navigation-height)+var(--space-6))]"}`}
          data-external-detail-cover={kind === "external" ? true : undefined}
          data-work-detail-cover={kind === "catalog" ? true : undefined}
        >
          <CoverImage
            className="max-h-[40svh] shadow-[var(--shadow-raised)] [&_.cover-image__image]:max-h-[40svh] [&_.cover-image__image]:object-contain md:max-h-[calc(100dvh-var(--desktop-navigation-height)-var(--space-section-large))] md:[&_.cover-image__image]:max-h-[calc(100dvh-var(--desktop-navigation-height)-var(--space-section-large))]"
            coverUrl={coverUrl}
            creators={creators}
            priority
            requestedSize={600}
            title={title}
          />
        </div>

        <div
          className={
            kind === "catalog"
              ? "flex min-w-0 flex-col justify-between gap-[var(--space-5)]"
              : "grid min-w-0 content-start gap-[var(--space-5)] md:gap-[var(--space-4)]"
          }
        >
          {children}
        </div>
      </div>
    </HeroBackdrop>
  );
}
