<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { CONSTANTS } from 'src/constants';
  import {
    getAllContexts,
    getContext,
    mount,
    onMount,
    setContext,
    unmount,
  } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { error } from 'src/utils/logging';

  export let tab: Tab;
  export let active: boolean;
  export let cssClass: string = '';

  const context = getContext<Readable<any>>(CONSTANTS.SVELTE_CONTEXT.CONTEXT);
  const allContexts = getAllContexts();

  declareLocation('tab', tab.id);
  setContext(CONSTANTS.SVELTE_CONTEXT.TAB_ID, tab.id);

  $: useCoreListenersClass = tab.activateDefaultSheetListeners
    ? CONSTANTS.CLASS_TIDY_USE_CORE_LISTENERS
    : '';

  let tidyTab: HTMLElement;

  onMount(() => {
    if (tab.content.type !== 'svelte') {
      return;
    }

    try {
      const props = tab.content.getProps?.($context) ?? {};
      const tabComponentContext =
        tab.content.getContext?.(allContexts) ?? allContexts;
      const svelteTabComponent = mount(tab.content.component, {
        target: tidyTab,
        context: tabComponentContext,
        props: props,
      });

      return () => {
        unmount(svelteTabComponent);
      };
    } catch (e) {
      error('Failed to render svelte tab', false, e);
    }
  });
</script>

<div
  class="tidy-tab {tab.id} {cssClass} {tab.content.cssClass ??
    ''} {useCoreListenersClass}"
  class:active
  data-tab-contents-for={tab.id}
  bind:this={tidyTab}
></div>
