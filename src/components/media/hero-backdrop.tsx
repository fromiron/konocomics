"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { coverSourceForSize } from "@/components/cover/CoverImage";
import { cn } from "@/lib/utils";

type HeroBackdropProps = Readonly<{
  coverUrl?: string | null;
  children: ReactNode;
  className?: string;
  priority?: boolean;
}>;

export function HeroBackdrop({
  children,
  className,
  coverUrl,
  priority = false,
}: HeroBackdropProps) {
  const source = coverUrl?.trim() ?? "";
  const fallbackSource = source === "" ? "" : coverSourceForSize(source, 200);
  const [failure, setFailure] = useState<{
    source: string;
    stage: "requested" | "fallback";
  } | null>(null);
  const failureStage = failure !== null && failure.source === source ? failure.stage : null;
  const currentSource = failureStage === "requested" ? fallbackSource : source;
  const showImage =
    currentSource !== "" &&
    failureStage !== "fallback" &&
    !(failureStage === "requested" && source === fallbackSource);

  return (
    <div
      className={cn("relative isolate overflow-hidden bg-surface-1", className)}
      data-slot="hero-backdrop"
    >
      {showImage ? (
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-y-0 right-0 h-full w-[78%] scale-105 object-cover object-center opacity-55 blur-sm saturate-[0.9]"
          data-cover-source={currentSource}
          decoding="async"
          draggable={false}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          onError={() => {
            setFailure({
              source,
              stage: failureStage === "requested" ? "fallback" : "requested",
            });
          }}
          src={currentSource}
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden h-full w-[78%] opacity-35 md:block"
          style={{
            background:
              "radial-gradient(ellipse 72% 62% at 72% 46%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 62%), radial-gradient(ellipse 48% 42% at 86% 12%, color-mix(in oklch, var(--accent) 9%, transparent), transparent 68%), linear-gradient(to bottom, transparent, color-mix(in oklch, var(--surface-1) 42%, transparent))",
          }}
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--canvas)_0%,color-mix(in_oklch,var(--canvas)_96%,transparent)_30%,color-mix(in_oklch,var(--canvas)_70%,transparent)_72%,var(--hero-scrim)_100%)]"
      />
      <span
        aria-hidden="true"
        className="screentone pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_8%,transparent_72%)]"
      />
      <span
        aria-hidden="true"
        className={
          showImage
            ? "hidden"
            : "pointer-events-none absolute inset-0 opacity-55 [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--line)_22%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--line)_18%,transparent)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_78%)]"
        }
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
