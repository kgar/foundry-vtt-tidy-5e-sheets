<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  interface Props {
    expanded?: boolean;
    children?: Snippet;
    [key: string]: any;
  }

  let { expanded = true, children, ...rest }: Props = $props();

  let overflowYHidden = $state(!expanded);
  let expandableContainer: HTMLElement;

  onMount(() => {
    const controller = new AbortController();

    expandableContainer.addEventListener(
      'transitionstart',
      (ev) => {
        if (ev.target === expandableContainer) {
          overflowYHidden = true;
        }
      },
      {
        signal: controller.signal,
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
        signal: controller.signal,
      },
    );

    return () => {
      controller.abort();
    };
  });
</script>

<div
  bind:this={expandableContainer}
  class="expandable {rest.class ?? ''}"
  class:expanded
  class:overflow-y-hidden={overflowYHidden}
  role="presentation"
>
  <div role="presentation" class="expandable-child-animation-wrapper">
    {@render children?.()}
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

    grid-template-columns: minmax(0, 1fr);
  }

  .overflow-y-hidden :global(> *) {
    overflow-y: hidden;
  }
</style>
