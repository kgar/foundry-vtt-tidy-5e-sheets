<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import Select from 'src/components/inputs/Select.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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
    value={$context.source.level}
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
    value={$context.source.school}
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
          value={$context.source.materials.supply}
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
            value={$context.source.materials.cost}
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
          checked={$context.source.materials.consumed}
        />
      </div>
    </div>

    <!-- Material Description -->
    <TextInput
      document={$context.item}
      field="system.materials.value"
      value={$context.source.materials.value}
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
        checked={$context.source.preparation.prepared}
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
      value={$context.source.preparation.mode}
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
      value={$context.source.sourceClass}
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
    value={$context.source.ability}
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
      value={$context.source.sourceClass}
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

<!-- Targets -->
<FieldTargets />

<FieldUses />
