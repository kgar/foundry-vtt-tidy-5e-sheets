<script lang="ts">
  import { getContext } from 'svelte';
  import ItemSpellcasting from '../parts/ItemSpellcasting.svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

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
      document={$context.item}
      field="system.identifier"
      value={$context.system.identifier}
      placeholder={$context.item.identifier}
      disabled={!$context.owner}
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
      document={$context.item}
      field="system.classIdentifier"
      value={$context.system.classIdentifier}
      disabled={!$context.owner}
      />
  </div>
  <p class="hint">
    {localize('DND5E.SubclassIdentifierHint')}
  </p>
</ItemFormGroup>

<h3 class="form-header">{localize('DND5E.Spellcasting')}</h3>
<ItemSpellcasting />
