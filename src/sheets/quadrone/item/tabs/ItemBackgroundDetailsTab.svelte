<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

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

<ItemStartingEquipment />
