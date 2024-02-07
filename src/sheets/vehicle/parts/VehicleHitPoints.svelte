<script lang="ts">
  import HpBar from 'src/components/bar/HpBar.svelte';
  import ResourceWithBar from 'src/components/bar/ResourceWithBar.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  let context = getContext<Readable<VehicleSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div class="portrait-hp" title={localize('DND5E.HitPoints')}>
  <ResourceWithBar
    document={$context.actor}
    value={$context.system.attributes.hp.value}
    valueField="system.attributes.hp.value"
    valueTitle={localize('DND5E.HitPointsCurrent')}
    valueDisabled={!$context.editable}
    max={$context.system.attributes.hp.max}
    maxField="system.attributes.hp.max"
    maxTitle={localize('DND5E.HitPointsMax')}
    maxDisabled={!$context.editable ||
      $context.lockHpMaxChanges ||
      $context.lockSensitiveFields}
    percentage={$context.healthPercentage}
    Bar={$settingStore.useHpBarVehicle ? HpBar : null}
  />
</div>

<style lang="scss">
  .portrait-hp {
    position: absolute;
    width: 8.5rem;
    left: 50%;
    height: 1.25rem;
    font-size: 1.125rem;
    transform: translateX(-50%);
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: var(--t5e-title-font-family);

    :global(.resource-value),
    :global(.resource-max) {
      font-weight: 700;
    }
  }
</style>
