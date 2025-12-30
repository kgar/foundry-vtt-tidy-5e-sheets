<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { untrack } from 'svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import VehicleSidebar from './vehicle-parts/VehicleSidebar.svelte';
  import VehicleSubtitle from './vehicle-parts/VehicleSubtitle.svelte';
  import AbilitiesContainer from './parts/AbilitiesContainer.svelte';
  import ActorPortrait from './parts/ActorPortrait.svelte';
  import ActorHealthBar from './parts/ActorHealthBar.svelte';
  import AbilityScoreNPC from './character-parts/AbilityScoreNPC.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { getModifierData } from 'src/utils/formatting';
  import clsx from 'clsx';

  let context = $derived(getVehicleSheetQuadroneContext());

  let selectedTabId: string = $derived(context.currentTabId);
  let extraTabs = new SvelteSet<string>();

  let sidebarExpanded = $state(true);

  // When the user changes tabs, check their preference on the new tab and apply expanded state.
  $effect(() => {
    const type = untrack(() => context.actor.type);

    sidebarExpanded =
      UserSheetPreferencesService.getByType(type)?.tabs?.[selectedTabId]
        ?.sidebarExpanded == true;
  });

  // When the user expands or collapses the sidebar, remember their preference for this tab.
  $effect(() => {
    UserSheetPreferencesService.setDocumentTypeTabPreference(
      untrack(() => context.actor.type),
      untrack(() => selectedTabId),
      'sidebarExpanded',
      sidebarExpanded,
    );
  });

  let ini = $derived(getModifierData(context.system.attributes.init.total));

  const localize = FoundryAdapter.localize;
</script>

<header
  class={clsx('sheet-header', 'flexcol', {
    'theme-dark': context.themeSettings.useHeaderBackground,
  })}
