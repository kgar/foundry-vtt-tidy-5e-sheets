<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import { formatAsModifier } from 'src/utils/formatting';
  import ItemEditControl from '../../../components/item-list/controls/ItemEditControl.svelte';
  import ItemDuplicateControl from '../../../components/item-list/controls/ItemDuplicateControl.svelte';
  import ItemDeleteControl from '../../../components/item-list/controls/ItemDeleteControl.svelte';
  import ItemTable from '../../../components/item-list/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../components/item-list/ItemTableRow.svelte';
  import ItemTableFooter from '../../../components/item-list/ItemTableFooter.svelte';
  import ItemTableCell from '../../../components/item-list/ItemTableCell.svelte';
  import ItemTableColumn from '../../../components/item-list/ItemTableColumn.svelte';
  import ItemUseButton from '../../../components/item-list/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemName from '../../../components/item-list/ItemName.svelte';
  import ItemUses from '../../../components/item-list/ItemUses.svelte';
  import ItemAddUses from '../../../components/item-list/ItemAddUses.svelte';
  import ItemFilters from '../../../components/item-list/ItemFilters.svelte';
  import ItemFilterSearch from '../../../components/item-list/ItemFilterSearch.svelte';
  import ItemFilterOption from '../../../components/item-list/ItemFilterOption.svelte';
  import InlineFavoriteIcon from '../../../components/item-list/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../../../components/item-list/controls/ItemFavoriteControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Notice from '../../../components/notice/Notice.svelte';
  import { settingStore } from 'src/settings/settings';
  import DtypeInput from '../../../components/inputs/DtypeInput.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;
  $: classicControlsBaseWidth = $context.unlocked ? '7.5rem' : '5.3125rem';

  $: noFeatures =
    $context.features.some((section: any) => section.items.length > 0) ===
    false;

  function getAvailableLevels(id: string) {
    return $context.itemContext[id]?.availableLevels ?? [];
  }

  let searchCriteria: string = '';
</script>

<ItemFilters>
  <ItemFilterSearch bind:searchCriteria placeholder={localize('T5EK.Search')} />
  <ItemFilterOption setName="features" filterName="action">
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption setName="features" filterName="bonus">
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption setName="features" filterName="reaction">
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
</ItemFilters>

