<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { onMount } from 'svelte';
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

  // TODO: this is intended to be shared between characters, NPCs, and Vehicles; retype the context so it can be one of the three.
  export let context: CharacterSheetContext;
  export let scrollTop: number;

  const localize = FoundryAdapter.localize;
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');
  const featSearch = 'TODO: implement';

  let scrollView: HTMLElement;

  onMount(() => {
    scrollView.scrollTop = scrollTop ?? 0;
  });

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

  let expansionsMap = new Map<string, { show: boolean; chatData: any }>();
  backgroundSection.items.forEach((i: any) =>
    expansionsMap.set(i.id, { show: false, chatData: undefined })
  );

  const hideIconsNextToTheItemName =
    SettingsProvider.settings.hideIconsNextToTheItemName.get();

  function getAvailableLevels(id: string) {
    return context.itemContext[id]?.availableLevels ?? [];
  }
</script>

<div class="inventory-filters">
  <ul class="filter-list" data-filter="features" bind:this={scrollView}>
    <li class="filter-title" title={localize('DND5E.Filter')}>
      <i class="fas fa-filter" />
    </li>
    <li class="filter-search" title={localize('TIDY5E.SearchHint')}>
      <input
        type="text"
        id="feat-search"
        placeholder={localize('TIDY5E.SearchFeat')}
        value={featSearch}
      /><span class="clear-search hidden" title={localize('TIDY5E.SearchClear')}
        ><i class="fas fa-times-circle" /></span
      >
    </li>
    <li class="filter-item" data-filter="action">{localize('DND5E.Action')}</li>
    <li class="filter-item" data-filter="bonus">
      {localize('DND5E.BonusAction')}
    </li>
    <li class="filter-item" data-filter="reaction">
      {localize('DND5E.Reaction')}
    </li>
  </ul>
</div>

<div class="features-list">
  {#if allowEdit || backgroundSection.items.length > 0}
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
          <ItemTableColumn baseWidth="5.3125rem" />
        {/if}
      </ItemTableHeaderRow>
      {#each backgroundSection.items as item (item.id)}
        <ItemTableRow
          {item}
          let:toggleSummary
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event.detail, item)}
          contextMenu={{ type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS, id: item.id }}
        >
          <ItemTableCell primary={true}>
            <ItemUseButton {item} />
            <ItemName
              on:click={(event) => toggleSummary(event.detail, context.actor)}
            >
              <span>{item.name}</span>
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
            <ItemTableCell baseWidth="5.3125rem">
              <div class="feature-controls flexrow">
                <ItemEditControl {item} />
                {#if allowEdit}
                  <ItemDuplicateControl {item} />
                  <ItemDeleteControl {item} />
                {/if}
              </div>
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

  {#if allowEdit || classSection.items.length > 0}
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
          <ItemTableColumn baseWidth="5.3125rem" />
        {/if}
      </ItemTableHeaderRow>
      {#each classSection.items as item (item.id)}
        <ItemTableRow
          {item}
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event.detail, item)}
          contextMenu={{ type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS, id: item.id }}
          let:toggleSummary
        >
          <ItemTableCell primary={true}>
            <ItemUseButton {item} />
            <ItemName
              on:click={(event) => toggleSummary(event.detail, context.actor)}
            >
              <span>
                {#if item.type === 'subclass'}&rdsh;{/if}
                {item.name}
                {#if item.system.isOriginalClass}
                  <i
                    class="original-class fas fa-sun"
                    title={localize('DND5E.ClassOriginal')}
                  />
                {/if}
              </span>
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
            <ItemTableCell baseWidth="5.3125rem">
              <div class="feature-controls">
                <ItemEditControl {item} />
                {#if allowEdit}
                  <ItemDuplicateControl {item} />
                  <ItemDeleteControl {item} />
                {/if}
              </div>
            </ItemTableCell>
          {/if}
        </ItemTableRow>
      {/each}
      {#if context.owner && allowEdit && context.editable}
        <ItemTableFooter dataset={classSection.dataset} actor={context.actor} />
      {/if}
    </ItemTable>
  {/if}
</div>

<!-- active abilities -->

<!-- passive abilities -->

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

<style lang="scss">
  .features-list {
    flex: 1;
    padding: 0 9px 8px 0;
    overflow-y: scroll;
  }

  .feature-controls {
    align-self: stretch;
    display: flex;
    justify-content: flex-end;
    min-width: 5.3125rem;
    font-size: 0.75rem;
    padding: 0 0.125rem;

    :global(> *) {
      flex: 1;
    }
  }
</style>
