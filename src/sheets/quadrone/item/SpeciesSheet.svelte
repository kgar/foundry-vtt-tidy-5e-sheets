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
  import type { MovementInfo, SenseInfo } from 'src/types/item.types';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state('');

  $effect(() => {
    selectedTabId = context.currentTabId;
  });

  let itemNameEl: HTMLElement | undefined = $state();

  let showSubtype = $derived(!isNil(context.system.type.subtype, ''));

  let movementInfo = $derived.by(() => {
    let result: Partial<MovementInfo>[] = Object.values(
      FoundryAdapter.getMovementInfo(context.system.movement),
    );

    if (context.system.movement.hover) {
      result.push({
        value: localize('DND5E.MovementHover'),
      });
    }

    return result;
  });

  let sensesInfo = $derived.by(() => {
    let result: Partial<SenseInfo>[] = Object.values(
      FoundryAdapter.getSensesInfo(context.system.senses),
    );

    context.system.senses.special?.split(';').forEach((s: string) => {
      if (s.trim() !== '') {
        result.push({
          value: s.trim(),
        });
      }
    });

    return result;
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    <div>
      <h4 class="flex-row-space-between">
        {localize('DND5E.CreatureType')}
        {#if context.unlocked}
          <a
            class="button button-borderless button-icon-only"
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
                {context.system.type.subtype}
              </span>
            {/if}
            <span class={{ ['text-normal']: showSubtype }}>
              {CONFIG.DND5E.creatureTypes[context.system.type.value]?.label ??
                context.system.type.value}
            </span>
          </span>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="flex-row-space-between">
        {localize('DND5E.Movement')}
        {#if context.unlocked}
          <a
            class="button button-borderless button-icon-only"
            onclick={() =>
              FoundryAdapter.renderMovementSensesConfig(
                context.item,
                'movement',
              )}
          >
            <i class="fa-solid fa-cog"></i>
          </a>
        {/if}
      </h4>
      <ul class="pills stacked">
        {#each movementInfo as info}
          <li>
            <span class="pill centered wrapped">
              {#if info.label}
                <span class="text-normal">
                  {info.label}
                </span>
              {/if}
              {#if info.value}
                <span class="hyphens-auto">
                  {info.value}
                </span>
              {/if}
              {#if info.unit}
                <span class="text-normal">
                  {info.unit}
                </span>
              {/if}
            </span>
          </li>
        {:else}
          <li>
            <span class="pill">
              <span class="text-normal">
                {localize('DND5E.None')}
              </span>
            </span>
          </li>
        {/each}
      </ul>
    </div>
    <div>
      <h4 class="flex-row-space-between">
        {localize('DND5E.Senses')}
        {#if context.unlocked}
          <a
            class="button button-borderless button-icon-only"
            onclick={() =>
              FoundryAdapter.renderMovementSensesConfig(context.item, 'senses')}
          >
            <i class="fa-solid fa-cog"></i>
          </a>
        {/if}
      </h4>
      <ul class="pills stacked">
        {#each sensesInfo as info}
          <li>
            <span class="pill centered wrapped">
              {#if info.label}
                <span class="text-normal">
                  {info.label}
                </span>
              {/if}
              {#if info.value}
                <span class="hyphens-auto">
                  {info.value}
                </span>
              {/if}
              {#if info.unit}
                <span class="text-normal">
                  {info.unit}
                </span>
              {/if}
            </span>
          </li>
        {:else}
          <li>
            <span class="pill">
              <span class="text-normal">
                {localize('DND5E.None')}
              </span>
            </span>
          </li>
        {/each}
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
