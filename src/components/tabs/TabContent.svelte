<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { CONSTANTS } from 'src/constants';
  import { getAllContexts, mount, onMount, setContext, unmount } from 'svelte';
  import { error } from 'src/utils/logging';
  import { tryGetSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ClassValue } from 'svelte/elements';
  import type { Ref } from 'src/features/reactivity/reactivity.types';

  interface Props {
    tab: Tab;
    active: boolean;
    cssClass?: ClassValue;
  }

  let { tab, active, cssClass = '' }: Props = $props();

  const context = $derived(tryGetSheetContext<unknown | undefined>());
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
      const svelteTabComponent = mount(tab.content.component, {
        target: tidyTab.value,
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
  class={['tidy-tab', tab.id, tab.content.cssClass, cssClass, { active }]}
  data-tab-contents-for={tab.id}
  role="tabpanel"
  data-tidy-sheet-part="tab-content"
  bind:this={tidyTab.value}
></div>
