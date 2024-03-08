<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <h3 class="form-header">{localize('DND5E.ItemContainerDetails')}</h3>

  <ItemFormGroup
    cssClass="stacked container-properties"
    labelText={localize('DND5E.ItemContainerProperties')}
  >
    <ItemProperties />
  </ItemFormGroup>

  <ItemFormGroup
    labelText={localize('DND5E.ItemContainerCapacity')}
    let:inputId
    field="system.capacity.value"
  >
    <div class="form-fields">
      <NumberInput
        id={inputId}
        document={$context.item}
        field="system.capacity.value"
        value={$context.system.capacity.value}
        disabled={!$context.editable}
        placeholder="&mdash;"
      />
    </div>
  </ItemFormGroup>

  <ItemFormGroup labelText={localize('DND5E.ItemContainerCapacityType')}>
    <Select
      document={$context.item}
      field="system.capacity.type"
      value={$context.system.capacity.type}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.itemCapacityTypes} />
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
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.attunements} />
    </Select>
  </ItemFormGroup>
</ContentConcealer>
