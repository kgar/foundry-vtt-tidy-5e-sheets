<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { CONSTANTS } from 'src/constants';
  import { getAllContexts, mount, onMount, setContext, unmount } from 'svelte';
  import { error } from 'src/utils/logging';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ClassValue } from 'svelte/elements';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { readonly, writable, type Readable } from 'svelte/store';

  interface Props {
    tab: Tab;
    active: boolean;
    cssClass?: ClassValue;
  }

  let { tab, active, cssClass = '' }: Props = $props();

  const context = $derived(getSheetContext());
  const allContexts = getAllContexts();

  declareLocation('tab', tab.id);
  setContext(CONSTANTS.SVELTE_CONTEXT.TAB_ID, tab.id);

  let tidyTab = $state<Ref<HTMLElement | undefined>>({ value: undefined });

  setContext(CONSTANTS.SVELTE_CONTEXT.TAB_CONTENT_ELEMENT_REF, tidyTab);

  onMount(() => {
    if (tab.content.type !== 'svelte' || !tidyTab?.value) {
      return;
    }

    try {
      const props = tab.content.getProps?.(context) ?? {};
      const tabComponentContext =
        tab.content.getContext?.(allContexts) ?? allContexts;

      const component =
        typeof tab.content.component === 'function'
          ? tab.content.component
          : tab.content.component.component;
      // We allow the user to provide their own mount function from their own svelte runtime
      const { mount: _mount, unmount: _unmount } =
        'mount' in tab.content.component
          ? tab.content.component
          : { mount, unmount };

      const isExternalMount = mount !== _mount;
      // Both need to be external or internal, else we got problems
      const isValidMountPair = isExternalMount === (unmount !== _unmount);

      if (!isValidMountPair)
        throw new Error('Both mount and unmount must be provided if one is');

      let svelteTabComponent: {};
      if (!isExternalMount) {
        svelteTabComponent = _mount(component, {
          target: tidyTab.value,
          context: tabComponentContext,
          props: props,
        });
      } else {
        // If we're using their mount, we need to do change how we handle the context so that they can hook into our reactivity
        const safeTabComponentContext = new Map(
          tabComponentContext.entries().map(([key, val]) => {
            // stores are framework agnostic, which is what we need for cross runtime interactivity
            const store = writable(val);
            // This is where the magic happens, causes all subscribers to be triggered
            $effect(() => {
              store.set(val);
            });
            // We technically want this to only be readable from outside so we'll create a pseudo readable
            const readonlyStore = {
              // don't forget to like and
              subscribe(
                this: void,
                ...args: Parameters<Readable<unknown>['subscribe']>
              ) {
                return store.subscribe(...args);
              },
            } satisfies Readable<unknown>;
            return [key, readonlyStore];
          }),
        );
        svelteTabComponent = _mount(component, {
          target: tidyTab.value,
          context: safeTabComponentContext,
          props: props,
        });
      }

      return () => {
        _unmount(svelteTabComponent);
      };
    } catch (e) {
      error('Failed to render svelte tab', false, e);
    }
  });
</script>

<div
  class={['tidy-tab', tab.id, tab.content.cssClass, cssClass, { active }]}
  data-tab-contents-for={tab.id}
  role="tabpanel"
  data-tidy-sheet-part="tab-content"
  bind:this={tidyTab.value}
></div>
