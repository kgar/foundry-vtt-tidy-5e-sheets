<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { declareLocation } from 'src/types/location-awareness';
  import { CONSTANTS } from 'src/constants';
  import { getContext, setContext } from 'svelte';

  export let tab: Tab;
  export let active: boolean;
  export let cssClass: string = '';

  const context = getContext('context');

  declareLocation('tab', tab.id);

  $: useCoreListenersClass = tab.activateDefaultSheetListeners
    ? CONSTANTS.CLASS_TIDY_USE_CORE_LISTENERS
    : '';

  let props: Record<string, any> = {};
  $: {
    if (tab.content.type === 'svelte' && tab.content.getContext) {
      const componentContext = tab.content.getContext(context);
      setContext('context', componentContext);
    }

    if (tab.content.type === 'svelte' && tab.content.getProps) {
      props = tab.content.getProps(context) ?? {};
    }
  }
</script>

<div
  class="tidy-tab {tab.id} {cssClass} {tab.content.cssClass ??
    ''} {useCoreListenersClass}"
  class:active
  data-tab-contents-for={tab.id}
>
  {#if tab.content.type === 'svelte'}
    <svelte:component this={tab.content.component} ...props />
  {/if}
</div>

<style lang="scss">
  .tidy-tab {
    height: 100%;
    flex-direction: column;
    display: none;

    &.active {
      display: flex;
    }
  }
</style>
