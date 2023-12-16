<script lang="ts">
  import SkillsList from 'src/sheets/actor/SkillsList.svelte';
  import Traits from '../../actor/Traits.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemLayoutMode, NpcSheetContext } from 'src/types/types';
  import Currency from '../../actor/Currency.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/ItemTableHeaderRow.svelte';
  import ItemTable from 'src/components/item-list/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/ItemTableColumn.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTableRow from 'src/components/item-list/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/item-list/ItemTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import ListItemQuantity from '../../actor/ListItemQuantity.svelte';
  import ItemAddUses from 'src/components/item-list/ItemAddUses.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemDuplicateControl from 'src/components/item-list/controls/ItemDuplicateControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import ItemUses from 'src/components/item-list/ItemUses.svelte';
  import ItemControls from 'src/components/item-list/controls/ItemControls.svelte';
  import ItemTableFooter from 'src/components/item-list/ItemTableFooter.svelte';
  import NpcLegendaryActions from '../parts/NpcLegendaryActions.svelte';
  import SpellbookList from 'src/components/spellbook/SpellbookList.svelte';
  import NoSpells from '../../actor/NoSpells.svelte';
  import SpellbookFooter from 'src/components/spellbook/SpellbookFooter.svelte';
  import ItemFilterLayoutToggle from 'src/components/item-list/ItemFilterLayoutToggle.svelte';
  import SpellbookGrid from 'src/components/spellbook/SpellbookGrid.svelte';
  import type { ItemCardContentComponent } from 'src/types/item';
  import InventoryItemCardContent from 'src/components/item-info-card/InventoryItemCardContent.svelte';
  import { settingStore } from 'src/settings/settings';
  import EncumbranceBar from '../../actor/EncumbranceBar.svelte';
  import TabFooter from '../../actor/TabFooter.svelte';
  import AmmoSelector from '../../actor/AmmoSelector.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';

  let context = getContext<Readable<NpcSheetContext>>('context');

  $: noSpellLevels = !$context.spellbook.length;

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag($context.actor, 'spellbook-grid');
      return;
    }

    FoundryAdapter.setFlag($context.actor, 'spellbook-grid', true);
  }

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($context.actor, 'spellbook-grid')
    ? 'grid'
    : 'list';

  let showNoSpellsView = false;
  const localize = FoundryAdapter.localize;
</script>

<section class="npc-abilities-content" data-tidy-track-scroll-y>
  <div class="side-panel">
    <SkillsList
      actor={$context.actor}
      toggleable={!$settingStore.alwaysShowNpcSkills}
      expanded={!!FoundryAdapter.tryGetFlag($context.actor, 'skillsExpanded')}
      toggleField="flags.{CONSTANTS.MODULE_ID}.skillsExpanded"
    />
    {#if !$settingStore.moveTraitsBelowNpcResources}
      <Traits toggleable={!$settingStore.alwaysShowNpcTraits} />
    {/if}
  </div>
  <div class="main-panel">
    <NpcLegendaryActions />
    {#if $settingStore.moveTraitsBelowNpcResources}
      <Traits toggleable={!$settingStore.alwaysShowNpcTraits} />
    {/if}
    {#each $context.features as section}
      {#if $context.unlocked || section.items.length}
        <ItemTable>
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
            {#if $context.editable && $context.useClassicControls}
              <ItemTableColumn baseWidth="7.5rem" />
            {/if}
          </ItemTableHeaderRow>
          {#each section.items as item}
            {@const ctx = $context.itemContext[item.id]}
            <ItemTableRow
              let:toggleSummary
              on:mousedown={(event) =>
                FoundryAdapter.editOnMiddleClick(event.detail, item)}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                id: item.id,
              }}
              {item}
              cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
            >
              <ItemTableCell primary={true}>
                <ItemUseButton {item} />
                <ItemName
                  on:toggle={() => toggleSummary($context.actor)}
                  cssClass="extra-small-gap"
                  {item}
                >
                  <span class="truncate">{item.name}</span>
                  {#if item.system?.properties?.amm}
                    <span class="ammo">
                      <AmmoSelector {item} />
                    </span>
                  {/if}
                  <ListItemQuantity {item} {ctx} />
                </ItemName>
              </ItemTableCell>
              {#if section.hasActions}
                <ItemTableCell baseWidth="3.125rem">
                  {#if ctx?.isOnCooldown}
                    <RechargeControl {item} />
                  {:else if item.system.recharge?.value}
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
              {/if}
              {#if $context.editable && $context.useClassicControls}
                <ItemTableCell baseWidth="7.5rem">
                  <ItemControls>
                    <ItemEditControl {item} />
                    {#if $context.unlocked}
                      <ItemDuplicateControl {item} />
                      <ItemDeleteControl {item} />
                    {/if}
                    {#if $context.useActionsFeature}
                      <ActionFilterOverrideControl {item} />
                    {/if}
                  </ItemControls>
                </ItemTableCell>
              {/if}
            </ItemTableRow>
          {/each}
          {#if $context.unlocked && section.dataset}
            <ItemTableFooter actor={$context.actor} dataset={section.dataset} />
          {/if}
        </ItemTable>
      {/if}
    {/each}
    {#if !$settingStore.showSpellbookTabNpc}
      {#if noSpellLevels}
        <h2>
          <button
            type="button"
            class="transparent-button spellbook-title toggle-spellbook"
            on:click={() => (showNoSpellsView = !showNoSpellsView)}
          >
            {localize('DND5E.Spellbook')}
            {#if showNoSpellsView}
              <i class="fas fa-caret-up" />
            {:else}
              <i class="fas fa-caret-down" />
            {/if}
          </button>
        </h2>
      {:else}
        <h2 class="spellbook-title">
          <span>{localize('DND5E.Spellbook')}</span>
          <ItemFilterLayoutToggle
            mode={layoutMode}
            element="span"
            on:toggle={() => toggleLayout()}
          />
        </h2>
      {/if}

      {#if !noSpellLevels || showNoSpellsView}
        <div class="flex-1 flex-column small-padding-bottom no-gap">
          {#if noSpellLevels}
            <NoSpells cssClass="flex-1" editable={$context.unlocked} />
          {:else}
            <div class="flex-1 small-padding-bottom flex-column small-gap">
              {#each $context.spellbook as section (section.label)}
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
    {/if}
  </div>
</section>
<TabFooter mode="vertical" cssClass="abilities-footer">
  <Currency actor={$context.actor} />
  {#if $settingStore.useNpcEncumbranceBar}
    <EncumbranceBar />
  {/if}
</TabFooter>

<style lang="scss">
  section {
    flex: 1;
  }

  :global(.tidy5e-kgar .abilities-footer) {
    flex: 0;
  }

  .npc-abilities-content {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
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
      border: 0.0625rem solid var(--t5ek-light-color);
      border-left: none;
      border-right: none;
      font-family: var(--t5ek-title-font-family);
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
</style>
