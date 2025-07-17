<script lang="ts">
  import type {
    ActorSheetClassicContextV2,
    ActorSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import SpellPip from './SpellPip.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    section: SpellbookSection;
  }

  let { section }: Props = $props();

  let context =
    $derived(
      getSheetContext<ActorSheetClassicContextV2 | ActorSheetQuadroneContext>(),
    );

  function onPipClick(index: number) {
    let isEmpty = index >= (section.uses ?? 0);

    let value = isEmpty ? index + 1 : index;

    context.actor.update({
      [`system.spells.${section.slot}.value`]: value,
    });
  }

  let uses = $derived(section.uses ?? 0);
  let slots = $derived(section.slots ?? 0);

  let totalPips = $derived(Math.max(uses, slots));
</script>

<div class="pips spell-pips">
  {#each { length: totalPips }, index}
    <SpellPip
      uses={uses ?? 0}
      {index}
      temp={index >= slots}
      onclick={() => context.editable && onPipClick(index)}
    />
  {/each}

  <span class="pip-end"></span>
</div>
