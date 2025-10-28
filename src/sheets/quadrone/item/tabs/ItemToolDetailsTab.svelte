<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import QuantityWeightPriceFormGroups from '../parts/QuantityWeightPriceFormGroups.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let appId = $derived(context.document.id);
</script>

<fieldset disabled={!context.unlocked}>
  <QuantityWeightPriceFormGroups />
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.ItemToolProperties')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Tool Type -->
  <FormGroup
    label="DND5E.ItemToolType"
    labelFor="{appId}-type-value"
    document={context.document}
    field={context.fields.type.fields.value}
    config={{
      id: `${appId}-type-value`,
      value: context.source.type.value,
    }}
    choices={context.config.toolTypes}
  />

  <!-- Base Tool -->
  {#if Object.keys(context.baseItems).length}
    <FormGroup
      label="DND5E.ItemToolBase"
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

  <!-- Tool Properties -->
  <div class="form-group stacked tool-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemToolProperties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  <!-- Ability Check -->
  <FormGroup label="DND5E.ActionAbil">
    <!-- Proficiency -->
    <FormGroup
      label="DND5E.Proficiency"
      labelFor="{appId}-proficient"
      document={context.document}
      field={context.fields.proficient}
      config={{
        id: `${appId}-proficient`,
        value: context.source.proficient,
        blank: true,
      }}
      blank="DND5E.Automatic"
      choices={context.config.proficiencyLevels}
      groupClasses="label-top"
    />
    <!-- Ability -->
    <FormGroup
      label="DND5E.Ability"
      labelFor="{appId}-ability"
      document={context.document}
      field={context.fields.ability}
      config={{ id: `${appId}-ability`, value: context.source.ability }}
      blank="DND5E.Default"
      labelAttr="label"
      groupClasses="label-top"
      choices={context.config.abilities}
    />
  </FormGroup>

  <!-- Tool Bonus -->
  <FormGroup
    labelFor="{appId}-bonus"
    document={context.document}
    field={context.fields.bonus}
    config={{ id: `${appId}-bonus`, value: context.source.bonus }}
  />

  <!-- Attunement -->
  {#if context.properties.object.mgc}
    <FormGroup
      label="DND5E.Attunement"
      labelFor="{appId}-attunement"
      document={context.document}
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

  <FieldUses />
</fieldset>
