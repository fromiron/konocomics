import { Link } from "@tanstack/react-router";
import { useId } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import {
  landingStrings,
  mediaStrings,
  onboardingStrings,
  recommendationStrings,
} from "@/lib/strings";

import type { LandingWork } from "./landing-types";

type BloomGridProps = Readonly<{
  works: readonly LandingWork[];
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible?(workId: string): void;
}>;

/** Ranked tiles show the compact line; discovery tiles add the publication status. */
function catalogMetadata(work: LandingWork, density: "compact" | "standard") {
  const genreLabels = work.genres.map((genre) => onboardingStrings.step1.genreLabels[genre]);
  const primaryGenre = genreLabels[0];
  const statusLabel = recommendationStrings.workStatus[work.status];
  const remainingGenreCount = Math.max(0, genreLabels.length - 1);
  return {
    accessible: mediaStrings.catalogMetadata.accessible(genreLabels, statusLabel),
    visible:
      density === "compact"
        ? mediaStrings.catalogMetadata.compact(primaryGenre, remainingGenreCount)
        : mediaStrings.catalogMetadata.standard(primaryGenre, remainingGenreCount, statusLabel),
  } as const;
}

type BloomCardProps = Readonly<{
  work: LandingWork;
  coverUrl: string | null | undefined;
  rank?: number;
  onCoverVisible?(): void;
}>;

/** A large cover tile: original aspect, an optional rank set over the cover, title and genre. */
function BloomCard({ coverUrl, onCoverVisible, rank, work }: BloomCardProps) {
  const metadata = catalogMetadata(work, rank === undefined ? "standard" : "compact");
  const label = [
    rank === undefined ? undefined : mediaStrings.editorialRank(rank),
    mediaStrings.openDetails(work.title),
    metadata.accessible,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <li className="home-bloom__item">
      <Link
        aria-label={label}
        className="home-bloom__card"
        params={{ workId: work.id }}
        preload={false}
        to="/works/$workId"
      >
        <span className="home-bloom__cover">
          <CoverImage
            coverUrl={coverUrl}
            creators={work.creators}
            onVisible={onCoverVisible}
            requestedSize={400}
            title={work.title}
          />
          {rank === undefined ? null : (
            <span aria-hidden="true" className="home-bloom__rank">
              {rank}
            </span>
          )}
        </span>
        <span aria-hidden="true" className="home-bloom__title">
          {work.title}
        </span>
        <span aria-hidden="true" className="home-bloom__meta">
          {metadata.visible}
        </span>
      </Link>
    </li>
  );
}

type BloomSectionProps = BloomGridProps &
  Readonly<{ title: string; description: string; ranked: boolean }>;

/**
 * Covers on a wide wall that bloom into place as they scroll in: each tile starts turned and
 * small about an axis far off to its side and settles flat. Ranked walls stay an ordered list.
 */
function BloomSection({
  coverUrls,
  description,
  onCoverVisible,
  ranked,
  title,
  works,
}: BloomSectionProps) {
  const headingId = useId();
  const List = ranked ? "ol" : "ul";
  return (
    <section aria-labelledby={headingId} className="home-bloom">
      <header className="home-chapter">
        <h2 className="home-chapter__title" id={headingId}>
          {title}
        </h2>
        <p className="home-chapter__description">{description}</p>
      </header>
      <List
        aria-labelledby={headingId}
        className="home-bloom__grid"
        data-ranked={ranked ? "" : undefined}
      >
        {works.map((work, index) => (
          <BloomCard
            coverUrl={coverUrls.get(work.id)}
            key={work.id}
            onCoverVisible={() => onCoverVisible?.(work.id)}
            rank={ranked ? index + 1 : undefined}
            work={work}
          />
        ))}
      </List>
    </section>
  );
}

/** The editorial Top 10, as a blooming wall. It is a first pick for newcomers, not a ranking. */
export function HomeRankingBloom(props: BloomGridProps) {
  return (
    <BloomSection
      {...props}
      description={landingStrings.ranking.description}
      ranked
      title={landingStrings.ranking.title}
    />
  );
}

/** One work per genre the visitor may not know yet, as a blooming wall. */
export function HomeDiscoveryBloom(props: BloomGridProps) {
  return (
    <BloomSection
      {...props}
      description={landingStrings.discovery.description}
      ranked={false}
      title={landingStrings.discovery.title}
    />
  );
}
