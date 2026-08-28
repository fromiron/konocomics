PRAGMA user_version = 1;

CREATE TABLE source_works (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "titleKana" TEXT NOT NULL,
  "creators" TEXT NOT NULL,
  "publisher" TEXT NOT NULL,
  "demographic" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "firstPublishedYear" TEXT NOT NULL,
  "genres" TEXT NOT NULL,
  "factorScope" TEXT NOT NULL,
  "onboardingEligible" TEXT NOT NULL,
  "recommendationEligible" TEXT NOT NULL,
  "libraryOnly" TEXT NOT NULL,
  "metadataConfidence" TEXT NOT NULL,
  "groupingConfidence" TEXT NOT NULL,
  "sourceAgreement" TEXT NOT NULL,
  "annotationReviewMethod" TEXT NOT NULL,
  "annotationReviewedAt" TEXT NOT NULL,
  "annotationReviewReference" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL
) STRICT;

CREATE TABLE source_aliases (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "alias" TEXT NOT NULL
) STRICT;

CREATE TABLE source_volumes (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "id" TEXT NOT NULL,
  "workId" TEXT NOT NULL,
  "volumeNumber" TEXT NOT NULL,
  "isbn" TEXT NOT NULL,
  "releaseDate" TEXT NOT NULL,
  "editionKind" TEXT NOT NULL,
  "isRepresentative" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL
) STRICT;

CREATE TABLE source_factors (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "axisId" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL
) STRICT;

CREATE TABLE source_themes (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "themeId" TEXT NOT NULL,
  "centrality" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL
) STRICT;

CREATE TABLE source_recommendation_context (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "catalogRole" TEXT NOT NULL,
  "seriesGroupId" TEXT NOT NULL,
  "volumeCount" TEXT NOT NULL,
  "reviewAverage" TEXT NOT NULL,
  "reviewCount" TEXT NOT NULL
) STRICT;

CREATE TABLE source_recommendation_config (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "catalogAverageRating" TEXT NOT NULL
) STRICT;

CREATE TABLE source_evidence (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "id" TEXT NOT NULL,
  "workId" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "fetchedAt" TEXT NOT NULL,
  "extractorVersion" TEXT NOT NULL,
  "reviewedByHuman" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "notes" TEXT NOT NULL
) STRICT;

CREATE TABLE source_art_evidence_manifest (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "axisId" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "authorityClass" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "edition" TEXT NOT NULL,
  "scopeMapping" TEXT NOT NULL,
  "pageOrTimeRefs" TEXT NOT NULL,
  "sampleCount" TEXT NOT NULL,
  "contexts" TEXT NOT NULL,
  "observation" TEXT NOT NULL,
  "limitation" TEXT NOT NULL,
  "reviewStatus" TEXT NOT NULL
) STRICT;
