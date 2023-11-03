<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup cssClass="stacked" labelText={localize('DND5E.ItemToolStatus')}>
  <div class="form-fields">
    <Checkbox
    labelCssClass="checkbox"
      document={$context.item}
      field="system.equipped"
      checked={$context.system.equipped}
      disabled={!$context.owner}
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
    document={$context.item}
    field="system.toolType"
    value={$context.system.toolType}
    disabled={!$context.owner}
    >
    <SelectOptions data={$context.config.toolTypes} blank="" />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemToolBase')}
  field="system.baseItem"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.baseItem"
    value={$context.system.baseItem}
    disabled={!$context.owner}
    >
    <SelectOptions data={$context.baseItems} blank="" />
  </Select>
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
    disabled={!$context.owner}
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
    disabled={!$context.owner}
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
    disabled={!$context.owner}
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
    disabled={!$context.owner}
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
    disabled={!$context.owner}
    />
</ItemFormGroup>
