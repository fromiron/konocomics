"use client";

import { Link } from "@tanstack/react-router";
import { ExternalLinkIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

import { buttonClassName } from "@/components/design-system/button";
import { PageHeader } from "@/components/layout/page-header";
import { DiscoveryCard, DiscoveryReason } from "@/components/media/discovery-card";
import { MediaShelf } from "@/components/media/media-shelf";
import type { Work } from "@/domain/catalog/types";
import { explanationClusterFor } from "@/domain/explanation";
import {
  parseDnaShareLink,
  type DnaShareLink,
  type DnaShareReasonFactorId,
} from "@/domain/profile/dna-share";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { recordEntrySource } from "@/features/landing/entry-source";
import type { LandingVisitorState } from "@/features/landing/home-hero";
import { useLandingVisitorState } from "@/features/landing/visitor-state";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
  type RecommendationProviderLinks,
} from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence, type ProviderCacheRecord } from "@/infrastructure/db";
import { buildRakutenBooksSearchUrl } from "@/infrastructure/rakuten";
import {
  coverStrings,
  dnaSharePageStrings,
  explanationLexicon,
  tasteStrings,
  workDetailStrings,
} from "@/lib/strings";
import { cn } from "@/lib/utils";

import { SharedDnaWheel } from "./shared-dna-wheel";

const strings = dnaSharePageStrings;
const providerStrings = workDetailStrings.provider;

// A shared link is someone else's snapshot: covers may be read from the cache, never written.
function skipProviderCacheWrite(record: ProviderCacheRecord) {
  return Promise.resolve(record);
}

function factorLabel(factorId: DnaShareReasonFactorId) {
  return explanationLexicon.factorLabels[factorId] ?? "";
}

/** The label a recommendation card would give the same reason factor. */
function reasonLabel(factorId: DnaShareReasonFactorId) {
  const clusterId = explanationClusterFor(factorId);
  return clusterId === undefined
    ? factorLabel(factorId)
    : explanationLexicon.clusterLabels[clusterId];
}

// Ids the current Catalog no longer knows are skipped; they are never shown raw.
function knownWorks(workIds: readonly string[], worksById: ReadonlyMap<string, Work>) {
  return workIds.flatMap((workId) => {
    const work = worksById.get(workId);
    return work === undefined ? [] : [work];
  });
}

function ShareCta({ visitor }: Readonly<{ visitor: LandingVisitorState }>) {
  return (
    <section
      aria-labelledby="dna-share-cta-heading"
      className="grid justify-items-center gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line-accent bg-surface-1 px-[var(--space-6)] py-[var(--space-8)] text-center"
    >
      <h2
        className="font-display text-[length:var(--font-size-20)] leading-[var(--line-height-heading)] text-text-strong"
        id="dna-share-cta-heading"
      >
        {visitor === "profile" ? strings.cta.profileHeading : strings.cta.heading}
      </h2>
      <p className="text-[length:var(--font-size-14)] text-text-muted">{strings.cta.description}</p>
      <Link
        className={buttonClassName({
          className: "mt-[var(--space-2)] min-h-12 px-[var(--space-8)] font-bold",
        })}
        data-share-visitor={visitor}
        preload={false}
        to={visitor === "profile" ? "/taste" : "/onboarding"}
      >
        {strings.cta.byVisitor[visitor]}
      </Link>
    </section>
  );
}

function ShareFootnote() {
  return (
    <p className="text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
      {strings.footnote.map((line) => (
        <span className="block" key={line}>
          {line}
        </span>
      ))}
    </p>
  );
}

/**
 * A recommendation from the link as a morph card: the reason only when the link carries one. The
 * store link is the card's action beside the cover; the reason and the link's disclosure take the
 * full-width row under it, so their wrapping never pushes the text past the cover's height.
 */
