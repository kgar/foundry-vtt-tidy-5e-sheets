<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { coalesce } from 'src/utils/formatting';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header flex-row justify-content-space-between">
  {localize('DND5E.StartingEquipment.Title')}
  {#if context.editable}
    <span>
      <button
        type="button"
        class="configure-starting-equipment inline-icon-button"
        title={localize('DND5E.StartingEquipment.Action.Configure')}
        aria-label={localize('DND5E.StartingEquipment.Action.Configure')}
        onclick={() => FoundryAdapter.openStartingEquipmentConfig(context.item)}
        tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-gear"></i>
      </button>
    </span>
  {/if}
</h3>

<div class="starting-equipment-text">
  {@html coalesce(
    context.system.startingEquipmentDescription,
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
      document={context.item}
      field="system.wealth"
      value={context.source.wealth}
      disabled={!context.editable}
    />
  </div>
  <p class="hint">{localize('DND5E.StartingEquipment.Wealth.Hint')}</p>
</div>

<style lang="less">
  span:has(:global(.configure-starting-equipment)) {
    font-size: 0.875rem;
  }

  .starting-equipment-text {
    line-height: 1.75;
  }
</style>
