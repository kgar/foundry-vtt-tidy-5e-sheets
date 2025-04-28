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

  let hpValueInput = $state<TextInputQuadrone>();

  let hpValue = $derived(context.system.attributes?.hp?.value ?? 0);
  let hpMax = $derived(context.system.attributes?.hp?.max ?? 0);
  let hpPct = $derived(context.system.attributes?.hp?.pct ?? 0);
  let hpTemp = $derived(context.system.attributes?.hp?.temp ?? 0);
  let hpTempMax = $derived(context.system.attributes?.hp?.tempMax ?? 0);
</script>

<header class="sheet-header">
  <div class="character-vitals-container">
    <img class="character-image transparent" src={context.actor.img} />
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
            <div class="value">{hpValue}</div>
            <div class="separator">/</div>
            <div class="max">{hpMax}</div>
          </div>
          <TextInputQuadrone
            bind:this={hpValueInput}
            id="{appId}-system-attributes-hp"
            document={context.actor}
            field="system.attributes.hp.value"
            class="uninput"
            value={hpValue}
            selectOnFocus={true}
            enableDeltaChanges={true}
            onfocus={() => (hpValueInputFocused = true)}
            onblur={() => (hpValueInputFocused = false)}
            blurAfterChange={true}
            hidden={!hpValueInputFocused}
          />
          <button type="button" 
            class="button button-borderless button-icon-only temp-hp"
            >
            <i class="fas fa-hand-holding-heart"></i>
          </button>
        </div>
      </div>
      <div class="hd-row">
        <div class="meter progress hit-die"
          style="--bar-percentage: 100%">
          <div class="label pointer"
            hidden={hpValueInputFocused}
            onclick={async (ev) => {
              hpValueInputFocused = true;
              hpValueInput?.selectText();
            }}>
              <div class="value">{hpValue}</div>
              <div class="separator">/</div>
              <div class="max">{hpMax}</div>
            </div>
            <TextInputQuadrone
              bind:this={hpValueInput}
              id="{appId}-system-attributes-hp"
              document={context.actor}
              field="system.attributes.hp.value"
              class="uninput"
              value={hpValue}
              selectOnFocus={true}
              enableDeltaChanges={true}
              onfocus={() => (hpValueInputFocused = true)}
              onblur={() => (hpValueInputFocused = false)}
              blurAfterChange={true}
              hidden={!hpValueInputFocused}
          />
        </div>
        <div class="exhaustion">
          <button type="button" class="button button-borderless button-icon-only">
            <i class="fas fa-heart-pulse"></i>
          </button>
        </div>
        <div class="death-saves">
          <button type="button" class="button button-borderless button-icon-only">
            <i class="fas fa-skull"></i>
          </button>
        </div>
        <div class="configure-hp">
          <button type="button" class="button button-borderless button-icon-only">
            <i class="fas fa-gear"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  {#if context.unlocked}
    <TextInputQuadrone
      field="name"
      document={context.actor}
      value={context.actor.name}
      class="character-name"
    />
  {:else}
    <h1 class="character-name">{context.actor.name}</h1>
  {/if}
  <CharacterSubtitle />
  <div class="sheet-header-actions">
    <button
      type="button"
      class="button button-tertiary button-icon-only special-traits gold-button"
      data-tooltip="DND5E.SpecialTraits"
      aria-label={localize('DND5E.SpecialTraits')}
      onclick={() =>
        new dnd5e.applications.actor.ActorSheetFlags(context.actor).render(
          true,
        )}
      disabled={!context.editable}
    >
      <!-- TODO: Swap to sheet settings shortcut, also in dropdown -->
      <i class="fas fa-gear"></i>
    </button>
    <button
      type="button"
      class="button button-tertiary button-icon-only short-rest gold-button"
      data-tooltip="DND5E.REST.Short.Label"
      aria-label={localize('DND5E.REST.Short.Label')}
      onclick={(event) => context.actor.sheet.onShortRest(event)}
      disabled={!context.editable}
    >
      <i class="fas fa-utensils"></i>
    </button>
    <button
      type="button"
      class="button button-tertiary button-icon-only long-rest gold-button"
      data-tooltip="DND5E.REST.Long.Label"
      aria-label={localize('DND5E.REST.Long.Label')}
      onclick={(event) => context.actor.sheet.onLongRest(event)}
      disabled={!context.editable}
    >
      <i class="fas fa-campground"></i>
    </button>
  </div>
  <div class="level-block"></div>
  <div class="abilities-container">
    <div class="ac-container">
      <div class="shield">
        <span>14</span>
      </div>
    </div>
    <div class="ability strength">
      <div class="bonus">
        <span class="label">STR</span>
        <span class="modifier">+</span>
        <span class="value">2</span>
      </div>
      <div class="ability-score">
        <span>14</span>
      </div>
      <div class="ability-save">
        <span class="modifier">+</span>
        <span class="value">4</span>
      </div>
    </div>
    <div class="ability dexterity">
      <div class="bonus">
        <span class="label">DEX</span>
        <span class="modifier">+</span>
        <span class="value">2</span>
      </div>
      <div class="ability-score">
        <span>14</span>
      </div>
      <div class="ability-save">
        <span class="modifier">+</span>
        <span class="value">4</span>
      </div>
    </div>
    <div class="ability constitution">
      <div class="bonus">
        <span class="label">CON</span>
        <span class="modifier">+</span>
        <span class="value">2</span>
      </div>
      <div class="ability-score">
        <span>14</span>
      </div>
      <div class="ability-save">
        <span class="modifier">+</span>
        <span class="value">4</span>
      </div>
    </div>
    <div class="ability intelligence">
      <div class="bonus">
        <span class="label">INT</span>
        <span class="modifier">+</span>
        <span class="value">2</span>
      </div>
      <div class="ability-score">
        <span>14</span>
      </div>
      <div class="ability-save">
        <span class="modifier">+</span>
        <span class="value">4</span>
      </div>
    </div>
    <div class="ability wisdom">
      <div class="bonus">
        <span class="label">WIS</span>
        <span class="modifier">+</span>
        <span class="value">2</span>
      </div>
      <div class="ability-score">
        <span>14</span>
      </div>
      <div class="ability-save">
        <span class="modifier">+</span>
        <span class="value">4</span>
      </div>
    </div>
    <div class="ability charisma">
      <div class="bonus">
        <span class="label">CHA</span>
        <span class="modifier">+</span>
        <span class="value">2</span>
      </div>
      <div class="ability-score">
        <span>14</span>
      </div>
      <div class="ability-save">
        <span class="modifier">+</span>
        <span class="value">4</span>
      </div>
    </div>
    <div class="initiative">
      <div class="score">
        <span class="label">INIT</span>
        <span class="modifier">+</span>
        <span class="value">2</span>
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
