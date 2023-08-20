<script lang="ts">
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import { quadInOut } from 'svelte/easing';
  import type { Readable } from 'svelte/store';
  import { slide } from 'svelte/transition';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="counters counter-flex">
  <div class="counter creature-cap">
    <h4>{localize('DND5E.VehicleCreatureCapacity')}</h4>
    <div class="counter-value">
      <ContentEditableFormField
        element="div"
        document={$store.actor}
        field="system.attributes.capacity.creature"
        editable={$store.owner}
        placeholder="&mdash;"
        value={$store.system.attributes.capacity.creature}
        dataMaxLength={1000}
      />
    </div>
  </div>
  <HorizontalLineSeparator />
  <div class="counter cargo-cap">
    <h4 class="flex-1">{localize('DND5E.VehicleCargoCapacity')}</h4>
    <div class="counter-value">
      <NumberInput
        document={$store.actor}
        field="system.attributes.capacity.cargo"
        value={$store.system.attributes.capacity.cargo}
        min="0"
        placeholder="0"
      />
    </div>
  </div>
  <HorizontalLineSeparator />
  <div class="counter stations">
    <div class="counter-value">
      <Checkbox
        document={$store.actor}
        field="system.attributes.actions.stations"
        dtype="Boolean"
        checked={$store.system.attributes.actions.stations}
        labelCssClass="action-stations-label"
      >
        <span>{localize('DND5E.VehicleActionStations')}</span>
      </Checkbox>
    </div>
  </div>
  {#if !$store.system.attributes.actions.stations}
    <div
      class="counter-flex"
      transition:slide|global={{ duration: 200, easing: quadInOut }}
    >
      <HorizontalLineSeparator />
      <div class="counter actions">
        <h4>{localize('DND5E.ActionPl')}</h4>
        <div class="counter-value">
          <NumberInput
            document={$store.actor}
            field="system.attributes.actions.value"
            value={$store.system.attributes.actions.value}
            step="1"
            min="0"
            placeholder="0"
            title={localize('DND5E.VehicleActionsHint')}
          />
        </div>
      </div>
      <HorizontalLineSeparator />
      <div class="counter action-thresholds">
        <h4>{localize('DND5E.VehicleActionThresholds')}</h4>
        <div class="counter-value">
          <span class="sep">&lt;</span>

          <NumberInput
            document={$store.actor}
            field="system.attributes.actions.thresholds.2"
            value={$store.system.attributes.actions.thresholds['2']}
            min="0"
            step="1"
            placeholder="&mdash;"
            title={localize('DND5E.VehicleActionThresholdsFull')}
            selectOnFocus={true}
          />

          <span class="sep">&lt;</span>
          <NumberInput
            document={$store.actor}
            field="system.attributes.actions.thresholds.1"
            value={$store.system.attributes.actions.thresholds['1']}
            min="0"
            step="1"
            placeholder="&mdash;"
            title={localize('DND5E.VehicleActionThresholdsMid')}
            selectOnFocus={true}
          />

          <span class="sep">&lt;</span>
          <NumberInput
            document={$store.actor}
            field="system.attributes.actions.thresholds.0"
            value={$store.system.attributes.actions.thresholds['0']}
            min="0"
            step="1"
            placeholder="&mdash;"
            title={localize('DND5E.VehicleActionThresholdsMin')}
            selectOnFocus={true}
          />
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .counter-flex {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .counters {
    background: var(--t5e-faint-color);
    border-radius: 5px;
    padding: 4px 8px;
    font-size: 12px;

    .counter-value :global(input[type='number']) {
      height: 1.25rem;
    }

    .stations .counter-value :global(.action-stations-label) {
      display: flex;
      align-items: center;
    }

    .stations .counter-value :global(.action-stations-label input) {
      margin-left: 0;
    }

    .action-thresholds .counter-value {
      display: flex;
      align-items: center;

      :global(input) {
        width: 32px;
        text-align: center;
      }
    }
  }
</style>
