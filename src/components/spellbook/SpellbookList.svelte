<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import ItemContext from '../items/ItemContext.svelte';
  import ItemControls from '../items/ItemControls.svelte';
  import ItemDeleteControl from '../items/ItemDeleteControl.svelte';
  import ItemDuplicateControl from '../items/ItemDuplicateControl.svelte';
  import ItemEditControl from '../items/ItemEditControl.svelte';
  import ItemName from '../items/ItemName.svelte';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemTableFooter from '../items/ItemTableFooter.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import ItemUseButton from '../items/ItemUseButton.svelte';
  import ItemUses from '../items/ItemUses.svelte';
  import SpellComponents from '../items/SpellComponents.svelte';
  import SpellPrepareControl from '../items/SpellPrepareControl.svelte';
  import SpellSlotMarkers from '../items/SpellSlotMarkers.svelte';
  import SpellSlotUses from '../items/SpellSlotUses.svelte';

  export let context: CharacterSheetContext;
  export let section: any;
  export let spells: any[];

  const localize = FoundryAdapter.localize;
  const classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');
  const classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';
  const hideIconsNextToTheItemName =
    SettingsProvider.settings.hideIconsNextToTheItemName.get();
</script>

<section class="spellbook-section">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        <span class="spell-primary-column-label">
          {section.label}
        </span>
        {#if section.usesSlots}
          {#if !SettingsProvider.settings.hideSpellSlotMarker.get()}
            <SpellSlotMarkers {context} {section} />
          {/if}
          <SpellSlotUses {context} {section} />
        {/if}
      </ItemTableColumn>
      <ItemTableColumn
        baseWidth="4.375rem"
        title={localize('DND5E.SpellComponents')}
      >
        <i class="fas fa-mortar-pestle" />
      </ItemTableColumn>
      <ItemTableColumn
        baseWidth="5.625rem"
        title={localize('DND5E.SpellSchool')}
      >
        <i class="fas fa-hat-wizard" />
      </ItemTableColumn>
      <ItemTableColumn baseWidth="7.5rem" title={localize('DND5E.SpellTarget')}>
        {localize('DND5E.Target')}
      </ItemTableColumn>
      <ItemTableColumn
        baseWidth="4.375rem"
        title={localize('DND5E.SpellRange')}
      >
        {localize('DND5E.Range')}
      </ItemTableColumn>
      <ItemTableColumn title={localize('DND5E.SpellUsage')} baseWidth="7.5rem">
        {localize('DND5E.Usage')}
      </ItemTableColumn>
      <ItemTableColumn baseWidth={classicControlsBaseWidth} />
    </ItemTableHeaderRow>
    {#each spells as spell}
      <ItemTableRow
        item={spell}
        on:mousedown={(event) =>
          FoundryAdapter.editOnMiddleClick(event.detail, spell)}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
          id: spell.id,
        }}
        let:toggleSummary
        cssClass={FoundryAdapter.getSpellRowClasses(spell)}
      >
        <ItemTableCell primary={true}>
          <ItemUseButton item={spell} />
          <ItemName
            on:click={(event) => toggleSummary(event.detail, context.actor)}
          >
            {spell.name}
          </ItemName>
        </ItemTableCell>
        {#if spell.system.uses.per}
          <ItemTableCell baseWidth="3.125rem">
            <ItemUses item={spell} />
          </ItemTableCell>
        {/if}
        {#if !hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(spell, 'favorite')}
          <div class="item-state-icon" title="Favorite">
            <i class="fas fa-bookmark icon-fav" />
          </div>
        {/if}
        <ItemTableCell baseWidth="4.375rem" cssClass="components">
          <SpellComponents {spell} />
        </ItemTableCell>
        <ItemTableCell
          baseWidth="5.625rem"
          title="{localize('DND5E.SpellSchool')}: {spell.labels.school}"
        >
          <span class="truncate">{spell.labels.school}</span>
        </ItemTableCell>
        <ItemTableCell
          baseWidth="7.5rem"
          title="{localize('DND5E.Target')}: {spell.labels.target}"
        >
          {#if spell.labels.target}
            {spell.labels.target}
          {:else}
            {localize('DND5E.None')}
          {/if}
        </ItemTableCell>
        <ItemTableCell
          baseWidth="4.375rem"
          title="{localize('DND5E.Range')}: {spell.labels.range}"
        >
          {spell.labels.range}
        </ItemTableCell>
        <ItemTableCell baseWidth="7.5rem" title={localize('DND5E.SpellUsage')}>
          {spell.labels.activation}
        </ItemTableCell>
        {#if context.owner && classicControlsEnabled}
          <ItemTableCell baseWidth={classicControlsBaseWidth}>
            <ItemContext item={spell} itemContext={context.itemContext} let:ctx>
              <ItemControls>
                {#if spell.system.preparation?.mode === 'always'}
                  <span />
                {:else if section.canPrepare}
                  <SpellPrepareControl {ctx} {spell} />
                {/if}
                <ItemEditControl item={spell} />
                {#if allowEdit}
                  <ItemDuplicateControl item={spell} />
                  <ItemDeleteControl item={spell} />
                {/if}
              </ItemControls>
            </ItemContext>
          </ItemTableCell>
        {/if}
      </ItemTableRow>
    {/each}
    <ItemTableFooter actor={context.actor} dataset={section.dataset} />
  </ItemTable>
</section>

<style lang="scss">
  .spell-primary-column-label {
    font-size: 0.75rem;
    line-height: 0.75rem;
    flex: 0 0 3.75rem;
    white-space: nowrap;
  }

  .spellbook-section {
    :global(.prepared) {
      background-color: var(--t5e-equipped);
    }

    :global(.always-prepared) {
      background-color: var(--t5e-alwaysprepared);
    }

    :global(.pact) {
      background-color: var(--t5e-pact);
    }

    :global(.at-will) {
      background-color: var(--t5e-atwill);
    }

    :global(.innate) {
      background-color: var(--t5e-innate);
    }
    :global(.components) {
      gap: 0;
    }
  }
</style>
