export function firstOfSet<T>(set: Set<T>): T {
  return set.values().next().value;
}
