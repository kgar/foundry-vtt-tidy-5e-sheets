<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { coalesce } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.document.id;

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header flex-row justify-content-space-between">
  {localize('DND5E.StartingEquipment.Title')}
  {#if $context.editable}
    <span>
      <button
        type="button"
        class="configure-starting-equipment inline-icon-button"
        title={localize('DND5E.StartingEquipment.Action.Configure')}
        aria-label={localize('DND5E.StartingEquipment.Action.Configure')}
        on:click={() =>
          FoundryAdapter.openStartingEquipmentConfig($context.item)}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-gear"></i>
      </button>
    </span>
  {/if}
</h3>

<div class="starting-equipment-text">
  {@html coalesce(
    $context.system.startingEquipmentDescription,
    localize('None'),
  )}
</div>

<div class="form-group">
  <label for="{appId}-wealth"
    >{localize('DND5E.StartingEquipment.Wealth.Label')}</label
  >
  <div class="form-fields">
    <TextInput
      id="{appId}-wealth"
      document={$context.item}
      field="system.wealth"
      value={$context.source.wealth}
      disabled={!$context.editable}
    />
  </div>
  <p class="hint">{localize('DND5E.StartingEquipment.Wealth.Hint')}</p>
</div>

<style lang="scss">
  span:has(.configure-starting-equipment) {
    font-size: 0.875rem;
  }

  .starting-equipment-text {
    line-height: 1.75;
  }
</style>
