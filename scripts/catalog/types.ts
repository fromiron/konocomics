import type { z } from "zod";

import type {
  aliasSourceRowSchema,
  evidenceSourceRowSchema,
  factorSourceRowSchema,
  themeSourceRowSchema,
  volumeSourceRowSchema,
  workSourceRowSchema,
} from "./source-schema";

export type Located<T> = {
  file: string;
  row: number;
  value: T;
};

export type WorkSourceRow = z.infer<typeof workSourceRowSchema>;
export type AliasSourceRow = z.infer<typeof aliasSourceRowSchema>;
export type VolumeSourceRow = z.infer<typeof volumeSourceRowSchema>;
export type FactorSourceRow = z.infer<typeof factorSourceRowSchema>;
export type ThemeSourceRow = z.infer<typeof themeSourceRowSchema>;
export type EvidenceSourceRow = z.infer<typeof evidenceSourceRowSchema>;

export type CatalogSource = {
  works: Located<WorkSourceRow>[];
  aliases: Located<AliasSourceRow>[];
  volumes: Located<VolumeSourceRow>[];
  factors: Located<FactorSourceRow>[];
  themes: Located<ThemeSourceRow>[];
  evidence: Located<EvidenceSourceRow>[];
};

export type SourceIssueSeverity = "error" | "warning";

export type SourceIssue = {
  severity: SourceIssueSeverity;
  code: string;
  file: string;
  row?: number;
  field?: string;
  message: string;
};

export type SourceLoadResult = {
  source: CatalogSource;
  issues: SourceIssue[];
};
