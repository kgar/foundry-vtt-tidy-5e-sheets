<script lang="ts">
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemContainerDetails')}</h3>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ItemContainerStatus')}
>
  <Checkbox
    labelCssClass="checkbox"
    document={$context.item}
    field="system.equipped"
    checked={$context.system.equipped}
    disabled={!$context.editable}
    >
    {localize('DND5E.Equipped')}
  </Checkbox>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemContainerCapacity')}
  field="system.capacity.value"
  let:inputId
>
  <div class="form-fields">
    <NumberInput
      id={inputId}
      document={$context.item}
      field="system.capacity.value"
      placeholder="&mdash;"
      value={$context.system.capacity.value}
      disabled={!$context.editable}
      />
  </div>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemContainerCapacityType')}
  field="system.capacity.type"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.capacity.type"
    value={$context.system.capacity.type}
    disabled={!$context.editable}
    >
    <SelectOptions data={$context.config.itemCapacityTypes} />
  </Select>
</ItemFormGroup>

<ItemFormGroup labelText={localize('DND5E.Attunement')}>
  <Select
    document={$context.item}
    field="system.attunement"
    value={$context.system.attunement}
    disabled={!$context.editable}
    >
    <SelectOptions data={$context.config.attunements} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ItemContainerProperties')}
>
  <Checkbox
    checked={$context.system.capacity.weightless}
    field="system.capacity.weightless"
    document={$context.item}
    labelCssClass="checkbox container-property"
    disabled={!$context.editable}
    >
    {localize('DND5E.ItemContainerWeightless')}
  </Checkbox>
</ItemFormGroup>
