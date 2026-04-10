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
| [String algorithms](#string-algorithms) | KMP, Rabin–Karp, rolling hash |
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
| **Algorithms** | `sort`, `find`, `findIndex`, `transform`, `filter`, `reduce`, `reverse`, `unique`, `binarySearch`, `lowerBound`, `upperBound`, `min`, `max`, `partition`, `DisjointSetUnion`, `KnuthMorrisPratt`, `RabinKarp`, `RABIN_KARP_DEFAULT_MODS`, `StringRollingHash`, `breadthFirstSearch`, `depthFirstSearch`, `topologicalSortStack`, `topologicalSortIndegree`, `connectedComponents`, `kruskalMST`, `dijkstra`, `reconstructPath` |
| **Utils** | `clamp`, `range`, `noop`, `identity`, `swap` |
| **Types** | `Comparator`, `Predicate`, `UnaryFn`, `Reducer`, `IterableLike`, `toArray`, `RabinKarpTripleMods`, `WeightedUndirectedEdge`, `TopologicalSortResult`, `GeneralSegmentTreeConfig`, `SegmentCombine`, `SegmentMerge`, `SegmentLeafBuild` |

### Subpath imports (tree-shaking)

```ts
import { Vector, Stack, Queue, Deque } from 'typescript-dsa-stl/collections';
import { sort, binarySearch, breadthFirstSearch, depthFirstSearch, topologicalSortStack, topologicalSortIndegree, KnuthMorrisPratt, RabinKarp, StringRollingHash } from 'typescript-dsa-stl/algorithms';
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

**OrderedMultiSet** is a sorted collection that allows duplicate elements (like C++ `std::multiset`). Use it when you need ordering and multiple copies of the same value.

| Use case | Example |
|----------|---------|
| **Sorted runs / leaderboard with ties** | Store scores; multiple users can have the same score. Iterate in sorted order, use `count(score)` for ties. |
| **Event timeline with repeated timestamps** | Add events by time; several events can share the same time. `add(timestamp)`, iterate in order. |
| **K-th smallest in a multiset** | Keep elements sorted; k-th element is at index `k - 1` in iteration. |
| **Range counts** | Combined with binary search ideas: count elements in `[low, high]` using `count` and iteration. |

**OrderedMultiMap** maps one key to multiple values while keeping keys sorted (like C++ `std::multimap`). Use it when a key can have several associated values and you need key order.

| Use case | Example |
|----------|---------|
| **Inverted index** | Key = term, values = document IDs containing that term. `set(term, docId)` for each occurrence; `getAll(term)` returns all doc IDs. |
| **Grouping by key** | Key = category, values = items. `set(category, item)`; iterate keys in order, use `getAll(key)` per group. |
| **One-to-many relations** | Key = user ID, values = session IDs. `set(userId, sessionId)`; `getAll(userId)` lists all sessions. |
| **Time-series by bucket** | Key = time bucket, values = events. Sorted keys give chronological buckets; `getAll(bucket)` gets events in that bucket. |

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

A segment tree is an indexable array backed by a tree so **range questions** (sum, min, max, or your own combine) and **updates** cost **O(log n)** instead of scanning the whole slice.

Segment trees support **range queries** and **point updates** in **O(log n)**. Range endpoints are **inclusive**: `query(l, r)` covers indices `l` through `r`.

**What each type does:**

| Type | Does |
|------|------|
| **SegmentTreeSum** / **Min** / **Max** | Fixed numeric range **sum**, **min**, or **max** with **one index updated at a time**. |
| **SegmentTree** (generic) | Your own **associative** combine over ranges; same type for array entries and node values. |
| **GeneralSegmentTree** | Array stores raw **V**, nodes hold a summary **T** built with **merge** and **buildLeaf**. |
| **LazySegmentTreeSum** | **Add the same delta to a whole range**, optional **single-cell set**, and **range sum** (lazy tags). |

| Structure | Build | Point update | Range query | Extra |
|-----------|-------|--------------|-------------|--------|
| **GeneralSegmentTree**, **SegmentTree**, **SegmentTreeSum** / **Min** / **Max** | O(n) | O(log n) | O(log n) | Inclusive `[l, r]`; **GeneralSegmentTree** keeps raw `V` and uses `merge` + `buildLeaf` |
| **LazySegmentTreeSum** | O(n) | `set`: O(log n) | `rangeSum`: O(log n) | `rangeAdd` on a range: O(log n) |

### Segment tree: Sum, Min, Max and example

- **`SegmentTreeSum`** — answers “what is the **sum** from `l` to `r`?” after you **`update(i, value)`** on one index.
- **`SegmentTreeMin`** — answers “what is the **minimum** in `[l, r]`?” after single-index updates.
- **`SegmentTreeMax`** — answers “what is the **maximum** in `[l, r]`?” after single-index updates.

Together they are fixed numeric implementations: build from initial values, **`update(i, value)`** for one index, **`query(l, r)`** for an inclusive range.

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

**Example — analytics / reporting (fixed buckets, range totals, single-day corrections):** each index is a **fixed bucket** (hour, day, version slot, …). You ask for the **sum** from bucket `a` through `b` and sometimes **fix one bucket** after late data or reconciliation — same API as above, wrapped for clarity.

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

In production you would usually **persist** the underlying series in a database and **rebuild** the tree when the period reloads; the tree stays useful in memory for dashboards, simulations, or request handlers that see heavy read/update traffic on the same window.

### Generic SegmentTree

**`SegmentTree<T>`** supports range queries for **any associative operation** (gcd, concatenation, bitwise OR, …) on a fixed-length array, with **point updates**, when element type and aggregate type are the same — pass an **associative** `combine` and a **neutral** value for query ranges that miss a segment (e.g. `0` for sum, `Infinity` for min).

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

**`GeneralSegmentTree<T, V>`** keeps **raw** values of type **V** in the array while each segment stores a **different** summary type **T** (e.g. raw numbers in the array, but nodes keep sums of squares or custom stats).

You supply:

- **`merge(left, right)`** — combine two child aggregates (internal nodes).
- **`neutral`** — identity for `merge` when a query does not overlap a segment.
- **`buildLeaf(value, index)`** — build the leaf from the raw array on initial construction and on every `update`.

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

**`LazySegmentTreeSum`** maintains a numeric array where you can **add a constant to every element in a range**, **overwrite one cell**, and query **range sums** — all in **O(log n)** via lazy propagation (unlike the trees above, which only support point updates).

**`rangeAdd(l, r, delta)`** adds `delta` to every element in the inclusive range. **`rangeSum(l, r)`** returns the sum. **`set(i, value)`** assigns one position (lazy tags are applied along the path). All are **O(log n)** — see the complexity table in the overview above.

```ts
import { LazySegmentTreeSum } from 'typescript-dsa-stl';

const lazy = new LazySegmentTreeSum([0, 0, 0, 0]);
lazy.rangeAdd(1, 2, 5); // indices 1 and 2 get +5
console.log(lazy.rangeSum(0, 3)); // 10
lazy.set(0, 100);
console.log(lazy.rangeSum(0, 3)); // 100 + 5 + 5 + 0
```

**Example — bulk adjustment on a slice, then aggregate:** apply the **same delta** to **every** element in an index range (bonuses, prorated credits, simulation shocks), then query **range sums** without updating each cell one by one.

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

The same idea applies to **inventory deltas** across bin ranges, **loyalty points** batch credits by user-ID band (when IDs map to contiguous indices), or **game/simulation** state where many cells gain the same buff and you query partial totals.

---

## Graph algorithms

Graph helpers live on the main package and under `typescript-dsa-stl/collections` for adjacency types and factories.

### Adjacency list (like C++ `vector<vector<type>> graph(n)`)

You can model C++-style adjacency lists using the graph types and helpers exported from `typescript-dsa-stl/collections` (or the main package).

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

Use an **unweighted** graph (adjacency list) when you only care about connectivity; use a **weighted** graph when edges have costs (distance, time, capacity).

| Use case | When to use |
|----------|-------------|
| **BFS / DFS, connectivity** | Unweighted: shortest path in terms of hop count, connected components, cycle detection. |
| **Shortest path (Dijkstra), MST** | Weighted: edge weights as distances or costs; run Dijkstra, Prim, or Kruskal on the list. |
| **Social / dependency graphs** | Unweighted or weighted: followers, dependencies (e.g. build order), recommendation graphs. |
| **Grid / game graphs** | Unweighted: 4- or 8-neighbor grids; weighted if movement costs differ per cell. |
| **Network / flow** | Weighted: capacities or latencies on edges for max-flow or routing. |

### Breadth-first search (BFS) and depth-first search (DFS)

`breadthFirstSearch` and `depthFirstSearch` take the number of vertices `n`, an unweighted `AdjacencyList`, and a `start` vertex. They return the **visit order** for all vertices **reachable** from `start` (vertices outside that component are not included). For an undirected graph, add each edge in **both** directions (see `addEdge` below).

**Example graph (diamond):** edges `0—1`, `0—2`, `1—3`, `2—3`.

```text
      0
     / \
    1   2
     \ /
      3
```

With neighbors listed in ascending vertex id (`0: [1,2]`, `1: [0,3]`, …), **BFS** from `0` visits by increasing distance from `0`: first `0`, then `1` and `2`, then `3` → order `[0, 1, 2, 3]`. **DFS** (preorder, first neighbor in each list first) goes `0 → 1 → 3` then `2` → order `[0, 1, 3, 2]`. The exact DFS order depends on how you order each adjacency list.

```ts
import {
  createAdjacencyList,
  addEdge,
  breadthFirstSearch,
  depthFirstSearch,
} from 'typescript-dsa-stl';

const n = 4;
const graph = createAdjacencyList(n);

// Undirected diamond: add both directions for each edge
addEdge(graph, 0, 1);
addEdge(graph, 1, 0);
addEdge(graph, 0, 2);
addEdge(graph, 2, 0);
addEdge(graph, 1, 3);
addEdge(graph, 3, 1);
addEdge(graph, 2, 3);
addEdge(graph, 3, 2);

const start = 0;

// BFS: level-by-level from start (hop count); output: [0, 1, 2, 3]
console.log(breadthFirstSearch(n, graph, start));
// Expected console output: [ 0, 1, 2, 3 ]

// DFS: preorder with explicit stack; output: [0, 1, 3, 2] for this adjacency layout
console.log(depthFirstSearch(n, graph, start));
// Expected console output: [ 0, 1, 3, 2 ]

// Invalid start → empty traversal
console.log(breadthFirstSearch(n, graph, -1)); // []
console.log(depthFirstSearch(n, graph, n)); // []

// Vertex 4 isolated: BFS/DFS from 0 never visits 4
const withIsolated = createAdjacencyList(5);
addEdge(withIsolated, 0, 1);
addEdge(withIsolated, 1, 0);
console.log(breadthFirstSearch(5, withIsolated, 0)); // [0, 1] — not [0,1,2,3,4]
```

**Notes**

- **Directed graphs:** only list outgoing edges in `adj[u]`; traversal follows arcs from `start`.
- **Disconnected graphs:** run again from another unvisited `start`, or use `connectedComponents` to enumerate components first.
- **Weighted graphs:** for traversal ignoring weights, use the same vertex lists as the unweighted graph (weights are ignored by these two functions).

### Topological sort

`topologicalSortStack` (iterative DFS / finish order) and `topologicalSortIndegree` (Kahn’s algorithm, zero-indegree queue) both take `n` and a **directed** unweighted `AdjacencyList`. They return `{ order, ok }`: a permutation of `0..n-1` when `ok` is true, or failure when a directed cycle exists.

**When to use**

- **Task / build / dependency ordering:** items must happen only after their prerequisites (package install order, compile steps, course prerequisites).
- **Scheduling under precedence constraints:** jobs with “A before B” rules and no cycles.
- **Detecting cycles in a directed model:** if `ok` is false, the graph (on valid vertices `0..n-1`) is not a DAG.
- **Pick either algorithm:** both answer the same yes/no; choose **stack** if you want DFS-style behavior and an explicit stack; choose **indegree** (Kahn) if you prefer peeling sources level-by-level (often closer to “ready queue” mental models).

**When topological order is not possible**

- Any **directed cycle** (including a **self-loop**): `ok` is false.
- **Undirected** graphs modeled with **both** `u → v` and `v → u`: that is a 2-cycle, so **not** a DAG unless you only use directed edges that reflect real precedence.

**Example (DAG)**

```ts
import {
  createAdjacencyList,
  addEdge,
  topologicalSortStack,
  topologicalSortIndegree,
} from 'typescript-dsa-stl';

const n = 4;
const g = createAdjacencyList(n);
addEdge(g, 0, 1);
addEdge(g, 0, 2);
addEdge(g, 1, 3);
addEdge(g, 2, 3);

const a = topologicalSortStack(n, g);
const b = topologicalSortIndegree(n, g);
// a.ok === true, b.ok === true; order arrays are valid topsorts (may differ)
```

### Disjoint Set Union (Union-Find)

Use Union-Find (DSU) to compute connected components efficiently. It merges endpoints of every edge in the adjacency list, so for directed graphs it returns weak connectivity components.

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

`connectedComponents(n, adj)` returns `number[][]` where each inner array is a component (list of vertices).

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

For a weighted graph, `kruskalMST` builds a Minimum Spanning Tree (MST) using DSU.

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

`kruskalMST(...)` returns `{ edges, totalWeight }`. To traverse the MST like a graph, convert `edges` into an adjacency list:

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

`dijkstra` computes single-source shortest paths on a **weighted** graph with **non-negative** edge weights.
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

### Knuth–Morris–Pratt (KMP), Rabin–Karp, and string rolling hash

All three work on **UTF-16 code units** (same as `String` indexing). They solve **different jobs**: KMP and Rabin–Karp are **pattern matchers** (list all start indices of a pattern in a text). `StringRollingHash` is a **substring-hash tool** on a **fixed** string—you combine it with your own logic (equality checks, binary search, etc.).

#### When to use which

| Goal | Prefer | Why |
|------|--------|-----|
| **Find every occurrence** of **one pattern** in **one text**, with **worst-case** O(n + m), **no hashing**, predictable behaviour | **KnuthMorrisPratt** | LPS table; only character comparisons; no modular arithmetic. |
| **Find every occurrence** of a pattern using a **sliding window** and **hashes** (triple moduli + final verify) | **RabinKarp** | Same asymptotic average case; good when you think in rolling hashes or batch **same-length** patterns. |
| **Many O(1) hash queries** on **substrings of one string** you already hold (compare two ranges, palindrome / LCP style checks, rolling checks without slicing) | **StringRollingHash** | O(n) preprocess, O(1) per `substringHash`; **not** a drop-in “find all matches” API—use KMP or Rabin–Karp for that. |

**Concrete situations**

- **Use KMP** when you need a **guaranteed** linear scan (interviews, strict time bounds, large alphabets), or the pattern is **reused** across many searches (`new KnuthMorrisPratt(pattern)` once, `.search(text)` many times).
- **Use Rabin–Karp** when a **rolling hash** model fits (e.g. one long stream, one pattern), or you later generalize to **several patterns of the same length** (compare each pattern’s triple hash to each window hash). Triple hashing keeps false hash positives negligible; **verification** still guarantees correct indices.
- **Use `StringRollingHash`** when the problem is **“hash of s[l..r)”** many times on **one** `s`—e.g. check `s[i..i+k) === s[j..j+k)` via hash equality (then confirm if needed), or algorithms that **binary search** on length using substring hashes. For **only** “list all starts of P in T”, pick **KMP** or **Rabin–Karp** instead of building substring hashes by hand.

```ts
import { KnuthMorrisPratt, RabinKarp, StringRollingHash } from 'typescript-dsa-stl';

// A) Pattern fixed, searched in many buffers — build KMP once, call .search() repeatedly (LPS reused).
const multiDoc = new KnuthMorrisPratt('ERROR');
multiDoc.search(serverLog1);
multiDoc.search(serverLog2);

// B) One haystack, one needle — both matchers return the same indices; KMP = no mods, Rabin–Karp = triple hash + verify.
const hay = '...long text...';
KnuthMorrisPratt.findOccurrences(hay, 'needle');
new RabinKarp('needle').search(hay);

// C) Same static string, many range-equality checks — rolling hash (not for “find all pattern starts” by itself).
const s = 'banana';
const rh = new StringRollingHash(s);
// Does s[1..4) equal s[3..6)? (both length 3)
const maybe = rh.substringHash(1, 3) === rh.substringHash(3, 3); // then compare slices if you need certainty
```

**How KMP works:** Build an LPS (longest proper prefix that is also a suffix) table for the pattern, then scan the text once. On a mismatch, the LPS tells you how far to shift the pattern without moving the text pointer backward—**O(n + m)** time, **O(m)** extra space for the pattern’s LPS.

**How Rabin–Karp works:** Use **triple hashing**—three independent polynomial hashes (same base, three distinct prime moduli, see `RABIN_KARP_DEFAULT_MODS`). A position is a candidate only when **all three** window hashes match the pattern’s triple; then a **character-by-character** check runs so reported matches are always correct. Spurious triple collisions are negligible; average **O(n + m)**.

**How rolling hash works:** Precompute prefix hashes and powers of a base modulo a prime. The hash of any substring `s[start .. start + length)` is derived from two prefix values—**O(n)** build, **O(1)** per substring query. Hashes can collide; for critical equality checks, compare actual strings after a hash match.

```ts
import {
  KnuthMorrisPratt,
  StringRollingHash,
  RabinKarp,
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
