import type { SourceIssue } from "./types";

export function formatSourceIssue(issue: SourceIssue) {
  const location = [issue.file, issue.row, issue.field]
    .filter((part) => part !== undefined)
    .join(":");
  return `${issue.severity.toUpperCase()} ${issue.code} ${location} ${issue.message}`;
}

export function hasErrors(issues: readonly SourceIssue[]) {
  return issues.some((issue) => issue.severity === "error");
}
