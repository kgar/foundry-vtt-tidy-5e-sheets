<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { SlotsFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemRollButton from './parts/FavoriteRollButton.svelte';

  interface Props {
    favorite: SlotsFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let subtitle = $derived([
    game.i18n.localize(`DND5E.SpellLevel${favorite.level}`),
    game.i18n.localize(
      `DND5E.Abbreviation${CONFIG.DND5E.spellcastingTypes[favorite.id]?.shortRest ? 'SR' : 'LR'}`,
    ),
  ].filterJoin(` <div class="divider-dot"></div> `));
</script>

<div 
  class="list-entry favorite" 
  data-favorite-type="slot"
  data-item-id={favorite.id}
>
  <FavoriteItemRollButton {favorite} 
    img={favorite.img} 
    title={favorite.name} 
    name={favorite.name} 
    subtitle={subtitle}
  />
  <div class="">
    <span class="uses">
      {#if context.owner}
        <TextInputQuadrone
          document={context.actor}
          field={favorite.uses.field}
          enableDeltaChanges={true}
          class="value"
          value={favorite.uses.value}
          selectOnFocus={true}
        />
      {:else}
        <span class="value font-data-medium color-text-default">
          {favorite.uses.value}
        </span>
      {/if}
      <span class="divider font-default-medium color-text-lighter">/</span>
      <span class="max font-label-medium color-text-lighter">
        {favorite.uses.max}
      </span>
    </span>
  </div>
</div>
