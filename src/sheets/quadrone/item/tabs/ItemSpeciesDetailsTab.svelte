<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemSpeciesDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <div class="form-group">
    <div class="form-group">
      <label for="{appId}-identifier">{localize('DND5E.Identifier')}</label>
      <div class="form-fields">
        <TextInputQuadrone
          id="{appId}-identifier"
          document={context.item}
          field="system.identifier"
          value={context.source.identifier}
          disabledValue={context.system.identifier}
          placeholder={context.item.identifier}
          disabled={!context.unlocked}
        />
      </div>
      <p class="hint">{localize('DND5E.IdentifierError')}</p>
    </div>
  </div>
</fieldset>
