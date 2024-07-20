<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let appId = getContext<Readable<string>>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  const localize = FoundryAdapter.localize;
</script>

<div class="form-group">
  <label for="{$appId}-system.hp.value">{localize('DND5E.HitPoints')}</label>
  <div class="form-fields">
    <NumberInput
      id="{$appId}-system.hp.value"
      document={$context.item}
      field="system.hp.value"
      value={$context.item.system.hp.value}
      placeholder="0"
    />
    <span class="sep">&sol;</span>
    <NumberInput
      id="{$appId}-system.hp.max"
      document={$context.item}
      field="system.hp.max"
      value={$context.item.system.hp.max}
      placeholder="0"
    />
    <NumberInput
      document={$context.item}
      field="system.hp.dt"
      id="{$appId}-system.hp.dt"
      placeholder={localize('DND5E.Threshold')}
      value={$context.item.system.hp.dt}
    />
  </div>
</div>

<div class="form-group">
  <label for="{$appId}-system.hp.conditions"
    >{localize('DND5E.HealthConditions')}</label
  >
  <div class="form-fields">
    <TextInput
      id="{$appId}-system.hp.conditions"
      document={$context.item}
      field="system.hp.conditions"
      value={$context.item.system.hp.conditions}
    />
  </div>
</div>
