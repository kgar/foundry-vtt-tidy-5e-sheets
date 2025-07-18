<script lang="ts" generics="TFavorite extends FavoriteContextEntry">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { FavoriteContextEntry } from 'src/types/types';

  interface Props {
    favorite: TFavorite;
    img: string | undefined;
    onUse?: (
      event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
      favorite: TFavorite,
    ) => Promise<any>;
    title: string;
    name: string;
    subtitle: string;
    useTooltip?: boolean;
  }

  let {
    favorite,
    img,
    onUse,
    title,
    name,
    subtitle,
    useTooltip = true,
  }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  function handleClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) {
    if (!context.editable) {
      return;
    }

    onUse?.(event, favorite);
  }

  let theSubtitle = $state<HTMLElement>();

  let tooltip = $derived(
    useTooltip
      ? `${name} <br /> ${theSubtitle?.innerText.replaceAll('\n', ' • ') ?? ''}`
      : undefined,
  );
</script>

<button
  type="button"
  class="button button-borderless favorite-button"
  onclick={handleClick}
  data-tooltip={tooltip}
>
  <span
    class={[
      'tidy-table-row-use-button item-use-button',
      { disabled: !context.editable },
    ]}
  >
    <img src={img} alt={title} class="item-image" />
    <span class="roll-prompt">
      {#if onUse}
        <i class="fa fa-dice-d20"></i>
      {/if}
    </span>
  </span>

  <div class="item-name-container">
    <div class="item-name stacked">
      <span class="title">
        {name}
      </span>
      <span
        class="subtitle flexrow color-text-lighter font-default-medium"
        bind:this={theSubtitle}
      >
        {@html subtitle}
      </span>
    </div>
  </div>
</button>
