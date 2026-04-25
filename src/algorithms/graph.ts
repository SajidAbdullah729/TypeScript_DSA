import type { AdjacencyList, WeightedAdjacencyList } from '../collections/index.js';
import { PriorityQueue } from '../collections/index.js';
import { DisjointSetUnion } from './disjointSetUnion.js';

/**
 * Breadth-first search from `start` on an unweighted adjacency list.
 * Visits every vertex reachable from `start` in non-decreasing distance (hop count) from `start`.
 *
 * Complexity: O(n + m) time, O(n) extra space (n = vertices, m = edges traversed).
 *
 * - Vertices are assumed numbered `0..n-1`.
 * - Out-of-range or invalid `start` yields an empty order.
 * - Neighbors are enqueued in the order they appear in `adj[u]`; the exact visit order depends on that ordering.
 */
export function breadthFirstSearch(
  n: number,
  adj: AdjacencyList<number>,
  start: number,
): number[] {
  if (start < 0 || start >= n) return [];
  const seen = new Uint8Array(n);
  const order: number[] = [];
  const q: number[] = [];
  let qh = 0;
  seen[start] = 1;
  q.push(start);
  while (qh < q.length) {
    const u = q[qh++]!;
    order.push(u);
    for (const v of adj[u] ?? []) {
      if (v >= 0 && v < n && !seen[v]) {
        seen[v] = 1;
        q.push(v);
      }
    }
  }
  return order;
}

/**
 * Depth-first search (preorder) from `start` on an unweighted adjacency list.
 * Visits all vertices reachable from `start` using an explicit stack (no recursion).
 *
 * Complexity: O(n + m) time, O(n) extra space.
 *
 * - Vertices are assumed numbered `0..n-1`.
 * - Out-of-range or invalid `start` yields an empty order.
 * - Neighbors are explored in the order they appear in `adj[u]` (first neighbor in the list is visited first).
 */
export function depthFirstSearch(
  n: number,
  adj: AdjacencyList<number>,
  start: number,
): number[] {
  if (start < 0 || start >= n) return [];
  const seen = new Uint8Array(n);
  const order: number[] = [];
  const stack: number[] = [start];
  while (stack.length > 0) {
    const u = stack.pop()!;
    if (seen[u]) continue;
    seen[u] = 1;
    order.push(u);
    const neighbors = adj[u] ?? [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const v = neighbors[i]!;
      if (v >= 0 && v < n && !seen[v]) stack.push(v);
    }
  }
  return order;
}

/**
 * Result of a topological sort attempt on vertices `0..n-1`.
 *
 * **When sorting is impossible:** classical topological order exists only for a **directed acyclic graph (DAG)**.
 * If the graph has any **directed cycle** (including a **self-loop**), both algorithms set `ok` to `false`.
 * Treating an **undirected** edge as two opposite directed arcs creates a 2-cycle, so `ok` will be `false`
 * unless there are no such pairs (e.g. only isolated vertices).
 *
 * **Input:** You must pass **`n` and `adj` together** — `n` is the number of vertices, and `adj[u]` lists **out-neighbors**
 * of `u` for a **directed** graph. Missing `adj[u]` is treated as no outgoing edges. Neighbors outside `0..n-1` are **ignored**,
 * so the result reflects that pruned graph, not raw adjacency data with invalid indices.
 */
export interface TopologicalSortResult {
  /** A permutation of `0..n-1` with every edge `u → v` having `u` before `v` (only valid when `ok` is true). */
  order: number[];
  /** `true` iff a topological order exists for the directed graph on `0..n-1` after ignoring invalid neighbors. */
  ok: boolean;
}

type TopoFrame = { u: number; i: number };

