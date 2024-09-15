<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">
  {#if $context.item.type === CONSTANTS.ITEM_TYPE_WEAPON}
    {localize('DND5E.ItemSiegeProperties')}
  {:else if $context.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
    {localize('DND5E.ItemVehicleProperties')}
  {/if}
</h3>

<!-- Armor Class -->
<ItemFormGroup
  field="system.armor.value"
  labelText={localize('DND5E.ArmorClass')}
  let:inputId
>
  <NumberInput
    id={inputId}
    document={$context.item}
    field="system.armor.value"
    value={$context.system.armor.value}
    step="1"
  />
</ItemFormGroup>

<!-- Hit Points -->
<ItemFormGroup
  cssClass="split-group"
  labelText={localize('DND5E.HitPoints')}
  field="system.hp.value"
  let:inputId
>
  <div class="form-fields">
    <!-- Current -->
    <div class="form-group label-top">
      <label for="{appId}-hp-value">{localize('DND5E.Current')}</label>
      <NumberInput
        id={inputId}
        document={$context.item}
        field="system.hp.value"
        value={$context.system.hp.value}
        placeholder="0"
        min="0"
      />
    </div>

    <!-- Max -->
    <div class="form-group label-top">
      <label for="{appId}-hp-max">{localize('DND5E.Max')}</label>
      <NumberInput
        id="{appId}-hp-max"
        document={$context.item}
        field="system.hp.max"
        value={$context.system.hp.max}
        placeholder="0"
        min="0"
      />
    </div>

    <!-- Threshold -->
    <div class="form-group label-top">
      <label for="{appId}-hp-dt">{localize('DND5E.Threshold')}</label>
      <NumberInput
        id="{appId}-hp-dt"
        document={$context.item}
        field="system.hp.dt"
        value={$context.system.hp.dt}
        placeholder="—"
        min="0"
      />
    </div>
  </div>
  <!-- Conditions -->
  <TextInput
    id="{appId}-hp-conditions"
    document={$context.item}
    field="system.hp.conditions"
    value={$context.item.system.hp.conditions}
    placeholder={localize('DND5E.HealthConditions')}
    class="full-width"
  />
</ItemFormGroup>

<!-- Speed -->
{#if $context.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
  <ItemFormGroup
    cssClass="split-group"
    labelText={localize('DND5E.Speed')}
    field="system.speed.value"
    let:inputId
  >
    <div class="form-fields">
      <!-- Value -->
      <div class="form-group label-top">
        <label for={inputId}>
          {localize('DND5E.Value')}
        </label>
        <NumberInput
          id={inputId}
          document={$context.item}
          field="system.speed.value"
          value={$context.item.system.speed.value}
          min="0"
          placeholder="0"
        />
      </div>
    </div>
    <!-- Conditions -->
    <TextInput
      id="{appId}-speed-conditions"
      document={$context.item}
      field="system.speed.conditions"
      value={$context.item.system.speed.conditions}
      placeholder={localize('DND5E.SpeedConditions')}
      class="full-width"
    />
  </ItemFormGroup>
{/if}
