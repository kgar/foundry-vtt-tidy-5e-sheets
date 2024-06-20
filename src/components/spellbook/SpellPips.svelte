<script lang="ts">
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    SpellbookSection,
  } from 'src/types/types';
  import { getContext, type ComponentProps } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SpellPip from './SpellPip.svelte';

  type SpellPipProps = ComponentProps<SpellPip> & { index: number };

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');
  export let section: SpellbookSection;

  let targetedDotIndex: number | null = null;

  function onSpellMarkerClick(section: SpellbookSection, markerIndex: number) {
    let isEmpty = markerIndex >= (section.uses ?? 0);

    let value = isEmpty ? markerIndex + 1 : markerIndex;

    $context.actor.update({
      [`system.spells.${section.prop}.value`]: value,
    });
  }

  function isEmpty(index: number) {
    return index >= (section.uses ?? 0);
  }

  function willChange(index: number): boolean {
    if (targetedDotIndex === null) {
      return false;
    }

    return (
      (isEmpty(index) && index <= targetedDotIndex) ||
      (!isEmpty(index) && index >= targetedDotIndex)
    );
  }

  function onMouseEnterDot(index: number) {
    targetedDotIndex = index;
    pips = generatePips();
  }

  function onMouseLeaveDot(index: number) {
    targetedDotIndex = null;
    pips = generatePips();
  }

  function generatePips(): SpellPipProps[] {
    return Array.from({ length: section.slots ?? 0 }, (x, i) => ({
      index: i,
      isEmpty: isEmpty(i),
      willChange: willChange(i),
      disabled: !$context.editable,
    }));
  }

  let pips: SpellPipProps[];
  $: section, (pips = generatePips());
</script>

{#if (section.slots ?? 0) > 0}
  <div class="spell-slot-markers">
    {#each pips as pip}
      <SpellPip
        disabled={pip.disabled}
        isEmpty={pip.isEmpty}
        willChange={pip.willChange}
        on:click={() => onSpellMarkerClick(section, pip.index)}
        on:mouseenter={() => onMouseEnterDot(pip.index)}
        on:mouseleave={() => onMouseLeaveDot(pip.index)}
        on:focusin={() => onMouseEnterDot(pip.index)}
        on:focusout={() => onMouseLeaveDot(pip.index)}
      />
    {/each}
  </div>
{/if}

<style lang="scss">
  .spell-slot-markers {
    display: flex;
    gap: 0.125rem;
    margin-top: -0.125rem;
    align-items: center;
  }
</style>
