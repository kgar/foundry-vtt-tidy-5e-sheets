<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ActorTraitConfigurableListEntry from '../parts/ActorTraitConfigurableListEntry.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import NpcTraitCreatureType from '../npc-parts/traits/NpcTraitCreatureType.svelte';
  import NpcTraitSize from '../npc-parts/traits/NpcTraitSize.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="list traits">
  <!-- Speed -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.Speed')}
    entries={context.speeds.traitEntries}
    onconfig={() =>
      FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
    icon="fa-solid fa-rabbit-running"
  />

  <!-- Senses -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.Senses')}
    entries={context.senses.traitEntries}
    onconfig={() =>
      FoundryAdapter.renderMovementSensesConfig(context.actor, 'senses')}
    icon="fa-solid fa-eye"
  />

  <!-- Size -->
  {#if context.unlocked}
    <NpcTraitSize />
  {/if}

  <!-- Creature Type -->
  <NpcTraitCreatureType />

  <!-- Resistances -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
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
    configButtonLocation="label"
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
    configButtonLocation="label"
    label={localize('DND5E.TraitCIPlural.other')}
    entries={context.traits.ci}
    onconfig={() => FoundryAdapter.renderTraitsConfig(context.actor, 'ci')}
    icon="fa-solid fa-shield-virus"
    pillClass="positive"
  />

  <!-- Vulnerabilities -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
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
    configButtonLocation="label"
    label={localize('DND5E.DamageModification.Label')}
    entries={context.traits.dm}
    onconfig={() => FoundryAdapter.openDamagesConfig(context.actor, 'dm')}
    icon="fa-solid fa-heart-circle-plus"
    aggregateIcons={{
      iconClass: 'fa-solid fa-shield-exclamation',
      pillClass: 'physical-bypass',
    }}
  />

  <!-- Armors -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.Armor')}
    entries={context.traits.armor}
    onconfig={() => FoundryAdapter.renderArmorConfig(context.actor)}
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
    configButtonLocation="label"
    label={localize('DND5E.Languages')}
    entries={context.traits.languages}
    onconfig={() => FoundryAdapter.renderLanguagesConfig(context.actor)}
    icon="fa-solid fa-comments"
  />

  <!-- Special Traits -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.SpecialTraits')}
    entries={context.specialTraits}
    configurationTooltip={localize('DND5E.SpecialTraits')}
    onconfig={() =>
      new SpecialTraitsApplication({ document: context.actor }).render({
        force: true,
      })}
    icon="fa-solid fa-star"
  />
</div>
