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
  import ActorSidebar from './character-parts/ActorSidebar.svelte';
  import { getModifierData } from 'src/utils/formatting';

  let context = $derived(getCharacterSheetQuadroneContext());

  let appId = $derived(context.actor.uuid.slugify());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $state('');

  let sidebarExpanded = $state(false);

  let hpValueInputFocused = $state(false);
  let hpTempInputFocused = $state(false);
  let hdValueInputFocused = $state(false);
  let exhaustionBarFocused = $state(false);
  let dying = $state(false);
  let showXp = $state(false);

  let hpValueInput = $state<TextInputQuadrone>();
  let hpTempInput = $state<TextInputQuadrone>();
  let hdValueInput = $state<TextInputQuadrone>();

  let hpValue = $derived(context.system.attributes?.hp?.value ?? 0);
  let hpMax = $derived(context.system.attributes?.hp?.max ?? 0);
  let hpPct = $derived(context.system.attributes?.hp?.pct ?? 0);
  let hpTemp = $derived(context.system.attributes?.hp?.temp ?? 10);
  let hpTempMax = $derived(context.system.attributes?.hp?.tempMax ?? 0);

  let hdValue = 2;
  let hdMax = 2;
  let hdPct = 1;

  let portraitShape = 'transparent';
  let exhaustionLevel = $derived(context.system.attributes.exhaustion);

  let ini = $derived(getModifierData(context.system.attributes.init.total));

  let pb = $derived(getModifierData(context.system.attributes.prof ?? 0));
</script>

<!-- TODO: Header bar needs to always be in dark mode -->
<header class="sheet-header flexcol theme-dark">
  <div class="flexrow">
    <div class="character-vitals-container">
      <!-- TODO: Add switch for size -->
      <CharacterPortrait
        imageUrl={context.actor.img}
        imageAlt={context.actor.name}
        {portraitShape}
        showDeathSaves={dying}
      />
      <div class="character-vitals">
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
              <div class="value" aria-label="Current HP">{hpValue}</div>
              <div class="separator">/</div>
              <div class="max" aria-label="Max HP">{hpMax}</div>
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
                  title="Temporary HP">{hpTemp}</span
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
                aria-label="Temporary HP"
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
        <div class="character-vitals-row">
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
            <div class="hd-row">
              <div
                class="meter progress hit-die"
                style="--bar-percentage: 100%"
              >
                <button
                  type="button"
                  class="label pointer"
                  hidden={hdValueInputFocused}
                  onclick={async (ev) => {
                    hdValueInputFocused = true;
                    hdValueInput?.selectText();
                  }}
                >
                  <div class="value" title="Current Hit Die">{hdValue}</div>
                  <div class="separator">/</div>
                  <div class="max" title="Max Hit Die">{hdMax}</div>
                  <div class="hd-label" title="Hit Die">HD</div>
                </button>
                <TextInputQuadrone
                  bind:this={hdValueInput}
                  id="{appId}-system-attributes-hd"
                  document={context.actor}
                  field="system.attributes.hd.value"
                  class="hd-input"
                  value={hdValue}
                  selectOnFocus={true}
                  enableDeltaChanges={true}
                  onfocus={() => (hdValueInputFocused = true)}
                  onblur={() => (hdValueInputFocused = false)}
                  blurAfterChange={true}
                  hidden={!hdValueInputFocused}
                />
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
                aria-label="Exhaustion"
                onclick={() => (exhaustionBarFocused = !exhaustionBarFocused)}
              >
                <i class="fas fa-heart-pulse"></i>
                <span class="value">{exhaustionLevel}</span>
              </button>
            </div>
            <div class={['death-saves', { dying }]}>
              <button
                type="button"
                class="button button-borderless button-icon-only"
                aria-label="Death Saves"
                onclick={() => (dying = !dying)}
              >
                <i class="fas fa-skull"></i>
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
    <div class="flexcol">
      <div class="flexrow">
        <div class="flexcol flex1">
          <div class="character-details-name-row">
            {#if context.unlocked}
              <TextInputQuadrone
                field="name"
                document={context.actor}
                value={context.actor.name}
                class="character-name flex1"
              />
            {:else}
              <h1 class="character-name flex1">{context.actor.name}</h1>
            {/if}
            <div
              class={[
                'sheet-header-actions',
                'flexrow',
                { ['show-xp']: showXp },
              ]}
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
            {#if context.unlocked}
              <button
                aria-label="Configure Armor Class"
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
        <div class="initiative-container flexcol">
          <div class="initiative score" data-tooltip="DND5E.Initiative">
            <div class="initiative-bonus flexrow">
              <span class="modifier color-text-lightest">
                {ini.sign}
              </span>
              <span class="value color-text-default">
                {ini.value}
              </span>
            </div>
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
                aria-label="Configure Initiative"
                type="button"
                class="button button-borderless button-icon-only button-config"
                onclick={() =>
                  FoundryAdapter.renderInitiativeConfig(context.actor)}
              >
                <i class="fas fa-cog"></i>
              </button>
            {/if}
          </div>
          <!-- TODO: Set concentration bonus here, but then move the concentration indicator up to subtitle, below the action buttons. -->
          {#if context.saves.concentration}
            {@const save = context.saves.concentration}
            <div class="concentration flexcol">
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
              <div class="flexrow concentration-bonus">
                {#if context.isConcentrating}
                  <i
                    class="active-concentration-icon fas fa-arrow-rotate-left fa-spin fa-spin-reverse"
                    aria-label="Concentration"
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
                  <div class="config-container">
                    <button
                      aria-label="Configure Concentration"
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
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  <div class="tabs-row">
    <a
      class="sidebar-toggle button button-borderless"
      title={localize(
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
      tabs={context.tabs}
      sheet={context.actor.sheet}
      cssClass="character-tabs"
      tabContext={{ context, actor: context.actor }}
    />
  </div>
</header>
<div class="main-content">
  <div class={['sidebar', { expanded: sidebarExpanded }]}>
    <ActorSidebar />
  </div>
  <TabContents tabs={context.tabs} {selectedTabId} />
</div>
