<script lang="ts">
  import SkillsList from 'src/sheets/actor/SkillsList.svelte';
  import Traits from '../../actor/traits/Traits.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable, type Readable } from 'svelte/store';
  import type {
    ItemLayoutMode,
    NpcSheetContext,
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
  import ItemAddUses from 'src/components/item-list/ItemAddUses.svelte';
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
  import EncumbranceBar from '../../actor/EncumbranceBar.svelte';
  import TabFooter from '../../actor/TabFooter.svelte';
  import AmmoSelector from '../../actor/AmmoSelector.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ClassicControls from 'src/sheets/shared/ClassicControls.svelte';
  import type { Item5e } from 'src/types/item.types';
  import LevelUpDropdown from 'src/sheets/actor/LevelUpDropdown.svelte';
  import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication';
  import ItemControl from 'src/components/item-list/controls/ItemControl.svelte';
  import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import InlineContainerToggle from 'src/sheets/container/InlineContainerToggle.svelte';
  import type { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import InlineContainerView from 'src/sheets/container/InlineContainerView.svelte';
  import { SettingsProvider } from 'src/settings/settings';

  let context = getContext<Readable<NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineContainerToggleService = getContext<InlineContainerToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_CONTAINER_TOGGLE_SERVICE,
  );

  $: noSpellLevels = !$context.spellbook.length;

  $: utilityBarCommands =
    $context.utilities[tabId]?.utilityToolbarCommands ?? [];

  $: features = SheetSections.configureFeatures(
    $context.features,
    $context,
    tabId,
    SheetPreferencesService.getByType($context.actor.type),
    TidyFlags.sectionConfig.get($context.actor)?.[tabId],
  );

  let searchCriteria: string = '';

  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext(CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW, itemIdsToShow);

  $: spellbook = !SettingsProvider.settings.showSpellbookTabNpc.get()
    ? SheetSections.configureSpellbook(
        $context.actor,
        tabId,
        $context.spellbook,
      )
    : [];

  $: {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: [...features, ...spellbook],
      tabId: tabId,
    });
  }

  function toggleLayout() {
    if (layoutMode === 'grid') {
      TidyFlags.spellbookGrid.unset($context.actor);
      return;
    }

    TidyFlags.spellbookGrid.set($context.actor);
  }

  let layoutMode: ItemLayoutMode;
  $: layoutMode = TidyFlags.spellbookGrid.get($context.actor) ? 'grid' : 'list';

  let showNoSpellsView = false;
  const localize = FoundryAdapter.localize;

  declareLocation('abilities');

  let controls: RenderableClassicControl<{ item: Item5e }>[] = [];
  $: {
    controls = [
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

<UtilityToolbar class="abilities-toolbar">
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

<section class="npc-abilities-content" data-tidy-track-scroll-y>
  <div class="side-panel">
    <SkillsList
      actor={$context.actor}
      toggleable={!SettingsProvider.settings.alwaysShowNpcSkills.get()}
      expanded={!!TidyFlags.skillsExpanded.get($context.actor)}
      toggleField={TidyFlags.skillsExpanded.prop}
    />
    {#if !SettingsProvider.settings.moveTraitsBelowNpcResources.get()}
      <Traits
        toggleable={!SettingsProvider.settings.alwaysShowNpcTraits.get()}
      />
    {/if}
  </div>
  <div
    class="main-panel"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NPC_ABILITIES_CONTAINER}
  >
    <ExpandableContainer
      expanded={$context.showLegendaryToolbar}
      class="legendary-wrapper {$context.showLegendaryToolbar
        ? 'legendary-expanded'
        : ''}"
    >
      <NpcLegendaryActions />
    </ExpandableContainer>
    {#if SettingsProvider.settings.moveTraitsBelowNpcResources.get()}
      <Traits
        toggleable={!SettingsProvider.settings.alwaysShowNpcTraits.get()}
      />
    {/if}
    {#each features as section (section.key)}
      {#if section.show}
        {@const visibleItemCount = ItemVisibility.countVisibleItems(
          section.items,
          $itemIdsToShow,
        )}
        {#if $context.unlocked || visibleItemCount > 0}
          <ItemTable
            key={section.key}
            data-custom-section={section.custom ? true : null}
          >
            <svelte:fragment slot="header">
              <ItemTableHeaderRow>
                <ItemTableColumn primary={true}>
                  {localize(section.label)}
                </ItemTableColumn>
                {#if section.hasActions}
                  <ItemTableColumn baseWidth="3.125rem">
                    {localize('DND5E.Uses')}
                  </ItemTableColumn>
                  <ItemTableColumn baseWidth="7.5rem">
                    {localize('DND5E.Usage')}
                  </ItemTableColumn>
                {/if}
                {#if section.dataset.type === 'loot'}
                  <ItemTableColumn baseWidth="3rem">
                    {localize('DND5E.QuantityAbbr')}
                  </ItemTableColumn>
                {/if}
                {#if $context.editable && $context.useClassicControls}
                  <ItemTableColumn baseWidth={classicControlsColumnWidth} />
                {/if}
              </ItemTableHeaderRow>
            </svelte:fragment>
            <svelte:fragment slot="body">
              {#each section.items as item}
                {@const ctx = $context.itemContext[item.id]}
                <ItemTableRow
                  let:toggleSummary
                  on:mousedown={(event) =>
                    FoundryAdapter.editOnMiddleClick(event.detail, item)}
                  contextMenu={{
                    type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                    uuid: item.uuid,
                  }}
                  {item}
                  cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
                  hidden={!!$itemIdsToShow && !$itemIdsToShow.has(item.id)}
                >
                  <ItemTableCell primary={true}>
                    <ItemUseButton disabled={!$context.editable} {item} />
                    {#if 'containerContents' in ctx && !!ctx.containerContents}
                      <InlineContainerToggle
                        {item}
                        {inlineContainerToggleService}
                      />
                    {/if}
                    <ItemName
                      on:toggle={() => toggleSummary($context.actor)}
                      cssClass="extra-small-gap"
                      {item}
                    >
                      {#if ctx.parent}&rdsh;{/if}
                      {#if !section.isClass && item.type === 'subclass'}
                        <i class="fa-solid fa-link-slash align-self-center"></i>
                      {/if}
                      <span
                        class="truncate"
                        data-tidy-item-name={item.name}
                        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                        >{item.name}</span
                      >
                      {#if item.system?.properties?.has('amm')}
                        <span class="ammo">
                          <AmmoSelector {item} />
                        </span>
                      {/if}
                    </ItemName>
                    {#if item.type === 'class'}
                      <LevelUpDropdown
                        availableLevels={ctx?.availableLevels}
                        {item}
                        disabled={!$context.editable ||
                          $context.lockLevelSelector}
                      />
                    {/if}
                  </ItemTableCell>
                  {#if section.hasActions}
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
                    <ItemTableCell baseWidth="7.5rem">
                      {#if item.system.activation?.type}
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
                        disabled={!$context.editable ||
                          $context.lockItemQuantity}
                        placeholder="0"
                        allowDeltaChanges={true}
                        class="text-align-center"
                      />
                    </ItemTableCell>
                  {/if}
                  {#if $context.editable && $context.useClassicControls}
                    <ItemTableCell baseWidth={classicControlsColumnWidth}>
                      <ClassicControls {controls} params={{ item }} />
                    </ItemTableCell>
                  {/if}
                </ItemTableRow>
                {#if 'containerContents' in ctx && !!ctx.containerContents}
                  <InlineContainerView
                    container={item}
                    containerContents={ctx.containerContents}
                    editable={$context.editable}
                    {inlineContainerToggleService}
                    lockItemQuantity={$context.lockItemQuantity}
                    sheetDocument={$context.actor}
                    unlocked={$context.unlocked}
                  />
                {/if}
              {/each}
              {#if $context.unlocked && section.dataset}
                <ItemTableFooter
                  actor={$context.actor}
                  {section}
                  isItem={true}
                />
              {/if}
            </svelte:fragment>
          </ItemTable>
        {/if}
      {/if}
    {/each}
    {#if !SettingsProvider.settings.showSpellbookTabNpc.get()}
      {#if noSpellLevels}
        <h2>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="transparent-button spellbook-title toggle-spellbook"
            on:click={() => (showNoSpellsView = !showNoSpellsView)}
          >
            {localize('DND5E.Spellbook')}
            {#if showNoSpellsView}
              <i class="fas fa-caret-up" />
            {:else}
              <i class="fas fa-caret-down" />
            {/if}
          </a>
        </h2>
      {:else}
        <h2 class="spellbook-title">
          <span>{localize('DND5E.Spellbook')}</span>
          <span class="flex-row extra-small-gap">
            <ItemFilterLayoutToggle
              mode={layoutMode}
              element="span"
              on:toggle={() => toggleLayout()}
            />
            <ItemControl
              iconCssClass="fas fa-cog"
              title="TIDY5E.Utilities.ConfigureSections"
              onclick={() =>
                new DocumentTabSectionConfigApplication({
                  document: $context.actor,
                  sections: $context.spellbook,
                  tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
                  tabTitle: NpcSheetRuntime.getTabTitle(
                    CONSTANTS.TAB_NPC_SPELLBOOK,
                  ),
                }).render(true)}
            />
          </span>
        </h2>
      {/if}

      <div
        class="flex-1 flex-column small-padding-bottom no-gap"
        class:hidden={noSpellLevels && !showNoSpellsView}
      >
        {#if noSpellLevels}
          <NoSpells cssClass="flex-1" editable={$context.unlocked} />
        {:else}
          <div class="flex-1 small-padding-bottom flex-column small-gap">
            {#each spellbook as section (section.key)}
              {#if section.show}
                {#if layoutMode === 'list'}
                  <SpellbookList
                    spells={section.spells}
                    {section}
                    allowFavorites={false}
                    includeRange={false}
                    includeSchool={false}
                    spellComponentsBaseWidth="3.125rem"
                    targetBaseWidth="5.625rem"
                    usageBaseWidth="5.625rem"
                  />
                {:else}
                  <SpellbookGrid spells={section.spells} {section} />
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
  <Currency document={$context.actor} />
  {#if SettingsProvider.settings.useNpcEncumbranceBar.get()}
    <EncumbranceBar />
  {/if}
</TabFooter>

<style lang="scss">
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
