<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
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
  import SpellbookItemCardContent from '../item-info-card/SpellbookItemCardContent.svelte';
  import { currentSettings } from 'src/settings/settings';

  let store = getContext<Readable<ActorSheetContext>>('store');
  export let section: any;
  export let spells: any[];
  export let classicControlsEnabled: boolean;
  export let allowFavorites: boolean = true;
  export let cssClass: string | null = null;

  // TODO: replace this with column specification array default and then allow the caller to customize the table.
  export let includeSchool: boolean = true;
  export let includeRange: boolean = true;
  export let spellComponentsBaseWidth: string = '4.375rem';
  export let targetBaseWidth: string = '7.5rem';
  export let usageBaseWidth: string = '7.5rem';
  export let controlsBaseWidthLocked: string = '5.3125rem';
  export let controlsBaseWidthUnlocked: string = '7.5rem';

  const localize = FoundryAdapter.localize;

  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit');
  $: classicControlsBaseWidth = allowEdit
    ? controlsBaseWidthUnlocked
    : controlsBaseWidthLocked;
</script>

<section class="spellbook-list-section {cssClass}">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        <span class="spell-primary-column-label">
          {section.label}
        </span>
        {#if section.usesSlots}
          {#if !$currentSettings.hideSpellSlotMarker}
            <SpellSlotMarkers {section} />
          {/if}
          <SpellSlotUses {section} />
        {/if}
      </ItemTableColumn>
      <ItemTableColumn
        baseWidth={spellComponentsBaseWidth}
        title={localize('DND5E.SpellComponents')}
      >
        <i class="fas fa-mortar-pestle" />
      </ItemTableColumn>
      {#if includeSchool}
        <ItemTableColumn
          baseWidth="5.625rem"
          title={localize('DND5E.SpellSchool')}
        >
          <i class="fas fa-hat-wizard" />
        </ItemTableColumn>
      {/if}
      <ItemTableColumn
        baseWidth={targetBaseWidth}
        title={localize('DND5E.SpellTarget')}
      >
        {localize('DND5E.Target')}
      </ItemTableColumn>
      {#if includeRange}
        <ItemTableColumn baseWidth="4.375rem" title={localize('DND5E.Range')}>
          {localize('DND5E.Range')}
        </ItemTableColumn>
      {/if}
      <ItemTableColumn
        title={localize('DND5E.SpellUsage')}
        baseWidth={usageBaseWidth}
      >
        {localize('DND5E.Usage')}
      </ItemTableColumn>
      {#if classicControlsEnabled}
        <ItemTableColumn baseWidth={classicControlsBaseWidth} />
      {/if}
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
        itemCardContentTemplate={SpellbookItemCardContent}
      >
        <ItemTableCell primary={true}>
          <ItemUseButton item={spell} imgUrlOverride={spellImgUrl} />
          <ItemName
            on:click={(event) => toggleSummary(event.detail, $store.actor)}
          >
            <span class="truncate">{spell.name}</span>
          </ItemName>
        </ItemTableCell>
        {#if spell.system.uses.per}
          <ItemTableCell baseWidth="3.125rem">
            <ItemUses item={spell} />
          </ItemTableCell>
        {/if}
        {#if allowFavorites && !$currentSettings.hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(spell, 'favorite')}
          <InlineFavoriteIcon />
        {/if}
        <ItemTableCell baseWidth={spellComponentsBaseWidth} cssClass="no-gap">
          <SpellComponents {spell} />
        </ItemTableCell>
        {#if includeSchool}
          <ItemTableCell
            baseWidth="5.625rem"
            title="{localize('DND5E.SpellSchool')}: {spell.labels.school}"
          >
            <span class="truncate">{spell.labels.school ?? ''}</span>
          </ItemTableCell>
        {/if}
        <ItemTableCell
          baseWidth={targetBaseWidth}
          title="{localize('DND5E.Target')}: {spell.labels.target}"
        >
          {#if spell.labels.target}
            {spell.labels.target}
          {:else}
            {localize('DND5E.None')}
          {/if}
        </ItemTableCell>
        {#if includeRange}
          <ItemTableCell
            baseWidth="4.375rem"
            title="{localize('DND5E.Range')}: {spell.labels.range}"
          >
            {spell.labels.range}
          </ItemTableCell>
        {/if}
        <ItemTableCell
          baseWidth={usageBaseWidth}
          title={localize('DND5E.SpellUsage')}
        >
          {spell.labels.activation}
        </ItemTableCell>
        {#if $store.owner && classicControlsEnabled}
          <ItemTableCell baseWidth={classicControlsBaseWidth}>
            <ItemControls>
              {#if section.canPrepare}
                {#if spell.system.preparation?.mode === 'always'}
                  <span />
                {:else}
                  <SpellPrepareControl {ctx} {spell} />
                {/if}
              {/if}
              {#if allowFavorites}
                <ItemFavoriteControl item={spell} />
              {/if}
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
