<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemMountable from './ItemMountable.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemActivation from './ItemActivation.svelte';
  import ItemAction from './ItemAction.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

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
    document={$context.item}
    field="system.weaponType"
    value={$context.system.weaponType}
    disabled={!$context.owner}
    >
    <SelectOptions data={$context.config.weaponTypes} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemWeaponBase')}
  field="system.baseItem"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.baseItem"
    value={$context.system.baseItem}
    disabled={!$context.owner}
    >
    <SelectOptions data={$context.baseItems} blank="" />
  </Select>
</ItemFormGroup>

{#if !$context.system.isMountable}
  <ItemFormGroup
    labelText={localize('DND5E.Attunement')}
    field="system.attunement"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.attunement"
      value={$context.system.attunement}
      disabled={!$context.owner}
      >
      <SelectOptions data={$context.config.attunements} />
    </Select>
  </ItemFormGroup>

  <ItemFormGroup labelText={localize('DND5E.Proficiency')}>
    <Select
      document={$context.item}
      field="system.proficient"
      value={$context.system.proficient}
      disabled={!$context.owner}
      >
      <SelectOptions
        data={$context.config.weaponAndArmorProficiencyLevels}
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
        document={$context.item}
        field="system.equipped"
        checked={$context.system.equipped}
        disabled={!$context.owner}
        >
        {localize('DND5E.Equipped')}</Checkbox
      >

      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="system.identified"
        checked={$context.system.identified}
        disabled={!$context.owner}
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
  {#each Object.entries($context.config.weaponProperties) as [prop, name]}
    {@const checked = $context.system.properties[prop]}
    <Checkbox
      labelCssClass="checkbox"
      document={$context.item}
      field="system.properties.{prop}"
      {checked}
      disabled={!$context.owner}
      >
      {name}
    </Checkbox>
  {/each}
</ItemFormGroup>

{#if $context.system.isMountable}
  <ItemFormGroup
    labelText={localize('DND5E.ArmorClass')}
    field="system.armor.value"
    let:inputId
  >
    <div class="form-fields">
      <NumberInput
        id={inputId}
        document={$context.item}
        field="system.armor.value"
        value={$context.system.armor.value}
        disabled={!$context.owner}
        />
    </div>
  </ItemFormGroup>

  <ItemMountable />
{/if}

<h3 class="form-header">{localize('DND5E.ItemWeaponUsage')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.ItemWeaponAttack')}</h3>

<ItemAction />
