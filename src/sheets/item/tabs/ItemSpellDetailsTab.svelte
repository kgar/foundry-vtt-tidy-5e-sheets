<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import Select from 'src/components/inputs/Select.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import ItemActivation from '../parts/ItemActivation.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemAction from '../parts/ItemAction.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import FieldTargets from '../parts/FieldTargets.svelte';
  import FieldActivation from '../parts/FieldActivation.svelte';
  import FieldRange from '../parts/FieldRange.svelte';
  import FieldDuration from '../parts/FieldDuration.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.SpellDetails')}</h3>

<!-- Spell Level -->
<div class="form-group">
  <label for="{appId}-level">{localize('DND5E.SpellLevel')}</label>
  <Select
    id="{appId}-level"
    document={$context.item}
    field="system.level"
    value={$context.system.level}
  >
    <SelectOptions data={$context.config.spellLevels} />
  </Select>
</div>

<!-- Spell School -->
<div class="form-group">
  <label for="{appId}-school">{localize('DND5E.SpellSchool')}</label>
  <Select
    id="{appId}-school"
    document={$context.item}
    field="system.school"
    value={$context.system.school}
  >
    <SelectOptions
      data={$context.config.spellSchools}
      labelProp="label"
      blank=""
    />
  </Select>
</div>

<!-- Spell Components -->
<div class="form-group spell-components stacked">
  <label for="">
    {localize('DND5E.SpellComponents')}
  </label>
  <ItemProperties />
</div>

