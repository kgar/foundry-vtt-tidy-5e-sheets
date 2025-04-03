<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import { isNil } from 'src/utils/data';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

  let itemNameEl: HTMLElement | undefined = $state();

  let showSubtype = $derived(!isNil(context.system.subType, ''));
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    <div>
      <h4>
        {localize('DND5E.CreatureType')}
        {#if context.unlocked}
          <a
            class="button-borderless button-icon-only"
            onclick={() =>
              FoundryAdapter.renderCreatureTypeConfig(context.item)}
          >
            <i class="fa-solid fa-cog"></i>
          </a>
        {/if}
      </h4>
      <ul class="pills stacked">
        <li>
          <span class="pill stacked">
            {#if showSubtype}
              <span>
                {context.system.subType}
              </span>
            {/if}
            <span class={{ ['text-normal']: showSubtype }}>
              {context.system.type.value}
            </span>
          </span>
        </li>
      </ul>
    </div>
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
    sheet={context.item.sheet}
    tabContext={{ context, item: context.item }}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