/**
 * Topological ordering of a **directed** graph using an explicit stack (iterative DFS / finish times).
 * Pushes a vertex after all its outgoing edges have been explored, then reverses that list.
 *
 * Complexity: O(n + m) time, O(n) extra space.
 *
 * **Inputs:** Same as other graph helpers: vertex count `n` and unweighted `adj` (outgoing edges only). This pair **is** the
 * graph representation here; there is no separate graph object. Keep `n` consistent with how many vertices you number (`0..n-1`).
 *
 * **Not possible:** Returns `{ order: [], ok: false }` if a directed cycle is found (self-loop, longer cycle, or bidirectional
 * undirected modeling). Returns `{ order, ok: true }` for any DAG, including disconnected ones.
 *
 * - Invalid neighbor indices are skipped (see {@link TopologicalSortResult}).
 * - Parallel edges behave like multiple arcs; self-loops are cycles.
 */
export function topologicalSortStack(
  n: number,
  adj: AdjacencyList<number>,
): TopologicalSortResult {
  const state = new Uint8Array(n); // 0 = unvisited, 1 = on stack (visiting), 2 = done
  const finish: number[] = [];
  const stack: TopoFrame[] = [];

  for (let s = 0; s < n; s++) {
    if (state[s] !== 0) continue;
    state[s] = 1;
    stack.push({ u: s, i: 0 });
    while (stack.length > 0) {
      const top = stack[stack.length - 1]!;
      const u = top.u;
      const neighbors = adj[u] ?? [];
      let pushedChild = false;
      while (top.i < neighbors.length) {
        const v = neighbors[top.i]!;
        top.i++;
        if (v < 0 || v >= n) continue;
        if (state[v] === 1) return { order: [], ok: false };
        if (state[v] === 0) {
          state[v] = 1;
          stack.push({ u: v, i: 0 });
          pushedChild = true;
          break;
        }
      }
      if (!pushedChild) {
        stack.pop();
        state[u] = 2;
        finish.push(u);
      }
    }
  }

  finish.reverse();
  return { order: finish, ok: true };
}

/**
 * Topological ordering via **Kahn's algorithm**: repeatedly remove vertices with indegree zero (BFS-style).
 * Uses only indegrees derived from `adj`; outdegree is implicit in the lists.
 *
 * Complexity: O(n + m) time, O(n) extra space.
 *
 * **Inputs:** Requires `n` and `adj` together (directed out-edges per vertex), like {@link topologicalSortStack}.
 *
 * **Not possible:** `ok` is `false` when not all vertices are output — equivalently, when the graph on `0..n-1` (after ignoring
 * invalid neighbors) contains a directed cycle. On failure, `order` lists some vertices in a valid partial order but must not
 * be treated as a full topological sort.
 *
 * - When `ok` is `true`, `order` is one valid topological order; it may differ from the stack/DFS-based order.
 */
