<script lang="ts">
  import type { CharacterSheetContext } from 'src/foundry/foundry-adapter';

  type SpellSlotMarkerDot = {
    index: number;
    isEmpty: boolean;
    willChange: boolean;
  };

  export let context: CharacterSheetContext;
  export let section: any;

  let targetedDotIndex: number | null = null;

  function onSpellMarkerClick(section: any, markerIndex: number) {
    let isEmpty = markerIndex >= section.uses;

    let value = isEmpty ? markerIndex + 1 : markerIndex;

    context.actor.update({
      [`data.spells.${section.prop}.value`]: value,
    });
  }

  function isEmpty(index: number) {
    return index >= section.uses;
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
    dots = generateDots();
  }

  function onMouseLeaveDot(index: number) {
    targetedDotIndex = null;
    dots = generateDots();
  }

  function generateDots(): SpellSlotMarkerDot[] {
    return Array.from({ length: section.slots }, (x, i) => ({
      index: i,
      isEmpty: isEmpty(i),
      willChange: willChange(i),
    }));
  }

  let dots = generateDots();
  console.log(dots);
</script>

{#if section.slots > 0}
  <div class="spell-slot-markers">
    {#each dots as dot}
      <span
        class="dot"
        class:empty={dot.isEmpty}
        class:change={dot.willChange}
        on:click={() => onSpellMarkerClick(section, dot.index)}
        on:mouseenter={() => onMouseEnterDot(dot.index)}
        on:mouseleave={() => onMouseLeaveDot(dot.index)}
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

    .dot {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background-color: var(--t5e-primary-accent);
      border: 1px solid var(--t5e-primary-font);
      &:hover,
      &.change {
        background-color: var(--t5e-warning-accent);
      }

      &.empty {
        background-color: transparent;

        &:hover,
        &.change {
          background-color: var(--t5e-prepared);
        }
      }
    }
  }
</style>
