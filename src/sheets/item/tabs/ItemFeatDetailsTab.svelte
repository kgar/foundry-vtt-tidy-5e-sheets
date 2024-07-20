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
  import ItemProperties from '../parts/ItemProperties.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

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

<h3 class="form-header">{localize('DND5E.Prerequisites.Header')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.Prerequisites.FIELDS.prerequisites.level.label')}
  field="system.prerequisites.level"
  let:inputId
>
  <NumberInput
    id={inputId}
    document={$context.item}
    field="system.prerequisites.level"
    value={$context.system.prerequisites.level}
    disabled={!$context.editable}
    step="1"
  />

  <p class="hint">
    {localize('DND5E.Prerequisites.FIELDS.prerequisites.level.hint')}
  </p>
</ItemFormGroup>

{#if $context.system.isEnchantmentSource}
  <h3 class="form-header">{localize('DND5E.Enchantment.Label')}</h3>

  <ItemFormGroup
    labelText={localize('DND5E.Enchantment.FIELDS.enchantment.items.max.label')}
    field="system.enchantment.items.max"
    let:inputId
  >
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.enchantment.items.max"
      value={$context.source.enchantment.items.max}
      disabled={!$context.editable}
    />
    <p class="hint">
      {localize('DND5E.Enchantment.FIELDS.enchantment.items.max.hint')}
    </p>
  </ItemFormGroup>

  <ItemFormGroup
    labelText={localize(
      'DND5E.Enchantment.FIELDS.enchantment.items.period.label',
    )}
    field="system.enchantment.items.period"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.enchantment.items.period"
      value={$context.system.enchantment.items.period}
      blankValue=""
    >
      <SelectOptions
        blank={localize('DND5E.UsesPeriods.Never')}
        data={$context.config.enchantmentPeriods}
        labelProp="label"
      />
      <p class="hint">
        {localize('DND5E.Enchantment.FIELDS.enchantment.items.period.hint')}
      </p>
    </Select>
  </ItemFormGroup>
{/if}

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
        greenCheckboxWidthOverride="{localize('DND5E.Charged').length + 4}ch"
      >
        {localize('DND5E.Charged')}
      </Checkbox>
    </div>
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.FeatureAttack')}</h3>

<ItemAction />
