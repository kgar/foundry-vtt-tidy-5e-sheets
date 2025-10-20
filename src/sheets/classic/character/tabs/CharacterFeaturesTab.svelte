<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterFeatureSection,
    type RenderableClassicControl,
  } from 'src/types/types';
  import ItemEditControl from '../../../../components/item-list/controls/ItemEditControl.svelte';
  import ItemDeleteControl from '../../../../components/item-list/controls/ItemDeleteControl.svelte';
  import ItemTable from '../../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemTableFooter from '../../../../components/item-list/ItemTableFooter.svelte';
  import ItemTableCell from '../../../../components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from '../../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemUseButton from '../../../../components/item-list/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemName from '../../../../components/item-list/ItemName.svelte';
  import ItemUses from '../../../../components/item-list/ItemUses.svelte';
  import InlineFavoriteIcon from '../../../../components/item-list/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../../../../components/item-list/controls/ItemFavoriteControl.svelte';
  import { getContext, type ComponentProps } from 'svelte';
  import Notice from '../../../../components/notice/Notice.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import FilterMenu from 'src/components/filter/FilterButton.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import type { Item5e } from 'src/types/item.types';
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import LevelUpDropdown from 'src/sheets/classic/actor/LevelUpDropdown.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { ItemUtils } from 'src/utils/ItemUtils';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import { isItemInActionList } from 'src/features/actions/actions.svelte';

  let context = $derived(getCharacterSheetContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const localize = FoundryAdapter.localize;

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let searchCriteria: string = $state('');

  declareLocation('features');

  let controls: RenderableClassicControl<{ item: Item5e }>[] = $derived.by(
    () => {
      let result: RenderableClassicControl<{ item: Item5e }>[] = [
        {
          component: ItemFavoriteControl,
          props: ({ item }) =>
            ({
              item,
              favorited: FoundryAdapter.isItemFavorited(item),
            }) satisfies ComponentProps<typeof ItemFavoriteControl>,
        },
        {
          component: ItemEditControl,
          props: ({ item }) =>
            ({ item }) satisfies ComponentProps<typeof ItemEditControl>,
        },
      ];

      if (context.unlocked) {
        result.push({
          component: ItemDeleteControl,
          props: ({ item }) =>
            ({ item }) satisfies ComponentProps<typeof ItemDeleteControl>,
        });
      }

      if (context.useActionsFeature) {
        result.push({
          component: ActionFilterOverrideControl,
          props: ({ item }) =>
            ({
              item,
              flagValue: TidyFlags.actionFilterOverride.get(item),
              active: isItemInActionList(item),
            }) satisfies ComponentProps<typeof ActionFilterOverrideControl>,
        });
      }

      return result;
    },
  );

  let classicControlsIconWidth = 1.25;

  let features = $derived(
    SheetSections.configureFeatures(
      context.features,
      context,
      tabId,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );
  let noFeatures = $derived(
    features.some(
      (section: CharacterFeatureSection) => section.items.length > 0,
    ) === false,
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: features,
      tabId: tabId,
    });
  });

  let utilityBarCommands = $derived(
    context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );

  let classicControlsColumnWidth = $derived(
    `${classicControlsIconWidth * controls.length}rem`,
  );
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  <PinnedFilterToggles
    filterGroupName={tabId}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    )}
  />
  <FilterMenu {tabId} />
  {#each utilityBarCommands as command (command.id)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      onExecute={(ev) => command.execute?.(ev)}
      sections={features}
    />
  {/each}
</UtilityToolbar>
<div
  class="scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  {#if noFeatures && !context.unlocked}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {:else}
    {#each features as section (section.key)}
      {#if section.show}
        {@const itemEntries = section.items.map((item) => ({
          item,
          ctx: context.itemContext[item.id],
        }))}
        {@const visibleItemCount = ItemVisibility.countVisibleItems(
          section.items,
          searchResults.uuids,
        )}

        {#if (searchCriteria.trim() === '' && context.unlocked) || visibleItemCount > 0}
          {@const visibleItemCount = ItemVisibility.countVisibleItems(
            section.items,
            searchResults.uuids,
          )}

          <ItemTable
            key={section.key}
            data-custom-section={section.custom ? true : null}
          >
            {#snippet header()}
              <ItemTableHeaderRow>
                <ItemTableColumn primary={true}>
                  {localize(section.label)}
                  <span class="item-table-count">{visibleItemCount}</span>
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
                {#if section.showFeatureTypeColumn}
                  <ItemTableColumn baseWidth="7.5rem">
                    {localize('DND5E.Type')}
                  </ItemTableColumn>
                {/if}
                {#if section.showRequirementsColumn}
                  <ItemTableColumn baseWidth="7.5rem">
                    {localize('DND5E.Requirements')}
                  </ItemTableColumn>
                {/if}
                {#if context.editable && context.useClassicControls}
                  <ItemTableColumn baseWidth={classicControlsColumnWidth} />
                {/if}
              </ItemTableHeaderRow>
            {/snippet}
            {#snippet body()}
              {#each itemEntries as { item, ctx } (item.id)}
                <ItemTableRow
                  {item}
                  onMouseDown={(event) =>
                    FoundryAdapter.editOnMiddleClick(event, item)}
                  contextMenu={{
                    type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                    uuid: item.uuid,
                  }}
                  hidden={!searchResults.show(item.uuid)}
                >
                  {#snippet children({ toggleSummary })}
                    <ItemTableCell primary={true}>
                      <ItemUseButton disabled={!context.editable} {item} />
                      <ItemName
                        onToggle={() => toggleSummary(context.actor)}
                        hasChildren={false}
                        {item}
                      >
                        {#if ctx.parent}&rdsh;{/if}
                        {#if !section.isClass && item.type === 'subclass'}
                          <i class="fa-solid fa-link-slash align-self-center"
                          ></i>
                        {/if}
                        <span
                          data-tidy-item-name={item.name}
                          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                          class="truncate flex-1">{item.name}</span
                        >
                        {#if item.isOriginalClass}<i
                            title={localize('DND5E.ClassOriginal')}
                            class="fas fa-crown primary-accent-color"
                          ></i>{/if}
                      </ItemName>
                      <div class="primary-cell-extras">
                        {#if !context.useClassicControls && 'favoriteId' in ctx && !!ctx.favoriteId}
                          <InlineFavoriteIcon />
                        {/if}
                      </div>
                    </ItemTableCell>
                    {#if section.showUsesColumn}
                      <ItemTableCell baseWidth="3.125rem">
                        {#if item.isOnCooldown}
                          <RechargeControl
                            document={item}
                            field={'system.uses.spent'}
                            uses={item.system.uses}
                          />
                        {:else if item.hasRecharge}
                          {@const remaining =
                            item.system.uses.max - item.system.uses.spent}
                          {#if remaining > 1}
                            <span>{remaining}</span>
                          {/if}
                          <i
                            class="fas fa-bolt"
                            title={localize('DND5E.Charged')}
                          ></i>
                        {:else if ctx?.hasUses}
                          <ItemUses {item} />
                        {:else}
                          <span class="text-body-tertiary">&mdash;</span>
                        {/if}
                      </ItemTableCell>
                    {/if}
                    {#if section.showUsagesColumn}
                      <ItemTableCell baseWidth="7.5rem">
                        {#if ItemUtils.hasActivationType(item)}
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
                            disabled={!context.editable ||
                              context.lockLevelSelector}
                          />
                        {/if}
                      </ItemTableCell>
                    {/if}
                    {#if section.showFeatureTypeColumn}
                      {#if item.system.type}
                        <!-- For now, unlinked subclasses fall into the Passive Features table, and this code causes the tab to crash because item.sytem.type.value triggers an error. -->
                        {@const label =
                          CONFIG.DND5E.featureTypes[item.system.type.value]
                            ?.label ?? item.system.type.value}
                        <ItemTableCell baseWidth="7.5rem">
                          <span
                            class="truncate"
                            title={item.system.type.value ?? ''}
                            >{label ?? ''}</span
                          >
                        </ItemTableCell>
                      {:else}
                        <!-- For broken/unlinked subclasses -->
                        <ItemTableCell baseWidth="7.5rem">—</ItemTableCell>
                      {/if}
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
                    {#if context.editable && context.useClassicControls}
                      <ItemTableCell baseWidth={classicControlsColumnWidth}>
                        <ClassicControls {controls} params={{ item: item }} />
                      </ItemTableCell>
                    {/if}
                  {/snippet}
                </ItemTableRow>
              {/each}
              {#if context.unlocked}
                <ItemTableFooter
                  {section}
                  actor={context.actor}
                  isItem={true}
                />
              {/if}
            {/snippet}
          </ItemTable>
        {/if}
      {/if}
    {/each}
  {/if}
</div>
