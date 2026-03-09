/**
 * Ordered multiset (STL-style multiset). Elements sorted by comparator; duplicates allowed.
 * O(log n) has/count/add/delete. Implemented with a Red-Black tree (duplicate keys allowed).
 */
import type { Comparator } from '../types/index.js';
import { RedBlackTree } from './RedBlackTree.js';

function defaultCompare<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class OrderedMultiSet<T> {
  private _tree: RedBlackTree<T, T>;

  constructor(compare?: Comparator<T>) {
    this._tree = new RedBlackTree<T, T>({
      compare: compare ?? defaultCompare,
      allowDuplicateKeys: true,
    });
  }

  get size(): number {
    return this._tree.size;
  }

  get empty(): boolean {
    return this._tree.empty;
  }

  has(value: T): boolean {
    return this._tree.has(value);
  }

  /** Number of elements equal to value. */
  count(value: T): number {
    return this._tree.count(value);
  }

  /** Insert value (duplicates allowed). */
  add(value: T): void {
    this._tree.set(value, value);
  }

  /** Remove one occurrence of value. Returns true if removed. */
  delete(value: T): boolean {
    return this._tree.deleteKey(value);
  }

  /** Remove all occurrences of value. Returns count removed. */
  deleteAll(value: T): number {
    return this._tree.deleteAllKeys(value);
  }

  clear(): void {
    this._tree.clear();
  }

  [Symbol.iterator](): Iterator<T> {
    return this._tree.keys();
  }

  toArray(): T[] {
    return [...this._tree.keys()];
  }
}
