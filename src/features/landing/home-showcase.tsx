import { MediaPosterCard } from "@/components/media/media-poster-card";
import { MediaShelf } from "@/components/media/media-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import { ShowcaseCard } from "@/components/media/showcase-card";
import { landingStrings, onboardingStrings, recommendationStrings } from "@/lib/strings";

import type { LandingWork } from "./landing-types";

type HomeShelfProps = Readonly<{
  works: readonly LandingWork[];
  coverUrls: ReadonlyMap<string, string | null>;
}>;

function genreLine(work: LandingWork) {
  return work.genres
    .slice(0, 3)
    .map((genre) => onboardingStrings.step1.genreLabels[genre])
    .join(" · ");
}

function compactCatalogLine(work: LandingWork) {
  const genre = work.genres[0];
  const genreLabel = genre === undefined ? undefined : onboardingStrings.step1.genreLabels[genre];
  const statusLabel = recommendationStrings.workStatus[work.status];

  return [genreLabel, statusLabel].filter((label) => label !== undefined).join(" · ");
}

export function HomeShowcaseShelf({ coverUrls, works }: HomeShelfProps) {
  return (
    <MediaShelf
      compactHeading
      description={landingStrings.showcase.description}
      title={landingStrings.showcase.title}
      trackClassName="items-stretch"
    >
      {works.map((work, index) => {
        const metadata = genreLine(work);
        return (
          <ShowcaseCard
            coverUrl={coverUrls.get(work.id)}
            creators={work.creators}
            featured={index === 0}
            key={work.id}
            metadata={metadata === "" ? undefined : metadata}
            ordinal={index + 1}
            priority={index === 0}
            title={work.title}
            workId={work.id}
          />
        );
      })}
    </MediaShelf>
  );
}

export function HomeRankingShelf({ coverUrls, works }: HomeShelfProps) {
  return (
    <MediaShelf
      compactHeading
      description={landingStrings.ranking.description}
      listType="ordered"
      title={landingStrings.ranking.title}
      trackClassName="items-start"
    >
      {works.map((work, index) => (
        <RankingCard
          coverUrl={coverUrls.get(work.id)}
          creators={work.creators}
          key={work.id}
          metadata={compactCatalogLine(work)}
          position={index + 1}
          presentation="landing-top-ten"
          title={work.title}
          workId={work.id}
        />
      ))}
    </MediaShelf>
  );
}

export function HomeDiscoveryShelf({ coverUrls, works }: HomeShelfProps) {
  return (
    <MediaShelf
      compactHeading
      description={landingStrings.discovery.description}
      title={landingStrings.discovery.title}
      trackClassName="items-start"
    >
      {works.map((work) => (
        <MediaPosterCard
          coverUrl={coverUrls.get(work.id)}
          creators={work.creators}
          key={work.id}
          metadata={compactCatalogLine(work)}
          presentation="cover-overlay"
          title={work.title}
          workId={work.id}
        />
      ))}
    </MediaShelf>
  );
}
