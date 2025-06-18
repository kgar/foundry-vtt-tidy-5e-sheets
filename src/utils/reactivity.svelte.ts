export function watch<T>(
  getter: () => T | undefined,
  effectCallback: (newValue: T | undefined) => void
) {
  let previous: T | undefined = undefined;

  $effect(() => {
    const current = getter();
    const cleanup = effectCallback(previous);
    previous = current;

    return cleanup;
  });
}
