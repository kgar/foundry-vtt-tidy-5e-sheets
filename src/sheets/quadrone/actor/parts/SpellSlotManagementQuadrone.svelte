<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { SpellbookSection } from 'src/types/types';
  import SpellSlotTracker from './SpellSlotTracker.svelte';
  import SpellPips from 'src/components/pips/SpellPips.svelte';

  interface Props {
    mode: string;
    section: SpellbookSection;
  }

  let { mode, section }: Props = $props();
</script>

{#if mode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX}
  <SpellSlotTracker {section} />
{:else if mode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS}
  <SpellPips {section} />
{/if}
