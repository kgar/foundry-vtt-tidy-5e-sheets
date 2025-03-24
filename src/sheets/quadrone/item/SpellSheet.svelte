<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import SpellBlock from './parts/SpellBlock.svelte';
  import { isNil } from 'src/utils/data';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import ItemLinkedItemSummary from './parts/header/ItemLinkedItemSummary.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import type { Snippet } from 'svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

  let itemNameEl: HTMLElement | undefined = $state();

  let subtitle = $derived(
    [context.labels.level, context.labels.school]
      .filter((x) => !isNil(x))
      .join(', '),
  );

  let icon = $derived(context.config.spellSchools[context.system.school]);

  let linkedItem = $derived(context.item.system.linkedActivity?.item);

  let properties: Snippet[] = $derived.by(() => {
    let result: Snippet[] = [];

    if (linkedItem) {
      result.push(linkedItemPill);
    } else if (context.item.actor) {
      result.push(sourceClassPill);
    }

    return result;
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    <div>
      <h4>
        {localize('TYPES.Item.spell')}
      </h4>
      <SpellBlock fullWidth={false} {context} />
    </div>
  {/snippet}

  {#snippet aboveCustomSections()}
    {#if properties.length}
      <div>
        <h4>
          {localize('DND5E.Properties')}
        </h4>
        <ul class="pills stacked">
          {#each properties as property}
            {@render property()}
          {/each}
        </ul>
      </div>
    {/if}
  {/snippet}
</Sidebar>

{#snippet linkedItemPill()}
  <li class="pill">
    <span class="centered text-normal">
      {localize('DOCUMENT.Item')}
    </span>
    <span class="hyphens-auto centered"> {linkedItem.name} </span>
  </li>
{/snippet}

{#snippet sourceClassPill()}
  <li class="pill">
    <span class="centered text-normal">
      {localize('TYPES.Item.class')}
    </span>
    <span class="hyphens-auto centered">
      {context.item.actor?.classes?.[context.item.system.sourceClass]?.name}
    </span>
  </li>
{/snippet}

<main class="item-content">
  <div class="sheet-header">
    <div class="identity-info">
      <div
        bind:this={itemNameEl}
        class="item-name-wrapper flex-row extra-small-gap align-items-center"
      >
        <ItemName />
      </div>
      <!-- Header Summary -->
      <div class="subtitle">{subtitle}</div>
    </div>
    {#if !context.unlocked}
      <div class="common-fields">
        <div class="school" aria-label={context.labels.school}>
          <Dnd5eIcon src={icon.icon} />
        </div>
      </div>
    {/if}

    <!-- TODO: Consider a better way to do this, without needing to check every field. -->
    {#if context.item.hasLimitedUses || context.item.hasRecharge || context.system.linkedActivity?.item}
      <div class="item-header-summary">
        {#if context.item.hasLimitedUses}
          <ItemChargesSummary />
        {/if}

        {#if context.item.hasRecharge}
          <ItemRechargeSummary />
        {/if}

        {#if context.system.linkedActivity?.item}
          <ItemLinkedItemSummary linked={context.system.linkedActivity?.item} />
        {/if}
      </div>
    {/if}
  </div>
  {#if context.labels?.classes}
    <div class="spell-classes">{context.labels?.classes ?? ''}</div>
  {/if}

  <!-- Tab Strip -->
  <Tabs
    bind:selectedTabId
    tabs={context.tabs}
    cssClass="item-tabs"
    sheet={context.item.sheet}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
