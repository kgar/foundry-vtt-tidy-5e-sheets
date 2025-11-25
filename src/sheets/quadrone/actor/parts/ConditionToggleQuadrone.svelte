<script lang="ts">
  import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { debug, error } from 'src/utils/logging';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';

  const context = $derived(getSheetContext<ActorSheetContextV1>());

  interface Props {
    condition: Dnd5eActorCondition;
  }

  let { condition }: Props = $props();

  async function handleChange(newValue: boolean) {
    try {
      await FoundryAdapter.toggleCondition(context.actor, condition);
    } catch (e) {
      error('An error occurred while toggling a condition', false, e);
      debug('Condition toggle error troubleshooting info', {
        condition,
      });
      context.actor.sheet.render();
    }
  }
</script>

<label
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.CONDITION_TOGGLE}
  class="condition-toggle-label effect-toggle"
>
  <Dnd5eIcon src={condition.icon} />
  <span class="flex1 truncate">{condition.name}</span>
  <FieldToggle
    checked={!condition.disabled}
    onchange={(ev) => handleChange(ev.currentTarget.checked)}
    disabled={!context.editable}
  />
</label>
