<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { SlotsFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemTemplate from './FavoriteItemTemplate.svelte';

  interface Props {
    favorite: SlotsFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  async function handleOnUse(event: MouseEvent) {
    // Add slot usage logic here if needed
  }

  let subtitle = $derived(
    [
      game.i18n.localize(`DND5E.SpellLevel${favorite.level}`),
      game.i18n.localize(
        `DND5E.Abbreviation${CONFIG.DND5E.spellcastingTypes[favorite.id]?.shortRest ? 'SR' : 'LR'}`,
      ),
    ].join('<span class="divider-dot"></span>')
  );
</script>

<FavoriteItemTemplate
  {favorite}
  img={favorite.img || ''}
  name={favorite.name}
  onUse={handleOnUse}
  subtitle={subtitle}
>
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
</FavoriteItemTemplate>
