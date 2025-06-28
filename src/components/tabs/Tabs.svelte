<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import type { Tab, OnTabSelectedFn } from 'src/types/types';
  import { error } from 'src/utils/logging';
  import { getContext, onMount, type Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { SvelteSet } from 'svelte/reactivity';

  export type TabStripInfo = Pick<
    Tab,
    'id' | 'title' | 'iconClass' | 'itemCount'
  >;

  interface Props {
    tabs: TabStripInfo[];
    selectedTabId?: string | undefined;
    extraTabs?: SvelteSet<string>;
    cssClass?: ClassValue;
    tabCssClass?: ClassValue;
    orientation?: 'horizontal' | 'vertical';
    onTabSelected?: (selectedTab: TabStripInfo) => void;
    tabEnd?: Snippet;
    sheet?: any;
    tabContext?: Record<string, any>;
  }

  let {
    tabs,
    selectedTabId = $bindable(),
    extraTabs,
    cssClass,
    tabCssClass,
    orientation = 'horizontal',
    onTabSelected,
    tabEnd,
    sheet,
    tabContext = {},
  }: Props = $props();

  const onTabSelectedContextFn = getContext<OnTabSelectedFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
  );

  let nav: HTMLElement;

  function onTabClicked(
    event: MouseEvent & { currentTarget: HTMLElement },
    tab: TabStripInfo,
  ) {
    if (settings.value.truesight) {
      if (extraTabs && event.ctrlKey && selectedTabId !== tab.id) {
        extraTabs.add(tab.id);
        return;
      }
    }

    selectTab(tab);
  }

  function selectTab(tab: TabStripInfo) {
    if (
      !tab ||
      (sheet?.element && !FoundryAdapter.onTabSelecting(sheet, tab.id))
    ) {
      return;
    }

    extraTabs?.clear();

    selectedTabId = tab.id;
    onTabSelectedContextFn?.(tab.id);
    onTabSelected?.(tab);
  }

  function onKeyDown(ev: KeyboardEvent, i: number) {
    switch (ev.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        ev.preventDefault();
        const nextTab = tabs[(i + 1) % tabs.length];
        selectTab(nextTab);
        setTimeout(() => {
          nav
            .querySelector<HTMLElement>(`[data-tab-id='${nextTab.id}']`)
            ?.focus();
        });
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        ev.preventDefault();
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
  }

  const localize = FoundryAdapter.localize;

  $effect(() => {
    if (!tabs.some((tab) => tab.id === selectedTabId)) {
      selectTab(tabs[0]);
    }
  });

  let itemCountContext = $derived({ ...tabContext, document: sheet.document });
</script>

<div
  role="tablist"
  class={['tidy-tabs', cssClass, { vertical: orientation === 'vertical' }]}
  bind:this={nav}
>
  {#if tabs.length > 1}
    {#each tabs as tab, i (tab.id)}
      {@const title = localize(tab.title)}
      <svelte:boundary
        onerror={(e) => {
          error('An error occurred while rendering a tab', false, {
            tab,
            error: e,
          });
        }}
      >
        {@const tabIsSelected =
          tab.id === selectedTabId || extraTabs?.has(tab.id)}
        {@const tabindex = tabIsSelected ? 0 : -1}
        {@const itemCount = tab.itemCount?.(itemCountContext) ?? 0}
        <a
          class={[
            CONSTANTS.TAB_OPTION_CLASS,
            {
              active: tabIsSelected,
              ['first-tab']: i === 0,
              ['no-border-on-last-tab']: !tabEnd && i === tabs.length - 1,
            },
            tabCssClass,
          ]}
          data-tab-id={tab.id}
          role="tab"
          aria-selected={tabIsSelected}
          onclick={(ev) => onTabClicked(ev, tab)}
          onkeydown={(ev) => onKeyDown(ev, i)}
          {tabindex}
          {title}
        >
          {#if tab.iconClass}
            <i class={['tab-icon', tab.iconClass]}></i>
          {/if}

          <span class="tab-title">{title}</span>

          {#if itemCount > 0}
            <span class="tab-title-count">{itemCount}</span>
          {/if}
        </a>
      </svelte:boundary>
    {/each}
  {/if}
  {@render tabEnd?.()}
</div>
