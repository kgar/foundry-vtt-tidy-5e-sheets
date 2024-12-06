<script lang="ts">
  import type { ActorSheetContextV2, SpellbookSection } from 'src/types/types';
  import SpellPip from './SpellPip.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    section: SpellbookSection;
  }

  let { section }: Props = $props();

  let context = getContext<Readable<ActorSheetContextV2>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  function onPipClick(index: number) {
    let isEmpty = index >= (section.uses ?? 0);

    let value = isEmpty ? index + 1 : index;

    $context.actor.update({
      [`system.spells.${section.prop}.value`]: value,
    });
  }
</script>

<div class="pips spell-pips">
  {#each { length: section.slots ?? 0 }, index}
    <SpellPip
      uses={section.uses ?? 0}
      {index}
      onclick={() => $context.editable && onPipClick(index)}
    />
  {/each}
  <span class="pip-end"></span>
</div>
