type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export function KeyedObjectEntries(
  obj: { [s: string]: unknown } | ArrayLike<unknown>
) {
  return Object.entries(obj) as Entries<typeof obj>;
}
