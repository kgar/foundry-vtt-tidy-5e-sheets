<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemFeatureDetails')}</h3>

<div class="form-group">
  <label for="{appId}-type-value">{localize('DND5E.Type')}</label>
  <Select
    id="{appId}-type-value"
    document={context.item}
    field="system.type.value"
    value={context.source.type.value}
    disabled={!context.editable}
  >
    <SelectOptions
      data={context.config.featureTypes}
      labelProp="label"
      blank=""
    />
  </Select>
</div>

{#if context.itemSubtypes}
  {@const category =
    // @ts-expect-error
    context.config.featureTypes[context.system.type.value]?.label}

  <div class="form-group">
    <label for="{appId}-type-subtype"
      >{localize('DND5E.ItemFeatureSubtype', { category })}</label
    >
    <Select
      id="{appId}-type-subtype"
      document={context.item}
      field="system.type.subtype"
      value={context.source.type.subtype}
      disabled={!context.editable}
    >
      <SelectOptions data={context.itemSubtypes} blank="" />
    </Select>
  </div>
{/if}

{#if context.system.type.value === CONSTANTS.FEAT_TYPE_VEHICLE}
  <div class="form-group">
    <label for="{appId}-cover"
      >{localize('DND5E.FEATURE.FIELDS.cover.label')}</label
    >
    <Select
      id="{appId}-cover"
      document={context.item}
      field="system.cover"
      value={context.source.cover}
      disabled={!context.editable}
    >
      <SelectOptions
        data={context.coverOptions}
        labelProp="label"
        valueProp="value"
        blank=""
      />
    </Select>
    <p class="hint">
      {localize('DND5E.FEATURE.FIELDS.cover.hint')}
    </p>
  </div>
{/if}

<div class="form-group">
  <label for="{appId}-prerequisites-level"
    >{localize('DND5E.Prerequisites.FIELDS.prerequisites.level.label')}</label
  >
  <NumberInput
    id="{appId}-prerequisites-level"
    document={context.item}
    field="system.prerequisites.level"
    value={context.source.prerequisites.level}
    disabled={!context.editable}
    step="1"
  />

  <p class="hint">
    {localize('DND5E.Prerequisites.FIELDS.prerequisites.level.hint')}
  </p>
</div>

<div class="form-group stacked feature-properties">
  <label for="">{localize('DND5E.ItemFeatureProperties')}</label>
  <ItemProperties />
</div>

{#if context.system.isEnchantmentSource}
  <h3 class="form-header">{localize('DND5E.ENCHANTMENT.Label')}</h3>

  <!-- Max Enchantments -->
  <div class="form-group">
    <label for="{appId}-enchant-max"
      >{localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.label')}</label
    >
    <TextInput
      id="{appId}-enchant-max"
      document={context.item}
      field="system.enchant.max"
      value={context.source.enchant.max}
      disabled={!context.editable}
    />

    <p class="hint">
      {localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.hint')}
    </p>
  </div>

  <!-- Enchantment Replacement -->
  <div class="form-group">
    <label for="{appId}-enchant-period"
      >{localize(
        'DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.label',
      )}</label
    >
    <Select
      id="{appId}-enchant-period"
      document={context.item}
      field="system.enchant.period"
      value={context.source.enchant.period}
      blankValue=""
      disabled={!context.editable}
    >
      <SelectOptions
        data={context.config.enchantmentPeriods}
        blank={localize('DND5E.USES.Recovery.Never')}
        labelProp="label"
        valueProp="value"
      />
    </Select>

    <p class="hint">
      {localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.hint')}
    </p>
  </div>
{/if}

<FieldUses />
