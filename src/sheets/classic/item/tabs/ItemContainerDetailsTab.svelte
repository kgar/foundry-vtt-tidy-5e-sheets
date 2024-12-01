<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ContainerSheetClassicContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ContainerSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let appId = $derived($context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <h3 class="form-header">{localize('DND5E.ItemContainerDetails')}</h3>

  <div class="form-group stacked container-properties">
    <label for="">{localize('DND5E.ItemContainerProperties')}</label>
    <ItemProperties />
  </div>

  <div class="form-group">
    <label for="{appId}-capacity-value"
      >{localize('DND5E.ItemContainerCapacity')}</label
    >
    <div class="form-fields">
      <NumberInput
        id="{appId}-capacity-value"
        document={$context.item}
        field="system.capacity.value"
        value={$context.source.capacity.value}
        disabled={!$context.editable}
        placeholder="—"
      />
    </div>
  </div>

  <div class="form-group">
    <label for="{appId}-capacity-type"
      >{localize('DND5E.ItemContainerCapacityType')}</label
    >
    <Select
      id="{appId}-capacity-type"
      document={$context.item}
      field="system.capacity.type"
      value={$context.source.capacity.type}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.itemCapacityTypes} />
    </Select>
  </div>

  <div class="form-group">
    <label for="{appId}-attunement">{localize('DND5E.Attunement')}</label>
    <Checkbox
      id="{appId}-attuned"
      document={$context.item}
      field="system.attuned"
      checked={$context.source.attuned}
      disabled={!$context.editable ||
        // @ts-expect-error
        !$context.config.attunementTypes[$context.system.attunement]}
      title={localize('DND5E.AttunementAttuned')}
    />
    <Select
      id="{appId}-attunement"
      document={$context.item}
      field="system.attunement"
      value={$context.source.attunement}
      disabled={!$context.editable}
    >
      <SelectOptions
        data={$context.config.attunementTypes}
        blank={localize('DND5E.AttunementNone')}
      />
    </Select>
  </div>
</ContentConcealer>
