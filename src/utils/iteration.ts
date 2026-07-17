type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export function getKeyedObjectEntries(
  obj: { [s: string]: unknown } | ArrayLike<unknown>,
) {
  return Object.entries(obj) as Entries<typeof obj>;
}

export function checkCondition<T>(
  target: { condition?: (args: T) => boolean },
  args: T,
): boolean {
  return target.condition ? target.condition(args) : true;
}
