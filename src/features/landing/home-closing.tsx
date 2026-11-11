import { useId } from "react";

import { SectionHeading } from "@/components/layout/section-heading";
import { CoverBackdrop } from "@/components/media/cover-backdrop";
import { landingStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { LandingCta, type LandingVisitorState } from "./home-hero";

/** A large panel (04 §2.3) that a cover backdrop can tint like a featured card. */
const cardClassName =
  "relative isolate overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-surface-1";

type HomeClosingProps = Readonly<{
  visitor?: LandingVisitorState;
  /** The example recommendation's cover, which tints the block like a featured card. */
  backdropUrl?: string | null;
}>;

/** The page's last block: the same single action on a card tinted by the example's cover. */
export function HomeClosing({ backdropUrl, visitor = "new" }: HomeClosingProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(cardClassName, "p-[var(--space-6)] md:p-[var(--space-8)]")}
    >
      <CoverBackdrop coverUrl={backdropUrl} />
      <div className="relative z-10 grid justify-items-start gap-[var(--space-4)]">
        <SectionHeading
          className="mb-0"
          description={landingStrings.closing.description}
          id={headingId}
          title={landingStrings.closing.title}
        />
        <LandingCta visitor={visitor} />
      </div>
    </section>
  );
}
