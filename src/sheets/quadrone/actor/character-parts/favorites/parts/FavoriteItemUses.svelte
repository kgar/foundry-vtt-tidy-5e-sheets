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

<span class="uses">
  {#if context.owner}
    <TextInputQuadrone
      document={favorite.item}
      field="system.uses.value"
      enableDeltaChanges={true}
      class="value"
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
    <span class="value">
      {uses.value}
    </span>
  {/if}
  <span class="divider">/</span>
  <span class="max">
    {uses.max}
  </span>
</span>
