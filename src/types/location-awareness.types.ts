import { CONSTANTS } from 'src/constants';
import { getContext, setContext } from 'svelte';

/**
 * Appends current location to the location context.
 * **Important**: Only use this during svelte component initialization. Treat it exactly like calling `getContext` and `setContext`.
 * @param segments strings of text to provide context for the current location
 * @returns void
 */
export function declareLocation(...segments: string[]) {
  if (segments.length === 0) {
    return;
  }
  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION) ?? '';
  setContext(
    CONSTANTS.SVELTE_CONTEXT.LOCATION,
    [location, ...segments].join('/')
  );
}
