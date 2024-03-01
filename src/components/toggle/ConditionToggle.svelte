<script lang="ts">
  import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';

  const appId = getContext<string>('appId');
  const context = getContext<Readable<ActorSheetContext>>('context');

  export let condition: Dnd5eActorCondition;
</script>

<label class="green-checkbox" for="{appId}-{condition.id}">
  <input
    type="checkbox"
    checked={!condition.disabled}
    id="{appId}-{condition.id}"
    on:change={() => FoundryAdapter.toggleCondition($context.actor, condition)}
  />

  {condition.name}
</label>
