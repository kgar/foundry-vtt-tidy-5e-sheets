<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { declareLocation } from 'src/types/location-awareness';
  import { CONSTANTS } from 'src/constants';

  export let tab: Tab;
  export let active: boolean;
  export let cssClass: string = '';

  declareLocation('tab', tab.id);

  $: useCoreListenersClass =
    tab.content.type === 'html' && tab.content.renderScheme === 'handlebars'
      ? CONSTANTS.CLASS_TIDY_USE_CORE_LISTENERS
      : '';
</script>

<div
  class="tidy-tab {tab.id} {cssClass} {tab.content.cssClass ??
    ''} {useCoreListenersClass}"
  class:active
  data-tab-contents-for={tab.id}
>
  {#if tab.content.type === 'svelte'}
    <svelte:component this={tab.content.component} {...tab.content.props} />
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
