const CENTER = 170;
const INNER_RADIUS = 72;
const OUTER_RADIUS = 140;
const SEGMENT_GAP = 0.055;

export const DNA_WHEEL_VIEW_BOX = "0 0 340 340";

function point(radius: number, angle: number) {
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)];
}

function segmentPath(start: number, end: number, outerRadius: number) {
  const innerStart = point(INNER_RADIUS, start);
  const outerStart = point(outerRadius, start);
  const outerEnd = point(outerRadius, end);
  const innerEnd = point(INNER_RADIUS, end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M${innerStart}L${outerStart}A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${outerEnd}L${innerEnd}A${INNER_RADIUS},${INNER_RADIUS} 0 ${largeArc} 0 ${innerStart}Z`;
}

/** The track, fill and rank badge position of one wheel segment for a 0–4 value. */
export function dnaWheelSegment(index: number, count: number, value: number) {
  const start = -Math.PI / 2 + (index * Math.PI * 2) / count + SEGMENT_GAP / 2;
  const end = -Math.PI / 2 + ((index + 1) * Math.PI * 2) / count - SEGMENT_GAP / 2;
  const radius = INNER_RADIUS + (value / 4) * (OUTER_RADIUS - INNER_RADIUS);
  const [badgeX = CENTER, badgeY = CENTER] = point(OUTER_RADIUS + 17, (start + end) / 2);
  return {
    trackPath: segmentPath(start, end, OUTER_RADIUS),
    fillPath: segmentPath(start, end, radius),
    badge: { x: badgeX, y: badgeY },
  };
}
