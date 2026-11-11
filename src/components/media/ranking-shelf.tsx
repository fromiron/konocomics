import type { ReactNode } from "react";

import { MediaShelf } from "./media-shelf";

type RankingShelfProps = Readonly<{
  rankingKind: "editorial-ranking" | "personalized-ranking" | "unranked";
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  compactHeading?: boolean;
  controlsPlacement?: "heading" | "overlay";
  trackClassName?: string;
  onPageChange?: (firstVisibleIndex: number) => void;
}>;

export function RankingShelf({
  children,
  className,
  compactHeading = false,
  controlsPlacement = "heading",
  description,
  onPageChange,
  rankingKind,
  title,
  trackClassName,
}: RankingShelfProps) {
  return (
    <MediaShelf
      className={className}
      compactHeading={compactHeading}
      controlsPlacement={controlsPlacement}
      description={description}
      listType={rankingKind === "unranked" ? "unordered" : "ordered"}
      onPageChange={onPageChange}
      title={title}
      trackClassName={trackClassName}
      trackData={rankingKind === "unranked" ? undefined : { "data-ranking-shelf": rankingKind }}
    >
      {children}
    </MediaShelf>
  );
}
