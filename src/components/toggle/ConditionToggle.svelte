<script lang="ts">
  import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
  import { getContext } from 'svelte';
  import type { ActorSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';
  import TidySwitch from './TidySwitch.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { debug, error } from 'src/utils/logging';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<Readable<ActorSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let condition: Dnd5eActorCondition;

  let switchOn: boolean = !condition.disabled;

  $: {
    switchOn = !condition.disabled;
  }

  async function handleChange(originalValue: boolean) {
    try {
      await FoundryAdapter.toggleCondition($context.actor, condition);
    } catch (e) {
      error('An error occurred while toggling a condition', false, e);
      debug('Condition toggle error troubleshooting info', {
        condition,
        state: switchOn,
      });
      switchOn = originalValue;
    }
  }
</script>

<TidySwitch
  class="flex-row small-gap tidy-condition-toggle {switchOn
    ? 'active'
    : 'inactive'}"
  bind:value={switchOn}
  on:change={(ev) => handleChange(ev.detail.originalValue)}
  title={condition.name}
  disabled={!$context.editable}
  data-uuid={condition.reference}
  data-condition-id={condition.id}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.CONDITION_TOGGLE}
>
  <Dnd5eIcon src={condition.icon} />
  <span class="flex-1 truncate">{condition.name}</span>
</TidySwitch>
