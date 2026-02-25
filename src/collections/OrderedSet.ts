/**
 * Ordered set (STL-style set). Unique elements sorted by comparator. O(log n) has, O(n) add/delete.
 * Implemented with a sorted array and binary search.
 */
import type { Comparator } from '../types/index.js';

function defaultCompare<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class OrderedSet<T> {
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

  has(value: T): boolean {
    const i = this._lowerBound(value);
    return i < this._data.length && this._compare(this._data[i], value) === 0;
  }

  add(value: T): void {
    const i = this._lowerBound(value);
    if (i >= this._data.length || this._compare(this._data[i], value) !== 0) {
      this._data.splice(i, 0, value);
    }
  }

  delete(value: T): boolean {
    const i = this._lowerBound(value);
    if (i < this._data.length && this._compare(this._data[i], value) === 0) {
      this._data.splice(i, 1);
      return true;
    }
    return false;
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
