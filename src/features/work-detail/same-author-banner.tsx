import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { BookCover } from "@/components/cover/BookCover";
import { MediaShelf } from "@/components/media/media-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import type { Work } from "@/domain/catalog/types";
import { explanationLexicon, workDetailStrings } from "@/lib/strings";
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

function genreThemeLabels(work: Work) {
  return [
    ...work.genres,
    ...work.themes.filter((theme) => theme.centrality === 2).map((theme) => theme.id),
  ]
    .slice(0, 3)
    .map((id) => explanationLexicon.factorLabels[id]);
}

/** A full-width author panel with a featured book and a compact shelf of the rest. */
export function SameAuthorSection({
  author,
  coverUrlOf,
  featured,
  featuredMeta,
  onCoverVisible,
  others,
}: SameAuthorSectionProps) {
  const split = featured !== null && others.length > 0;
  const featuredTags = featured === null ? [] : genreThemeLabels(featured);
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
          "same-author-panel grid min-w-0 items-center gap-[var(--space-4)]",
          split && "md:grid-cols-2 md:gap-[var(--space-6)]",
        )}
      >
        {featured === null ? null : (
          <Link
            aria-label={workDetailStrings.sameAuthor.open(featured.title)}
            className="same-author-banner"
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
              {featuredTags.length === 0 ? null : (
                <span className="same-author-banner__genres">{featuredTags.join(" · ")}</span>
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
            className="same-author-shelf min-w-0"
            compactHeading
            headingLevel={3}
            hideHeading
            listType="unordered"
            title={workDetailStrings.sameAuthor.othersHeading}
          >
            {others.map((work) => {
              const tags = genreThemeLabels(work);
              return (
                <RankingCard
                  className="same-author-card"
                  coverUrl={coverUrlOf(work.id)}
                  creators={work.creators}
                  key={work.id}
                  metadata={
                    tags.length === 0 ? undefined : (
                      <span className="flex flex-wrap gap-[var(--space-1)]">
                        {tags.map((tag) => (
                          <span
                            className="same-author-card__tag inline-block max-w-full truncate rounded-[var(--radius-pill)] border border-line px-[var(--space-2)] py-[var(--space-1)] align-top text-[length:var(--font-size-12)] leading-[var(--line-height-body)] text-text-muted"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    )
                  }
                  metadataAccessibleLabel={tags.length === 0 ? undefined : tags.join(" · ")}
                  onCoverVisible={() => onCoverVisible(work.id)}
                  title={work.title}
                  variant="unranked"
                  workId={work.id}
                />
              );
            })}
          </MediaShelf>
        )}
      </div>
    </section>
  );
}
