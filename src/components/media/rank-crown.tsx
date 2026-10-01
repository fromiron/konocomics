import { useId } from "react";

export type RankMedal = "gold" | "silver" | "bronze";

export function rankMedalFor(position: number | undefined): RankMedal | undefined {
  if (position === 1) return "gold";
  if (position === 2) return "silver";
  if (position === 3) return "bronze";
  return undefined;
}

const CROWN_PATH =
  "M4 19.5 2.4 7.6a1 1 0 0 1 1.6-.94l5.2 4.1 5.9-8.2a1 1 0 0 1 1.62 0l5.9 8.2 5.2-4.1a1 1 0 0 1 1.6.94L28 19.5Z";

/**
 * Decorative metal crown for the top three personalized ranks (04 §2.5). Shading comes from
 * the medal tokens; the shine band and sparkles are animated by CSS only when the rank badge
 * is hovered or focused, and the crown never rotates.
 */
export function RankCrown({ medal }: Readonly<{ medal: RankMedal }>) {
  const id = useId().replace(/:/gu, "");
  const fill = `rank-crown-fill-${id}`;
  const clip = `rank-crown-clip-${id}`;

  return (
    <svg
      aria-hidden="true"
      className="rank-crown"
      data-medal={medal}
      focusable="false"
      viewBox="0 0 32 26"
    >
      <defs>
        <linearGradient id={fill} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--rank-crown-light)" />
          <stop offset="55%" stopColor="var(--rank-crown-base)" />
          <stop offset="100%" stopColor="var(--rank-crown-deep)" />
        </linearGradient>
        <clipPath id={clip}>
          <path d={CROWN_PATH} />
          <rect height="4.5" rx="1.2" width="25" x="3.5" y="19.5" />
        </clipPath>
      </defs>
      <g stroke="var(--rank-crown-outline)" strokeLinejoin="round" strokeWidth="1.2">
        <path d={CROWN_PATH} fill={`url(#${fill})`} />
        <rect fill="var(--rank-crown-deep)" height="4.5" rx="1.2" width="25" x="3.5" y="19.5" />
      </g>
      <g fill="var(--rank-crown-light)" stroke="var(--rank-crown-outline)" strokeWidth="1">
        <circle cx="3.1" cy="6.3" r="1.6" />
        <circle cx="16" cy="2.3" r="1.8" />
        <circle cx="28.9" cy="6.3" r="1.6" />
      </g>
      <circle cx="16" cy="15.4" fill="var(--rank-crown-gem)" r="1.7" />
      <circle cx="9.6" cy="16.2" fill="var(--rank-crown-light)" r="1" />
      <circle cx="22.4" cy="16.2" fill="var(--rank-crown-light)" r="1" />
      <g clipPath={`url(#${clip})`}>
        <polygon
          className="rank-crown__shine"
          fill="var(--rank-crown-shine)"
          points="2,26 8,0 12,0 6,26"
        />
      </g>
      <path
        className="rank-crown__spark rank-crown__spark--start"
        d="M4 2.5 4.7 4.3 6.5 5 4.7 5.7 4 7.5 3.3 5.7 1.5 5 3.3 4.3Z"
        fill="var(--rank-crown-light)"
      />
      <path
        className="rank-crown__spark rank-crown__spark--end"
        d="M28.5 0.5 29.1 2 30.6 2.6 29.1 3.2 28.5 4.7 27.9 3.2 26.4 2.6 27.9 2Z"
        fill="var(--rank-crown-light)"
      />
    </svg>
  );
}
