<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<!-- Duration -->
<div class="form-group split-group">
  <label for="{appId}-duration-units">{localize('DND5E.Duration')}</label>
  <div class="form-fields">
    <!-- Amount -->
    {#if context.system.duration.scalar}
      <div class="form-group label-top">
        <label for="{appId}-duration-value">{localize('DND5E.Amount')}</label>
        <div class="form-fields">
          <TextInputQuadrone
            id="{appId}-duration-value"
            document={context.item}
            field="system.duration.value"
            value={context.source.duration.value}
            placeholder="—"
            disabled={!context.editable}
          />
        </div>
      </div>
    {/if}

    <!-- Time -->
    <div class="form-group label-top">
      <label for="{appId}-duration-units"
        >{localize('DND5E.DurationTime')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-duration-units"
          document={context.item}
          field="system.duration.units"
          value={context.source.duration.units}
          disabled={!context.editable}
        >
          <SelectOptions
            data={context.durationUnits}
            labelProp="label"
            valueProp="value"
          />
        </SelectQuadrone>
      </div>
    </div>
  </div>

  <!-- Conditions -->
  {#if context.system.duration.units === 'spec'}
    <TextInputQuadrone
      id="{appId}-duration-special"
      document={context.item}
      field="system.duration.special"
      value={context.source.duration.special}
      placeholder={localize('DND5E.DURATION.FIELDS.duration.special.label')}
      class="full-width"
      disabled={!context.editable}
    />
  {/if}
</div>
