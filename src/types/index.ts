/**
 * Shared types for the SDK. STL-like comparator and predicate conventions.
 */

/** Compare two values: negative if a < b, zero if a === b, positive if a > b. */
export type Comparator<T> = (a: T, b: T) => number;

/** Predicate for find, filter, partition, etc. */
export type Predicate<T> = (x: T) => boolean;

/** Unary transform (map). */
export type UnaryFn<T, U> = (x: T) => U;

/** Reducer (accumulator, value) => new accumulator. */
export type Reducer<T, U> = (acc: U, x: T) => U;

/** Any value that can be iterated (array, Vector, Set, Map keys, etc.). */
export type IterableLike<T> = Iterable<T> | ArrayLike<T>;

/** Convert IterableLike to array (single copy). Used internally by algorithms. */
export function toArray<T>(source: IterableLike<T>): T[] {
  if (Array.isArray(source)) return source;
  if (typeof (source as Iterable<T>)[Symbol.iterator] === 'function') {
    return [...(source as Iterable<T>)];
  }
  return Array.from(source as ArrayLike<T>);
}
