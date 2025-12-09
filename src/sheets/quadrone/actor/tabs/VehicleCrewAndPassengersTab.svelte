<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { Actor5e } from 'src/types/types';
  import { createSearchResultsState } from 'src/features/search/search.svelte';
  import { isNil } from 'src/utils/data';

  let context = $derived(getVehicleSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);
    return () => {
      observer.disconnect();
    };
  });

  $effect(() => {
    searchResults.uuids = !isNil(searchCriteria)
      ? new Set(
          // context.crew.sections
          //   .filter((m: Actor5e) =>
          //     m.actor.name.toLowerCase().includes(searchCriteria),
          //   )
          //   .map((m: Actor5e) => m.actor.uuid),
        )
      : undefined;
  });
</script>

<section class="vehicle-tab-content flexcol" bind:this={sectionsContainer}>
  <!-- TODO: Action Bar -->

  <!-- TODO: Sections  -->

  <!-- TODO: Empty State UI -->
</section>

<!-- TODO: Use snippets like Group sheet which are accent-color-aware for hover states, etc. -->