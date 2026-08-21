import type { ReactNode } from "react";

import { MediaShelf } from "./media-shelf";

type RankingShelfProps = Readonly<{
  rankingKind: "editorial-ranking" | "personalized-ranking";
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  compactHeading?: boolean;
  trackClassName?: string;
}>;

export function RankingShelf({
  children,
  className,
  compactHeading = false,
  description,
  rankingKind,
  title,
  trackClassName,
}: RankingShelfProps) {
  return (
    <MediaShelf
      className={className}
      compactHeading={compactHeading}
      description={description}
      listType="ordered"
      title={title}
      trackClassName={trackClassName}
      trackData={{ "data-ranking-shelf": rankingKind }}
    >
      {children}
    </MediaShelf>
  );
}
