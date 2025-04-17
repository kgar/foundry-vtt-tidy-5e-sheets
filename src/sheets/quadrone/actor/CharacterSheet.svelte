<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $state('');

  let sidebarExpanded = $state(false);

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
        data-bar-severity="health"
        style="--bar-percentage: {hpPct.toFixed(0)}%"
      >
        <label for=""></label>
      </div>
      Row: Hit Dice Bar, Exhaustion Tracker, Death Saves Toggle, Config button (?)<br
      />
      Row: (If toggled on) Death Saves Tracker<br />
    </div>
  </div>
  <div class="character-profile">
    <div class="character-name">Character name here</div>
    <div class="character-summary">
      Main movement, size, species, classes (level, main stat, DC)
    </div>
  </div>
  <div class="sheet-header-actions">Sheet header buttons</div>
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
