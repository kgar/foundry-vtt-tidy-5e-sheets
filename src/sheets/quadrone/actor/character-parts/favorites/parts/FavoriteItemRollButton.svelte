<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  function handleClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
  ) {
    if (context.unlocked) {
      context.actor.system.removeFavorite(
        favorite.item.getRelativeUUID(context.actor),
      );
    } else {
      FoundryAdapter.actorTryUseItem(favorite.item, event);
    }
  }
</script>

<a
  class={['item-use-button', { disabled: !context.editable }]}
  onclick={handleClick}
>
  <img src={favorite.item.img} alt={favorite.item.name} class="item-image" />
  <span class="roll-prompt">
    <i class={['fa', context.unlocked ? 'fa-trash' : 'fa-dice-d20']}></i>
  </span>
</a>
