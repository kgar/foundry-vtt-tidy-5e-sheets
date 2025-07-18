<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { SlotsFavoriteContextEntry } from 'src/types/types';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: SlotsFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let subtitle = $derived(
    [
      game.i18n.localize(`DND5E.SpellLevel${favorite.level}`),
      game.i18n.localize(
        `DND5E.Abbreviation${CONFIG.DND5E.spellcastingTypes[favorite.id]?.shortRest ? 'SR' : 'LR'}`,
      ),
    ].filterJoin(` <div class="divider-dot"></div> `),
  );
</script>

<div
  class="list-entry favorite"
  role="button"
  tabindex="0"
  data-favorite-type="slot"
  data-tidy-draggable
  data-favorite-id={favorite.id}
  data-key={favorite.id}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_KEYED_FAVORITE}
  data-slots
  onmousedown={(event) =>
    FoundryAdapter.doActionOnMiddleClick(event, () =>
      FoundryAdapter.openSpellSlotsConfig(context.actor),
    )}
  data-tidy-sheet-part="favorite-entry"
>
  <FavoriteRollButton
    {favorite}
    img={favorite.img}
    title={favorite.name}
    name={favorite.name}
    {subtitle}
  />
  <div class="">
    <span class="primary">
      <span class="inline-uses">
        {#if context.owner}
          <TextInputQuadrone
            document={context.actor}
            field={favorite.uses.field}
            enableDeltaChanges={true}
            class="uninput uses-value"
            value={favorite.uses.value}
            selectOnFocus={true}
          />
        {:else}
          <span class="uses-value color-text-default">
            {favorite.uses.value}
          </span>
        {/if}
        <span class="divider color-text-gold">/</span>
        <span class="uses-max color-text-lighter">
          {favorite.uses.max}
        </span>
      </span>
    </span>
  </div>
</div>
