<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import FavoriteSkillTool from '../character-parts/favorites/FavoriteSkillTool.svelte';
  import FavoriteSlot from '../character-parts/favorites/FavoriteSlot.svelte';
  import FavoriteEffect from '../character-parts/favorites/FavoriteEffect.svelte';
  import FavoriteActivity from '../character-parts/favorites/FavoriteActivity.svelte';
  import FavoriteItem from '../character-parts/favorites/FavoriteItem.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { error } from 'src/utils/logging';

  let context = $derived(getCharacterSheetQuadroneContext());
  const localize = FoundryAdapter.localize;
</script>

{#if context.favorites.length}
  <div class="favorites list">
    {#each context.favorites as favorite}
      <svelte:boundary
        onerror={(e) =>
          error(
            `An error occurred while attempting to render favorite with ID: ${favorite.id}`,
            false,
            { error: e, entry: favorite },
          )}
      >
        {#if favorite.type === 'item'}
          <FavoriteItem {favorite} />
        {:else if favorite.type === 'effect'}
          <FavoriteEffect {favorite} />
        {:else if favorite.type === 'activity'}
          <FavoriteActivity {favorite} />
        {:else if favorite.type === 'slots'}
          <FavoriteSlot {favorite} />
        {:else if favorite.type === 'skill' || favorite.type === 'tool'}
          <FavoriteSkillTool {favorite} />
        {/if}
      </svelte:boundary>
    {/each}
  </div>
{:else}
  <div class="favorites list">
    <div class="empty-state-container empty-state-description">
      {localize('TIDY5E.EmptyFavorites')}
    </div>
  </div>
{/if}
