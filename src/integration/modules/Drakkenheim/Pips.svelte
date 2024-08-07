<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let total = 5;
    export let selected = 0;
    const dispatcher = createEventDispatcher<{ change: number }>();
    function onPipClick(index: number) {
      if (selected === index + 1) {
        dispatcher('change', selected - 1);
        return;
      }
      dispatcher('change', index + 1);
    }
    $: pipArray = Array(total);
  </script>
  
  <div class="pips">
    {#each pipArray as _, i}
      <button
        type="button"
        class="pip"
        class:inactive={selected < i + 1}
        class:active={selected >= i + 1}
        class:last-selected={selected === i + 1}
        on:click={() => onPipClick(i)}><i></i></button
      >
    {/each}
  
    <span aria-hidden="true" style="display: none" class="pip-end"></span>
  </div>