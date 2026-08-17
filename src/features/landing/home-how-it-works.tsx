import { BookOpenIcon, CircleCheckIcon, FingerprintIcon } from "lucide-react";

import { Link } from "@tanstack/react-router";
import { landingStrings } from "@/lib/strings";

const stepIcons = [BookOpenIcon, FingerprintIcon, CircleCheckIcon] as const;

export function HomeHowItWorks() {
  return (
    <section aria-labelledby="landing-steps-title" className="grid gap-[var(--space-3)]">
      <div className="grid gap-[var(--space-2)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)]">
        <h2 className="text-[length:var(--text-subheading-size)]" id="landing-steps-title">
          {landingStrings.stepsHeading}
        </h2>
        <ol className="m-0 grid list-none gap-[var(--space-5)] p-0 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {landingStrings.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <li
                className="grid grid-cols-[var(--control-min-size)_minmax(0,1fr)] content-start gap-x-[var(--space-3)] gap-y-[var(--space-content-tight)] md:px-[var(--space-4)] md:first:pl-0 md:last:pr-0"
                key={step.title}
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 grid size-[var(--control-min-size)] place-items-center rounded-[var(--radius-pill)] border border-line-accent bg-accent-soft text-accent"
                >
                  {Icon === undefined ? null : <Icon className="size-5" />}
                </span>
                <div className="flex items-baseline gap-[var(--space-content)]">
                  <span
                    aria-hidden="true"
                    className="font-display text-[length:var(--text-caption-size)] font-bold text-accent tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[length:var(--font-size-16)]">{step.title}</h3>
                </div>
                <p className="text-[length:var(--text-caption-size)] text-text-muted">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-content)] text-[length:var(--text-caption-size)] text-text-muted">
        <p>{landingStrings.footer.storage}</p>
        <Link
          className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent"
          preload={false}
          to="/settings"
        >
          {landingStrings.footer.settings}
        </Link>
      </div>
    </section>
  );
}
