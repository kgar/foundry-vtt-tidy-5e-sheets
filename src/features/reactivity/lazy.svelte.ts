/**
 * A manually invalidatable wrapper that can be used to provide derived support,
 * enabling callers to arbitrarily trigger the cached/derived value to expire.
 * The most common use case in Tidy is to invalidate generated CONFIG data so that
 * it refreshes after an event occurs in Foundry land.
 * @param getter  a function that gets the derived value.  
 * @returns
 */
export function lazy<T>(getter: () => T) {
  let cached: T | undefined;
  let valid = false;
  let version = $state(0);

  return {
    /** The computed value. Enables svelte reactivity. */
    get value() {
      version; // subscribe the caller to invalidations
      if (!valid) {
        cached = getter();
        valid = true;
      }
      return cached as T;
    },
    /** Enures the value is recomputed on next get. Also ensures svelte reactivity. */
    invalidate() {
      valid = false;
      version++;
    },
  };
}
