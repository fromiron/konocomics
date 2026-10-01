import { Link } from "@tanstack/react-router";

import { DiscoveryCard } from "@/components/media/discovery-card";
import { MediaShelf } from "@/components/media/media-shelf";
import type { ContrastingWork } from "@/domain/recommendation/contrast";
import { workDetailStrings } from "@/lib/strings";

type WorkContrastProps = Readonly<{
  entries: readonly ContrastingWork[];
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
}>;

export function WorkContrastSection({ entries, coverUrls, onCoverVisible }: WorkContrastProps) {
  if (entries.length === 0) return null;
  const strings = workDetailStrings.contrast;
  return (
    <MediaShelf
      compactHeading
      controlsPlacement="overlay"
      description={strings.description}
      enableLoop={false}
      title={strings.heading}
      trackClassName="!pb-[var(--space-1)]"
    >
      {entries.map(({ work, contributions }) => {
        const lead = contributions[0];
        if (lead === undefined) return null;
        const reason = strings.differences[lead.axisId][lead.direction];
        return (
          <DiscoveryCard
            action={
              <Link
                className="mt-auto inline-flex min-h-[var(--control-min-size)] items-center self-start text-[length:var(--font-size-14)] font-bold text-accent underline decoration-line underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                params={{ workId: work.id }}
                preload={false}
                to="/works/$workId"
              >
                {strings.view}
              </Link>
            }
            coverUrl={coverUrls.get(work.id)}
            creators={work.creators}
            id={`work-contrast-${work.id}`}
            key={work.id}
            marker="contrast"
            onCoverVisible={() => onCoverVisible(work.id)}
            reason={reason}
            reasonAlwaysVisible
            title={work.title}
            workId={work.id}
          />
        );
      })}
    </MediaShelf>
  );
}
