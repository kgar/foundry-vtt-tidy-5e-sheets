<script lang="ts">
  import { onMount } from 'svelte';

  export let expanded: boolean = true;

  let overflowYHidden = !expanded;
  let expandableContainer: HTMLElement;

  onMount(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    expandableContainer.addEventListener(
      'transitionstart',
      (ev) => {
        if (ev.target === expandableContainer) {
          overflowYHidden = true;
        }
      },
      {
        signal: signal,
      },
    );

    expandableContainer.addEventListener(
      'transitionend',
      (ev) => {
        if (ev.target === expandableContainer) {
          overflowYHidden = !expanded;
        }
      },

      {
        signal: signal,
      },
    );

    return () => {
      controller.abort();
    };
  });
</script>

<div
  bind:this={expandableContainer}
  class="expandable {$$restProps.class ?? ''}"
  class:expanded
  class:overflow-y-hidden={overflowYHidden}
  role="presentation"
>
  <div role="presentation" class="expandable-child-animation-wrapper">
    <slot />
  </div>
</div>

<style lang="scss">
  .expandable {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.2s ease;

    &.expanded {
      grid-template-rows: 1fr;
    }
  }

  .overflow-y-hidden :global(> *) {
    overflow-y: hidden;
  }
</style>