export function topologicalSortIndegree(
  n: number,
  adj: AdjacencyList<number>,
): TopologicalSortResult {
  const indeg = new Uint32Array(n);
  for (let u = 0; u < n; u++) {
    for (const v of adj[u] ?? []) {
      if (v >= 0 && v < n) indeg[v]++;
    }
  }

  const q: number[] = [];
  for (let i = 0; i < n; i++) {
    if (indeg[i] === 0) q.push(i);
  }

  const order: number[] = [];
  let qh = 0;
  while (qh < q.length) {
    const u = q[qh++]!;
    order.push(u);
    for (const v of adj[u] ?? []) {
      if (v < 0 || v >= n) continue;
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }

  return { order, ok: order.length === n };
}

export interface WeightedUndirectedEdge {
  u: number;
  v: number;
  weight: number;
}

export interface BellmanFordResult {
  /** Shortest distance from `start` to each vertex (`Infinity` if unreachable). */
  dist: number[];
  /** Previous vertex on one shortest path tree (`-1` if none). */
  prev: number[];
  /** True if a negative cycle is reachable from `start`. */
  hasNegativeCycle: boolean;
}

export interface FloydWarshallResult {
  /** All-pairs shortest path distances (`Infinity` if unreachable). */
  dist: number[][];
  /** Next-hop matrix for path reconstruction (`-1` means no path). */
  next: number[][];
  /** True if at least one negative cycle exists in the graph. */
  hasNegativeCycle: boolean;
}

/**
 * Connected components in an (unweighted) graph using DSU.
 * Complexity: O((n + m) * alpha(n)).
 *
 * Notes:
 * - Assumes vertices are numbered `0..n-1`.
 * - If your adjacency list stores each edge once or twice, DSU will still work.
 */
export function connectedComponents(
  n: number,
  adj: AdjacencyList<number>,
): number[][] {
  const dsu = new DisjointSetUnion(n);
  for (let u = 0; u < n; u++) {
    for (const v of adj[u] ?? []) {
      dsu.union(u, v);
    }
  }
  return dsu.components(n);
}

/**
 * Kruskal's algorithm for Minimum Spanning Tree (MST) using DSU.
 *
 * Complexity: O(m log m) for sorting edges + O(m * alpha(n)).
 *
 * @returns a spanning forest if the graph is disconnected.
 */
export function kruskalMST(
  n: number,
  adj: WeightedAdjacencyList<number, number>,
  options?: { undirected?: boolean },
): { edges: WeightedUndirectedEdge[]; totalWeight: number } {
  const undirected = options?.undirected ?? true;

  // Extract edges from adjacency list.
  // For undirected graphs represented as both-direction adjacency,
  // take only u < v to avoid duplicates.
  const edges: WeightedUndirectedEdge[] = [];
  for (let u = 0; u < n; u++) {
    for (const { to: v, weight } of adj[u] ?? []) {
      if (undirected) {
        if (u < v) edges.push({ u, v, weight });
      } else {
        edges.push({ u, v, weight });
      }
    }
  }

  edges.sort((a, b) => a.weight - b.weight);

  const dsu = new DisjointSetUnion(n);
  const mstEdges: WeightedUndirectedEdge[] = [];
  let totalWeight = 0;

  for (const e of edges) {
    if (dsu.union(e.u, e.v)) {
      mstEdges.push(e);
      totalWeight += e.weight;
      if (mstEdges.length === n - 1) break; // MST complete for connected graphs.
    }
  }

  return { edges: mstEdges, totalWeight };
}

/**
 * Dijkstra's single-source shortest paths on a weighted adjacency list with non-negative weights.
 *
 * Complexity: O((n + m) log m) with a binary heap priority queue.
 *
 * @returns
 * - dist[v] = shortest distance from start to v (Infinity if unreachable)
 * - prev[v] = previous vertex on the shortest path (or -1 if none)
 */
export function dijkstra(
  n: number,
  adj: WeightedAdjacencyList<number, number>,
  start: number,
  options?: { target?: number },
): { dist: number[]; prev: number[] } {
  const dist = Array<number>(n).fill(Number.POSITIVE_INFINITY);
  const prev = Array<number>(n).fill(-1);
  if (start < 0 || start >= n) return { dist, prev };

  const target = options?.target;
  dist[start] = 0;

  type Node = { v: number; d: number };
  // PriorityQueue is a max-heap by default; invert comparator to make it a min-heap by distance.
  const pq = new PriorityQueue<Node>((a, b) => b.d - a.d);
  pq.push({ v: start, d: 0 });

  while (!pq.empty) {
    const cur = pq.pop()!;
    const u = cur.v;
    const d = cur.d;
    if (d !== dist[u]) continue; // stale entry
    if (target !== undefined && u === target) break;

    for (const e of adj[u] ?? []) {
      const v = e.to;
      const w = e.weight;
      if (v < 0 || v >= n) continue;
      if (w < 0) throw new RangeError('dijkstra: edge weights must be non-negative');
      const nd = d + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        prev[v] = u;
        pq.push({ v, d: nd });
      }
    }
  }

  return { dist, prev };
}

/**
 * Bellman-Ford single-source shortest paths on a weighted graph.
 * Supports negative edge weights and reports if a reachable negative cycle exists.
 *
 * Complexity: O(n * m), where n = vertices and m = edges.
 */
