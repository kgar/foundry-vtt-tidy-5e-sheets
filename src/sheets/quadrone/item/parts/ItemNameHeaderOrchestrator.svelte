<script lang="ts">
  import TidyVisibilityObserver from 'src/components/utility/TidyVisibilityObserver.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { coalesce } from 'src/utils/formatting';
  import { untrack } from 'svelte';

  let context = $derived(getContainerSheetQuadroneContext());

  interface Props {
    /**
     * The item name input whose visibility should be tracked.
     * When it goes out of view, the header item name is shown.
     */
    itemNameEl?: HTMLElement;
  }

  let scrollMarkerEl: HTMLElement | undefined = $state();

  const headerOffset = $derived.by(() => {
    return untrack(() => {
      const headerHeight = coalesce(
        window.getComputedStyle(context.item.sheet.window.header).height,
        '36',
      );

      return `-${headerHeight}px`;
    });
  });

  let { itemNameEl }: Props = $props();
</script>

<!--
  @component
    
  Enables the header to dynamically show the document name
  when the item name input scrolls out of view.
-->

{#if !!itemNameEl}
  <TidyVisibilityObserver
    root={context.item.sheet.windowContent}
    trackWhenOffScreen={true}
    toObserve={[itemNameEl]}
    toAffect="self"
    rootMargin={headerOffset}
  />
{/if}

{#if !!scrollMarkerEl}
  <TidyVisibilityObserver
    root={context.item.sheet.windowContent}
    trackWhenOffScreen={true}
    toObserve={[scrollMarkerEl]}
    toAffect="self"
  />
{/if}

<div
  bind:this={scrollMarkerEl}
  class="item-header-start-scroll-marker"
  role="presentation"
></div>
