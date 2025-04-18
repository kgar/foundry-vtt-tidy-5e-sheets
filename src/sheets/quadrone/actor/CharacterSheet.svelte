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
    <img class="character-image" src={context.actor.img} />
    <div class="character-vitals">
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
      </div>
      Row: Hit Dice Bar, Exhaustion Tracker, Death Saves Toggle, Config button (?)<br
      />
      Row: (If toggled on) Death Saves Tracker<br />
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
    <div class="character-name">{context.actor.name}</div>
  {/if}
  <CharacterSubtitle />
  <div class="sheet-header-actions">
    <button
      type="button"
      class="special-traits gold-button"
      data-tooltip="DND5E.SpecialTraits"
      aria-label={localize('DND5E.SpecialTraits')}
      onclick={() =>
        new dnd5e.applications.actor.ActorSheetFlags(context.actor).render(
          true,
        )}
      disabled={!context.editable}
    >
      <i class="fas fa-star"></i>
    </button>
    <button
      type="button"
      class="short-rest gold-button"
      data-tooltip="DND5E.REST.Short.Label"
      aria-label={localize('DND5E.REST.Short.Label')}
      onclick={(event) => context.actor.sheet.onShortRest(event)}
      disabled={!context.editable}
    >
      <i class="fas fa-utensils"></i>
    </button>
    <button
      type="button"
      class="long-rest gold-button"
      data-tooltip="DND5E.REST.Long.Label"
      aria-label={localize('DND5E.REST.Long.Label')}
      onclick={(event) => context.actor.sheet.onLongRest(event)}
      disabled={!context.editable}
    >
      <i class="fas fa-campground"></i>
    </button>
  </div>
  <div class="level-block"></div>
  <div class="abilities-container">AC, Abilities, Init, Concentration</div>
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
