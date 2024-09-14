<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import { CONSTANTS } from 'src/constants';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

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
      disabled={!$context.editable}
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
      disabled={!$context.editable}
    >
      <SelectOptions
        data={$context.config.abilities}
        labelProp="label"
        blank=""
      />
    </Select>
  </div>
</ItemFormGroup>

<ItemFormGroup
  field="system.spellcasting.preparation.formula"
  labelText={localize('DND5E.SpellPreparation.Formula')}
  let:inputId
>
  <div class="form-fields">
    <TextInput
      document={$context.item}
      field="system.spellcasting.preparation.formula"
      value={$context.system.spellcasting.preparation.formula}
      id={inputId}
      dataset={{ formulaEditor: true }}
    />
  </div>
</ItemFormGroup>
