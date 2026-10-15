<script lang="ts">
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import FieldIdentifier from '../parts/FieldIdentifier.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.ItemBackgroundDetails')}
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
</fieldset>

<ItemStartingEquipment />
