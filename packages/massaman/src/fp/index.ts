/**
 * Data-last, pipeable operators re-exported from `es-toolkit/fp`.
 *
 * Every function here takes its configuration first and returns a unary function
 * awaiting the data, so operators compose without a lambda at each step:
 *
 * ```ts
 * import { filter, map, pipe, take } from 'massaman/fp'
 *
 * pipe(
 *   users,
 *   filter((u) => u.active),
 *   map((u) => u.name),
 *   take(10)
 * )
 * ```
 *
 * `pipe` fuses adjacent lazy-capable operators (`map`, `filter`, `take`, ...) into a
 * single element-by-element walk, so a trailing `take(n)` terminates early instead of
 * materializing an intermediate array at every step.
 *
 * This barrel is deliberately NOT flattened into `massaman`. Many names here
 * (`chunk`, `pick`, `omit`, `at`, ...) collide with their data-first counterparts on
 * the root export, and `flow` here is the `pipe`-based lazy composition rather than
 * the eager, `this`-preserving `flow` from `massaman/function`. Pick a namespace per
 * module and stay in it — mixing both pulls two implementations into the bundle.
 */
export {
  add,
  at,
  cartesianProduct,
  chunk,
  chunkBy,
  combinations,
  compact,
  countBy,
  difference,
  differenceBy,
  differenceWith,
  drop,
  dropRight,
  dropRightWhile,
  dropWhile,
  filter,
  find,
  findIndex,
  findLast,
  findLastIndex,
  flatMap,
  flatMapDeep,
  flatten,
  flattenDeep,
  flow,
  forEach,
  groupBy,
  head,
  initial,
  intersection,
  intersectionBy,
  intersectionWith,
  isSubset,
  isSubsetWith,
  join,
  keyBy,
  last,
  length,
  map,
  maxBy,
  minBy,
  multiply,
  omit,
  orderBy,
  partition,
  pick,
  pipe,
  reverse,
  sample,
  sampleSize,
  shuffle,
  sortBy,
  tail,
  take,
  takeRight,
  takeRightWhile,
  takeWhile,
  toFilled,
  union,
  unionBy,
  unionWith,
  uniq,
  uniqBy,
  uniqWith,
  unzip,
  unzipWith,
  windowed,
  without,
  xor,
  xorBy,
  xorWith,
  zip,
  zipObject,
  zipWith,
} from 'es-toolkit/fp'

export type { WindowedOptions } from 'es-toolkit/fp'
