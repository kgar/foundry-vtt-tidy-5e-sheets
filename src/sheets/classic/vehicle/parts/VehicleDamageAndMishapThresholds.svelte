<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getVehicleSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="profile-thresholds">
  <TextInput
    document={context.actor}
    field="system.attributes.hp.dt"
    class="damage-threshold"
    placeholder={localize('DND5E.Threshold')}
    value={context.system.attributes.hp.dt?.toString() ?? ''}
    allowDeltaChanges={true}
    maxlength={5}
    title={localize('DND5E.DamageThreshold')}
    disabled={!context.editable || context.lockSensitiveFields}
  />
  <TextInput
    document={context.actor}
    field="system.attributes.hp.mt"
    class="mishap-threshold"
    placeholder={localize('DND5E.VehicleMishap')}
    value={context.system.attributes.hp.mt?.toString() ?? ''}
    allowDeltaChanges={true}
    maxlength={5}
    title={localize('DND5E.VehicleMishapThreshold')}
    disabled={!context.editable || context.lockSensitiveFields}
  />
</div>

<style lang="less">
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
