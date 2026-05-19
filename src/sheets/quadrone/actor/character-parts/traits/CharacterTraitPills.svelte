<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ActorTraitConfigurableListEntry from '../../parts/ActorTraitConfigurableListEntry.svelte';
  import CharacterTraitSize from '../../parts/CharacterTraitSize.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { Snippet } from 'svelte';
  import ActorCustomTraitListEntries from '../../parts/ActorCustomTraitListEntries.svelte';

  type Prop = {
    configButtonLocation: 'end' | 'label';
    preCustomTraits?: Snippet;
  };

  let { configButtonLocation, preCustomTraits }: Prop = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<!-- Size -->
<CharacterTraitSize />

<!-- Speed -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.Speed')}
  entries={context.speeds.traitEntries}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-config': 'movement',
  }}
  icon="fa-solid fa-rabbit-running"
/>

<!-- Senses -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.Senses')}
  entries={context.senses.traitEntries}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-config': 'senses',
  }}
  icon="fa-solid fa-eye"
/>

<!-- Resistances -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.Resistances')}
  entries={context.traits.dr}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-trait': 'dr'
  }}
  icon="fa-solid fa-shield-halved"
  pillClass="positive"
  aggregateIcons={{
    iconClass: 'fa-solid fa-shield-exclamation',
    pillClass: 'physical-bypass',
  }}
/>

<!-- Damage Immunities -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.TraitDIPlural.other')}
  entries={context.traits.di}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-trait': 'di'
  }}
  icon="fa-solid fa-shield"
  pillClass="positive"
  aggregateIcons={{
    iconClass: 'fa-solid fa-shield-exclamation',
    pillClass: 'physical-bypass',
  }}
/>

<!-- Condition Immunities -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.TraitCIPlural.other')}
  entries={context.traits.ci}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-trait': 'ci'
  }}
  icon="fa-solid fa-shield-virus"
  pillClass="positive"
/>

<!-- Vulnerabilities -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.Vulnerabilities')}
  entries={context.traits.dv}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-trait': 'dv'
  }}
  icon="fa-solid fa-heart-crack"
  pillClass="negative"
  aggregateIcons={{
    iconClass: 'fa-solid fa-shield-exclamation',
    pillClass: 'physical-bypass',
  }}
/>

<!-- Damage Modification -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.DamageModification.Label')}
  entries={context.traits.dm}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-trait': 'dm'
  }}
  icon="fa-solid fa-heart-circle-plus"
  aggregateIcons={{
    iconClass: 'fa-solid fa-shield-exclamation',
    pillClass: 'physical-bypass',
  }}
/>

<!-- Armor -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.Armor')}
  entries={context.traits.armor}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-trait': 'armor'
  }}
  icon="fa-solid fa-shield-quartered"
/>

<!-- Weapons -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('TYPES.Item.weaponPl')}
  entries={context.traits.weapon}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-trait': 'weapon'
  }}
  icon="fa-solid fa-swords"
/>

<!-- Languages -->
<ActorTraitConfigurableListEntry
  {configButtonLocation}
  label={localize('DND5E.Languages')}
  entries={context.traits.languages}
  configAttributes={{
    'data-action': 'showConfiguration',
    'data-trait': 'languages'
  }}
  icon="fa-solid fa-comments"
/>

{@render preCustomTraits?.()}

<ActorCustomTraitListEntries {configButtonLocation} />
