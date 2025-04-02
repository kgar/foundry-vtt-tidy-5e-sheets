<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemName from './parts/header/ItemName.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

  let itemNameEl: HTMLElement | undefined = $state();

  let subtitle = $derived.by(() => {
    if (!context.item.parent) {
      return undefined;
    }

    let result: string[] = [
      localize('DND5E.LevelCount', {
        ordinal: context.item.system.levels.ordinalString(),
      }),
    ];

    if (context.item.isOriginalClass) {
      result.push(localize('DND5E.ClassOriginal'));
    }

    return result.join(', ');
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar />

<main class="item-content">
  <div class="sheet-header">
    <div class="identity-info">
      <div
        bind:this={itemNameEl}
        class="item-name-wrapper flex-row extra-small-gap align-items-center"
      >
        <ItemName />
      </div>
      {#if subtitle}
        <div class="subtitle">{subtitle}</div>
      {/if}
    </div>
    {#if !context.unlocked}
      <div class="common-fields">
        <div
          class="level-badge badge theme-dark"
          aria-label={localize('DND5E.LevelNumber', {
            level: context.system.levels,
          })}
        >
          {context.system.levels}
        </div>
      </div>
    {/if}
  </div>

  <!-- Tab Strip -->
  <Tabs
    bind:selectedTabId
    tabs={context.tabs}
    cssClass="item-tabs"
    sheet={context.item.sheet}
    tabContext={{ context, item: context.item }}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
