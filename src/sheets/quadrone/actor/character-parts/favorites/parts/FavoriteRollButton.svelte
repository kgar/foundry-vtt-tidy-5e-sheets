<script lang="ts" generics="TFavorite extends FavoriteContextEntry">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { FavoriteContextEntry } from 'src/types/types';

  interface Props {
    favorite: TFavorite;
    img: string | undefined;
    onUse?: (
      event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
      favorite: TFavorite,
    ) => Promise<any>;
    title: string;
  }

  let { favorite, img, onUse, title }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  function handleClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
  ) {
    if (!context.editable) {
      return;
    }

    if (context.unlocked) {
      context.actor.system.removeFavorite(favorite.id);
    } else {
      onUse?.(event, favorite);
    }
  }
</script>

<a
  class={['tidy-table-row-use-button item-use-button', { disabled: !context.editable }]}
  onclick={handleClick}
>
  <img src={img} alt={title} class="item-image" />
  <span class="roll-prompt">
    {#if context.unlocked}
      <i class="fa fa-trash"></i>
    {:else if onUse}
      <i class="fa fa-dice-d20"></i>
    {/if}
  </span>
</a>
