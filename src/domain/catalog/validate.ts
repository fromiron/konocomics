import { COVERAGE_GROUPS, COVERAGE_THRESHOLDS } from "./constants";
import { calculateWorkCoverage } from "./coverage";
import { isbnIdentityKey, isValidIsbn } from "./normalize";
import type { CatalogV1 } from "./types";

export type CatalogValidationCode =
  | "DUPLICATE_WORK_ID"
  | "RESERVED_WORK_ID"
  | "DUPLICATE_VOLUME_ID"
  | "DUPLICATE_ISBN"
  | "INVALID_ISBN"
  | "UNKNOWN_VOLUME_WORK"
  | "ELIGIBILITY_CONFLICT"
  | "NO_ELIGIBILITY_ROLE"
  | "DUPLICATE_ALIAS"
  | "DUPLICATE_GENRE"
  | "DUPLICATE_THEME"
  | "COVERAGE_BELOW_THRESHOLD"
  | "REPRESENTATIVE_VOLUME_MISSING"
  | "REPRESENTATIVE_VOLUME_INVALID"
  | "REPRESENTATIVE_VOLUME_UNKNOWN_WORK";

export type CatalogValidationIssue = {
  code: CatalogValidationCode;
  message: string;
  workId?: string;
  volumeId?: string;
  field?: string;
};

function findDuplicates(values: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return [...duplicates].sort();
}

export function validateCatalog(catalog: CatalogV1): CatalogValidationIssue[] {
  const issues: CatalogValidationIssue[] = [];
  const workIds = new Set(catalog.works.map((work) => work.id));
  const volumeById = new Map(catalog.volumes.map((volume) => [volume.id, volume]));

  for (const workId of findDuplicates(catalog.works.map((work) => work.id))) {
    issues.push({
      code: "DUPLICATE_WORK_ID",
      workId,
      message: `Work id is duplicated: ${workId}`,
    });
  }

  for (const work of catalog.works) {
    if (work.id === "external" || work.id.startsWith("ext:")) {
      issues.push({
        code: "RESERVED_WORK_ID",
        workId: work.id,
        field: "id",
        message: `Work id uses the reserved external detail namespace: ${work.id}`,
      });
    }
  }

  for (const volumeId of findDuplicates(catalog.volumes.map((volume) => volume.id))) {
    issues.push({
      code: "DUPLICATE_VOLUME_ID",
      volumeId,
      message: `Volume id is duplicated: ${volumeId}`,
    });
  }

  for (const isbn of findDuplicates(
    catalog.volumes.map((volume) => isbnIdentityKey(volume.isbn)),
  )) {
    issues.push({ code: "DUPLICATE_ISBN", message: `ISBN is duplicated: ${isbn}`, field: "isbn" });
  }

  for (const volume of catalog.volumes) {
    if (!isValidIsbn(volume.isbn)) {
      issues.push({
        code: "INVALID_ISBN",
        volumeId: volume.id,
        field: "isbn",
        message: `ISBN checksum is invalid: ${volume.isbn}`,
      });
    }
    if (!workIds.has(volume.workId)) {
      issues.push({
        code: "UNKNOWN_VOLUME_WORK",
        volumeId: volume.id,
        workId: volume.workId,
        message: `Volume ${volume.id} references unknown work ${volume.workId}`,
      });
    }
  }

  for (const workId of Object.keys(catalog.representativeVolumeByWorkId)) {
    if (!workIds.has(workId)) {
      issues.push({
        code: "REPRESENTATIVE_VOLUME_UNKNOWN_WORK",
        workId,
        field: "representativeVolumeByWorkId",
        message: `Representative volume mapping references unknown work ${workId}`,
      });
    }
  }

  for (const work of catalog.works) {
    const { eligibility } = work;
    if (
      eligibility.libraryOnly &&
      (eligibility.onboardingEligible || eligibility.recommendationEligible)
    ) {
      issues.push({
        code: "ELIGIBILITY_CONFLICT",
        workId: work.id,
        field: "eligibility",
        message: `Eligibility flags conflict for ${work.id}`,
      });
    }

    for (const alias of findDuplicates(work.aliases)) {
      issues.push({
        code: "DUPLICATE_ALIAS",
        workId: work.id,
        field: "aliases",
        message: `Alias ${alias} is duplicated for ${work.id}`,
      });
    }

    if (
      !eligibility.onboardingEligible &&
      !eligibility.recommendationEligible &&
      !eligibility.libraryOnly
    ) {
      issues.push({
        code: "NO_ELIGIBILITY_ROLE",
        workId: work.id,
        field: "eligibility",
        message: `No eligibility role is enabled for ${work.id}`,
      });
    }

    for (const genre of findDuplicates(work.genres)) {
      issues.push({
        code: "DUPLICATE_GENRE",
        workId: work.id,
        field: "genres",
        message: `Genre ${genre} is duplicated for ${work.id}`,
      });
    }

    for (const theme of findDuplicates(work.themes.map((factor) => factor.id))) {
      issues.push({
        code: "DUPLICATE_THEME",
        workId: work.id,
        field: "themes",
        message: `Theme ${theme} is duplicated for ${work.id}`,
      });
    }

    if (eligibility.recommendationEligible) {
      const coverage = calculateWorkCoverage(work);
      for (const group of COVERAGE_GROUPS) {
        const threshold = COVERAGE_THRESHOLDS[group];
        const value = coverage[group];
        if (value < threshold) {
          issues.push({
            code: "COVERAGE_BELOW_THRESHOLD",
            workId: work.id,
            field: group,
            message: `${work.id} ${group} coverage ${value.toFixed(2)} is below ${threshold.toFixed(2)}`,
          });
        }
      }
    }

    const representativeVolumeId = catalog.representativeVolumeByWorkId[work.id];
    if (representativeVolumeId === undefined) {
      issues.push({
        code: "REPRESENTATIVE_VOLUME_MISSING",
        workId: work.id,
        field: "representativeVolumeByWorkId",
        message: `Representative volume is missing for ${work.id}`,
      });
    } else {
      const volume = volumeById.get(representativeVolumeId);
      if (volume === undefined || volume.workId !== work.id) {
        issues.push({
          code: "REPRESENTATIVE_VOLUME_INVALID",
          workId: work.id,
          volumeId: representativeVolumeId,
          field: "representativeVolumeByWorkId",
          message: `Representative volume ${representativeVolumeId} does not belong to ${work.id}`,
        });
      }
    }
  }

  return issues;
}
