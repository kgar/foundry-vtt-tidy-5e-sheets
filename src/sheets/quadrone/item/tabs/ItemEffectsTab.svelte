<script lang="ts">
  import EffectsTables from '../../shared/EffectsTables.svelte';

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div bind:this={sectionsContainer} class="tidy-table-container">
  <EffectsTables inlineWidth={sectionsInlineWidth} />
</div>
