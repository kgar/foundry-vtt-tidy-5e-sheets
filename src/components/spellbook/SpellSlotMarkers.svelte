<script lang="ts">
  import { settingStore } from 'src/settings/settings';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  type SpellSlotMarkerDot = {
    index: number;
    isEmpty: boolean;
    willChange: boolean;
  };

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');
  export let section: any;

  let targetedDotIndex: number | null = null;

  function onSpellMarkerClick(section: any, markerIndex: number) {
    let isEmpty = markerIndex >= section.uses;

    let value = isEmpty ? markerIndex + 1 : markerIndex;

    $context.actor.update({
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

  let dots: SpellSlotMarkerDot[];
  $: section, (dots = generateDots());
</script>

{#if section.slots > 0}
  <div class="spell-slot-markers">
    {#each dots as dot}
      <button
        type="button"
        class="dot"
        class:empty={dot.isEmpty}
        class:change={dot.willChange}
        on:click={() => onSpellMarkerClick(section, dot.index)}
        on:mouseenter={() => onMouseEnterDot(dot.index)}
        on:mouseleave={() => onMouseLeaveDot(dot.index)}
        on:focusin={() => onMouseEnterDot(dot.index)}
        on:focusout={() => onMouseLeaveDot(dot.index)}
        disabled={!$context.editable}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
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
      margin: 0;
      padding: 0;
      line-height: normal;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background-color: var(--t5ek-primary-accent-color);
      border: 0.0625rem solid var(--t5ek-separator-color);
      transition: background-color 0.3s ease;

      &:is(:hover, :focus-visible),
      &.change {
        background-color: var(--t5ek-warning-accent-color);
      }

      &.empty {
        background-color: transparent;

        &:is(:hover, :focus-visible),
        &.change {
          background-color: var(--t5ek-prepared-background);
        }
      }
    }
  }
</style>
