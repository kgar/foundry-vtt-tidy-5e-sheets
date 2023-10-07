<script lang="ts">
  import { getContext } from 'svelte';
  import ItemSpellcasting from './ItemSpellcasting.svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup
  labelText={localize('DND5E.Identifier')}
  field="system.identifier"
  let:inputId
>
  <div class="form-fields">
    <TextInput
      id={inputId}
      document={$store.item}
      field="system.identifier"
      value={$store.system.identifier}
      placeholder={$store.item.identifier}
      disabled={!$store.owner}
      />
  </div>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ClassIdentifier')}
  field="system.classIdentifier"
  let:inputId
>
  <div class="form-fields">
    <TextInput
      id={inputId}
      document={$store.item}
      field="system.classIdentifier"
      value={$store.system.classIdentifier}
      disabled={!$store.owner}
      />
  </div>
  <p class="hint">
    {localize('DND5E.SubclassIdentifierHint')}
  </p>
</ItemFormGroup>

<h3 class="form-header">{localize('DND5E.Spellcasting')}</h3>
<ItemSpellcasting />
