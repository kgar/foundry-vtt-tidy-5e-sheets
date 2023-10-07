<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import ItemMountable from './ItemMountable.svelte';
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemActivation from './ItemActivation.svelte';
  import ItemAction from './ItemAction.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Select from 'src/components/form/Select.svelte';
  import Checkbox from 'src/components/form/Checkbox.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemWeaponDetails')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.ItemWeaponType')}
  field="system.weaponType"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.weaponType"
    value={$store.system.weaponType}
    disabled={!$store.owner}
    >
    <SelectOptions data={$store.config.weaponTypes} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemWeaponBase')}
  field="system.baseItem"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.baseItem"
    value={$store.system.baseItem}
    disabled={!$store.owner}
    >
    <SelectOptions data={$store.baseItems} blank="" />
  </Select>
</ItemFormGroup>

{#if !$store.system.isMountable}
  <ItemFormGroup
    labelText={localize('DND5E.Attunement')}
    field="system.attunement"
    let:inputId
  >
    <Select
      id={inputId}
      document={$store.item}
      field="system.attunement"
      dtype="Number"
      value={$store.system.attunement}
      disabled={!$store.owner}
      >
      <SelectOptions data={$store.config.attunements} />
    </Select>
  </ItemFormGroup>

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
    labelText={localize('DND5E.ItemWeaponStatus')}
  >
    <div class="form-fields">
      <Checkbox
        labelCssClass="checkbox"
        document={$store.item}
        field="system.equipped"
        checked={$store.system.equipped}
        disabled={!$store.owner}
        >
        {localize('DND5E.Equipped')}</Checkbox
      >

      <Checkbox
        labelCssClass="checkbox"
        document={$store.item}
        field="system.identified"
        checked={$store.system.identified}
        disabled={!$store.owner}
        >
        {localize('DND5E.Identified')}
      </Checkbox>
    </div>
  </ItemFormGroup>
{/if}

<ItemFormGroup
  cssClass="stacked weapon-properties"
  labelText={localize('DND5E.ItemWeaponProperties')}
>
  {#each Object.entries($store.config.weaponProperties) as [prop, name]}
    {@const checked = $store.system.properties[prop]}
    <Checkbox
      labelCssClass="checkbox"
      document={$store.item}
      field="system.properties.{prop}"
      {checked}
      disabled={!$store.owner}
      >
      {name}
    </Checkbox>
  {/each}
</ItemFormGroup>

{#if $store.system.isMountable}
  <ItemFormGroup
    labelText={localize('DND5E.ArmorClass')}
    field="system.armor.value"
    let:inputId
  >
    <div class="form-fields">
      <NumberInput
        id={inputId}
        document={$store.item}
        field="system.armor.value"
        value={$store.system.armor.value}
        disabled={!$store.owner}
        />
    </div>
  </ItemFormGroup>

  <ItemMountable />
{/if}

<h3 class="form-header">{localize('DND5E.ItemWeaponUsage')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.ItemWeaponAttack')}</h3>

<ItemAction />
