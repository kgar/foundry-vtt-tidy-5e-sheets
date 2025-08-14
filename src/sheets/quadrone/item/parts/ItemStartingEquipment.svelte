<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { coalesce } from 'src/utils/formatting';
  import { settings } from 'src/settings/settings.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.StartingEquipment.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group">
    <label>{localize('DND5E.StartingEquipment.Title')}</label>
    <div class="form-fields">
      <button
        type="button"
        class="configure-starting-equipment inline-icon-button button button-secondary"
        id="{appId}-starting-equipment-configure"
        title={localize('DND5E.StartingEquipment.Action.Configure')}
        aria-label={localize('DND5E.StartingEquipment.Action.Configure')}
        onclick={() =>
          FoundryAdapter.openStartingEquipmentConfig(context.item)}
        tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        disabled={!context.unlocked}
      >
        <i class="fas fa-gear"></i>
        {localize('DND5E.StartingEquipment.Action.Configure')}
      </button>
    </div>
  </div>
  <div class="form-group">
    <label for="{appId}-starting-equipment"></label>
    <div class="form-fields">
      <div class="editor-rendered-content starting-equipment-list" id="{appId}-starting-equipment">
        {@html coalesce(
          context.system.startingEquipmentDescription,
          localize('None'),
        )}
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="{appId}-wealth"
      >{localize('DND5E.StartingEquipment.Wealth.Label')}</label
    >
    <div class="form-fields">
      <TextInputQuadrone
        id="{appId}-wealth"
        document={context.item}
        field="system.wealth"
        value={context.source.wealth}
        disabled={!context.unlocked}
      />
    </div>
    <p class="hint">{localize('DND5E.StartingEquipment.Wealth.Hint')}</p>
  </div>
</fieldset>

<!-- TODO: Put in global styles -->
<style lang="scss">
  fieldset .form-group .form-fields .starting-equipment-list {
    margin-bottom: var(--t5e-size-3x);
  }
</style>
