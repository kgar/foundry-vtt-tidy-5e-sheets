<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import ItemProperties from 'src/sheets/classic/item/parts/ItemProperties.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { getContainerSheetClassicContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getContainerSheetClassicContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <div class="form-group">
    <label for="{appId}-weight-value">
      {localize('DND5E.Weight')}
    </label>
    <div class="form-fields">
      <NumberInput
        id="{appId}-weight-value"
        value={context.source.weight.value}
        step="any"
        field="system.weight.value"
        document={context.item}
        disabled={!context.editable}
        selectOnFocus={true}
      />
    </div>
  </div>
  <div class="form-group">
    <label for="{appId}-price-value">
      {localize('DND5E.Price')}
    </label>
    <div class="form-fields">
      <NumberInput
        id="{appId}-price-value"
        value={context.source.price.value}
        step="any"
        field="system.price.value"
        document={context.item}
        disabled={!context.editable}
        selectOnFocus={true}
        cssClass="large-value"
      />
      <Select
        value={context.source.price.denomination}
        field="system.price.denomination"
        document={context.item}
        disabled={!context.editable}
      >
        <SelectOptions
          data={context.config.currencies}
          labelProp="abbreviation"
        />
      </Select>
    </div>
  </div>
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.ItemContainerDetails')}
  </legend>

  <div class="form-group stacked container-properties">
    <label for="">{localize('DND5E.ItemContainerProperties')}</label>
    <ItemProperties />
  </div>

  <div class="form-group">
    <label for="{appId}-capacity-value"
      >{localize('DND5E.ItemContainerCapacity')}</label
    >
    <div class="form-fields">
      <NumberInput
        id="{appId}-capacity-value"
        document={context.item}
        field="system.capacity.value"
        value={context.source.capacity.value}
        disabled={!context.editable}
        placeholder="—"
      />
    </div>
  </div>

  <div class="form-group">
    <label for="{appId}-capacity-type"
      >{localize('DND5E.ItemContainerCapacityType')}</label
    >
    <div class="form-fields">
      <Select
        id="{appId}-capacity-type"
        document={context.item}
        field="system.capacity.type"
        value={context.source.capacity.type}
        disabled={!context.editable}
      >
        <SelectOptions data={context.config.itemCapacityTypes} />
      </Select>
    </div>
  </div>

  <div class="form-group">
    <label for="{appId}-attunement">{localize('DND5E.Attunement')}</label>
    <div class="form-fields">
      <Checkbox
        id="{appId}-attuned"
        document={context.item}
        field="system.attuned"
        checked={context.source.attuned}
        disabled={!context.editable ||
          // @ts-expect-error
          !context.config.attunementTypes[context.system.attunement]}
        title={localize('DND5E.AttunementAttuned')}
      />
      <Select
        id="{appId}-attunement"
        document={context.item}
        field="system.attunement"
        value={context.source.attunement}
        disabled={!context.editable}
      >
        <SelectOptions
          data={context.config.attunementTypes}
          blank={localize('DND5E.AttunementNone')}
        />
      </Select>
    </div>
  </div>
</fieldset>

<!-- TODO: Extract to shared component -->
<fieldset>
  <legend>{FoundryAdapter.localize('TIDY5E.Tidy5eSettings')}</legend>
  <div class="form-group custom-section">
    <label for="{appId}-custom-section">
      {FoundryAdapter.localize('TIDY5E.Section.Label')}
    </label>
    <div class="form-fields">
      <TextInput
        document={context.item}
        field={TidyFlags.section.prop}
        value={TidyFlags.section.get(context.item)}
        selectOnFocus={true}
        disabled={!context.editable}
        id="{appId}-custom-section"
      />
    </div>
  </div>
  <div class="form-group custom-action-section">
    <label for="{appId}-custom-action-section">
      {FoundryAdapter.localize('TIDY5E.Section.ActionLabel')}
    </label>
    <div class="form-fields">
      <TextInput
        document={context.item}
        field={TidyFlags.actionSection.prop}
        value={TidyFlags.actionSection.get(context.item)}
        selectOnFocus={true}
        disabled={!context.editable}
        id="{appId}-custom-action-section"
      />
    </div>
  </div>
</fieldset>
