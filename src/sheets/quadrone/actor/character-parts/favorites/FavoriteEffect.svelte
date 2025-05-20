<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { EffectFavoriteContextEntry } from 'src/types/types';

  interface Props {
    favorite: EffectFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());
</script>

<!-- TODO: Owner behavior | default sheets: clicks toggle the effect -->
<!-- TODO: Observer behavior | default sheets: the click behavior is ignored -->
<!-- TODO: Suppressed UI | default sheets: `.suppressed` class in li, "Suppressed" subtitle, defers click behavior to ownership -->
<li class="favorite">
  <img
    src={favorite.effect.img}
    alt={favorite.effect.name}
    class="item-image"
  />
  {favorite.effect.name}
</li>
