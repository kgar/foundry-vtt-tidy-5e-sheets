<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { SpellbookSection } from 'src/types/types';
  import SpellSlotTracker from './SpellSlotTracker.svelte';
  import SpellPipsQuadrone from 'src/components/pips/SpellPipsQuadrone.svelte';

  interface Props {
    mode: string;
    section: SpellbookSection;
  }

  let { mode, section }: Props = $props();
</script>

{#if mode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX}
  <SpellSlotTracker {section} />
{:else if mode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS}
  <SpellPipsQuadrone
    max={section.slots}
    prop="system.spells.{section.slot}.value"
    uses={section.uses}
  />
{/if}
