import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { landingEditorialRankingIds } from "../src/data/landing-showcase";
import { catalogAssetFilename } from "../src/lib/catalog-asset";
import { assignJointVersion } from "./catalog/compile";
import { runCatalogPipelineFromAuthority, runCatalogPipelineFromCsv } from "./catalog/pipeline";
import { formatSourceIssue, hasErrors } from "./catalog/report";

export function buildCatalog(root = process.cwd(), sourceKind: "authority" | "csv" = "authority") {
  const canonicalRoot = resolve(root);
  const sourceDirectory = resolve(canonicalRoot, "data/source");
  const catalogOutputs = [
    resolve(canonicalRoot, "data/generated/catalog-v1.json"),
    resolve(canonicalRoot, "src/data/generated/catalog-v1.json"),
  ] as const;
  const contextOutputs = [
    resolve(canonicalRoot, "data/generated/recommendation-context-v1.json"),
    resolve(canonicalRoot, "src/data/generated/recommendation-context-v1.json"),
  ] as const;
  const { catalog, context, issues } =
    sourceKind === "authority"
      ? runCatalogPipelineFromAuthority(sourceDirectory)
      : runCatalogPipelineFromCsv(sourceDirectory);
  const recommendationWorkIds = new Set(
    catalog.works.filter((work) => work.eligibility.recommendationEligible).map((work) => work.id),
  );
  const recommendationProjection = assignJointVersion(
    {
      ...catalog,
      works: catalog.works.filter((work) => recommendationWorkIds.has(work.id)),
      volumes: catalog.volumes.filter((volume) => recommendationWorkIds.has(volume.workId)),
      representativeVolumeByWorkId: Object.fromEntries(
        Object.entries(catalog.representativeVolumeByWorkId).filter(([workId]) =>
          recommendationWorkIds.has(workId),
        ),
      ),
    },
    {
      constraintByWorkId: Object.fromEntries(
        Object.entries(context.constraintByWorkId).filter(([workId]) =>
          recommendationWorkIds.has(workId),
        ),
      ),
      marketSnapshot: {
        ...context.marketSnapshot,
        byWorkId: Object.fromEntries(
          Object.entries(context.marketSnapshot.byWorkId).filter(([workId]) =>
            recommendationWorkIds.has(workId),
          ),
        ),
      },
    },
  );
  const volumesById = new Map(catalog.volumes.map((volume) => [volume.id, volume] as const));
  const worksById = new Map(catalog.works.map((work) => [work.id, work] as const));
  const toLandingWork = (work: (typeof catalog.works)[number]) => {
    const representativeVolumeId = catalog.representativeVolumeByWorkId[work.id];
    return {
      id: work.id,
      title: work.title,
      creators: work.creators,
      genres: work.genres,
      status: work.status,
      ...(representativeVolumeId === undefined
        ? {}
        : { isbn: volumesById.get(representativeVolumeId)?.isbn }),
    };
  };
  const catalogIdentity = {
    catalogVersion: catalog.catalogVersion,
    workIds: catalog.works.map((work) => work.id),
    profileWorkIds: catalog.works
      .filter((work) => work.eligibility.recommendationEligible)
      .map((work) => work.id),
  };
  const landingProjection = {
    catalogVersion: catalog.catalogVersion,
    heroWorks: catalog.works
      .filter((work) => work.eligibility.onboardingEligible)
      .slice(0, 18)
      .map(toLandingWork),
    editorialRankingWorks: landingEditorialRankingIds.map((workId) => {
      const work = worksById.get(workId);
      if (work === undefined || !work.eligibility.onboardingEligible) {
        throw new Error(`Landing editorial ranking work is unavailable: ${workId}`);
      }
      return toLandingWork(work);
    }),
  };
  const publicCatalogOutput = resolve(
    canonicalRoot,
    "public/catalog",
    catalogAssetFilename(catalog.catalogVersion),
  );

  for (const validationIssue of issues) {
    console.log(formatSourceIssue(validationIssue));
  }

  if (hasErrors(issues)) {
    throw new Error("Catalog build refused because validation failed.");
  }
  const artifacts = [
    ...catalogOutputs.map((output) => ({ output, value: catalog })),
    { output: publicCatalogOutput, value: catalog },
    ...contextOutputs.map((output) => ({ output, value: context })),
    {
      output: resolve(canonicalRoot, "data/generated/recommendation-profile-catalog-v1.json"),
      value: recommendationProjection.catalog,
    },
    {
      output: resolve(canonicalRoot, "data/generated/recommendation-profile-context-v1.json"),
      value: recommendationProjection.context,
    },
    {
      output: resolve(canonicalRoot, "src/data/generated/catalog-identity-v1.json"),
      value: catalogIdentity,
    },
    {
      output: resolve(canonicalRoot, "src/data/generated/landing-v1.json"),
      value: landingProjection,
    },
  ];
  for (const { output, value } of artifacts) {
    mkdirSync(dirname(output), { recursive: true });
    const temporaryOutput = `${output}.tmp`;
    writeFileSync(temporaryOutput, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    renameSync(temporaryOutput, output);
  }
  console.log(
    `Built ${catalog.catalogVersion} with ${catalog.works.length} works and recommendation context.`,
  );
  return { catalog, context, artifactPaths: artifacts.map(({ output }) => output) };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    buildCatalog();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
