<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
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
  import ItemContext from '../items/ItemContext.svelte';
  import ItemUses from '../items/ItemUses.svelte';
  import ItemAddUses from '../items/ItemAddUses.svelte';
  import ListContainer from '../layout/ListContainer.svelte';
  import FilteredItems from '../items/FilteredItems.svelte';
  import ItemControls from '../items/ItemControls.svelte';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import type { SheetFunctions } from 'src/types/types';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';

  // TODO: this is intended to be shared between characters, NPCs, and Vehicles; retype the context so it can be one of the three.
  export let context: CharacterSheetContext;
  export let sheetFunctions: SheetFunctions;

  const localize = FoundryAdapter.localize;
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');
  const classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';

  const classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();

  let backgroundSection: any,
    classSection: any,
    activeAbilitiesSection: any,
    passiveAbilitiesSection: any;

  for (let section of context.features) {
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

  const hideIconsNextToTheItemName =
    SettingsProvider.settings.hideIconsNextToTheItemName.get();

  function getAvailableLevels(id: string) {
    return context.itemContext[id]?.availableLevels ?? [];
  }

  let searchCriteria: string = '';
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={context.actor}
    searchFlag="feat-search"
  />
  <ItemFilterOption setName="features" filterName="action" {sheetFunctions}>
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption setName="features" filterName="bonus" {sheetFunctions}>
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption setName="features" filterName="reaction" {sheetFunctions}>
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
</ItemFilters>

<ListContainer>
  <FilteredItems
    items={backgroundSection.items}
    {searchCriteria}
    let:filteredItems
  >
    {#if (searchCriteria.trim() === '' && allowEdit) || filteredItems.length > 0}
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
          {#if context.owner && classicControlsEnabled}
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          {/if}
        </ItemTableHeaderRow>

        {#each filteredItems as item (item.id)}
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
                on:click={(event) => toggleSummary(event.detail, context.actor)}
              >
                {item.name}
              </ItemName>
            </ItemTableCell>

            <!-- TODO: Handle more gracefully -->
            {#if !hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <div class="item-state-icon" title="Favorite">
                <i class="fas fa-bookmark icon-fav" />
              </div>
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

            {#if context.owner && classicControlsEnabled}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                <ItemControls>
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

        {#if context.owner && allowEdit}
          <ItemTableFooter
            dataset={backgroundSection.dataset}
            actor={context.actor}
          />
        {/if}
      </ItemTable>
    {/if}
  </FilteredItems>

  <FilteredItems items={classSection.items} {searchCriteria} let:filteredItems>
    {#if (searchCriteria.trim() === '' && allowEdit) || filteredItems.length > 0}
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
          {#if context.owner && classicControlsEnabled && context.editable}
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          {/if}
        </ItemTableHeaderRow>
        {#each filteredItems as item (item.id)}
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
                on:click={(event) => toggleSummary(event.detail, context.actor)}
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
            {#if !hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <div class="item-state-icon" title="Favorite">
                <i class="fas fa-bookmark icon-fav" />
              </div>
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
                    FoundryAdapter.onLevelChange(event, item, context.actor)}
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

            {#if context.owner && classicControlsEnabled && context.editable}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                <ItemControls>
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
        {#if context.owner && allowEdit && context.editable}
          <ItemTableFooter
            dataset={classSection.dataset}
            actor={context.actor}
          />
        {/if}
      </ItemTable>
    {/if}
  </FilteredItems>

  <FilteredItems
    items={activeAbilitiesSection.items}
    {searchCriteria}
    let:filteredItems
  >
    {#if (searchCriteria.trim() === '' && allowEdit) || filteredItems.length > 0}
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
          {#if context.owner && classicControlsEnabled}
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          {/if}
        </ItemTableHeaderRow>
        {#each filteredItems as item (item.id)}
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
                on:click={(event) => toggleSummary(event.detail, context.actor)}
              >
                {item.name}
              </ItemName>
            </ItemTableCell>

            <!-- TODO: Handle more gracefully -->
            {#if !hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <div class="item-state-icon" title="Favorite">
                <i class="fas fa-bookmark icon-fav" />
              </div>
            {/if}

            <ItemTableCell baseWidth="3.125rem">
              <ItemContext {item} itemContext={context.itemContext} let:ctx>
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
              </ItemContext>
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

            {#if context.owner && classicControlsEnabled}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                <ItemControls>
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
        {#if context.owner && allowEdit}
          <ItemTableFooter
            dataset={activeAbilitiesSection.dataset}
            actor={context.actor}
          />
        {/if}
      </ItemTable>
    {/if}
  </FilteredItems>

  <FilteredItems
    items={passiveAbilitiesSection.items}
    {searchCriteria}
    let:filteredItems
  >
    {#if (searchCriteria.trim() === '' && allowEdit) || passiveAbilitiesSection.length > 0}
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
          {#if context.owner && classicControlsEnabled}
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          {/if}
        </ItemTableHeaderRow>
        {#each filteredItems as item (item.id)}
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
                on:click={(event) => toggleSummary(event.detail, context.actor)}
              >
                {item.name}
              </ItemName>
            </ItemTableCell>

            <!-- TODO: Handle more gracefully -->
            {#if !hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <div class="item-state-icon" title="Favorite">
                <i class="fas fa-bookmark icon-fav" />
              </div>
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

            {#if context.owner && classicControlsEnabled}
              <ItemTableCell baseWidth={classicControlsBaseWidth}>
                <ItemControls>
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
        {#if context.owner && allowEdit}
          <ItemTableFooter
            dataset={passiveAbilitiesSection.dataset}
            actor={context.actor}
          />
        {/if}
      </ItemTable>
    {/if}
  </FilteredItems>
</ListContainer>

<!-- TODO: Handle info card as a single element managed by the window as a whole -->
<!-- <div class="info-card" data-item-id={item._id}>
  <p class="info-card-name">{item.name}</p>
  <div class="description-wrap">
    <div class="info-card-description">
      {#await item.getChatData( { secrets: context.actor.isOwner } ) then chatData}
        {@html chatData}
      {/await}
    </div>
  </div>
  <article class="mod-roll-buttons" />
</div> -->
