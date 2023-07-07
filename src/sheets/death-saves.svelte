<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { createEventDispatcher } from 'svelte';
  export let successes: number;
  export let failures: number;
  const localize = FoundryAdapter.localize;

  const dispatcher = createEventDispatcher<{
    rollDeathSave: { mouseEvent: MouseEvent };
  }>();
</script>

<!-- Death Saves -->
<i class="fas fa-check" />
<input
  type="text"
  name="system.attributes.death.success"
  data-dtype="Number"
  placeholder="0"
  value={successes}
  maxlength="1"
  data-tooltip={localize('T5EK.DeathSave')}
/>

<div on:click={(event) => dispatcher('rollDeathSave', { mouseEvent: event })}>
  <i class="fas fa-skull" />
</div>

<input
  type="text"
  name="system.attributes.death.failure"
  data-dtype="Number"
  placeholder="0"
  value={failures}
  maxlength="1"
/>
<i class="fas fa-times" />
