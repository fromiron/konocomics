type CoverShimmerProps = Readonly<{ loaded: boolean }>;

/** Shared loading surface for cover artwork, including the hero variant. */
export function CoverShimmer({ loaded }: CoverShimmerProps) {
  return (
    <span
      aria-hidden="true"
      className="cover-image__skeleton absolute inset-0"
      data-loaded={loaded ? "true" : "false"}
      data-reduced-motion="fade"
    />
  );
}
