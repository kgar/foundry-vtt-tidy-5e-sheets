<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import DetailsSpellcasting from '../parts/DetailsSpellcasting.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import FieldIdentifier from '../parts/FieldIdentifier.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.ItemSubclassDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FieldIdentifier
    document={context.document}
    field={context.fields.identifier}
    id="{appId}-identifier"
    value={context.source.identifier}
    identifier={context.item.identifier}
    unlocked={context.unlocked}
  />

  <FormGroup
    labelFor="{appId}-classIdentifier"
    document={context.document}
    field={context.fields.classIdentifier}
    config={{
      id: `${appId}-classIdentifier`,
      value: context.source.classIdentifier,
    }}
    hint="DND5E.SubclassIdentifierHint"
  />
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>{localize('DND5E.Spellcasting')}</legend>
  <DetailsSpellcasting />
</fieldset>
