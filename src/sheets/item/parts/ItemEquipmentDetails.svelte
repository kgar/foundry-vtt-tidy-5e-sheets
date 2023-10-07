<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemMountable from './ItemMountable.svelte';
  import ItemActivation from './ItemActivation.svelte';
  import ItemAction from './ItemAction.svelte';
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import Select from 'src/components/form/Select.svelte';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

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
    value={$store.system.armor.type}
    field="system.armor.type"
    document={$store.item}
    disabled={!$store.owner}
    >
    <option value="" />
    <optgroup label={localize('DND5E.Armor')}>
      <SelectOptions data={$store.config.armorTypes} />
    </optgroup>
    <SelectOptions data={$store.config.miscEquipmentTypes} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  field="system.baseItem"
  labelText={localize('DND5E.ItemEquipmentBase')}
  let:inputId
>
  <Select
    id={inputId}
    value={$store.system.baseItem}
    field="system.baseItem"
    document={$store.item}
    disabled={!$store.owner}
    >
    <SelectOptions data={$store.baseItems} blank="" />
  </Select>
</ItemFormGroup>

{#if !$store.system.isMountable}
  <ItemFormGroup
    field="system.attunement"
    labelText={localize('DND5E.Attunement')}
    let:inputId
  >
    <Select
      id={inputId}
      value={$store.system.attunement?.toString() ?? ''}
      dtype="Number"
      field="system.attunement"
      document={$store.item}
      disabled={!$store.owner}
      >
      <SelectOptions data={$store.config.attunements} />
    </Select>
  </ItemFormGroup>
{/if}

<ItemFormGroup labelText={localize('DND5E.Proficiency')}>
  <Select
    document={$store.item}
    field="system.proficient"
    value={$store.system.proficient}
    dtype="Number"
    disabled={!$store.owner}
    >
    <SelectOptions
      data={$store.config.weaponAndArmorProficiencyLevels}
      blank={localize('DND5E.Automatic')}
    />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ItemEquipmentStatus')}
>
  <Checkbox
    checked={$store.system.equipped}
    labelCssClass="checkbox"
    field="system.equipped"
    document={$store.item}
    disabled={!$store.owner}
    >
    {localize('DND5E.Equipped')}
  </Checkbox>

  <Checkbox
    checked={$store.system.identified}
    labelCssClass="checkbox"
    field="system.identified"
    document={$store.item}
    disabled={!$store.owner}
    >
    {localize('DND5E.Identified')}
  </Checkbox>
</ItemFormGroup>

{#if $store.system.isArmor || $store.system.isMountable}
  <ItemFormGroup
    labelText={localize('DND5E.ArmorClass')}
    field="system.armor.value"
    let:inputId
  >
    <NumberInput
      id={inputId}
      value={$store.system.armor.value}
      step="1"
      field="system.armor.value"
      document={$store.item}
      disabled={!$store.owner}
      />
  </ItemFormGroup>
{/if}

{#if $store.hasDexModifier}
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
      document={$store.item}
      value={$store.system.armor.dex}
      disabled={!$store.owner}
      />
  </ItemFormGroup>
{/if}

{#if $store.system.isArmor}
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
      document={$store.item}
      value={$store.system.strength}
      disabled={!$store.owner}
      />
  </ItemFormGroup>

  <ItemFormGroup
    field="system.stealth"
    labelText={localize('DND5E.ItemEquipmentStealthDisav')}
    let:inputId
  >
    <Checkbox
      id={inputId}
      field="system.stealth"
      document={$store.item}
      checked={$store.system.stealth}
      disabled={!$store.owner}
      />
  </ItemFormGroup>
{/if}

{#if $store.system.isMountable}
  <ItemMountable />
  <ItemFormGroup labelText={localize('DND5E.Speed')}>
    <div class="form-fields">
      <NumberInput
        placeholder="0"
        value={$store.system.speed.value}
        field="system.speed.value"
        document={$store.item}
        disabled={!$store.owner}
        />
      <span class="sep">{localize('DND5E.FeetAbbr')}</span>
      <TextInput
        field="system.speed.conditions"
        document={$store.item}
        value={$store.system.speed.conditions}
        disabled={!$store.owner}
        />
    </div>
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.ItemEquipmentUsage')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.ItemEquipmentAction')}</h3>

<ItemAction />
