<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { SlotsFavoriteContextEntry } from 'src/types/types';

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
  ]);
</script>

<li class="favorite">
  <img src={favorite.img} alt={favorite.name} class="item-image" />

  <div class="name stacked">
    <span class="title">
      {favorite.name}
    </span>
    <span class="subtitle">
      {#each subtitle as segment, i}
        {segment}
        {#if i + 1 < subtitle.length}
          <span class="divider-dot"></span>
        {/if}
      {/each}
    </span>
  </div>
  <div class="info">
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
        <span class="value">
          {favorite.uses.value}
        </span>
      {/if}
      <span class="divider">/</span>
      <span class="max">
        {favorite.uses.max}
      </span>
    </span>
  </div>
</li>
