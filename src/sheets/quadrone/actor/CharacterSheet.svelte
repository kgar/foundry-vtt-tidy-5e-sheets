<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import CharacterSubtitle from './character-parts/CharacterSubtitle.svelte';
  import CharacterExhaustionBar from './character-parts/CharacterExhaustionBar.svelte';
  import CharacterPortrait from './character-parts/CharacterPortrait.svelte';
  import AbilityScore from './character-parts/AbilityScore.svelte';
  import InspirationBadge from './character-parts/InspirationBadge.svelte';
  import CharacterSidebar from './character-parts/CharacterSidebar.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import { SvelteSet } from 'svelte/reactivity';
  import { untrack } from 'svelte';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';

  let context = $derived(getCharacterSheetQuadroneContext());

  let appId = $derived(context.actor.uuid.slugify());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let sidebarExpanded = $state(true);

  // When the user changes tabs, check their preference on the new tab and apply expanded state.
  $effect(() => {
    const type = untrack(() => context.actor.type);

    sidebarExpanded =
      SheetPreferencesService.getByType(type)?.tabs?.[selectedTabId]
        ?.sidebarExpanded ?? true;
  });

  // When the user expands or collapses the sidebar, remember their preference for this tab.
  $effect(() => {
    SheetPreferencesService.setDocumentTypeTabPreference(
      untrack(() => context.actor.type),
      untrack(() => selectedTabId),
      'sidebarExpanded',
      sidebarExpanded,
    );
  });

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

  let ini = $derived(getModifierData(context.system.attributes.init.total));

  let pb = $derived(getModifierData(context.system.attributes.prof ?? 0));

  let extraTabs = new SvelteSet<string>();
</script>

