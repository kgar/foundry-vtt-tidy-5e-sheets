<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import FieldTargets from '../parts/FieldTargets.svelte';
  import FieldActivation from '../parts/FieldActivation.svelte';
  import FieldRange from '../parts/FieldRange.svelte';
  import FieldDuration from '../parts/FieldDuration.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.SpellDetails')}
  </legend>

  <!-- Spell Level -->
  <div class="form-group">
    <label for="{appId}-level">{localize('DND5E.SpellLevel')}</label>
    <SelectQuadrone
      id="{appId}-level"
      document={context.item}
      field="system.level"
      value={context.source.level}
      disabled={!context.editable}
    >
      <SelectOptions data={context.config.spellLevels} />
    </SelectQuadrone>
  </div>

  <!-- Spell School -->
  <div class="form-group">
    <label for="{appId}-school">{localize('DND5E.SpellSchool')}</label>
    <SelectQuadrone
      id="{appId}-school"
      document={context.item}
      field="system.school"
      value={context.source.school}
      disabled={!context.editable}
    >
      <SelectOptions
        data={context.config.spellSchools}
        labelProp="label"
        blank=""
      />
    </SelectQuadrone>
  </div>

  <!-- Spell Components -->
  <div class="form-group spell-components stacked">
    <label for="">
      {localize('DND5E.SpellComponents')}
    </label>
    <ItemProperties />
  </div>

  <!-- Material Components -->
  {#if context.properties.object.material}
    <div class="form-group split-group">
      <label for="">{localize('DND5E.SpellMaterials')}</label>

      <div class="form-fields">
        <!-- Material Supply -->
        <div class="form-group label-top">
          <label for="{appId}-materials-supply"
            >{localize('DND5E.Supply')}</label
          >
          <NumberInputQuadrone
            id="{appId}-materials-supply"
            document={context.item}
            field="system.materials.supply"
            value={context.source.materials.supply}
            min="0"
            disabled={!context.editable}
          />
        </div>

        <!-- Material Cost -->
        <div class="form-group label-top">
          <label
            for="{appId}-materials-cost"
            class="label-icon currency gp"
            aria-label={localize('DND5E.CostGP')}
          >
            {localize('DND5E.Cost')}
          </label>

          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-materials-cost"
              document={context.item}
              field="system.materials.cost"
              value={context.source.materials.cost}
              min="0"
              placeholder="—"
              disabled={!context.editable}
            />
          </div>
        </div>

        <!-- Material Consumption -->
        <div class="form-group checkbox">
          <label for="{appId}-materials-consumed"
            >{localize('DND5E.Consumed')}</label
          >
          <div class="form-fields">
            <CheckboxQuadrone
              id="{appId}-materials-consumed"
              document={context.item}
              field="system.materials.consumed"
              checked={context.source.materials.consumed}
              disabled={!context.editable}
            />
          </div>
        </div>
      </div>

      <!-- Material Description -->
      <TextInputQuadrone
        id="{appId}-materials-value"
        document={context.item}
        field="system.materials.value"
        value={context.source.materials.value}
        class="full-width"
        disabled={!context.editable}
      />
    </div>
  {/if}

  <!-- Preparation Mode -->
  <div class="form-group">
    <label for="{appId}-preparation-mode"
      >{localize('DND5E.SpellPreparation.Mode')}</label
    >
    <div class="form-fields">
      <!-- Prepared -->
      {#if context.source.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED}
        <CheckboxQuadrone
          id="{appId}-preparation-prepared"
          document={context.item}
          field="system.preparation.prepared"
          checked={context.source.preparation.prepared}
          title={localize('DND5E.Prepared')}
          aria-label={localize('DND5E.Prepared')}
          disabled={!context.editable}
        />
      {/if}

      <!-- Mode -->
      <SelectQuadrone
        id="{appId}-preparation-mode"
        document={context.item}
        field="system.preparation.mode"
        value={context.source.preparation.mode}
        disabled={!context.editable}
      >
        <SelectOptions
          data={context.config.spellPreparationModes}
          labelProp="label"
        />
      </SelectQuadrone>
    </div>
  </div>

  <!-- Source Class -->
  {#if context.isEmbedded}
    <div class="form-group">
      <label for="{appId}-sourceClass"
        >{localize('DND5E.SpellSourceClass')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-sourceClass"
          document={context.item}
          field="system.sourceClass"
          value={context.source.sourceClass}
          disabled={!context.editable}
          blankValue=""
        >
          <SelectOptions
            data={context.document.parent.spellcastingClasses}
            labelProp="name"
            blank=""
          />
        </SelectQuadrone>
      </div>
    </div>

    <SelectQuadrone
      id="{appId}-ability"
      document={context.item}
      field="system.ability"
      value={context.source.ability}
      disabled={!context.editable}
      blankValue=""
    >
      <SelectOptions
        data={context.config.abilities}
        labelProp="label"
        blank={context.defaultAbility}
      />
    </SelectQuadrone>
  {:else}
    <div class="form-group">
      <label for="{appId}-sourceClass"
        >{localize('DND5E.SpellSourceClass')}</label
      >
      <div class="form-fields">
        <TextInputQuadrone
          id="{appId}-sourceClass"
          document={context.item}
          field="system.sourceClass"
          value={context.source.sourceClass}
          disabled={!context.editable}
        />
      </div>
    </div>
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.Casting')}
  </legend>

  <FieldActivation />
  <FieldRange />
  <FieldDuration />
</fieldset>

<FieldTargets />

<FieldUses />
