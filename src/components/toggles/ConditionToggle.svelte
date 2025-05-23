<script lang="ts">
  import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import TidySwitch from './TidySwitch.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { debug, error } from 'src/utils/logging';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

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

<TidySwitch
  class="flex-row small-gap tidy-condition-toggle {!condition.disabled
    ? 'active'
    : 'inactive'}"
  checked={!condition.disabled}
  onChange={(ev) => handleChange(ev.currentTarget.checked)}
  title={condition.name}
  disabled={!context.editable}
  data-uuid={condition.reference}
  data-condition-id={condition.id}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.CONDITION_TOGGLE}
>
  <Dnd5eIcon src={condition.icon} />
  <span class="flex-1 truncate">{condition.name}</span>
</TidySwitch>
