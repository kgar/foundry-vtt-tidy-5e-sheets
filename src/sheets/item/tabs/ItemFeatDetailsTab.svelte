<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import type { ItemSheetContext } from 'src/types/item.types';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import FieldUses from '../parts/FieldUses.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemFeatureDetails')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.Type')}
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

<ItemFormGroup
  cssClass="stacked feature-properties"
  labelText={localize('DND5E.ItemFeatureProperties')}
>
  <ItemProperties />
</ItemFormGroup>

{#if $context.system.isEnchantmentSource}
  <h3 class="form-header">{localize('DND5E.ENCHANTMENT.Label')}</h3>

  <!-- Max Enchantments -->
  <ItemFormGroup
    labelText={localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.label')}
    field="system.enchant.max"
    let:inputId
  >
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.enchant.max"
      value={$context.system.enchant.max}
    />

    <p class="hint">
      {localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.hint')}
    </p>
  </ItemFormGroup>

  <!-- Enchantment Replacement -->
  <ItemFormGroup
    labelText={localize(
      'DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.label',
    )}
    field="system.enchant.period"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.enchant.period"
      value={$context.system.enchant.period}
      blankValue=""
    >
      <SelectOptions
        data={$context.config.enchantmentPeriods}
        blank={localize('DND5E.UsesPeriods.Never')}
        labelProp="label"
        valueProp="value"
      />
    </Select>

    <p class="hint">
      {localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.hint')}
    </p>
  </ItemFormGroup>
{/if}

<FieldUses />
