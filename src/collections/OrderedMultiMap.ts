/**
 * Ordered multimap (STL-style multimap). Keys sorted by comparator; one key can have multiple values.
 * O(log n) get/set/has/delete. Implemented with a Red-Black tree (duplicate keys allowed).
 */
import type { Comparator } from '../types/index.js';
import { RedBlackTree } from './RedBlackTree.js';

function defaultCompare<K>(a: K, b: K): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class OrderedMultiMap<K, V> {
  private _tree: RedBlackTree<K, V>;
  private _compare: Comparator<K>;

  constructor(compare?: Comparator<K>) {
    this._compare = compare ?? defaultCompare;
    this._tree = new RedBlackTree<K, V>({
      compare: this._compare,
      allowDuplicateKeys: true,
    });
  }

  get size(): number {
    return this._tree.size;
  }

  get empty(): boolean {
    return this._tree.empty;
  }

  /** First value for key, or undefined. */
  get(key: K): V | undefined {
    const node = this._tree.find(key);
    return node ? node.value : undefined;
  }

  /** All values for key (in order). */
  getAll(key: K): V[] {
    const out: V[] = [];
    let node = this._tree.lowerBound(key);
    while (node !== null && this._compare(node.key, key) === 0) {
      out.push(node.value);
      node = this._tree.successor(node);
    }
    return out;
  }

  /** Add a key-value pair (duplicate keys allowed). */
  set(key: K, value: V): void {
    this._tree.set(key, value);
  }

  has(key: K): boolean {
    return this._tree.has(key);
  }

  /** True if the pair (key, value) exists. */
  hasEntry(key: K, value: V): boolean {
    let node = this._tree.lowerBound(key);
    while (node !== null && this._compare(node.key, key) === 0) {
      if (node.value === value) return true;
      node = this._tree.successor(node);
    }
    return false;
  }

  /** Number of pairs with this key. */
  count(key: K): number {
    return this._tree.count(key);
  }

  /** Remove one pair for key (first). If value is given, remove that pair. Returns true if removed. */
  delete(key: K, value?: V): boolean {
    if (value === undefined) {
      return this._tree.deleteKey(key);
    }
    let node = this._tree.lowerBound(key);
    while (node !== null && this._compare(node.key, key) === 0) {
      if (node.value === value) {
        this._tree.deleteNode(node);
        return true;
      }
      node = this._tree.successor(node);
    }
    return false;
  }

  /** Remove all pairs for key. Returns count removed. */
  deleteAll(key: K): number {
    return this._tree.deleteAllKeys(key);
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
