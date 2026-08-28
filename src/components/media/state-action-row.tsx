import { BookmarkIcon, CircleCheckIcon, CircleXIcon } from "lucide-react";
import type { KeyboardEvent } from "react";

import { Button } from "@/components/design-system/button";
import { recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type StateActionRowProps = Readonly<{
  busy: boolean;
  planned: boolean;
  compact?: boolean;
  className?: string;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent?: () => void;
}>;

export function StateActionRow({
  busy,
  className,
  compact = false,
  onCompleted,
  onHidden,
  onPlanned,
  onRemovalIntent,
  planned,
}: StateActionRowProps) {
  const prepareKeyboardRemoval = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!busy && (event.key === "Enter" || event.key === " ")) onRemovalIntent?.();
  };
  const baseButtonClass =
    "flex min-h-[var(--control-min-size)] min-w-0 items-center justify-center gap-[var(--space-1)] text-[length:var(--font-size-12)] font-bold";
  const iconClassName = "size-4 shrink-0";
  const compactLabelClassName = compact
    ? "hidden text-[length:var(--text-caption-size)] leading-tight whitespace-nowrap [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:inline"
    : undefined;

  return (
    <div
      className={cn(
        compact
          ? "grid h-11 w-full grid-cols-3 items-stretch [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:w-[calc(var(--control-min-size)*5.5)]"
          : "grid grid-cols-[minmax(0,1fr)_auto_auto] gap-[var(--space-2)]",
        className,
      )}
    >
      <Button
        aria-label={
          compact
            ? planned
              ? `${recommendationStrings.actions.planned}、${recommendationStrings.actions.plannedConfirmation}`
              : recommendationStrings.actions.planned
            : undefined
        }
        aria-pressed={planned}
        className={cn(
          baseButtonClass,
          compact
            ? "h-11 rounded-none border-0 px-[var(--space-content-tight)]"
            : "rounded-[var(--radius-cover)] border px-[var(--space-3)] py-1.5",
          "border-accent bg-accent !text-on-accent hover:bg-accent-hover",
        )}
        busy={busy}
        onClick={onPlanned}
        type="button"
      >
        <BookmarkIcon aria-hidden="true" className={cn(iconClassName, planned && "fill-current")} />
        <span className={compactLabelClassName}>
          {compact && planned
            ? recommendationStrings.actions.plannedConfirmation
            : recommendationStrings.actions.planned}
        </span>
      </Button>
      <Button
        aria-label={compact ? recommendationStrings.actions.completed : undefined}
        className={cn(
          baseButtonClass,
          compact
            ? "h-11 rounded-none border-0 bg-transparent px-[var(--space-content-tight)] text-text-muted hover:bg-transparent hover:text-text-strong"
            : "rounded-[var(--radius-cover)] border border-line/80 px-[var(--space-3)] py-1.5 bg-transparent text-text-muted hover:border-line-accent-subtle hover:bg-surface-2 hover:text-text-strong",
        )}
        data-recommendation-action="completed"
        busy={busy}
        onClick={() => {
          onRemovalIntent?.();
          onCompleted();
        }}
        onKeyDown={prepareKeyboardRemoval}
        onPointerDown={busy ? undefined : onRemovalIntent}
        type="button"
        variant={compact ? "ghost" : "outline"}
      >
        <CircleCheckIcon aria-hidden="true" className={iconClassName} />
        <span className={compactLabelClassName}>{recommendationStrings.actions.completed}</span>
      </Button>
      <Button
        aria-label={compact ? recommendationStrings.actions.hidden : undefined}
        className={cn(
          baseButtonClass,
          compact
            ? "h-11 rounded-none border-0 bg-transparent px-[var(--space-content-tight)] text-text-muted hover:bg-transparent hover:text-warn focus-visible:text-warn"
            : "rounded-[var(--radius-cover)] border border-line/80 px-[var(--space-3)] py-1.5 bg-transparent text-text-muted hover:border-warn hover:bg-surface-danger-soft hover:text-warn",
        )}
        data-recommendation-action="hidden"
        busy={busy}
        onClick={() => {
          onRemovalIntent?.();
          onHidden();
        }}
        onKeyDown={prepareKeyboardRemoval}
        onPointerDown={busy ? undefined : onRemovalIntent}
        type="button"
        variant={compact ? "ghost" : "outline"}
      >
        <CircleXIcon aria-hidden="true" className={iconClassName} />
        <span className={compactLabelClassName}>{recommendationStrings.actions.hidden}</span>
      </Button>
    </div>
  );
}
