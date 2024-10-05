<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterFeatureSection,
    type CharacterSheetContext,
    type RenderableClassicControl,
  } from 'src/types/types';
  import ItemEditControl from '../../../components/item-list/controls/ItemEditControl.svelte';
  import ItemDeleteControl from '../../../components/item-list/controls/ItemDeleteControl.svelte';
  import ItemTable from '../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemTableFooter from '../../../components/item-list/ItemTableFooter.svelte';
  import ItemTableCell from '../../../components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from '../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemUseButton from '../../../components/item-list/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemName from '../../../components/item-list/ItemName.svelte';
  import ItemUses from '../../../components/item-list/ItemUses.svelte';
  import ItemAddUses from '../../../components/item-list/ItemAddUses.svelte';
  import InlineFavoriteIcon from '../../../components/item-list/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../../../components/item-list/controls/ItemFavoriteControl.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable, type Readable } from 'svelte/store';
  import Notice from '../../../components/notice/Notice.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
  import type { Item5e } from 'src/types/item.types';
  import ClassicControls from 'src/sheets/shared/ClassicControls.svelte';
  import LevelUpDropdown from 'src/sheets/actor/LevelUpDropdown.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
    import { SettingsProvider } from 'src/settings/settings';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  $: features = SheetSections.configureFeatures(
    $context.features,
    $context,
    tabId,
    SheetPreferencesService.getByType($context.actor.type),
    TidyFlags.sectionConfig.get($context.actor)?.[tabId],
  );

  const localize = FoundryAdapter.localize;

  $: noFeatures =
    features.some(
      (section: CharacterFeatureSection) => section.items.length > 0,
    ) === false;

  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext(CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW, itemIdsToShow);

  $: {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: features,
      tabId: tabId,
    });
  }

  let searchCriteria: string = '';

  declareLocation('features');

  $: utilityBarCommands =
    $context.utilities[tabId]?.utilityToolbarCommands ?? [];

  let controls: RenderableClassicControl<{ item: Item5e }>[] = [];
  $: {
    controls = [
      {
        component: ItemFavoriteControl,
        props: ({ item }) => ({ item }),
      },
      {
        component: ItemEditControl,
        props: ({ item }) => ({ item }),
      },
    ];

    if ($context.unlocked) {
      controls.push({
        component: ItemDeleteControl,
        props: ({ item }) => ({ item }),
      });
    }

    if ($context.useActionsFeature) {
      controls.push({
        component: ActionFilterOverrideControl,
        props: ({ item }) => ({ item }),
      });
    }
  }

  let classicControlsIconWidth = 1.25;

  $: classicControlsColumnWidth = `${classicControlsIconWidth * controls.length}rem`;
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  <PinnedFilterToggles
    filterGroupName={tabId}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      $context.filterPins,
      $context.filterData,
      tabId,
    )}
  />
  <FilterMenu {tabId} />
  {#each utilityBarCommands as command (command.title)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      on:execute={(ev) => command.execute?.(ev.detail)}
    />
  {/each}
</UtilityToolbar>
<div
  class="scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  {#if noFeatures && !$context.unlocked}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {:else}
    {#each features as section (section.key)}
      {#if section.show}
        {@const visibleItemCount = ItemVisibility.countVisibleItems(
          section.items,
          $itemIdsToShow,
        )}

        {#if (searchCriteria.trim() === '' && $context.unlocked) || visibleItemCount > 0}
          <ItemTable
            key={section.key}
            data-custom-section={section.custom ? true : null}
          >
            <svelte:fragment slot="header">
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
                {#if $context.editable && $context.useClassicControls}
                  <ItemTableColumn baseWidth={classicControlsColumnWidth} />
                {/if}
              </ItemTableHeaderRow>
            </svelte:fragment>
            <svelte:fragment slot="body">
              {#each section.items as item (item.id)}
                {@const ctx = $context.itemContext[item.id]}
                <ItemTableRow
                  {item}
                  let:toggleSummary
                  on:mousedown={(event) =>
                    FoundryAdapter.editOnMiddleClick(event.detail, item)}
                  contextMenu={{
                    type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                    uuid: item.uuid,
                  }}
                  hidden={!!$itemIdsToShow && !$itemIdsToShow.has(item.id)}
                >
                  <ItemTableCell primary={true}>
                    <ItemUseButton disabled={!$context.editable} {item} />
                    <ItemName
                      on:toggle={() => toggleSummary($context.actor)}
                      hasChildren={false}
                      {item}
                    >
                      {#if ctx.parent}&rdsh;{/if}
                      {#if !section.isClass && item.type === 'subclass'}
                        <i class="fa-solid fa-link-slash align-self-center"></i>
                      {/if}
                      <span
                        data-tidy-item-name={item.name}
                        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                        >{item.name}</span
                      >
                      {#if item.isOriginalClass}<i
                          title={localize('DND5E.ClassOriginal')}
                          class="fas fa-crown primary-accent-color"
                        ></i>{/if}
                    </ItemName>
                  </ItemTableCell>
                  <!-- TODO: Handle more gracefully; it is sitting outside of any table cell -->
                  {#if SettingsProvider.settings.showIconsNextToTheItemName.get() && 'favoriteId' in ctx && !!ctx.favoriteId}
                    <InlineFavoriteIcon />
                  {/if}
                  {#if section.showUsesColumn}
                    <ItemTableCell baseWidth="3.125rem">
                      {#if item.isOnCooldown}
                        <RechargeControl {item} />
                      {:else if item.system.recharge?.value}
                        <i
                          class="fas fa-bolt"
                          title={localize('DND5E.Charged')}
                        />
                      {:else if ctx?.hasUses}
                        <ItemUses {item} />
                      {:else}
                        <ItemAddUses {item} />
                      {/if}
                    </ItemTableCell>
                  {/if}
                  {#if section.showUsagesColumn}
                    <ItemTableCell baseWidth="7.5rem">
                      {#if item.system.activation?.type}
                        {item.labels?.activation ?? ''}
                      {/if}
                    </ItemTableCell>
                  {/if}
                  {#if section.showLevelColumn}
                    <ItemTableCell baseWidth="7.5rem">
                      {#if item.type === 'class'}
                        <LevelUpDropdown
                          availableLevels={ctx?.availableLevels}
                          {item}
                          disabled={!$context.editable ||
                            $context.lockLevelSelector}
                        />
                      {/if}
                    </ItemTableCell>
                  {/if}
                  {#if section.showRequirementsColumn}
                    <ItemTableCell baseWidth="7.5rem">
                      <span
                        class="truncate"
                        title={item.system.requirements ?? ''}
                        >{item.system.requirements ?? ''}</span
                      >
                    </ItemTableCell>
                  {/if}
                  {#if $context.editable && $context.useClassicControls}
                    <ItemTableCell baseWidth={classicControlsColumnWidth}>
                      <ClassicControls {controls} params={{ item: item }} />
                    </ItemTableCell>
                  {/if}
                </ItemTableRow>
              {/each}
              {#if $context.unlocked}
                <ItemTableFooter
                  {section}
                  actor={$context.actor}
                  isItem={true}
                />
              {/if}
            </svelte:fragment>
          </ItemTable>
        {/if}
      {/if}
    {/each}
  {/if}
</div>
