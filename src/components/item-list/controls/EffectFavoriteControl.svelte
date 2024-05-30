<script lang="ts">
  import ItemControl from './ItemControl.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActiveEffectContext } from 'src/types/types';

  export let effect: ActiveEffectContext;

  $: active = FoundryAdapter.isActiveEffectContextFavorited(effect);
  $: title = FoundryAdapter.localize(
    active ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
  );
</script>

<ItemControl
  iconCssClass="fas fa-bookmark"
  {active}
  {title}
  onclick={() => {
    const actor = effect.source.actor ?? effect.source;
    const document = FoundryAdapter.getEffect({
      document: actor,
      effectId: effect.id,
      parentId: effect.parentId,
    });
    FoundryAdapter.toggleFavoriteEffect(document);
  }}
/>
