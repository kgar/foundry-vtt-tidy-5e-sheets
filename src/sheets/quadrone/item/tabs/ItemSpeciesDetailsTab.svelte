<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemSpeciesDetails')}
  </legend>
  <div class="form-group">
    <div class="form-group">
      <label for="{appId}-identifier">{localize('DND5E.Identifier')}</label>
      <div class="form-fields">
        <TextInput
          id="{appId}-identifier"
          document={context.item}
          field="system.identifier"
          value={context.source.identifier}
          placeholder={context.item.identifier}
          disabled={!context.editable}
        />
      </div>
      <p class="hint">{localize('DND5E.IdentifierError')}</p>
    </div>
  </div>
</fieldset>
