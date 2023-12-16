<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterSheetContext,
    type NpcSheetContext,
  } from 'src/types/types';
  import ItemControls from '../item-list/controls/ItemControls.svelte';
  import ItemDeleteControl from '../item-list/controls/ItemDeleteControl.svelte';
  import ItemDuplicateControl from '../item-list/controls/ItemDuplicateControl.svelte';
  import ItemEditControl from '../item-list/controls/ItemEditControl.svelte';
  import ItemName from '../item-list/ItemName.svelte';
  import ItemTable from '../item-list/ItemTable.svelte';
  import ItemTableCell from '../item-list/ItemTableCell.svelte';
  import ItemTableColumn from '../item-list/ItemTableColumn.svelte';
  import ItemTableFooter from '../item-list/ItemTableFooter.svelte';
  import ItemTableHeaderRow from '../item-list/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../item-list/ItemTableRow.svelte';
  import ItemUseButton from '../item-list/ItemUseButton.svelte';
  import ItemUses from '../item-list/ItemUses.svelte';
  import SpellComponents from './SpellComponents.svelte';
  import SpellPrepareControl from '../spellbook/SpellPrepareControl.svelte';
  import SpellSlotMarkers from '../spellbook/SpellSlotMarkers.svelte';
  import SpellSlotUses from '../spellbook/SpellSlotUses.svelte';
  import InlineFavoriteIcon from '../item-list/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../item-list/controls/ItemFavoriteControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SpellbookItemCardContent from '../item-info-card/SpellbookItemCardContent.svelte';
  import { settingStore } from 'src/settings/settings';
  import ActionFilterOverrideControl from '../item-list/controls/ActionFilterOverrideControl.svelte';

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');
  export let section: any;
  export let spells: any[];
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

  $: classicControlsBaseWidth = $context.unlocked
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
          {#if $settingStore.useSpellSlotMarker}
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
      {#if $context.editable && $context.useClassicControls}
        <ItemTableColumn baseWidth={classicControlsBaseWidth} />
      {/if}
    </ItemTableHeaderRow>
    {#each spells as spell (spell.id)}
      {@const ctx = $context.itemContext[spell.id]}
      {@const spellImgUrl = FoundryAdapter.getSpellImageUrl($context, spell)}
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
          <ItemUseButton disabled={!$context.editable} item={spell} imgUrlOverride={spellImgUrl} />
          <ItemName
            on:toggle={() => toggleSummary($context.actor)}
            item={spell}
          >
            <span class="truncate">{spell.name}</span>
          </ItemName>
        </ItemTableCell>
        {#if spell.hasLimitedUses}
          <ItemTableCell baseWidth="3.125rem">
            <ItemUses item={spell} />
          </ItemTableCell>
        {/if}
        {#if allowFavorites && $settingStore.showIconsNextToTheItemName && FoundryAdapter.tryGetFlag(spell, 'favorite')}
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
        {#if $context.editable && $context.useClassicControls}
          <ItemTableCell baseWidth={classicControlsBaseWidth}>
            <ItemControls>
              {#if FoundryAdapter.canPrepareSpell(spell)}
                <SpellPrepareControl {ctx} {spell} />
              {:else}
                <span />
              {/if}
              {#if allowFavorites}
                <ItemFavoriteControl item={spell} />
              {/if}
              <ItemEditControl item={spell} />
              {#if $context.unlocked}
                <ItemDuplicateControl item={spell} />
                <ItemDeleteControl item={spell} />
              {/if}
              {#if $context.useActionsFeature}
                <ActionFilterOverrideControl item={spell} />
              {/if}
            </ItemControls>
          </ItemTableCell>
        {/if}
      </ItemTableRow>
    {/each}
    {#if $context.unlocked}
      <ItemTableFooter
        actor={$context.actor}
        dataset={section.dataset}
        canCreate={section.canCreate}
      />
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
