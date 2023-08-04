<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import Select from 'src/components/form/Select.svelte';
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import ItemActivation from './ItemActivation.svelte';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemAction from './ItemAction.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: console.log($store);

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.SpellDetails')}</h3>

<div class="form-group">
  <label>{localize('DND5E.SpellLevel')}</label>
  <Select
    document={$store.item}
    field="system.level"
    value={$store.system.level}
    dtype="Number"
  >
    <SelectOptions data={$store.config.spellLevels} />
  </Select>
</div>

<div class="form-group">
  <label>{localize('DND5E.SpellSchool')}</label>
  <Select
    document={$store.item}
    field="system.school"
    value={$store.system.school}
  >
    <SelectOptions data={$store.config.spellSchools} blank="" />
  </Select>
</div>

<div class="spell-components form-group stacked">
  <label>{localize('DND5E.SpellComponents')}</label>
  {#each Object.entries($store.spellComponents) as [key, component]}
    {@const checked = $store.system.components[key]}
    <Checkbox
      labelCssClass="checkbox"
      document={$store.item}
      field="system.components.{key}"
      {checked}
    >
      {component.label}
    </Checkbox>
  {/each}
</div>

<div class="form-group stacked">
  <label>{localize('DND5E.SpellMaterials')}</label>
  <TextInput
    cssClass="materials"
    document={$store.item}
    field="system.materials.value"
    value={$store.system.materials.value}
  />
  {#if $store.system.materials.value}
    <div class="spell-materials flexrow">
      <label>{localize('DND5E.Supply')}</label>
      <NumberInput
        document={$store.item}
        field="system.materials.supply"
        value={$store.system.materials.supply}
        placeholder="0"
      />

      <label>{localize('DND5E.CostGP')}</label>
      <NumberInput
        document={$store.item}
        field="system.materials.cost"
        value={$store.system.materials.cost}
        placeholder="&mdash;"
      />
      <label>{localize('DND5E.Consumed')}</label>
      <Checkbox
        document={$store.item}
        field="system.materials.consumed"
        checked={$store.system.materials.consumed}
      />
    </div>
  {/if}
</div>

<div class="form-group input-select">
  <label>{localize('DND5E.SpellPreparationMode')}</label>
  <div class="form-fields">
    <label class="checkbox prepared">
      {localize('DND5E.SpellPrepared')}
      <Checkbox
        document={$store.item}
        field="system.preparation.prepared"
        checked={$store.system.preparation.prepared}
      />
    </label>
    <Select
      document={$store.item}
      field="system.preparation.mode"
      value={$store.system.preparation.mode}
    >
      <SelectOptions data={$store.config.spellPreparationModes} />
    </Select>
  </div>
</div>

<h3 class="form-header">{localize('DND5E.SpellCastingHeader')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.SpellEffects')}</h3>

<ItemAction />

<div class="form-group">
  <label>{localize('DND5E.LevelScaling')}</label>
  <div class="form-fields">
    <Select
      document={$store.item}
      field="system.scaling.mode"
      value={$store.system.scaling.mode}
    >
      <SelectOptions data={$store.config.spellScalingModes} />
    </Select>
    <TextInput
      document={$store.item}
      field="system.scaling.formula"
      value={$store.system.scaling.formula}
      placeholder={localize('DND5E.ScalingFormula')}
      dataset={{ formulaEditor: true }}
    />
  </div>
</div>
