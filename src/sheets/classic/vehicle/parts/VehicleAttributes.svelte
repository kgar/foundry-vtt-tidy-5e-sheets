<script lang="ts">
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { quadInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';

  let context = $derived(getVehicleSheetContext());

  const localize = FoundryAdapter.localize;
  let totalCrew = $derived(
    context.system.cargo.crew.reduce(
      (count: number, c: { quantity: number }) => count + c.quantity,
      0,
    ),
  );
  let totalActions = $derived(context.system.attributes.actions.value ?? 0);
  let actionsPerTurn = $derived(
    totalCrew >= context.system.attributes.actions.thresholds[2]
      ? totalActions
      : totalCrew >= context.system.attributes.actions.thresholds[1]
        ? Math.max(totalActions - 1, 0)
        : totalCrew >= context.system.attributes.actions.thresholds[0]
          ? Math.max(totalActions - 2, 0)
          : 0,
  );
  let crewTallyDescription = $derived(
    actionsPerTurn === totalActions
      ? localize('DND5E.VehicleActionThresholdsFull')
      : actionsPerTurn === totalActions - 1
        ? localize('DND5E.VehicleActionThresholdsMid')
        : actionsPerTurn === totalActions - 2
          ? localize('DND5E.VehicleActionThresholdsMin')
          : null,
  );
</script>

<div class="counters counter-flex">
  <div class="counter vehicle-weight">
    <h4>
      {localize('DND5E.Weight')}
    </h4>
    <div class="counter-value flexrow">
      <NumberInput
        document={context.actor}
        field="system.traits.weight.value"
        value={context.system.traits.weight.value}
        min="0"
        selectOnFocus={true}
        disabled={!context.editable || context.lockSensitiveFields}
      />

      <Select
        document={context.actor}
        field="system.traits.weight.units"
        value={context.system.traits.weight.units}
        class="flex0"
      >
        <SelectOptions
          data={context.config.weightUnits}
          labelProp="abbreviation"
        />
      </Select>
    </div>
  </div>
  <HorizontalLineSeparator />

  <div class="counter vehicle-keel">
    <h4>
      {localize('DND5E.VEHICLE.FIELDS.traits.keel.value.label')}
    </h4>
    <div class="counter-value flexrow">
      <NumberInput
        document={context.actor}
        field="system.traits.keel.value"
        value={context.system.traits.keel.value}
        min="0"
        selectOnFocus={true}
        disabled={!context.editable || context.lockSensitiveFields}
      />

      <Select
        document={context.actor}
        field="system.traits.keel.units"
        value={context.system.traits.keel.units}
        class="flex0"
      >
        <SelectOptions
          data={context.config.movementUnits}
          labelProp="abbreviation"
        />
      </Select>
    </div>
  </div>
  <HorizontalLineSeparator />

  <div class="counter vehicle-beam">
    <h4>
      {localize('DND5E.VEHICLE.FIELDS.traits.beam.value.label')}
    </h4>
    <div class="counter-value flexrow">
      <NumberInput
        document={context.actor}
        field="system.traits.beam.value"
        value={context.system.traits.beam.value}
        min="0"
        selectOnFocus={true}
        disabled={!context.editable || context.lockSensitiveFields}
      />

      <Select
        document={context.actor}
        field="system.traits.beam.units"
        value={context.system.traits.beam.units}
        class="flex0"
      >
        <SelectOptions
          data={context.config.movementUnits}
          labelProp="abbreviation"
        />
      </Select>
    </div>
  </div>

  <HorizontalLineSeparator />
  <div class="counter cargo-cap">
    <h4 class="flex-1">
      {localize('DND5E.VEHICLE.FIELDS.attributes.capacity.cargo.value.label')}
    </h4>
    <div class="counter-value flexrow">
      <NumberInput
        document={context.actor}
        field="system.attributes.capacity.cargo.value"
        value={context.system.attributes.capacity.cargo.value}
        min="0"
        placeholder="0"
        selectOnFocus={true}
        disabled={!context.editable || context.lockSensitiveFields}
      />

      <Select
        document={context.actor}
        field="system.attributes.capacity.cargo.units"
        value={context.system.attributes.capacity.cargo.units}
        class="flex0"
      >
        <SelectOptions
          data={context.config.weightUnits}
          labelProp="abbreviation"
        />
      </Select>
    </div>
  </div>
  <HorizontalLineSeparator />

  <!-- Crew -->
  <div class="counter vehicle-crew">
    <h4>
      {localize('DND5E.VEHICLE.FIELDS.crew.max.label')}
    </h4>
    <div class="counter-value flexrow">
      <NumberInput
        document={context.actor}
        field="system.crew.max"
        value={context.system.crew.max}
        min="0"
        selectOnFocus={true}
        disabled={!context.editable || context.lockSensitiveFields}
      />
    </div>
  </div>

  <HorizontalLineSeparator />

  <!-- Passengers -->
  <div class="counter vehicle-passengers">
    <h4>
      {localize('DND5E.VEHICLE.FIELDS.passengers.max.label')}
    </h4>
    <div class="counter-value flexrow">
      <NumberInput
        document={context.actor}
        field="system.passengers.max"
        value={context.system.passengers.max}
        min="0"
        selectOnFocus={true}
        disabled={!context.editable || context.lockSensitiveFields}
      />
    </div>
  </div>

  <HorizontalLineSeparator />

  <div class="counter stations">
    <div class="counter-value">
      <Checkbox
        document={context.actor}
        field="system.attributes.actions.stations"
        checked={context.system.attributes.actions.stations}
        labelCssClass="action-stations-label"
        disabled={!context.editable || context.lockSensitiveFields}
      >
        <span class="action-stations-label"
          >{localize(
            'DND5E.VEHICLE.FIELDS.attributes.actions.stations.label',
          )}</span
        >
      </Checkbox>
    </div>
  </div>
  {#if !context.system.attributes.actions.stations}
    <div
      class="counter-flex"
      transition:slide={{ duration: 200, easing: quadInOut }}
    >
      <HorizontalLineSeparator />
      <div class="counter actions">
        <h4>{localize('DND5E.ActionPl')}</h4>
        <div class="counter-value">
          <NumberInput
            document={context.actor}
            field="system.attributes.actions.value"
            value={context.system.attributes.actions.value}
            step="1"
            min="0"
            placeholder="0"
            title={localize('DND5E.VehicleActionsHint')}
            selectOnFocus={true}
            disabled={!context.editable || context.lockSensitiveFields}
          />
        </div>
      </div>
      <HorizontalLineSeparator />
      <div class="counter action-thresholds">
        <h4>
          {localize('DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.label')}
        </h4>
        <div class="counter-value">
          <span class="sep">&lt;</span>

          <NumberInput
            document={context.actor}
            field="system.attributes.actions.thresholds.2"
            value={context.system.attributes.actions.thresholds['2']}
            min="0"
            step="1"
            placeholder="—"
            title={localize('DND5E.VehicleActionThresholdsFull')}
            selectOnFocus={true}
            disabled={!context.editable || context.lockSensitiveFields}
          />

          <span class="sep">&lt;</span>
          <NumberInput
            document={context.actor}
            field="system.attributes.actions.thresholds.1"
            value={context.system.attributes.actions.thresholds['1']}
            min="0"
            step="1"
            placeholder="—"
            title={localize('DND5E.VehicleActionThresholdsMid')}
            selectOnFocus={true}
            disabled={!context.editable || context.lockSensitiveFields}
          />

          <span class="sep">&lt;</span>
          <NumberInput
            document={context.actor}
            field="system.attributes.actions.thresholds.0"
            value={context.system.attributes.actions.thresholds['0']}
            min="0"
            step="1"
            placeholder="—"
            title={localize('DND5E.VehicleActionThresholdsMin')}
            selectOnFocus={true}
            disabled={!context.editable || context.lockSensitiveFields}
          />
        </div>
      </div>
      <HorizontalLineSeparator />
      <div class="counter action-summary">
        <h4>{localize('TIDY5E.TotalCrewCount')}</h4>
        <div class="counter-value" title={crewTallyDescription}>
          {totalCrew}
        </div>
      </div>
      <HorizontalLineSeparator />
      <div class="counter action-summary">
        <h4>{localize('TIDY5E.ActionsPerTurn')}</h4>
        <div class="counter-value">
          {actionsPerTurn}
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="less">
  .counter-flex {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .counters {
    background: var(--t5e-faint-color);
    border-radius: 0.3125rem;
    padding: 0.25rem 0.5rem;

    &,
    h4 {
      font-size: 0.75rem;
    }

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
        width: 2rem;
        text-align: center;
      }
    }
  }

  span.action-stations {
    white-space: nowrap;
  }
</style>
