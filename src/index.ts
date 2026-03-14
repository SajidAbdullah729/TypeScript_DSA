/**
 * TypeScript SDK — use like C++ STL.
 * Clone the repo and import from this package.
 *
 * @example
 * import { Vector, Stack, Queue, List, sort, binarySearch, clamp } from 'typescript-dsa-stl';
 */

export {
  Vector,
  Stack,
  Queue,
  List,
  ListNode,
  PriorityQueue,
  OrderedMap,
  UnorderedMap,
  OrderedSet,
  UnorderedSet,
  OrderedMultiSet,
  OrderedMultiMap,
  addEdge,
  deleteEdge,
  createAdjacencyList,
  createWeightedAdjacencyList,
} from './collections/index.js';
export type { WeightedEdge, AdjacencyList, WeightedAdjacencyList } from './collections/index.js';
export {
  sort,
  find,
  findIndex,
  transform,
  filter,
  reduce,
  reverse,
  unique,
  binarySearch,
  lowerBound,
  upperBound,
  min,
  max,
  partition,
} from './algorithms/index.js';
export { clamp, range, noop, identity, swap } from './utils/index.js';
export type { Comparator, Predicate, UnaryFn, Reducer, IterableLike } from './types/index.js';
export { toArray } from './types/index.js';
