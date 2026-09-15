import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { landingEditorialRankingIds } from "../src/data/landing-showcase";
import { catalogAssetFilename, recommendationContextAssetFilename } from "../src/lib/catalog-asset";
import { assignJointVersion } from "./catalog/compile";
import { runCatalogPipelineFromAuthority, runCatalogPipelineFromCsv } from "./catalog/pipeline";
import { formatSourceIssue, hasErrors } from "./catalog/report";
import { validateCatalogArtifacts } from "./validate-catalog";
import { reportCoverage } from "./report-coverage";

export function buildCatalog(
  root = process.cwd(),
  sourceKind: "authority" | "csv" = "authority",
  options: { compact?: boolean; verify?: boolean } = {},
) {
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
  const publicContextOutput = resolve(
    canonicalRoot,
    "public/catalog",
    recommendationContextAssetFilename(catalog.catalogVersion),
  );

  for (const validationIssue of issues) {
    if (!options.compact || validationIssue.severity === "error") {
      console.log(formatSourceIssue(validationIssue));
    }
  }

  if (hasErrors(issues)) {
    throw new Error("Catalog build refused because validation failed.");
  }
  const artifacts = [
    { outputs: [...catalogOutputs, publicCatalogOutput], value: catalog },
    { outputs: [...contextOutputs, publicContextOutput], value: context },
    {
      outputs: [resolve(canonicalRoot, "data/generated/recommendation-profile-catalog-v1.json")],
      value: recommendationProjection.catalog,
    },
    {
      outputs: [resolve(canonicalRoot, "data/generated/recommendation-profile-context-v1.json")],
      value: recommendationProjection.context,
    },
    {
      outputs: [resolve(canonicalRoot, "src/data/generated/catalog-identity-v1.json")],
      value: catalogIdentity,
    },
    {
      outputs: [resolve(canonicalRoot, "src/data/generated/landing-v1.json")],
      value: landingProjection,
    },
  ];
  for (const { outputs, value } of artifacts) {
    const content = `${JSON.stringify(value, null, 2)}\n`;
    for (const output of outputs) {
      mkdirSync(dirname(output), { recursive: true });
      const temporaryOutput = `${output}.tmp`;
      writeFileSync(temporaryOutput, content, "utf8");
      renameSync(temporaryOutput, output);
    }
  }
  console.log(
    `Built ${catalog.catalogVersion} with ${catalog.works.length} works and recommendation context.`,
  );
  const result = {
    catalog,
    context,
    issues,
    artifactPaths: artifacts.flatMap(({ outputs }) => outputs),
  };
  if (options.verify) {
    const validation = validateCatalogArtifacts(canonicalRoot, result, options.compact);
    const coverage = reportCoverage(result, options.compact);
    if (validation.errorCount > 0 || coverage.sourceErrors || coverage.failCount > 0) {
      throw new Error("Catalog build verification failed.");
    }
  }
  return result;
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    buildCatalog(process.cwd(), "authority", {
      verify: process.argv.includes("--verify"),
      compact: process.argv.includes("--compact"),
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
