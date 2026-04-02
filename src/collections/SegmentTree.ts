/**
 * Segment trees: range queries and point updates in O(log n).
 *
 * - {@link GeneralSegmentTree} — full control: custom **merge** (internal nodes) and **buildLeaf** (initial + point updates).
 * - {@link SegmentTree} — same stored type as array; custom combine + neutral only.
 * - {@link SegmentTreeSum} — range sum, point assign.
 * - {@link SegmentTreeMin} — range minimum, point assign.
 * - {@link SegmentTreeMax} — range maximum, point assign.
 * - {@link LazySegmentTreeSum} — range add + range sum (lazy propagation).
 *
 * All range endpoints are **inclusive**: `query(l, r)` uses indices `l` through `r`.
 */
export type SegmentCombine<T> = (a: T, b: T) => T;

/** Combine two child segment aggregates into the parent (internal nodes). */
export type SegmentMerge<T> = (left: T, right: T) => T;

/**
 * Turn each raw array element into the leaf value stored in the tree.
 * Used on initial build and on every `update`.
 */
export type SegmentLeafBuild<T, V> = (value: V, index: number) => T;

export interface GeneralSegmentTreeConfig<T, V> {
  /** Combine left and right child aggregates (must be associative with `neutral`). */
  merge: SegmentMerge<T>;
  /** Result of `merge` when a query misses the segment (identity for `merge`). */
  neutral: T;
  /** Build the leaf at `index` from the current raw value `value`. */
  buildLeaf: SegmentLeafBuild<T, V>;
}

/**
 * General-purpose segment tree: raw array type `V`, stored aggregate type `T`.
 * You supply **merge** for internal nodes and **buildLeaf** for leaves (build + point updates).
 */
export class GeneralSegmentTree<T, V> {
  private readonly _n: number;
  private readonly _tree: T[];
  private readonly _raw: V[];
  private readonly _merge: SegmentMerge<T>;
  private readonly _neutral: T;
  private readonly _buildLeaf: SegmentLeafBuild<T, V>;

  constructor(values: readonly V[], config: GeneralSegmentTreeConfig<T, V>) {
    this._n = values.length;
    this._merge = config.merge;
    this._neutral = config.neutral;
    this._buildLeaf = config.buildLeaf;
    this._raw = this._n > 0 ? Array.from(values) : [];
    this._tree = new Array(Math.max(1, 4 * this._n));
    if (this._n > 0) {
      this._build(1, 0, this._n - 1);
    }
  }

  get size(): number {
    return this._n;
  }

  /** Current raw value at `index` (the same `V` you pass to `update`). */
  rawAt(index: number): V {
    this._bounds(index);
    return this._raw[index];
  }

  /**
   * Set raw value at `index`, rebuild leaf with `buildLeaf`, refresh ancestors. O(log n).
   */
  update(index: number, rawValue: V): void {
    this._bounds(index);
    this._raw[index] = rawValue;
    this._update(1, 0, this._n - 1, index);
  }

  /** Aggregate over inclusive range `[left, right]`. O(log n). */
  query(left: number, right: number): T {
    this._bounds(left);
    this._bounds(right);
    if (left > right) throw new RangeError('left must be <= right');
    return this._query(1, 0, this._n - 1, left, right);
  }

  private _bounds(i: number): void {
    if (this._n === 0) throw new RangeError('GeneralSegmentTree is empty');
    if (i < 0 || i >= this._n) {
      throw new RangeError(`Index ${i} out of range [0, ${this._n - 1}]`);
    }
  }

  private _build(node: number, l: number, r: number): void {
    if (l === r) {
      this._tree[node] = this._buildLeaf(this._raw[l], l);
      return;
    }
    const mid = (l + r) >>> 1;
    this._build(node * 2, l, mid);
    this._build(node * 2 + 1, mid + 1, r);
    this._tree[node] = this._merge(this._tree[node * 2], this._tree[node * 2 + 1]);
  }

  private _update(node: number, l: number, r: number, idx: number): void {
    if (l === r) {
      this._tree[node] = this._buildLeaf(this._raw[idx], idx);
      return;
    }
    const mid = (l + r) >>> 1;
    if (idx <= mid) this._update(node * 2, l, mid, idx);
    else this._update(node * 2 + 1, mid + 1, r, idx);
    this._tree[node] = this._merge(this._tree[node * 2], this._tree[node * 2 + 1]);
  }

  private _query(node: number, l: number, r: number, ql: number, qr: number): T {
    if (qr < l || r < ql) return this._neutral;
    if (ql <= l && r <= qr) return this._tree[node];
    const mid = (l + r) >>> 1;
    const leftQ = this._query(node * 2, l, mid, ql, qr);
    const rightQ = this._query(node * 2 + 1, mid + 1, r, ql, qr);
    return this._merge(leftQ, rightQ);
  }
}

/**
 * Generic segment tree: stored type equals array element type; leaves are the raw values.
 * Equivalent to {@link GeneralSegmentTree} with `buildLeaf: (v) => v`.
 */
export class SegmentTree<T> {
  private readonly _inner: GeneralSegmentTree<T, T>;

  /**
   * @param values Initial leaf values (copied).
   * @param combine Associative operation (e.g. addition, min, max).
   * @param neutral Identity for `combine` (e.g. 0 for sum, Infinity for min).
   */
  constructor(values: readonly T[], combine: SegmentCombine<T>, neutral: T) {
    this._inner = new GeneralSegmentTree(values, {
      merge: combine,
      neutral,
      buildLeaf: (v) => v,
    });
  }

