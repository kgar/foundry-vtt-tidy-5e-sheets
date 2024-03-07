<script lang="ts">
  import { onMount } from 'svelte';

  export let expanded: boolean = true;

  let overflowYHidden = !expanded;
  let expandableContainer: HTMLElement;

  onMount(() => {
    expandableContainer.addEventListener('transitionstart', () => {
      overflowYHidden = true;
    });

    expandableContainer.addEventListener('transitionend', () => {
      overflowYHidden = !expanded;
    });
  });
</script>

<div
  bind:this={expandableContainer}
  class="expandable"
  class:expanded
  class:overflow-y-hidden={overflowYHidden}
  role="presentation"
>
  <slot />
</div>

<style lang="scss">
  .expandable {
    display: grid;
    grid-template-rows: 0fr;

    &.expanded {
      grid-template-rows: 1fr;
    }

    transition: grid-template-rows 0.2s ease;
  }

  .overflow-y-hidden :global(> *) {
    overflow-y: hidden;
  }
</style>
