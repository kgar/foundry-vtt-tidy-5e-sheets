<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import FavoriteSkillTool from '../character-parts/favorites/FavoriteSkillTool.svelte';

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
        <li class="favorite">
          <img
            src={favorite.effect.img}
            alt={favorite.effect.name}
            class="item-image"
          />
          {favorite.effect.name}
        </li>
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
        <li class="favorite">
          <img src={favorite.img} alt={favorite.name} class="item-image" />
          {favorite.name}
        </li>
      {:else if favorite.type === 'skill' || favorite.type === 'tool'}
        <FavoriteSkillTool {favorite} />
      {/if}
    {/each}
  </ul>
{/if}
