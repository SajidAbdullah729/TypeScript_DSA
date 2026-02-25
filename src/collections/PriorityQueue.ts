/**
 * Priority queue (binary heap). O(log n) push and pop, O(1) top.
 * Default: max-heap (highest priority at top). Pass a custom comparator to change order.
 */
import type { Comparator } from '../types/index.js';

function defaultCompare<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export class PriorityQueue<T> {
  private _heap: T[] = [];
  private _compare: Comparator<T>;

  /** compare(a,b) < 0 means a has lower priority than b. Default: max-heap. */
  constructor(compare?: Comparator<T>) {
    this._compare = compare ?? defaultCompare;
  }

  get size(): number {
    return this._heap.length;
  }

  get empty(): boolean {
    return this._heap.length === 0;
  }

  /** Highest-priority element. */
  top(): T {
    if (this._heap.length === 0) throw new RangeError('PriorityQueue is empty');
    return this._heap[0];
  }

  push(value: T): void {
    this._heap.push(value);
    this._siftUp(this._heap.length - 1);
  }

  pop(): T | undefined {
    if (this._heap.length === 0) return undefined;
    const top = this._heap[0];
    const last = this._heap.pop()!;
    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  clear(): void {
    this._heap.length = 0;
  }

  private _siftUp(i: number): void {
    const cmp = this._compare;
    const arr = this._heap;
    while (i > 0) {
      const parent = (i - 1) >>> 1;
      if (cmp(arr[i], arr[parent]) <= 0) break;
      [arr[i], arr[parent]] = [arr[parent], arr[i]];
      i = parent;
    }
  }

  private _siftDown(i: number): void {
    const cmp = this._compare;
    const arr = this._heap;
    const n = arr.length;
    while (true) {
      let best = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && cmp(arr[left], arr[best]) > 0) best = left;
      if (right < n && cmp(arr[right], arr[best]) > 0) best = right;
      if (best === i) break;
      [arr[i], arr[best]] = [arr[best], arr[i]];
      i = best;
    }
  }

  toArray(): T[] {
    return [...this._heap];
  }
}
