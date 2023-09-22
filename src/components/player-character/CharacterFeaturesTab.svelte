<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import { formatAsModifier } from 'src/utils/formatting';
  import ItemEditControl from '../items/ItemEditControl.svelte';
  import ItemDuplicateControl from '../items/ItemDuplicateControl.svelte';
  import ItemDeleteControl from '../items/ItemDeleteControl.svelte';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import ItemTableFooter from '../items/ItemTableFooter.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemUseButton from '../items/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemName from '../items/ItemName.svelte';
  import ItemUses from '../items/ItemUses.svelte';
  import ItemAddUses from '../items/ItemAddUses.svelte';
  import ListContainer from '../layout/ListContainer.svelte';
  import ItemControls from '../items/ItemControls.svelte';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';
  import InlineFavoriteIcon from '../shared/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../items/ItemFavoriteControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Notice from '../shared/Notice.svelte';
  import { currentSettings } from 'src/settings/settings';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;
  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit');
  $: classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';

  let backgroundSection: any,
    classSection: any,
    activeAbilitiesSection: any,
    passiveAbilitiesSection: any;

  $: {
    for (let section of $store.features) {
      switch (section.dataset?.type) {
        case 'background':
          backgroundSection = section;
          break;
        case 'class':
          classSection = section;
          break;
        case 'feat':
          if (section.dataset['activation.type'] === 'action') {
            activeAbilitiesSection = section;
          } else {
            passiveAbilitiesSection = section;
          }
          break;
      }
    }
  }

  $: noFeatures =
    $store.features.some((section: any) => section.items.length > 0) === false;

  function getAvailableLevels(id: string) {
    return $store.itemContext[id]?.availableLevels ?? [];
  }

  let searchCriteria: string = '';
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={$store.actor}
    searchFlag="feat-search"
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

