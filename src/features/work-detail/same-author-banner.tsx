import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { BookCover } from "@/components/cover/BookCover";
import { MediaShelf } from "@/components/media/media-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import type { Work } from "@/domain/catalog/types";
import { coverStrings, explanationLexicon, workDetailStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type SameAuthorSectionProps = Readonly<{
  author: string;
  featured: Work | null;
  others: readonly Work[];
  coverUrlOf(workId: string): string | null | undefined;
  /** Grounded one-line context for the featured work (reviews, or status and volumes). */
  featuredMeta: string;
  onCoverVisible(workId: string): void;
}>;

/** 「{author}の作品」: a half-width featured book banner beside a shelf of the rest. */
export function SameAuthorSection({
  author,
  coverUrlOf,
  featured,
  featuredMeta,
  onCoverVisible,
  others,
}: SameAuthorSectionProps) {
  const split = featured !== null && others.length > 0;
  return (
    <section aria-labelledby="same-author-heading" className="grid gap-[var(--space-4)]">
      <h2
        className="text-[length:var(--text-subheading-size)] tracking-tight text-text-strong"
        id="same-author-heading"
      >
        {workDetailStrings.sameAuthor.heading(author)}
      </h2>
      <div
        className={cn(
          "grid items-start gap-[var(--space-6)]",
          split && "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-[var(--space-8)]",
        )}
      >
        {featured === null ? null : (
          <Link
            aria-label={workDetailStrings.sameAuthor.open(featured.title)}
            className={cn("same-author-banner", !split && "md:max-w-[50%]")}
            params={{ workId: featured.id }}
            to="/works/$workId"
          >
            <BookCover
              coverUrl={coverUrlOf(featured.id)}
              creators={featured.creators}
              decorative
              onVisible={() => onCoverVisible(featured.id)}
              requestedSize={400}
              title={featured.title}
            />
            <span className="same-author-banner__copy">
              {featuredMeta === "" ? null : (
                <span className="same-author-banner__eyebrow">{featuredMeta}</span>
              )}
              <span className="same-author-banner__title">{featured.title}</span>
              {featured.genres.length === 0 ? null : (
                <span className="same-author-banner__genres">
                  {featured.genres
                    .slice(0, 3)
                    .map((genre) => explanationLexicon.factorLabels[genre])
                    .join(" · ")}
                </span>
              )}
              <span className="same-author-banner__action">
                {workDetailStrings.sameAuthor.view}
                <ChevronRight aria-hidden="true" size={18} />
              </span>
            </span>
          </Link>
        )}
        {others.length === 0 ? null : (
          <MediaShelf
            className="min-w-0"
            compactHeading
            headingLevel={3}
            listType="unordered"
            title={workDetailStrings.sameAuthor.othersHeading}
          >
            {others.map((work) => (
              <RankingCard
                coverUrl={coverUrlOf(work.id)}
                creators={work.creators}
                key={work.id}
                metadata={coverStrings.creatorLine(work.creators)}
                metadataAccessibleLabel={coverStrings.creatorLine(work.creators)}
                onCoverVisible={() => onCoverVisible(work.id)}
                title={work.title}
                variant="unranked"
                workId={work.id}
              />
            ))}
          </MediaShelf>
        )}
      </div>
    </section>
  );
}
