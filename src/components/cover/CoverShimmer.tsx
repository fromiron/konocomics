import type { ReactNode } from "react";

type CoverShimmerProps = Readonly<{ loaded: boolean; children?: ReactNode }>;

/**
 * Shared loading surface for cover artwork, including the hero variant. Its children (the
 * placeholder's title, 04 §4.1) sit on the moving dots and fade out with them once the image shows.
 */
export function CoverShimmer({ children, loaded }: CoverShimmerProps) {
  return (
    <span
      aria-hidden="true"
      className="cover-image__skeleton absolute inset-0"
      data-loaded={loaded ? "true" : "false"}
      data-reduced-motion="fade"
    >
      {children}
    </span>
  );
}
