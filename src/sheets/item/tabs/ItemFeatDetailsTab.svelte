<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemAction from '../parts/ItemAction.svelte';
  import ItemActivation from '../parts/ItemActivation.svelte';
  import type { ItemSheetContext } from 'src/types/item.types';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { mapPropertiesToSave } from 'src/utils/system-properties';
  import ItemProperties from '../parts/ItemProperties.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemFeatureDetails')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.ItemFeatureType')}
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
    <SelectOptions
      data={$context.config.featureTypes}
      labelProp="label"
      blank=""
    />
  </Select>
</ItemFormGroup>

{#if $context.itemSubtypes}
  {@const category =
    $context.config.featureTypes[$context.system.type.value]?.label}

  <ItemFormGroup
    labelText={localize('DND5E.ItemFeatureSubtype', { category })}
    field="system.type.subtype"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.subtype"
      value={$context.system.type.subtype}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.itemSubtypes} blank="" />
    </Select>
  </ItemFormGroup>
{/if}

<ItemFormGroup
  cssClass="stacked weapon-properties"
  labelText={localize('DND5E.ItemEquipmentProperties')}
>
  <ItemProperties />
</ItemFormGroup>

<h3 class="form-header">{localize('DND5E.FeatureUsage')}</h3>

<ItemActivation />

{#if $context.system.activation.type}
  <ItemFormGroup
    cssClass="recharge"
    labelText={localize('DND5E.FeatureActionRecharge')}
    field="system.recharge.value"
    let:inputId
  >
    <div class="form-fields">
      <span>{localize('DND5E.FeatureRechargeOn')}</span>
      <NumberInput
        id={inputId}
        document={$context.item}
        field="system.recharge.value"
        placeholder={localize('DND5E.FeatureRechargeResult')}
        value={$context.system.recharge.value}
        disabled={!$context.editable}
      />

      <Checkbox
        id="{$context.appId}-system-recharge-charged"
        labelCssClass="checkbox"
        document={$context.item}
        field="system.recharge.charged"
        checked={$context.system.recharge.charged}
        disabled={!$context.editable}
      >
        {localize('DND5E.Charged')}
      </Checkbox>
    </div>
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.FeatureAttack')}</h3>

<ItemAction />
