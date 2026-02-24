/**
 * Doubly linked list. O(1) insert/erase at a known node; O(n) index access.
 * Use when you need frequent insertions/deletions in the middle without reallocation.
 */

export class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  prev: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class List<T> {
  private _head: ListNode<T> | null = null;
  private _tail: ListNode<T> | null = null;
  private _length: number = 0;

  get size(): number {
    return this._length;
  }

  get empty(): boolean {
    return this._length === 0;
  }

  front(): T {
    if (!this._head) throw new RangeError('List is empty');
    return this._head.value;
  }

  back(): T {
    if (!this._tail) throw new RangeError('List is empty');
    return this._tail.value;
  }

  pushBack(value: T): ListNode<T> {
    const node = new ListNode(value);
    if (!this._tail) {
      this._head = this._tail = node;
    } else {
      this._tail.next = node;
      node.prev = this._tail;
      this._tail = node;
    }
    this._length++;
    return node;
  }

  pushFront(value: T): ListNode<T> {
    const node = new ListNode(value);
    if (!this._head) {
      this._head = this._tail = node;
    } else {
      this._head.prev = node;
      node.next = this._head;
      this._head = node;
    }
    this._length++;
    return node;
  }

  popBack(): T | undefined {
    if (!this._tail) return undefined;
    const v = this._tail.value;
    this._tail = this._tail.prev;
    if (this._tail) this._tail.next = null;
    else this._head = null;
    this._length--;
    return v;
  }

  popFront(): T | undefined {
    if (!this._head) return undefined;
    const v = this._head.value;
    this._head = this._head.next;
    if (this._head) this._head.prev = null;
    else this._tail = null;
    this._length--;
    return v;
  }

  /** Insert value before the given node. Returns the new node. */
  insertBefore(node: ListNode<T>, value: T): ListNode<T> {
    const n = new ListNode(value);
    n.prev = node.prev;
    n.next = node;
    if (node.prev) node.prev.next = n;
    else this._head = n;
    node.prev = n;
    this._length++;
    return n;
  }

  /** Insert value after the given node. Returns the new node. */
  insertAfter(node: ListNode<T>, value: T): ListNode<T> {
    const n = new ListNode(value);
    n.next = node.next;
    n.prev = node;
    if (node.next) node.next.prev = n;
    else this._tail = n;
    node.next = n;
    this._length++;
    return n;
  }

  /** Remove the node. Returns the removed value. */
  erase(node: ListNode<T>): T {
    if (node.prev) node.prev.next = node.next;
    else this._head = node.next;
    if (node.next) node.next.prev = node.prev;
    else this._tail = node.prev;
    this._length--;
    return node.value;
  }

  at(index: number): T {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`List index ${index} out of range (size ${this._length})`);
    }
    let cur = this._head!;
    for (let i = 0; i < index; i++) cur = cur.next!;
    return cur.value;
  }

  clear(): void {
    this._head = this._tail = null;
    this._length = 0;
  }

  [Symbol.iterator](): Iterator<T> {
    let cur = this._head;
    return {
      next(): IteratorResult<T> {
        if (!cur) return { done: true, value: undefined };
        const value = cur.value;
        cur = cur.next;
        return { done: false, value };
      },
    };
  }

  toArray(): T[] {
    return [...this];
  }

  /** Return the first node (for iteration by hand). */
  get headNode(): ListNode<T> | null {
    return this._head;
  }

  /** Return the last node. */
  get tailNode(): ListNode<T> | null {
    return this._tail;
  }
}