<header class="sheet-header flexcol theme-dark">
  <div class="sheet-header-content flexrow">
    <div class="actor-details-container flexcol">
      <div
        class="actor-context-row flexrow {context.enableXp ? 'show-xp' : ''}"
      >
        <div class="flexcol flex1">
          <div
            class="actor-details-name-row"
            data-tidy-sheet-part="name-header-row"
          >
            {#if context.unlocked}
              <TextInputQuadrone
                field="name"
                document={context.actor}
                value={context.actor.name}
                class="actor-name flex1 h1"
                data-tidy-sheet-part="actor-name"
              />
            {:else}
              <h1 class="actor-name flex1" data-tidy-sheet-part="actor-name">
                {context.actor.name}
              </h1>
            {/if}
            <div
              class={[
                'sheet-header-actions',
                'flexrow',
                { ['show-xp']: context.enableXp },
              ]}
              data-tidy-sheet-part="sheet-header-actions-container"
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
          <CharacterSubtitle />
        </div>
        <div class="level-container flex0 flexrow">
          <InspirationBadge />
          <div class="level-block">
            <span
              class="level bonus font-data-xlarge color-text-default"
              data-tooltip="DND5E.Level"
            >
              {context.system.details.level ?? 0}
            </span>
            <div
              class="proficiency flexrow"
              data-tooltip="DND5E.ProficiencyBonus"
            >
              <span class="label font-label-medium color-text-gold">
                {localize('DND5E.ProficiencyBonusAbbr')}
              </span>
              <span class="modifier font-label-medium color-text-lightest">
                {pb.sign}
              </span>
              <span class="value font-data-medium color-text-default">
                {pb.value}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class={[
          'abilities-container',
          { ['abilities-overflow']: context.abilities.length > 6 },
        ]}
      >
        <div class="abilities-container-inner flexrow">
          <div class="ac-container flexcol">
            <div
              class="shield"
              data-attribution="attributes.ac"
              data-attribution-caption="DND5E.ArmorClass"
              data-tooltip-direction="DOWN"
            >
              <span class="ac-value color-text-default">
                {context.system.attributes.ac.value}
              </span>
              <span class="ac-label font-label-medium color-text-gold">AC</span>
              {#if context.unlocked}
                <button
                  aria-label={localize('DND5E.ArmorConfig')}
                  data-tooltip="DND5E.ArmorConfig"
                  type="button"
                  class="button button-borderless button-icon-only button-config"
                  onclick={(ev) =>
                    FoundryAdapter.renderArmorConfig(context.actor)}
                >
                  <i class="fas fa-cog"></i>
                </button>
              {/if}
            </div>
            <div class="ability-labels flexcol">
              <span class="label font-label-medium color-text-gold">{localize('DND5E.AbilityScoreShort')}</span>
              <span class="divider"></span>
              <span class="label font-label-medium color-text-gold">{localize('DND5E.SavingThrowShort')}</span>
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
                <span class="modifier color-text-lightest">
                  {ini.sign}
                </span>
                <span class="bonus color-text-default">
                  {ini.value}
                </span>
              </div>
            </div>
            <!-- TODO: Set concentration bonus here, but then move the concentration indicator up to subtitle, below the action buttons. -->
            {#if context.saves.concentration}
              {@const save = context.saves.concentration}
              <div class="concentration flexcol">
                <div class="flexrow concentration-bonus">
                  {#if context.isConcentrating}
                    <i
                      class="active-concentration-icon fas fa-arrow-rotate-left fa-spin fa-spin-reverse"
                      aria-label={localize('DND5E.Concentration')}
                    ></i>
                  {:else}
                    <i class="fas fa-head-side-brain color-text-gold"></i>
                  {/if}
                  <span class="modifier font-label-medium color-text-lightest">
                    {save.sign}
                  </span>
                  <span class="value font-data-medium color-text-default">
                    {save.mod}
                  </span>
                  {#if context.unlocked}
                    {@const tooltip = localize('DND5E.AbilityConfigure', {
                      ability: context.saves.concentration.label,
                    })}
                    <div class="config-container">
                      <button
                        aria-label={tooltip}
                        data-tooltip={tooltip}
                        type="button"
                        class="button button-borderless button-icon-only button-config"
                        onclick={() =>
                          FoundryAdapter.openConcentrationConfig(context.actor)}
                      >
                        <i class="fas fa-cog"></i>
                      </button>
                    </div>
                  {/if}
                </div>
                <button
                  type="button"
                  onclick={(event) =>
                    context.actor.rollConcentration({
                      event,
                      legacy: false,
                    })}
                  class="unbutton concentration-roll-button"
                >
                  <span class="label font-label-medium color-text-gold"
                    >{localize(save.label)}</span
                  >
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class="actor-vitals-container">
      <!-- TODO: Add switch for size -->
      <CharacterPortrait />
      <div class="actor-vitals">
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
        <div class="actor-vitals-row">
          {#if exhaustionBarFocused}
            <CharacterExhaustionBar
              level={exhaustionLevel}
              total={context.config.conditionTypes.exhaustion.levels}
              onClose={() => (exhaustionBarFocused = false)}
              onExhaustionLevelSet={async (level) => {
                await context.actor.update({
                  'system.attributes.exhaustion': level,
                });
              }}
            />
          {:else}
            {@const hdPct = Math.round(
              context.system.attributes.hd.max > 0
                ? (context.system.attributes.hd.value /
                    context.system.attributes.hd.max) *
                    100
                : 0,
            )}
            <div class="hd-row">
              <div
                class="meter progress hit-die"
                style="--bar-percentage: {hdPct}%"
              >
                <span class="label">
                  <div
                    class="value"
                    data-tooltip="TIDY5E.HitDice.Current.Label"
                  >
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
      cssClass="actor-tabs"
      tabContext={{ context, actor: context.actor }}
    />
  </div>
</header>
<div class="sheet-body">
  <div class="main-content">
    <div
      class={['sidebar flexcol', { expanded: sidebarExpanded }]}
      data-tidy-sheet-part="sidebar-container"
    >
      <CharacterSidebar />
    </div>

    <TabContents
      tabs={context.tabs}
      {selectedTabId}
      {extraTabs}
      cssClass="tidy-tab-contents"
    />

    <!-- Footers -->
    <!-- TODO: Temporarily moved to the inventory tab directly -->
    <!-- <CharacterInventoryFooter
      class={{ hidden: selectedTabId !== CONSTANTS.TAB_ACTOR_INVENTORY }}
    /> -->
    <!-- <CharacterSpellbookFooter
      class={{ hidden: selectedTabId !== CONSTANTS.TAB_ACTOR_SPELLBOOK }}
      tabId={selectedTabId}
    /> -->
  </div>
</div>
