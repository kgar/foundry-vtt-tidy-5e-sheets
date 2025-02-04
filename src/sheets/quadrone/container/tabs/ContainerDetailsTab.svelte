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
      <Select
        document={context.item}
        field="system.weight.units"
        value={context.source.weight.units}
      >
        <SelectOptions
          data={context.config.weightUnits}
          labelProp="abbreviation"
        />
      </Select>
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
    {localize('DND5E.CONTAINER.Details')}
  </legend>

  <div class="form-group stacked container-properties checkbox-grid">
    <label for="">{localize('DND5E.CONTAINER.FIELDS.properties.label')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  {#if context.properties.object.mgc}
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
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.CONTAINER.FIELDS.capacity.label')}
  </legend>

  <div class="form-group">
    <div class="form-group">
      <label>{localize('DND5E.CONTAINER.FIELDS.capacity.count.label')}</label>
      <div class="form-fields">
        <NumberInput
          document={context.item}
          field="system.capacity.count"
          value={context.source.capacity.count}
          step="1"
          min="0"
          placeholder="—"
        />
      </div>
    </div>
  </div>

  <!-- Volume Capacity -->

  <div class="form-group split-group">
    <label>{localize('DND5E.CONTAINER.FIELDS.capacity.volume.label')}</label>
    <div class="form-fields">
      <div class="form-group label-top">
        <label>{localize('DND5E.Amount')}</label>
        <div class="form-fields">
          <NumberInput
            document={context.item}
            field="system.capacity.volume.value"
            value={context.source.capacity.volume.value}
            step="any"
            min="0"
            placeholder="—"
          />
        </div>
      </div>

      <div class="form-group label-top">
        <label>{localize('DND5E.Unit')}</label>
        <div class="form-fields">
          <Select
            document={context.item}
            field="system.capacity.volume.units"
            value={context.source.capacity.volume.units}
            blankValue=""
          >
            <SelectOptions
              data={context.config.volumeUnits}
              labelProp="label"
            />
          </Select>
        </div>
      </div>
    </div>
  </div>

  <!-- Weight Capacity -->
  <div class="form-group split-group">
    <label>{localize('DND5E.CONTAINER.FIELDS.capacity.weight.label')}</label>
    <div class="form-fields">
      <div class="form-group label-top">
        <label>{localize('DND5E.Amount')}</label>
        <div class="form-fields">
          <NumberInput
            document={context.item}
            field="system.capacity.weight.value"
            value={context.source.capacity.weight.value}
            step="any"
            min="0"
            placeholder="—"
          />
        </div>
      </div>

      <div class="form-group label-top">
        <label>{localize('DND5E.Unit')}</label>
        <div class="form-fields">
          <Select
            document={context.item}
            field="system.capacity.weight.units"
            value={context.source.capacity.weight.units}
            blankValue=""
          >
            <SelectOptions
              data={context.config.weightUnits}
              labelProp="label"
            />
          </Select>
        </div>
      </div>
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
