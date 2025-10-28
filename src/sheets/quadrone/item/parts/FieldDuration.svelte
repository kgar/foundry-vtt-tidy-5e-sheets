<script lang="ts">
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<!-- Duration -->
<FormGroup label="DND5E.Duration" groupClasses="split-group">
  <!-- Amount -->
  {#if context.system.duration.scalar}
    <FormGroup
      label="DND5E.Amount"
      labelFor="{appId}-duration-value"
      document={context.document}
      field={context.fields.duration.fields.value}
      config={{
        id: `${appId}-duration-value`,
        value: context.source.duration.value,
        hint: false,
        placeholder: '—',
      }}
      groupClasses="label-top"
    />
  {/if}
  <!-- Time -->
  <FormGroup
    label="DND5E.DurationTime"
    labelFor="{appId}-duration-units"
    document={context.document}
    field={context.fields.duration.fields.units}
    config={{
      id: `${appId}-duration-units`,
      value: context.source.duration.units,
      hint: false,
    }}
    choices={context.durationUnits}
    groupClasses="label-top"
  />

  {#snippet beforeGroupEnd()}
    {#if context.system.duration.units === 'spec'}
      <!-- Conditions -->
      <TidyFormInput
        document={context.document}
        field={context.fields.duration.fields.special}
        config={{
          id: `${appId}-duration-special`,
          value: context.source.duration.special,
          classes: 'full-width',
          placeholder: localize('DND5E.DURATION.FIELDS.duration.special.label'),
        }}
      />
    {/if}
  {/snippet}
</FormGroup>
