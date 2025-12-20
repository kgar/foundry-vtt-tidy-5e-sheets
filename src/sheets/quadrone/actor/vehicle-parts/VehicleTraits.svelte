<script lang="ts">
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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

  // Build travel pace entries for the trait list
  let travelPaceEntries = $derived.by(() => {
    const entries: {
      key: string;
      label: string;
      value: number;
      units: string;
      measurement: string;
    }[] = [];
    const paces = context.actor.system.attributes.travel?.paces;
    const unitsLabel = context.travel?.units?.label ?? '';

    if (paces?.land > 0) {
      entries.push({
        key: 'land',
        label: localize('DND5E.TRAVEL.Type.Land'),
        value: paces.land,
        units: unitsLabel,
        measurement: `${paces.land} ${unitsLabel}`,
      });
    }
    if (paces?.air > 0) {
      entries.push({
        key: 'air',
        label: localize('DND5E.TRAVEL.Type.Air'),
        value: paces.air,
        units: unitsLabel,
        measurement: `${paces.air} ${unitsLabel}`,
      });
    }
    if (paces?.water > 0) {
      entries.push({
        key: 'water',
        label: localize('DND5E.TRAVEL.Type.Water'),
        value: paces.water,
        units: unitsLabel,
        measurement: `${paces.water} ${unitsLabel}`,
      });
    }
    return entries;
  });
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

  <div class="list-entry trait-hit-dice">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-weight-hanging"></i>
        {localize('DND5E.Weight')}
      </h4>
      <div class="flexshrink weight-container">
        <span class="value font-label-medium"
          >{context.system.traits.weight.value}</span
        >
        <span class="units font-label-medium color-text-lighter"
          >{context.system.traits.weight.units}</span
        >
        {#if context.unlocked}
          <button
            aria-label={localize('DND5E.TraitConfig', {
              trait: localize('DND5E.Weight'),
            })}
            type="button"
            class="button button-borderless button-icon-only button-config flexshrink"
            data-tooltip
            onclick={(ev) => alert('TODO: Implement weight config')}
          >
            <i class="fa-solid fa-cog"></i>
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Keel -->
  <div class="list-entry trait-keel">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i
          class="fa-solid fa-arrows-left-right-to-line"
          style="transform: rotate(90deg) translateY(1px);"
        ></i>
        {localize('DND5E.VEHICLE.FIELDS.traits.keel.value.label')}
      </h4>
      <div class="flexshrink keel-container">
        <span class="value font-label-medium"
          >{context.system.traits.keel.value}</span
        >
        <span class="units font-label-medium color-text-lighter"
          >{context.system.traits.keel.units}</span
        >
        {#if context.unlocked}
          <button
            aria-label={localize('DND5E.TraitConfig', {
              trait: localize('DND5E.VEHICLE.FIELDS.traits.keel.value.label'),
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
    </div>
  </div>

  <!-- Beam -->
  <div class="list-entry trait-beam">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-arrows-left-right-to-line"></i>
        {localize('DND5E.VEHICLE.FIELDS.traits.beam.value.label')}
      </h4>
      <div class="flexshrink beam-container">
        <span class="value font-label-medium"
          >{context.system.traits.beam.value}</span
        >
        <span class="units font-label-medium color-text-lighter"
          >{context.system.traits.beam.units}</span
        >
        {#if context.unlocked}
          <button
            aria-label={localize('DND5E.TraitConfig', {
              trait: localize('DND5E.VEHICLE.FIELDS.traits.beam.value.label'),
            })}
            type="button"
            class="button button-borderless button-icon-only button-config flexshrink"
            data-tooltip
            onclick={(ev) => alert('TODO: Implement beam config')}
          >
            <i class="fa-solid fa-cog"></i>
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Size -->
  <ActorTraitSize />

  <!-- Travel Pace -->
  <div class={['list-entry traits-travel-pace']}>
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-route"></i>
        {localize('DND5E.TRAVEL.Label')}
      </h4>
    </div>
    {#if !!context.travel.currentPace}
      <div class="list-content">
        <div class="list-values">
          <ul class="pills">
            {#each travelPaceEntries as travelPace}
              <li class={['pill pill medium trait-pill']}>
                <span class="font-label-medium">
                  {travelPace.label}
                </span>
                <span class="font-data-medium">
                  {travelPace.value}
                </span>
                <span class="font-label-medium color-text-lighter">
                  {travelPace.units}
                </span>
              </li>
            {/each}
          </ul>
          {#if context.unlocked}
            <span class="config-speeds">
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
            </span>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <!-- Speed -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.Speed')}
    entries={context.speeds}
    onconfig={() =>
      FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
    icon={vehicleTypeIcon()}
    traitClass="traits-speeds"
    pillClass="trait-speed"
  />

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
