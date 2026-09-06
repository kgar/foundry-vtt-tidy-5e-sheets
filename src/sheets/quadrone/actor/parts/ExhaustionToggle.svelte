<script lang="ts">
  import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';

  const context = $derived(getSheetContext<ActorSheetQuadroneContext>());
  const localize = FoundryAdapter.localize;

  interface Props {
    condition: Dnd5eActorCondition;
  }

  let { condition }: Props = $props();

  // Exhaustion is a numeric actor attribute, not an on/off condition.
  let exhaustionLevel = $derived(context.system.attributes.exhaustion ?? 0);
  let maxExhaustion = $derived(
    context.config.conditionTypes.exhaustion?.levels ?? 6,
  );
</script>

<div
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.CONDITION_TOGGLE}
  class="condition-toggle-label effect-toggle"
>
  <Dnd5eIcon src={condition.icon} />
  <span class="flex1 truncate">{condition.name}</span>
  <InlineQuantityTracker
    property="system.attributes.exhaustion"
    value={exhaustionLevel}
    disabled={!context.editable}
    data-min="0"
    data-max={maxExhaustion}
    aria-label={localize('DND5E.Exhaustion')}
  />
</div>
