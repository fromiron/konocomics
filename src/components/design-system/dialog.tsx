import type { ComponentProps } from "react";
import { XIcon } from "lucide-react";

import { Button } from "@/components/design-system/button";
import {
  Dialog as PrimitiveDialog,
  DialogClose as PrimitiveDialogClose,
  DialogContent as PrimitiveDialogContent,
  DialogDescription as PrimitiveDialogDescription,
  DialogFooter as PrimitiveDialogFooter,
  DialogHeader as PrimitiveDialogHeader,
  DialogTitle as PrimitiveDialogTitle,
  DialogTrigger as PrimitiveDialogTrigger,
} from "@/components/ui/dialog";
import { designSystemStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

export const Dialog = PrimitiveDialog;

export function DialogTrigger({
  className,
  ...props
}: ComponentProps<typeof PrimitiveDialogTrigger>) {
  return (
    <PrimitiveDialogTrigger
      className={cn(
        "touch-target min-h-[var(--control-min-size)] min-w-[var(--control-min-size)]",
        className,
      )}
      {...props}
    />
  );
}

export function DialogClose({ className, ...props }: ComponentProps<typeof PrimitiveDialogClose>) {
  return (
    <PrimitiveDialogClose
      className={cn(
        "touch-target min-h-[var(--control-min-size)] min-w-[var(--control-min-size)]",
        className,
      )}
      {...props}
    />
  );
}

export function DialogContent({
  children,
  className,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof PrimitiveDialogContent>) {
  return (
    <PrimitiveDialogContent
      className={cn(
        "max-h-[calc(100dvh-var(--space-8))] overflow-y-auto rounded-[var(--radius-card)] border border-line bg-surface-1 text-text shadow-[var(--shadow-raised)] ring-0 !transition-none !animate-none sm:max-w-lg",
        className,
      )}
      showCloseButton={false}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <PrimitiveDialogClose
          render={
            <Button
              aria-label={designSystemStrings.close}
              className="absolute top-2 right-2"
              size="icon-sm"
              variant="ghost"
            />
          }
        >
          <XIcon aria-hidden="true" />
        </PrimitiveDialogClose>
      ) : null}
    </PrimitiveDialogContent>
  );
}

export function DialogHeader({
  className,
  ...props
}: ComponentProps<typeof PrimitiveDialogHeader>) {
  return (
    <PrimitiveDialogHeader className={cn("gap-[var(--space-content)]", className)} {...props} />
  );
}

export function DialogFooter({
  className,
  ...props
}: Omit<ComponentProps<typeof PrimitiveDialogFooter>, "showCloseButton">) {
  return (
    <PrimitiveDialogFooter
      className={cn("border-line bg-surface-2", className)}
      showCloseButton={false}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof PrimitiveDialogTitle>) {
  return <PrimitiveDialogTitle className={cn("text-text-strong", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof PrimitiveDialogDescription>) {
  return <PrimitiveDialogDescription className={cn("text-text-muted", className)} {...props} />;
}
