<script lang="ts">
  import { getContext } from 'svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup labelText={localize('DND5E.Identifier')}>
  <div class="form-fields">
    <TextInput
      document={$context.item}
      field="system.identifier"
      value={$context.system.identifier}
      placeholder={$context.item.identifier}
    ></TextInput>
  </div>
  <p class="hint">{localize('DND5E.IdentifierError')}</p>
</ItemFormGroup>

<ItemStartingEquipment />
