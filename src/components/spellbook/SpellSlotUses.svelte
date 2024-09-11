<script lang="ts">
  import {
    type CharacterSheetContext,
    type NpcSheetContext,
    type SpellbookSection,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from '../inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';

  export let section: SpellbookSection;

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="spell-slots-detail">
  <TextInput
    document={$context.actor}
    field="system.spells.{section.prop}.value"
    class="spell-slot-uses"
    value={section.uses}
    placeholder="0"
    selectOnFocus={true}
    allowDeltaChanges={true}
    disabled={!$context.editable}
  />
  <span class="sep"> / </span>

  <span class="spell-max" data-level={section.prop} data-slots={section.slots}>
    {section.slots}
  </span>
</div>

<style lang="scss">
  .spell-slots-detail {
    display: flex;
    flex: 0 0 0.0625rem;
    align-items: center;
    color: var(--t5e-secondary-color);
    border-radius: 0.3125rem;
    padding: 0 0.3125rem;

    :global(input) {
      text-align: right;
      height: 0.8125rem;
      margin-top: -0.0625rem;
      min-width: 1rem;
    }

    .spell-max {
      display: flex;
      align-items: center;
      line-height: 0.75rem;
      text-align: left;
    }
  }
</style>
