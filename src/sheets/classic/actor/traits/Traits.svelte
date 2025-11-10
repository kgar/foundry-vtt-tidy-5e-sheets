<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContextV1, NpcSheetContext } from 'src/types/types';
  import TraitSection from './TraitSection.svelte';
  import TraitSectionTools from './TraitSectionTools.svelte';
  import { error } from 'src/utils/logging';
  import TraitSectionTags from './TraitSectionTags.svelte';
  import TraitSectionModifications from './TraitSectionModifications.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { isNil } from 'src/utils/data';

  let context =
    $derived(getSheetContext<ActorSheetContextV1 | NpcSheetContext>());

  interface Props {
    useSenses?: boolean;
    enableSpecialTraitsConfiguration?: boolean;
  }

  let { useSenses = true }: Props = $props();

  function getTags(obj: any): [key: string, value: string][] {
    return Object.entries<string>(obj).toSorted((a, b) =>
      (a[1] ?? a[0] ?? '').localeCompare(b[1] ?? b[0] ?? '', game.i18n.lang),
    );
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="traits">
  {#if context.actor.system.traits.important}
    <TraitSection
      title={localize('DND5E.HitDice')}
      iconCssClass="fa-solid fa-dice-d{context.system.attributes.hd
        .denomination}"
      show={true}
      useConfigureButton={false}
      traitCssClass="counter"
    >
      <span class="hit-dice-counter">
        {context.system.attributes.hd.value}/{context.system.attributes.hd.max}
      </span>
    </TraitSection>
  {/if}
  {#if context.system.attributes?.death && (context.isCharacter || context.actor.system.traits.important)}
    <TraitSection
      title={localize('DND5E.DeathSave')}
      iconCssClass="fa-solid fa-skull"
      show={context.unlocked}
      useConfigureButton={context.editable}
      configureButtonAction="death"
      configureButtonTitle={localize('DND5E.DeathSaveConfigure')}
      onConfigureClicked={() => FoundryAdapter.renderDeathConfig(context.actor)}
    />
  {/if}
  {#if useSenses && context.senses}
    {@const senses = getTags(context.senses)}
    <TraitSection
      title={localize('DND5E.Senses')}
      iconCssClass="fas fa-eye"
      configureButtonTitle={localize('DND5E.SensesConfig')}
      onConfigureClicked={() =>
        FoundryAdapter.renderMovementSensesConfig(context.actor, 'senses')}
      show={context.unlocked || !!senses.length}
      useConfigureButton={context.editable}
    >
      <TraitSectionTags tags={senses} />
    </TraitSection>
  {/if}

  {#if context.traits?.languages}
    <TraitSection
      traitCssClass={context.traits?.languages?.cssClass ?? ''}
      title={localize('DND5E.Languages')}
      iconCssClass="fas fa-comment"
      configureButtonTitle={localize('DND5e.TraitConfig', {
        trait: localize('DND5E.Languages'),
      })}
      onConfigureClicked={() =>
        new dnd5e.applications.actor.LanguagesConfig({
          document: context.actor,
        }).render({ force: true })}
      show={context.unlocked || !!context.traits.languages.length}
      useConfigureButton={context.editable}
    >
      <ul class="trait-list">
        {#each context.traits.languages as { label, value }}
          <li class="trait-tag">
            {label}
            {#if !isNil(value)}
              <span class="text-secondary">|</span>
              {value}
            {/if}
          </li>
        {/each}
      </ul>
    </TraitSection>
  {/if}

  {#if context.traits.traits?.di}
    {@const damageImmunities = getTags(context.traits.traits.di.selected)}
    <TraitSection
      traitCssClass={context.traits.traits?.di?.cssClass ?? ''}
      title={localize('DND5E.DamImm')}
      iconCssClass="fas fa-heart"
      configureButtonTitle={localize('DND5E.TraitConfig', {
        trait: localize('DND5E.DamImm'),
      })}
      onConfigureClicked={() =>
        FoundryAdapter.openDamagesConfig(context.actor, 'di')}
      show={context.unlocked || !!damageImmunities.length}
      useConfigureButton={context.editable}
    >
      <TraitSectionTags tags={damageImmunities} />
    </TraitSection>
  {/if}

  {#if context.traits.traits?.dr}
    {@const damageResistances = getTags(context.traits.traits.dr.selected)}
    <TraitSection
      traitCssClass={context.traits.traits?.dr?.cssClass ?? ''}
      title={localize('DND5E.DamRes')}
      iconCssClass="far fa-heart"
      configureButtonTitle={localize('DND5E.TraitConfig', {
        trait: localize('DND5E.DamRes'),
      })}
      onConfigureClicked={() =>
        FoundryAdapter.openDamagesConfig(context.actor, 'dr')}
      show={context.unlocked || !!damageResistances.length}
      useConfigureButton={context.editable}
    >
      <TraitSectionTags tags={damageResistances} />
    </TraitSection>
  {/if}

  {#if context.traits.traits?.dv}
    {@const vulnerabilities = getTags(context.traits.traits.dv.selected)}
    <TraitSection
      traitCssClass={context.traits.traits?.dv?.cssClass ?? ''}
      title={localize('DND5E.DamVuln')}
      iconCssClass="fas fa-heart-broken"
      configureButtonTitle={localize('DND5E.TraitConfig', {
        trait: localize('DND5E.DamVuln'),
      })}
      onConfigureClicked={() =>
        FoundryAdapter.openDamagesConfig(context.actor, 'dv')}
      show={context.unlocked || !!vulnerabilities.length}
      useConfigureButton={context.editable}
    >
      <TraitSectionTags tags={vulnerabilities} />
    </TraitSection>
  {/if}

  {#if context.traits.traits?.dm}
    <TraitSection
      title={localize('DND5E.DamageModification.Label')}
      iconCssClass="fas fa-heart-circle-plus"
      configureButtonTitle={localize('DND5E.TraitConfig', {
        trait: localize('DND5E.DamageModification.Label'),
      })}
      onConfigureClicked={() =>
        FoundryAdapter.openDamagesConfig(context.actor, 'dm')}
      show={context.unlocked || !!context.traits.traits.dm.length}
      useConfigureButton={context.editable}
    >
      <TraitSectionModifications modifications={context.traits.traits?.dm} />
    </TraitSection>
  {/if}

  {#if context.traits.traits?.ci}
    {@const conditionImmunities = getTags(context.traits.traits.ci.selected)}
    <TraitSection
      traitCssClass={context.traits.traits?.ci?.cssClass ?? ''}
      title={localize('DND5E.ConImm')}
      iconCssClass="fas fa-shield-virus"
      configureButtonTitle={localize('DND5E.TraitConfig', {
        trait: localize('DND5E.ConImm'),
      })}
      onConfigureClicked={() =>
        FoundryAdapter.renderTraitsConfig(context.actor, 'ci')}
      show={context.unlocked || !!conditionImmunities.length}
      useConfigureButton={context.editable}
    >
      <TraitSectionTags tagCssClass="capitalize" tags={conditionImmunities} />
    </TraitSection>
  {/if}

  {#if context.traits.traits?.weaponProf}
    {@const weaponProfs = getTags(context.traits.traits.weaponProf.selected)}
    <TraitSection
      traitCssClass={context.traits.traits?.weaponProf?.cssClass ?? ''}
      title={localize('DND5E.TraitWeaponProf')}
      configureButtonTitle={localize('DND5E.TraitConfig', {
        trait: localize('DND5E.TraitWeaponProf'),
      })}
      onConfigureClicked={() =>
        FoundryAdapter.renderWeaponsConfig(context.actor)}
      show={context.unlocked || !!weaponProfs.length}
      useConfigureButton={context.editable}
    >
      {#snippet customIcon()}
        <svg x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve">
          <path
            d="M443.7,2.6c-2.2-2.5-5.8-3.3-8.8-1.8C417.9,9,358.8,36.1,304.4,43.5c-4.1,0.6-8-0.3-11.3-2.1c-1.5-0.8-2.4-2.5-2.4-4.2v0
          c0-10.7-8.7-19.4-19.5-19.4h-30.5c-10.7,0-19.5,8.7-19.5,19.4v0c0,1.7-0.9,3.4-2.4,4.2c-3.3,1.8-7.2,2.7-11.3,2.1
          C153.2,36.1,94.2,9,77.1,0.7c-3-1.5-6.6-0.7-8.8,1.8C56.3,16.4,21,64.9,21,154.9c0,83.4,30.3,143.6,44.3,166.9
          c2.9,4.9,10,4.7,12.8-0.2c10.5-19,34-59.1,62-91.7c0.4-0.5,0.9-1,1.3-1.5c28.3-30.7,79.9-9.8,79.9,32v232.2
          c0,10.7,8.7,19.4,19.5,19.4h30.5c10.7,0,19.5-8.7,19.5-19.4V260.4c0-41.8,51.5-62.7,79.9-32c0.4,0.5,0.9,1,1.3,1.5
          c28,32.6,51.5,72.7,62,91.7c2.8,5,9.9,5.1,12.8,0.2c14-23.3,44.3-83.4,44.3-166.9C491,64.9,455.7,16.4,443.7,2.6z"
          />
        </svg>
      {/snippet}

      <TraitSectionTags tags={weaponProfs}>
        {#snippet children({ key, value })}
          {#if context.traits.traits.weaponProf.mastery.value.has(key)}
            <i
              title={localize('DND5E.WEAPON.Mastery.Label')}
              class="fas fa-medal"
            ></i>
          {/if}
          {value}
        {/snippet}
      </TraitSectionTags>
    </TraitSection>
  {/if}

  {#if context.traits.traits?.armorProf}
    {@const armorProfs = getTags(context.traits.traits.armorProf.selected)}
    <TraitSection
      traitCssClass={context.traits.traits?.armorProf?.cssClass ?? ''}
      title={localize('DND5E.TraitArmorProf')}
      configureButtonTitle={localize('DND5E.TraitConfig', {
        trait: localize('DND5E.TraitArmorProf'),
      })}
      onConfigureClicked={() =>
        FoundryAdapter.renderTraitsConfig(context.actor, 'armor')}
      show={context.unlocked || !!armorProfs.length}
      useConfigureButton={context.editable}
    >
      {#snippet customIcon()}
        <svg x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve">
          <path
            d="M471.7,198.8c0-56.6-37.8-107.3-81.7-147.1c-76-68.9-191.9-68.9-268,0c-43.9,39.8-81.7,90.5-81.7,147.1
        c0,93-3.2,163.9-12.5,203c-3.9,16.2,4,33,18.3,39.6l113.6,66.3c27.9,13.6,60.3-6.7,60.3-37.7V258.3c0-5.2-3.3-9.8-8.3-11.5
        l-91.3-30.4c-4.9-1.6-8.3-6.3-8.3-11.5v-15.1c0-6.7,5.4-12.1,12.1-12.1h263.4c6.7,0,12.1,5.4,12.1,12.1v15.1c0,5.2-3.3,9.8-8.3,11.5
        l-91.3,30.4c-4.9,1.6-8.3,6.3-8.3,11.5V470c0,31,32.5,51.3,60.3,37.7l113.6-66.3c14.3-6.6,22.2-23.4,18.3-39.6
        C474.9,362.7,471.7,291.8,471.7,198.8L471.7,198.8z"
          />
        </svg>
      {/snippet}

      <TraitSectionTags tags={armorProfs} />
    </TraitSection>
  {/if}

  {#if context.traits.tools}
    {@const tools = Object.entries(context.tools)}
    <TraitSection
      traitCssClass={context.traits.tools?.toolProf?.cssClass ?? ''}
      title={localize('DND5E.TraitToolProf')}
      iconCssClass="fas fa-hammer"
      configureButtonTitle={localize('DND5E.TraitConfig', {
        trait: localize('DND5E.TraitToolProf'),
      })}
      onConfigureClicked={() => FoundryAdapter.renderToolsConfig(context.actor)}
      show={context.unlocked || !!tools.length}
      useConfigureButton={context.editable}
    >
      {#if tools.length}
        <TraitSectionTools {tools} />
      {/if}
    </TraitSection>
  {/if}

  {#if context.isNPC && 'habitat' in context}
    <TraitSection
      title={localize('DND5E.Habitat.Configuration.Label')}
      iconCssClass="fa-solid fa-mountain-sun"
      configureButtonTitle={localize('DND5E.Habitat.Configuration.Title')}
      onConfigureClicked={(ev) =>
        new dnd5e.applications.actor.HabitatConfig({
          document: context.actor,
        }).render({ force: true })}
      show={context.unlocked || !!context.habitat.length}
      useConfigureButton={context.editable}
    >
      <ul class="trait-list">
        {#each context.habitat as { label }}
          <li class="trait-tag">
            {label}
          </li>
        {/each}
      </ul>
    </TraitSection>
  {/if}

  {#if context.isNPC && 'treasure' in context}
    <TraitSection
      title={localize('DND5E.Treasure.Configuration.Label')}
      iconCssClass="fa-solid fa-gem"
      configureButtonTitle={localize('DND5E.Treasure.Configuration.Title')}
      onConfigureClicked={() =>
        new dnd5e.applications.actor.TreasureConfig({
          document: context.actor,
        }).render({ force: true })}
      show={context.unlocked || !!context.treasure.length}
      useConfigureButton={context.editable}
    >
      <ul class="trait-list">
        {#each context.treasure as { label }}
          <li class="trait-tag">
            {label}
          </li>
        {/each}
      </ul>
    </TraitSection>
  {/if}

  {#if context.customActorTraits?.length}
    {#each context.customActorTraits as trait}
      <TraitSection
        title={trait.title}
        iconCssClass={trait.iconClass}
        configureButtonTitle={trait.openConfigurationTooltip ?? ''}
        onConfigureClicked={(ev) => {
          try {
            trait.openConfiguration?.({
              app: context.actor.sheet,
              data: context,
              element: context.actor.sheet.element,
              event: ev,
            });
          } catch (e) {
            error(
              'An error occurred while handling trait configuration click event',
              false,
              e,
            );
          }
        }}
        show={trait.alwaysShow || context.unlocked}
        useConfigureButton={!!trait.openConfiguration}
      />
    {/each}
  {/if}
</div>

<style lang="less">
  .traits {
    border: 0.0625rem solid var(--t5e-faint-color);
    border-radius: 0.3125rem 0.3125rem 0 0;
    overflow: visible;
    position: relative;
    margin-bottom: 0.75rem; // Accounts for floating button to configure flags

    :global(.trait-form-group:nth-child(odd)) {
      background: none;
    }

    :global(.trait-form-group:nth-child(even)) {
      background: var(--t5e-faint-color);
    }

    svg {
      height: 0.75rem;
      width: 0.875rem;

      path {
        fill: var(--t5e-tertiary-color);
      }
    }

    .toggle-traits {
      position: absolute;
      display: inline-block;
      top: calc(100% + 0.0625rem);
      left: -0.0625rem;
      border: 0.0625rem solid var(--t5e-faint-color);
      border-top: 0;
      border-radius: 0 0 0.1875rem 0.1875rem;
      padding: 0.125rem 0.25rem;
      font-size: 0.625rem;
      color: var(--t5e-secondary-color);
    }

    .toggle-traits:hover {
      color: var(--t5e-primary-font-color);
    }

    .configure-special-traits {
      flex: 0;
      position: absolute;
      display: inline-block;
      top: calc(100% + 0.0625rem);
      right: -0.0625rem;
      border: 0.0625rem solid var(--t5e-faint-color);
      border-top: 0;
      border-radius: 0 0 0.1875rem 0.1875rem;
      padding: 0.125rem 0.25rem;
      font-size: 0.625rem;
    }

    .configure-special-traits i.fas {
      line-height: 0.625rem;
      vertical-align: baseline;
    }

    :global(.counter .trait-label-and-list) {
      display: flex;
      align-items: end;
    }

    :global(.counter .trait-label) {
      flex: 1;
    }

    :global(.counter .hit-dice-counter) {
      flex: 0;
      margin-inline-start: auto;
      margin-inline-end: 0.25rem;
      font-size: 0.75rem;
    }

    .text-secondary {
      color: var(--t5e-tertiary-color);
    }
  }
</style>
