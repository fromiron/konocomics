import { MediaPosterCard } from "@/components/media/media-poster-card";
import { MediaShelf } from "@/components/media/media-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import { RankingShelf } from "@/components/media/ranking-shelf";
import {
  landingStrings,
  mediaStrings,
  onboardingStrings,
  recommendationStrings,
} from "@/lib/strings";

import type { LandingWork } from "./landing-types";

type HomeShelfProps = Readonly<{
  works: readonly LandingWork[];
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible?(workId: string): void;
}>;

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

export function HomeRankingShelf({ coverUrls, onCoverVisible, works }: HomeShelfProps) {
  return (
    <RankingShelf
      compactHeading
      controlsPlacement="overlay"
      description={landingStrings.ranking.description}
      rankingKind="editorial-ranking"
      title={landingStrings.ranking.title}
      trackClassName="items-start"
    >
      {works.map((work, index) => {
        const metadata = catalogMetadata(work, "compact");

        return (
          <RankingCard
            coverUrl={coverUrls.get(work.id)}
            creators={work.creators}
            key={work.id}
            metadata={metadata.visible}
            metadataAccessibleLabel={metadata.accessible}
            onCoverVisible={() => onCoverVisible?.(work.id)}
            position={index + 1}
            rankingKind="editorial-ranking"
            title={work.title}
            workId={work.id}
          />
        );
      })}
    </RankingShelf>
  );
}

export function HomeDiscoveryShelf({ coverUrls, onCoverVisible, works }: HomeShelfProps) {
  return (
    <MediaShelf
      compactHeading
      controlsPlacement="overlay"
      description={landingStrings.discovery.description}
      title={landingStrings.discovery.title}
      trackClassName="items-start"
    >
      {works.map((work) => {
        const metadata = catalogMetadata(work, "standard");

        return (
          <MediaPosterCard
            coverUrl={coverUrls.get(work.id)}
            creators={work.creators}
            key={work.id}
            metadata={metadata.visible}
            metadataAccessibleLabel={metadata.accessible}
            onCoverVisible={() => onCoverVisible?.(work.id)}
            presentation="cover-overlay"
            title={work.title}
            workId={work.id}
          />
        );
      })}
    </MediaShelf>
  );
}
