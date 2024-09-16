<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  
  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<!-- Range -->
<div class="form-group split-group">
  <label for="{appId}-range-units">{localize('DND5E.Range')}</label>
  <div class="form-fields">
    <!-- Value -->
    {#if $context.system.range.scalar}
      <div class="form-group label-top">
        <label for="{appId}-range-value">{localize('DND5E.Value')}</label>
        <TextInput
          id="{appId}-range-value"
          document={$context.item}
          field="system.range.value"
          value={$context.source.range.value}
        />
      </div>
    {/if}

    <!-- Units -->
    <div class="form-group label-top">
      <label for="{appId}-range-units">{localize('DND5E.MovementUnits')}</label>
      <Select
        id="{appId}-range-units"
        document={$context.item}
        field="system.range.units"
        value={$context.source.range.units}
      >
        <SelectOptions
          data={$context.rangeTypes}
          labelProp="label"
          valueProp="value"
        />
      </Select>
    </div>
  </div>

  <!-- Condition -->
  <TextInput
    id="{appId}-range-special"
    document={$context.item}
    field="system.range.special"
    value={$context.source.range.special}
    class="full-width"
    placeholder={localize('DND5E.RANGE.FIELDS.range.special.label')}
  />
</div>
