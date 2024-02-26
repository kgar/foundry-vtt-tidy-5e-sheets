<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemMountable from '../parts/ItemMountable.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemActivation from '../parts/ItemActivation.svelte';
  import ItemAction from '../parts/ItemAction.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemWeaponDetails')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.ItemWeaponType')}
  field="system.type.value"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.type.value"
    value={$context.system.type.value}
    disabled={!$context.editable}
  >
    <SelectOptions data={$context.config.weaponTypes} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ItemWeaponBase')}
  field="system.type.baseItem"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.type.baseItem"
    value={$context.system.type.baseItem}
    disabled={!$context.editable}
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
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.attunements} />
    </Select>
  </ItemFormGroup>

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
{/if}

<ItemFormGroup
  cssClass="stacked weapon-properties"
  labelText={localize('DND5E.ItemWeaponProperties')}
>
  <ItemProperties />
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
        disabled={!$context.editable}
      />
    </div>
  </ItemFormGroup>

  <ItemMountable />
{/if}

<h3 class="form-header">{localize('DND5E.ItemWeaponUsage')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.ItemWeaponAttack')}</h3>

<ItemAction />
