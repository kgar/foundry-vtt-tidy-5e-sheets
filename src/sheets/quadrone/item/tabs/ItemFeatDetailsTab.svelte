<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';
  import FeatureOriginFormGroup from '../parts/FeatureOriginFormGroup.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemFeatureDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Requirements -->
  <FormGroup
    label="DND5E.Requirements"
    labelFor="{appId}-requirements"
    document={context.document}
    field={context.fields.requirements}
    config={{
      id: `${appId}-requirements`,
      value: context.source.requirements,
      disabled: !context.unlocked,
    }}
  />

  <!-- Feature Type -->
  <FormGroup
    labelFor="{appId}-type-value"
    document={context.document}
    field={context.fields.type.fields.value}
    config={{
      id: `${appId}-type-value`,
      value: context.source.type.value,
      disabled: !context.unlocked,
    }}
    choices={context.config.featureTypes}
  />

  {#if context.item.actor?.type === CONSTANTS.SHEET_TYPE_CHARACTER}
    <FeatureOriginFormGroup />
  {/if}

  <!-- Feature Sub-Type -->
  {#if context.itemSubtypes}
    {@const category =
      context.config.featureTypes[context.system.type.value]?.label}

    <FormGroup
      label={localize('DND5E.ItemFeatureSubtype', { category })}
      labelFor="{appId}-type-subtype"
      document={context.document}
      field={context.fields.type.fields.subtype}
      config={{
        id: `${appId}-type-subtype`,
        value: context.source.type.subtype,
        disabled: !context.unlocked,
      }}
      choices={context.itemSubtypes}
    />
  {/if}

  {#if context.system.type.value === CONSTANTS.FEAT_TYPE_VEHICLE}
    <FormGroup
      labelFor="{appId}-cover"
      document={context.document}
      field={context.fields.cover}
      config={{
        id: `${appId}-cover`,
        value: context.source.cover ?? 0,
        disabled: !context.unlocked,
      }}
      choices={context.coverOptions}
    />
  {/if}

  <!-- Feature Prerequisites -->
  <FormGroup
    labelFor="{appId}-prerequisites-level"
    document={context.document}
    field={context.fields.prerequisites.fields.level}
    config={{
      id: `${appId}-prerequisites-level`,
      value: context.source.prerequisites.level,
      disabled: !context.unlocked,
    }}
  />

  <FormGroup
    labelFor="{appId}-prerequisites-items"
    document={context.document}
    field={context.fields.prerequisites.fields.items}
    config={{
      id: `${appId}-prerequisites-items`,
      value: context.source.prerequisites.items,
      disabled: !context.unlocked,
    }}
  />

  <FormGroup
    labelFor="{appId}-prerequisites-repeatable"
    document={context.document}
    field={context.fields.prerequisites.fields.repeatable}
    config={{
      id: `${appId}-prerequisites-repeatable`,
      value: context.source.prerequisites.repeatable,
      disabled: !context.unlocked,
    }}
  />

  <!-- Feature Properties -->
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
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <!-- Max Enchantments -->
    <FormGroup
      label="DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.label"
      labelFor="{appId}-enchant-max"
      document={context.document}
      field={context.fields.enchant.fields.max}
      config={{
        id: `${appId}-enchant-max`,
        value: context.source.enchant.max,
        disabled: !context.unlocked,
      }}
      hint="DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.hint"
    />

    <!-- Enchantment Replacement -->
    <FormGroup
      label="DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.label"
      labelFor="{appId}-enchant-period"
      document={context.document}
      field={context.fields.enchant.fields.period}
      config={{
        id: `${appId}-enchant-period`,
        value: context.source.enchant.period,
        disabled: !context.unlocked,
      }}
      hint="DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.hint"
      blank="DND5E.ENCHANTMENT.Period.Never"
      choices={context.config.enchantmentPeriods}
    />
  </fieldset>
{/if}

<FieldUses />
