import type { SVGProps } from "react";

export type NavigationIconName = "recommendations" | "taste" | "library" | "settings";

type NavigationIconProps = Readonly<{
  name: NavigationIconName;
}>;

const commonSvgProps = {
  "aria-hidden": true,
  className: "app-navigation__icon",
  fill: "none",
  focusable: false,
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
  viewBox: "0 0 24 24",
} as const satisfies SVGProps<SVGSVGElement>;

export function NavigationIcon({ name }: NavigationIconProps) {
  if (name === "recommendations") {
    return (
      <svg {...commonSvgProps}>
        <path d="M4 5.5h6.5a3 3 0 0 1 3 3V19H7a3 3 0 0 0-3 3V5.5Z" />
        <path d="M20 5.5h-6.5a3 3 0 0 0-3 3V19H17a3 3 0 0 1 3 3V5.5Z" />
      </svg>
    );
  }

  if (name === "taste") {
    return (
      <svg {...commonSvgProps}>
        <path d="M5 19V9" />
        <path d="M12 19V4" />
        <path d="M19 19v-7" />
        <path d="M3 19h18" />
      </svg>
    );
  }

  if (name === "library") {
    return (
      <svg {...commonSvgProps}>
        <path d="M5 4h4v16H5z" />
        <path d="M10 4h4v16h-4z" />
        <path d="m15.5 5 3.5-1 3.5 14-3.5 1-3.5-14Z" />
      </svg>
    );
  }

  return (
    <svg {...commonSvgProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4.2 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2v-4h.5A1.7 1.7 0 0 0 4.2 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6.66 3.8l.06.06A1.7 1.7 0 0 0 8.6 4.2a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 10 2.5V2h4v.5a1.7 1.7 0 0 0 1 1.7 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 8.6a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.9v4h-.9a1.7 1.7 0 0 0-1.7 1Z" />
    </svg>
  );
}
