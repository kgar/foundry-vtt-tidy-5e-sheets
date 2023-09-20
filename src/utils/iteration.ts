type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export function getKeyedObjectEntries(
  obj: { [s: string]: unknown } | ArrayLike<unknown>
) {
  return Object.entries(obj) as Entries<typeof obj>;
}
