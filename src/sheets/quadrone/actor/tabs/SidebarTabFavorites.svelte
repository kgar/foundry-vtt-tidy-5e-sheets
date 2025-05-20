<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import FavoriteSkillTool from '../character-parts/favorites/FavoriteSkillTool.svelte';
  import FavoriteSlot from '../character-parts/favorites/FavoriteSlot.svelte';
    import FavoriteEffect from '../character-parts/favorites/FavoriteEffect.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());
</script>

{#if context.favorites.length}
  <ul class="favorites unlist">
    {#each context.favorites as favorite}
      {#if favorite.type === 'item'}
        <li class="favorite">
          <img
            src={favorite.item.img}
            alt={favorite.item.name}
            class="item-image"
          />
          {favorite.item.name}
        </li>
      {:else if favorite.type === 'effect'}
        <FavoriteEffect {favorite} />
      {:else if favorite.type === 'activity'}
        <li class="favorite">
          <img
            src={favorite.activity.img}
            alt={favorite.activity.name}
            class="item-image"
          />
          {favorite.activity.name}
        </li>
      {:else if favorite.type === 'slots'}
        <FavoriteSlot {favorite} />
      {:else if favorite.type === 'skill' || favorite.type === 'tool'}
        <FavoriteSkillTool {favorite} />
      {/if}
    {/each}
  </ul>
{/if}
