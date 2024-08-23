<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ContainerSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ContainerSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

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
    <Checkbox
      id={`${$context.appId}-system-attuned`}
      document={$context.item}
      field="system.attuned"
      checked={$context.system.attuned}
      disabled={!$context.editable ||
        !$context.config.attunementTypes[$context.system.attunement]}
      title={localize('DND5E.AttunementAttuned')}
    ></Checkbox>
    <Select
      id={inputId}
      document={$context.item}
      field="system.attunement"
      value={$context.system.attunement}
      disabled={!$context.editable}
    >
      <SelectOptions
        data={$context.config.attunementTypes}
        blank={localize('DND5E.AttunementNone')}
      />
    </Select>
  </ItemFormGroup>
</ContentConcealer>
