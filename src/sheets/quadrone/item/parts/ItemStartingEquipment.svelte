<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { coalesce } from 'src/utils/formatting';
  import { settings } from 'src/settings/settings.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.StartingEquipment.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FormGroup label="DND5E.StartingEquipment.Title">
    <button
      type="button"
      class="configure-starting-equipment inline-icon-button button button-secondary"
      id="{appId}-starting-equipment-configure"
      title={localize('DND5E.StartingEquipment.Action.Configure')}
      aria-label={localize('DND5E.StartingEquipment.Action.Configure')}
      onclick={() => FoundryAdapter.openStartingEquipmentConfig(context.item)}
      tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      disabled={!context.unlocked}
    >
      <i class="fas fa-gear"></i>
      {localize('DND5E.StartingEquipment.Action.Configure')}
    </button>
  </FormGroup>

  <FormGroup>
    <div
      class="editor-rendered-content starting-equipment-list"
      id="{appId}-starting-equipment"
    >
      {@html coalesce(
        context.system.startingEquipmentDescription,
        localize('None'),
      )}
    </div>
  </FormGroup>

  <FormGroup
    labelFor="{appId}-wealth"
    document={context.document}
    field={context.fields.wealth}
    config={{
      id: `${appId}-wealth`,
      value: context.source.wealth,
      disabled: !context.unlocked,
    }}
  />
</fieldset>
