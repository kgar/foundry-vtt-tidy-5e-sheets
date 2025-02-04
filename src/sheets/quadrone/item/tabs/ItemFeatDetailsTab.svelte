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
  import Checkbox from 'src/components/inputs/Checkbox.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemFeatureDetails')}
  </legend>

  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.Type')}</label>
    <div class="form-fields">
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
  </div>

  {#if context.itemSubtypes}
    {@const category =
      context.config.featureTypes[context.system.type.value]?.label}

    <div class="form-group">
      <label for="{appId}-type-subtype"
        >{localize('DND5E.ItemFeatureSubtype', { category })}</label
      >
      <div class="form-fields">
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
    </div>
  {/if}

  {#if context.system.type.value === CONSTANTS.FEAT_TYPE_VEHICLE}
    <div class="form-group">
      <label for="{appId}-cover"
        >{localize('DND5E.FEATURE.FIELDS.cover.label')}</label
      >
      <div class="form-fields">
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
      </div>
      <p class="hint">
        {localize('DND5E.FEATURE.FIELDS.cover.hint')}
      </p>
    </div>
  {/if}

  <div class="form-group">
    <label for="{appId}-prerequisites-level"
      >{localize('DND5E.Prerequisites.FIELDS.prerequisites.level.label')}</label
    >
    <div class="form-fields">
      <NumberInput
        id="{appId}-prerequisites-level"
        document={context.item}
        field="system.prerequisites.level"
        value={context.source.prerequisites.level}
        disabled={!context.editable}
        step="1"
      />
    </div>

    <p class="hint">
      {localize('DND5E.Prerequisites.FIELDS.prerequisites.level.hint')}
    </p>
  </div>

  <div class="form-group">
    <label id="prerequisites-repeatable-{appId}">
      {localize('DND5E.Prerequisites.FIELDS.prerequisites.repeatable.label')}
    </label>
    <div class="form-fields">
      <Checkbox
        id="prerequisites-repeatable-{appId}"
        document={context.item}
        field="system.prerequisites.repeatable"
        checked={context.source.prerequisites.repeatable}
      />
    </div>
    <p class="hint">
      {localize('DND5E.Prerequisites.FIELDS.prerequisites.repeatable.hint')}
    </p>
  </div>

  <div class="form-group stacked feature-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemFeatureProperties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>
</fieldset>

{#if context.system.isEnchantmentSource}
  <fieldset>
    <legend>
      {localize('DND5E.ENCHANTMENT.Label')}
    </legend>

    <!-- Max Enchantments -->
    <div class="form-group">
      <label for="{appId}-enchant-max"
        >{localize(
          'DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.label',
        )}</label
      >
      <div class="form-fields">
        <TextInput
          id="{appId}-enchant-max"
          document={context.item}
          field="system.enchant.max"
          value={context.source.enchant.max}
          disabled={!context.editable}
        />
      </div>

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
      <div class="form-fields">
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
      </div>

      <p class="hint">
        {localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.hint')}
      </p>
    </div>
  </fieldset>
{/if}

<FieldUses />
