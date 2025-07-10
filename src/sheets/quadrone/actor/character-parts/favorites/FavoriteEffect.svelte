<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { EffectFavoriteContextEntry } from 'src/types/types';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';

  interface Props {
    favorite: EffectFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let subtitle = $derived(
    [
      localize('DND5E.Effect'),
      favorite.effect.isSuppressed
        ? localize('DND5E.Suppressed')
        : favorite.effect.duration.remaining
          ? favorite.effect.duration.label
          : '',
    ].filterJoin(` <div class="divider-dot"></div> `),
  );

  let toggleable = $derived(context.owner && !favorite.effect.supppresed);

  let parentId = $derived(
    favorite.effect.parent !== favorite.effect.target
      ? favorite.effect.parent.id
      : null,
  );

  const handleChange = !favorite.effect.isSuppressed
    ? () => favorite.effect.update({ disabled: !favorite.effect.disabled })
    : undefined;

  let theSubtitle = $state<HTMLElement>();

  let tooltip = $derived(
    `${favorite.effect.name} <br /> ${theSubtitle?.innerText.replaceAll('\n', ' • ')}`,
  );
</script>

<div
  class={[
    'list-entry favorite',
    { suppressed: favorite.effect.isSuppressed, toggleable },
  ]}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS}
  data-effect-id={favorite.effect.id}
  data-parent-id={parentId}
  data-tidy-draggable
  data-favorite-id={favorite.id}
  data-tooltip={tooltip}
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, favorite.effect)}
>
  <button
    type="button"
    class="button button-borderless favorite-effect favorite-button"
    class:disabled={favorite.effect.isSuppressed}
    onclick={handleChange}
    data-favorite-type="effect"
  >
    <i class="effect-use-icon">
      <img
        src={favorite.effect.img}
        alt={favorite.effect.name}
        class="item-image"
      />
    </i>

    <div class="item-name-container">
      <div class="item-name stacked">
        <span class="title">
          {favorite.effect.name}
        </span>
        <span
          class="subtitle flexrow color-text-lighter font-default-small"
          bind:this={theSubtitle}
        >
          {@html subtitle}
        </span>
      </div>
    </div>

    <div class="effect-toggle">
      <span class="primary">
        <FieldToggle
          checked={!favorite.effect.disabled}
          disabled={favorite.effect.isSuppressed}
          onchange={handleChange}
        />
      </span>
    </div>
  </button>
</div>
