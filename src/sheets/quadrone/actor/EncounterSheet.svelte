<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import EncounterSubtitle from './encounter-parts/EncounterSubtitle.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());

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
          <EncounterSubtitle />
        </div>

        {#if context.difficulty.label}
          <div class="difficulty-block">
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
            onclick={() => context.actor.system.rollQuantities()}
          >
            <i class="fas fa-dice-d20"></i>
            {localize('DND5E.QuantityRoll')}
          </button>
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
        </div>
      {/if}
    </div>
    <div class="actor-vitals-container">
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless button-icon-only button-config"
          style="position: absolute; top: 0; right: 0; z-index: 10; border: none; font-size: 14px;"
          onclick={cycleShape}
          data-tooltip={cyclerTooltip}
        >
          {#if currentPortraitShape === 'round'}
            <i class="fas fa-circle-user"></i>
          {:else if currentPortraitShape === 'square'}
            <i class="fas fa-square-user"></i>
          {:else if currentPortraitShape === 'token'}
            <i class="fas fa-circle"></i>
          {:else}
            <i class="fas fa-user"></i>
          {/if}
        </button>
      {/if}
      <!-- TODO: Fix size and shape selection -->
      <div
        class={['actor-image transparent', currentPortraitShape]}
        style="position: relative;"
      >
        <img
          src={context.portrait.src}
          alt={context.actor.name}
          class={['pointer']}
          data-action={context.unlocked ? 'editImage' : 'showArtwork'}
          data-edit={context.portrait.path}
        />
      </div>
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
