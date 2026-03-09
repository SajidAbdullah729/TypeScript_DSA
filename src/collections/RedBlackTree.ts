/**
 * Red-Black tree. O(log n) get/set/add/delete. Used by OrderedSet, OrderedMap, OrderedMultiSet, OrderedMultiMap.
 */
import type { Comparator } from '../types/index.js';

const RED = 0;
const BLACK = 1;

export class RBNode<K, V> {
  key: K;
  value: V;
  left: RBNode<K, V>;
  right: RBNode<K, V>;
  parent: RBNode<K, V>;
  color: 0 | 1;

  constructor(key: K, value: V, color: 0 | 1) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.left = this as any;
    this.right = this as any;
    this.parent = this as any;
  }
}

export interface RedBlackTreeOptions<K> {
  compare?: Comparator<K>;
  /** If true, multiple nodes can have the same key (for MultiSet/MultiMap). */
  allowDuplicateKeys?: boolean;
}

export class RedBlackTree<K, V> {
  private _nil: RBNode<K, V>;
  private _root: RBNode<K, V>;
  private _compare: Comparator<K>;
  private _allowDuplicateKeys: boolean;
  private _nodeCount: number = 0;

  constructor(options: RedBlackTreeOptions<K> = {}) {
    this._compare = options.compare ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    this._allowDuplicateKeys = options.allowDuplicateKeys ?? false;
    this._nil = new RBNode(null as any, null as any, BLACK);
    this._nil.left = this._nil;
    this._nil.right = this._nil;
    this._nil.parent = this._nil;
    this._root = this._nil;
  }

  get size(): number {
    return this._nodeCount;
  }

  get empty(): boolean {
    return this._nodeCount === 0;
  }

  private _cmp(a: K, b: K): number {
    return this._compare(a, b);
  }

  /** Insert position: when equal and allowDuplicateKeys, go right; else we replace (handled in set). */
  private _insertPosition(key: K): { node: RBNode<K, V>; goRight: boolean } {
    let x = this._root;
    let p = this._nil;
    let goRight = false;
    while (x !== this._nil) {
      p = x;
      const c = this._cmp(key, x.key);
      if (c < 0) {
        x = x.left;
        goRight = false;
      } else if (c > 0) {
        x = x.right;
        goRight = true;
      } else {
        if (this._allowDuplicateKeys) {
          x = x.right;
          goRight = true;
        } else {
          return { node: x, goRight: true };
        }
      }
    }
    return { node: p, goRight };
  }

  /** Find leftmost node with key >= key. */
  lowerBound(key: K): RBNode<K, V> | null {
    let x = this._root;
    let result: RBNode<K, V> | null = null;
    while (x !== this._nil) {
      const c = this._cmp(x.key, key);
      if (c >= 0) {
        result = x;
        x = x.left;
      } else {
        x = x.right;
      }
    }
    return result;
  }

  /** Find leftmost node with key > key. */
  upperBound(key: K): RBNode<K, V> | null {
    let x = this._root;
    let result: RBNode<K, V> | null = null;
    while (x !== this._nil) {
      if (this._cmp(x.key, key) > 0) {
        result = x;
        x = x.left;
      } else {
        x = x.right;
      }
    }
    return result;
  }

  find(key: K): RBNode<K, V> | null {
    const node = this.lowerBound(key);
    if (node !== null && this._cmp(node.key, key) === 0) return node;
    return null;
  }

  has(key: K): boolean {
    return this.find(key) !== null;
  }

  get(key: K): V | undefined {
    const node = this.find(key);
    return node ? node.value : undefined;
  }

  /**
   * Set or insert. If allowDuplicateKeys is false and key exists, replaces value.
   * Otherwise inserts. Returns the node (existing or new).
   */
  set(key: K, value: V): RBNode<K, V> {
    const { node: p, goRight } = this._insertPosition(key);
    if (!this._allowDuplicateKeys && p !== this._nil && this._cmp(p.key, key) === 0) {
      p.value = value;
      return p;
    }
    const z = new RBNode<K, V>(key, value, RED);
    z.left = this._nil;
    z.right = this._nil;
    z.parent = p;
    if (p === this._nil) {
      this._root = z;
    } else if (goRight) {
      p.right = z;
    } else {
      p.left = z;
    }
    this._nodeCount++;
    this._insertFixup(z);
    return z;
  }

