<script lang="ts">
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import { derived } from 'svelte/store';
  import { getModifierData } from 'src/utils/formatting';
  import type { RenownProperty } from 'src/types/item.types';

  const context = $derived(getItemSheetContextQuadrone());

  let selectedTabId: string = $derived(context.currentTabId);
  let itemNameEl: HTMLElement | undefined = $state();

  const factionPills = $derived<RenownProperty[]>(
    context.properties.active.filter(
      (p) => typeof p === 'object' && p.type === 'renown',
    ) as RenownProperty[],
  );
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    {#if factionPills.length}
      <ul class="pills stacked">
        {#each factionPills as pill}
          {const mod = $derived(getModifierData(pill.value))}
          <!-- TODO: Extract somewhere central. -->
          {const faction = $derived(
            dnd5e.registry.renown.get(pill.faction)?.name ?? pill.faction,
          )}
          <li class="pill centered">
            <span class="modifier">
              <span class="sign font-label-medium color-text-lighter">
                {mod.sign}
              </span>
              <span class="value font-data-medium color-text-default">
                {mod.value}
              </span>
            </span>
            <span class="text-normal">
              {faction}
            </span>
          </li>
        {/each}
      </ul>
    {/if}
  {/snippet}
</Sidebar>

<main class="item-content">
  <div class="sheet-header">
    <div class="identity-info">
      <div
        bind:this={itemNameEl}
        class="item-name-wrapper flex-row extra-small-gap align-items-center"
      >
        <ItemName />
      </div>
    </div>
  </div>

  <!-- Tab Strip -->
  <Tabs
    bind:selectedTabId
    tabs={context.tabs}
    cssClass="item-tabs"
    sheet={context.sheet}
    tabContext={{ context, item: context.item }}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
