<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemBackgroundDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <div class="form-group">
    <label for="{appId}-identifier">{localize('DND5E.Identifier')}</label>
    <div class="form-fields">
      <TextInputQuadrone
        id="{appId}-identifier"
        document={context.item}
        field="system.identifier"
        value={context.source.identifier}
        placeholder={context.item.identifier}
        disabled={!context.unlocked}
      />
    </div>
    <p class="hint">{localize('DND5E.IdentifierError')}</p>
  </div>
</fieldset>

<ItemStartingEquipment />
