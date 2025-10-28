<script lang="ts">
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<FormGroup label="DND5E.SpellCastTime" groupClasses="split-group">
  <!-- Amount -->
  {#if context.system.activation.scalar}
    <FormGroup
      label="DND5E.Amount"
      labelFor="{appId}-activation-value"
      document={context.document}
      field={context.fields.activation.fields.value}
      config={{
        id: `${appId}-activation-value`,
        value: context.source.activation.value,
        placeholder: '—',
        hint: false,
        blank: false,
      }}
      groupClasses="label-top"
    />
  {/if}
  <!-- Type -->
  <FormGroup
    label="DND5E.Cost"
    labelFor="{appId}-activation-type"
    document={context.document}
    field={context.fields.activation.fields.type}
    config={{
      id: `${appId}-activation-type`,
      value: context.source.activation.type,
      hint: false,
      blank: false,
    }}
    choices={context.activationTypes}
    groupClasses="label-top"
  />
  {#snippet beforeGroupEnd()}
    <!-- Condition -->
    <TidyFormInput
      document={context.document}
      field={context.fields.activation.fields.condition}
      config={{
        id: `${appId}-activation-condition`,
        value: context.source.activation.condition,
        classes: 'full-width',
        placeholder: localize('DND5E.ItemActivationCondition'),
      }}
    />
  {/snippet}
</FormGroup>
