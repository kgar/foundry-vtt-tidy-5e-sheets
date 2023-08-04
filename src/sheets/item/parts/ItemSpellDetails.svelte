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
  import ItemFormGroup from '../form/ItemFormGroup.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: console.log($store);

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.SpellDetails')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.SpellLevel')}
  field="system.level"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.level"
    value={$store.system.level}
    dtype="Number"
  >
    <SelectOptions data={$store.config.spellLevels} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.SpellSchool')}
  field="system.school"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.school"
    value={$store.system.school}
  >
    <SelectOptions data={$store.config.spellSchools} blank="" />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  cssClass="spell-components stacked"
  labelText={localize('DND5E.SpellComponents')}
>
  {#each Object.entries($store.spellComponents) as [key, component]}
    {@const checked = $store.system.components[key]}
    <Checkbox
      id="{$store.appId}-system-components-{key}"
      labelCssClass="checkbox"
      document={$store.item}
      field="system.components.{key}"
      {checked}
    >
      {component.label}
    </Checkbox>
  {/each}
</ItemFormGroup>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.SpellMaterials')}
  field=""
  let:inputId
>
  <TextInput
    id={inputId}
    cssClass="materials"
    document={$store.item}
    field="system.materials.value"
    value={$store.system.materials.value}
  />
  {#if $store.system.materials.value}
    <div class="spell-materials flexrow align-items-center small-gap">
      <label for="{$store.appId}-system-materials-supply"
        >{localize('DND5E.Supply')}</label
      >
      <NumberInput
        id="{$store.appId}-system-materials-supply"
        document={$store.item}
        field="system.materials.supply"
        value={$store.system.materials.supply}
        placeholder="0"
      />

      <label for="{$store.appId}-system-materials-cost"
        >{localize('DND5E.CostGP')}</label
      >
      <NumberInput
        id="{$store.appId}-system-materials-cost"
        document={$store.item}
        field="system.materials.cost"
        value={$store.system.materials.cost}
        placeholder="&mdash;"
      />

      <Checkbox
        id="{$store.appId}-system-materials-consumed"
        labelCssClass="checkbox"
        document={$store.item}
        field="system.materials.consumed"
        checked={$store.system.materials.consumed}
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
      id="{$store.appId}-system-preparation-prepared"
      labelCssClass="checkbox prepared"
      document={$store.item}
      field="system.preparation.prepared"
      checked={$store.system.preparation.prepared}
    >
      {localize('DND5E.SpellPrepared')}
    </Checkbox>
    <Select
      id="{$store.appId}-system-preparation-mode"
      document={$store.item}
      field="system.preparation.mode"
      value={$store.system.preparation.mode}
    >
      <SelectOptions data={$store.config.spellPreparationModes} />
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
      document={$store.item}
      field="system.scaling.mode"
      value={$store.system.scaling.mode}
    >
      <SelectOptions data={$store.config.spellScalingModes} />
    </Select>
    <TextInput
      id="{$store.appId}-system-scaling-formula"
      document={$store.item}
      field="system.scaling.formula"
      value={$store.system.scaling.formula}
      placeholder={localize('DND5E.ScalingFormula')}
      dataset={{ formulaEditor: true }}
    />
  </div>
</ItemFormGroup>
