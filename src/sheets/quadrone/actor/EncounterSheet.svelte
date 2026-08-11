<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import EncounterSubtitle from './encounter-parts/EncounterSubtitle.svelte';
  import ActorPortrait from './parts/ActorPortrait.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let extraTabs = new SvelteSet<string>();

  let awardAriaLabel = $derived(
    localize(
      context.enableXp
        ? 'DND5E.Group.Distribute.xp'
        : 'DND5E.Group.Distribute.noxp',
    ),
  );
</script>

<header class="sheet-header flexcol">
  <div class="sheet-header-content flexrow">
    <div class="flexcol">
      <div class="flexrow">
        <div
          class={[
            'actor-details-container flexcol',
            { 'show-xp': context.enableXp },
          ]}
        >
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
                <a data-action="copyInnerText" class="cursor highlight-on-hover">
                  {context.actor.name}
                </a>
              </h1>
            {/if}
          </div>
          <EncounterSubtitle />
        </div>

        {#if context.difficulty.label}
          <div
            class={[
              'difficulty-block',
              context.themeSettings.useHeaderBackground ? 'theme-dark' : '',
            ]}
          >
            <span class="label difficulty font-label-medium color-text-default">
              {context.difficulty.label}
            </span>
          </div>
        {/if}
      </div>

      {#if context.editable}
        <div
          class={['sheet-header-actions', 'flexrow']}
          data-tidy-sheet-part="sheet-header-actions-container"
        >
          <button
            type="button"
            class="button long-rest button-gold flexshrink"
            data-tooltip="DND5E.QuantityRoll"
            aria-label={localize('DND5E.QuantityRoll')}
            data-action="rollQuantities"
          >
            <i class="fas fa-dice-d20"></i>
            {localize('DND5E.QuantityRoll')}
          </button>
          <button
            type="button"
            class="button long-rest button-gold flexshrink"
            data-tooltip="DND5E.Group.PlaceMembers"
            aria-label={localize('DND5E.Group.PlaceMembers')}
            data-action="placeMembers"
          >
            <i class="fas fa-street-view"></i>
            {localize('DND5E.Group.PlaceMembers')}
          </button>
          <button
            aria-label={awardAriaLabel}
            type="button"
            class="button long-rest button-gold flexshrink"
            data-tooltip
            data-action="award"
          >
            <i class="fas fa-trophy"></i>
            {localize('DND5E.Award.Title')}
          </button>
        </div>
      {/if}
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
