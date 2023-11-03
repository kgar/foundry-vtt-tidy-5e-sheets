<script lang="ts">
  import AcShieldBase from './AcShieldBase.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { VehicleSheetContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  /**
   * Optional CSS class list string to apply to the AC Shield container element.
   */
  export let cssClass: string = '';

  const localize = FoundryAdapter.localize;
</script>

<div class="vehicle-armor-class-wrapper">
  <AcShieldBase cssClass="{cssClass} vehicle-ac-shield">
    <NumberInput
      document={$context.actor}
      field="system.attributes.ac.flat"
      value={$context.actor.system.attributes.ac.flat}
      step="1"
      min="0"
      placeholder="&mdash;"
      title={localize('DND5E.ArmorClass')}
      cssClass="armor-class-flat"
      selectOnFocus={true}
      disabled={!$context.owner || $context.lockSensitiveFields}
    />
    <TextInput
      document={$context.actor}
      field="system.attributes.ac.motionless"
      value={$context.system.attributes.ac.motionless}
      placeholder="&mdash;"
      title={localize('DND5E.ArmorClassMotionless')}
      cssClass="armor-class-motionless"
      selectOnFocus={true}
      disabled={!$context.owner || $context.lockSensitiveFields}
    />
  </AcShieldBase>
</div>

<style lang="scss">
  .vehicle-armor-class-wrapper {
    display: flex;

    :global(.armor-class-flat) {
      flex: 3;
      font-family: var(--t5ek-title-font-family);
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 35px;
      height: 40px;
      font-weight: 700;
      margin: 0 auto;
      width: 60px;
      text-align: center;
    }

    :global(.armor-class-motionless) {
      position: absolute;
      bottom: 6px;
      left: 0;
      width: 100%;
      font-size: 12px;
      line-height: 14px;
      height: 14px;
      padding: 1px 0;
      text-align: center;
    }
  }
</style>
