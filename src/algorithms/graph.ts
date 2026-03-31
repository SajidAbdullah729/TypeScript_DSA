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

export interface WeightedUndirectedEdge {
  u: number;
  v: number;
  weight: number;
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