  get size(): number {
    return this._inner.size;
  }

  /** Set index `index` to `value` and refresh ancestors. O(log n). */
  update(index: number, value: T): void {
    this._inner.update(index, value);
  }

  /** Aggregate over inclusive range `[left, right]`. O(log n). */
  query(left: number, right: number): T {
    return this._inner.query(left, right);
  }
}

/** Range sum and point assign. Neutral element is `0`. */
export class SegmentTreeSum extends SegmentTree<number> {
  constructor(values: readonly number[]) {
    super(values, (a, b) => a + b, 0);
  }
}

/** Range minimum and point assign. Neutral for out-of-range is `Infinity`. */
export class SegmentTreeMin extends SegmentTree<number> {
  constructor(values: readonly number[]) {
    super(values, (a, b) => Math.min(a, b), Infinity);
  }
}

/** Range maximum and point assign. Neutral for out-of-range is `-Infinity`. */
export class SegmentTreeMax extends SegmentTree<number> {
  constructor(values: readonly number[]) {
    super(values, (a, b) => Math.max(a, b), -Infinity);
  }
}

/**
 * Lazy segment tree: add a constant to every element in `[left, right]` and query range sums.
 * Both operations are O(log n).
 */
export class LazySegmentTreeSum {
  private readonly _n: number;
  private readonly _tree: number[];
  private readonly _lazy: number[];

  constructor(values: readonly number[]) {
    this._n = values.length;
    const cap = Math.max(1, 4 * this._n);
    this._tree = new Array(cap).fill(0);
    this._lazy = new Array(cap).fill(0);
    if (this._n > 0) {
      this._build(1, 0, this._n - 1, values);
    }
  }

  get size(): number {
    return this._n;
  }

  /** Add `delta` to each element in inclusive `[left, right]`. O(log n). */
  rangeAdd(left: number, right: number, delta: number): void {
    this._bounds(left);
    this._bounds(right);
    if (left > right) throw new RangeError('left must be <= right');
    this._rangeAdd(1, 0, this._n - 1, left, right, delta);
  }

  /** Sum of elements in inclusive `[left, right]`. O(log n). */
  rangeSum(left: number, right: number): number {
    this._bounds(left);
    this._bounds(right);
    if (left > right) throw new RangeError('left must be <= right');
    return this._rangeSum(1, 0, this._n - 1, left, right);
  }

  /** Point assign (sets one index; clears lazy along the path). O(log n). */
  set(index: number, value: number): void {
    this._bounds(index);
    this._set(1, 0, this._n - 1, index, value);
  }

  private _bounds(i: number): void {
    if (this._n === 0) throw new RangeError('LazySegmentTreeSum is empty');
    if (i < 0 || i >= this._n) {
      throw new RangeError(`Index ${i} out of range [0, ${this._n - 1}]`);
    }
  }

  private _build(node: number, l: number, r: number, arr: readonly number[]): void {
    if (l === r) {
      this._tree[node] = arr[l];
      return;
    }
    const mid = (l + r) >>> 1;
    this._build(node * 2, l, mid, arr);
    this._build(node * 2 + 1, mid + 1, r, arr);
    this._tree[node] = this._tree[node * 2] + this._tree[node * 2 + 1];
  }

  private _push(node: number, l: number, r: number): void {
    const lz = this._lazy[node];
    if (lz === 0 || l === r) return;
    const mid = (l + r) >>> 1;
    const leftLen = mid - l + 1;
    const rightLen = r - mid;
    this._lazy[node * 2] += lz;
    this._lazy[node * 2 + 1] += lz;
    this._tree[node * 2] += lz * leftLen;
    this._tree[node * 2 + 1] += lz * rightLen;
    this._lazy[node] = 0;
  }

  private _rangeAdd(node: number, l: number, r: number, ql: number, qr: number, delta: number): void {
    if (qr < l || r < ql) return;
    if (ql <= l && r <= qr) {
      this._tree[node] += delta * (r - l + 1);
      this._lazy[node] += delta;
      return;
    }
    this._push(node, l, r);
    const mid = (l + r) >>> 1;
    this._rangeAdd(node * 2, l, mid, ql, qr, delta);
    this._rangeAdd(node * 2 + 1, mid + 1, r, ql, qr, delta);
    this._tree[node] = this._tree[node * 2] + this._tree[node * 2 + 1];
  }

  private _rangeSum(node: number, l: number, r: number, ql: number, qr: number): number {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return this._tree[node];
    this._push(node, l, r);
    const mid = (l + r) >>> 1;
    return (
      this._rangeSum(node * 2, l, mid, ql, qr) + this._rangeSum(node * 2 + 1, mid + 1, r, ql, qr)
    );
  }

  private _set(node: number, l: number, r: number, idx: number, value: number): void {
    if (l === r) {
      this._tree[node] = value;
      this._lazy[node] = 0;
      return;
    }
    this._push(node, l, r);
    const mid = (l + r) >>> 1;
    if (idx <= mid) this._set(node * 2, l, mid, idx, value);
    else this._set(node * 2 + 1, mid + 1, r, idx, value);
    this._tree[node] = this._tree[node * 2] + this._tree[node * 2 + 1];
  }
}
