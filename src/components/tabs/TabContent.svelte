<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { CONSTANTS } from 'src/constants';
  import { getAllContexts, mount, onMount, setContext, unmount } from 'svelte';
  import { error } from 'src/utils/logging';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ClassValue } from 'svelte/elements';

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

  let useCoreListenersClass = $derived(
    tab.activateDefaultSheetListeners
      ? CONSTANTS.CLASS_TIDY_USE_CORE_LISTENERS
      : '',
  );

  let tidyTab: HTMLElement;

  onMount(() => {
    if (tab.content.type !== 'svelte') {
      return;
    }

    try {
      const props = tab.content.getProps?.(context) ?? {};
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
  class={[
    'tidy-tab',
    tab.id,
    tab.content.cssClass,
    useCoreListenersClass,
    cssClass,
    { active },
  ]}
  data-tab-contents-for={tab.id}
  role="tabpanel"
  bind:this={tidyTab}
></div>
