/**
 * Ordered map (STL-style map). Keys sorted by comparator.
 * O(log n) get/set/has/delete. Implemented with a Red-Black tree.
 */
import type { Comparator } from '../types/index.js';
import { RedBlackTree } from './RedBlackTree.js';

function defaultCompare<K>(a: K, b: K): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class OrderedMap<K, V> {
  private _tree: RedBlackTree<K, V>;

  constructor(compare?: Comparator<K>) {
    this._tree = new RedBlackTree<K, V>({
      compare: compare ?? defaultCompare,
      allowDuplicateKeys: false,
    });
  }

  get size(): number {
    return this._tree.size;
  }

  get empty(): boolean {
    return this._tree.empty;
  }

  get(key: K): V | undefined {
    return this._tree.get(key);
  }

  set(key: K, value: V): void {
    this._tree.set(key, value);
  }

  has(key: K): boolean {
    return this._tree.has(key);
  }

  delete(key: K): boolean {
    return this._tree.deleteKey(key);
  }

  clear(): void {
    this._tree.clear();
  }

  keys(): Iterable<K> {
    return this._tree.keys();
  }

  values(): Iterable<V> {
    return this._tree.values();
  }

  entries(): Iterable<[K, V]> {
    return this._tree.entries();
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this._tree.entries();
  }
}
