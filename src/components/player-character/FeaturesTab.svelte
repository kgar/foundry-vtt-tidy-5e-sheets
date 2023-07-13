<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { onMount } from 'svelte';
  import ItemSummary from '../shared/ItemSummary.svelte';
  import { formatAsModifier } from 'src/utils/formatting';
  import ItemEditControl from '../shared/ItemEditControl.svelte';
  import ItemDuplicateControl from '../shared/ItemDuplicateControl.svelte';
  import ItemDeleteControl from '../shared/ItemDeleteControl.svelte';
  import ItemCreateButton from '../shared/ItemCreateButton.svelte';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import ItemTableFooter from '../items/ItemTableFooter.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';

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

  async function toggleItemSummary(event: MouseEvent, item: any) {
    event.preventDefault();
    let { show, chatData } = expansionsMap.get(item.id) ?? {
      show: false,
      chatData: undefined,
    };

    show = !show;
    chatData ??= await item.getChatData({ secrets: context.actor.isOwner });

    expansionsMap.set(item.id, {
      show,
      chatData,
    });

    expansionsMap = expansionsMap;
  }

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="features list-layout">
  <!-- TODO: Determine if "unlocked" class can be visualized directly via svelte and eliminated. -->
  <ul
    class="inventory-list features-list tidy5e-items-list"
    class:unlocked={allowEdit}
  >
    <!-- background -->
    {#if allowEdit || backgroundSection.items.length > 0}
      <li class="items-header features-header">
        <h3 class="item-name">{localize(backgroundSection.label)}</h3>
        <div class="items-header-labels">
          <div class="items-header-feat-source">{localize('DND5E.Source')}</div>
          <div class="items-header-requirements">
            {localize('DND5E.Requirements')}
          </div>
          {#if classicControlsEnabled}
            <div class="items-header-controls" />
          {/if}
        </div>
      </li>
      <ul class="tidy5e-item-list">
        {#each backgroundSection.items as item (item.id)}
          <li class="item" data-item-id={item.id}>
            <div class="item-name">
              <div
                role="button"
                tabindex="0"
                class="item-image"
                style="background-image: url('{item.img}')"
                on:click={(event) => item.use({}, { event })}
              >
                <i class="fa fa-dice-d20" />
              </div>
              <div
                role="button"
                on:click={(event) => toggleItemSummary(event, item)}
                tabindex="0"
              >
                <h4>
                  {item.name}
                </h4>
              </div>
            </div>

            {#if !hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(item, 'favorite')}
              <div class="item-state-icon" title="Favorite">
                <i class="fas fa-bookmark icon-fav" />
              </div>
            {/if}

            <div class="item-detail item-source">
              <span class="truncate" title={item.system.source}
                >{item.system.source}</span
              >
            </div>
            <div class="item-detail item-requirements">
              <span class="truncate" title={item.system.requirements ?? ''}
                >{item.system.requirements ?? ''}</span
              >
            </div>

            {#if context.owner && classicControlsEnabled}
              <div
                class="item-controls flexrow"
                class:hidden={!classicControlsEnabled}
              >
                <ItemEditControl {item} />
                {#if allowEdit}
                  <ItemDuplicateControl {item} />
                  <ItemDeleteControl {item} />
                {/if}
              </div>
            {/if}

            {#if expansionsMap.get(item.id)?.show}
              <ItemSummary chatData={expansionsMap.get(item.id)?.chatData} />
            {/if}
          </li>
        {/each}
        {#if context.owner && allowEdit}
          <li class="items-footer">
            <ItemCreateButton
              dataset={backgroundSection.dataset}
              actor={context.actor}
            />
          </li>
        {/if}
      </ul>
    {/if}

    <!-- classes -->
    {#if allowEdit || classSection.items.length > 0}
      <li class="items-header features-header">
        <h3 class="item-name">{localize(classSection.label)}</h3>
        <div class="items-header-labels">
          <div class="items-header-feat-source">{localize('DND5E.Source')}</div>
          <div class="items-header-level">{localize('DND5E.Level')}</div>
          {#if classicControlsEnabled}
            <div class="items-header-controls" />
          {/if}
        </div>
      </li>
      <ul class="tidy5e-item-list">
        {#each classSection.items as item (item.id)}
          <li class="item" data-item-id={item.id}>
            <div class="item-name">
              <div
                role="button"
                tabindex="0"
                class="item-image"
                style="background-image: url('{item.img}')"
                on:click={(event) => item.use({}, { event })}
              >
                <i class="fa fa-dice-d20" />
              </div>
              <div
                role="button"
                on:click={(event) => toggleItemSummary(event, item)}
                tabindex="0"
              >
                <h4>
                  {#if item.type === 'subclass'}&rdsh;{/if}
                  {item.name}
                  {#if item.system.isOriginalClass}
                    <i
                      class="original-class fas fa-sun"
                      title={localize('DND5E.ClassOriginal')}
                    />
                  {/if}
                </h4>
              </div>
            </div>

            <div class="item-detail item-source">
              <span class="truncate" title={item.system.source}
                >{item.system.source}</span
              >
            </div>

            <div class="item-detail item-action">
              {#if item.type === 'class'}
                <select class="level-selector">
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
            </div>

            {#if context.owner && classicControlsEnabled}
              <div
                class="item-controls flexrow"
                class:hidden={!classicControlsEnabled}
              >
                <ItemEditControl {item} />
                {#if allowEdit}
                  <ItemDuplicateControl {item} />
                  <ItemDeleteControl {item} />
                {/if}
              </div>
            {/if}

            {#if expansionsMap.get(item.id)?.show}
              <ItemSummary chatData={expansionsMap.get(item.id)?.chatData} />
            {/if}
          </li>
        {/each}
        {#if context.owner && allowEdit}
          <li class="items-footer">
            <ItemCreateButton
              dataset={classSection.dataset}
              actor={context.actor}
            />
          </li>
        {/if}
      </ul>
    {/if}

    <!-- active abilities -->

    <!-- passive abilities -->
  </ul>
</div>

<div class="features-list">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableCell primary={true}>
        {localize(backgroundSection.label)}
      </ItemTableCell>
      <ItemTableCell baseWidth="7.5rem">
        {localize('DND5E.Source')}
      </ItemTableCell>
      <ItemTableCell baseWidth="7.5rem">
        {localize('DND5E.Requirements')}
      </ItemTableCell>
      {#if context.owner && classicControlsEnabled}
        <ItemTableCell baseWidth="5.3125rem" />
      {/if}
    </ItemTableHeaderRow>
    {#each backgroundSection.items as item (item.id)}
      <ItemTableRow {item} let:toggleSummary>
        <ItemTableCell primary={true}>
          <div
            role="button"
            tabindex="0"
            class="item-image"
            style="background-image: url('{item.img}')"
            on:click={(event) => item.use({}, { event })}
          >
            <i class="fa fa-dice-d20" />
          </div>
          <div
            role="button"
            on:click={(event) => toggleSummary(event, context.actor)}
            tabindex="0"
          >
            <h4>
              {item.name}
            </h4>
          </div>
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
            <div class="item-controls flexrow">
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
</div>

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
</style>
