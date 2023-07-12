<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { mapDatasetToDataAttributes } from 'src/utils/mapping';
  import { onMount } from 'svelte';
  import ItemSummary from '../shared/item-summary.svelte';
  import { formatAsModifier } from 'src/utils/formatting';

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

  function createItem(dataset: any) {
    if (
      dataset.type === 'class' &&
      context.actor.system.details.level + 1 > CONFIG.DND5E.maxLevel
    ) {
      const err = game.i18n.format('DND5E.MaxCharacterLevelExceededWarn', {
        max: CONFIG.DND5E.maxLevel,
      });
      return ui.notifications.error(err);
    }

    const itemData = {
      name: game.i18n.format('DND5E.ItemNew', {
        type: game.i18n.localize(CONFIG.Item.typeLabels[dataset.type]),
      }),
      type: dataset.type,
      system: foundry.utils.expandObject({ ...dataset }),
    };
    delete itemData.system.type;
    return context.actor.createEmbeddedDocuments('Item', [itemData]);
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
          <div class="items-header-controls" />
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
            {#if context.owner}
              <div
                class="item-controls flexrow"
                class:hidden={!classicControlsEnabled}
              >
                <a
                  class="item-control item-edit"
                  data-action="itemEdit"
                  title={localize('DND5E.ItemEdit')}
                  role="button"
                >
                  <i class="fas fa-edit fa-fw" />
                </a>
                {#if allowEdit}
                  <a
                    class="item-control item-duplicate"
                    data-action="itemDuplicate"
                    title={localize('DND5E.ContextMenuActionDuplicate')}
                    role="button"
                  >
                    <i class="fas fa-copy fa-fw" />
                  </a>
                  <a
                    class="item-control item-delete"
                    data-action="itemDelete"
                    title={localize('DND5E.ItemDelete')}
                    role="button"
                  >
                    <i class="fas fa-trash fa-fw" />
                  </a>
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
            <a
              on:click={() => createItem(backgroundSection.dataset)}
              title={localize('DND5E.FeatureAdd')}
              role="button"
            >
              <i class="fas fa-plus-circle" />
              {localize('DND5E.Add')}
            </a>
          </li>
        {/if}
      </ul>
    {/if}

    <!-- classes -->
    {#if allowEdit || classSection.items.length > 0}
      <li class="items-header features-header">
        <h3 class="item-name">{localize(classSection.label)}</h3>

        <div class="items-header-labels">
          <!-- <div class="items-header-subclass">{{localize 'TIDY5E.Subclass'}}</div> -->
          <div class="items-header-feat-source">{localize('DND5E.Source')}</div>
          <div class="items-header-level">{localize('DND5E.Level')}</div>
          <div class="items-header-controls" />
        </div>
      </li>
      <ul class="tidy5e-item-list">
        {#each classSection.items as item (item.id)}
          <li class="item" data-item-id={item.id}>
            <div class="item-name rollable">
              <div
                class="item-image"
                style="background-image: url('{item.img}')"
              >
                <i class="fa fa-dice-d20" />
              </div>
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

            {#if context.owner}
              <div
                class="item-controls flexrow"
                class:hidden={!classicControlsEnabled}
              >
                <a
                  class="item-control item-edit"
                  data-action="itemEdit"
                  title={localize('DND5E.ItemEdit')}
                  role="button"
                >
                  <i class="fas fa-edit fa-fw" />
                </a>
                {#if allowEdit}
                  <a
                    class="item-control item-duplicate"
                    data-action="itemDuplicate"
                    title={localize('DND5E.ContextMenuActionDuplicate')}
                    role="button"
                  >
                    <i class="fas fa-copy fa-fw" />
                  </a>
                  <a
                    class="item-control item-delete"
                    data-action="itemDelete"
                    title={localize('DND5E.ItemDelete')}
                    role="button"
                  >
                    <i class="fas fa-trash fa-fw" />
                  </a>
                {/if}
              </div>
            {/if}
          </li>
        {/each}
        {#if context.owner && allowEdit}
          <li class="items-footer">
            <a
              class="item-create"
              title={localize('DND5E.FeatureAdd')}
              role="button"
              {...mapDatasetToDataAttributes(classSection.dataset)}
            >
              <i class="fas fa-plus-circle" />
              {localize('DND5E.Add')}
            </a>
          </li>
        {/if}
      </ul>
    {/if}

    <!-- active abilities -->

    <!-- passive abilities -->
  </ul>
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
