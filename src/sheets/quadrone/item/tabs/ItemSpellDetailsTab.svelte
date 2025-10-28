<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import FieldTargets from '../parts/FieldTargets.svelte';
  import FieldActivation from '../parts/FieldActivation.svelte';
  import FieldRange from '../parts/FieldRange.svelte';
  import FieldDuration from '../parts/FieldDuration.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.SpellDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!--Spell Level -->
  <FormGroup
    labelFor="{appId}-level"
    document={context.document}
    field={context.fields.level}
    config={{
      id: `${appId}-level`,
      value: context.source.level,
    }}
    choices={context.config.spellLevels}
  />

  <!-- Spell School -->
  <FormGroup
    labelFor="{appId}-school"
    document={context.document}
    field={context.fields.school}
    config={{
      id: `${appId}-school`,
      value: context.source.school,
    }}
    choices={context.config.spellSchools}
  />

  <!-- Spell Components -->
  <div class="form-group spell-components stacked checkbox-grid">
    <label for="">
      {localize('DND5E.SpellComponents')}
    </label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  <!-- Material Components -->
  {#if context.properties.object.material}
    <FormGroup label="DND5E.SpellMaterials" groupClasses="split-group">
      <!-- Material Supply -->
      <FormGroup
        label="DND5E.Supply"
        labelFor="{appId}-materials-supply"
        document={context.document}
        field={context.fields.materials.fields.supply}
        config={{
          id: `${appId}-materials-supply`,
          value: context.source.materials.supply,
        }}
        groupClasses="label-top"
      />
      <!-- Material Cost -->
      <FormGroup
        document={context.document}
        field={context.fields.materials.fields.cost}
        config={{
          id: `${appId}-materials-cost`,
          value: context.source.materials.cost,
          placeholder: '—',
        }}
        groupClasses="label-top"
      >
        {#snippet formLabel()}
          <label
            for="{appId}-materials-cost"
            class="label-icon currency gp"
            aria-label={localize('DND5E.CostGP')}
          >
            {localize('DND5E.Cost')}
          </label>
        {/snippet}
      </FormGroup>

      <!-- Material Consumption -->
      <div class="form-group checkbox">
        <label for="{appId}-materials-consumed" class="checkbox">
          {localize('DND5E.Consumed')}
          <TidyFormInput
            document={context.document}
            field={context.fields.materials.fields.consumed}
            config={{
              id: `${appId}-materials-consumed`,
              value: context.source.materials.consumed,
            }}
          />
        </label>
      </div>

      {#snippet beforeGroupEnd()}
        <TidyFormInput
          document={context.document}
          field={context.fields.materials.fields.value}
          config={{
            id: `${appId}-materials-value`,
            value: context.source.materials.value,
            classes: 'full-width',
          }}
        />
      {/snippet}
    </FormGroup>
  {/if}

  <!-- Preparation Method -->
  <FormGroup label="DND5E.SpellPreparation.Method">
    <!-- Method -->
    <FormGroup
      label="DND5E.Method"
      labelFor="{appId}-method"
      document={context.document}
      field={context.fields.method}
      config={{
        id: `${appId}-method`,
        value: context.source.method,
      }}
      choices={context.spellcastingMethods}
      groupClasses="label-top"
    />
    {#if context.canPrepare}
      <!-- Preparation -->
      <FormGroup
        label="DND5E.Preparation"
        labelFor="{appId}-prepared"
        document={context.document}
        field={context.fields.prepared}
        config={{
          id: `${appId}-prepared`,
          value: context.source.prepared,
        }}
        choices={context.config.spellPreparationStates}
        groupClasses="label-top"
        valueAttr="value"
      />
    {/if}
  </FormGroup>

  <!-- Source Class -->
  {#if context.isEmbedded}
    <FormGroup
      labelFor="{appId}-sourceClass"
      document={context.document}
      field={context.fields.sourceClass}
      config={{
        id: `${appId}-sourceClass`,
        value: context.source.sourceClass,
      }}
      labelAttr="name"
      choices={context.document.parent.spellcastingClasses}
    />

    <FormGroup
      labelFor="{appId}-ability"
      document={context.document}
      field={context.fields.ability}
      config={{
        id: `${appId}-ability`,
        value: context.source.ability,
      }}
      blankLabel={context.defaultAbility}
      choices={context.config.abilities}
    />
  {:else}
    <FormGroup
      labelFor="{appId}-sourceClass"
      document={context.document}
      field={context.fields.sourceClass}
      config={{
        id: `${appId}-sourceClass`,
        value: context.source.sourceClass,
      }}
    />
  {/if}
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.Casting')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FieldActivation />
  <FieldRange />
  <FieldDuration />
</fieldset>

<FieldTargets />

<FieldUses />
