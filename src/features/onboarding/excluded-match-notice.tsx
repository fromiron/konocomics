"use client";

import { Link } from "@tanstack/react-router";

import { onboardingStrings } from "@/lib/strings";

import type { ExcludedSearchMatch } from "./search";

const strings = onboardingStrings.excludedMatches;

export function ExcludedMatchNotice({
  matches,
}: Readonly<{ matches: readonly ExcludedSearchMatch[] }>) {
  if (matches.length === 0) return null;

  return (
    <section
      aria-label={strings.heading}
      className="onboarding-excluded grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 px-[var(--space-4)] py-[var(--space-4)]"
    >
      <h2 className="text-[length:var(--text-caption-size)] font-bold text-text-muted">
        {strings.heading}
      </h2>
      <ul className="grid gap-[var(--space-3)]">
        {matches.map(({ work, reason }) => (
          <li
            className="grid gap-[var(--space-1)] md:flex md:items-baseline md:justify-between md:gap-[var(--space-4)]"
            data-excluded-reason={reason}
            key={work.id}
          >
            <p className="min-w-0">
              <span className="font-bold text-text-strong">{strings.title(work.title)}</span>
              <span className="block text-[length:var(--text-caption-size)] text-text-muted md:inline md:ps-[var(--space-2)]">
                {strings.reasons[reason]}
              </span>
            </p>
            {reason === "registered" ? (
              <Link
                className="inline-flex min-h-[var(--control-min-size)] shrink-0 items-center text-[length:var(--text-caption-size)] font-bold text-accent-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                search={{ q: work.title }}
                to="/library"
              >
                {strings.openLibrary}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