function SharedRecommendation({
  coverUrl,
  links,
  onCoverVisible,
  reasonFactorId,
  work,
}: Readonly<{
  coverUrl: string | null | undefined;
  links: RecommendationProviderLinks | undefined;
  onCoverVisible(): void;
  reasonFactorId: DnaShareReasonFactorId | undefined;
  work: Work;
}>) {
  const directUrl = links?.affiliateUrl ?? links?.itemUrl;
  const affiliate = links?.affiliateUrl !== undefined;
  return (
    <DiscoveryCard
      action={
        <a
          aria-label={`${work.title} ${directUrl === undefined ? providerStrings.searchNewTab : providerStrings.openNewTab}`}
          className="mt-auto flex min-h-[var(--control-min-size)] items-center gap-[var(--space-1)] self-start text-[length:var(--text-caption-size)] font-bold text-accent-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          href={directUrl ?? buildRakutenBooksSearchUrl(work.title)}
          rel="noreferrer"
          target="_blank"
        >
          {/* The name says it opens a new tab; in the narrow card the icon shows it. */}
          <span>{directUrl === undefined ? providerStrings.search : providerStrings.view}</span>
          <ExternalLinkIcon aria-hidden="true" className="size-3.5 shrink-0" />
        </a>
      }
      articleData={{ "data-share-recommendation": work.id }}
      byline={coverStrings.creatorLine(work.creators)}
      coverUrl={coverUrl}
      creators={work.creators}
      footer={
        reasonFactorId === undefined && !affiliate ? undefined : (
          <>
            {reasonFactorId === undefined ? null : (
              <DiscoveryReason>{strings.reasonChip(reasonLabel(reasonFactorId))}</DiscoveryReason>
            )}
            {affiliate ? (
              <p className="text-[length:var(--text-caption-size)] leading-[1.4] [word-break:auto-phrase] text-text-muted">
                {providerStrings.affiliate}
              </p>
            ) : null}
          </>
        )
      }
      onCoverVisible={onCoverVisible}
      title={work.title}
      workId={work.id}
    />
  );
}

