<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import ActorProfile from '../actor/ActorProfile.svelte';
  import ActorMovement from '../actor/ActorMovement.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import GroupHitPoints from './parts/GroupHitPoints.svelte';
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import { onMount } from 'svelte';

  const context = $derived(getGroupSheetClassicContext());

  const localize = FoundryAdapter.localize;

  let selectedTabId = $state<string>('');

  onMount(() => {
    selectedTabId = context.tabs[0]?.id ?? '';
  });
</script>

<header class="tidy5e-sheet-header flex-row">
  <div class="flex-0">
    <ActorProfile useHpOverlay={false} size="small">
      {#if context.canObserveAll}
        <GroupHitPoints
          actor={context.actor}
          value={context.currentHP}
          max={context.maxHP}
        />
      {/if}
    </ActorProfile>
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
          placeholder={localize('TIDY5E.Group.NamePlaceholder')}
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
    <HorizontalLineSeparator class="header-line-margin-left" />
    <div
      class="flex-row header-line-margin justify-content-space-between align-items-center"
    >
      <ActorMovement movementLabelKey="DND5E.Movement" />
      {#if !context.disableExperience}
        {#if context.unlocked}
          <div class="flex-row align-items-center no-gap">
            <TextInput
              document={context.actor}
              field="system.details.xp.value"
              value={context.system.details.xp.value}
              placeholder={context.system.details.xp.derived?.toString() ?? '0'}
              class="group-xp-input fs-sm"
              saveEmptyAsNull={true}
            />
            <span class="fs-sm semibold"
              >{localize('DND5E.ExperiencePoints.Abbreviation')}</span
            >
          </div>
        {:else}
          <strong class="fs-sm semibold">
            {localize('DND5E.ExperiencePoints.Format', {
              value:
                context.system.details.xp.value ??
                context.system.details.xp.derived ??
                '0',
            })}
          </strong>
        {/if}
      {/if}
    </div>
    <HorizontalLineSeparator class="header-line-margin-left" />
    {#if context.isGM}
      <div class="group-commands">
        <button
          type="button"
          class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
          onclick={() => context.actor.sheet.award()}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fa-solid fa-trophy"></i>
          {localize('DND5E.Award.Action')}
        </button>
        <button
          type="button"
          class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
          onclick={() => context.actor.system.placeMembers()}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fa-solid fa-location-dot"></i>
          {localize('DND5E.Group.PlaceMembers')}
        </button>
        <button
          type="button"
          class="group-action-button flex-row small-gap rest-button flex-grow-0 flex-basis-max-content"
          onclick={() => context.actor.shortRest({ advanceTime: true })}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fa-solid fa-utensils"></i>
          {localize('DND5E.REST.Short.Label')}
        </button>
        <button
          type="button"
          class="group-action-button flex-row small-gap rest-button flex-grow-0 flex-basis-max-content"
          onclick={() => context.actor.longRest({ advanceTime: true })}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fa-solid fa-campground"></i>
          {localize('DND5E.REST.Long.Label')}
        </button>
      </div>
    {/if}
  </div>
</header>

<Tabs tabs={context.tabs} bind:selectedTabId sheet={context.actor.sheet} />

<section class="tidy-sheet-body">
  <TabContents tabs={context.tabs} {selectedTabId} />
</section>
