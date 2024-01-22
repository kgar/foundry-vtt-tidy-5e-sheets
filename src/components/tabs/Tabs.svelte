<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
    import { settingStore } from 'src/settings/settings';
  import type { Tab, OnTabSelectedFn } from 'src/types/types';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let tabs: Tab[];
  export let selectedTabId: string | undefined = undefined;
  export let cssClass: string = '';
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';

  const context = getContext<Readable<any> | undefined>('context');
  const onTabSelected = getContext<OnTabSelectedFn>('onTabSelected');

  const dispatcher = createEventDispatcher<{ tabSelected: Tab }>();

  let nav: HTMLElement;

  function selectTab(tab: Tab) {
    const sheet = $context.actor?.sheet ?? $context.item?.sheet;
    if (sheet && !FoundryAdapter.onTabSelecting(sheet, tab.id)) {
      return;
    }
    selectedTabId = tab.id;
    dispatcher('tabSelected', tab);
    onTabSelected?.(tab.id);
  }

  function onKeyDown(ev: KeyboardEvent, i: number) {
    switch (ev.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        const nextTab = tabs[(i + 1) % tabs.length];
        selectTab(nextTab);
        setTimeout(() => {
          nav
            .querySelector<HTMLElement>(`[data-tab-id='${nextTab.id}']`)
            ?.focus();
        });
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        const previousTab = tabs.at(i - 1);
        if (previousTab) {
          selectTab(previousTab);
          setTimeout(() => {
            nav
              .querySelector<HTMLElement>(`[data-tab-id='${previousTab.id}']`)
              ?.focus();
          });
        }
        break;
    }
  }

  const localize = FoundryAdapter.localize;
  const currentTabId = getContext<string>('currentTabId');

  let mounted = false;
  onMount(() => {
    const initialTab = tabs.find((t) => t.id === currentTabId);
    if (initialTab) {
      selectTab(initialTab);
    }
    mounted = true;
  });

  $: {
    if (mounted && !tabs.some((tab) => tab.id === selectedTabId)) {
      selectTab(tabs[0]);
    }
  }
</script>

<nav
  class="tidy-tabs {cssClass}"
  class:vertical={orientation === 'vertical'}
  bind:this={nav}
>
  {#if tabs.length > 1}
    {#each tabs as tab, i (tab.id)}
      <button
        type="button"
        class="{CONSTANTS.TAB_OPTION_CLASS} inline-transparent-button"
        class:active={tab.id === selectedTabId}
        class:first-tab={i === 0}
        class:no-border-on-last-tab={!$$slots['tab-end'] &&
          i === tabs.length - 1}
        data-tab-id={tab.id}
        role="tab"
        on:click={() => selectTab(tab)}
        on:keydown={(ev) => onKeyDown(ev, i)}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >
        {localize(tab.title)}
      </button>
    {/each}
  {/if}
  <slot name="tab-end" />
</nav>

<style lang="scss">
  .tidy-tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    background: var(--t5ek-tabs-background);

    .tab-option {
      background: var(--t5ek-tab-background);
      font-size: 0.8125rem;
      text-align: left;
      flex: 1 1 auto;
      border-top-left-radius: 0.1875rem;
      border-top-right-radius: 0.1875rem;

      &:hover {
        background: var(--t5ek-tab-background);
        color: var(--t5ek-primary-accent-color);
      }

      &.active {
        background: var(--t5ek-active-tab-background);
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
        border-bottom: 0.0625rem solid var(--t5ek-tab-strip-border-color);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        &.first-tab.active {
          border-left-color: transparent;
          border-top-left-radius: 0;
        }

        &.no-border-on-last-tab.active {
          border-right-color: transparent;
          border-top-right-radius: 0;
        }

        &:first-child {
          padding-left: 1rem;
        }

        &.active {
          border: 0.0625rem solid var(--t5ek-tab-strip-border-color);
          border-bottom-color: transparent;
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
        border-top: none;
        border-left: none;
        border-bottom: none;
        border-right: 0.0625rem solid var(--t5ek-tab-strip-border-color);
        transition: border-left-width 0.125s;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        &.first-tab.active {
          border-top-color: transparent;
        }

        &.active {
          border: 0.0625rem solid var(--t5ek-tab-strip-border-color);
          border-right-color: transparent;
          border-left-width: 0.25rem;
          border-left-color: var(--t5ek-primary-accent-color);
          border-top-left-radius: 0.3125rem;
          border-bottom-left-radius: 0.3125rem;
        }
      }
    }
  }
</style>
