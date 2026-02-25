/**
 * Unordered set (STL-style unordered_set). Hash-based. O(1) average add/has/delete.
 * Wraps the native Set with an STL-like API.
 */
export class UnorderedSet<T> {
  private _set: globalThis.Set<T> = new Set();

  constructor(values?: Iterable<T>) {
    if (values) {
      for (const v of values) this._set.add(v);
    }
  }

  get size(): number {
    return this._set.size;
  }

  get empty(): boolean {
    return this._set.size === 0;
  }

  has(value: T): boolean {
    return this._set.has(value);
  }

  add(value: T): void {
    this._set.add(value);
  }

  delete(value: T): boolean {
    return this._set.delete(value);
  }

  clear(): void {
    this._set.clear();
  }

  [Symbol.iterator](): Iterator<T> {
    return this._set.values();
  }

  toArray(): T[] {
    return [...this._set];
  }
}
