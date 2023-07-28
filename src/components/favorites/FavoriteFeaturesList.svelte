<script lang="ts">
  import type { Item5e } from 'src/types/item';
  import type { ActorSheetContext } from 'src/types/types';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import ItemAddUses from '../items/ItemAddUses.svelte';
  import ItemName from '../items/ItemName.svelte';
  import ItemUseButton from '../items/ItemUseButton.svelte';
  import ItemUses from '../items/ItemUses.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');
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
    {@const ctx = $store.itemContext[item.id]}
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
      <ItemTableCell primary={true}>
        <ItemUseButton {item} />
        <ItemName
          on:click={(event) => toggleSummary(event.detail, $store.actor)}
          hasChildren={false}
        >
          {item.name}
        </ItemName>
      </ItemTableCell>

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
              ?.value}{#if item.system.recharge?.value !== 6}+{/if}</a
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
        {#if item.system.activation?.type}
          {item.labels.activation}
        {/if}
      </ItemTableCell>
    </ItemTableRow>
  {/each}
</ItemTable>
