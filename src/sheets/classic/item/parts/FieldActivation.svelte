<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.document.id;

  const localize = FoundryAdapter.localize;
</script>

<div class="form-group split-group">
  <label for="{appId}-activation-value">{localize('DND5E.SpellCastTime')}</label
  >

  <div class="form-fields">
    <!-- Amount -->
    {#if $context.system.activation.scalar}
      <div class="form-group label-top">
        <label for="{appId}-activation-value">
          {localize('DND5E.Amount')}
        </label>
        <NumberInput
          id="{appId}-activation-value"
          document={$context.item}
          field="system.activation.value"
          value={$context.source.activation.value}
          placeholder="—"
          min="0"
          disabled={!$context.editable}
        />
      </div>
    {/if}

    <!-- Type -->
    <div class="form-group label-top">
      <label for="{appId}-activation-type">
        {localize('DND5E.Cost')}
      </label>
      <Select
        id="{appId}-activation-type"
        document={$context.item}
        field="system.activation.type"
        value={$context.source.activation.type}
        disabled={!$context.editable}
      >
        <SelectOptions
          data={$context.activationTypes}
          labelProp="label"
          valueProp="value"
        />
      </Select>
    </div>
  </div>

  <!-- Condition -->
  <TextInput
    id="{appId}-activation-condition"
    document={$context.item}
    field="system.activation.condition"
    value={$context.source.activation.condition}
    placeholder={localize('DND5E.ItemActivationCondition')}
    class="full-width"
    disabled={!$context.editable}
  />
</div>
