export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function roundScore(value: number) {
  return Number(value.toFixed(12));
}

const FLOATING_POINT_TOLERANCE = Number.EPSILON * 4;

export function compareFloatingPoint(left: number, right: number) {
  const tolerance = FLOATING_POINT_TOLERANCE * Math.max(1, Math.abs(left), Math.abs(right));
  if (Math.abs(left - right) <= tolerance) {
    return 0;
  }
  return left < right ? -1 : 1;
}

export function meetsFloatingPointThreshold(value: number, threshold: number) {
  return compareFloatingPoint(value, threshold) >= 0;
}

export function ownRecordValue<Value>(
  record: Readonly<Record<string, Value>>,
  key: string,
): Value | undefined {
  return Object.prototype.hasOwnProperty.call(record, key) ? record[key] : undefined;
}

export function compareText(left: string, right: string) {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}
