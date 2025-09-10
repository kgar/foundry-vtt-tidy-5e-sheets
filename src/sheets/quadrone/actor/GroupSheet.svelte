<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import ActorPortrait from './parts/ActorPortrait.svelte';
  import GroupSubtitle from './group-parts/GroupSubtitle.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let extraTabs = new SvelteSet<string>();

  let currentPortraitShape = $derived(context.portrait.shape);

  const availableShapes = ThemeQuadrone.getActorPortraitShapes();

  function cycleShape() {
    const currentIndex = availableShapes.indexOf(currentPortraitShape);
    const nextIndex = (currentIndex + 1) % availableShapes.length;
    let newShape = availableShapes[nextIndex];

    ThemeQuadrone.updatePortraitShape(context.actor, newShape);
  }

  let cyclerTooltip = $derived(
    localize('TIDY5E.ThemeSettings.PortraitShape.title', {
      type: localize(
        `TIDY5E.ThemeSettings.PortraitShape.option.${currentPortraitShape}`,
      ),
    }),
  );

  let awardAriaLabel = $derived(
    localize(
      context.enableXp
        ? 'DND5E.Group.Distribute.xp'
        : 'DND5E.Group.Distribute.noxp',
    ),
  );
</script>

<header class="sheet-header flexcol theme-dark">
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
          <TextInputQuadrone
            field="name"
            document={context.actor}
            value={context.actor.name}
            class="actor-name flex1 h1"
            data-tidy-sheet-part="actor-name"
          />
        {:else}
          <h1 class="actor-name flex1" data-tidy-sheet-part="actor-name">
            {context.actor.name}
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
            onclick={() => context.actor.system.placeMembers()}
          >
            <i class="fas fa-street-view"></i>
            {localize('DND5E.Group.PlaceMembers')}
          </button>
          <button
            aria-label={awardAriaLabel}
            type="button"
            class="button long-rest button-gold flexshrink"
            data-tooltip={awardAriaLabel}
            onclick={() => context.sheet.award()}
          >
            <i class="fas fa-trophy"></i>
            {localize('DND5E.Award.Title')}
          </button>
          <button
            type="button"
            class="button short-rest button-gold flexshrink"
            data-tooltip="DND5E.REST.Short.Label"
            aria-label={localize('DND5E.REST.Short.Label')}
            onclick={() => context.sheet.shortRest()}
          >
            <i class="fas fa-utensils"></i>
            {localize('DND5E.REST.Short.Label')}
          </button>
          <button
            type="button"
            class="button long-rest button-gold flexshrink"
            data-tooltip="DND5E.REST.Long.Label"
            aria-label={localize('DND5E.REST.Long.Label')}
            onclick={() => context.actor.longRest()}
          >
            <i class="fas fa-campground"></i>
            {localize('DND5E.REST.Long.Label')}
          </button>
        </div>
      {/if}
    </div>
    <div class="actor-vitals-container">
      <ActorPortrait/>
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
