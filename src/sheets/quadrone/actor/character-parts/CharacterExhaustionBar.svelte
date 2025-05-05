<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let exhaustionLevel = 0;
  let levels = 6 + 1;
  
  const dispatch = createEventDispatcher();

  function isActive(level: number): boolean {
    return level === exhaustionLevel;
  }
  
  function close() {
    dispatch('close');
  }
  
  function setExhaustionLevel(level: number) {
    dispatch('update', { level });
  }
</script>

<div class="exhaustion-bar flexrow">
  {#each Array(levels) as _, i}
    <button
      aria-label="Exhaustion level {i}"
      type="button"
      class="button button-borderless button-icon-only button-config {isActive(i) ? 'active' : ''}"
      on:click={() => { setExhaustionLevel(i); close(); }}>
      {i}
    </button>
  {/each}
  <button
    aria-label="Close exhaustion bar"
    type="button"
    class="button button-borderless button-icon-only button-config"
    on:click={close}>
    <i class="fas fa-times"></i>
  </button>
</div>
