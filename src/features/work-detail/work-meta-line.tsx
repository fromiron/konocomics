import type { ReactNode } from "react";

export type WorkMetaItem = Readonly<{
  key: string;
  /** The item's name. Hidden from sight when the value already says what it is (a publisher). */
  term: string;
  termVisible?: boolean;
  value: ReactNode;
}>;

/**
 * The detail hero's one compact meta line (03 §6, 2026-11-11): only the known values, joined by
 * middle dots (`.dot-separated`), muted, with no boxes. It stays a description list, so every
 * value keeps its name for assistive tech even where the name is not shown. On narrow screens the
 * line wraps and no wrapped line starts with a dot.
 */
export function WorkMetaLine({ items }: Readonly<{ items: readonly WorkMetaItem[] }>) {
  if (items.length === 0) return null;
  return (
    <dl className="work-meta-line dot-separated m-0 items-baseline gap-y-[var(--space-1)] p-0 text-[length:var(--font-size-14)] text-text-muted">
      {items.map((item) => (
        <div className="inline-flex min-w-0 items-baseline gap-[var(--space-1)]" key={item.key}>
          <dt className={item.termVisible === true ? undefined : "sr-only"}>{item.term}</dt>
          <dd className="m-0 [overflow-wrap:anywhere] text-text">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
