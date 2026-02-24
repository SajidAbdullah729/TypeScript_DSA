/**
 * STL-like algorithms. Work on arrays and any IterableLike (Vector, List, etc.).
 * Uses a single copy to array when source is not already an array.
 */
import type { Comparator, Predicate, Reducer, UnaryFn } from '../types/index.js';
import { toArray } from '../types/index.js';

function defaultCompare<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function sort<T>(
  source: Iterable<T> | T[],
  compare?: Comparator<T>
): T[] {
  const arr = toArray(source);
  const out = [...arr];
  out.sort(compare ?? defaultCompare);
  return out;
}

export function find<T>(
  source: Iterable<T> | T[],
  predicate: Predicate<T>
): T | undefined {
  for (const x of toArray(source)) {
    if (predicate(x)) return x;
  }
  return undefined;
}

export function findIndex<T>(
  source: Iterable<T> | T[],
  predicate: Predicate<T>
): number {
  const arr = toArray(source);
  return arr.findIndex(predicate);
}

export function transform<T, U>(
  source: Iterable<T> | T[],
  fn: UnaryFn<T, U>
): U[] {
  const arr = toArray(source);
  return arr.map(fn);
}

export function filter<T>(
  source: Iterable<T> | T[],
  predicate: Predicate<T>
): T[] {
  const arr = toArray(source);
  return arr.filter(predicate);
}

export function reduce<T, U>(
  source: Iterable<T> | T[],
  fn: Reducer<T, U>,
  initial: U
): U {
  const arr = toArray(source);
  return arr.reduce(fn, initial);
}

export function reverse<T>(source: Iterable<T> | T[]): T[] {
  const arr = toArray(source);
  return [...arr].reverse();
}

export function unique<T>(source: Iterable<T> | T[]): T[] {
  return [...new Set(toArray(source))];
}

/** Binary search in sorted range. Returns index of first match or -1. O(log n). */
export function binarySearch<T>(
  source: Iterable<T> | T[],
  value: T,
  compare?: Comparator<T>
): number {
  const arr = toArray(source);
  const cmp = compare ?? defaultCompare;
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    const c = cmp(arr[mid], value);
    if (c < 0) lo = mid + 1;
    else if (c > 0) hi = mid;
    else return mid;
  }
  return -1;
}

/** First index where arr[i] >= value (sorted). O(log n). */
export function lowerBound<T>(
  source: Iterable<T> | T[],
  value: T,
  compare?: Comparator<T>
): number {
  const arr = toArray(source);
  const cmp = compare ?? defaultCompare;
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cmp(arr[mid], value) < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** First index where arr[i] > value (sorted). O(log n). */
export function upperBound<T>(
  source: Iterable<T> | T[],
  value: T,
  compare?: Comparator<T>
): number {
  const arr = toArray(source);
  const cmp = compare ?? defaultCompare;
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cmp(arr[mid], value) <= 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Minimum element. O(n). */
export function min<T>(
  source: Iterable<T> | T[],
  compare?: Comparator<T>
): T | undefined {
  const arr = toArray(source);
  if (arr.length === 0) return undefined;
  const cmp = compare ?? defaultCompare;
  let best = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (cmp(arr[i], best) < 0) best = arr[i];
  }
  return best;
}

/** Maximum element. O(n). */
export function max<T>(
  source: Iterable<T> | T[],
  compare?: Comparator<T>
): T | undefined {
  const arr = toArray(source);
  if (arr.length === 0) return undefined;
  const cmp = compare ?? defaultCompare;
  let best = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (cmp(arr[i], best) > 0) best = arr[i];
  }
  return best;
}

/** Partition range by predicate. Returns index of first element where predicate is false. Mutates array. */
export function partition<T>(
  arr: T[],
  predicate: Predicate<T>,
  start = 0,
  end = arr.length
): number {
  let i = start;
  for (let j = start; j < end; j++) {
    if (predicate(arr[j])) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  return i;
}
