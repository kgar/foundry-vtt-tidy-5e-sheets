<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import ItemName from '../items/ItemName.svelte';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import ItemUseButton from '../items/ItemUseButton.svelte';
  import ItemUses from '../items/ItemUses.svelte';
  import SpellComponents from '../spellbook/SpellComponents.svelte';
  import SpellSlotUses from '../spellbook/SpellSlotUses.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');
  export let section: any;
  export let spells: any[];

  const localize = FoundryAdapter.localize;
</script>

<section class="spellbook-list-section">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {#if section.dataset['preparation.mode'] === 'prepared' && section.dataset.level > 0}
          {localize('T5EK.FavoriteSpellLevelLabel', {
            number: section.dataset.level,
          })}
        {:else}
          <span class="spell-primary-column-label">
            {section.label}
          </span>
        {/if}
        {#if section.usesSlots}
          <SpellSlotUses {section} />
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
