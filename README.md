# TypeScript_DSA

STL-style **data structures and algorithms** for TypeScript: Vector, Stack, Queue, List, and algorithms (sort, binarySearch, lowerBound, min, max, etc.). Publishable npm package.

## Install

```bash
npm install typescript-dsa-stl
```

## Quick start

```ts
import {
  Vector,
  Stack,
  Queue,
  List,
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

## API overview

| Module | Exports |
|--------|--------|
| **Collections** | `Vector`, `Stack`, `Queue`, `List`, `ListNode` |
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

## Data structures

| Structure | Access | Insert end | Insert middle | Remove end | Remove middle |
|-----------|--------|------------|---------------|------------|---------------|
| **Vector** | O(1) | O(1)* | O(n) | O(1) | O(n) |
| **Stack** | — | O(1) | — | O(1) | — |
| **Queue** | — | O(1)* | — | O(1)* | — |
| **List** | O(n) | O(1) | O(1)** | O(1) | O(1)** |

\* Amortized. \** At a known node.

## Publish this package to npm

1. **Set repo URLs** in `package.json`: replace `your-username` in `repository`, `homepage`, and `bugs` with your GitHub username (and repo name if different).
2. **Build**: `npm run build`
3. **Login**: `npm login`
4. **Publish**: `npm publish` (use `npm publish --access public` if you use a scoped name like `@yourusername/typescript-dsa-stl`)

## Scripts

- `npm run build` — compile TypeScript to `dist/` (runs automatically before `npm publish` via `prepublishOnly`)

## License

MIT
