<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import { formatAsModifier } from 'src/utils/formatting';
  import ItemEditControl from '../../../components/item-list/ItemEditControl.svelte';
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
  import ItemFavoriteControl from '../../../components/item-list/ItemFavoriteControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Notice from '../../../components/notice/Notice.svelte';
  import { settingStore } from 'src/settings/settings';
  import DtypeInput from '../../../components/inputs/DtypeInput.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;
  $: classicControlsBaseWidth = $context.editable ? '7.5rem' : '5.3125rem';

  $: noFeatures =
    $context.features.some((section: any) => section.items.length > 0) ===
    false;

  function getAvailableLevels(id: string) {
    return $context.itemContext[id]?.availableLevels ?? [];
  }

  let searchCriteria: string = '';
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    placeholder={localize('T5EK.SearchFeat')}
  />
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
  {#if noFeatures && !$context.editable}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {:else}
    {#each $context.features as section (section.label)}
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
          {#if $context.owner && $context.classicControlsEnabled}
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
              <ItemUseButton {item} />
              <ItemName
                on:toggle={() => toggleSummary($context.actor)}
                hasChildren={false}
                {item}
              >
                {item.name}
              </ItemName>
            </ItemTableCell>

            <!-- TODO: Handle more gracefully -->
            {#if !$settingStore.hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <InlineFavoriteIcon />
            {/if}

            {#if section.showUsesColumn}
              <ItemTableCell baseWidth="3.125rem">
                {#if ctx?.isOnCooldown}
                  <button
                    type="button"
                    class="item-list-button"
                    title={item.labels.recharge}
                    on:click={() => item.rollRecharge()}
                    disabled={!$context.owner}
                  >
                    <i class="fas fa-dice-six" />
                    {item.system.recharge
                      .value}{#if item.system.recharge.value !== 6}+{/if}</button
                  >
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
                <span class="truncate" title={item.system.source}
                  >{item.system.source}</span
                >
              </ItemTableCell>
            {/if}
            {#if section.showLevelColumn}
              <ItemTableCell baseWidth="7.5rem">
                {#if item.type === 'class'}
                  <select
                    on:change={(event) =>
                      FoundryAdapter.onLevelChange(event, item, $context.actor)}
                    disabled={!$context.owner || $context.lockLevelSelector}
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
            {#if $context.owner && $context.classicControlsEnabled}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                {#if item.type !== 'class'}
                  <ItemFavoriteControl {item} />
                {/if}
                <ItemEditControl {item} />
                {#if $context.editable}
                  <ItemDuplicateControl {item} />
                  <ItemDeleteControl {item} />
                {/if}
              </ItemTableCell>
            {/if}
          </ItemTableRow>
        {/each}
        {#if $context.editable}
          <ItemTableFooter dataset={section.dataset} actor={$context.actor} />
        {/if}
      </ItemTable>
    {/each}
  {/if}
</div>
