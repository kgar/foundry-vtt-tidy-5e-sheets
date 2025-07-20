<script lang="ts">
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';

  interface Props {
    section: SpellbookSection;
  }

  let { section }: Props = $props();

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let uses = $derived(section.uses ?? 0);
  let slots = $derived(section.slots ?? 0);
  let hasTempSlots = $derived(uses > slots);

  function updateSlots(newValue: number) {
    context.actor.update({
      [`system.spells.${section.slot}.value`]: newValue,
    });
  }
</script>

<div class={['spell-slot-tracker flexrow']}>
  <button
    type="button"
    class="spell-slot-tracker-button button button-borderless button-icon-only flexshrink"
    disabled={uses <= 0}
    onclick={() => updateSlots(uses - 1)}>
    <i class="fa-solid fa-hexagon-minus"></i>
  </button>
  {#if context.unlocked}
    <NumberInputQuadrone
      document={context.actor}
      field="system.spells.{section.slot}.value"
      class={['spell-slot-uses uninput uses-value color-text-default', { ['has-temp-slots']: hasTempSlots }]}
      value={uses}
      placeholder="0"
      min="0"
      step="1"
    />
  {:else}
    <span class={['value', { ['has-temp-slots']: hasTempSlots }, { ['color-text-lightest']: uses <= 0 }]}>{uses}</span>
  {/if}
  <span class="separator color-text-lightest">/</span>
  <span class="max color-text-lighter">{slots}</span>
  <button
    type="button"
    class="spell-slot-tracker-button button button-borderless button-icon-only flexshrink"
    onclick={() => updateSlots(uses + 1)}>
    <i class="fa-solid fa-hexagon-plus"></i>
  </button>
</div>
