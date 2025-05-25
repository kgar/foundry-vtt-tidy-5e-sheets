<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import FavoriteSkillTool from '../character-parts/favorites/FavoriteSkillTool.svelte';
  import FavoriteSlot from '../character-parts/favorites/FavoriteSlot.svelte';
  import FavoriteEffect from '../character-parts/favorites/FavoriteEffect.svelte';
  import FavoriteActivity from '../character-parts/favorites/FavoriteActivity.svelte';
  import FavoriteItem from '../character-parts/favorites/FavoriteItem.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());
</script>

<!-- 👋 hightouch - we'll need to visualize a convenient / obvious way to delete favorites -->

{#if context.favorites.length}
  <ul class="favorites unlist tidy-table">
    {#each context.favorites as favorite}
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
    {/each}
  </ul>
{/if}
