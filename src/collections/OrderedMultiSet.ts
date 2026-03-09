/**
 * Ordered multiset (STL-style multiset). Elements sorted by comparator; duplicates allowed.
 * O(log n) has/count, O(n) add/delete. Implemented with a sorted array and binary search.
 */
import type { Comparator } from '../types/index.js';

function defaultCompare<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class OrderedMultiSet<T> {
  private _data: T[] = [];
  private _compare: Comparator<T>;

  constructor(compare?: Comparator<T>) {
    this._compare = compare ?? defaultCompare;
  }

  get size(): number {
    return this._data.length;
  }

  get empty(): boolean {
    return this._data.length === 0;
  }

  private _lowerBound(value: T): number {
    const cmp = this._compare;
    let lo = 0;
    let hi = this._data.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (cmp(this._data[mid], value) < 0) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  private _upperBound(value: T): number {
    const cmp = this._compare;
    let lo = 0;
    let hi = this._data.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (cmp(value, this._data[mid]) < 0) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }

  has(value: T): boolean {
    const i = this._lowerBound(value);
    return i < this._data.length && this._compare(this._data[i], value) === 0;
  }

  /** Number of elements equal to value. */
  count(value: T): number {
    return this._upperBound(value) - this._lowerBound(value);
  }

  /** Insert value (duplicates allowed). */
  add(value: T): void {
    const i = this._lowerBound(value);
    this._data.splice(i, 0, value);
  }

  /** Remove one occurrence of value. Returns true if removed. */
  delete(value: T): boolean {
    const i = this._lowerBound(value);
    if (i < this._data.length && this._compare(this._data[i], value) === 0) {
      this._data.splice(i, 1);
      return true;
    }
    return false;
  }

  /** Remove all occurrences of value. Returns count removed. */
  deleteAll(value: T): number {
    const lo = this._lowerBound(value);
    const hi = this._upperBound(value);
    const removed = hi - lo;
    if (removed > 0) this._data.splice(lo, removed);
    return removed;
  }

  clear(): void {
    this._data.length = 0;
  }

  [Symbol.iterator](): Iterator<T> {
    return this._data[Symbol.iterator]();
  }

  toArray(): T[] {
    return [...this._data];
  }
}
