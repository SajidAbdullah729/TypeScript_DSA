# TypeScript_DSA

**This is the GitHub repository** for the npm package **[typescript-dsa-stl](https://www.npmjs.com/package/typescript-dsa-stl)**.

STL-style data structures and algorithms for TypeScript: **Vector**, **Stack**, **Queue**, **List**, **PriorityQueue**, **OrderedMap** (Map), **UnorderedMap**, **OrderedSet** (Set), **UnorderedSet**, and algorithms (`sort`, `binarySearch`, `lowerBound`, `min`, `max`, etc.). Install from npm to use in your project; this repo holds the source code.

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

---

## API overview

| Module | Exports |
|--------|--------|
| **Collections** | `Vector`, `Stack`, `Queue`, `List`, `ListNode`, `PriorityQueue`, `OrderedMap`, `UnorderedMap`, `OrderedSet`, `UnorderedSet` |
| **Algorithms** | `sort`, `find`, `findIndex`, `transform`, `filter`, `reduce`, `reverse`, `unique`, `binarySearch`, `lowerBound`, `upperBound`, `min`, `max`, `partition` |
| **Utils** | `clamp`, `range`, `noop`, `identity`, `swap` |
| **Types** | `Comparator`, `Predicate`, `UnaryFn`, `Reducer`, `IterableLike`, `toArray` |

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
| **OrderedMap** (Map) | O(log n) get | O(n) set | — | O(n) delete | — |
| **UnorderedMap** | O(1)* get/set | O(1)* | — | O(1)* delete | — |
| **OrderedSet** (Set) | O(log n) has | O(n) add | — | O(n) delete | — |
| **UnorderedSet** | O(1)* has/add | O(1)* | — | O(1)* delete | — |

\* Amortized (hash).  
\** At a known node.

---

## For maintainers

- **Build:** `npm run build` (also runs before `npm publish` via `prepublishOnly`)
- **Publish:** `npm publish` (use `npm publish --access public` for a scoped package name)

---

## License

MIT
