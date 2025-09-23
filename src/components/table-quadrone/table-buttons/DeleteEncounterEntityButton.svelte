<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';

  interface Props {
    rowContext:
      | EncounterMemberQuadroneContext
      | EncounterPlaceholderQuadroneContext;
  }

  let { rowContext }: Props = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let label = $derived(
    FoundryAdapter.localize(
      rowContext.type === 'member'
        ? 'DND5E.Group.Action.Remove'
        : 'TIDY5E.Encounter.DeletePlaceholder.Label',
    ),
  );

  function onDelete() {
    if (rowContext.type === 'member') {
      FoundryAdapter.onActorItemDelete(context.actor, rowContext.actor);
    } else {
      context.sheet.deletePlaceholder(rowContext.id);
    }
  }
</script>

<a
  class={['tidy-table-button', { disabled: !context.editable }]}
  aria-label={label}
  data-tooltip
  onclick={() => context.editable && onDelete()}
>
  <i class="fa-solid fa-trash fa-fw"></i>
</a>
