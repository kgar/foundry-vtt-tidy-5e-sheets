<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ActorProfile from '../actor/ActorProfile.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { getEncounterSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import { onMount } from 'svelte';

  const context = $derived(getEncounterSheetClassicContext());

  const localize = FoundryAdapter.localize;

  let selectedTabId = $state<string>('');

  onMount(() => {
    selectedTabId = context.tabs[0]?.id ?? '';
  });
</script>

<header class="tidy5e-sheet-header flex-row">
  <div class="flex-0">
    <ActorProfile useHpOverlay={false} size="small"></ActorProfile>
  </div>
  <div class="flex-grow-1">
    <div
      class="flex-row justify-content-space-between align-items-center small-gap"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_HEADER_ROW}
    >
      <div
        class="actor-name"
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
      >
        <TextInput
          document={context.actor}
          editable={context.unlocked}
          disabled={!context.unlocked}
          spellcheck={false}
          value={context.actor.name}
          field="name"
        />
      </div>

      <!-- Any other content adjacent to Actor Name -->
    </div>
    <div
      class="flex-row align-items-center header-line-margin"
      style="margin-top: 0;"
    >
      <span class="flex-1 fs-sm text-body-secondary">{context.summary}</span>
    </div>
    {#if !context.disableExperience}
      <HorizontalLineSeparator class="header-line-margin-left" />
      <div
        class="flex-row header-line-margin justify-content-space-between align-items-center"
      >
        <strong class="fs-sm semibold">
          {localize('DND5E.ExperiencePoints.Format', {
            value: context.xp ?? '0',
          })}
        </strong>
      </div>
    {/if}
    <HorizontalLineSeparator class="header-line-margin-left" />
    {#if context.isGM}
      <div class="group-commands">
        <button
          type="button"
          class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
          onclick={() => context.actor.system.rollQuantities()}
        >
          <i class="fa-solid fa-dice-d20"></i>
          {localize('DND5E.QuantityRoll')}
        </button>
        <button
          type="button"
          class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
          onclick={() => context.actor.sheet.award()}
        >
          <i class="fa-solid fa-trophy"></i>
          {localize('DND5E.Award.Action')}
        </button>
        <button
          type="button"
          class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
          onclick={() => context.actor.system.placeMembers()}
        >
          <i class="fa-solid fa-location-dot"></i>
          {localize('DND5E.Group.PlaceMembers')}
        </button>
      </div>
    {/if}
  </div>
</header>

<Tabs tabs={context.tabs} bind:selectedTabId sheet={context.actor.sheet} />

<section class="tidy-sheet-body">
  <TabContents tabs={context.tabs} {selectedTabId} />
</section>
