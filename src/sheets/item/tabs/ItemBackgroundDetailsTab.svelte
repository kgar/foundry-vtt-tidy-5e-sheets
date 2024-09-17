<script lang="ts">
  import { getContext } from 'svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<div class="form-group">
  <label for="{appId}-identifier">{localize('DND5E.Identifier')}</label>
  <div class="form-fields">
    <TextInput
      document={$context.item}
      field="system.identifier"
      value={$context.source.identifier}
      placeholder={$context.item.identifier}
    ></TextInput>
  </div>
  <p class="hint">{localize('DND5E.IdentifierError')}</p>
</div>

<ItemStartingEquipment />
