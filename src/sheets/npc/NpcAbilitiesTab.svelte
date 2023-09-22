<script lang="ts">
  import SkillsList from 'src/components/attributes/SkillsList.svelte';
  import Traits from '../actor/Traits.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemLayoutMode, NpcSheetContext } from 'src/types/types';
  import Currency from '../actor/Currency.svelte';
  import ItemTableHeaderRow from 'src/components/items/ItemTableHeaderRow.svelte';
  import ItemTable from 'src/components/items/ItemTable.svelte';
  import ItemTableColumn from 'src/components/items/ItemTableColumn.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTableRow from 'src/components/items/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/items/ItemTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUseButton from 'src/components/items/ItemUseButton.svelte';
  import ItemName from 'src/components/items/ItemName.svelte';
  import ListItemQuantity from '../actor/ListItemQuantity.svelte';
  import ItemAddUses from 'src/components/items/ItemAddUses.svelte';
  import ItemDeleteControl from 'src/components/items/ItemDeleteControl.svelte';
  import ItemDuplicateControl from 'src/components/items/ItemDuplicateControl.svelte';
  import ItemEditControl from 'src/components/items/ItemEditControl.svelte';
  import ItemUses from 'src/components/items/ItemUses.svelte';
  import ItemControls from 'src/components/items/ItemControls.svelte';
  import ItemTableFooter from 'src/components/items/ItemTableFooter.svelte';
  import NpcLegendaryActions from './parts/NpcLegendaryActions.svelte';
  import SpellbookList from 'src/components/spellbook/SpellbookList.svelte';
  import NoSpells from '../actor/NoSpells.svelte';
  import SpellbookFooter from 'src/components/spellbook/SpellbookFooter.svelte';
  import ItemFilterLayoutToggle from 'src/components/items/ItemFilterLayoutToggle.svelte';
  import SpellbookGrid from 'src/components/spellbook/SpellbookGrid.svelte';
  import type { ItemCardContentComponent } from 'src/types/item';
  import InventoryItemCardContent from 'src/components/item-info-card/InventoryItemCardContent.svelte';
  import { currentSettings } from 'src/settings/settings';

  let store = getContext<Readable<NpcSheetContext>>('store');

  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit') === true;

  $: noSpellLevels = !$store.spellbook.length;

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag($store.actor, 'spellbook-grid');
      return;
    }

    FoundryAdapter.setFlag($store.actor, 'spellbook-grid', true);
  }

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($store.actor, 'spellbook-grid')
    ? 'grid'
    : 'list';

  let showNoSpellsView = false;
  const localize = FoundryAdapter.localize;

  function getInfoCardTemplate(section: any): ItemCardContentComponent | null {
    if (['weapon', 'loot'].includes(section.dataset.type)) {
      return InventoryItemCardContent;
    }
    return null;
  }
</script>

<section class="npc-abilities-content">
  <div class="side-panel">
    <SkillsList
      actor={$store.actor}
      toggleable={!$currentSettings.skillsAlwaysShownNpc}
    />
    {#if !$currentSettings.traitsMovedBelowResourceNpc}
      <Traits toggleable={!$currentSettings.traitsAlwaysShownNpc} />
    {/if}
  </div>
  <div class="main-panel">
    <NpcLegendaryActions />
    {#if $currentSettings.traitsMovedBelowResourceNpc}
      <Traits toggleable={!$currentSettings.traitsAlwaysShownNpc} />
    {/if}
    {#each $store.features as section}
      {#if allowEdit || section.items.length}
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
            {#if $store.owner}
              <ItemTableColumn baseWidth="7.5rem" />
            {/if}
          </ItemTableHeaderRow>
          {#each section.items as item}
            {@const ctx = $store.itemContext[item.id]}
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
              itemCardContentTemplate={getInfoCardTemplate(section)}
            >
              <ItemTableCell primary={true}>
                <ItemUseButton {item} />
                <ItemName
                  on:click={(event) =>
                    toggleSummary(event.detail, $store.actor)}
                  cssClass="extra-small-gap"
                >
                  <span class="truncate">{item.name}</span>
                  <ListItemQuantity {item} {ctx} />
                </ItemName>
              </ItemTableCell>
              {#if section.hasActions}
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
                        .value}{#if item.system.recharge?.value !== 6}+{/if}</a
                    >
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
              {#if $store.owner}
                <ItemTableCell baseWidth="7.5rem">
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
          {#if $store.owner && allowEdit && section.dataset}
            <ItemTableFooter actor={$store.actor} dataset={section.dataset} />
          {/if}
        </ItemTable>
      {/if}
    {/each}
    {#if $currentSettings.hideSpellbookTabNpc}
      {#if noSpellLevels}
        <h2
          class="spellbook-title toggle-spellbook"
          on:click={() => (showNoSpellsView = !showNoSpellsView)}
        >
          {localize('DND5E.Spellbook')}
          {#if showNoSpellsView}
            <i class="fas fa-caret-up" />
          {:else}
            <i class="fas fa-caret-down" />
          {/if}
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
            <NoSpells cssClass="flex-1" {allowEdit} />
          {:else}
            <div class="flex-1 small-padding-bottom flex-column small-gap">
              {#each $store.spellbook as section (section.label)}
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
                    classicControlsEnabled={true}
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
<footer class="abilities-tab-footer">
  <Currency actor={$store.actor} />
</footer>

<style lang="scss">
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

  .abilities-tab-footer {
    background-color: var(--t5ek-header-background);
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-shadow: 0 0 0.1875rem 0 var(--t5ek-tertiary-color);

    margin: 0 -0.25rem -1rem -1rem;

    :global(> *) {
      flex-basis: 30rem;
    }
  }
</style>
