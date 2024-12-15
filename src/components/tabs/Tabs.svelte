<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Tab, OnTabSelectedFn } from 'src/types/types';
  import { getContext, onMount, type Snippet } from 'svelte';

  interface Props {
    tabs: Tab[];
    selectedTabId?: string | undefined;
    cssClass?: string;
    orientation?: 'horizontal' | 'vertical';
    onTabSelected?: (selectedTab: Tab) => void;
    tabEnd?: Snippet;
    sheet?: any;
  }

  let {
    tabs,
    selectedTabId = $bindable(undefined),
    cssClass = '',
    orientation = 'horizontal',
    onTabSelected,
    tabEnd,
    sheet,
  }: Props = $props();

  const onTabSelectedContextFn = getContext<OnTabSelectedFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
  );

  let nav: HTMLElement;

  function selectTab(tab: Tab) {
    if (sheet && !FoundryAdapter.onTabSelecting(sheet, tab.id)) {
      return;
    }
    selectedTabId = tab.id;
    onTabSelectedContextFn?.(tab.id);
    onTabSelected?.(tab);
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
  const currentTabId = getContext<string>(
    CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID,
  );

  let mounted = $state(false);
  onMount(() => {
    const initialTab = tabs.find((t) => t.id === currentTabId);
    if (initialTab) {
      selectTab(initialTab);
    }
    mounted = true;
  });

  $effect(() => {
    if (mounted && !tabs.some((tab) => tab.id === selectedTabId)) {
      selectTab(tabs[0]);
    }
  });
</script>

<nav
  class="tidy-tabs {cssClass}"
  class:vertical={orientation === 'vertical'}
  bind:this={nav}
>
  {#if tabs.length > 1}
    {#each tabs as tab, i (tab.id)}
      <a
        class={CONSTANTS.TAB_OPTION_CLASS}
        class:active={tab.id === selectedTabId}
        class:first-tab={i === 0}
        class:no-border-on-last-tab={!tabEnd && i === tabs.length - 1}
        data-tab-id={tab.id}
        role="tab"
        onclick={() => selectTab(tab)}
        onkeydown={(ev) => onKeyDown(ev, i)}
      >
        {localize(tab.title)}
      </a>
    {/each}
  {/if}
  {@render tabEnd?.()}
</nav>
