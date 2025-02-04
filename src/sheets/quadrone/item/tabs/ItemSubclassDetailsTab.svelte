<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import DetailsSpellcasting from '../parts/DetailsSpellcasting.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemSubclassDetails')}
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
        disabled={!context.editable}
      />
    </div>
    <p class="hint">{localize('DND5E.IdentifierError')}</p>
  </div>

  <div class="form-group">
    <label for="{appId}-classIdentifier"
      >{localize('DND5E.ClassIdentifier')}</label
    >
    <div class="form-fields">
      <TextInputQuadrone
        id="{appId}-classIdentifier"
        document={context.item}
        field="system.classIdentifier"
        value={context.source.classIdentifier}
        disabled={!context.editable}
      />
    </div>
    <p class="hint">
      {localize('DND5E.SubclassIdentifierHint')}
    </p>
  </div>
</fieldset>

<fieldset>
  <legend>{localize('DND5E.Spellcasting')}</legend>
  <DetailsSpellcasting />
</fieldset>