<ListContainer cssClass="flex-column small-gap">
  {@const filteredBackgrounds = FoundryAdapter.getFilteredItems(
    searchCriteria,
    backgroundSection.items
  )}
  {@const filteredClasses = FoundryAdapter.getFilteredItems(
    searchCriteria,
    classSection.items
  )}
  {@const filteredActiveAbilities = FoundryAdapter.getFilteredItems(
    searchCriteria,
    activeAbilitiesSection.items
  )}
  {@const filteredPassiveAbilities = FoundryAdapter.getFilteredItems(
    searchCriteria,
    passiveAbilitiesSection.items
  )}

  {#if noFeatures && !allowEdit}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {:else}
    {#if (searchCriteria.trim() === '' && allowEdit) || filteredBackgrounds.length > 0}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(backgroundSection.label)}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Source')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Requirements')}
          </ItemTableColumn>
          {#if $store.owner && $currentSettings.classicControlsEnabled}
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          {/if}
        </ItemTableHeaderRow>

        {#each filteredBackgrounds as item (item.id)}
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
                on:click={(event) => toggleSummary(event.detail, $store.actor)}
                hasChildren={false}
              >
                {item.name}
              </ItemName>
            </ItemTableCell>

            <!-- TODO: Handle more gracefully -->
            {#if !$currentSettings.hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <InlineFavoriteIcon />
            {/if}

            <ItemTableCell baseWidth="7.5rem">
              <span class="truncate" title={item.system.source}
                >{item.system.source}</span
              >
            </ItemTableCell>
            <ItemTableCell baseWidth="7.5rem">
              <span class="truncate" title={item.system.requirements ?? ''}
                >{item.system.requirements ?? ''}</span
              >
            </ItemTableCell>

            {#if $store.owner && $currentSettings.classicControlsEnabled}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                <ItemControls>
                  <ItemFavoriteControl {item} />
                  <ItemEditControl {item} />
                  {#if allowEdit}
                    <ItemDuplicateControl {item} />
                    <ItemDeleteControl {item} />
                  {/if}
                </ItemControls>
              </ItemTableCell>
            {/if}
          </ItemTableRow>
        {/each}

        {#if $store.owner && allowEdit}
          <ItemTableFooter
            dataset={backgroundSection.dataset}
            actor={$store.actor}
          />
        {/if}
      </ItemTable>
    {/if}

    {#if (searchCriteria.trim() === '' && allowEdit) || filteredClasses.length > 0}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(classSection.label)}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Source')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Level')}
          </ItemTableColumn>
          {#if $store.owner && $currentSettings.classicControlsEnabled && $store.editable}
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          {/if}
        </ItemTableHeaderRow>
        {#each filteredClasses as item (item.id)}
          <ItemTableRow
            {item}
            on:mousedown={(event) =>
              FoundryAdapter.editOnMiddleClick(event.detail, item)}
            contextMenu={{
              type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
              id: item.id,
            }}
            let:toggleSummary
          >
            <ItemTableCell primary={true}>
              <ItemUseButton {item} />
              <ItemName
                on:click={(event) => toggleSummary(event.detail, $store.actor)}
                hasChildren={false}
              >
                {#if item.type === 'subclass'}&rdsh;{/if}
                {item.name}
                {#if item.system.isOriginalClass}
                  <i
                    class="original-class fas fa-sun"
                    title={localize('DND5E.ClassOriginal')}
                  />
                {/if}
              </ItemName>
            </ItemTableCell>

            <!-- TODO: Handle more gracefully -->
            {#if !$currentSettings.hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <InlineFavoriteIcon />
            {/if}

            <ItemTableCell baseWidth="7.5rem">
              <span class="truncate" title={item.system.source}
                >{item.system.source}</span
              >
            </ItemTableCell>
            <ItemTableCell baseWidth="7.5rem">
              {#if item.type === 'class'}
                <select
                  on:change={(event) =>
                    FoundryAdapter.onLevelChange(event, item, $store.actor)}
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

            {#if $store.owner && $currentSettings.classicControlsEnabled && $store.editable}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                <ItemControls>
                  {#if item.type !== 'class'}
                    <ItemFavoriteControl {item} />
                  {/if}
                  <ItemEditControl {item} />
                  {#if allowEdit}
                    <ItemDuplicateControl {item} />
                    <ItemDeleteControl {item} />
                  {/if}
                </ItemControls>
              </ItemTableCell>
            {/if}
          </ItemTableRow>
        {/each}
        {#if $store.owner && allowEdit && $store.editable}
          <ItemTableFooter
            dataset={classSection.dataset}
            actor={$store.actor}
          />
        {/if}
      </ItemTable>
    {/if}

    {#if (searchCriteria.trim() === '' && allowEdit) || filteredActiveAbilities.length > 0}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(activeAbilitiesSection.label)}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="3.125rem">
            {localize('DND5E.Uses')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Usage')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Source')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Requirements')}
          </ItemTableColumn>
          {#if $store.owner && $currentSettings.classicControlsEnabled}
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          {/if}
        </ItemTableHeaderRow>
        {#each filteredActiveAbilities as item (item.id)}
          {@const ctx = $store.itemContext[item.id]}
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
                on:click={(event) => toggleSummary(event.detail, $store.actor)}
                hasChildren={false}
              >
                {item.name}
              </ItemName>
            </ItemTableCell>

            <!-- TODO: Handle more gracefully -->
            {#if !$currentSettings.hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <InlineFavoriteIcon />
            {/if}

            <ItemTableCell baseWidth="3.125rem">
              {#if ctx?.isOnCooldown}
                <a
                  title={item.labels.recharge}
                  role="button"
                  tabindex="0"
                  on:click={() => item.rollRecharge()}
                >
                  <i class="fas fa-dice-six" />
                  {item.system.recharge
                    .value}{#if item.system.recharge.value !== 6}+{/if}</a
                >
              {:else if item.system.recharge.value}
                <i class="fas fa-bolt" title={localize('DND5E.Charged')} />
              {:else if ctx?.hasUses}
                <ItemUses {item} />
              {:else}
                <ItemAddUses {item} />
              {/if}
            </ItemTableCell>
            <ItemTableCell baseWidth="7.5rem">
              {#if item.system.activation.type}
                {item.labels.activation}
              {/if}
            </ItemTableCell>
            <ItemTableCell baseWidth="7.5rem">
              <span class="truncate" title={item.system.source}
                >{item.system.source}</span
              >
            </ItemTableCell>
            <ItemTableCell baseWidth="7.5rem">
              <span class="truncate" title={item.system.requirements ?? ''}
                >{item.system.requirements ?? ''}</span
              >
            </ItemTableCell>

            {#if $store.owner && $currentSettings.classicControlsEnabled}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                <ItemControls>
                  <ItemFavoriteControl {item} />
                  <ItemEditControl {item} />
                  {#if allowEdit}
                    <ItemDuplicateControl {item} />
                    <ItemDeleteControl {item} />
                  {/if}
                </ItemControls>
              </ItemTableCell>
            {/if}
          </ItemTableRow>
        {/each}
        {#if $store.owner && allowEdit}
          <ItemTableFooter
            dataset={activeAbilitiesSection.dataset}
            actor={$store.actor}
          />
        {/if}
      </ItemTable>
    {/if}

    {#if (searchCriteria.trim() === '' && allowEdit) || filteredPassiveAbilities.length > 0}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(passiveAbilitiesSection.label)}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Source')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Requirements')}
          </ItemTableColumn>
          {#if $store.owner && $currentSettings.classicControlsEnabled}
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          {/if}
        </ItemTableHeaderRow>
        {#each filteredPassiveAbilities as item (item.id)}
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
                on:click={(event) => toggleSummary(event.detail, $store.actor)}
                hasChildren={false}
              >
                {item.name}
              </ItemName>
            </ItemTableCell>

            <!-- TODO: Handle more gracefully -->
            {#if !$currentSettings.hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <InlineFavoriteIcon />
            {/if}

            <ItemTableCell baseWidth="7.5rem">
              <span class="truncate" title={item.system.source}
                >{item.system.source}</span
              >
            </ItemTableCell>
            <ItemTableCell baseWidth="7.5rem">
              <span class="truncate" title={item.system.requirements ?? ''}
                >{item.system.requirements ?? ''}</span
              >
            </ItemTableCell>

            {#if $store.owner && $currentSettings.classicControlsEnabled}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                <ItemControls>
                  <ItemFavoriteControl {item} />
                  <ItemEditControl {item} />
                  {#if allowEdit}
                    <ItemDuplicateControl {item} />
                    <ItemDeleteControl {item} />
                  {/if}
                </ItemControls>
              </ItemTableCell>
            {/if}
          </ItemTableRow>
        {/each}
        {#if $store.owner && allowEdit}
          <ItemTableFooter
            dataset={passiveAbilitiesSection.dataset}
            actor={$store.actor}
          />
        {/if}
      </ItemTable>
    {/if}
  {/if}
</ListContainer>
