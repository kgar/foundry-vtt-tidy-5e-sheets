<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemActivation from '../parts/ItemActivation.svelte';
  import ItemAction from '../parts/ItemAction.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');
  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemConsumableDetails')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.ItemConsumableType')}
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
    <SelectOptions data={$context.config.consumableTypes} labelProp="label" />
  </Select>
</ItemFormGroup>
{#if $context.itemSubtypes}
  {@const consumableSubTypeLabel = localize('DND5E.ItemConsumableSubtype', {
    category:
      $context.config.consumableTypes[$context.system.type.value]?.label,
  })}

  <ItemFormGroup
    labelText={consumableSubTypeLabel}
    field="system.type.subtype"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.subtype"
      value={$context.system.type.subtype}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.itemSubtypes} blank="" />
    </Select>
  </ItemFormGroup>
{/if}

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

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ItemConsumableStatus')}
>
  <Checkbox
    labelCssClass="checkbox"
    document={$context.item}
    field="system.equipped"
    checked={$context.system.equipped}
    disabled={!$context.editable}
  >
    {localize('DND5E.Equipped')}
  </Checkbox>

  <Checkbox
    labelCssClass="checkbox"
    document={$context.item}
    field="system.identified"
    checked={$context.system.identified}
    disabled={!$context.editable}
  >
    {localize('DND5E.Identified')}
  </Checkbox>
</ItemFormGroup>

{#if $context.system.consumableType === 'ammo'}
  <ItemFormGroup
    cssClass="stacked weapon-properties"
    labelText={localize('DND5E.ItemAmmoProperties')}
  >
    {#each Object.entries($context.config.physicalWeaponProperties) as [prop, name]}
      {@const checked = $context.system.properties[prop]}
      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="system.properties.{prop}"
        {checked}
        disabled={!$context.editable}
      >
        {name}
      </Checkbox>
    {/each}
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.ItemConsumableUsage')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.ItemConsumableActivation')}</h3>

<ItemAction />
