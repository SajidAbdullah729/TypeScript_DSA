/**
 * LIFO stack. O(1) push/pop. Backed by a Vector.
 */
import { Vector } from './Vector.js';

export class Stack<T> {
  private _vec: Vector<T>;

  constructor(initial?: T[] | number) {
    this._vec = new Vector(initial);
  }

  get size(): number {
    return this._vec.size;
  }

  get empty(): boolean {
    return this._vec.empty;
  }

  push(value: T): void {
    this._vec.push(value);
  }

  pop(): T | undefined {
    return this._vec.pop();
  }

  top(): T {
    return this._vec.back();
  }

  clear(): void {
    this._vec.clear();
  }

  [Symbol.iterator](): Iterator<T> {
    return this._vec[Symbol.iterator]();
  }

  toArray(): T[] {
    return this._vec.toArray();
  }
}
