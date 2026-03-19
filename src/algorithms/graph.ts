import type { AdjacencyList, WeightedAdjacencyList } from '../collections/index.js';
import { DisjointSetUnion } from './disjointSetUnion.js';

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

