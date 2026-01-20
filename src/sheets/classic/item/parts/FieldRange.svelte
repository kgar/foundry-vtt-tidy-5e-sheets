<script lang="ts">
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<!-- Range -->
<div class="form-group split-group">
  <label for="{appId}-range-units">{localize('DND5E.Range')}</label>
  <div class="form-fields">
    <!-- Value -->
    {#if context.system.range.scalar}
      <div class="form-group label-top">
        <label for="{appId}-range-value">{localize('DND5E.Value')}</label>
        <TextInput
          id="{appId}-range-value"
          document={context.item}
          field="system.range.value"
          value={context.source.range.value}
          disabled={!context.editable}
        />
      </div>
    {/if}

    <!-- Units -->
    <div class="form-group label-top">
      <label for="{appId}-range-units">{localize('DND5E.MOVEMENT.FIELDS.units.label')}</label>
      <Select
        id="{appId}-range-units"
        document={context.item}
        field="system.range.units"
        value={context.source.range.units}
        disabled={!context.editable}
      >
        <SelectOptions
          data={context.rangeTypes}
          labelProp="label"
          valueProp="value"
        />
      </Select>
    </div>
  </div>

  <!-- Condition -->
  <TextInput
    id="{appId}-range-special"
    document={context.item}
    field="system.range.special"
    value={context.source.range.special}
    class="full-width"
    placeholder={localize('DND5E.RANGE.FIELDS.range.special.label')}
    disabled={!context.editable}
  />
</div>
