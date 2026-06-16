import { getContext, setContext, mount, unmount } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
export const TidySvelteApi = {
  /**
   * Svelte resources which are directly tied to Tidy's svelte version / runtime.
   * @deprecated potentially?
   */
  framework: {
    /**
     * For svelte + svelte Tidy integration.
     * The svelte `getContext` function. Use this function in the context
     * of a svelte component in order to access Tidy's svelte cache of context data.
     * Without using this function, any of Tidy's context data set via `setContext` in its component
     * hierarchy is not available to an integrating svelte application.
     */
    getContext,
    /**
     * For svelte + svelte Tidy integration.
     * The svelte `mount` function. Included for completeness sake,
     * as a proper use case has not yet been determined.
     */
    mount,
    /**
     * For svelte + svelte Tidy integration.
     * The svelte `setContext` function. Included for completeness sake,
     * as a proper use case has not yet been determined.
     */
    setContext,
    /**
     * For svelte + svelte Tidy integration.
     * The svelte `unmount` function. Included for completeness sake,
     * as a proper use case has not yet been determined.
     */
    unmount,
    /**
     * For svelte + svelte Tidy integration.
     * The svelte `SvelteMap` class. Included for completeness sake,
     * as a proper use case has not yet been determined.
     */
    SvelteMap,
    /**
     * For svelte + svelte Tidy integration.
     * The svelte `SvelteSet` class. Included for completeness sake,
     * as a proper use case has not yet been determined.
     */
    SvelteSet,
  },
};