<!-- Material Components -->
{#if $context.properties.object.material}
  <div class="form-group split-group">
    <label for="">{localize('DND5E.SpellMaterials')}</label>

    <div class="form-fields">
      <!-- Material Supply -->
      <div class="form-group label-top">
        <label for="{appId}-materials-supply">{localize('DND5E.Supply')}</label>
        <NumberInput
          id="{appId}-materials-supply"
          document={$context.item}
          field="system.materials.supply"
          value={$context.system.materials.supply}
          min="0"
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
          <NumberInput
            id="{appId}-materials-cost"
            document={$context.item}
            field="system.materials.cost"
            value={$context.system.materials.cost}
            min="0"
            placeholder="—"
          />
        </div>
      </div>

      <!-- Material Consumption -->
      <div class="form-group checkbox">
        <label for="{appId}-materials-consumed"
          >{localize('DND5E.Consumed')}</label
        >
        <Checkbox
          id="{appId}-materials-consumed"
          document={$context.item}
          field="system.materials.consumed"
          checked={$context.system.materials.consumed}
        />
      </div>
    </div>

    <!-- Material Description -->
    <TextInput
      document={$context.item}
      field="system.materials.value"
      value={$context.system.materials.value}
      class="full-width"
    />
  </div>
{/if}

<!-- Preparation Mode -->
<ItemFormGroup labelText={localize('DND5E.SpellPreparation.Mode')} let:inputId>
  <div class="form-fields">
    <!-- Prepared -->
    {#if $context.source.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED}
      <Checkbox
        document={$context.item}
        field="system.preparation.prepared"
        checked={$context.system.preparation.prepared}
        title={localize('DND5E.Prepared')}
        attributes={{
          ['aria-label']: localize('DND5E.Prepared'),
        }}
      />
    {/if}

    <!-- Mode -->
    <Select
      document={$context.item}
      field="system.preparation.mode"
      value={$context.system.preparation.mode}
    >
      <SelectOptions
        data={$context.config.spellPreparationModes}
        labelProp="label"
      />
    </Select>
  </div>
</ItemFormGroup>

<!-- Source Class -->
{#if $context.isEmbedded}
  <ItemFormGroup
    labelText={localize('DND5E.SpellSourceClass')}
    field="system.sourceClass"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.sourceClass"
      value={$context.system.sourceClass}
      disabled={!$context.editable}
      blankValue=""
    >
      <SelectOptions
        data={$context.document.parent.spellcastingClasses}
        labelProp="name"
        blank=""
      />
    </Select>
  </ItemFormGroup>

  <Select
    id="{appId}-ability"
    document={$context.item}
    field="system.ability"
    value={$context.system.ability}
    disabled={!$context.editable}
    blankValue=""
  >
    <SelectOptions
      data={$context.config.abilities}
      labelProp="label"
      blank={$context.defaultAbility}
    />
  </Select>
{:else}
  <ItemFormGroup
    labelText={localize('DND5E.SpellSourceClass')}
    field="system.sourceClass"
    let:inputId
  >
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.sourceClass"
      value={$context.system.sourceClass}
      disabled={!$context.editable}
    />
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.Casting')}</h3>

<!-- Activation -->
<FieldActivation />

<!-- Range -->
<FieldRange />

<!-- Duration -->
<FieldDuration />
<!-- 
{{> "dnd5e.field-duration" duration=system.duration fields=fields.duration.fields data=source.duration
        durationUnits=durationUnits inputs=inputs }}
 -->

<FieldTargets />
<!-- 
{{> "dnd5e.field-targets" target=system.target fields=fields.target.fields data=source.target inputs=inputs
    disabled=false }}

 -->

<FieldUses />

<!-- ****************** PREVIOUS CODE BELOW ***************** -->

<!-- <ItemFormGroup
  labelText={localize('DND5E.SpellLevel')}
  field="system.level"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.level"
    value={$context.system.level}
    disabled={!$context.editable}
  >
    <SelectOptions data={$context.config.spellLevels} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.SpellSchool')}
  field="system.school"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.school"
    value={$context.system.school}
    disabled={!$context.editable}
  >
    <SelectOptions
      data={$context.config.spellSchools}
      labelProp="label"
      blank=""
    />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  cssClass="spell-components stacked"
  labelText={localize('DND5E.SpellComponents')}
>
  <ItemProperties />
</ItemFormGroup>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.SpellMaterials')}
  field="system.materials.value"
  let:inputId
>
  <TextInput
    id={inputId}
    class="materials"
    document={$context.item}
    field="system.materials.value"
    value={$context.system.materials.value}
    disabled={!$context.editable}
  />
  {#if $context.system.materials.value}
    <div class="spell-materials flexrow align-items-center small-gap">
      <label for="{$context.appId}-system-materials-supply"
        >{localize('DND5E.Supply')}</label
      >
      <NumberInput
        id="{$context.appId}-system-materials-supply"
        document={$context.item}
        field="system.materials.supply"
        value={$context.system.materials.supply}
        placeholder="0"
        disabled={!$context.editable}
      />

      <label for="{$context.appId}-system-materials-cost"
        >{localize('DND5E.CostGP')}</label
      >
      <NumberInput
        id="{$context.appId}-system-materials-cost"
        document={$context.item}
        field="system.materials.cost"
        value={$context.system.materials.cost}
        placeholder="&mdash;"
        disabled={!$context.editable}
      />

      <Checkbox
        id="{$context.appId}-system-materials-consumed"
        labelCssClass="checkbox"
        document={$context.item}
        field="system.materials.consumed"
        checked={$context.system.materials.consumed}
        disabled={!$context.editable}
      >
        {localize('DND5E.Consumed')}
      </Checkbox>
    </div>
  {/if}
</ItemFormGroup>

<ItemFormGroup
  cssClass="input-select"
  labelText={localize('DND5E.SpellPreparationMode')}
>
  <div class="form-fields spell-preparation-mode">
    <Checkbox
      id="{$context.appId}-system-preparation-prepared"
      labelCssClass="checkbox prepared"
      document={$context.item}
      field="system.preparation.prepared"
      checked={$context.system.preparation.prepared}
      disabled={!$context.editable}
      greenCheckboxWidthOverride="{localize('DND5E.SpellPrepared').length +
        4}ch"
    >
      {localize('DND5E.SpellPrepared')}
    </Checkbox>
    <Select
      id="{$context.appId}-system-preparation-mode"
      document={$context.item}
      field="system.preparation.mode"
      value={$context.system.preparation.mode}
      disabled={!$context.editable}
    >
      <SelectOptions
        data={$context.config.spellPreparationModes}
        labelProp="label"
      />
    </Select>
  </div>
</ItemFormGroup>

{#if $context.isEmbedded && !!Object.keys($context.document.parent?.spellcastingClasses ?? {})?.length}
  {@const classIsInvalidForActor =
    ($context.system.sourceClass ?? '').trim() !== '' &&
    !$context.document.parent?.spellcastingClasses?.[
      $context.system.sourceClass
    ]}
  <ItemFormGroup
    labelText={localize('DND5E.SpellSourceClass')}
    field="system.sourceClass"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.sourceClass"
      value={$context.system.sourceClass}
      disabled={!$context.editable}
      blankValue=""
    >
      <SelectOptions
        data={$context.document.parent.spellcastingClasses}
        labelProp="name"
        blank=""
      />
      {#if classIsInvalidForActor}
        <option value={$context.system.sourceClass}>
          {localize('TIDY5E.SpellSourceIdentifierSelectText', {
            identifier: $context.system.sourceClass,
          })}
        </option>
      {/if}
    </Select>
    {#if classIsInvalidForActor}
      <i
        class="fas fa-fw fa-info-circle source-class-unowned-class-hint-icon flex-0"
        title={localize('TIDY5E.SpellSourceIdentifierLabelHint', {
          identifier: $context.system.sourceClass,
        })}
      ></i>
    {/if}
  </ItemFormGroup>
{:else}
  <ItemFormGroup
    labelText={localize('DND5E.SpellSourceClass')}
    field="system.sourceClass"
    let:inputId
  >
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.sourceClass"
      value={$context.system.sourceClass}
      disabled={!$context.editable}
    />
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.SpellCastingHeader')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.SpellEffects')}</h3>

<ItemAction />

<ItemFormGroup
  labelText={localize('DND5E.LevelScaling')}
  field="system.scaling.mode"
  let:inputId
>
  <div class="form-fields">
    <Select
      id={inputId}
      document={$context.item}
      field="system.scaling.mode"
      value={$context.system.scaling.mode}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.spellScalingModes} />
    </Select>
    <TextInput
      id="{$context.appId}-system-scaling-formula"
      document={$context.item}
      field="system.scaling.formula"
      value={$context.system.scaling.formula}
      placeholder={localize('DND5E.ScalingFormula')}
      dataset={{ formulaEditor: true }}
      disabled={!$context.editable}
    />
  </div>
</ItemFormGroup> -->
