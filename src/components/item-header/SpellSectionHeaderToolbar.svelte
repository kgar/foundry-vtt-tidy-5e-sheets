<script lang="ts">
  import { settingStore } from 'src/settings/settings';
  import SpellSectionHeaderToolbarContent from './SpellSectionHeaderToolbarContent.svelte';
  import SpellSlotMarkers from '../spellbook/SpellSlotMarkers.svelte';
  import SpellSlotUses from '../spellbook/SpellSlotUses.svelte';
  import { CONSTANTS } from 'src/constants';

  export let section: any;
</script>

<!-- TODO: Use logic to only show the toolbar if there are slots and/or custom content -->
<div class="item-header-toolbar">
  <div class="left">
    {#if section.usesSlots && $settingStore.spellSlotTracker === CONSTANTS.SPELL_SLOT_TRACKER_OPTION_NUMBERS}
      <SpellSectionHeaderToolbarContent class="flex-0">
        <SpellSlotUses {section} />
      </SpellSectionHeaderToolbarContent>
    {/if}
    {#if section.usesSlots && $settingStore.spellSlotTracker === CONSTANTS.SPELL_SLOT_TRACKER_OPTION_PIPS}
      <SpellSectionHeaderToolbarContent class="flex-row">
        <SpellSlotMarkers {section} />
      </SpellSectionHeaderToolbarContent>
    {/if}
  </div>
  <div class="right">
    <!-- TODO: Add API support for custom stuff here -->
  </div>
</div>

<style lang="scss">
  .item-header-toolbar {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    margin-bottom: 0.125rem;
    margin-left: 0.0625rem;
    margin-right: 0.0625rem;

    .left,
    .right {
      display: flex;
      gap: 0.125rem;
    }
  }
</style>
