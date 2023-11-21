<script lang="ts">
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
</script>

<div class="selection-listbox-toolbar {$$props.class ?? ''}">
  <button
    title="Move Up (Alt + Up arrow key)"
    type="button"
    disabled={moveUpDisabled}
    on:click={() => dispatcher('moveUp')}>👆</button
  >
  <button
    title="Move down (Alt + Down arrow key)"
    type="button"
    disabled={moveDownDisabled}
    on:click={() => dispatcher('moveDown')}>👇</button
  >
  <button
    title="Move left (Space)"
    type="button"
    disabled={moveLeftDisabled}
    on:click={() => dispatcher('moveLeft')}>👈</button
  >
  <button
    title="Move right (Space)"
    type="button"
    disabled={moveRightDisabled}
    on:click={() => dispatcher('moveRight')}>👉</button
  >
  <button
    title="Move all to the left"
    type="button"
    disabled={moveAllToTheLeftDisabled}
    on:click={() => dispatcher('moveAllToTheLeft')}>◀◀</button
  >
  <button
    title="Move all to the right"
    type="button"
    disabled={moveAllToTheRightDisabled}
    on:click={() => dispatcher('moveAllToTheRight')}>▶▶</button
  >
</div>

<style>
  .selection-listbox-toolbar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .selection-listbox-toolbar button {
    padding: 0.5rem;
  }
</style>
