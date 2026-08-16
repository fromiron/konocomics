import { Children, isValidElement, type ReactNode } from "react";

import { mediaStrings } from "@/lib/strings";

import { MediaShelf } from "./media-shelf";

type RankingShelfProps = Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}>;

export function RankingShelf({ children, className, description, title }: RankingShelfProps) {
  const items = Children.toArray(children);

  return (
    <MediaShelf className={className} description={description} listType="ordered" title={title}>
      {items.map((child, index) => (
        <li
          className="relative shrink-0 snap-start"
          key={isValidElement(child) && child.key !== null ? child.key : index}
        >
          <span
            aria-hidden="true"
            className="absolute top-[var(--space-2)] left-[var(--space-2)] z-20 rounded-[var(--radius-control)] bg-canvas/85 px-[var(--space-2)] py-[var(--space-1)] font-display text-[length:var(--font-size-28)] leading-none font-bold text-text-strong shadow-[var(--shadow-level-1)] tabular-nums"
          >
            {mediaStrings.rank(index + 1)}
          </span>
          {child}
        </li>
      ))}
    </MediaShelf>
  );
}
