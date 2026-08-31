<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import ActorPortrait from './parts/ActorPortrait.svelte';
  import GroupSubtitle from './group-parts/GroupSubtitle.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

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
    <div
      class="actor-details-container flexcol {context.enableXp
        ? 'show-xp'
        : ''}"
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
      <GroupSubtitle />

      {#if context.editable}
        <div
          class={['sheet-header-actions', 'flexrow']}
          data-tidy-sheet-part="sheet-header-actions-container"
        >
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
          <!-- kgar: option 1. It works here, but it forces wrapping in most cases, and it doesn't apply to the whole sheet, so I don't think it fits here. -->
          {#if FoundryAdapter.userIsGm()}
            <button
              type="button"
              class="button long-rest button-gold flexshrink"
              data-action="refreshActor"
              data-type="npc"
              data-tooltip={localize('TIDY5E.RefreshNPC')}
            >
              <i class="fas fa-arrows-rotate-reverse"></i>
              {localize('TIDY5E.RefreshGroupNPCs')}
            </button>
          {/if}
          {#each Object.entries(context.config.restTypes) as [key, rest]}
            <button
              type="button"
              class="button button-gold flexshrink"
              data-action="rest"
              data-type={key}
              disabled={!context.editable}
            >
              <i class={rest.icon}></i>
              {rest.label}
            </button>
          {/each}
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
