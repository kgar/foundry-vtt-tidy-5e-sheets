<script lang="ts">
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import Select from 'src/components/form/Select.svelte';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemContainerDetails')}</h3>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ItemContainerStatus')}
>
  <Checkbox
    labelCssClass="checkbox"
    document={$store.item}
    field="system.equipped"
    checked={$store.system.equipped}
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
      document={$store.item}
      field="system.capacity.value"
      placeholder="&mdash;"
      value={$store.system.capacity.value}
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
    document={$store.item}
    field="system.capacity.type"
    value={$store.system.capacity.type}
  >
    <SelectOptions data={$store.config.itemCapacityTypes} />
  </Select>
</ItemFormGroup>

<ItemFormGroup labelText={localize('DND5E.Attunement')}>
  <Select
    document={$store.item}
    field="system.attunement"
    dtype="Number"
    value={$store.system.attunement}
  >
    <SelectOptions data={$store.config.attunements} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ItemContainerProperties')}
>
  <Checkbox
    checked={$store.system.capacity.weightless}
    field="system.capacity.weightless"
    document={$store.item}
    labelCssClass="checkbox container-property"
  >
    {localize('DND5E.ItemContainerWeightless')}
  </Checkbox>
</ItemFormGroup>
