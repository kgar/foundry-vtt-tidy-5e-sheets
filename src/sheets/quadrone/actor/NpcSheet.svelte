<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import NpcSubtitle from './npc-parts/NpcSubtitle.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import AbilityScore from './character-parts/AbilityScore.svelte';
  import NpcPortrait from './npc-parts/NpcPortrait.svelte';
  import NpcExhaustionBar from './npc-parts/NpcExhaustionBar.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import ActorSidebar from './character-parts/CharacterSidebar.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import NpcSidebar from './npc-parts/NpcSidebar.svelte';

  let context = $derived(getNpcSheetQuadroneContext());

  let appId = $derived(context.actor.uuid.slugify());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $state('');

  let sidebarExpanded = $state(false);

  let hpValueInputFocused = $state(false);
  let hpTempInputFocused = $state(false);
  let exhaustionBarFocused = $state(false);

  let hpValueInput = $state<TextInputQuadrone>();
  let hpTempInput = $state<TextInputQuadrone>();

  let hpValue = $derived(context.system.attributes?.hp?.value ?? 0);
  let hpMax = $derived(context.system.attributes?.hp?.max ?? 0);
  let hpPct = $derived(context.system.attributes?.hp?.pct ?? 0);
  let hpTemp = $derived(context.system.attributes?.hp?.temp ?? 0);
  let hpTempMax = $derived(context.system.attributes?.hp?.tempMax ?? 0);

  let exhaustionLevel = $derived(context.system.attributes.exhaustion);

  let extraTabs = new SvelteSet<string>();

  let ini = $derived(getModifierData(context.system.attributes.init.total));
</script>

