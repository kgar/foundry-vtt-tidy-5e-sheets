<script lang="ts">
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<!-- Range -->
<FormGroup label="DND5E.Range" groupClasses="split-group">
  <!-- Value -->
  {#if context.system.range.scalar}
    <FormGroup
      label="DND5E.Value"
      labelFor="{appId}-range-value"
      document={context.document}
      field={context.fields.range.fields.value}
      config={{
        id: `${appId}-range-value`,
        value: context.source.range.value,
        hint: false,
      }}
      groupClasses="label-top"
    />
  {/if}
  <!-- Units -->
  <FormGroup
    label="DND5E.MovementUnits"
    labelFor="{appId}-range-units"
    document={context.document}
    field={context.fields.range.fields.units}
    config={{
      id: `${appId}-range-units`,
      value: context.source.range.units,
      hint: false,
    }}
    choices={context.rangeTypes}
    groupClasses="label-top"
  />

  {#snippet beforeGroupEnd()}
    <!-- Condition -->
    <TidyFormInput
      document={context.document}
      field={context.fields.range.fields.special}
      config={{
        id: `${appId}-range-special`,
        value: context.source.range.special,
        classes: 'full-width',
        placeholder: localize('DND5E.RANGE.FIELDS.range.special.label'),
      }}
    />
  {/snippet}
</FormGroup>
