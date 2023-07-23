<script lang="ts">
  import { getFavoritesGroups } from 'src/favorites/favorites';
  import type { ActorSheetContext } from 'src/types/types';
  import InventoryList from '../inventory/InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteFeaturesList from '../favorites/FavoriteFeaturesList.svelte';

  export let context: ActorSheetContext;

  const localize = FoundryAdapter.localize;

  const groups = getFavoritesGroups(context.actor);
</script>

<div class="flexcol no-gap">
  {#each groups as [section, items]}
    {#if section === 'inventory'}
      <InventoryList
        {context}
        {items}
        primaryColumnName={localize('DND5E.Inventory')}
        lockControls={true}
        allowFavoriteIconNextToName={false}
        includeWeightColumn={false}
      />
    {/if}

    <!-- Features -->
    {#if section === 'features'}
      <FavoriteFeaturesList {context} {items} />
    {/if}

    <!-- Spells ... ? -->
  {/each}
</div>
