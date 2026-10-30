<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SvelteSet } from 'svelte/reactivity';
  import ActorPortrait from './parts/ActorPortrait.svelte';
  import { getFactionSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getFactionSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let extraTabs = new SvelteSet<string>();
</script>

<header class="sheet-header flexcol">
  <div class="sheet-header-content flexrow">
    <div class="flexcol">
      <div class="flexrow">
        <div class="actor-details-container flexcol">
          <div
            class="actor-details-name-row"
            data-tidy-sheet-part="name-header-row"
          >
            {#if context.unlocked}
              <input
                type="text"
                data-name="name"
                value={context.actor.name}
                class="actor-name flex1 h1"
                data-tidy-sheet-part="actor-name"
                data-tooltip={context.actor.name}
              />
            {:else}
              <h1
                class="actor-name flex1"
                data-tidy-sheet-part="actor-name"
                data-tooltip={context.actor.name}
              >
                <!-- svelte-ignore a11y_missing_attribute -->
                <a
                  data-action="copyInnerText"
                  class="cursor highlight-on-hover"
                  role="button"
                  tabindex="0"
                  aria-label={localize('TIDY5E.COMMON.Action.CopyToClipboard')}
                >
                  {context.actor.name}
                </a>
              </h1>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class="actor-vitals-container">
      <ActorPortrait />
    </div>
  </div>
  <div class="tabs-row">
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
    <TabContents
      tabs={context.tabs}
      {selectedTabId}
      {extraTabs}
      cssClass="tidy-tab-contents"
    />
  </div>
</div>
