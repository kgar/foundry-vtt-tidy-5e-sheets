<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ActorConditionsQuadrone from '../parts/ActorConditionsQuadrone.svelte';
  import EffectsTables from '../../shared/EffectsTables.svelte';
  import type {
    ActorSheetQuadroneContext,
    CharacterSheetQuadroneContext,
  } from 'src/types/types';

  let context =
    $derived(
      getSheetContext<
        ActorSheetQuadroneContext | CharacterSheetQuadroneContext
      >(),
    );

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

<div class="tab-content">
  <div bind:this={sectionsContainer} class="tidy-table-container">
    <EffectsTables inlineWidth={sectionsInlineWidth} />

    {#if 'conditions' in context}
      <ActorConditionsQuadrone conditions={context.conditions} />
    {/if}
  </div>
</div>
