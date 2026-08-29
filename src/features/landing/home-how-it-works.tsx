import { Link } from "@tanstack/react-router";
import { landingStrings } from "@/lib/strings";

export function HomeHowItWorks() {
  return (
    <section aria-labelledby="landing-steps-title" className="grid gap-[var(--space-6)]">
      <div className="grid gap-[var(--space-6)]">
        <h2
          className="text-[length:var(--text-section-title-size)] tracking-tight text-text-strong"
          id="landing-steps-title"
        >
          {landingStrings.stepsHeading}
        </h2>
        <ol className="m-0 grid list-none gap-[var(--space-6)] p-0 md:grid-cols-3 md:gap-[var(--space-8)]">
          {landingStrings.steps.map((step, index) => (
            <li
              className="grid content-start gap-[var(--space-2)] border-t border-line pt-[var(--space-4)]"
              key={step.title}
            >
              <span
                aria-hidden="true"
                className="font-display text-[length:var(--font-size-14)] font-bold text-text-muted tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[length:var(--font-size-16)] font-bold text-text-strong">
                {step.title}
              </h3>
              <p className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-content)] border-t border-line pt-[var(--space-4)] text-[length:var(--text-caption-size)] text-text-muted">
        <p>{landingStrings.footer.storage}</p>
        <Link
          className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-text-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          preload={false}
          to="/settings"
        >
          {landingStrings.footer.settings}
        </Link>
      </div>
    </section>
  );
}
