<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Tab, OnTabSelectedFn } from 'src/types/types';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let tabs: Tab[];
  export let selectedTabId: string | undefined = undefined;
  export let cssClass: string = '';
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';

  const context = getContext<Readable<any> | undefined>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  const onTabSelected = getContext<OnTabSelectedFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
  );

  const dispatcher = createEventDispatcher<{ tabSelected: Tab }>();

  let nav: HTMLElement;

  function selectTab(tab: Tab) {
    const sheet = $context?.actor?.sheet ?? $context?.item?.sheet;
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
  const currentTabId = getContext<string>(
    CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID,
  );

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
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-interactive-supports-focus -->
      <a
        class={CONSTANTS.TAB_OPTION_CLASS}
        class:active={tab.id === selectedTabId}
        class:first-tab={i === 0}
        class:no-border-on-last-tab={!$$slots['tab-end'] &&
          i === tabs.length - 1}
        data-tab-id={tab.id}
        role="tab"
        on:click={() => selectTab(tab)}
        on:keydown={(ev) => onKeyDown(ev, i)}
      >
        {localize(tab.title)}
      </a>
    {/each}
  {/if}
  <slot name="tab-end" />
</nav>
