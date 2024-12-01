<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    SpellbookSection,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SpellPips from './SpellPips.svelte';
  import SpellSlotConfigButton from './SpellSlotConfigButton.svelte';
  import SpellSlotUses from './SpellSlotUses.svelte';

  interface Props {
    section: SpellbookSection;
  }

  let { section }: Props = $props();

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="flex-row extra-small-gap">
  {#if $context.spellSlotTrackerMode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS}
    <SpellPips {section} />
  {/if}
  {#if $context.spellSlotTrackerMode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX}
    <SpellSlotUses {section} />
  {/if}
  {#if $context.unlocked}
    <SpellSlotConfigButton />
  {/if}
</div>
