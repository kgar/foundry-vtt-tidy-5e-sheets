export function checkCondition<T>(
  target: { condition?: (args: T) => boolean },
  args: T,
): boolean {
  return target.condition ? target.condition(args) : true;
}
