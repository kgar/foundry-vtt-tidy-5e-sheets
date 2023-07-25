<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let tabs: Tab[];
  export let selectedTabId: string | undefined = undefined;
  export let cssClass: string = '';

  const dispatcher = createEventDispatcher<{ tabSelected: Tab }>();

  function selectTab(tab: Tab) {
    selectedTabId = tab.id;
    dispatcher('tabSelected', tab);
  }
</script>

<nav class="tabs {cssClass}">
  {#each tabs as tab (tab.id)}
    <a
      class="item"
      class:active={tab.id === selectedTabId}
      on:click={() => selectTab(tab)}>{tab.displayName}</a
    >
  {/each}
  <slot name="tab-end" />
</nav>

<style lang="scss">
  .tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;

    .item {
      padding: 0.3125rem 0.5rem 0 0.5rem;
      background: var(--t5e-header-background);
      border: 0.0625rem solid transparent;
      border-bottom: 0.0625rem solid var(--t5e-header-border);
      font-size: 0.8125rem;
      text-align: left;
      height: 1.625rem;
      flex: 1 1 auto;

      &:first-child {
        padding-left: 1rem;
      }

      &:hover {
        color: var(--t5e-primary-accent);
      }
    }

    .item.active {
      background: transparent;
      border: 0.0625rem solid var(--t5e-light-color);
      border-bottom-color: transparent;
      font-weight: 700;
      cursor: default;
      text-shadow: none;

      &:hover {
        color: inherit;
      }
    }

    .item:first-child.active {
      border-left-color: transparent;
    }
  }
</style>
