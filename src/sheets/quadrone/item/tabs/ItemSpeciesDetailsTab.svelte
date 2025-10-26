<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemSpeciesDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <FormGroup
    labelFor="{appId}-identifier"
    document={context.document}
    field={context.fields.identifier}
    config={{
      id: `${appId}-identifier`,
      value: context.source.identifier,
      disabled: !context.unlocked,
      placeholder: context.item.identifier,
    }}
    hint="DND5E.IdentifierError"
  />
</fieldset>
