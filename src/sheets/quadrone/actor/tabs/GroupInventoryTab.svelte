<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import InventoryActionBar from '../../shared/InventoryActionBar.svelte';
  import ContainerPanel from '../../shared/ContainerPanel.svelte';
  import InventoryTables from '../../shared/InventoryTables.svelte';
  import ActorEncumbranceBar from '../parts/ActorEncumbranceBar.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let inventory = $derived(
    SheetSections.configureInventory(
      context.inventory,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: inventory,
      tabId: tabId,
    });
  });
</script>


<aside class="sidebar">
  {#each [
    ...context.members.character.members,
    ...context.members.npc.members,
    ...context.members.vehicle.members,
  ] as member}
    {@const actorIsDead = 
      member.actor.system.attributes?.hp?.value === 0 &&
      member.actor.system.attributes?.hp?.max > 0 &&
      (member.actor.system.attributes.death === undefined ||
        (member.actor.system.attributes.death.failure >= 3 &&
          member.actor.system.attributes.death.success < 3))}
    {@const portraitShape = ThemeQuadrone.getActorPortraitShape(member.actor)}
    <div
      aria-label={member.actor.name}
      class="actor-container flexrow"
      role="button"
      tabindex={0}
      onclick={() => member.actor.sheet.render(true)}
      onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? member.actor.sheet.render(true) : null}
    >
      <div class="member-vitals-container flexshrink">
        <div
          class={['actor-image', { dead: actorIsDead }, portraitShape, { video: member.portrait.isVideo }]}
          style="position: relative;"
        >
          {#if member.portrait.isVideo}
            <video
              src={member.portrait.src}
              autoplay
              muted
              playsinline
              disablepictureinpicture
              loop
              class={{ dead: actorIsDead }}
            ></video>
          {:else}
            <img
              src={member.portrait.src}
              alt={member.actor.name}
              class={{ dead: actorIsDead }}
            />
          {/if}
          {#if actorIsDead}
            <div class="dead-overlay"></div>
          {/if}
        </div>
      </div>
      <div class="flexcol actor-name">
        <h4 class="font-label-medium color-text-default">
          {member.actor.name}
        </h4>
        {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER || member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
        <span class="flexrow actor-currency">
          <span class="font-label-medium color-text-default flexshrink">100</span>
          <span class="font-body-medium color-text-gold flexshrink">GP</span>
        </span>
          <!-- TODO: Add encumbrance bar -->
          <!-- <ActorEncumbranceBar /> -->
           <div class="meter progress encumbrance theme-dark medium" aria-valuemin="0" data-tooltip-direction="UP"  aria-valuenow="59.45833333333333" aria-valuetext="142.7" aria-valuemax="240" style="--bar-percentage: 59%; --encumbrance-low: 33.333333333333336%; --encumbrance-high: 66.66666666666667%;"><div class="label"><i class="fas fa-weight-hanging text-label-icon"></i> <span class="value font-weight-label">142.7</span> <span class="separator">/</span> <span class="max color-text-default">240</span></div> <i class="breakpoint encumbrance-low arrow-up" role="presentation"></i> <i class="breakpoint encumbrance-low arrow-down" role="presentation"></i> <i class="breakpoint encumbrance-high arrow-up" role="presentation"></i> <i class="breakpoint encumbrance-high arrow-down" role="presentation"></i></div>
        {:else if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
          <p></p>
        {/if}
      </div>
    </div>
  {/each} 
</aside>
<div class="groups-tab-content inventory-content">
  <InventoryActionBar bind:searchCriteria sections={inventory} {tabId} />

  {#if context.showContainerPanel && !!context.containerPanelItems.length}
    <ContainerPanel
      {searchCriteria}
      containerPanelItems={context.containerPanelItems}
    />
  {/if}

  <InventoryTables
    sections={inventory}
    editable={context.editable}
    itemContext={context.itemContext}
    {inlineToggleService}
    {searchCriteria}
    sheetDocument={context.actor}
    root={true}
  />
</div>
