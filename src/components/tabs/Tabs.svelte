<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Tab } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let tabs: Tab[];
  export let selectedTabId: string | undefined = undefined;
  export let cssClass: string = '';
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';

  const dispatcher = createEventDispatcher<{ tabSelected: Tab }>();

  function selectTab(tab: Tab) {
    selectedTabId = tab.id;
    dispatcher('tabSelected', tab);
  }

  const localize = FoundryAdapter.localize;
</script>

<nav class="tabs {cssClass}" class:vertical={orientation === 'vertical'}>
  {#if tabs.length > 1}
    {#each tabs as tab, i (tab.id)}
      <a
        class={CONSTANTS.TAB_OPTION_CLASS}
        class:active={tab.id === selectedTabId}
        class:first-tab={i === 0}
        class:no-border-on-last-tab={!$$slots['tab-end'] &&
          i === tabs.length - 1}
        data-tab-id={tab.id}
        on:click={() => selectTab(tab)}>{localize(tab.displayName)}</a
      >
    {/each}
  {/if}
  <slot name="tab-end" />
</nav>

<style lang="scss">
  .tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;

    .tab-option {
      background: var(--t5ek-header-background);
      border: 0.0625rem solid transparent;
      border-bottom: 0.0625rem solid var(--t5ek-header-border-color);
      font-size: 0.8125rem;
      text-align: left;

      flex: 1 1 auto;

      &:hover {
        color: var(--t5ek-primary-accent-color);
      }

      &.active {
        background: transparent;
        border: 0.0625rem solid var(--t5ek-light-color);
        border-bottom-color: transparent;
        font-weight: 700;
        cursor: default;
        text-shadow: none;

        &:hover {
          color: inherit;
        }
      }

      text-shadow: none;
    }

    &:not(.vertical) {
      .tab-option {
        height: 1.625rem;
        padding: 0.3125rem 0.5rem 0 0.5rem;

        &.first-tab.active {
          border-left-color: transparent;
        }

        &.no-border-on-last-tab.active {
          border-right-color: transparent;
        }

        &:first-child {
          padding-left: 1rem;
        }
      }
    }

    &.vertical {
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;

      > * {
        flex: 0;
        padding: 0.5rem;
      }

      .tab-option {
        border: 0.0625rem solid transparent;
        border-right: 0.0625rem solid var(--t5ek-header-border-color);
        transition: border-left-width 0.125s;

        &.first-tab.active {
          border-top-color: transparent;
        }

        &.active {
          border: 0.0625rem solid var(--t5ek-light-color);
          border-right-color: transparent;
          border-left-width: 0.25rem;
          border-left-color: var(--t5ek-primary-accent-color);
        }
      }
    }
  }
</style>
