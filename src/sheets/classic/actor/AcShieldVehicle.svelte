<script lang="ts">
  import AcShieldBase from './AcShieldBase.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getVehicleSheetContext());

  interface Props {
    /**
     * Optional CSS class list string to apply to the AC Shield container element.
     */
    cssClass?: string;
  }

  let { cssClass = '' }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div class="vehicle-armor-class-wrapper">
  <AcShieldBase cssClass="{cssClass} vehicle-ac-shield">
    <NumberInput
      document={context.actor}
      field="system.attributes.ac.flat"
      value={context.actor.system.attributes.ac.flat}
      step="1"
      min="0"
      placeholder="—"
      title={localize('DND5E.ArmorClass')}
      cssClass="armor-class-flat"
      selectOnFocus={true}
      disabled={!context.editable || context.lockSensitiveFields}
    />
    <TextInput
      document={context.actor}
      field="system.attributes.ac.motionless"
      value={context.system.attributes.ac.motionless}
      placeholder="—"
      title={localize('DND5E.ArmorClassMotionless')}
      class="armor-class-motionless"
      selectOnFocus={true}
      disabled={!context.editable || context.lockSensitiveFields}
    />
  </AcShieldBase>
</div>

<style lang="less">
  .vehicle-armor-class-wrapper {
    display: flex;

    :global(.armor-class-flat) {
      flex: 3;
      font-family: var(--t5e-title-font-family);
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2.1875rem;
      height: 2.5rem;
      font-weight: 700;
      margin: 0 auto;
      width: 3.75rem;
      text-align: center;
    }

    :global(.armor-class-motionless) {
      position: absolute;
      bottom: 0.375rem;
      left: 0;
      width: 100%;
      font-size: 0.75rem;
      line-height: 0.875rem;
      height: 0.875rem;
      padding: 0.0625rem 0;
      text-align: center;
    }
  }
</style>
