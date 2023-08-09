<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import Select from 'src/components/form/Select.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Checkbox from 'src/components/form/Checkbox.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup cssClass="stacked" labelText={localize('DND5E.ItemToolStatus')}>
  <div class="form-fields">
    <Checkbox
      document={$store.item}
      field="system.equipped"
      checked={$store.system.equipped}
    >
      {localize('DND5E.Equipped')}
    </Checkbox>
  </div>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemToolType')}
  field="system.toolType"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.toolType"
    value={$store.system.toolType}
  >
    <SelectOptions data={$store.config.toolTypes} blank="" />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemToolBase')}
  field="system.baseItem"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.baseItem"
    value={$store.system.baseItem}
  >
    <SelectOptions data={$store.baseItems} blank="" />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.Attunement')}
  field="system.attunement"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.attunement"
    dtype="Number"
    value={$store.system.attunement}
  >
    <SelectOptions data={$store.config.attunements} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemToolProficiency')}
  field="system.proficient"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.proficient"
    dtype="Number"
    value={$store.system.proficient}
  >
    <SelectOptions
      data={$store.config.proficiencyLevels}
      blank={localize('DND5E.Automatic')}
    />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.DefaultAbilityCheck')}
  field="system.ability"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.ability"
    value={$store.system.ability}
  >
    <SelectOptions
      data={$store.config.abilities}
      labelProp="label"
      blank={localize('DND5E.Default')}
    />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemToolBonus')}
  field="system.bonus"
  let:inputId
>
  <TextInput
    id={inputId}
    document={$store.item}
    field="system.bonus"
    value={$store.system.bonus}
    dataset={{ formulaEditor: true }}
  />
</ItemFormGroup>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ChatFlavor')}
  field="system.chatFlavor"
  let:inputId
>
  <TextInput
    id={inputId}
    document={$store.item}
    field="system.chatFlavor"
    value={$store.system.chatFlavor}
  />
</ItemFormGroup>
