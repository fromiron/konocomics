import { PageHeader } from "@/components/layout/page-header";
import { aboutStrings } from "@/lib/strings";

const sectionClassName = "grid gap-[var(--space-content)] border-t border-line pt-[var(--space-6)]";
const headingClassName = "text-[length:var(--text-section-title-size)] text-text-strong";
const paragraphClassName = "text-text-muted";

export function AboutPage() {
  return (
    <main className="mx-auto grid w-full max-w-[var(--layout-width-reading)] gap-[var(--space-6)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)]">
      <PageHeader title={aboutStrings.title}>
        <p className={paragraphClassName}>{aboutStrings.lead}</p>
      </PageHeader>
      {aboutStrings.sections.map((section) => (
        <section className={sectionClassName} key={section.title}>
          <h2 className={headingClassName}>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p className={paragraphClassName} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}
      <section className={sectionClassName}>
        <h2 className={headingClassName}>{aboutStrings.contact.title}</h2>
        <p className={paragraphClassName}>{aboutStrings.contact.description}</p>
        <a
          aria-label={aboutStrings.contact.linkLabel}
          className="inline-flex min-h-[var(--control-min-size)] items-center justify-self-start font-bold text-accent-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          href={aboutStrings.contact.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {aboutStrings.contact.link}
          <span aria-hidden="true"> ›</span>
        </a>
      </section>
      <p className="border-t border-line pt-[var(--space-6)] text-[length:var(--text-caption-size)] text-text-muted">
        {aboutStrings.enactedAt}
      </p>
    </main>
  );
}
