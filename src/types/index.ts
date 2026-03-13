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

/**
 * Graph adjacency list helpers (C++-style).
 *
 * These are designed so you can mirror common C++ patterns like:
 *   vector<vector<int>> adj(n);
 *   vector<vector<pair<int,int>>> adj(n);
 */

/** Single weighted edge: `to` vertex with a `weight`. */
export interface WeightedEdge<Vertex = number, Weight = number> {
  to: Vertex;
  weight: Weight;
}

/**
 * Unweighted adjacency list.
 *
 * C++: `vector<vector<int>> adj(n);`
 * TS:  `AdjacencyList<number>` (backed by `number[][]`).
 */
export type AdjacencyList<Vertex = number> = Vertex[][];

/**
 * Weighted adjacency list.
 *
 * C++: `vector<vector<pair<int,int>>> adj(n);`
 * TS:  `WeightedAdjacencyList<number, number>`
 *      (backed by `WeightedEdge<number, number>[][]`).
 *
 * Typical use:
 *   const adj: WeightedAdjacencyList<number, number> =
 *     Array.from({ length: n }, () => []);
 *   adj[u].push({ to: v, weight: w });
 */
export type WeightedAdjacencyList<
  Vertex = number,
  Weight = number,
> = WeightedEdge<Vertex, Weight>[][];

/**
 * Add an edge to a graph adjacency list.
 *
 * Overloads:
 *   - Unweighted: addEdge(adj, u, v)
 *   - Weighted:   addEdge(adj, u, v, w)
 */
export function addEdge(
  adj: AdjacencyList<number>,
  u: number,
  v: number,
): void;
export function addEdge(
  adj: WeightedAdjacencyList<number, number>,
  u: number,
  v: number,
  w: number,
): void;
export function addEdge(
  adj:
    | AdjacencyList<number>
    | WeightedAdjacencyList<number, number>,
  u: number,
  v: number,
  w?: number,
): void {
  if (w === undefined) {
    (adj as AdjacencyList<number>)[u].push(v);
  } else {
    (adj as WeightedAdjacencyList<number, number>)[u].push({ to: v, weight: w });
  }
}

/**
 * Delete all edges u -> v from a graph adjacency list.
 *
 * Overloads:
 *   - Unweighted: deleteEdge(adj, u, v)
 *   - Weighted:   deleteEdge(adj, u, v, w)
 */
export function deleteEdge(
  adj: AdjacencyList<number>,
  u: number,
  v: number,
): void;
export function deleteEdge(
  adj: WeightedAdjacencyList<number, number>,
  u: number,
  v: number,
  w: number,
): void;
export function deleteEdge(
  adj:
    | AdjacencyList<number>
    | WeightedAdjacencyList<number, number>,
  u: number,
  v: number,
  w?: number,
): void {
  const row = (adj as AdjacencyList<number> | WeightedAdjacencyList<number, number>)[u];

  if (!row) return;

  if (w === undefined) {
    // Unweighted: remove all neighbors equal to v.
    for (let i = row.length - 1; i >= 0; i--) {
      if (row[i] === v) {
        row.splice(i, 1);
      }
    }
  } else {
    // Weighted: remove all edges with { to: v, weight: w }.
    for (let i = row.length - 1; i >= 0; i--) {
      const edge = row[i] as WeightedEdge<number, number>;
      if (edge.to === v && edge.weight === w) {
        row.splice(i, 1);
      }
    }
  }
}
