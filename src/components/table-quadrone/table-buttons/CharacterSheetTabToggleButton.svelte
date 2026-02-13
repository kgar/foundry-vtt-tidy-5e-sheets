<script lang="ts">
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterItemContext } from 'src/types/types';
  import type { ContainerItemContext } from 'src/types/item.types';

  interface Props {
    doc: any;
    itemContext: Record<string, CharacterItemContext | ContainerItemContext>;
  }

  let { doc, itemContext }: Props = $props();

  const localize = FoundryAdapter.localize;

  let included = $derived(
    itemContext[doc.id]?.includeInCharacterSheetTab === true,
  );

  let tooltip = $derived(
    localize(
      included
        ? 'TIDY5E.ContextMenuActionRemoveFromSheetTab'
        : 'TIDY5E.ContextMenuActionAddToSheetTab',
    ),
  );

  function toggleBookmark() {
    TidyFlags.actionFilterOverride.set(doc, !included);
  }
</script>

<a class="tidy-table-button" data-tooltip={tooltip} onclick={toggleBookmark}>
  {#if included}
    <i class="fa-solid fa-bookmark fa-fw"></i>
  {:else}
    <i class="fa-regular fa-bookmark fa-fw"></i>
  {/if}
</a>
