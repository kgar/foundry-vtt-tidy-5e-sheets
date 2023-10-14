<script lang="ts">
  import type { Tab } from 'src/types/types';
  import RerenderAfterFormSubmission from '../shared/RerenderAfterFormSubmission.svelte';

  export let tabs: Tab[];
  export let selectedTabId: string;
  export let cssClass: string = '';

  function onTabRender(node: HTMLElement, tab: Tab) {
    if ('render' in tab.content) {
      tab.content.render(node);
    }
  }
</script>

{#each tabs as tab (tab.id)}
  <section
    use:onTabRender={tab}
    class="tab {tab.id} {cssClass} {tab.content.cssClass ?? ''}"
    class:active={selectedTabId === tab.id}
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
{/each}

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
