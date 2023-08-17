<script lang="ts">
  import TextInput from 'src/components/form/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext, VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="profile-thresholds">
  <TextInput
    document={$store.actor}
    field="system.attributes.hp.dt"
    cssClass="damage-threshold"
    placeholder={localize('DND5E.Threshold')}
    value={$store.system.attributes.hp.dt || null}
    dtype="Number"
    allowDeltaChanges={true}
    maxlength={5}
    title={localize('DND5E.DamageThreshold')}
  />
  <TextInput
    document={$store.actor}
    field="system.attributes.hp.mt"
    cssClass="mishap-threshold"
    placeholder={localize('DND5E.VehicleMishap')}
    value={$store.system.attributes.hp.mt || null}
    dtype="Number"
    allowDeltaChanges={true}
    maxlength={5}
    title={localize('DND5E.VehicleMishapThreshold')}
  />
</div>

<style lang="scss">
  .profile-thresholds {
    display: flex;
    justify-content: center;

    :global(input) {
      flex: 0 0 4.6875rem; // Or hard width
      display: flex;
      font-size: 0.75rem;
      line-height: 0.75rem;
      height: 0.875rem;
      padding: 0.0625rem 0;
    }

    :global(input.damage-threshold),
    :global(input.mishap-threshold) {
      text-align: center;
    }
  }
</style>
