<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
  <legend>
    {#if context.item.type === CONSTANTS.ITEM_TYPE_WEAPON}
      {localize('DND5E.ItemSiegeProperties')}
    {:else if context.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
      {localize('DND5E.ItemVehicleProperties')}
    {/if}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Armor Class -->
  <FormGroup
    labelFor="{appId}-armor-value"
    document={context.document}
    field={context.fields.armor.fields.value}
    config={{
      id: `${appId}-armor-value`,
      value: context.source.armor.value,
      step: 1,
    }}
  />

  <!-- Crew -->
  <FormGroup
    label="DND5E.VEHICLE.MOUNTABLE.FIELDS.crew.label"
    groupClasses="split-group"
  >
    <FormGroup
      label="DND5E.Max"
      labelFor="{appId}-crew-max"
      document={context.document}
      field={context.fields.crew.fields.max}
      config={{
        id: `${appId}-crew-max`,
        value: context.source.crew.max,
        placeholder: '—',
      }}
      groupClasses="label-top"
    />
    <FormGroup
      labelFor="{appId}-cover"
      document={context.document}
      field={context.fields.cover}
      config={{
        id: `${appId}-cover`,
        value: context.source.cover ?? 0,
        hint: false,
      }}
      choices={context.coverOptions}
      groupClasses="label-top"
      tooltip="DND5E.VEHICLE.MOUNTABLE.FIELDS.cover.hint"
    />
  </FormGroup>

  <!-- Hit Points -->
  <FormGroup label="DND5E.HitPoints" groupClasses="split-group">
    <!-- Current -->
    <FormGroup
      label="DND5E.Current"
      labelFor="{appId}-hp-value"
      document={context.document}
      field={context.fields.hp.fields.value}
      config={{
        id: `${appId}-hp-value`,
        value: context.source.hp?.value,
        placeholder: '0',
      }}
      groupClasses="label-top"
    />

    <!-- Max -->
    <FormGroup
      label="DND5E.Max"
      labelFor="{appId}-hp-max"
      document={context.document}
      field={context.fields.hp.fields.max}
      config={{
        id: `${appId}-hp-max`,
        value: context.source.hp?.max,
        placeholder: '0',
      }}
      groupClasses="label-top"
    />

    <!-- Threshold -->
    <FormGroup
      label="DND5E.Threshold"
      labelFor="{appId}-hp-dt"
      document={context.document}
      field={context.fields.hp.fields.dt}
      config={{
        id: `${appId}-hp-dt`,
        value: context.source.hp?.dt,
        placeholder: '—',
      }}
      groupClasses="label-top"
    />

    {#snippet beforeGroupEnd()}
      <TidyFormInput
        document={context.document}
        field={context.fields.hp.fields.conditions}
        config={{
          id: `${appId}-hp-conditions`,
          value: context.source.hp?.conditions,
          placeholder: localize(
            'DND5E.VEHICLE.MOUNTABLE.FIELDS.hp.conditions.label',
          ),
          classes: 'full-width',
        }}
      />
    {/snippet}
  </FormGroup>

  <!-- Speed -->
  {#if context.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
    <FormGroup
      label="DND5E.Speed"
      labelFor="{appId}-speed-value"
      groupClasses="split-group"
    >
      <FormGroup
        label="DND5E.Value"
        labelFor="{appId}-speed-value"
        document={context.document}
        field={context.fields.speed.fields.value}
        config={{
          id: `${appId}-speed-value`,
          value: context.source.speed?.value,
          placeholder: '0',
        }}
        groupClasses="label-top"
      />
      <FormGroup
        label="DND5E.Unit"
        labelFor="{appId}-speed-units"
        document={context.document}
        field={context.fields.speed.fields.units}
        config={{
          id: `${appId}-speed-units`,
          value: context.source.speed?.units ?? context.unitsOptions[0]?.value,
          
        }}
        groupClasses="label-top"
        choices={context.unitsOptions}
      />

      {#snippet beforeGroupEnd()}
        <TidyFormInput
          document={context.document}
          field={context.fields.speed.fields.conditions}
          config={{
            id: `${appId}-speed-conditions`,
            value: context.source.speed?.conditions,
            placeholder: localize(
              'DND5E.VEHICLE.MOUNTABLE.FIELDS.speed.conditions.label',
            ),
            classes: 'full-width',
          }}
        />
      {/snippet}
    </FormGroup>
  {/if}
</fieldset>
