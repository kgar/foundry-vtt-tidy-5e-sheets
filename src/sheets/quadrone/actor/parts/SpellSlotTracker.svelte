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
      [`system.spells.${section.prop}.value`]: newValue,
    });
  }
</script>

<div class={['spell-slot-tracker']}>
  <button
    type="button"
    class="spell-slot-tracker-button"
    disabled={uses <= 0}
    onclick={() => updateSlots(uses - 1)}>-</button
  >
  {#if context.unlocked}
    <NumberInputQuadrone
      document={context.actor}
      field="system.spells.{section.prop}.value"
      class={['spell-slot-uses', { ['has-temp-slots']: hasTempSlots }]}
      value={uses}
      placeholder="0"
      min="0"
      step="1"
    />
  {:else}
    <span class={['value', { ['has-temp-slots']: hasTempSlots }]}>{uses}</span>
  {/if}
  <span class="separator">/</span>
  <span class="max">{slots}</span>
  <button
    type="button"
    class="spell-slot-tracker-button"
    onclick={() => updateSlots(uses + 1)}>+</button
  >
</div>
