<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    section: SpellbookSection;
  }

  let { section }: Props = $props();
  let localize = FoundryAdapter.localize;

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
    disabled={uses <= 0 || !context.editable}
    aria-label={localize('DND5E.CONSUMPTION.Type.SpellSlots.PromptDecrease')}
    data-action="decreaseSlots"
    onclick={() => updateSlots(uses - 1)}
  >
    <i class="fa-solid fa-hexagon-minus"></i>
  </button>
  {#if context.unlocked}
    <input
      type="text"
      inputmode="numeric"
      data-name="system.spells.{section.slot}.value"
      class={[
        'spell-slot-uses uninput uses-value color-text-default',
        { ['has-temp-slots']: hasTempSlots },
      ]}
      value={uses}
      placeholder="0"
      data-min="0"
      {@attach InputAttachments.selectOnFocus}
    />
  {:else}
    <span
      class={[
        'value',
        { ['has-temp-slots']: hasTempSlots },
        { ['color-text-lightest']: uses <= 0 },
      ]}>{uses}</span
    >
  {/if}
  <span class="separator color-text-lightest">/</span>
  <span class="max color-text-lighter">{slots}</span>
  <button
    type="button"
    class="spell-slot-tracker-button button button-borderless button-icon-only flexshrink"
    data-action="increaseSlots"
    aria-label={localize('DND5E.CONSUMPTION.Type.SpellSlots.PromptIncrease')}
    onclick={() => updateSlots(uses + 1)}
    disabled={!context.editable}
  >
    <i class="fa-solid fa-hexagon-plus"></i>
  </button>
</div>
