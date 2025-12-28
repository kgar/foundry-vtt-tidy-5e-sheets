in <script lang="ts">
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import ActorTraitConfigurableListEntry from '../parts/ActorTraitConfigurableListEntry.svelte';
  import ActorTraitSize from '../parts/ActorTraitSize.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ActorTraitPills from '../parts/ActorTraitPills.svelte';

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

  type DimensionTraitConfig = {
    iconClass: string;
    label: string;
    value: string | number;
    units?: string;
    traitClass: string;
    onconfig?: (value: string | number) => void;
  };
</script>

{#snippet dimensionTrait(config: DimensionTraitConfig)}
  <div class={['list-entry', config.traitClass]}>
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class={config.iconClass}></i>
        {config.label}
      </h4>
      <div class="flexshrink">
        <span class="value font-label-medium">{config.value}</span>
        {#if config.units}
          <span class="units font-label-medium color-text-lighter">{config.units}</span>
        {/if}
        {#if context.unlocked && config.onconfig}
        <!-- TODO switch to inputs -->
          <button
            aria-label={localize('DND5E.TraitConfig', { trait: config.label })}
            type="button"
            class="button button-borderless button-icon-only button-config flexshrink"
            data-tooltip
            onclick={(ev) => config.onconfig?.(ev.currentTarget.value)}
          >
            <i class="fa-solid fa-cog"></i>
          </button>
        {/if}
      </div>
    </div>
  </div>
{/snippet}

{#snippet dimensionTraitEditable(config: DimensionTraitConfig)}
  <div class={['list-entry', config.traitClass]}>
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class={config.iconClass}></i>
        {config.label}
      </h4>
      <div class="trait-editable flexshrink flexrow gap-1">
        <TextInputQuadrone
          class="flex"
          document={context.actor}
          field={`system.traits.${config.traitClass}.value`}
          value={config.value}
          onSaveChange={(ev: Event & { currentTarget: HTMLInputElement }) => {
            config.onconfig?.(ev.currentTarget.value);
            return true;
          }}
        />
        {#if config.units}
          <SelectQuadrone
            document={context.actor}
            field={`system.traits.${config.traitClass}.units`}
            value={config.units}
          >
            <SelectOptions
              data={context.config.vehicleTypes}
              labelProp="label"
            />
          </SelectQuadrone>
        {/if}
      </div>
    </div>
  </div>
{/snippet}

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
            for="{appId}-vehicle-type"
            aria-label={localize('DND5E.VEHICLE.Type.label')}
          >
            <SelectQuadrone
              class="native-select-overlay"
              id="{appId}-vehicle-type"
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
  {@render dimensionTraitEditable({
    iconClass: 'fa-solid fa-arrows-left-right-to-line trait-icon-keel',
    label: localize('DND5E.VEHICLE.FIELDS.traits.keel.value.label'),
    value: context.system.traits.keel.value,
    units: context.system.traits.keel.units,
    traitClass: 'trait-keel',
    onconfig: () => alert('TODO: Implement keel config'),
  })}

  <!-- Beam -->
  {@render dimensionTrait({
    iconClass: 'fa-solid fa-arrows-left-right-to-line',
    label: localize('DND5E.VEHICLE.FIELDS.traits.beam.value.label'),
    value: context.system.traits.beam.value,
    units: context.system.traits.beam.units,
    traitClass: 'trait-beam',
    onconfig: () => alert('TODO: Implement beam config'),
  })}

  <!-- Cargo Capacity -->
  {@render dimensionTrait({
    iconClass: 'fa-solid fa-box',
    label: localize('DND5E.VEHICLE.FIELDS.attributes.capacity.cargo.value.label'),
    value: context.cargoCapacity,
    units: context.system.attributes.capacity.cargo.units,
    traitClass: 'trait-cargo-capacity',
    onconfig: () => alert('TODO: Implement cargo capacity config'),
  })}

  <!-- Crew Capacity -->
  {@render dimensionTrait({
    iconClass: 'fa-solid fa-people-carry-box',
    label: localize('DND5E.VEHICLE.FIELDS.crew.max.label'),
    value: context.crewCapacity,
    traitClass: 'trait-crew-capacity',
    onconfig: () => alert('TODO: Implement crew capacity config'),
  })}

  <!-- Passenger Capacity -->
  {@render dimensionTrait({
    iconClass: 'fa-solid fa-people-group',
    label: localize('DND5E.VEHICLE.FIELDS.passengers.max.label'),
    value: context.passengerCapacity,
    traitClass: 'trait-passenger-capacity',
    onconfig: () => alert('TODO: Implement passenger capacity config'),
  })}

  <!-- Size -->
  <ActorTraitSize />
  
  <!-- Weight -->
  {@render dimensionTrait({
    iconClass: 'fa-solid fa-weight-hanging',
    label: localize('DND5E.Weight'),
    value: context.system.traits.weight.value,
    units: context.system.traits.weight.units,
    traitClass: 'trait-weight',
    onconfig: () => alert('TODO: Implement weight config'),
  })}

  <!-- Quality -->
  {@render dimensionTrait({
    iconClass: 'fa-solid fa-star',
    label: localize('DND5E.Quality'),
    value: context.quality,
    traitClass: 'trait-quality',
    onconfig: () => alert('TODO: Implement quality config'),
  })}

  <!-- Cost -->
  {@render dimensionTrait({
    iconClass: 'fa-solid fa-coins',
    label: localize('DND5E.Cost'),
    value: context.cost.value,
    units: context.cost.denomination,
    traitClass: 'trait-cost',
    onconfig: () => alert('TODO: Implement cost config'),
  })}

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
                  <span class="value font-data-medium">{travelPace.valueDay}</span><span class="units font-default-medium color-text-lighter">{travelPace.unitsDay}</span>
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
          onclick={(ev) => alert('TODO: Implement keel config')}
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
              <span class="value font-data-medium">{travelSpeed.valueHour}</span><span class="units font-default-medium color-text-lighter">{travelSpeed.unitsHour}</span>
            </span>
          </li>
          {/each}

          <!-- Combat Speed -->
          {#if !!context.system.attributes. movement.max
                || (context.editable && !!context.travelSpeeds.currentSpeed && !!context.travelSpeeds.travelSpeeds.length)}
            <li class="pill">
              <span class="font-label-medium">{localize('DND5E.MOVEMENT.Speed')}</span>
              <span>
                <span class="value font-data-medium">{context.system.attributes.movement.max}</span><span class="units font-default-medium color-text-lighter">{context.system.attributes.movement.units}</span>
              </span>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </div>

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
