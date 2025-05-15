<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import CharacterTraitClasses from './CharacterTraitClasses.svelte';
  import CharacterTraitSpecies from './CharacterTraitSpecies.svelte';
  import CharacterTraitBackground from './CharacterTraitBackground.svelte';
  import CharacterTraitConfigurableListEntry from './CharacterTraitConfigurableListEntry.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<section class="character-traits">
  <div class="flexrow space-between">
    <div>
      <h3 class="font-title-small">
        {localize('TIDY5E.CharacterTraits.Title')}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </div>
    {#if context.unlocked}
      <button
        type="button"
        class="button"
        onclick={() => alert('TODO: Make Special Traits App')}
      >
        <i class="fa-solid fa-star"></i>
        {localize('DND5E.SpecialTraits')}
      </button>
    {/if}
  </div>

  <div class="list">
    <CharacterTraitClasses />

    <CharacterTraitSpecies />

    <div class="list-entry">
      <div class="list-label">
        <h4>
          {localize('DND5E.CreatureType')}
        </h4>
      </div>
      <div class="list-values">
        {#if context.system.details.race}
          <i class="fa-solid fa-arrow-turn-down-right"></i>
        {/if}

        <span class="trait-name">
          {context.creatureType.title}
        </span>
        {#if context.creatureType.subtitle}
          <span class="font-weight-default color-text-lighter">
            {context.creatureType.subtitle}
          </span>
        {/if}
      </div>
      {#if context.unlocked && context.system.details.race}
        <div class="list-controls">
          <button
            type="button"
            class="button button-borderless button-icon-only"
            data-tooltip="DND5E.ItemEdit"
            onclick={() =>
              FoundryAdapter.renderCreatureTypeConfig(context.actor)}
          >
            <i class="fa-solid fa-edit"></i>
          </button>
        </div>
      {/if}
    </div>

    <CharacterTraitBackground />

    <!-- Size -->
    <div class="list-entry">
      <div class="list-label">
        <h4>
          {localize('DND5E.Size')}
        </h4>
      </div>
      <div class="list-values">
        {#if context.unlocked}
          <SelectQuadrone
            document={context.actor}
            field="system.traits.size"
            value={context.system.traits.size}
          >
            <SelectOptions data={context.config.actorSizes} labelProp="label" />
          </SelectQuadrone>
        {:else}
          <ul class="pills">
            <li class="pill">
              {context.size.label}
            </li>
          </ul>
        {/if}
      </div>
    </div>

    <!-- Speed -->
    <CharacterTraitConfigurableListEntry
      label={localize('DND5E.Speed')}
      entries={context.speeds.traitEntries}
      onconfig={() =>
        FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
      icon="fa-solid fa-rabbit-running"
    />

    <!-- Senses -->
    <CharacterTraitConfigurableListEntry
      label={localize('DND5E.Senses')}
      entries={context.senses.traitEntries}
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
    />

    <!-- Damage Immunities -->
    <CharacterTraitConfigurableListEntry
      label={localize('DND5E.TraitDIPlural.other')}
      entries={context.traits.di}
      onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'di')}
      icon="fa-solid fa-shield"
    />

    <!-- Condition Immunities -->
    <CharacterTraitConfigurableListEntry
      label={localize('DND5E.TraitCIPlural.other')}
      entries={context.traits.ci}
      onconfig={() => FoundryAdapter.renderTraitsConfig(context.actor, 'ci')}
      icon="fa-solid fa-shield-virus"
    />

    <!-- Vulnerabilities -->
    <CharacterTraitConfigurableListEntry
      label={localize('DND5E.Vulnerabilities')}
      entries={context.traits.dv}
      onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dv')}
      icon="fa-solid fa-heart-crack"
    />

    <!-- Damage Modification -->
    <CharacterTraitConfigurableListEntry
      label={localize('DND5E.DamageModification.Label')}
      entries={context.traits.dm}
      onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dm')}
      icon="fa-solid fa-heart-circle-plus"
    />

    <!-- Armor -->
    <CharacterTraitConfigurableListEntry
      label={localize('DND5E.Armor')}
      entries={context.traits.armor}
      onconfig={() => FoundryAdapter.renderArmorConfig(context.actor)}
      icon="fa-solid fa-shield-quartered"
    />

    <!-- Weapons -->
    <CharacterTraitConfigurableListEntry
      label={localize('TYPES.Item.weaponPl')}
      entries={context.traits.weapon}
      onconfig={() => FoundryAdapter.renderWeaponsConfig(context.actor)}
      icon="fa-solid fa-swords"
    />

    <!-- Languages -->
    <CharacterTraitConfigurableListEntry
      label={localize('DND5E.Languages')}
      entries={context.traits.languages}
      onconfig={() => FoundryAdapter.renderLanguagesConfig(context.actor)}
      icon="fa-solid fa-comments"
    />
  </div>
</section>
