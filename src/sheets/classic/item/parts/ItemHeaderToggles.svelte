<script lang="ts">
  import PropertyToggle from 'src/components/toggles/PropertyToggle.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetClassicContext,
    ItemSheetContext,
  } from 'src/types/item.types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getSheetContext<
    ItemSheetContext | ContainerSheetClassicContext
  >());

  const localize = FoundryAdapter.localize;

  let equipLabelWidthCh = $derived(
    Math.max(
      localize('DND5E.Equipped').length,
      localize('DND5E.Unequipped').length,
    ),
  );
  let identifiedLabelWidthCh = $derived(
    Math.max(
      localize('DND5E.Identified').length,
      localize('DND5E.Unidentified.Title').length,
    ),
  );
</script>

<div class="flex-row extra-small-gap flex-wrap">
  <PropertyToggle
    document={context.item}
    field="system.equipped"
    checked={context.system.equipped}
    disabled={!context.editable}
    title={context.system.equipped
      ? localize('DND5E.Equipped')
      : localize('DND5E.Unequipped')}
    iconClass="fas fa-user-alt fa-fw"
  >
    <div style="width: {equipLabelWidthCh}ch">
      {context.system.equipped
        ? localize('DND5E.Equipped')
        : localize('DND5E.Unequipped')}
    </div>
  </PropertyToggle>

  {#if FoundryAdapter.canIdentify(context.item)}
    <PropertyToggle
      document={context.item}
      field="system.identified"
      checked={context.system.identified}
      disabled={!context.editable}
      title={context.system.identified
        ? localize('DND5E.Identified')
        : localize('DND5E.Unidentified.Title')}
      iconClass="fas fa-magnifying-glass fa-fw"
    >
      <div style="width: {identifiedLabelWidthCh}ch">
        {context.system.identified
          ? localize('DND5E.Identified')
          : localize('DND5E.Unidentified.Title')}
      </div>
    </PropertyToggle>
  {/if}
</div>
