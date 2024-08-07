<script lang="ts">
  import PropertyToggle from 'src/components/toggle/PropertyToggle.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetContext,
    ItemSheetContext,
  } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext | ContainerSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  $: equipLabelWidthCh = Math.max(
    localize('DND5E.Equipped').length,
    localize('DND5E.Unequipped').length,
  );
  $: identifiedLabelWidthCh = Math.max(
    localize('DND5E.Identified').length,
    localize('DND5E.Unidentified.Title').length,
  );
</script>

<div class="flex-row extra-small-gap flex-wrap">
  <PropertyToggle
    document={$context.item}
    field="system.equipped"
    checked={$context.system.equipped}
    disabled={!$context.editable}
    title={$context.system.equipped
      ? localize('DND5E.Equipped')
      : localize('DND5E.Unequipped')}
    iconClass="fas fa-user-alt fa-fw"
  >
    <div style="width: {equipLabelWidthCh}ch">
      {$context.system.equipped
        ? localize('DND5E.Equipped')
        : localize('DND5E.Unequipped')}
    </div>
  </PropertyToggle>

  {#if FoundryAdapter.canIdentify($context.item)}
    <PropertyToggle
      document={$context.item}
      field="system.identified"
      checked={$context.system.identified}
      disabled={!$context.editable}
      title={$context.system.identified
        ? localize('DND5E.Identified')
        : localize('DND5E.Unidentified.Title')}
      iconClass="fas fa-magnifying-glass fa-fw"
    >
      <div style="width: {identifiedLabelWidthCh}ch">
        {$context.system.identified
          ? localize('DND5E.Identified')
          : localize('DND5E.Unidentified.Title')}
      </div>
    </PropertyToggle>
  {/if}
</div>
