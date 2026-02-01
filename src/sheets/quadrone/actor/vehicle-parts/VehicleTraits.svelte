<script lang="ts">
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ActorTraitConfigurableListEntry from '../parts/ActorTraitConfigurableListEntry.svelte';
  import ActorTraitSize from '../parts/ActorTraitSize.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ActorTraitPills from '../parts/ActorTraitPills.svelte';
  import VehicleTrait from './VehicleTrait.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import TidySwitch from 'src/components/toggles/TidySwitch.svelte';

  let context = $derived(getVehicleSheetQuadroneContext());
  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
  let vehicleTypeIcon = $derived(() => {
    switch (context.system.details.type) {
      case 'air':
        return 'fa-solid fa-plane';
      case 'land':
        return 'fa-solid fa-wagon-covered';
      case 'water':
        return 'fa-solid fa-sailboat';
      case 'space':
        return 'fa-solid fa-planet-ringed';
      default:
        return 'fa-solid fa-rabbit-running';
    }
  });

  // Travel pace entries from context
  let travelSpeedEntries = $derived(context.travelSpeeds?.travelSpeeds ?? []);
</script>

<!-- TODO: Implement Quadrone-styled vehicle traits:
  - Damage immunities
  - Damage resistances
  - Damage vulnerabilities
  - Condition immunities
  - Proper Quadrone card/section styling
