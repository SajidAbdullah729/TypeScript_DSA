/**
 * STL-like dynamic array. Amortized O(1) push/pop, O(1) index access.
 * Uses a single backing array with optional capacity reserve to reduce reallocations.
 */
export class Vector<T> {
  private _data: T[];
  private _length: number;

  constructor(initial?: T[] | number) {
    if (initial === undefined) {
      this._data = [];
      this._length = 0;
      return;
    }
    if (typeof initial === 'number') {
      this._data = new Array(Math.max(0, initial));
      this._length = initial;
      return;
    }
    this._data = [...initial];
    this._length = this._data.length;
  }

  get size(): number {
    return this._length;
  }

  get empty(): boolean {
    return this._length === 0;
  }

  /** Current backing array length (capacity). */
  get capacity(): number {
    return this._data.length;
  }

  /** Ensure capacity at least `n`. Avoids repeated reallocation when pushing. */
  reserve(n: number): void {
    if (n <= this._data.length) return;
    const next = new Array<T>(n);
    for (let i = 0; i < this._length; i++) next[i] = this._data[i];
    this._data = next;
  }

  /** Shrink backing array to fit current size. */
  shrinkToFit(): void {
    if (this._length === this._data.length) return;
    const next = new Array<T>(this._length);
    for (let i = 0; i < this._length; i++) next[i] = this._data[i];
    this._data = next;
  }

  private ensureCapacity(): void {
    if (this._length < this._data.length) return;
    const cap = this._data.length === 0 ? 4 : this._data.length * 2;
    const next = new Array<T>(cap);
    for (let i = 0; i < this._length; i++) next[i] = this._data[i];
    this._data = next;
  }

  at(index: number): T {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`Vector index ${index} out of range (size ${this._length})`);
    }
    return this._data[index];
  }

  set(index: number, value: T): void {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`Vector index ${index} out of range (size ${this._length})`);
    }
    this._data[index] = value;
  }

  push(value: T): number {
    this.ensureCapacity();
    this._data[this._length++] = value;
    return this._length;
  }

  pop(): T | undefined {
    if (this._length === 0) return undefined;
    const v = this._data[--this._length];
    this._data[this._length] = undefined!;
    return v;
  }

  front(): T {
    if (this._length === 0) throw new RangeError('Vector is empty');
    return this._data[0];
  }

  back(): T {
    if (this._length === 0) throw new RangeError('Vector is empty');
    return this._data[this._length - 1];
  }

  clear(): void {
    this._length = 0;
  }

  [Symbol.iterator](): Iterator<T> {
    let i = 0;
    const data = this._data;
    const len = this._length;
    return {
      next(): IteratorResult<T> {
        if (i >= len) return { done: true, value: undefined };
        return { done: false, value: data[i++] };
      },
    };
  }

  toArray(): T[] {
    const out: T[] = [];
    for (let i = 0; i < this._length; i++) out.push(this._data[i]);
    return out;
  }
}
