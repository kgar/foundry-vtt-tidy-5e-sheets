<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { EffectFavoriteContextEntry } from 'src/types/types';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';

  interface Props {
    favorite: EffectFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let subtitle = $derived(
    favorite.effect.isSuppressed
      ? localize('DND5E.Suppressed')
      : favorite.effect.duration.remaining
        ? favorite.effect.duration.label
        : '',
  );

  let toggleable = $derived(context.owner && !favorite.effect.supppresed);

  let parentId = $derived(
    favorite.effect.parent !== favorite.effect.target
      ? favorite.effect.parent.id
      : null,
  );
</script>

<div
  class={['favorite', { suppressed: favorite.effect.isSuppressed, toggleable }]}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS}
  data-effect-id={favorite.effect.id}
  data-parent-id={parentId}
>
  <FavoriteRollButton
    {favorite}
    img={favorite.effect.img}
    title={favorite.effect.name}
  />

  <button
    type="button"
    class="list-entry button button-borderless"
    disabled={!toggleable}
    onclick={() =>
      toggleable &&
      favorite.effect.update({ disabled: !favorite.effect.disabled })}
    data-favorite-type="effect"
  >
    <div class="">
      <div class="item-name stacked">
        <span class="title">
          {favorite.effect.name}
      </span>
      <span class="subtitle flexrow color-text-lighter font-default-small">
          {@html subtitle}
        </span>
      </div>
    </div>

    <div class="">
      <i
        class={[
          'fas',
          {
            ['fa-toggle-off']: favorite.effect.disabled,
            ['fa-toggle-large-on']: !favorite.effect.disabled,
          },
        ]}
      ></i>
    </div>
  </button>
</div>