-->
<div class="list traits">
  {#if context.unlocked}
    <div class={['list-entry traits-vehicle-type']}>
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class={vehicleTypeIcon()}></i>
          {localize('DND5E.VEHICLE.Type.label')}
        </h4>
        {#if context.unlocked}
          <label
            class="select-button button button-borderless button-icon-only button-config flexshrink"
            for="{appId}-sidebar-vehicle-type"
            aria-label={localize('DND5E.VEHICLE.Type.label')}
          >
            <SelectQuadrone
              class="native-select-overlay"
              id="{appId}-sidebar-vehicle-type"
              document={context.actor}
              field="system.details.type"
              value={context.system.details.type}
            >
              <SelectOptions
                data={context.config.vehicleTypes}
                labelProp="label"
              />
            </SelectQuadrone>
            <i class="fa-solid fa-cog" aria-hidden="true"></i>
          </label>
        {/if}
      </div>
      <div class="list-content">
        <div class="list-values">
          {#if context.system.details.type && context.config.vehicleTypes[context.system.details.type]}
            <ActorTraitPills
              values={[
                {
                  key: 'type',
                  label: localize(
                    `DND5E.VEHICLE.Type.${context.system.details.type.capitalize()}.label`,
                  ),
                },
              ]}
            />
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Keel -->
  <VehicleTrait
    iconClass="fa-solid fa-arrows-left-right-to-line trait-icon-keel"
    label={localize('DND5E.VEHICLE.FIELDS.traits.keel.value.label')}
    value={context.system.traits.keel.value}
    units={context.system.traits.keel.units}
    traitClass="trait-keel trait-editable"
    unlocked={context.unlocked}
  >
    {#snippet editableValues()}
      <NumberInputQuadrone
        id="{appId}-sidebar-keel-value"
        document={context.actor}
        field="system.traits.keel.value"
        value={context.system.traits.keel.value}
        min="0"
        placeholder="—"
        selectOnFocus={true}
        disabled={!context.editable}
      />

      <SelectQuadrone
        id="{appId}-sidebar-keel-units"
        document={context.actor}
        field="system.traits.keel.units"
        value={context.system.traits.keel.units}
        class="flex0"
      >
        <SelectOptions
          data={context.config.movementUnits}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    {/snippet}
  </VehicleTrait>

  <!-- Beam -->
  <VehicleTrait
    iconClass="fa-solid fa-arrows-left-right-to-line"
    label={localize('DND5E.VEHICLE.FIELDS.traits.beam.value.label')}
    value={context.system.traits.beam.value}
    units={context.system.traits.beam.units}
    traitClass="trait-beam trait-editable"
    unlocked={context.unlocked}
  >
    {#snippet editableValues()}
      <NumberInputQuadrone
        id="{appId}-sidebar-beam-value"
        document={context.actor}
        field="system.traits.beam.value"
        value={context.system.traits.beam.value}
        min="0"
        placeholder="—"
        selectOnFocus={true}
        disabled={!context.editable}
      />

      <SelectQuadrone
        id="{appId}-sidebar-beam-units"
        document={context.actor}
        field="system.traits.beam.units"
        value={context.system.traits.beam.units}
        class="flex0"
      >
        <SelectOptions
          data={context.config.movementUnits}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    {/snippet}
  </VehicleTrait>

  <!-- Cargo Capacity -->
  <VehicleTrait
    iconClass="fa-solid fa-box"
    label={localize(
      'DND5E.VEHICLE.FIELDS.attributes.capacity.cargo.value.label',
    )}
    value={context.system.attributes.capacity.cargo.value}
    units={CONFIG.DND5E.weightUnits[
      context.system.attributes.capacity.cargo.units
    ]?.abbreviation}
    traitClass="trait-cargo-capacity trait-editable"
    unlocked={context.unlocked}
  >
    {#snippet editableValues()}
      <NumberInputQuadrone
        id="{appId}-sidebar-cargo-value"
        document={context.actor}
        field="system.attributes.capacity.cargo.value"
        value={context.system.attributes.capacity.cargo.value}
        min="0"
        placeholder="—"
        selectOnFocus={true}
        disabled={!context.editable}
      />

      <SelectQuadrone
        id="{appId}-sidebar-cargo-units"
        document={context.actor}
        field="system.attributes.capacity.cargo.units"
        value={context.system.attributes.capacity.cargo.units}
        class="flex0"
      >
        <SelectOptions
          data={context.config.weightUnits}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    {/snippet}
  </VehicleTrait>

  <!-- Crew Capacity -->
  <VehicleTrait
    iconClass="fa-solid fa-people-carry-box"
    label={localize('DND5E.VEHICLE.FIELDS.crew.max.label')}
    value={context.system.crew.max}
    traitClass="trait-crew-capacity trait-editable"
    unlocked={context.unlocked}
  >
    {#snippet editableValues()}
      <NumberInputQuadrone
        id="{appId}-sidebar-crew-max"
        document={context.actor}
        field="system.crew.max"
        value={context.system.crew.max}
        min="0"
        selectOnFocus={true}
        placeholder="—"
        disabled={!context.editable}
      />
    {/snippet}
  </VehicleTrait>

  <!-- Passenger Capacity -->
  <VehicleTrait
    iconClass="fa-solid fa-people-group"
    label={localize('DND5E.VEHICLE.FIELDS.passengers.max.label')}
    value={context.system.passengers.max}
    traitClass="trait-passengers-capacity trait-editable"
    unlocked={context.unlocked}
  >
    {#snippet editableValues()}
      <NumberInputQuadrone
        id="{appId}-sidebar-passengers-max"
        document={context.actor}
        field="system.passengers.max"
        value={context.system.passengers.max}
        min="0"
        selectOnFocus={true}
        placeholder="—"
        disabled={!context.editable}
      />
    {/snippet}
  </VehicleTrait>

  <!-- Size -->
  <ActorTraitSize />

  <!-- Weight -->
  <VehicleTrait
    iconClass="fa-solid fa-weight-hanging"
    label={localize('DND5E.Weight')}
    value={context.system.traits.weight.value}
    units={context.system.traits.weight.units}
    traitClass="trait-weight trait-editable"
    unlocked={context.unlocked}
  >
    {#snippet editableValues()}
      <NumberInputQuadrone
        id="{appId}-sidebar-weight-value"
        document={context.actor}
        field="system.traits.weight.value"
        value={context.system.traits.weight.value}
        min="0"
        placeholder="—"
        selectOnFocus={true}
        disabled={!context.editable}
      />

      <SelectQuadrone
        id="{appId}-sidebar-weight-units"
        document={context.actor}
        field="system.traits.weight.units"
        value={context.system.traits.weight.units}
        class="flex0"
      >
        <SelectOptions
          data={context.config.weightUnits}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    {/snippet}
  </VehicleTrait>

  <!-- Quality -->
  <VehicleTrait
    iconClass="fa-solid fa-star"
    label={localize('DND5E.Quality')}
    value={context.system.attributes.quality.value}
    traitClass="trait-quality trait-editable"
    unlocked={context.unlocked}
  >
    {#snippet editableValues()}
      <NumberInputQuadrone
        id="{appId}-sidebar-quality-value"
        document={context.actor}
        field="system.attributes.quality.value"
        value={context.system.attributes.quality.value}
        min="0"
        valueRequired={true}
        selectOnFocus={true}
        placeholder="—"
        disabled={!context.editable}
      />
    {/snippet}
  </VehicleTrait>

  <!-- Cost -->
  <VehicleTrait
    iconClass="fa-solid fa-coins"
    label={localize('DND5E.Cost')}
    value={context.system.attributes.price.value}
    units={context.system.attributes.price.denomination}
    traitClass="trait-weight trait-editable"
    unlocked={context.unlocked}
  >
    {#snippet editableValues()}
      <NumberInputQuadrone
        id="{appId}-sidebar-price-value"
        document={context.actor}
        field="system.attributes.price.value"
        value={context.system.attributes.price.value}
        min="0"
        placeholder="—"
        selectOnFocus={true}
        disabled={!context.editable}
      />

      <SelectQuadrone
        id="{appId}-sidebar-price-denomination"
        document={context.actor}
        field="system.attributes.price.denomination"
        value={context.system.attributes.price.denomination}
        class="flex0"
      >
        <SelectOptions
          data={context.config.currencies}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    {/snippet}
  </VehicleTrait>

  <!-- Travel Pace -->
  <div class={['list-entry traits-travel-pace']}>
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-route"></i>
        {localize('DND5E.TRAVEL.Label')}
      </h4>
      {#if context.unlocked}
        <button
          aria-label={localize('DND5E.MOVEMENT.Action.Configure')}
          type="button"
          class={[
            'button button-borderless button-icon-only button-config flexshrink',
          ]}
          onclick={() =>
            FoundryAdapter.renderMovementSensesConfig(
              context.actor,
              'movement',
            )}
          data-tidy-sheet-part="ability-configuration-control"
        >
          <i class="fas fa-cog"></i>
        </button>
      {/if}
    </div>
    {#if !!context.travelSpeeds.currentSpeed}
      <div class="list-content">
        <div class="list-values">
          <ul class="pills">
            {#each travelSpeedEntries as travelPace}
              <li class={['pill pill medium trait-pill']}>
                <span class="font-label-medium">
                  {travelPace.label}
                </span>
                <span>
                  <span class="value font-data-medium"
                    >{travelPace.valueDay}</span
                  ><span class="units font-default-medium color-text-lighter"
                    >{travelPace.unitsDay}</span
                  >
                </span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    {/if}
  </div>

  <!-- Speeds -->
  <div class="list-entry trait-speed">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class={`fa-solid ${vehicleTypeIcon()}`}></i>
        {localize('DND5E.Speed')}
      </h4>
      {#if context.unlocked}
        <button
          aria-label={localize('DND5E.MOVEMENT.Action.Configure', {
            action: localize('DND5E.Speed'),
          })}
          type="button"
          class="button button-borderless button-icon-only button-config flexshrink"
          data-tooltip
          onclick={() =>
            FoundryAdapter.renderMovementSensesConfig(
              context.actor,
              'movement',
            )}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- Travel Speeds -->
          {#each travelSpeedEntries as travelSpeed}
            <li class="pill">
              <span class="font-label-medium">{travelSpeed.label}</span>
              <span>
                <span class="value font-data-medium"
                  >{travelSpeed.valueHour}</span
                ><span class="units font-default-medium color-text-lighter"
                  >{travelSpeed.unitsHour}</span
                >
              </span>
            </li>
          {/each}

          <!-- Combat Speed -->
          {#if !!context.system.attributes.movement.max || (context.editable && !!context.travelSpeeds.currentSpeed && !!context.travelSpeeds.travelSpeeds.length)}
            <li class="pill">
              <span class="font-label-medium"
                >{localize('DND5E.MOVEMENT.Speed')}</span
              >
              <span>
                <span class="value font-data-medium"
                  >{context.system.attributes.movement.max}</span
                ><span class="units font-default-medium color-text-lighter"
                  >{context.system.attributes.movement.units}</span
                >
              </span>
            </li>
          {/if}

          <!-- Special Movement and Ignored Difficult Terrain -->
          {#each context.speeds.filter((s) => s.key === 'special' || s.key === 'ignoredDifficultTerrain') as speed}
            <li class="pill">
              <span class="font-label-medium">{speed.label}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <!-- Stations and actions -->
  {#if context.unlocked}
    <!-- Stations -->
    <div class="list-entry trait-stations trait-horizontal">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-tower-control"></i>
          {localize('DND5E.VEHICLE.FIELDS.attributes.actions.stations.label')}
        </h4>
      </div>
      <div class="trait-values">
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
          aria-label={localize(
            'DND5E.VEHICLE.FIELDS.attributes.actions.stations.label',
          )}
          role="button"
          tabindex="0"
          class={[
            'tidy-table-button tidy-table-toggle',
            { disabled: !context.editable },
          ]}
          data-tooltip={localize(
            'DND5E.VEHICLE.FIELDS.attributes.actions.stations.label',
          )}
          onclick={async () =>
            context.editable &&
            (await context.actor.update({
              'system.attributes.actions.stations':
                !context.system.attributes.actions.stations,
            }))}
          onkeydown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.currentTarget.click();
            }
          }}
        >
          <i
            class={[
              'fa-solid',
              {
                ['fa-toggle-off']: !context.system.attributes.actions.stations,
                ['fa-toggle-large-on enabled']:
                  context.system.attributes.actions.stations,
              },
            ]}
          ></i>
        </a>
      </div>
    </div>

    <!-- Actions -->
    {#if !context.system.attributes.actions.stations}
      <VehicleTrait
        iconClass="fa-solid fa-bolt"
        label={localize('DND5E.VEHICLE.FIELDS.attributes.actions.max.label')}
        value={context.system.attributes.actions.value}
        traitClass="trait-actions trait-editable"
        unlocked={context.unlocked}
      >
        {#snippet editableValues()}
          <NumberInputQuadrone
            id="{appId}-sidebar-actions-value"
            document={context.actor}
            field="system.attributes.actions.value"
            value={context.system.attributes.actions.value}
            min="0"
            max="3"
            placeholder="—"
            selectOnFocus={true}
            disabled={!context.editable}
          />
        {/snippet}
      </VehicleTrait>
    {/if}

    <!-- Thresholds -->
    {#if !context.system.attributes.actions.stations}
      <div class="list-entry trait-thresholds">
        <div class="list-label flexrow">
          <h4 class="font-weight-label">
            <i class="fa-solid fa-bolt-auto"></i>
            {localize(
              'DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.label',
            )}
          </h4>
        </div>
        <div class="threshold-values flexrow">
          <span class="sep color-text-lighter flexshrink">&lt;</span>
          <NumberInputQuadrone
            id="{appId}-sidebar-threshold-2"
            class="flex1"
            document={context.actor}
            field="system.attributes.actions.thresholds.2"
            value={context.system.attributes.actions.thresholds['2']}
            min="0"
            placeholder="—"
            selectOnFocus={true}
            disabled={!context.editable}
            data-tooltip={localize(
              'DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.full.label',
            )}
          />
          <span class="sep color-text-lighter flexshrink">&lt;</span>
          <NumberInputQuadrone
            id="{appId}-sidebar-threshold-1"
            class="flex1"
            document={context.actor}
            field="system.attributes.actions.thresholds.1"
            value={context.system.attributes.actions.thresholds['1']}
            min="0"
            placeholder="—"
            selectOnFocus={true}
            disabled={!context.editable}
            data-tooltip={localize(
              'DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.mid.label',
            )}
          />
          <span class="sep color-text-lighter flexshrink">&lt;</span>
          <NumberInputQuadrone
            id="{appId}-sidebar-threshold-0"
            class="flex1"
            document={context.actor}
            field="system.attributes.actions.thresholds.0"
            value={context.system.attributes.actions.thresholds['0']}
            min="0"
            placeholder="—"
            selectOnFocus={true}
            disabled={!context.editable}
            data-tooltip={localize(
              'DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.min.label',
            )}
          />
        </div>
      </div>
    {/if}
  {/if}

  <!-- Resistances -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.Resistances')}
    entries={context.traits.dr}
    onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dr')}
    icon="fa-solid fa-shield-halved"
    traitClass="traits-resistances"
    pillClass="positive trait-resistance"
    aggregateIcons={{
      iconClass: 'fa-solid fa-shield-exclamation',
      pillClass: 'physical-bypass',
    }}
  />

  <!-- Damage Immunities -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.TraitDIPlural.other')}
    entries={context.traits.di}
    onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'di')}
    icon="fa-solid fa-shield"
    traitClass="traits-damage-immunities"
    pillClass="positive trait-damage-immunity"
    aggregateIcons={{
      iconClass: 'fa-solid fa-shield-exclamation',
      pillClass: 'physical-bypass',
    }}
  />

  <!-- Condition Immunities -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.TraitCIPlural.other')}
    entries={context.traits.ci}
    onconfig={() => FoundryAdapter.renderTraitsConfig(context.actor, 'ci')}
    icon="fa-solid fa-shield-virus"
    traitClass="traits-condition-immunities"
    pillClass="positive trait-condition-immunity"
  />

  <!-- Vulnerabilities -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.Vulnerabilities')}
    entries={context.traits.dv}
    onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dv')}
    icon="fa-solid fa-heart-crack"
    traitClass="traits-vulnerabilities"
    pillClass="negative trait-vulnerability"
    aggregateIcons={{
      iconClass: 'fa-solid fa-shield-exclamation',
      pillClass: 'physical-bypass',
    }}
  />
</div>
