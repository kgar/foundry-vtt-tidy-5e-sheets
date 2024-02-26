<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup
  labelText={localize('DND5E.ItemToolType')}
  field="system.type.value"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.type.value"
    value={$context.system.type.value}
    disabled={!$context.editable}
  >
    <SelectOptions data={$context.config.toolTypes} blank="" />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemToolBase')}
  field="system.type.baseItem"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.type.baseItem"
    value={$context.system.type.baseItem}
    disabled={!$context.editable}
  >
    <SelectOptions data={$context.baseItems} blank="" />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  cssClass="stacked tool-properties"
  labelText={localize('DND5E.ItemToolProperties')}
>
  <ItemProperties />
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.Attunement')}
  field="system.attunement"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.attunement"
    value={$context.system.attunement}
    disabled={!$context.editable}
  >
    <SelectOptions data={$context.config.attunements} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemToolProficiency')}
  field="system.proficient"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.proficient"
    value={$context.system.proficient}
    disabled={!$context.editable}
  >
    <SelectOptions
      data={$context.config.proficiencyLevels}
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
    document={$context.item}
    field="system.ability"
    value={$context.system.ability}
    disabled={!$context.editable}
  >
    <SelectOptions
      data={$context.config.abilities}
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
    document={$context.item}
    field="system.bonus"
    value={$context.system.bonus}
    dataset={{ formulaEditor: true }}
    disabled={!$context.editable}
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
    document={$context.item}
    field="system.chatFlavor"
    value={$context.system.chatFlavor}
    disabled={!$context.editable}
  />
</ItemFormGroup>
