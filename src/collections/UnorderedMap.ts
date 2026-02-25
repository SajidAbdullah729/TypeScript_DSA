/**
 * Unordered map (STL-style unordered_map). Hash-based. O(1) average get/set/has/delete.
 * Wraps the native Map with an STL-like API.
 */
export class UnorderedMap<K, V> {
  private _map: globalThis.Map<K, V> = new Map();

  constructor(entries?: Iterable<[K, V]>) {
    if (entries) {
      for (const [k, v] of entries) this._map.set(k, v);
    }
  }

  get size(): number {
    return this._map.size;
  }

  get empty(): boolean {
    return this._map.size === 0;
  }

  get(key: K): V | undefined {
    return this._map.get(key);
  }

  set(key: K, value: V): void {
    this._map.set(key, value);
  }

  has(key: K): boolean {
    return this._map.has(key);
  }

  delete(key: K): boolean {
    return this._map.delete(key);
  }

  clear(): void {
    this._map.clear();
  }

  keys(): Iterable<K> {
    return this._map.keys();
  }

  values(): Iterable<V> {
    return this._map.values();
  }

  entries(): Iterable<[K, V]> {
    return this._map.entries();
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this._map.entries();
  }
}
