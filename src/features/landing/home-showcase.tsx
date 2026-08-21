import { useCallback, useEffect, useRef, useState } from "react";

import { MediaPosterCard } from "@/components/media/media-poster-card";
import { MediaShelf } from "@/components/media/media-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import { RankingShelf } from "@/components/media/ranking-shelf";
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
  const [expandedIndex, setExpandedIndex] = useState(0);
  const hoverTimerRef = useRef<number | null>(null);
  const isCoarsePointer = useRef(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    try {
      isCoarsePointer.current = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    } catch {
      isCoarsePointer.current = false;
    }
  }, []);

  const cancelHover = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const scheduleExpand = useCallback(
    (index: number) => {
      if (isCoarsePointer.current) return;
      cancelHover();
      hoverTimerRef.current = window.setTimeout(() => {
        setExpandedIndex(index);
      }, 140) as unknown as number;
    },
    [cancelHover],
  );

  const handleTrackLeave = useCallback(() => {
    cancelHover();
    setExpandedIndex(0);
  }, [cancelHover]);

  useEffect(
    () => () => {
      if (hoverTimerRef.current !== null) window.clearTimeout(hoverTimerRef.current);
    },
    [],
  );

  return (
    <div
      className="-mx-1 px-1"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setExpandedIndex(0);
        }
      }}
      onMouseLeave={handleTrackLeave}
    >
      <MediaShelf
        compactHeading
        description={landingStrings.showcase.description}
        title={landingStrings.showcase.title}
        trackClassName="items-stretch pt-2 pb-3"
        trackData={{ "data-home-showcase": "true" } as Readonly<Record<`data-${string}`, string>>}
      >
        {works.map((work, index) => {
          const metadata = genreLine(work);
          const isExpanded = expandedIndex === index;
          return (
            <ShowcaseCard
              coverUrl={coverUrls.get(work.id) ?? null}
              creators={work.creators}
              featured={isExpanded}
              key={work.id}
              metadata={metadata === "" ? undefined : metadata}
              onFocus={() => setExpandedIndex(index)}
              onPointerCancel={cancelHover}
              onPointerEnter={() => scheduleExpand(index)}
              onPointerLeave={cancelHover}
              ordinal={index + 1}
              priority={index === 0}
              title={work.title}
              workId={work.id}
            />
          );
        })}
      </MediaShelf>
    </div>
  );
}

export function HomeRankingShelf({ coverUrls, works }: HomeShelfProps) {
  return (
    <RankingShelf
      compactHeading
      description={landingStrings.ranking.description}
      rankingKind="editorial-ranking"
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
          rankingKind="editorial-ranking"
          title={work.title}
          workId={work.id}
        />
      ))}
    </RankingShelf>
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
