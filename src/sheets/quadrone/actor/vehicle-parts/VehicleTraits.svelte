<script lang="ts">
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ActorTraitConfigurableListEntry from '../parts/ActorTraitConfigurableListEntry.svelte';
  import ActorTraitSize from '../parts/ActorTraitSize.svelte';

  let context = $derived(getVehicleSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<!-- TODO: Implement Quadrone-styled vehicle traits:
  - Damage immunities
  - Damage resistances
  - Damage vulnerabilities
  - Condition immunities
  - Proper Quadrone card/section styling
-->
<div class="list traits">
  <!-- Size -->
  <ActorTraitSize />

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
