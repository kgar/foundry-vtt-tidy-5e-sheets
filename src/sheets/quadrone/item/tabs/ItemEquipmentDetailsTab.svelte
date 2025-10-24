<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import DetailsMountable from '../parts/DetailsMountable.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import QuantityWeightPriceFormGroups from '../parts/QuantityWeightPriceFormGroups.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <QuantityWeightPriceFormGroups />
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.ItemEquipmentDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Equipment Type -->
  <FormGroup
    label="DND5E.ItemEquipmentType"
    labelFor="{appId}-type-value"
    document={context.document}
    field={context.fields.type.fields.value}
    config={{
      id: `${appId}-type-value`,
      value: context.source.type.value,
      disabled: !context.unlocked,
    }}
    choices={context.config.equipmentTypes}
  />

  <!-- Equipment Base -->
  {#if Object.keys(context.baseItems).length}
    <FormGroup
      label="DND5E.ItemEquipmentBase"
      labelFor="{appId}-type-base-item"
      document={context.document}
      field={context.fields.type.fields.baseItem}
      config={{
        id: `${appId}-type-base-item`,
        value: context.source.type.baseItem,
        disabled: !context.unlocked,
      }}
      choices={context.baseItems}
    />
  {/if}

  <!-- Proficiency -->
  <FormGroup
    labelFor="{appId}-proficient"
    document={context.document}
    field={context.fields.proficient}
    config={{
      id: `${appId}-proficient`,
      value: context.source.proficient,
      disabled: !context.unlocked,
    }}
    choices={context.config.weaponAndArmorProficiencyLevels}
    blank="DND5E.Automatic"
  />

  <!-- Armor -->
  {#if context.system.isArmor}
    <FormGroup label="DND5E.Armor" groupClasses="split-group">
      <FormGroup
        label="DND5E.AC"
        labelFor="{appId}-armor-value"
        document={context.document}
        field={context.fields.armor.fields.value}
        config={{
          id: `${appId}-armor-value`,
          value: context.source.armor.value,
          disabled: !context.unlocked,
        }}
        groupClasses="label-top"
      />
      {#if context.hasDexModifier}
        <FormGroup
          label="DND5E.ItemEquipmentDexModAbbr"
          labelFor="{appId}-armor-dex"
          document={context.document}
          field={context.fields.armor.fields.dex}
          config={{
            id: `${appId}-armor-dex`,
            value: context.source.armor.dex,
            disabled: !context.unlocked,
          }}
          groupClasses="label-top"
        />
      {/if}
      <FormGroup
        label="DND5E.AbilityStr"
        labelFor="{appId}-strength"
        document={context.document}
        field={context.fields.strength}
        config={{
          id: `${appId}-strength`,
          value: context.source.strength,
          disabled: !context.unlocked,
          placeholder: '—',
        }}
        groupClasses="label-top"
      />
    </FormGroup>
  {/if}

  <!-- Properties -->
  <div class="form-group stacked equipment-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemEquipmentProperties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  <!-- Magical Properties -->
  {#if context.properties.object.mgc}
    <!-- Attunement -->
    <FormGroup
      label="DND5E.ITEM.Property.Magical"
      labelFor="{appId}-system-attunement"
      groupClasses="split-group"
    >
      {#if !context.system.isMountable}
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
              blank: 'DND5E.AttunementNone',
              choices: context.config.attunementTypes,
              config: {
                id: `${appId}-attunement`,
                value: context.source.attunement,
                disabled: !context.unlocked,
                aria: {
                  label: localize('DND5E.Attunement'),
                },
                classes: 'flex-1',
              },
              field: context.fields.attunement,
            },
          ]}
        />
      {/if}

      <FormGroup
        label="DND5E.Bonus"
        labelFor="{appId}-armor-magical-bonus"
        document={context.document}
        groupClasses="label-top"
        config={{
          id: `${appId}-armor-magical-bonus`,
          value: context.source.armor.magicalBonus,
          disabled: !context.unlocked,
          placeholder: '0',
          step: 1,
        }}
        field={context.fields.armor.fields.magicalBonus}
      />
    </FormGroup>
  {/if}
</fieldset>

{#if context.system.isMountable}
  <DetailsMountable />
{/if}

<FieldUses />
