<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';

  interface Props {
    favorite: ItemFavoriteContextEntry;
    uses: { value: number; max: number };
  }

  let { favorite, uses }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());
</script>

<span class="inline-uses">
  {#if context.owner}
    <TextInputQuadrone
      document={favorite.item}
      id={`favorite-item-${favorite.item.item?.id}`}
      field="system.uses.value"
      enableDeltaChanges={true}
      class="uninput uses-value"
      value={uses.value}
      selectOnFocus={true}
      onSaveChange={(event) => {
        const el = event.currentTarget;
        FoundryAdapter.handleItemUsesChanged(event, favorite.item).then(() => {
          el?.select();
        });

        return false;
      }}
    />
  {:else}
    <span class="uses-value color-text-default">
      {uses.value}
    </span>
  {/if}
  <span class="divider color-text-gold">/</span>
  <span class="uses-max color-text-lighter">
    {uses.max}
  </span>
</span>
