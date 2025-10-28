<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DetailsMountable from 'src/sheets/quadrone/item/parts/DetailsMountable.svelte';
  import FieldDamage from 'src/sheets/quadrone/item/parts/FieldDamage.svelte';
  import FieldUses from 'src/sheets/quadrone/item/parts/FieldUses.svelte';
  import ItemProperties from 'src/sheets/quadrone/item/parts/ItemProperties.svelte';
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
    {localize('DND5E.ItemWeaponDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Weapon Type -->
  <FormGroup
    label="DND5E.ItemWeaponType"
    labelFor="{appId}-type-value"
    document={context.document}
    field={context.fields.type.fields.value}
    config={{
      id: `${appId}-type-value`,
      value: context.source.type.value,
    }}
    choices={context.config.weaponTypes}
  />

  <!-- Weapon Base -->
  {#if Object.keys(context.baseItems).length}
    <FormGroup
      label="DND5E.ItemWeaponBase"
      labelFor="{appId}-type-baseItem"
      document={context.document}
      field={context.fields.type.fields.baseItem}
      config={{
        id: `${appId}-type-baseItem`,
        value: context.source.type.baseItem,
      }}
      choices={context.baseItems}
    />
  {/if}

  <!-- Proficiency -->
  {#if !context.item.isMountable}
    <FormGroup
      labelFor="{appId}-proficient"
      document={context.document}
      field={context.fields.proficient}
      config={{
        id: `${appId}-proficient`,
        value: context.source.proficient,
      }}
      choices={context.config.weaponAndArmorProficiencyLevels}
      blankLabel="DND5E.Automatic"
    />
  {/if}

  <!-- Weapon Mastery -->
  <FormGroup
    labelFor="{appId}-mastery"
    document={context.document}
    field={context.fields.mastery}
    config={{ id: `${appId}-mastery`, value: context.source.mastery }}
    choices={context.config.weaponMasteries}
    labelAttr="label"
  />

  <!-- Weapon Properties -->
  <div class="form-group stacked weapon-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemWeaponProperties')}</label>
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
              blankLabel: 'DND5E.AttunementNone',
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
        labelFor="{appId}-magical-bonus"
        document={context.document}
        groupClasses="label-top"
        field={context.fields.magicalBonus}
        config={{
          id: `${appId}-magical-bonus`,
          value: context.source.magicalBonus,
          disabled: !context.unlocked,
          placeholder: '0',
          step: 1,
        }}
      />
    </FormGroup>
  {/if}

  <!-- Ammunition Type -->
  {#if context.properties.object.amm}
    <FormGroup
      labelFor="{appId}-ammunition-type"
      document={context.document}
      field={context.fields.ammunition.fields.type}
      config={{
        id: `${appId}-ammunition-type`,
        value: context.source.ammunition.type,
      }}
      choices={context.config.consumableTypes.ammo.subtypes}
    />
  {/if}
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.Range')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  {#if context.system.hasRange || !context.system.attackType}
    <FormGroup label="DND5E.RangeDistance" groupClasses="split-group">
      <!-- Normal -->
      <FormGroup
        label="DND5E.Normal"
        labelFor="{appId}-range-value"
        document={context.document}
        field={context.fields.range.fields.value}
        config={{
          id: `${appId}-range-value`,
          value: context.source.range.value,
          hint: false,
        }}
        groupClasses="label-top"
      />
      <!-- Long -->
      <FormGroup
        label="DND5E.Long"
        labelFor="{appId}-range-long"
        document={context.document}
        field={context.fields.range.fields.long}
        config={{
          id: `${appId}-range-long`,
          value: context.source.range.long,
          hint: false,
        }}
        groupClasses="label-top"
      />
      <!-- Reach -->
      {#if context.system.attackType !== 'ranged'}
        <FormGroup
          label="DND5E.RANGE.FIELDS.range.reach.label"
          labelFor="{appId}-range-reach"
          document={context.document}
          field={context.fields.range.fields.reach}
          config={{
            id: `${appId}-range-reach`,
            value: context.source.range.reach,
            placeholder:
              context.system.range.reach === null
                ? '—'
                : context.system.range.reach,
          }}
          groupClasses="label-top"
        />
      {/if}
    </FormGroup>

    <!-- Units -->
    <FormGroup
      label="DND5E.MovementUnits"
      labelFor="{appId}-range-units"
      document={context.document}
      field={context.fields.range.fields.units}
      config={{
        id: `${appId}-range-units`,
        value: context.source.range.units,
        hint: false,
      }}
      choices={context.config.movementUnits}
    />
  {:else}
    <FormGroup label="DND5E.RangeDistance" groupClasses="split-group">
      <!-- Reach -->
      {#if context.system.attackType === 'melee'}
        <FormGroup
          label="DND5E.RANGE.FIELDS.range.reach.label"
          labelFor="{appId}-range-reach"
          document={context.document}
          field={context.fields.range.fields.reach}
          config={{
            id: `${appId}-range-reach`,
            value: context.source.range.reach,
            placeholder:
              context.system.range.reach === null
                ? '—'
                : context.system.range.reach,
          }}
          groupClasses="label-top"
        />
      {/if}
      <!-- Units -->
      <FormGroup
        label="DND5E.MovementUnits"
        labelFor="{appId}-range-units"
        document={context.document}
        field={context.fields.range.fields.units}
        config={{
          id: `${appId}-range-units`,
          value: context.source.range.units,
          hint: false,
        }}
        choices={context.config.movementUnits}
        groupClasses="label-top"
      />
    </FormGroup>
  {/if}
</fieldset>

{#if context.system.isMountable}
  <DetailsMountable />
{/if}

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.DAMAGE.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-fields">
    <p class="hint">{localize('DND5E.WEAPON.FIELDS.damage.hint')}</p>
  </div>

  <FieldDamage
    prefix="system.damage.base."
    source={context.source.damage.base}
    system={context.system.damage.base}
    fields={context.fields.damage.fields.base.fields}
    denominationOptions={context.denominationOptions.base}
    types={context.damageTypes}
  />
</fieldset>

{#if context.properties.object.ver}
  <fieldset disabled={!context.unlocked}>
    <legend>
      {localize('DND5E.Versatile')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <FieldDamage
      denominationOptions={context.denominationOptions.base}
      source={context.source.damage.versatile}
      fields={context.fields.damage.fields.versatile.fields}
      system={context.system.damage.versatile}
      prefix="system.damage.versatile."
      numberPlaceholder={context.source.damage.base.number}
    />
  </fieldset>
{/if}

<FieldUses />
