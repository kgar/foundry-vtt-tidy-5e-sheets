<script lang="ts">
  import type { Tab } from 'src/types/types';
  import RerenderAfterFormSubmission from '../utility/RerenderAfterFormSubmission.svelte';
  import { getContext, setContext } from 'svelte';

  export let tab: Tab;
  export let active: boolean;
  export let cssClass: string = '';

  const location = getContext('location');
  setContext('location', `${location}/tab/${tab.id}`);

  function onTabRender(node: HTMLElement, tab: Tab) {
    if ('render' in tab.content) {
      tab.content.render?.(node);
    }
  }
</script>

<section
  use:onTabRender={tab}
  class="tab {tab.id} {cssClass} {tab.content.cssClass ?? ''}"
  class:active
  data-tab-contents-for={tab.id}
>
  {#if 'component' in tab.content}
    <svelte:component this={tab.content.component} {...tab.content.props} />
  {/if}
  {#if 'html' in tab.content}
    {#if tab.content.rerenderOnSubmit}
      <RerenderAfterFormSubmission>
        {@html tab.content.html}
      </RerenderAfterFormSubmission>
    {:else}
      {@html tab.content.html}
    {/if}
  {/if}
</section>

<style lang="scss">
  .tab {
    height: 100%;
    flex-direction: column;
    display: none;

    &.active {
      display: flex;
    }
  }
</style>
