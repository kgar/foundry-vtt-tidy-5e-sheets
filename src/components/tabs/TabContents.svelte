<script lang="ts">
  import type { Tab } from 'src/types/types';

  export let tabs: Tab[];
  export let selectedTabId: string;
  export let cssClass: string = '';
</script>

{#each tabs as tab (tab.id)}
  <section
    class="tab {tab.id} {cssClass} {tab.content.cssClass ?? ''}"
    class:active={selectedTabId === tab.id}
  >
    <svelte:component this={tab.content.component} {...tab.content.props} />
  </section>
{/each}

<style lang="scss">
  .tab {
    height: 100%;
    flex-direction: column;
    scrollbar-width: thin;
    scrollbar-color: #782e22 #0000;
    display: none;

    &.active {
      display: flex;
    }
  }
</style>
