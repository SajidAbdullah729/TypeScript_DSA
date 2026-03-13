# TypeScript_DSA

**This is the GitHub repository** for the npm package **[typescript-dsa-stl](https://www.npmjs.com/package/typescript-dsa-stl)**.

STL-style data structures and algorithms for TypeScript: **Vector**, **Stack**, **Queue**, **List**, **PriorityQueue**, **OrderedMap** (Map), **UnorderedMap**, **OrderedSet** (Set), **UnorderedSet**, **OrderedMultiMap**, **OrderedMultiSet**, and algorithms (`sort`, `binarySearch`, `lowerBound`, `min`, `max`, etc.). Install from npm to use in your project; this repo holds the source code.

---

## Install

```bash
npm install typescript-dsa-stl
```

---

## Quick start

```ts
import {
  Vector,
  Stack,
  Queue,
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

### Graph adjacency lists (like C++ `vector<vector<type>> adj(n)`)

You can model C++-style adjacency lists using the graph helper types exported from `typescript-dsa-stl/types`.

#### Unweighted adjacency list

C++:

```cpp
int n = 5;
vector<vector<int>> adj(n);
adj[u].push_back(v);   // or adj[u].pb(v);
```

TypeScript (manual `push`):

```ts
import type { AdjacencyList } from 'typescript-dsa-stl/types';

const n = 5;
// number of vertices = n, initially all neighbors empty
const adj: AdjacencyList<number> = Array.from({ length: n }, () => []);

// C++: adj[u].push_back(v);
adj[u].push(v);

// Iteration is the same idea as in C++
for (const v of adj[u]) {
  // neighbor v
}
```

TypeScript (with helpers `addEdge` / `deleteEdge`):

```ts
import type { AdjacencyList } from 'typescript-dsa-stl/types';
import { addEdge, deleteEdge } from 'typescript-dsa-stl/types';

const n = 5;
const adj: AdjacencyList<number> = Array.from({ length: n }, () => []);

addEdge(adj, u, v);        // add u -> v
deleteEdge(adj, u, v);     // remove all edges u -> v
```

#### Weighted adjacency list

In C++ you might write:

```cpp
int n = 5;
vector<vector<pair<int,int>>> adj(n);
adj[u].push_back({v, w});   // edge u -> v with weight w
```

In TypeScript, use `WeightedEdge` and `WeightedAdjacencyList`:

```ts
import type {
  WeightedEdge,
  WeightedAdjacencyList,
} from 'typescript-dsa-stl/types';

const n = 5;
const adj: WeightedAdjacencyList<number, number> =
  Array.from({ length: n }, () => []);

// C++: adj[u].push_back({v, w});
adj[u].push({ to: v, weight: w });

// When iterating, you get both neighbor and weight
for (const { to, weight } of adj[u]) {
  // edge u -> to with cost = weight
}

// If you prefer a different vertex or weight type, just change the generics:
// const adj: WeightedAdjacencyList<string, bigint> = ...
```

Or with the helper functions `addEdge` / `deleteEdge`:

```ts
import type { WeightedAdjacencyList } from 'typescript-dsa-stl/types';
import { addEdge, deleteEdge } from 'typescript-dsa-stl/types';

const n = 5;
const adj: WeightedAdjacencyList<number, number> =
  Array.from({ length: n }, () => []);

addEdge(adj, u, v, w);         // add u -> v with weight w
deleteEdge(adj, u, v, w);      // delete all edges u -> v with weight w
```

---

## API overview

| Module | Exports |
|--------|--------|
| **Collections** | `Vector`, `Stack`, `Queue`, `List`, `ListNode`, `PriorityQueue`, `OrderedMap`, `UnorderedMap`, `OrderedSet`, `UnorderedSet`, `OrderedMultiMap`, `OrderedMultiSet` |
| **Algorithms** | `sort`, `find`, `findIndex`, `transform`, `filter`, `reduce`, `reverse`, `unique`, `binarySearch`, `lowerBound`, `upperBound`, `min`, `max`, `partition` |
| **Utils** | `clamp`, `range`, `noop`, `identity`, `swap` |
| **Types** | `Comparator`, `Predicate`, `UnaryFn`, `Reducer`, `IterableLike`, `toArray`, `WeightedEdge`, `AdjacencyList`, `WeightedAdjacencyList` |

### Subpath imports (tree-shaking)

```ts
import { Vector, Stack } from 'typescript-dsa-stl/collections';
import { sort, binarySearch } from 'typescript-dsa-stl/algorithms';
import { clamp, range } from 'typescript-dsa-stl/utils';
import type { Comparator } from 'typescript-dsa-stl/types';
```

---

## Data structures

| Structure | Access | Insert end | Insert middle | Remove end | Remove middle |
|-----------|--------|------------|---------------|------------|---------------|
| **Vector** | O(1) | O(1)* | O(n) | O(1) | O(n) |
| **Stack** | — | O(1) | — | O(1) | — |
| **Queue** | — | O(1)* | — | O(1)* | — |
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

---

## OrderedMultiMap and OrderedMultiSet — use cases

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

### OrderedMultiSet example

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

### OrderedMultiMap example

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

## For maintainers

- **Build:** `npm run build` (also runs before `npm publish` via `prepublishOnly`)
- **Publish:** `npm publish` (use `npm publish --access public` for a scoped package name)

---

## License

MIT