<header class="sheet-header flexcol theme-dark">
  <div class="sheet-header-content flexrow">
    <div class="flexcol">
      <div class="npc-context-row flexrow">
        <div class="flexcol flex1">
          <div class="npc-details-name-row">
            {#if context.unlocked}
              <TextInputQuadrone
                field="name"
                document={context.actor}
                value={context.actor.name}
                class="npc-name flex1 h2"
              />
            {:else}
              <h1 class="npc-name flex1">{context.actor.name}</h1>
            {/if}
            <div class={['sheet-header-actions', 'flexrow']}>
              <button
                type="button"
                class="button button-icon-only short-rest button-gold"
                >(Magic wand thingy?)</button
              >
              <button
                type="button"
                class="button button-icon-only short-rest button-gold"
                data-tooltip="DND5E.REST.Short.Label"
                aria-label={localize('DND5E.REST.Short.Label')}
                onclick={() => context.actor.shortRest()}
                disabled={!context.editable}
              >
                <i class="fas fa-utensils"></i>
              </button>
              <button
                type="button"
                class="button button-icon-only long-rest button-gold"
                data-tooltip="DND5E.REST.Long.Label"
                aria-label={localize('DND5E.REST.Long.Label')}
                onclick={() => context.actor.longRest()}
                disabled={!context.editable}
              >
                <i class="fas fa-campground"></i>
              </button>
            </div>
          </div>
          <NpcSubtitle />
        </div>
        <div class="cr-container">CR Here</div>
      </div>
      <div
        class={[
          'abilities-container',
          { ['abilities-overflow']: context.abilities.length > 6 },
          'flexrow',
        ]}
      >
        <div class="initiative-container flexcol">
          <div class="initiative score" data-tooltip="DND5E.Initiative">
            <button
              type="button"
              class="initiative-roll-button"
              onclick={(event) =>
                context.actor.rollInitiativeDialog({ event: event })}
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
            <span class="label font-label-medium color-text-gold">Score</span>
            <span class="divider"></span>
            <span class="label font-label-medium color-text-gold">Save</span>
          </div>
        </div>
        {#each context.abilities as ability}
          <AbilityScore
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
          />
        {/each}
      </div>
    </div>
    <div class="npc-vitals-container">
      <NpcPortrait />
      <div class="npc-vitals">
        <div class="hp-row flexrow">
          <div
            class="meter progress hit-points"
            style="--bar-percentage: {hpPct.toFixed(0)}%"
          >
            <button
              type="button"
              class="label pointer"
              hidden={hpValueInputFocused}
              onclick={async (ev) => {
                hpValueInputFocused = true;
                hpValueInput?.selectText();
              }}
            >
              <div
                class="value"
                aria-label={localize('DND5E.HitPointsCurrent')}
              >
                {hpValue}
              </div>
              <div class="separator">/</div>
              <div class="max" aria-label={localize('DND5E.HitPointsMax')}>
                {hpMax}
              </div>
            </button>
            <TextInputQuadrone
              bind:this={hpValueInput}
              id="{appId}-system-attributes-hp"
              document={context.actor}
              field="system.attributes.hp.value"
              class="hp-input"
              value={hpValue}
              selectOnFocus={true}
              enableDeltaChanges={true}
              onfocus={() => (hpValueInputFocused = true)}
              onblur={() => (hpValueInputFocused = false)}
              blurAfterChange={true}
              hidden={!hpValueInputFocused}
            />
          </div>

          {#if !context.unlocked}
            {#if hpTemp > 0 || hpTempInputFocused}
              <!-- TODO: Convert to buttons -->
              <div
                class="temp-hp label pointer"
                hidden={hpTempInputFocused}
                onclick={async (ev) => {
                  hpTempInputFocused = true;
                  hpTempInput?.selectText();
                }}
              >
                <span class="modifier font-label-large color-text-lighter"
                  >+</span
                >
                <span
                  class="value font-data-large color-text-default"
                  data-tooltip="DND5E.HitPointsTemp">{hpTemp}</span
                >
              </div>
              <TextInputQuadrone
                bind:this={hpTempInput}
                id="{appId}-system-attributes-hp-temp"
                document={context.actor}
                field="system.attributes.hp.temp"
                class="hp-temp-input"
                value={hpTemp}
                selectOnFocus={true}
                enableDeltaChanges={true}
                onfocus={() => (hpTempInputFocused = true)}
                onblur={() => (hpTempInputFocused = false)}
                blurAfterChange={true}
                hidden={!hpTempInputFocused}
              />
            {:else}
              <button
                aria-label={localize('DND5E.HitPointsTemp')}
                data-tooltip="DND5E.HitPointsTemp"
                type="button"
                class="button button-borderless button-icon-only temp-hp"
                onclick={async (ev) => {
                  hpTempInputFocused = true;
                  hpTempInput?.selectText();
                }}
              >
                <i class="fas fa-hand-holding-heart"></i>
              </button>
            {/if}
          {:else}
            <button
              onclick={() =>
                FoundryAdapter.renderHitPointsDialog(context.actor)}
              aria-label={localize('DND5E.HitPointsConfig')}
              data-tooltip="DND5E.HitPointsConfig"
              type="button"
              class={[
                'button',
                'button-borderless',
                'button-icon-only',
                'button-config',
                { editMode: context.unlocked },
              ]}
            >
              <i class="fas fa-cog"></i>
            </button>
          {/if}
        </div>
        <div class="npc-vitals-row">
          {#if exhaustionBarFocused}
            <NpcExhaustionBar />
          {:else}
            <div class={['exhaustion', { exhausted: exhaustionLevel > 0 }]}>
              <button
                type="button"
                class="button button-borderless button-icon-only"
                aria-label={localize('DND5E.Exhaustion')}
                data-tooltip={'DND5E.Exhaustion'}
                onclick={() => (exhaustionBarFocused = !exhaustionBarFocused)}
              >
                <i class="fas fa-heart-pulse"></i>
                <span class="value">{exhaustionLevel}</span>
              </button>
            </div>
            <div class={['death-saves', { dying: context.showDeathSaves }]}>
              {#if context.unlocked}
                <button
                  aria-label={localize('DND5E.DeathSaveConfigure')}
                  data-tooltip="DND5E.DeathSaveConfigure"
                  type="button"
                  class="button button-borderless button-icon-only button-config"
                  onclick={(ev) =>
                    FoundryAdapter.renderDeathConfig(context.actor)}
                >
                  <i class="fas fa-cog"></i>
                </button>
              {:else}
                <button
                  type="button"
                  class="button button-borderless button-icon-only"
                  aria-label={localize('DND5E.DeathSave')}
                  data-tooltip="DND5E.DeathSave"
                  onclick={() => context.actor.sheet.toggleDeathSaves()}
                >
                  <i class="fas fa-skull"></i>
                </button>
              {/if}
            </div>
            <div>etc.</div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  <div class="tabs-row">
    <a
      class="sidebar-toggle button button-borderless"
      data-tooltip={localize(
        sidebarExpanded ? 'JOURNAL.ViewCollapse' : 'JOURNAL.ViewExpand',
      )}
      onclick={() => (sidebarExpanded = !sidebarExpanded)}
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
      cssClass="character-tabs"
      tabContext={{ context, actor: context.actor }}
    />
  </div>
</header>
<div class="sheet-body">
  <div class="main-content">
    <div class={['sidebar flexcol', { expanded: sidebarExpanded }]}>
      <NpcSidebar />
    </div>

    <TabContents
      tabs={context.tabs}
      {selectedTabId}
      {extraTabs}
      cssClass="tidy-tab-contents"
    />
  </div>
</div>
