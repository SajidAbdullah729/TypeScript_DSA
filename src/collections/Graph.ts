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
 * Create an empty unweighted graph with `n` vertices (0..n-1).
 * Equivalent to C++: `vector<vector<int>> graph(n);`
 */
export function createAdjacencyList(n: number): AdjacencyList<number> {
  return Array.from({ length: n }, () => []);
}

/**
 * Create an empty weighted graph with `n` vertices (0..n-1).
 * Equivalent to C++: `vector<vector<pair<int,int>>> graph(n);`
 */
export function createWeightedAdjacencyList(
  n: number,
): WeightedAdjacencyList<number, number> {
  return Array.from({ length: n }, () => []);
}

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
