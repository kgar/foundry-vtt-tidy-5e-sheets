<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { getContainerOrItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getContainerOrItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>{localize('TIDY5E.Tidy5eSettings')}</legend>
  <div class="form-group custom-section">
    <label for="{appId}-custom-section">
      {localize('TIDY5E.Section.Label')}
    </label>
    <div class="form-fields">
      <TextInputQuadrone
        document={context.item}
        field={TidyFlags.section.prop}
        value={TidyFlags.section.get(context.item)}
        selectOnFocus={true}
        disabled={!context.unlocked}
        id="{appId}-custom-section"
      />
    </div>
  </div>
  <div class="form-group custom-action-section">
    <label for="{appId}-custom-action-section">
      {localize('TIDY5E.Section.ActionLabel')}
    </label>
    <div class="form-fields">
      <TextInputQuadrone
        document={context.item}
        field={TidyFlags.actionSection.prop}
        value={TidyFlags.actionSection.get(context.item)}
        selectOnFocus={true}
        disabled={!context.unlocked}
        id="{appId}-custom-action-section"
      />
    </div>
  </div>
</fieldset>
