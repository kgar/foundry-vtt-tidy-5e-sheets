<script lang="ts">
  import { usePerformanceMode } from 'src/settings/settings.svelte';
  import { EventHelper } from 'src/utils/events';
  import { untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // TODO: There has to be a better way than all this, and perhaps a more performant approach?

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

  let showExpandedClass = $state(expanded);
  let overflowYHidden = $state(!expanded);
  let renderContents = $state(expanded);
  let expandableContainer: HTMLElement;

  const usesTransitions = !usePerformanceMode();

  $effect(() => {
    if (!usesTransitions) {
      showExpandedClass = expanded;
      onStart();
      onEnd();
      return;
    }

    expandableContainer.addEventListener(
      'transitionstart',
      () => {
        onStart();
      },
      { once: true },
    );
    expandableContainer.addEventListener(
      'transitionend',
      () => {
        onEnd();
      },
      { once: true },
    );

    showExpandedClass = expanded;
  });

  $effect(() => {
    if (expanded) {
      renderContents = true;
    }
  });

  function onStart() {
    overflowYHidden = true;
  }

  function onEnd() {
    overflowYHidden = !expanded;
    renderContents = expanded;
  }
</script>

<div
  bind:this={expandableContainer}
  class={[
    'expandable',
    cssClass,
    {
      expanded: showExpandedClass,
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
