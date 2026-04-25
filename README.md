# TypeScript_DSA

**Repository** for the npm package **[typescript-dsa-stl](https://www.npmjs.com/package/typescript-dsa-stl)** · [GitHub](https://github.com/SajidAbdullah729/TypeScript_DSA)

STL-style data structures and algorithms for TypeScript: **Vector**, **Stack**, **Queue**, **Deque**, **List**, **PriorityQueue**, ordered/unordered **Map** and **Set**, **OrderedMultiMap** / **OrderedMultiSet**, **segment trees**, **graph** helpers (BFS, DFS, topological sort, Dijkstra, Kruskal, DSU), and **string** algorithms (KMP, Rabin–Karp, rolling hash). Install from npm for your app; this repo is the source.

---

## Table of contents

| Section | What you’ll find |
|--------|-------------------|
| [Installation](#installation) | npm install |
| [Package layout & imports](#package-layout--imports) | Barrel vs subpaths (tree-shaking) |
| [Quick start](#quick-start) | One file showing main APIs |
| [API reference](#api-reference) | Export tables |
| [Complexity](#complexity) | Big-O for collections |
| [Collections](#collections) | Deque, nested vectors, multi-map / multi-set |
| [Segment trees](#segment-trees) | Overview, variants, and examples (one section) |
| [Graph algorithms](#graph-algorithms) | Adjacency lists, BFS/DFS, topological sort, components, MST, shortest paths |
| [String algorithms](#string-algorithms) | KMP, Rabin–Karp, Trie, rolling hash |
| [For maintainers](#for-maintainers) | Build and publish |
| [License](#license) | MIT |

---

## Installation

```bash
npm install typescript-dsa-stl
```

**Runtime:** Node **18+** (see `package.json` `engines`).

---

## Package layout & imports

Import everything from the root, or use subpaths for smaller bundles:

```ts
import { Vector, Stack, Queue, Deque } from 'typescript-dsa-stl/collections';
import {
  sort,
  binarySearch,
  breadthFirstSearch,
  depthFirstSearch,
  topologicalSortStack,
  topologicalSortIndegree,
  KnuthMorrisPratt,
  RabinKarp,
  Trie,
  StringRollingHash,
} from 'typescript-dsa-stl/algorithms';
import { clamp, range } from 'typescript-dsa-stl/utils';
import type { Comparator } from 'typescript-dsa-stl/types';
```

---

## Quick start

```ts
import {
  Vector,
  Stack,
  Queue,
  Deque,
  List,
  PriorityQueue,
  OrderedMap,
  UnorderedMap,
  OrderedSet,
  UnorderedSet,
  OrderedMultiMap,
  OrderedMultiSet,
  sort,
  find,
  binarySearch,
  lowerBound,
  upperBound,
  min,
  max,
  clamp,
  range,
} from 'typescript-dsa-stl';

// Collections
const vec = new Vector<number>([1, 2, 3]);
vec.push(4);
console.log(vec.back()); // 4

const stack = new Stack<string>();
stack.push('a');
stack.push('b');
console.log(stack.top()); // 'b'

const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.front()); // 1

// Deque — double-ended queue (like C++ std::deque): O(1) both ends + O(1) index access
const deque = new Deque<number>();
deque.pushBack(2);
deque.pushFront(1);
deque.pushBack(3);
console.log(deque.front()); // 1
console.log(deque.back()); // 3
console.log(deque.at(1)); // 2

const list = new List<number>();
list.pushBack(10);
const node = list.pushBack(20);
list.insertBefore(node, 15);
console.log(list.toArray()); // [10, 15, 20]

// PriorityQueue (max-heap by default)
const pq = new PriorityQueue<number>();
pq.push(3); pq.push(1); pq.push(4);
console.log(pq.top()); // 4
pq.pop();

// OrderedMap (keys sorted), UnorderedMap (hash)
const map = new UnorderedMap<string, number>();
map.set('a', 1); map.set('b', 2);
console.log(map.get('a')); // 1

// OrderedSet (sorted unique), UnorderedSet (hash)
const set = new UnorderedSet<number>([1, 2, 2, 3]);
console.log(set.size); // 3

// OrderedMultiSet (sorted, duplicates allowed)
const multiSet = new OrderedMultiSet<number>();
multiSet.add(3); multiSet.add(1); multiSet.add(2); multiSet.add(2);
console.log(multiSet.toArray()); // [1, 2, 2, 3]
console.log(multiSet.count(2));  // 2

// OrderedMultiMap (one key → multiple values, keys sorted)
const multiMap = new OrderedMultiMap<string, number>();
multiMap.set('scores', 90); multiMap.set('scores', 85); multiMap.set('scores', 95);
console.log(multiMap.getAll('scores')); // [90, 85, 95]

// Algorithms (work on arrays and iterables)
const arr = [3, 1, 4, 1, 5];
sort(arr);               // [1, 1, 3, 4, 5]
find(arr, (n) => n > 3); // 4
min(arr);                // 1
max(arr);                // 5

const sorted = [1, 2, 4, 4, 5];
binarySearch(sorted, 4); // 2
lowerBound(sorted, 4);   // 2
upperBound(sorted, 4);   // 4

// Utils
clamp(42, 0, 10);       // 10
range(0, 5);            // [0, 1, 2, 3, 4]
```

---

## API reference

### Main export map

| Area | Exports |
|------|---------|
| **Collections** | `Vector`, `Stack`, `Queue`, `Deque`, `List`, `ListNode`, `PriorityQueue`, `OrderedMap`, `UnorderedMap`, `OrderedSet`, `UnorderedSet`, `OrderedMultiMap`, `OrderedMultiSet`, `GeneralSegmentTree`, `SegmentTree`, `SegmentTreeSum`, `SegmentTreeMin`, `SegmentTreeMax`, `LazySegmentTreeSum`, `WeightedEdge`, `AdjacencyList`, `WeightedAdjacencyList`, `createAdjacencyList`, `createWeightedAdjacencyList`, `addEdge`, `deleteEdge` |
| **Algorithms** | `sort`, `find`, `findIndex`, `transform`, `filter`, `reduce`, `reverse`, `unique`, `binarySearch`, `lowerBound`, `upperBound`, `min`, `max`, `partition`, `DisjointSetUnion`, `KnuthMorrisPratt`, `RabinKarp`, `Trie`, `RABIN_KARP_DEFAULT_MODS`, `StringRollingHash`, `breadthFirstSearch`, `depthFirstSearch`, `topologicalSortStack`, `topologicalSortIndegree`, `connectedComponents`, `kruskalMST`, `dijkstra`, `reconstructPath` |
| **Utils** | `clamp`, `range`, `noop`, `identity`, `swap` |
| **Types** | `Comparator`, `Predicate`, `UnaryFn`, `Reducer`, `IterableLike`, `toArray`, `RabinKarpTripleMods`, `WeightedUndirectedEdge`, `TopologicalSortResult`, `GeneralSegmentTreeConfig`, `SegmentCombine`, `SegmentMerge`, `SegmentLeafBuild` |

### Subpath imports (tree-shaking)

```ts
import { Vector, Stack, Queue, Deque } from 'typescript-dsa-stl/collections';
import { sort, binarySearch, breadthFirstSearch, depthFirstSearch, topologicalSortStack, topologicalSortIndegree, KnuthMorrisPratt, RabinKarp, Trie, StringRollingHash } from 'typescript-dsa-stl/algorithms';
import { clamp, range } from 'typescript-dsa-stl/utils';
import type { Comparator } from 'typescript-dsa-stl/types';
```

---

## Complexity

### Linear and associative structures

| Structure | Access | Insert end | Insert middle | Remove end | Remove middle |
|-----------|--------|------------|---------------|------------|---------------|
| **Vector** | O(1) | O(1)* | O(n) | O(1) | O(n) |
| **Stack** | — | O(1) | — | O(1) | — |
| **Queue** | — | O(1)* | — | O(1)* | — |
| **Deque** | O(1) | O(1)* (front/back) | — | O(1)* (front/back) | — |
| **List** | O(n) | O(1) | O(1)** | O(1) | O(1)** |
| **PriorityQueue** | — | O(log n) | — | O(log n) | — |
| **OrderedMap** (Map) | O(log n) get | O(log n) set | — | O(log n) delete | — |
| **UnorderedMap** | O(1)* get/set | O(1)* | — | O(1)* delete | — |
| **OrderedSet** (Set) | O(log n) has | O(log n) add | — | O(log n) delete | — |
| **UnorderedSet** | O(1)* has/add | O(1)* | — | O(1)* delete | — |
| **OrderedMultiMap** | O(log n) get | O(log n) set | — | O(log n) delete | — |
| **OrderedMultiSet** | O(log n) has/count | O(log n) add | — | O(log n) delete | — |

\* Amortized (hash).  
\** At a known node.

Segment-tree time and space behaviour is documented in [Segment trees](#segment-trees) (overview and table at the start of that section).

---

## Collections

### Deque (like C++ `std::deque`)

A **double-ended queue**: amortized **O(1)** `pushFront` / `pushBack` / `popFront` / `popBack`, and **O(1)** random access via `at` / `set`. Implemented as a growable circular buffer (same asymptotics as a typical `std::deque` for these operations).

| C++ | TypeScript |
|-----|------------|
| `push_front` | `pushFront` |
| `push_back` | `pushBack` |
| `pop_front` | `popFront` |
| `pop_back` | `popBack` |
| `front` / `back` | `front()` / `back()` |
| `operator[]` / `at` | `at(i)` / `set(i, value)` |
| `size` / `empty` | `size` / `empty` |
| — | `capacity`, `reserve`, `shrinkToFit`, `toArray()`, iterator |

```ts
import { Deque } from 'typescript-dsa-stl';

const d = new Deque<number>([1, 2, 3]); // copy initial elements, or `new Deque()` / `new Deque(64)` for capacity hint
d.pushFront(0);
d.popBack();
console.log(d.toArray()); // [0, 1, 2]
```

### 2D and 3D vectors (like C++ `vector<vector<int>>`)

`Vector<T>` is generic, so you can nest it for 2D/3D grids:

| C++ | TypeScript |
|-----|------------|
| `vector<int>` | `Vector<number>` |
| `vector<vector<int>>` | `Vector<Vector<number>>` |
| `vector<vector<vector<int>>>` | `Vector<Vector<Vector<number>>>` |

**2D example:**

```ts
import { Vector } from 'typescript-dsa-stl';

const grid = new Vector<Vector<number>>();

const row0 = new Vector<number>([1, 2, 3]);
const row1 = new Vector<number>([4, 5, 6]);
grid.push(row0);
grid.push(row1);

grid.at(0).at(1);   // 2  (first row, second column)
grid.at(1).at(0);   // 4  (second row, first column)

grid.at(0).set(1, 99);
grid.at(0).push(10);
```

**3D example:**

```ts
const cube = new Vector<Vector<Vector<number>>>();

const layer0 = new Vector<Vector<number>>();
layer0.push(new Vector<number>([1, 2]));
layer0.push(new Vector<number>([3, 4]));
cube.push(layer0);

cube.at(0).at(1).at(0);  // 3  (layer 0, row 1, col 0)
```

### OrderedMultiMap and OrderedMultiSet — use cases

**OrderedMultiSet** keeps values sorted and allows duplicates.

| Use case | Example |
|----------|---------|
| **Leaderboard with ties** | Store repeated scores and iterate sorted. |
| **Timeline with duplicate times** | Keep events sorted even with same timestamp. |
| **K-th smallest** | Iterate sorted values and pick index `k - 1`. |
| **Range stats** | Count values inside `[low, high]`. |

**OrderedMultiMap** stores multiple values per key while keeping keys sorted.

| Use case | Example |
|----------|---------|
| **Inverted index** | `term -> docIds`. |
| **Grouping** | `category -> items`. |
| **One-to-many mapping** | `userId -> sessionIds`. |
| **Time buckets** | `bucket -> events`, in key order. |

**OrderedMultiSet example:**

```ts
import { OrderedMultiSet } from 'typescript-dsa-stl';

const scores = new OrderedMultiSet<number>();
scores.add(85); scores.add(92); scores.add(85); scores.add(78);
console.log(scores.toArray());   // [78, 85, 85, 92]
console.log(scores.count(85));   // 2
scores.delete(85);               // remove one 85
console.log(scores.count(85));   // 1
scores.deleteAll(85);            // remove all 85s
```

**OrderedMultiMap example:**

```ts
import { OrderedMultiMap } from 'typescript-dsa-stl';

const index = new OrderedMultiMap<string, number>();  // term -> doc IDs
index.set('typescript', 1); index.set('typescript', 3); index.set('stl', 2);
console.log(index.getAll('typescript'));  // [1, 3]
console.log(index.get('stl'));            // 2
for (const [key, value] of index) {
  console.log(key, value);               // keys in sorted order
}
```

---

## Segment trees

### Segment tree overview and complexity

A segment tree supports fast **range queries** and **updates**. For this package, ranges are inclusive: `query(l, r)`.

**What each type does:**

| Type | Does |
|------|------|
| **SegmentTreeSum** / **Min** / **Max** | Fixed numeric range **sum**, **min**, or **max** with **one index updated at a time**. |
| **SegmentTree** (generic) | Your own **associative** combine over ranges; same type for array entries and node values. |
| **GeneralSegmentTree** | Array stores raw **V**, nodes hold a summary **T** built with **merge** and **buildLeaf**. |
| **LazySegmentTreeSum** | **Add the same delta to a whole range**, optional **single-cell set**, and **range sum** (lazy tags). |

| Structure | Build | Point update | Range query | Extra |
|-----------|-------|--------------|-------------|--------|
| **GeneralSegmentTree**, **SegmentTree**, **SegmentTreeSum** / **Min** / **Max** | O(n) | O(log n) | O(log n) | Inclusive `[l, r]`; `GeneralSegmentTree` uses raw `V` + summary `T` |
| **LazySegmentTreeSum** | O(n) | `set`: O(log n) | `rangeSum`: O(log n) | `rangeAdd` on a range: O(log n) |

### Segment tree: Sum, Min, Max and example

- **`SegmentTreeSum`** — answers “what is the **sum** from `l` to `r`?” after you **`update(i, value)`** on one index.
- **`SegmentTreeMin`** — answers “what is the **minimum** in `[l, r]`?” after single-index updates.
- **`SegmentTreeMax`** — answers “what is the **maximum** in `[l, r]`?” after single-index updates.

These are fixed numeric trees with `update(i, value)` and inclusive `query(l, r)`.

```ts
import {
  SegmentTreeSum,
  SegmentTreeMin,
  SegmentTreeMax,
} from 'typescript-dsa-stl';

const sum = new SegmentTreeSum([1, 2, 3, 4]);
console.log(sum.query(0, 3)); // 10
sum.update(1, 10);
console.log(sum.query(0, 3)); // 1 + 10 + 3 + 4 = 18

const mn = new SegmentTreeMin([5, 2, 8, 1]);
console.log(mn.query(0, 3)); // 1

const mx = new SegmentTreeMax([5, 2, 8, 1]);
console.log(mx.query(0, 3)); // 8
```

**Example use case:** fixed buckets (day/hour), range totals, and single-bucket corrections.

```ts
import { SegmentTreeSum } from 'typescript-dsa-stl';

/** Revenue (or events, page views, API calls) per calendar day; index 0 = first day of period. */
class PeriodMetrics {
  private readonly tree: SegmentTreeSum;

  constructor(dailyValues: readonly number[]) {
    this.tree = new SegmentTreeSum(dailyValues);
  }

  /** Total for an inclusive day range — e.g. chart drill-down or export row. */
  totalBetweenDay(firstDayIndex: number, lastDayIndex: number): number {
    return this.tree.query(firstDayIndex, lastDayIndex);
  }

  /** Backfill or correct one day without rebuilding the whole series. */
  setDay(dayIndex: number, amount: number): void {
    this.tree.update(dayIndex, amount);
  }
}

const january = new PeriodMetrics([1200, 980, 1100, 1050, 1300]);
console.log(january.totalBetweenDay(0, 4)); // full period
january.setDay(2, 1150); // corrected day 2
console.log(january.totalBetweenDay(1, 3)); // sum over days 1..3
```

In production, persist raw values and rebuild the tree when the period reloads.

### Generic SegmentTree

**`SegmentTree<T>`** supports any associative combine (gcd, concat, bitwise OR, etc.) with point updates. Provide `combine` and a neutral value.

```ts
import { SegmentTree } from 'typescript-dsa-stl';

const gcdTree = new SegmentTree<number>(
  [12, 18, 24],
  (a, b) => {
    let x = a;
    let y = b;
    while (y !== 0) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  },
  0
);
console.log(gcdTree.query(0, 2)); // gcd(12, 18, 24) === 6

// Non-numeric example: concatenate strings
const strTree = new SegmentTree<string>(
  ['a', 'b', 'c'],
  (a, b) => a + b,
  ''
);
console.log(strTree.query(0, 2)); // 'abc'
```

### GeneralSegmentTree

**`GeneralSegmentTree<T, V>`** keeps raw values as `V` and segment summaries as `T`.

You provide:

- **`merge(left, right)`**: combine child summaries.
- **`neutral`**: identity for non-overlapping ranges.
- **`buildLeaf(value, index)`**: build a leaf from raw `V`.

```ts
import { GeneralSegmentTree } from 'typescript-dsa-stl';

// Store sum of squares; raw array is plain numbers
const st = new GeneralSegmentTree<number, number>([1, 2, 3], {
  merge: (a, b) => a + b,
  neutral: 0,
  buildLeaf: (v, i) => v * v + i,
});
console.log(st.query(0, 2)); // (1+0) + (4+1) + (9+2) = 17
st.update(1, 4);
console.log(st.rawAt(1)); // 4 — current raw value at index 1
```

### LazySegmentTreeSum and example

**`LazySegmentTreeSum`** supports range add, point set, and range sum in **O(log n)** using lazy propagation.

`rangeAdd(l, r, delta)` updates a whole range, `rangeSum(l, r)` queries a range, and `set(i, value)` updates one index.

```ts
import { LazySegmentTreeSum } from 'typescript-dsa-stl';

const lazy = new LazySegmentTreeSum([0, 0, 0, 0]);
lazy.rangeAdd(1, 2, 5); // indices 1 and 2 get +5
console.log(lazy.rangeSum(0, 3)); // 10
lazy.set(0, 100);
console.log(lazy.rangeSum(0, 3)); // 100 + 5 + 5 + 0
```

**Example use case:** apply one delta to a range, then query subtotals.

```ts
import { LazySegmentTreeSum } from 'typescript-dsa-stl';

/** Example: per-seat or per-row amounts; apply a flat bonus to ranks 10–50 (0-based 9..49), then sum a sub-range for a sub-team. */
function simulateBulkBonusAndSubtotal(seatCount: number): void {
  // Initial per-seat values (e.g. base commission), built once
  const base = Array.from({ length: seatCount }, (_, i) => 100 + i);
  const amounts = new LazySegmentTreeSum(base);

  // HR: +250 to everyone in seats 10–50 inclusive (indices 9..49)
  amounts.rangeAdd(9, 49, 250);

  // Finance: subtotal for seats 20–30 only
  console.log(amounts.rangeSum(19, 29));
}

simulateBulkBonusAndSubtotal(100);
```

Same pattern works for inventory ranges, loyalty batches, and simulation buffs.

---

## Graph algorithms

Graph helpers are available from the main package and `typescript-dsa-stl/collections`.

### Adjacency list (like C++ `vector<vector<type>> graph(n)`)

Use these types/helpers to model C++-style adjacency lists.

#### Unweighted adjacency list

C++:

```cpp
int n = 5;
vector<vector<int>> graph(n);
graph[u].push_back(v);   // or graph[u].pb(v);
```

TypeScript (easy declaration with `createAdjacencyList`):

```ts
import { createAdjacencyList } from 'typescript-dsa-stl/collections';

const n = 5;
const graph = createAdjacencyList(n);   // empty graph with n vertices

// C++: graph[u].push_back(v);
graph[u].push(v);

// Iteration is the same idea as in C++
for (const v of graph[u]) {
  // neighbor v
}
```

Or with helpers `addEdge` / `deleteEdge`:

```ts
import { createAdjacencyList, addEdge, deleteEdge } from 'typescript-dsa-stl/collections';

const graph = createAdjacencyList(5);

addEdge(graph, u, v);        // add u -> v
deleteEdge(graph, u, v);     // remove all edges u -> v
```

#### Weighted adjacency list

In C++ you might write:

```cpp
int n = 5;
vector<vector<pair<int,int>>> graph(n);
graph[u].push_back({v, w});   // edge u -> v with weight w
```

In TypeScript, use `createWeightedAdjacencyList` for easy declaration:

```ts
import { createWeightedAdjacencyList } from 'typescript-dsa-stl/collections';

const n = 5;
const graph = createWeightedAdjacencyList(n);   // empty weighted graph with n vertices

// C++: graph[u].push_back({v, w});
graph[u].push({ to: v, weight: w });

// When iterating, you get both neighbor and weight
for (const { to, weight } of graph[u]) {
  // edge u -> to with cost = weight
}
```

Or with the helper functions `addEdge` / `deleteEdge`:

```ts
import { createWeightedAdjacencyList, addEdge, deleteEdge } from 'typescript-dsa-stl/collections';

const graph = createWeightedAdjacencyList(5);

addEdge(graph, u, v, w);         // add u -> v with weight w
deleteEdge(graph, u, v, w);      // delete all edges u -> v with weight w
```

#### Graph adjacency list — use cases

Use **unweighted** lists for connectivity/traversal; use **weighted** lists when edges have costs.

| Use case | When to use |
|----------|-------------|
| **BFS / DFS, connectivity** | Unweighted hop-based traversal and components. |
| **Shortest path, MST** | Weighted edges for distance/cost problems. |
| **Social / dependency graphs** | Use either, depending on whether edges have weights. |
| **Grid / game graphs** | Unweighted for equal moves; weighted for variable move cost. |
| **Network / flow** | Weighted capacity/latency models. |

### Breadth-first search (BFS) and depth-first search (DFS)

`breadthFirstSearch` and `depthFirstSearch` take `n`, an unweighted `AdjacencyList`, and `start`. They return traversal order for vertices reachable from `start`.

```ts
import {
  createAdjacencyList,
  addEdge,
  breadthFirstSearch,
  depthFirstSearch,
} from 'typescript-dsa-stl';

const n = 4;
const graph = createAdjacencyList(n);

addEdge(graph, 0, 1);
addEdge(graph, 1, 0);
addEdge(graph, 0, 2);
addEdge(graph, 2, 0);
addEdge(graph, 1, 3);
addEdge(graph, 3, 1);
addEdge(graph, 2, 3);
addEdge(graph, 3, 2);

console.log(breadthFirstSearch(n, graph, 0)); // [0, 1, 2, 3]
console.log(depthFirstSearch(n, graph, 0));   // [0, 1, 3, 2]
```

For undirected graphs, add both directions. DFS order depends on neighbor order.

### Topological sort

`topologicalSortStack` (DFS-style) and `topologicalSortIndegree` (Kahn) take `n` and a directed unweighted `AdjacencyList`. Both return `{ order, ok }`.

Use it for dependency ordering. If `ok` is `false`, the graph has a cycle.

```ts
import {
  createAdjacencyList,
  addEdge,
  topologicalSortStack,
  topologicalSortIndegree,
  type TopologicalSortResult,
} from 'typescript-dsa-stl';

const n = 4;
const g = createAdjacencyList(n);
addEdge(g, 0, 1);
addEdge(g, 0, 2);
addEdge(g, 1, 3);
addEdge(g, 2, 3);

const a: TopologicalSortResult = topologicalSortStack(n, g);
const b = topologicalSortIndegree(n, g);
console.log(a.ok, a.order);
console.log(b.ok, b.order);

const cyclic = createAdjacencyList(3);
addEdge(cyclic, 0, 1);
addEdge(cyclic, 1, 2);
addEdge(cyclic, 2, 0);
const bad = topologicalSortStack(3, cyclic);
console.log(bad.ok, bad.order); // false, []
```

### Disjoint Set Union (Union-Find)

Use DSU to compute connected components. For directed graphs, this gives weakly connected components.

```ts
import { createAdjacencyList, connectedComponents } from 'typescript-dsa-stl';

const n = 5;
const graph = createAdjacencyList(n);
graph[0].push(1);
graph[1].push(0);
graph[3].push(4);
graph[4].push(3);

const comps = connectedComponents(n, graph);
// e.g. [[0, 1], [2], [3, 4]]
```

#### Traverse the result

`connectedComponents(n, adj)` returns `number[][]` (one vertex list per component).

```ts
// 1) Iterate each component
for (const comp of comps) {
  // comp is like [v0, v1, ...]
  for (const v of comp) {
    // do something with vertex v
  }
}

// 2) Component sizes
const sizes = comps.map(comp => comp.length);
```

### Kruskal MST (uses DSU)

For weighted graphs, `kruskalMST` builds a minimum spanning tree with DSU.

```ts
import {
  createWeightedAdjacencyList,
  addEdge,
  kruskalMST,
} from 'typescript-dsa-stl';

const n = 4;
const wGraph = createWeightedAdjacencyList(n);

// Add undirected edges by adding both directions.
addEdge(wGraph, 0, 1, 1); addEdge(wGraph, 1, 0, 1);
addEdge(wGraph, 0, 2, 4); addEdge(wGraph, 2, 0, 4);
addEdge(wGraph, 1, 2, 2); addEdge(wGraph, 2, 1, 2);
addEdge(wGraph, 1, 3, 3); addEdge(wGraph, 3, 1, 3);

const { edges, totalWeight } = kruskalMST(n, wGraph, { undirected: true });
// edges: MST edges (chosen by weight), totalWeight: sum of weights
```

#### Traverse the MST

`kruskalMST(...)` returns `{ edges, totalWeight }`. Convert `edges` to an adjacency list to traverse it.

```ts
import { createWeightedAdjacencyList } from 'typescript-dsa-stl/collections';

const mstAdj = createWeightedAdjacencyList(n);

for (const { u, v, weight } of edges) {
  // MST is undirected (we used { undirected: true })
  mstAdj[u].push({ to: v, weight });
  mstAdj[v].push({ to: u, weight });
}

// Example: iterate neighbors of vertex 0 in the MST
for (const { to, weight } of mstAdj[0]) {
  // visit edge 0 -> to (weight)
}
```

### Dijkstra shortest paths

`dijkstra` computes single-source shortest paths on weighted graphs with non-negative edges.
It returns:

- `dist[v]`: shortest distance from `start` to `v` (`Infinity` if unreachable)
- `prev[v]`: previous vertex on the shortest path (or `-1` if none)

```ts
import { createWeightedAdjacencyList, addEdge, dijkstra, reconstructPath } from 'typescript-dsa-stl'; // graph + shortest path helpers

const n = 5; // vertices 0..4
const g = createWeightedAdjacencyList(n); // WeightedAdjacencyList: g[u] = [{to, weight}, ...]

// Directed edges (add both directions for undirected graphs)
// addEdge(g, from, to, weight)
addEdge(g, 0, 1, 2); // 0 -> 1 (cost 2)
addEdge(g, 0, 2, 5); // 0 -> 2 (cost 5)
addEdge(g, 1, 2, 1); // 1 -> 2 (cost 1)
addEdge(g, 1, 3, 2); // 1 -> 3 (cost 2)
addEdge(g, 2, 4, 1); // 2 -> 4 (cost 1)
addEdge(g, 3, 4, 3); // 3 -> 4 (cost 3)

const { dist, prev } = dijkstra(n, g, 0); // start = 0; dist/prev arrays length n
console.log(dist); // dist[v] = shortest distance from 0 to v (Infinity if unreachable), e.g. [0, 2, 3, 4, 4]

// Reconstruct path 0 -> 4
const target = 4; // destination vertex
const path = reconstructPath(prev, 0, target); // [0, ..., target] or [] if unreachable
console.log(path); // [0, 1, 2, 4]
```

---

## String algorithms

### Knuth–Morris–Pratt (KMP), Rabin–Karp, Trie, and string rolling hash

All four operate on UTF-16 code units: KMP/Rabin–Karp for pattern matching, `Trie` for exact/prefix lookup, `StringRollingHash` for substring hashes.

#### When to use which

| Goal | Prefer | Why |
|------|--------|-----|
| **Single-pattern matching with predictable worst-case** | **KnuthMorrisPratt** | Linear time, no hashing. |
| **Rolling-hash style matching** | **RabinKarp** | Window hashes + final verify. |
| **Dynamic dictionary / prefix queries** | **Trie** | `insert`/`search`/`startsWith` in O(L). |
| **Many substring hash queries on one string** | **StringRollingHash** | O(n) preprocess, O(1) per query. |

```ts
import { KnuthMorrisPratt, RabinKarp, Trie, StringRollingHash } from 'typescript-dsa-stl';

// A) Pattern fixed, searched in many buffers — build KMP once, call .search() repeatedly (LPS reused).
const multiDoc = new KnuthMorrisPratt('ERROR');
multiDoc.search(serverLog1);
multiDoc.search(serverLog2);

// B) One haystack, one needle — both matchers return the same indices; KMP = no mods, Rabin–Karp = triple hash + verify.
const hay = '...long text...';
KnuthMorrisPratt.findOccurrences(hay, 'needle');
new RabinKarp('needle').search(hay);

// C) Dictionary/prefix queries — Trie.
const trie = new Trie();
trie.insert('apple');
trie.insert('app');
trie.search('app');       // true
trie.startsWith('appl');  // true
trie.delete('app');       // true

// D) Same static string, many range-equality checks — rolling hash (not for “find all pattern starts” by itself).
const s = 'banana';
const rh = new StringRollingHash(s);
// Does s[1..4) equal s[3..6)? (both length 3)
const maybe = rh.substringHash(1, 3) === rh.substringHash(3, 3); // then compare slices if you need certainty
```

KMP and Rabin–Karp matching are linear in practice for this API; rolling hash is O(n) preprocess + O(1) substring hash query.

```ts
import {
  KnuthMorrisPratt,
  RabinKarp,
  Trie,
  StringRollingHash,
  RABIN_KARP_DEFAULT_MODS,
} from 'typescript-dsa-stl';

// --- KMP: construct with the pattern; LPS is built inside the constructor ---
const kmp = new KnuthMorrisPratt('aba');
// LPS for "aba" is [0, 0, 1] — used to skip redundant comparisons after a partial match

const positions = kmp.search('ababa');
// "aba" appears starting at index 0 ("ababa") and index 2 ("aba" at the end)
console.log(positions); // [0, 2]

// One-shot search without storing an instance (same result as above for this pattern/text)
console.log(KnuthMorrisPratt.findOccurrences('ababa', 'aba')); // [0, 2]

// Overlapping matches are all reported (each valid start index)
const overlaps = KnuthMorrisPratt.findOccurrences('aaaa', 'aa');
// Starts at 0, 1, 2 — three overlapping occurrences of "aa"
console.log(overlaps); // [0, 1, 2]

// Empty pattern: no matches returned (empty array)
console.log(new KnuthMorrisPratt('').search('anything')); // []

// --- Rabin–Karp: triple moduli (defaults) + verification; same results as KMP for real matches ---
const rk = new RabinKarp('aba');
// RABIN_KARP_DEFAULT_MODS = [1e9+7, 1e9+9, 998244353] — three hashes must agree, then verify
console.log(RABIN_KARP_DEFAULT_MODS.length); // 3
console.log(rk.search('ababa')); // [0, 2]
console.log(RabinKarp.findOccurrences('ababa', 'aba')); // [0, 2]
// new RabinKarp(pattern, base?, [mod0, mod1, mod2]) — override the three primes if needed

// Overlapping matches (same as KMP)
console.log(RabinKarp.findOccurrences('aaaa', 'aa')); // [0, 1, 2]

// Empty pattern: no matches
console.log(new RabinKarp('').search('text')); // []

// --- Trie: dictionary and prefix queries ---
const trie = new Trie();
trie.insert('apple');
trie.insert('app');
console.log(trie.search('app')); // true
console.log(trie.search('ap')); // false
console.log(trie.startsWith('ap')); // true
console.log(trie.delete('app')); // true
console.log(trie.search('app')); // false

// --- String rolling hash: default base 131, mod 1_000_000_007 (both configurable) ---
const rh = new StringRollingHash('hello');
// Internally: prefix[] and pow[] so substring hashes are O(1)

// Hash of the entire string (same as substring from 0 with full length)
console.log(rh.fullHash()); // bigint — concrete value depends on base/mod
console.log(rh.substringHash(0, rh.length())); // same bigint as fullHash()

// Hash of substring "ell" — starts at index 1, length 3
console.log(rh.substringHash(1, 3)); // bigint for "ell"

// Two equal strings with the same base/mod yield equal full hashes
const same = new StringRollingHash('hello');
console.log(rh.fullHash() === same.fullHash()); // true

// Compare a substring of one string to another range (useful for pattern checks)
const a = new StringRollingHash('banana');
const b = new StringRollingHash('na');
// Hash of "na" in "banana" at index 2 should match b’s full hash if substrings equal
console.log(a.substringHash(2, 2) === b.fullHash()); // true — both are "na"
```

---

## For maintainers

- **Build:** `npm run build` (also runs before `npm publish` via `prepublishOnly`)
- **Publish:** `npm publish` (use `npm publish --access public` for a scoped package name)

---

## License

MIT
