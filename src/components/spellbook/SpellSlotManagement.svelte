<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    SpellbookSection,
  } from 'src/types/types';
  import SpellSlotConfigButton from './SpellSlotConfigButton.svelte';
  import SpellSlotUses from './SpellSlotUses.svelte';
  import SpellPips from '../pips/SpellPips.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    section: SpellbookSection;
  }

  let { section }: Props = $props();

  let context = getSheetContext<CharacterSheetContext | NpcSheetContext>();
</script>

<div class="flex-row extra-small-gap">
  {#if context.spellSlotTrackerMode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS}
    <SpellPips {section} />
  {/if}
  {#if context.spellSlotTrackerMode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX}
    <SpellSlotUses {section} />
  {/if}
  {#if context.unlocked}
    <SpellSlotConfigButton />
  {/if}
</div>
