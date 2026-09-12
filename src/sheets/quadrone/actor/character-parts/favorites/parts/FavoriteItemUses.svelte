<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import { ItemUtils } from 'src/utils/ItemUtils';

  interface Props {
    favorite: ItemFavoriteContextEntry;
    uses: { value: number; max: number };
  }

  let { favorite, uses }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());
  const localize = FoundryAdapter.localize;
  const concealed = $derived(
    ItemUtils.isConcealed(favorite.item, { unlocked: context.unlocked }),
  );
</script>

<span class="inline-uses">
  {#if concealed}
    <span class="value color-text-lightest">{localize('TIDY5E.COMMON.Unidentified.Placeholder')}</span>
  {:else if context.owner}
    <input
      type="text"
      id={`favorite-item-${favorite.item.item?.id}`}
      data-name="system.uses.value"
      inputmode="numeric"
      class="uninput uses-value"
      value={uses.value}
      {@attach InputAttachments.selectOnFocus}
    />
  {:else}
    <span class="uses-value color-text-default">
      {uses.value}
    </span>
  {/if}
  {#if !concealed}
    <span class="divider color-text-gold">/</span>
    <span class="uses-max color-text-lighter">
      {uses.max}
    </span>
  {/if}
</span>
