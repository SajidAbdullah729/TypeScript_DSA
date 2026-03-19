/**
 * Disjoint Set Union (Union-Find) with:
 * - Path compression (iterative)
 * - Union by size
 *
 * Optimized for vertex indices in range [0..n-1].
 */
export class DisjointSetUnion {
  private readonly parent: Int32Array;
  private readonly size: Int32Array;

  constructor(n: number) {
    // Assumes valid vertex count and indices are provided by the caller.
    this.parent = new Int32Array(n);
    this.size = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
  }

  /**
   * Find the representative(root) of x.
   * Amortized almost O(1) with path compression.
   */
  find(x: number): number {
    // Find root.
    let root = x;
    while (this.parent[root] !== root) {
      root = this.parent[root];
    }

    // Compress path.
    while (this.parent[x] !== x) {
      const p = this.parent[x];
      this.parent[x] = root;
      x = p;
    }

    return root;
  }

  /** Returns true if a merge happened (were in different sets). */
  union(a: number, b: number): boolean {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;

    // Union by size: attach smaller tree under larger tree.
    if (this.size[ra] < this.size[rb]) {
      const tmp = ra;
      ra = rb;
      rb = tmp;
    }

    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    return true;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }

  /** Size of the connected component containing x. */
  componentSize(x: number): number {
    return this.size[this.find(x)];
  }

  /**
   * Get component representative id for each vertex.
   * Runs `find(i)` for each i (so it also compresses paths).
   */
  roots(): Int32Array {
    const out = new Int32Array(this.parent.length);
    for (let i = 0; i < out.length; i++) {
      out[i] = this.find(i);
    }
    return out;
  }

  /**
   * Group vertices into components.
   * Complexity: O(n * alpha(n)).
   */
  components(nVertices = this.parent.length): number[][] {
    // Use an array lookup instead of Map for faster grouping.
    const rootToIndex = new Int32Array(this.parent.length);
    rootToIndex.fill(-1);

    const groups: number[][] = [];
    const n = Math.min(nVertices, this.parent.length);

    for (let i = 0; i < n; i++) {
      const r = this.find(i);
      let idx = rootToIndex[r];
      if (idx === -1) {
        idx = groups.length;
        rootToIndex[r] = idx;
        groups.push([]);
      }
      groups[idx].push(i);
    }

    return groups;
  }
}

