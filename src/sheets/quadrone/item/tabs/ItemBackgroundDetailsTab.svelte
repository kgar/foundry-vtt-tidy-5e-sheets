<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemBackgroundDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <FormGroup
    labelFor="{appId}-identifier"
    field={context.fields.identifier}
    config={{
      value: context.source.identifier,
      placeholder: context.item.identifier,
      disabled: !context.unlocked,
      id: `${appId}-identifier`,
    }}
    document={context.document}
    hint="DND5E.IdentifierError"
  />
</fieldset>

<ItemStartingEquipment />
