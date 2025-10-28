<script lang="ts">
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);
</script>

<FormGroup
  labelFor="{appId}-quantity"
  document={context.document}
  field={context.fields.quantity}
  config={{
    value: context.source.quantity,
    disabled: !context.unlocked,
    id: `${appId}-quantity`,
    step: 1,
  }}
/>

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
