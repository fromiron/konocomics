import { cn } from "@/lib/utils";

const chipClassName =
  "inline-flex shrink-0 items-center rounded-[var(--radius-tag)] bg-surface-2 px-[var(--space-2)] py-[2px] text-[length:var(--font-size-12)] leading-[var(--line-height-body)] whitespace-nowrap text-text";

/**
 * Genre and theme labels as rounded tags. The round shape marks information, not action:
 * buttons, filters and states stay square (04 §1), so these chips carry no border and never
 * react to hover. `inline` renders spans for use inside links and other phrasing content, where
 * the link's own accessible name already lists every label.
 */
export function GenreChips({
  className,
  inline = false,
  label,
  labels,
  max,
}: Readonly<{
  className?: string;
  inline?: boolean;
  /** Accessible name of the list; only for the non-inline form. */
  label?: string;
  labels: readonly string[];
  /** Cards keep one line: extra labels stay in the accessible name only. */
  max?: number;
}>) {
  const shown = max === undefined ? labels : labels.slice(0, max);
  if (shown.length === 0) return null;
  const listClassName = cn("flex flex-wrap gap-[var(--space-1)]", className);
  if (inline) {
    return (
      <span className={listClassName}>
        {shown.map((text) => (
          <span className={chipClassName} key={text}>
            {text}
          </span>
        ))}
      </span>
    );
  }
  return (
    <ul aria-label={label} className={cn("m-0 list-none p-0", listClassName)}>
      {shown.map((text) => (
        <li className={chipClassName} key={text}>
          {text}
        </li>
      ))}
    </ul>
  );
}
