<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import { SettingsProvider } from 'src/settings/settings';
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
  import SpellComponents from './SpellComponents.svelte';
  import SpellPrepareControl from '../spellbook/SpellPrepareControl.svelte';
  import SpellSlotMarkers from '../spellbook/SpellSlotMarkers.svelte';
  import SpellSlotUses from '../spellbook/SpellSlotUses.svelte';
  import InlineFavoriteIcon from '../shared/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../items/ItemFavoriteControl.svelte';
    import { getContext } from 'svelte';
    import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');
  export let section: any;
  export let spells: any[];

  const localize = FoundryAdapter.localize;
  const classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();
  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit');
  $: classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';
  const hideIconsNextToTheItemName =
    SettingsProvider.settings.hideIconsNextToTheItemName.get();
</script>

<section class="spellbook-list-section">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        <span class="spell-primary-column-label">
          {section.label}
        </span>
        {#if section.usesSlots}
          {#if !SettingsProvider.settings.hideSpellSlotMarker.get()}
            <SpellSlotMarkers {section} />
          {/if}
          <SpellSlotUses {section} />
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
    {#each spells as spell (spell.id)}
      {@const ctx = $store.itemContext[spell.id]}
      {@const spellImgUrl = FoundryAdapter.getSpellImageUrl($store, spell)}
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
          <ItemUseButton item={spell} imgUrlOverride={spellImgUrl} />
          <ItemName
            on:click={(event) => toggleSummary(event.detail, $store.actor)}
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
          <InlineFavoriteIcon />
        {/if}
        <ItemTableCell baseWidth="4.375rem" cssClass="no-gap">
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
        {#if $store.owner && classicControlsEnabled}
          <ItemTableCell baseWidth={classicControlsBaseWidth}>
            <ItemControls>
              {#if spell.system.preparation?.mode === 'always'}
                <span />
              {:else if section.canPrepare}
                <SpellPrepareControl {ctx} {spell} />
              {/if}
              <ItemFavoriteControl item={spell} />
              <ItemEditControl item={spell} />
              {#if allowEdit}
                <ItemDuplicateControl item={spell} />
                <ItemDeleteControl item={spell} />
              {/if}
            </ItemControls>
          </ItemTableCell>
        {/if}
      </ItemTableRow>
    {/each}
    {#if $store.owner && allowEdit}
      <ItemTableFooter actor={$store.actor} dataset={section.dataset} />
    {/if}
  </ItemTable>
</section>

<style lang="scss">
  .spell-primary-column-label {
    font-size: 0.75rem;
    line-height: 0.75rem;
    flex: 0 0 3.75rem;
    white-space: nowrap;
  }
</style>
