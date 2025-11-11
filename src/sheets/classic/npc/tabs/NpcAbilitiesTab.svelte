<script lang="ts">
  import SkillsList from 'src/sheets/classic/actor/SkillsList.svelte';
  import Traits from '../../actor/traits/Traits.svelte';
  import { getContext, type ComponentProps } from 'svelte';
  import type {
    ItemLayoutMode,
    RenderableClassicControl,
  } from 'src/types/types';
  import Currency from '../../actor/Currency.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import ItemUses from 'src/components/item-list/ItemUses.svelte';
  import ItemTableFooter from 'src/components/item-list/ItemTableFooter.svelte';
  import NpcLegendaryActions from '../parts/NpcLegendaryActions.svelte';
  import SpellbookList from 'src/components/spellbook/SpellbookList.svelte';
  import NoSpells from '../../actor/NoSpells.svelte';
  import SpellbookFooter from 'src/components/spellbook/SpellbookFooter.svelte';
  import ItemFilterLayoutToggle from 'src/components/item-list/ItemFilterLayoutToggle.svelte';
  import SpellbookGrid from 'src/components/spellbook/SpellbookGrid.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import EncumbranceBar from '../../actor/EncumbranceBar.svelte';
  import TabFooter from '../../actor/TabFooter.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import FilterMenu from 'src/components/filter/FilterButton.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import type { Item5e } from 'src/types/item.types';
  import LevelUpDropdown from 'src/sheets/classic/actor/LevelUpDropdown.svelte';
  import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication.svelte';
  import ItemControl from 'src/components/item-list/controls/ItemControl.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import InlineContainerView from 'src/sheets/classic/container/InlineContainerView.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';
  import { isItemInActionList } from 'src/features/actions/actions.svelte';
  import NpcSheetClassicRuntime from 'src/runtime/actor/NpcSheetClassicRuntime.svelte';

  let context = $derived(getNpcSheetContext());
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let noSpellLevels = $derived(!context.spellbook.length);

  let utilityBarCommands = $derived(
    context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );

  let features = $derived(
    SheetSections.configureFeatures(
      context.features,
      context,
      tabId,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  let searchCriteria: string = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let spellbook = $derived(
    !settings.value.showSpellbookTabNpc
      ? SheetSections.configureSpellbook(
          context.actor,
          tabId,
          context.spellbook,
        )
      : [],
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: [...features, ...spellbook],
      tabId: tabId,
    });
  });

  function toggleLayout() {
    if (layoutMode === 'grid') {
      TidyFlags.spellbookGrid.unset(context.actor);
      return;
    }

    TidyFlags.spellbookGrid.set(context.actor);
  }

  let layoutMode: ItemLayoutMode = $derived(
    TidyFlags.spellbookGrid.get(context.actor) ? 'grid' : 'list',
  );

  let showNoSpellsView = $state(false);
  const localize = FoundryAdapter.localize;

  declareLocation('abilities');

  let controls: RenderableClassicControl<{ item: Item5e }>[] = $derived.by(
    () => {
      let result: RenderableClassicControl<{ item: Item5e }>[] = [
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
          visible: ({ item }) => item.canDelete,
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
  let classicControlsColumnWidth = $derived(
    `${classicControlsIconWidth * controls.length}rem`,
  );
</script>

<UtilityToolbar class="abilities-toolbar">
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

<section class="npc-abilities-content" data-tidy-track-scroll-y>
  <div class="side-panel">
    <SkillsList
      actor={context.actor}
      toggleable={!settings.value.alwaysShowNpcSkills}
      expanded={!!TidyFlags.skillsExpanded.get(context.actor)}
      toggleField={TidyFlags.skillsExpanded.prop}
      defaultSkills={context.defaultSkills}
    />
    {#if !settings.value.moveNpcTraitsToRightOfSkills}
      <Traits />
    {/if}
  </div>
  <div
    class="main-panel"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NPC_ABILITIES_CONTAINER}
  >
    {#if context.hasLegendaries || context.unlocked}
      <NpcLegendaryActions />
    {/if}
    {#if settings.value.moveNpcTraitsToRightOfSkills}
      <Traits />
    {/if}
    {#each features as section (section.key)}
      {#if section.show}
        {@const featureEntries = section.items.map((item) => ({
          item,
          ctx: context.itemContext[item.id],
        }))}
        {@const visibleItemCount = ItemVisibility.countVisibleItems(
          section.items,
          searchResults.uuids,
        )}
        {#if context.unlocked || visibleItemCount > 0}
          <ItemTable
            key={section.key}
            data-custom-section={section.custom ? true : null}
          >
            {#snippet header()}
              <ItemTableHeaderRow>
                <ItemTableColumn primary={true}>
                  {localize(section.label)}
                  <span class="item-table-count">{section.items.length}</span>
                </ItemTableColumn>
                {#if section.hasActions || section.hasUses}
                  <ItemTableColumn baseWidth="3.125rem">
                    {localize('DND5E.Uses')}
                  </ItemTableColumn>
                {/if}
                {#if section.hasActions}
                  <ItemTableColumn baseWidth="7.5rem">
                    {localize('DND5E.Usage')}
                  </ItemTableColumn>
                {/if}
                {#if section.dataset.type === 'loot'}
                  <ItemTableColumn baseWidth="3rem">
                    {localize('DND5E.QuantityAbbr')}
                  </ItemTableColumn>
                {/if}
                {#if context.editable && context.useClassicControls}
                  <ItemTableColumn baseWidth={classicControlsColumnWidth} />
                {/if}
              </ItemTableHeaderRow>
            {/snippet}
            {#snippet body()}
              {#each featureEntries as { item, ctx } (item.id)}
                <ItemTableRow
                  onMouseDown={(event) =>
                    FoundryAdapter.editOnMiddleClick(event, item)}
                  contextMenu={{
                    type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                    uuid: item.uuid,
                  }}
                  {item}
                  cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
                  hidden={!searchResults.show(item.uuid)}
                >
                  {#snippet children({ toggleSummary })}
                    <ItemTableCell primary={true}>
                      <ItemUseButton disabled={!context.editable} {item} />
                      {#if 'containerContents' in ctx && !!ctx.containerContents}
                        <InlineToggleControl
                          entityId={item.id}
                          {inlineToggleService}
                        />
                      {/if}
                      <ItemName
                        onToggle={() => toggleSummary(context.actor)}
                        cssClass="extra-small-gap"
                        {item}
                      >
                        {#if ctx.parent}&rdsh;{/if}
                        {#if !section.isClass && item.type === 'subclass'}
                          <i class="fa-solid fa-link-slash align-self-center"
                          ></i>
                        {/if}
                        <span
                          class="truncate flex-1"
                          data-tidy-item-name={item.name}
                          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                          >{item.name}</span
                        >
                      </ItemName>
                      {#if item.type === 'class'}
                        <LevelUpDropdown
                          availableLevels={ctx?.availableLevels}
                          {item}
                          disabled={!context.editable ||
                            context.lockLevelSelector}
                        />
                      {/if}
                    </ItemTableCell>
                    {#if section.hasActions || section.hasUses}
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
                    {#if section.hasActions}
                      <ItemTableCell baseWidth="7.5rem">
                        {#if ItemUtils.hasActivationType(item)}
                          {item.labels?.activation ?? ''}
                        {/if}
                      </ItemTableCell>
                    {/if}
                    {#if section.dataset.type === 'loot'}
                      <ItemTableCell baseWidth="3rem">
                        <TextInput
                          document={item}
                          field="system.quantity"
                          value={item.system.quantity}
                          selectOnFocus={true}
                          disabled={!context.editable ||
                            context.lockItemQuantity}
                          placeholder="0"
                          allowDeltaChanges={true}
                          class="text-align-center"
                        />
                      </ItemTableCell>
                    {/if}
                    {#if context.editable && context.useClassicControls}
                      <ItemTableCell baseWidth={classicControlsColumnWidth}>
                        <ClassicControls {controls} params={{ item }} />
                      </ItemTableCell>
                    {/if}
                  {/snippet}
                </ItemTableRow>
                {#if 'containerContents' in ctx && !!ctx.containerContents}
                  <InlineContainerView
                    container={item}
                    containerContents={ctx.containerContents}
                    editable={context.editable}
                    {inlineToggleService}
                    lockItemQuantity={context.lockItemQuantity}
                    sheetDocument={context.actor}
                    unlocked={context.unlocked}
                  />
                {/if}
              {/each}
              {#if context.unlocked && section.dataset}
                <ItemTableFooter
                  actor={context.actor}
                  {section}
                  isItem={true}
                />
              {/if}
            {/snippet}
          </ItemTable>
        {/if}
      {/if}
    {/each}
    {#if !settings.value.showSpellbookTabNpc}
      {#if noSpellLevels}
        <h2>
          <button
            type="button"
            class="transparent-button spellbook-title toggle-spellbook"
            onclick={() => (showNoSpellsView = !showNoSpellsView)}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          >
            {localize('DND5E.Spellbook')}
            {#if showNoSpellsView}
              <i class="fas fa-caret-up"></i>
            {:else}
              <i class="fas fa-caret-down"></i>
            {/if}
          </button>
        </h2>
      {:else}
        <h2 class="spellbook-title">
          <span>{localize('DND5E.Spellbook')}</span>
          <span class="flex-row extra-small-gap">
            <ItemFilterLayoutToggle
              mode={layoutMode}
              element="span"
              onToggle={() => toggleLayout()}
            />
            <ItemControl
              iconCssClass="fas fa-cog"
              title="TIDY5E.Utilities.ConfigureSections"
              onclick={() =>
                new DocumentTabSectionConfigApplication(
                  {
                    sections: context.spellbook,
                    tabId: CONSTANTS.TAB_ACTOR_SPELLBOOK,
                    tabTitle: NpcSheetClassicRuntime.getTabTitle(
                      CONSTANTS.TAB_ACTOR_SPELLBOOK,
                    ),
                  },
                  {
                    document: context.actor,
                  },
                ).render(true)}
            />
          </span>
        </h2>
      {/if}

      <div
        class="flex-1 flex-column small-padding-bottom no-gap"
        class:hidden={noSpellLevels && !showNoSpellsView}
      >
        {#if noSpellLevels}
          <NoSpells cssClass="flex-1" editable={context.unlocked} />
        {:else}
          <div class="flex-1 small-padding-bottom flex-column small-gap">
            {#each spellbook as section (section.key)}
              {#if section.show}
                {#if layoutMode === 'list'}
                  <SpellbookList
                    {section}
                    allowFavorites={false}
                    includeRange={false}
                    includeSchool={false}
                    spellComponentsBaseWidth="3.125rem"
                    targetBaseWidth="5.625rem"
                    usageBaseWidth="5.625rem"
                  />
                {:else}
                  <SpellbookGrid {section} />
                {/if}
              {/if}
            {/each}
          </div>
        {/if}

        <SpellbookFooter
          includeAttackMod={false}
          includePreparedSpells={false}
          cssClass="npc-abilities-spellbook-footer"
        />
      </div>
    {/if}
  </div>
</section>
<TabFooter mode="vertical" cssClass="abilities-footer">
  <Currency document={context.actor} />
  {#if settings.value.useNpcEncumbranceBar && context.encumbrance}
    <EncumbranceBar encumbrance={context.encumbrance} />
  {/if}
</TabFooter>

<style lang="less">
  section {
    flex: 1;
  }

  :global(.tidy5e-sheet .abilities-footer) {
    flex: 0;
  }

  .npc-abilities-content {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding-right: 0.75rem;
    overflow-y: scroll;

    > .side-panel {
      flex: 0 0 13.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    > .main-panel {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 0;
      height: auto;
      gap: 0.5rem;
    }

    .spellbook-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.25rem 0.125rem 0;
      margin-top: 0.5rem;
      line-height: 1;
      border: 0.0625rem solid var(--t5e-light-color);
      border-left: none;
      border-right: none;
      font-family: var(--t5e-title-font-family);
      font-weight: 700;
      font-size: 1.125rem;

      &.toggle-spellbook {
        opacity: 0.4;
        transition: opacity 0.3s ease;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }
      }

      :global(.toggle-layout) {
        list-style: none;
        margin: 0;
        padding: 0;
        padding-top: 0.125rem;
        line-height: 0.75;
        font-size: 0.875rem;
      }
    }

    :global(.npc-abilities-spellbook-footer) {
      margin: 0 0 -0.5rem 0;
      padding: 0.375rem 0.25rem;
    }
    :global(.npc-abilities-spellbook-footer h3) {
      font-size: 1.125rem;
    }
    :global(.npc-abilities-spellbook-footer input) {
      height: 1.125rem;
    }
  }

  .main-panel :global(.legendary-wrapper:not(.legendary-expanded)) {
    margin-bottom: -0.5rem;
  }
</style>
