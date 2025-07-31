<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CharacterTraitConfigurableListEntry from '../character-parts/traits/CharacterTraitConfigurableListEntry.svelte';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';

  let context = $derived(getNpcSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<!-- {#if context.unlocked}
<div class="title-container">
  <h3 class="font-title-small">{localize('DND5E.Traits')}</h3>
  <tidy-gold-header-underline></tidy-gold-header-underline>
</div>
{/if} -->

<div class="list traits">
  <!-- Speed -->
  <CharacterTraitConfigurableListEntry
    label={localize('DND5E.Speed')}
    entries={context.speeds}
    onconfig={() =>
      FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
    icon="fa-solid fa-rabbit-running"
  />

  <!-- Senses -->
  <CharacterTraitConfigurableListEntry
    label={localize('DND5E.Senses')}
    entries={context.senses}
    onconfig={() =>
      FoundryAdapter.renderMovementSensesConfig(context.actor, 'senses')}
    icon="fa-solid fa-eye"
  />

  <!-- Resistances -->
  <CharacterTraitConfigurableListEntry
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
  <CharacterTraitConfigurableListEntry
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
  <CharacterTraitConfigurableListEntry
    label={localize('DND5E.TraitCIPlural.other')}
    entries={context.traits.ci}
    onconfig={() => FoundryAdapter.renderTraitsConfig(context.actor, 'ci')}
    icon="fa-solid fa-shield-virus"
    pillClass="positive"
  />

  <!-- Vulnerabilities -->
  <CharacterTraitConfigurableListEntry
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
  <CharacterTraitConfigurableListEntry
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
  <CharacterTraitConfigurableListEntry
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
  <CharacterTraitConfigurableListEntry
    label={localize('DND5E.Treasure.Configuration.Label')}
    entries={context.treasures}
    configurationTooltip={localize('DND5E.Treasure.Configuration.Title')}
    onconfig={() =>
      new dnd5e.applications.actor.TreasureConfig({
        document: context.actor,
      }).render({ force: true })}
    icon="fa-solid fa-gem"
  />
</div>

{#if context.unlocked}
<!-- Special Traits -->
<button
  type="button"
  class="button"
  onclick={() =>
    new SpecialTraitsApplication({ document: context.actor }).render({
      force: true,
    })}
>
  <i class="fa-solid fa-star"></i>
  {localize('DND5E.SpecialTraits')}
</button>
{/if}