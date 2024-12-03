<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import ActorProfile from '../actor/ActorProfile.svelte';
  import ActorMovement from '../actor/ActorMovement.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import GroupHitPoints from './parts/GroupHitPoints.svelte';
  import InfoCardV2 from 'src/components/item-info-card/InfoCardV2.svelte';

  const context = getContext<Readable<GroupSheetClassicContext>>('context');

  const localize = FoundryAdapter.localize;

  let selectedTabId = $state($context.tabs[0].id);
</script>

<InfoCardV2
  sheet={$context.actor.sheet}
  floating={$settingStore.itemCardsAreFloating}
  delay={$settingStore.itemCardsDelay}
  fixKey={$settingStore.itemCardsFixKey}
/>

<header class="tidy5e-sheet-header flex-row">
  <div class="flex-0">
    <ActorProfile useHpOverlay={false} size="small">
      {#if $context.canObserveAll}
        <GroupHitPoints
          actor={$context.actor}
          value={$context.currentHP}
          max={$context.maxHP}
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
          document={$context.actor}
          editable={$context.unlocked}
          disabled={!$context.unlocked}
          spellcheck={false}
          placeholder={localize('TIDY5E.Group.NamePlaceholder')}
          value={$context.actor.name}
          field="name"
        />
      </div>

      <!-- Any other content adjacent to Actor Name -->
    </div>
    <div
      class="flex-row align-items-center header-line-margin"
      style="margin-top: 0;"
    >
      <span class="flex-1 fs-sm text-body-secondary">{$context.summary}</span>
      {#if $context.unlocked}
        <Select
          document={$context.actor}
          value={$context.system.type.value}
          field="system.type.value"
          blankValue=""
          class="flex-grow-0 flex-shrink-0 flex-basis-max-content"
        >
          <SelectOptions
            data={$context.config.groupTypes}
            blank={localize('DND5E.Group.TypeGeneric')}
          />
        </Select>
      {:else}
        <span class="semibold">
          {$context.config.groupTypes[$context.system.type.value] ??
            localize('DND5E.Group.TypeGeneric')}
        </span>
      {/if}
    </div>
    <HorizontalLineSeparator class="header-line-margin-left" />
    <div
      class="flex-row header-line-margin justify-content-space-between align-items-center"
    >
      <ActorMovement movementLabelKey="DND5E.Movement" />
      {#if !$context.disableExperience}
        {#if $context.unlocked}
          <div class="flex-row align-items-center no-gap">
            <TextInput
              document={$context.actor}
              field="system.details.xp.value"
              value={$context.system.details.xp.value}
              placeholder={$context.system.details.xp.derived?.toString() ??
                '0'}
              class="group-xp-input fs-sm"
              saveEmptyAsNull={true}
            />
            <span class="fs-sm semibold"
              >{localize('DND5E.ExperiencePointsAbbr')}</span
            >
          </div>
        {:else}
          <strong class="fs-sm semibold">
            {localize('DND5E.ExperiencePointsFormat', {
              value:
                $context.system.details.xp.value ??
                $context.system.details.xp.derived ??
                '0',
            })}
          </strong>
        {/if}
      {/if}
    </div>
    <HorizontalLineSeparator class="header-line-margin-left" />
    {#if $context.isGM}
      <div class="group-commands">
        <button
          type="button"
          class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
          onclick={() => $context.actor.sheet.award()}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fa-solid fa-trophy"></i>
          {localize('DND5E.Award.Action')}
        </button>
        <button
          type="button"
          class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
          onclick={() => $context.actor.system.placeMembers()}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fa-solid fa-location-dot"></i>
          {localize('DND5E.Group.PlaceMembers')}
        </button>
        <button
          type="button"
          class="group-action-button flex-row small-gap rest-button flex-grow-0 flex-basis-max-content"
          onclick={() => $context.actor.shortRest({ advanceTime: true })}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fa-solid fa-utensils"></i>
          {localize('DND5E.ShortRest')}
        </button>
        <button
          type="button"
          class="group-action-button flex-row small-gap rest-button flex-grow-0 flex-basis-max-content"
          onclick={() => $context.actor.longRest({ advanceTime: true })}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fa-solid fa-campground"></i>
          {localize('DND5E.LongRest')}
        </button>
      </div>
    {/if}
  </div>
</header>

<Tabs tabs={$context.tabs} bind:selectedTabId />

<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>
