<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import CharacterSubtitle from './character-parts/CharacterSubtitle.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  let appId = $derived(context.actor.uuid.slugify());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $state('');

  let sidebarExpanded = $state(false);

  let hpValueInputFocused = $state(false);
  let hdValueInputFocused = $state(false);

  let hpValueInput = $state<TextInputQuadrone>();
  let hdValueInput = $state<TextInputQuadrone>();

  let hpValue = $derived(context.system.attributes?.hp?.value ?? 0);
  let hpMax = $derived(context.system.attributes?.hp?.max ?? 0);
  let hpPct = $derived(context.system.attributes?.hp?.pct ?? 0);
  let hpTemp = $derived(context.system.attributes?.hp?.temp ?? 0);
  let hpTempMax = $derived(context.system.attributes?.hp?.tempMax ?? 0);
  
  let hdValue = 2;
  let hdMax = 2;
  let hdPct = 1;
  
  let unlocked = true; // TODO: Replace with context.unlocked
  let portraitShape = 'transparent';
  let exhaustionLevel = 1;
  let deathSaves = {
    dying: true,
    successes: 0,
    failures: 0,
  };
</script>

<header class="sheet-header flexcol">
    <div class="flexrow">
      <div class="character-vitals-container">
        <!-- TODO: Add switch for size -->
        <div class="character-image {portraitShape}">
          <img src={context.actor.img} alt={context.actor.name} />
        </div>
        <div class="character-vitals">
          <div class="hp-row">
            <div
              class="meter progress hit-points"
              style="--bar-percentage: {hpPct.toFixed(0)}%"
            >
              <div
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
              </div>
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
              {#if !unlocked}
              <button
                aria-label="Temporary HP"
                type="button"
                class="button button-borderless button-icon-only temp-hp">
                <i class="fas fa-hand-holding-heart"></i>
              </button>
              {:else}
              <button
                aria-label="Configure HP"
                type="button"
                class="button button-borderless button-icon-only button-config temp-hp">
                <i class="fas fa-cog"></i>
              </button>
              {/if}
            </div>
          </div>
          <div class="character-vitals-row">
            <div class="hd-row">
              <div class="meter progress hit-die" style="--bar-percentage: 100%">
                <div
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
                </div>
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
                {#if unlocked}
                <button
                  aria-label="Configure Hit Die"
                  type="button"
                  class="button button-borderless button-icon-only button-config">
                  <i class="fas fa-cog"></i>
                </button>
                {/if}
              </div>
            </div>
            <!-- TODO: Add exhaustion using .exhausted class -->
            <div class="exhaustion {exhaustionLevel > 0 ? 'exhausted' : ''}">
              <button
                type="button"
                class="button button-borderless button-icon-only"
                aria-label="Exhaustion"
              >
                <i class="fas fa-heart-pulse"></i>
                <span class="value">{exhaustionLevel}</span>
              </button>
            </div>
            <div class="death-saves {deathSaves.dying ? 'dying' : ''}">
              <button
                type="button"
                class="button button-borderless button-icon-only"
                aria-label="Death Saves"
              >
                <i class="fas fa-skull"></i>
              </button>
            </div>
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
              <div class="sheet-header-actions">
                <button
                  type="button"
                  class="button button-tertiary button-icon-only short-rest gold-button"
                  data-tooltip="DND5E.REST.Short.Label"
                  aria-label={localize('DND5E.REST.Short.Label')}
                  onclick={() => context.actor.shortRest()}
                  disabled={!context.editable}
                >
                  <i class="fas fa-utensils"></i>
                </button>
                <button
                  type="button"
                  class="button button-tertiary button-icon-only long-rest gold-button"
                  data-tooltip="DND5E.REST.Long.Label"
                  aria-label={localize('DND5E.REST.Long.Label')}
                  onclick={() => context.actor.longRest()}
                  disabled={!context.editable}
                >
                  <i class="fas fa-campground"></i>
                  </button>
              </div>
            </div>
            <div class="character-details-subtitle-row">
              <CharacterSubtitle />
            </div>
          </div>
          <div class="level-container flex0 flexrow">
            <button 
              type="button"
              class="inspiration single button button-borderless button-icon-only"
              aria-label="Inspiration">
            </button>
            <div class="level-block">
              <span class="level bonus" title="Level">5</span>
              <div class="proficiency flexrow">
                <span class="label" title="Proficiency Bonus">PB</span>
                <span class="modifier">+</span>
                <span class="value" title="Proficiency Bonus Modifier">2</span>
              </div>
            </div>
          </div>
        </div>
        <div class="abilities-container">
        <div class="ac-container flexcol">
          <div class="shield">
            <span class="ac-value" title="Armor Class">14</span>
            {#if unlocked}
            <button
              aria-label="Configure Armor Class"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
            {/if}
          </div>
          <div class="ability-labels flexcol">
            <span class="label">Score</span>
            <span class="divider"></span>
            <span class="label">Save</span>
          </div>
        </div>
        <div class="ability strength">
          <div class="bonus-container proficient">
            <span class="label">STR</span>
            <div class="flexrow">
              <span class="modifier">+</span>
              <span class="value bonus">2</span>
            </div>
            {#if unlocked}
            <button
              aria-label="Configure Strength"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
            {/if}
          </div>
          <div class="ability-score">
            <span>14</span>
          </div>
          <div class="ability-save flexrow">
            <span class="modifier">+</span>
            <span class="value save">4</span>
            <span class="icon"><i class="fas fa-shield-heart"></i></span>
          </div>
        </div>
        <div class="ability dexterity">
          <div class="bonus-container">
            <span class="label">DEX</span>
            <div class="flexrow">
              <span class="modifier">+</span>
              <span class="value bonus">2</span>
            </div>
            {#if unlocked}
            <button
              aria-label="Configure Dexterity"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
            {/if}
          </div>
          <div class="ability-score">
            <span>14</span>
          </div>
          <div class="ability-save flexrow">
            <span class="modifier">+</span>
            <span class="value save">4</span>
            <span class="icon"><i class="fas fa-shield-heart"></i></span>
          </div>
        </div>
        <div class="ability constitution">
          <div class="bonus-container proficient">
            <span class="label">CON</span>
            <div class="flexrow">
              <span class="modifier">+</span>
              <span class="value bonus">2</span>
            </div>
            {#if unlocked}
            <button
              aria-label="Configure Constitution"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
            {/if}
          </div>
          <div class="ability-score">
            <span>14</span>
          </div>
          <div class="ability-save flexrow">
            <span class="modifier">+</span>
            <span class="value save">4</span>
            <span class="icon"><i class="fas fa-shield-heart"></i></span>
          </div>
        </div>
        <div class="ability intelligence">
          <div class="bonus-container">
            <span class="label">INT</span>
            <div class="flexrow">
              <span class="modifier">+</span>
              <span class="value bonus">2</span>
            </div>
            {#if unlocked}
            <button
              aria-label="Configure Intelligence"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
            {/if}
          </div>
          <div class="ability-score">
            <span>14</span>
          </div>
          <div class="ability-save flexrow">
            <span class="modifier">+</span>
            <span class="value save">4</span>
            <span class="icon"><i class="fas fa-shield-heart"></i></span>
          </div>
        </div>
        <div class="ability wisdom">
          <div class="bonus-container">
            <span class="label">WIS</span>
            <div class="flexrow">
              <span class="modifier">+</span>
              <span class="value bonus">2</span>
            </div>
            {#if unlocked}
            <button
              aria-label="Configure Wisdom"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
            {/if}
          </div>
          <div class="ability-score">
            <span>14</span>
          </div>
          <div class="ability-save flexrow">
            <span class="modifier">+</span>
            <span class="value save">4</span>
            <span class="icon"><i class="fas fa-shield-heart"></i></span>
          </div>
        </div>
        <div class="ability charisma">
          <div class="bonus-container">
            <span class="label">CHA</span>
            <div class="flexrow">
              <span class="modifier">+</span>
              <span class="value bonus">2</span>
            </div>
            {#if unlocked}
            <button
              aria-label="Configure Charisma"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
            {/if}
          </div>
          <div class="ability-score">
            <span>14</span>
          </div>
          <div class="ability-save flexrow">
            <span class="modifier">+</span>
            <span class="value save">4</span>
            <span class="icon"><i class="fas fa-shield-heart"></i></span>
          </div>
        </div>
        <!-- <div class="ability sanity">
          <div class="bonus-container">
            <span class="label">SAN</span>
            <div class="flexrow">
              <span class="modifier">+</span>
              <span class="value bonus">2</span>
            </div>
            {#if unlocked}
            <button
              aria-label="Configure Sanity"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
          </div>
          <div class="ability-score">
            <span>14</span>
          </div>
          <div class="ability-save flexrow">
            <span class="modifier">+</span>
            <span class="value save">4</span>
            <span class="icon"><i class="fas fa-shield-heart"></i></span>
          </div>
        </div>
        <div class="ability honor">
          <div class="bonus-container">
            <span class="label">HON</span>
            <div class="flexrow">
              <span class="modifier">+</span>
              <span class="value bonus">2</span>
            </div>
            {#if unlocked}
            <button
              aria-label="Configure Honor"
              type="button"
              class="button button-borderless button-icon-only button-config">
              <i class="fas fa-cog"></i>
            </button>
          </div>
          <div class="ability-score">
            <span>14</span>
          </div>
          <div class="ability-save flexrow">
            <span class="modifier">+</span>
            <span class="value save">4</span>
            <span class="icon"><i class="fas fa-shield-heart"></i></span>
          </div>
        </div> -->
        <div class="initiative-container flexcol">
          <div class="initiative score">
            <div class="initiative-bonus flexrow">
              <span class="modifier">+</span>
              <span class="value">2</span>
            </div>
            <span class="label">INIT</span>
          </div>
          <div class="concentration">
            <span class="label">Concentrating</span>
            <div class="flexrow">
              <i class="fas fa-head-side-brain"></i>
              <span class="modifier">+</span>
              <span class="value">2</span>
            </div>
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
  <div class={['sidebar', { expanded: sidebarExpanded }]}>sidebar here</div>
  <TabContents tabs={context.tabs} {selectedTabId} />
</div>
