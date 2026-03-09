/**
 * Ordered multimap (STL-style multimap). Keys sorted by comparator; one key can have multiple values.
 * O(log n) get/has, O(n) set/delete. Implemented with a sorted array of [key, value] pairs.
 */
import type { Comparator } from '../types/index.js';

function defaultCompare<K>(a: K, b: K): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class OrderedMultiMap<K, V> {
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

  private _upperBound(key: K): number {
    const cmp = this._compare;
    let lo = 0;
    let hi = this._entries.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (cmp(key, this._entries[mid][0]) < 0) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }

  /** First value for key, or undefined. */
  get(key: K): V | undefined {
    const i = this._lowerBound(key);
    if (i < this._entries.length && this._compare(this._entries[i][0], key) === 0) {
      return this._entries[i][1];
    }
    return undefined;
  }

  /** All values for key (in order). */
  getAll(key: K): V[] {
    const lo = this._lowerBound(key);
    const hi = this._upperBound(key);
    return this._entries.slice(lo, hi).map((e) => e[1]);
  }

  /** Add a key-value pair (duplicate keys allowed). */
  set(key: K, value: V): void {
    const i = this._lowerBound(key);
    this._entries.splice(i, 0, [key, value]);
  }

  has(key: K): boolean {
    const i = this._lowerBound(key);
    return i < this._entries.length && this._compare(this._entries[i][0], key) === 0;
  }

  /** True if the pair (key, value) exists. */
  hasEntry(key: K, value: V): boolean {
    const lo = this._lowerBound(key);
    const hi = this._upperBound(key);
    for (let j = lo; j < hi; j++) {
      if (this._entries[j][1] === value) return true;
    }
    return false;
  }

  /** Number of pairs with this key. */
  count(key: K): number {
    return this._upperBound(key) - this._lowerBound(key);
  }

  /** Remove one pair for key (first). If value is given, remove that pair. Returns true if removed. */
  delete(key: K, value?: V): boolean {
    const lo = this._lowerBound(key);
    const hi = this._upperBound(key);
    if (lo >= hi) return false;
    if (value !== undefined) {
      for (let j = lo; j < hi; j++) {
        if (this._entries[j][1] === value) {
          this._entries.splice(j, 1);
          return true;
        }
      }
      return false;
    }
    this._entries.splice(lo, 1);
    return true;
  }

  /** Remove all pairs for key. Returns count removed. */
  deleteAll(key: K): number {
    const lo = this._lowerBound(key);
    const hi = this._upperBound(key);
    const removed = hi - lo;
    if (removed > 0) this._entries.splice(lo, removed);
    return removed;
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