export function bellmanFord(
  n: number,
  adj: WeightedAdjacencyList<number, number>,
  start: number,
): BellmanFordResult {
  const dist = Array<number>(n).fill(Number.POSITIVE_INFINITY);
  const prev = Array<number>(n).fill(-1);
  if (start < 0 || start >= n) {
    return { dist, prev, hasNegativeCycle: false };
  }

  type Edge = { u: number; v: number; w: number };
  const edges: Edge[] = [];
  for (let u = 0; u < n; u++) {
    for (const e of adj[u] ?? []) {
      const v = e.to;
      if (v < 0 || v >= n) continue;
      edges.push({ u, v, w: e.weight });
    }
  }

  dist[start] = 0;

  for (let i = 0; i < n - 1; i++) {
    let changed = false;
    for (const { u, v, w } of edges) {
      if (dist[u] === Number.POSITIVE_INFINITY) continue;
      const nd = dist[u] + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        prev[v] = u;
        changed = true;
      }
    }
    if (!changed) break;
  }

  let hasNegativeCycle = false;
  for (const { u, v, w } of edges) {
    if (dist[u] === Number.POSITIVE_INFINITY) continue;
    if (dist[u] + w < dist[v]) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { dist, prev, hasNegativeCycle };
}

/**
 * Floyd-Warshall all-pairs shortest paths on a weighted graph.
 * Handles negative edge weights, and reports if any negative cycle exists.
 *
 * Complexity: O(n^3) time, O(n^2) space.
 */
export function floydWarshall(
  n: number,
  adj: WeightedAdjacencyList<number, number>,
): FloydWarshallResult {
  const dist: number[][] = Array.from({ length: n }, () =>
    Array<number>(n).fill(Number.POSITIVE_INFINITY),
  );
  const next: number[][] = Array.from({ length: n }, () => Array<number>(n).fill(-1));

  for (let i = 0; i < n; i++) {
    dist[i]![i] = 0;
    next[i]![i] = i;
  }

  for (let u = 0; u < n; u++) {
    for (const e of adj[u] ?? []) {
      const v = e.to;
      const w = e.weight;
      if (v < 0 || v >= n) continue;
      if (w < dist[u]![v]!) {
        dist[u]![v] = w;
        next[u]![v] = v;
      }
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (dist[i]![k] === Number.POSITIVE_INFINITY) continue;
      for (let j = 0; j < n; j++) {
        if (dist[k]![j] === Number.POSITIVE_INFINITY) continue;
        const nd = dist[i]![k]! + dist[k]![j]!;
        if (nd < dist[i]![j]!) {
          dist[i]![j] = nd;
          next[i]![j] = next[i]![k]!;
        }
      }
    }
  }

  let hasNegativeCycle = false;
  for (let i = 0; i < n; i++) {
    if (dist[i]![i] < 0) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { dist, next, hasNegativeCycle };
}

/**
 * Reconstruct a path from a `prev` array (as returned by `dijkstra`).
 *
 * @returns an array of vertices from start to target (inclusive), or [] if unreachable.
 */
export function reconstructPath(
  prev: readonly number[],
  start: number,
  target: number,
): number[] {
  if (start < 0 || start >= prev.length) return [];
  if (target < 0 || target >= prev.length) return [];
  if (start === target) return [start];

  const path: number[] = [];
  let v = target;
  for (let steps = 0; steps < prev.length; steps++) {
    path.push(v);
    if (v === start) break;
    v = prev[v]!;
    if (v === -1) return [];
  }
  if (path[path.length - 1] !== start) return [];
  path.reverse();
  return path;
}

/**
 * Reconstruct a path from `start` to `target` using Floyd-Warshall `next` matrix.
 *
 * @returns vertices from start to target (inclusive), or [] if unreachable/invalid.
 */
export function reconstructFloydWarshallPath(
  next: readonly (readonly number[])[],
  start: number,
  target: number,
): number[] {
  const n = next.length;
  if (start < 0 || start >= n) return [];
  if (target < 0 || target >= n) return [];
  if ((next[start]?.[target] ?? -1) === -1) return [];

  const path: number[] = [start];
  let cur = start;
  for (let steps = 0; steps < n; steps++) {
    if (cur === target) return path;
    cur = next[cur]![target]!;
    if (cur === -1) return [];
    path.push(cur);
  }
  return [];
}

