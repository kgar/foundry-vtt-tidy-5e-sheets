<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
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
<div class="form-group">
  <label for="{appId}-armor-value">{localize('DND5E.ArmorClass')}</label>
  <NumberInput
    id="{appId}-armor-value"
    document={$context.item}
    field="system.armor.value"
    value={$context.source.armor.value}
    disabled={!$context.editable}
    step="1"
  />
</div>

<!-- Hit Points -->
<div class="form-group split-group">
  <label for="{appId}-hp-value">{localize('DND5E.HitPoints')}</label>
  <div class="form-fields">
    <!-- Current -->
    <div class="form-group label-top">
      <label for="{appId}-hp-value">{localize('DND5E.Current')}</label>
      <NumberInput
        id="{appId}-hp-value"
        document={$context.item}
        field="system.hp.value"
        value={$context.source.hp.value}
        disabled={!$context.editable}
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
        value={$context.source.hp.max}
        disabled={!$context.editable}
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
        value={$context.source.hp.dt}
        disabled={!$context.editable}
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
    disabled={!$context.editable}
  />
</div>

<!-- Speed -->
{#if $context.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
  <div class="form-group split-group">
    <label for="{appId}-speed-value">{localize('DND5E.Speed')}</label>
    <div class="form-fields">
      <!-- Value -->
      <div class="form-group label-top">
        <label for="{appId}-speed-value">
          {localize('DND5E.Value')}
        </label>
        <NumberInput
          id="{appId}-speed-value"
          document={$context.item}
          field="system.speed.value"
          value={$context.item.system.speed.value}
          min="0"
          placeholder="0"
          disabled={!$context.editable}
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
      disabled={!$context.editable}
    />
  </div>
{/if}