  private _leftRotate(x: RBNode<K, V>): void {
    const y = x.right;
    x.right = y.left;
    if (y.left !== this._nil) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent === this._nil) {
      this._root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  private _rightRotate(y: RBNode<K, V>): void {
    const x = y.left;
    y.left = x.right;
    if (x.right !== this._nil) x.right.parent = y;
    x.parent = y.parent;
    if (y.parent === this._nil) {
      this._root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }
    x.right = y;
    y.parent = x;
  }

  private _insertFixup(z: RBNode<K, V>): void {
    while (z.parent.color === RED) {
      if (z.parent === z.parent.parent.left) {
        const y = z.parent.parent.right;
        if (y.color === RED) {
          z.parent.color = BLACK;
          y.color = BLACK;
          z.parent.parent.color = RED;
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this._leftRotate(z);
          }
          z.parent.color = BLACK;
          z.parent.parent.color = RED;
          this._rightRotate(z.parent.parent);
        }
      } else {
        const y = z.parent.parent.left;
        if (y.color === RED) {
          z.parent.color = BLACK;
          y.color = BLACK;
          z.parent.parent.color = RED;
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this._rightRotate(z);
          }
          z.parent.color = BLACK;
          z.parent.parent.color = RED;
          this._leftRotate(z.parent.parent);
        }
      }
    }
    this._root.color = BLACK;
  }

  /** Remove one node with key. Returns true if removed. */
  deleteKey(key: K): boolean {
    const z = this.find(key);
    if (z === null) return false;
    this._deleteNode(z);
    return true;
  }

  /** Remove all nodes with key. Returns count removed. */
  deleteAllKeys(key: K): number {
    let n = 0;
    while (this.deleteKey(key)) n++;
    return n;
  }

  /** Remove this node. */
  deleteNode(z: RBNode<K, V>): void {
    if (z === this._nil) return;
    this._deleteNode(z);
  }

  private _deleteNode(z: RBNode<K, V>): void {
    let y = z;
    let yOriginalColor = y.color;
    let x: RBNode<K, V>;
    if (z.left === this._nil) {
      x = z.right;
      this._transplant(z, z.right);
    } else if (z.right === this._nil) {
      x = z.left;
      this._transplant(z, z.left);
    } else {
      y = this._minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        if (x !== this._nil) x.parent = y;
      } else {
        this._transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this._transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }
    if (yOriginalColor === BLACK) {
      this._deleteFixup(x);
    }
    this._nodeCount--;
  }

  private _transplant(u: RBNode<K, V>, v: RBNode<K, V>): void {
    if (u.parent === this._nil) {
      this._root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  private _minimum(x: RBNode<K, V>): RBNode<K, V> {
    while (x.left !== this._nil) x = x.left;
    return x;
  }

  private _deleteFixup(x: RBNode<K, V>): void {
    while (x !== this._root && x.color === BLACK) {
      if (x === x.parent.left) {
        let w = x.parent.right;
        if (w.color === RED) {
          w.color = BLACK;
          x.parent.color = RED;
          this._leftRotate(x.parent);
          w = x.parent.right;
        }
        if (w.left.color === BLACK && w.right.color === BLACK) {
          w.color = RED;
          x = x.parent;
        } else {
          if (w.right.color === BLACK) {
            w.left.color = BLACK;
            w.color = RED;
            this._rightRotate(w);
            w = x.parent.right;
          }
          w.color = x.parent.color;
          x.parent.color = BLACK;
          w.right.color = BLACK;
          this._leftRotate(x.parent);
          x = this._root;
        }
      } else {
        let w = x.parent.left;
        if (w.color === RED) {
          w.color = BLACK;
          x.parent.color = RED;
          this._rightRotate(x.parent);
          w = x.parent.left;
        }
        if (w.right.color === BLACK && w.left.color === BLACK) {
          w.color = RED;
          x = x.parent;
        } else {
          if (w.left.color === BLACK) {
            w.right.color = BLACK;
            w.color = RED;
            this._leftRotate(w);
            w = x.parent.left;
          }
          w.color = x.parent.color;
          x.parent.color = BLACK;
          w.left.color = BLACK;
          this._rightRotate(x.parent);
          x = this._root;
        }
      }
    }
    x.color = BLACK;
  }

  /** Number of nodes with key === key (for duplicate-key trees). */
  count(key: K): number {
    let x = this.lowerBound(key);
    let n = 0;
    while (x !== null && this._cmp(x.key, key) === 0) {
      n++;
      x = this._successor(x);
    }
    return n;
  }

  /** Number of nodes with key in [lowerKey, upperKey). */
  countBetween(lowerKey: K, upperKey: K): number {
    let lo = this.lowerBound(lowerKey);
    const hi = this.upperBound(upperKey);
    let n = 0;
    while (lo !== null && (hi === null || lo !== hi) && this._cmp(lo.key, upperKey) < 0) {
      n++;
      lo = this._successor(lo);
    }
    return n;
  }

  /** In-order successor (internal use). */
  successor(node: RBNode<K, V>): RBNode<K, V> | null {
    return this._successor(node);
  }

  /** In-order successor. */
  private _successor(x: RBNode<K, V>): RBNode<K, V> | null {
    if (x.right !== this._nil) {
      let s = x.right;
      while (s.left !== this._nil) s = s.left;
      return s;
    }
    let p = x.parent;
    while (p !== this._nil && x === p.right) {
      x = p;
      p = p.parent;
    }
    return p === this._nil ? null : p;
  }

  /** First node in in-order (leftmost). */
  first(): RBNode<K, V> | null {
    if (this._root === this._nil) return null;
    let x = this._root;
    while (x.left !== this._nil) x = x.left;
    return x;
  }

  clear(): void {
    this._root = this._nil;
    this._nodeCount = 0;
  }

  /** In-order iteration over nodes. */
  *nodes(): IterableIterator<RBNode<K, V>> {
    let x = this.first();
    while (x !== null) {
      yield x;
      x = this._successor(x);
    }
  }

  /** In-order iteration over [key, value] pairs. */
  *entries(): IterableIterator<[K, V]> {
    for (const node of this.nodes()) yield [node.key, node.value];
  }

  *keys(): IterableIterator<K> {
    for (const node of this.nodes()) yield node.key;
  }

  *values(): IterableIterator<V> {
    for (const node of this.nodes()) yield node.value;
  }
}
