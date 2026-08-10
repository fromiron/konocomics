import { clamp } from "./math";

export function calculateBayesianRating(
  reviewAverage: number | undefined,
  reviewCount: number | undefined,
  catalogAverage: number,
) {
  const count = reviewAverage === undefined ? 0 : (reviewCount ?? 0);
  const average = reviewAverage ?? catalogAverage;
  return (count * average + 20 * catalogAverage) / (count + 20);
}

export function calculateMaturity(volumeCount: number | undefined) {
  const count = volumeCount ?? 0;
  return clamp(Math.log1p(count) / Math.log1p(15), 0, 1);
}
