<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import SpellPips from './SpellPips.svelte';
  import SpellSlotConfigButton from './SpellSlotConfigButton.svelte';
  import SpellSlotUses from './SpellSlotUses.svelte';

  export let section: any;

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');
</script>

<div class="flex-row extra-small-gap">
  {#if $context.spellSlotTrackerMode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS}
    <SpellPips {section} />
  {/if}
  {#if $context.spellSlotTrackerMode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX}
    <SpellSlotUses {section} />
  {/if}
  {#if section.usesSlots && $context.unlocked}
    <SpellSlotConfigButton />
  {/if}
</div>
