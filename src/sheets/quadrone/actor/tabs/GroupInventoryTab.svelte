<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import ActorEncumbranceBar from '../parts/ActorEncumbranceBar.svelte';
  import ActorInventoryFooter from '../parts/ActorInventoryFooter.svelte';

  let context = $derived(getGroupSheetQuadroneContext());
  let localize = FoundryAdapter.localize;

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

  let hoveredMember = $state<string | null>(null);
</script>

<aside class="sidebar">
  {#each [...context.members.character.members, ...context.members.npc.members, ...context.members.vehicle.members] as member}
    {@const actorIsDead =
      member.actor.system.attributes?.hp?.value === 0 &&
      member.actor.system.attributes?.hp?.max > 0 &&
      (member.actor.system.attributes.death === undefined ||
        (member.actor.system.attributes.death.failure >= 3 &&
          member.actor.system.attributes.death.success < 3))}

    {@const portraitShape = ThemeQuadrone.getActorPortraitShape(member.actor)}

    <div
      class="actor-container flexrow"
      style:--t5e-theme-color-default={member.accentColor}
      style:--t5e-theme-color-highlight={member.highlightColor}
      style:--t5e-member-color-hover={member.highlightColor}
      role="button"
      tabindex={0}
      onclick={() => member.actor.sheet.render(true)}
      onkeydown={(e) =>
        e.key === 'Enter' || e.key === ' '
          ? member.actor.sheet.render(true)
          : null}
      onmouseenter={() => (hoveredMember = member.actor.uuid)}
      onmouseleave={() => (hoveredMember = null)}
      data-uuid={member.actor.uuid}
    >
      <div class={['actor-image-container flexshrink']}>
        <div
          class={[
            'actor-image',
            { hovered: hoveredMember === member.actor.uuid },
            { dead: actorIsDead },
            portraitShape,
            { video: member.portrait.isVideo },
          ]}
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
      <div class="actor-name flexcol">
        <h4 class="font-label-medium">
          {member.actor.name}
        </h4>
        {#if member.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER || member.actor.type === CONSTANTS.SHEET_TYPE_NPC}
          <!-- TODO: Add currency -->
          <div class="separated-list">
            <span class="actor-currency">
              <span class="font-label-medium color-text-default flexshrink"
                >{member.gold}</span
              >
              <span class="font-body-medium color-text-lighter flexshrink"
                >{member.goldAbbreviation}</span
              >
            </span>
          </div>
          <ActorEncumbranceBar actor={member.actor} />
        {:else if member.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE}
        <div class="separated-list">
          <span class="actor-cargo separated-list">
            <span class="font-body-medium color-text-lighter"
              >{localize('DND5E.VehicleCargo')}</span
            >
            <span class="font-label-medium color-text-default"
              >{member.encumbrance.value.toNearest(0.01)}</span
            >
            <span class="font-body-medium color-text-lightest">/</span>
            <span class="font-label-medium color-text-lighter"
              >{member.encumbrance.max}</span
            >
          </span>
        </div>
        {/if}
      </div>
    </div>
  {/each}
</aside>
<div class="groups-tab-content flexcol">
  <div class="inventory-content">
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

  <ActorInventoryFooter useAttunement={false} />
</div>
