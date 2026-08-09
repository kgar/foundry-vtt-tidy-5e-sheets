<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    EncounterMemberCombatantQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';

  type Props = {
    rowContext:
      | EncounterMemberCombatantQuadroneContext
      | EncounterPlaceholderQuadroneContext;
  };

  let { rowContext }: Props = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  const visible = $derived(rowContext.visible);

  const label = $derived(
    FoundryAdapter.localize(
      visible
        ? 'TIDY5E.Encounter.CombatVisibility.Visible.Label'
        : 'TIDY5E.Encounter.CombatVisibility.Hidden.Label',
    ),
  );

  const iconClass = $derived(
    visible ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash disabled',
  );
</script>

<a
  role="button"
  tabindex="0"
  class={[
    'tidy-table-button action-combat-visibility',
    { disabled: !context.editable },
  ]}
  aria-label={label}
  data-tooltip
  data-action={context.editable ? 'toggleCombatantVisibility' : undefined}
>
  <i class={iconClass}></i>
</a>
