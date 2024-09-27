export function firstOfSet<T>(set: Set<T>): T | undefined {
  return set.values().next().value;
}
