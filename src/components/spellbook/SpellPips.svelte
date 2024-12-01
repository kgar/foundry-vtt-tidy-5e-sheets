<script lang="ts">
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    SpellbookSection,
  } from 'src/types/types';
  import { getContext, type ComponentProps } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SpellPip from './SpellPip.svelte';
  import { CONSTANTS } from 'src/constants';

  type SpellPipProps = ComponentProps<typeof SpellPip> & { index: number };

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  interface Props {
    section: SpellbookSection;
  }

  let { section }: Props = $props();

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

  // kgar-migration-task - especially test this component for proper pip behavior
  let pips: SpellPipProps[] = $derived.by(() => generatePips());
</script>

{#if (section.slots ?? 0) > 0}
  <div class="spell-slot-markers">
    {#each pips as pip}
      <SpellPip
        disabled={pip.disabled}
        isEmpty={pip.isEmpty}
        willChange={pip.willChange}
        onclick={() => onSpellMarkerClick(section, pip.index)}
        onmouseenter={() => onMouseEnterDot(pip.index)}
        onmouseleave={() => onMouseLeaveDot(pip.index)}
        onfocusin={() => onMouseEnterDot(pip.index)}
        onfocusout={() => onMouseLeaveDot(pip.index)}
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
