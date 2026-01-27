<script lang="ts">
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { isItemInActionList } from 'src/features/actions/actions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActionItemInclusionMode } from 'src/types/types';
  import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  const localize = FoundryAdapter.localize;

  let inclusionMode = $derived.by<ActionItemInclusionMode>(() => {
    const autoInclude =
      doc.parent?.type === CONSTANTS.SHEET_TYPE_CHARACTER &&
      (
        doc.parent?.sheet as Tidy5eCharacterSheetQuadrone
      ).autoIncludeSheetTabUsableItems?.();
    return autoInclude ? 'usable-and-flag' : 'flag-only';
  });

  let included = $derived(isItemInActionList(doc, inclusionMode));

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
