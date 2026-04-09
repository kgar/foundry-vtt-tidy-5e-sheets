<script lang="ts">
  import { usePerformanceMode } from 'src/settings/settings.svelte';
  import { EventHelper } from 'src/utils/events';
  import { onMount, untrack, type Snippet } from 'svelte';
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

  // svelte-ignore state_referenced_locally
  let overflowYHidden = $state(!expanded);
  let expandableContainer: HTMLElement;

  // svelte-ignore state_referenced_locally
  let renderContents = $state<boolean>(expanded);

  const usesTransitions = !usePerformanceMode();

  $effect(() => {
    if (usesTransitions) {
      return;
    }

    expanded;
    onStart();
    onEnd();
  });

  onMount(() => {
    if (!usesTransitions) {
      return;
    }
    const controller = new AbortController();

    expandableContainer.addEventListener(
      'transitionstart',
      (ev) => {
        if (ev.target === expandableContainer) {
          onStart();
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
          onEnd();
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
