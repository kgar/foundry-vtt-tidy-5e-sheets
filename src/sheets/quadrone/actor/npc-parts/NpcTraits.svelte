<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ActorTraitConfigurableListEntry from '../parts/ActorTraitConfigurableListEntry.svelte';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import ActorTraitSize from '../parts/ActorTraitSize.svelte';
  import { isNil } from 'src/utils/data';
  import type { ActorTraitContext } from 'src/types/types';
  import NpcTraitSpecies from './traits/NpcTraitSpecies.svelte';

  let context = $derived(getNpcSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let creatureTypeEntries = $derived.by(() => {
    let result: ActorTraitContext[] = [];

    if (!isNil(context.creatureType?.title, '')) {
      result.push({ label: context.creatureType?.title });
    }

    return result;
  });
</script>

<!-- {#if context.unlocked}
<div class="title-container">
  <h3 class="font-title-small">{localize('DND5E.Traits')}</h3>
  <tidy-gold-header-underline></tidy-gold-header-underline>
</div>
{/if} -->

<div class="list traits">
  <!-- Size -->
  {#if context.unlocked}
    <ActorTraitSize />
  {/if}

  <!-- Species -->
  <NpcTraitSpecies />

  <!-- Creature Type -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.CreatureType')}
    entries={creatureTypeEntries}
    onconfig={() => FoundryAdapter.renderCreatureTypeConfig(context.actor)}
    icon=""
  />

  <!-- Speed -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.Speed')}
    entries={context.speeds}
    onconfig={() =>
      FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
    icon="fa-solid fa-rabbit-running"
  />

  <!-- Senses -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.Senses')}
    entries={context.senses}
    onconfig={() =>
      FoundryAdapter.renderMovementSensesConfig(context.actor, 'senses')}
    icon="fa-solid fa-eye"
  />

  <!-- Resistances -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.Resistances')}
    entries={context.traits.dr}
    onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dr')}
    icon="fa-solid fa-shield-halved"
    pillClass="positive"
    aggregateIcons={{
      iconClass: 'fa-solid fa-shield-exclamation',
      pillClass: 'physical-bypass',
    }}
  />

  <!-- Damage Immunities -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.TraitDIPlural.other')}
    entries={context.traits.di}
    onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'di')}
    icon="fa-solid fa-shield"
    pillClass="positive"
    aggregateIcons={{
      iconClass: 'fa-solid fa-shield-exclamation',
      pillClass: 'physical-bypass',
    }}
  />

  <!-- Condition Immunities -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.TraitCIPlural.other')}
    entries={context.traits.ci}
    onconfig={() => FoundryAdapter.renderTraitsConfig(context.actor, 'ci')}
    icon="fa-solid fa-shield-virus"
    pillClass="positive"
  />

  <!-- Vulnerabilities -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.Vulnerabilities')}
    entries={context.traits.dv}
    onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dv')}
    icon="fa-solid fa-heart-crack"
    pillClass="negative"
    aggregateIcons={{
      iconClass: 'fa-solid fa-shield-exclamation',
      pillClass: 'physical-bypass',
    }}
  />

  <!-- Damage Modification -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.DamageModification.Label')}
    entries={context.traits.dm}
    onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dm')}
    icon="fa-solid fa-heart-circle-plus"
    aggregateIcons={{
      iconClass: 'fa-solid fa-shield-exclamation',
      pillClass: 'physical-bypass',
    }}
  />

  <!-- Habitat -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.Habitat.Configuration.Label')}
    entries={context.habitats}
    configurationTooltip={localize('DND5E.Habitat.Configuration.Title')}
    onconfig={() =>
      new dnd5e.applications.actor.HabitatConfig({
        document: context.actor,
      }).render({ force: true })}
    icon="fa-solid fa-mountain-sun"
  />

  <!-- Treasure -->
  <ActorTraitConfigurableListEntry
    label={localize('DND5E.Treasure.Configuration.Label')}
    entries={context.treasures}
    configurationTooltip={localize('DND5E.Treasure.Configuration.Title')}
    onconfig={() =>
      new dnd5e.applications.actor.TreasureConfig({
        document: context.actor,
      }).render({ force: true })}
    icon="fa-solid fa-gem"
  />

  <!-- Special Traits -->
  {#if context.unlocked}
    <ActorTraitConfigurableListEntry
      label={localize('DND5E.SpecialTraits')}
      entries={[]}
      configurationTooltip={localize('DND5E.SpecialTraits')}
      onconfig={() =>
        new SpecialTraitsApplication({ document: context.actor }).render({
          force: true,
        })}
      icon="fa-solid fa-star"
    />
  {/if}
</div>
