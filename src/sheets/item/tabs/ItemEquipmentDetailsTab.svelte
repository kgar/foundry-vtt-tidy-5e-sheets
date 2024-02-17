<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemMountable from '../parts/ItemMountable.svelte';
  import ItemActivation from '../parts/ItemActivation.svelte';
  import ItemAction from '../parts/ItemAction.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { mapPropertiesToSave } from 'src/utils/system-properties';

  let context = getContext<Readable<ItemSheetContext>>('context');

  $: properties = Object.entries<any>($context.properties);

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">
  {localize('DND5E.ItemEquipmentDetails')}
</h3>

<ItemFormGroup
  field="system.armor.type"
  labelText={localize('DND5E.ItemEquipmentType')}
  let:inputId
>
  <Select
    id={inputId}
    value={$context.system.armor.type}
    field="system.armor.type"
    document={$context.item}
    disabled={!$context.editable}
  >
    <option value="" />
    <optgroup label={localize('DND5E.Armor')}>
      <SelectOptions data={$context.config.armorTypes} />
    </optgroup>
    <SelectOptions data={$context.config.miscEquipmentTypes} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  field="system.baseItem"
  labelText={localize('DND5E.ItemEquipmentBase')}
  let:inputId
>
  <Select
    id={inputId}
    value={$context.system.baseItem}
    field="system.baseItem"
    document={$context.item}
    disabled={!$context.editable}
  >
    <SelectOptions data={$context.baseItems} blank="" />
  </Select>
</ItemFormGroup>

{#if !$context.system.isMountable}
  <ItemFormGroup
    field="system.attunement"
    labelText={localize('DND5E.Attunement')}
    let:inputId
  >
    <Select
      id={inputId}
      value={$context.system.attunement?.toString() ?? ''}
      field="system.attunement"
      document={$context.item}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.attunements} />
    </Select>
  </ItemFormGroup>
{/if}

<ItemFormGroup labelText={localize('DND5E.Proficiency')}>
  <Select
    document={$context.item}
    field="system.proficient"
    value={$context.system.proficient}
    disabled={!$context.editable}
  >
    <SelectOptions
      data={$context.config.weaponAndArmorProficiencyLevels}
      blank={localize('DND5E.Automatic')}
    />
  </Select>
</ItemFormGroup>

{#if $context.system.isArmor || $context.system.isMountable}
  <ItemFormGroup
    labelText={localize('DND5E.ArmorClass')}
    field="system.armor.value"
    let:inputId
  >
    <NumberInput
      id={inputId}
      value={$context.system.armor.value}
      step="1"
      field="system.armor.value"
      document={$context.item}
      disabled={!$context.editable}
    />
  </ItemFormGroup>
{/if}

{#if $context.hasDexModifier}
  <ItemFormGroup
    labelText={localize('DND5E.ItemEquipmentDexMod')}
    field="system.armor.dex"
    let:inputId
  >
    <NumberInput
      id={inputId}
      step="1"
      placeholder={localize('DND5E.Unlimited')}
      field="system.armor.dex"
      document={$context.item}
      value={$context.system.armor.dex}
      disabled={!$context.editable}
    />
  </ItemFormGroup>
{/if}

{#if $context.system.isArmor}
  <ItemFormGroup
    field="system.strength"
    labelText={localize('DND5E.ItemRequiredStr')}
    let:inputId
  >
    <NumberInput
      id={inputId}
      step="1"
      placeholder={localize('DND5E.None')}
      field="system.strength"
      document={$context.item}
      value={$context.system.strength}
      disabled={!$context.editable}
    />
  </ItemFormGroup>

  <ItemFormGroup
    cssClass="stacked weapon-properties"
    labelText={localize('DND5E.ItemEquipmentProperties')}
  >
    {#each properties as [key, property]}
      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="system.properties.{key}"
        checked={property.selected}
        disabled={!$context.editable}
        onDataPreparing={(ev) =>
          mapPropertiesToSave($context.properties, ev, key)}
      >
        {property.label}
      </Checkbox>
    {/each}
  </ItemFormGroup>
{/if}

{#if $context.system.isMountable}
  <ItemMountable />
  <ItemFormGroup labelText={localize('DND5E.Speed')}>
    <div class="form-fields">
      <NumberInput
        placeholder="0"
        value={$context.system.speed.value}
        field="system.speed.value"
        document={$context.item}
        disabled={!$context.editable}
      />
      <span class="sep">{localize('DND5E.FeetAbbr')}</span>
      <TextInput
        field="system.speed.conditions"
        document={$context.item}
        value={$context.system.speed.conditions}
        disabled={!$context.editable}
      />
    </div>
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.ItemEquipmentUsage')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.ItemEquipmentAction')}</h3>

<ItemAction />
