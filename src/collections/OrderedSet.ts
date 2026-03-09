/**
 * Ordered set (STL-style set). Unique elements sorted by comparator.
 * O(log n) has/add/delete. Implemented with a Red-Black tree.
 */
import type { Comparator } from '../types/index.js';
import { RedBlackTree } from './RedBlackTree.js';

function defaultCompare<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class OrderedSet<T> {
  private _tree: RedBlackTree<T, T>;

  constructor(compare?: Comparator<T>) {
    this._tree = new RedBlackTree<T, T>({
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

  has(value: T): boolean {
    return this._tree.has(value);
  }

  add(value: T): void {
    this._tree.set(value, value);
  }

  delete(value: T): boolean {
    return this._tree.deleteKey(value);
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
