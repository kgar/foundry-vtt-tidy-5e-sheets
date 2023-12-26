<script lang="ts">
  import type { Item5e } from 'src/types/item';
  import type { CharacterSheetContext } from 'src/types/types';
  import ItemTable from '../../../components/item-list/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/ItemTableHeaderRow.svelte';
  import ItemTableColumn from '../../../components/item-list/ItemTableColumn.svelte';
  import ItemTableRow from '../../../components/item-list/ItemTableRow.svelte';
  import ItemTableCell from '../../../components/item-list/ItemTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import ItemAddUses from '../../../components/item-list/ItemAddUses.svelte';
  import ItemName from '../../../components/item-list/ItemName.svelte';
  import ItemUseButton from '../../../components/item-list/ItemUseButton.svelte';
  import ItemUses from '../../../components/item-list/ItemUses.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');
  export let items: Item5e[] = [];

  const localize = FoundryAdapter.localize;
</script>

<ItemTable>
  <ItemTableHeaderRow>
    <ItemTableColumn primary={true}>
      {localize('DND5E.Features')}
    </ItemTableColumn>
    <ItemTableColumn baseWidth="3.125rem">
      {localize('DND5E.Uses')}
    </ItemTableColumn>
    <ItemTableColumn baseWidth="7.5rem">
      {localize('DND5E.Usage')}
    </ItemTableColumn>
  </ItemTableHeaderRow>
  {#each items as item (item.id)}
    {@const ctx = $context.itemContext[item.id]}
    <ItemTableRow
      {item}
      let:toggleSummary
      on:mousedown={(event) =>
        FoundryAdapter.editOnMiddleClick(event.detail, item)}
      contextMenu={{
        type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
        id: item.id,
      }}
    >
      <ItemTableCell
        primary={true}
        attributes={{
          'data-tidy-item-name-container': true,
          'data-item-id': item.id,
        }}
      >
        <ItemUseButton disabled={!$context.editable} {item} />
        <ItemName
          on:toggle={() => toggleSummary($context.actor)}
          hasChildren={false}
          {item}
        >
          <span data-tidy-item-name={item.name}>{item.name}</span>
        </ItemName>
      </ItemTableCell>

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
        {#if item.system.activation?.type}
          {item.labels.activation}
        {/if}
      </ItemTableCell>
    </ItemTableRow>
  {/each}
</ItemTable>