function SharedDna({
  link,
  visitor,
  worksById,
}: Readonly<{
  link: DnaShareLink;
  visitor: LandingVisitorState;
  worksById: ReadonlyMap<string, Work>;
}>) {
  const catalog = useCatalog();
  const { getProviderCache } = usePersistence();
  const recommendations = useMemo(
    () =>
      link.recommendations.flatMap((recommendation) => {
        const work = worksById.get(recommendation.workId);
        return work === undefined ? [] : [{ ...recommendation, work }];
      }),
    [link.recommendations, worksById],
  );
  const coverTargets = useMemo(
    () =>
      createRecommendationCoverTargets(
        catalog,
        recommendations.map((recommendation) => recommendation.workId),
      ),
    [catalog, recommendations],
  );
  const { coverUrls, providerLinks, requestCover } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache: skipProviderCacheWrite,
  });
  const ranks = new Map(link.topPositions.map((position, rank) => [position, rank] as const));
  const namedWorks = knownWorks(link.workIds, worksById);
  const unnamedCount = link.analyzedWorkCount - namedWorks.length;

  return (
    <>
      <section aria-labelledby="dna-share-axes-heading" className="taste-dna-emblem">
        <h2 className="sr-only" id="dna-share-axes-heading">
          {strings.axesHeading}
        </h2>
        <div className="taste-dna-emblem__layout">
          <SharedDnaWheel link={link} />
          <div className="grid min-w-0 gap-[var(--space-4)]">
            <p className="taste-dna-statement">
              {link.topPositions.map((position, index) => {
                const axis = link.axes[position];
                return axis === undefined ? null : (
                  <span key={axis.axisId}>
                    {index === 0 ? null : (
                      <span aria-hidden="true" className="px-[var(--space-2)] text-accent-ink">
                        ×
                      </span>
                    )}
                    {factorLabel(axis.axisId)}
                  </span>
                );
              })}
            </p>
            <ul className="m-0 grid list-none gap-[var(--space-1)] p-0">
              {link.axes.map((axis, index) => {
                const rank = ranks.get(index);
                const evidence =
                  rank === undefined
                    ? []
                    : knownWorks(link.evidence[rank] ?? [], worksById).map((work) => work.title);
                return (
                  <li
                    className="taste-dna-axis"
                    data-axis-id={axis.axisId}
                    data-static="true"
                    key={axis.axisId}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "taste-dna-axis__rank",
                        rank !== undefined && "taste-dna-axis__rank--top",
                      )}
                    >
                      {rank === undefined ? "·" : rank + 1}
                    </span>
                    <strong className="taste-dna-axis__name">{factorLabel(axis.axisId)}</strong>
                    <span
                      className={cn(
                        "taste-dna-axis__level",
                        rank !== undefined && "text-accent-ink",
                      )}
                    >
                      {tasteStrings.factorValue(axis.level)}
                    </span>
                    {evidence.length === 0 ? null : (
                      <span className="taste-dna-axis__evidence">
                        {tasteStrings.topPreferenceEvidence(evidence)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="grid gap-[var(--space-2)] border-t border-line pt-[var(--space-4)]">
              <h3 className="text-[length:var(--text-caption-size)] font-bold text-text-muted">
                {strings.worksHeading}
              </h3>
              <ul className="m-0 flex list-none flex-wrap gap-[var(--space-content)] p-0">
                {namedWorks.map((work) => (
                  <li
                    className="max-w-full rounded-[var(--radius-pill)] border border-line bg-surface-2 px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-caption-size)] [overflow-wrap:anywhere] text-text"
                    key={work.id}
                  >
                    {work.title}
                  </li>
                ))}
                {unnamedCount > 0 ? (
                  <li className="rounded-[var(--radius-pill)] bg-surface-2 px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-caption-size)] text-text-muted">
                    {strings.moreWorks(unnamedCount)}
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {recommendations.length === 0 ? null : (
        <div className="grid gap-[var(--space-2)]">
          <MediaShelf
            controlsPlacement="overlay"
            description={strings.recommendationsDescription}
            title={strings.recommendationsHeading}
            // Each card keeps its own height: stretched, a card without a reason or disclosure row
            // would widen its cover with the extra height.
            trackClassName="items-start !pb-[var(--space-1)]"
          >
            {recommendations.map((recommendation) => (
              <SharedRecommendation
                coverUrl={coverUrls.get(recommendation.workId)}
                key={recommendation.workId}
                links={providerLinks.get(recommendation.workId)}
                onCoverVisible={() => requestCover(recommendation.workId)}
                reasonFactorId={recommendation.reasonFactorId}
                work={recommendation.work}
              />
            ))}
          </MediaShelf>
          <p className="text-[length:var(--text-caption-size)] text-text-muted">
            {providerStrings.credit}
          </p>
        </div>
      )}

      <ShareCta visitor={visitor} />
    </>
  );
}

/** The public page a Manga DNA share link opens; everything it shows comes from the URL. */
export function DnaSharePage({ search }: Readonly<{ search: string }>) {
  const catalog = useCatalog();
  const visitor = useLandingVisitorState();
  const link = useMemo(() => parseDnaShareLink(search), [search]);
  const worksById = useMemo(
    () => new Map(catalog.works.map((work) => [work.id, work] as const)),
    [catalog.works],
  );

  useEffect(() => {
    recordEntrySource("share-card");
  }, []);

  return (
    <main
      className="mx-auto grid w-full max-w-[var(--layout-width-library)] gap-[var(--space-shelf)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)]"
      data-entry-source="share-card"
      data-share-state={link === null ? "invalid" : "ready"}
    >
      <PageHeader
        action={
          <span className="rounded-[var(--radius-pill)] border border-line-accent bg-accent-soft px-[var(--space-4)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold tracking-[0.2em] text-accent-ink">
            {strings.kicker}
          </span>
        }
        title={link === null ? strings.invalid.title : strings.title}
      >
        <p className="text-[length:var(--font-size-14)] text-text-muted">
          {link === null ? strings.invalid.description : strings.basis(link.analyzedWorkCount)}
        </p>
      </PageHeader>

      {link === null ? (
        <ShareCta visitor={visitor} />
      ) : (
        <SharedDna link={link} visitor={visitor} worksById={worksById} />
      )}

      <ShareFootnote />
    </main>
  );
}
