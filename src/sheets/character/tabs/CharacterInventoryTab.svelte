<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import type { ItemLayoutMode } from 'src/types/types';
  import InventoryList from '../parts/InventoryList.svelte';
  import InventoryGrid from '../parts/InventoryGrid.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Currency from 'src/sheets/actor/Currency.svelte';
  import Notice from '../../../components/notice/Notice.svelte';
  import NumberInput from '../../../components/inputs/NumberInput.svelte';
  import EncumbranceBar from 'src/sheets/actor/EncumbranceBar.svelte';
  import TabFooter from 'src/sheets/actor/TabFooter.svelte';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';
  import { ExpandAllCollapseAllService } from 'src/features/expand-collapse/ExpandAllCollapseAllService';
  import UtilityBar from 'src/components/utility-bar/UtilityBar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import type { UtilityBarCommandParams } from 'src/components/utility-bar/types';
  import UtilityBarCommand from 'src/components/utility-bar/UtilityBarCommand.svelte';
  import TempUtilityBarToggle from 'src/components/utility-bar/TempUtilityBarToggle.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($context.actor, 'inventory-grid')
    ? 'grid'
    : 'list';

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag($context.actor, 'inventory-grid');
      return;
    }

    FoundryAdapter.setFlag($context.actor, 'inventory-grid', true);
  }

  $: noItems =
    $context.inventory.some((section: any) => section.items.length > 0) ===
    false;

  const expandAllCollapseAllService = ExpandAllCollapseAllService.initService();

  let utilityBarCommands: UtilityBarCommandParams[] = [];
  $: utilityBarCommands = [
    {
      title: 'Expand All',
      iconClass: 'fas fa-angles-down',
      execute: () => expandAllCollapseAllService.expandAll(),
    },
    {
      title: 'Collapse All',
      iconClass: 'fas fa-angles-up',
      execute: () => expandAllCollapseAllService.collapseAll(),
    },
    {
      title: localize('TIDY5E.ListLayout'),
      iconClass: 'fas fa-th-list toggle-list',
      visible: layoutMode === 'grid',
      execute: () => toggleLayout(),
    },
    {
      title: localize('TIDY5E.GridLayout'),
      iconClass: 'fas fa-th-large toggle-grid',
      visible: layoutMode === 'list',
      execute: () => toggleLayout(),
    },
  ];
</script>

<UtilityBar>
  <Search bind:value={searchCriteria} />
  <div class="bar-toggles flex-row extra-small-gap">
    <TempUtilityBarToggle filterName="action" setName="inventory">
      {localize('DND5E.Action')}
    </TempUtilityBarToggle>
    <TempUtilityBarToggle filterName="bonus" setName="inventory">
      {localize('DND5E.BonusAction')}
    </TempUtilityBarToggle>
    <TempUtilityBarToggle filterName="reaction" setName="inventory">
      {localize('DND5E.Reaction')}
    </TempUtilityBarToggle>
    <TempUtilityBarToggle filterName="equipped" setName="inventory">
      {localize('DND5E.Equipped')}
    </TempUtilityBarToggle>
  </div>
  {#each utilityBarCommands as command (command.title)}
    <UtilityBarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      on:execute={(ev) => command.execute?.(ev.detail)}
    />
  {/each}
</UtilityBar>

<div
  class="scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  {#if noItems && !$context.unlocked}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {:else}
    {#each $context.inventory as section (section.label)}
      {@const filteredItems = FoundryAdapter.getFilteredItems(
        searchCriteria,
        section.items,
      )}
      {#if (searchCriteria.trim() === '' && $context.unlocked) || filteredItems.length > 0}
        {#if layoutMode === 'list'}
          <InventoryList
            primaryColumnName="{localize(
              section.label,
            )} ({filteredItems.length})"
            items={filteredItems}
            extraInventoryRowClasses={section.css}
            {section}
          />
        {:else}
          <InventoryGrid items={filteredItems} {section} />
        {/if}
      {/if}
    {/each}
  {/if}
</div>

<TabFooter mode="vertical">
  <div class="attunement-and-currency">
    <div
      class="attuned-items-counter"
      class:overattuned={$context.actor.system.attributes.attunement.value >
        $context.actor.system.attributes.attunement.max}
      title={localize('DND5E.Attunement')}
    >
      <i class="attunement-icon fas fa-sun" />
      <span
        class="attuned-items-current"
        title={localize('TIDY5E.AttunementItems')}
        >{$context.system.attributes.attunement.value}</span
      >
      /
      {#if $context.editable && FoundryAdapter.userIsGm()}
        <NumberInput
          selectOnFocus={true}
          document={$context.actor}
          field="system.attributes.attunement.max"
          cssClass="attuned-items-max"
          value={$context.system.attributes.attunement.max}
          placeholder="0"
          title={localize('TIDY5E.AttunementMax')}
          disabled={!$context.editable || $context.lockSensitiveFields}
        />
      {:else}
        <span class="attuned-items-max" title={localize('TIDY5E.AttunementMax')}
          >{$context.system.attributes.attunement.max}</span
        >
      {/if}
    </div>
    <Currency actor={$context.actor} />
  </div>

  {#if $settingStore.useCharacterEncumbranceBar}
    <EncumbranceBar />
  {/if}
</TabFooter>

<style lang="scss">
  .attunement-and-currency {
    display: flex;
    flex: 0 0 1.875rem;
    gap: 1.25rem;

    .attuned-items-counter {
      display: flex;
      align-items: center;
      margin-left: 0.1875rem;
      padding-left: 0.625rem;
      border-radius: 0.3125rem;
      background: var(--t5ek-faint-color);

      .attunement-icon {
        color: var(--t5ek-primary-accent-color);
      }

      &.overattuned {
        animation: overflowing-with-arcane-power 2s infinite;
      }

      @keyframes overflowing-with-arcane-power {
        0% {
          box-shadow: 0 0 0 0 var(--t5ek-primary-accent-color);
        }
        100% {
          box-shadow: 0 0 0 0.375rem rgba(0, 0, 0, 0);
        }
      }

      span {
        font-size: 1rem;
      }

      i {
        opacity: 0.6;
        font-size: 1.25rem;
        margin-right: 0.3125rem;
        margin-left: 0.0625rem;
      }

      :global(.attuned-items-max) {
        width: 1.5rem;
      }

      :global(input) {
        font-size: 1rem;
        font-family: var(--t5ek-body-font-family);
      }
    }
  }
</style>
