<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from 'src/sheets/quadrone/item/parts/ItemProperties.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getContainerSheetQuadroneContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
  <FormGroup
    label="DND5E.Weight"
    labelFor="{appId}-weight-value"
    document={context.document}
    fields={[
      {
        field: context.fields.weight.fields.value,
        config: {
          value: context.source.weight.value,
          disabled: !context.unlocked,
          id: `${appId}-weight-value`,
          step: 'any',
        },
      },
      {
        field: context.fields.weight.fields.units,
        config: {
          value: context.source.weight.units,
          disabled: !context.unlocked,
          id: `${appId}-weight-units`,
        },
        choices: context.config.weightUnits,
        labelAttr: 'abbreviation',
      },
    ]}
  />

  <FormGroup
    label="DND5E.Price"
    labelFor="{appId}-price-value"
    document={context.document}
    fields={[
      {
        field: context.fields.price.fields.value,
        config: {
          value: context.source.price.value,
          disabled: !context.unlocked,
          id: `${appId}-price-value`,
          step: 'any',
          classes: 'large-value',
        },
      },
      {
        field: context.fields.price.fields.denomination,
        config: {
          value: context.source.price.denomination,
          disabled: !context.unlocked,
          id: `${appId}-price-denomination`,
        },
        choices: context.config.currencies,
        labelAttr: 'abbreviation',
      },
    ]}
  />
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.CONTAINER.Details')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group stacked container-properties checkbox-grid">
    <label>{localize('DND5E.CONTAINER.FIELDS.properties.label')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  {#if context.properties.object.mgc}
    <FormGroup
      label="DND5E.Attunement"
      labelFor="{appId}-attunement"
      document={context.document}
      fields={[
        // Attuned
        {
          config: {
            id: `${appId}-attuned`,
            value: context.source.attuned,
            disabled:
              !context.unlocked ||
              !context.config.attunementTypes[context.system.attunement],
            aria: {
              label: localize('DND5E.AttunementAttuned'),
            },
          },
          disabledValue: context.system.attuned,
          field: context.fields.attuned,
          tooltip: 'DND5E.AttunementAttuned',
        },
        // Attunement
        {
          blankLabel: 'DND5E.AttunementNone',
          choices: context.config.attunementTypes,
          config: {
            id: `${appId}-attunement`,
            value: context.source.attunement,
            disabled: !context.unlocked,
            aria: {
              label: localize('DND5E.Attunement'),
            },
            classes: 'flex-1',
          },
          field: context.fields.attunement,
        },
      ]}
    />
  {/if}
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.CONTAINER.FIELDS.capacity.label')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FormGroup
    labelFor="{appId}-capacity-count"
    document={context.document}
    field={context.fields.capacity.fields.count}
    config={{
      id: `${appId}-capacity-count`,
      value: context.source.capacity.count,
      placeholder: '—',
    }}
  />

  <!-- Volume Capacity -->
  <FormGroup
    label="DND5E.CONTAINER.FIELDS.capacity.volume.label"
    groupClasses="split-group"
  >
    <!-- Amount -->
    <FormGroup
      label="DND5E.Amount"
      labelFor="{appId}-capacity-volume-value"
      document={context.document}
      field={context.fields.capacity.fields.volume.fields.value}
      config={{
        id: `${appId}-capacity-volume-value`,
        value: context.source.capacity.volume.value,
        placeholder: '—',
      }}
      groupClasses="label-top"
    />

    <!-- Units -->
    <FormGroup
      label="DND5E.Unit"
      labelFor="{appId}-capacity-volume-units"
      document={context.document}
      field={context.fields.capacity.fields.volume.fields.units}
      config={{
        id: `${appId}-capacity-volume-units`,
        value: context.source.capacity.volume.units,
        placeholder: '—',
      }}
      choices={context.config.volumeUnits}
      groupClasses="label-top"
    />
  </FormGroup>

  <!-- Weight Capacity -->
  <FormGroup
    label="DND5E.CONTAINER.FIELDS.capacity.weight.label"
    groupClasses="split-group"
  >
    <!-- Amount -->
    <FormGroup
      label="DND5E.Amount"
      labelFor="{appId}-capacity-weight-value"
      document={context.document}
      field={context.fields.capacity.fields.weight.fields.value}
      config={{
        id: `${appId}-capacity-weight-value`,
        value: context.source.capacity.weight.value,
        placeholder: '—',
      }}
      groupClasses="label-top"
    />

    <!-- Units -->
    <FormGroup
      label="DND5E.Unit"
      labelFor="{appId}-capacity-weight-units"
      document={context.document}
      field={context.fields.capacity.fields.weight.fields.units}
      config={{
        id: `${appId}-capacity-weight-units`,
        value: context.source.capacity.weight.units,
        placeholder: '—',
      }}
      choices={context.config.weightUnits}
      groupClasses="label-top"
    />
  </FormGroup>
</fieldset>
