<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { declareLocation } from 'src/types/location-awareness';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let tab: Tab;
  export let active: boolean;
  export let cssClass: string = '';

  declareLocation('tab', tab.id);

  let renderKey = getContext<Readable<string>>('renderKey');

  let htmlRenderKey: string = 'static';
  $: {
    if (
      tab.content.type === 'html' &&
      tab.content.renderScheme === 'handlebars'
    ) {
      htmlRenderKey = $renderKey;
    }
  }
</script>

{#if 'component' in tab.content}
  <div
    class="tidy-tab {tab.id} {cssClass} {tab.content.cssClass ?? ''}"
    class:active
    data-tab-contents-for={tab.id}
  >
    <svelte:component this={tab.content.component} {...tab.content.props} />
  </div>
{:else if 'html' in tab.content}
  {#key htmlRenderKey}
    <div
      class="tidy-tab {tab.id} {cssClass} {tab.content.cssClass ??
        ''} scroll-container"
      class:active
      data-tab-contents-for={tab.id}
    >
      {@html tab.content.html}
    </div>
  {/key}
{/if}

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
