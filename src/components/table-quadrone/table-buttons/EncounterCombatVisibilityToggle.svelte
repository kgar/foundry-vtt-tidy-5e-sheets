<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';

  type Props = {
    rowContext:
      | EncounterMemberQuadroneContext
      | EncounterPlaceholderQuadroneContext;
  };

  let { rowContext }: Props = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let identifier = $derived(
    rowContext.type === 'member'
      ? rowContext.actor.uuid.replaceAll('.', '-')
      : rowContext.id,
  );

  const visible = $derived(rowContext.visible);

  const label = $derived(
    FoundryAdapter.localize(
      visible
        ? 'TIDY5E.Encounter.CombatVisibility.Visible.Label'
        : 'TIDY5E.Encounter.CombatVisibility.Hidden.Label',
    ),
  );

  const iconClass = $derived(
    visible ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash',
  );
</script>

<a
  class={['tidy-table-button', { disabled: !context.editable }]}
  aria-label={label}
  data-tooltip
  onclick={(ev) =>
    context.editable && context.sheet.toggleCombatantVisibility(identifier)}
>
  <i class={iconClass}></i>
</a>
