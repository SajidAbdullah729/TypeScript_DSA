/**
 * FIFO queue. Amortized O(1) enqueue/dequeue using a circular buffer.
 */
export class Queue<T> {
  private _buf: (T | undefined)[];
  private _head: number = 0;
  private _size: number = 0;

  constructor(initialCapacity = 16) {
    this._buf = new Array(Math.max(4, initialCapacity));
  }

  get size(): number {
    return this._size;
  }

  get empty(): boolean {
    return this._size === 0;
  }

  private grow(): void {
    const cap = this._buf.length;
    const next = new Array<T | undefined>(cap * 2);
    for (let i = 0; i < this._size; i++) {
      next[i] = this._buf[(this._head + i) % cap];
    }
    this._buf = next;
    this._head = 0;
  }

  enqueue(value: T): void {
    if (this._size === this._buf.length) this.grow();
    this._buf[(this._head + this._size) % this._buf.length] = value;
    this._size++;
  }

  dequeue(): T | undefined {
    if (this._size === 0) return undefined;
    const cap = this._buf.length;
    const value = this._buf[this._head];
    this._buf[this._head] = undefined;
    this._head = (this._head + 1) % cap;
    this._size--;
    return value;
  }

  front(): T {
    if (this._size === 0) throw new RangeError('Queue is empty');
    return this._buf[this._head]!;
  }

  back(): T {
    if (this._size === 0) throw new RangeError('Queue is empty');
    return this._buf[(this._head + this._size - 1) % this._buf.length]!;
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
