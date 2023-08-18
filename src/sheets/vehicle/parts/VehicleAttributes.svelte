<script lang="ts">
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="counters">
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
        labelCssClass="checkbox"
      >
        {localize('DND5E.VehicleActionStations')}</Checkbox
      >
    </div>
  </div>
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
      />
    </div>
  </div>
</div>

<style lang="scss">
</style>