>
  <div class="sheet-header-content flexrow">
    <div class="actor-details-container flexcol">
      <div class="actor-context-row flexrow">
        <div class="flexcol flex1">
          <div class="actor-details-name-row">
            {#if context.unlocked}
              <TextInputQuadrone
                field="name"
                document={context.actor}
                value={context.actor.name}
                class="actor-name flex1 h2"
              />
            {:else}
              <h1 class="actor-name flex1">{context.actor.name}</h1>
            {/if}
            <div
              class={['sheet-header-actions', 'flexrow']}
              data-tidy-sheet-part="sheet-header-actions-container"
            >
              {#if context.editable}
                <button
                  type="button"
                  class="button repair-vehicle button-gold"
                  data-tooltip="TIDY5E.Vehicle.Repair.Label"
                  aria-label={localize('TIDY5E.Vehicle.Repair.Label')}
                  onclick={() => context.actor.repair()}
                  disabled={!context.editable}
                >
                  <i class="fas fa-wrench"></i>
                  {localize('TIDY5E.Vehicle.Repair.Label')}
                </button>
              {/if}
            </div>
          </div>
          <VehicleSubtitle />
        </div>
      </div>
      <AbilitiesContainer
        collapsedAbilityThresholdRems={3.5}
        smallerAbilityThresholdRems={4}
        constantHorizontalSpaceRems={20.5}
      >
        <div class="initiative-container flexcol">
          <div
            class="initiative score bonus-container"
            data-tooltip="DND5E.Initiative"
          >
            <button
              type="button"
              class="button-borderless initiative-roll-button"
              onclick={(event) =>
                context.actor.rollInitiativeDialog({ event: event })}
              data-has-roll-modes
            >
              {localize('DND5E.InitiativeAbbr')}
            </button>
            {#if context.unlocked}
              <button
                aria-label={localize('DND5E.InitiativeConfig')}
                data-tooltip="DND5E.InitiativeConfig"
                type="button"
                class="button button-borderless button-icon-only button-config"
                onclick={() =>
                  FoundryAdapter.renderInitiativeConfig(context.actor)}
              >
                <i class="fas fa-cog"></i>
              </button>
            {/if}
            <div class="initiative-bonus flexrow">
              <span class="modifier color-text-lightest font-label-xlarge">
                {ini.sign}
              </span>
              <span class="bonus color-text-default font-data-xlarge">
                {ini.value}
              </span>
            </div>
          </div>
          <div class="ability-labels flexcol">
            <span class="label font-label-medium color-text-lightest"
              >{localize('DND5E.AbilityScoreShort')}</span
            >
            <span class="divider"></span>
            <span class="label font-label-medium color-text-lightest"
              >{localize('DND5E.SavingThrowShort')}</span
            >
          </div>
        </div>
        {#each context.abilities as ability}
          <AbilityScoreNPC
            {ability}
            unlocked={context.unlocked}
            onScoreChanged={(score) =>
              context.actor.update({
                [`system.abilities.${ability.key}.value`]: score,
              })}
            onConfigClicked={(id) =>
              FoundryAdapter.renderAbilityConfig(context.actor, id)}
            onRollAbility={(event, key) =>
              context.actor.rollAbilityCheck({ ability: key, event })}
            onRollSave={(event, key) =>
              context.actor.rollSavingThrow({ ability: key, event })}
            disabled={!context.owner}
          />
        {/each}
      </AbilitiesContainer>
    </div>
    <div class="actor-vitals-container">
      <ActorPortrait />
      <div
        class={[
          'actor-vitals npc-vitals theme-dark',
          { 'view-only': !context.editable },
        ]}
      >
        <ActorHealthBar />
        {#if context.editable}
          <div class="actor-vitals-row">
            <div class="dr-container">
              <span class="label font-label-medium color-text-gold"> DR </span>
              <span class="value font-data-medium color-text-default">
                15
              </span>
            </div>
            <button
              type="button"
              class="roll-hp button button-borderless button-icon-only"
              aria-label="{localize('DND5E.HitDiceRoll')} / {localize(
                'TIDY5E.HitDiceRollAverage',
              )}"
              data-tooltip
              onclick={() => context.sheet.rollFormula()}
              oncontextmenu={() => context.sheet.applyAverageHP()}
              disabled={!context.editable}
            >
              <i class="fas fa-dice"></i>
            </button>
          </div>
        {/if}
      </div>
      <div
        class="shield"
        data-attribution="attributes.ac"
        data-attribution-caption="DND5E.ArmorClass"
        data-tooltip-direction="DOWN"
      >
        <span class="ac-label font-label-medium color-text-gold"
          >{localize('DND5E.AC')}</span
        >
        <span class="ac-value color-text-default">
          {context.system.attributes.ac.value}
        </span>
        {#if context.unlocked}
          <button
            aria-label={localize('DND5E.ArmorConfig')}
            data-tooltip="DND5E.ArmorConfig"
            type="button"
            class="button button-borderless button-icon-only button-config"
            onclick={(ev) => FoundryAdapter.renderArmorConfig(context.actor)}
          >
            <i class="fas fa-cog"></i>
          </button>
        {/if}
      </div>
    </div>
  </div>
  <div class="tabs-row">
    <a
      role="button"
      tabindex="0"
      class="sidebar-toggle button button-borderless"
      data-tooltip={localize(
        sidebarExpanded ? 'JOURNAL.ViewCollapse' : 'JOURNAL.ViewExpand',
      )}
      onclick={() => (sidebarExpanded = !sidebarExpanded)}
      onkeydown={(ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          sidebarExpanded = !sidebarExpanded;
        }
      }}
    >
      {#if sidebarExpanded}
        <i class="fa-solid fa-caret-left"></i>
        <i class="fa-solid fa-sidebar-flip"></i>
      {:else}
        <i class="fa-solid fa-sidebar"></i>
        <i class="fa-solid fa-caret-right"></i>
      {/if}
    </a>
    <Tabs
      bind:selectedTabId
      {extraTabs}
      tabs={context.tabs}
      sheet={context.actor.sheet}
      cssClass="actor-tabs"
      tabContext={{ context, actor: context.actor }}
    />
  </div>
</header>

<div class="sheet-body">
  <div class="main-content">
    <div class={['sidebar flexcol', { expanded: sidebarExpanded }]}>
      <VehicleSidebar />
    </div>

    <TabContents
      tabs={context.tabs}
      {selectedTabId}
      {extraTabs}
      cssClass="tidy-tab-contents"
    />
  </div>
</div>
