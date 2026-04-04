/**
 * Double-ended queue (STL `std::deque`-style API in camelCase).
 *
 * Backed by a growable circular buffer: amortized **O(1)** `pushFront` / `pushBack` /
 * `popFront` / `popBack`, and **O(1)** indexed `at` / `set` (unlike a linked list).
 */
export class Deque<T> {
  private _buf: (T | undefined)[];
  private _head = 0;
  private _size = 0;

  /**
   * @param initial — initial capacity (number), or copy elements in order from an array.
   */
  constructor(initial?: readonly T[] | number) {
    if (initial === undefined) {
      this._buf = new Array(16);
      return;
    }
    if (typeof initial === 'number') {
      this._buf = new Array(Math.max(4, initial));
      return;
    }
    const n = initial.length;
    const cap = Math.max(16, n <= 4 ? 4 : 2 ** Math.ceil(Math.log2(n)));
    this._buf = new Array(cap);
    for (let i = 0; i < n; i++) {
      this._buf[i] = initial[i];
    }
    this._size = n;
  }

  get size(): number {
    return this._size;
  }

  get empty(): boolean {
    return this._size === 0;
  }

  /** Current backing slot count (≥ size). */
  get capacity(): number {
    return this._buf.length;
  }

  private grow(): void {
    const cap = this._buf.length;
    const next = new Array<T | undefined>(Math.max(4, cap * 2));
    for (let i = 0; i < this._size; i++) {
      next[i] = this._buf[(this._head + i) % cap];
    }
    this._buf = next;
    this._head = 0;
  }

  private ensureSpace(): void {
    if (this._size < this._buf.length) return;
    this.grow();
  }

  /** Ensure buffer has room for at least `n` elements total (may shrink logical size only via pop/clear). */
  reserve(minCapacity: number): void {
    if (minCapacity <= this._buf.length) return;
    const next = new Array<T | undefined>(minCapacity);
    const cap = this._buf.length;
    for (let i = 0; i < this._size; i++) {
      next[i] = this._buf[(this._head + i) % cap];
    }
    this._buf = next;
    this._head = 0;
  }

  /** Drop unused buffer capacity (keeps current elements). */
  shrinkToFit(): void {
    if (this._size === this._buf.length) return;
    if (this._size === 0) {
      this._buf = new Array(4);
      this._head = 0;
      return;
    }
    const next = new Array<T | undefined>(this._size);
    const cap = this._buf.length;
    for (let i = 0; i < this._size; i++) {
      next[i] = this._buf[(this._head + i) % cap];
    }
    this._buf = next;
    this._head = 0;
  }

  private indexPhysical(i: number): number {
    return (this._head + i) % this._buf.length;
  }

  at(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Deque index ${index} out of range (size ${this._size})`);
    }
    return this._buf[this.indexPhysical(index)]!;
  }

  set(index: number, value: T): void {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Deque index ${index} out of range (size ${this._size})`);
    }
    this._buf[this.indexPhysical(index)] = value;
  }

  /** Same as C++ `push_front`. */
  pushFront(value: T): void {
    this.ensureSpace();
    const cap = this._buf.length;
    this._head = (this._head - 1 + cap) % cap;
    this._buf[this._head] = value;
    this._size++;
  }

  /** Same as C++ `push_back`. */
  pushBack(value: T): void {
    this.ensureSpace();
    const cap = this._buf.length;
    this._buf[(this._head + this._size) % cap] = value;
    this._size++;
  }

  /** Same as C++ `pop_front`. */
  popFront(): T | undefined {
    if (this._size === 0) return undefined;
    const cap = this._buf.length;
    const value = this._buf[this._head];
    this._buf[this._head] = undefined;
    this._head = (this._head + 1) % cap;
    this._size--;
    return value;
  }

  /** Same as C++ `pop_back`. */
  popBack(): T | undefined {
    if (this._size === 0) return undefined;
    const cap = this._buf.length;
    const idx = (this._head + this._size - 1 + cap) % cap;
    const value = this._buf[idx];
    this._buf[idx] = undefined;
    this._size--;
    return value;
  }

  /** Same as C++ `front`. */
  front(): T {
    if (this._size === 0) throw new RangeError('Deque is empty');
    return this._buf[this._head]!;
  }

  /** Same as C++ `back`. */
  back(): T {
    if (this._size === 0) throw new RangeError('Deque is empty');
    const cap = this._buf.length;
    return this._buf[(this._head + this._size - 1 + cap) % cap]!;
  }

  clear(): void {
    this._buf = new Array(this._buf.length);
    this._head = 0;
    this._size = 0;
  }

  [Symbol.iterator](): Iterator<T> {
    const buf = this._buf;
    const cap = buf.length;
    const head = this._head;
    const size = this._size;
    let i = 0;
    return {
      next(): IteratorResult<T> {
        if (i >= size) return { done: true, value: undefined };
        const value = buf[(head + i) % cap]!;
        i++;
        return { done: false, value };
      },
    };
  }

  toArray(): T[] {
    const out: T[] = [];
    const cap = this._buf.length;
    for (let i = 0; i < this._size; i++) {
      out.push(this._buf[(this._head + i) % cap]!);
    }
    return out;
  }
}
