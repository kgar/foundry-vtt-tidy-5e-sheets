<script lang="ts">
  import { visibilityObserver } from 'src/attachments/visibility-observer.svelte';
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

  const headerOffset = $derived.by(() => {
    return untrack(() => {
      const headerHeight = coalesce(
        window.getComputedStyle(context.sheet.window.header).height,
        '36',
      );

      return `-${headerHeight}px`;
    });
  });

  let windowHeader = $derived(context.sheet.window.header);

  let { itemNameEl }: Props = $props();
</script>

<!--
  @component
    
  Enables the header to dynamically show the document name
  when the item name input scrolls out of view.
-->

<div
  {@attach windowHeader
    ? visibilityObserver({
        root: context.sheet.windowContent,
        trackWhenOffScreen: true,
        offScreenClass: 'scroll-marker-off-screen',
        toAffect: [windowHeader],
      })
    : null}
  {@attach itemNameEl && windowHeader
    ? visibilityObserver({
        root: context.sheet.windowContent,
        trackWhenOnScreen: true,
        onScreenClass: 'item-name-visible',
        toObserve: [itemNameEl],
        toAffect: [windowHeader],
        rootMargin: headerOffset,
      })
    : null}
  class="item-header-start-scroll-marker"
  role="presentation"
></div>
