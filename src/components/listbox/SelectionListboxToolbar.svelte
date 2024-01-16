<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { createEventDispatcher } from 'svelte';

  export let moveAllToTheLeftDisabled: boolean;
  export let moveUpDisabled: boolean;
  export let moveDownDisabled: boolean;
  export let moveLeftDisabled: boolean;
  export let moveRightDisabled: boolean;
  export let moveAllToTheRightDisabled: boolean;

  const dispatcher = createEventDispatcher<{
    moveAllToTheLeft: void;
    moveUp: void;
    moveDown: void;
    moveLeft: void;
    moveRight: void;
    moveAllToTheRight: void;
  }>();

  const localize = FoundryAdapter.localize;
</script>

<div class="selection-listbox-toolbar {$$props.class ?? ''}">
  <button
    title={localize('T5EK.Listbox.MoveUp')}
    type="button"
    disabled={moveUpDisabled}
    on:click={() => dispatcher('moveUp')}
  >
    <i class="fas fa-angle-up"></i>
  </button>
  <button
    title={localize('T5EK.Listbox.MoveDown')}
    type="button"
    disabled={moveDownDisabled}
    on:click={() => dispatcher('moveDown')}
  >
    <i class="fas fa-angle-down"></i>
  </button>
  <button
    title={localize('T5EK.Listbox.MoveLeft')}
    type="button"
    disabled={moveLeftDisabled}
    on:click={() => dispatcher('moveLeft')}
  >
    <i class="fas fa-angle-left"></i>
  </button>
  <button
    title={localize('T5EK.Listbox.MoveRight')}
    type="button"
    disabled={moveRightDisabled}
    on:click={() => dispatcher('moveRight')}
  >
    <i class="fas fa-angle-right"></i>
  </button>
  <button
    title={localize('T5EK.Listbox.MoveAllLeft')}
    type="button"
    disabled={moveAllToTheLeftDisabled}
    on:click={() => dispatcher('moveAllToTheLeft')}
  >
    <i class="fas fa-angles-left"></i>
  </button>
  <button
    title={localize('T5EK.Listbox.MoveAllRight')}
    type="button"
    disabled={moveAllToTheRightDisabled}
    on:click={() => dispatcher('moveAllToTheRight')}
  >
    <i class="fas fa-angles-right"></i>
  </button>
</div>

<style>
  .selection-listbox-toolbar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
  }

  .selection-listbox-toolbar button {
    padding: 0.25rem 0.5rem;
  }
</style>
