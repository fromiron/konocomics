import type { ReactNode } from "react";

import { MediaShelf } from "./media-shelf";

type RankingShelfProps = Readonly<{
  rankingKind: "editorial-ranking" | "personalized-ranking";
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  compactHeading?: boolean;
  controlsPlacement?: "heading" | "overlay";
  trackClassName?: string;
}>;

export function RankingShelf({
  children,
  className,
  compactHeading = false,
  controlsPlacement = "heading",
  description,
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
      enableLoop={false}
      listType="ordered"
      title={title}
      trackClassName={trackClassName}
      trackData={{ "data-ranking-shelf": rankingKind }}
    >
      {children}
    </MediaShelf>
  );
}
