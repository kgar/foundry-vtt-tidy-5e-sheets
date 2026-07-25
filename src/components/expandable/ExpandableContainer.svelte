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

  let showExpandedClass = $state(true);
  let overflowYHidden = $state(false);
  let renderContents = $state(true);
  let expandableContainer: HTMLElement;
  let initialized = false;

  const usesTransitions = $derived(!usePerformanceMode());
  const transitionFallbackMs = 500;

  $effect.pre(() => {
    if (initialized) {
      return;
    }

    initialized = true;
    showExpandedClass = expanded;
    overflowYHidden = !expanded;
    renderContents = expanded;
  });

  $effect(() => {
    const target = expanded;

    if (untrack(() => showExpandedClass) === target) {
      return;
    }

    if (!usesTransitions) {
      showExpandedClass = target;
      onStart();
      onEnd();
      return;
    }

    const controller = new AbortController();

    // Release collapsed content in case of no transitions/changes
    const fallback = setTimeout(() => {
      onStart();
      onEnd();
    }, transitionFallbackMs);

    // Nested expandables and child animations bubble their events up to here.
    const isOwnTransition = (ev: TransitionEvent) =>
      ev.target === expandableContainer;

    const finish = () => {
      clearTimeout(fallback);
      controller.abort();
      onEnd();
    };

    expandableContainer.addEventListener(
      'transitionstart',
      (ev) => {
        if (!isOwnTransition(ev)) {
          return;
        }

        clearTimeout(fallback);
        onStart();
      },
      { signal: controller.signal },
    );

    expandableContainer.addEventListener(
      'transitionend',
      (ev) => isOwnTransition(ev) && finish(),
      { signal: controller.signal },
    );

    expandableContainer.addEventListener(
      'transitioncancel',
      (ev) => isOwnTransition(ev) && finish(),
      { signal: controller.signal },
    );

    showExpandedClass = target;

    return () => {
      clearTimeout(fallback);
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
