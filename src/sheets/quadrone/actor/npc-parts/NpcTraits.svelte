<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ActorTraitConfigurableListEntry from '../parts/ActorTraitConfigurableListEntry.svelte';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import NpcTraitCreatureType from './traits/NpcTraitCreatureType.svelte';
  import NpcTraitSize from './traits/NpcTraitSize.svelte';

  let context = $derived(getNpcSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
  const hdPct = $derived(
    Math.round(
      context.system.attributes.hd.max > 0
        ? (context.system.attributes.hd.value /
            context.system.attributes.hd.max) *
            100
        : 0,
    ),
  );
</script>

<div class="list traits">
  {#if context.important}
    <div class="list-entry trait-hit-dice">
      <div class="list-label flexrow">
        <h4 class="font-weight-label">
          <i class="fa-solid fa-dice"></i>
          {localize('DND5E.HitDice')}
        </h4>
        <div class="flexshrink hit-dice-container">
          <span class="value font-label-medium"
            >{context.system.attributes.hd.value}</span
          >
          <span class="divider font-body-medium color-text-lightest">/</span>
          <span class="max font-label-medium"
            >{context.system.attributes.hd.max}</span
          >
        </div>
        <div class="flexshrink hit-dice-container">
          <div
            class="meter progress hit-die view-only"
            style="--bar-percentage: {hdPct}%"
          >
            <span class="label">
              <div class="value" data-tooltip="TIDY5E.HitDice.Current.Label">
                {context.system.attributes.hd.value}
              </div>
              <div class="separator">/</div>
              <div class="max" data-tooltip="TIDY5E.HitDice.Max.Label">
                {context.system.attributes.hd.max}
              </div>
              <div class="hd-label" data-tooltip="DND5E.HitDice">
                {localize('TIDY5E.HitDice.Abbreviation')}
              </div>
            </span>
            {#if context.unlocked}
              <button
                onclick={() =>
                  FoundryAdapter.renderHitDiceConfig(context.actor)}
                aria-label={localize('DND5E.HitDiceConfig')}
                data-tooltip="DND5E.HitDiceConfig"
                type="button"
                class="button button-borderless button-icon-only button-config"
              >
                <i class="fas fa-cog"></i>
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Speed -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.Speed')}
    entries={context.speeds}
    onconfig={() =>
      FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
    icon="fa-solid fa-rabbit-running"
  />

  <!-- Senses -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
    label={localize('DND5E.Senses')}
    entries={context.senses}
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

  <!-- Habitat -->
  <ActorTraitConfigurableListEntry
    configButtonLocation="label"
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
    configButtonLocation="label"
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
      configButtonLocation="label"
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
