<script lang="ts">
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import ItemAction from './ItemAction.svelte';
  import ItemActivation from './ItemActivation.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/form/Select.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

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
    document={$store.item}
    field="system.type.value"
    value={$store.system.type.value}
  >
    <SelectOptions
      data={$store.config.featureTypes}
      labelProp="label"
      blank=""
    />
  </Select>
</ItemFormGroup>

{#if $store.featureSubtypes}
  {@const category =
    $store.config.featureTypes[$store.system.type.value]?.label}
  <ItemFormGroup
    labelText={localize('DND5E.ItemFeatureSubtype', { category })}
    field="system.type.subtype"
    let:inputId
  >
    <Select
      id={inputId}
      document={$store.item}
      field="system.type.subtype"
      value={$store.system.type.subtype}
    >
      <SelectOptions data={$store.featureSubtypes} blank="" />
    </Select>
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.FeatureUsage')}</h3>

<ItemActivation />

{#if $store.system.activation.type}
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
        document={$store.item}
        field="system.recharge.value"
        placeholder={localize('DND5E.FeatureRechargeResult')}
        value={$store.system.recharge.value}
      />

      <Checkbox
        id="{$store.appId}-system-recharge-charged"
        labelCssClass="checkbox"
        document={$store.item}
        field="system.recharge.charged"
        checked={$store.system.recharge.charged}
      >
        {localize('DND5E.Charged')}
      </Checkbox>
    </div>
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.FeatureAttack')}</h3>

<ItemAction />
