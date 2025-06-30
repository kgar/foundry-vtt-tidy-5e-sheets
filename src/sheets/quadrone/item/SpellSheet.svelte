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
  import type { SpellSchool } from 'src/foundry/config.types';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();

  const actorPactLevelOrdinal = $derived(
    context.item.actor?.system.spells.pact?.level?.ordinalString(),
  );
  const isPactSpell = $derived(
    context.item.system.preparation.mode ===
      CONSTANTS.SPELL_PREPARATION_MODE_PACT,
  );
  const pactCastableLevelText = $derived(
    isPactSpell && !isNil(actorPactLevelOrdinal)
      ? ` (${localize('TIDY5E.ItemSheet.PactLevelCastLabel', { ordinal: actorPactLevelOrdinal })})`
      : '',
  );

  let subtitle = $derived(
    [context.labels.level + pactCastableLevelText, context.labels.school]
      .filter((x) => !isNil(x))
      .join(', '),
  );

  let spellSchoolConfig = $derived<SpellSchool | undefined>(
    context.config.spellSchools[context.system.school],
  );

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

  let itemHeaderSummaries = $derived.by(() => {
    let result = [];
    if (context.item.hasLimitedUses) {
      result.push(chargesSummaryItem);
    }

    if (context.item.hasRecharge) {
      result.push(rechargeSummaryItem);
    }

    if (context.system.linkedActivity?.item) {
      result.push(linkedItemSummaryItem);
    }

    return result;
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar includeSidebarProperties={false} sectionLabel={'DND5E.Spellbook'}>
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
      <div class="subtitle">{subtitle}</div>
    </div>
    {#if !context.unlocked}
      <div class="common-fields">
        {#if spellSchoolConfig}
          <div class="school" aria-label={context.labels.school}>
            <Dnd5eIcon src={spellSchoolConfig.icon} />
          </div>
        {/if}
      </div>
    {/if}

    {#if itemHeaderSummaries.length}
      <div class="item-header-summary">
        {#each itemHeaderSummaries as summaryItem}
          {@render summaryItem()}
        {/each}
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
    tabContext={{ context, item: context.item }}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>

{#snippet chargesSummaryItem()}
  <ItemChargesSummary />
{/snippet}
{#snippet rechargeSummaryItem()}
  <ItemRechargeSummary />
{/snippet}
{#snippet linkedItemSummaryItem()}
  <ItemLinkedItemSummary linked={context.system.linkedActivity?.item} />
{/snippet}
