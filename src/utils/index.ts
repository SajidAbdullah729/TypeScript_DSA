/**
 * Common utilities exposed by the SDK.
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function range(start: number, end: number, step = 1): number[] {
  const out: number[] = [];
  for (let i = start; step > 0 ? i < end : i > end; i += step) {
    out.push(i);
  }
  return out;
}

export function noop(): void {}

export function identity<T>(x: T): T {
  return x;
}

/** Swap two elements in an array. O(1). */
export function swap<T>(arr: T[], i: number, j: number): void {
  if (i < 0 || i >= arr.length || j < 0 || j >= arr.length) {
    throw new RangeError('swap: index out of range');
  }
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
