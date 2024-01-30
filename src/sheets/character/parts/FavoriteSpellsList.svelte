<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import ItemName from '../../../components/item-list/ItemName.svelte';
  import ItemTable from '../../../components/item-list/ItemTable.svelte';
  import ItemTableCell from '../../../components/item-list/ItemTableCell.svelte';
  import ItemTableColumn from '../../../components/item-list/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../components/item-list/ItemTableRow.svelte';
  import ItemUseButton from '../../../components/item-list/ItemUseButton.svelte';
  import ItemUses from '../../../components/item-list/ItemUses.svelte';
  import SpellComponents from '../../../components/spellbook/SpellComponents.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SpellSectionHeaderToolbar from 'src/components/item-header/SpellSectionHeaderToolbar.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');
  export let section: any;
  export let spells: any[];

  const localize = FoundryAdapter.localize;
</script>

<section class="spellbook-list-section">
  <SpellSectionHeaderToolbar {section} />
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {#if section.dataset['preparation.mode'] === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED && section.dataset.level > 0}
          {localize('T5EK.FavoriteSpellLevelLabel', {
            number: section.dataset.level,
          })}
        {:else}
          <span class="spell-primary-column-label">
            {section.label}
          </span>
        {/if}
      </ItemTableColumn>
      <ItemTableColumn
        baseWidth="4.375rem"
        title={localize('DND5E.SpellComponents')}
      >
        <i class="fas fa-mortar-pestle" />
      </ItemTableColumn>
      <ItemTableColumn title={localize('DND5E.SpellUsage')} baseWidth="7.5rem">
        {localize('DND5E.Usage')}
      </ItemTableColumn>
    </ItemTableHeaderRow>
    {#each spells as spell}
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
          <ItemUseButton
            disabled={!$context.editable}
            item={spell}
            imgUrlOverride={spellImgUrl}
          />
          <ItemName
            on:toggle={() => toggleSummary($context.actor)}
            item={spell}
          >
            <span
              class="truncate"
              data-tidy-item-name={spell.name}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
              >{spell.name}</span
            >
          </ItemName>
        </ItemTableCell>
        {#if spell.system.uses.per}
          <ItemTableCell baseWidth="3.125rem">
            <ItemUses item={spell} />
          </ItemTableCell>
        {/if}
        <ItemTableCell baseWidth="4.375rem" cssClass="no-gap">
          <SpellComponents {spell} />
        </ItemTableCell>
        <ItemTableCell baseWidth="7.5rem" title={localize('DND5E.SpellUsage')}>
          {spell.labels.activation}
        </ItemTableCell>
      </ItemTableRow>
    {/each}
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
