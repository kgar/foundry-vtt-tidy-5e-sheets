<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import { CONSTANTS } from 'src/constants';
  import FieldDamage from '../parts/FieldDamage.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import QuantityWeightPriceFormGroups from '../parts/QuantityWeightPriceFormGroups.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
  <QuantityWeightPriceFormGroups />
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.ItemConsumableDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FormGroup
    label="DND5E.ItemConsumableType"
    labelFor="{appId}-type-value"
    document={context.document}
    field={context.fields.type.fields.value}
    config={{
      id: `${appId}-type-value`,
      value: context.source.type.value,
    }}
    choices={context.config.consumableTypes}
  />

  {#if context.itemSubtypes}
    {@const consumableSubTypeLabel = localize('DND5E.ItemConsumableSubtype', {
      category:
        context.config.consumableTypes[context.system.type.value]?.label,
    })}

    <FormGroup
      label={consumableSubTypeLabel}
      labelFor="{appId}-type-subtype"
      document={context.document}
      field={context.fields.type.fields.subtype}
      config={{
        id: `${appId}-type-subtype`,
        value: context.source.type.subtype,
      }}
      choices={context.itemSubtypes}
    />
  {/if}

  <div class="form-group stacked consumable-properties checkbox-grid">
    <label for=""
      >{context.system.type.value === 'ammo'
        ? localize('DND5E.ItemAmmoProperties')
        : localize('DND5E.ItemConsumableProperties')}</label
    >
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  {#if context.properties.object.mgc}
    <!-- Attunement -->
    <FormGroup
      label="DND5E.ITEM.Property.Magical"
      labelFor="{appId}-system-attunement"
      groupClasses="split-group"
    >
      <FormGroup
        label="DND5E.Attunement"
        labelFor="{appId}-attunement"
        document={context.document}
        groupClasses="label-top no-gap"
        fields={[
          // Attuned
          {
            config: {
              id: `${appId}-attuned`,
              value: context.source.attuned,
              disabled:
                !context.unlocked ||
                !context.config.attunementTypes[context.system.attunement],
              aria: {
                label: localize('DND5E.AttunementAttuned'),
              },
            },
            disabledValue: context.system.attuned,
            field: context.fields.attuned,
            tooltip: 'DND5E.AttunementAttuned',
          },
          // Attunement
          {
            blankLabel: 'DND5E.AttunementNone',
            choices: context.config.attunementTypes,
            config: {
              id: `${appId}-attunement`,
              value: context.source.attunement,
              aria: {
                label: localize('DND5E.Attunement'),
              },
              classes: 'flex-1',
            },
            field: context.fields.attunement,
          },
        ]}
      />

      {#if context.system.type.value === CONSTANTS.ITEM_SYSTEM_TYPE_AMMO}
        <FormGroup
          label="DND5E.Bonus"
          labelFor="{appId}-magical-bonus"
          document={context.document}
          groupClasses="label-top"
          config={{
            id: `${appId}-magical-bonus`,
            value: context.source.magicalBonus,
            placeholder: '0',
            step: 1,
          }}
          field={context.fields.magicalBonus}
        />
      {/if}
    </FormGroup>
  {/if}
</fieldset>

{#if context.system.type.value === CONSTANTS.ITEM_SYSTEM_TYPE_AMMO}
  <fieldset disabled={!context.unlocked}>
    <legend>
      {localize('DND5E.CONSUMABLE.FIELDS.damage.label')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <FormGroup
      labelFor="{appId}-damage-replace"
      document={context.document}
      config={{
        id: `${appId}-damage-replace`,
        value: context.source.damage.replace,
      }}
      field={context.fields.damage.fields.replace}
      disabledValue={context.system.damage.replace}
    />

    <FieldDamage
      prefix="system.damage.base."
      source={context.source.damage.base}
      fields={context.fields.damage.fields.base.fields}
      system={context.system.damage.base}
      denominationOptions={context.denominationOptions}
      types={context.damageTypes}
    />
  </fieldset>
{/if}

<FieldUses />
