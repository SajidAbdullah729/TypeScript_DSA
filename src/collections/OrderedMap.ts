/**
 * Ordered map (STL-style map). Keys sorted by comparator. O(log n) get/has, O(n) set/delete.
 * Implemented with a sorted array and binary search.
 */
import type { Comparator } from '../types/index.js';

function defaultCompare<K>(a: K, b: K): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class OrderedMap<K, V> {
  private _entries: [K, V][] = [];
  private _compare: Comparator<K>;

  constructor(compare?: Comparator<K>) {
    this._compare = compare ?? defaultCompare;
  }

  get size(): number {
    return this._entries.length;
  }

  get empty(): boolean {
    return this._entries.length === 0;
  }

  private _lowerBound(key: K): number {
    const cmp = this._compare;
    let lo = 0;
    let hi = this._entries.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (cmp(this._entries[mid][0], key) < 0) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  get(key: K): V | undefined {
    const i = this._lowerBound(key);
    if (i < this._entries.length && this._compare(this._entries[i][0], key) === 0) {
      return this._entries[i][1];
    }
    return undefined;
  }

  set(key: K, value: V): void {
    const i = this._lowerBound(key);
    if (i < this._entries.length && this._compare(this._entries[i][0], key) === 0) {
      this._entries[i][1] = value;
    } else {
      this._entries.splice(i, 0, [key, value]);
    }
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    const i = this._lowerBound(key);
    if (i < this._entries.length && this._compare(this._entries[i][0], key) === 0) {
      this._entries.splice(i, 1);
      return true;
    }
    return false;
  }

  clear(): void {
    this._entries.length = 0;
  }

  keys(): Iterable<K> {
    return this._entries.map((e) => e[0]);
  }

  values(): Iterable<V> {
    return this._entries.map((e) => e[1]);
  }

  entries(): Iterable<[K, V]> {
    return this._entries;
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this._entries[Symbol.iterator]();
  }
}
