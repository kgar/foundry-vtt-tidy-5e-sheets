<script lang="ts">
  import { EventHelper } from 'src/utils/events';
  import { onMount, untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    expanded?: boolean;
    children?: Snippet;
    /** Even when collapsed, render the wrapper and its children. */
    alwaysRenderWrapper?: boolean;
  } & HTMLAttributes<HTMLElement>;

  let {
    expanded = true,
    children,
    class: cssClass,
    alwaysRenderWrapper = true,
    ...rest
  }: Props = $props();

  let overflowYHidden = $state(!expanded);
  let expandableContainer: HTMLElement;

  let renderContents = $state<boolean>(expanded);

  onMount(() => {
    const controller = new AbortController();

    expandableContainer.addEventListener(
      'transitionstart',
      (ev) => {
        if (ev.target === expandableContainer) {
          overflowYHidden = true;

          if (expanded) {
            renderContents = true;
          }
        }
      },
      {
        signal: controller.signal,
        passive: true,
      },
    );

    expandableContainer.addEventListener(
      'transitionend',
      (ev) => {
        if (ev.target === expandableContainer) {
          overflowYHidden = !expanded;
          renderContents = expanded;
        }
      },
      {
        signal: controller.signal,
        passive: true,
      },
    );

    return () => {
      controller.abort();
    };
  });
</script>

<div
  bind:this={expandableContainer}
  class={[
    'expandable',
    cssClass,
    {
      expanded,
      'overflow-y-hidden': overflowYHidden,
    },
  ]}
  role="presentation"
  {...rest}
>
  {#if alwaysRenderWrapper || renderContents}
    <div
      role="presentation"
      class="expandable-child-animation-wrapper"
      {@attach () => {
        untrack(() => {
          if (!alwaysRenderWrapper && expandableContainer) {
            EventHelper.triggerDynamicContentRenderedEvent(expandableContainer);
          }
        });
      }}
    >
      {@render children?.()}
    </div>
  {/if}
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
