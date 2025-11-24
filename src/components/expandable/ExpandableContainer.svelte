<script lang="ts">
  import { EventHelper } from 'src/utils/events';
  import { onMount, untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    expanded?: boolean;
    children?: Snippet;
    /**
     * When collapsed, exclude the wrapper and its children from rendering.
     * When rendering the content, trigger a soft render of the sheet
     * to ensure all integrating code can inject content appropriately.
     */
    deferRendering?: boolean;
  } & HTMLAttributes<HTMLElement>;

  let {
    expanded = true,
    children,
    class: cssClass,
    deferRendering,
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
  {#if !deferRendering || renderContents}
    <div
      role="presentation"
      class="expandable-child-animation-wrapper"
      {@attach () => {
        untrack(() => {
          if (deferRendering && expandableContainer) {
            EventHelper.triggerDynamicContentRenderedEvent(expandableContainer);
          }
        });
      }}
    >
      {@render children?.()}
    </div>
  {/if}
</div>
