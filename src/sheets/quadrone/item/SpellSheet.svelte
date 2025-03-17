<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import SpellBlock from './parts/SpellBlock.svelte';
  import { isNil } from 'src/utils/data';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import ItemLinkedItemSummary from './parts/header/ItemLinkedItemSummary.svelte';

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
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet itemSpecificSnippet()}
    <div>
      <h4>
        {localize('TYPES.Item.spell')}
      </h4>
      <SpellBlock fullWidth={false} {context} />
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
        <!-- Name -->
        {#if context.unlocked}
          <TextInputQuadrone
            field="name"
            document={context.item}
            value={context.name.editable}
            class="document-name"
          />
        {:else}
          <div class="document-name">{context.item.name}</div>
        {/if}
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
  </div>

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
