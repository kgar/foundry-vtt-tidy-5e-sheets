<script lang="ts">
  import { getFavoritesGroups } from 'src/favorites/favorites';
  import type { ActorSheetContext } from 'src/types/types';
  import InventoryList from '../inventory/InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let context: ActorSheetContext;

  const localize = FoundryAdapter.localize;

  const groups = getFavoritesGroups(context.actor);
</script>

{#each groups as [section, items]}
  {#if section === 'inventory'}
    <InventoryList
      {context}
      {items}
      primaryColumnName={localize('DND5E.Inventory')}
      lockControls={true}
      allowFavoriteIconNextToName={false}
    />
  {/if}

  <!-- Features -->

  <!-- Spells ... ? -->
{/each}
