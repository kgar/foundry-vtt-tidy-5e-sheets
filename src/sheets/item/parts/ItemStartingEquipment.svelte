<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { coalesce } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header flex-row justify-content-space-between">
  {localize('DND5E.StartingEquipment.Title')}
  <span>
    <button
      type="button"
      class="configure-starting-equipment inline-icon-button"
      title={localize('DND5E.StartingEquipment.Action.Configure')}
      aria-label={localize('DND5E.StartingEquipment.Action.Configure')}
      on:click={() => FoundryAdapter.openStartingEquipmentConfig($context.item)}
    >
      <i class="fas fa-gear"></i>
    </button>
  </span>
</h3>

{@html coalesce($context.system.startingEquipmentDescription, localize('None'))}

<style lang="scss">
  span:has(.configure-starting-equipment) {
    font-size: 0.875rem;
  }
</style>
