<script lang="ts">
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Select from 'src/components/form/Select.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup
  field="system.spellcasting.progression"
  labelText={localize('DND5E.SpellProgression')}
  let:inputId
>
  <div class="form-fields">
    <Select
      id={inputId}
      document={$context.item}
      field="system.spellcasting.progression"
      value={$context.system.spellcasting.progression}
      disabled={!$context.owner}
      >
      <SelectOptions data={$context.config.spellProgression} />
    </Select>
  </div>
</ItemFormGroup>

<ItemFormGroup
  field="system.spellcasting.ability"
  labelText={localize('DND5E.SpellAbility')}
  let:inputId
>
  <div class="form-fields">
    <Select
      id={inputId}
      document={$context.item}
      field="system.spellcasting.ability"
      value={$context.system.spellcasting.ability}
      disabled={!$context.owner}
      >
      <SelectOptions
        data={$context.config.abilities}
        labelProp="label"
        blank=""
      />
    </Select>
  </div>
</ItemFormGroup>
