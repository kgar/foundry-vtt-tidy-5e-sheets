<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemSpellcasting from '../parts/ItemSpellcasting.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
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
  <p class="hint">
    {@html localize('DND5E.ClassIdentifierHint', {
      identifier: $context.item.identifier,
    })}
  </p>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.HitDice')}
  field="system.hitDice"
  let:inputId
>
  <div class="form-fields">
    <Select
      id={inputId}
      document={$context.item}
      field="system.hitDice"
      value={$context.system.hitDice}
      disabled={!$context.owner}
    >
      {#each $context.config.hitDieTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </Select>
  </div>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.HitDiceUsed')}
  field="system.hitDiceUsed"
  let:inputId
>
  <div class="form-fields">
    <NumberInput
      id={inputId}
      document={$context.item}
      field="system.hitDiceUsed"
      value={$context.system.hitDiceUsed}
      placeholder="0"
      disabled={!$context.owner}
    />
  </div>
</ItemFormGroup>

<h3 class="form-header">{localize('DND5E.Spellcasting')}</h3>
<ItemSpellcasting />
