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
  import { settingStore } from 'src/settings/settings';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const allClasses = FoundryAdapter.getAllClassesDropdownOptions(
    $settingStore.spellClassFilterAdditionalClasses,
  );

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.SpellDetails')}</h3>

{#if $settingStore.useMulticlassSpellbookFilter}
  <ItemFormGroup
    labelText={localize('TIDY5E.SpellClass')}
    field={TidyFlags.parentClass.prop}
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field={TidyFlags.parentClass.prop}
      value={TidyFlags.parentClass.get($context.item) ?? ''}
      disabled={!$context.editable}
    >
      <option value="">&mdash;</option>
      {#each allClasses as { text, value }}
        <option {value}>{localize(text)}</option>
      {/each}
    </Select>
  </ItemFormGroup>
{/if}

<ItemFormGroup
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
    cssClass="materials"
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
</ItemFormGroup>
