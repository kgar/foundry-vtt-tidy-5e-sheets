<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorTraitClasses from '../../parts/ActorTraitClasses.svelte';
  import CharacterTraitSpecies from './CharacterTraitSpecies.svelte';
  import ActorTraitBackground from '../../parts/ActorTraitBackground.svelte';
  import ActorTraitConfigurableListEntry from '../../parts/ActorTraitConfigurableListEntry.svelte';
  import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import ActorTraitSize from '../../parts/ActorTraitSize.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<section class="character-traits">
  <div class="flexrow space-between character-traits-header">
    <div class="character-traits-title">
      <h3 class="font-title-small">
        {localize('TIDY5E.CharacterTraits.Title')}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </div>
    {#if context.editable}
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
  </div>

  <div class="list traits">
    <ActorTraitClasses />

    <CharacterTraitSpecies />

    <ActorTraitBackground />

    <!-- Size -->
    <ActorTraitSize />

    <!-- Speed -->
    <ActorTraitConfigurableListEntry
      configButtonLocation="end"
      label={localize('DND5E.Speed')}
      entries={context.speeds.traitEntries}
      onconfig={() =>
        FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
      icon="fa-solid fa-rabbit-running"
    />

    <!-- Senses -->
    <ActorTraitConfigurableListEntry
      configButtonLocation="end"
      label={localize('DND5E.Senses')}
      entries={context.senses.traitEntries}
      onconfig={() =>
        FoundryAdapter.renderMovementSensesConfig(context.actor, 'senses')}
      icon="fa-solid fa-eye"
    />

    <!-- Resistances -->
    <ActorTraitConfigurableListEntry
      configButtonLocation="end"
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
      configButtonLocation="end"
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
      configButtonLocation="end"
      label={localize('DND5E.TraitCIPlural.other')}
      entries={context.traits.ci}
      onconfig={() => FoundryAdapter.renderTraitsConfig(context.actor, 'ci')}
      icon="fa-solid fa-shield-virus"
      pillClass="positive"
    />

    <!-- Vulnerabilities -->
    <ActorTraitConfigurableListEntry
      configButtonLocation="end"
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
      configButtonLocation="end"
      label={localize('DND5E.DamageModification.Label')}
      entries={context.traits.dm}
      onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dm')}
      icon="fa-solid fa-heart-circle-plus"
      aggregateIcons={{
        iconClass: 'fa-solid fa-shield-exclamation',
        pillClass: 'physical-bypass',
      }}
    />

    <!-- Armor -->
    <ActorTraitConfigurableListEntry
      configButtonLocation="end"
      label={localize('DND5E.Armor')}
      entries={context.traits.armor}
      onconfig={() => FoundryAdapter.renderTraitsConfig(context.actor, 'armor')}
      icon="fa-solid fa-shield-quartered"
    />

    <!-- Weapons -->
    <ActorTraitConfigurableListEntry
      configButtonLocation="end"
      label={localize('TYPES.Item.weaponPl')}
      entries={context.traits.weapon}
      onconfig={() => FoundryAdapter.renderWeaponsConfig(context.actor)}
      icon="fa-solid fa-swords"
    />

    <!-- Languages -->
    <ActorTraitConfigurableListEntry
      configButtonLocation="end"
      label={localize('DND5E.Languages')}
      entries={context.traits.languages}
      onconfig={() => FoundryAdapter.renderLanguagesConfig(context.actor)}
      icon="fa-solid fa-comments"
    />

    {#each context.customActorTraits as trait}
      <ActorTraitConfigurableListEntry
        configButtonLocation="end"
        label={localize(trait.title)}
        entries={[]}
        onconfig={(ev) =>
          trait.openConfiguration?.({
            app: context.document.sheet,
            data: context,
            element: context.document.sheet.element,
            event: ev,
          })}
        configurationTooltip={trait.openConfigurationTooltip}
        icon={trait.iconClass}
        isCustomTrait={true}
      />
    {/each}
  </div>
</section>
