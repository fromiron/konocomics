import Link from "next/link";

import { strings } from "../../src/lib/strings";

const copy = strings.g2Harness;

export default function EntryPage() {
  return (
    <main className="page-shell entry-shell">
      <header className="entry-header">
        <p className="eyebrow">{copy.entry.eyebrow}</p>
        <p className="wordmark" aria-label={strings.appName}>
          <span>kono</span>co<span>mi</span>cs
        </p>
        <h1>{copy.entry.title}</h1>
        <p className="lede">{copy.entry.description}</p>
      </header>

      <section aria-labelledby="entry-options">
        <h2 id="entry-options">{copy.entry.choose}</h2>
        <div className="entry-options">
          <Link className="entry-option" href="/human/">
            <strong>{copy.entry.humanTitle}</strong>
            <span>{copy.entry.humanDescription}</span>
          </Link>
          <Link className="entry-option" href="/synthetic-pilot/">
            <strong>{copy.entry.syntheticPilotTitle}</strong>
            <span>{copy.entry.syntheticPilotDescription}</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