<div class="scroll-container flex-column small-gap">
  {#if noFeatures && !$context.unlocked}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {:else}
    {#each $context.features as section (section.label)}
      {@const filteredItems = FoundryAdapter.getFilteredItems(
        searchCriteria,
        section.items,
      )}
      {#if (searchCriteria.trim() === '' && $context.unlocked) || filteredItems.length > 0}
        <ItemTable>
          <ItemTableHeaderRow>
            <ItemTableColumn primary={true}>
              {localize(section.label)}
            </ItemTableColumn>
            {#if section.showUsesColumn}
              <ItemTableColumn baseWidth="3.125rem">
                {localize('DND5E.Uses')}
              </ItemTableColumn>
            {/if}
            {#if section.showUsagesColumn}
              <ItemTableColumn baseWidth="7.5rem">
                {localize('DND5E.Usage')}
              </ItemTableColumn>
            {/if}
            {#if section.showSourceColumn}
              <ItemTableColumn baseWidth="7.5rem">
                {localize('DND5E.Source')}
              </ItemTableColumn>
            {/if}
            {#if section.showLevelColumn}
              <ItemTableColumn baseWidth="7.5rem">
                {localize('DND5E.Level')}
              </ItemTableColumn>
            {/if}
            {#if section.showRequirementsColumn}
              <ItemTableColumn baseWidth="7.5rem">
                {localize('DND5E.Requirements')}
              </ItemTableColumn>
            {/if}
            {#if section.columns}
              {#each section.columns as column (column.property)}
                <ItemTableColumn cssClass={column.css ?? ''}>
                  {localize(column.label)}
                </ItemTableColumn>
              {/each}
            {/if}
            {#if $context.editable && $context.useClassicControls}
              <ItemTableColumn baseWidth={classicControlsBaseWidth} />
            {/if}
          </ItemTableHeaderRow>
          {#each FoundryAdapter.getFilteredItems(searchCriteria, section.items) as item (item.id)}
            {@const ctx = $context.itemContext[item.id]}
            <ItemTableRow
              {item}
              let:toggleSummary
              on:mousedown={(event) =>
                FoundryAdapter.editOnMiddleClick(event.detail, item)}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                id: item.id,
              }}
            >
              <ItemTableCell primary={true}>
                <ItemUseButton disabled={!$context.editable} {item} />
                <ItemName
                  on:toggle={() => toggleSummary($context.actor)}
                  hasChildren={false}
                  {item}
                >
                  {#if item.type === 'subclass'}&rdsh;{/if}
                  <span data-tidy-item-name={item.name}>{item.name}</span>
                </ItemName>
              </ItemTableCell>

              <!-- TODO: Handle more gracefully -->
              {#if $settingStore.showIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
                <InlineFavoriteIcon />
              {/if}

              {#if section.showUsesColumn}
                <ItemTableCell baseWidth="3.125rem">
                  {#if ctx?.isOnCooldown}
                    <RechargeControl {item} />
                  {:else if item.system.recharge.value}
                    <i class="fas fa-bolt" title={localize('DND5E.Charged')} />
                  {:else if ctx?.hasUses}
                    <ItemUses {item} />
                  {:else}
                    <ItemAddUses {item} />
                  {/if}
                </ItemTableCell>
              {/if}
              {#if section.showUsagesColumn}
                <ItemTableCell baseWidth="7.5rem">
                  {#if item.system.activation.type}
                    {item.labels.activation}
                  {/if}
                </ItemTableCell>
              {/if}
              {#if section.showSourceColumn}
                <ItemTableCell baseWidth="7.5rem">
                  <span class="truncate" title={item.system.source.label}
                    >{item.system.source.label}</span
                  >
                </ItemTableCell>
              {/if}
              {#if section.showLevelColumn}
                <ItemTableCell baseWidth="7.5rem">
                  {#if item.type === 'class'}
                    <select
                      on:change={(event) =>
                        FoundryAdapter.onLevelChange(
                          event,
                          item,
                          $context.actor,
                        )}
                      disabled={!$context.editable ||
                        $context.lockLevelSelector}
                    >
                      {#each getAvailableLevels(item.id) as availableLevel}
                        <option
                          value={availableLevel.delta}
                          disabled={availableLevel.disabled || undefined}
                          selected={availableLevel.delta === 0}
                        >
                          {localize('DND5E.LevelNumber', {
                            level: availableLevel.level,
                          })}
                          {#if availableLevel.delta}
                            ({formatAsModifier(availableLevel.delta)})
                          {/if}
                        </option>
                      {/each}
                    </select>
                  {/if}
                </ItemTableCell>
              {/if}
              {#if section.showRequirementsColumn}
                <ItemTableCell baseWidth="7.5rem">
                  <span class="truncate" title={item.system.requirements ?? ''}
                    >{item.system.requirements ?? ''}</span
                  >
                </ItemTableCell>
              {/if}
              {#if section.columns}
                {#each section.columns as column (column.property)}
                  {@const itemPropertyValue =
                    FoundryAdapter.getProperty(item, item.property) ??
                    FoundryAdapter.getProperty(item, ctx?.property) ??
                    ''}
                  <ItemTableCell>
                    {#if column.editable}
                      <DtypeInput
                        document={item}
                        field={item.property ?? ctx?.property}
                        value={itemPropertyValue}
                        dtype={column.editable}
                      />
                    {:else}
                      {itemPropertyValue}
                    {/if}
                  </ItemTableCell>
                {/each}
              {/if}
              {#if $context.editable && $context.useClassicControls}
                <ItemTableCell baseWidth={classicControlsBaseWidth}>
                  {#if item.type !== 'class'}
                    <ItemFavoriteControl {item} />
                  {/if}
                  <ItemEditControl {item} />
                  {#if $context.unlocked}
                    <ItemDuplicateControl {item} />
                    <ItemDeleteControl {item} />
                  {/if}
                  {#if $context.useActionsFeature}
                    <ActionFilterOverrideControl {item} />
                  {/if}
                </ItemTableCell>
              {/if}
            </ItemTableRow>
          {/each}
          {#if $context.unlocked}
            <ItemTableFooter dataset={section.dataset} actor={$context.actor} />
          {/if}
        </ItemTable>
      {/if}
    {/each}
  {/if}
</div>
