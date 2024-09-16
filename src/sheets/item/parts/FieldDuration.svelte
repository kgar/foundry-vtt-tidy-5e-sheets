<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import Select from 'src/components/inputs/Select.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import ItemActivation from '../parts/ItemActivation.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemAction from '../parts/ItemAction.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import FieldTargets from '../parts/FieldTargets.svelte';
  import FieldActivation from '../parts/FieldActivation.svelte';
  import FieldRange from '../parts/FieldRange.svelte';
  import FieldDuration from '../parts/FieldDuration.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<!-- Duration -->
<div class="form-group split-group">
  <label for="{appId}-duration-units">{localize('DND5E.Duration')}</label>
  <div class="form-fields">
    <!-- Amount -->
    {#if $context.system.duration.scalar}
      <div class="form-group label-top">
        <label for="{appId}-duration-value">{localize('DND5E.Amount')}</label>
        <TextInput
          id="{appId}-duration-value"
          document={$context.item}
          field="system.duration.value"
        />
      </div>
      <!-- { formField 
          fields.value
          value=data.value
          label="DND5E.Amount"
          localize=true hint=false
          placeholder="—"
          classes="label-top" } -->
    {/if}

    <!-- Time -->
    <!-- { formField 
          fields.units
          value=data.units
          label="DND5E.DurationTime"
          localize=true hint=false
          options=durationUnits 
          classes="label-top" } -->
  </div>

  <!-- Conditions -->
  {#if $context.system.duration.units === 'spec'}
    <!-- { formInput 
      fields.special
       value=data.special 
       input=inputs.createTextInput 
       classes="full-width"    
       placeholder=(localize "DND5E.DURATION.FIELDS.duration.special.label") } -->
  {/if}
</div>
