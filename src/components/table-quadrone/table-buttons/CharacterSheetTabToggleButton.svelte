<script lang="ts">
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterItemContext } from 'src/types/types';
  import type { ContainerItemContext } from 'src/types/item.types';

  interface Props {
    doc: any;
    ctx: CharacterItemContext | ContainerItemContext;
  }

  let { doc, ctx }: Props = $props();

  const localize = FoundryAdapter.localize;

  let included = $derived(ctx.includeInCharacterSheetTab === true);

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
    <i class="fa-solid fa-bookmark fa-fw color-text-default"></i>
  {:else}
    <i class="fa-regular fa-bookmark fa-fw color-text-lightest"></i>
  {/if}
</a>
