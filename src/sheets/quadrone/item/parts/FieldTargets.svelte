<script lang="ts">
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.TargetPl')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Target Type -->
  <FormGroup label="DND5E.TargetPl" groupClasses="split-group">
    <!-- Amount -->
    {#if context.system.target.affects.scalar}
      <FormGroup
        label="DND5E.Amount"
        labelFor="{appId}-target-affects-count"
        document={context.document}
        field={context.fields.target.fields.affects.fields.count}
        config={{
          id: `${appId}-target-affects-count`,
          value: context.source.target.affects.count,
          disabled: !context.unlocked,
          placeholder: context.affectsPlaceholder,
          hint: false,
        }}
        groupClasses="label-top"
      />
    {/if}
    <!-- Type -->
    <FormGroup
      label="DND5E.Type"
      labelFor="{appId}-target-affects-type"
      document={context.document}
      field={context.fields.target.fields.affects.fields.type}
      config={{
        id: `${appId}-target-affects-type`,
        value: context.source.target.affects.type,
        disabled: !context.unlocked,
        hint: false,
      }}
      choices={context.config.individualTargetTypes}
      labelAttr="label"
      groupClasses="label-top"
    />

    {#snippet beforeGroupEnd()}
      <!-- Special -->
      <TidyFormInput
        document={context.document}
        field={context.fields.target.fields.affects.fields.special}
        config={{
          id: `${appId}-target-affects-special`,
          value: context.source.target.affects.special,
          disabled: !context.unlocked,
          classes: 'full-width',
          placeholder: localize(
            'DND5E.TARGET.FIELDS.target.affects.special.label',
          ),
        }}
      />
    {/snippet}
  </FormGroup>

  <!-- Choose Targets  -->
  {#if context.system.target.template.type}
    <FormGroup
      label="DND5E.TARGET.FIELDS.target.affects.choice.label"
      labelFor="{appId}-target-affects-choice"
      hint="DND5E.TARGET.FIELDS.target.affects.choice.hint"
      field={context.fields.target.fields.affects.fields.choice}
      config={{
        id: `${appId}-target-affects-choice`,
        value: context.source.target.affects.choice,
        disabled: !context.unlocked,
      }}
    />
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.TargetTypeArea')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Template Type -->
  <FormGroup
    label="DND5E.Shape"
    labelFor="{appId}-target-template-type"
    document={context.document}
    field={context.fields.target.fields.template.fields.type}
    config={{
      id: `${appId}-target-template-type`,
      value: context.source.target.template.type,
      disabled: !context.unlocked,
      hint: false,
      blank: false,
    }}
    choices={context.config.areaTargetOptions}
    labelAttr="label"
  />

  <!-- Dimensions -->
  {#if context.system.target.template.type && context.dimensions}
    <FormGroup label="DND5E.Dimensions" groupClasses="split-group">
      <!-- Size -->
      <FormGroup
        label={context.dimensions.size}
        labelFor="{appId}-target-template-size"
        document={context.document}
        field={context.fields.target.fields.template.fields.size}
        config={{
          id: `${appId}-target-template-size`,
          value: context.source.target.template.size,
          disabled: !context.unlocked,
          hint: false,
        }}
        groupClasses="label-top"
      />
      <!-- Width -->
      {#if context.dimensions?.width}
        <FormGroup
          label={context.dimensions.width}
          labelFor="{appId}-target-template-width"
          document={context.document}
          field={context.fields.target.fields.template.fields.width}
          config={{
            id: `${appId}-target-template-width`,
            value: context.source.target.template.width,
            disabled: !context.unlocked,
            hint: false,
          }}
          groupClasses="label-top"
        />
      {/if}
      <!-- Height -->
      {#if context.dimensions?.height}
        <FormGroup
          label={context.dimensions.height}
          labelFor="{appId}-target-template-height"
          document={context.document}
          field={context.fields.target.fields.template.fields.height}
          config={{
            id: `${appId}-target-template-height`,
            value: context.source.target.template.height,
            disabled: !context.unlocked,
            hint: false,
          }}
          groupClasses="label-top"
        />
      {/if}
      <!-- Units -->
      <FormGroup
        label="DND5E.MovementUnits"
        labelFor="{appId}-target-template-units"
        document={context.document}
        field={context.fields.target.fields.template.fields.units}
        config={{
          id: `${appId}-target-template-units`,
          value: context.source.target.template.units,
          disabled: !context.unlocked,
          hint: false,
        }}
        choices={context.config.movementUnits}
        groupClasses="label-top"
      />
    </FormGroup>

    <!-- Multiple -->
    <FormGroup label="DND5E.Multiple" groupClasses="split-group">
      <!-- Amount -->
      <FormGroup
        label="DND5E.Amount"
        labelFor="{appId}-target-template-count"
        document={context.document}
        field={context.fields.target.fields.template.fields.count}
        config={{
          id: `${appId}-target-template-count`,
          value: context.source.target.template.count,
          disabled: !context.unlocked,
          placeholder: '1',
          hint: false,
        }}
        groupClasses="label-top"
      />

      <!-- Contiguous -->
      {#if context.source.target.template.type && context.source.target.template.count > 1}
        <div class="form-group checkbox">
          <label for="{appId}-target-template-contiguous" class="checkbox">
            {localize('DND5E.Contiguous')}
            <TidyFormInput
              document={context.document}
              field={context.fields.target.fields.template.fields.contiguous}
              config={{
                id: `${appId}-target-template-contiguous`,
                value: context.source.target.template.contiguous,
                disabled: !context.unlocked,
                hint: false,
              }}
            />
          </label>
        </div>
      {/if}
    </FormGroup>
  {/if}
</fieldset>
